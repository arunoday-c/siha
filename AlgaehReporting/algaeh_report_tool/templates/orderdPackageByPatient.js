// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      // const moment = options.moment;

      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      //   if (input.hospital_id > 0) {
      strData += ` and PH.hospital_id= ${input.hospital_id}`;
      //   }

      options.mysql
        .executeQuery({
          query: `SELECT PH.patient_id,PT.patient_code,PT.full_name,PG.package_code,PG.package_name,CASE WHEN PG.package_visit_type='S' THEN 'Single' else 'Multi' END as package_visit_type,V.visit_code,V.visit_date, PH.gross_amount,PH.advance_amount,PH.utilize_amount,PH.balance_amount,E.full_name as doctor_name, PH.hospital_id
          FROM hims_f_package_header as PH
          inner join hims_f_patient PT on PH.patient_id = PT.hims_d_patient_id
          inner join hims_f_patient_visit V on PH.visit_id = V.hims_f_patient_visit_id
          inner join hims_d_package_header PG on PH.package_id = PG.hims_d_package_header_id
          inner join hims_d_employee E on PH.doctor_id = E.hims_d_employee_id
          where PH.closed = 'N' and PH.closed_type <> 'C' ${strData};`,
          // values: [],
          printQuery: true,
        })
        .then((ress) => {
          let final_result = ress;
          //   console.log("final_result", final_result);

          const result = {
            details: final_result,
            // total_before_vat: options.currencyFormat(
            //   _.sumBy(final_result, (s) => parseFloat(s.total_before_vat)),
            //   options.args.crypto
            // ),
            // total_after_vat: options.currencyFormat(
            //   _.sumBy(final_result, (s) => parseFloat(s.total_after_vat)),
            //   options.args.crypto
            // ),
            // patient_tax: options.currencyFormat(
            //   _.sumBy(final_result, (s) => parseFloat(s.patient_tax)),
            //   options.args.crypto
            // ),
            // company_tax: options.currencyFormat(
            //   _.sumBy(final_result, (s) => parseFloat(s.company_tax)),
            //   options.args.crypto
            // ),
          };

          resolve(result);
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
