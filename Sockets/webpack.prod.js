const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       include: [path.resolve(__dirname, "src")],
  //       enforce: "post",
  //       use: {
  //         loader: "obfuscator-loader",
  //         options: {
  //           compact: true,
  //           selfDefending: false
  //         }
  //       }
  //     }
  //   ]
  // }
});
