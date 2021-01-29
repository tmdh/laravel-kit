import Vue from "vue";
import VueRouter from "vue-router";
import { store } from "./store";
import App from "@/App.vue";
import Home from "@/views/Home.vue";
import Artisan from "@/views/Artisan.vue";
import Command from "@/components/Command.vue";
import ArtisanDefault from "@/components/ArtisanDefault.vue";
import Models from "@/views/Models.vue";
import Settings from "@/views/Settings.vue";
import "./styles.css";

Vue.use(VueRouter);

Vue.config.errorHandler = function(err) {
  console.error(err);
};
Vue.config.productionTip = false;

const router = new VueRouter({
  routes: [
    { path: "/home", component: Home },
    {
      path: "/artisan",
      component: Artisan,
      children: [
        { path: "command/:name", component: Command, props: true },
        { path: "", component: ArtisanDefault }
      ]
    },
    { path: "/models", component: Models },
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
