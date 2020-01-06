// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      // resolve(options.result[0]);

      // const utilities = new algaehUtilities();

      // utilities.logger().log("outpoy: ", options.result);
      const decimal_places = options.args.crypto.decimal_places;
      if (options.result.length > 0) {
        // options.result.map(item => {
        //   item.dn_quantity = parseFloat(item["dn_quantity"]).toFixed(
        //     decimal_places
        //   );

        //   return item;
        // });

        resolve({
          net_payable: parseFloat(options.result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          sales_quotation_id: options.result[0]["sales_quotation_id"],
          customer_name: options.result[0]["customer_name"],
          sales_order_number: options.result[0]["sales_order_number"],
          sales_order_date: options.result[0]["sales_order_date"],
          delivery_date: options.result[0]["delivery_date"],
          employee_name: options.result[0]["employee_name"],
          narration: options.result[0]["narration"],
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
