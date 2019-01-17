import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import utilities from "algaeh-utilities";
module.exports = {
  processSalary: (req, res, next) => {
    const input = req.query;
    const month_number = input.month;
    const year = input.year;
    const _mysql = new algaehMysql();

    utilities
      .AlgaehUtilities()
      .logger()
      .log("input:", input);

    let _stringData =
      input.employee_id != "null" ? " and A.employee_id=? " : "";

    _stringData +=
      input.sub_department_id != "null" ? " and A.sub_department_id=? " : "";

    // let _stringData = "";

    // let _inputData = [year, month_number, input.hospital_id];

    // if (input.employee_id != "null") {
    //   _inputData.push(input.employee_id);
    //   _stringData = " and A.employee_id=? ";
    // }
    // if (input.sub_department_id != "null") {
    //   _inputData.push(input.sub_department_id);
    //   _stringData += " and A.sub_department_id=? ";
    // }
    _mysql
      .executeQuery({
        query:
          "select A.hims_f_attendance_monthly_id, A.employee_id, A.year, A.month, A.hospital_id, A.sub_department_id, A.total_days,\
          A.present_days, A.absent_days, A.total_work_days, A.total_weekoff_days,\
          A.total_holidays, A.total_leave, A.paid_leave, A.unpaid_leave, A.total_paid_days,E.employee_code \
          from hims_f_attendance_monthly A,hims_d_employee E where `year`=? and `month`=? and A.hospital_id=? \
          and E.hims_d_employee_id = A.employee_id and A.hospital_id = E.hospital_id " +
          _stringData,
        values: _.valuesIn(input),
        printQuery: true
      })
      .then(empResult => {
        if (empResult.length > 0) {
          let _allEmployees = _.map(empResult, o => {
            return o.employee_id;
          });

          _mysql
            .executeQuery({
              query:
                "select employee_id,hims_f_salary_id,salary_processed from  hims_f_salary where month=? and year=? ",
              values: [month_number, year],
              printQuery: true
            })
            .then(existing => {
              let _salary_processed = _.chain(existing)
                .filter(f => {
                  return f.salary_processed == "Y";
                })
                .value();
              let _myemp = [];
              utilities
                .AlgaehUtilities()
                .logger()
                .log("_salary_processed", _salary_processed);
              let _itWentInside = false;
              _salary_processed.map(sItem => {
                _itWentInside = true;
                let _dat = _.find(_allEmployees, f => {
                  return f.employee_id == sItem.employee_id;
                });
                if (_dat != null) _myemp.push(_dat);
              });

              utilities
                .AlgaehUtilities()
                .logger()
                .log("_myemp", _myemp);
              if (_myemp.length > 0) {
                _allEmployees = _myemp;
              } else {
                if (_itWentInside) {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = {};
                    next();
                  });
                  return;
                }
              }

              utilities
                .AlgaehUtilities()
                .logger()
                .log("_allEmployees", _allEmployees);

              let _salaryHeader_id = existing.map(item => {
                return item.hims_f_salary_id;
              });

              _salaryHeader_id =
                _salaryHeader_id.length == 0 ? null : _salaryHeader_id;
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
                    and ((start_year <=? and start_month<=?)||(start_year <?)) and loan_skip_months=0 and employee_id in (?);\
                  select payment_amount, employee_id from hims_f_employee_payments where payment_type ='AD' and \
                    `year`=? and deduction_month=? and employee_id in (?);\
                  select employee_id,earning_deductions_id,amount,category from hims_f_miscellaneous_earning_deduction \
                    where processed = 'N' and `year`=? and month=? and employee_id in (?);\
                  select hims_f_loan_application_id, loan_application_number, employee_id, loan_id,\
                    loan_application_date, approved_amount\
                    from  hims_f_loan_application where loan_authorized='APR' and loan_dispatch_from='SAL' and employee_id in (?);\
                    delete from hims_f_salary_contributions where salary_header_id in (?);\
                    delete from hims_f_salary_loans where salary_header_id in (?);\
                    delete from hims_f_salary_deductions where salary_header_id in (?);\
                    delete from hims_f_salary_earnings where salary_header_id in (?);\
                    delete from hims_f_salary where hims_f_salary_id in (?);",
                  values: [
                    _allEmployees,
                    _allEmployees,
                    _allEmployees,
                    year,
                    month_number,
                    year,
                    _allEmployees,
                    year,
                    month_number,
                    _allEmployees,
                    year,
                    month_number,
                    _allEmployees,
                    _allEmployees,
                    _salaryHeader_id,
                    _salaryHeader_id,
                    _salaryHeader_id,
                    _salaryHeader_id,
                    _salaryHeader_id
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

                    getEarningComponents({
                      earnings: _earnings,
                      empResult: empResult[i]
                    })
                      .then(earningOutput => {
                        current_earning_amt_array =
                          earningOutput.current_earning_amt_array;
                        final_earning_amount =
                          earningOutput.final_earning_amount;

                        //Deduction -- Start

                        const _deduction = _.filter(results[1], f => {
                          return f.employee_id == empResult[i]["employee_id"];
                        });

                        getDeductionComponents({
                          deduction: _deduction,
                          empResult: empResult[i]
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
                              empResult: empResult[i]
                            })
                              .then(contributionOutput => {
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
                                })
                                  .then(loanOutput => {
                                    total_loan_due_amount =
                                      loanOutput.total_loan_due_amount;
                                    total_loan_payable_amount =
                                      loanOutput.total_loan_payable_amount;

                                    current_loan_array =
                                      loanOutput.current_loan_array;

                                    //Advance
                                    const _advance = _.filter(results[4], f => {
                                      return (
                                        f.employee_id ==
                                        empResult[i]["employee_id"]
                                      );
                                    });

                                    getAdvanceDue({ advance: _advance })
                                      .then(advanceOutput => {
                                        advance_due_amount =
                                          advanceOutput.advance_due_amount;

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

                                          //Salary Calculation Starts

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "final_earning_amount",
                                              final_earning_amount
                                            );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "final_deduction_amount",
                                              final_deduction_amount
                                            );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "final_contribution_amount",
                                              final_contribution_amount
                                            );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "total_loan_payable_amount",
                                              total_loan_payable_amount
                                            );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "total_loan_due_amount",
                                              total_loan_due_amount
                                            );

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log(
                                              "advance_due_amount",
                                              advance_due_amount
                                            );

                                          let per_day_sal =
                                            final_earning_amount +
                                            final_deduction_amount +
                                            final_contribution_amount;

                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log("SaralyProcess", {
                                              employee_id:
                                                empResult[i]["employee_id"],
                                              per_day_sal
                                            });
                                          const _salary_number =
                                            empResult[i][
                                              "employee_code"
                                            ].trim() +
                                            "-NS-" +
                                            month_number +
                                            "-" +
                                            year;
                                          //ToDo Advance need to calculate
                                          let _net_salary =
                                            final_earning_amount -
                                            final_deduction_amount -
                                            total_loan_due_amount -
                                            advance_due_amount;

                                          _net_salary =
                                            _net_salary +
                                            total_loan_payable_amount;
                                          utilities
                                            .AlgaehUtilities()
                                            .logger()
                                            .log("_net_salary", _net_salary);

                                          _mysql
                                            .executeQueryWithTransaction({
                                              query:
                                                "INSERT INTO `hims_f_salary` (salary_number,month,year,employee_id,salary_date,per_day_sal,total_days,\
                                            present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,\
                                            unpaid_leave,loan_payable_amount,loan_due_amount,advance_due,gross_salary,total_earnings,total_deductions,\
                                            total_contributions,net_salary) \
                                            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ",
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
                                                empResult[i][
                                                  "total_weekoff_days"
                                                ],
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
                                                _net_salary
                                              ],
                                              printQuery: true
                                            })
                                            .then(inserted_salary => {
                                              _requestCollector.push(
                                                inserted_salary
                                              );

                                              salary_header_id =
                                                inserted_salary.insertId;
                                              if (
                                                current_earning_amt_array.length >
                                                0
                                              ) {
                                                _mysql
                                                  .executeQuery({
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
                                                  })

                                                  .then(resultEarnings => {
                                                    _mysql
                                                      .executeQuery({
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
                                                      })
                                                      .then(
                                                        resultDeductions => {
                                                          _mysql
                                                            .executeQuery({
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
                                                            })
                                                            .then(
                                                              resultContribute => {
                                                                if (
                                                                  current_loan_array.length >
                                                                  0
                                                                ) {
                                                                  _mysql
                                                                    .executeQuery(
                                                                      {
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
                                                                      }
                                                                    )
                                                                    .then(
                                                                      resultLoan => {
                                                                        if (
                                                                          i ==
                                                                          empResult.length -
                                                                            1
                                                                        ) {
                                                                          _mysql.commitTransaction(
                                                                            () => {
                                                                              _mysql.releaseConnection();
                                                                              req.records = resultLoan;
                                                                              next();
                                                                            }
                                                                          );
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
                                                                          }
                                                                        );
                                                                      }
                                                                    );
                                                                } else {
                                                                  if (
                                                                    i ==
                                                                    empResult.length -
                                                                      1
                                                                  ) {
                                                                    _mysql.commitTransaction(
                                                                      () => {
                                                                        _mysql.releaseConnection();
                                                                        req.records = resultContribute;
                                                                        next();
                                                                      }
                                                                    );
                                                                  }
                                                                }
                                                              }
                                                            );
                                                        }
                                                      )
                                                      .catch(error => {
                                                        _mysql.rollBackTransaction(
                                                          () => {
                                                            next(error);
                                                          }
                                                        );
                                                      });
                                                  })
                                                  .catch(error => {
                                                    _mysql.rollBackTransaction(
                                                      () => {
                                                        next(error);
                                                      }
                                                    );
                                                  });
                                              } else {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = _requestCollector;
                                                  next();
                                                });
                                              }
                                            })
                                            .catch(error => {
                                              next(error);
                                            });
                                        });
                                      })
                                      .catch(e => {
                                        next(e);
                                      });
                                  })
                                  .catch(e => {
                                    next(e);
                                  });
                                //Loan Due End
                              })
                              .catch(e => {
                                next(e);
                              });
                            //Contribution -- End
                          })
                          .catch(e => {
                            next(e);
                          });

                        //Deduction -- End
                      })
                      .catch(e => {
                        next(e);
                      });
                    //Earnigs --- End
                  }
                })
                .catch(e => {
                  next(e);
                });
            })
            .catch(e => {
              next(e);
            });
        } else {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("empResult: ", empResult);

          _mysql.releaseConnection();
          req.records = empResult;
          next();
        }
      })
      .catch(error => {
        next(error);
      });
  },

  getSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let salaryprocess_header = [];

    /* Select statemwnt  */

    let _stringData =
      inputParam.employee_id != "null" ? " and employee_id=? " : "";

    _stringData +=
      inputParam.sub_department_id != "null"
        ? " and emp.sub_department_id=? "
        : "";

    _mysql
      .executeQuery({
        query:
          "select hims_f_salary_id, salary_number, present_days, hims_f_salary.gross_salary, hims_f_salary.net_salary,advance_due,\
          loan_payable_amount, loan_due_amount,emp.employee_code, emp.full_name from hims_f_salary, hims_d_employee emp where \
          hims_f_salary.employee_id = emp.hims_d_employee_id and `year` = ? and `month` = ? " +
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

              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = [
                  {
                    salaryprocess_header: salaryprocess_header,
                    salaryprocess_detail: result
                  }
                ];
                next();
              });
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = salary_process;
            next();
          });
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
          "select hims_f_salary_id, salary_number, present_days, salary_processed, hims_f_salary.gross_salary, hims_f_salary.net_salary,advance_due,\
          loan_payable_amount, emp.employee_code, emp.full_name from hims_f_salary, hims_d_employee emp where \
          hims_f_salary.employee_id = emp.hims_d_employee_id and salary_processed = 'Y' and `year` = ? and `month` = ? " +
          _stringData,
        values: _.valuesIn(inputParam),
        printQuery: true
      })
      .then(salary_process => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = salary_process;
          next();
        });
      })
      .catch(e => {
        next(e);
      });
  },

  finalizedSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = { ...req.body };

    const _salaryHeader_id = _.map(inputParam, o => {
      return o.hims_f_salary_id;
    });

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_salary SET salary_processed = 'Y' where hims_f_salary_id in (?)",
        values: [_salaryHeader_id],
        printQuery: true
      })
      .then(salary_process => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = salary_process;
          next();
        });
      })
      .catch(e => {
        next(e);
      });
  }
};

