const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: {
    index: "./src/renderer/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist/app"),
    filename: "[name].js",
    publicPath: "./"
  },
  target: "electron-renderer",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: [
          isDev ? "vue-style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { esModule: false, sourceMap: isDev }
          },
          "postcss-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|otf|woff|woff2)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "../dist/renderer"),
    hot: true,
    port: 4000,
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html"
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new MonacoWebpackPlugin({
      languages: []
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer/")
    },
    extensions: [".vue", ".js", ".css"]
  }
};
