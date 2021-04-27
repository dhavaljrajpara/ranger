const path = require("path");

module.exports = {
  entryPath: path.resolve(__dirname, "../src/index.jsx"),
  templatePath: path.resolve(__dirname, "../src/index.html"),
  outputPath: path.resolve(__dirname, "../dist"),
  host: process.env.UI_HOST || "0.0.0.0",
  port: process.env.UI_PORT || "8888"
};
