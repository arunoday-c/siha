// const algaehUtilities = require("algaeh-utilities/utilities");
const executePDF = function executePDFMethod(options) {
  return new Promise(function(resolve, reject) {
    try {
      const _ = options.loadash;
      // const utilities = new algaehUtilities();
      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach(para => {
        input[para["name"]] = para["value"];
      });

      if (input.hospital_id > 0) {
        str += ` and AM.hospital_id= ${input.hospital_id}`;
      }

      if (input.sub_department_id > 0) {
        str += ` and AM.sub_department_id= ${input.sub_department_id}`;
      }

      if (input.hims_d_employee_id > 0) {
        str += ` and AM.employee_id= ${input.hims_d_employee_id}`;
      }

      if (input.employee_group_id > 0) {
        str += ` and E.employee_group_id= ${input.employee_group_id}`;
      }

      if (input.department_id > 0) {
        str += ` and SD.department_id=${input.department_id}`;
      }

      // 	const month_number =
      // 	req.query.yearAndMonth === undefined ? req.query.month : moment(req.query.yearAndMonth).format('M');
      // const year =
      // 	req.query.yearAndMonth === undefined
      // 		? req.query.year
      // 		: moment(new Date(req.query.yearAndMonth)).format('YYYY');

      options.mysql
        .executeQuery({
          query: `select E.employee_code,E.full_name,ED.amount,D.earning_deduction_description,
case processed when processed='Y' then 'Yes' else 'No' end processed
from hims_f_miscellaneous_earning_deduction as ED inner join hims_d_employee as E
on  E.hims_d_employee_id = ED.employee_id inner join hims_d_earning_deduction as D
on D.hims_d_earning_deduction_id=ED.earning_deductions_id
where year=? and month=? and ED.hospital_id=1 and category='D'  ${str} `,
          values: [input.year, input.month],
          printQuery: true
        })
        .then(result => {
          // utilities.logger().log("result: ", result);
          resolve({ result: result });
        })
        .catch(error => {
          options.mysql.releaseConnection();
        });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = { executePDF };
