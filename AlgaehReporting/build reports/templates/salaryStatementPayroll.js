const { MONTHS } = require("./GlobalVariables.json");

const executePDF = function executePDFMethod(options) {
  // const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      if (options.result.length > 0) {
        input["sub_department_name"] = options.result[0]["sub_department_name"];
        input["hospital_name"] = options.result[0]["hospital_name"];
        MONTHS.forEach(month => {
          if (month.value == input.month) input["month"] = month.name;
        });
      } else {
        input = {};
      }

      const result = { ...input, details: options.result };

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
