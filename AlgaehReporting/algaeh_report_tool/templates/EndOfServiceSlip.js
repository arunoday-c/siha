const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;
      const result = options.result[0];

      resolve({
        ...result,
        ...{
          month: moment(result.month, "MM").format("MMMM"),
          total_gratutity_amount: options.currencyFormat(
            result.total_gratutity_amount,
            options.args.crypto
          ),
          gratuity_encash: options.currencyFormat(
            result.gratuity_encash,
            options.args.crypto
          ),
          calculated_gratutity_amount: options.currencyFormat(
            result.calculated_gratutity_amount,
            options.args.crypto
          ),
          payable_amount: options.currencyFormat(
            result.payable_amount,
            options.args.crypto
          ),

          salary_in_words:
            options.args.crypto.currency_symbol +
            " " +
            writtenForm(result.payable_amount) +
            " Only",
        },
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
