// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      // const utilities = new algaehUtilities();

      let input = {};
      const params = options.args.reportParams;
      const hospital_id = options.args.crypto.hospital_id;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      // utilities.logger().log("input: ", input);

      const invoice_date = moment(input.invoice_date, "YYYY-MM-DD").format(
        "DD-MM-YYYY"
      );
      options.mysql
        .executeQuery({
          query: `select     hims_f_procurement_grn_header_id,grn_number,grn_for,date_format(grn_date,'%d-%m-%Y') as grn_date,dn_header_id
          ,D.hims_f_procurement_grn_detail_id,H.sub_total,detail_discount ,H.net_total  ,H.total_tax ,H.net_payable
          from  hims_f_procurement_grn_header H inner join  hims_f_procurement_grn_detail D
          on H.hims_f_procurement_grn_header_id=D.grn_header_id
          where H.hospital_id=? and H.grn_number=? and grn_for='PHR';
          select hims_f_procurement_dn_header_id,delivery_note_number, date_format(dn_date,'%d-%m-%Y') as dn_date,H.sub_total,H.detail_discount,H.net_total,
          H.total_tax,H.net_payable ,L.location_description  ,V.vendor_name ,PO.purchase_number,  date_format(PO.po_date,'%d-%m-%Y')as po_date
          from hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD
          on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join
          hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id   inner join hims_f_procurement_po_header PO on
          H.purchase_order_id=PO.hims_f_procurement_po_header_id
          left join hims_d_pharmacy_location L
          on H.pharmcy_location_id=L.hims_d_pharmacy_location_id
          left join hims_d_vendor V on H.vendor_id=V.hims_d_vendor_id
          where GH.hospital_id=? and GH.grn_number=? and GH.grn_for='PHR';
           select D.hims_f_procurement_dn_detail_id,D.hims_f_procurement_dn_header_id,
           D.phar_item_id,IM.item_code,IM.item_description,
           D.po_quantity,D.dn_quantity,D.unit_cost,D.extended_cost,D.discount_percentage,D.discount_amount,
           D.net_extended_cost,D.quantity_recieved_todate,D.quantity_outstanding,
           D.tax_amount,D.tax_percentage,D.total_amount,U.uom_description
           from hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD
          on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join
          hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id inner join hims_f_procurement_dn_detail D
           on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
           left  join hims_d_item_master IM on D.phar_item_id=IM.hims_d_item_master_id
           left join hims_d_pharmacy_uom U on D.pharmacy_uom_id=U.hims_d_pharmacy_uom_id
           where GH.hospital_id=? and GH.grn_number=? and GH.grn_for='PHR';
           select B.hims_f_procurement_dn_batches_id,B.hims_f_procurement_dn_detail_id,B.barcode,B.po_quantity,B.dn_quantity,
           B.unit_cost,B.extended_cost,B.discount_percentage,B.discount_amount,B.net_extended_cost,B.quantity_recieved_todate,
           B.quantity_outstanding,B.tax_amount,B.total_amount,B.batchno,B.sales_price from
           hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD
          on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join
          hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id   inner join hims_f_procurement_dn_detail D
           on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
           inner join hims_f_procurement_dn_batches B on D.hims_f_procurement_dn_detail_id=B.hims_f_procurement_dn_detail_id
           where GH.hospital_id=? and GH.grn_number=? and GH.grn_for='PHR' ;`,
          values: [
            hospital_id,
            input.grn_number,
            hospital_id,
            input.grn_number,
            hospital_id,
            input.grn_number,
            hospital_id,
            input.grn_number
          ],
          printQuery: false
        })
        .then(result => {
          const grn_details = result[0];

          const delv_headers = result[1];
          const delv_details = result[2];
          const delv_subDetails = result[3];

          const outputArray = [];

          grn_details.forEach(detail => {
            const dn_header = delv_headers.filter(item => {
              return (
                detail["dn_header_id"] ==
                item["hims_f_procurement_dn_header_id"]
              );
            });

            //looping each delivery note
            dn_header.forEach(dn => {
              const dn_details = delv_details.filter(dn_item => {
                return (
                  dn["hims_f_procurement_dn_header_id"] ==
                  dn_item["hims_f_procurement_dn_header_id"]
                );
              });

              const delivery_items = [];

              //delivery items of each delivery note
              dn_details.forEach(item => {
                const batches = delv_subDetails.filter(sub => {
                  return (
                    sub["hims_f_procurement_dn_detail_id"] ==
                    item["hims_f_procurement_dn_detail_id"]
                  );
                });
                delivery_items.push({ ...item, batches });
              });

              outputArray.push({
                ...dn,
                delivery_items: delivery_items
              });
            });
          });

          resolve({
            ...grn_details[0],
            inovice_number: input.inovice_number,
            location_description: outputArray[0].location_description,
            vendor_name: outputArray[0].vendor_name,
            purchase_number: outputArray[0].purchase_number,
            po_date: outputArray[0].po_date,
            invoice_date: invoice_date,
            details: outputArray
          });
          // utilities.logger().log("output: ", {
          //   ...grn_details[0],
          //   inovice_number: input.inovice_number,
          //   details: outputArray
          // });
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
