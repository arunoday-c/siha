const { MONTHS } = require("./GlobalVariables.json");

const executePDF = function executePDFMethod(options) {
  // const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      debugger;
      let input = {};
      const header = options.result[0];
      const detail = options.result[1];

      console.log("header: ", header);
      const result = {
        header: header[0],
        detail: detail
      };

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
