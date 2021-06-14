import Vue from "vue";
import { store } from "@/lib/store.js";
import App from "@/App.vue";
// import "@/lib/menu.js";
import "@/styles.css";
// import bus from "@/lib/bus.js";

Vue.config.errorHandler = function (err) {
  console.error(err);
};
Vue.config.productionTip = false;

window.app = new Vue({
  store,
  render: function (h) {
    return h(App);
  },
  mounted() {
    this.$store.dispatch("getRecents");
    this.$store.dispatch("updateSettingsState");
  }
}).$mount("#app");
