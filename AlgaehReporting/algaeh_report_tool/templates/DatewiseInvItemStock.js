const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      // const utilities = new algaehUtilities();
      let input = {};

      // console.log("im here");

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      // console.log(params);
      let strQuery = "",
        strQry = "";
      if (input.location_id > 0) {
        strQuery += ` IL.inventory_location_id= ${input.location_id}`;
        strQry += ` and TH.from_location_id= ${input.location_id}`;
      }

      if (input.item_id > 0) {
        strQuery += ` and IM.hims_d_inventory_item_master_id= ${input.item_id}`;
        strQry += ` and TH.item_code_id= ${input.item_id}`;
      }

      if (input.hospital_id > 0) {
        strQuery += ` and IL.hospital_id= ${input.hospital_id}`;
        strQry += ` and TH.hospital_id= ${input.hospital_id}`;
      }

      // select hims_d_inventory_item_master_id, item_code, item_description,ROUND(coalesce(sum(qtyhand) ,0),0) as quantity from hims_d_inventory_item_master IM
      //         left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id = IL.item_id
      //         where ${strQuery} group by hims_d_inventory_item_master_id;
      //       select item_code_id,transaction_qty,operation from hims_f_inventory_trans_history where
      //         date(transaction_date)>date(?) ${strQry};`,

      options.mysql
        .executeQuery({
          query: `
          select hims_f_inventory_trans_history_id, hims_d_inventory_item_master_id, 
          max(item_code) as item_code, max(item_description) as item_description, sum(IL.qtyhand) as quantity,
          max(item_code_id) as item_code_id, max(transaction_qty) as transaction_qty,operation  from hims_d_inventory_item_master IM
          left join hims_m_inventory_item_location IL on IM.hims_d_inventory_item_master_id = IL.item_id
          left join hims_f_inventory_trans_history TH on TH.item_code_id = IM.hims_d_inventory_item_master_id and 
          date(TH.transaction_date)>date(?) and TH.from_location_id= IL.inventory_location_id and TH.hospital_id= IL.hospital_id
          where ${strQuery} group by hims_f_inventory_trans_history_id,hims_d_inventory_item_master_id, operation;`,
          values: [input.till_date],
          printQuery: true,
        })
        .then((stock_details) => {
          options.mysql.releaseConnection();

          // console.log("stock_details", stock_details);
          // console.log("trans_history", trans_history);

          if (stock_details.length > 0) {
            let outputArray = [];

            outputArray = _.chain(stock_details)
              .groupBy((g) => g.hims_d_inventory_item_master_id)
              .map((details, key) => {
                // console.log("details", details);

                const first_record = _.head(details);

                // console.log("first_record", first_record);
                let quantity = 0;
                const minus = details.filter((f) => f.operation === "-");
                const plus = details.filter((f) => f.operation === "+");

                // console.log("minus", minus);
                // console.log("plus", plus);

                if (minus.length === 0 && plus.length === 0) {
                  quantity = parseFloat(first_record.quantity);
                } else {
                  if (minus.length > 0) {
                    quantity =
                      parseFloat(first_record.quantity) +
                      _.sumBy(minus, (s) => parseFloat(s.transaction_qty));
                  }
                  if (plus.length > 0) {
                    quantity =
                      parseFloat(quantity) -
                      _.sumBy(plus, (s) => parseFloat(s.transaction_qty));
                  }
                }

                return { ...first_record, quantity };
              })
              .value();

            // for (let i = 0; i < stock_details.length; i++) {
            //   const add_item = item_data.filter((f) => f.operation === "+");

            //   console.log("add_item", add_item);
            //   const sub_item = item_data.filter((f) => f.operation === "-");

            //   console.log("sub_item", sub_item);
            //   const add_item_sum = _.sumBy(add_item, (s) => {
            //     return parseFloat(s.transaction_qty);
            //   });

            //   // console.log("add_item_sum", add_item_sum);
            //   const sub_item_sum = _.sumBy(sub_item, (s) => {
            //     return parseFloat(s.transaction_qty);
            //   });

            //   // console.log("sub_item_sum", sub_item_sum);
            //   // console.log("sub_item_sum", stock_details[i].quantity);
            //   stock_details[i].quantity =
            //     parseFloat(stock_details[i].quantity) +
            //     sub_item_sum -
            //     add_item_sum;

            //   // console.log("stock_details", stock_details);
            //   outputArray.push(...stock_details);
            // }

            // console.log("outputArray", outputArray);

            resolve({
              result: outputArray,
            });
          } else {
            resolve({
              result: stock_details,
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
