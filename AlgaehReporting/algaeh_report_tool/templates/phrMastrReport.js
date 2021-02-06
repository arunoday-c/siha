const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `select  IM.hims_d_item_master_id, IM.item_code, IM.item_description, 
          IM.item_status, IC.category_desc, IG.group_description,
          IUI.uom_description as item_uom,
          IUP.uom_description as purchase_uom,
           IUS.uom_description as sales_uom,
          IUST.uom_description as stocking_uom
           ,IM.reorder_qty,IM.sales_price,S.vat_applicable,S.vat_percent, IM.service_id, IM.purchase_cost,IM.addl_information,IM.exp_date_required
          from  hims_d_item_master IM
          left join hims_d_item_category IC on IC.hims_d_item_category_id = IM.category_id
          left join hims_d_item_group IG  on IG.hims_d_item_group_id = IM.group_id
          left join hims_d_pharmacy_uom IUI on IUI.hims_d_pharmacy_uom_id = IM.item_uom_id
          left join hims_d_pharmacy_uom IUP on IUP.hims_d_pharmacy_uom_id = IM.purchase_uom_id
           left join hims_d_pharmacy_uom IUS on IUS.hims_d_pharmacy_uom_id = IM.sales_uom_id
          left join hims_d_pharmacy_uom IUST on IUST.hims_d_pharmacy_uom_id = IM.stocking_uom_id
          left join hims_d_services S on IM.service_id = S.hims_d_services_id;`,
          //   values: [input.voucher_header_id],
          printQuery: true,
        })
        .then((result) => {
          // console.log("resultHeader=", result);
          resolve({
            result,
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
