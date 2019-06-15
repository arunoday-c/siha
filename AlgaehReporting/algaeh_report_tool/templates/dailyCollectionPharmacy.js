import algaehUtilities from "algaeh-utilities/utilities";
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      utilities.logger().log("result: ", options.result);
      let cash_collected = options.result[0];
      let cash_retuned = options.result[1];
      let total_returned = _.sumBy(cash_retuned, s =>
        parseFloat(s.return_amout)
      ).toFixed(3);

      // let result = [];

      //   if (
      //     input.pay_type == "CD" ||
      //     input.pay_type == "CH" ||
      //     input.pay_type == "CA"
      //   ) {
      //     let ids = _.chain(cash_collected)
      //       .filter(f => f.pay_type == input.pay_type)
      //       .map(obj => obj.hims_f_receipt_header_id)
      //       .value();

      //     ids.map(val => {
      //       result.push(
      //         ..._.filter(cash_collected, f => f.hims_f_receipt_header_id == val)
      //       );
      //     });
      //   } else {
      //     result = cash_collected;
      //   }

      //   const data = _.chain(result)
      //     .groupBy(g => g.hims_f_receipt_header_id)
      //     .map(function(item, key) {
      //       const cash = _.chain(item)
      //         .filter(f => f.pay_type == "CA")
      //         .sumBy(s => parseFloat(s.amount))
      //         .value()
      //         .toFixed(3);

      //       const card = _.chain(item)
      //         .filter(f => f.pay_type == "CD")
      //         .sumBy(s => parseFloat(s.amount))
      //         .value()
      //         .toFixed(3);
      //       const check = _.chain(item)
      //         .filter(f => f.pay_type == "CH")
      //         .sumBy(s => parseFloat(s.amount))
      //         .value()
      //         .toFixed(3);
      //       return {
      //         receipt_number: item[0]["receipt_number"],
      //         pos_number: item[0]["pos_number"],
      //         receipt_date: item[0]["receipt_date"],
      //         patient_full_name: item[0]["patient_full_name"],
      //         mrn_no: item[0]["mrn_no"],
      //         total_amount: item[0]["total_amount"],
      //         cash: cash,
      //         card: card,
      //         check: check,
      //         cashier: item[0]["cashier"],
      //         collected_time: item[0]["collected_time"]
      //       };
      //     })
      //     .value();

      const total_cash = _.chain(cash_collected)
        .filter(f => f.pay_type == "CA")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);

      const total_card = _.chain(cash_collected)
        .filter(f => f.pay_type == "CD")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);

      const total_check = _.chain(cash_collected)
        .filter(f => f.pay_type == "CH")
        .sumBy(s => parseFloat(s.amount))
        .value()
        .toFixed(3);
      const total_collection = parseFloat(
        parseFloat(total_cash) +
          parseFloat(total_card) +
          parseFloat(total_check)
      ).toFixed(3);

      const income = parseFloat(total_collection - total_returned).toFixed(3);

      const output = {
        // details: data,
        total_cash: total_cash,
        total_card: total_card,
        total_check: total_check,
        total_collection: total_collection,
        total_returned: total_returned,
        income: income
      };
      utilities.logger().log("output: ", output);
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
