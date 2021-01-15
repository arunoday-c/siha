const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../Client_Builds/Billing", "build"),
    // path: "/Users/apple/Documents/Client/Build/App/build",
    filename: "[name].js",
  },
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
