// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  // const utilities = new algaehUtilities();
  const _ = options.loadash;

  return new Promise(function(resolve, reject) {
    try {
      const result = options.result;
      const decimal_places = options.args.crypto.decimal_places;
      const output = {
        details: result,
        total_patient_tax: _.sumBy(result, s =>
          parseFloat(s.patient_tax)
        ).toFixed(decimal_places),
        total_patient_payable: _.sumBy(result, s =>
          parseFloat(s.patient_payable)
        ).toFixed(decimal_places),
        total_company_tax: _.sumBy(result, s =>
          parseFloat(s.company_tax)
        ).toFixed(decimal_places),
        total_company_payable: _.sumBy(result, s =>
          parseFloat(s.company_payable)
        ).toFixed(decimal_places),
        total_net_amount: _.sumBy(result, s =>
          parseFloat(s.net_amount)
        ).toFixed(decimal_places)
      };
      // utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
