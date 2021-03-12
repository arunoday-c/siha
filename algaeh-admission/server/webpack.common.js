const path = require("path");
const nodeExternals = require("webpack-node-externals");
const appConf = require("../../algaeh-modules.json");
const webpack = require("webpack");
const { moduleList } = appConf;

function resolvePaths(list) {
  let keys = Object.keys(list);
  const reqObj = { ...list };
  for (i = 0; i < keys.length; i++) {
    reqObj[keys[i]] = path.resolve(__dirname, "../", reqObj[keys[i]]);
  }
  return reqObj;
}

module.exports = {
  target: "node",
  entry: {
    app: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "app.js",
  },
  resolve: {
    extensions: [".js", ".ts", ".json"],
    symlinks: true,
    alias: resolvePaths(moduleList),
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
  externals: [
    nodeExternals({
      allowlist: Object.keys(moduleList),
    }),
  ],
};
