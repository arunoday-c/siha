const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let PCR_RES = "";

      if (input.PCR_RES === "B") {
        PCR_RES = "";
      } else if (input.PCR_RES === "N") {
        PCR_RES = " and AL.result='Negative'";
      } else if (input.PCR_RES === "P") {
        PCR_RES = " and AL.result='Positive'";
      }

      options.mysql
        .executeQuery({
          query: `SELECT P.patient_code,P.full_name,P.primary_id_no,P.date_of_birth,P.contact_number,T.description,AL.result,O.ordered_date
          FROM hims_f_ord_analytes AL
          inner join hims_f_lab_order O on O.hims_f_lab_order_id=AL.order_id
          inner join hims_d_investigation_test T on T.hims_d_investigation_test_id=O.test_id
          inner join hims_f_patient P on P.hims_d_patient_id=O.patient_id
          where O.hospital_id=? and O.status='V' and T.isPCR='Y' and date(O.ordered_date) between date(?) and date(?) ${PCR_RES} ;`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
        })
        .then((res) => {
          const result = res;
          resolve({
            result: result,
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
