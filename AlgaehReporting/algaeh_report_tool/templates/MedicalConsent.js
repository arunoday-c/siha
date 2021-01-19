const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const {
        decimal_places,
        symbol_position,
        currency_symbol,
      } = options.args.crypto;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      options.mysql
        .executeQuery({
          query: `
          select PV.age_in_days,PV.age_in_months,PV.age_in_years,P.patient_code,P.full_name,
          P.arabic_name,P.gender,P.date_of_birth,P.age,P.relationship_with_patient,P.emergency_contact_name,
          P.emergency_contact_number,P.hospital_id,H.hospital_name,H.arabic_hospital_name,EM.full_name as doctor_name,
          O.organization_code,O.organization_name,O.legal_name
          from hims_f_patient P
          inner join hims_d_hospital H on H.hims_d_hospital_id = P.hospital_id
          inner join hims_d_organization O on O.hims_d_organization_id = H.organization_id
          inner join hims_f_patient_visit PV on PV.hims_f_patient_visit_id = ?
          inner join hims_d_employee EM on EM.hims_d_employee_id = PV.doctor_id
          where P.hims_d_patient_id=?;
        `,
          values: [input.visit_id, input.patient_id],
          printQuery: true,
        })
        .then((result) => {
          const data = {
            header: result[0],
          };
          resolve({
            ...data,
            decimalOnly: {
              decimal_places,
              addSymbol: false,
              symbol_position,
              currency_symbol,
            },
            currencyOnly: {
              decimal_places,
              addSymbol: true,
              symbol_position,
              currency_symbol,
            },
          });
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
