const webpack = require("webpack");
const { merge } = require("webpack-merge");

const commonPaths = require("./paths");
const baseConfig = require("./webpack.config.js");

const devConfig = merge(
  {
    mode: "development",
    devtool: "inline-source-map",
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        }
      ]
    },
    devServer: {
      host: commonPaths.host,
      port: commonPaths.port,
      publicPath: "/",
      historyApiFallback: true
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
  },
  baseConfig
);

module.exports = devConfig;
