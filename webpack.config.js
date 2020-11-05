const path = require("path");
const webpack = require("webpack");
const BUILD_DIR = path.resolve(__dirname, "./build");
const APP_DIR = path.resolve(__dirname, "./assets");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  mode: 'development',
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  entry: [`${APP_DIR}/Main.js`, `${APP_DIR}/src/Modal/3-Modal.stories.css`],
  output: {
    path: path.resolve(BUILD_DIR),
    publicPath: "/",
    filename: "bundle.js",
  },
  devServer: {
    contentBase: `${BUILD_DIR}/index.html`,
    port: 5000,

  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(`${BUILD_DIR}/index.html`),
      // Load a custom template (lodash by default)
      template: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    })
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
          }
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      }
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
};
