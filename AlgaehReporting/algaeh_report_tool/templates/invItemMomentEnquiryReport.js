const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let _strAppend = "";
      let input = options.args.reportParams[0];

      // delete input.from_date;
      // delete input.to_date;
      if (input.from_date != null) {
        _strAppend +=
          " and date(transaction_date) between date('" +
          input.from_date +
          "') AND date('" +
          input.to_date +
          "')";
      } else {
        _strAppend += " and date(transaction_date) <= date(now())";
      }
      if (input.from_location_id != null) {
        _strAppend += " and from_location_id='" + input.from_location_id + "'";
      }

      if (input.item_code_id != null) {
        _strAppend += " and item_code_id='" + input.item_code_id + "'";
      }

      if (input.vendor_batchno != null) {
        _strAppend += " and vendor_batchno='" + input.vendor_batchno + "'";
      }

      if (input.transaction_type != null) {
        _strAppend += " and transaction_type='" + input.transaction_type + "'";
      }

      options.mysql
        .executeQuery({
          query:
            `SELECT TH.* , CASE WHEN TH.operation='+' THEN ROUND(TH.transaction_qty,0) ELSE concat(TH.operation, ROUND(TH.transaction_qty,0)) END as trans_qty,  
            IU.uom_description,IM.item_description,IL.location_description, IM.waited_avg_cost 
            from hims_f_inventory_trans_history TH 
            left join hims_d_inventory_item_master IM on TH.item_code_id=IM.hims_d_inventory_item_master_id
            left join hims_d_inventory_location IL on TH.from_location_id = IL.hims_d_inventory_location_id
            left join hims_d_inventory_uom IU on TH.transaction_uom=IU.hims_d_inventory_uom_id
            
            WHERE TH.record_status = 'A'` + _strAppend,
          printQuery: true,
        })
        .then((result) => {
          console.log("header===", result);
          const data = {
            details: result,
          };

          //   console.log("header===", header);
          resolve(data);
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
