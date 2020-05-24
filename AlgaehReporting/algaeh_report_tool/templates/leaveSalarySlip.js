const executePDF = function executePDFMethod(options) {
  return new Promise(function (resolve, reject) {
    try {
      const _ = options.loadash;
      const moment = options.moment;
      const writtenForm = options.writtenForm;

      const params = options.args.reportParams;
      let input = {};

      params.forEach((para) => {
        input[para["name"]] = para["value"];
      });
      console.log("INPUT:", input);
      const month = moment(input.month, "M").format("MMMM");
      options.mysql
        .executeQuery({
          query: `select hims_f_salary_id ,S.employee_id, S.year,S.month,ED.hims_d_earning_deduction_id as earning_id,
          ED.earning_deduction_description as earning_description , S.net_salary,S.total_days,\
          S.display_present_days,S.absent_days,S.total_work_days,S.total_weekoff_days,S.total_holidays,S.total_leave,\
          S.paid_leave,S.unpaid_leave, S.total_paid_days,S.pending_unpaid_leave,S.loan_due_amount,\
          SE.amount as earning_amount,EDD.hims_d_earning_deduction_id as deduction_id,\
          EDD.earning_deduction_description as deduction_description,SD.amount as deduction_amount,\
          S.total_earnings,S.total_deductions,SDP.sub_department_name, D.department_name,\
          E.employee_code, E.full_name, E.date_of_joining, E.exit_date,DE.designation,H.hospital_name,\
          COALESCE(GP.payable_amount,0) as gratuity_amount,\
          COALESCE(LS.balance_leave_days,0) as annual_leave_days,\
          COALESCE(LS.balance_leave_salary_amount,0) as annual_leave_salary_amount,\
          COALESCE(LE.leave_days,0) as encashed_leave_days,\
          COALESCE(LE.leave_amount,0) as encashed_leave_amount\
          from hims_f_salary S left join  hims_f_salary_earnings SE on SE.salary_header_id = S.hims_f_salary_id\
          left join hims_f_salary_deductions SD on SD.salary_header_id = S.hims_f_salary_id\
          left join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id\
          left join hims_d_earning_deduction EDD on EDD.hims_d_earning_deduction_id = SD.deductions_id\
          left join hims_d_hospital H on H.hims_d_hospital_id = S.hospital_id\
          left join hims_d_employee E on E.hims_d_employee_id = S.employee_id\
          left join hims_d_designation DE on DE.hims_d_designation_id = E.employee_designation_id\
          left join hims_d_sub_department SDP on  E.sub_department_id=SDP.hims_d_sub_department_id\
          left join hims_d_department D on D.hims_d_department_id = SDP.department_id\
          left join hims_f_end_of_service GP on S.employee_id = GP.employee_id\
          left join hims_f_employee_leave_salary_header LS on S.employee_id = LS.employee_id\
          left join hims_f_leave_encash_header LE on S.employee_id = LE.employee_id and 'APR' = LE.authorized and 'N' = LE.posted\
          where S.salary_type="LS" and S.employee_id in(?) and S.hims_f_salary_id=?;`,
          values: [input.employee_id, input.hims_f_salary_id],
          printQuery: true,
        })
        .then((result) => {
          const outputArray = [];
          if (result.length > 0) {
            const employees = _.chain(result)
              .groupBy((g) => g.hims_f_salary_id)
              .map((m) => m)
              .value();

            employees.forEach((employe) => {
              const emp_earnings = [];
              employe.forEach((m) => {
                const exist = emp_earnings.find((val) => {
                  return val.earning_id == m.earning_id;
                });

                if (!exist) {
                  emp_earnings.push({
                    earning_id: m.earning_id,
                    earning_description: m.earning_description,
                    earning_amount: m.earning_amount,
                  });
                }
              });

              const emp_deductions = [];
              employe.forEach((m) => {
                const exist = emp_deductions.find((val) => {
                  return val.deduction_id == m.deduction_id;
                });

                if (!exist) {
                  emp_deductions.push({
                    deduction_id: m.deduction_id,
                    deduction_description: m.deduction_description,
                    deduction_amount: m.deduction_amount,
                  });
                }
              });
              const emp_ded_length = emp_deductions.length;
              const emp_ear_length = emp_earnings.length;
              if (emp_ded_length > emp_ear_length) {
                const blankIndexs = emp_ded_length - emp_ear_length;
                for (let d = 0; d < blankIndexs; d++) {
                  emp_earnings.push({});
                }
              } else if (emp_ear_length > emp_ded_length) {
                const blankIndexs = emp_ear_length - emp_ded_length;
                for (let d = 0; d < blankIndexs; d++) {
                  emp_deductions.push({});
                }
              }
              outputArray.push({
                year: employe[0].year,
                // month: employe[0].month,
                month: moment(employe[0].month, "MM").format("MMMM"),
                net_salary: options.currencyFormat(
                  employe[0].net_salary,
                  options.args.crypto
                ),

                salary_in_words:
                  options.args.crypto.currency_symbol +
                  " " +
                  writtenForm(input.total_amount) +
                  " Only",

                total_earnings: options.currencyFormat(
                  employe[0].total_earnings,
                  options.args.crypto
                ),

                total_deductions: options.currencyFormat(
                  employe[0].total_deductions,
                  options.args.crypto
                ),

                sub_department_name: employe[0].sub_department_name,
                department_name: employe[0].department_name,
                employee_code: employe[0].employee_code,
                full_name: employe[0].full_name,

                DOJ: moment(employe[0].date_of_joining, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                ),

                DOE: employe[0].exit_date,
                designation: employe[0].designation,
                hospital_name: employe[0].hospital_name,
                emp_earnings: emp_earnings,
                emp_deductions: emp_deductions,
                total_days: employe[0].total_days,
                display_present_days: employe[0].display_present_days,
                absent_days: employe[0].absent_days,
                total_work_days: employe[0].total_work_days,
                total_weekoff_days: employe[0].total_weekoff_days,
                total_holidays: employe[0].total_holidays,
                total_leave: employe[0].total_leave,
                paid_leave: employe[0].paid_leave,
                unpaid_leave: employe[0].unpaid_leave,
                total_paid_days: employe[0].total_paid_days,
                pending_unpaid_leave: employe[0].pending_unpaid_leave,
                loan_due_amount: employe[0].loan_due_amount,
                gratuity_amount: employe[0].gratuity_amount,
                acc_gratuity: employe[0].acc_gratuity,
                annual_leave_days: employe[0].annual_leave_days,
                annual_leave_salary_amount:
                  employe[0].annual_leave_salary_amount,
                encashed_leave_days: employe[0].encashed_leave_days,
                encashed_leave_amount: employe[0].encashed_leave_amount,
                leave_amount: options.currencyFormat(
                  input.leave_amount,
                  options.args.crypto
                ),
                airfare_amount: options.currencyFormat(
                  input.airfare_amount,
                  options.args.crypto
                ),
                leave_period: input.leave_period,
                leave_start_date: moment(
                  input.leave_start_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY"),

                leave_end_date: moment(
                  input.leave_end_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY"),

                total_amount: options.currencyFormat(
                  input.total_amount,
                  options.args.crypto
                ),
              });
            });

            resolve({
              result: outputArray,
            });
          } else {
            resolve({
              result: result,
            });
          }
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
