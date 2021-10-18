const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonPaths = require("./paths");

module.exports = {
  entry: {
    [commonPaths.loginChunkName]: commonPaths.loginEntryPath,
    [commonPaths.mainChunkName]: commonPaths.mainEntryPath
  },

  output: {
    path: commonPaths.outputPath,
    filename: (pathData) => {
      return pathData.chunk.name === commonPaths.loginChunkName
        ? "prelogin/[name].[contenthash].js"
        : "dist/[name].[contenthash].js";
    },
    chunkFilename: (pathData) => {
      return pathData.chunk.name === commonPaths.loginChunkName
        ? "prelogin/[name].[chunkhash].js"
        : "dist/[name].[chunkhash].js";
    },
    assetModuleFilename: "images/[contenthash][ext][query]"
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        type: "asset/resource"
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[contenthash][ext][query]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Views: commonPaths.viewPath,
      Images: commonPaths.imagePath,
      Utils: commonPaths.utilsPath,
      Components : commonPaths.componentsPath
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: commonPaths.loginTmplPath,
      chunks: [commonPaths.loginChunkName],
      filename: commonPaths.loginTempFile
    }),
    new HtmlWebpackPlugin({
      template: commonPaths.mainTmplPath,
      chunks: [commonPaths.mainChunkName],
      filename: commonPaths.mainTmpFile
    })
  ]
};
