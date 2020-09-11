import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import { LINQ } from "node-linq";
import mysql from "mysql";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
  newProcessSalary: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;

    const _mysql = new algaehMysql(_options);
    return new Promise((resolve, reject) => {
      try {
        const input = req.query;
        const month_number = parseInt(input.month);
        const year = input.year;

        const month_start = moment(year + "-" + month_number, "YYYY-M")
          .startOf("month")
          .format("YYYY-MM-DD");

        const month_end = moment(year + "-" + month_number, "YYYY-M")
          .endOf("month")
          .format("YYYY-MM-DD");

        let inputValues = [input.year, input.month];
        let _stringData = "";

        let strQuery = "";

        // console.log("input.leave_salary", input.leave_salary)
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

          if (input.group_id != null) {
            _stringData += " and E.employee_group_id=?";
            inputValues.push(input.group_id);
          }
          strQuery =
            "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, \
            A.sub_department_id, A.total_days,A.present_days, A.absent_days, A.total_work_days, \
            A.display_present_days,A.total_weekoff_days, A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, \
            A.total_paid_days,A.pending_unpaid_leave, A.total_hours, A.total_working_hours, A.ot_work_hours, \
            A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours, E.employee_code, E.gross_salary, \
            S.hims_f_salary_id,S.salary_processed, AL.from_normal_salary, LA.total_applied_days ,\
            case  when E.exit_date  between date('" +
            month_start +
            "') and date('" +
            month_end +
            "') then 'Y' else 'N' end as partial_attendance \
            from hims_f_attendance_monthly as A \
            inner join  hims_d_employee as E on  E.hims_d_employee_id = A.employee_id and \
            A.hospital_id = E.hospital_id and E.suspend_salary ='N' \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month` and (S.salary_type='NS' OR S.salary_type='FS')\
            and S.employee_id = A.employee_id \
            left join hims_f_employee_annual_leave AL on E.hims_d_employee_id=AL.employee_id \
            and  AL.year=? and AL.month=? and AL.cancelled='N' \
            left join hims_f_leave_application LA on LA.hims_f_leave_application_id=AL.leave_application_id \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id  where \
            A.`year`=? and A.`month`=? and A.hospital_id=?" +
            _stringData +
            " and (hims_f_employee_annual_leave_id is null OR from_normal_salary='Y' or date(E.last_salary_process_date ) <= date('" +
            month_end +
            "')) and (S.salary_processed is null or  S.salary_processed='N');";
        } else {
          inputValues.push(input.hospital_id);

          if (input.leave_salary === "Y") {
            if (input.employee_id != null) {
              _stringData += " and E.hims_d_employee_id=?";
              inputValues.push(input.employee_id);
            }
            strQuery =
              "select E.hims_d_employee_id as employee_id, E.employee_code, E.gross_salary, 0 as total_days,0 as absent_days, \
              0 as unpaid_leave, S.hims_f_salary_id, 0 as pending_unpaid_leave from hims_d_employee E left join hims_f_salary as S on  \
              E.hims_d_employee_id = S.employee_id and E.suspend_salary ='N' and S.`year`=? and S.`month` = ? \
              where record_status='A'  and E.hospital_id=?" +
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
            A.total_paid_days,A.pending_unpaid_leave,A.total_hours, A.total_working_hours,A.ot_work_hours, \
            A.ot_weekoff_hours,A.ot_holiday_hours, A.shortage_hours,\
            E.employee_code,E.gross_salary, S.hims_f_salary_id,S.salary_processed \
            from hims_f_attendance_monthly as A inner join  hims_d_employee as E \
            on  E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id \
            left join hims_f_salary as S on  S.`year`=A.`year` and S.`month` = A.`month` and S.salary_type='LS' \
            and S.employee_id = A.employee_id   where A.`year`=? and A.`month`=? and A.hospital_id=?" +
              _stringData +
              " and  (S.salary_processed is null or  S.salary_processed='N');";
          }
        }

        console.log("HERE query");
        _mysql
          .executeQueryWithTransaction({
            query: strQuery,
            values: inputValues,
            printQuery: true,
          })
          .then((empResult) => {
            if (empResult.length == 0) {
              if (req.connection == null) {
                req.connection = {
                  connection: _mysql.connection,
                  isTransactionConnection: _mysql.isTransactionConnection,
                  pool: _mysql.pool,
                };
                req.query.project_employee_id = [];
                // _mysql.releaseConnection();
                req.records = empResult;
                next();
              } else {
                resolve();
              }
              return;
            }

            let _salaryHeader_id = [];
            let _myemp = [];
            empResult.map((o) => {
              _salaryHeader_id.push(o.hims_f_salary_id);
              _myemp.push(o.employee_id);
            });

            if (_myemp.length == 0) {
              // _mysql.releaseConnection();
              req.records = {};
              next();
              resolve({});
              return;
            }
            req.query.project_employee_id = _myemp;

            let avail_till_date = "";
            if (input.month != 1) {
              let months = "";
              avail_till_date = "COALESCE(january, 0)";
              for (let k = 2; k <= input.month; k++) {
                months = moment(k, "MM").format("MMMM");
                avail_till_date += "+" + "COALESCE(" + months + ", 0)";
              }
            } else {
              avail_till_date = moment(input.month, "MM").format("MMMM");
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
              " > 0 and  employee_id in (?) and year=? ; select employee_id, year, month from hims_f_salary where employee_id in (?) and year=? and month=? and salary_type='LS'; ";

            _mysql
              .executeQueryWithTransaction({
                query:
                  "select hims_d_employee_earnings_id,employee_id,earnings_id,amount,ED.formula,allocate,\
              ED.calculation_method,ED.calculation_type,ED.component_frequency,ED.overtime_applicable,ED.component_type,\
              ED.annual_salary_comp,ED.limit_applicable, ED.limit_amount from hims_d_employee_earnings EE inner join hims_d_earning_deduction ED\
              on EE.earnings_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
              where ED.component_frequency='M' and ED.component_category='E' and EE.employee_id in (?);\
            select hims_d_employee_deductions_id,employee_id,deductions_id,amount,ED.formula,\
              allocate,ED.calculation_method,ED.calculation_type,ED.component_frequency, ED.limit_applicable, \
              ED.limit_amount, ED.component_type from \
              hims_d_employee_deductions EMP_D inner join hims_d_earning_deduction ED\
              on EMP_D.deductions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
              where ED.component_frequency='M'  and ED.component_category='D' and EMP_D.employee_id in(?);\
            select  hims_d_employee_contributions_id,employee_id,contributions_id,amount,\
              ED.formula,EC.allocate,ED.calculation_method,ED.calculation_type,ED.component_frequency, \
              ED.limit_applicable, ED.limit_amount, ED.component_type\
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
            select hims_d_earning_deduction_id from hims_d_earning_deduction where component_category = 'A';\
            select hims_d_hrms_options_id,basic_earning_component,standard_working_hours,standard_break_hours,salary_calendar,\
            attendance_type,salary_calendar_fixed_days, ot_calculation from hims_d_hrms_options;\
            select hims_d_earning_deduction_id from hims_d_earning_deduction where component_type='OV';\
            select E.hims_d_employee_id as employee_id, OT.payment_type, OT.working_day_hour, OT. weekoff_day_hour, \
              OT.holiday_hour, OT.working_day_rate, OT.weekoff_day_rate, OT.holiday_rate  \
              from hims_d_overtime_group OT, hims_d_employee E where E.overtime_group_id=OT.hims_d_overtime_group_id and E.hims_d_employee_id in (?); \
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
                  input.year,
                  _myemp,
                  input.year,
                  input.month,
                ],
                printQuery: true,
              })
              .then((Salaryresults) => {
                let _headerQuery = "";

                let basic_id = Salaryresults[8][0]["basic_earning_component"];

                let final_earning_amt_array = [];
                let final_deduction_amt_array = [];
                let final_contribution_amt_array = [];
                let final_loan_array = [];
                let salary_header_id = 0;

                let pjc_hour_price = {};
                let employee_basic_earned = {};

                new Promise((resolve, reject) => {
                  try {
                    for (let i = 0; i < empResult.length; i++) {
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
                      const _earnings = _.filter(results[0], (f) => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });

                      const ls_applied = _.filter(results[17], (f) => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });
                      const _LeaveRule = _.filter(results[16], (f) => {
                        return f.employee_id == empResult[i]["employee_id"];
                      });

                      // if (results[8][0].salary_calendar == "F") {
                      //   empResult[i]["total_days"] =
                      //     results[8][0].salary_calendar_fixed_days;
                      // }

                      getEarningComponents({
                        earnings: _earnings,
                        empResult: empResult[i],
                        leave_salary: req.query.leave_salary,
                        _mysql: _mysql,
                        input: input,
                        _LeaveRule: _LeaveRule,
                        hrms_option: results[8],
                        next: next,
                        decimal_places: req.userIdentity.decimal_places,
                      })
                        .then((earningOutput) => {
                          current_earning_amt_array =
                            earningOutput.current_earning_amt_array;
                          final_earning_amount =
                            earningOutput.final_earning_amount;
                          leave_salary_accrual_amount =
                            earningOutput.accrual_amount;

                          // const basic_erned = current_earning_amt_array.find(
                          //   (f) => {
                          //     return f.earnings_id == basic_id;
                          //   }
                          // );

                          // employee_basic_earned[
                          //   empResult[i]["employee_id"]
                          // ] = basic_erned;
                          employee_basic_earned[empResult[i]["employee_id"]] =
                            earningOutput.gross_earn_amount;

                          const _deduction = _.filter(results[1], (f) => {
                            return f.employee_id == empResult[i]["employee_id"];
                          });
                          getDeductionComponents({
                            deduction: _deduction,
                            empResult: empResult[i],
                            leave_salary: req.query.leave_salary,
                            hrms_option: results[8],
                            ls_applied: ls_applied,
                            next: next,
                            decimal_places: req.userIdentity.decimal_places,
                          }).then((deductionOutput) => {
                            current_deduction_amt_array =
                              deductionOutput.current_deduction_amt_array;
                            final_deduction_amount =
                              deductionOutput.final_deduction_amount;

                            //Contribution -- Start
                            const _contrubutions = _.filter(results[2], (f) => {
                              return (
                                f.employee_id == empResult[i]["employee_id"]
                              );
                            });

                            getContrubutionsComponents({
                              contribution: _contrubutions,
                              empResult: empResult[i],
                              leave_salary: req.query.leave_salary,
                              hrms_option: results[8],
                              ls_applied: ls_applied,
                              next: next,
                              decimal_places: req.userIdentity.decimal_places,
                            }).then((contributionOutput) => {
                              current_contribution_amt_array =
                                contributionOutput.current_contribution_amt_array;
                              final_contribution_amount =
                                contributionOutput.final_contribution_amount;

                              //Loan Due Start
                              const _loan = _.filter(results[3], (f) => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
                              });
                              //Loan Payable
                              const _loanPayable = _.filter(results[6], (f) => {
                                return (
                                  f.employee_id == empResult[i]["employee_id"]
                                );
                              });
                              getLoanDueandPayable({
                                loan: _loan,
                                loanPayable: _loanPayable,
                                next: next,
                                decimal_places: req.userIdentity.decimal_places,
                                empResult: empResult[i],
                              }).then((loanOutput) => {
                                total_loan_due_amount =
                                  loanOutput.total_loan_due_amount;
                                total_loan_payable_amount =
                                  loanOutput.total_loan_payable_amount;

                                current_loan_array =
                                  loanOutput.current_loan_array;

                                //Advance
                                const _advance = _.filter(results[4], (f) => {
                                  return (
                                    f.employee_id == empResult[i]["employee_id"]
                                  );
                                });
                                getAdvanceDue({
                                  advance: _advance,
                                  dedcomponent: results[7],
                                  next: next,
                                  decimal_places:
                                    req.userIdentity.decimal_places,
                                }).then((advanceOutput) => {
                                  advance_due_amount =
                                    advanceOutput.advance_due_amount;

                                  final_deduction_amount =
                                    final_deduction_amount +
                                    advanceOutput.advance_due_amount;

                                  current_deduction_amt_array = current_deduction_amt_array.concat(
                                    advanceOutput.current_deduct_compoment
                                  );

                                  //OT
                                  const _over_time = _.filter(
                                    results[10],
                                    (f) => {
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
                                    leave_salary: req.query.leave_salary,
                                    next: next,
                                    decimal_places:
                                      req.userIdentity.decimal_places,
                                    leave_salary_sidhiqe:
                                      empResult[i].from_normal_salary,
                                  })
                                    .then((OTManagement) => {
                                      final_earning_amount =
                                        final_earning_amount +
                                        OTManagement.final_earning_amount;

                                      current_earning_amt_array = current_earning_amt_array.concat(
                                        OTManagement.current_ot_amt_array
                                      );

                                      //pJC hour price
                                      pjc_hour_price[
                                        empResult[i]["employee_id"]
                                      ] = {
                                        employee_id:
                                          empResult[i]["employee_id"],
                                        normal_ot_cost:
                                          OTManagement["normal_ot_cost"],
                                        wot_cost: OTManagement["wot_cost"],
                                        hot_cost: OTManagement["hot_cost"],
                                      };

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
                                          req.userIdentity.decimal_places,
                                      }).then((ShortAge) => {
                                        final_deduction_amount =
                                          final_deduction_amount +
                                          ShortAge.final_deduction_amount;

                                        current_deduction_amt_array = current_deduction_amt_array.concat(
                                          ShortAge.current_shortage_amt_array
                                        );
                                        //Miscellaneous Earning Deduction
                                        const _miscellaneous = _.filter(
                                          results[5],
                                          (f) => {
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
                                            req.userIdentity.decimal_places,
                                        }).then((miscellaneousOutput) => {
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
                                          // console.log("empResult[i].gross_salary", empResult[i]["gross_salary"])
                                          // console.log("empResult[i].total_days", empResult[i]["total_days"])
                                          let per_day_sal =
                                            parseFloat(
                                              empResult[i]["total_days"]
                                            ) === 0
                                              ? 0
                                              : empResult[i]["gross_salary"] /
                                                empResult[i]["total_days"];

                                          let _salary_number =
                                            empResult[i][
                                              "partial_attendance"
                                            ] == "Y"
                                              ? "FS-"
                                              : req.query.leave_salary == null
                                              ? "NS-"
                                              : "LS-";

                                          _salary_number += empResult[i][
                                            "employee_code"
                                          ].trim();
                                          _salary_number +=
                                            "-" + month_number + "-" + year;

                                          let _net_salary =
                                            final_earning_amount -
                                            final_deduction_amount -
                                            total_loan_due_amount;

                                          _net_salary =
                                            _net_salary +
                                            total_loan_payable_amount;

                                          let salary_type = "";

                                          if (
                                            empResult[i][
                                              "partial_attendance"
                                            ] == "Y"
                                          ) {
                                            salary_type = "FS";
                                          } else {
                                            salary_type =
                                              req.query.leave_salary == null
                                                ? "NS"
                                                : "LS";
                                          }

                                          if (
                                            empResult[i].from_normal_salary !==
                                            "N"
                                          ) {
                                            if (
                                              current_earning_amt_array.length >
                                              0
                                            ) {
                                              _headerQuery += _mysql.mysqlQueryFormat(
                                                "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,sub_department_id,salary_date,per_day_sal,total_days,\
                                                present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                                unpaid_leave,pending_unpaid_leave,total_hours, total_working_hours, ot_work_hours, ot_weekoff_hours, ot_holiday_hours, leave_salary_accrual_amount, leave_salary_days,\
                                                shortage_hours,display_present_days,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                                total_contributions,net_salary, total_paid_days, salary_type, hospital_id) \
                                               VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;",
                                                [
                                                  _salary_number,
                                                  parseInt(month_number),
                                                  parseInt(year),
                                                  empResult[i]["employee_id"],
                                                  empResult[i][
                                                    "sub_department_id"
                                                  ],
                                                  new Date(),
                                                  per_day_sal,
                                                  empResult[i]["total_days"],
                                                  empResult[i]["present_days"],
                                                  empResult[i]["absent_days"],
                                                  empResult[i][
                                                    "total_work_days"
                                                  ],
                                                  empResult[i][
                                                    "total_weekoff_days"
                                                  ],
                                                  empResult[i][
                                                    "total_holidays"
                                                  ],
                                                  empResult[i]["total_leave"],
                                                  empResult[i]["paid_leave"],
                                                  empResult[i]["unpaid_leave"],
                                                  empResult[i][
                                                    "pending_unpaid_leave"
                                                  ],

                                                  empResult[i]["total_hours"],
                                                  empResult[i][
                                                    "total_working_hours"
                                                  ],
                                                  empResult[i]["ot_work_hours"],
                                                  empResult[i][
                                                    "ot_weekoff_hours"
                                                  ],
                                                  empResult[i][
                                                    "ot_holiday_hours"
                                                  ],
                                                  leave_salary_accrual_amount,
                                                  empResult[i][
                                                    "total_applied_days"
                                                  ],
                                                  empResult[i][
                                                    "shortage_hours"
                                                  ],
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
                                                  empResult[i][
                                                    "total_paid_days"
                                                  ],
                                                  salary_type,
                                                  input.hospital_id,
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
                                          }

                                          if (i == empResult.length - 1) {
                                            resolve();
                                          }
                                        });
                                      });
                                    })
                                    .catch((error) => {
                                      _mysql.rollBackTransaction(() => {
                                        next(e);
                                        reject(e);
                                      });
                                    });
                                });
                              });
                            });
                          });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                            reject(e);
                          });
                          // _mysql.releaseConnection();
                          // next(e);
                          // reject(e);
                        });
                    }
                  } catch (e) {
                    reject(e);
                  }
                })
                  .then((result) => {
                    if (_headerQuery == "") {
                      // _mysql.releaseConnection();
                      req.records = empResult;
                      next();
                      resolve();
                      return;
                    }
                    _mysql
                      .executeQueryWithTransaction({
                        query: _headerQuery,
                        printQuery: true,
                      })
                      .then((inserted_header) => {
                        let inserted_salary = [];
                        if (Array.isArray(inserted_header)) {
                          inserted_salary = inserted_header;
                        } else {
                          inserted_salary = [inserted_header];
                        }

                        // console.log("inserted_salary", inserted_salary)
                        if (inserted_salary.length > 0) {
                          let execute_query = "";

                          for (let k = 0; k < inserted_salary.length; k++) {
                            salary_header_id = inserted_salary[k].insertId;

                            if (final_earning_amt_array[k].length > 0) {
                              for (
                                let l = 0;
                                l < final_earning_amt_array[k].length;
                                l++
                              ) {
                                execute_query += _mysql.mysqlQueryFormat(
                                  "INSERT INTO `hims_f_salary_earnings` (salary_header_id, earnings_id, amount, \
                                per_day_salary) VALUE(?,?,?,?); ",
                                  [
                                    inserted_salary[k].insertId,
                                    final_earning_amt_array[k][l].earnings_id,
                                    final_earning_amt_array[k][l].amount,
                                    final_earning_amt_array[k][l]
                                      .per_day_salary,
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
                                      .per_day_salary,
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
                                    final_contribution_amt_array[k][n].amount,
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
                                    final_loan_array[k][o].balance_amount,
                                  ]
                                );
                              }
                            }

                            if (k == inserted_salary.length - 1) {
                              _mysql
                                .executeQuery({
                                  query: execute_query,
                                  printQuery: true,
                                })
                                .then((detailresult) => {
                                  UpdateProjectWisePayroll({
                                    _mysql: _mysql,
                                    next: next,
                                    inputParam: req.query,
                                    decimal_places:
                                      req.userIdentity.decimal_places,
                                    pjc_hour_price: pjc_hour_price,
                                    employee_basic_earned: employee_basic_earned,
                                    attendance_type:
                                      Salaryresults[8][0].attendance_type,
                                  })
                                    .then((Employee_Leave_Salary) => {
                                      if (req.connection == null) {
                                        req.connection = {
                                          connection: _mysql.connection,
                                          isTransactionConnection:
                                            _mysql.isTransactionConnection,
                                          pool: _mysql.pool,
                                        };
                                        req.records = detailresult;
                                        next();
                                        resolve(detailresult);
                                      } else {
                                        resolve(salary_header_id);
                                      }
                                    })
                                    .catch((e) => {
                                      _mysql.rollBackTransaction(() => {
                                        next(e);
                                      });
                                    });
                                })
                                .catch((error) => {
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                    reject(error);
                                  });
                                });
                            }
                          }
                        }
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                          reject(error);
                        });
                      });
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                      reject(e);
                    });
                  });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                  reject(e);
                });
              });
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
              reject(error);
            });
          });
      } catch (e) {
        _mysql.rollBackTransaction(() => {
          next(e);
          reject(e);
        });
      }
    }).catch((e) => {
      _mysql.rollBackTransaction(() => {
        next(e);
        reject(e);
      });
    });
  },

  getSalaryProcess: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;
      const _mysql = new algaehMysql(_options);

      let inputParam = req.query;

      inputParam.year = req.query.year;
      inputParam.month = req.query.month;

      const month_end = moment(
        inputParam.year + "-" + inputParam.month,
        "YYYY-M"
      )
        .endOf("month")
        .format("YYYY-MM-DD");

      let salaryprocess_header = [];

      /* Select statemwnt  */

      let _stringData =
        inputParam.employee_id != null
          ? ` and S.employee_id= ${inputParam.employee_id}`
          : "";

      _stringData +=
        inputParam.sub_department_id != null
          ? ` and emp.sub_department_id= ${inputParam.sub_department_id}`
          : "";

      _stringData +=
        inputParam.department_id != null
          ? ` and SD.department_id= ${inputParam.department_id}`
          : "";

      _stringData +=
        inputParam.group_id != null
          ? ` and emp.employee_group_id= ${inputParam.group_id}`
          : "";

      _stringData +=
        inputParam.salary_type != null
          ? " and salary_type = '" + inputParam.salary_type + "'"
          : " and salary_type in ('NS','FS')";

      const enableSuspendEmployee =
        inputParam.enableSuspendEmployee === "Y"
          ? ""
          : "emp.suspend_salary='N' and";

      // left join hims_f_leave_application as LEA on AL.leave_application_id = LEA.hims_f_leave_application_id \ and date(now()) between date(LEA.from_date) and date(LEA.to_date)
      _mysql
        .executeQueryWithTransaction({
          query:
            "select hims_f_salary_id, S.employee_id, salary_number, S.year, total_days, absent_days, total_work_days,  \
            total_weekoff_days, total_holidays, total_leave, paid_leave, unpaid_leave, present_days,  pending_unpaid_leave, \
            total_paid_days, S.gross_salary, S.net_salary, advance_due, display_present_days, \
            S.total_earnings,S.total_deductions,loan_payable_amount, loan_due_amount, salary_processed, salary_paid, \
            leave_salary_accrual_amount, leave_salary_days, emp.employee_code, emp.full_name, emp.last_salary_process_date, \
            AL.from_normal_salary, AL.hims_f_employee_annual_leave_id from hims_f_salary S \
            inner join hims_d_employee emp on S.employee_id = emp.hims_d_employee_id  \
            inner join  hims_d_sub_department SD on emp.sub_department_id=SD.hims_d_sub_department_id \
            left join hims_f_employee_annual_leave AL on emp.hims_d_employee_id = AL.employee_id and  AL.year=? \
            and AL.month = ? and AL.cancelled='N' where " +
            enableSuspendEmployee +
            "  \
              S.`year` = ? and S.`month` = ? and emp.hospital_id=? " +
            _stringData,
          values: [
            inputParam.year,
            inputParam.month,
            inputParam.year,
            inputParam.month,
            inputParam.hospital_id,
          ],
          printQuery: true,
        })
        .then((salary_process) => {
          if (salary_process.length > 0) {
            // let _salary_data = _.filter(salary_process, (f) => {
            //   return (
            //     f.from_normal_salary === "Y" ||
            //     f.hims_f_employee_annual_leave_id === null ||
            //     (f.last_salary_process_date !== null
            //       ? parseInt(
            //           moment(f.last_salary_process_date).format("YYYYMMDD"),
            //           10
            //         ) >=
            //         parseInit(
            //           moment(month_end, "YYYY-MM-DD").format("YYYYMMDD"),
            //           10
            //         )
            //       : false)
            //   );
            // });

            let _salary_data = salary_process.filter((f) => {
              if (
                f.from_normal_salary === "N" &&
                f.hims_f_employee_annual_leave_id
              )
                return false;
              return (
                f.from_normal_salary === "Y" ||
                f.hims_f_employee_annual_leave_id === null ||
                (f.last_salary_process_date !== null
                  ? parseInt(
                      moment(f.last_salary_process_date).format("YYYYMMDD"),
                      10
                    ) >=
                    parseInit(
                      moment(month_end, "YYYY-MM-DD").format("YYYYMMDD"),
                      10
                    )
                  : false)
              );
            });

            if (
              inputParam.employee_id != null &&
              inputParam.salary_type !== "LS"
            ) {
              let _annual_salary = _.filter(salary_process, (f) => {
                return (
                  f.from_normal_salary === "N" &&
                  f.hims_f_employee_annual_leave_id !== null
                );
              });
              if (_annual_salary.length > 0) {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message:
                      "Selected Employee applied annual leave, Please process from annual leave salary screen. ",
                  };
                  next();
                });
                return;
              }
            }
            const _salaryHeader_id =
              inputParam.salary_type === "LS"
                ? salary_process.map((item) => {
                    return item.hims_f_salary_id;
                  })
                : _salary_data.map((item) => {
                    return item.hims_f_salary_id;
                  });
            salaryprocess_header =
              inputParam.salary_type === "LS" ? salary_process : _salary_data;

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
                printQuery: false,
              })
              .then((result) => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = [
                    {
                      salaryprocess_header: salaryprocess_header,
                      salaryprocess_detail: result,
                    },
                  ];
                  next();
                });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                  reject(error);
                });
              });
          } else {
            // if (inputParam.employee_id){

            //   _mysql.executeQuery({

            //   })

            // }

            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = salary_process;
              next();
            });
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(error);
            reject(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
        reject(error);
      });
    }
  },

  //FINALIZE AND INSERT LEAVE_SALARY_ACCRUAL
  finalizedSalaryProcess: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = { ...req.body };
      const decimal_places = req.userIdentity.decimal_places;
      let month_start = moment(
        inputParam.year + "-" + inputParam.month,
        "YYYY-M"
      )
        .startOf("month")
        .format("YYYY-MM-DD");
      inputParam.annual_leave_calculation = inputParam.annual_leave_calculation
        ? inputParam.annual_leave_calculation
        : req.annual_leave_calculation;
      let month_end = moment(inputParam.year + "-" + inputParam.month, "YYYY-M")
        .endOf("month")
        .format("YYYY-MM-DD");

      let strQuery = "";
      if (inputParam.annual_leave_calculation === "A") {
        strQuery =
          "select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
          inputParam.year +
          " as year," +
          inputParam.month +
          " as month, \
          CASE when airfare_process = 'N' then 0 when airfare_factor = 'PB' then ROUND(((amount / 100)*airfare_percentage), " +
          decimal_places +
          ") \
          else ROUND((airfare_amount/CAST(CAST(airfare_eligibility AS CHAR) AS SIGNED)), " +
          decimal_places +
          ") end as airfare_amount,\
          ROUND(sum((EE.amount *12)/365)* EG.monthly_accrual_days, " +
          decimal_places +
          ") as leave_salary \
          from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, \
          hims_d_employee_earnings EE ,hims_d_earning_deduction ED \
          where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
          EE.earnings_id=ED.hims_d_earning_deduction_id and \
          ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) \
          group by EE.employee_id; SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
      } else if (inputParam.annual_leave_calculation === "M") {
        let acc_str = `  case when E.date_of_joining between date('${month_start}') and date('${month_end}') 
                  then round((monthly_accrual_days/30)*(datediff( '${month_end}' ,E.date_of_joining)+1 ),2) 
                  when  E.exit_date between date('${month_start}') and date('${month_end}')
                  then round((monthly_accrual_days/30)*(datediff( E.exit_date ,'${month_start}')+1 ),2)
                  else monthly_accrual_days end `;

        strQuery =
          "select E.hims_d_employee_id as employee_id," +
          acc_str +
          " as leave_days, " +
          inputParam.year +
          " as year," +
          inputParam.month +
          " as month, \
          CASE when airfare_process = 'N' then 0 when airfare_factor = 'PB' then ROUND(((amount / 100)*airfare_percentage), " +
          decimal_places +
          ") \
          else ROUND((airfare_amount/CAST(CAST(airfare_eligibility AS CHAR) AS SIGNED)), " +
          decimal_places +
          ") end as airfare_amount,\
          ROUND(sum(EE.amount /30)* (" +
          acc_str +
          "), " +
          decimal_places +
          ") as leave_salary\
          from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
          where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
          EE.earnings_id=ED.hims_d_earning_deduction_id and \
          ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
      }

      _mysql
        .executeQuery({
          query: strQuery,
          values: [inputParam.employee_id],
          printQuery: true,
        })
        .then((leave_accrual_data) => {
          debugger;
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          let leave_accrual_detail = leave_accrual_data[0];
          let annual_leave_data = leave_accrual_data[1];

          if (leave_accrual_detail.length > 0) {
            _mysql
              .generateRunningNumber({
                user_id: req.userIdentity.algaeh_d_app_user_id,
                numgen_codes: ["LEAVE_ACCRUAL"],
                table_name: "hims_f_hrpayroll_numgen",
              })
              .then((generatedNumbers) => {
                let leave_salary_number = generatedNumbers.LEAVE_ACCRUAL;

                let leave_salary_accrual_detail = leave_accrual_detail;

                const total_leave_salary = _.sumBy(
                  leave_salary_accrual_detail,
                  (s) => {
                    return parseFloat(s.leave_salary);
                  }
                );

                const total_airfare_amount = _.sumBy(
                  leave_salary_accrual_detail,
                  (s) => {
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
                      req.userIdentity.algaeh_d_app_user_id,
                    ],
                    // printQuery: false
                  })
                  .then((accrual_header) => {
                    let leave_salary_header_id = accrual_header.insertId;

                    let IncludeValues = [
                      "employee_id",
                      "year",
                      "month",
                      "leave_days",
                      "leave_salary",
                      "airfare_amount",
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT INTO hims_f_leave_salary_accrual_detail(??) VALUES ?",
                        values: leave_salary_accrual_detail,
                        includeValues: IncludeValues,
                        extraValues: {
                          leave_salary_header_id: leave_salary_header_id,
                        },
                        bulkInsertOrUpdate: true,
                        // printQuery: false
                      })
                      .then((leave_detail) => {
                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE hims_f_salary SET salary_processed = 'Y', salary_processed_date=?, salary_processed_by=?\
                                where hims_f_salary_id in (?)",
                            values: [
                              new Date(),
                              req.userIdentity.algaeh_d_app_user_id,
                              inputParam.salary_header_id,
                            ],
                            // printQuery: false
                          })
                          .then((salary_process) => {
                            // console.log("salary")
                            InsertEmployeeLeaveSalary({
                              leave_salary_accrual_detail: leave_salary_accrual_detail,
                              annual_leave_data: annual_leave_data,
                              _mysql: _mysql,
                              next: next,
                              decimal_places: req.userIdentity.decimal_places,
                              isSingleEmployee:
                                inputParam.employee_id.length === 1
                                  ? true
                                  : false,
                            })
                              .then((Employee_Leave_Salary) => {
                                InsertGratuityProvision({
                                  inputParam: inputParam,
                                  _mysql: _mysql,
                                  next: next,
                                  decimal_places:
                                    req.userIdentity.decimal_places,
                                })
                                  .then((gratuity_provision) => {
                                    if (
                                      inputParam._leave_salary_acc.length > 0
                                    ) {
                                      UpdateLeaveSalaryProvission({
                                        inputParam: inputParam,
                                        _mysql: _mysql,
                                        next: next,
                                        decimal_places:
                                          req.userIdentity.decimal_places,
                                      })
                                        .then((Leave_Salary_Provission) => {
                                          // _mysql.commitTransaction(() => {
                                          //   _mysql.releaseConnection();
                                          req.records = {
                                            leave_salary_number: leave_salary_number,
                                          };
                                          next();
                                          // });
                                        })
                                        .catch((e) => {
                                          _mysql.rollBackTransaction(() => {
                                            next(e);
                                          });
                                        });
                                    } else {
                                      // _mysql.commitTransaction(() => {
                                      //   _mysql.releaseConnection();
                                      req.records = {
                                        leave_salary_number: leave_salary_number,
                                      };
                                      next();
                                      // });
                                    }
                                  })
                                  .catch((e) => {
                                    _mysql.rollBackTransaction(() => {
                                      next(e);
                                    });
                                  });
                              })
                              .catch((e) => {
                                debugger;
                                _mysql.rollBackTransaction(() => {
                                  next(e);
                                });
                              });
                          })
                          .catch((e) => {
                            _mysql.rollBackTransaction(() => {
                              next(e);
                            });
                          });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql
              .executeQuery({
                query:
                  "UPDATE hims_f_salary SET salary_processed = 'Y', salary_processed_date=?, salary_processed_by=?\
                   where hims_f_salary_id in (?)",
                values: [
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.salary_header_id,
                ],
                printQuery: false,
              })
              .then((salary_process) => {
                InsertGratuityProvision({
                  inputParam: inputParam,
                  _mysql: _mysql,
                  next: next,
                  decimal_places: req.userIdentity.decimal_places,
                })
                  .then((gratuity_provision) => {
                    if (inputParam._leave_salary_acc.length > 0) {
                      UpdateLeaveSalaryProvission({
                        inputParam: inputParam,
                        _mysql: _mysql,
                        next: next,
                        decimal_places: req.userIdentity.decimal_places,
                      })
                        .then((Leave_Salary_Provission) => {
                          // _mysql.commitTransaction(() => {
                          //   _mysql.releaseConnection();
                          //   req.records = gratuity_provision;
                          //   next();
                          // });
                          req.records = gratuity_provision;
                          next();
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    } else {
                      // _mysql.commitTransaction(() => {
                      //   _mysql.releaseConnection();
                      //   req.records = gratuity_provision;
                      //   next();
                      // });
                      req.records = gratuity_provision;
                      next();
                    }
                  })
                  .catch((e) => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      next(e);
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
            input.year,
          ],
        })
        .then((result) => {
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
            total_earnings = new LINQ(salary).Sum((s) =>
              parseFloat(s.total_earnings)
            );
            total_deductions = new LINQ(salary).Sum((s) =>
              parseFloat(s.total_deductions)
            );
            total_contributions = new LINQ(salary).Sum((s) =>
              parseFloat(s.total_contributions)
            );
            total_net_salary = new LINQ(salary).Sum((s) =>
              parseFloat(s.net_salary)
            );

            let salary_header_ids = new LINQ(salary)
              .Select((s) => s.hims_f_salary_id)
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
                values: [input.year, input.month, input.year, input.month],
              })
              .then((results) => {
                let earnings = results[0];
                let deductions = results[1];
                let basic_id = results[2][0]["basic_earning_component"];
                let gratuity = results[3];
                let accrual = results[4];
                let contributions = results[5];

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
                      (w) => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select((s) => {
                      return {
                        hims_f_salary_earnings_id: s.hims_f_salary_earnings_id,
                        earnings_id: s.earnings_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id,
                      };
                    })
                    .ToArray();

                  let employee_deduction = new LINQ(deductions)
                    .Where(
                      (w) => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select((s) => {
                      return {
                        hims_f_salary_deductions_id:
                          s.hims_f_salary_deductions_id,
                        deductions_id: s.deductions_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id,
                      };
                    })
                    .ToArray();

                  let employee_contributions = new LINQ(contributions)
                    .Where(
                      (w) => w.salary_header_id == salary[i]["hims_f_salary_id"]
                    )
                    .Select((s) => {
                      return {
                        hims_f_salary_contributions_id:
                          s.hims_f_salary_contributions_id,
                        contributions_id: s.contributions_id,
                        amount: s.amount,
                        nationality_id: s.nationality_id,
                      };
                    })
                    .ToArray();

                  total_basic += new LINQ(employee_earning)
                    .Where((w) => w.earnings_id == basic_id)
                    .Select((s) => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  sum_gratuity += new LINQ(gratuity)
                    .Where((w) => w.employee_id == salary[i]["employee_id"])
                    .Select((s) => parseFloat(s.gratuity_amount))
                    .FirstOrDefault(0);

                  sum_leave_salary += new LINQ(accrual)
                    .Where((w) => w.employee_id == salary[i]["employee_id"])
                    .Select((s) => parseFloat(s.leave_salary))
                    .FirstOrDefault(0);

                  sum_airfare_amount += new LINQ(accrual)
                    .Where((w) => w.employee_id == salary[i]["employee_id"])
                    .Select((s) => parseFloat(s.airfare_amount))
                    .FirstOrDefault(0);

                  let emp_gratuity = new LINQ(gratuity)
                    .Where((w) => w.employee_id == salary[i]["employee_id"])
                    .Select((s) => {
                      return {
                        gratuity_amount: s.gratuity_amount,
                      };
                    })
                    .FirstOrDefault({ gratuity_amount: 0 });

                  let emp_accural = new LINQ(accrual)
                    .Where((w) => w.employee_id == salary[i]["employee_id"])
                    .Select((s) => {
                      return {
                        leave_days: s.leave_days,
                        leave_salary: s.leave_salary,
                        airfare_amount: s.airfare_amount,
                      };
                    })
                    .FirstOrDefault({
                      leave_days: 0,
                      leave_salary: 0,
                      airfare_amount: 0,
                    });

                  outputArray.push({
                    ...salary[i],
                    ...emp_gratuity,
                    ...emp_accural,
                    employee_earning: employee_earning,
                    employee_deduction: employee_deduction,
                    employee_contributions: employee_contributions,
                    complete_ot: complete_ot,
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
                  sum_airfare_amount: sum_airfare_amount,
                };
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = salary;
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please Provide valid input ",
      };
      next();
      return;
    }
  },

  generateAccountingEntry: (req, res, next) => {
    // console.log("generateAccountingEntry", req.flag);
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      if (req.flag != 1) {
        let inputParam = req.body;

        _mysql
          .executeQueryWithTransaction({
            query:
              "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
          })
          .then((org_data) => {
            if (
              org_data[0]["product_type"] == "HIMS_ERP" ||
              org_data[0]["product_type"] == "FINANCE_ERP"
            ) {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "select account, head_id, child_id from finance_accounts_maping \
              where account in ('SAL_PYBLS', 'LV_SAL_PYBL', 'AIRFR_PYBL', 'GRAT_PYBL');\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='LS';\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='AR';\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='EOS';",
                })
                .then((result) => {
                  const salary_pay_acc = result[0].find(
                    (f) => f.account === "SAL_PYBLS"
                  );
                  const lv_salary_pay_acc = result[0].find(
                    (f) => f.account === "LV_SAL_PYBL"
                  );
                  const airfair_pay_acc = result[0].find(
                    (f) => f.account === "AIRFR_PYBL"
                  );
                  const gratuity_pay_acc = result[0].find(
                    (f) => f.account === "GRAT_PYBL"
                  );

                  const leave_sal_expence_acc = result[1][0];
                  const airfare_expence_acc = result[2][0];
                  const gratuity_expence_acc = result[3][0];

                  _mysql
                    .executeQueryWithTransaction({
                      query: `select hims_f_salary_id, hims_f_salary_id as document_id, '${inputParam.ScreenCode}' as from_screen,
                  salary_number as document_number, salary_date as transaction_date,
                  S.net_salary as amount, 'journal' as voucher_type,S.hospital_id, 
                  concat('Salary for Employee: ', E.employee_code , '/' , E.full_name , ' in ' , year , '/' , monthname(concat('1999-',month,'-01'))) as narration,
                  E.sub_department_id from hims_f_salary S 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in (?);
                  select hims_f_salary_id, curDate() payment_date,SE.amount as debit_amount, 
                  CASE WHEN E.employee_category='A' THEN ED.head_id else ED.direct_head_id END as head_id,
                  CASE WHEN E.employee_category='A' THEN ED.child_id else ED.direct_child_id END as child_id,
                  'DR' as payment_type, 0 as credit_amount, S.hospital_id, E.sub_department_id from hims_f_salary S 
                  left join hims_f_salary_earnings SE on SE.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?); 
                  select hims_f_salary_id, curDate() payment_date, SD.amount as credit_amount, ED.head_id, ED.child_id, \
                  'CR' as payment_type, 0 as debit_amount ,S.hospital_id, E.sub_department_id from hims_f_salary S 
                  left join hims_f_salary_deductions SD on SD.salary_header_id = S.hims_f_salary_id 
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SD.deductions_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?); 
                  select hims_f_salary_id, curDate() payment_date, SC.amount as debit_amount, ED.head_id, ED.child_id, \
                  'DR' as payment_type,0 as credit_amount ,S.hospital_id, E.sub_department_id from hims_f_salary S 
                  left join hims_f_salary_contributions SC on SC.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SC.contributions_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?);
                  select hims_f_salary_id, curDate() payment_date, SC.amount as credit_amount, ED.li_head_id as  head_id, 
                  ED.li_child_id as child_id, 'CR' as payment_type,0 as debit_amount, S.hospital_id, E.sub_department_id from hims_f_salary S 
                  left join hims_f_salary_contributions SC on SC.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SC.contributions_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?);
                  select hims_f_salary_id, curDate() payment_date, SL.loan_due_amount as credit_amount, L.head_id, 
                  L.child_id, 'CR' as payment_type, 0 as debit_amount,S.hospital_id,E.sub_department_id from hims_f_salary S 
                  left join hims_f_salary_loans SL on SL.salary_header_id = S.hims_f_salary_id
                  left join hims_f_loan_application LA on LA.hims_f_loan_application_id = SL.loan_application_id
                  inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?);
                  select employee_id, leave_salary, airfare_amount, E.hospital_id, E.sub_department_id from hims_f_leave_salary_accrual_detail D 
                  inner join hims_d_employee E on E.hims_d_employee_id =D.employee_id 
                  where year=? and month = ? and employee_id in (?);
                  select employee_id, gratuity_amount, E.hospital_id, E.sub_department_id from hims_f_gratuity_provision G
                  inner join hims_d_employee E on E.hims_d_employee_id =G.employee_id 
                  where year=? and month = ? and employee_id in (?);
                  select employee_id, head_id, child_id, E.hospital_id, approved_amount, E.sub_department_id from hims_f_loan_application LA
                  inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = LA.employee_id where loan_authorized='APR' 
                  and loan_closed='N' and loan_dispatch_from='SAL' and employee_id in (?);`,
                      values: [
                        inputParam.salary_header_id,
                        inputParam.salary_header_id,
                        inputParam.salary_header_id,
                        inputParam.salary_header_id,
                        inputParam.salary_header_id,
                        inputParam.salary_header_id,
                        inputParam.year,
                        inputParam.month,
                        inputParam.employee_id,
                        inputParam.year,
                        inputParam.month,
                        inputParam.employee_id,
                        inputParam.employee_id,
                      ],
                      printQuery: false,
                    })
                    .then((headerResult) => {
                      const leave_salary_booking = headerResult[6];
                      const gratuity_provision_booking = headerResult[7];
                      const loan_payable_amount = headerResult[8];

                      const Header_IncludeValuess = [
                        "document_id",
                        "from_screen",
                        "document_number",
                        "transaction_date",
                        "amount",
                        "voucher_type",
                        "narration",
                      ];

                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "INSERT INTO finance_day_end_header (??) VALUES ? ;",
                          values: headerResult[0],
                          includeValues: Header_IncludeValuess,
                          extraValues: {
                            entered_date: new Date(),
                            entered_by: req.userIdentity.algaeh_d_app_user_id,
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: false,
                        })
                        .then((finance_header) => {
                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "SELECT finance_day_end_header_id, document_id, amount, S.employee_id FROM finance_day_end_header EH\
                            inner join hims_f_salary S on S.hims_f_salary_id= EH.document_id \
                            where from_screen = ? and document_id in (?)",
                              values: [
                                inputParam.ScreenCode,
                                inputParam.salary_header_id,
                              ],
                              printQuery: false,
                            })
                            .then((insert_result) => {
                              const insert_finance_detail = [];

                              insert_result.forEach((per_salary) => {
                                const employee_barnch = headerResult[0].find(
                                  (f) =>
                                    f.hims_f_salary_id ===
                                    per_salary.document_id
                                );

                                const earnings = headerResult[1]
                                  .filter(
                                    (f) =>
                                      f.hims_f_salary_id ===
                                      per_salary.document_id
                                  )
                                  .map((m) => {
                                    return {
                                      ...m,
                                      day_end_header_id:
                                        per_salary.finance_day_end_header_id,
                                    };
                                  });
                                const deduction = headerResult[2]
                                  .filter(
                                    (f) =>
                                      f.hims_f_salary_id ===
                                      per_salary.document_id
                                  )
                                  .map((m) => {
                                    return {
                                      ...m,
                                      day_end_header_id:
                                        per_salary.finance_day_end_header_id,
                                    };
                                  });
                                const contribution = headerResult[3]
                                  .filter(
                                    (f) =>
                                      f.hims_f_salary_id ===
                                      per_salary.document_id
                                  )
                                  .map((m) => {
                                    return {
                                      ...m,
                                      day_end_header_id:
                                        per_salary.finance_day_end_header_id,
                                    };
                                  });

                                const lib_acc_contribution = headerResult[4]
                                  .filter(
                                    (f) =>
                                      f.hims_f_salary_id ===
                                      per_salary.document_id
                                  )
                                  .map((m) => {
                                    return {
                                      ...m,
                                      day_end_header_id:
                                        per_salary.finance_day_end_header_id,
                                    };
                                  });

                                const loan_data = headerResult[5]
                                  .filter(
                                    (f) =>
                                      f.hims_f_salary_id ===
                                      per_salary.document_id
                                  )
                                  .map((m) => {
                                    return {
                                      ...m,
                                      day_end_header_id:
                                        per_salary.finance_day_end_header_id,
                                    };
                                  });

                                insert_finance_detail.push(
                                  ...earnings,
                                  ...deduction,
                                  ...contribution,
                                  ...lib_acc_contribution,
                                  ...loan_data,
                                  {
                                    day_end_header_id:
                                      per_salary.finance_day_end_header_id,
                                    payment_date: new Date(),
                                    head_id: salary_pay_acc.head_id,
                                    child_id: salary_pay_acc.child_id,
                                    debit_amount: 0,
                                    payment_type: "CR",
                                    credit_amount: per_salary.amount,
                                    hospital_id: employee_barnch.hospital_id,
                                    sub_department_id:
                                      employee_barnch.sub_department_id,
                                  }
                                );
                              });

                              leave_salary_booking.forEach((per_employee) => {
                                const finance_header = insert_result.find(
                                  (f) =>
                                    f.employee_id === per_employee.employee_id
                                );

                                //Booking Leave salary to Laibility account
                                insert_finance_detail.push({
                                  day_end_header_id:
                                    finance_header.finance_day_end_header_id,
                                  payment_date: new Date(),
                                  head_id: lv_salary_pay_acc.head_id,
                                  child_id: lv_salary_pay_acc.child_id,
                                  debit_amount: 0,
                                  payment_type: "CR",
                                  credit_amount: per_employee.leave_salary,
                                  hospital_id: per_employee.hospital_id,
                                  sub_department_id:
                                    per_employee.sub_department_id,
                                });

                                //Booking Leave salary to Expence account
                                insert_finance_detail.push({
                                  day_end_header_id:
                                    finance_header.finance_day_end_header_id,
                                  payment_date: new Date(),
                                  head_id: leave_sal_expence_acc.head_id,
                                  child_id: leave_sal_expence_acc.child_id,
                                  debit_amount: per_employee.leave_salary,
                                  payment_type: "DR",
                                  credit_amount: 0,
                                  hospital_id: per_employee.hospital_id,
                                  sub_department_id:
                                    per_employee.sub_department_id,
                                });

                                if (
                                  parseFloat(per_employee.airfare_amount) > 0
                                ) {
                                  //Booking Airfaie to Laibility account
                                  insert_finance_detail.push({
                                    day_end_header_id:
                                      finance_header.finance_day_end_header_id,
                                    payment_date: new Date(),
                                    head_id: airfair_pay_acc.head_id,
                                    child_id: airfair_pay_acc.child_id,
                                    debit_amount: 0,
                                    payment_type: "CR",
                                    credit_amount: per_employee.airfare_amount,
                                    hospital_id: per_employee.hospital_id,
                                    sub_department_id:
                                      per_employee.sub_department_id,
                                  });

                                  //Booking Airfaie to Expence account
                                  insert_finance_detail.push({
                                    day_end_header_id:
                                      finance_header.finance_day_end_header_id,
                                    payment_date: new Date(),
                                    head_id: airfare_expence_acc.head_id,
                                    child_id: airfare_expence_acc.child_id,
                                    debit_amount: per_employee.airfare_amount,
                                    payment_type: "DR",
                                    credit_amount: 0,
                                    hospital_id: per_employee.hospital_id,
                                    sub_department_id:
                                      per_employee.sub_department_id,
                                  });
                                }
                              });

                              gratuity_provision_booking.forEach(
                                (per_employee) => {
                                  const gra_finance_header = insert_result.find(
                                    (f) =>
                                      f.employee_id === per_employee.employee_id
                                  );

                                  if (
                                    parseFloat(per_employee.gratuity_amount) > 0
                                  ) {
                                    //Booking Gratuity Provision to Laibility account
                                    insert_finance_detail.push({
                                      day_end_header_id:
                                        gra_finance_header.finance_day_end_header_id,
                                      payment_date: new Date(),
                                      head_id: gratuity_pay_acc.head_id,
                                      child_id: gratuity_pay_acc.child_id,
                                      debit_amount: 0,
                                      payment_type: "CR",
                                      credit_amount:
                                        per_employee.gratuity_amount,
                                      hospital_id: per_employee.hospital_id,
                                      sub_department_id:
                                        per_employee.sub_department_id,
                                    });

                                    //Booking Gratuity Provision to Expence account
                                    insert_finance_detail.push({
                                      day_end_header_id:
                                        gra_finance_header.finance_day_end_header_id,
                                      payment_date: new Date(),
                                      head_id: gratuity_expence_acc.head_id,
                                      child_id: gratuity_expence_acc.child_id,
                                      debit_amount:
                                        per_employee.gratuity_amount,
                                      payment_type: "DR",
                                      credit_amount: 0,
                                      hospital_id: per_employee.hospital_id,
                                      sub_department_id:
                                        per_employee.sub_department_id,
                                    });
                                  }
                                }
                              );

                              loan_payable_amount.forEach((per_employee) => {
                                const loan_finance_header = insert_result.find(
                                  (f) =>
                                    f.employee_id === per_employee.employee_id
                                );

                                if (
                                  parseFloat(per_employee.approved_amount) > 0
                                ) {
                                  //Booking Gratuity Provision to Laibility account
                                  insert_finance_detail.push({
                                    day_end_header_id:
                                      loan_finance_header.finance_day_end_header_id,
                                    payment_date: new Date(),
                                    head_id: per_employee.head_id,
                                    child_id: per_employee.child_id,
                                    debit_amount: per_employee.approved_amount,
                                    payment_type: "DR",
                                    credit_amount: 0,
                                    hospital_id: per_employee.hospital_id,
                                    sub_department_id:
                                      per_employee.sub_department_id,
                                  });
                                }
                              });

                              const IncludeValuess = [
                                "day_end_header_id",
                                "payment_date",
                                "head_id",
                                "child_id",
                                "debit_amount",
                                "payment_type",
                                "credit_amount",
                                "hospital_id",
                                "sub_department_id",
                              ];

                              const month = moment().format("M");
                              const year = moment().format("YYYY");

                              _mysql
                                .executeQueryWithTransaction({
                                  query:
                                    "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                                  values: insert_finance_detail,
                                  includeValues: IncludeValuess,
                                  bulkInsertOrUpdate: true,
                                  extraValues: {
                                    year: year,
                                    month: month,
                                  },
                                  printQuery: false,
                                })
                                .then((subResult) => {
                                  _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    // req.records = subResult;
                                    next();
                                  });
                                })
                                .catch((error) => {
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                  });
                                });
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        })
                        .catch((error) => {
                          _mysql.rollBackTransaction(() => {
                            next(error);
                          });
                        });
                    })
                    .catch((error) => {
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                // req.records = org_data;
                next();
              });
            }
          })
          .catch((error) => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          next();
        });
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
};

function InsertEmployeeLeaveSalary(options) {
  return new Promise((resolve, reject) => {
    try {
      let leave_salary_accrual_detail = options.leave_salary_accrual_detail;
      let _mysql = options._mysql;
      let strQry = "";
      let annual_leave_data = options.annual_leave_data;
      let decimal_places = options.decimal_places;
      const isSingleEmployee = options.isSingleEmployee
        ? options.isSingleEmployee
        : false;
      const utilities = new algaehUtilities();

      let promiseAll = [];
      debugger;
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
                from hims_f_employee_monthly_leave where year = ? and employee_id = ? and leave_id=?;\
                select hims_f_employee_leave_salary_header_id from hims_f_employee_leave_salary_header H \
                inner join hims_f_employee_leave_salary_detail D on H.hims_f_employee_leave_salary_header_id = D.employee_leave_salary_header_id \
                where H.employee_id = ? and D.year=? and D.month=?;",
                values: [
                  leave_salary_accrual_detail[i].employee_id,
                  leave_salary_accrual_detail[i].year,
                  leave_salary_accrual_detail[i].employee_id,
                  annual_leave_data[0].hims_d_leave_id,
                  leave_salary_accrual_detail[i].employee_id,
                  leave_salary_accrual_detail[i].year,
                  leave_salary_accrual_detail[i].month,
                ],
                // printQuery: false
              })
              .then((employee_leave_salary) => {
                debugger;
                // console.log("employee_leave_salary", employee_leave_salary)
                // console.log("leave_salary_accrual_detail", leave_salary_accrual_detail[i])
                if (employee_leave_salary.length > 0) {
                  let employee_leave_salary_header = employee_leave_salary[0];
                  if (employee_leave_salary[1].length === 0) {
                    if (isSingleEmployee) {
                      _mysql.rollBackTransaction(() => {
                        reject(
                          new Error("Please process employee yearly leaves")
                        );
                      });
                      return;
                    }
                    // resolve();
                    reject();
                  }
                  let monthly_leave = employee_leave_salary[1][0];
                  let detail_exisits = employee_leave_salary[2];

                  console.log("detail_exisits", detail_exisits);

                  if (employee_leave_salary_header.length > 0) {
                    if (detail_exisits.length > 0) {
                      resolve();
                      return;
                    }
                    let leave_days =
                      parseFloat(employee_leave_salary_header[0].leave_days) +
                      parseFloat(leave_salary_accrual_detail[i].leave_days);
                    let leave_salary_amount =
                      parseFloat(
                        employee_leave_salary_header[0].leave_salary_amount
                      ) +
                      parseFloat(leave_salary_accrual_detail[i].leave_salary);
                    let airticket_amount =
                      parseFloat(
                        employee_leave_salary_header[0].airticket_amount
                      ) +
                      parseFloat(leave_salary_accrual_detail[i].airfare_amount);
                    let balance_leave_days =
                      parseFloat(
                        employee_leave_salary_header[0].balance_leave_days
                      ) + parseFloat(leave_salary_accrual_detail[i].leave_days);
                    let balance_leave_salary_amount =
                      parseFloat(
                        employee_leave_salary_header[0]
                          .balance_leave_salary_amount
                      ) +
                      parseFloat(leave_salary_accrual_detail[i].leave_salary);
                    let balance_airticket_amount =
                      parseFloat(
                        employee_leave_salary_header[0].balance_airticket_amount
                      ) +
                      parseFloat(leave_salary_accrual_detail[i].airfare_amount);

                    let airfare_months =
                      parseFloat(
                        employee_leave_salary_header[0].airfare_months
                      ) + 1;

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
                  INSERT IGNORE INTO `hims_f_employee_leave_salary_detail`(employee_leave_salary_header_id,leave_days,\
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
                        leave_salary_accrual_detail[i].month,
                      ]
                    );

                    // if (i === leave_salary_accrual_detail.length - 1) {
                    _mysql
                      .executeQuery({ query: strQry, printQuery: false })
                      .then((update_employee_leave) => {
                        resolve();
                      })
                      .catch((e) => {
                        reject(e);
                      });
                    // }
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
                          "0",
                        ],
                        printQuery: false,
                      })
                      .then((employee_leave_header) => {
                        let IncludeValues = [
                          "employee_leave_salary_header_id",
                          "leave_days",
                          "leave_salary_amount",
                          "airticket_amount",
                        ];
                        let inputValues = [
                          {
                            employee_leave_salary_header_id:
                              employee_leave_header.insertId,
                            leave_days:
                              leave_salary_accrual_detail[i].leave_days,
                            leave_salary_amount:
                              leave_salary_accrual_detail[i].leave_salary,
                            airticket_amount:
                              leave_salary_accrual_detail[i].airfare_amount,
                          },
                        ];

                        _mysql
                          .executeQuery({
                            query:
                              "INSERT INTO hims_f_employee_leave_salary_detail(??) VALUES ?",
                            values: inputValues,
                            includeValues: IncludeValues,
                            extraValues: {
                              year: leave_salary_accrual_detail[0].year,
                              month: leave_salary_accrual_detail[0].month,
                            },
                            bulkInsertOrUpdate: true,
                            printQuery: false,
                          })
                          .then((leave_detail) => {
                            let monthly_close_balance =
                              monthly_leave.close_balance === null
                                ? 0
                                : parseFloat(monthly_leave.close_balance);

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
                              if (
                                projected_applied_leaves >
                                monthly_accruval_leave
                              ) {
                                projected_applied_leaves =
                                  projected_applied_leaves -
                                  monthly_accruval_leave;
                                accumulated_leaves =
                                  accumulated_leaves + monthly_accruval_leave;
                              } else {
                                projected_applied_leaves =
                                  monthly_accruval_leave -
                                  projected_applied_leaves;
                                monthly_close_balance =
                                  monthly_close_balance +
                                  projected_applied_leaves;
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
                                  monthly_leave.hims_f_employee_monthly_leave_id,
                                ],

                                // printQuery: false
                              })
                              .then((monthly_leave) => {
                                resolve();
                              })
                              .catch((error) => {
                                reject(error);
                              });
                          })
                          .catch((error) => {
                            reject(error);
                          });
                      })
                      .catch((e) => {
                        reject(e);
                      });
                  }
                } else {
                  if (isSingleEmployee) {
                    _mysql.rollBackTransaction(() => {
                      reject(
                        new Error("Please process employee yearly leaves")
                      );
                    });
                    return;
                  }
                  reject();
                  // resolve();
                }
              })
              .catch((e) => {
                reject(e);
              });
          })
        );
      }
      Promise.all(promiseAll)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function getOtManagement_bkp_13_06_2020(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();
      const _earnings = options.earnings;
      const empResult = options.empResult;

      const hrms_option = options.hrms_option;
      const over_time_comp = options.over_time_comp;
      const over_time = options.over_time[0];
      const current_earning_amt_array = options.current_earning_amt_array;
      const leave_salary = options.leave_salary;
      const decimal_places = options.decimal_places;

      let final_earning_amount = 0;
      let current_ot_amt_array = [];

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
            per_hour_salary = utilities.decimalPoints(
              per_hour_salary,
              decimal_places
            );
            current_ot_amt_array.push({
              earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
              amount: per_hour_salary,
            });
          }

          final_earning_amount = _.sumBy(current_ot_amt_array, (s) => {
            return parseFloat(s.amount);
          });

          resolve({ current_ot_amt_array, final_earning_amount });
        } else {
          _earnings.map((obj) => {
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
                .filter((f) => {
                  if (f.earnings_id == obj.earnings_id) {
                    return parseFloat(f.amount);
                  }
                })
                .value();

              let _per_day_salary = 0;
              let per_hour_salary = 0;

              if (hrms_option[0].ot_calculation == "F") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount[0].amount) /
                    parseFloat(empResult["total_days"])
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
                final_price = utilities.decimalPoints(
                  final_price,
                  decimal_places
                );
                current_ot_amt_array.push({
                  earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
                  amount: final_price,
                });
              }
            }
          });

          final_earning_amount = _.sumBy(current_ot_amt_array, (s) => {
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
  }).catch((e) => {
    options.next(e);
  });
}

