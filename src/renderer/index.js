import Vue from "vue";
import { store } from "@/lib/store";
import App from "@/App";
import "@/lib/menu";
import { ipcRenderer, remote, shell } from "electron";
import "@/styles";
import bus from "@/lib/bus";
import { createLicenseManager } from "@/lib/gumroad";
const { dialog } = remote;

Vue.config.errorHandler = function (err) {
  console.error(err);
};
Vue.config.productionTip = false;

const app = new Vue({
  store,
  render: function (h) {
    return h(App);
  },
  beforeCreate() {
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
              message: "Hello, Thanks for trying out Laravel Kit. Support the development of this project by buying a license.",
              buttons: ["Sure", "Later"]
            })
            .then((result) => {
              if (result.response == 0) {
                shell.openExternal("https://gum.co/laravel-kit");
              }
            });
        }
      });
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
  }
}).$mount("#app");

ipcRenderer.on("app-close", () => {
  if (app.$store.state.serve != null) {
    ipcRenderer.send("stopServe", app.$store.state.serve.pid);
  }
});
