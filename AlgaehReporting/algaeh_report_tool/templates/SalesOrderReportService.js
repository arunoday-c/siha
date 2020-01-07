
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {

      const decimal_places = options.args.crypto.decimal_places;
      if (options.result.length > 0) {
        resolve({
          net_payable: parseFloat(options.result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          sales_quotation_id: options.result[0]["sales_quotation_id"],
          sales_quotation_number: options.result[0]["sales_quotation_number"],
          customer_name: options.result[0]["customer_name"],
          sales_order_number: options.result[0]["sales_order_number"],
          sales_order_date: options.result[0]["sales_order_date"],
          delivery_date: options.result[0]["delivery_date"],
          employee_name: options.result[0]["employee_name"],
          narration: options.result[0]["narration"],
          address: options.result[0]["address"],
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
