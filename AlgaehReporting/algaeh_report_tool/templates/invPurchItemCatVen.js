// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const moment = options.moment;
      let input = {};
      let params = options.args.reportParams;
      // const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let crypto_data = { ...options.args.crypto, addSymbol: false };
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
      delete crypto_data.currency_symbol;
      crypto_data.currency_symbol = "";
      options.mysql
        .executeQuery({
          query: `SELECT 
          MAX(H.vendor_id) as vendor_id,
          MAX(DB.inv_item_category_id) as inv_item_category_id,
          MAX(V.vendor_name) AS vendor_name,
          MAX(IC.category_desc) AS category_desc,
          SUM(DB.net_extended_cost) AS net_extended_cost,
          SUM(DB.total_amount) AS total_amount
          FROM
          hims_f_procurement_grn_header H
          INNER JOIN hims_f_procurement_grn_detail D ON H.hims_f_procurement_grn_header_id = D.grn_header_id
          INNER JOIN hims_f_procurement_dn_header DH ON DH.hims_f_procurement_dn_header_id = D.dn_header_id
          INNER JOIN hims_f_procurement_dn_detail DD ON DD.hims_f_procurement_dn_header_id = DH.hims_f_procurement_dn_header_id
          INNER JOIN hims_f_procurement_dn_batches DB ON DD.hims_f_procurement_dn_detail_id = DB.hims_f_procurement_dn_detail_id
          INNER JOIN hims_d_inventory_tem_category IC ON IC.hims_d_inventory_tem_category_id = DB.inv_item_category_id
          INNER JOIN hims_d_vendor V ON V.hims_d_vendor_id = H.vendor_id
           where DATE(grn_date) between date(?) AND date(?) AND grn_for='INV'
           GROUP BY DB.inv_item_category_id, H.vendor_id;`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const columns = _.chain(results)
            .groupBy((g) => g.vendor_id)
            .map((details) => {
              const { vendor_name } = _.head(details);
              return vendor_name;
            })
            .value();

          let report = [];
          _.chain(results)
            .groupBy((g) => g.inv_item_category_id)
            .forEach((details, key) => {
              const desc = _.head(details);
              let innerObject = {
                category_desc: desc.category_desc,
              };
              let items_inner_object = {};
              for (let i = 0; i < columns.length; i++) {
                const filteredData = details.find(
                  (f) => f.vendor_name === columns[i]
                );

                items_inner_object[columns[i]] =
                  filteredData === undefined ? 0 : filteredData.total_amount;
              }
              //   _.sumBy(filteredData, (s) =>
              //     parseFloat(s["total_amount"] ? s["total_amount"] : 0)
              //   );
              let total_item_count = 0;

              Object.keys(items_inner_object).forEach((itm) => {
                total_item_count =
                  total_item_count + parseFloat(items_inner_object[itm]);

                items_inner_object[itm] = options.currencyFormat(
                  items_inner_object[itm],
                  crypto_data
                );
              });

              total_item_count = options.currencyFormat(
                total_item_count,
                crypto_data
              );
              report.push({
                ...innerObject,
                ...items_inner_object,
                Total: total_item_count,
              });
            })
            .value();
          columns.push("Total");

          let footer = [];
          for (let i = 0; i < columns.length; i++) {
            footer.push(
              _.sumBy(report, (s) =>
                parseFloat(s[columns[i]].replace(/,/g, ""))
              )
            );
          }

          resolve({
            columns,
            footer,
            details: report,
            currency: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
            currencyWithoutCurr: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
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
