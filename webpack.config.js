const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ProgressPlugin } = require("webpack");
const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: {
    index: "./src/renderer/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist", "app"),
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
            options: { esModule: false, sourceMap: isDev, importLoaders: 1 }
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
    hot: true,
    port: 4999,
    publicPath: "/"
  },
  plugins: [
    new ProgressPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/renderer/index.html"
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "style.css"
    }),
    new MonacoWebpackPlugin({
      features: ["!codelens", "!fontZoom", "!iPadShowKeyboard", "!snippets"],
      languages: []
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/renderer/")
    }
  },
  stats: {
    colors: true
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()]
  },
  mode: "development"
};