function getEarningComponents(options) {
  return new Promise((resolve, reject) => {
    utilities
      .AlgaehUtilities()
      .logger()
      .log("options: ", options.earnings);

    const _earnings = options.earnings;
    const empResult = options.empResult;
    let final_earning_amount = 0;
    let current_earning_amt_array = [];
    let current_earning_amt = 0;
    let current_earning_per_day_salary = 0;

    if (_earnings.length == 0) {
      resolve({ current_earning_amt_array, final_earning_amount });
    }

    _earnings.map(obj => {
      if (obj.calculation_type == "F") {
        current_earning_amt = obj["amount"];
        current_earning_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );
      } else if (obj["calculation_type"] == "V") {
        current_earning_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );
        current_earning_amt =
          current_earning_per_day_salary *
          parseFloat(empResult["total_paid_days"]);
      }
      current_earning_amt_array.push({
        earnings_id: obj.earnings_id,
        amount: current_earning_amt,
        per_day_salary: current_earning_per_day_salary
      });
      final_earning_amount += parseFloat(current_earning_amt);
    });
    resolve({ current_earning_amt_array, final_earning_amount });
  });
}

function getDeductionComponents(options) {
  return new Promise((resolve, reject) => {
    const _deduction = options.deduction;
    const empResult = options.empResult;
    let current_deduction_amt = 0;
    let current_deduction_per_day_salary = 0;
    let current_deduction_amt_array = [];
    let final_deduction_amount = 0;

    if (_deduction.length == 0) {
      resolve({ current_deduction_amt_array, final_deduction_amount });
    }

    _deduction.map(obj => {
      if (obj["calculation_type"] == "F") {
        current_deduction_amt = obj["amount"];
        current_deduction_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );
      } else if (obj["calculation_type"] == "V") {
        current_deduction_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );

        current_deduction_amt =
          current_deduction_per_day_salary *
          parseFloat(empResult["total_paid_days"]);
      }

      current_deduction_amt_array.push({
        deductions_id: obj.deductions_id,
        amount: current_deduction_amt,
        per_day_salary: current_deduction_per_day_salary
      });

      final_deduction_amount += parseFloat(current_deduction_amt);
    });

    resolve({ current_deduction_amt_array, final_deduction_amount });
  });
}

