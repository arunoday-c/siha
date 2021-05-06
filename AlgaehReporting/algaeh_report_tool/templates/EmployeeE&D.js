// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      // const utilities = new algaehUtilities();
      let str = "";
      let input = {};
      const decimal_places = options.args.crypto.decimal_places;

      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      if (input.hospital_id > 0) {
        str += ` and ED.hospital_id= ${input.hospital_id}`;
      }

      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.earning_deductions_id > 0) {
        str += ` and ED.earning_deductions_id= ${input.earning_deductions_id}`;
      }

      let is_local = "";

      if (input.is_local === "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local === "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      options.mysql
        .executeQuery({
          query: `
          select E.employee_code,E.full_name,ED.amount,D.earning_deduction_description,
          case processed when processed='Y' then 'Yes' else 'No' end processed,
          EG.group_description,DG.designation,ED.year,ED.month,ED.category,E.employee_status,H.hospital_name
          from hims_f_miscellaneous_earning_deduction as ED
          inner join hims_d_employee as E on  E.hims_d_employee_id = ED.employee_id
          inner join hims_d_earning_deduction as D on D.hims_d_earning_deduction_id = ED.earning_deductions_id 
          left join hims_d_employee_group EG on E.employee_group_id = EG.hims_d_employee_group_id
          left join hims_d_designation DG on E.employee_designation_id=DG.hims_d_designation_id 
          left join hims_d_hospital H  on ED.hospital_id=H.hims_d_hospital_id 
          where ED.year=? and ED.month=? and ED.category=? and E.employee_status='A' ${is_local}  ${str} order by ED.hospital_id`,
          values: [input.year, input.month, input.edType],
          printQuery: true,
        })
        .then((result) => {
          const total_ED = _.sumBy(result, (s) => parseFloat(s.amount)).toFixed(
            decimal_places
          );

          resolve({
            details: result,
            total_ED: options.currencyFormat(total_ED, options.args.crypto),
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
