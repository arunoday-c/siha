const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      utilities.logger().log("input: ", input);

      options.mysql
        .executeQuery({
          query: `WITH CTE AS (
					select hims_f_pharmacy_trans_history_id,transaction_type,from_location_id,item_code_id,
					transaction_qty,transaction_date,case when transaction_type in ('SRT' 'INT','DNA') then  'in' 
					when transaction_type in( 'ST', 'CS', 'POS') then  'out' end as stock_status
					from hims_f_pharmacy_trans_history TS inner join hims_d_pharmacy_location PL on 
					TS.from_location_id=PL.hims_d_pharmacy_location_id
					where TS.record_status='A'  and   PL.hospital_id=? and TS.from_location_id=? and TS.item_code_id=?
					and transaction_type in( 'ST', 'CS', 'POS','SRT' 'INT','DNA') 
					and date(transaction_date) between date(?) and date(?))
					select hims_f_pharmacy_trans_history_id,sum(transaction_qty) as transaction_qty,transaction_date ,stock_status
					from CTE group by transaction_date,stock_status;
					select hims_m_item_location_id ,item_id,location_description,hims_d_pharmacy_location_id,
					sum(IL.qtyhand) as qtyhand from hims_m_item_location IL inner join hims_d_pharmacy_location PL on 
					IL.pharmacy_location_id=PL.hims_d_pharmacy_location_id
					where IL.record_status='A' and PL.hospital_id=? and IL.pharmacy_location_id=?
					and IL.item_id=? group by IL.item_id;	`,
          values: [
            input.hospital_id,
            input.location_id,
            input.item_id,
            input.from_date,
            input.to_date,
            input.hospital_id,
            input.location_id,
            input.item_id
          ],
          printQuery: true
        })
        .then(results => {
          let transactions = results[0];
          let qtyInHand = results[1];

          options.mysql.releaseConnection();
          utilities.logger().log("qty: ", transactions);

          const data = _.chain(transactions)
            .groupBy(g => g.transaction_date)
            .map(function(item, key) {
              const stock_out = _.chain(item)
                .filter(f => f.stock_status == "out")
                .sumBy(s => parseFloat(s.transaction_qty))
                .value()
                .toFixed(4);

              const stock_in = _.chain(item)
                .filter(f => f.stock_status == "in")
                .sumBy(s => parseFloat(s.transaction_qty))
                .value()
                .toFixed(4);

              return {
                transaction_date: key,
                stock_in: stock_in,
                stock_out: stock_out
              };
            })
            .value();

          utilities.logger().log("data: ", data);

          const total_in = _.chain(data)

            .sumBy(s => parseFloat(s.stock_in))
            .value()
            .toFixed(4);

          const total_out = _.chain(data)

            .sumBy(s => parseFloat(s.stock_out))
            .value()
            .toFixed(4);

          resolve({
            details: data,
            qtyInHand: qtyInHand[0]["qtyhand"],
            total_in: total_in,
            total_out: total_out
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
