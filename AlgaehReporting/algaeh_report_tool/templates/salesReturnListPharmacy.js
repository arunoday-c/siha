import algaehUtilities from "algaeh-utilities/utilities";
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const utilities = new algaehUtilities();
  return new Promise(function(resolve, reject) {
    const _ = options.loadash;

    try {
      const result = options.result.length > 0 ? options.result : [{}];

      const output = {
        details: result,
        total_return: _.sumBy(result, s => parseFloat(s.return_amout)).toFixed(
          3
        )
      };
      //utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
