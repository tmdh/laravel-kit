import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  root: "src/renderer/",
  base: "./",
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2
          }
        }
      }
    })
  ],
  server: {
    port: 4999
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src/renderer/"),
      vue: "@vue/compat"
    }
  },
  build: {
    outDir: "../../dist/app/",
    assetsDir: "."
  }
});
