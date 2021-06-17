// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  const _ = options.loadash;
  return new Promise(function (resolve, reject) {
    try {
      let input = {};
      let params = options.args.reportParams;
      // const utilities = new algaehUtilities();
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      const decimal_places = options.args.crypto.decimal_places;

      let strData = "";

      if (input.hospital_id > 0) {
        strData += ` and E.hospital_id= ${input.hospital_id}`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT H.hospital_name,E.employee_code,E.full_name,E.identity_no, D.designation, S.sub_department_name
          FROM hims_d_employee E
          inner join hims_d_hospital H on H.hims_d_hospital_id=E.hospital_id
          inner join hims_d_designation D on D.hims_d_designation_id=E.employee_designation_id
          inner join hims_d_sub_department S on S.hims_d_sub_department_id=E.sub_department_id
          where E.employee_status='A' and suspend_salary='Y' ${strData} ;`,
          // values: [input.hospital_id],
          printQuery: true,
        })
        .then((ress) => {
          if (ress.length > 0) {
            const result = {
              detailsList: ress,
            };
            resolve(result);
          } else {
            resolve({
              result: {
                detailsList: ress,
              },
            });
          }
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
