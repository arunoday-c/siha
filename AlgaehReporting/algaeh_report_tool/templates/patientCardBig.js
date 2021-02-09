// const executePDF = function executePDFMethod(options) {
//   return new Promise(function (resolve, reject) {
//     try {
//       resolve({ header: options.result.length == 0 ? [] : options.result[0] });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
// module.exports = { executePDF };
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    // const utilities = new algaehUtilities();
    try {
      const _ = options.loadash;

      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `select BH.bill_number as invoice_number,P.patient_code, 
          P.full_name as patient_full_name,  P.arabic_name as patient_arabaic_full_name,
           V.visit_date,V.visit_type,VT.visit_type_desc,E.full_name,E.arabic_name,N.nationality,
            BH.bill_date invoice_date, P.registration_date, V.age_in_years, P.gender,ID.identity_document_name,
            P.primary_id_no,P.date_of_birth,P.contact_number from hims_f_patient P inner join hims_d_identity_document ID
             on ID.hims_d_identity_document_id = P.primary_identity_id inner join hims_f_patient_visit V 
             on P.hims_d_patient_id = V.patient_id inner join hims_d_nationality as N on N.hims_d_nationality_id = P.nationality_id
              inner join hims_d_employee E on V.doctor_id =E.hims_d_employee_id inner join hims_f_billing_header BH
               on V.hims_f_patient_visit_id = BH.visit_id inner join hims_d_visit_type VT on VT.hims_d_visit_type_id = V.visit_type where BH.visit_id=?;`,
          values: [input.visit_id],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length == 0 ? [] : result[0];
          console.log("header===", header);
          resolve(header);
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
