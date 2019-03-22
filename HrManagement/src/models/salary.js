import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import mysql from "mysql";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
  newProcessSalary: (req, res, next) => {
    // console.log("req.connection: ", req.connection);
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();

        utilities.logger().log("newProcessSalary: ");
        const input = req.query;
        const month_number = input.month;
        const year = input.year;
        let inputValues = [input.year, input.month];
        let _stringData = "";

        utilities.logger().log("_stringData: ");

        let strQuery = "";
        if (input.leave_salary == null || input.leave_salary == undefined) {
          inputValues.push(input.year);
          inputValues.push(input.month);
          inputValues.push(input.hospital_id);

          if (input.employee_id != null) {
            _stringData += " and A.employee_id=?";
            inputValues.push(input.employee_id);
          }
          if (input.sub_department_id != null) {
            _stringData += " and A.sub_department_id=? ";
            inputValues.push(input.sub_department_id);
          }

          strQuery =
            "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, \
            A.sub_department_id, A.total_days,A.present_days, A.absent_days, A.total_work_days, \
            A.total_weekoff_days, A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, \
            A.total_paid_days,A.ot_work_hours, A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours,\
            E.employee_code,E.gross_salary, S.hims_f_salary_id,S.salary_processed \
            from hims_f_attendance_monthly as A inner join  hims_d_employee as E \
            on  E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month`\
            and S.employee_id = A.employee_id left join hims_f_employee_annual_leave AL on E.hims_d_employee_id=AL.employee_id \
            and  AL.year=? and AL.month=? and AL.cancelled='N'  where \
            A.`year`=? and A.`month`=? and A.hospital_id=?" +
            _stringData +
            " and hims_f_employee_annual_leave_id is null and (S.salary_processed is null or  S.salary_processed='N');";
        } else {
          inputValues.push(input.hospital_id);
          if (input.employee_id != null) {
            _stringData += " and A.employee_id=?";
            inputValues.push(input.employee_id);
          }

          strQuery =
            "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, \
            A.sub_department_id, A.total_days,A.present_days, A.absent_days, A.total_work_days, \
            A.total_weekoff_days, A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, \
            A.total_paid_days,A.ot_work_hours, A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours,\
            E.employee_code,E.gross_salary, S.hims_f_salary_id,S.salary_processed \
            from hims_f_attendance_monthly as A inner join  hims_d_employee as E \
            on  E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month`\
            and S.employee_id = A.employee_id   where A.`year`=? and A.`month`=? and A.hospital_id=?" +
            _stringData +
            " and  (S.salary_processed is null or  S.salary_processed='N');";
        }

        utilities.logger().log("strQuery: ", strQuery);
        _mysql
          .executeQuery({
            query: strQuery,
            values: inputValues,
            printQuery: true
          })
          .then(empResult => {
            if (empResult.length == 0) {
              utilities.logger().log("empResult reslove: ", empResult.length);
              // console.log("connection: ", req.connection);
              if (req.connection == null) {
                utilities.logger().log("req.connection : ");
                _mysql.releaseConnection();
                req.records = empResult;
                next();
              } else {
                utilities.logger().log("req.connection Else : ");
                resolve(empResult);
              }
              return;
            }

            let _salaryHeader_id = [];
            let _myemp = [];
            empResult.map(o => {
              _salaryHeader_id.push(o.hims_f_salary_id);
              _myemp.push(o.employee_id);
            });

            if (_myemp.length == 0) {
              _mysql.releaseConnection();
              req.records = {};
              next();
              resolve({});
              return;
            }

            let avail_till_date = "";
            if (input.month != 1) {
              let months = "";
              avail_till_date = "COALESCE(january, 0)";
              for (let k = 2; k <= input.month; k++) {
                months = moment(k, "MM").format("MMMM");
                avail_till_date += "+" + "COALESCE(" + months + ", 0)";
              }
            } else {
              utilities.logger().log("else: ");
              avail_till_date = moment(input.month, "MM").format("MMMM");
              utilities.logger().log("avail_till_date: ", avail_till_date);
              avail_till_date = "COALESCE(" + avail_till_date + ", 0)";
            }
            const month_name = moment(input.month, "MM").format("MMMM");

            let strQuery =
              "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
              avail_till_date +
              "as avail_till_date," +
              month_name +
              " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                  FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                  and ML.leave_id=LR.leave_header_id and LR.calculation_type='SL'and L.hims_d_leave_id = LR.leave_header_id and\
                  L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
              month_name +
              " > 0 and (" +
              avail_till_date +
              " >= to_value   or " +
              avail_till_date +
              " >=from_value and " +
              avail_till_date +
              " <=to_value )\
                    and  employee_id in (?) and year=? union all	";
            strQuery +=
              "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
              avail_till_date +
              "as avail_till_date," +
              month_name +
              " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                    FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                    and ML.leave_id=LR.leave_header_id and LR.calculation_type='CO'and L.hims_d_leave_id = LR.leave_header_id and \
                    L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
              month_name +
              " > 0 and  employee_id in (?) and year=? ;";

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
            select hims_d_hrms_options_id,standard_working_hours,standard_break_hours,salary_calendar,salary_calendar_fixed_days from hims_d_hrms_options;\
            select hims_d_earning_deduction_id from hims_d_earning_deduction where component_type='OV';\
            select E.hims_d_employee_id as employee_id, OT.payment_type, OT.working_day_hour, OT. weekoff_day_hour, \
              OT.holiday_hour, OT.working_day_rate, OT.weekoff_day_rate, OT.holiday_rate  \
              from hims_d_overtime_group OT, hims_d_employee E where E.overtime_group_id=OT.hims_d_overtime_group_id and E.hims_d_employee_id in (?);\
            select hims_d_earning_deduction_id from hims_d_earning_deduction where component_category = 'D' and component_type='SA';\
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
                let _headerQuery = "";

                let final_earning_amt_array = [];
                let final_deduction_amt_array = [];
                let final_contribution_amt_array = [];
                let final_loan_array = [];
                let salary_header_id = 0;
                new Promise((resolve, reject) => {
                  try {
                    for (let i = 0; i < empResult.length; i++) {
                      let results = Salaryresults;

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

                      const _LeaveRule = _.filter(results[17], f => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });

                      utilities
                        .logger()
                        .log(
                          "hrms_option.salary_calendar: ",
                          results[8][0].salary_calendar
                        );
                      if (results[8][0].salary_calendar == "F") {
                        utilities
                          .logger()
                          .log(
                            "in_salary_calendar: ",
                            results[8][0].salary_calendar
                          );

                        empResult[i]["total_days"] =
                          results[8][0].salary_calendar_fixed_days;

                        empResult[i]["total_paid_days"] =
                          empResult[i]["total_days"] -
                          empResult[i]["absent_days"] -
                          empResult[i]["unpaid_leave"];
                      }
                      getEarningComponents({
                        earnings: _earnings,
                        empResult: empResult[i],
                        leave_salary: req.query.leave_salary,
                        _mysql: _mysql,
                        input: input,
                        _LeaveRule: _LeaveRule,
                        hrms_option: results[8]
                      })
                        .then(earningOutput => {
                          current_earning_amt_array =
                            earningOutput.current_earning_amt_array;
                          final_earning_amount =
                            earningOutput.final_earning_amount;

                          utilities
                            .logger()
                            .log("_earning_amount : ", final_earning_amount);

                          const _deduction = _.filter(results[1], f => {
                            return f.employee_id == empResult[i]["employee_id"];
                          });
                          getDeductionComponents({
                            deduction: _deduction,
                            empResult: empResult[i],
                            leave_salary: req.query.leave_salary,
                            hrms_option: results[8]
                          }).then(deductionOutput => {
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
                              leave_salary: req.query.leave_salary,
                              hrms_option: results[8]
                            }).then(contributionOutput => {
                              current_contribution_amt_array =
                                contributionOutput.current_contribution_amt_array;
                              final_contribution_amount =
                                contributionOutput.final_contribution_amount;

                              //Loan Due Start
                              const _loan = _.filter(results[3], f => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
                              });
                              //Loan Payable
                              const _loanPayable = _.filter(results[6], f => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
                              });
                              getLoanDueandPayable({
                                loan: _loan,
                                loanPayable: _loanPayable
                              }).then(loanOutput => {
                                total_loan_due_amount =
                                  loanOutput.total_loan_due_amount;
                                total_loan_payable_amount =
                                  loanOutput.total_loan_payable_amount;

                                current_loan_array =
                                  loanOutput.current_loan_array;

                                //Advance
                                const _advance = _.filter(results[4], f => {
                                  return (
                                    f.employee_id == empResult[i]["employee_id"]
                                  );
                                });
                                getAdvanceDue({
                                  advance: _advance,
                                  dedcomponent: results[7]
                                }).then(advanceOutput => {
                                  advance_due_amount =
                                    advanceOutput.advance_due_amount;

                                  final_deduction_amount =
                                    final_deduction_amount +
                                    advanceOutput.advance_due_amount;

                                  current_deduction_amt_array = current_deduction_amt_array.concat(
                                    advanceOutput.current_deduct_compoment
                                  );
                                  utilities
                                    .logger()
                                    .log(
                                      "employee_id: ",
                                      empResult[i]["employee_id"]
                                    );
                                  //OT
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
                                    .logger()
                                    .log("_over_time: ", _over_time);
                                  getOtManagement({
                                    earnings: _earnings,
                                    current_earning_amt_array: current_earning_amt_array,
                                    empResult: empResult[i],
                                    hrms_option: results[8],
                                    over_time_comp: results[9],
                                    over_time: _over_time,
                                    leave_salary: req.query.leave_salary
                                  }).then(OTManagement => {
                                    final_earning_amount =
                                      final_earning_amount +
                                      OTManagement.final_earning_amount;

                                    utilities
                                      .logger()
                                      .log(
                                        "OTManagement.current_ot_amt_array : ",
                                        OTManagement.current_ot_amt_array
                                      );

                                    utilities
                                      .logger()
                                      .log(
                                        "OTManagement : ",
                                        final_earning_amount
                                      );

                                    current_earning_amt_array = current_earning_amt_array.concat(
                                      OTManagement.current_ot_amt_array
                                    );
                                    // ShoartAge
                                    getShortAge({
                                      earnings: _earnings,
                                      empResult: empResult[i],
                                      current_earning_amt_array: current_earning_amt_array,
                                      shortage_comp: results[11],
                                      hrms_option: results[8],
                                      leave_salary: req.query.leave_salary
                                    }).then(ShortAge => {
                                      utilities
                                        .logger()
                                        .log("ShortAge", ShortAge);
                                      final_deduction_amount =
                                        final_deduction_amount +
                                        ShortAge.final_deduction_amount;

                                      current_deduction_amt_array = current_deduction_amt_array.concat(
                                        ShortAge.current_shortage_amt_array
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
                                      }).then(miscellaneousOutput => {
                                        current_earning_amt_array = current_earning_amt_array.concat(
                                          miscellaneousOutput.current_earn_compoment
                                        );
                                        current_deduction_amt_array = current_deduction_amt_array.concat(
                                          miscellaneousOutput.current_deduct_compoment
                                        );
                                        final_earning_amount =
                                          final_earning_amount +
                                          miscellaneousOutput.final_earning_amount;

                                        utilities
                                          .logger()
                                          .log(
                                            "miscellaneousOutput : ",
                                            final_earning_amount
                                          );
                                        final_deduction_amount =
                                          final_deduction_amount +
                                          miscellaneousOutput.final_deduction_amount;
                                        let per_day_sal =
                                          empResult[i]["gross_salary"] /
                                          empResult[i]["total_days"];

                                        let _salary_number = empResult[i][
                                          "employee_code"
                                        ].trim();

                                        _salary_number +=
                                          req.query.leave_salary == null
                                            ? "-NS-"
                                            : "-LS-";
                                        _salary_number +=
                                          month_number + "-" + year;

                                        utilities
                                          .logger()
                                          .log(
                                            "final_earning_amount : ",
                                            final_earning_amount
                                          );
                                        utilities
                                          .logger()
                                          .log(
                                            "final_deduction_amount : ",
                                            final_deduction_amount
                                          );
                                        utilities
                                          .logger()
                                          .log(
                                            "total_loan_due_amount : ",
                                            total_loan_due_amount
                                          );

                                        let _net_salary =
                                          final_earning_amount -
                                          final_deduction_amount -
                                          total_loan_due_amount;

                                        _net_salary =
                                          _net_salary +
                                          total_loan_payable_amount;

                                        _headerQuery += _mysql.mysqlQueryFormat(
                                          "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,sub_department_id,salary_date,per_day_sal,total_days,\
                                              present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                              unpaid_leave,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                              total_contributions,net_salary, total_paid_days) \
                                             VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;",
                                          [
                                            _salary_number,
                                            parseInt(month_number),
                                            parseInt(year),
                                            empResult[i]["employee_id"],
                                            empResult[i]["sub_department_id"],
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
                                            advance_due_amount,
                                            final_earning_amount,
                                            final_earning_amount, //Gross salary = total earnings
                                            final_deduction_amount,
                                            final_contribution_amount,
                                            _net_salary,
                                            empResult[i]["total_paid_days"]
                                          ]
                                        );

                                        final_earning_amt_array.push(
                                          current_earning_amt_array
                                        );
                                        final_deduction_amt_array.push(
                                          current_deduction_amt_array
                                        );
                                        final_contribution_amt_array.push(
                                          current_contribution_amt_array
                                        );
                                        final_loan_array.push(
                                          current_loan_array
                                        );

                                        if (i == empResult.length - 1) {
                                          resolve();
                                        }
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        })
                        .catch(e => {
                          _mysql.releaseConnection();
                          next(e);
                          reject(e);
                        });
                    }
                  } catch (e) {
                    reject(e);
                  }
                })
                  .then(result => {
                    utilities.logger().log("_headerQuery: ", _headerQuery);
                    utilities
                      .logger()
                      .log(
                        "final_earning_amt_array: ",
                        final_earning_amt_array
                      );
                    utilities
                      .logger()
                      .log(
                        "final_deduction_amt_array: ",
                        final_deduction_amt_array
                      );
                    utilities
                      .logger()
                      .log(
                        "final_contribution_amt_array: ",
                        final_contribution_amt_array
                      );
                    utilities
                      .logger()
                      .log("final_loan_array: ", final_loan_array);
                    _mysql
                      .executeQueryWithTransaction({
                        query: _headerQuery,
                        printQuery: true
                      })
                      .then(inserted_header => {
                        utilities
                          .logger()
                          .log("inserted_header: ", inserted_header);
                        let inserted_salary = [];
                        if (Array.isArray(inserted_header)) {
                          inserted_salary = inserted_header;
                        } else {
                          inserted_salary = [inserted_header];
                        }

                        utilities
                          .logger()
                          .log("inserted_salary: ", inserted_salary);
                        if (inserted_salary.length > 0) {
                          let execute_query = "";

                          for (let k = 0; k < inserted_salary.length; k++) {
                            salary_header_id = inserted_salary[k].insertId;
                            utilities
                              .logger()
                              .log(
                                "final_earning_amt_array: ",
                                final_earning_amt_array[k]
                              );
                            if (final_earning_amt_array[k].length > 0) {
                              for (
                                let l = 0;
                                l < final_earning_amt_array[k].length;
                                l++
                              ) {
                                utilities
                                  .logger()
                                  .log(
                                    "final_earning_amt_array: ",
                                    final_earning_amt_array[k][l].earnings_id
                                  );
                                execute_query += _mysql.mysqlQueryFormat(
                                  "INSERT INTO `hims_f_salary_earnings` (salary_header_id, earnings_id, amount, \
                                per_day_salary) VALUE(?,?,?,?); ",
                                  [
                                    inserted_salary[k].insertId,
                                    final_earning_amt_array[k][l].earnings_id,
                                    final_earning_amt_array[k][l].amount,
                                    final_earning_amt_array[k][l].per_day_salary
                                  ]
                                );
                              }
                            }

                            if (final_deduction_amt_array[k].length > 0) {
                              for (
                                let m = 0;
                                m < final_deduction_amt_array[k].length;
                                m++
                              ) {
                                execute_query += _mysql.mysqlQueryFormat(
                                  "INSERT INTO `hims_f_salary_deductions` (salary_header_id, deductions_id, amount,\
                                per_day_salary) VALUE(?,?,?,?); ",
                                  [
                                    inserted_salary[k].insertId,
                                    final_deduction_amt_array[k][m]
                                      .deductions_id,
                                    final_deduction_amt_array[k][m].amount,
                                    final_deduction_amt_array[k][m]
                                      .per_day_salary
                                  ]
                                );
                              }
                            }
                            if (final_contribution_amt_array[k].length > 0) {
                              for (
                                let n = 0;
                                n < final_contribution_amt_array[k].length;
                                n++
                              ) {
                                execute_query += _mysql.mysqlQueryFormat(
                                  "INSERT INTO `hims_f_salary_contributions` (salary_header_id, contributions_id, \
                                amount) VALUE(?,?,?); ",
                                  [
                                    inserted_salary[k].insertId,
                                    final_contribution_amt_array[k][n]
                                      .contributions_id,
                                    final_contribution_amt_array[k][n].amount
                                  ]
                                );
                              }
                            }

                            if (final_loan_array[k].length > 0) {
                              for (
                                let o = 0;
                                o < final_loan_array[k].length;
                                o++
                              ) {
                                execute_query += _mysql.mysqlQueryFormat(
                                  "INSERT INTO `hims_f_salary_loans` (salary_header_id, loan_application_id, \
                                loan_due_amount, balance_amount) VALUE(?,?,?,?); ",
                                  [
                                    inserted_salary[k].insertId,
                                    final_loan_array[k][o].loan_application_id,
                                    final_loan_array[k][o].loan_due_amount,
                                    final_loan_array[k][o].balance_amount
                                  ]
                                );
                              }
                            }

                            if (k == inserted_salary.length - 1) {
                              utilities
                                .logger()
                                .log("execute_query: ", execute_query);
                              _mysql
                                .executeQuery({
                                  query: execute_query,
                                  printQuery: true
                                })
                                .then(detailresult => {
                                  if (req.connection == null) {
                                    _mysql.commitTransaction(() => {
                                      _mysql.releaseConnection();
                                      req.records = detailresult;
                                      next();
                                      resolve(detailresult);
                                    });
                                  } else {
                                    utilities
                                      .logger()
                                      .log(
                                        "salary_header_id: ",
                                        salary_header_id
                                      );
                                    resolve(salary_header_id);
                                  }
                                })
                                .catch(error => {
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                    reject(error);
                                  });
                                });
                            }
                          }
                        }
                      })
                      .catch(error => {
                        utilities.logger().log("error: ", error);
                        _mysql.rollBackTransaction(() => {
                          next(error);
                          reject(error);
                        });
                      });
                  })
                  .catch(e => {
                    _mysql.releaseConnection();
                    next(e);
                    reject(e);
                  });
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
                reject(e);
              });
          })
          .catch(error => {
            utilities.logger().log("error: ", error);
            _mysql.releaseConnection();
            next(error);
            reject(error);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },
  processSalary: (req, res, next) => {
    const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();
        // if (req.mySQl == null) {
        //   req.mySQl = _mysql;
        // }
        const input = req.query;
        const month_number = input.month;
        const year = input.year;

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

        // utilities.logger().log("input: ", input);

        _mysql
          .executeQuery({
            query:
              "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, A.sub_department_id, \
            A.total_days,A.present_days, A.absent_days, A.total_work_days, A.total_weekoff_days,\
            A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, A.total_paid_days,A.ot_work_hours,\
            A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours, E.employee_code,E.gross_salary\
            from hims_f_attendance_monthly A,hims_d_employee E\
            where E.hims_d_employee_id = A.employee_id  and A.hospital_id = E.hospital_id and `year`=? and `month`=? and A.hospital_id=? " +
              _stringData,
            values: inputValues,
            printQuery: true
          })
          .then(attandenceResult => {
            // let empResult = empOutput;
            // utilities.logger().log("attandenceResult: ", attandenceResult);
            if (attandenceResult.length > 0) {
              let _allEmployees = _.map(attandenceResult, o => {
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
                  // utilities.logger().log("Existing Block", existing);
                  // console.log("Existing Block", existing);

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

                  let _itWentInside = false;

                  let _salaryHeader_id = existing.map(item => {
                    return item.hims_f_salary_id;
                  });

                  if (_salary_processed.length > 0) {
                    _itWentInside = true;

                    _myemp = _allEmployees.filter(
                      val => !_salary_processed_emp.includes(val)
                    );

                    _salaryHeader_id = _salaryHeader_id.filter(
                      val => !_salary_processed_salary_id.includes(val)
                    );

                    let removal_index = _.findIndex(attandenceResult, function(
                      o
                    ) {
                      return o.employee_id == _salary_processed_emp;
                    });

                    attandenceResult.splice(removal_index, 1);
                  } else {
                    _myemp = _allEmployees;
                  }

                  // utilities.logger().log("_myemp: ", _myemp);

                  if (_myemp.length > 0) {
                    _allEmployees = _myemp;
                  } else {
                    if (_itWentInside) {
                      if (req.mySQl == null) {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = {};
                          next();
                          resolve({});
                        });
                      } else {
                        resolve({});
                      }

                      return;
                    }
                  }

                  const utilities = new algaehUtilities();
                  utilities.logger().log("input.month: ", input.month);
                  let avail_till_date = "";
                  if (input.month != 1) {
                    let months = "";
                    avail_till_date = "COALESCE(january, 0)";
                    for (let k = 2; k <= input.month; k++) {
                      months = moment(k, "MM").format("MMMM");
                      avail_till_date += "+" + "COALESCE(" + months + ", 0)";
                    }
                  } else {
                    utilities.logger().log("else: ");
                    avail_till_date = moment(input.month, "MM").format("MMMM");
                    utilities
                      .logger()
                      .log("avail_till_date: ", avail_till_date);
                    avail_till_date = "COALESCE(" + avail_till_date + ", 0)";
                  }

                  utilities.logger().log("avail_till_date: ", avail_till_date);

                  const month_name = moment(input.month, "MM").format("MMMM");

                  let strQuery =
                    "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
                    avail_till_date +
                    "as avail_till_date," +
                    month_name +
                    " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                  FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                  and ML.leave_id=LR.leave_header_id and LR.calculation_type='SL'and L.hims_d_leave_id = LR.leave_header_id and\
                  L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
                    month_name +
                    " > 0 and (" +
                    avail_till_date +
                    " >= to_value   or " +
                    avail_till_date +
                    " >=from_value and " +
                    avail_till_date +
                    " <=to_value )\
                    and  employee_id in (?) and year=? union all	";
                  strQuery +=
                    "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.calculation_type, availed_till_date," +
                    avail_till_date +
                    "as avail_till_date," +
                    month_name +
                    " as present_month,L.leave_type,LR.paytype,  LR.total_days,LR.from_value,LR.to_value, LR.earning_id,LR.value_type \
                    FROM hims_f_employee_monthly_leave ML,hims_d_leave L, hims_d_leave_rule LR where ML.leave_id=L.hims_d_leave_id \
                    and ML.leave_id=LR.leave_header_id and LR.calculation_type='CO'and L.hims_d_leave_id = LR.leave_header_id and \
                    L.calculation_type = LR.calculation_type and L.leave_type='P' and " +
                    month_name +
                    " > 0 and  employee_id in (?) and year=? ;";

                  utilities.logger().log("strQuery: ", strQuery);
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
                  select hims_d_earning_deduction_id from hims_d_earning_deduction where component_category = 'D' and component_type='SA'; \
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
                      // utilities.logger().log("Salaryresults", Salaryresults[0]);

                      let _requestCollector = [];

                      var empResult = _.remove(attandenceResult, n => {
                        return _.find(_myemp, d => d == n.employee_id);
                      });

                      utilities.logger().log("empResult", empResult);

                      if (empResult.length > 0) {
                        for (let i = 0; i < empResult.length; i++) {
                          // utilities
                          //   .logger()
                          //   .log("employee_id", empResult[i]["employee_id"]);

                          const employee_exit = _.filter(_myemp, f => {
                            return f.employee_id == empResult[i]["employee_id"];
                          });

                          // utilities
                          //   .logger()
                          //   .log("employee_exit", employee_exit);
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

                          const _LeaveRule = _.filter(results[17], f => {
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
                              current_earning_amt_array =
                                earningOutput.current_earning_amt_array;
                              final_earning_amount =
                                earningOutput.final_earning_amount;

                              const _deduction = _.filter(results[1], f => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
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
                                  const _contrubutions = _.filter(
                                    results[2],
                                    f => {
                                      return (
                                        f.employee_id ==
                                        empResult[i]["employee_id"]
                                      );
                                    }
                                  );
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

                                              getOtManagement({
                                                earnings: _earnings,
                                                current_earning_amt_array: current_earning_amt_array,
                                                empResult: empResult[i],
                                                hrms_option: results[8],
                                                over_time_comp: results[9],
                                                over_time: _over_time,
                                                leave_salary:
                                                  req.query.leave_salary
                                              })
                                                .then(OTManagement => {
                                                  final_earning_amount =
                                                    final_earning_amount +
                                                    OTManagement.final_earning_amount;

                                                  current_earning_amt_array = current_earning_amt_array.concat(
                                                    OTManagement.current_ot_amt_array
                                                  );
                                                  //Short Age
                                                  getShortAge({
                                                    earnings: _earnings,
                                                    empResult: empResult[i],
                                                    current_earning_amt_array: current_earning_amt_array,
                                                    shortage_comp: results[11],
                                                    hrms_option: results[8],
                                                    leave_salary:
                                                      req.query.leave_salary
                                                  })
                                                    .then(ShortAge => {
                                                      utilities
                                                        .logger()
                                                        .log(
                                                          "ShortAge",
                                                          ShortAge
                                                        );
                                                      final_deduction_amount =
                                                        final_deduction_amount +
                                                        ShortAge.final_deduction_amount;

                                                      current_deduction_amt_array = current_deduction_amt_array.concat(
                                                        ShortAge.current_shortage_amt_array
                                                      );

                                                      //Miscellaneous Earning Deduction
                                                      const _miscellaneous = _.filter(
                                                        results[5],
                                                        f => {
                                                          return (
                                                            f.employee_id ==
                                                            empResult[i][
                                                              "employee_id"
                                                            ]
                                                          );
                                                        }
                                                      );

                                                      getMiscellaneous({
                                                        miscellaneous: _miscellaneous
                                                      })
                                                        .then(
                                                          miscellaneousOutput => {
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

                                                            let per_day_sal =
                                                              empResult[i][
                                                                "gross_salary"
                                                              ] /
                                                              empResult[i][
                                                                "total_days"
                                                              ];

                                                            let _salary_number = empResult[
                                                              i
                                                            ][
                                                              "employee_code"
                                                            ].trim();

                                                            _salary_number +=
                                                              req.query
                                                                .leave_salary ==
                                                              null
                                                                ? "-NS-"
                                                                : "-LS-";
                                                            _salary_number +=
                                                              month_number +
                                                              "-" +
                                                              year;

                                                            let _net_salary =
                                                              final_earning_amount -
                                                              final_deduction_amount -
                                                              total_loan_due_amount;

                                                            _net_salary =
                                                              _net_salary +
                                                              total_loan_payable_amount;
                                                            utilities
                                                              .logger()
                                                              .log(
                                                                "final_deduction_amount",
                                                                final_deduction_amount
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
                                                                    parseInt(
                                                                      year
                                                                    ),
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "employee_id"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "sub_department_id"
                                                                    ],
                                                                    new Date(),
                                                                    per_day_sal,
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_days"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "present_days"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "absent_days"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_work_days"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_weekoff_days"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_holidays"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_leave"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "paid_leave"
                                                                    ],
                                                                    empResult[
                                                                      i
                                                                    ][
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
                                                                    empResult[
                                                                      i
                                                                    ][
                                                                      "total_paid_days"
                                                                    ]
                                                                  ],
                                                                  printQuery: true
                                                                }
                                                              )
                                                              .then(
                                                                inserted_salary => {
                                                                  utilities
                                                                    .logger()
                                                                    .log(
                                                                      "inserted_salary",
                                                                      inserted_salary
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
                                                                      query:
                                                                        "select 1"
                                                                    };
                                                                  }

                                                                  _mysql
                                                                    .executeQuery(
                                                                      execute_query
                                                                    )
                                                                    .then(
                                                                      resultEarnings => {
                                                                        // utilities
                                                                        //   .logger()
                                                                        //   .log(
                                                                        //     "resultEarnings",
                                                                        //     resultEarnings
                                                                        //   );
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
                                                                        // utilities
                                                                        //   .logger()
                                                                        //   .log(
                                                                        //     "execute_query",
                                                                        //     execute_query
                                                                        //   );
                                                                        _mysql
                                                                          .executeQuery(
                                                                            execute_query
                                                                          )
                                                                          .then(
                                                                            resultDeductions => {
                                                                              // utilities
                                                                              //   .logger()
                                                                              //   .log(
                                                                              //     "resultDeductions",
                                                                              //     resultDeductions
                                                                              //   );
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
                                                                                    // utilities
                                                                                    //   .logger()
                                                                                    //   .log(
                                                                                    //     "resultContribute",
                                                                                    //     resultContribute
                                                                                    //   );
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
                                                                                          // utilities
                                                                                          //   .logger()
                                                                                          //   .log(
                                                                                          //     "resultLoan",
                                                                                          //     resultLoan
                                                                                          //   );
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
                                                                                                  resolve(
                                                                                                    resultLoan
                                                                                                  );
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
                                                                                          _mysql.rollBackTransaction(
                                                                                            () => {
                                                                                              next(
                                                                                                error
                                                                                              );
                                                                                              reject(
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
                                                                                    _mysql.rollBackTransaction(
                                                                                      () => {
                                                                                        next(
                                                                                          error
                                                                                        );
                                                                                        reject(
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
                                                                              _mysql.rollBackTransaction(
                                                                                () => {
                                                                                  next(
                                                                                    error
                                                                                  );
                                                                                  reject(
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
                                                                        _mysql.rollBackTransaction(
                                                                          () => {
                                                                            next(
                                                                              error
                                                                            );
                                                                            reject(
                                                                              error
                                                                            );
                                                                          }
                                                                        );
                                                                      }
                                                                    );
                                                                }
                                                              )
                                                              .catch(error => {
                                                                _mysql.rollBackTransaction(
                                                                  () => {
                                                                    next(error);
                                                                    reject(
                                                                      error
                                                                    );
                                                                  }
                                                                );
                                                              });
                                                          }
                                                        )
                                                        .catch(e => {
                                                          _mysql.releaseConnection();
                                                          next(e);
                                                          reject(e);
                                                        });
                                                    })
                                                    .catch(e => {
                                                      _mysql.releaseConnection();
                                                      next(e);
                                                      reject(e);
                                                    });
                                                })
                                                .catch(e => {
                                                  _mysql.releaseConnection();
                                                  next(e);
                                                  reject(e);
                                                });
                                            })
                                            .catch(e => {
                                              _mysql.releaseConnection();
                                              next(e);
                                              reject(e);
                                            });
                                        })
                                        .catch(e => {
                                          _mysql.releaseConnection();
                                          next(e);
                                          reject(e);
                                        });
                                      //Loan Due End
                                    })
                                    .catch(e => {
                                      _mysql.releaseConnection();
                                      next(e);
                                      reject(e);
                                    });
                                  //Contribution -- End
                                })
                                .catch(e => {
                                  _mysql.releaseConnection();
                                  next(e);
                                  reject(e);
                                });

                              //Deduction -- End
                            })
                            .catch(e => {
                              _mysql.releaseConnection();
                              next(e);
                              reject(e);
                            });
                          //Earnigs --- End
                        }
                      } else {
                        _mysql.releaseConnection();
                        req.records = empResult;
                        next();
                        resolve(empResult);
                      }
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      next(e);
                      reject(e);
                    });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                  reject(e);
                });
            } else {
              _mysql.releaseConnection();
              req.records = attandenceResult;
              next();
              resolve(attandenceResult);
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
            reject(e);
          });
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getSalaryProcess: (req, res, next) => {
    try {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
      const inputParam = req.query;

      let salaryprocess_header = [];

      /* Select statemwnt  */

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
    } catch (e) {
      next(e);
    }
  },

  getSalaryProcessToPay: (req, res, next) => {
    try {
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
    } catch (e) {
      next(e);
    }
  },

  //FINALIZE AND INSERT LEAVE_SALARY_ACCRUAL
  finalizedSalaryProcess: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = { ...req.body };

      const utilities = new algaehUtilities();

      utilities.logger().log("employee_id: ", inputParam.employee_id);

      _mysql
        .generateRunningNumber({
          modules: ["LEAVE_ACCRUAL"]
        })
        .then(generatedNumbers => {
          let leave_salary_number = generatedNumbers[0];

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
              utilities
                .logger()
                .log("leave_accrual_detail: ", leave_accrual_detail);
              if (leave_accrual_detail.length > 0) {
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
                                _mysql
                                  .executeQuery({
                                    query:
                                      "Select hims_f_project_wise_payroll_id,employee_id, worked_hours, worked_minutes\
                                      from hims_f_project_wise_payroll where year=? and month=? and hospital_id=? and  employee_id in (?); \
                                      Select employee_id,\
                                      COALESCE(sum(worked_hours))+ COALESCE(concat(floor(sum(worked_minutes)/60)  ,'.',sum(worked_minutes)%60),0) as complete_hours \
                                      from hims_f_project_wise_payroll where year=? and month=? and hospital_id=? and  employee_id in (?);",
                                    values: [
                                      inputParam.year,
                                      inputParam.month,
                                      inputParam.hospital_id,
                                      inputParam.employee_id,
                                      inputParam.year,
                                      inputParam.month,
                                      inputParam.hospital_id,
                                      inputParam.employee_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(project_wise_payroll => {
                                    if (project_wise_payroll[0].length > 0) {
                                      UpdateProjectWisePayroll({
                                        project_wise_payroll:
                                          project_wise_payroll[0],
                                        total_hours_project:
                                          project_wise_payroll[1],
                                        _mysql: _mysql,
                                        net_salary: inputParam.net_salary
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
                                    } else {
                                      _mysql.commitTransaction(() => {
                                        _mysql.releaseConnection();
                                        req.records = {
                                          leave_salary_number: leave_salary_number
                                        };
                                        next();
                                      });
                                    }
                                  })
                                  .catch(e => {
                                    _mysql.rollBackTransaction(() => {
                                      next(e);
                                    });
                                  });
                                // _mysql.commitTransaction(() => {
                                //   _mysql.releaseConnection();
                                //   req.records = {
                                //     leave_salary_number: leave_salary_number
                                //   };
                                //   next();
                                // });
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
              } else {
                utilities.logger().log("req.flag: ", "1");
                _mysql.rollBackTransaction(() => {
                  req.flag = 1;
                  next();
                });
              }
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
    } catch (e) {
      next(e);
    }
  },

  //Salay Payment
  SaveSalaryPayment: (req, res, next) => {
    try {
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
                              "select hims_f_loan_application_id,loan_skip_months,installment_amount, pending_loan,pending_tenure from hims_f_loan_application  where hims_f_loan_application_id in (?)",
                            values: [loan_application_ids],
                            printQuery: true
                          })
                          .then(loan_application => {
                            for (let i = 0; i < loan_application.length; i++) {
                              let loan_skip_months =
                                loan_application[i].loan_skip_months;
                              let pending_loan =
                                loan_application[i].pending_loan;
                              let loan_closed = "N";

                              let pending_tenure = 0;
                              if (loan_skip_months > 0) {
                                loan_skip_months--;
                                pending_tenure =
                                  loan_application[i].pending_tenure;
                              } else {
                                pending_loan =
                                  pending_loan -
                                  loan_application[i].installment_amount;
                                pending_tenure =
                                  loan_application[i].pending_tenure;
                              }

                              if (pending_loan == 0) {
                                loan_closed = "Y";
                              }

                              _mysql
                                .executeQuery({
                                  query:
                                    "UPDATE hims_f_loan_application SET pending_loan = ?, loan_closed=?, loan_skip_months=?, pending_tenure=?,\
                                    updated_date=?, updated_by=? where hims_f_loan_application_id =?",
                                  values: [
                                    pending_loan,
                                    loan_closed,
                                    loan_skip_months,
                                    pending_tenure,
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id,
                                    loan_application[i]
                                      .hims_f_loan_application_id
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
    } catch (e) {
      next(e);
    }
  },

  getWpsEmployees: (req, res, next) => {
    if (req.query.month > 0 && req.query.year > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select hims_f_salary_id,salary_number,employee_id,month,year,salary_date, E.employee_code,\
        E.full_name as employee_name ,E.company_bank_id,E.employee_bank_name,E.employee_bank_ifsc_code,\
        E.employee_account_number, S.salary_paid ,S.total_work_days ,S.net_salary ,S.total_deductions,S.total_hours,\
        S.total_working_hours,S.ot_work_hours,S.ot_weekoff_hours,S.shortage_hours,S.ot_holiday_hours  from hims_f_salary S \
        inner join hims_d_employee E on S.employee_id=E.hims_d_employee_id where S.salary_paid='Y'\
        and E.mode_of_payment='WPS' and  S.year=? and S.month=?`,
          values: [req.query.year, req.query.month],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please Provide valid input "
      };
      next();
      return;
    }
  }
};

function InsertEmployeeLeaveSalary(options) {
  return new Promise((resolve, reject) => {
    try {
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

              _mysql
                .executeQuery({ query: strQry, printQuery: true })
                .then(update_employee_leave => {
                  // resolve();
                })
                .catch(e => {
                  reject(e);
                  next(e);
                });
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
          })
          .catch(e => {
            reject(e);
            next(e);
          });
      }
      resolve();
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
      const utilities = new algaehUtilities();

      utilities.logger().log("getOtManagement: ");
      const _earnings = options.earnings;
      const empResult = options.empResult;

      const hrms_option = options.hrms_option;
      const over_time_comp = options.over_time_comp;
      const over_time = options.over_time[0];
      const current_earning_amt_array = options.current_earning_amt_array;
      const leave_salary = options.leave_salary;

      let final_earning_amount = 0;
      let current_ot_amt_array = [];

      utilities.logger().log("over_time: ", options.over_time.length);
      utilities.logger().log("ot_work_hours: ", empResult["ot_work_hours"]);
      utilities
        .logger()
        .log("ot_weekoff_hours: ", empResult["ot_weekoff_hours"]);
      utilities
        .logger()
        .log("ot_holiday_hours: ", empResult["ot_holiday_hours"]);
      if (options.over_time.length > 0) {
        let ot_hours =
          parseFloat(empResult["ot_work_hours"]) +
          parseFloat(empResult["ot_weekoff_hours"]) +
          parseFloat(empResult["ot_holiday_hours"]);
        let Noof_Working_Hours =
          parseFloat(hrms_option[0].standard_working_hours) -
          parseFloat(hrms_option[0].standard_break_hours);

        utilities.logger().log("ot_hours: ", ot_hours);
        utilities.logger().log("Noof_Working_Hours: ", Noof_Working_Hours);

        utilities.logger().log("_earnings: ", _earnings);
        if (_earnings.length == 0) {
          resolve({ current_ot_amt_array, final_earning_amount });
        }

        utilities.logger().log("payment_type: ", over_time["payment_type"]);

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
              // let ot_hours =
              //   parseFloat(empResult["ot_work_hours"]) +
              //   parseFloat(empResult["ot_weekoff_hours"]) +
              //   parseFloat(empResult["ot_holiday_hours"]);
              utilities
                .logger()
                .log("salary_calendar: ", hrms_option[0].salary_calendar);

              let earn_amount = _.chain(_earnings)
                .filter(f => {
                  if (f.earnings_id == obj.earnings_id) {
                    return parseFloat(f.amount);
                  }
                })
                .value();

              let _per_day_salary = 0;
              let per_hour_salary = 0;

              if (hrms_option[0].salary_calendar == "F") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount[0].amount) /
                    parseFloat(hrms_option[0].salary_calendar_fixed_days)
                );
              } else {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount[0].amount) /
                    parseFloat(empResult["total_days"])
                );
              }

              utilities.logger().log("_per_day_salary: ", _per_day_salary);
              per_hour_salary = _per_day_salary / Noof_Working_Hours;
              utilities.logger().log("per_hour_salary: ", per_hour_salary);

              utilities
                .logger()
                .log("working_day_hour: ", over_time["working_day_hour"]);

              utilities
                .logger()
                .log("ot_work_hours: ", empResult["ot_work_hours"]);

              // let ot_work_hours = empResult["ot_work_hours"].split(".");

              let ot_hour_price =
                per_hour_salary * over_time["working_day_hour"];
              ot_hour_price = ot_hour_price * empResult["ot_work_hours"];

              utilities.logger().log("ot_hour_price: ", ot_hour_price);

              let ot_weekoff_price =
                per_hour_salary * over_time["weekoff_day_hour"];
              ot_weekoff_price =
                ot_weekoff_price * empResult["ot_weekoff_hours"];

              utilities.logger().log("per_hour_salary: ", per_hour_salary);

              let ot_holiday_price =
                per_hour_salary * over_time["holiday_hour"];
              ot_holiday_price =
                ot_holiday_price * empResult["ot_holiday_hours"];

              utilities.logger().log("ot_holiday_price: ", ot_holiday_price);

              let final_price =
                ot_hour_price + ot_weekoff_price + ot_holiday_price;

              if (final_price > 0) {
                current_ot_amt_array.push({
                  earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
                  amount: final_price
                });
              }
              utilities
                .logger()
                .log("current_ot_amt_array: ", current_ot_amt_array);
            }
          });

          final_earning_amount = _.sumBy(current_ot_amt_array, s => {
            return parseFloat(s.amount);
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

function getShortAge(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      const _earnings = options.earnings;
      const empResult = options.empResult;
      const shortage_comp = options.shortage_comp;
      const hrms_option = options.hrms_option;
      const current_earning_amt_array = options.current_earning_amt_array;

      let final_deduction_amount = 0;
      let current_shortage_amt_array = [];

      utilities.logger().log("getShortAge: ", shortage_comp);

      if (empResult.shortage_hours != null && shortage_comp.length > 0) {
        let Noof_Working_Hours =
          parseFloat(hrms_option[0].standard_working_hours) -
          parseFloat(hrms_option[0].standard_break_hours);

        utilities.logger().log("Noof_Working_Hours: ", Noof_Working_Hours);

        _earnings.map(obj => {
          //ShortAge Calculation
          if (obj["calculation_type"] == "V") {
            let earn_amount = _.chain(current_earning_amt_array)
              .filter(f => {
                if (f.earnings_id == obj.earnings_id) {
                  return f.amount;
                }
              })
              .value();

            utilities.logger().log("earn_amount: ", earn_amount);

            let _per_day_salary = parseFloat(
              parseFloat(earn_amount[0].amount) /
                parseFloat(empResult["total_days"])
            );

            let per_hour_salary = _per_day_salary / Noof_Working_Hours;

            utilities.logger().log("per_hour_salary: ", per_hour_salary);

            per_hour_salary = per_hour_salary * empResult.shortage_hours;

            utilities.logger().log("per_hour_salary: ", per_hour_salary);

            if (per_hour_salary > 0) {
              current_shortage_amt_array.push({
                deductions_id: shortage_comp[0].hims_d_earning_deduction_id,
                amount: per_hour_salary
              });
            }
          }
        });

        final_deduction_amount = _.sumBy(current_shortage_amt_array, s => {
          return s.amount;
        });

        resolve({ current_shortage_amt_array, final_deduction_amount });
      } else {
        resolve({ current_shortage_amt_array, final_deduction_amount });
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
      const utilities = new algaehUtilities();
      utilities.logger().log("getEarningComponents: ");

      const _earnings = options.earnings;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;
      const _LeaveRule = options._LeaveRule;
      const hrms_option = options.hrms_option;

      let final_earning_amount = 0;
      let current_earning_amt_array = [];
      let current_earning_amt = 0;
      let current_earning_per_day_salary = 0;
      let leave_salary_days = 0;

      let total_days = empResult["total_days"];

      // const utilities = new algaehUtilities();

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
          utilities.logger().log("leave_salary: ", leave_salary);
          if (leave_salary == null || leave_salary == undefined) {
            utilities
              .logger()
              .log("salary_calendar: ", hrms_option[0].salary_calendar);
            if (hrms_option[0].salary_calendar == "F") {
              current_earning_per_day_salary = parseFloat(
                obj["amount"] /
                  parseFloat(hrms_option[0].salary_calendar_fixed_days)
              );

              utilities
                .logger()
                .log(
                  "current_earning_per_day_salary: ",
                  current_earning_per_day_salary
                );

              utilities
                .logger()
                .log("unpaid_leave: ", empResult["unpaid_leave"]);
              utilities.logger().log("absent_days: ", empResult["absent_days"]);

              let days =
                parseFloat(empResult["unpaid_leave"]) +
                parseFloat(empResult["absent_days"]);

              utilities.logger().log("days: ", days);
              let amount = current_earning_per_day_salary * days;
              utilities.logger().log("amount: ", amount);
              current_earning_amt = obj["amount"] - amount;
              utilities
                .logger()
                .log("current_earning_amt: ", current_earning_amt);
            } else {
              current_earning_per_day_salary = parseFloat(
                obj["amount"] / parseFloat(empResult["total_days"])
              );

              current_earning_amt =
                current_earning_per_day_salary *
                parseFloat(empResult["total_paid_days"]);
            }
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

          utilities.logger().log("current_earning_amt: ", current_earning_amt);
          //Apply Leave Rule

          if (leave_salary != "Y") {
            utilities.logger().log("total_days: ", total_days);
            let perday_salary = current_earning_amt / total_days;
            utilities.logger().log("perday_salary: ", perday_salary);

            let balance_days = 0;
            let x = 0,
              y = 0;

            if (_LeaveRule.length > 0) {
              let leaves_till_date = _LeaveRule[0].avail_till_date;
              let previous_leave = 0;
              for (let i = 0; i < _LeaveRule.length; i++) {
                let current_leave = _LeaveRule[i].present_month;
                let paytype = _LeaveRule[i].paytype;

                //Component
                if (_LeaveRule[i].calculation_type == "CO") {
                }

                //Slab
                utilities.logger().log("leaves_till_date: ", leaves_till_date);
                utilities.logger().log("current_leave: ", current_leave);
                if (_LeaveRule[i].calculation_type == "SL") {
                  if (_LeaveRule[i].value_type == "RA") {
                    let leave_rule_days = _LeaveRule[i].total_days;

                    utilities.logger().log("previous_leave: ", current_leave);
                    utilities
                      .logger()
                      .log("leave_rule_days: ", leave_rule_days);

                    if (leaves_till_date < leave_rule_days) {
                      balance_days = leaves_till_date;
                      leaves_till_date = 0;
                    } else {
                      x =
                        previous_leave > 0
                          ? leaves_till_date - leave_rule_days - previous_leave
                          : leaves_till_date - leave_rule_days;
                      y =
                        previous_leave > 0
                          ? leaves_till_date - previous_leave
                          : leaves_till_date;

                      // x=previous_leave<0?

                      utilities.logger().log("x: ", x);
                      if (leave_rule_days > 0) {
                        utilities
                          .logger()
                          .log("leave_rule_days: ", leave_rule_days);
                        balance_days = leave_rule_days;
                      } else {
                        utilities.logger().log("else: ", x);
                        balance_days = x;
                      }
                      leaves_till_date = x;
                      utilities
                        .logger()
                        .log("leaves_till_date: ", leaves_till_date);
                      if (leaves_till_date > current_leave) {
                        utilities.logger().log("if: ");
                        balance_days = 0;
                      } else {
                        utilities.logger().log("else: ", y);
                        if (y > current_leave) {
                          y = y - current_leave;
                          balance_days = balance_days - y;
                          utilities
                            .logger()
                            .log("balance_days: ", balance_days);
                        }
                      }
                    }

                    utilities
                      .logger()
                      .log("leaves_till_date: ", leaves_till_date);

                    if (balance_days > 0) {
                      utilities
                        .logger()
                        .log("current_earning_amt: ", current_earning_amt);
                      let split_sal = 0;

                      utilities.logger().log("paytype: ", paytype);
                      if (paytype == "NO") {
                      } else if (paytype == "FD") {
                        current_earning_amt = current_earning_amt;
                      } else if (paytype == "HD") {
                        split_sal = perday_salary / 2;
                        split_sal = split_sal * balance_days;

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "UN") {
                        split_sal = perday_salary * balance_days;

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "QD") {
                        split_sal = (perday_salary * 3) / 4;
                        split_sal = split_sal * balance_days;

                        current_earning_amt = current_earning_amt - split_sal;
                      } else if (paytype == "TQ") {
                        split_sal = perday_salary / 4;
                        split_sal = split_sal * balance_days;

                        current_earning_amt = current_earning_amt - split_sal;
                      }
                    }
                    previous_leave = leaves_till_date - current_leave;
                    previous_leave = previous_leave - leave_rule_days;

                    utilities
                      .logger()
                      .log("current_earning_amt: ", current_earning_amt);
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

      final_earning_amount = _.sumBy(current_earning_amt_array, s => {
        return parseFloat(s.amount);
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
      const hrms_option = options.hrms_option;

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
            if (hrms_option[0].salary_calendar == "F") {
              current_deduction_per_day_salary = parseFloat(
                obj["amount"] /
                  parseFloat(hrms_option[0].salary_calendar_fixed_days)
              );

              let days =
                parseFloat(empResult["unpaid_leave"]) +
                parseFloat(empResult["absent_days"]);

              let amount = current_deduction_per_day_salary * days;
              current_deduction_amt = obj["amount"] - amount;
            } else {
              current_deduction_per_day_salary = parseFloat(
                obj["amount"] / parseFloat(empResult["total_days"])
              );
              current_deduction_amt =
                current_deduction_per_day_salary *
                parseFloat(empResult["total_paid_days"]);
            }
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
        return parseFloat(s.amount);
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
      const hrms_option = options.hrms_option;

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
            if (hrms_option[0].salary_calendar == "F") {
              current_contribution_per_day_salary = parseFloat(
                obj["amount"] /
                  parseFloat(hrms_option[0].salary_calendar_fixed_days)
              );

              let days =
                parseFloat(empResult["unpaid_leave"]) +
                parseFloat(empResult["absent_days"]);

              let amount = current_contribution_per_day_salary * days;
              current_contribution_amt = obj["amount"] - amount;
            } else {
              current_contribution_per_day_salary = parseFloat(
                obj["amount"] / parseFloat(empResult["total_days"])
              );
              current_contribution_amt =
                current_contribution_per_day_salary *
                parseFloat(empResult["total_paid_days"]);
            }
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
        return parseFloat(s.amount);
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
          return parseFloat(s.approved_amount);
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

      if (_advance.length == 0) {
        resolve({ advance_due_amount, current_deduct_compoment });
      }

      advance_due_amount = _.sumBy(_advance, s => {
        return parseFloat(s.payment_amount);
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
        return parseFloat(s.amount);
      });

      final_deduction_amount = _.sumBy(current_deduct_compoment, s => {
        return parseFloat(s.amount);
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

function UpdateProjectWisePayroll(options) {
  return new Promise((resolve, reject) => {
    try {
      let project_wise_payroll = options.project_wise_payroll;
      let _mysql = options._mysql;
      let net_salary = options.net_salary;

      let total_hours_project = options.total_hours_project;
      let strQry = "";

      // const utilities = new algaehUtilities();

      // utilities.logger().log("UpdateProjectWisePayroll: ");

      for (let z = 0; z < project_wise_payroll.length; z++) {
        let cost = 0;
        let complete_hours = parseInt(project_wise_payroll[z]["worked_hours"]);

        let worked_minutes = project_wise_payroll[z]["worked_minutes"];
        complete_hours += parseInt(worked_minutes / 60);
        let mins = String("0" + parseInt(worked_minutes % 60)).slice(-2);
        complete_hours = complete_hours + "." + mins;

        let net_salary_amt = _.filter(net_salary, f => {
          return f.employee_id == project_wise_payroll[z]["employee_id"];
        });
        let total_hours = _.filter(total_hours_project, f => {
          return f.employee_id == project_wise_payroll[z]["employee_id"];
        });

        // utilities.logger().log("total_hours: ", total_hours);

        cost =
          parseFloat(net_salary_amt[0].net_salary) /
          parseFloat(total_hours[0].complete_hours);

        // utilities.logger().log("cost: ", cost);

        cost = cost * complete_hours;

        strQry += _mysql.mysqlQueryFormat(
          "UPDATE hims_f_project_wise_payroll set cost=? where hims_f_project_wise_payroll_id=?; ",
          [cost, project_wise_payroll[z].hims_f_project_wise_payroll_id]
        );
      }

      _mysql
        .executeQuery({
          query: strQry,
          printQuery: true
        })
        .then(project_wise_payroll => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}
