// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      let input = [];
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;
      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      options.mysql
        .executeQuery({
          query: `SELECT D.designation, count(*) as no_of_emp  FROM hims_d_employee E, hims_d_designation D WHERE 
                D.hims_d_designation_id = E.employee_designation_id and E.record_status = 'A' and E.hospital_id = ? 
                group by D.hims_d_designation_id ; `,
          values: [input.hospital_id],
        })
        .then((result) => {
          resolve({ result: result });
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
