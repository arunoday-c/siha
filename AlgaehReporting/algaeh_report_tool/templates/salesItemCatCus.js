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

      delete crypto_data.currency_symbol;
      crypto_data.currency_symbol = "";
      options.mysql
        .executeQuery({
          query: `SELECT 
            MAX(H.customer_id) as customer_id,
            MAX(NB.item_category_id) as item_category_id,
           MAX(C.customer_name) AS customer_name,
           MAX(IC.category_desc) AS category_desc,
           SUM(NB.net_extended_cost) AS net_extended_cost,
           SUM(NB.total_amount) AS total_amount
           FROM
           hims_f_sales_invoice_header H
           INNER JOIN hims_f_sales_invoice_detail D ON H.hims_f_sales_invoice_header_id = D.sales_invoice_header_id
           INNER JOIN hims_f_sales_dispatch_note_header NH ON NH.hims_f_dispatch_note_header_id = D.dispatch_note_header_id
           INNER JOIN hims_f_sales_dispatch_note_detail ND ON ND.dispatch_note_header_id = NH.hims_f_dispatch_note_header_id
           INNER JOIN hims_f_sales_dispatch_note_batches NB ON ND.hims_f_sales_dispatch_note_detail_id = NB.sales_dispatch_note_detail_id
           INNER JOIN hims_d_inventory_tem_category IC ON IC.hims_d_inventory_tem_category_id = NB.item_category_id
           INNER JOIN hims_d_customer C ON C.hims_d_customer_id = H.customer_id
           where DATE(invoice_date) between date(?) AND date(?) AND H.is_cancelled='N'
           GROUP BY NB.item_category_id, H.customer_id;`,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((results) => {
          const columns = _.chain(results)
            .groupBy((g) => g.customer_id)
            .map((details) => {
              const { customer_name } = _.head(details);
              return customer_name;
            })
            .value();

          let report = [];
          _.chain(results)
            .groupBy((g) => g.item_category_id)
            .forEach((details, key) => {
              const desc = _.head(details);
              let innerObject = {
                category_desc: desc.category_desc,
              };
              let items_inner_object = {};
              for (let i = 0; i < columns.length; i++) {
                const filteredData = details.find(
                  (f) => f.customer_name === columns[i]
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
          resolve({
            columns,
            details: report,
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
