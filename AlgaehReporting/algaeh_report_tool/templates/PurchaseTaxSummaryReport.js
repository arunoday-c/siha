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
          SELECT REH.hims_f_procurement_grn_header_id,REH.grn_for,REH.grn_number,REH.grn_date,VN.vendor_name,ITM.item_code,ITM.item_description ,ITMC.category_desc,DEB.net_extended_cost,DEB.tax_percentage, DEB.tax_amount, DEB.total_amount
        FROM hims_f_procurement_grn_header REH
        inner join hims_f_procurement_grn_detail RED on RED.grn_header_id=REH.hims_f_procurement_grn_header_id
        inner join hims_f_procurement_dn_detail DED on DED.hims_f_procurement_dn_header_id=RED.dn_header_id
        inner join hims_f_procurement_dn_batches DEB on DEB.hims_f_procurement_dn_detail_id=DED.hims_f_procurement_dn_detail_id
        inner join hims_d_vendor VN on VN.hims_d_vendor_id = REH.vendor_id
        inner join hims_d_inventory_item_master ITM on ITM.hims_d_inventory_item_master_id = DEB.inv_item_id
        inner join hims_d_inventory_tem_category ITMC on ITMC.hims_d_inventory_tem_category_id = ITM.category_id
        where date(REH.grn_date) between date(?) and date(?) and DEB.tax_percentage <> '0.000' ${strQuery} order by DEB.tax_percentage;
        SELECT REH.hims_f_procurement_grn_header_id,REH.grn_for,REH.grn_number,REH.grn_date,VN.vendor_name,ITM.item_code,ITM.item_description ,ITMC.category_desc,DEB.net_extended_cost,DEB.tax_percentage, DEB.tax_amount, DEB.total_amount
        FROM hims_f_procurement_grn_header REH
        inner join hims_f_procurement_grn_detail RED on RED.grn_header_id=REH.hims_f_procurement_grn_header_id
        inner join hims_f_procurement_dn_detail DED on DED.hims_f_procurement_dn_header_id=RED.dn_header_id
        inner join hims_f_procurement_dn_batches DEB on DEB.hims_f_procurement_dn_detail_id=DED.hims_f_procurement_dn_detail_id
        inner join hims_d_vendor VN on VN.hims_d_vendor_id = REH.vendor_id
        inner join hims_d_item_master ITM on ITM.hims_d_item_master_id = DEB.phar_item_id
        inner join hims_d_item_category ITMC on ITMC.hims_d_item_category_id = ITM.category_id
        where date(REH.grn_date) between date(?) and date(?) and DEB.tax_percentage <> '0.000' ${strQuery} order by DEB.tax_percentage;`,
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
