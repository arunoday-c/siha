const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      // const result = { details: options.result };
      // resolve(result);

      const utilities = new algaehUtilities();
      const _ = options.loadash;
      const decimal_places = options.args.crypto.decimal_places;

      const details = options.result[0];
      const payTypeResult = options.result[1];

      utilities.logger().log("outpot: ", options.result);

      const total_cash = _.chain(payTypeResult)
        .filter(f => f.pay_type == "CA")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);

      const total_card = _.chain(payTypeResult)
        .filter(f => f.pay_type == "CD")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);

      const total_check = _.chain(payTypeResult)
        .filter(f => f.pay_type == "CH")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);

      const output = {
        details: details,

        credit_number: details[0].credit_number,
        credit_date: details[0].credit_date,
        total_reciept_amount: details[0].total_reciept_amount,
        write_off_amount: details[0].write_off_amount,
        recievable_amount: details[0].recievable_amount,
        receipt_number: details[0].receipt_number,
        full_name: details[0].full_name,
        patient_code: details[0].patient_code,
        total_cash: total_cash,
        total_card: total_card,
        total_check: total_check
      };
      utilities.logger().log("outpot tt: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
