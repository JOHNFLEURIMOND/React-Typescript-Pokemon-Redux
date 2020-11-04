const path = require("path");
const webpack = require("webpack");
const BUILD_DIR = path.resolve(__dirname, "./build");
const APP_DIR = path.resolve(__dirname, "./assets");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  entry: "./assets/Main.js",
  output: {
    path: path.resolve(BUILD_DIR),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: BUILD_DIR + "index/html",
    port: 5000,
    
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(BUILD_DIR, "index.html"),
      // Load a custom template (lodash by default)
      template: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "source-map-loader",
          },
          {
            loader: "babel-loader",
          },
        ],
      },
      {},
    ],
  },
};
