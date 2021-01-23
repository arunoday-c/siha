const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const fs = require("fs");

module.exports = (env) => {
  const cPath = "../Client_Builds/algaeh-hr-management";
  const _path =
    env && env === "Client_Builds"
      ? path.resolve(__dirname, cPath, "build")
      : path.resolve(__dirname, "build");
  return {
    ...merge(common, {
      mode: "production",
      output: {
        path: _path,
        // path: "/Users/apple/Documents/Client/Build/App/build",
        filename: "[name].js",
      },
      plugins: [
        {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
              if (env === "Client_Builds") {
                const pJSON = fs.readFileSync(
                  path.join(__dirname, "package.json"),
                  { encoding: "utf-8" }
                );
                let { devDependencies, ...packageDependencies } = JSON.parse(
                  pJSON
                );
                const packagePath = path.resolve(
                  __dirname,
                  cPath,
                  "package.json"
                );
                if (fs.existsSync(packagePath)) {
                  fs.unlinkSync(packagePath);
                }
                fs.writeFileSync(
                  packagePath,
                  JSON.stringify(packageDependencies, null, 2),
                  {
                    encoding: "utf-8",
                  }
                );
              }
            });
          },
        },
      ],
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
    }),
  };
};
