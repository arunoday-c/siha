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
      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);
      // let current_date = moment().format("YYYY-MM-DD");

      //   console.log("item_id: ", input.item_id);
      if (
        input.location_id !== null &&
        input.location_id !== undefined &&
        input.location_id !== ""
      ) {
        str += ` and IL.inventory_location_id = ${input.location_id}`;
      }
      if (
        input.item_id !== null &&
        input.item_id !== undefined &&
        input.item_id !== ""
      ) {
        str += ` and IL.item_id = ${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query:
            // "SET @sql = NULL; \
            // SELECT GROUP_CONCAT(DISTINCT \
            // CONCAT('CASE WHEN MAX(ILO.location_description) = ''',COALESCE(location_description,'None') ,\
            // ''' THEN SUM(qtyhand) END `', COALESCE(location_description,'None'), '`'))\
            // INTO @sql\
            // FROM hims_d_inventory_item_master IM\
            // left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id=IL.item_id \
            // left join hims_d_inventory_location ILO on ILO.hims_d_inventory_location_id=IL.inventory_location_id; \
            // SET @sql = CONCAT('SELECT MAX(item_description) as item_description,item_code, IL.inventory_location_id, sum(IL.qtyhand) as  qtyhand, \
            // hims_d_inventory_item_master_id,IL.batchno, ', @sql, ' \
            // FROM hims_d_inventory_item_master IM \
            // left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id=IL.item_id \
            // left join hims_d_inventory_location ILO on ILO.hims_d_inventory_location_id=IL.inventory_location_id \
            // where IL.hospital_id='?'  " +
            // str +
            // " \
            // GROUP BY IL.inventory_location_id,IM.hims_d_inventory_item_master_id,IL.batchno;'); \
            // PREPARE stmt FROM @sql; \
            // EXECUTE stmt; \
            // DEALLOCATE PREPARE stmt;",
            "select * from item_stock where hospital_id=?;",
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
          // console.log("results====>", results);
          // const getTable = results.find((f) => Array.isArray(f));
          // const {
          //   item_code,
          //   item_description,
          //   inventory_location_id,
          //   qtyhand,
          //   hims_d_inventory_item_master_id,
          //   batchno,
          //   ...others
          // } = _.head(results);
          // const columns = Object.keys(others).map((item) => {
          //   return item;
          // });
          // let report = [];
          // _.chain(getTable)
          //   .groupBy((g) => g.hims_d_inventory_item_master_id)
          //   .forEach((details, key) => {
          //     const desc = _.head(details);
          //     let innerObject = {
          //       item_description: desc.item_description,
          //       item_code: desc.item_code,
          //     };
          //     for (let i = 0; i < columns.length; i++) {
          //       innerObject[columns[i]] = _.sumBy(details, (s) =>
          //         parseFloat(s[columns[i]] ? s[columns[i]] : 0)
          //       );
          //     }
          //     report.push(innerObject);
          //   })
          //   .value();
          // resolve({
          //   columns,
          //   details: report,
          // });
          // resolve({});
          const columns = _.chain(results)
            .groupBy((g) => g.inventory_location_id)
            .map((details) => {
              const { location_description } = _.head(details);
              return location_description;
            })
            .value();

          let report = [];
          _.chain(results)
            .groupBy((g) => g.hims_d_inventory_item_master_id)
            .forEach((details, key) => {
              const desc = _.head(details);
              let innerObject = {
                item_description: desc.item_description,
                item_code: desc.item_code,
              };
              let items_inner_object = {};
              for (let i = 0; i < columns.length; i++) {
                const filteredData = details.filter(
                  (f) => f.location_description === columns[i]
                );

                items_inner_object[columns[i]] =
                  filteredData.length === 0
                    ? 0
                    : _.sumBy(filteredData, (s) =>
                        parseFloat(s["qtyhand"] ? s["qtyhand"] : 0)
                      );
              }
              let total_item_count = 0;
              Object.keys(items_inner_object).forEach((itm) => {
                total_item_count =
                  total_item_count + parseFloat(items_inner_object[itm]);
              });
              report.push({
                ...innerObject,
                ...items_inner_object,
                Total: total_item_count,
              });
            })
            .value();

          columns.push("Total");
          resolve({
            columns,
            details: report,
          });
        })
        .catch((error) => {
          console.log("error==>", error);
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
