const executePDF = function executePDFMethod(options) {
  const moment = options.moment;
  const _ = options.loadash;

  return new Promise(function (resolve, reject) {
    try {
      const decimal_places = options.args.crypto.decimal_places;


      const result = options.result[0];
      const organization_name = options.result[1][0].organization_name;

      if (result.length > 0) {
        resolve({
          net_payable: parseFloat(result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          organization_name: organization_name,
          invoice_number: result[0]["invoice_number"],
          bank_name: result[0]["bank_name"],
          bank_account_no: result[0]["bank_account_no"],
          invoice_date: moment(result[0]["invoice_date"]).format(
            "DD-MM-YYYY"
          ),
          customer_name: result[0]["customer_name"],
          customer_po_no: result[0]["customer_po_no"],
          arabic_customer_name: result[0]["arabic_customer_name"],
          vat_number: result[0]["vat_number"],
          address: result[0]["address"],
          amount_before_vat: _.sumBy(result, (s) =>
            parseFloat(s.net_extended_cost)
          ).toFixed(decimal_places),
          netdiscount_amount: parseFloat(
            result[0]["discount_amount"]
          ).toFixed(decimal_places),
          total_tax: parseFloat(result[0]["total_tax"]).toFixed(
            decimal_places
          ),
          detailList: result,
        });
      } else {
        resolve({ detailList: result });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
