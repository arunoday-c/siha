// const algaehUtilities = require("algaeh-utilities/utilities");

const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;

      let input = {};

      const params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      let strQuery = "";

      if (input.expiry_status == "E") {
        strQuery += ` and   date(ID.valid_upto)<= curdate()`;
      } else if (input.expiry_status == "EW") {
        strQuery += ` and  date(ID.valid_upto) between date('${input.from_date}') and date('${input.to_date}')`;
      } else if (input.expiry_status == "EO") {
        strQuery += ` and date(ID.valid_upto)=date('${input.from_date}')`;
      }

      options.mysql
        .executeQuery({
          query: `SELECT ID.identity_documents_id,ID.employee_id,ID.identity_number,D.identity_document_name,ID.valid_upto, E.employee_code, E.full_name, N.nationality
          FROM hims_d_employee_identification as ID
          inner join hims_d_employee E on ID.employee_id = E.hims_d_employee_id
          inner join hims_d_identity_document D on ID.identity_documents_id = D.hims_d_identity_document_id
          inner join hims_d_nationality N on E.nationality = N.hims_d_nationality_id
          where E.hospital_id=?   and E.employee_status='A' ${strQuery};`,
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((res) => {
          options.mysql.releaseConnection();
          const result = res;
          const IdentificationWise = _.chain(result)
            .groupBy((g) => g.identity_documents_id)
            .map((subDept) => {
              const { identity_document_name } = subDept[0];
              const employees = _.chain(subDept)
                .groupBy((g) => g.employee_id)
                .map((emps) => {
                  const { employee_code, full_name } = emps[0];
                  return {
                    employee_code,
                    full_name,
                    totalEmployee: emps.length,
                    emps: emps.map((n) => {
                      return {
                        ...n,
                      };
                    }),
                  };
                })
                // .sortBy((s) => s.valid_upto)
                .value();
              return {
                identity_document_name,
                employees: employees,
              };
            })
            .value();
          // console.log(JSON.stringify(IdentificationWise));

          resolve({ result: IdentificationWise });
        })
        .catch((e) => {
          // console.log("e:", e);

          options.mysql.releaseConnection();
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