function getContrubutionsComponents(options) {
  return new Promise((resolve, reject) => {
    const _contrubutions = options.contribution;
    const empResult = options.empResult;
    let current_contribution_amt = 0;
    let current_contribution_per_day_salary = 0;

    let final_contribution_amount = 0;
    let current_contribution_amt_array = [];

    if (_contrubutions.length == 0) {
      resolve({ current_contribution_amt_array, final_contribution_amount });
    }

    _contrubutions.map(obj => {
      // ContrubutionsComponents();
      if (obj["calculation_type"] == "F") {
        current_contribution_amt = obj["amount"];
        current_contribution_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );
      } else if (obj["calculation_type"] == "V") {
        current_contribution_per_day_salary = parseFloat(
          obj["amount"] / parseFloat(empResult["total_days"])
        );

        current_contribution_amt =
          current_contribution_per_day_salary *
          parseFloat(empResult["total_paid_days"]);
      }

      current_contribution_amt_array.push({
        contributions_id: obj.contributions_id,
        amount: current_contribution_amt
        // per_day_salary: current_contribution_per_day_salary
      });

      final_contribution_amount += parseFloat(current_contribution_amt);
    });

    resolve({ current_contribution_amt_array, final_contribution_amount });
  });
}

function getLoanDueandPayable(options) {
  return new Promise((resolve, reject) => {
    const _loan = options.loan;
    const _loanPayable = options.loanPayable;

    let total_loan_due_amount = 0;
    let total_loan_payable_amount = 0;
    let current_loan_array = [];

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
        loan_due_amount: s.installment_amount,
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
  });
}

function getAdvanceDue(options) {
  return new Promise((resolve, reject) => {
    const _advance = options.advance;

    let advance_due_amount = 0;

    utilities
      .AlgaehUtilities()
      .logger()
      .log("_advance", _advance);

    if (_advance.length == 0) {
      resolve({ advance_due_amount });
    }

    advance_due_amount = _.sumBy(_advance, s => {
      return s.payment_amount;
    });

    resolve({ advance_due_amount });
  });
}

function getMiscellaneous(options) {
  return new Promise((resolve, reject) => {
    const _miscellaneous = options.miscellaneous;

    let current_earn_compoment = [];
    let current_deduct_compoment = [];

    if (_miscellaneous.length == 0) {
      resolve({ current_earn_compoment, current_deduct_compoment });
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

    resolve({ current_earn_compoment, current_deduct_compoment });
  });
}
