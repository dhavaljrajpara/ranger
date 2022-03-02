const path = require("path");

const mainTmpFile = "index.html";

module.exports = {
  mainChunkName: "main",
  mainTmpFile,
  mainEntryPath: path.resolve(__dirname, "../src/index.jsx"),
  mainTmplPath: path.resolve(__dirname, `../src/${mainTmpFile}`),
  outputPath: path.resolve(__dirname, "../dist"),
  viewPath: path.resolve(__dirname, "../src/views"),
  imagePath: path.resolve(__dirname, "../src/images"),
  utilsPath: path.resolve(__dirname, "../src/utils"),
  componentsPath: path.resolve(__dirname, "../src/components"),
  host: process.env.UI_HOST || "0.0.0.0",
  port: process.env.UI_PORT || "8888",
  proxyHost: "http://localhost",
  proxyPort: "6080"
};
