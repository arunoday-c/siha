const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";
      if (input.PO_from != null) {
        strQuery += ` and  GRN.grn_for= "${input.PO_from}"`;
      }

      //   AND H.patient_id=516
      options.mysql
        .executeQuery({
          query: ` 
          SELECT case when GRN.grn_for ='INV' then 'Inventory' else 'Pharmacy' end as grn_for_name,PO.purchase_number,PO.po_date,PUSR.user_display_name as PO_NAME,GRN.grn_number,GRN.grn_date,GUSR.user_display_name as GRN_NAME,GRN.posted_date,FUSR.user_display_name as FIN_NAME
 FROM hims_f_procurement_grn_header GRN
inner join hims_f_procurement_po_header PO on PO.hims_f_procurement_po_header_id= GRN.po_id
inner join algaeh_d_app_user PUSR on PUSR.algaeh_d_app_user_id = PO.created_by
inner join algaeh_d_app_user GUSR on GUSR.algaeh_d_app_user_id = GRN.created_by
inner join algaeh_d_app_user FUSR on FUSR.algaeh_d_app_user_id = GRN.posted_by
where posted='Y'  and date(grn_date) between date(?) and  date(?)  ${strQuery}; `,
          values: [input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          //   net_balance_credit: _.sumBy(res, (s) => parseFloat(s.balance_credit)),
          resolve({
            result: result,
            //   net_balance_credit,
          });
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
