
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {

      const decimal_places = options.args.crypto.decimal_places;
      if (options.result.length > 0) {
        resolve({
          net_payable: parseFloat(options.result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          invoice_number: options.result[0]["sales_quotation_number"],
          invoice_date: options.result[0]["invoice_date"],
          // customer_name: options.result[0]["customer_name"],
          sales_order_number: options.result[0]["sales_order_number"],
          sales_order_date: options.result[0]["sales_order_date"],
          // delivery_date: options.result[0]["delivery_date"],
          // employee_name: options.result[0]["employee_name"],
          // narration: options.result[0]["narration"],
          // address: options.result[0]["address"],
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
