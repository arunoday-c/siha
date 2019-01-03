"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";
import moment from "moment";
import _ from "lodash";

//created by irfan:
let processSalary = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.query);
    const month_number = moment(input.yearAndMonth).format("MM");
    const year = moment(input.yearAndMonth).format("YYYY");
    debugLog("month_number:", month_number);
    debugLog("year:", year);
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_attendance_monthly_id, employee_id, year, month, hospital_id, sub_department_id, total_days,\
        present_days, absent_days, total_work_days, total_weekoff_days,\
        total_holidays, total_leave, paid_leave, unpaid_leave, total_paid_days\
        from hims_f_attendance_monthly where `year`=? and `month`=? and hospital_id=?",
        [year, month_number, input.hospital_id],
        (error, empResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          debugLog("empResult:", empResult);
          for (let i = 0; i < empResult.length; i++) {
            let final_earning_amount = 0;
            let current_earning_amt_array = [];

            let final_deduction_amount = 0;
            let current_deduction_amt_array = [];

            let final_contribution_amount = 0;
            let current_contribution_amt_array = [];

            new Promise((resolve, reject) => {
              try {
                //for  each employee this is earning calculation
                connection.query(
                  "select hims_d_employee_earnings_id,employee_id,earnings_id,amount,EE.formula,allocate,\
                  EE.calculation_method,EE.calculation_type,ED.component_frequency\
                  from hims_d_employee_earnings EE inner join hims_d_earning_deduction ED\
                  on EE.earnings_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
                  where ED.component_frequency='M' and ED.component_category='E' and EE.employee_id=?",
                  [empResult[i]["employee_id"]],
                  (error, earningResult) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
                    debugLog(
                      "earningResult emp:" + empResult[i]["employee_id"],
                      earningResult
                    );
                    for (let j = 0; j < earningResult.length; j++) {
                      let current_earning_amt = 0;
                      let current_earning_per_day_salary = 0;

                      if (earningResult[j]["calculation_type"] == "F") {
                        current_earning_amt = earningResult[j]["amount"];
                        current_earning_per_day_salary = parseFloat(
                          earningResult[j]["amount"] /
                            parseFloat(empResult[i]["total_days"])
                        );
                      } else if (earningResult[j]["calculation_type"] == "V") {
                        current_earning_per_day_salary = parseFloat(
                          earningResult[j]["amount"] /
                            parseFloat(empResult[i]["total_days"])
                        );

                        current_earning_amt =
                          current_earning_per_day_salary *
                          parseFloat(empResult[i]["total_paid_days"]);
                      }

                      current_earning_amt_array.push({
                        earnings_id: earningResult[j]["earnings_id"],
                        amount: current_earning_amt,
                        per_day_salary: current_earning_per_day_salary
                      });
                      final_earning_amount += parseFloat(current_earning_amt);

                      if (j == earningResult.length - 1) {
                        debugLog(
                          "current_earning_amt_array:",
                          current_earning_amt_array
                        );
                        debugLog("final_earning_amount:", final_earning_amount);
                        resolve({});
                      }
                    }
                  }
                );
              } catch (e) {
                reject(e);
              }
            }).then(EarningCalResult => {
              debugLog("first then:", "EarningCalResult");

              new Promise((resolve, reject) => {
                try {
                  ////for  each employee this is deduction calculation

                  connection.query(
                    "select hims_d_employee_deductions_id,employee_id,deductions_id,amount,EMP_D.formula,\
                allocate,EMP_D.calculation_method,EMP_D.calculation_type,ED.component_frequency from \
                hims_d_employee_deductions EMP_D inner join hims_d_earning_deduction ED\
                on EMP_D.deductions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
                where ED.component_frequency='M'  and ED.component_category='D' and EMP_D.employee_id=?  ",
                    [empResult[i]["employee_id"]],
                    (error, deductionResult) => {
                      if (error) {
                        releaseDBConnection(db, connection);
                        next(error);
                      }

                      debugLog(
                        "deductionResult emp:" + empResult[i]["employee_id"],
                        deductionResult
                      );

                      for (let k = 0; k < deductionResult.length; k++) {
                        let current_deduction_amt = 0;
                        let current_deduction_per_day_salary = 0;

                        if (deductionResult[k]["calculation_type"] == "F") {
                          current_deduction_amt = deductionResult[k]["amount"];
                          current_deduction_per_day_salary = parseFloat(
                            deductionResult[k]["amount"] /
                              parseFloat(empResult[i]["total_days"])
                          );
                        } else if (
                          deductionResult[k]["calculation_type"] == "V"
                        ) {
                          current_deduction_per_day_salary = parseFloat(
                            deductionResult[k]["amount"] /
                              parseFloat(empResult[i]["total_days"])
                          );

                          current_deduction_amt =
                            current_deduction_per_day_salary *
                            parseFloat(empResult[i]["total_paid_days"]);
                        }

                        current_deduction_amt_array.push({
                          deductions_id: deductionResult[k]["deductions_id"],
                          amount: current_deduction_amt,
                          per_day_salary: current_deduction_per_day_salary
                        });
                        final_deduction_amount += parseFloat(
                          current_deduction_amt
                        );

                        if (k == deductionResult.length - 1) {
                          debugLog(
                            "current_deduction_amt_array:",
                            current_deduction_amt_array
                          );
                          debugLog(
                            "final_deduction_amount:",
                            final_deduction_amount
                          );
                          resolve({});
                        }
                      }
                    }
                  );
                } catch (e) {
                  reject(e);
                }
              }).then(deductionCalcResult => {
                //pppppppppppp
                debugLog("second then", "  deductionCalcResult ");

                new Promise((resolve, reject) => {
                  try {
                    ////for  each employee this is contribution calculation

                    connection.query(
                      "select  hims_d_employee_contributions_id,employee_id,contributions_id,amount,\
                      EC.formula,EC.allocate,EC.calculation_method,EC.calculation_type,ED.component_frequency\
                      from hims_d_employee_contributions EC inner join hims_d_earning_deduction ED\
                        on EC.contributions_id=ED.hims_d_earning_deduction_id and ED.record_status='A'\
                        where ED.component_frequency='M'  and ED.component_category='C' and EC.employee_id=?   ",
                      [empResult[i]["employee_id"]],
                      (error, contributionResult) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        debugLog(
                          "contributionResult emp:" +
                            empResult[i]["employee_id"],
                          contributionResult
                        );
                      }
                    );
                  } catch (e) {
                    reject(e);
                  }
                }).then(deductionCalcResult => {
                  //3 then
                });
              });
            });
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { processSalary };
