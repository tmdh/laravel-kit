import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  root: "src/renderer/",
  base: "./",
  plugins: [vue()],
  server: {
    port: 4999
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/renderer/")
    }
  },
  build: {
    outDir: "../../dist/app/",
    assetsDir: "."
  }
});
