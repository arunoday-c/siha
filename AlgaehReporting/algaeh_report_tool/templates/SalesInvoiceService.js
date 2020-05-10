
const executePDF = function executePDFMethod(options) {
  const moment = options.moment;
  const _ = options.loadash;

  return new Promise(function (resolve, reject) {
    try {

      const decimal_places = options.args.crypto.decimal_places;
      if (options.result.length > 0) {
        resolve({
          net_payable: parseFloat(options.result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          invoice_number: options.result[0]["invoice_number"],
          invoice_date: moment(options.result[0]["invoice_date"]).format(
            "DD-MM-YYYY"
          ),
          customer_name: options.result[0]["customer_name"],
          customer_po_no: options.result[0]["customer_po_no"],
          arabic_customer_name: options.result[0]["arabic_customer_name"],
          vat_number: options.result[0]["vat_number"],
          address: options.result[0]["address"],
          amount_before_vat: _.sumBy(options.result, s => parseFloat(s.net_extended_cost)).toFixed(
            decimal_places
          ),
          total_tax: parseFloat(options.result[0]["total_tax"]).toFixed(
            decimal_places
          ),
          detailList: options.result
        });
      } else {
        resolve({ detailList: options.result });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
