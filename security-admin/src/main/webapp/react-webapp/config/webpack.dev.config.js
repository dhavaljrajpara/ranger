const webpack = require("webpack");
const { merge } = require("webpack-merge");

const commonPaths = require("./paths");
const commonConfig = require("./webpack.config.js");

const devConfig = merge(commonConfig, {
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
    historyApiFallback: true,
    proxy: {
      "/service": {
        target: `${commonPaths.proxyHost}:${commonPaths.proxyPort}`,
        secure: false
      }
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
});

module.exports = devConfig;
