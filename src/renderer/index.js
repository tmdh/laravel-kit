import Vue from "vue";
import { store } from "@/lib/store";
import App from "@/App";
import "@/lib/menu";
import { ipcRenderer } from "electron";
import "@/styles";
import bus from "@/lib/bus";

Vue.config.errorHandler = function(err) {
  console.error(err);
};
Vue.config.productionTip = false;

const app = new Vue({
  store,
  render: function(h) {
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
    bus.$on("openProject", dir => {
      this.$store.dispatch("openProject", { dir: dir, reload: true });
    });
  }
}).$mount("#app");

ipcRenderer.on("app-close", () => {
  if (app.$store.state.serve != null) {
    ipcRenderer.send("stopServe", app.$store.state.serve.pid);
  }
});
