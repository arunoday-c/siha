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

      if (
        input.location_id !== null &&
        input.location_id !== undefined &&
        input.location_id !== ""
      ) {
        str += ` and inventory_location_id = ${input.location_id}`;
      }
      if (
        input.item_id !== null &&
        input.item_id !== undefined &&
        input.item_id !== ""
      ) {
        str += ` and hims_d_inventory_item_master_id = ${input.item_id}`;
      }
      if (
        input.category_id !== null &&
        input.category_id !== undefined &&
        input.category_id !== ""
      ) {
        str += ` and category_id = ${input.category_id}`;
      }

      options.mysql
        .executeQuery({
          query: `select * from item_stock where hospital_id=? ${str}; `,
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((results) => {
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
                category_desc: desc.category_desc,
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
