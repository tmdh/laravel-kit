const path = require("path");
const { ProgressPlugin } = require("webpack");

module.exports = [
  {
    entry: {
      main: "./src/main/main.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    target: "electron-main",
    plugins: [new ProgressPlugin()],
    stats: {
      colors: true
    },
    mode: "development"
  },
  {
    entry: {
      preload: "./src/main/preload.js"
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js"
    },
    target: "electron-preload",
    plugins: [new ProgressPlugin()],
    stats: {
      colors: true
    },
    mode: "development"
  }
];
