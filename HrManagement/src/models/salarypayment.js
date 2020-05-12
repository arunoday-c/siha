import algaehMysql from "algaeh-mysql";
import moment from "moment";
import _ from "lodash";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";

export default {
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
            "select hims_f_salary_id, salary_number, employee_id,present_days,display_present_days, salary_processed, \
            S.gross_salary, S.net_salary, advance_due, loan_payable_amount, \
            loan_due_amount, emp.employee_code, emp.full_name,salary_paid from hims_f_salary S, \
            hims_d_employee emp, hims_d_sub_department SD where S.employee_id = emp.hims_d_employee_id \
            and emp.sub_department_id=SD.hims_d_sub_department_id and salary_processed = 'Y' and salary_settled='N' \
            and salary_type = 'NS' and `year` = ? and `month` = ? and S.hospital_id=? " +
            _stringData,
          values: _.valuesIn(inputParam),
          printQuery: true,
        })
        .then((salary_process) => {
          _mysql.releaseConnection();

          req.records = salary_process.map((data) => {
            return {
              ...data,
              select_to_pay: "N",
            };
          });

          next();
        })
        .catch((e) => {
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
      req.on("data", (chunk) => {
        buffer += chunk.toString();
      });

      req.on("end", () => {
        const _mysql = new algaehMysql();
        const inputParam = JSON.parse(buffer);
        req.body = inputParam;

        const _salaryHeader_id = _.map(inputParam.salary_payment, (o) => {
          return o.hims_f_salary_id;
        });

        let _allEmployees = _.map(inputParam.salary_payment, (o) => {
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
              _salaryHeader_id,
            ],
            printQuery: true,
          })
          .then((salary_process) => {
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
                  _allEmployees,
                ],
                printQuery: true,
              })
              .then((miscellaneous_earning_deduction) => {
                req.connection = {
                  connection: _mysql.connection,
                  isTransactionConnection: _mysql.isTransactionConnection,
                  pool: _mysql.pool,
                };
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
                      _allEmployees,
                    ],
                    printQuery: true,
                  })
                  .then((employee_payments_advance) => {
                    //Loan Due
                    _mysql
                      .executeQuery({
                        query:
                          "select loan_application_id,loan_due_amount,balance_amount from hims_f_salary_loans where \
                    salary_header_id in (?)",
                        values: [_salaryHeader_id],
                        printQuery: true,
                      })
                      .then((salary_loans) => {
                        let loan_application_ids = _.map(salary_loans, (o) => {
                          return o.loan_application_id;
                        });

                        if (loan_application_ids.length > 0) {
                          _mysql
                            .executeQuery({
                              query:
                                "select hims_f_loan_application_id,loan_skip_months,installment_amount, pending_loan,pending_tenure from hims_f_loan_application  where hims_f_loan_application_id in (?)",
                              values: [loan_application_ids],
                              printQuery: true,
                            })
                            .then((loan_application) => {
                              for (
                                let i = 0;
                                i < loan_application.length;
                                i++
                              ) {
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
                                  if (loan_application[i].pending_tenure > 0) {
                                    pending_tenure =
                                      loan_application[i].pending_tenure - 1;
                                  } else {
                                    pending_tenure =
                                      loan_application[i].pending_tenure;
                                  }
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
                                        .hims_f_loan_application_id,
                                    ],
                                    printQuery: true,
                                  })
                                  .then((update_loan_application) => {
                                    // _mysql.commitTransaction(() => {
                                    //   _mysql.releaseConnection();
                                    req.records = update_loan_application;
                                    next();
                                    // });
                                  })
                                  .catch((e) => {
                                    next(e);
                                  });
                              }
                            })
                            .catch((error) => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          // _mysql.commitTransaction(() => {
                          //   _mysql.releaseConnection();
                          req.records = salary_loans;
                          next();
                          // });
                        }
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
      });
    } catch (e) {
      next(e);
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
          inner join hims_d_employee E on S.employee_id=E.hims_d_employee_id where S.salary_processed='Y' and S.salary_type <>'LS' and S.final_settlement_id is null \
          and E.company_bank_id=? and E.mode_of_payment='WPS' and  S.year=? and S.month=?; \
          select default_nationality from hims_d_hospital;`,
          values: [input.company_bank_id, input.year, input.month],
          printQuery: true,
        })
        .then((salary_details) => {
          let total_earnings = 0;
          let total_deductions = 0;
          let total_contributions = 0;
          let total_net_salary = 0;
          let salary = salary_details[0];
          let default_nationality = salary_details[1][0]["default_nationality"];

          const utilities = new algaehUtilities();

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
                  ");select basic_earning_component from hims_d_hrms_options; \
                  select hims_d_earning_deduction_id from hims_d_earning_deduction where component_type='OV'",
                printQuery: true,
              })
              .then((results) => {
                _mysql.releaseConnection();
                let earnings = results[0];
                let deductions = results[1];
                let basic_id = results[2][0]["basic_earning_component"];
                let ovettime_earning_deduction_id =
                  results[3][0]["hims_d_earning_deduction_id"];

                let total_basic = 0;

                for (let i = 0; i < salary.length; i++) {
                  //ST-complete OVER-Time (ot,wot,hot all togather sum)  calculation
                  let ot_hours = 0;
                  let ot_min = 0;

                  ot_hours +=
                    salary[i]["ot_work_hours"] === null
                      ? 0
                      : parseInt(
                          salary[i]["ot_work_hours"].toString().split(".")[0]
                        );
                  ot_min +=
                    salary[i]["ot_work_hours"] === null
                      ? 0
                      : parseInt(
                          salary[i]["ot_work_hours"].toString().split(".")[1]
                        );

                  ot_hours +=
                    salary[i]["ot_weekoff_hours"] === null
                      ? 0
                      : parseInt(
                          salary[i]["ot_weekoff_hours"].toString().split(".")[0]
                        );
                  ot_min +=
                    salary[i]["ot_weekoff_hours"] === null
                      ? 0
                      : parseInt(
                          salary[i]["ot_weekoff_hours"].toString().split(".")[1]
                        );

                  ot_hours +=
                    salary[i]["ot_holiday_hours"] === null
                      ? 0
                      : parseInt(
                          salary[i]["ot_holiday_hours"].toString().split(".")[0]
                        );
                  ot_min +=
                    salary[i]["ot_holiday_hours"] === null
                      ? 0
                      : parseInt(
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
                        (w) => w.earnings_id == ovettime_earning_deduction_id
                      )
                      .Select((s) => parseFloat(s.amount))
                      .FirstOrDefault(0);
                  }

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

                  total_basic += new LINQ(employee_earning)
                    .Where((w) => w.earnings_id == basic_id)
                    .Select((s) => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  let basic_salary = new LINQ(employee_earning)
                    .Where((w) => w.earnings_id == basic_id)
                    .Select((s) => parseFloat(s.amount))
                    .FirstOrDefault(0);

                  let emp_id_type = "P";
                  if (default_nationality == salary[i].nationality) {
                    emp_id_type = "C";
                  }

                  let social_security_deductions = new LINQ(employee_deduction)
                    .Where((w) => w.nationality_id == default_nationality)
                    .Select((s) => parseFloat(s.amount))
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
                    notes_comments: "",
                  });
                }

                req.records = {
                  employees: outputArray,
                  total_basic: total_basic,
                  total_earnings: total_earnings,
                  total_deductions: total_deductions,
                  total_contributions: total_contributions,
                  total_net_salary: total_net_salary,
                };
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {};
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
  getEmployeeMiscellaneous: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = req.query;
      //and S.`year`=? and S.`month`=?
      _mysql
        .executeQuery({
          query:
            "select MED.*, ED.earning_deduction_description, COALESCE( S.salary_processed,'N') salary_processed from  hims_f_miscellaneous_earning_deduction MED \
            inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = MED.earning_deductions_id \
            left join hims_f_salary S on S.employee_id = MED.employee_id and S.month =MED.month and S.year =MED.year \
            where MED.employee_id=?",
          values: [inputParam.employee_id], //inputParam.year, inputParam.month,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
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
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  generateAccountingEntrySalaryPayment: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      if (req.flag != 1) {
        let inputParam = req.body;

        const _salaryHeader_id = _.map(inputParam.salary_payment, (o) => {
          return o.hims_f_salary_id;
        });

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
                .generateRunningNumber({
                  user_id: req.userIdentity.algaeh_d_app_user_id,
                  numgen_codes: ["PAYMENT"],
                  table_name: "finance_numgen",
                })
                .then((generatedNumbers) => {
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "select head_id, child_id from finance_accounts_maping where account in ('SAL_PYBLS');",
                    })
                    .then((result) => {
                      // const salary_pay_acc = result[1].find(f => f.account === "SAL_PYBLS");
                      const salary_pay_acc = result[0];

                      _mysql
                        .executeQueryWithTransaction({
                          query: `SELECT hims_f_salary_id, salary_number, sum(net_salary) as salary_payable,
                  concat('Salary Payment for: ', year , '/' , monthname(concat('1999-',month,'-01'))) as narration, 
                  hospital_id FROM hims_f_salary where hims_f_salary_id in (?);
                  SELECT sum(S.net_salary) as salary_payable, E.company_bank_id, head_id, child_id, 
                  S.hospital_id FROM hims_f_salary s 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  inner join hims_d_bank B on B.hims_d_bank_id = E.company_bank_id 
                  where hims_f_salary_id in (?) group by E.company_bank_id;`,
                          values: [_salaryHeader_id, _salaryHeader_id],
                          printQuery: true,
                        })
                        .then((headerResult) => {
                          const laibility_amount = headerResult[0][0];
                          const bank_booking = headerResult[1];

                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "INSERT INTO finance_day_end_header (transaction_date, amount, \
                        voucher_type, document_id, document_number, from_screen, \
                        narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?)",
                              values: [
                                new Date(),
                                laibility_amount.salary_payable,
                                "payment",
                                laibility_amount.hims_f_salary_id,
                                generatedNumbers.PAYMENT,
                                inputParam.ScreenCode,
                                "Salary Payment for " +
                                  laibility_amount.narration +
                                  laibility_amount.salary_payable,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                              ],
                              printQuery: true,
                            })
                            .then((day_end_header) => {
                              const insertSubDetail = [];

                              //Salary Payable Laibility Account
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: salary_pay_acc.head_id,
                                child_id: salary_pay_acc.child_id,
                                debit_amount: laibility_amount.salary_payable,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: laibility_amount.hospital_id,
                              });

                              bank_booking.forEach((per_salary) => {
                                //Booking salary To the bank
                                insertSubDetail.push({
                                  payment_date: new Date(),
                                  head_id: per_salary.head_id,
                                  child_id: per_salary.child_id,
                                  debit_amount: 0,
                                  payment_type: "CR",
                                  credit_amount: per_salary.salary_payable,
                                  hospital_id: per_salary.hospital_id,
                                });
                              });

                              const IncludeValuess = [
                                "payment_date",
                                "head_id",
                                "child_id",
                                "debit_amount",
                                "payment_type",
                                "credit_amount",
                                "hospital_id",
                              ];

                              const month = moment().format("M");
                              const year = moment().format("YYYY");

                              _mysql
                                .executeQueryWithTransaction({
                                  query:
                                    "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                                  values: insertSubDetail,
                                  includeValues: IncludeValuess,
                                  bulkInsertOrUpdate: true,
                                  extraValues: {
                                    day_end_header_id: day_end_header.insertId,
                                    year: year,
                                    month: month,
                                  },
                                  printQuery: true,
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
                .catch((e) => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
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
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
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
