// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      // resolve(options.result[0]);

      // const utilities = new algaehUtilities();

      // utilities.logger().log("outpoy: ", options.result);
      const decimal_places = options.args.crypto.decimal_places;
      if (options.result.length > 0) {
        options.result.map(item => {
          item.total_quantity = parseFloat(item["total_quantity"]).toFixed(
            decimal_places
          );
          return item;
        });

        resolve({
          net_payable: parseFloat(options.result[0]["net_payable"]).toFixed(
            decimal_places
          ),
          purchase_number: options.result[0]["purchase_number"],
          po_date: options.result[0]["po_date"],
          location_description: options.result[0]["location_description"],
          vendor_name: options.result[0]["vendor_name"],
          sub_department_name: options.result[0]["sub_department_name"],
          employee_code: options.result[0]["employee_code"],
          full_name: options.result[0]["full_name"],
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
