import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import utilities from "algaeh-utilities";
module.exports = {
  processSalary: (req, res, next) => {
    let input = req.query;
    const month_number = moment(input.yearAndMonth).format("MM");
    const year = moment(input.yearAndMonth).format("YYYY");
    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query:
          "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, A.sub_department_id, A.total_days,\
          A.present_days, A.absent_days, A.total_work_days, A.total_weekoff_days,\
          A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, A.total_paid_days,E.employee_code \
          from hims_f_attendance_monthly A,hims_d_employee E where `year`=? and `month`=? and A.hospital_id=? \
          and E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id",
        values: [year, month_number, input.hospital_id]
      })
      .then(empResult => {
        const _allEmployees = _.map(empResult, o => {
          return o.employee_id;
        });
        /* table order 
        result[0]=  earningResult;
         result[1]=deductionResult;
         result[2]= contributionResult;
         result[3]=loanResult;*/
        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_earnings_id,employee_id,earnings_id,amount,EE.formula,allocate,\
               EE.calculation_method,EE.calculation_type,ED.component_frequency\
               from hims_d_employee_earnings EE inner join hims_d_earning_deduction ED\
               on EE.earnings_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
               where ED.component_frequency='M' and ED.component_category='E' and EE.employee_id in (?);\
               select hims_d_employee_deductions_id,employee_id,deductions_id,amount,EMP_D.formula,\
               allocate,EMP_D.calculation_method,EMP_D.calculation_type,ED.component_frequency from \
               hims_d_employee_deductions EMP_D inner join hims_d_earning_deduction ED\
               on EMP_D.deductions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
               where ED.component_frequency='M'  and ED.component_category='D' and EMP_D.employee_id in(?);\
               select  hims_d_employee_contributions_id,employee_id,contributions_id,amount,\
                EC.formula,EC.allocate,EC.calculation_method,EC.calculation_type,ED.component_frequency\
                from hims_d_employee_contributions EC inner join hims_d_earning_deduction ED\
                  on EC.contributions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
                  where ED.component_frequency='M'  and ED.component_category='C' and EC.employee_id in (?);\
                  select hims_f_loan_application_id, loan_application_number, employee_id, loan_id, application_reason,\
                  loan_application_date, loan_authorized ,loan_closed, start_month,start_year,installment_amount,pending_loan\
                  from  hims_f_loan_application where loan_authorized='IS' and loan_closed='N' and pending_loan>0\
                  and ((start_year <=? and start_month<=?)||(start_year <?)) and loan_skip_months=0 and employee_id in (?)   ",
            values: [
              _allEmployees,
              _allEmployees,
              _allEmployees,
              year,
              month_number,
              year,
              _allEmployees
            ]
            // printQuery: true
          })
          .then(results => {
            let _requestCollector = [];
            for (let i = 0; i < empResult.length; i++) {
              let final_earning_amount = 0;

              let final_deduction_amount = 0;
              let current_deduction_amt_array = [];

              let final_contribution_amount = 0;
              let current_contribution_amt_array = [];
              let current_earning_amt = 0;
              let current_earning_per_day_salary = 0;
              let current_earning_amt_array = [];
              //Earnigs --- satrt
              const _earnings = _.filter(results[0], f => {
                return f.employee_id == empResult[i]["employee_id"];
              });
              if (_earnings.length > 0) {
                _earnings.map(obj => {
                  if (obj.calculation_type == "F") {
                    current_earning_amt = obj["amount"];
                    current_earning_per_day_salary = parseFloat(
                      obj["amount"] / parseFloat(empResult[i]["total_days"])
                    );
                  } else if (obj["calculation_type"] == "V") {
                    current_earning_per_day_salary = parseFloat(
                      obj["amount"] / parseFloat(empResult[i]["total_days"])
                    );
                    current_earning_amt =
                      current_earning_per_day_salary *
                      parseFloat(empResult[i]["total_paid_days"]);
                  }
                  current_earning_amt_array.push({
                    earnings_id: obj.earnings_id,
                    amount: current_earning_amt,
                    per_day_salary: current_earning_per_day_salary
                  });
                });
              }
              //Earnigs --- End
              //Deduction -- Start

              const _deduction = _.filter(results[1], f => {
                return f.employee_id == empResult[i]["employee_id"];
              });
              let current_deduction_amt = 0;
              let current_deduction_per_day_salary = 0;
              if (_deduction.length > 0) {
                _deduction.map(obj => {
                  if (obj["calculation_type"] == "F") {
                    current_deduction_amt = obj["amount"];
                    current_deduction_per_day_salary = parseFloat(
                      obj["amount"] / parseFloat(empResult[i]["total_days"])
                    );
                  } else if (obj["calculation_type"] == "V") {
                    current_deduction_per_day_salary = parseFloat(
                      obj["amount"] / parseFloat(empResult[i]["total_days"])
                    );

                    current_deduction_amt =
                      current_deduction_per_day_salary *
                      parseFloat(empResult[i]["total_paid_days"]);
                  }
                });
              }
              final_deduction_amount += parseFloat(current_deduction_amt);
              //Deduction -- End

              //Contribution -- Start
              const _contrubutions = _.filter(results[2], f => {
                return f.employee_id == empResult[i]["employee_id"];
              });
              let current_contribution_amt = 0;
              let current_contribution_per_day_salary = 0;
              if (_contrubutions != null) {
                if (_contrubutions["calculation_type"] == "F") {
                  current_contribution_amt = _contrubutions["amount"];
                  current_contribution_per_day_salary = parseFloat(
                    _contrubutions["amount"] /
                      parseFloat(empResult[i]["total_days"])
                  );
                } else if (_contrubutions["calculation_type"] == "V") {
                  current_contribution_per_day_salary = parseFloat(
                    _contrubutions["amount"] /
                      parseFloat(empResult[i]["total_days"])
                  );

                  current_contribution_amt =
                    current_contribution_per_day_salary *
                    parseFloat(empResult[i]["total_paid_days"]);
                }
              }
              final_contribution_amount += parseFloat(current_contribution_amt);
              //Contribution -- End

              //Loan Start
              const _loan = _.filter(results[3], f => {
                return f.employee_id == empResult[i]["employee_id"];
              });
              let total_loan_due_amount = 0;
              let total_loan_payable_amount = 0;
              if (_loan.length > 0) {
                let current_loan_array = _.map(results[4], s => {
                  return {
                    loan_application_id: s.hims_f_loan_application_id,
                    loan_due_amount: s.installment_amount,
                    balance_amount: s.pending_loan
                  };
                });
                total_loan_due_amount = _.sumBy(current_loan_array, s => {
                  return s.loan_due_amount;
                });
                total_loan_payable_amount = _.sumBy(current_loan_array, s => {
                  return s.balance_amount;
                });
              }
              //Loan End

              let per_day_sal =
                final_earning_amount +
                final_deduction_amount +
                final_contribution_amount;
              utilities
                .AlgaehUtilities()
                .logger()
                .log("SaralyProcess", {
                  employee_id: empResult[i]["employee_id"],
                  per_day_sal
                });
              const _salary_number =
                empResult[i]["employee_code"].trim() +
                "-NS-" +
                month_number +
                "-" +
                year;
              //ToDo Advance need to calculate
              const _net_salary =
                final_earning_amount -
                final_deduction_amount -
                total_loan_due_amount -
                0;

              _mysql
                .executeQueryWithTransaction({
                  query:
                    "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,salary_date,per_day_sal,total_days,\
       present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
    unpaid_leave,loan_payable_amount,loan_due_amount,gross_salary,total_earnings,total_deductions,\
      total_contributions,net_salary) \
     VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                  values: [
                    _salary_number,
                    parseInt(month_number),
                    parseInt(year),
                    empResult[i]["employee_id"],
                    new Date(),
                    per_day_sal,
                    empResult[i]["total_days"],
                    empResult[i]["present_days"],
                    empResult[i]["absent_days"],
                    empResult[i]["total_work_days"],
                    empResult[i]["total_weekoff_days"],
                    empResult[i]["total_holidays"],
                    empResult[i]["total_leave"],
                    empResult[i]["paid_leave"],
                    empResult[i]["unpaid_leave"],
                    total_loan_payable_amount,
                    total_loan_due_amount,
                    final_earning_amount,
                    final_earning_amount, //Gross salary = total earnings
                    final_deduction_amount,
                    final_contribution_amount,
                    _net_salary
                  ]
                })
                .then(inserted_salary => {
                  _requestCollector.push(inserted_salary);
                  _mysql
                    .executeQuery({
                      query: "INSERT INTO hims_f_salary_earnings(??) VALUES ?",
                      values: current_earning_amt_array,
                      includeValues: [
                        "earnings_id",
                        "amount",
                        "per_day_salary"
                      ],
                      extraValues: {
                        salary_header_id: inserted_salary.insertId
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(resultEarnings => {
                      if (i == empResult.length - 1) {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = { _requestCollector };
                          next();
                        });
                      }
                    })
                    .catch(error => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(error => {
                  next(error);
                });
            }
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(error => {
        next(error);
      });
  }
};
