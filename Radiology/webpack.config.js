const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  entry: {
    app: ["./src/radiology_server.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".json"],
    symlinks: true,
    alias: {
      "algaeh-laboratory": path.resolve(__dirname, "../Laboratory"),
      "algaeh-radiology": path.resolve(__dirname, "../Radiology"),
      "algaeh-pharmacy": path.resolve(__dirname, "../Pharmacy"),
      "algaeh-keys": path.resolve(__dirname, "../keys"),
      "algaeh-utilities": path.resolve(__dirname, "../AlgaehUtilities"),
      "algaeh-billing": path.resolve(__dirname, "../Billing")
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src")],
        enforce: "post",
        use: {
          loader: "obfuscator-loader",
          options: {
            compact: true,
            selfDefending: false
          }
        }
      }
    ]
  },
  // externals: [
  //   nodeExternals({
  //     whitelist: ["algaeh-radiology", "algaeh-pharmacy", "algaeh-laboratory", ""]
  //   })
  // ]
  externals: [
    nodeExternals({
      whitelist: [
        "algaeh-keys",
        "algaeh-utilities",
        "algaeh-billing",
        "algaeh-inventory",
        "algaeh-radiology",
        "algaeh-laboratory",
        "algaeh-pharmacy"
      ]
    })
  ]
};
