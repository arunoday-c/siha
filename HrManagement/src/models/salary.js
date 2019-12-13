import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import { LINQ } from "node-linq";
import mysql from "mysql";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  newProcessSalary: (req, res, next) => {
    // console.log("req.connection: ", req.connection);
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();

        // utilities.logger().log("newProcessSalary: ");
        const input = req.query;
        const month_number = parseFloat(input.month);
        const year = input.year;
        let inputValues = [input.year, input.month];
        let _stringData = "";

        console.log("_stringData: ", input.leave_salary);
        console.log("month_number: ", month_number);
        console.log("leave_salary: ", input.leave_salary);

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
          if (input.department_id != null) {
            _stringData += " and SD.department_id=?";
            inputValues.push(input.department_id);
          }

          // utilities.logger().log("group_id: ", input.group_id);

          if (input.group_id != null) {
            _stringData += " and E.employee_group_id=?";
            inputValues.push(input.group_id);
          }
          strQuery =
            "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, \
            A.sub_department_id, A.total_days,A.present_days, A.absent_days, A.total_work_days, \
            A.display_present_days,A.total_weekoff_days, A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, \
            A.total_paid_days, A.total_hours, A.total_working_hours, A.ot_work_hours, \
            A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours, E.employee_code, E.gross_salary, \
            S.hims_f_salary_id,S.salary_processed, AL.from_normal_salary, LA.total_applied_days \
            from hims_f_attendance_monthly as A \
            inner join  hims_d_employee as E on  E.hims_d_employee_id = A.employee_id and \
            A.hospital_id = E.hospital_id \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month`\
            and S.employee_id = A.employee_id \
            left join hims_f_employee_annual_leave AL on E.hims_d_employee_id=AL.employee_id \
            and  AL.year=? and AL.month=? and AL.cancelled='N' \
            left join hims_f_leave_application LA on LA.hims_f_leave_application_id=AL.leave_application_id \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id  where \
            A.`year`=? and A.`month`=? and A.hospital_id=?" +
            _stringData +
            " and (hims_f_employee_annual_leave_id is null OR from_normal_salary='Y') and (S.salary_processed is null or  S.salary_processed='N');";
        } else {
          // inputValues.push(input.year);
          // inputValues.push(input.month);
          inputValues.push(input.hospital_id);

          if (input.leave_salary === "Y") {
            if (input.employee_id != null) {
              _stringData += " and E.hims_d_employee_id=?";
              inputValues.push(input.employee_id);
            }
            strQuery =
              "select E.hims_d_employee_id as employee_id, E.employee_code, E.gross_salary, 0 as total_days,0 as absent_days, \
              0 as unpaid_leave, S.hims_f_salary_id from hims_d_employee E left join hims_f_salary as S on  \
              E.hims_d_employee_id = S.employee_id and S.`year`=? and S.`month` = ? where record_status='A' and E.hospital_id=?" +
              _stringData;
          } else {
            if (input.employee_id != null) {
              _stringData += " and A.employee_id=?";
              inputValues.push(input.employee_id);
            }
            strQuery =
              "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, \
            A.sub_department_id, A.total_days,A.present_days, A.absent_days, A.total_work_days, \
            A.display_present_days,A.total_weekoff_days, A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, \
            A.total_paid_days,A.total_hours, A.total_working_hours,A.ot_work_hours, \
            A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours,\
            E.employee_code,E.gross_salary, S.hims_f_salary_id,S.salary_processed \
            from hims_f_attendance_monthly as A inner join  hims_d_employee as E \
            on  E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month`\
            and S.employee_id = A.employee_id   where A.`year`=? and A.`month`=? and A.hospital_id=?" +
              _stringData +
              " and  (S.salary_processed is null or  S.salary_processed='N');";
          }
        }

        // utilities.logger().log("strQuery: ", strQuery);
        _mysql
          .executeQuery({
            query: strQuery,
            values: inputValues,
            printQuery: true
          })
          .then(empResult => {
            console.log("empResult: ", empResult.length);
            if (empResult.length == 0) {
              console.log("empResult reslove: ", empResult.length);

              if (req.connection == null) {
                // utilities.logger().log("req.connection : ");
                _mysql.releaseConnection();
                req.records = empResult;
                next();
              } else {
                // utilities.logger().log("req.connection Else : ");
                resolve();
              }
              return;
            }

            let _salaryHeader_id = [];
            let _myemp = [];
            empResult.map(o => {
              _salaryHeader_id.push(o.hims_f_salary_id);
              _myemp.push(o.employee_id);
            });

            // utilities.logger().log("_myemp : ", _myemp);

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
              // utilities.logger().log("else: ");
              avail_till_date = moment(input.month, "MM").format("MMMM");
              // utilities.logger().log("avail_till_date: ", avail_till_date);
              avail_till_date = "COALESCE(" + avail_till_date + ", 0)";
            }
            const month_name = moment(input.month, "MM").format("MMMM");

            let str_Query =
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
            str_Query +=
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
              EE.calculation_method,ED.calculation_type,ED.component_frequency,ED.overtime_applicable,\
              ED.annual_salary_comp,ED.limit_applicable, ED.limit_amount from hims_d_employee_earnings EE inner join hims_d_earning_deduction ED\
              on EE.earnings_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
              where ED.component_frequency='M' and ED.component_category='E' and EE.employee_id in (?);\
            select hims_d_employee_deductions_id,employee_id,deductions_id,amount,EMP_D.formula,\
              allocate,EMP_D.calculation_method,ED.calculation_type,ED.component_frequency, ED.limit_applicable, ED.limit_amount from \
              hims_d_employee_deductions EMP_D inner join hims_d_earning_deduction ED\
              on EMP_D.deductions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
              where ED.component_frequency='M'  and ED.component_category='D' and EMP_D.employee_id in(?);\
            select  hims_d_employee_contributions_id,employee_id,contributions_id,amount,\
              EC.formula,EC.allocate,EC.calculation_method,ED.calculation_type,ED.component_frequency, ED.limit_applicable, ED.limit_amount\
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
            select hims_d_hrms_options_id,standard_working_hours,standard_break_hours,salary_calendar,salary_calendar_fixed_days, ot_calculation from hims_d_hrms_options;\
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
                  str_Query,
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
                      // utilities.logger().log("empResult ", empResult[i]);
                      let results = Salaryresults;
                      let leave_salary_accrual_amount = 0;
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

                      // utilities
                      //   .logger()
                      //   .log(
                      //     "hrms_option.salary_calendar: ",
                      //     results[8][0].salary_calendar
                      //   );
                      if (results[8][0].salary_calendar == "F") {
                        // utilities
                        //   .logger()
                        //   .log(
                        //     "in_salary_calendar: ",
                        //     results[8][0].salary_calendar
                        //   );

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
                        hrms_option: results[8],
                        next: next,
                        decimal_places: req.userIdentity.decimal_places
                      })
                        .then(earningOutput => {
                          current_earning_amt_array =
                            earningOutput.current_earning_amt_array;
                          final_earning_amount =
                            earningOutput.final_earning_amount;
                          leave_salary_accrual_amount =
                            earningOutput.accrual_amount;
                          // utilities
                          //   .logger()
                          //   .log("_earning_amount : ", final_earning_amount);

                          const _deduction = _.filter(results[1], f => {
                            return f.employee_id == empResult[i]["employee_id"];
                          });
                          getDeductionComponents({
                            deduction: _deduction,
                            empResult: empResult[i],
                            leave_salary: req.query.leave_salary,
                            hrms_option: results[8],
                            next: next,
                            decimal_places: req.userIdentity.decimal_places
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
                              hrms_option: results[8],
                              next: next,
                              decimal_places: req.userIdentity.decimal_places
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
                                loanPayable: _loanPayable,
                                next: next,
                                decimal_places: req.userIdentity.decimal_places
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
                                  dedcomponent: results[7],
                                  next: next,
                                  decimal_places:
                                    req.userIdentity.decimal_places
                                }).then(advanceOutput => {
                                  advance_due_amount =
                                    advanceOutput.advance_due_amount;

                                  final_deduction_amount =
                                    final_deduction_amount +
                                    advanceOutput.advance_due_amount;

                                  current_deduction_amt_array = current_deduction_amt_array.concat(
                                    advanceOutput.current_deduct_compoment
                                  );
                                  // utilities
                                  //   .logger()
                                  //   .log(
                                  //     "employee_id: ",
                                  //     empResult[i]["employee_id"]
                                  //   );
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
                                  // utilities
                                  //   .logger()
                                  //   .log("_over_time: ", _over_time);
                                  getOtManagement({
                                    earnings: _earnings,
                                    current_earning_amt_array: current_earning_amt_array,
                                    empResult: empResult[i],
                                    hrms_option: results[8],
                                    over_time_comp: results[9],
                                    over_time: _over_time,
                                    leave_salary: req.query.leave_salary,
                                    next: next,
                                    decimal_places:
                                      req.userIdentity.decimal_places
                                  }).then(OTManagement => {
                                    final_earning_amount =
                                      final_earning_amount +
                                      OTManagement.final_earning_amount;

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
                                      leave_salary: req.query.leave_salary,
                                      next: next,
                                      decimal_places:
                                        req.userIdentity.decimal_places
                                    }).then(ShortAge => {
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
                                        miscellaneous: _miscellaneous,
                                        next: next,
                                        decimal_places:
                                          req.userIdentity.decimal_places
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

                                        // utilities
                                        //   .logger()
                                        //   .log(
                                        //     "final_earning_amount : ",
                                        //     final_earning_amount
                                        //   );
                                        // utilities
                                        //   .logger()
                                        //   .log(
                                        //     "final_deduction_amount : ",
                                        //     final_deduction_amount
                                        //   );
                                        // utilities
                                        //   .logger()
                                        //   .log(
                                        //     "total_loan_due_amount : ",
                                        //     total_loan_due_amount
                                        //   );

                                        let _net_salary =
                                          final_earning_amount -
                                          final_deduction_amount -
                                          total_loan_due_amount;

                                        _net_salary =
                                          _net_salary +
                                          total_loan_payable_amount;

                                        if (
                                          current_earning_amt_array.length > 0
                                        ) {
                                          _headerQuery += _mysql.mysqlQueryFormat(
                                            "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,sub_department_id,salary_date,per_day_sal,total_days,\
                                              present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                              unpaid_leave,total_hours, total_working_hours, ot_work_hours, ot_weekoff_hours, ot_holiday_hours, leave_salary_accrual_amount, leave_salary_days,\
                                              shortage_hours,display_present_days,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                              total_contributions,net_salary, total_paid_days, salary_type, hospital_id) \
                                             VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;",
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
                                              empResult[i][
                                              "total_weekoff_days"
                                              ],
                                              empResult[i]["total_holidays"],
                                              empResult[i]["total_leave"],
                                              empResult[i]["paid_leave"],
                                              empResult[i]["unpaid_leave"],
                                              empResult[i]["total_hours"],
                                              empResult[i][
                                              "total_working_hours"
                                              ],
                                              empResult[i]["ot_work_hours"],
                                              empResult[i]["ot_weekoff_hours"],
                                              empResult[i]["ot_holiday_hours"],
                                              leave_salary_accrual_amount,
                                              empResult[i][
                                              "total_applied_days"
                                              ],
                                              empResult[i]["shortage_hours"],
                                              empResult[i][
                                              "display_present_days"
                                              ],

                                              total_loan_payable_amount,
                                              total_loan_due_amount,
                                              advance_due_amount,
                                              final_earning_amount,
                                              final_earning_amount, //Gross salary = total earnings
                                              final_deduction_amount,
                                              final_contribution_amount,
                                              _net_salary,
                                              empResult[i]["total_paid_days"],
                                              req.query.leave_salary == null
                                                ? "NS"
                                                : "LS",
                                              input.hospital_id
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
                                        }

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
                    // utilities.logger().log("_headerQuery: ", _headerQuery);
                    // utilities
                    //   .logger()
                    //   .log(
                    //     "final_earning_amt_array: ",
                    //     final_earning_amt_array
                    //   );
                    // utilities
                    //   .logger()
                    //   .log(
                    //     "final_deduction_amt_array: ",
                    //     final_deduction_amt_array
                    //   );
                    // utilities
                    //   .logger()
                    //   .log(
                    //     "final_contribution_amt_array: ",
                    //     final_contribution_amt_array
                    //   );
                    // utilities
                    //   .logger()
                    //   .log("final_loan_array: ", final_loan_array);
                    if (_headerQuery == "") {
                      _mysql.releaseConnection();
                      req.records = empResult;
                      next();
                      resolve();
                      return;
                    }
                    _mysql
                      .executeQueryWithTransaction({
                        query: _headerQuery,
                        printQuery: true
                      })
                      .then(inserted_header => {
                        // utilities
                        //   .logger()
                        //   .log("inserted_header: ", inserted_header);
                        let inserted_salary = [];
                        if (Array.isArray(inserted_header)) {
                          inserted_salary = inserted_header;
                        } else {
                          inserted_salary = [inserted_header];
                        }

                        // utilities
                        //   .logger()
                        //   .log("inserted_salary: ", inserted_salary);
                        if (inserted_salary.length > 0) {
                          let execute_query = "";

                          for (let k = 0; k < inserted_salary.length; k++) {
                            salary_header_id = inserted_salary[k].insertId;
                            // utilities
                            //   .logger()
                            //   .log(
                            //     "final_earning_amt_array: ",
                            //     final_earning_amt_array[k]
                            //   );
                            if (final_earning_amt_array[k].length > 0) {
                              for (
                                let l = 0;
                                l < final_earning_amt_array[k].length;
                                l++
                              ) {
                                // utilities
                                //   .logger()
                                //   .log(
                                //     "final_earning_amt_array: ",
                                //     final_earning_amt_array[k][l].earnings_id
                                //   );
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
                              // utilities
                              //   .logger()
                              //   .log("execute_query: ", execute_query);
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
                                    // utilities
                                    //   .logger()
                                    //   .log(
                                    //     "salary_header_id: ",
                                    //     salary_header_id
                                    //   );
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
                        // utilities.logger().log("error: ", error);
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
            // utilities.logger().log("error: ", error);
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

                    let removal_index = _.findIndex(attandenceResult, function (
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
                  // utilities.logger().log("input.month: ", input.month);
                  let avail_till_date = "";
                  if (input.month != 1) {
                    let months = "";
                    avail_till_date = "COALESCE(january, 0)";
                    for (let k = 2; k <= input.month; k++) {
                      months = moment(k, "MM").format("MMMM");
                      avail_till_date += "+" + "COALESCE(" + months + ", 0)";
                    }
                  } else {
                    // utilities.logger().log("else: ");
                    avail_till_date = moment(input.month, "MM").format("MMMM");
                    // utilities
                    // .logger()
                    // .log("avail_till_date: ", avail_till_date);
                    avail_till_date = "COALESCE(" + avail_till_date + ", 0)";
                  }

                  // utilities.logger().log("avail_till_date: ", avail_till_date);

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

                  // utilities.logger().log("strQuery: ", strQuery);
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

                      // utilities.logger().log("empResult", empResult);

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
                            _LeaveRule: _LeaveRule,
                            next: next
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
                                leave_salary: req.query.leave_salary,
                                next: next
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
                                    leave_salary: req.query.leave_salary,
                                    next: next
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
                                        loanPayable: _loanPayable,
                                        next: next
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
                                            dedcomponent: results[7],
                                            next: next
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
                                                  req.query.leave_salary,
                                                next: next
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
                                                      req.query.leave_salary,
                                                    next: next
                                                  })
                                                    .then(ShortAge => {
                                                      // utilities
                                                      //   .logger()
                                                      //   .log(
                                                      //     "ShortAge",
                                                      //     ShortAge
                                                      //   );
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
                                                        miscellaneous: _miscellaneous,
                                                        next: next
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
                                                            // utilities
                                                            //   .logger()
                                                            //   .log(
                                                            //     "final_deduction_amount",
                                                            //     final_deduction_amount
                                                            //   );
                                                            _mysql
                                                              .executeQueryWithTransaction(
                                                                {
                                                                  query:
                                                                    "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,sub_department_id,salary_date,per_day_sal,total_days,\
                                                                 present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                                                 unpaid_leave,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                                                 total_contributions,net_salary, total_paid_days, salary_type) \
                                                                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
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
                                                                    ],
                                                                    req.query
                                                                      .leave_salary ==
                                                                      null
                                                                      ? "NS"
                                                                      : "LS"
                                                                  ],
                                                                  printQuery: true
                                                                }
                                                              )
                                                              .then(
                                                                inserted_salary => {
                                                                  // utilities
                                                                  //   .logger()
                                                                  //   .log(
                                                                  //     "inserted_salary",
                                                                  //     inserted_salary
                                                                  //   );
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

      _stringData +=
        inputParam.department_id != null ? " and SD.department_id=? " : "";

      _stringData +=
        inputParam.group_id != null ? " and emp.employee_group_id=? " : "";

      _stringData +=
        inputParam.salary_type != null
          ? "and salary_type = '" + inputParam.salary_type + "'"
          : "and salary_type='NS'";

      _mysql
        .executeQuery({
          query:
            "select hims_f_salary_id, employee_id, salary_number, S.year, total_days, absent_days, total_work_days,  total_weekoff_days, total_holidays, total_leave, paid_leave, unpaid_leave, present_days,  pending_unpaid_leave, total_paid_days, S.gross_salary, S.net_salary, advance_due, display_present_days, \
            S.total_earnings,S.total_deductions,loan_payable_amount, loan_due_amount, salary_processed, salary_paid, \
            leave_salary_accrual_amount, leave_salary_days, emp.employee_code, emp.full_name from hims_f_salary S, \
            hims_d_employee emp, hims_d_sub_department SD where S.employee_id = emp.hims_d_employee_id and \
            emp.sub_department_id=SD.hims_d_sub_department_id \
             and `year` = ? and `month` = ? and emp.hospital_id=? " +
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

      _stringData +=
        inputParam.department_id != null ? " and SD.department_id=? " : "";

      _stringData +=
        inputParam.group_id != null ? " and emp.employee_group_id=? " : "";
      /* Select statemwnt  */

      _mysql
        .executeQuery({
          query:
            "select hims_f_salary_id, salary_number, employee_id,present_days,display_present_days, salary_processed, hims_f_salary.gross_salary, hims_f_salary.net_salary, advance_due, loan_payable_amount, \
            loan_due_amount, emp.employee_code, emp.full_name,salary_paid from hims_f_salary, \
            hims_d_employee emp, hims_d_sub_department SD where hims_f_salary.employee_id = emp.hims_d_employee_id \
            and emp.sub_department_id=SD.hims_d_sub_department_id and salary_processed = 'Y' and \
            `year` = ? and `month` = ? " +
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
      // const decimal_places = req.userIdentity.decimal_places;

      // utilities.logger().log("employee_id: ", inputParam.employee_id);
      // utilities
      //   .logger()
      //   .log("_leave_salary_acc: ", inputParam._leave_salary_acc.length);
      let strQuery = "";
      if (inputParam.annual_leave_calculation === "A") {
        strQuery =
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
        ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
      } else if (inputParam.annual_leave_calculation === "M") {
        strQuery =
          "select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
          inputParam.year +
          " as year," +
          inputParam.month +
          " as month, \
          CASE when airfare_factor = 'PB' then ((amount / 100)*airfare_percentage) else (airfare_amount/airfare_eligibility) end airfare_amount,\
          sum(EE.amount /30)* EG.monthly_accrual_days as leave_salary\
          from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
          where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
          EE.earnings_id=ED.hims_d_earning_deduction_id and \
          ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
      }
      _mysql
        .executeQuery({
          query: strQuery,
          values: [inputParam.employee_id],
          printQuery: true
        })
        .then(leave_accrual_data => {
          // utilities.logger().log("leave_accrual_data: ", leave_accrual_data[0]);
          let leave_accrual_detail = leave_accrual_data[0];
          let annual_leave_data = leave_accrual_data[1];

          // utilities.logger().log("annual_leave_data: ", annual_leave_data);
          if (leave_accrual_detail.length > 0) {
            _mysql
              .generateRunningNumber({
                modules: ["LEAVE_ACCRUAL"],
                tableName: "hims_f_app_numgen",
                identity: {
                  algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                  hospital_id: req.userIdentity.hospital_id
                }
              })
              .then(generatedNumbers => {
                let leave_salary_number = generatedNumbers[0];

                // utilities
                //   .logger()
                //   .log("leave_accrual_detail: ", leave_accrual_detail);

                let leave_salary_accrual_detail = leave_accrual_detail;

                const total_leave_salary = _.sumBy(
                  leave_salary_accrual_detail,
                  s => {
                    return parseFloat(s.leave_salary);
                  }
                );

                const total_airfare_amount = _.sumBy(
                  leave_salary_accrual_detail,
                  s => {
                    return parseFloat(s.airfare_amount);
                  }
                );

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO `hims_f_leave_salary_accrual_header` (leave_salary_number,year, month,  \
                        total_leave_salary, total_airfare_amount, hospital_id, leave_salary_date , \
                        created_date, created_by)\
                      VALUE(?,?,?,?,?,?,?,?,?);",
                    values: [
                      leave_salary_number,
                      inputParam.year,
                      inputParam.month,
                      total_leave_salary,
                      total_airfare_amount,
                      req.userIdentity.hospital_id,
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
                              annual_leave_data: annual_leave_data,
                              _mysql: _mysql,
                              next: next,
                              decimal_places: req.userIdentity.decimal_places
                            })
                              .then(Employee_Leave_Salary => {
                                // utilities
                                //   .logger()
                                //   .log("InsertEmployeeLeaveSalary: ");
                                _mysql
                                  .executeQuery({
                                    query:
                                      "Select hims_f_project_wise_payroll_id,employee_id, worked_hours, worked_minutes,\
                                    COALESCE(worked_hours) + COALESCE(concat(floor(worked_minutes/60)  ,'.',worked_minutes%60),0) as complete_hours\
                                     from hims_f_project_wise_payroll where year=? and month=? and hospital_id=? and  employee_id in (?);",
                                    values: [
                                      inputParam.year,
                                      inputParam.month,
                                      inputParam.hospital_id,
                                      inputParam.employee_id
                                      // inputParam.year,
                                      // inputParam.month,
                                      // inputParam.hospital_id,
                                      // inputParam.employee_id
                                    ],
                                    printQuery: true
                                  })
                                  .then(project_wise_payroll => {
                                    // utilities
                                    //   .logger()
                                    //   .log(
                                    //     "project_wise_payroll: ",
                                    //     project_wise_payroll
                                    //   );
                                    if (project_wise_payroll.length > 0) {
                                      UpdateProjectWisePayroll({
                                        project_wise_payroll: project_wise_payroll,
                                        _mysql: _mysql,
                                        net_salary: inputParam.net_salary,
                                        next: next,
                                        decimal_places: req.userIdentity.decimal_places
                                      })
                                        .then(Employee_Leave_Salary => {
                                          // utilities
                                          //   .logger()
                                          //   .log("Employee_Leave_Salary: ");
                                          InsertGratuityProvision({
                                            inputParam: inputParam,
                                            _mysql: _mysql,
                                            next: next,
                                            decimal_places: req.userIdentity.decimal_places
                                          })
                                            .then(gratuity_provision => {
                                              // utilities
                                              //   .logger()
                                              //   .log(
                                              //     "Employee_Leave_Salary gratuity_provision: "
                                              //   );
                                              if (
                                                inputParam._leave_salary_acc
                                                  .length > 0
                                              ) {
                                                UpdateLeaveSalaryProvission({
                                                  inputParam: inputParam,
                                                  _mysql: _mysql,
                                                  next: next,
                                                  decimal_places: req.userIdentity.decimal_places
                                                })
                                                  .then(
                                                    Leave_Salary_Provission => {
                                                      _mysql.commitTransaction(
                                                        () => {
                                                          _mysql.releaseConnection();
                                                          req.records = {
                                                            leave_salary_number: leave_salary_number
                                                          };
                                                          next();
                                                        }
                                                      );
                                                    }
                                                  )
                                                  .catch(e => {
                                                    _mysql.rollBackTransaction(
                                                      () => {
                                                        next(e);
                                                      }
                                                    );
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
                                        })
                                        .catch(e => {
                                          _mysql.rollBackTransaction(() => {
                                            next(e);
                                          });
                                        });
                                    } else {
                                      // utilities.logger().log("else: ");
                                      InsertGratuityProvision({
                                        inputParam: inputParam,
                                        _mysql: _mysql,
                                        next: next,
                                        decimal_places: req.userIdentity.decimal_places
                                      })
                                        .then(gratuity_provision => {
                                          // utilities
                                          //   .logger()
                                          //   .log("else gratuity_provision: ");
                                          if (
                                            inputParam._leave_salary_acc
                                              .length > 0
                                          ) {
                                            UpdateLeaveSalaryProvission({
                                              inputParam: inputParam,
                                              _mysql: _mysql,
                                              next: next,
                                              decimal_places: req.userIdentity.decimal_places
                                            })
                                              .then(Leave_Salary_Provission => {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = {
                                                    leave_salary_number: leave_salary_number
                                                  };
                                                  next();
                                                });
                                              })
                                              .catch(e => {
                                                _mysql.rollBackTransaction(
                                                  () => {
                                                    next(e);
                                                  }
                                                );
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
          } else {
            // utilities.logger().log("else: ", leave_accrual_detail);
            _mysql
              .executeQuery({
                query:
                  "UPDATE hims_f_salary SET salary_processed = 'Y' where hims_f_salary_id in (?)",
                values: [inputParam.salary_header_id],
                printQuery: true
              })
              .then(salary_process => {
                // utilities.logger().log("salary_process: ");
                _mysql
                  .executeQuery({
                    query:
                      "Select hims_f_project_wise_payroll_id,employee_id, worked_hours, worked_minutes,\
                      COALESCE(worked_hours) + COALESCE(concat(floor(worked_minutes/60)  ,'.',worked_minutes%60),0) as complete_hours\
                       from hims_f_project_wise_payroll where year=? and month=? and hospital_id=? and  employee_id in (?);",
                    values: [
                      inputParam.year,
                      inputParam.month,
                      inputParam.hospital_id,
                      inputParam.employee_id
                      // inputParam.year,
                      // inputParam.month,
                      // inputParam.hospital_id,
                      // inputParam.employee_id
                    ],
                    printQuery: true
                  })
                  .then(project_wise_payroll => {
                    // utilities
                    //   .logger()
                    //   .log("project_wise_payroll: ", project_wise_payroll);
                    if (project_wise_payroll.length > 0) {
                      UpdateProjectWisePayroll({
                        project_wise_payroll: project_wise_payroll,
                        _mysql: _mysql,
                        net_salary: inputParam.net_salary,
                        next: next,
                        decimal_places: req.userIdentity.decimal_places
                      })
                        .then(Employee_Leave_Salary => {
                          InsertGratuityProvision({
                            inputParam: inputParam,
                            _mysql: _mysql,
                            next: next,
                            decimal_places: req.userIdentity.decimal_places
                          })
                            .then(gratuity_provision => {
                              if (inputParam._leave_salary_acc.length > 0) {
                                UpdateLeaveSalaryProvission({
                                  inputParam: inputParam,
                                  _mysql: _mysql,
                                  next: next,
                                  decimal_places: req.userIdentity.decimal_places
                                })
                                  .then(Leave_Salary_Provission => {
                                    _mysql.commitTransaction(() => {
                                      _mysql.releaseConnection();
                                      req.records = gratuity_provision;
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
                                  req.records = gratuity_provision;
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
                    } else {
                      InsertGratuityProvision({
                        inputParam: inputParam,
                        _mysql: _mysql,
                        next: next,
                        decimal_places: req.userIdentity.decimal_places
                      })
                        .then(gratuity_provision => {
                          if (inputParam._leave_salary_acc.length > 0) {
                            UpdateLeaveSalaryProvission({
                              inputParam: inputParam,
                              _mysql: _mysql,
                              next: next,
                              decimal_places: req.userIdentity.decimal_places
                            })
                              .then(Leave_Salary_Provission => {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  req.records = gratuity_provision;
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
                              req.records = gratuity_provision;
                              next();
                            });
                          }
                        })
                        .catch(e => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
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
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  //Salay Payment
  SaveSalaryPayment: (req, res, next) => {
    try {
      let buffer = "";
      req.on("data", chunk => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        const _mysql = new algaehMysql();
        const inputParam = JSON.parse(buffer);

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
      });
    } catch (e) {
      next(e);
    }
  },

  getWpsEmployeesBKP: (req, res, next) => {
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

          for (let i = 0; i < result.length; i++) {
            //ST-complete OVER-Time (ot,wot,hot all togather sum)  calculation
            let ot_hours = 0;
            let ot_min = 0;

            ot_hours += parseInt(
              result[i]["ot_work_hours"].toString().split(".")[0]
            );
            ot_min += parseInt(
              result[i]["ot_work_hours"].toString().split(".")[1]
            );

            ot_hours += parseInt(
              result[i]["ot_weekoff_hours"].toString().split(".")[0]
            );
            ot_min += parseInt(
              result[i]["ot_weekoff_hours"].toString().split(".")[1]
            );

            ot_hours += parseInt(
              result[i]["ot_holiday_hours"].toString().split(".")[0]
            );
            ot_min += parseInt(
              result[i]["ot_holiday_hours"].toString().split(".")[1]
            );

            ot_hours += parseInt(parseInt(ot_min) / parseInt(60));

            let complete_ot =
              ot_hours + "." + (parseInt(ot_min) % parseInt(60));
            //EN-complete OVER-Time  calculation

            result[i] = {
              ...result[i],
              complete_ot: complete_ot,
              salary_freq: "M"
            };
          }

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
  },

  //created by:irfan,for report
  getWpsEmployees: (req, res, next) => {
    if (req.query.month > 0 && req.query.year > 0) {
      const _mysql = new algaehMysql();

      let input = req.query;
      let outputArray = [];

      _mysql
        .executeQuery({
          query: `select hims_f_salary_id,salary_number,employee_id,month,year,salary_date, E.employee_code,\
          E.full_name as employee_name ,E.company_bank_id,E.employee_bank_name,E.employee_bank_ifsc_code,\
          E.employee_account_number, S.salary_processed ,S.total_work_days ,S.net_salary ,S.total_deductions,S.total_hours,\
          S.total_working_hours,S.ot_work_hours,S.ot_weekoff_hours,S.shortage_hours,S.ot_holiday_hours,E.nationality  from hims_f_salary S \
          inner join hims_d_employee E on S.employee_id=E.hims_d_employee_id where S.salary_processed='Y'\
          and E.company_bank_id=? and E.mode_of_payment='WPS' and  S.year=? and S.month=?; \
          select default_nationality from hims_d_hospital;`,
          values: [input.company_bank_id, input.year, input.month],
          printQuery: true
        })
        .then(salary_details => {
          let total_earnings = 0;
          let total_deductions = 0;
          let total_contributions = 0;
          let total_net_salary = 0;
          let salary = salary_details[0];
          let default_nationality = salary_details[1][0]["default_nationality"];

          const utilities = new algaehUtilities();

          // utilities.logger().log("default_nationality: ", default_nationality);
          if (salary.length > 0) {
            total_earnings = new LINQ(salary).Sum(s =>
              parseFloat(s.total_earnings)
            );
            total_deductions = new LINQ(salary).Sum(s =>
              parseFloat(s.total_deductions)
            );
            total_contributions = new LINQ(salary).Sum(s =>
              parseFloat(s.total_contributions)
            );
            total_net_salary = new LINQ(salary).Sum(s =>
              parseFloat(s.net_salary)
            );

            let salary_header_ids = new LINQ(salary)
              .Select(s => s.hims_f_salary_id)
              .ToArray();

            // utilities.logger().log("salary_header_ids: ", salary_header_ids);

            _mysql
              .executeQuery({
                query:
                  "select hims_f_salary_earnings_id,salary_header_id,earnings_id,amount,per_day_salary,ED.nationality_id from \
                hims_f_salary_earnings SE inner join hims_d_earning_deduction ED on \
                SE.earnings_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' where salary_header_id in (" +
                  salary_header_ids +
                  ");\
                select hims_f_salary_deductions_id,salary_header_id,deductions_id,amount,per_day_salary,ED.nationality_id from \
                hims_f_salary_deductions SD inner join hims_d_earning_deduction ED on \
                SD.deductions_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' \
                where salary_header_id in ( " +
                  salary_header_ids +
                  ");select basic_earning_component from hims_d_hrms_options; \
                  select hims_d_earning_deduction_id from hims_d_earning_deduction where component_type='OV'",
                printQuery: true
              })
              .then(results => {
                _mysql.releaseConnection();
                let earnings = results[0];
                let deductions = results[1];
                let basic_id = results[2][0]["basic_earning_component"];
                let ovettime_earning_deduction_id =
                  results[3][0]["hims_d_earning_deduction_id"];

                let total_basic = 0;

                // utilities.logger().log("salary: ", salary.length);
                for (let i = 0; i < salary.length; i++) {
                  //ST-complete OVER-Time (ot,wot,hot all togather sum)  calculation
                  let ot_hours = 0;
                  let ot_min = 0;

                  ot_hours += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(parseInt(ot_min) / parseInt(60));

                  let complete_ot =
                    ot_hours + "." + (parseInt(ot_min) % parseInt(60));
                  //EN-complete OVER-Time  calculation

                  let extra_income = 0;
                  if (parseFloat(complete_ot) > 0) {
                    extra_income = new LINQ(earnings)
                      .Where(
                        w => w.earnings_id == ovettime_earning_deduction_id
                      )
                      .Select(s => parseFloat(s.amount))
                      .FirstOrDefault(0);
                  }

                  let employee_earning = new LINQ(earnings)
                    .Where(
                      w => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select(s => {
                      return {
                        hims_f_salary_earnings_id: s.hims_f_salary_earnings_id,
                        earnings_id: s.earnings_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id
                      };
                    })
                    .ToArray();

                  let employee_deduction = new LINQ(deductions)
                    .Where(
                      w => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select(s => {
                      return {
                        hims_f_salary_deductions_id:
                          s.hims_f_salary_deductions_id,
                        deductions_id: s.deductions_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id
                      };
                    })
                    .ToArray();

                  total_basic += new LINQ(employee_earning)
                    .Where(w => w.earnings_id == basic_id)
                    .Select(s => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  let basic_salary = new LINQ(employee_earning)
                    .Where(w => w.earnings_id == basic_id)
                    .Select(s => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  // utilities
                  //   .logger()
                  //   .log("nationality: ", salary[i].nationality);
                  let emp_id_type = "P";
                  if (default_nationality == salary[i].nationality) {
                    emp_id_type = "C";
                  }

                  // utilities
                  //   .logger()
                  //   .log("employee_earning: ", employee_earning);

                  let social_security_deductions = new LINQ(employee_deduction)
                    .Where(w => w.nationality_id == default_nationality)
                    .Select(s => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  outputArray.push({
                    ...salary[i],
                    employee_earning: employee_earning,
                    employee_deduction: employee_deduction,
                    basic_salary: basic_salary,
                    extra_income: extra_income,
                    complete_ot: complete_ot,
                    emp_id_type: emp_id_type,
                    salary_freq: "M",
                    social_security_deductions: social_security_deductions,
                    notes_comments: ""
                  });
                }

                req.records = {
                  employees: outputArray,
                  total_basic: total_basic,
                  total_earnings: total_earnings,
                  total_deductions: total_deductions,
                  total_contributions: total_contributions,
                  total_net_salary: total_net_salary
                };
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {};
            next();
          }
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
  },
  //created by:irfan,for report
  detailSalaryStatement: (req, res, next) => {
    if (req.query.month > 0 && req.query.year > 0) {
      const _mysql = new algaehMysql();

      let input = req.query;
      let outputArray = [];

      let is_local = "";

      if (input.is_local == "Y") {
        is_local = " and H.default_nationality=E.nationality ";
      } else if (input.is_local == "N") {
        is_local = " and H.default_nationality<>E.nationality ";
      }

      _mysql
        .executeQuery({
          query: `select hims_d_earning_deduction_id,earning_deduction_description,component_category, print_order_by, \
          nationality_id from hims_d_earning_deduction where record_status='A' and print_report='Y' order by print_order_by ;\
          select E.employee_code,E.full_name,E.employee_designation_id,S.employee_id,E.sub_department_id,E.date_of_joining,E.nationality,E.mode_of_payment,\
          E.hospital_id,E.employee_group_id,D.designation,EG.group_description,N.nationality,\
          S.hims_f_salary_id,S.salary_number,S.salary_date,S.present_days,S.net_salary,S.total_earnings,S.total_deductions,\
          S.total_contributions,S.ot_work_hours,S.ot_weekoff_hours,S.ot_holiday_hours,H.hospital_name,SD.sub_department_name
          from hims_d_employee E\
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
          inner join hims_d_hospital H  on E.hospital_id=H.hims_d_hospital_id  ${is_local}\
          inner join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
          inner join hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id\
          inner join hims_d_nationality N on E.nationality=N.hims_d_nationality_id\
          inner join  hims_f_salary S on E.hims_d_employee_id=S.employee_id\
          where E.hospital_id=? and E.record_status='A' and E.employee_group_id=? and S.month=? and S.year=? `,
          values: [
            input.hospital_id,
            input.employee_group_id,
            input.month,
            input.year
          ]
        })
        .then(result => {
          // _mysql.releaseConnection();
          // req.records = result;
          // next();

          let components = result[0];
          let salary = result[1];

          let total_earnings = 0;
          let total_deductions = 0;
          let total_contributions = 0;
          let total_net_salary = 0;

          if (salary.length > 0) {
            total_earnings = new LINQ(salary).Sum(s =>
              parseFloat(s.total_earnings)
            );
            total_deductions = new LINQ(salary).Sum(s =>
              parseFloat(s.total_deductions)
            );
            total_contributions = new LINQ(salary).Sum(s =>
              parseFloat(s.total_contributions)
            );
            total_net_salary = new LINQ(salary).Sum(s =>
              parseFloat(s.net_salary)
            );

            let salary_header_ids = new LINQ(salary)
              .Select(s => s.hims_f_salary_id)
              .ToArray();

            _mysql
              .executeQuery({
                query:
                  "select hims_f_salary_earnings_id,salary_header_id,earnings_id,amount,per_day_salary,ED.nationality_id from \
                hims_f_salary_earnings SE inner join hims_d_earning_deduction ED on \
                SE.earnings_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' where salary_header_id in (" +
                  salary_header_ids +
                  ");\
                select hims_f_salary_deductions_id,salary_header_id,deductions_id,amount,per_day_salary,ED.nationality_id from \
                hims_f_salary_deductions SD inner join hims_d_earning_deduction ED on \
                SD.deductions_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' \
                where salary_header_id in ( " +
                  salary_header_ids +
                  ");select basic_earning_component from hims_d_hrms_options;\
                  select employee_id,gratuity_amount from hims_f_gratuity_provision where year=? and month=?;\
                  select employee_id,leave_days,leave_salary,airfare_amount from hims_f_leave_salary_accrual_detail\
                  where year=? and month=?;\
                  select hims_f_salary_contributions_id,salary_header_id,contributions_id,amount,Ed.nationality_id from \
                  hims_f_salary_contributions SC inner join hims_d_earning_deduction ED on \
                  SC.contributions_id=ED.hims_d_earning_deduction_id  and ED.print_report='Y' \
                  where salary_header_id in ( " +
                  salary_header_ids +
                  ");",
                values: [input.year, input.month, input.year, input.month]
              })
              .then(results => {
                let earnings = results[0];
                let deductions = results[1];
                let basic_id = results[2][0]["basic_earning_component"];
                let gratuity = results[3];
                let accrual = results[4];
                let contributions = results[5];
                //   console.log("accrual:",accrual);

                let total_basic = 0;

                let sum_gratuity = 0;
                let sum_leave_salary = 0;
                let sum_airfare_amount = 0;

                for (let i = 0; i < salary.length; i++) {
                  //ST-complete OVER-Time (ot,wot,hot all togather sum)  calculation
                  let ot_hours = 0;
                  let ot_min = 0;

                  ot_hours += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_work_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_weekoff_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[0]
                  );
                  ot_min += parseInt(
                    salary[i]["ot_holiday_hours"].toString().split(".")[1]
                  );

                  ot_hours += parseInt(parseInt(ot_min) / parseInt(60));

                  let complete_ot =
                    ot_hours + "." + (parseInt(ot_min) % parseInt(60));
                  //EN-complete OVER-Time  calculation

                  let employee_earning = new LINQ(earnings)
                    .Where(
                      w => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select(s => {
                      return {
                        hims_f_salary_earnings_id: s.hims_f_salary_earnings_id,
                        earnings_id: s.earnings_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id
                      };
                    })
                    .ToArray();

                  let employee_deduction = new LINQ(deductions)
                    .Where(
                      w => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select(s => {
                      return {
                        hims_f_salary_deductions_id:
                          s.hims_f_salary_deductions_id,
                        deductions_id: s.deductions_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id
                      };
                    })
                    .ToArray();

                  let employee_contributions = new LINQ(contributions)
                    .Where(
                      w => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select(s => {
                      return {
                        hims_f_salary_contributions_id:
                          s.hims_f_salary_contributions_id,
                        contributions_id: s.contributions_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id
                      };
                    })
                    .ToArray();

                  total_basic += new LINQ(employee_earning)
                    .Where(w => w.earnings_id == basic_id)
                    .Select(s => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  sum_gratuity += new LINQ(gratuity)
                    .Where(w => w.employee_id == salary[i]["employee_id"])
                    .Select(s => parseFloat(s.gratuity_amount))
                    .FirstOrDefault(0);

                  sum_leave_salary += new LINQ(accrual)
                    .Where(w => w.employee_id == salary[i]["employee_id"])
                    .Select(s => parseFloat(s.leave_salary))
                    .FirstOrDefault(0);

                  sum_airfare_amount += new LINQ(accrual)
                    .Where(w => w.employee_id == salary[i]["employee_id"])
                    .Select(s => parseFloat(s.airfare_amount))
                    .FirstOrDefault(0);

                  let emp_gratuity = new LINQ(gratuity)
                    .Where(w => w.employee_id == salary[i]["employee_id"])
                    .Select(s => {
                      return {
                        gratuity_amount: s.gratuity_amount
                      };
                    })
                    .FirstOrDefault({ gratuity_amount: 0 });

                  let emp_accural = new LINQ(accrual)
                    .Where(w => w.employee_id == salary[i]["employee_id"])
                    .Select(s => {
                      return {
                        leave_days: s.leave_days,
                        leave_salary: s.leave_salary,
                        airfare_amount: s.airfare_amount
                      };
                    })
                    .FirstOrDefault({
                      leave_days: 0,
                      leave_salary: 0,
                      airfare_amount: 0
                    });

                  outputArray.push({
                    ...salary[i],
                    ...emp_gratuity,
                    ...emp_accural,
                    employee_earning: employee_earning,
                    employee_deduction: employee_deduction,
                    employee_contributions: employee_contributions,
                    complete_ot: complete_ot
                  });
                }

                _mysql.releaseConnection();
                req.records = {
                  components: components,
                  employees: outputArray,
                  total_basic: total_basic,
                  total_earnings: total_earnings,
                  total_deductions: total_deductions,
                  total_contributions: total_contributions,
                  total_net_salary: total_net_salary,
                  sum_gratuity: sum_gratuity,
                  sum_leave_salary: sum_leave_salary,
                  sum_airfare_amount: sum_airfare_amount
                };
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = salary;
            next();
          }
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
  },

  getEmployeeMiscellaneous: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = req.query;

      _mysql
        .executeQuery({
          query:
            "select MED.*, ED.earning_deduction_description, S.salary_processed from  hims_f_miscellaneous_earning_deduction MED \
            inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = MED.earning_deductions_id \
            left join hims_f_salary S on S.employee_id = MED.employee_id and S.`year`=? and S.`month`=? \
            where MED.employee_id=?",
          values: [inputParam.year, inputParam.month, inputParam.employee_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },
  deleteMiscEarningsDeductions: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = req.body;

      _mysql
        .executeQuery({
          query:
            "delete from hims_f_miscellaneous_earning_deduction where hims_f_miscellaneous_earning_deduction_id = ?;",
          values: [inputParam.hims_f_miscellaneous_earning_deduction_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  }
};

function InsertEmployeeLeaveSalary(options) {
  return new Promise((resolve, reject) => {
    try {
      let leave_salary_accrual_detail = options.leave_salary_accrual_detail;
      let _mysql = options._mysql;
      let strQry = "";
      let annual_leave_data = options.annual_leave_data;
      let decimal_places = options.decimal_places;
      const utilities = new algaehUtilities();

      let promiseAll = []
      for (let i = 0; i < leave_salary_accrual_detail.length; i++) {
        promiseAll.push(
          new Promise((resolve, reject) => {
            _mysql
              .executeQuery({
                query:
                  "select hims_f_employee_leave_salary_header_id,employee_id,leave_days,leave_salary_amount, \
                airticket_amount, balance_leave_days, balance_leave_salary_amount, balance_airticket_amount, \
                airfare_months,utilized_leave_days,  utilized_leave_salary_amount, utilized_airticket_amount \
                from hims_f_employee_leave_salary_header where employee_id = ?;\
                select hims_f_employee_monthly_leave_id, close_balance, accumulated_leaves, projected_applied_leaves \
                from hims_f_employee_monthly_leave where year = ? and employee_id = ? and leave_id=?;",
                values: [
                  leave_salary_accrual_detail[i].employee_id,
                  leave_salary_accrual_detail[i].year,
                  leave_salary_accrual_detail[i].employee_id,
                  annual_leave_data[0].hims_d_leave_id
                ],
                printQuery: true
              })
              .then(employee_leave_salary => {
                let employee_leave_salary_header = employee_leave_salary[0];
                let monthly_leave = employee_leave_salary[1][0];

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

                  let monthly_close_balance = parseFloat(
                    monthly_leave.close_balance
                  );

                  let projected_applied_leaves = parseFloat(
                    monthly_leave.projected_applied_leaves
                  );
                  let accumulated_leaves = parseFloat(
                    monthly_leave.accumulated_leaves
                  );
                  let monthly_accruval_leave = parseFloat(
                    leave_salary_accrual_detail[i].leave_days
                  );
                  if (projected_applied_leaves > 0) {
                    if (projected_applied_leaves > monthly_accruval_leave) {
                      projected_applied_leaves =
                        projected_applied_leaves - monthly_accruval_leave;
                      accumulated_leaves =
                        accumulated_leaves + monthly_accruval_leave;
                    } else {
                      projected_applied_leaves =
                        monthly_accruval_leave - projected_applied_leaves;
                      monthly_close_balance =
                        monthly_close_balance + projected_applied_leaves;
                      accumulated_leaves =
                        accumulated_leaves +
                        monthly_accruval_leave -
                        projected_applied_leaves;
                    }
                  } else {
                    monthly_close_balance =
                      monthly_close_balance + monthly_accruval_leave;
                  }
                  leave_salary_amount = utilities.decimalPoints(
                    leave_salary_amount,
                    decimal_places
                  );
                  airticket_amount = utilities.decimalPoints(
                    airticket_amount,
                    decimal_places
                  );
                  balance_leave_salary_amount = utilities.decimalPoints(
                    balance_leave_salary_amount,
                    decimal_places
                  );
                  balance_airticket_amount = utilities.decimalPoints(
                    balance_airticket_amount,
                    decimal_places
                  );

                  strQry += mysql.format(
                    "UPDATE `hims_f_employee_leave_salary_header` SET leave_days=?,`leave_salary_amount`=?,\
                  `airticket_amount`=?,`balance_leave_days`=?,`balance_leave_salary_amount`=?,\
                  `balance_airticket_amount`=?,`airfare_months`=? where  hims_f_employee_leave_salary_header_id=?;\
                  UPDATE hims_f_employee_monthly_leave set close_balance=?, projected_applied_leaves=?, accumulated_leaves=? \
                  where hims_f_employee_monthly_leave_id=?;\
                  INSERT INTO `hims_f_employee_leave_salary_detail`(employee_leave_salary_header_id,leave_days,\
                    leave_salary_amount,airticket_amount, year, month) VALUE(?,?,?,?,?,?);",
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
                      monthly_close_balance,
                      projected_applied_leaves,
                      accumulated_leaves,
                      monthly_leave.hims_f_employee_monthly_leave_id,
                      employee_leave_salary_header[0]
                        .hims_f_employee_leave_salary_header_id,
                      leave_salary_accrual_detail[i].leave_days,
                      leave_salary_accrual_detail[i].leave_salary,
                      leave_salary_accrual_detail[i].airfare_amount,
                      leave_salary_accrual_detail[i].year,
                      leave_salary_accrual_detail[i].month
                    ]
                  );

                  _mysql
                    .executeQuery({ query: strQry, printQuery: true })
                    .then(update_employee_leave => {
                      resolve();
                    })
                    .catch(e => {
                      reject(e);
                    });
                } else {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO `hims_f_employee_leave_salary_header`  (`year`,`employee_id`,`leave_days`,\
                      `leave_salary_amount`,`airticket_amount`,`balance_leave_days`,`balance_leave_salary_amount`,\
                      `balance_airticket_amount`,`airfare_months`,`utilized_leave_days`, `utilized_leave_salary_amount`, `utilized_airticket_amount`)\
                       VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        leave_salary_accrual_detail[i].year,
                        leave_salary_accrual_detail[i].employee_id,
                        leave_salary_accrual_detail[i].leave_days,
                        leave_salary_accrual_detail[i].leave_salary,
                        leave_salary_accrual_detail[i].airfare_amount,
                        leave_salary_accrual_detail[i].leave_days,
                        leave_salary_accrual_detail[i].leave_salary,
                        leave_salary_accrual_detail[i].airfare_amount,
                        "1",
                        "0",
                        "0",
                        "0"
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
                          extraValues: {
                            year: leave_salary_accrual_detail.year,
                            month: leave_salary_accrual_detail.month
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: true
                        })
                        .then(leave_detail => {
                          let monthly_close_balance = parseFloat(
                            monthly_leave.close_balance
                          );

                          let projected_applied_leaves = parseFloat(
                            monthly_leave.projected_applied_leaves
                          );
                          let accumulated_leaves = parseFloat(
                            monthly_leave.accumulated_leaves
                          );
                          let monthly_accruval_leave = parseFloat(
                            leave_salary_accrual_detail[i].leave_days
                          );
                          if (projected_applied_leaves > 0) {
                            if (projected_applied_leaves > monthly_accruval_leave) {
                              projected_applied_leaves =
                                projected_applied_leaves - monthly_accruval_leave;
                              accumulated_leaves =
                                accumulated_leaves + monthly_accruval_leave;
                            } else {
                              projected_applied_leaves =
                                monthly_accruval_leave - projected_applied_leaves;
                              monthly_close_balance =
                                monthly_close_balance + projected_applied_leaves;
                              accumulated_leaves =
                                accumulated_leaves +
                                monthly_accruval_leave -
                                projected_applied_leaves;
                            }
                          } else {
                            monthly_close_balance =
                              monthly_close_balance + monthly_accruval_leave;
                          }
                          _mysql
                            .executeQuery({
                              query:
                                "UPDATE hims_f_employee_monthly_leave set close_balance=?,  projected_applied_leaves=?, \
                            accumulated_leaves=? where hims_f_employee_monthly_leave_id=?;",
                              values: [
                                monthly_close_balance,
                                projected_applied_leaves,
                                accumulated_leaves,
                                monthly_leave.hims_f_employee_monthly_leave_id
                              ],

                              printQuery: true
                            })
                            .then(monthly_leave => {
                              resolve();
                            })
                            .catch(error => {
                              reject(error);
                            });
                        })
                        .catch(error => {
                          reject(error);
                        });
                    })
                    .catch(e => {
                      reject(e);
                    });
                }
              })
              .catch(e => {
                reject(e);
              });
          })
        );
      }
      Promise.all(promiseAll)
        .then(() => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });

    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function getOtManagement(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      // utilities.logger().log("getOtManagement: ");
      const _earnings = options.earnings;
      const empResult = options.empResult;

      const hrms_option = options.hrms_option;
      const over_time_comp = options.over_time_comp;
      const over_time = options.over_time[0];
      const current_earning_amt_array = options.current_earning_amt_array;
      const leave_salary = options.leave_salary;

      let final_earning_amount = 0;
      let current_ot_amt_array = [];

      console.log("over_time: ", options.over_time.length);
      console.log("ot_work_hours: ", empResult["ot_work_hours"]);
      console.log("ot_weekoff_hours: ", empResult["ot_weekoff_hours"]);
      console.log("ot_holiday_hours: ", empResult["ot_holiday_hours"]);
      if (options.over_time.length > 0) {
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
            return parseFloat(s.amount);
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

              let earn_amount = _.chain(_earnings)
                .filter(f => {
                  if (f.earnings_id == obj.earnings_id) {
                    return parseFloat(f.amount);
                  }
                })
                .value();

              let _per_day_salary = 0;
              let per_hour_salary = 0;

              console.log(
                "hrms_option[0].ot_calculation",
                hrms_option[0].ot_calculation
              );
              if (hrms_option[0].ot_calculation == "F") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount[0].amount) /
                  parseFloat(hrms_option[0].salary_calendar_fixed_days)
                );
              } else if (hrms_option[0].ot_calculation == "P") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount[0].amount) /
                  parseFloat(empResult["total_days"])
                );
              } else if (hrms_option[0].ot_calculation == "A") {
                _per_day_salary =
                  (parseFloat(earn_amount[0].amount) * 12) / 365;
              }

              per_hour_salary = _per_day_salary / Noof_Working_Hours;

              // let ot_work_hours = empResult["ot_work_hours"].split(".");

              let ot_hour_price =
                per_hour_salary * over_time["working_day_hour"];
              ot_hour_price = ot_hour_price * empResult["ot_work_hours"];

              let ot_weekoff_price =
                per_hour_salary * over_time["weekoff_day_hour"];
              ot_weekoff_price =
                ot_weekoff_price * empResult["ot_weekoff_hours"];

              let ot_holiday_price =
                per_hour_salary * over_time["holiday_hour"];
              ot_holiday_price =
                ot_holiday_price * empResult["ot_holiday_hours"];

              let final_price =
                ot_hour_price + ot_weekoff_price + ot_holiday_price;

              if (final_price > 0) {
                current_ot_amt_array.push({
                  earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
                  amount: final_price
                });
              }
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
    options.next(e);
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

      // utilities.logger().log("getShortAge: ", shortage_comp);

      if (empResult.shortage_hours != null && shortage_comp.length > 0) {
        let Noof_Working_Hours =
          parseFloat(hrms_option[0].standard_working_hours) -
          parseFloat(hrms_option[0].standard_break_hours);

        // utilities.logger().log("Noof_Working_Hours: ", Noof_Working_Hours);

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

            // utilities.logger().log("earn_amount: ", earn_amount);

            let _per_day_salary = parseFloat(
              parseFloat(earn_amount[0].amount) /
              parseFloat(empResult["total_days"])
            );

            let per_hour_salary = _per_day_salary / Noof_Working_Hours;

            // utilities.logger().log("per_hour_salary: ", per_hour_salary);

            per_hour_salary = per_hour_salary * empResult.shortage_hours;

            // utilities.logger().log("per_hour_salary: ", per_hour_salary);

            if (per_hour_salary > 0) {
              current_shortage_amt_array.push({
                deductions_id: shortage_comp[0].hims_d_earning_deduction_id,
                amount: per_hour_salary
              });
            }
          }
        });

        final_deduction_amount = _.sumBy(current_shortage_amt_array, s => {
          return parseFloat(s.amount);
        });

        resolve({ current_shortage_amt_array, final_deduction_amount });
      } else {
        resolve({ current_shortage_amt_array, final_deduction_amount });
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function getEarningComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();
      // utilities.logger().log("getEarningComponents: ");

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

      let accrual_amount = 0;
      let decimal_places = options.decimal_places;

      let total_days = empResult["total_days"];

      if (_earnings.length == 0) {
        resolve({ current_earning_amt_array, final_earning_amount });
      }

      _earnings.map(obj => {
        if (obj.calculation_type == "F") {
          if (leave_salary == null || leave_salary == undefined) {

            // ED.limit_applicable, ED.limit_amount
            current_earning_amt = obj["amount"];
            if (obj["limit_applicable"] === "Y" && parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])) {
              current_earning_amt = obj["limit_amount"];
            }

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

            if (obj["limit_applicable"] === "Y" && parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])) {
              current_earning_amt = obj["limit_amount"];
            }
          } else if (leave_salary == "Y") {
            current_earning_amt = 0;
            current_earning_per_day_salary = 0;
          }

          current_earning_amt = utilities.decimalPoints(
            current_earning_amt,
            decimal_places
          );

          current_earning_amt_array.push({
            earnings_id: obj.earnings_id,
            amount: current_earning_amt,
            per_day_salary: current_earning_per_day_salary
          });
        } else if (obj["calculation_type"] == "V") {
          let leave_period =
            empResult["total_applied_days"] === null
              ? 0
              : parseFloat(empResult["total_applied_days"]);


          let annual_per_day_sal = 0;

          if (leave_salary == null || leave_salary == undefined) {

            if (hrms_option[0].salary_calendar == "F") {
              current_earning_per_day_salary = parseFloat(
                obj["amount"] /
                parseFloat(hrms_option[0].salary_calendar_fixed_days)
              );

              // utilities
              //   .logger()
              //   .log(
              //     "current_earning_per_day_salary: ",
              //     current_earning_per_day_salary
              //   );

              // utilities
              //   .logger()
              //   .log("unpaid_leave: ", empResult["unpaid_leave"]);
              // utilities.logger().log("absent_days: ", empResult["absent_days"]);

              if (
                empResult["from_normal_salary"] === "Y" &&
                obj.annual_salary_comp === "Y"
              ) {
                annual_per_day_sal =
                  current_earning_per_day_salary * leave_period;
              }
              let days =
                parseFloat(empResult["unpaid_leave"]) +
                parseFloat(empResult["absent_days"]) +
                leave_period;
              // utilities.logger().log("days: ", days);

              let amount = current_earning_per_day_salary * days;
              // utilities.logger().log("amount: ", amount);
              current_earning_amt = obj["amount"] - amount;
              current_earning_amt = current_earning_amt + annual_per_day_sal;
            } else {
              let total_paid_days =
                parseFloat(empResult["total_paid_days"]) - leave_period;
              current_earning_per_day_salary = parseFloat(
                obj["amount"] / empResult["total_days"]
              );
              if (
                empResult["from_normal_salary"] === "Y" &&
                obj.annual_salary_comp === "Y"
              ) {
                annual_per_day_sal =
                  current_earning_per_day_salary * leave_period;
              }
              current_earning_amt =
                current_earning_per_day_salary * total_paid_days;

              current_earning_amt = current_earning_amt + annual_per_day_sal;

            }
            if (obj["limit_applicable"] === "Y" && parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])) {
              current_earning_amt = obj["limit_amount"];
            }
          } else if (leave_salary == "N") {
            leave_salary_days =
              parseFloat(empResult["total_days"]) -
              parseFloat(empResult["paid_leave"]);

            // if (
            //   empResult["from_normal_salary"] === "Y" &&
            //   obj.annual_salary_comp === "Y"
            // ) {
            //   annual_per_day_sal =
            //     current_earning_per_day_salary * leave_period;
            // }

            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
            current_earning_amt =
              current_earning_per_day_salary * leave_salary_days;

            if (obj["limit_applicable"] === "Y" && parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])) {
              current_earning_amt = obj["limit_amount"];
            }
          } else if (leave_salary == "Y") {
            current_earning_per_day_salary = 0;
            current_earning_amt = 0;
          }

          current_earning_amt = utilities.decimalPoints(
            current_earning_amt,
            decimal_places
          );
          // utilities.logger().log("current_earning_amt: ", current_earning_amt);
          //Apply Leave Rule
          accrual_amount = accrual_amount + annual_per_day_sal;
          if (leave_salary != "Y") {
            // utilities.logger().log("total_days: ", total_days);
            let perday_salary = current_earning_amt / total_days;
            // utilities.logger().log("perday_salary: ", perday_salary);

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
                if (_LeaveRule[i].calculation_type == "SL") {
                  if (_LeaveRule[i].value_type == "RA") {
                    let leave_rule_days = _LeaveRule[i].total_days;

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

                      // utilities.logger().log("x: ", x);
                      if (leave_rule_days > 0) {
                        balance_days = leave_rule_days;
                      } else {
                        // utilities.logger().log("else: ", x);
                        balance_days = x;
                      }
                      leaves_till_date = x;

                      if (leaves_till_date > current_leave) {
                        // utilities.logger().log("if: ");
                        balance_days = 0;
                      } else {
                        // utilities.logger().log("else: ", y);
                        if (y > current_leave) {
                          y = y - current_leave;
                          balance_days = balance_days - y;
                          // utilities
                          //   .logger()
                          //   .log("balance_days: ", balance_days);
                        }
                      }
                    }

                    // utilities
                    //   .logger()
                    //   .log("leaves_till_date: ", leaves_till_date);

                    if (balance_days > 0) {
                      // utilities
                      //   .logger()
                      //   .log("current_earning_amt: ", current_earning_amt);
                      let split_sal = 0;

                      // utilities.logger().log("paytype: ", paytype);
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

                    current_earning_amt = utilities.decimalPoints(
                      current_earning_amt,
                      decimal_places
                    );
                    // utilities
                    //   .logger()
                    //   .log("current_earning_amt: ", current_earning_amt);
                  }
                }
              }
              if (obj["limit_applicable"] === "Y" && parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])) {
                current_earning_amt = obj["limit_amount"];
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

      final_earning_amount = utilities.decimalPoints(
        final_earning_amount,
        decimal_places
      );

      resolve({
        current_earning_amt_array,
        final_earning_amount,
        accrual_amount
      });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function getDeductionComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();
      const _deduction = options.deduction;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;
      const hrms_option = options.hrms_option;
      const decimal_places = options.decimal_places;

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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_deduction_amt) > parseFloat(obj["limit_amount"])) {
              current_deduction_amt = obj["limit_amount"];
            }
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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_deduction_amt) > parseFloat(obj["limit_amount"])) {
              current_deduction_amt = obj["limit_amount"];
            }
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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_deduction_amt) > parseFloat(obj["limit_amount"])) {
              current_deduction_amt = obj["limit_amount"];
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

            if (obj["limit_applicable"] === "Y" && parseFloat(current_deduction_amt) > parseFloat(obj["limit_amount"])) {
              current_deduction_amt = obj["limit_amount"];
            }
          } else if (leave_salary == "Y") {
            current_deduction_per_day_salary = 0;
            current_deduction_amt = 0;
          }
        }

        current_deduction_amt = utilities.decimalPoints(
          current_deduction_amt,
          decimal_places
        );

        current_deduction_amt_array.push({
          deductions_id: obj.deductions_id,
          amount: current_deduction_amt,
          per_day_salary: current_deduction_per_day_salary
        });
      });

      final_deduction_amount = _.sumBy(current_deduction_amt_array, s => {
        return parseFloat(s.amount);
      });

      final_deduction_amount = utilities.decimalPoints(
        final_deduction_amount,
        decimal_places
      );

      resolve({ current_deduction_amt_array, final_deduction_amount });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function getContrubutionsComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();
      const _contrubutions = options.contribution;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;
      const hrms_option = options.hrms_option;
      const decimal_places = options.decimal_places;

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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_contribution_amt) > parseFloat(obj["limit_amount"])) {
              current_contribution_amt = obj["limit_amount"];
            }
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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_contribution_amt) > parseFloat(obj["limit_amount"])) {
              current_contribution_amt = obj["limit_amount"];
            }
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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_contribution_amt) > parseFloat(obj["limit_amount"])) {
              current_contribution_amt = obj["limit_amount"];
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
            if (obj["limit_applicable"] === "Y" && parseFloat(current_contribution_amt) > parseFloat(obj["limit_amount"])) {
              current_contribution_amt = obj["limit_amount"];
            }
          } else if (leave_salary == "Y") {
            current_contribution_per_day_salary = 0;
            current_contribution_amt = 0;
          }
        }

        current_contribution_amt = utilities.decimalPoints(
          current_contribution_amt,
          decimal_places
        );
        current_contribution_amt_array.push({
          contributions_id: obj.contributions_id,
          amount: current_contribution_amt
          // per_day_salary: current_contribution_per_day_salary
        });
      });

      final_contribution_amount = utilities.decimalPoints(
        final_contribution_amount,
        decimal_places
      );

      final_contribution_amount = _.sumBy(current_contribution_amt_array, s => {
        return parseFloat(s.amount);
      });

      resolve({ current_contribution_amt_array, final_contribution_amount });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
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

      console.log("_loan", _loan);
      if (_loan.length == 0) {
        if (_loanPayable.length == 0) {
          resolve({
            total_loan_due_amount,
            total_loan_payable_amount,
            current_loan_array
          });
        } else {
          total_loan_payable_amount = _.sumBy(_loanPayable, s => {
            return parseFloat(s.approved_amount);
          });

          console.log("total_loan_payable_amount", total_loan_payable_amount);

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

      console.log("current_loan_array", current_loan_array);
      total_loan_due_amount = _.sumBy(current_loan_array, s => {
        return parseFloat(s.loan_due_amount);
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
    options.next(e);
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
    options.next(e);
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
    options.next(e);
  });
}

function UpdateProjectWisePayroll(options) {
  return new Promise((resolve, reject) => {
    try {
      let project_wise_payroll = options.project_wise_payroll;
      let _mysql = options._mysql;
      let net_salary = options.net_salary;

      const decimal_places = options.decimal_places
      let strQry = "";

      const utilities = new algaehUtilities();

      // utilities.logger().log("UpdateProjectWisePayroll: ");

      let finalData = {};
      _.chain(project_wise_payroll)
        .groupBy(g => g.employee_id)
        .map(item => {
          finalData[
            _.get(_.find(item, "employee_id"), "employee_id")
          ] = _.sumBy(item, s => {
            return s.complete_hours;
          });
        })
        .value();

      for (let z = 0; z < project_wise_payroll.length; z++) {
        let cost = 0;
        let complete_hours = parseInt(project_wise_payroll[z]["worked_hours"]);
        let total_complete_hours =
          finalData[project_wise_payroll[z]["employee_id"]];
        let worked_minutes = project_wise_payroll[z]["worked_minutes"];
        complete_hours += parseInt(worked_minutes / 60);
        let mins = String("0" + parseInt(worked_minutes % 60)).slice(-2);
        complete_hours = complete_hours + "." + mins;

        let net_salary_amt = _.filter(net_salary, f => {
          return f.employee_id == project_wise_payroll[z]["employee_id"];
        });

        console.log("total_complete_hours: ", total_complete_hours);
        console.log("complete_hours: ", complete_hours);

        if (parseFloat(total_complete_hours) > 0) {
          cost =
            parseFloat(net_salary_amt[0].net_salary) /
            parseFloat(total_complete_hours);
        } else {
          cost = 0
        }
        cost = cost * complete_hours;

        cost = utilities.decimalPoints(
          cost,
          decimal_places
        );

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
        .then(project_payroll => {
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}

function InsertGratuityProvision(options) {
  return new Promise((resolve, reject) => {
    try {
      let _mysql = options._mysql;
      const inputParam = options.inputParam;
      const decimal_places = options.decimal_places;

      const utilities = new algaehUtilities();

      // console.log("_mysql: ", _mysql);
      // utilities.logger().log("InsertGratuityProvision: ");

      _mysql
        .executeQuery({
          query:
            "select E.date_of_joining,E.hims_d_employee_id,E.date_of_resignation,E.employee_status, E.employe_exit_type, \
            datediff(date(?),date(date_of_joining))/365 endOfServiceYears,E.employee_code,E.exit_date,\
            E.full_name,E.arabic_name,E.sex,E.employee_type ,E.title_id,T.title ,T.arabic_title,\
            E.sub_department_id,E.employee_designation_id,E.date_of_birth,\
            SD.sub_department_name,SD.arabic_sub_department_name \
            from hims_d_employee E Left join hims_d_sub_department SD \
            on SD.hims_d_sub_department_id = E.sub_department_id \
            left join hims_d_title T on T.his_d_title_id = E.title_id \
            where hims_d_employee_id in(?);select * from hims_d_end_of_service_options;",
          values: [inputParam.salary_end_date, inputParam.employee_id],
          printQuery: true
        })
        .then(result => {
          console.log("Gratuity Provision result: ", result);
          // utilities.logger().log("Gratuity Provision result: ", result);
          const _employee = result[0];
          const _options = result[1];

          // utilities.logger().log("_employee: ", _employee);

          if (_employee.length == 0) {
            resolve();
            return;
          }

          // utilities.logger().log("_options: ", _options);

          if (_options.length == 0) {
            resolve();
            return;
          }
          const _optionsDetals = _options[0];
          if (_optionsDetals.gratuity_provision == 1) {
            // utilities.logger().log("gratuity_provision: ");

            let _eligibleDays = 0;

            let strQry = "";
            for (let k = 0; k < _employee.length; k++) {
              new Promise((resolve, reject) => {
                try {
                  // utilities.logger().log("_employee: ", _employee[k]);
                  if (_optionsDetals.end_of_service_type == "S") {
                    if (
                      _employee[k].endOfServiceYears >= 0 &&
                      _employee[k].endOfServiceYears <=
                      _optionsDetals.from_service_range1
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days1;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range1 &&
                      _employee[k].endOfServiceYears <=
                      _optionsDetals.from_service_range2
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days2;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range2 &&
                      _employee[k].endOfServiceYears <=
                      _optionsDetals.from_service_range3
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days3;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range3 &&
                      _employee[k].endOfServiceYears <=
                      _optionsDetals.from_service_range4
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days4;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range4 &&
                      _employee[k].endOfServiceYears <=
                      _optionsDetals.from_service_range5
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days5;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range5
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days5;
                    }
                  } else if (_optionsDetals.end_of_service_type == "H") {
                    let by =
                      _employee[k].endOfServiceYears -
                      _optionsDetals.from_service_range1;
                    let ted = 0;
                    if (by > 0) {
                      ted =
                        _optionsDetals.from_service_range1 *
                        _optionsDetals.eligible_days1;
                      by =
                        _employee[k].endOfServiceYears -
                        _optionsDetals.from_service_range2;
                      if (by > 0) {
                        ted =
                          (ted +
                            (_optionsDetals.from_service_range2 -
                              _optionsDetals.from_service_range1)) *
                          by;
                        by =
                          _employee[k].endOfServiceYears -
                          _optionsDetals.from_service_range3;
                        if (by > 0) {
                          ted =
                            (ted +
                              (_optionsDetals.from_service_range3 -
                                _optionsDetals.from_service_range2)) *
                            by;
                          by =
                            _employee[k].endOfServiceYears -
                            _optionsDetals.from_service_range3;
                          if (by > 0) {
                            ted =
                              (ted +
                                (_optionsDetals.from_service_range4 -
                                  _optionsDetals.from_service_range3)) *
                              by;
                            by =
                              _employee[k].endOfServiceYears -
                              _optionsDetals.from_service_range4;
                            if (by > 0) {
                              ted =
                                (ted +
                                  (_optionsDetals.from_service_range5 -
                                    _optionsDetals.from_service_range4)) *
                                by;
                            } else {
                              _eligibleDays =
                                ted + by * _optionsDetals.eligible_days4;
                            }
                          } else {
                            _eligibleDays =
                              ted + by * _optionsDetals.eligible_days3;
                          }
                        }
                      } else {
                        _eligibleDays =
                          ted + by * _optionsDetals.eligible_days2;
                      }
                    } else {
                      ted =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days1;
                    }
                    ted = _eligibleDays;
                  }

                  let _componentsList_total = [];
                  if (_optionsDetals.end_of_service_component1 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component1
                    );
                  }
                  if (_optionsDetals.end_of_service_component2 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component2
                    );
                  }
                  if (_optionsDetals.end_of_service_component3 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component3
                    );
                  }
                  if (_optionsDetals.end_of_service_component4 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component4
                    );
                  }

                  _mysql
                    .executeQuery({
                      query:
                        "select hims_d_employee_earnings_id,employee_id, earnings_id,earning_deduction_description,\
                  EE.short_desc, amount from hims_d_employee_earnings EE, hims_d_earning_deduction ED where \
                  ED.hims_d_earning_deduction_id = EE.earnings_id \
                  and EE.employee_id=? and ED.hims_d_earning_deduction_id in(?) and ED.record_status='A'",
                      values: [
                        _employee[k].hims_d_employee_id,
                        _componentsList_total
                      ],
                      printQuery: true
                    })
                    .then(earnings => {
                      // _mysql.releaseConnection();
                      let _computatedAmout = [];
                      if (_optionsDetals.end_of_service_calculation == "AN") {
                        _computatedAmout = _.chain(earnings).map(items => {
                          return (items.amount * 12) / 365;
                        });
                      } else if (
                        _optionsDetals.end_of_service_calculation == "FI"
                      ) {
                        _computatedAmout = _.chain(earnings).map(items => {
                          return (
                            items.amount / _optionsDetals.end_of_service_days
                          );
                        });
                      }
                      // const _sumOfTotalEarningComponents = _.sumBy(earnings, s => {
                      //   return s.amount;
                      // });
                      let _computatedAmoutSum =
                        _computatedAmout.reduce((a, b) => {
                          return a + b;
                        }, 0) * _eligibleDays;

                      _computatedAmoutSum = utilities.decimalPoints(
                        _computatedAmoutSum,
                        decimal_places
                      );

                      strQry += mysql.format(
                        "INSERT INTO `hims_f_gratuity_provision`(`employee_id`,`year`,\
                      `month`,`gratuity_amount`) VALUE(?,?,?,?);",
                        [
                          _employee[k].hims_d_employee_id,
                          inputParam.year,
                          inputParam.month,
                          _computatedAmoutSum
                        ]
                      );

                      if (k == _employee.length - 1) {
                        resolve();
                        // utilities.logger().log("strQry: ", strQry);
                      }
                    })
                    .catch(e => {
                      reject(e);
                    });
                } catch (e) {
                  reject(e);
                }
              })
                .then(result => {
                  // utilities.logger().log("strQry: ", strQry);

                  _mysql
                    .executeQuery({
                      query: strQry,
                      printQuery: true
                    })
                    .then(result => {
                      // utilities.logger().log("reslove: ");
                      resolve();
                    })
                    .catch(e => {
                      // utilities.logger().log("Error: ");
                      reject(e);
                    });
                })
                .catch(e => {
                  reject(e);
                });
            }
          } else {
            resolve();
          }
        })
        .catch(e => {
          // utilities.logger().log("Gratuity Provision Error: ");
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}
function UpdateLeaveSalaryProvission(options) {
  return new Promise((resolve, reject) => {
    try {
      let inputParam = options.inputParam;
      let _mysql = options._mysql;

      // let total_hours_project = options.total_hours_project;
      let strQry = "";

      const utilities = new algaehUtilities();

      // utilities.logger().log("UpdateLeaveSalaryProvission: ");

      for (let i = 0; i < inputParam._leave_salary_acc.length; i++) {
        _mysql
          .executeQuery({
            query:
              "select * from `hims_f_employee_leave_salary_header` where employee_id=?",
            values: [inputParam._leave_salary_acc[i].employee_id],
            printQuery: true
          })
          .then(leave_salary_header => {
            // utilities
            //   .logger()
            //   .log("leave_salary_header: ", leave_salary_header);

            let balance_leave_days =
              parseFloat(leave_salary_header[0].balance_leave_days) -
              parseFloat(inputParam._leave_salary_acc[i].leave_salary_days);
            let balance_leave_salary_amount =
              parseFloat(leave_salary_header[0].balance_leave_salary_amount) -
              parseFloat(
                inputParam._leave_salary_acc[i].leave_salary_accrual_amount
              );

            // utilities.logger().log("balance_leave_days: ", balance_leave_days);
            // utilities
            //   .logger()
            //   .log(
            //     "balance_leave_salary_amount: ",
            //     balance_leave_salary_amount
            //   );

            strQry += _mysql.mysqlQueryFormat(
              "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
              `balance_leave_salary_amount` = ? where hims_f_employee_leave_salary_header_id=?;",
              [
                balance_leave_days,
                balance_leave_salary_amount,
                leave_salary_header[0].hims_f_employee_leave_salary_header_id
              ]
            );

            if (i === inputParam._leave_salary_acc.length - 1) {
              // utilities.logger().log("strQry: ", strQry);
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
            }
          })
          .catch(e => {
            reject(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}
