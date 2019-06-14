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
        total_patient_tax: _.sumBy(result, s =>
          parseFloat(s.patient_tax)
        ).toFixed(3),
        total_patient_payable: _.sumBy(result, s =>
          parseFloat(s.patient_payable)
        ).toFixed(3),
        total_company_tax: _.sumBy(result, s =>
          parseFloat(s.company_tax)
        ).toFixed(3),
        total_company_payable: _.sumBy(result, s =>
          parseFloat(s.company_payable)
        ).toFixed(3),
        total_net_amount: _.sumBy(result, s =>
          parseFloat(s.net_amount)
        ).toFixed(3)
      };
      utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
