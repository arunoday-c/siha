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
          query: `select 
          max(FA.leave_salary_amount) as leave_salary_amount,
          sum(FA.leave_salary_amount) as total_leave_salary_amount,
          max(FA.leave_days) as leave_days,
          sum(FA.leave_days) as total_leave_days,
          max(FA.airticket_amount) as airticket_amount,
          sum(FA.airticket_amount) as total_airticket_amount,
          FA.employee_id,
          max(FA.employee_code) as employee_code, max(FA.full_name) as full_name,
          max(FA.designation) as designation, max(FA.date_of_joining) as date_of_joining,
          max(FA.basic_salary) as basic_salary, 
          max(FA.year) year, 
          max(FA.deducting_month) deducting_month
          from ( SELECT LH.employee_id,EM.employee_code, EM.full_name,DS.designation, EM.date_of_joining,EE.amount as basic_salary, max(LD.year) as year, MONTHNAME(CONCAT('2011-',LD.month,'-01')) as deducting_month, 
          LD.leave_salary_amount, 
          LD.leave_days, 
          LD.airticket_amount
          FROM hims_f_employee_leave_salary_header LH
          inner join hims_f_employee_leave_salary_detail LD on LD.employee_leave_salary_header_id = LH.hims_f_employee_leave_salary_header_id
          inner join hims_d_employee as EM on LH.employee_id = EM.hims_d_employee_id
          inner join hims_d_designation as DS on DS.hims_d_designation_id = EM.employee_designation_id
          inner join hims_d_employee_earnings as EE on EE.employee_id = EM.hims_d_employee_id and earnings_id=1
          where EM.employee_status <> 'I' and EM.hospital_id=? and LD.year=? and LD.month <= ?  ${str} group by LD.month, LD.leave_salary_amount,LD.leave_days,LD.airticket_amount, LH.employee_id, LH.hims_f_employee_leave_salary_header_id ) as FA group by FA.employee_id;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          const header = result.length ? result[0] : {};
          const open_leave_salary_amount =
            result.total_leave_salary_amount - result.leave_salary_amount;
          const total_leave_salary_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.leave_salary_amount)),
            options.args.crypto
          );
          const total_balance_leave_salary_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.balance_leave_salary_amount)),
            options.args.crypto
          );
          const total_airticket_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.airticket_amount)),
            options.args.crypto
          );
          const total_balance_airticket_amount = options.currencyFormat(
            _.sumBy(result, (s) => parseFloat(s.balance_airticket_amount)),
            options.args.crypto
          );
          resolve({
            result: result,
            header,
            open_leave_salary_amount,
            total_leave_salary_amount,
            total_balance_leave_salary_amount,
            total_airticket_amount,
            total_balance_airticket_amount,
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
