const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";

      let input = {};
      let params = options.args.reportParams;

      // params.forEach(para => {
      //   input[para["name"]] = para["value"];
      // });

      //utilities.logger().log("input: ", input);

      options.mysql
        .executeQuery({
          query: `
          select hims_f_procurement_grn_header_id,grn_number,grn_for,
          sub_total,detail_discount ,net_total  ,total_tax ,net_payable 
          from  hims_f_procurement_grn_header where hospital_id=1 and grn_number='REE-190628HM61' and grn_for='INV';          
          select hims_f_procurement_grn_header_id,grn_number,grn_for
          ,D.hims_f_procurement_grn_detail_id,D.extended_cost,D.discount_amount,D.net_extended_cost,D.tax_amount,D.total_amount
          from  hims_f_procurement_grn_header H inner join  hims_f_procurement_grn_detail D 
          on H.hims_f_procurement_grn_header_id=D.grn_header_id
          where H.hospital_id=1 and H.grn_number='REE-190628HM61' and grn_for='INV';     
          
           select  dn_from, hims_f_procurement_dn_header_id,delivery_note_number,date(dn_date)as dn_date,H.sub_total,H.detail_discount,H.net_total,
           H.total_tax,H.net_payable ,L.location_description  ,V.vendor_name ,PO.purchase_number,date(PO.po_date) as po_date
           from hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD 
           on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join 
           hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id inner join hims_f_procurement_po_header PO on
           H.purchase_order_id=PO.hims_f_procurement_po_header_id
           left join hims_d_inventory_location L
           on H.inventory_location_id=L.hims_d_inventory_location_id
           left join hims_d_vendor V on H.vendor_id=V.hims_d_vendor_id
           where GH.hospital_id=1 and GH.grn_number='REE-190628HM61' and GH.grn_for='INV';
          
           select D.hims_f_procurement_dn_detail_id,D.hims_f_procurement_dn_header_id,
           D.inv_item_id,IM.item_code,IM.item_description,
           D.po_quantity,D.dn_quantity,D.unit_cost,D.extended_cost,D.discount_percentage,D.discount_amount,
           D.net_extended_cost,D.quantity_recieved_todate,D.quantity_outstanding,
           D.tax_amount,D.tax_percentage,D.total_amount,U.uom_description
           from   hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD 
          on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join 
           hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id
           inner join hims_f_procurement_dn_detail D
           on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
           left  join hims_d_inventory_item_master IM on D.inv_item_id=IM.hims_d_inventory_item_master_id
           left join hims_d_inventory_uom U on D.inventory_uom_id=U.hims_d_inventory_uom_id
           where GH.hospital_id=1 and GH.grn_number='REE-190628HM61' and GH.grn_for='INV';
          
           select B.hims_f_procurement_dn_batches_id,B.hims_f_procurement_dn_detail_id,B.barcode,B.po_quantity,B.dn_quantity,
           B.unit_cost,B.extended_cost,B.discount_percentage,B.discount_amount,B.net_extended_cost,B.quantity_recieved_todate,
           B.quantity_outstanding,B.tax_amount,B.total_amount,B.batchno,B.sales_price from  
            hims_f_procurement_grn_header GH inner join  hims_f_procurement_grn_detail GD 
          on GH.hims_f_procurement_grn_header_id=GD.grn_header_id  inner join 
           hims_f_procurement_dn_header H  on GD.dn_header_id=H.hims_f_procurement_dn_header_id
           inner join hims_f_procurement_dn_detail D
           on H.hims_f_procurement_dn_header_id= D. hims_f_procurement_dn_header_id
           inner join hims_f_procurement_dn_batches B on D.hims_f_procurement_dn_detail_id=B.hims_f_procurement_dn_detail_id
           where GH.hospital_id=1 and GH.grn_number='REE-190628HM61' and GH.grn_for='INV';`,
          values: [],
          printQuery: true
        })
        .then(results => {
          const grn_header = options.result[0][0];
          const grn_details = options.result[1];

          const delv_headers = options.result[0];
          const delv_details = options.result[1];
          const delv_subDetails = options.result[2];

          const outputArray = [];

          grn_details.forEach(detail => {
            const dn_header = delv_headers.filter(item => {
              return (
                detail["hims_f_procurement_grn_detail_id"] ==
                item["hims_f_procurement_grn_detail_id"]
              );
            });

            dn_header.forEach(dn => {
              const dn_details = delv_details.filter(dn_item => {
                return (
                  dn["hims_f_procurement_dn_header_id"] ==
                  dn_item["hims_f_procurement_dn_header_id"]
                );
              });

              const delivery_items = [];
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

          // resolve({ ...grn_header, details: outputArray });
          utilities
            .logger()
            .log("input: ", { ...grn_header, details: outputArray });
          // const result = _.chain(results)
          //   .groupBy(g => g.status)
          //   .map(function(dtl, key) {
          //     return {
          //       status: key,
          //       detailList: dtl
          //     };
          //   })
          //   .value();
          // resolve({ detail: result });
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });

      //const result = { detailList: options.result };
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
