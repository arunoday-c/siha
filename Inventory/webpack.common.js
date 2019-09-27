const path = require("path");
const nodeExternals = require("webpack-node-externals");
const appConf = require("../algaeh-modules.json");
const { moduleList } = appConf;

function resolvePaths(list) {
  let keys = Object.keys(list);
  const reqObj = { ...list };
  for (i = 0; i < keys.length; i++) {
    reqObj[keys[i]] = path.resolve(__dirname, reqObj[keys[i]]);
  }
  return reqObj;
}

module.exports = {
  target: "node",
  entry: {
    app: ["./src/index.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".json"],
    symlinks: true,
    alias: resolvePaths(moduleList)
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
      }
    ]
  },
  externals: [
    nodeExternals({
      whitelist: Object.keys(moduleList)
    })
  ]
};
