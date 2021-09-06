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
          query: `select  distinct employee_code, EM.employee_code, EM.full_name,SL.salary_number,SL.year,
           MONTHNAME(CONCAT('2011-',SL.month,'-01')) as deducting_month, LM.loan_description, 
           LA.loan_application_number,LA.approved_amount, LA.pending_loan, SLL.loan_due_amount, SLL.balance_amount
          from hims_f_salary as SL
          left join hims_d_employee as EM on SL.employee_id = EM.hims_d_employee_id
          left join hims_f_salary_loans as SLL on SL.hims_f_salary_id = salary_header_id
          left join hims_f_loan_application as LA on SLL.loan_application_id=hims_f_loan_application_id
          left join hims_d_loan as LM on LA.loan_id=LM.hims_d_loan_id
          where LA.loan_authorized='IS' and SL.hospital_id=? and SL.year=? and SL.month=? and SL.salary_paid='Y' ${str} ORDER BY SL.salary_number DESC;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          const total_approved_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.approved_amount)),
            options.args.crypto
          );
          const total_balance_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.balance_amount)),
            options.args.crypto
          );
          const total_loan_due_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.loan_due_amount)),
            options.args.crypto
          );
          const total_pending_loan = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.pending_loan)),
            options.args.crypto
          );

          resolve({
            result: result,
            header,
            total_approved_amount,
            total_balance_amount,
            total_loan_due_amount,
            total_pending_loan,
            //  total_balance_amount:_.sumBy(result, s => parseFloat(s.balance_amount)),
            //  total_loan_due_amount:_.sumBy(result, s => parseFloat(s.loan_due_amount)),
            //  total_pending_loan:_.sumBy(result, s => parseFloat(s.pending_loan)),
            // no_employees: result.length,
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
