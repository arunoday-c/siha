/* config-overrides.js */
//const rewireOptimize = require("react-app-rewire-optimize");
const rewireVendorSplitting = require("react-app-rewire-vendor-splitting");
module.exports = function override(config, env) {
  //do stuff with the webpack config...
  //config = rewireOptimize(config, env);
  config = rewireVendorSplitting(config, env);
  return config;
};
