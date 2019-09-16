const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { whenDev } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: {
      externals: {
        react: "React",
        "react-dom": "ReactDOM"
      }
    }
  }
};
