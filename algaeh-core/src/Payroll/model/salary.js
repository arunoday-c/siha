"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import logUtils from "../../utils/logging";
import moment from "moment";
import _ from "lodash";

const { debugLog } = logUtils;
const { releaseDBConnection } = utils;

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
            debugLog("erro ");
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
                      debugLog("erro ");
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
                        debugLog("erro ");
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
                          debugLog("erro ");
                          next(error);
                        }

                        debugLog(
                          "contributionResult emp:" +
                            empResult[i]["employee_id"],
                          contributionResult
                        );

                        for (let m = 0; m < contributionResult.length; m++) {
                          let current_contribution_amt = 0;
                          let current_contribution_per_day_salary = 0;

                          if (
                            contributionResult[m]["calculation_type"] == "F"
                          ) {
                            current_contribution_amt =
                              contributionResult[m]["amount"];
                            current_contribution_per_day_salary = parseFloat(
                              contributionResult[m]["amount"] /
                                parseFloat(empResult[i]["total_days"])
                            );
                          } else if (
                            contributionResult[m]["calculation_type"] == "V"
                          ) {
                            current_contribution_per_day_salary = parseFloat(
                              contributionResult[m]["amount"] /
                                parseFloat(empResult[i]["total_days"])
                            );

                            current_contribution_amt =
                              current_contribution_per_day_salary *
                              parseFloat(empResult[i]["total_paid_days"]);
                          }

                          current_contribution_amt_array.push({
                            contributions_id:
                              contributionResult[m]["contributions_id"],
                            amount: current_contribution_amt,
                            per_day_salary: current_contribution_per_day_salary
                          });
                          final_contribution_amount += parseFloat(
                            current_contribution_amt
                          );

                          if (m == contributionResult.length - 1) {
                            debugLog(
                              "current_contribution_amt_array:",
                              current_contribution_amt_array
                            );
                            debugLog(
                              "final_contribution_amount:",
                              final_contribution_amount
                            );
                            resolve({});
                          }
                        }
                      }
                    );
                  } catch (e) {
                    reject(e);
                  }
                }).then(contributionCalcResult => {
                  //for  each employee this is loan calculation

                  debugLog("third then ", "contribution result");

                  new Promise((resolve, reject) => {
                    try {
                      connection.query(
                        "select hims_f_loan_application_id, loan_application_number, employee_id, loan_id, application_reason,\
                        loan_application_date, loan_authorized ,loan_closed, start_month,start_year,installment_amount,pending_loan\
                        from  hims_f_loan_application where loan_authorized='IS' and loan_closed='N' and pending_loan>0\
                        and ((start_year <=? and start_month<=?)||(start_year <?)) and loan_skip_months=0 and employee_id=? ",
                        [year, month_number, year, empResult[i]["employee_id"]],
                        (error, loanResult) => {
                          if (error) {
                            releaseDBConnection(db, connection);
                            debugLog("erro ");
                            next(error);
                          }

                          let current_loan_array = new LINQ(loanResult)
                            .Select(s => {
                              return {
                                loan_application_id:
                                  s.hims_f_loan_application_id,
                                loan_due_amount: s.installment_amount,
                                balance_amount: s.pending_loan
                              };
                            })
                            .ToArray();

                          let total_loan_due_amount = new LINQ(
                            current_loan_array
                          ).Sum(s => s.loan_due_amount);

                          let total_loan_payable_amount = new LINQ(
                            current_loan_array
                          ).Sum(s => s.balance_amount);

                          debugLog(
                            "total_loan_due_amount ",
                            total_loan_due_amount
                          );
                          debugLog(
                            "total_loan_payable_amount ",
                            total_loan_payable_amount
                          );

                          debugLog("current_loan_array ", current_loan_array);
                          debugLog("loanResult ", loanResult);
                          resolve({ connection, db });
                        }
                      );
                    } catch (e) {
                      reject(e);
                    }
                  }).then(loanCalcResult => {
                    debugLog("salary header ");
                    let db = loanCalcResult.db;
                    let connection = loanCalcResult.connection;
                    new Promise((resolve, reject) => {
                      try {
                        connection.beginTransaction(error => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              debugLog("erro ");
                              next(error);
                            });
                          }
                          debugLog("salary header begin ");
                          let per_day_sal =
                            final_earning_amount +
                            final_deduction_amount +
                            final_contribution_amount;
                          debugLog("per_day_sal ", per_day_sal);
                          debugLog("connection ", connection.query);

                          //   connection.query(
                          //     "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,salary_date,per_day_sal,total_days,\
                          //    present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                          // unpaid_leave,loan_payable_amount,loan_due_amount,gross_salary,total_earnings,total_deductions,\
                          //   total_contributions,net_salary) \
                          //  VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          //     [
                          //       25,
                          //       month_number,
                          //       year,
                          //       empResult[i]["employee_id"],
                          //       new Date(),
                          //       per_day_sal,

                          //       empResult[i]["total_days"],
                          //       empResult[i]["present_days"],
                          //       empResult[i]["absent_days"],
                          //       empResult[i]["total_work_days"],
                          //       empResult[i]["total_weekoff_days"],
                          //       empResult[i]["total_holidays"],
                          //       empResult[i]["total_leave"],
                          //       empResult[i]["paid_leave"],
                          //       empResult[i]["unpaid_leave"],

                          //       total_loan_payable_amount,
                          //       total_loan_due_amount,
                          //       total_loan_due_amount,

                          //       final_earning_amount,
                          //       final_deduction_amount,
                          //       final_contribution_amount,
                          //       "50"
                          //     ],

                          // connection.query(
                          //   "INSERT INTO `hims_f_salary` (salary_number) value(?)",
                          //   ["50"],
                          //   (error, salaryHeaderResult) => {
                          //     if (error) {
                          //       connection.rollback(() => {
                          //         releaseDBConnection(db, connection);
                          //         debugLog("erro ");
                          //         next(error);
                          //       });
                          //     }
                          //     debugLog("salaryHeaderResult: ");
                          //     if (salaryHeaderResult.insertId > 0) {
                          //       new Promise((resolve, reject) => {
                          //         try {
                          //           const insurtColumnsEarning = [
                          //             "earnings_id",
                          //             "amount",
                          //             "per_day_salary"
                          //           ];

                          //           connection.query(
                          //             "INSERT INTO hims_f_salary_earnings(" +
                          //               insurtColumnsEarning.join(",") +
                          //               ",`salary_header_id`) VALUES ?",
                          //             [
                          //               jsonArrayToObject({
                          //                 sampleInputObject: insurtColumnsEarning,
                          //                 arrayObj: current_earning_amt_array,
                          //                 newFieldToInsert: [
                          //                   salaryHeaderResult.insertId
                          //                 ]
                          //               })
                          //             ],
                          //             (error, earningInsert) => {
                          //               if (error) {
                          //                 connection.rollback(() => {
                          //                   releaseDBConnection(db, connection);
                          //                   debugLog("erro ");
                          //                   next(error);
                          //                 });
                          //               }

                          //               resolve({});
                          //             }
                          //           );
                          //         } catch (e) {
                          //           reject(e);
                          //         }
                          //       }).then(earningInsert => {
                          //         new Promise((resolve, reject) => {
                          //           try {
                          //             const insurtColumnsDeduction = [
                          //               "deductions_id",
                          //               "amount",
                          //               "per_day_salary"
                          //             ];

                          //             connection.query(
                          //               "INSERT INTO hims_f_salary_deductions(" +
                          //                 insurtColumnsDeduction.join(",") +
                          //                 ",`salary_header_id`) VALUES ?",
                          //               [
                          //                 jsonArrayToObject({
                          //                   sampleInputObject: insurtColumnsDeduction,
                          //                   arrayObj: current_deduction_amt_array,
                          //                   newFieldToInsert: [
                          //                     salaryHeaderResult.insertId
                          //                   ]
                          //                 })
                          //               ],
                          //               (error, deductionInsert) => {
                          //                 if (error) {
                          //                   connection.rollback(() => {
                          //                     releaseDBConnection(
                          //                       db,
                          //                       connection
                          //                     );
                          //                     next(error);
                          //                   });
                          //                 }

                          //                 resolve({});
                          //               }
                          //             );
                          //           } catch (e) {
                          //             reject(e);
                          //           }
                          //         }).then(deductionInsert => {
                          //           new Promise((resolve, reject) => {
                          //             try {
                          //               const insurtColumnsContribution = [
                          //                 "contributions_id",
                          //                 "amount"
                          //               ];

                          //               connection.query(
                          //                 "INSERT INTO hims_f_salary_contributions(" +
                          //                   insurtColumnsContribution.join(
                          //                     ","
                          //                   ) +
                          //                   ",`salary_header_id`) VALUES ?",
                          //                 [
                          //                   jsonArrayToObject({
                          //                     sampleInputObject: insurtColumnsContribution,
                          //                     arrayObj: current_contribution_amt_array,
                          //                     newFieldToInsert: [
                          //                       salaryHeaderResult.insertId
                          //                     ]
                          //                   })
                          //                 ],
                          //                 (error, contributionInsert) => {
                          //                   if (error) {
                          //                     connection.rollback(() => {
                          //                       releaseDBConnection(
                          //                         db,
                          //                         connection
                          //                       );
                          //                       next(error);
                          //                     });
                          //                   }

                          //                   resolve({});
                          //                 }
                          //               );
                          //             } catch (e) {
                          //               reject(e);
                          //             }
                          //           }).then(final => {
                          //             connection.commit(error => {
                          //               if (error) {
                          //                 connection.rollback(() => {
                          //                   releaseDBConnection(db, connection);
                          //                   next(error);
                          //                 });
                          //               }
                          //               releaseDBConnection(db, connection);
                          //               req.records = contributionInsert;
                          //               next();
                          //             });
                          //           });
                          //         });
                          //       });
                          //     }
                          //   }
                          // );
                        });
                      } catch (e) {
                        reject(e);
                      }
                    })
                      .then(modifyRes => {
                        //pppppppppppp
                        req.records = "Hello";
                        next();
                      })
                      .catch(error => {
                        next(error);
                      });
                  });
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

export default { processSalary };
