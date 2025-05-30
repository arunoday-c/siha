// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

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

      options.mysql
        .executeQuery({
          query: `select H.*,D.*, V.vendor_name,IC.category_desc,IM.item_code, IM.item_description, IU.uom_description
          from hims_f_procurement_po_return_header H
          inner join hims_f_procurement_po_return_detail D on D.po_return_header_id= H.hims_f_procurement_return_po_header_id
          inner join hims_d_inventory_item_master IM on IM.hims_d_inventory_item_master_id = D.inv_item_id
          left join hims_d_inventory_tem_category IC on IM.category_id= IC.hims_d_inventory_tem_category_id 
          inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = D.inventory_uom_id
          inner join hims_d_vendor V on V.hims_d_vendor_id = H.vendor_id
          where po_return_from = 'INV' and date(return_date)  between date(?) and date(?) and hospital_id=? ${strQuery}; `,
          values: [input.from_date, input.to_date, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const nationgWiseEmp = _.chain(result)
              .groupBy((g) => g.hims_f_procurement_return_po_header_id)
              .map((m) => {
                return {
                  purchase_return_number: m[0].purchase_return_number,
                  return_date: m[0].return_date,
                  vendor_name: m[0].vendor_name,
                  net_total: m[0].net_total,
                  poitems: m,
                };
              })
              .value();

            console.log("nationgWiseEmp", nationgWiseEmp);

            resolve({
              result: nationgWiseEmp,
              net_total: options.currencyFormat(
                _.sumBy(nationgWiseEmp, (s) => parseFloat(s.net_total)),
                options.args.crypto
              ),
              currencyOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
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
