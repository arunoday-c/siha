const executePDF = function executePDFMethod(options) {
  const moment = options.moment;
  const _ = options.loadash;

  return new Promise(function (resolve, reject) {
    try {
      // const decimal_places = options.args.crypto.decimal_places;

      const result = options.result[0];
      const organization_name = options.result[1][0].organization_name;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      if (result.length > 0) {
        resolve({
          net_payable: options.currencyFormat(
            parseFloat(result[0]["net_payable"]),
            options.args.crypto
          ),
          retention_amt: options.currencyFormat(
            parseFloat(result[0]["retention_amt"]),
            options.args.crypto
          ),

          outstanding_balance: options.currencyFormat(
            parseFloat(result[0]["net_payable"] - result[0]["retention_amt"]),
            options.args.crypto
          ),
          organization_name: organization_name,
          hospital_name: result[0]["hospital_name"],
          invoice_number: result[0]["invoice_number"],
          bank_name: result[0]["bank_name"],
          bank_account_no: result[0]["bank_account_no"],
          narration: result[0]["narration"],
          invoice_date: moment(result[0]["invoice_date"]).format("DD-MM-YYYY"),
          customer_name: result[0]["customer_name"],
          customer_po_no: result[0]["customer_po_no"],
          arabic_customer_name: result[0]["arabic_customer_name"],
          vat_number: result[0]["vat_number"],
          address: result[0]["address"],
          invoice_status: result[0]["invoice_status"],
          amount_before_vat: options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.net_extended_cost)),
            options.args.crypto
          ),
          netdiscount_amount: options.currencyFormat(
            parseFloat(result[0]["discount_amount"]),
            options.args.crypto
          ),
          total_tax: options.currencyFormat(
            parseFloat(result[0]["total_tax"]),
            options.args.crypto
          ),

          detailList: result,
          currency: {
            decimal_places,
            addSymbol: false,
            symbol_position,
            currency_symbol,
          },
        });
      } else {
        console.log("options.args.crypto", options.args.crypto);
        resolve({
          detailList: result,
          currency: {
            decimal_places,
            addSymbol: false,
            symbol_position,
            currency_symbol,
          },
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