function getOtManagement(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();
      const _earnings = options.earnings;
      const isLeaveSalary = options.leave_salary_sidhiqe === "Y" ? true : false;
      const empResult = options.empResult;
      // console.log("empResult", empResult);

      const hrms_option = options.hrms_option;
      const over_time_comp = options.over_time_comp;
      const over_time = options.over_time[0];
      const current_earning_amt_array = options.current_earning_amt_array;
      const leave_salary = options.leave_salary;
      const decimal_places = options.decimal_places;

      let final_earning_amount = 0;
      let current_ot_amt_array = [];

      let normal_ot_hours = 0;
      let wot_hours = 0;
      let hot_hours = 0;
      let normal_ot_cost = 0;
      let wot_cost = 0;
      let hot_cost = 0;
      //&& options.empResult.length > 0
      // toString issued fixed here.

      if (options.over_time.length > 0) {
        let normal_ot_hours_mins = empResult["ot_work_hours"]
          ? empResult["ot_work_hours"].toString().split(".")
          : 0;
        let wot_ot_hours_mins = empResult["ot_weekoff_hours"]
          ? empResult["ot_weekoff_hours"].toString().split(".")
          : 0;
        let hot_ot_hours_mins = empResult["ot_holiday_hours"]
          ? empResult["ot_holiday_hours"].toString().split(".")
          : 0;

        normal_ot_hours =
          parseInt(normal_ot_hours_mins[0]) +
          parseInt(normal_ot_hours_mins[1]) / 60;

        wot_hours =
          parseInt(wot_ot_hours_mins[0]) + parseInt(wot_ot_hours_mins[1]) / 60;
        hot_hours =
          parseInt(hot_ot_hours_mins[0]) + parseInt(hot_ot_hours_mins[1]) / 60;

        let ot_hours =
          parseFloat(
            empResult["ot_work_hours"] ? empResult["ot_work_hours"] : 0
          ) +
          parseFloat(
            empResult["ot_weekoff_hours"] ? empResult["ot_weekoff_hours"] : 0
          ) +
          parseFloat(
            empResult["ot_holiday_hours"] ? empResult["ot_holiday_hours"] : 0
          );

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
              parseFloat(normal_ot_hours);

            normal_ot_cost = over_time["working_day_rate"];
          }
          if (over_time["weekoff_day_rate"] > 0) {
            weekoff_day_amt =
              parseFloat(over_time["weekoff_day_rate"]) * parseFloat(wot_hours);

            wot_cost = over_time["weekoff_day_rate"];
          }
          if (over_time["holiday_rate"] > 0) {
            holiday_amt =
              parseFloat(over_time["holiday_rate"]) * parseFloat(hot_hours);

            hot_cost = over_time["holiday_rate"];
          }

          let total_ot_salary = working_day_amt + weekoff_day_amt + holiday_amt;

          if (total_ot_salary > 0) {
            total_ot_salary = utilities.decimalPoints(
              total_ot_salary,
              decimal_places
            );
            current_ot_amt_array.push({
              earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
              amount: total_ot_salary,
            });
          }

          final_earning_amount = _.sumBy(current_ot_amt_array, (s) => {
            return parseFloat(s.amount);
          });

          resolve({
            current_ot_amt_array,
            final_earning_amount,
            normal_ot_cost,
            wot_cost,
            hot_cost,
          });
        } else {
          _earnings.map((obj) => {
            // //OT Calculation

            if (
              obj["overtime_applicable"] == "Y" &&
              ot_hours != 0 &&
              leave_salary != "Y"
            ) {
              let earn_amount = obj["amount"];

              let _per_day_salary = 0;
              let per_hour_salary = 0;

              if (hrms_option[0].ot_calculation == "F") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount) / parseFloat(empResult["total_days"])
                );
              } else if (hrms_option[0].ot_calculation == "P") {
                _per_day_salary = parseFloat(
                  parseFloat(earn_amount) / parseFloat(empResult["total_days"])
                );
              } else if (hrms_option[0].ot_calculation == "A") {
                _per_day_salary = (parseFloat(earn_amount) * 12) / 365;
              }

              per_hour_salary =
                parseFloat(_per_day_salary) / parseFloat(Noof_Working_Hours);

              //ST--NORMAL OT
              normal_ot_cost =
                parseFloat(per_hour_salary) *
                parseFloat(over_time["working_day_hour"]);

              let ot_hour_price =
                parseFloat(normal_ot_cost) * parseFloat(normal_ot_hours);

              //END--NORMAL OT

              //ST--WEEK OFF OT
              wot_cost =
                parseFloat(per_hour_salary) *
                parseFloat(over_time["weekoff_day_hour"]);
              let ot_weekoff_price =
                parseFloat(wot_cost) * parseFloat(wot_hours);

              //END--WEEK OFF OT

              //ST--HOLIDAY OT
              hot_cost =
                parseFloat(per_hour_salary) *
                parseFloat(over_time["holiday_hour"]);
              let ot_holiday_price =
                parseFloat(hot_cost) * parseFloat(hot_hours);

              //ST--HOLIDAY OT
              let final_price =
                parseFloat(ot_hour_price) +
                parseFloat(ot_weekoff_price) +
                parseFloat(ot_holiday_price);

              if (final_price > 0) {
                final_price = utilities.decimalPoints(
                  final_price,
                  decimal_places
                );
                current_ot_amt_array.push({
                  earnings_id: over_time_comp[0].hims_d_earning_deduction_id,
                  amount: final_price,
                  normal_ot_cost,
                  wot_cost,
                  hot_cost,
                });
              }
            }
          });

          // final_earning_amount = _.sumBy(current_ot_amt_array, (s) => {
          //   return parseFloat(s.amount);
          // });

          let final_normal_ot_cost = 0;
          let final_wot_cost = 0;
          let final_hot_cost = 0;
          current_ot_amt_array.forEach((item) => {
            final_earning_amount =
              parseFloat(final_earning_amount) + parseFloat(item.amount);
            final_normal_ot_cost =
              parseFloat(final_normal_ot_cost) +
              parseFloat(item.normal_ot_cost);
            final_wot_cost =
              parseFloat(final_wot_cost) + parseFloat(item.wot_cost);
            final_hot_cost =
              parseFloat(final_hot_cost) + parseFloat(item.hot_cost);
          });

          resolve({
            current_ot_amt_array,
            final_earning_amount,
            normal_ot_cost: final_normal_ot_cost,
            wot_cost: final_wot_cost,
            hot_cost: final_hot_cost,
          });
        }
      } else {
        resolve({
          current_ot_amt_array,
          final_earning_amount,
          normal_ot_cost,
          wot_cost,
          hot_cost,
        });
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
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

      if (empResult.shortage_hours != null && shortage_comp.length > 0) {
        let Noof_Working_Hours =
          parseFloat(hrms_option[0].standard_working_hours) -
          parseFloat(hrms_option[0].standard_break_hours);

        _earnings.map((obj) => {
          //ShortAge Calculation
          if (obj["calculation_type"] == "V") {
            let earn_amount = _.chain(current_earning_amt_array)
              .filter((f) => {
                if (f.earnings_id == obj.earnings_id) {
                  return f.amount;
                }
              })
              .value();

            let _per_day_salary = parseFloat(
              parseFloat(earn_amount[0].amount) /
                parseFloat(empResult["total_days"])
            );

            let per_hour_salary = _per_day_salary / Noof_Working_Hours;

            per_hour_salary = per_hour_salary * empResult.shortage_hours;
            if (per_hour_salary > 0) {
              current_shortage_amt_array.push({
                deductions_id: shortage_comp[0].hims_d_earning_deduction_id,
                amount: per_hour_salary,
              });
            }
          }
        });

        final_deduction_amount = _.sumBy(current_shortage_amt_array, (s) => {
          return parseFloat(s.amount);
        });

        resolve({ current_shortage_amt_array, final_deduction_amount });
      } else {
        resolve({ current_shortage_amt_array, final_deduction_amount });
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function getEarningComponents(options) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      const _earnings = options.earnings;
      const empResult = options.empResult;
      const leave_salary = options.leave_salary;
      const _LeaveRule = options._LeaveRule;

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

      _earnings.map((obj) => {
        if (obj.calculation_type == "F") {
          if (
            leave_salary == null ||
            leave_salary == undefined ||
            leave_salary == "N"
          ) {
            // ED.limit_applicable, ED.limit_amount
            current_earning_amt = obj["amount"];
            if (
              obj["limit_applicable"] === "Y" &&
              parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])
            ) {
              current_earning_amt = obj["limit_amount"];
            }

            current_earning_per_day_salary = parseFloat(
              obj["amount"] / parseFloat(empResult["total_days"])
            );
          }
          // else if (leave_salary == "N") {
          //   leave_salary_days =
          //     parseFloat(empResult["total_days"]) -
          //     parseFloat(empResult["paid_leave"]);

          //   current_earning_per_day_salary = parseFloat(
          //     obj["amount"] / parseFloat(empResult["total_days"])
          //   );

          //   current_earning_amt =
          //     current_earning_per_day_salary * leave_salary_days;

          //   if (
          //     obj["limit_applicable"] === "Y" &&
          //     parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])
          //   ) {
          //     current_earning_amt = obj["limit_amount"];
          //   }
          // }
          else if (leave_salary == "Y") {
            current_earning_amt = 0;
            current_earning_per_day_salary = 0;
          }

          current_earning_amt = utilities.decimalPoints(
            current_earning_amt,
            decimal_places
          );

          current_earning_per_day_salary = utilities.decimalPoints(
            current_earning_per_day_salary,
            decimal_places
          );

          current_earning_amt_array.push({
            earnings_id: obj.earnings_id,
            amount: current_earning_amt,
            per_day_salary: current_earning_per_day_salary,
            component_type: obj.component_type,
          });
        } else if (obj["calculation_type"] == "V") {
          let leave_period =
            empResult["total_applied_days"] === null
              ? 0
              : parseFloat(empResult["total_applied_days"]);

          let annual_per_day_sal = 0;

          // console.log("total_days", empResult["total_days"]);
          // console.log("leave_salary", leave_salary);
          if (leave_salary == null || leave_salary == undefined) {
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
            if (
              obj["limit_applicable"] === "Y" &&
              parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])
            ) {
              current_earning_amt = obj["limit_amount"];
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

            if (
              obj["limit_applicable"] === "Y" &&
              parseFloat(current_earning_amt) > parseFloat(obj["limit_amount"])
            ) {
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

          current_earning_per_day_salary = utilities.decimalPoints(
            current_earning_per_day_salary,
            decimal_places
          );
          //Apply Leave Rule
          accrual_amount = accrual_amount + annual_per_day_sal;
          if (leave_salary != "Y") {
            let perday_salary = current_earning_amt / total_days;

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
                  // if (_LeaveRule[i].value_type == "RA") {
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

                    if (leave_rule_days > 0) {
                      balance_days = leave_rule_days;
                    } else {
                      balance_days = x;
                    }
                    leaves_till_date = x;

                    if (leaves_till_date > current_leave) {
                      balance_days = 0;
                    } else {
                      if (y > current_leave) {
                        y = y - current_leave;
                        balance_days = balance_days - y;
                      }
                    }
                  }
                  if (balance_days > 0) {
                    let split_sal = 0;
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

                  // }
                }
              }
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_earning_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
                current_earning_amt = obj["limit_amount"];
              }
            }

            current_earning_amt = utilities.decimalPoints(
              current_earning_amt,
              decimal_places
            );

            current_earning_per_day_salary = utilities.decimalPoints(
              current_earning_per_day_salary,
              decimal_places
            );

            current_earning_amt_array.push({
              earnings_id: obj.earnings_id,
              amount: current_earning_amt,
              per_day_salary: current_earning_per_day_salary,
              component_type: obj.component_type,
            });
          } else {
            current_earning_amt = utilities.decimalPoints(
              current_earning_amt,
              decimal_places
            );

            current_earning_per_day_salary = utilities.decimalPoints(
              current_earning_per_day_salary,
              decimal_places
            );

            current_earning_amt_array.push({
              earnings_id: obj.earnings_id,
              amount: current_earning_amt,
              per_day_salary: current_earning_per_day_salary,
              component_type: obj.component_type,
            });
          }
        }
      });

      final_earning_amount = _.sumBy(current_earning_amt_array, (s) => {
        return parseFloat(s.amount);
      });

      let gross_earn_amount = 0;
      current_earning_amt_array.forEach((item) => {
        // console.log("Item ", item);
        if (item.component_type != "OV") {
          gross_earn_amount =
            parseFloat(gross_earn_amount) + parseFloat(item.amount);
        }
      });

      final_earning_amount = utilities.decimalPoints(
        final_earning_amount,

        decimal_places
      );

      resolve({
        current_earning_amt_array,
        final_earning_amount,
        gross_earn_amount,
        accrual_amount,
      });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
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
      const decimal_places = options.decimal_places;
      const ls_applied = options.ls_applied;

      let current_deduction_amt = 0;
      let current_deduction_per_day_salary = 0;
      let current_deduction_amt_array = [];
      let final_deduction_amount = 0;
      let leave_salary_days = 0;

      if (_deduction.length == 0) {
        resolve({ current_deduction_amt_array, final_deduction_amount });
      }

      _deduction.map((obj) => {
        if (ls_applied.length > 0 && obj.component_type == "EEP") {
          current_deduction_per_day_salary = 0;
          current_deduction_amt = 0;
        } else {
          if (obj["calculation_type"] == "F") {
            debugger;
            console.log("obj", obj.component_type);

            if (
              leave_salary == null ||
              leave_salary == undefined ||
              leave_salary == "N" ||
              obj.component_type == "EEP"
            ) {
              current_deduction_amt = obj["amount"];
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_deduction_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
                current_deduction_amt = obj["limit_amount"];
              }
              current_deduction_per_day_salary =
                parseFloat(empResult["total_days"]) === 0
                  ? 0
                  : parseFloat(
                      obj["amount"] / parseFloat(empResult["total_days"])
                    );
            }
            // else if (leave_salary == "N") {
            // leave_salary_days =
            //   parseFloat(empResult["total_days"]) -
            //   parseFloat(empResult["paid_leave"]);

            // current_deduction_per_day_salary = parseFloat(
            //   obj["amount"] / parseFloat(empResult["total_days"])
            // );

            // current_deduction_amt =
            //   current_deduction_per_day_salary * leave_salary_days;
            // if (
            //   obj["limit_applicable"] === "Y" &&
            //   parseFloat(current_deduction_amt) >
            //   parseFloat(obj["limit_amount"])
            // ) {
            //   current_deduction_amt = obj["limit_amount"];
            // }
            // }
            else if (leave_salary == "Y") {
              current_deduction_amt = 0;
              current_deduction_per_day_salary = 0;
            }
          } else if (obj["calculation_type"] == "V") {
            if (leave_salary == null || leave_salary == undefined) {
              // if (hrms_option[0].salary_calendar == "F") {
              //   current_deduction_per_day_salary = parseFloat(
              //     obj["amount"] /
              //     parseFloat(hrms_option[0].salary_calendar_fixed_days)
              //   );

              //   let days =
              //     parseFloat(empResult["unpaid_leave"]) +
              //     parseFloat(empResult["absent_days"]);

              //   let amount = current_deduction_per_day_salary * days;
              //   current_deduction_amt = obj["amount"] - amount;
              // } else {
              current_deduction_per_day_salary = parseFloat(
                obj["amount"] / parseFloat(empResult["total_days"])
              );
              current_deduction_amt =
                current_deduction_per_day_salary *
                parseFloat(empResult["total_paid_days"]);
              // }
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_deduction_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
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

              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_deduction_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
                current_deduction_amt = obj["limit_amount"];
              }
            } else if (leave_salary == "Y") {
              current_deduction_per_day_salary = 0;
              current_deduction_amt = 0;
            }
          }
        }

        current_deduction_amt = utilities.decimalPoints(
          current_deduction_amt,
          decimal_places
        );

        current_deduction_per_day_salary = utilities.decimalPoints(
          current_deduction_per_day_salary,
          decimal_places
        );

        current_deduction_amt_array.push({
          deductions_id: obj.deductions_id,
          amount: current_deduction_amt,
          per_day_salary: current_deduction_per_day_salary,
        });
      });

      final_deduction_amount = _.sumBy(current_deduction_amt_array, (s) => {
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
  }).catch((e) => {
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
      const decimal_places = options.decimal_places;
      const ls_applied = options.ls_applied;

      let current_contribution_amt = 0;
      let current_contribution_per_day_salary = 0;
      let leave_salary_days = 0;
      let final_contribution_amount = 0;
      let current_contribution_amt_array = [];

      if (_contrubutions.length == 0) {
        resolve({ current_contribution_amt_array, final_contribution_amount });
      }

      _contrubutions.map((obj) => {
        // ContrubutionsComponents();
        if (ls_applied.length > 0 && obj.component_type == "ERP") {
          current_contribution_amt = 0;
          current_contribution_per_day_salary = 0;
        } else {
          if (obj["calculation_type"] == "F") {
            if (
              leave_salary == null ||
              leave_salary == undefined ||
              leave_salary == "N" ||
              obj.component_type == "ERP"
            ) {
              current_contribution_amt = obj["amount"];
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_contribution_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
                current_contribution_amt = obj["limit_amount"];
              }
              current_contribution_per_day_salary =
                parseFloat(empResult["total_days"]) == 0
                  ? 0
                  : parseFloat(
                      obj["amount"] / parseFloat(empResult["total_days"])
                    );
            }
            // else if (leave_salary == "N") {
            //   leave_salary_days =
            //     parseFloat(empResult["total_days"]) -
            //     parseFloat(empResult["paid_leave"]);

            //   current_contribution_per_day_salary = parseFloat(
            //     obj["amount"] / parseFloat(empResult["total_days"])
            //   );

            //   current_contribution_amt =
            //     current_contribution_per_day_salary * leave_salary_days;
            //   if (
            //     obj["limit_applicable"] === "Y" &&
            //     parseFloat(current_contribution_amt) >
            //     parseFloat(obj["limit_amount"])
            //   ) {
            //     current_contribution_amt = obj["limit_amount"];
            //   }
            // }
            else if (leave_salary == "Y") {
              current_contribution_amt = 0;
              current_contribution_per_day_salary = 0;
            }
          } else if (obj["calculation_type"] == "V") {
            if (leave_salary == null || leave_salary == undefined) {
              // if (hrms_option[0].salary_calendar == "F") {
              //   current_contribution_per_day_salary = parseFloat(
              //     obj["amount"] /
              //     parseFloat(hrms_option[0].salary_calendar_fixed_days)
              //   );

              //   let days =
              //     parseFloat(empResult["unpaid_leave"]) +
              //     parseFloat(empResult["absent_days"]);

              //   let amount = current_contribution_per_day_salary * days;
              //   current_contribution_amt = obj["amount"] - amount;
              // } else {
              current_contribution_per_day_salary = parseFloat(
                obj["amount"] / parseFloat(empResult["total_days"])
              );
              current_contribution_amt =
                current_contribution_per_day_salary *
                parseFloat(empResult["total_paid_days"]);
              // }
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_contribution_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
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
              if (
                obj["limit_applicable"] === "Y" &&
                parseFloat(current_contribution_amt) >
                  parseFloat(obj["limit_amount"])
              ) {
                current_contribution_amt = obj["limit_amount"];
              }
            } else if (leave_salary == "Y") {
              current_contribution_per_day_salary = 0;
              current_contribution_amt = 0;
            }
          }
        }

        current_contribution_amt = utilities.decimalPoints(
          current_contribution_amt,
          decimal_places
        );
        current_contribution_amt_array.push({
          contributions_id: obj.contributions_id,
          amount: current_contribution_amt,
          // per_day_salary: current_contribution_per_day_salary
        });
      });

      final_contribution_amount = utilities.decimalPoints(
        final_contribution_amount,
        decimal_places
      );

      final_contribution_amount = _.sumBy(
        current_contribution_amt_array,
        (s) => {
          return parseFloat(s.amount);
        }
      );

      resolve({ current_contribution_amt_array, final_contribution_amount });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function getLoanDueandPayable(options) {
  return new Promise((resolve, reject) => {
    try {
      const _loan = options.loan;
      const _loanPayable = options.loanPayable;
      const empResult = options.empResult;

      let total_loan_due_amount = 0;
      let total_loan_payable_amount = 0;
      let current_loan_array = [];

      // console.log("_loan", _loan)
      if (empResult.partial_attendance === "Y") {
        resolve({
          total_loan_due_amount,
          total_loan_payable_amount,
          current_loan_array,
        });
      }
      if (_loan.length == 0) {
        if (_loanPayable.length == 0) {
          resolve({
            total_loan_due_amount,
            total_loan_payable_amount,
            current_loan_array,
          });
        } else {
          total_loan_payable_amount = _.sumBy(_loanPayable, (s) => {
            return parseFloat(s.approved_amount);
          });

          resolve({
            total_loan_due_amount,
            total_loan_payable_amount,
            current_loan_array,
          });
        }
      }

      current_loan_array = _.map(_loan, (s) => {
        return {
          loan_application_id: s.hims_f_loan_application_id,
          loan_due_amount: s.loan_skip_months > 0 ? 0 : s.installment_amount,
          balance_amount: s.pending_loan,
        };
      });

      total_loan_due_amount = _.sumBy(current_loan_array, (s) => {
        return parseFloat(s.loan_due_amount);
      });
      if (_loanPayable.length != 0) {
        total_loan_payable_amount = _.sumBy(_loanPayable, (s) => {
          return parseFloat(s.approved_amount);
        });
      }

      resolve({
        total_loan_due_amount,
        total_loan_payable_amount,
        current_loan_array,
      });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
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

      advance_due_amount = _.sumBy(_advance, (s) => {
        return parseFloat(s.payment_amount);
      });

      current_deduct_compoment = _.map(_dedcomponent, (s) => {
        return {
          deductions_id: s.hims_d_earning_deduction_id,
          amount: advance_due_amount,
        };
      });

      resolve({ advance_due_amount, current_deduct_compoment });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
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
          final_deduction_amount,
        });
      }

      current_earn_compoment = _.chain(_miscellaneous)
        .filter((f) => {
          return f.category == "E";
        })
        .value();

      current_earn_compoment = _.map(current_earn_compoment, (s) => {
        return {
          earnings_id: s.earning_deductions_id,
          amount: s.amount,
        };
      });

      current_deduct_compoment = _.chain(_miscellaneous)
        .filter((f) => {
          return f.category == "D";
        })
        .value();
      current_deduct_compoment = _.map(current_deduct_compoment, (s) => {
        return {
          deductions_id: s.earning_deductions_id,
          amount: s.amount,
        };
      });

      final_earning_amount = _.sumBy(current_earn_compoment, (s) => {
        return parseFloat(s.amount);
      });

      final_deduction_amount = _.sumBy(current_deduct_compoment, (s) => {
        return parseFloat(s.amount);
      });

      resolve({
        current_earn_compoment,
        current_deduct_compoment,
        final_earning_amount,
        final_deduction_amount,
      });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function UpdateProjectWisePayroll_backp_13_06_2020(options) {
  console.log("UpdateProjectWisePayroll");
  return new Promise((resolve, reject) => {
    try {
      let _mysql = options._mysql;

      const decimal_places = options.decimal_places;
      const inputParam = options.inputParam;
      let strQry = "";

      const utilities = new algaehUtilities();

      console.log(
        "inputParam.project_employee_id",
        inputParam.project_employee_id
      );
      if (inputParam.project_employee_id.length === 0) {
        resolve();
        return;
      }
      _mysql
        .executeQuery({
          query:
            "Select hims_f_project_wise_payroll_id,employee_id, worked_hours, worked_minutes, month, year,\
              COALESCE(worked_hours) + COALESCE(concat(floor(worked_minutes/60)  ,'.',worked_minutes%60),0) as complete_hours\
                from hims_f_project_wise_payroll where year=? and month=? and  employee_id in (?);\
                select employee_id, gross_salary from hims_f_salary S where \
                `year` = ? and `month` = ?;",
          values: [
            inputParam.year,
            inputParam.month,
            inputParam.project_employee_id,
            inputParam.year,
            inputParam.month,
          ],
          printQuery: false,
        })
        .then((result) => {
          let project_wise_payroll = result[0];
          let salary_data = result[1];

          if (project_wise_payroll.length > 0) {
            let finalData = {};
            _.chain(project_wise_payroll)
              .groupBy((g) => g.employee_id)
              .map((item) => {
                finalData[
                  _.get(_.find(item, "employee_id"), "employee_id")
                ] = _.sumBy(item, (s) => {
                  return s.complete_hours;
                });
              })
              .value();

            for (let z = 0; z < project_wise_payroll.length; z++) {
              let cost = 0;
              let complete_hours = parseInt(
                project_wise_payroll[z]["worked_hours"]
              );
              let total_complete_hours =
                finalData[project_wise_payroll[z]["employee_id"]];
              let worked_minutes = project_wise_payroll[z]["worked_minutes"];
              complete_hours += parseInt(worked_minutes / 60);
              let mins = String("0" + parseInt(worked_minutes % 60)).slice(-2);
              complete_hours = complete_hours + "." + mins;

              let net_salary_amt = _.filter(salary_data, (f) => {
                return f.employee_id == project_wise_payroll[z]["employee_id"];
              });

              if (parseFloat(total_complete_hours) > 0) {
                cost =
                  parseFloat(net_salary_amt[0].gross_salary) /
                  parseFloat(total_complete_hours);
              } else {
                cost = 0;
              }
              cost = cost * complete_hours;

              cost = utilities.decimalPoints(cost, decimal_places);

              _mysql
                .executeQuery({
                  query: `SELECT ${project_wise_payroll[z].hims_f_project_wise_payroll_id} as project_wise_payroll_id, SE.earnings_id, \
                round( (SE.amount / ${total_complete_hours})*${complete_hours}, ${decimal_places}) as amount FROM  \
                hims_f_salary S inner join hims_f_salary_earnings SE on S.hims_f_salary_id=SE.salary_header_id WHERE \
                employee_id = ${project_wise_payroll[z].employee_id} and month= ${project_wise_payroll[z].month} \
                and year=${project_wise_payroll[z].year};SELECT ${project_wise_payroll[z].hims_f_project_wise_payroll_id} as project_wise_payroll_id, SD.deductions_id, \
                round( (SD.amount / ${total_complete_hours})*${complete_hours}, ${decimal_places}) FROM  \
                hims_f_salary S inner join hims_f_salary_deductions SD on S.hims_f_salary_id=SD.salary_header_id WHERE \
                employee_id = ${project_wise_payroll[z].employee_id} and month= ${project_wise_payroll[z].month} \
                and year=${project_wise_payroll[z].year}`,
                  printQuery: false,
                })
                .then((project_payroll_breakup) => {
                  const earning_result = project_payroll_breakup[0];
                  const deduction_result = project_payroll_breakup[1];

                  strQry += _mysql.mysqlQueryFormat(
                    "UPDATE hims_f_project_wise_payroll set cost=? where hims_f_project_wise_payroll_id=?; ",
                    [
                      cost,
                      project_wise_payroll[z].hims_f_project_wise_payroll_id,
                    ]
                  );

                  for (let x = 0; x < earning_result.length; x++) {
                    strQry += _mysql.mysqlQueryFormat(
                      `INSERT INTO hims_f_project_wise_earnings(project_wise_payroll_id, earnings_id, amount) \
                    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE amount = ?;`,
                      [
                        earning_result[x].project_wise_payroll_id,
                        earning_result[x].earnings_id,
                        earning_result[x].amount,
                        earning_result[x].amount,
                      ]
                    );
                  }
                  for (let y = 0; y < deduction_result.length; y++) {
                    strQry += _mysql.mysqlQueryFormat(
                      `INSERT INTO hims_f_project_wise_deductions(project_wise_payroll_id, deductions_id, amount) \
                    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE amount = ?;`,
                      [
                        deduction_result[y].project_wise_payroll_id,
                        deduction_result[y].deductions_id,
                        deduction_result[y].amount,
                        deduction_result[y].amount,
                      ]
                    );
                  }

                  if (z === project_wise_payroll.length - 1) {
                    console.log("strQry", strQry);
                    _mysql
                      .executeQuery({
                        query: strQry,
                        printQuery: false,
                      })
                      .then((project_payroll) => {
                        resolve();
                      })
                      .catch((e) => {
                        reject(e);
                      });
                  }
                })
                .catch((e) => {
                  reject(e);
                });
            }

            // console.log("Project Job Costong")
          } else {
            resolve();
          }
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
//created by:irfan
function UpdateProjectWisePayroll(options) {
  return new Promise((resolve, reject) => {
    try {
      // const utilities = new algaehUtilities();
      const inputParam = options.inputParam;

      if (inputParam.project_employee_id.length === 0) {
        resolve();
        return;
      }

      if (options.attendance_type == "DMP") {
        let _mysql = options._mysql;

        // const decimal_places = options.decimal_places;

        let strQry = "";

        let pjc_hour_price = options.pjc_hour_price;
        let employee_basic_earned = options.employee_basic_earned;

        _mysql

          .executeQuery({
            query: `Select hims_f_project_wise_payroll_id,employee_id, month, year,
            coalesce(basic_hours+floor(basic_minutes/60)  +round((basic_minutes%60)/60,2),0) as basic_hours,
            coalesce(ot_hours+floor(ot_minutes/60)  +round((ot_minutes%60)/60,2),0) as ot_hours,
            coalesce(wot_hours+floor(wot_minutes/60)  +round((wot_minutes%60)/60,2),0) as wot_hours,
            coalesce(hot_hours+floor(hot_minutes/60)  +round((hot_minutes%60)/60,2),0) as hot_hours,
            coalesce(worked_hours+floor(worked_minutes/60) +round((worked_minutes%60)/60,2),0) as worked_hours
            from hims_f_project_wise_payroll where year=? and month=? and  employee_id in (?);
            Select hims_f_project_wise_payroll_id,employee_id, month, year,
            coalesce(sum(basic_hours)+floor(sum(basic_minutes)/60)  +round((sum(basic_minutes)%60)/60,2),0) as basic_hours,
            coalesce(sum(ot_hours)+floor(sum(ot_minutes)/60)  +round((sum(ot_minutes)%60)/60,2),0) as ot_hours,
            coalesce(sum(wot_hours)+floor(sum(wot_minutes)/60)  +round((sum(wot_minutes)%60)/60,2),0) as wot_hours,
            coalesce(sum(hot_hours)+floor(sum(hot_minutes)/60)  +round((sum(hot_minutes)%60)/60,2),0) as hot_hours,
            coalesce(sum(worked_hours)+floor(sum(worked_minutes)/60) +round((sum(worked_minutes)%60)/60,2),0) as worked_hours
            from hims_f_project_wise_payroll where year=? and month=? and  employee_id in (?) group by employee_id;`,
            values: [
              inputParam.year,
              inputParam.month,
              inputParam.project_employee_id,
              inputParam.year,
              inputParam.month,
              inputParam.project_employee_id,
            ],
            printQuery: false,
          })
          .then((result) => {
            inputParam.project_employee_id.forEach((employee_id) => {
              let worked_hr = result[1].find((f) => {
                return f.employee_id == employee_id;
              });

              // console.log("worked_hr:", worked_hr);

              let total_basic_hours = worked_hr?.basic_hours
                ? worked_hr["basic_hours"]
                : 0;
              let basic_salary = employee_basic_earned[employee_id];

              // console.log("total_basic_hours:", total_basic_hours);
              // console.log("basic_salary:", basic_salary);

              let basic_cost =
                parseFloat(total_basic_hours) === 0
                  ? 0
                  : parseFloat(basic_salary) / parseFloat(total_basic_hours);

              // console.log("basic_cost:", basic_cost);

              pjc_hour_price[employee_id] = {
                ...pjc_hour_price[employee_id],
                basic_cost,
              };
            });

            // console.log("pjc_hour_price:", pjc_hour_price);

            if (result[0].length > 0) {
              result[0].forEach((project) => {
                let price_list = pjc_hour_price[project["employee_id"]];

                let basic_cost = 0;
                let ot_cost = 0;
                let wot_cost = 0;
                let hot_cost = 0;
                let cost = 0;

                basic_cost =
                  parseFloat(project["basic_hours"]) *
                  parseFloat(price_list["basic_cost"]);
                ot_cost =
                  parseFloat(project["ot_hours"]) *
                  parseFloat(price_list["normal_ot_cost"]);
                wot_cost =
                  parseFloat(project["wot_hours"]) *
                  parseFloat(price_list["wot_cost"]);
                hot_cost =
                  parseFloat(project["hot_hours"]) *
                  parseFloat(price_list["hot_cost"]);

                cost = basic_cost + ot_cost + wot_cost + hot_cost;

                strQry += ` UPDATE hims_f_project_wise_payroll set basic_cost=${basic_cost}, ot_cost=${ot_cost},
              wot_cost=${wot_cost}, hot_cost=${hot_cost},cost=${cost} where hims_f_project_wise_payroll_id=${project.hims_f_project_wise_payroll_id}; `;
              });

              _mysql
                .executeQuery({
                  query: strQry,
                  printQuery: false,
                })
                .then((project_payroll) => {
                  resolve();
                })
                .catch((e) => {
                  reject(e);
                });
            } else {
              resolve();
            }
            //----------------------------
          })
          .catch((e) => {
            // console.log("ERR90:", e);
            reject(e);
          });
      } else {
        resolve();
        return;
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

function InsertGratuityProvision(options) {
  return new Promise((resolve, reject) => {
    try {
      // console.log("promiseAll")
      let _mysql = options._mysql;
      const inputParam = options.inputParam;
      const decimal_places = options.decimal_places;

      const utilities = new algaehUtilities();

      _mysql
        .executeQuery({
          query:
            "select date_of_joining, hims_d_employee_id, date_of_resignation, employee_status, employe_exit_type, \
            (datediff(date(?),date(date_of_joining)))/365 endOfServiceYears, employee_code, exit_date,\
            full_name, arabic_name, sex, employee_type, employee_designation_id, date_of_birth, gratuity_encash \
            from hims_d_employee where gratuity_applicable = 'Y' and hims_d_employee_id in(?);\
            select * from hims_d_end_of_service_options;",
          values: [inputParam.salary_end_date, inputParam.employee_id],
          // printQuery: false
        })
        .then((result) => {
          const _employee = result[0];
          const _options = result[1];

          if (_employee.length == 0) {
            resolve();
            return;
          }
          if (_options.length == 0) {
            resolve();
            return;
          }
          const _optionsDetals = _options[0];
          if (_optionsDetals.gratuity_provision == 1) {
            let strQry = "";
            // let promiseAll = [];

            for (let k = 0; k < _employee.length; k++) {
              let _eligibleDays = 0;
              // promiseAll.push(
              new Promise((resolve, reject) => {
                try {
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

                  let gratuity_month =
                    parseFloat(inputParam.month) === 1
                      ? 12
                      : parseFloat(inputParam.month) - 1;
                  let gratuity_year =
                    parseFloat(inputParam.month) === 1
                      ? parseFloat(inputParam.year) - 1
                      : parseFloat(inputParam.year);

                  _mysql
                    .executeQuery({
                      query:
                        "select hims_d_employee_earnings_id,employee_id, earnings_id,earning_deduction_description,\
                          EE.short_desc, amount from hims_d_employee_earnings EE, hims_d_earning_deduction ED where \
                          ED.hims_d_earning_deduction_id = EE.earnings_id \
                          and EE.employee_id=? and ED.hims_d_earning_deduction_id in(?) and ED.record_status='A';\
                          select acc_gratuity from hims_f_gratuity_provision where employee_id = ? and year = ? and month = ?",
                      values: [
                        _employee[k].hims_d_employee_id,
                        _componentsList_total,
                        _employee[k].hims_d_employee_id,
                        gratuity_year,
                        gratuity_month,
                      ],
                      // printQuery: false
                    })
                    .then((result_data) => {
                      let earnings = result_data[0];
                      let gratuity_data = result_data[1];
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
                        const empEOSYears = parseFloat(
                          _employee[k].endOfServiceYears
                        );
                        let difference =
                          empEOSYears - _optionsDetals.from_service_range1;
                        if (difference > 0) {
                          let hirearchical =
                            _optionsDetals.from_service_range1 *
                            _optionsDetals.eligible_days1;
                          _eligibleDays = hirearchical;
                          difference =
                            empEOSYears - _optionsDetals.from_service_range2;
                          if (difference > 0) {
                            hirearchical =
                              empEOSYears - _optionsDetals.from_service_range2;
                            if (hirearchical > 0) {
                              hirearchical =
                                empEOSYears -
                                _optionsDetals.from_service_range3;
                              if (hirearchical > 0) {
                                hirearchical =
                                  empEOSYears -
                                  _optionsDetals.from_service_range4;

                                _eligibleDays +=
                                  (empEOSYears -
                                    _optionsDetals.from_service_range3) *
                                  _optionsDetals.eligible_days5;
                              } else {
                                _eligibleDays +=
                                  (empEOSYears -
                                    _optionsDetals.from_service_range3) *
                                  _optionsDetals.eligible_days4;
                              }
                            } else {
                              _eligibleDays +=
                                (empEOSYears -
                                  _optionsDetals.from_service_range2) *
                                _optionsDetals.eligible_days3;
                            }
                          } else {
                            _eligibleDays +=
                              (empEOSYears -
                                _optionsDetals.from_service_range1) *
                              _optionsDetals.eligible_days2;
                          }
                        } else {
                          _eligibleDays =
                            empEOSYears * _optionsDetals.eligible_days1;
                        }
                        // let by =
                        //   _employee[k].endOfServiceYears -
                        //   _optionsDetals.from_service_range1;
                        // let ted = 0;
                        // if (by > 0) {
                        //   ted =
                        //     _optionsDetals.from_service_range1 *
                        //     _optionsDetals.eligible_days1;
                        //   by =
                        //     _employee[k].endOfServiceYears -
                        //     _optionsDetals.from_service_range2;
                        //   if (by > 0) {
                        //     ted =
                        //       ted +
                        //       _optionsDetals.from_service_range2 *
                        //       _optionsDetals.eligible_days2;

                        //     by =
                        //       _employee[k].endOfServiceYears -
                        //       _optionsDetals.from_service_range3;
                        //     if (by > 0) {
                        //       ted =
                        //         ted +
                        //         _optionsDetals.from_service_range3 *
                        //         _optionsDetals.eligible_days3;

                        //       by =
                        //         _employee[k].endOfServiceYears -
                        //         _optionsDetals.from_service_range3;
                        //       if (by > 0) {
                        //         ted =
                        //           ted +
                        //           _optionsDetals.from_service_range4 *
                        //           _optionsDetals.eligible_days4;

                        //         by =
                        //           _employee[k].endOfServiceYears -
                        //           _optionsDetals.from_service_range4;
                        //         if (by > 0) {
                        //           ted =
                        //             ted +
                        //             _optionsDetals.from_service_range5 *
                        //             _optionsDetals.eligible_days5;
                        //         }
                        //       } else {
                        //         let daysAvilable =
                        //           _employee[k].endOfServiceYears -
                        //           _optionsDetals.from_service_range3;

                        //         _eligibleDays =
                        //           ted +
                        //           daysAvilable * _optionsDetals.eligible_days4;
                        //       }
                        //     } else {
                        //       let daysAvilable =
                        //         _employee[k].endOfServiceYears -
                        //         _optionsDetals.from_service_range2;

                        //       _eligibleDays =
                        //         ted +
                        //         daysAvilable * _optionsDetals.eligible_days3;
                        //     }
                        //   } else {
                        //     let daysAvilable =
                        //       _employee[k].endOfServiceYears -
                        //       _optionsDetals.from_service_range1;

                        //     // if (_employee[k].hims_d_employee_id === 153) {
                        //     //   console.log("_employee[k].endOfServiceYears", _employee[k].endOfServiceYears)
                        //     //   console.log("_optionsDetals.from_service_range1", _optionsDetals.from_service_range1)
                        //     //   console.log("_optionsDetals.from_service_range1", _optionsDetals.from_service_range1)
                        //     //   console.log("ted", ted)
                        //     //   console.log(" _optionsDetals.eligible_days2", _optionsDetals.eligible_days2)
                        //     //   console.log("daysAvilable", daysAvilable)
                        //     // }

                        //     _eligibleDays =
                        //       ted +
                        //       daysAvilable * _optionsDetals.eligible_days2;
                        //   }
                        // } else {
                        //   ted =
                        //     _employee[k].endOfServiceYears *
                        //     _optionsDetals.eligible_days1;
                        // }
                        // ted = _eligibleDays;
                      }

                      const _sumOfTotalEarningComponents = _.sumBy(
                        earnings,
                        (s) => {
                          return s.amount;
                        }
                      );
                      let gratuity = 0;

                      if (_optionsDetals.end_of_service_calculation == "AN") {
                        gratuity = (_sumOfTotalEarningComponents * 12) / 365;
                      } else if (
                        _optionsDetals.end_of_service_calculation == "FI"
                      ) {
                        gratuity = _sumOfTotalEarningComponents / 30;
                      }
                      gratuity = utilities.decimalPoints(
                        gratuity,
                        decimal_places
                      );

                      // console.log("_eligibleDays", _eligibleDays)
                      // console.log("gratuity", gratuity)

                      let _computatedAmoutSum =
                        parseFloat(_eligibleDays) * parseFloat(gratuity);

                      _computatedAmoutSum = utilities.decimalPoints(
                        _computatedAmoutSum,
                        decimal_places
                      );

                      // if (_employee[k].hims_d_employee_id === 153) {
                      //   console.log("gratuity_data", gratuity_data)
                      //   console.log("_computatedAmoutSum", _computatedAmoutSum)
                      //   console.log("gratuity_encash", _employee[k].gratuity_encash)
                      //   console.log("hims_d_employee_id", _employee[k].hims_d_employee_id)
                      // }

                      let gratuity_amount = 0;
                      if (gratuity_data.length > 0) {
                        gratuity_amount =
                          parseFloat(_computatedAmoutSum) -
                          (parseFloat(gratuity_data[0].acc_gratuity) +
                            parseFloat(_employee[k].gratuity_encash));
                      } else {
                        gratuity_amount = _computatedAmoutSum;
                      }
                      _computatedAmoutSum =
                        parseFloat(_computatedAmoutSum) -
                        parseFloat(_employee[k].gratuity_encash);

                      gratuity_amount = utilities.decimalPoints(
                        gratuity_amount,
                        decimal_places
                      );

                      _computatedAmoutSum = utilities.decimalPoints(
                        _computatedAmoutSum,
                        decimal_places
                      );

                      strQry += mysql.format(
                        "INSERT INTO `hims_f_gratuity_provision`(`employee_id`,`year`,\
                      `month`,`gratuity_amount`, `acc_gratuity`) VALUE(?,?,?,?,?) \
                      ON DUPLICATE KEY UPDATE `gratuity_amount`=?,`acc_gratuity`=?;",
                        [
                          _employee[k].hims_d_employee_id,
                          inputParam.year,
                          inputParam.month,
                          gratuity_amount,
                          _computatedAmoutSum,
                          gratuity_amount,
                          _computatedAmoutSum,
                        ]
                      );

                      if (k === _employee.length - 1) {
                        resolve();
                      }
                    })
                    .catch((e) => {
                      reject(e);
                    });
                } catch (e) {
                  reject(e);
                }
              })
                .then((result) => {
                  _mysql
                    .executeQuery({
                      query: strQry,
                      printQuery: false,
                    })
                    .then((result) => {
                      resolve();
                    })
                    .catch((e) => {
                      reject(e);
                    });
                })
                .catch((e) => {
                  reject(e);
                });
            }
          } else {
            resolve();
          }
        })
        .catch((e) => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}
function UpdateLeaveSalaryProvission(options) {
  return new Promise((resolve, reject) => {
    try {
      let inputParam = options.inputParam;
      let _mysql = options._mysql;

      let strQry = "";

      const utilities = new algaehUtilities();

      for (let i = 0; i < inputParam._leave_salary_acc.length; i++) {
        _mysql
          .executeQuery({
            query:
              "select * from `hims_f_employee_leave_salary_header` where employee_id=?",
            values: [inputParam._leave_salary_acc[i].employee_id],
            // printQuery: false
          })
          .then((leave_salary_header) => {
            let balance_leave_days =
              parseFloat(leave_salary_header[0].balance_leave_days) -
              parseFloat(inputParam._leave_salary_acc[i].leave_salary_days);
            let balance_leave_salary_amount =
              parseFloat(leave_salary_header[0].balance_leave_salary_amount) -
              parseFloat(
                inputParam._leave_salary_acc[i].leave_salary_accrual_amount
              );

            strQry += _mysql.mysqlQueryFormat(
              "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
              `balance_leave_salary_amount` = ? where hims_f_employee_leave_salary_header_id=?;",
              [
                balance_leave_days,
                balance_leave_salary_amount,
                leave_salary_header[0].hims_f_employee_leave_salary_header_id,
              ]
            );

            if (i === inputParam._leave_salary_acc.length - 1) {
              _mysql
                .executeQuery({
                  query: strQry,
                  // printQuery: false
                })
                .then((project_wise_payroll) => {
                  resolve();
                })
                .catch((e) => {
                  reject(e);
                });
            }
          })
          .catch((e) => {
            reject(e);
          });
      }
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    options.next(e);
  });
}

export function getHrmsOptions(req, res, next) {
  const _mysql = new algaehMysql();
  try {
    _mysql
      .executeQuery({
        query: `select annual_leave_calculation from hims_d_hrms_options`,
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result.length > 0) {
          const { annual_leave_calculation } = result[0];
          req.annual_leave_calculation = annual_leave_calculation;
        }
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (error) {
    _mysql.releaseConnection();
    next(error);
  }
}
