const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const utilities = new algaehUtilities();

      utilities.logger().log("outpoy: ", options.result);

      if (options.result.length > 0) {
        resolve({
          sub_department_name: options.result[0]["sub_department_name"],
          employee_code: options.result[0]["employee_code"],
          full_name: options.result[0]["full_name"],
          detailList: options.result
        });
      } else {
        resolve({ detailList: options.result });
      }
      // resolve(options.result[0]);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
