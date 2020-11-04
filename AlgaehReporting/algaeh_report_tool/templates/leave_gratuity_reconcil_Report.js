const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;

      let str = "";
      let input = {};
      let params = options.args.reportParams;
      const decimal_places = options.args.crypto.decimal_places;

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
          query: `select distinct SL.employee_id, EM.employee_code, EM.full_name, DS.designation, EM.date_of_joining,EE.amount as basic_salary, SL.year, MONTHNAME(CONCAT('2011-',SL.month,'-01')) as deducting_month,
          COALESCE((GR.acc_gratuity - GR.gratuity_amount),0) as gratuity_opening_balance,
          COALESCE(GR.gratuity_amount,0) as gratuity_amount,
          COALESCE( GR.acc_gratuity,0) as acc_gratuity,
          COALESCE((LSH.balance_leave_days - LSD.leave_days),0) as leavedays_opening_balance,
          COALESCE(LSD.leave_days,0) as leave_days,
          COALESCE(LSH.balance_leave_days,0) as balance_leave_days,
          COALESCE((LSH.balance_leave_salary_amount - LSD.leave_salary_amount),0) as leavesalary_opening_balance,
          COALESCE(LSD.leave_salary_amount,0) as leave_salary_amount,
          COALESCE(LSH.balance_leave_salary_amount,0) as balance_leave_salary_amount,
          COALESCE((LSH.balance_airticket_amount - LSD.airticket_amount),0) as airefare_opening_balance,
          COALESCE(LSD.airticket_amount,0) as airticket_amount,
          COALESCE( LSH.balance_airticket_amount,0) as balance_airticket_amount
          from hims_f_salary as SL
          inner join hims_d_employee as EM on SL.employee_id = EM.hims_d_employee_id
          inner join hims_d_designation as DS on DS.hims_d_designation_id = EM.employee_designation_id
          inner join hims_d_employee_earnings as EE on EE.employee_id = EM.hims_d_employee_id and earnings_id=1
          left join hims_f_gratuity_provision as GR on SL.employee_id = GR.employee_id and SL.year = GR.year and SL.month = GR.month
          left join hims_f_employee_leave_salary_header as LSH on SL.employee_id = LSH.employee_id
          left join hims_f_employee_leave_salary_detail as LSD on LSH.hims_f_employee_leave_salary_header_id = LSD.employee_leave_salary_header_id and SL.year = LSD.year and SL.month = LSD.month
          where SL.hospital_id=? and SL.year=? and SL.month=? and SL.salary_paid='Y' ${str}  order by EM.employee_code asc;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          const total_gratuity_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.gratuity_amount)),options.args.crypto);
          const total_acc_gratuity = options.currencyFormat(_.sumBy(result, s => parseFloat(s.acc_gratuity)),options.args.crypto);
          const total_leave_salary_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.leave_salary_amount)),options.args.crypto);
          const total_balance_leave_salary_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.balance_leave_salary_amount)),options.args.crypto);
          const total_airticket_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.airticket_amount)),options.args.crypto);
          const total_balance_airticket_amount = options.currencyFormat(_.sumBy(result, s => parseFloat(s.balance_airticket_amount)),options.args.crypto);
          resolve({
            result: result,
            header,
            total_gratuity_amount,
            total_acc_gratuity,
            total_leave_salary_amount,
            total_balance_leave_salary_amount,
            total_airticket_amount,
            total_balance_airticket_amount
           
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
