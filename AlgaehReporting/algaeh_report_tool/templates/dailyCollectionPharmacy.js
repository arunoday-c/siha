const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let cash_collected = options.result[0];
      let cash_retuned = options.result[1];

      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      let total_returned = _.sumBy(cash_retuned, (s) =>
        parseFloat(s.return_amout)
      ).toFixed(decimal_places);

      const total_cash = _.chain(cash_collected)
        .filter((f) => f.pay_type == "CA")
        .sumBy((s) => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);

      const total_card = _.chain(cash_collected)
        .filter((f) => f.pay_type == "CD")
        .sumBy((s) => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);

      const total_check = _.chain(cash_collected)
        .filter((f) => f.pay_type == "CH")
        .sumBy((s) => parseFloat(s.amount))
        .value()
        .toFixed(decimal_places);
      const total_collection = parseFloat(
        parseFloat(total_cash) +
          parseFloat(total_card) +
          parseFloat(total_check)
      ).toFixed(decimal_places);

      const income = parseFloat(total_collection - total_returned).toFixed(
        decimal_places
      );

      const output = {
        // details: data,
        total_cash: total_cash,
        total_card: total_card,
        total_check: total_check,
        total_collection: total_collection,
        total_returned: total_returned,
        income: income,
        currencyOnly: {
          decimal_places,
          addSymbol: true,
          symbol_position,
          currency_symbol,
        },
      };
      resolve(output);
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
