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
      const startMonth = moment(input.leave_start_date, "YYYY-MM-DD").format(
        "MM"
      );
      console.log(startMonth);
      options.mysql
        .executeQuery({
          query: `select hims_f_salary_id ,S.employee_id, S.year,S.month,ED.hims_d_earning_deduction_id as earning_id, ED.earning_deduction_description as earning_description , S.net_salary,  S.total_days, S.display_present_days,S.absent_days,S.total_work_days,S.total_weekoff_days,S.total_holidays,S.total_leave, S.paid_leave,S.unpaid_leave, S.total_paid_days,S.pending_unpaid_leave,
          SE.amount as earning_amount,EDD.hims_d_earning_deduction_id as deduction_id, EDD.earning_deduction_description as deduction_description,SD.amount as deduction_amount, S.total_earnings,S.total_deductions,SDP.sub_department_name, D.department_name, E.employee_code, E.full_name,E.arabic_name, E.date_of_joining, E.exit_date,DE.designation,H.hospital_name,S.loan_due_amount,
          COALESCE(GP.payable_amount,0) as gratuity_amount, 
          COALESCE(LS.balance_leave_days,0) as annual_leave_days,
          COALESCE(LS.balance_leave_salary_amount,0) as annual_leave_salary_amount,
          COALESCE(LE.leave_days,0) as encashed_leave_days,
          COALESCE(LE.leave_amount,0) as encashed_leave_amount
          from hims_f_salary S 
          left join  hims_f_salary_earnings SE on SE.salary_header_id = S.hims_f_salary_id 
          left join hims_f_salary_deductions SD on SD.salary_header_id = S.hims_f_salary_id 
          left join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id 
          left join hims_d_earning_deduction EDD on EDD.hims_d_earning_deduction_id = SD.deductions_id 
          left join hims_d_hospital H on H.hims_d_hospital_id = S.hospital_id 
          left join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
          left join hims_d_designation DE on DE.hims_d_designation_id = E.employee_designation_id 
          left join hims_d_sub_department SDP on  E.sub_department_id=SDP.hims_d_sub_department_id 
          left join hims_d_department D on D.hims_d_department_id = SDP.department_id 
          left join hims_f_end_of_service GP on S.employee_id = GP.employee_id 
          left join hims_f_employee_leave_salary_header LS on S.employee_id = LS.employee_id 
          left join hims_f_leave_encash_header LE on S.employee_id = LE.employee_id and 'APR' = LE.authorized and 'N' = LE.posted
          where hims_f_salary_id in(?)`,
          values: [input.salary_header_id],
          printQuery: true,
        })
        .then((result) => {
          console.log("result", result);
          const outputArray = [];
          if (result.length > 0) {
            const total_loan = _.chain(result)
              .groupBy((g) => g.month)
              .map((m) => {
                return parseFloat(_.head(m).loan_due_amount);
              })
              .sumBy((s) => s)
              .value();

            // employees.forEach((employe) => {

            const earListMonth = _.chain(result)
              .groupBy((g) => g.month)
              .map((item) => {
                return item;
              })
              .value();

            const emp_earnings = [];
            result.forEach((m) => {
              const exist = emp_earnings.find((val) => {
                return val.earning_id == m.earning_id;
              });

              if (!exist) {
                emp_earnings.push({
                  month_name: moment(m.month, "MM").format("MMMM"),
                  earning_id: m.earning_id,
                  earning_description: m.earning_description,
                  earning_amount: m.earning_amount,
                });
              }
            });

            // All month earnings if required
            // const emp_earnings = [];
            // earListMonth.map((item) => {
            //   return {
            //     earEachMonth: _.chain(item)
            //       .groupBy((g) => g.earning_id)
            //       .map((earList, index) => {
            //         emp_earnings.push({
            //           month_name: moment(earList[0].month, "MM").format("MMMM"),
            //           earning_id: earList[0].earning_id,
            //           earning_description: earList[0].earning_description,
            //           earning_amount: earList[0].earning_amount,
            //         });
            //         return earList[0];
            //       })

            //       .value(),
            //   };
            // });

            const emp_deductions = [];
            earListMonth.map((item) => {
              return {
                earEachMonth: _.chain(item)
                  .groupBy((g) => g.deduction_id)
                  .map((earList, index) => {
                    if (earList[0].deduction_id) {
                      emp_deductions.push({
                        month_name: moment(earList[0].month, "MM").format(
                          "MMMM"
                        ),
                        deduction_id: earList[0].deduction_id,
                        deduction_description: earList[0].deduction_description,
                        deduction_amount: earList[0].deduction_amount,
                      });
                      // return earList[0];
                    }
                  })

                  .value(),
              };
            });

            const total_earnings = _.sumBy(emp_earnings, (s) =>
              s.earning_amount != null ? parseFloat(s.earning_amount) : 0
            );

            const total_deductions = _.sumBy(emp_deductions, (s) =>
              s.deduction_amount != null ? parseFloat(s.deduction_amount) : 0
            );

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
              year: result[0].year,
              // month: employe[0].month,
              month: moment(result[0].month, "MM").format("MMMM"),
              net_salary: options.currencyFormat(
                result[0].net_salary,
                options.args.crypto
              ),

              salary_in_words:
                options.args.crypto.currency_symbol +
                " " +
                writtenForm(input.total_amount) +
                " Only",

              total_earnings: options.currencyFormat(
                total_earnings,
                options.args.crypto
              ),

              total_deductions: options.currencyFormat(
                total_deductions,
                options.args.crypto
              ),

              finalNetSalary: options.currencyFormat(
                total_earnings - total_deductions,
                options.args.crypto
              ),

              final_loan_amount: options.currencyFormat(
                result[0].loan_due_amount,
                options.args.crypto
              ),

              sub_department_name: result[0].sub_department_name,
              department_name: result[0].department_name,
              employee_code: result[0].employee_code,
              full_name: result[0].full_name,
              arabic_name: result[0].arabic_name,

              DOJ: moment(result[0].date_of_joining, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),

              DOE: moment(result[0].exit_date, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),
              designation: result[0].designation,
              hospital_name: result[0].hospital_name,
              emp_earnings: emp_earnings,
              emp_deductions: emp_deductions,
              total_days: result[0].total_days,
              display_present_days: result[0].display_present_days,
              absent_days: result[0].absent_days,
              total_work_days: result[0].total_work_days,
              total_weekoff_days: result[0].total_weekoff_days,
              total_holidays: result[0].total_holidays,
              total_leave: result[0].total_leave,
              paid_leave: result[0].paid_leave,
              unpaid_leave: result[0].unpaid_leave,
              total_paid_days: result[0].total_paid_days,
              pending_unpaid_leave: result[0].pending_unpaid_leave,
              loan_due_amount: result[0].loan_due_amount,

              // final_loan_amount: total_loan,
              final_loan_amount: options.currencyFormat(
                total_loan,
                options.args.crypto
              ),

              gratuity_amount: result[0].gratuity_amount,
              acc_gratuity: result[0].acc_gratuity,
              annual_leave_days: result[0].annual_leave_days,
              annual_leave_salary_amount: result[0].annual_leave_salary_amount,
              encashed_leave_days: result[0].encashed_leave_days,
              encashed_leave_amount: result[0].encashed_leave_amount,
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
              ).format("DD/MM/YYYY"),

              leave_end_date: moment(input.leave_end_date, "YYYY-MM-DD").format(
                "DD/MM/YYYY"
              ),

              total_amount: options.currencyFormat(
                input.total_amount,
                options.args.crypto
              ),
            });
            // });

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
