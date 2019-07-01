//const algaehUtilities = require('algaeh-utilities/utilities');
const executePDF = function executePDFMethod(options) {
  //	const utilities = new algaehUtilities();
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    try {
      const result = options.result;
      const decimal_places = options.args.crypto.decimal_places;
      const output = {
        details: result,
        total_return: _.sumBy(result, s => parseFloat(s.return_amout)).toFixed(
          decimal_places
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
