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
      // if (input.department_id) {
      //   str += ` and EM.department_id= '${input.department_id}'`;
      // }
      if (input.hospital_id > 0) {
        str += ` and SL.hospital_id= ${input.hospital_id}`;
      }
      if (input.sub_department_id) {
        str += ` and EM.sub_department_id= '${input.sub_department_id}'`;
      }
      // if (input.designation_id) {
      //   str += ` and EM.designation_id= '${input.designation_id}'`;
      // }
      if (input.hims_d_employee_id) {
        str += ` and EM.employee_id= '${input.hims_d_employee_id}'`;
      }
      if (input.group_id) {
        str += ` and EM.employee_group_id= '${input.group_id}'`;
      }
      options.mysql
        .executeQuery({
          query: `select  distinct employee_code, EM.employee_code, EM.full_name,SL.salary_number,SL.year, MONTHNAME(CONCAT('2011-',SL.month,'-01')) as deducting_month, LM.loan_description, LA.loan_application_number,LA.approved_amount, LA.pending_loan, SLL.loan_due_amount, SLL.balance_amount
          from hims_f_salary as SL
          left join hims_d_employee as EM on SL.employee_id = EM.hims_d_employee_id 
          left join hims_f_salary_loans as SLL on SL.hims_f_salary_id = salary_header_id 
          left join hims_f_loan_application as LA on SLL.loan_application_id=hims_f_loan_application_id 
          left join hims_d_loan as LM on LA.loan_id=LM.hims_d_loan_id
          where  loan_authorized='IS'and LA.loan_closed ='N' and SL.year=? and SL.month=?   and SL.salary_type <> 'LS' ${str}  ORDER BY SL.salary_number DESC;`,
          values: [input.year, input.month],
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
