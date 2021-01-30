import Vue from "vue";
import VueRouter from "vue-router";
import { store } from "./store";
import App from "@/App.vue";
import Home from "@/views/Home.vue";
import Artisan from "@/views/Artisan.vue";
import Tinker from "@/views/Tinker.vue";
import Settings from "@/views/Settings.vue";
import menu from "./menu";
import { remote } from "electron";
const { Menu } = remote;
import "./styles.css";

Vue.use(VueRouter);

Vue.config.errorHandler = function(err) {
  console.error(err);
};
Vue.config.productionTip = false;

const router = new VueRouter({
  routes: [
    { path: "/home", component: Home },
    { path: "/artisan", component: Artisan },
    { path: "/tinker", component: Tinker },
    { path: "/settings", component: Settings },
    { path: "/", redirect: "/home" }
  ]
});

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");

Menu.setApplicationMenu(menu);
