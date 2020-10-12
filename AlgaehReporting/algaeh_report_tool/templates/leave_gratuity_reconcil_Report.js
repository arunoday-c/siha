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
          query: `select distinct SL.employee_id, EM.employee_code, EM.full_name,SL.salary_number,SL.year, MONTHNAME(CONCAT('2011-',SL.month,'-01')) as deducting_month, GR.gratuity_amount, GR.acc_gratuity, LSD.leave_days, LSD.leave_salary_amount, LSH.balance_leave_days, LSH.balance_leave_salary_amount,LSD.airticket_amount,LSH.balance_airticket_amount
          from hims_f_salary as SL
          inner join hims_d_employee as EM on SL.employee_id = EM.hims_d_employee_id 
          left join hims_f_gratuity_provision as GR on SL.employee_id = GR.employee_id and SL.year = GR.year and SL.month = GR.month
          left join hims_f_employee_leave_salary_header as LSH on SL.employee_id = LSH.employee_id
          left join hims_f_employee_leave_salary_detail as LSD on LSH.hims_f_employee_leave_salary_header_id = LSD.employee_leave_salary_header_id and SL.year = LSD.year and SL.month = LSD.month
          where SL.hospital_id=? and SL.year=? and SL.month=? ${str};`,
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
