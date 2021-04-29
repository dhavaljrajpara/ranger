const HtmlWebpackPlugin = require("html-webpack-plugin");

const commonPaths = require("./paths");

module.exports = {
  entry: commonPaths.entryPath,

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      Views: commonPaths.viewPath
    }
  },
  plugins: [new HtmlWebpackPlugin({ template: commonPaths.templatePath })]
};
