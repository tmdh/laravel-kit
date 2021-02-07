const path = require("path");

module.exports = {
  entry: {
    main: "./src/main/main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  target: "electron-main"
};
