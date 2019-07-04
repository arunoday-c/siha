import algaehUtilities from "algaeh-utilities/utilities";
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      //   select hims_f_procurement_dn_header_id,delivery_note_number,date(dn_date)as dn_date,H.sub_total,H.detail_discount,H.net_total,
      //   H.total_tax,H.net_payable ,L.location_description  ,V.vendor_name ,PO.purchase_number
      //   from hims_f_procurement_dn_header H  inner join hims_f_procurement_po_header PO on
      //   H.purchase_order_id=PO.hims_f_procurement_po_header_id
      //   left join hims_d_pharmacy_location L
      //   on H.pharmcy_location_id=L.hims_d_pharmacy_location_id
      //   left join hims_d_vendor V on H.vendor_id=V.hims_d_vendor_id
      //   where dn_from='PHR' and H.hospital_id=? and  delivery_note_number=?;
      //   select D.hims_f_procurement_dn_detail_id,D.hims_f_procurement_dn_header_id,
      //   D.phar_item_id,IM.item_code,IM.item_description,
      //   D.po_quantity,D.dn_quantity,D.unit_cost,D.extended_cost,D.discount_percentage,D.discount_amount,
      //   D.net_extended_cost,D.quantity_recieved_todate,D.quantity_outstanding,
      //   D.tax_amount,D.tax_percentage,D.total_amount,D.batchno
      //   from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D
      //   on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
      //   left  join hims_d_item_master IM on D.phar_item_id=IM.hims_d_item_master_id
      //   where H.hospital_id=? and H.dn_from='PHR' and delivery_note_number=?;
      //   select B.hims_f_procurement_dn_batches_id,B.hims_f_procurement_dn_detail_id,B.barcode,B.po_quantity,B.dn_quantity,
      //   B.unit_cost,B.extended_cost,B.discount_percentage,B.discount_amount,B.net_extended_cost,B.quantity_recieved_todate,
      //   B.quantity_outstanding,B.tax_amount,B.total_amount,B.batchno from hims_f_procurement_dn_header H  inner join hims_f_procurement_dn_detail D
      //   on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
      //   inner join hims_f_procurement_dn_batches B on D.hims_f_procurement_dn_detail_id=B.hims_f_procurement_dn_detail_id
      //   where H.hospital_id=? and H.dn_from='PHR' and delivery_note_number=?;
      const utilities = new algaehUtilities();
      const header = options.result[0][0];
      const details = options.result[1];
      const subDetails = options.result[2];
      const outputArray = [];

      details.forEach(item => {
        const batches = subDetails.filter(sub => {
          return (
            sub["hims_f_procurement_dn_detail_id"] ==
            item["hims_f_procurement_dn_detail_id"]
          );
        });

        outputArray.push({ ...item, batches });
      });

      utilities.logger().log("ffff", { ...header, details: outputArray });
      resolve({ ...header, details: outputArray });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
