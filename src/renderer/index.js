import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "@/App.vue";
import Home from "@/views/Home.vue";
import Artisan from "@/views/Artisan.vue";
import Models from "@/views/Models.vue";
import Settings from "@/views/Settings.vue";
import "./styles.css";

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter({
  routes: [
    { path: "/home", component: Home },
    { path: "/artisan", component: Artisan },
    { path: "/models", component: Models },
    { path: "/settings", component: Settings },
    { path: "/", redirect: "/home" }
  ]
});

const store = new Vuex.Store({
  state: {
    project: null
  }
});

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
