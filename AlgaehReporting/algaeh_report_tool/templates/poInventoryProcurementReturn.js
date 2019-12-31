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
          item.dn_quantity = parseFloat(item["dn_quantity"]).toFixed(
            decimal_places
          );
          item.qtyhand = parseFloat(item["qtyhand"]).toFixed(decimal_places);
          item.return_qty = parseFloat(item["return_qty"]).toFixed(
            decimal_places
          );
          item.unit_cost = parseFloat(item["unit_cost"]).toFixed(
            decimal_places
          );
          item.extended_cost = parseFloat(item["extended_cost"]).toFixed(
            decimal_places
          );
          item.discount_percentage = parseFloat(
            item["discount_percentage"]
          ).toFixed(decimal_places);
          item.discount_amount = parseFloat(item["discount_amount"]).toFixed(
            decimal_places
          );
          item.net_extended_cost = parseFloat(
            item["net_extended_cost"]
          ).toFixed(decimal_places);
          item.tax_amount = parseFloat(item["tax_amount"]).toFixed(
            decimal_places
          );
          item.total_amount = parseFloat(item["total_amount"]).toFixed(
            decimal_places
          );

          return item;
        });

        resolve({
          return_total: parseFloat(options.result[0]["return_total"]).toFixed(
            decimal_places
          ),
          purchase_return_number: options.result[0]["purchase_return_number"],
          return_date: options.result[0]["return_date"],
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
