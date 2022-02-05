import { createApp } from "vue";
import { store } from "@/lib/store.js";
import App from "@/App.vue";
import "@/styles.css";

const app = createApp({
  ...App,
  mounted() {
    this.$store.dispatch("getRecents");
    this.$store.dispatch("updateSettingsState");
  }
});

app.use(store);
app.mount("#app");

window.app = app;
