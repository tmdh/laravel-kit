import Vue from "vue";
import { store } from "@/lib/store.js";
import App from "@/App.vue";
import "@/lib/menu.js";
import { ipcRenderer, remote, shell } from "electron";
import "@/styles.css";
import bus from "@/lib/bus.js";
import { createLicenseManager } from "@/lib/gumroad.js";
import fixPath from "@/lib/fix-path.js";
const { dialog } = remote;

fixPath();

Vue.config.errorHandler = function (err) {
  console.error(err);
};
Vue.config.productionTip = false;

const app = new Vue({
  store,
  render: function (h) {
    return h(App);
  },
  mounted() {
    bus.$on("openDialog", () => {
      this.$store.dispatch("openDialog");
    });
    bus.$on("reloadProject", () => {
      this.$store.dispatch("openProject", { dir: this.$store.state.dir, reload: true });
    });
    bus.$on("closeProject", () => {
      this.$store.dispatch("closeProject");
    });
    this.$store.commit("getRecents");
    bus.$on("clearRecents", () => {
      this.$store.commit("clearRecents");
    });
    bus.$on("openProject", (dir) => {
      this.$store.dispatch("openProject", { dir: dir, reload: true });
    });
    this.$store.commit("updateSettingsState");
    createLicenseManager("laravel-kit", {
      maxUses: 10,
      maxDaysBetweenChecks: 30
    })
      .checkCurrentLicense()
      .then((response) => {
        if (response.status == 0) {
          this.$store.state.licensed = true;
        } else {
          dialog
            .showMessageBox({
              type: "info",
              title: "Thanks",
              message: "Hello, Thanks for trying out Laravel Kit.\r\nSupport the development of this project by buying a license.",
              buttons: ["Later", "Sure"]
            })
            .then((result) => {
              if (result.response == 1) {
                shell.openExternal("https://gum.co/laravel-kit");
              }
            });
        }
      });
  }
}).$mount("#app");

ipcRenderer.on("app-close", () => {
  if (app.$store.state.serve != null) {
    ipcRenderer.send("stopServe", app.$store.state.serve.pid);
  }
});
