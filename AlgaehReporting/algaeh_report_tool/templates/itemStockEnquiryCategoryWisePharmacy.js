const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str1 = "";
      let str2 = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      if (input.item_id > 0) {
        str1 = `and TS.item_code_id=${input.item_id}`;
        str2 = `and IL.item_id=${input.item_id}`;
      }

      options.mysql
        .executeQuery({
          query: `WITH CTE AS (
            select hims_f_pharmacy_trans_history_id,transaction_type,from_location_id,item_code_id,location_description,
            transaction_qty,transaction_date,case when transaction_type in ('SRT' 'INT','DNA','ST') and operation='+' then  'in' 
            when transaction_type in( 'ST', 'CS', 'POS') and operation='-' then  'out' end as stock_status,item_description
            from hims_f_pharmacy_trans_history TS inner join hims_d_pharmacy_location PL on 
            TS.from_location_id=PL.hims_d_pharmacy_location_id inner join hims_d_item_master IM 
            on TS.item_code_id=IM.hims_d_item_master_id
            where TS.record_status='A'  and PL.hospital_id=? and  TS.from_location_id=? 
             and IM.category_id=? ${str1} and transaction_type in( 'ST', 'CS', 'POS','SRT' 'INT','DNA') 
            and date(transaction_date) = date(?))
            select hims_f_pharmacy_trans_history_id,location_description,item_code_id,item_description,
            sum(transaction_qty) as transaction_qty,transaction_date ,stock_status
            from CTE group by item_code_id,stock_status;            
            select hims_m_item_location_id ,item_id,location_description,hims_d_pharmacy_location_id,
            sum(IL.qtyhand) as qtyhand,item_description
            from hims_m_item_location IL inner join hims_d_pharmacy_location PL on 
            IL.pharmacy_location_id=PL.hims_d_pharmacy_location_id inner join hims_d_item_master IM on
            IL.item_id=IM.hims_d_item_master_id
            where IL.record_status='A' and PL.hospital_id=? and IL.pharmacy_location_id=?
            and  IM.category_id=? ${str2} group by IL.item_id;
                        
            `,
          values: [
            input.hospital_id,
            input.location_id,
            input.category_id,
            input.to_date,
            input.hospital_id,
            input.location_id,
            input.category_id
          ],
          printQuery: true
        })
        .then(results => {
          let transactions = results[0];
          let qtyInHand = results[1];

          options.mysql.releaseConnection();
          //utilities.logger().log("transactions: ", transactions);

          const data = _.chain(transactions)
            .groupBy(g => g.item_code_id)
            .map(function(item, key) {
              const stock_out = _.chain(item)
                .filter(f => f.stock_status == "out")
                .sumBy(s => parseFloat(s.transaction_qty))
                .value()
                .toFixed(decimal_places);

              const stock_in = _.chain(item)
                .filter(f => f.stock_status == "in")
                .sumBy(s => parseFloat(s.transaction_qty))
                .value()
                .toFixed(decimal_places);

              return {
                item_id: key,
                item_name: item[0]["item_description"],
                stock_in: stock_in,
                stock_out: stock_out
              };
            })
            .value();

          // utilities.logger().log("data: ", data);
          // utilities.logger().log("qtyInHand: ", qtyInHand);

          let outputArray = data.map(item => {
            const qty = qtyInHand.find(f => f.item_id == item.item_id);
            const opening_bal = parseFloat(
              parseFloat(qty["qtyhand"]) +
                parseFloat(item["stock_out"]) -
                parseFloat(item["stock_in"])
            ).toFixed(decimal_places);
            return {
              ...item,
              opening_bal: opening_bal,
              qtyhand: qty["qtyhand"]
            };
          });

          // utilities.logger().log("outputArray: ", outputArray);

          resolve({
            details: outputArray
          });
        })
        .catch(error => {
          options.mysql.releaseConnection();
          console.log("error", error);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
