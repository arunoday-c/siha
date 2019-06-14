import algaehUtilities from "algaeh-utilities/utilities";

const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      const result = options.result.length > 0 ? options.result : [{}];
      utilities.logger().log("result: ", result);

      const data = _.chain(result)
        .groupBy(g => g.hims_f_receipt_header_id)
        .map(function(item, key) {
          const cash = _.chain(item)
            .filter(f => f.pay_type == "CA")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);

          //   utilities.logger().log("cash: ", cash);

          const card = _.chain(item)
            .filter(f => f.pay_type == "CD")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);
          const check = _.chain(item)
            .filter(f => f.pay_type == "CH")
            .sumBy(s => parseFloat(s.amount))
            .value()
            .toFixed(3);
          return {
            receipt_number: item[0]["receipt_number"],
            pos_number: item[0]["pos_number"],
            receipt_date: item[0]["receipt_date"],
            patient_full_name: item[0]["patient_full_name"],
            mrn_no: item[0]["mrn_no"],
            total_amount: item[0]["total_amount"],
            cash: cash,
            card: card,
            check: check
          };
        })
        .value();

      const total_cash = _.chain(result)
        .filter(f => f.pay_type == "CA")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);

      const total_card = _.chain(result)
        .filter(f => f.pay_type == "CD")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);

      const total_check = _.chain(result)
        .filter(f => f.pay_type == "CH")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);
      const total_sum =
        parseFloat(total_cash) +
        parseFloat(total_card) +
        parseFloat(total_check);

      const output = {
        details: data,
        total_cash: total_cash,
        total_card: total_card,
        total_check: total_check,
        total_sum: total_sum.toFixed(3)
      };
      utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
