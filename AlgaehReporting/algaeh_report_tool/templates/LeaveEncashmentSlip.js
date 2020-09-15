const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const moment = options.moment;
  return new Promise(function (resolve, reject) {
    try {
      const result = {
        details: options.result,
        //   expected_cash: options.currencyFormat(
        //     _.sumBy(options.result, (s) => parseFloat(s.expected_cash)),
        //     options.args.crypto
        //   ),
        //   expected_card: options.currencyFormat(
        //     _.sumBy(options.result, (s) => parseFloat(s.expected_card)),
        //     options.args.crypto
        //   ),
        //   expected_total: options.currencyFormat(
        //     _.sumBy(options.result, (s) => parseFloat(s.expected_total)),
        //     options.args.crypto
        //   ),
        //   collected_total: options.currencyFormat(
        //     _.sumBy(options.result, (s) => parseFloat(s.collected_total)),
        //     options.args.crypto
        //   ),
        //   total_diff: options.currencyFormat(
        //     _.sumBy(options.result, (s) => parseFloat(s.total_diff)),
        //     options.args.crypto
        //   ),
      };
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
