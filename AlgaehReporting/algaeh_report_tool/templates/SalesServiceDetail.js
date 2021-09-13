// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      // const utilities = new algaehUtilities();
      let input = {};
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      if (input.from_location_id > 0) {
        strQuery += ` and H.from_location_id= ${input.from_location_id}`;
      }
      if (input.to_location_id > 0) {
        strQuery += ` and H.to_location_id= ${input.to_location_id}`;
      }

      if (
        input.item_id !== null &&
        input.item_id !== undefined &&
        input.item_id !== ""
      ) {
        strQuery += ` and SIS.services_id = ${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query: `
        SELECT * 
        FROM hims_f_sales_invoice_header as SI
        inner join hims_f_sales_invoice_services SIS on SIS.sales_invoice_header_id = SI.hims_f_sales_invoice_header_id
        inner join hims_d_services S on S.hims_d_services_id = SIS.services_id
        inner join hims_d_customer CUS on CUS.hims_d_customer_id = SI.customer_id
        where SI.sales_invoice_mode='S' and date(SI.invoice_date) between date(?) and date(?) ${strQuery}; `,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const item_details = _.chain(result)
              .groupBy((g) => g.hims_f_sales_invoice_header_id)
              .map((m) => {
                return {
                  invoice_number: m[0].invoice_number,
                  customer_name: m[0].customer_name,
                  invoice_date: moment(m[0].invoice_date).format("DD/MM/YYYY"),
                  // total_net_extended_cost: m[0].net_extended_cost,

                  sum_total_net_extended_cost: options.currencyFormat(
                    _.sumBy(m, (s) => parseFloat(s.net_extended_cost)),
                    options.args.crypto
                  ),
                  transfer_items: m,
                };
              })
              .value();

            resolve({
              result: item_details,
              currencyOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
              // sum_total_net_extended_cost,
            });
          } else {
            resolve({
              result: result,
              currencyOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
              // sum_total_net_extended_cost: 0,
            });
          }
        })
        .catch((e) => {
          console.log("e:", e);
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
