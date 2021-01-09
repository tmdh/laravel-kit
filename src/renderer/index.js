import Vue from "vue";
import App from "./App.vue";
import "./styles.css";

Vue.config.productionTip = false;

new Vue({
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
