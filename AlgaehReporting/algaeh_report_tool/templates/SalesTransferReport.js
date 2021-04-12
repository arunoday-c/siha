// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      // const utilities = new algaehUtilities();
      let input = {};
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;
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

      options.mysql
        .executeQuery({
          query: `
          SELECT SI.hims_f_sales_invoice_header_id,SI.invoice_number,SI.invoice_date,IMC.category_desc,IM.item_code, IM.item_description, IU.uom_description,DNB.dispatch_quantity,
          DNB.unit_cost, DNB.net_extended_cost,CUS.customer_name
          FROM hims_f_sales_invoice_header SI
          inner join hims_f_sales_invoice_detail SID on SID.sales_invoice_header_id = SI.hims_f_sales_invoice_header_id
          inner join hims_f_sales_dispatch_note_header DN on DN.hims_f_dispatch_note_header_id = SID.dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_detail DND on DND.dispatch_note_header_id = SID.dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_batches DNB on DNB.sales_dispatch_note_detail_id = DND.hims_f_sales_dispatch_note_detail_id
          inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = DNB.item_id
          inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = DNB.uom_id
          inner join hims_d_inventory_tem_category IMC on IMC.hims_d_inventory_tem_category_id = DNB.item_category_id
          inner join hims_d_customer CUS on CUS.hims_d_customer_id = SI.customer_id
        where date(SI.invoice_date) between date(?) and date(?) ${strQuery}; `,
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
