const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  const moment = options.moment;
  return new Promise(function (resolve, reject) {
    try {
      const result = {
        details: options.result,
        expected_total: options.currencyFormat(
          _.sumBy(options.result, (s) => parseFloat(s.expected_total)),
          options.args.crypto
        ),
        collected_total: options.currencyFormat(
          _.sumBy(options.result, (s) => parseFloat(s.collected_total)),
          options.args.crypto
        ),
        total_diff: options.currencyFormat(
          _.sumBy(options.result, (s) => parseFloat(s.total_diff)),
          options.args.crypto
        ),
      };
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
