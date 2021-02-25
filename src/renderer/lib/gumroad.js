import Store from "electron-store";
import axios from "axios";
import { machineIdSync } from "node-machine-id";
const API_URL = "https://api.gumroad.com/v2/licenses/verify";
export var CheckStatus;
(function (CheckStatus) {
  CheckStatus[(CheckStatus["ValidLicense"] = 0)] = "ValidLicense";
  CheckStatus[(CheckStatus["InvalidLicense"] = 1)] = "InvalidLicense";
  CheckStatus[(CheckStatus["OutdatedLicense"] = 2)] = "OutdatedLicense";
  CheckStatus[(CheckStatus["NotSet"] = 3)] = "NotSet";
  CheckStatus[(CheckStatus["UnableToCheck"] = 4)] = "UnableToCheck";
})(CheckStatus || (CheckStatus = {}));
export var ErrorType;
(function (ErrorType) {
  ErrorType[(ErrorType["ServerUnavailable"] = 0)] = "ServerUnavailable";
  ErrorType[(ErrorType["ActivationError"] = 1)] = "ActivationError";
  ErrorType[(ErrorType["MaxUseExceeded"] = 2)] = "MaxUseExceeded";
  ErrorType[(ErrorType["LicenseRefunded"] = 3)] = "LicenseRefunded";
  ErrorType[(ErrorType["UnknownError"] = 4)] = "UnknownError";
  ErrorType[(ErrorType["SubscriptionEnded"] = 5)] = "SubscriptionEnded";
})(ErrorType || (ErrorType = {}));
/**
 * Creates a new license manager for your product.
 *
 * @param productId your product ID as specified by Gumroad
 */
export const createLicenseManager = (productId, options) => {
  const encryptionKey = productId + machineIdSync();
  const userStore = new Store({
    name: "license",
    fileExtension: "key",
    encryptionKey: !(options === null || options === void 0 ? void 0 : options.disableEncryption) ? encryptionKey : undefined,
    clearInvalidConfig: true
  });
  /**
   * Validates a given license key against Gumroad's API and increases the use
   * count if specified.
   *
   * @param licenseKey the given license key
   * @param increaseUseCount increases the use count if true
   */
  const validateLicenseCode = async (licenseKey, increaseUseCount = false) => {
    var _a;
    let result;
    try {
      result = await axios.post(
        (_a = options === null || options === void 0 ? void 0 : options.gumroadApiUrl) !== null && _a !== void 0 ? _a : API_URL,
        {
          product_permalink: productId,
          license_key: licenseKey.trim(),
          increment_uses_count: increaseUseCount
        },
        {
          validateStatus: (status) => status < 500
        }
      );
    } catch (e) {
      return { status: CheckStatus.UnableToCheck };
    }
    result = result.data;
    if (!result.success) {
      return {
        status: CheckStatus.InvalidLicense,
        error: {
          type: ErrorType.ActivationError,
          message: result.message || "License check failed without an error message."
        }
      };
    }
    // Check whether the purchase has been refunded or chargebacked
    if (!result.purchase || result.purchase.refunded || result.purchase.chargebacked) {
      return {
        status: CheckStatus.InvalidLicense,
        error: {
          type: ErrorType.LicenseRefunded,
          message: "Your purchase has been refunded, so your license is no longer valid."
        }
      };
    }
    if (result.subscription_ended_at != null) {
      return {
        status: CheckStatus.InvalidLicense,
        error: {
          type: ErrorType.SubscriptionEnded,
          message: `Your subscription has ended in ${Date.toString(result.subscription_ended_at)}.`
        }
      };
    }
    return {
      status: CheckStatus.ValidLicense,
      response: result
    };
  };
  /**
   * Validates a new license key against Gumroad's API and stores it locally if
   * it is valid. This increases the use counter for the license.
   *
   * @param licenseKey the license key to check against
   */
  const addLicense = async (licenseKey) => {
    if (typeof (options === null || options === void 0 ? void 0 : options.maxUses) !== "undefined") {
      const result = await validateLicenseCode(licenseKey);
      if (result.status === CheckStatus.ValidLicense && result.response.uses >= (options === null || options === void 0 ? void 0 : options.maxUses)) {
        return {
          success: false,
          error: {
            type: ErrorType.MaxUseExceeded,
            message: `You have reached the limit of ${options.maxUses} activations.`
          }
        };
      }
    }
    const result = await validateLicenseCode(licenseKey, true);
    if (result.status === CheckStatus.UnableToCheck) {
      return {
        success: false,
        error: {
          type: ErrorType.ServerUnavailable,
          message: "Could not reach the Gumroad license servers."
        }
      };
    }
    if (result.status === CheckStatus.InvalidLicense) {
      return { success: false, error: result.error };
    }
    userStore.set("licenseKey", licenseKey);
    userStore.set("lastCheckAttempt", Date.now());
    userStore.set("lastCheckSuccess", Date.now());
    return { success: true, response: result.response };
  };
  /**
   * Checks the locally stored license. If Gumroad's API can be reached, the
   * license is validated again. Otherwise, the locally stored license is used.
   */
  const checkCurrentLicense = async () => {
    const key = userStore.get("licenseKey");
    if (!key) {
      return { status: CheckStatus.NotSet };
    }
    userStore.set("lastCheckAttempt", Date.now());
    const result = await validateLicenseCode(key);
    switch (result.status) {
      case CheckStatus.ValidLicense:
        userStore.set("lastCheckSuccess", Date.now());
        userStore.set("purchase", result.response.purchase);
        return {
          status: CheckStatus.ValidLicense,
          purchase: result.response.purchase
        };
      case CheckStatus.UnableToCheck: {
        const storedPurchase = userStore.get("purchase");
        const lastCheckSuccess = userStore.get("lastCheckSuccess");
        if ((options === null || options === void 0 ? void 0 : options.maxDaysBetweenChecks) && (!lastCheckSuccess || Date.now() - lastCheckSuccess > 86400000 * options.maxDaysBetweenChecks)) {
          return { status: CheckStatus.OutdatedLicense };
        }
        return storedPurchase
          ? {
              status: CheckStatus.ValidLicense,
              purchase: storedPurchase
            }
          : { status: CheckStatus.InvalidLicense };
      }
      case CheckStatus.InvalidLicense:
        userStore.delete("purchase");
        return { status: CheckStatus.InvalidLicense };
    }
  };
  /**
   * Clears the stored license.
   */
  const clearLicense = () => {
    userStore.clear();
  };
  return { checkCurrentLicense, addLicense, validateLicenseCode, clearLicense };
};
