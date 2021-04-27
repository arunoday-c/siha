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
      console.log("input=", input);

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      if (input.hospital_id > 0) {
        strQuery += ` and SI.hospital_id= ${input.hospital_id}`;
      }

      if (input.vat) {
        strQuery += ` and tax_percentage= ${input.vat}`;
      }
      console.log("strQuery===", strQuery);

      options.mysql
        .executeQuery({
          query: `
          SELECT SI.hims_f_sales_invoice_header_id,SI.invoice_number,SI.invoice_date,
          IMC.category_desc,IM.item_code as code,IM.item_description as name,net_extended_cost,
          TRUNCATE(tax_percentage,2) as tax_percentage,tax_amount,total_amount,CUS.customer_name
          FROM hims_f_sales_invoice_header SI
          inner join hims_f_sales_invoice_detail SID on SID.sales_invoice_header_id = SI.hims_f_sales_invoice_header_id
          inner join hims_f_sales_dispatch_note_header DN on DN.hims_f_dispatch_note_header_id = SID.dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_detail DND on DND.dispatch_note_header_id = SID.dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_batches DNB on DNB.sales_dispatch_note_detail_id = DND.hims_f_sales_dispatch_note_detail_id
          inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = DNB.item_id
          inner join hims_d_inventory_tem_category IMC on IMC.hims_d_inventory_tem_category_id = DNB.item_category_id
          inner join hims_d_customer CUS on CUS.hims_d_customer_id = SI.customer_id
          where SI.sales_invoice_mode='I' and date(SI.invoice_date) between date(?) and date(?) and DNB.tax_percentage <> '0.000' ${strQuery} order by SI.sales_invoice_mode desc, DNB.tax_percentage; 
          SELECT SI.hims_f_sales_invoice_header_id,SI.invoice_number,SI.invoice_date, 'Services' as category_desc,
          S.service_code as code,S.service_name as name,SIS.net_extended_cost, TRUNCATE(SIS.tax_percentage,2) as tax_percentage,SIS.tax_amount,SIS.total_amount,CUS.customer_name
          FROM hims_f_sales_invoice_header as SI
          inner join hims_f_sales_invoice_services SIS on SIS.sales_invoice_header_id = SI.hims_f_sales_invoice_header_id
          inner join hims_d_services S on S.hims_d_services_id = SIS.services_id
          inner join hims_d_customer CUS on CUS.hims_d_customer_id = SI.customer_id
          where SI.sales_invoice_mode='S' and date(SI.invoice_date) between date(?) and date(?) and SIS.tax_percentage <> '0.000' ${strQuery} order by SI.sales_invoice_mode desc, SIS.tax_percentage;`,
          values: [
            input.from_date,
            input.to_date,
            input.from_date,
            input.to_date,
          ],
          printQuery: true,
        })
        .then((ress) => {
          let result = ress[0];
          result = result.concat(ress[1]);
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const item_details = _.chain(result)
              .groupBy((g) => g.tax_percentage)
              .map((m) => {
                return {
                  tax_percentage: m[0].tax_percentage,
                  net_sum_tax_amount: _.sumBy(m, (s) =>
                    parseFloat(s.tax_amount)
                  ),

                  catSum: _.chain(m)
                    .groupBy((g) => g.category_desc)
                    .map((catSumItem) => {
                      const { category_desc } = _.head(catSumItem);
                      return {
                        category_desc: category_desc,
                        sum_tax_amount: options.currencyFormat(
                          _.sumBy(catSumItem, (t) => parseFloat(t.tax_amount)),
                          options.args.crypto
                        ),
                      };
                    })
                    .value(),
                };
              })
              .value();

            resolve({
              result: item_details,
              total_net_sum_tax_amount: _.sumBy(
                item_details,
                (s) => s.net_sum_tax_amount
              ),
              currencyOnly: {
                decimal_places,
                addSymbol: true,
                symbol_position,
                currency_symbol,
              },
            });
          } else {
            resolve({
              result: result,
              currencyOnly: {
                decimal_places,
                addSymbol: true,
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
