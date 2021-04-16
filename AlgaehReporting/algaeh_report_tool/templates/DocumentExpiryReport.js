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
          query: `
            SELECT
             ROW_NUMBER() OVER (ORDER BY E.hims_d_employee_id) as row_num,
             ID.identity_documents_id,ID.employee_id,ID.identity_number,D.identity_document_name,ID.valid_upto, E.employee_code, E.full_name, N.nationality
            FROM hims_d_employee_identification as ID
            inner join hims_d_employee E on ID.employee_id = E.hims_d_employee_id
            inner join hims_d_identity_document D on ID.identity_documents_id = D.hims_d_identity_document_id
            inner join hims_d_nationality N on E.nationality = N.hims_d_nationality_id
              where E.hospital_id=? and  date(ID.valid_upto) between date(?) and date(?) ;`,

          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true,
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
