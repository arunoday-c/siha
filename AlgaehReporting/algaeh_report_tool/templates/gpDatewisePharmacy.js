// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    const _ = options.loadash;
    // const utilities = new algaehUtilities();
    try {
      //  let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      //utilities.logger().log("decimal_places:", crypto.decimal_places);

      // if (input.provider_id > 0) {
      // 	str += ` and A.provider_id= ${input.provider_id}`;
      // }

      // if (input.status_id > 0) {
      // 	str += ` and A.appointment_status_id= ${input.status_id}`;
      // }
      options.mysql
        .executeQuery({
          query: `select transaction_date ,sum(purchase_amount)as purchase_amount,sum(net_total) as sold_amount,
		  sum(profit) as profit_amount ,sum(vat_amount) as vat_amount, (sum(profit) -sum(vat_amount))as gp_profit_amount_aftr_vat ,
		  ROUND(( (sum(profit)-sum(vat_amount))/sum(purchase_amount)*100),2) as gp_profit_percentage
		  from (select hims_f_pharmacy_trans_history_id,transaction_qty,transaction_uom,
		  transaction_type,transaction_date,batchno,item_code_id,average_cost,net_total ,vat_amount,
		  U.conversion_factor, ROUND( transaction_qty*average_cost*conversion_factor,4) as purchase_amount,
		  ( net_total-ROUND(transaction_qty*average_cost*conversion_factor,4)) as  profit
		  from hims_f_pharmacy_trans_history H
		  inner join hims_m_item_uom U on H.item_code_id=U.item_master_id and H.transaction_uom=U.uom_id
		  and U.record_status='A'
		  where H.transaction_type='POS' and date(H.transaction_date) between
		  date(?) and date(?))   as A
		  group by transaction_date;`,
          values: [input.from_date, input.to_date],
          printQuery: true
        })
        .then(result => {
          // utilities.logger().log("result:", result);

          const sum_purchase = _.sumBy(result, s =>
            parseFloat(s.purchase_amount)
          ).toFixed(decimal_places);

          const sum_sold_amount = _.sumBy(result, s =>
            parseFloat(s.sold_amount)
          ).toFixed(decimal_places);

          const sum_gp_profit_amount_aftr_vat = _.sumBy(result, s =>
            parseFloat(s.gp_profit_amount_aftr_vat)
          ).toFixed(decimal_places);

          const sum_gp_percent = parseFloat(
            (sum_gp_profit_amount_aftr_vat / sum_purchase) * 100
          ).toFixed(decimal_places);

          resolve({
            result: result,
            sum_purchase: sum_purchase,
            sum_sold_amount: sum_sold_amount,
            sum_gp_profit_amount_aftr_vat: sum_gp_profit_amount_aftr_vat,
            sum_gp_percent: sum_gp_percent
          });
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
