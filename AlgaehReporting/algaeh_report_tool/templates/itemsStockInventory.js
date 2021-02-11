// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const moment = options.moment;
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);
      let current_date = moment().format("YYYY-MM-DD");

      //   console.log("item_id: ", input.item_id);
      if (input.location_id !== null && input.location_id !== undefined) {
        str += ` and IL.inventory_location_id = ${input.location_id}`;
      }
      if (input.item_id !== null && input.item_id !== undefined) {
        str += ` and IL.item_id = ${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query:
            "SET @sql = NULL; \
            SELECT GROUP_CONCAT(DISTINCT \
            CONCAT('CASE WHEN MAX(ILO.location_description) = ''', location_description,\
            ''' THEN SUM(qtyhand) END `', location_description, '`'))\
            INTO @sql\
            FROM hims_d_inventory_item_master IM\
            left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id=IL.item_id \
            inner join hims_d_inventory_location ILO on ILO.hims_d_inventory_location_id=IL.inventory_location_id; \
            SET @sql = CONCAT('SELECT MAX(item_description)as item_description,IL.inventory_location_id, sum(IL.qtyhand) as  qtyhand, \
            hims_d_inventory_item_master_id,IL.batchno, ', @sql, ' \
            FROM hims_d_inventory_item_master IM \
            left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id=IL.item_id \
            inner join hims_d_inventory_location ILO on ILO.hims_d_inventory_location_id=IL.inventory_location_id \
            where IL.hospital_id='?'  " +
            str +
            " \
            GROUP BY IL.inventory_location_id,IM.hims_d_inventory_item_master_id,IL.batchno;'); \
            PREPARE stmt FROM @sql; \
            EXECUTE stmt; \
            DEALLOCATE PREPARE stmt;",
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
          _.chain(results).resolve({
            details: results,
          });
        })
        .catch((error) => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
