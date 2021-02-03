// module.exports = function override(config) {
//   config.output.filename = "static/js/[name].js";
//   config.plugins[5].options.filename = "static/css/[name].css";
//   config.optimization.runtimeChunk = false;
//   config.optimization.splitChunks = {
//     cacheGroups: {
//       default: false,
//     },
//   };
//   config.externals = {
//     react: "React",
//     "react-dom": "ReactDOM",
//   };
//   return config;
// };
// child's config-overrides.js
module.exports = {
  webpack: function (config, env) {
    // export initial bundle into single chunk
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
      },
    };
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      // Allow cors for loading assets from different origins
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      return config;
    };
  },
};
