const path = require("path");

const loginTempFile = "login.html";
const mainTmpFile = "index.html";

module.exports = {
  mainChunkName: "main",
  loginChunkName: "login",
  loginTempFile,
  mainTmpFile,
  loginEntryPath: path.resolve(__dirname, "../src/login.jsx"),
  mainEntryPath: path.resolve(__dirname, "../src/index.jsx"),
  loginTmplPath: path.resolve(__dirname, `../src/${loginTempFile}`),
  mainTmplPath: path.resolve(__dirname, `../src/${mainTmpFile}`),
  outputPath: path.resolve(__dirname, "../dist"),
  viewPath: path.resolve(__dirname, "../src/views"),
  imagePath: path.resolve(__dirname, "../src/images"),
  utilsPath: path.resolve(__dirname, "../src/utils"),
  componentsPath: path.resolve(__dirname, "../src/components"),
  host: process.env.UI_HOST || "0.0.0.0",
  port: process.env.UI_PORT || "8888",
  proxyHost: "http://192.168.0.108",
  proxyPort: "6080"
};
