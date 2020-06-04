const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });

      console.log("INPUT:", input);
      if (input.department) {
        str += ` and EM.department= '${input.group_id}'`;
      }
      if (input.department) {
        str += ` and EM.sub_department_id= '${input.sub_department_id}'`;
      }
      if (input.department) {
        str += ` and EM.hims_d_employee_id= '${input.hims_d_employee_id}'`;
      }

      options.mysql
        .executeQuery({
          query: `select EM.employee_code, EM.full_name,SL.salary_number,SL.year,MONTHNAME(CONCAT('2011-',SL.month,'-01')) as deducting_month, LA.loan_application_number, LM.loan_description, SLL.loan_due_amount,LA.pending_loan, LA.pending_tenure from hims_f_salary as SL inner join hims_f_salary_loans as SLL on SL.hims_f_salary_id = salary_header_id left join hims_f_loan_application as LA on SLL.loan_application_id=hims_f_loan_application_id inner join hims_d_employee as EM on SL.employee_id = EM.hims_d_employee_id 
 inner join hims_d_loan as LM on LA.loan_id=LM.hims_d_loan_id where LA.loan_closed ='N' and SLL.loan_due_amount <>0 and SL.hospital_id=? and SL.year=? and SL.month=? ${str}`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          resolve({
            result: result,
            no_employees: result.length,
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
