// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);
      let current_date = moment().format("YYYY-MM-DD");

      console.log("item_id: ", input.item_id);
      if (input.item_id !== null && input.item_id !== undefined) {
        str += ` and item_code_id = ${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query:
            "SELECT PTH.batchno, PTH.expiry_date, sum(PTH.transaction_qty) as transaction_qty, IM.item_code, IM.item_description, \
            IU.uom_description, PTH.transaction_total FROM hims_f_inventory_trans_history PTH \
            inner join hims_d_inventory_item_master IM  on IM.hims_d_inventory_item_master_id = PTH.item_code_id \
            inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = PTH.transaction_uom \
            where date(PTH.transaction_date)  between date(?) and date(?) and from_location_id=? and hospital_id=?" +
            str +
            " group by item_code_id",
          values: [
            input.stockUsed,
            current_date,
            input.location_id,
            input.hospital_id
          ],
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
