// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      const params = options.args.reportParams;
      const { decimal_places, symbol_position, currency_symbol } =
        options.args.crypto;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      let strQuery = "";

      if (input.location_id > 0) {
        strQuery += ` and IL.inventory_location_id= ${input.location_id}`;
      }

      if (input.group_id > 0) {
        strQuery += ` and  IM.group_id= ${input.group_id}`;
      }

      if (input.category_id > 0) {
        strQuery += ` and  IM.category_id= ${input.category_id}`;
      }
      if (input.item_id > 0) {
        strQuery += ` and  IL.item_id= ${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query: `
          SELECT SH.hims_f_inventory_stock_header_id,SH.document_number,SH.docdate,IL.location_description, IG.group_description,IC.category_desc,
          INV.item_code,INV.item_description,SD.vendor_batchno,IU.uom_description,SD.barcode,SD.batchno,SD.expiry_date,SD.quantity,SD.unit_cost,SD.sales_price,SD.extended_cost
          FROM hims_f_inventory_stock_detail SD
          inner join hims_f_inventory_stock_header SH on SH.hims_f_inventory_stock_header_id = SD.inventory_stock_header_id
          inner join hims_d_inventory_item_master INV on INV.hims_d_inventory_item_master_id = SD.item_id
          inner join hims_d_inventory_uom IU on IU.hims_d_inventory_uom_id = SD.uom_id
          inner join hims_d_inventory_item_group IG on IG.hims_d_inventory_item_group_id = SD.item_group_id
          inner join hims_d_inventory_tem_category IC on IC.hims_d_inventory_tem_category_id = SD.item_category_id
          inner join hims_d_inventory_location IL on IL.hims_d_inventory_location_id = SD.location_id
          where SH.hospital_id=? and date(SH.docdate) between date(?) and date(?) ${strQuery}; `,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((result) => {
          options.mysql.releaseConnection();

          if (result.length > 0) {
            const nationgWiseEmp = _.chain(result)
              .groupBy((g) => g.hims_f_inventory_stock_header_id)
              .map((m) => {
                return {
                  purchase_number: m[0].document_number,
                  po_date: m[0].docdate,
                  //   const total_cost = _.chain(item)
                  //   .sumBy((s) => parseFloat(m[0].extended_cost))
                  //   .value(),
                  //   vendor_name: m[0].vendor_name,
                  //   net_total: m[0].net_total,
                  poitems: m,
                };
              })
              .value();

            resolve({
              result: nationgWiseEmp,
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
              decimalOnly: {
                decimal_places,
                addSymbol: false,
                symbol_position,
                currency_symbol,
              },
              currencyOnly: {
                decimal_places,
                addSymbol: true,
                symbol_position,
                currency_symbol,
              },
            });
          }
        })
        .catch((e) => {
          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
