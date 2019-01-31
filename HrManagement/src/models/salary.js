import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import utilities from "algaeh-utilities";
import mysql from "mysql";

module.exports = {
  processSalary: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;

      const input = req.query;
      const month_number = input.month;
      const year = input.year;

      utilities
        .AlgaehUtilities()
        .logger()
        .log("input:", input);

      utilities
        .AlgaehUtilities()
        .logger()
        .log("employee_id:", input.employee_id);

      utilities
        .AlgaehUtilities()
        .logger()
        .log("sub_department_id:", input.sub_department_id);

      let inputValues = [input.year, input.month, input.hospital_id];
      let _stringData = "";
      if (input.employee_id != null) {
        _stringData += " and A.employee_id=?";
        inputValues.push(input.employee_id);
      }
      if (input.sub_department_id != null) {
        _stringData += " and A.sub_department_id=? ";
        inputValues.push(input.sub_department_id);
      }

      let salary_input = [month_number, year];
      let _strSalary = "";
      if (input.employee_id != null) {
        _strSalary += " and employee_id=?";
        salary_input.push(input.employee_id);
      }

      if (input.sub_department_id != null) {
        _strSalary += " and sub_department_id=? ";
        salary_input.push(input.sub_department_id);
      }

      utilities
        .AlgaehUtilities()
        .logger()
        .log("input:", input);

      _mysql
        .executeQuery({
          query:
            "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, A.sub_department_id, \
            A.total_days,A.present_days, A.absent_days, A.total_work_days, A.total_weekoff_days,\
            A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, A.total_paid_days,A.ot_work_hours,\
            A.ot_weekoff_hours,A.ot_holiday_hours, E.employee_code,E.gross_salary\
            from hims_f_attendance_monthly A,hims_d_employee E\
            where E.hims_d_employee_id = A.employee_id  and A.hospital_id = E.hospital_id and `year`=? and `month`=? and A.hospital_id=? " +
            _stringData,
          values: inputValues,
          printQuery: true
        })
        .then(empResult => {
          // let empResult = empOutput;
          if (empResult.length > 0) {
            utilities
              .AlgaehUtilities()
              .logger()
              .log("empResult", empResult);
            let _allEmployees = _.map(empResult, o => {
              return o.employee_id;
            });

            _mysql
              .executeQuery({
                query:
                  "select employee_id,hims_f_salary_id,salary_processed from  hims_f_salary where month=? and year=? " +
                  _strSalary,
                values: salary_input,
                printQuery: true
              })
              .then(existing => {
                console.log("Existing Block", existing);

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("_allEmployees", _allEmployees);

                let _salary_processed = _.chain(existing)
                  .filter(f => {
                    return f.salary_processed == "Y";
                  })
                  .value();

                let _salary_processed_emp = _.map(_salary_processed, o => {
                  return o.employee_id;
                });

                let _salary_processed_salary_id = _.map(
                  _salary_processed,
                  o => {
                    return o.hims_f_salary_id;
                  }
                );
                let _myemp = [];

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("_salary_processed", _salary_processed);
                let _itWentInside = false;

                let _salaryHeader_id = existing.map(item => {
                  return item.hims_f_salary_id;
                });

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("_salaryHeader_id", _salaryHeader_id);

                if (_salary_processed.length > 0) {
                  _itWentInside = true;

                  _myemp = _allEmployees.filter(
                    val => !_salary_processed_emp.includes(val)
                  );

                  _salaryHeader_id = _salaryHeader_id.filter(
                    val => !_salary_processed_salary_id.includes(val)
                  );

                  let removal_index = _.findIndex(empResult, function(o) {
                    return o.employee_id == _salary_processed_emp;
                  });

                  empResult.splice(removal_index, 1);
                } else {
                  _myemp = _allEmployees;
                }

                if (_myemp.length > 0) {
                  _allEmployees = _myemp;
                } else {
                  if (_itWentInside) {
                    if (req.mySQl == null) {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = {};
                        next();
                      });
                    } else {
                      resolve({});
                    }

                    return;
                  }
                }

                const month_name = moment(input.month).format("MMMM");

                let strQuery =
                  "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
                  month_name +
                  " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                  FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                  and ML.leave_id=LR.leave_header_id and LR.calculation_type='SL'and L.hims_d_leave_id = LR.leave_header_id and\
                  L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
                  month_name +
                  " > 0 and (availed_till_date >= to_value   or availed_till_date >=from_value and availed_till_date <=to_value )\
                    and  employee_id in (?) and year=? union all	";
                strQuery +=
                  "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
                  month_name +
                  " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                    FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                    and ML.leave_id=LR.leave_header_id and LR.calculation_type='CO'and L.hims_d_leave_id = LR.leave_header_id and \
                    L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
                  month_name +
                  " > 0 and  employee_id in (?) and year=? ;";

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("strQuery:", strQuery);

                _salaryHeader_id =
                  _salaryHeader_id.length == 0 ? null : _salaryHeader_id;
                _mysql
                  .executeQuery({
                    query:
                      "select hims_d_employee_earnings_id,employee_id,earnings_id,amount,EE.formula,allocate,\
                    EE.calculation_method,EE.calculation_type,ED.component_frequency,ED.overtime_applicable\
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
                    loan_application_date, loan_authorized ,loan_closed, start_month,start_year,loan_skip_months,installment_amount,pending_loan\
                    from  hims_f_loan_application where loan_authorized='IS' and loan_closed='N' and pending_loan>0\
                    and ((start_year <=? and start_month<=?)||(start_year <?)) and employee_id in (?);\
                  select payment_amount, employee_id from hims_f_employee_payments where payment_type ='AD' and \
                    deducted='N'and cancel='N' and `year`=? and deduction_month=? and employee_id in (?);\
                  select employee_id,earning_deductions_id,amount,category from hims_f_miscellaneous_earning_deduction \
                    where processed = 'N' and `year`=? and month=? and employee_id in (?);\
                  select hims_f_loan_application_id, loan_application_number, employee_id, loan_id,\
                    loan_application_date, approved_amount\
                    from  hims_f_loan_application where loan_authorized='APR' and loan_dispatch_from='SAL' and employee_id in (?);\
                  select hims_d_earning_deduction_id from hims_d_earning_deduction where component_category = 'D' and component_type='AD';\
                  select hims_d_hrms_options_id,standard_working_hours,standard_break_hours from hims_d_hrms_options;\
                  select hims_d_earning_deduction_id from hims_d_earning_deduction where component_type='OV';\
                  select E.hims_d_employee_id as employee_id, OT.payment_type, OT.working_day_hour, OT. weekoff_day_hour, \
                    OT.holiday_hour, OT.working_day_rate, OT.weekoff_day_rate, OT.holiday_rate  \
                    from hims_d_overtime_group OT, hims_d_employee E where E.overtime_group_id=OT.hims_d_overtime_group_id and E.hims_d_employee_id in (?);\
                  delete from hims_f_salary_contributions where salary_header_id in (?);\
                  delete from hims_f_salary_loans where salary_header_id in (?);\
                  delete from hims_f_salary_deductions where salary_header_id in (?);\
                  delete from hims_f_salary_earnings where salary_header_id in (?);\
                  delete from hims_f_salary where hims_f_salary_id in (?);" +
                      strQuery,
                    values: [
                      _myemp,
                      _myemp,
                      _myemp,
                      year,
                      month_number,
                      year,
                      _myemp,
                      year,
                      month_number,
                      _myemp,
                      year,
                      month_number,
                      _myemp,
                      _myemp,
                      _myemp,
                      _salaryHeader_id,
                      _salaryHeader_id,
                      _salaryHeader_id,
                      _salaryHeader_id,
                      _salaryHeader_id,

                      _myemp,
                      input.year,
                      _myemp,
                      input.year
                    ],
                    printQuery: true
                  })
                  .then(Salaryresults => {
                    let _requestCollector = [];
                    for (let i = 0; i < empResult.length; i++) {
                      let results = Salaryresults;
                      let salary_header_id = 0;
                      let final_earning_amount = 0;
                      let current_earning_amt_array = [];

                      let final_deduction_amount = 0;
                      let current_deduction_amt_array = [];

                      let final_contribution_amount = 0;
                      let current_contribution_amt_array = [];

                      let total_loan_due_amount = 0;
                      let total_loan_payable_amount = 0;

                      let advance_due_amount = 0;
                      let current_loan_array = [];
                      //Earnigs --- satrt
                      const _earnings = _.filter(results[0], f => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });

                      const _LeaveRule = _.filter(results[16], f => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });

                      getEarningComponents({
                        earnings: _earnings,
                        empResult: empResult[i],
                        leave_salary: req.query.leave_salary,
                        _mysql: _mysql,
                        input: input,
                        _LeaveRule: _LeaveRule
                      })
                        .then(earningOutput => {
                          utilities
                            .AlgaehUtilities()
                            .logger()
                            .log("earningOutput", earningOutput);

                          current_earning_amt_array =
                            earningOutput.current_earning_amt_array;
                          final_earning_amount =
                            earningOutput.final_earning_amount;

                          const _deduction = _.filter(results[1], f => {
                            return f.employee_id == empResult[i]["employee_id"];
                          });

                          getDeductionComponents({
                            deduction: _deduction,
                            empResult: empResult[i],
                            leave_salary: req.query.leave_salary
                          })
                            .then(deductionOutput => {
                              current_deduction_amt_array =
                                deductionOutput.current_deduction_amt_array;
                              final_deduction_amount =
                                deductionOutput.final_deduction_amount;

                              //Contribution -- Start
                              const _contrubutions = _.filter(results[2], f => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
                              });
                              getContrubutionsComponents({
                                contribution: _contrubutions,
                                empResult: empResult[i],
                                leave_salary: req.query.leave_salary
                              })
                                .then(contributionOutput => {
                                  current_contribution_amt_array =
                                    contributionOutput.current_contribution_amt_array;
                                  final_contribution_amount =
                                    contributionOutput.final_contribution_amount;

                                  //Loan Due Start
                                  const _loan = _.filter(results[3], f => {
                                    return (
                                      f.employee_id ==
                                      empResult[i]["employee_id"]
                                    );
                                  });

                                  //Loan Payable
                                  const _loanPayable = _.filter(
                                    results[6],
                                    f => {
                                      return (
                                        f.employee_id ==
                                        empResult[i]["employee_id"]
                                      );
                                    }
                                  );

                                  getLoanDueandPayable({
                                    loan: _loan,
                                    loanPayable: _loanPayable
                                  })
                                    .then(loanOutput => {
                                      total_loan_due_amount =
                                        loanOutput.total_loan_due_amount;
                                      total_loan_payable_amount =
                                        loanOutput.total_loan_payable_amount;

                                      current_loan_array =
                                        loanOutput.current_loan_array;

                                      //Advance
                                      const _advance = _.filter(
                                        results[4],
                                        f => {
                                          return (
                                            f.employee_id ==
                                            empResult[i]["employee_id"]
                                          );
                                        }
                                      );

                                      getAdvanceDue({
                                        advance: _advance,
                                        dedcomponent: results[7]
                                      })
                                        .then(advanceOutput => {
                                          advance_due_amount =
                                            advanceOutput.advance_due_amount;

                                          final_deduction_amount =
                                            final_deduction_amount +
                                            advanceOutput.advance_due_amount;

                                          current_deduction_amt_array = current_deduction_amt_array.concat(
                                            advanceOutput.current_deduct_compoment
                                          );

                                          //Miscellaneous Earning Deduction
                                          const _over_time = _.filter(
                                            results[10],
                                            f => {
                                              return (
                                                f.employee_id ==
                                                empResult[i]["employee_id"]
                                              );
                                            }
                                          );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log("_over_time", _over_time);

                                          getOtManagement({
                                            earnings: _earnings,
                                            current_earning_amt_array: current_earning_amt_array,
                                            empResult: empResult[i],
                                            hrms_option: results[8],
                                            over_time_comp: results[9],
                                            over_time: _over_time,
                                            leave_salary: req.query.leave_salary
                                          })
                                            .then(OTManagement => {
                                              final_earning_amount =
                                                final_earning_amount +
                                                OTManagement.final_earning_amount;

                                              current_earning_amt_array = current_earning_amt_array.concat(
                                                OTManagement.current_ot_amt_array
                                              );

                                              //Miscellaneous Earning Deduction
                                              const _miscellaneous = _.filter(
                                                results[5],
                                                f => {
                                                  return (
                                                    f.employee_id ==
                                                    empResult[i]["employee_id"]
                                                  );
                                                }
                                              );
                                              getMiscellaneous({
                                                miscellaneous: _miscellaneous
                                              })
                                                .then(miscellaneousOutput => {
                                                  current_earning_amt_array = current_earning_amt_array.concat(
                                                    miscellaneousOutput.current_earn_compoment
                                                  );
                                                  current_deduction_amt_array = current_deduction_amt_array.concat(
                                                    miscellaneousOutput.current_deduct_compoment
                                                  );

                                                  final_earning_amount =
                                                    final_earning_amount +
                                                    miscellaneousOutput.final_earning_amount;
                                                  final_deduction_amount =
                                                    final_deduction_amount +
                                                    miscellaneousOutput.final_deduction_amount;

                                                  //Salary Calculation Starts

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "final_earning_amount",
                                                  //     final_earning_amount
                                                  //   );

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "final_deduction_amount",
                                                  //     final_deduction_amount
                                                  //   );

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "final_contribution_amount",
                                                  //     final_contribution_amount
                                                  //   );

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "total_loan_payable_amount",
                                                  //     total_loan_payable_amount
                                                  //   );

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "total_loan_due_amount",
                                                  //     total_loan_due_amount
                                                  //   );

                                                  // utilities
                                                  //   .AlgaehUtilities()
                                                  //   .logger()
                                                  //   .log(
                                                  //     "advance_due_amount",
                                                  //     advance_due_amount
                                                  //   );

                                                  let per_day_sal =
                                                    empResult[i][
                                                      "gross_salary"
                                                    ] /
                                                    empResult[i]["total_days"];

                                                  utilities
                                                    .AlgaehUtilities()
                                                    .logger()
                                                    .log("SaralyProcess", {
                                                      employee_id:
                                                        empResult[i][
                                                          "employee_id"
                                                        ],
                                                      per_day_sal
                                                    });

                                                  utilities
                                                    .AlgaehUtilities()
                                                    .logger()
                                                    .log(
                                                      "employee_code",
                                                      empResult[i][
                                                        "employee_code"
                                                      ]
                                                    );

                                                  utilities
                                                    .AlgaehUtilities()
                                                    .logger()
                                                    .log(
                                                      "empResult",
                                                      empResult[i]
                                                    );
                                                  let _salary_number = empResult[
                                                    i
                                                  ]["employee_code"].trim();

                                                  utilities
                                                    .AlgaehUtilities()
                                                    .logger()
                                                    .log(
                                                      "_salary_number",
                                                      _salary_number
                                                    );

                                                  _salary_number +=
                                                    req.query.leave_salary ==
                                                    null
                                                      ? "-NS-"
                                                      : "-LS-";
                                                  _salary_number +=
                                                    month_number + "-" + year;

                                                  let _net_salary =
                                                    final_earning_amount -
                                                    final_deduction_amount -
                                                    total_loan_due_amount;

                                                  _net_salary =
                                                    _net_salary +
                                                    total_loan_payable_amount;
                                                  utilities
                                                    .AlgaehUtilities()
                                                    .logger()
                                                    .log(
                                                      "_net_salary",
                                                      _net_salary
                                                    );

                                                  _mysql
                                                    .executeQueryWithTransaction(
                                                      {
                                                        query:
                                                          "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,sub_department_id,salary_date,per_day_sal,total_days,\
                                            present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                            unpaid_leave,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                            total_contributions,net_salary, total_paid_days) \
                                            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
                                                        values: [
                                                          _salary_number,
                                                          parseInt(
                                                            month_number
                                                          ),
                                                          parseInt(year),
                                                          empResult[i][
                                                            "employee_id"
                                                          ],
                                                          empResult[i][
                                                            "sub_department_id"
                                                          ],
                                                          new Date(),
                                                          per_day_sal,
                                                          empResult[i][
                                                            "total_days"
                                                          ],
                                                          empResult[i][
                                                            "present_days"
                                                          ],
                                                          empResult[i][
                                                            "absent_days"
                                                          ],
                                                          empResult[i][
                                                            "total_work_days"
                                                          ],
                                                          empResult[i][
                                                            "total_weekoff_days"
                                                          ],
                                                          empResult[i][
                                                            "total_holidays"
                                                          ],
                                                          empResult[i][
                                                            "total_leave"
                                                          ],
                                                          empResult[i][
                                                            "paid_leave"
                                                          ],
                                                          empResult[i][
                                                            "unpaid_leave"
                                                          ],
                                                          total_loan_payable_amount,
                                                          total_loan_due_amount,
                                                          advance_due_amount,
                                                          final_earning_amount,
                                                          final_earning_amount, //Gross salary = total earnings
                                                          final_deduction_amount,
                                                          final_contribution_amount,
                                                          _net_salary,
                                                          empResult[i][
                                                            "total_paid_days"
                                                          ]
                                                        ],
                                                        printQuery: true
                                                      }
                                                    )
                                                    .then(inserted_salary => {
                                                      utilities
                                                        .AlgaehUtilities()
                                                        .logger()
                                                        .log(
                                                          "inserted_salary",
                                                          inserted_salary.insertId
                                                        );
                                                      _requestCollector.push(
                                                        inserted_salary
                                                      );

                                                      salary_header_id =
                                                        inserted_salary.insertId;
                                                      let execute_query = {};
                                                      if (
                                                        current_earning_amt_array.length >
                                                        0
                                                      ) {
                                                        execute_query = {
                                                          query:
                                                            "INSERT INTO hims_f_salary_earnings(??) VALUES ?",
                                                          values: current_earning_amt_array,
                                                          includeValues: [
                                                            "earnings_id",
                                                            "amount",
                                                            "per_day_salary"
                                                          ],
                                                          extraValues: {
                                                            salary_header_id: salary_header_id
                                                          },
                                                          bulkInsertOrUpdate: true,
                                                          printQuery: true
                                                        };
                                                      } else {
                                                        execute_query = {
                                                          query: "select 1"
                                                        };
                                                      }
                                                      _mysql
                                                        .executeQuery(
                                                          execute_query
                                                        )
                                                        .then(
                                                          resultEarnings => {
                                                            if (
                                                              current_deduction_amt_array.length >
                                                              0
                                                            ) {
                                                              execute_query = {
                                                                query:
                                                                  "INSERT INTO hims_f_salary_deductions(??) VALUES ?",
                                                                values: current_deduction_amt_array,
                                                                includeValues: [
                                                                  "deductions_id",
                                                                  "amount",
                                                                  "per_day_salary"
                                                                ],
                                                                extraValues: {
                                                                  salary_header_id: salary_header_id
                                                                },
                                                                bulkInsertOrUpdate: true,
                                                                printQuery: true
                                                              };
                                                            } else {
                                                              execute_query = {
                                                                query:
                                                                  "select 1"
                                                              };
                                                            }
                                                            _mysql
                                                              .executeQuery(
                                                                execute_query
                                                              )
                                                              .then(
                                                                resultDeductions => {
                                                                  if (
                                                                    current_contribution_amt_array.length >
                                                                    0
                                                                  ) {
                                                                    execute_query = {
                                                                      query:
                                                                        "INSERT INTO hims_f_salary_contributions(??) VALUES ?",
                                                                      values: current_contribution_amt_array,
                                                                      includeValues: [
                                                                        "contributions_id",
                                                                        "amount"
                                                                      ],
                                                                      extraValues: {
                                                                        salary_header_id: salary_header_id
                                                                      },
                                                                      bulkInsertOrUpdate: true,
                                                                      printQuery: true
                                                                    };
                                                                  } else {
                                                                    execute_query = {
                                                                      query:
                                                                        "select 1"
                                                                    };
                                                                  }
                                                                  _mysql
                                                                    .executeQuery(
                                                                      execute_query
                                                                    )
                                                                    .then(
                                                                      resultContribute => {
                                                                        if (
                                                                          current_loan_array.length >
                                                                          0
                                                                        ) {
                                                                          execute_query = {
                                                                            query:
                                                                              "INSERT INTO hims_f_salary_loans(??) VALUES ?",
                                                                            values: current_loan_array,
                                                                            includeValues: [
                                                                              "loan_application_id",
                                                                              "loan_due_amount",
                                                                              "balance_amount"
                                                                            ],
                                                                            extraValues: {
                                                                              salary_header_id: salary_header_id
                                                                            },
                                                                            bulkInsertOrUpdate: true,
                                                                            printQuery: true
                                                                          };
                                                                        } else {
                                                                          execute_query = {
                                                                            query:
                                                                              "select 1"
                                                                          };
                                                                        }

                                                                        _mysql
                                                                          .executeQuery(
                                                                            execute_query
                                                                          )
                                                                          .then(
                                                                            resultLoan => {
                                                                              if (
                                                                                i ==
                                                                                empResult.length -
                                                                                  1
                                                                              ) {
                                                                                if (
                                                                                  req.mySQl ==
                                                                                  null
                                                                                ) {
                                                                                  _mysql.commitTransaction(
                                                                                    () => {
                                                                                      _mysql.releaseConnection();
                                                                                      req.records = resultLoan;
                                                                                      next();
                                                                                    }
                                                                                  );
                                                                                } else {
                                                                                  resolve(
                                                                                    salary_header_id
                                                                                  );
                                                                                }
                                                                              }
                                                                            }
                                                                          )
                                                                          .catch(
                                                                            error => {
                                                                              reject(
                                                                                error
                                                                              );
                                                                              _mysql.rollBackTransaction(
                                                                                () => {
                                                                                  next(
                                                                                    error
                                                                                  );
                                                                                }
                                                                              );
                                                                            }
                                                                          );
                                                                      }
                                                                    )
                                                                    .catch(
                                                                      error => {
                                                                        utilities
                                                                          .AlgaehUtilities()
                                                                          .logger()
                                                                          .log(
                                                                            "ErrorContri:",
                                                                            "ErrorContri"
                                                                          );

                                                                        _mysql.rollBackTransaction(
                                                                          () => {
                                                                            reject(
                                                                              error
                                                                            );
                                                                            next(
                                                                              error
                                                                            );
                                                                          }
                                                                        );
                                                                      }
                                                                    );
                                                                }
                                                              )
                                                              .catch(error => {
                                                                utilities
                                                                  .AlgaehUtilities()
                                                                  .logger()
                                                                  .log(
                                                                    "ErrorDect:",
                                                                    "ErrorDect"
                                                                  );

                                                                _mysql.rollBackTransaction(
                                                                  () => {
                                                                    reject(
                                                                      error
                                                                    );
                                                                    next(error);
                                                                  }
                                                                );
                                                              });
                                                          }
                                                        )
                                                        .catch(error => {
                                                          reject(error);
                                                          _mysql.rollBackTransaction(
                                                            () => {
                                                              next(error);
                                                            }
                                                          );
                                                        });
                                                    })
                                                    .catch(error => {
                                                      reject(error);
                                                      _mysql.rollBackTransaction(
                                                        () => {
                                                          next(error);
                                                        }
                                                      );
                                                    });
                                                })
                                                .catch(e => {
                                                  reject(e);
                                                  next(e);
                                                });
                                            })
                                            .catch(e => {
                                              reject(e);
                                              next(e);
                                            });
                                        })
                                        .catch(e => {
                                          reject(e);
                                          next(e);
                                        });
                                    })
                                    .catch(e => {
                                      reject(e);
                                      next(e);
                                    });
                                  //Loan Due End
                                })
                                .catch(e => {
                                  reject(e);
                                  next(e);
                                });
                              //Contribution -- End
                            })
                            .catch(e => {
                              reject(e);
                              next(e);
                            });

                          //Deduction -- End
                        })
                        .catch(e => {
                          reject(e);
                          next(e);
                        });
                      //Earnigs --- End
                    }
                  })
                  .catch(e => {
                    reject(e);
                    next(e);
                  });
              })
              .catch(e => {
                reject(e);
                next(e);
              });
          } else {
            utilities
              .AlgaehUtilities()
              .logger()
              .log("empResult: ", empResult);

            _mysql.releaseConnection();
            req.records = empResult;
            resolve(empResult);
            next();
          }
        })
        .catch(error => {
          reject(error);
          next(error);
        });
    }).catch(e => {
      next(e);
    });
  },

  getSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let salaryprocess_header = [];

    /* Select statemwnt  */

    utilities
      .AlgaehUtilities()
      .logger()
      .log("inputParam:", inputParam);

    let _stringData =
      inputParam.employee_id != null ? " and employee_id=? " : "";

    _stringData +=
      inputParam.sub_department_id != null
        ? " and emp.sub_department_id=? "
        : "";

    _mysql
      .executeQuery({
        query:
          "select hims_f_salary_id, employee_id,salary_number, total_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
          total_leave,paid_leave,unpaid_leave,present_days, pending_unpaid_leave, total_paid_days, hims_f_salary.gross_salary, \
          hims_f_salary.net_salary,advance_due,hims_f_salary.total_earnings,hims_f_salary.total_deductions,loan_payable_amount, \
          loan_due_amount,salary_processed,salary_paid,emp.employee_code, emp.full_name from hims_f_salary, hims_d_employee emp where \
          hims_f_salary.employee_id = emp.hims_d_employee_id and `year` = ? and `month` = ? and emp.hospital_id=? " +
          _stringData,
        values: _.valuesIn(inputParam),
        printQuery: true
      })
      .then(salary_process => {
        if (salary_process.length > 0) {
          const _salaryHeader_id = salary_process.map(item => {
            return item.hims_f_salary_id;
          });
          salaryprocess_header = salary_process;
          utilities
            .AlgaehUtilities()
            .logger()
            .log("_salaryHeader_id: ", _salaryHeader_id);

          _mysql
            .executeQuery({
              query:
                "select * from hims_f_salary_earnings, hims_d_earning_deduction earnded where salary_header_id in (?) \
                and earnded.hims_d_earning_deduction_id = hims_f_salary_earnings.earnings_id;\
                select * from hims_f_salary_deductions, hims_d_earning_deduction earnded where salary_header_id in (?) \
                and earnded.hims_d_earning_deduction_id = hims_f_salary_deductions.deductions_id;\
                select * from hims_f_salary_contributions, hims_d_earning_deduction earnded where salary_header_id in (?) \
                and earnded.hims_d_earning_deduction_id = hims_f_salary_contributions.contributions_id;",
              values: [_salaryHeader_id, _salaryHeader_id, _salaryHeader_id],
              printQuery: true
            })
            .then(result => {
              utilities
                .AlgaehUtilities()
                .logger()
                .log("result: ", result);

              _mysql.releaseConnection();
              req.records = [
                {
                  salaryprocess_header: salaryprocess_header,
                  salaryprocess_detail: result
                }
              ];
              next();
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = salary_process;
          next();
        }
      })
      .catch(e => {
        next(e);
      });
  },

  getSalaryProcessToPay: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let _stringData =
      inputParam.employee_id != null ? " and employee_id=? " : "";

    _stringData +=
      inputParam.sub_department_id != null
        ? " and emp.sub_department_id=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_salary_id, salary_number, employee_id,present_days, salary_processed, hims_f_salary.gross_salary, \
          hims_f_salary.net_salary,advance_due,loan_payable_amount, loan_due_amount, emp.employee_code, emp.full_name,salary_paid \
          from hims_f_salary, hims_d_employee emp where \
          hims_f_salary.employee_id = emp.hims_d_employee_id and salary_processed = 'Y' and `year` = ? and `month` = ? " +
          _stringData,
        values: _.valuesIn(inputParam),
        printQuery: true
      })
      .then(salary_process => {
        _mysql.releaseConnection();

        req.records = salary_process.map(data => {
          return {
            ...data,
            select_to_pay: "N"
          };
        });

        next();
      })
      .catch(e => {
        next(e);
      });
  },

  //FINALIZE AND INSERT LEAVE_SALARY_ACCRUAL
  finalizedSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = { ...req.body };

    utilities
      .AlgaehUtilities()
      .logger()
      .log("inputParam: ", inputParam);

    _mysql
      .generateRunningNumber({
        modules: ["LEAVE_ACCRUAL"]
      })
      .then(generatedNumbers => {
        let leave_salary_number = generatedNumbers[0];

        utilities
          .AlgaehUtilities()
          .logger()
          .log("leave_salary_number: ", generatedNumbers[0]);
        _mysql
          .executeQuery({
            query:
              "select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
              inputParam.year +
              " as year," +
              inputParam.month +
              " as month, \
            CASE when airfare_factor = 'PB' then ((amount / 100)*airfare_percentage) else (airfare_amount/airfare_eligibility) end airfare_amount,\
            sum((EE.amount *12)/365)* EG.monthly_accrual_days as leave_salary\
            from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
            where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
            EE.earnings_id=ED.hims_d_earning_deduction_id and \
            ED.annual_salary_comp='Y' and E.hims_d_employee_id in (?) group by EE.employee_id;",
            values: [inputParam.employee_id],

            printQuery: true
          })
          .then(leave_accrual_detail => {
            let leave_salary_accrual_detail = leave_accrual_detail;

            const total_leave_salary = _.sumBy(
              leave_salary_accrual_detail,
              s => {
                return s.leave_salary;
              }
            );

            const total_airfare_amount = _.sumBy(
              leave_salary_accrual_detail,
              s => {
                return s.airfare_amount;
              }
            );

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_f_leave_salary_accrual_header` (leave_salary_number,year,month, total_leave_salary,total_airfare_amount\
                    ,leave_salary_date ,created_date,created_by)\
                    VALUE(?,?,?,?,?,?,?,?);",
                values: [
                  leave_salary_number,
                  inputParam.year,
                  inputParam.month,
                  total_leave_salary,
                  total_airfare_amount,
                  moment(new Date()).format("YYYY-MM-DD"),
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id
                ],
                printQuery: true
              })
              .then(accrual_header => {
                let leave_salary_header_id = accrual_header.insertId;
                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("accrual_header: ", accrual_header);

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log(
                    "leave_salary_accrual_detail: ",
                    leave_salary_accrual_detail
                  );

                let IncludeValues = [
                  "employee_id",
                  "year",
                  "month",
                  "leave_days",
                  "leave_salary",
                  "airfare_amount"
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_leave_salary_accrual_detail(??) VALUES ?",
                    values: leave_salary_accrual_detail,
                    includeValues: IncludeValues,
                    extraValues: {
                      leave_salary_header_id: leave_salary_header_id
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(leave_detail => {
                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE hims_f_salary SET salary_processed = 'Y' where hims_f_salary_id in (?)",
                        values: [inputParam.salary_header_id],
                        printQuery: true
                      })
                      .then(salary_process => {
                        InsertEmployeeLeaveSalary({
                          leave_salary_accrual_detail: leave_salary_accrual_detail,
                          _mysql: _mysql
                        })
                          .then(Employee_Leave_Salary => {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = {
                                leave_salary_number: leave_salary_number
                              };
                              next();
                            });
                          })
                          .catch(e => {
                            _mysql.rollBackTransaction(() => {
                              next(e);
                            });
                          });
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //Salay Payment
  SaveSalaryPayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = { ...req.body };

    const _salaryHeader_id = _.map(inputParam.salary_payment, o => {
      return o.hims_f_salary_id;
    });

    let _allEmployees = _.map(inputParam.salary_payment, o => {
      return o.employee_id;
    });

    _mysql
      .executeQueryWithTransaction({
        query:
          "UPDATE hims_f_salary SET salary_paid = 'Y', salary_paid_date=?, salary_paid_by=? \
            where hims_f_salary_id in (?)",
        values: [
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          _salaryHeader_id
        ],
        printQuery: true
      })
      .then(salary_process => {
        //Miscellaneous Earning Deduction
        _mysql
          .executeQuery({
            query:
              "UPDATE hims_f_miscellaneous_earning_deduction SET processed = 'Y', updated_date=?, updated_by=? where \
            processed = 'N' and year = ?  and month = ? and employee_id in (?)",
            values: [
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              inputParam.year,
              inputParam.month,
              _allEmployees
            ],
            printQuery: true
          })
          .then(miscellaneous_earning_deduction => {
            //Employee Payments Advance
            _mysql
              .executeQuery({
                query:
                  "UPDATE hims_f_employee_payments SET deducted = 'Y', updated_date=?, updated_by=? where payment_type ='AD'\
                and deducted='N'and cancel='N' and `year`=? and deduction_month=? and employee_id in (?);",
                values: [
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.year,
                  inputParam.month,
                  _allEmployees
                ],
                printQuery: true
              })
              .then(employee_payments_advance => {
                //Loan Due
                _mysql
                  .executeQuery({
                    query:
                      "select loan_application_id,loan_due_amount,balance_amount from hims_f_salary_loans where \
                    salary_header_id in (?)",
                    values: [_salaryHeader_id],
                    printQuery: true
                  })
                  .then(salary_loans => {
                    let loan_application_ids = _.map(salary_loans, o => {
                      return o.loan_application_id;
                    });

                    if (loan_application_ids.length > 0) {
                      _mysql
                        .executeQuery({
                          query:
                            "select loan_skip_months,installment_amount, pending_loan from hims_f_loan_application  where hims_f_loan_application_id in (?)",
                          values: [loan_application_ids],
                          printQuery: true
                        })
                        .then(loan_application => {
                          for (let i = 0; i < loan_application.length; i++) {
                            let loan_skip_months =
                              loan_application[i].loan_skip_months;
                            let pending_loan = loan_application[i].pending_loan;
                            let loan_closed = "N";
                            if (loan_skip_months > 0) {
                              loan_skip_months--;
                            } else {
                              pending_loan =
                                pending_loan -
                                loan_application[i].installment_amount;
                            }

                            if (pending_loan == 0) {
                              loan_closed = "Y";
                            }
                            _mysql
                              .executeQuery({
                                query:
                                  "UPDATE hims_f_loan_application SET pending_loan = ?, loan_closed=?, loan_skip_months=?, \
                                    updated_date=?, updated_by=? where hims_f_loan_application_id in (?)",
                                values: [
                                  pending_loan,
                                  loan_closed,
                                  loan_skip_months,
                                  new Date(),
                                  req.userIdentity.algaeh_d_app_user_id,
                                  loan_application_ids
                                ],
                                printQuery: true
                              })
                              .then(update_loan_application => {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = update_loan_application;
                                  next();
                                });
                              })
                              .catch(e => {
                                next(e);
                              });
                          }
                        })
                        .catch(error => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    } else {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = salary_loans;
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
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch(error => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      })
      .catch(error => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  }
};

function InsertEmployeeLeaveSalary(options) {
  return new Promise((resolve, reject) => {
    try {
      utilities
        .AlgaehUtilities()
        .logger()
        .log("InsertEmployeeLeaveSalary:", "InsertEmployeeLeaveSalary");

      let leave_salary_accrual_detail = options.leave_salary_accrual_detail;
      let _mysql = options._mysql;
      let strQry = "";
      //ToDO
      for (let i = 0; i < leave_salary_accrual_detail.length; i++) {
        _mysql
          .executeQuery({
            query:
              "select hims_f_employee_leave_salary_header_id,employee_id,leave_days,leave_salary_amount,airticket_amount,balance_leave_days,\
                balance_leave_salary_amount,balance_airticket_amount,airfare_months from \
                hims_f_employee_leave_salary_header where year = ? and employee_id = ?;",
            values: [
              leave_salary_accrual_detail[i].year,
              leave_salary_accrual_detail[i].employee_id
            ],
            printQuery: true
          })
          .then(employee_leave_salary_header => {
            utilities
              .AlgaehUtilities()
              .logger()
              .log(
                "employee_leave_salary_header:",
                employee_leave_salary_header
              );

            if (employee_leave_salary_header.length > 0) {
              let leave_days =
                parseFloat(employee_leave_salary_header[0].leave_days) +
                parseFloat(leave_salary_accrual_detail[i].leave_days);
              let leave_salary_amount =
                parseFloat(
                  employee_leave_salary_header[0].leave_salary_amount
                ) + parseFloat(leave_salary_accrual_detail[i].leave_salary);
              let airticket_amount =
                parseFloat(employee_leave_salary_header[0].airticket_amount) +
                parseFloat(leave_salary_accrual_detail[i].airfare_amount);
              let balance_leave_days =
                parseFloat(employee_leave_salary_header[0].balance_leave_days) +
                parseFloat(leave_salary_accrual_detail[i].leave_days);
              let balance_leave_salary_amount =
                parseFloat(
                  employee_leave_salary_header[0].balance_leave_salary_amount
                ) + parseFloat(leave_salary_accrual_detail[i].leave_salary);
              let balance_airticket_amount =
                parseFloat(
                  employee_leave_salary_header[0].balance_airticket_amount
                ) + parseFloat(leave_salary_accrual_detail[i].airfare_amount);

              let airfare_months =
                parseFloat(employee_leave_salary_header[0].airfare_months) + 1;

              utilities
                .AlgaehUtilities()
                .logger()
                .log("leave_days:", leave_days);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("leave_salary_amount:", leave_salary_amount);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("airticket_amount:", airticket_amount);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("balance_leave_days:", balance_leave_days);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("balance_airticket_amount:", balance_airticket_amount);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("airfare_months:", airfare_months);

              strQry += mysql.format(
                "UPDATE `hims_f_employee_leave_salary_header` SET leave_days=?,`leave_salary_amount`=?,\
                  `airticket_amount`=?,`balance_leave_days`=?,`balance_leave_salary_amount`=?,\
                  `balance_airticket_amount`=?,`airfare_months`=? where  hims_f_employee_leave_salary_header_id=?;\
                  INSERT INTO `hims_f_employee_leave_salary_detail`(employee_leave_salary_header_id,leave_days,\
                    leave_salary_amount,airticket_amount) VALUE(?,?,?,?)",
                [
                  leave_days,
                  leave_salary_amount,
                  airticket_amount,
                  balance_leave_days,
                  balance_leave_salary_amount,
                  balance_airticket_amount,
                  airfare_months,
                  employee_leave_salary_header[0]
                    .hims_f_employee_leave_salary_header_id,

                  employee_leave_salary_header[0]
                    .hims_f_employee_leave_salary_header_id,
                  leave_salary_accrual_detail[i].leave_days,
                  leave_salary_accrual_detail[i].leave_salary,
                  leave_salary_accrual_detail[i].airfare_amount
                ]
              );
              utilities
                .AlgaehUtilities()
                .logger()
                .log("strQry:", strQry);
            } else {
              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO `hims_f_employee_leave_salary_header`  (`year`,`employee_id`,`leave_days`,\
                      `leave_salary_amount`,`airticket_amount`,`balance_leave_days`,`balance_leave_salary_amount`,\
                      `balance_airticket_amount`,`airfare_months`)\
                       VALUE(?,?,?,?,?,?,?,?,?)",
                  values: [
                    leave_salary_accrual_detail[i].year,
                    leave_salary_accrual_detail[i].employee_id,
                    leave_salary_accrual_detail[i].leave_days,
                    leave_salary_accrual_detail[i].leave_salary,
                    leave_salary_accrual_detail[i].airfare_amount,
                    leave_salary_accrual_detail[i].leave_days,
                    leave_salary_accrual_detail[i].leave_salary,
                    leave_salary_accrual_detail[i].airfare_amount,
                    "1"
                  ],
                  printQuery: true
                })
                .then(employee_leave_header => {
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("employee_leave_header:", employee_leave_header);
                  let IncludeValues = [
                    "employee_leave_salary_header_id",
                    "leave_days",
                    "leave_salary_amount",
                    "airticket_amount"
                  ];
                  let inputValues = [
                    {
                      employee_leave_salary_header_id:
                        employee_leave_header.insertId,
                      leave_days: leave_salary_accrual_detail[i].leave_days,
                      leave_salary_amount:
                        leave_salary_accrual_detail[i].leave_salary,
                      airticket_amount:
                        leave_salary_accrual_detail[i].airfare_amount
                    }
                  ];

                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("inputValues:", inputValues);

                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO hims_f_employee_leave_salary_detail(??) VALUES ?",
                      values: inputValues,
                      includeValues: IncludeValues,
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(leave_detail => {
                      resolve();
                    })
                    .catch(error => {
                      reject(error);
                      next(error);
                    });
                })
                .catch(e => {
                  reject(e);
                  next(e);
                });
            }

            // utilities
            //   .AlgaehUtilities()
            //   .logger()
            //   .log("i:", i);
            // utilities
            //   .AlgaehUtilities()
            //   .logger()
            //   .log(
            //     "leave_salary_accrual_detail:",
            //     leave_salary_accrual_detail - 1
            //   );

            if (i == leave_salary_accrual_detail.length - 1 && strQry != "") {
              utilities
                .AlgaehUtilities()
                .logger()
                .log("strQry:", strQry);

              _mysql
                .executeQuery({ query: strQry, printQuery: true })
                .then(update_employee_leave => {
                  resolve();
                })
                .catch(e => {
                  reject(e);
                  next(e);
                });
            }
          })
          .catch(e => {
            reject(e);
            next(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getOtManagement(options) {
  return new Promise((resolve, reject) => {
    try {
      const _earnings = options.earnings;
      const empResult = options.empResult;

      const hrms_option = options.hrms_option;
      const over_time_comp = options.over_time_comp;
      const over_time = options.over_time;
      const current_earning_amt_array = options.current_earning_amt_array;
      const leave_salary = options.leave_salary;

      let final_earning_amount = 0;
      let current_ot_amt_array = [];
      if (options.over_time.length > 0) {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("over_time:", over_time);

        utilities
          .AlgaehUtilities()
          .logger()
          .log("empResult:", empResult);

        let ot_hours =
          parseFloat(empResult["ot_work_hours"]) +
          parseFloat(empResult["ot_weekoff_hours"]) +
          parseFloat(empResult["ot_holiday_hours"]);
        let Noof_Working_Hours =
          parseFloat(hrms_option[0].standard_working_hours) -
          parseFloat(hrms_option[0].standard_break_hours);

        if (_earnings.length == 0) {
          resolve({ current_ot_amt_array, final_earning_amount });
        }

        utilities
          .AlgaehUtilities()
          .logger()
          .log("payment_type:", over_time["payment_type"]);

        if (over_time["payment_type"] === "RT") {
          let working_day_amt = 0;
          let weekoff_day_amt = 0;
          let holiday_amt = 0;
          if (over_time["working_day_rate"] > 0) {
            working_day_amt =
              parseFloat(over_time["working_day_rate"]) *
              parseFloat(empResult["ot_work_hours"]);
          }
          if (over_time["weekoff_day_rate"] > 0) {
            weekoff_day_amt =
              parseFloat(over_time["weekoff_day_rate"]) *
              parseFloat(empResult["ot_weekoff_hours"]);
          }
          if (over_time["holiday_rate"] > 0) {
            holiday_amt =
              parseFloat(over_time["holiday_rate"]) *
              parseFloat(empResult["ot_holiday_hours"]);
          }

          let per_hour_salary = working_day_amt + weekoff_day_amt + holiday_amt;

          utilities
            .AlgaehUtilities()
            .logger()
            .log("per_hour_salary: ", per_hour_salary);

          if (per_hour_salary > 0) {
            current_ot_amt_array.push({
              earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
              amount: per_hour_salary
            });
          }

          final_earning_amount = _.sumBy(current_ot_amt_array, s => {
            return s.amount;
          });

          resolve({ current_ot_amt_array, final_earning_amount });
        } else {
          _earnings.map(obj => {
            // //OT Calculation

            if (
              obj["overtime_applicable"] == "Y" &&
              ot_hours != 0 &&
              leave_salary != "Y"
            ) {
              let earn_amount = _.chain(current_earning_amt_array)
                .filter(f => {
                  if (f.earnings_id == obj.earnings_id) {
                    return f.amount;
                  }
                })
                .value();

              let per_hour_salary =
                parseFloat(earn_amount[0].amount) / Noof_Working_Hours;

              per_hour_salary = per_hour_salary * ot_hours;

              if (per_hour_salary > 0) {
                current_ot_amt_array.push({
                  earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
                  amount: per_hour_salary
                });
              }
            }
          });

          final_earning_amount = _.sumBy(current_ot_amt_array, s => {
            return s.amount;
          });

          resolve({ current_ot_amt_array, final_earning_amount });
        }
      } else {
        resolve({ current_ot_amt_array, final_earning_amount });
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}
function getEarningComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      utilities
        .AlgaehUtilities()
        .logger()
        .log("options: ", options.earnings);

      const _earnings = options.earnings;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;
      const _LeaveRule = options._LeaveRule;

      let final_earning_amount = 0;
      let current_earning_amt_array = [];
      let current_earning_amt = 0;
      let current_earning_per_day_salary = 0;
      let leave_salary_days = 0;

      let total_days = empResult["total_days"];

      if (_earnings.length == 0) {
        resolve({ current_earning_amt_array, final_earning_amount });
      }

      _earnings.map(obj => {
        if (obj.calculation_type == "F") {
          if (leave_salary == null || leave_salary == undefined) {
            current_earning_amt = obj["amount"];
            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            utilities
              .AlgaehUtilities()
              .logger()
              .log("leave_salary_days:", leave_salary_days);

            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );

            current_earning_amt =
              current_earning_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_earning_amt = 0;
            current_earning_per_day_salary = 0;
          }

          current_earning_amt_array.push({
            earnings_id: obj.earnings_id,
            amount: current_earning_amt,
            per_day_salary: current_earning_per_day_salary
          });
        } else if (obj["calculation_type"] == "V") {
          if (leave_salary == null || leave_salary == undefined) {
            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );

            current_earning_amt =
              current_earning_per_day_salary *
              parseFloat(empResult["total_paid_days"]);
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_earning_amt =
              current_earning_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_earning_per_day_salary = 0;
            current_earning_amt = 0;
          }

          //Apply Leave Rule

          if (leave_salary != "Y") {
            let perday_salary = current_earning_amt / total_days;
            utilities
              .AlgaehUtilities()
              .logger()
              .log("Apply Leave Rule: ", "Apply Leave Rule");

            utilities
              .AlgaehUtilities()
              .logger()
              .log("_LeaveRule:", _LeaveRule);

            let balance_days = 0;
            let previous_leaves = 0;
            if (_LeaveRule.length > 0) {
              for (let i = 0; i < _LeaveRule.length; i++) {
                let leaves_till_date = _LeaveRule[i].availed_till_date;
                let current_leave = _LeaveRule[i].present_month;

                let paytype = _LeaveRule[i].paytype;
                //Component
                if (_LeaveRule[i].calculation_type == "CO") {
                }

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("calculation_type:", _LeaveRule[i].calculation_type);
                //Slab
                if (_LeaveRule[i].calculation_type == "SL") {
                  if (_LeaveRule[i].value_type == "RA") {
                    let leave_rule_days = _LeaveRule[i].total_days;

                    utilities
                      .AlgaehUtilities()
                      .logger()
                      .log("1:", balance_days);
                    if (balance_days > 0) {
                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("if inside:", previous_leaves);

                      if (previous_leaves == current_leave) {
                        previous_leaves =
                          leaves_till_date - current_leave - leave_rule_days;
                        previous_leaves = leave_rule_days - previous_leaves;
                      } else {
                        previous_leaves = current_leave - previous_leaves;
                      }

                      balance_days = current_leave - previous_leaves;

                      if (previous_leaves == balance_days) {
                        balance_days = 0;
                      } else {
                        balance_days = balance_days;
                      }

                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("previous_leaves:", previous_leaves);
                    } else {
                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("else:", balance_days);

                      previous_leaves = leaves_till_date - current_leave;
                      if (previous_leaves === 0) {
                        balance_days = current_leave - leave_rule_days;
                        previous_leaves = current_leave - balance_days;
                      } else {
                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("previous_leaves>0 :", previous_leaves);

                        previous_leaves = leave_rule_days - previous_leaves;
                        previous_leaves =
                          previous_leaves < 0 ? 0 : previous_leaves;
                        balance_days = current_leave - previous_leaves;
                      }
                    }

                    if (
                      previous_leaves != 0 &&
                      previous_leaves <= leave_rule_days
                    ) {
                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("leave_rule_start:", previous_leaves);

                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("paytype:", paytype);

                      let remaining_days = total_days - previous_leaves;
                      let split_sal = 0;
                      let remaining_sal = 0;
                      if (paytype == "NO") {
                      } else if (paytype == "FD") {
                        current_earning_amt = current_earning_amt;
                      } else if (paytype == "HD") {
                        split_sal = perday_salary / 2;
                        split_sal = split_sal * previous_leaves;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("split_sal: ", split_sal);

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "UN") {
                        split_sal = split_sal * previous_leaves;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("split_sal: ", split_sal);

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "QD") {
                        split_sal = perday_salary / 2;
                        split_sal = split_sal * previous_leaves;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("split_sal: ", split_sal);

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "TQ") {
                        split_sal = perday_salary / 2;
                        split_sal = split_sal * previous_leaves;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("split_sal: ", split_sal);

                        current_earning_amt = current_earning_amt - split_sal;
                      }
                    } else {
                      previous_leaves = balance_days;
                    }
                  }
                }
              }
            }

            current_earning_amt_array.push({
              earnings_id: obj.earnings_id,
              amount: current_earning_amt,
              per_day_salary: current_earning_per_day_salary
            });
          } else {
            current_earning_amt_array.push({
              earnings_id: obj.earnings_id,
              amount: current_earning_amt,
              per_day_salary: current_earning_per_day_salary
            });
          }
        }
      });
      utilities
        .AlgaehUtilities()
        .logger()
        .log("current_earning_amt_array: ", current_earning_amt_array);
      final_earning_amount = _.sumBy(current_earning_amt_array, s => {
        return s.amount;
      });

      resolve({ current_earning_amt_array, final_earning_amount });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getDeductionComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const _deduction = options.deduction;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;

      let current_deduction_amt = 0;
      let current_deduction_per_day_salary = 0;
      let current_deduction_amt_array = [];
      let final_deduction_amount = 0;
      let leave_salary_days = 0;

      if (_deduction.length == 0) {
        resolve({ current_deduction_amt_array, final_deduction_amount });
      }

      _deduction.map(obj => {
        if (obj["calculation_type"] == "F") {
          if (leave_salary == null || leave_salary == undefined) {
            current_deduction_amt = obj["amount"];
            current_deduction_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            current_deduction_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );

            current_deduction_amt =
              current_deduction_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_deduction_amt = 0;
            current_deduction_per_day_salary = 0;
          }
        } else if (obj["calculation_type"] == "V") {
          if (leave_salary == null || leave_salary == undefined) {
            current_deduction_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_deduction_amt =
              current_deduction_per_day_salary *
              parseFloat(empResult["total_paid_days"]);
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            current_deduction_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_deduction_amt =
              current_deduction_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_deduction_per_day_salary = 0;
            current_deduction_amt = 0;
          }
        }

        current_deduction_amt_array.push({
          deductions_id: obj.deductions_id,
          amount: current_deduction_amt,
          per_day_salary: current_deduction_per_day_salary
        });
      });

      final_deduction_amount = _.sumBy(current_deduction_amt_array, s => {
        return s.amount;
      });

      resolve({ current_deduction_amt_array, final_deduction_amount });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getContrubutionsComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const _contrubutions = options.contribution;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;

      let current_contribution_amt = 0;
      let current_contribution_per_day_salary = 0;
      let leave_salary_days = 0;
      let final_contribution_amount = 0;
      let current_contribution_amt_array = [];

      if (_contrubutions.length == 0) {
        resolve({ current_contribution_amt_array, final_contribution_amount });
      }

      _contrubutions.map(obj => {
        // ContrubutionsComponents();
        if (obj["calculation_type"] == "F") {
          if (leave_salary == null || leave_salary == undefined) {
            current_contribution_amt = obj["amount"];
            current_contribution_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            current_contribution_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );

            current_contribution_amt =
              current_contribution_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_contribution_amt = 0;
            current_contribution_per_day_salary = 0;
          }
        } else if (obj["calculation_type"] == "V") {
          if (leave_salary == null || leave_salary == undefined) {
            current_contribution_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_contribution_amt =
              current_contribution_per_day_salary *
              parseFloat(empResult["total_paid_days"]);
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            current_contribution_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_contribution_amt =
              current_contribution_per_day_salary * leave_salary_days;
          } else if (leave_salary == "Y") {
            current_contribution_per_day_salary = 0;
            current_contribution_amt = 0;
          }
        }

        current_contribution_amt_array.push({
          contributions_id: obj.contributions_id,
          amount: current_contribution_amt
          // per_day_salary: current_contribution_per_day_salary
        });
      });

      final_contribution_amount = _.sumBy(current_contribution_amt_array, s => {
        return s.amount;
      });

      resolve({ current_contribution_amt_array, final_contribution_amount });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getLoanDueandPayable(options) {
  return new Promise((resolve, reject) => {
    try {
      const _loan = options.loan;
      const _loanPayable = options.loanPayable;

      let total_loan_due_amount = 0;
      let total_loan_payable_amount = 0;
      let current_loan_array = [];

      // loan_skip_months > 0

      if (_loan.length == 0) {
        if (_loanPayable.length == 0) {
          resolve({
            total_loan_due_amount,
            total_loan_payable_amount,
            current_loan_array
          });
        } else {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("_loanPayable", _loanPayable);

          total_loan_payable_amount = _.sumBy(_loanPayable, s => {
            return s.approved_amount;
          });

          resolve({
            total_loan_due_amount,
            total_loan_payable_amount,
            current_loan_array
          });
        }
      }

      current_loan_array = _.map(_loan, s => {
        return {
          loan_application_id: s.hims_f_loan_application_id,
          loan_due_amount: s.loan_skip_months > 0 ? 0 : s.installment_amount,
          balance_amount: s.pending_loan
        };
      });
      total_loan_due_amount = _.sumBy(current_loan_array, s => {
        return s.loan_due_amount;
      });
      if (_loanPayable.length != 0) {
        total_loan_payable_amount = _.sumBy(_loanPayable, s => {
          return s.approved_amount;
        });
      }

      resolve({
        total_loan_due_amount,
        total_loan_payable_amount,
        current_loan_array
      });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getAdvanceDue(options) {
  return new Promise((resolve, reject) => {
    try {
      const _advance = options.advance;
      const _dedcomponent = options.dedcomponent;

      let advance_due_amount = 0;
      let current_deduct_compoment = [];

      utilities
        .AlgaehUtilities()
        .logger()
        .log("_dedcomponent", _dedcomponent);

      if (_advance.length == 0) {
        resolve({ advance_due_amount, current_deduct_compoment });
      }

      advance_due_amount = _.sumBy(_advance, s => {
        return s.payment_amount;
      });

      current_deduct_compoment = _.map(_dedcomponent, s => {
        return {
          deductions_id: s.hims_d_earning_deduction_id,
          amount: advance_due_amount
        };
      });

      resolve({ advance_due_amount, current_deduct_compoment });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function getMiscellaneous(options) {
  return new Promise((resolve, reject) => {
    try {
      const _miscellaneous = options.miscellaneous;

      let current_earn_compoment = [];
      let current_deduct_compoment = [];
      let final_earning_amount = 0;
      let final_deduction_amount = 0;

      if (_miscellaneous.length == 0) {
        resolve({
          current_earn_compoment,
          current_deduct_compoment,
          final_earning_amount,
          final_deduction_amount
        });
      }

      current_earn_compoment = _.chain(_miscellaneous)
        .filter(f => {
          return f.category == "E";
        })
        .value();

      current_earn_compoment = _.map(current_earn_compoment, s => {
        return {
          earnings_id: s.earning_deductions_id,
          amount: s.amount
        };
      });

      current_deduct_compoment = _.chain(_miscellaneous)
        .filter(f => {
          return f.category == "D";
        })
        .value();
      current_deduct_compoment = _.map(current_deduct_compoment, s => {
        return {
          deductions_id: s.earning_deductions_id,
          amount: s.amount
        };
      });

      final_earning_amount = _.sumBy(current_earn_compoment, s => {
        return s.amount;
      });

      final_deduction_amount = _.sumBy(current_deduct_compoment, s => {
        return s.amount;
      });

      resolve({
        current_earn_compoment,
        current_deduct_compoment,
        final_earning_amount,
        final_deduction_amount
      });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}
