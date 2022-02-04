import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
import { resolve } from "path";

export default defineConfig({
  root: "src/renderer/",
  base: "./",
  plugins: [createVuePlugin()],
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
