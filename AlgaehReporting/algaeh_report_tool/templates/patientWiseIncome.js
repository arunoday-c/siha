// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `SELECT * FROM (
            SELECT PT.patient_code,PT.full_name, BH.patient_id,
            sum(COALESCE(BH.net_amount,0)) as pat_op_income,sum(COALESCE(BC.net_amount,0)) as pat_op_can,
            sum(COALESCE(BH.net_amount,0) - COALESCE(BC.net_amount,0)) as op_pat_income,
            sum(COALESCE(PH.net_amount,0)) as pat_pos_income,sum(COALESCE(PC.net_amount,0)) as pat_pos_can,
            sum(COALESCE(PH.net_amount,0)) - sum(COALESCE(PC.net_amount,0)) as pos_pat_income,
            (sum(COALESCE(BH.net_amount,0) - COALESCE(BC.net_amount,0))) + (sum(COALESCE(PH.net_amount,0)) - sum(COALESCE(PC.net_amount,0))) as net_pat_income
            FROM hims_f_billing_header as BH inner join hims_f_patient PT on BH.patient_id= PT.hims_d_patient_id 
            left join hims_f_bill_cancel_header BC on BH.hims_f_billing_header_id=BC.from_bill_id  
            left join hims_f_pharmacy_pos_header as PH on PH.patient_id= PT.hims_d_patient_id and PH.hospital_id=?
            left join hims_f_pharmcy_sales_return_header PC on PH.hims_f_pharmacy_pos_header_id=PC.from_pos_id  
            where BH.hospital_id=? group by BH.patient_id) as  a order by a.net_pat_income DESC;`,
          values: [input.hospital_id, input.hospital_id],
          printQuery: true,
        })
        // .then((ress) => {
        //   let final_result = ress;
        //   resolve({
        //     result: final_result,
        //     net_payable: options.currencyFormat(
        //       _.sumBy(result, (s) => parseFloat(s.op_pat_income)),
        //       options.args.crypto
        //     ),
        //   });
        // })

        .then((result) => {
          const data = {
            details: result,
            net_pat_op_income: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.pat_op_income)),
              options.args.crypto
            ),
            net_pat_op_can: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.pat_op_can)),
              options.args.crypto
            ),
            net_op_pat_income: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.op_pat_income)),
              options.args.crypto
            ),
            net_pat_pos_income: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.pat_pos_income)),
              options.args.crypto
            ),
            net_pat_pos_can: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.pat_pos_can)),
              options.args.crypto
            ),
            net_pos_pat_income: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.pos_pat_income)),
              options.args.crypto
            ),
            net_net_pat_income: options.currencyFormat(
              _.sumBy(result, (s) => parseFloat(s.net_pat_income)),
              options.args.crypto
            ),
          };
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
