const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const result = {
        details: options.result,
        net_payable: options.currencyFormat(
          _.sumBy(options.result, (s) => parseFloat(s.net_payable)),
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
