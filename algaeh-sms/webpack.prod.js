const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const fs = require("fs");
module.exports = (env) => {
  const cPath = "../Client_Builds/algaeh-sms";
  const _path =
    env && env["Client_Builds"] === true
      ? path.resolve(__dirname, cPath, "build")
      : path.resolve(__dirname, "build");
  return {
    ...merge(common, {
      mode: "production",
      output: {
        path: _path,
        filename: "app.js",
      },
      plugins: [
        {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap("AfterEmitPlugin", (compilation) => {
              if (env && env["Client_Builds"] === true) {
                const pJSON = fs.readFileSync(
                  path.join(__dirname, "package.json"),
                  { encoding: "utf-8" }
                );
                let { devDependencies, ...packageDependencies } =
                  JSON.parse(pJSON);
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
    }),
  };
};
