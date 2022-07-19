const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonPaths = require("./paths");

module.exports = {
  entry: {
    [commonPaths.mainChunkName]: commonPaths.mainEntryPath
  },

  output: {
    path: commonPaths.outputPath,
    filename: (pathData) => {
      return "dist/[name].[contenthash].js";
    },
    chunkFilename: (pathData) => {
      return "dist/[name].[chunkhash].js";
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
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[contenthash][ext][query]",
              outputPath: "images/",
              publicPath: "../images/"
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[contenthash][ext][query]",
              outputPath: "fonts/",
              publicPath: "../fonts/"
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Views: commonPaths.viewPath,
      Images: commonPaths.imagePath,
      Utils: commonPaths.utilsPath,
      Components: commonPaths.componentsPath,
      Hooks: commonPaths.hooksPath
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: commonPaths.mainTmplPath,
      chunks: [commonPaths.mainChunkName],
      filename: commonPaths.mainTmpFile,
      favicon: `${commonPaths.imagePath}/favicon.ico`
    })
  ]
};
