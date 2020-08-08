const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      // const result = { details: options.result };
      const userBill = _.chain(options.result)
        .groupBy((g) => g.employee_id)
        .map((detail) => {
          console.log(detail, "detail");
          const { user_display_name } = detail[0];
          const totalNet = _.sumBy(detail, (f) => parseFloat(f.net_amount));
          console.log("totalNet", totalNet);
          return {
            user: user_display_name,
            // totalNet,
            totalNet: options.currencyFormat(totalNet, options.args.crypto),
            no_bill: detail.length,
            details: detail,
          };
        })
        .value();
      console.log(userBill);
      resolve({ result: userBill });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
