// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const { decimal_places } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select hims_f_procurement_return_po_header_id, purchase_return_number,
          date(H.return_date) as return_date , H.po_return_from, H.return_total,
          D.hims_f_procurement_po_return_detail_id, D.phar_item_id,D.net_extended_cost,D.batchno,
          D.vendor_batchno, D.tax_amount,D.total_amount,D.expiry_date,L.location_description, IM.item_code,
          IM.item_description,V.vendor_name,U.uom_description,ROUND(D.dn_quantity, 0) as dn_quantity, 
          ROUND(D.qtyhand, 0) as qtyhand,  ROUND(D.qtyhand - D.return_qty, 0) as after_return_qty,
          Round(D.return_qty, 0) as return_qty,ROUND(D.unit_cost, ${decimal_places}) as unit_cost,
          ROUND(D.discount_amount, ${decimal_places}) as discount_amount, ROUND(D.extended_cost, 
          ${decimal_places}) as extended_cost,D.discount_percentage,
          GRN.grn_number,GRN.inovice_number, GRN.invoice_date,PO.purchase_number
          from hims_f_procurement_po_return_header H
          inner join hims_f_procurement_po_return_detail D on H.hims_f_procurement_return_po_header_id =D.po_return_header_id
          left join hims_f_procurement_grn_header GRN on GRN.hims_f_procurement_grn_header_id = H.grn_header_id
          left join hims_f_procurement_po_header PO on PO.hims_f_procurement_po_header_id = GRN.po_id
          left join hims_d_inventory_item_master IM on D.inv_item_id=IM.hims_d_inventory_item_master_id
          left join hims_d_inventory_location L on H.inventory_location_id=L.hims_d_inventory_location_id
          left join hims_d_vendor V on H.vendor_id=V.hims_d_vendor_id
          left join hims_d_inventory_uom U on D.inventory_uom_id=U.hims_d_inventory_uom_id
          where H.po_return_from='INV' and purchase_return_number=? order by IM.item_description asc;`,
          values: [input.purchase_return_number],
          printQuery: true,
        })
        .then((result) => {
          const decimal_places = options.args.crypto.decimal_places;
          if (result.length > 0) {
            resolve({
              return_total: result[0]["return_total"],
              purchase_return_number: result[0]["purchase_return_number"],
              return_date: result[0]["return_date"],
              location_description: result[0]["location_description"],
              vendor_name: result[0]["vendor_name"],
              sub_department_name: result[0]["sub_department_name"],
              employee_code: result[0]["employee_code"],
              full_name: result[0]["full_name"],
              grn_number: result[0]["grn_number"],
              inovice_number: result[0]["inovice_number"],
              invoice_date: result[0]["invoice_date"],
              purchase_number: result[0]["purchase_number"],
              detailList: result,
            });
          } else {
            resolve({ detailList: result });
          }
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
