// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      const params = options.args.reportParams;
      // const hospital_id = options.args.crypto.hospital_id;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      // select  IH.*, ID.*, H.*, L.location_description  ,C.customer_name, C.arabic_customer_name,
      //         C.vat_number,C.address, SO.sales_order_number,SO.customer_po_no,
      //         SO.sales_order_date from hims_f_sales_invoice_header IH inner join  hims_f_sales_invoice_detail ID
      //         on IH.hims_f_sales_invoice_header_id=ID.sales_invoice_header_id
      //         inner join hims_f_sales_dispatch_note_header H  on ID.dispatch_note_header_id=H.hims_f_dispatch_note_header_id
      //         inner join hims_f_sales_order SO on H.sales_order_id=SO.hims_f_sales_order_id
      //         left join hims_d_inventory_location L on H.location_id=L.hims_d_inventory_location_id
      //         left join hims_d_customer C on IH.customer_id=C.hims_d_customer_id
      //         where IH.invoice_number=?;
      //         select D.*,U.uom_description, IM.item_code,IM.item_description
      //         from   hims_f_sales_invoice_header IH
      //         inner join  hims_f_sales_invoice_detail ID on IH.hims_f_sales_invoice_header_id=ID.sales_invoice_header_id
      //         inner join hims_f_sales_dispatch_note_header H  on ID.dispatch_note_header_id=H.hims_f_dispatch_note_header_id
      //         inner join hims_f_sales_dispatch_note_detail D on H.hims_f_dispatch_note_header_id= D. dispatch_note_header_id
      //         left  join hims_d_inventory_item_master IM on D.item_id=IM.hims_d_inventory_item_master_id
      //         left join hims_d_inventory_uom U on D.uom_id=U.hims_d_inventory_uom_id
      //         where IH.invoice_number=?;

      options.mysql
        .executeQuery({
          query: `select  H.*, C.customer_name, C.arabic_customer_name,C.vat_number,C.address, 
          SO.sales_order_number, SO.customer_po_no, SO.sales_order_date
          from  hims_f_sales_invoice_header H 
          inner join hims_d_customer C on H.customer_id = C.hims_d_customer_id
          inner join hims_f_sales_order SO on H.sales_order_id = SO.hims_f_sales_order_id
          where H.invoice_number=?;                    
          select B.*,SUM(dispatch_quantity) as dispatch_quantity, SUM(total_amount) as total_amount, IM.item_code,IM.item_description, ROUND(B.tax_percentage, 0) as tax_percentage from
          hims_f_sales_invoice_header IH 
          inner join  hims_f_sales_invoice_detail ID on IH.hims_f_sales_invoice_header_id=ID.sales_invoice_header_id  
          inner join hims_f_sales_dispatch_note_header H  on ID.dispatch_note_header_id=H.hims_f_dispatch_note_header_id 
          inner join hims_f_sales_dispatch_note_detail D on H.hims_f_dispatch_note_header_id= D. dispatch_note_header_id
          inner join hims_f_sales_dispatch_note_batches B on D.hims_f_sales_dispatch_note_detail_id=B.sales_dispatch_note_detail_id
          inner  join hims_d_inventory_item_master IM on B.item_id=IM.hims_d_inventory_item_master_id
          where IH.invoice_number=?  group by item_id order by IM.item_description asc;`,
          values: [
            input.invoice_number,
            input.invoice_number,
            input.invoice_number,
            input.invoice_number,
          ],
          printQuery: true,
        })
        .then((result) => {
          const grn_details = result[0];

          // const delv_headers = result[1];
          // const delv_details = result[2];
          const delv_subDetails = result[1];

          // const outputArray = [];

          // console.log("grn_details", grn_details)
          // console.log("delv_subDetails", delv_subDetails)

          // grn_details.forEach(detail => {
          //     const dn_header = delv_headers.filter(item => {
          //         return (
          //             detail["dispatch_note_header_id"] ==
          //             item["hims_f_dispatch_note_header_id"]
          //         );
          //     });

          //     //looping each dispatch note
          //     dn_header.forEach(dn => {
          //         // console.log("dn:", dn)
          //         const dn_details = delv_details.filter(dn_item => {
          //             return (
          //                 dn["hims_f_dispatch_note_header_id"] ==
          //                 dn_item["dispatch_note_header_id"]
          //             );
          //         });

          //         const dispatch_items = [];

          //         //dispatch items of each dispatch note
          //         dn_details.forEach(item => {
          //             const batches = delv_subDetails.filter(sub => {
          //                 return (
          //                     sub["sales_dispatch_note_detail_id"] ==
          //                     item["hims_f_sales_dispatch_note_detail_id"]
          //                 );
          //             });

          //             dispatch_items.push({ ...item, batches });
          //         });

          //         outputArray.push({
          //             ...dn,
          //             dispatch_items: dispatch_items
          //         });
          //     });
          // });

          // let result = ({ ...grn_details[0], delv_subDetails })
          // console.log("result", result)

          resolve({
            ...grn_details[0],
            invoice_date: moment(grn_details[0].invoice_date).format(
              "YYYY-MM-DD"
            ),
            // invoice_number: outputArray[0].invoice_number,
            // sales_order_date: outputArray[0].sales_order_date,
            // location_description: outputArray[0].location_description,
            // customer_name: outputArray[0].customer_name,
            // vat_number: outputArray[0].vat_number,
            // arabic_customer_name: outputArray[0].arabic_customer_name,
            // sales_order_number: outputArray[0].sales_order_number,
            // customer_po_no: outputArray[0].customer_po_no,
            // address: outputArray[0].address,
            details: delv_subDetails,
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
