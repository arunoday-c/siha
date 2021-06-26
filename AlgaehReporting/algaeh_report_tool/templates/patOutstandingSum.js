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

      if (input.hims_d_patient_id > 0) {
        str += ` and P.hims_d_patient_id= ${input.hims_d_patient_id}`;
      }

      //   AND H.patient_id=516
      options.mysql
        .executeQuery({
          query: ` 
          SELECT P.patient_code,P.full_name,P.primary_id_no,P.advance_amount 
          FROM hims_f_patient P 
          where P.hospital_id=? and P.advance_amount is not NULL ${strQuery}; `,
          values: [input.hospital_id],
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
