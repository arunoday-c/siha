// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      options.mysql
        .executeQuery({
          query:
            "SELECT item_id,batchno,expirydt,qtyhand,cost_uom,avgcost,barcode,sale_price,sales_uom from\
           hims_m_item_location where inventory_location_id=? and hospital_id=?;",
          values: [input.location_id, input.hospital_id],
          printQuery: true
        })
        .then(results => {
          resolve({
            details: results
          });
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
