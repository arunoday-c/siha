const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      //   let strQuery = "";
      //   if (input.hims_d_patient_id > 0) {
      //     str += ` and H.hims_d_patient_id= ${input.hims_d_patient_id}`;
      //   }

      //   AND H.patient_id=516
      options.mysql
        .executeQuery({
          query: ` 
          SELECT service_code,insurance_service_name,gross_amt,corporate_discount_percent,
          corporate_discount_amt,net_amount,case when covered='Y' then 'Yes' else 'No' end as covered,
          case when pre_approval='Y' then 'Yes' else 'No' end as pre_approval 
          FROM hims_d_services_insurance where hospital_id=? and insurance_id=?;`,
          values: [input.hospital_id, input.insurance_provider_id],
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
