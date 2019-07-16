const algaehUtilities = require("algaeh-utilities/utilities");
const utilities = new algaehUtilities();
// utilities.logger().log("input: ", input);
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      utilities.logger().log("otpuuu: ", options.result);
      resolve({});
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
