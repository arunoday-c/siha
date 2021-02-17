const { exec } = require("child_process");
module.exports = {
  webpack: function (config, env) {
    // export initial bundle into single chunk
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };
    config.externals = {
      react: "React",
      "react-dom": "ReactDOM",
    };
    return config;
  },
  devServer: function (configFunction, env) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      //   // Allow cors for loading assets from different origins
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      allowedHost = "127.0.0.1";
      config.writeToDisk = true;
      config.publicPath = "http://localhost:1313";
      config.after = function (app, server, compiler) {
        compiler.hooks.afterCompile.tap("myReload", (compilation) => {
          exec(
            "chromix-too reload http://localhost:1313",
            (error, stdout, stderr) => {
              if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              console.log(`Reloading please wait.. http://localhost:1313`);
            }
          );
        });

        // tr;
      };
      return config;
    };
  },
};
/**
 *  For hot reload in development
 * 1. npm install -g chromix-too
 * 2. In second terminal "chromix-too-server" keep running  as socket
 * 3. download chrome Extensions as "Chromix-Too"
 */
