// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strData = "";

      //   if (input.hospital_id > 0) {
      strData += ` and S.hospital_id= ${input.hospital_id}`;
      //   }

      options.mysql
        .executeQuery({
          query: `SELECT PH.package_code,PH.package_name, CASE WHEN PH.package_visit_type='S' THEN 'Single' else 'Multi' END as package_visit_type, PH.package_amount FROM hims_d_services as S
          left join hims_d_package_header PH on S.hims_d_services_id = PH.package_service_id
          where S.service_type_id=14 and PH.approved='Y' ${strData};`,
          // values: [],
          printQuery: true,
        })
        .then((ress) => {
          let final_result = ress;
          //   final_result = final_result.concat(ress[1]);
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
