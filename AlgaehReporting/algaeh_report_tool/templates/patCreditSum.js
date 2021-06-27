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
        str += ` and H.hims_d_patient_id= ${input.hims_d_patient_id}`;
      }

      //   AND H.patient_id=516
      options.mysql
        .executeQuery({
          query: ` 
        SELECT H.bill_number,H.bill_date,H.net_total,H.credit_amount,H.balance_credit, V.visit_code,P.primary_id_no, D.services_id,P.patient_code,P.full_name
        from hims_f_billing_header H
        inner join hims_f_billing_details D on D.hims_f_billing_header_id = H.hims_f_billing_header_id
        inner join hims_f_patient_visit V on V.hims_f_patient_visit_id = H.visit_id
        inner join hims_f_patient P on P.hims_d_patient_id = H.patient_id
        WHERE cancelled='N' and adjusted='N' and balance_credit>0 and H.hospital_id=? and date(H.bill_date) >= date(?) ${strQuery}
        order by H.hims_f_billing_header_id desc  ; `,
          values: [input.hospital_id, input.till_date],
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
