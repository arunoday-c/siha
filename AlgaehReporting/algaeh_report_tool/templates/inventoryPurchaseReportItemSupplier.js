// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    const _ = options.loadash;
    // const utilities = new algaehUtilities();
    try {
      let input = {};
      let params = options.args.reportParams;

      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //utilities.logger().log("decimal_places:", crypto.decimal_places);

      let str = "";

      if (input.hospital_id > 0) {
        str += ` and POH.hospital_id= ${input.hospital_id}`;
      }

      if (input.item_id > 0) {
        str += ` and POD.inv_item_id= ${input.item_id}`;
      }
      if (input.vendor_id > 0) {
        str += ` and POH.vendor_id= ${input.vendor_id}`;
      }

      // if (input.status_id > 0) {
      // 	str += ` and A.appointment_status_id= ${input.status_id}`;
      // }
      options.mysql
        .executeQuery({
          query: `
          SELECT INV.item_code,INV.item_description,POH.delivery_note_number,
          POH.dn_date,POH.dn_from,POH.inventory_location_id,
          POH.location_type,VN.vendor_code,ITL.vendor_batchno,VN.vendor_name,POH.vendor_id,
          POH.purchase_order_id,POH.sub_total,POH.detail_discount,POH.net_total,
          POH.total_tax,POH.net_payable,POH.created_by,POH.hospital_id,
          POD.po_quantity,POD.dn_quantity,POD.free_qty,POD.unit_cost,POD.sales_price,
          POD.extended_cost,POD.discount_percentage,POD.discount_amount,POD.net_extended_cost,POD.total_amount,PO.purchase_number,PO.po_date
          FROM hims_f_procurement_dn_detail POD
          inner join hims_f_procurement_dn_header POH on POH.hims_f_procurement_dn_header_id = POD.hims_f_procurement_dn_header_id
          inner join hims_d_vendor VN on VN.hims_d_vendor_id = POH.vendor_id
          inner join hims_d_inventory_item_master INV on INV.hims_d_inventory_item_master_id = POD.inv_item_id
          left join hims_m_inventory_item_location ITL on ITL.item_id = POD.inv_item_id
          left join hims_f_procurement_po_header PO on PO.hims_f_procurement_po_header_id = POD.purchase_order_header_id
        where POH.cancelled = 'N' ${str} order by PO.po_date DESC;
          `,
          printQuery: true,
        })
        .then((result) => {
          if (result.length > 0) {
          }

          const net_po_quantity = _.sumBy(result, (s) =>
            parseFloat(s.po_quantity)
          );
          const net_dn_quantity = _.sumBy(result, (s) =>
            parseFloat(s.dn_quantity)
          );
          const net_free_qty = _.sumBy(result, (s) => parseFloat(s.free_qty));
          const net_unit_cost = _.sumBy(result, (s) => parseFloat(s.unit_cost));
          const net_sales_price = _.sumBy(result, (s) =>
            parseFloat(s.sales_price)
          );

          resolve({
            result: result,
            net_po_quantity,
            net_dn_quantity,
            net_free_qty,
            net_unit_cost,
            net_sales_price,
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
