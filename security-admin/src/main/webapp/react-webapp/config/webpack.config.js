const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonPaths = require("./paths");

module.exports = {
  entry: commonPaths.entryPath,

  output: {
    path: commonPaths.outputPath,
    filename: "[name].[hash].js",
    chunkFilename: "[name].[chunkhash].js",
    assetModuleFilename: "images/[hash][ext][query]"
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
          filename: "fonts/[hash][ext][query]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Views: commonPaths.viewPath,
      Images: commonPaths.imagePath,
      Utils: commonPaths.utilsPath
    }
  },
  plugins: [new HtmlWebpackPlugin({ template: commonPaths.templatePath })]
};
