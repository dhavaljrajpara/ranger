const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonPaths = require("./paths");
const baseConfig = require("./webpack.config.js");

const devConfig = merge(
  {
    mode: "production",
    output: {
      path: commonPaths.outputPath,
      filename: "[name].[hash].js",
      chunkFilename: "[name].[chunkhash].js"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[id].[contenthash].css"
      })
    ]
  },
  baseConfig
);

module.exports = devConfig;
