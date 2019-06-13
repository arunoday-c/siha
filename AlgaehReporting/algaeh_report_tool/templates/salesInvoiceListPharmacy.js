import algaehUtilities from "algaeh-utilities/utilities";
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const utilities = new algaehUtilities();
  return new Promise(function(resolve, reject) {
    const _ = options.loadash;

    try {
      const result = options.result.length > 0 ? options.result : [{}];

      const output = {
        result: result[0],
        total_patient_tax: _.sumBy(detail, s => parseFloat(s.patient_tax)),
        total_patient_payable: _.sumBy(detail, s =>
          parseFloat(s.patient_payable)
        ),
        total_company_tax: _.sumBy(detail, s => parseFloat(s.company_tax)),
        total_company_payable: _.sumBy(detail, s =>
          parseFloat(s.company_payable)
        ),
        total_net_amount: _.sumBy(detail, s => parseFloat(s.net_amount))
      };
      utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
