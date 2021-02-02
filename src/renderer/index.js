import Vue from "vue";
import { store } from "./store";
import App from "@/App.vue";
import menu from "./menu";
import { ipcRenderer, remote } from "electron";
const { Menu } = remote;
import "./styles.css";

Vue.config.errorHandler = function(err) {
  console.error(err);
};
Vue.config.productionTip = false;

const app = new Vue({
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");

Menu.setApplicationMenu(menu);

ipcRenderer.on("app-close", () => {
  if (app.$store.state.serve != null) {
    ipcRenderer.send("stopServe", app.$store.state.serve.pid);
  }
});
