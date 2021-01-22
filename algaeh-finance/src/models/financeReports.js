import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
// import algaehUtilities from "algaeh-utilities/utilities";

export default {
  //created by irfan:
  getBalanceSheet: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;
    let str;
    if (req.query.to_date) {
      str = ` and VD.payment_date <=date('${moment(
        req.query.to_date,
        "YYYY-MM-DD"
      ).format("YYYY-MM-DD")}')`;
    } else {
      str = ` and VD.payment_date <=date('${moment().format("YYYY-MM-DD")}')`;
    }

    getAccountHeadsForReport(decimal_places, 1, str)
      .then((asset) => {
        getAccountHeadsForReport(decimal_places, 2, str)
          .then((liabilities) => {
            getAccountHeadsForReport(decimal_places, 3, str)
              .then((equity) => {
                // const balance = parseFloat(
                //   parseFloat(asset.subtitle) - parseFloat(liabilities.subtitle)
                // ).toFixed(decimal_places);

                // let symbol = " Dr";
                // if (balance < 0) {
                //   symbol = " Cr";
                // }

                liabilities.children.push(equity);
                liabilities.label = "Liabilities and Equity";
                liabilities.subtitle = parseFloat(
                  parseFloat(liabilities.subtitle) + parseFloat(equity.subtitle)
                ).toFixed(decimal_places);
                req.records = {
                  asset: asset,
                  liabilities: liabilities,
                };
                next();
              })
              .catch((e) => {
                next(e);
              });
          })
          .catch((e) => {
            next(e);
          });
      })
      .catch((e) => {
        next(e);
      });
  },
  //created by irfan:
  getProfitAndLoss: (req, res, next) => {
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    let strQuery = undefined;
    const input = req.query;
    if (input.cost_center_id > 0) {
      _mysql
        .executeQuery({
          query:
            "SELECT cost_center_type,cost_center_required  FROM finance_options limit 1; ",
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result[0]["cost_center_required"] == "Y") {
            switch (result[0]["cost_center_type"]) {
              case "P":
                if (input.hospital_id > 0) {
                  strQuery = ` and VD.hospital_id=${input.hospital_id} and VD.project_id=${req.query.cost_center_id}`;
                } else {
                  strQuery = ` and VD.project_id=${req.query.cost_center_id}`;
                }

                break;
              case "SD":
                if (input.hospital_id > 0) {
                  strQuery = ` and VD.hospital_id=${input.hospital_id} and VD.sub_department_id=${req.query.cost_center_id}`;
                } else {
                  strQuery = ` and VD.sub_department_id=${req.query.cost_center_id}`;
                }

                break;
              case "B":
                strQuery = ` and VD.hospital_id=${req.query.cost_center_id}`;
            }
            getAccountHeadsForReport(decimal_places, 4, strQuery)
              .then((income) => {
                getAccountHeadsForReport(decimal_places, 5, strQuery)
                  .then((expense) => {
                    const balance = parseFloat(
                      parseFloat(income.subtitle) - parseFloat(expense.subtitle)
                    ).toFixed(decimal_places);

                    req.records = {
                      profit: balance,
                      income: income,
                      expense: expense,
                    };
                    next();
                  })
                  .catch((e) => {
                    next(e);
                  });
              })
              .catch((e) => {
                next(e);
              });
          } else {
            getAccountHeadsForReport(decimal_places, 4)
              .then((income) => {
                getAccountHeadsForReport(decimal_places, 5)
                  .then((expense) => {
                    const balance = parseFloat(
                      parseFloat(income.subtitle) - parseFloat(expense.subtitle)
                    ).toFixed(decimal_places);

                    req.records = {
                      profit: balance,
                      income: income,
                      expense: expense,
                    };
                    next();
                  })
                  .catch((e) => {
                    next(e);
                  });
              })
              .catch((e) => {
                next(e);
              });
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      getAccountHeadsForReport(decimal_places, 4)
        .then((income) => {
          getAccountHeadsForReport(decimal_places, 5)
            .then((expense) => {
              const balance = parseFloat(
                parseFloat(income.subtitle) - parseFloat(expense.subtitle)
              ).toFixed(decimal_places);

              req.records = {
                profit: balance,
                income: income,
                expense: expense,
              };
              next();
            })
            .catch((e) => {
              next(e);
            });
        })
        .catch((e) => {
          next(e);
        });
    }
  },

  //created by irfan:
  getProfitAndLossCostCenterWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    const decimal_places = req.userIdentity.decimal_places;
    let selectStr,
      whrStr,
      costCenterQuery = "";

    _mysql
      .executeQuery({
        query:
          "SELECT cost_center_type,cost_center_required  FROM finance_options limit 1; ",
      })
      .then((result) => {
        _mysql.releaseConnection();
        if (result[0]["cost_center_required"] == "Y") {
          switch (result[0]["cost_center_type"]) {
            case "P":
              selectStr = " ,VD.project_id as cost_center_id ";
              whrStr = " and VD.project_id= ";
              costCenterQuery = `select hims_d_project_id as cost_center_id ,project_desc  as cost_center   from hims_d_project where pjoject_status='A';
             `;
              break;
            case "SD":
              selectStr = " ,VD.sub_department_id as cost_center_id ";
              whrStr = " and  VD.sub_department_id = ";

              costCenterQuery = `  select hims_d_sub_department_id as cost_center_id ,sub_department_name  as cost_center  from hims_d_sub_department where record_status='A';  `;

              break;
            case "B":
              selectStr = " ,VD.hospital_id as cost_center_id ";
              whrStr = " and VD.hospital_id=  ";
              costCenterQuery = ` select  hims_d_hospital_id as cost_center_id ,hospital_name as cost_center  from hims_d_hospital where record_status='A';`;
          }
          getAccountHeadsForProfitAndLoss(
            decimal_places,
            4,
            selectStr,
            whrStr,
            costCenterQuery
          )
            .then((income) => {
              getAccountHeadsForProfitAndLoss(
                decimal_places,
                5,
                selectStr,
                whrStr,
                costCenterQuery
              )
                .then((expense) => {
                  const totals = {};

                  income.cost_centers.forEach((item) => {
                    const cost_center_id = item.cost_center_id.toString();
                    const income_amount = income.outputArray[cost_center_id];
                    const expense_amount = expense.outputArray[cost_center_id];

                    totals[cost_center_id] = (
                      parseFloat(income_amount) - parseFloat(expense_amount)
                    ).toFixed(decimal_places);
                  });

                  req.records = {
                    profit: 0,
                    cost_centers: income.cost_centers,
                    income: income.outputArray,
                    expense: expense.outputArray,
                    totals: totals,
                  };
                  next();
                })
                .catch((e) => {
                  next(e);
                });
            })
            .catch((e) => {
              next(e);
            });
        } else {
          getAccountHeadsForReport(decimal_places, 4)
            .then((income) => {
              getAccountHeadsForReport(decimal_places, 5)
                .then((expense) => {
                  const balance = parseFloat(
                    parseFloat(income.subtitle) - parseFloat(expense.subtitle)
                  ).toFixed(decimal_places);

                  req.records = {
                    profit: balance,
                    income: income,
                    expense: expense,
                  };
                  next();
                })
                .catch((e) => {
                  next(e);
                });
            })
            .catch((e) => {
              next(e);
            });
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getTrialBalanceBAKP_16_JAN_2020: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;
    let option = { tialBalance: "Y" };

    getAccountHeadsForReport(decimal_places, 1, option)
      .then((asset) => {
        getAccountHeadsForReport(decimal_places, 2, option)
          .then((liability) => {
            getAccountHeadsForReport(decimal_places, 3, option)
              .then((capital) => {
                // const newCapital = capital.children[0].children.find(f => {
                //   return f.finance_account_child_id == 52;
                // });

                const newCapital = capital;
                getAccountHeadsForReport(decimal_places, 4, option)
                  .then((income) => {
                    getAccountHeadsForReport(decimal_places, 5, option)
                      .then((expense) => {
                        const total_debit_amount = parseFloat(
                          parseFloat(asset.tr_debit_amount) +
                            parseFloat(newCapital.tr_debit_amount) +
                            parseFloat(income.tr_debit_amount) +
                            parseFloat(liability.tr_debit_amount) +
                            parseFloat(expense.tr_debit_amount)
                        ).toFixed(decimal_places);

                        const total_credit_amount = parseFloat(
                          parseFloat(asset.tr_credit_amount) +
                            parseFloat(newCapital.tr_credit_amount) +
                            parseFloat(income.tr_credit_amount) +
                            parseFloat(liability.tr_credit_amount) +
                            parseFloat(expense.tr_credit_amount)
                        ).toFixed(decimal_places);

                        newCapital.children = [{ ...newCapital }];

                        req.records = {
                          asset: asset,
                          liability: liability,
                          capital: newCapital,
                          income: income,
                          expense: expense,
                          total_debit_amount: total_debit_amount,
                          total_credit_amount: total_credit_amount,
                        };
                        next();
                      })
                      .catch((e) => {
                        next(e);
                      });
                  })
                  .catch((e) => {
                    next(e);
                  });
              })
              .catch((e) => {
                next(e);
              });
          })
          .catch((e) => {
            next(e);
          });
      })
      .catch((e) => {
        next(e);
      });
  },
  //created by irfan:
  getTrialBalance: (req, res, next) => {
    const decimal_places = req.userIdentity.decimal_places;

    let option = {
      from_date: moment(req.query.from_date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      to_date: moment(req.query.to_date, "YYYY-MM-DD").format("YYYY-MM-DD"),
      non_zero: req.query.non_zero,
    };
    const level = req.query.ACCOUNTS;
    const drillDownLevel = req.query.drillDownLevel;
    option["drillDownLevel"] = drillDownLevel;
    if (option.old == "Y") {
      getAccountHeadsForTrialBalance(decimal_places, 1, option)
        .then((asset) => {
          getAccountHeadsForTrialBalance(decimal_places, 2, option)
            .then((liability) => {
              getAccountHeadsForTrialBalance(decimal_places, 3, option)
                .then((capital) => {
                  // const newCapital = capital.children[0].children.find(f => {
                  //   return f.finance_account_child_id == 52;
                  // });
                  // const newCapital = capital;
                  getAccountHeadsForTrialBalance(decimal_places, 4, option)
                    .then((income) => {
                      getAccountHeadsForTrialBalance(decimal_places, 5, option)
                        .then((expense) => {
                          const total_debit_amount = parseFloat(
                            parseFloat(asset.total_debit_amount) +
                              parseFloat(capital.total_debit_amount) +
                              parseFloat(income.total_debit_amount) +
                              parseFloat(liability.total_debit_amount) +
                              parseFloat(expense.total_debit_amount)
                          ).toFixed(decimal_places);
                          const total_credit_amount = parseFloat(
                            parseFloat(asset.total_credit_amount) +
                              parseFloat(capital.total_credit_amount) +
                              parseFloat(income.total_credit_amount) +
                              parseFloat(liability.total_credit_amount) +
                              parseFloat(expense.total_credit_amount)
                          ).toFixed(decimal_places);
                          // newCapital.children = [{ ...newCapital }];
                          req.records = {
                            asset: asset.roots[0],
                            liability: liability.roots[0],
                            capital: capital.roots[0],
                            income: income.roots[0],
                            expense: expense.roots[0],
                            total_debit_amount: total_debit_amount,
                            total_credit_amount: total_credit_amount,
                          };
                          next();
                        })
                        .catch((e) => {
                          next(e);
                        });
                    })
                    .catch((e) => {
                      next(e);
                    });
                })
                .catch((e) => {
                  next(e);
                });
            })
            .catch((e) => {
              next(e);
            });
        })
        .catch((e) => {
          next(e);
        });
    } else {
      const _mysql = new algaehMysql();
      option["_mysql"] = _mysql;

      if (level === "ALL") {
        getTrialBalanceFunc(decimal_places, 1, option, next)
          .then((asset) => {
            getTrialBalanceFunc(decimal_places, 2, option, next)
              .then((liability) => {
                getTrialBalanceFunc(decimal_places, 3, option, next)
                  .then((capital) => {
                    getTrialBalanceFunc(decimal_places, 4, option, next)
                      .then((income) => {
                        getTrialBalanceFunc(decimal_places, 5, option, next)
                          .then((expense) => {
                            _mysql.releaseConnection();

                            req.records = {
                              asset: asset,
                              liability: liability,
                              capital: capital,
                              income: income,
                              expense: expense,
                              total_debit_amount: 0,
                              total_credit_amount: 0,
                            };
                            next();
                          })
                          .catch((e) => {
                            next(e);
                          });
                      })
                      .catch((e) => {
                        next(e);
                      });
                  })
                  .catch((e) => {
                    next(e);
                  });
              })
              .catch((e) => {
                next(e);
              });
          })
          .catch((e) => {
            next(e);
          });
      } else {
        const levelInteger = parseInt(level, 10);
        getTrialBalanceFunc(decimal_places, levelInteger, option, next)
          .then((accountResult) => {
            _mysql.releaseConnection();

            let objToplot = {};
            switch (level) {
              case "1":
                objToplot["asset"] = accountResult;
                break;
              case "2":
                objToplot["liability"] = accountResult;
                break;
              case "3":
                objToplot["capital"] = accountResult;
                break;
              case "4":
                objToplot["income"] = accountResult;
                break;
              case "5":
                objToplot["expense"] = accountResult;
                break;
            }
            req.records = {
              ...objToplot,
              total_debit_amount: 0,
              total_credit_amount: 0,
            };
            next();
          })
          .catch((e) => {
            next(e);
          });
      }
    }
  },

  //created by irfan: ACCOUNT RECEIVABLE REPORT
  getAccountReceivableAging: (req, res, next) => {
    const _mysql = new algaehMysql();

    const decimal_places = req.userIdentity.decimal_places;

    _mysql
      .executeQuery({
        query:
          "with recursive cte  as (\
            select  finance_account_head_id\
            from finance_account_head where account_code ='1.2.3'\
            union select H.finance_account_head_id\
            from finance_account_head  H inner join cte\
            on H.parent_acc_id = cte.finance_account_head_id  \
            )select * from cte;",

        printQuery: false,
      })
      .then((result) => {
        const head_ids = [];

        result.forEach((item) => {
          head_ids.push(item.finance_account_head_id);
        });

        _mysql
          .executeQuery({
            query: ` select finance_account_child_id,concat(child_name,' / ',COALESCE(ledger_code,'')) as child_name  from finance_account_child
              where head_id in (${head_ids});


            select    ROUND(  sum(debit_amount)-sum(H.settled_amount), ${decimal_places}) as debit_amount ,child_id from             
            finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date =CURDATE()
            group by child_id  with rollup;

            select  ROUND(sum(debit_amount)-sum(H.settled_amount), ${decimal_places}) as debit_amount ,child_id from 
            finance_voucher_header H inner join finance_voucher_details D  on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 31 DAY)  and
            DATE_SUB(CURDATE(),INTERVAL 1 DAY) group by child_id  with rollup;


            select  ROUND(sum(debit_amount)-sum(H.settled_amount) , ${decimal_places}) as debit_amount ,child_id from 
            finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 62 DAY) and
            DATE_SUB(CURDATE(),INTERVAL 32 DAY) group by child_id  with rollup;


            select ROUND( sum(debit_amount)-sum(H.settled_amount), ${decimal_places}) as debit_amount ,child_id 
            from finance_voucher_header H inner join finance_voucher_details D on  H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 93 DAY) and 
            DATE_SUB(CURDATE(),INTERVAL 63 DAY) group by child_id  with rollup;


            select  ROUND(sum(debit_amount)-sum(H.settled_amount), ${decimal_places}) as debit_amount ,child_id 
            from finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date < DATE_SUB(CURDATE(),INTERVAL 93 DAY)
            group by child_id  with rollup;`,

            printQuery: true,
          })
          .then((Result) => {
            const ledgers = Result[0];
            let todays_total = parseFloat(0).toFixed(decimal_places);
            let thirty_days_total = parseFloat(0).toFixed(decimal_places);
            let sixty_days_total = parseFloat(0).toFixed(decimal_places);
            let ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let above_ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let grand_total = parseFloat(0).toFixed(decimal_places);

            const outputArray = [];
            if (Result[1].length > 1) {
              todays_total = Result[1].pop().debit_amount;
            }
            if (Result[2].length > 1) {
              thirty_days_total = Result[2].pop().debit_amount;
            }
            if (Result[3].length > 1) {
              sixty_days_total = Result[3].pop().debit_amount;
            }
            if (Result[4].length > 1) {
              ninety_days_total = Result[4].pop().debit_amount;
            }
            if (Result[5].length > 1) {
              above_ninety_days_total = Result[5].pop().debit_amount;
            }
            ledgers.forEach((ledger) => {
              let todays_amount = parseFloat(0).toFixed(decimal_places);
              let thirty_days_amount = parseFloat(0).toFixed(decimal_places);
              let sixty_days_amount = parseFloat(0).toFixed(decimal_places);
              let ninety_days_amount = parseFloat(0).toFixed(decimal_places);
              let above_ninety_days_amount = parseFloat(0).toFixed(
                decimal_places
              );

              const todays = Result[1].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (todays) {
                todays_amount = todays.debit_amount;
              }
              const thirty_days = Result[2].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (thirty_days) {
                thirty_days_amount = thirty_days.debit_amount;
              }
              const sixty_days = Result[3].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (sixty_days) {
                sixty_days_amount = sixty_days.debit_amount;
              }
              const ninety_days = Result[4].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (ninety_days) {
                ninety_days_amount = ninety_days.debit_amount;
              }
              const above_ninety_days = Result[5].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (above_ninety_days) {
                above_ninety_days_amount = above_ninety_days.debit_amount;
              }

              const balance = (
                parseFloat(todays_amount) +
                parseFloat(thirty_days_amount) +
                parseFloat(sixty_days_amount) +
                parseFloat(ninety_days_amount) +
                parseFloat(above_ninety_days_amount)
              ).toFixed(decimal_places);

              if (balance > 0) {
                outputArray.push({
                  customer: ledger.child_name,
                  todays_amount: todays_amount,
                  thirty_days_amount: thirty_days_amount,
                  sixty_days_amount: sixty_days_amount,
                  ninety_days_amount: ninety_days_amount,
                  above_ninety_days_amount: above_ninety_days_amount,
                  balance: balance,
                });
              }
            });

            grand_total = (
              parseFloat(todays_total) +
              parseFloat(thirty_days_total) +
              parseFloat(sixty_days_total) +
              parseFloat(ninety_days_total) +
              parseFloat(above_ninety_days_total)
            ).toFixed(decimal_places);

            req.records = {
              data: outputArray,
              todays_total: todays_total,
              thirty_days_total: thirty_days_total,
              sixty_days_total: sixty_days_total,
              ninety_days_total: ninety_days_total,
              above_ninety_days_total: above_ninety_days_total,
              grand_total: grand_total,
            };
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: ACCOUNT PAYBLE REPORT
  getAccountPayableAging_Bakp_28_2020: (req, res, next) => {
    const _mysql = new algaehMysql();

    const decimal_places = req.userIdentity.decimal_places;

    _mysql
      .executeQuery({
        query:
          "with recursive cte  as (\
                  select  finance_account_head_id\
                  from finance_account_head where finance_account_head_id =38\
                  union select H.finance_account_head_id\
                  from finance_account_head  H inner join cte\
                  on H.parent_acc_id = cte.finance_account_head_id  \
                  )select * from cte;",

        printQuery: false,
      })
      .then((result) => {
        const head_ids = [];

        result.forEach((item) => {
          head_ids.push(item.finance_account_head_id);
        });

        _mysql
          .executeQuery({
            query: ` select finance_account_child_id,child_name from finance_account_child
                    where head_id in (${head_ids});
                  select    ROUND(sum(credit_amount), ${decimal_places}) as credit_amount ,child_id from finance_voucher_details where
                  head_id in(${head_ids}) and payment_date =CURDATE()
                  group by child_id  with rollup;
                  select  ROUND(sum(credit_amount), ${decimal_places}) as credit_amount ,child_id from finance_voucher_details where
                  head_id in(${head_ids}) and payment_date between  DATE_SUB(CURDATE(),INTERVAL 31 DAY)  and
                  DATE_SUB(CURDATE(),INTERVAL 1 DAY) group by child_id  with rollup;
                  select  ROUND(sum(credit_amount) , ${decimal_places}) as credit_amount ,child_id from finance_voucher_details where
                  head_id in(${head_ids}) and payment_date between  DATE_SUB(CURDATE(),INTERVAL 62 DAY) and
                  DATE_SUB(CURDATE(),INTERVAL 32 DAY) group by child_id  with rollup;
                  select ROUND( sum(credit_amount), ${decimal_places}) as credit_amount ,child_id from finance_voucher_details where
                  head_id in(${head_ids}) and payment_date between  DATE_SUB(CURDATE(),INTERVAL 93 DAY) and 
                  DATE_SUB(CURDATE(),INTERVAL 63 DAY) group by child_id  with rollup;
                  select  ROUND(sum(credit_amount), ${decimal_places}) as credit_amount ,child_id from finance_voucher_details where
                  head_id in(${head_ids}) and payment_date < DATE_SUB(CURDATE(),INTERVAL 93 DAY)
                  group by child_id  with rollup;`,

            printQuery: false,
          })
          .then((Result) => {
            const ledgers = Result[0];
            let todays_total = parseFloat(0).toFixed(decimal_places);
            let thirty_days_total = parseFloat(0).toFixed(decimal_places);
            let sixty_days_total = parseFloat(0).toFixed(decimal_places);
            let ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let above_ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let grand_total = parseFloat(0).toFixed(decimal_places);

            const outputArray = [];
            if (Result[1].length > 1) {
              todays_total = Result[1].pop().credit_amount;
            }
            if (Result[2].length > 1) {
              thirty_days_total = Result[2].pop().credit_amount;
            }
            if (Result[3].length > 1) {
              sixty_days_total = Result[3].pop().credit_amount;
            }
            if (Result[4].length > 1) {
              ninety_days_total = Result[4].pop().credit_amount;
            }
            if (Result[5].length > 1) {
              above_ninety_days_total = Result[5].pop().credit_amount;
            }

            ledgers.forEach((ledger) => {
              let todays_amount = parseFloat(0).toFixed(decimal_places);
              let thirty_days_amount = parseFloat(0).toFixed(decimal_places);
              let sixty_days_amount = parseFloat(0).toFixed(decimal_places);
              let ninety_days_amount = parseFloat(0).toFixed(decimal_places);
              let above_ninety_days_amount = parseFloat(0).toFixed(
                decimal_places
              );

              const todays = Result[1].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (todays) {
                todays_amount = todays.credit_amount;
              }
              const thirty_days = Result[2].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (thirty_days) {
                thirty_days_amount = thirty_days.credit_amount;
              }
              const sixty_days = Result[3].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (sixty_days) {
                sixty_days_amount = sixty_days.credit_amount;
              }
              const ninety_days = Result[4].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (ninety_days) {
                ninety_days_amount = ninety_days.credit_amount;
              }
              const above_ninety_days = Result[5].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (above_ninety_days) {
                above_ninety_days_amount = above_ninety_days.credit_amount;
              }

              const balance = (
                parseFloat(todays_amount) +
                parseFloat(thirty_days_amount) +
                parseFloat(sixty_days_amount) +
                parseFloat(ninety_days_amount) +
                parseFloat(above_ninety_days_amount)
              ).toFixed(decimal_places);

              if (balance > 0) {
                outputArray.push({
                  customer: ledger.child_name,
                  todays_amount: todays_amount,
                  thirty_days_amount: thirty_days_amount,
                  sixty_days_amount: sixty_days_amount,
                  ninety_days_amount: ninety_days_amount,
                  above_ninety_days_amount: above_ninety_days_amount,
                  balance: balance,
                });
              }
            });

            grand_total = (
              parseFloat(todays_total) +
              parseFloat(thirty_days_total) +
              parseFloat(sixty_days_total) +
              parseFloat(ninety_days_total) +
              parseFloat(above_ninety_days_total)
            ).toFixed(decimal_places);

            req.records = {
              data: outputArray,
              todays_total: todays_total,
              thirty_days_total: thirty_days_total,
              sixty_days_total: sixty_days_total,
              ninety_days_total: ninety_days_total,
              above_ninety_days_total: above_ninety_days_total,
              grand_total: grand_total,
            };
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan: ACCOUNT PAYBLE REPORT
  getAccountPayableAging: (req, res, next) => {
    const _mysql = new algaehMysql();

    const decimal_places = req.userIdentity.decimal_places;

    _mysql
      .executeQuery({
        query:
          "with recursive cte  as (\
            select  finance_account_head_id\
            from finance_account_head where account_code ='2.2.2'\
            union select H.finance_account_head_id\
            from finance_account_head  H inner join cte\
            on H.parent_acc_id = cte.finance_account_head_id  \
            )select * from cte;",

        printQuery: false,
      })
      .then((result) => {
        const head_ids = [];

        result.forEach((item) => {
          head_ids.push(item.finance_account_head_id);
        });

        _mysql
          .executeQuery({
            query: ` select finance_account_child_id,concat(child_name,' / ',COALESCE(ledger_code,'')) as child_name 
            from finance_account_child              where head_id in (${head_ids});


            select    ROUND(  sum(credit_amount)-sum(H.settled_amount), ${decimal_places}) as credit_amount ,child_id from             
            finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date =CURDATE()
            group by child_id  with rollup;

            select  ROUND(sum(credit_amount)-sum(H.settled_amount), ${decimal_places}) as credit_amount ,child_id from 
            finance_voucher_header H inner join finance_voucher_details D  on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 31 DAY)  and
            DATE_SUB(CURDATE(),INTERVAL 1 DAY) group by child_id  with rollup;


            select  ROUND(sum(credit_amount)-sum(H.settled_amount) , ${decimal_places}) as credit_amount ,child_id from 
            finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 62 DAY) and
            DATE_SUB(CURDATE(),INTERVAL 32 DAY) group by child_id  with rollup;


            select ROUND( sum(credit_amount)-sum(H.settled_amount), ${decimal_places}) as credit_amount ,child_id 
            from finance_voucher_header H inner join finance_voucher_details D on  H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date between  DATE_SUB(CURDATE(),INTERVAL 93 DAY) and 
            DATE_SUB(CURDATE(),INTERVAL 63 DAY) group by child_id  with rollup;


            select  ROUND(sum(credit_amount)-sum(H.settled_amount), ${decimal_places}) as credit_amount ,child_id 
            from finance_voucher_header H inner join finance_voucher_details D on H.finance_voucher_header_id=D.voucher_header_id where
            head_id in(${head_ids}) and settlement_status='P' and D.auth_status='A' and H.due_date < DATE_SUB(CURDATE(),INTERVAL 93 DAY)
            group by child_id  with rollup;`,

            printQuery: true,
          })
          .then((Result) => {
            const ledgers = Result[0];
            let todays_total = parseFloat(0).toFixed(decimal_places);
            let thirty_days_total = parseFloat(0).toFixed(decimal_places);
            let sixty_days_total = parseFloat(0).toFixed(decimal_places);
            let ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let above_ninety_days_total = parseFloat(0).toFixed(decimal_places);
            let grand_total = parseFloat(0).toFixed(decimal_places);

            const outputArray = [];
            if (Result[1].length > 1) {
              todays_total = Result[1].pop().credit_amount;
            }
            if (Result[2].length > 1) {
              thirty_days_total = Result[2].pop().credit_amount;
            }
            if (Result[3].length > 1) {
              sixty_days_total = Result[3].pop().credit_amount;
            }
            if (Result[4].length > 1) {
              ninety_days_total = Result[4].pop().credit_amount;
            }
            if (Result[5].length > 1) {
              above_ninety_days_total = Result[5].pop().credit_amount;
            }

            ledgers.forEach((ledger) => {
              let todays_amount = parseFloat(0).toFixed(decimal_places);
              let thirty_days_amount = parseFloat(0).toFixed(decimal_places);
              let sixty_days_amount = parseFloat(0).toFixed(decimal_places);
              let ninety_days_amount = parseFloat(0).toFixed(decimal_places);
              let above_ninety_days_amount = parseFloat(0).toFixed(
                decimal_places
              );

              const todays = Result[1].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (todays) {
                todays_amount = todays.credit_amount;
              }
              const thirty_days = Result[2].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (thirty_days) {
                thirty_days_amount = thirty_days.credit_amount;
              }
              const sixty_days = Result[3].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (sixty_days) {
                sixty_days_amount = sixty_days.credit_amount;
              }
              const ninety_days = Result[4].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );
              if (ninety_days) {
                ninety_days_amount = ninety_days.credit_amount;
              }
              const above_ninety_days = Result[5].find(
                (f) => f.child_id == ledger.finance_account_child_id
              );

              if (above_ninety_days) {
                above_ninety_days_amount = above_ninety_days.credit_amount;
              }

              const balance = (
                parseFloat(todays_amount) +
                parseFloat(thirty_days_amount) +
                parseFloat(sixty_days_amount) +
                parseFloat(ninety_days_amount) +
                parseFloat(above_ninety_days_amount)
              ).toFixed(decimal_places);

              if (balance > 0) {
                outputArray.push({
                  customer: ledger.child_name,
                  todays_amount: todays_amount,
                  thirty_days_amount: thirty_days_amount,
                  sixty_days_amount: sixty_days_amount,
                  ninety_days_amount: ninety_days_amount,
                  above_ninety_days_amount: above_ninety_days_amount,
                  balance: balance,
                });
              }
            });

            grand_total = (
              parseFloat(todays_total) +
              parseFloat(thirty_days_total) +
              parseFloat(sixty_days_total) +
              parseFloat(ninety_days_total) +
              parseFloat(above_ninety_days_total)
            ).toFixed(decimal_places);

            req.records = {
              data: outputArray,
              todays_total: todays_total,
              thirty_days_total: thirty_days_total,
              sixty_days_total: sixty_days_total,
              ninety_days_total: ninety_days_total,
              above_ninety_days_total: above_ninety_days_total,
              grand_total: grand_total,
            };
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: MONTH WISE P&L
  getProfitAndLossMonthWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.query;
    const decimal_places = req.userIdentity.decimal_places;
    let whrStr = " and VD.year=" + input.year;

    const months = [
      { month_name: "JAN", month_no: "1" },
      { month_name: "FEB", month_no: "2" },
      { month_name: "MAR", month_no: "3" },
      { month_name: "APR", month_no: "4" },
      { month_name: "MAY", month_no: "5" },
      { month_name: "JUN", month_no: "6" },
      { month_name: "JUL", month_no: "7" },
      { month_name: "AUG", month_no: "8" },
      { month_name: "SEP", month_no: "9" },
      { month_name: "OCT", month_no: "10" },
      { month_name: "NOV", month_no: "11" },
      { month_name: "DEC", month_no: "12" },
    ];
    // const months = {
    //   1: JAN,
    //   2: FEB,
    //   3: MAR,
    //   4: APR,
    //   5: MAY,
    //   6: JUN,
    //   7: JUL,
    //   8: AUG,
    //   9: SEP,
    //   10: OCT,
    //   11: NOV,
    //   12: DEC
    // };
    _mysql
      .executeQuery({
        query:
          "SELECT cost_center_type,cost_center_required  FROM finance_options limit 1; ",
      })
      .then((result) => {
        if (result[0]["cost_center_required"] == "Y") {
          if (input.hospital_id > 0) {
            whrStr += " and VD.hospital_id= " + input.hospital_id;
          }

          if (input.cost_center_id > 0) {
            switch (result[0]["cost_center_type"]) {
              case "P":
                whrStr += " and VD.project_id= " + input.cost_center_id;

                break;
              case "SD":
                whrStr +=
                  " and  VD.sub_department_id = " + input.cost_center_id;

                break;
              case "B":
                whrStr += " and VD.hospital_id= " + input.cost_center_id;
            }
          }
        }
        getLedgersForProfitAndLossMonthWise(
          _mysql,
          decimal_places,
          4,
          whrStr,
          months
        )
          .then((income) => {
            getLedgersForProfitAndLossMonthWise(
              _mysql,
              decimal_places,
              5,
              whrStr,
              months
            )
              .then((expense) => {
                _mysql.releaseConnection();
                const totals = {};

                let profit = 0;
                months.forEach((item) => {
                  const month_no = item.month_no;
                  const income_amount = income[month_no];
                  const expense_amount = expense[month_no];

                  let indivisual_profit = (
                    parseFloat(income_amount) - parseFloat(expense_amount)
                  ).toFixed(decimal_places);

                  profit = (
                    parseFloat(profit) + parseFloat(indivisual_profit)
                  ).toFixed(decimal_places);

                  totals[month_no] = indivisual_profit;
                });

                req.records = {
                  profit: profit,
                  months: months,
                  income: income,
                  expense: expense,
                  totals: totals,
                };
                next();
              })
              .catch((e) => {
                next(e);
              });
          })
          .catch((e) => {
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
};

//created by irfan: TRIAL BALANCE
function getAccountHeadsForTrialBalance(
  decimal_places,
  finance_account_head_id
) {
  // const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }

      let str = "";
      let qrystr = "";

      if (finance_account_head_id == 3) {
        str = " and  VD.child_id <> 1 ";
        qrystr = " and  finance_account_child_id <> 1 ";
      }
      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,concat(account_name,' / ',coalesce(group_code,concat('sys-',account_code))) as account_name,account_parent,account_level,
          H.created_from as created_status ,sort_order,parent_acc_id,root_id,
          finance_account_child_id,concat(child_name,' / ',ledger_code) as child_name,head_id,C.created_from as child_created_from
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id ${qrystr}
           where root_id=?  order by account_level,sort_order;   
         
           select *, ROUND(if((cred_minus_deb-deb_minus_cred)>0 ,cred_minus_deb,0.0000),${decimal_places}) as credit_side ,
          ROUND(if ((deb_minus_cred-cred_minus_deb)>0 ,deb_minus_cred,0.0000),${decimal_places}) as debit_side from 
          (select C.head_id,finance_account_child_id as child_id,child_name,account_level,
          ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount,
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A' ${str}
          where H.root_id=? 
          group by C.finance_account_child_id) AS A;


          select max(account_level) as account_level from finance_account_head 
          where root_id=?;
          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level          
          from finance_account_head
          where root_id=? order by account_level;  `,

          values: [
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmountForTrialBalance(
            result[3],
            result[2],
            decimal_places,
            result[1]
          )
            .then((head_data) => {
              const outputArray = createHierarchyForTB(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );
              resolve(outputArray);
            })
            .catch((e) => {
              console.log("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}
//created by irfan: ALL REPORTS
function getAccountHeadsForReport(
  decimal_places,
  finance_account_head_id,
  str
) {
  // const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }

      let qryStr = "";
      if (str) {
        qryStr = str;
      }
      //concat(account_name,' / ',account_code)as
      //concat(child_name,' / ',ledger_code) as
      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,account_name,
           account_parent,account_level,          H.created_from as created_status ,sort_order,parent_acc_id,root_id,
          finance_account_child_id, child_name,head_id,C.created_from as child_created_from,
          coalesce(H.arabic_account_name,'') as arabic_account_name,
          coalesce(C.arabic_child_name,'') as arabic_child_name
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id 
           where root_id=? order by account_level,sort_order;           
           select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'   ${qryStr}
          where H.root_id=? 
          group by C.finance_account_child_id;
          select max(account_level) as account_level from finance_account_head 
          where root_id=?;
          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A'   ${qryStr}
          where H.root_id=?  
          group by H.finance_account_head_id  order by account_level;  `,

          values: [
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
            finance_account_head_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          const child_data = result[1];

          calcAmount(result[3], result[2], decimal_places)
            .then((head_data) => {
              const outputArray = createHierarchy(
                result[0],
                child_data,
                head_data,
                trans_symbol,
                default_total,
                decimal_places
              );

              resolve(outputArray[0]);
            })
            .catch((e) => {
              console.log("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}

//created by :IRFAN to calculate the amount of account heads
function calcAmount(account_heads, levels, decimal_places) {
  return new Promise((resolve, reject) => {
    try {
      const max_account_level = parseInt(levels[0]["account_level"]);

      let levels_group = _.chain(account_heads)
        .groupBy((g) => g.account_level)
        .value();
      // console.log("<<<<<<----levels_group---->>>>>>>", levels_group);
      if (levels_group[max_account_level]) {
        levels_group[max_account_level].map((m) => {
          m["total_debit_amount"] = m["debit_amount"];
          m["total_credit_amount"] = m["credit_amount"];

          m["cred_minus_deb"] = parseFloat(
            parseFloat(m["credit_amount"]) - parseFloat(m["debit_amount"])
          ).toFixed(decimal_places);
          m["deb_minus_cred"] = parseFloat(
            parseFloat(m["debit_amount"]) - parseFloat(m["credit_amount"])
          ).toFixed(decimal_places);
          return m;
        });
      }

      for (let i = max_account_level - 1; i >= 0; i--) {
        // for (let k = 0; k < levels_group[i].length; k++) {
        if (levels_group[i]) {
          levels_group[i].map((item) => {
            let immediate_childs = levels_group[i + 1].filter((child) => {
              if (item.finance_account_head_id == child.parent_acc_id) {
                return item;
              }
            });

            const total_debit_amount = _.chain(immediate_childs)
              .sumBy((s) => parseFloat(s.total_debit_amount))
              .value()
              .toFixed(decimal_places);

            const total_credit_amount = _.chain(immediate_childs)
              .sumBy((s) => parseFloat(s.total_credit_amount))
              .value()
              .toFixed(decimal_places);

            item["total_debit_amount"] = parseFloat(
              parseFloat(item["debit_amount"]) + parseFloat(total_debit_amount)
            ).toFixed(decimal_places);

            item["total_credit_amount"] = parseFloat(
              parseFloat(item["credit_amount"]) +
                parseFloat(total_credit_amount)
            ).toFixed(decimal_places);

            item["cred_minus_deb"] = parseFloat(
              parseFloat(item["total_credit_amount"]) -
                parseFloat(item["total_debit_amount"])
            ).toFixed(decimal_places);
            item["deb_minus_cred"] = parseFloat(
              parseFloat(item["total_debit_amount"]) -
                parseFloat(item["total_credit_amount"])
            ).toFixed(decimal_places);

            return item;
          });
        }
        // }
      }
      const final_res = [];

      let len = Object.keys(levels_group).length;

      for (let i = 0; i < len; i++) {
        if (levels_group[i]) {
          final_res.push(...levels_group[i]);
        }
      }
      resolve(final_res);
    } catch (e) {
      console.log("am55:", e);
      reject(e);
    }
  });
}
//created by :IRFAN to calculate the amount of account heads
function calcAmountForTrialBalance(
  account_heads,
  levels,
  decimal_places,
  child_data
) {
  try {
    // const utilities = new algaehUtilities();
    return new Promise((resolve, reject) => {
      const max_account_level = parseInt(levels[0]["account_level"]);

      // let levels_group = _.chain(account_heads)
      //   .groupBy(g => g.account_level)
      //   .value();

      // console.log("levels_group,", levels_group);

      for (let i = 0; i < account_heads.length; i++) {
        const total_debit_side = _.chain(child_data)
          .filter((f) => f.head_id == account_heads[i].finance_account_head_id)
          .sumBy((s) => parseFloat(s.debit_side))
          .value()
          .toFixed(decimal_places);

        const total_credit_side = _.chain(child_data)
          .filter((f) => f.head_id == account_heads[i].finance_account_head_id)
          .sumBy((s) => parseFloat(s.credit_side))
          .value()
          .toFixed(decimal_places);

        account_heads[i]["total_debit_side"] = total_debit_side;
        account_heads[i]["total_credit_side"] = total_credit_side;
      }

      let levels_group = _.chain(account_heads)
        .groupBy((g) => g.account_level)
        .value();

      let tempArray = [];
      for (let i = max_account_level - 1; i >= 0; i--) {
        // for (let k = 0; k < levels_group[i].length; k++) {

        levels_group[i].map((item) => {
          let immediate_childs = levels_group[i + 1].filter((child) => {
            if (item.finance_account_head_id == child.parent_acc_id) {
              return child;
            }
          });

          const total_credit_side = _.chain(immediate_childs)
            .sumBy((s) => parseFloat(s.total_credit_side))
            .value()
            .toFixed(decimal_places);

          const total_debit_side = _.chain(immediate_childs)
            .sumBy((s) => parseFloat(s.total_debit_side))
            .value()
            .toFixed(decimal_places);

          item["total_debit_side"] = (
            parseFloat(item["total_debit_side"]) + parseFloat(total_debit_side)
          ).toFixed(decimal_places);

          item["total_credit_side"] = (
            parseFloat(item["total_credit_side"]) +
            parseFloat(total_credit_side)
          ).toFixed(decimal_places);

          // item["total_debit_side"] = total_debit_side;

          // item["total_credit_side"] = total_credit_side;

          return item;
        });
        // }
      }

      const final_res = [];

      let len = Object.keys(levels_group).length;

      for (let i = 0; i < len; i++) {
        final_res.push(...levels_group[i]);
      }

      resolve(final_res);
    });
  } catch (e) {
    console.log("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function createHierarchy(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
    // const onlyChilds = [];
    // const utilities = new algaehUtilities();
    let roots = [],
      children = {};

    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      let item = arry[i],
        p = item.parent_acc_id,
        //if it has no parent_acc_id
        //seprating roots to roots array childerens to childeren array
        target = !p ? roots : children[p] || (children[p] = []);

      if (
        item.finance_account_child_id > 0 &&
        item.finance_account_head_id == item.head_id
      ) {
        let child =
          children[item.finance_account_head_id] ||
          (children[item.finance_account_head_id] = []);

        //ST---calulating Amount
        const BALANCE = child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let amount = 0;
        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            amount = parseFloat(BALANCE.deb_minus_cred).toFixed(decimal_places);
          } else {
            amount = parseFloat(BALANCE.cred_minus_deb).toFixed(decimal_places);
          }

          // if (trans_symbol == "Dr.") {
          //   amount = BALANCE.deb_minus_cred;
          // } else {
          //   amount = BALANCE.cred_minus_deb;
          // }
        } else {
          amount = default_total;
        }

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,
          subtitle: amount,
          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          arabic_name: item.arabic_child_name,
          disabled: false,
          leafnode: "Y",
          created_status: item["child_created_from"],
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          //ST---calulating Amount
          const BALANCE = head_data.find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = BALANCE.deb_minus_cred;
            } else {
              amount = BALANCE.cred_minus_deb;
            }
          } else {
            amount = default_total;
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            subtitle: amount,
            title: item.account_name,
            label: item.account_name,
            disabled: true,
            arabic_name: item.arabic_account_name,
            leafnode: "N",
          });
        }
      } else {
        //ST---calulating Amount
        const BALANCE = head_data.find((f) => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });

        let amount = 0;
        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            amount = BALANCE.deb_minus_cred;
          } else {
            amount = BALANCE.cred_minus_deb;
          }
        } else {
          amount = default_total;
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,
          subtitle: amount,
          title: item.account_name,
          label: item.account_name,
          arabic_name: item.arabic_account_name,
          disabled: true,
          leafnode: "N",
        });
      }
    }

    // utilities.logger().log("roots:", roots);
    // utilities.logger().log("children:", children);

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        const tempchilds = children[parent.finance_account_head_id];

        parent.children = tempchilds;

        for (let i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (let i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    return roots;
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}

//created by :IRFAN to build tree hierarchy TRIAL BALANCE
function createHierarchyForTB_BAKUP_JAN_16_2020(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
    // const onlyChilds = [];
    // const utilities = new algaehUtilities();
    let roots = [],
      children = {};

    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      let item = arry[i],
        p = item.parent_acc_id,
        //if it has no parent_acc_id
        //seprating roots to roots array childerens to childeren array
        target = !p ? roots : children[p] || (children[p] = []);

      //CHILD ACCOUNT
      if (
        item.finance_account_child_id > 0 &&
        item.finance_account_head_id == item.head_id
      ) {
        let child =
          children[item.finance_account_head_id] ||
          (children[item.finance_account_head_id] = []);

        //ST---calulating Amount
        const BALANCE = child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
        let tr_credit_amount = parseFloat(0).toFixed(decimal_places);

        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            if (BALANCE.deb_minus_cred > BALANCE.cred_minus_deb) {
              tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            } else {
              tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            }
          } else {
            if (BALANCE.cred_minus_deb > BALANCE.deb_minus_cred) {
              tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            } else {
              tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            }
          }
        }

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,

          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          tr_debit_amount: tr_debit_amount,
          tr_credit_amount: tr_credit_amount,

          leafnode: "Y",
          created_status: item["child_created_from"],
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        //HEAD ACCOUNT IN SIDE CHILD
        if (!data) {
          //ST---calulating Amount
          const BALANCE = head_data.find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
          let tr_credit_amount = parseFloat(0).toFixed(decimal_places);

          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              if (BALANCE.deb_minus_cred > BALANCE.cred_minus_deb) {
                tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                  decimal_places
                );
              } else {
                tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                  decimal_places
                );
              }
            } else {
              if (BALANCE.cred_minus_deb > BALANCE.deb_minus_cred) {
                tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                  decimal_places
                );
              } else {
                tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                  decimal_places
                );
              }
            }
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            title: item.account_name,
            label: item.account_name,
            tr_debit_amount: tr_debit_amount,
            tr_credit_amount: tr_credit_amount,
            leafnode: "N",
          });
        }
      }
      //HEAD ACCOUNT
      else {
        //ST---calulating Amount
        const BALANCE = head_data.find((f) => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });

        let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
        let tr_credit_amount = parseFloat(0).toFixed(decimal_places);
        if (BALANCE != undefined) {
          if (trans_symbol == "Dr.") {
            if (BALANCE.deb_minus_cred > BALANCE.cred_minus_deb) {
              tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            } else {
              tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            }
          } else {
            if (BALANCE.cred_minus_deb > BALANCE.deb_minus_cred) {
              tr_credit_amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            } else {
              tr_debit_amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            }
          }
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,

          title: item.account_name,
          label: item.account_name,
          tr_debit_amount: tr_debit_amount,
          tr_credit_amount: tr_credit_amount,
          leafnode: "N",
        });
      }
    }

    // utilities.logger().log("roots:", roots);
    // utilities.logger().log("children:", children);

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        const tempchilds = children[parent.finance_account_head_id];

        parent.children = tempchilds;

        for (let i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (let i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    return roots;
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}
//created by :IRFAN to build tree hierarchy TRIAL BALANCE
function createHierarchyForTB(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
    let total_debit_amount = parseFloat(0).toFixed(decimal_places);
    let total_credit_amount = parseFloat(0).toFixed(decimal_places);

    let roots = [],
      children = {};

    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      let item = arry[i],
        p = item.parent_acc_id,
        //seprating roots to roots array childerens to childeren array
        //if it has no parent_acc_id then its root
        //if children already exist uses existing children else create new children
        target = !p ? roots : children[p] || (children[p] = []);

      //CHILD ACCOUNT
      if (
        item.finance_account_child_id > 0 &&
        item.finance_account_head_id == item.head_id
      ) {
        let child =
          children[item.finance_account_head_id] ||
          (children[item.finance_account_head_id] = []);

        //ST---calulating Amount
        const BALANCE = child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
        let tr_credit_amount = parseFloat(0).toFixed(decimal_places);

        if (BALANCE != undefined) {
          total_debit_amount = (
            parseFloat(total_debit_amount) + parseFloat(BALANCE.debit_side)
          ).toFixed(decimal_places);

          total_credit_amount = (
            parseFloat(total_credit_amount) + parseFloat(BALANCE.credit_side)
          ).toFixed(decimal_places);

          tr_debit_amount = parseFloat(BALANCE.debit_side).toFixed(
            decimal_places
          );

          tr_credit_amount = parseFloat(BALANCE.credit_side).toFixed(
            decimal_places
          );
        }

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,

          title: item.child_name,
          label: item.child_name,
          head_id: item["head_id"],
          tr_debit_amount: tr_debit_amount,
          tr_credit_amount: tr_credit_amount,

          leafnode: "Y",
          created_status: item["child_created_from"],
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        //HEAD ACCOUNT IN SIDE CHILD
        if (!data) {
          //ST---calulating Amount
          const BALANCE = head_data.find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
          let tr_credit_amount = parseFloat(0).toFixed(decimal_places);

          if (BALANCE != undefined) {
            tr_debit_amount = parseFloat(BALANCE.total_debit_side).toFixed(
              decimal_places
            );

            tr_credit_amount = parseFloat(BALANCE.total_credit_side).toFixed(
              decimal_places
            );
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            title: item.account_name,
            label: item.account_name,
            tr_debit_amount: tr_debit_amount,
            tr_credit_amount: tr_credit_amount,
            leafnode: "N",
          });
        }
      }

      //HEAD ACCOUNT
      else {
        //ST---calulating Amount
        const BALANCE = head_data.find((f) => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });

        let tr_debit_amount = parseFloat(0).toFixed(decimal_places);
        let tr_credit_amount = parseFloat(0).toFixed(decimal_places);
        if (BALANCE != undefined) {
          tr_debit_amount = parseFloat(BALANCE.total_debit_side).toFixed(
            decimal_places
          );

          tr_credit_amount = parseFloat(BALANCE.total_credit_side).toFixed(
            decimal_places
          );
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,

          title: item.account_name,
          label: item.account_name,
          tr_debit_amount: tr_debit_amount,
          tr_credit_amount: tr_credit_amount,
          leafnode: "N",
        });
      }
    }

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        const tempchilds = children[parent.finance_account_head_id];

        parent.children = tempchilds;

        for (let i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (let i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    return { roots, total_debit_amount, total_credit_amount };
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}

//created by :IRFAN for cost center wise profit and loss
function getAccountHeadsForProfitAndLoss(
  decimal_places,
  finance_account_head_id,
  selectStr,
  whrStr,
  costCenterQuery
) {
  // const utilities = new algaehUtilities();
  const _mysql = new algaehMysql();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id == 4 || finance_account_head_id == 5) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }
      //concat(account_name,' / ',account_code)as
      //concat(child_name,' / ',ledger_code) as
      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code,account_name,account_parent,account_level,
          sort_order,parent_acc_id,root_id,          finance_account_child_id,child_name,head_id,ledger_code
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id 
           where root_id=? order by account_level,sort_order;  
          
          select max(account_level) as account_level from finance_account_head 
          where root_id=?;  ${costCenterQuery} `,

          values: [finance_account_head_id, finance_account_head_id],
          printQuery: true,
        })
        .then((result) => {
          let headQuery = "";
          let childQuery = "";

          let i = 0,
            len = result[2].length;
          for (i; i < len; i++) {
            headQuery += `  select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level ${selectStr}
                            ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
                            ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
                            from finance_account_head H              
                            left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A' 
                            ${whrStr} ${result[2][i]["cost_center_id"]} where H.root_id=${finance_account_head_id} 
                            group by H.finance_account_head_id   order by account_level; `;

            childQuery += ` select C.head_id,finance_account_child_id as child_id  ${selectStr}
                          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
                          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, 
                          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
                          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
                          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
                          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'    
                          ${whrStr} ${result[2][i]["cost_center_id"]}  where H.root_id=${finance_account_head_id} 
                          group by C.finance_account_child_id ;`;
          }
          _mysql
            .executeQuery({
              query: `${headQuery} ${childQuery} `,
              printQuery: true,
            })
            .then((results) => {
              _mysql.releaseConnection();

              let child_iterator = len;

              const headObj = {};
              const childObj = {};

              for (let k = 0; k < len; k++) {
                let cost = result[2][k]["cost_center_id"];
                childObj[cost] = results[child_iterator];
                child_iterator++;

                let head_data = calcAmountForProfitAndLoss(
                  results[k],
                  result[1],
                  decimal_places
                );

                headObj[cost] = head_data;
              }

              const outputArray = buildHierarchyForProfitAndLoss(
                result[0],
                childObj,
                headObj,
                trans_symbol,
                default_total,
                decimal_places
              );

              resolve({ outputArray: outputArray[0], cost_centers: result[2] });
              // utilities.logger().log("headObj:", headObj);
            })
            .catch((e) => {
              _mysql.releaseConnection();
              reject(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}

//created by :IRFAN to calculate the amount of account heads
function calcAmountForProfitAndLoss(account_heads, levels, decimal_places) {
  try {
    const max_account_level = parseInt(levels[0]["account_level"]);

    let levels_group = _.chain(account_heads)
      .groupBy((g) => g.account_level)
      .value();

    levels_group[max_account_level].map((m) => {
      m["total_debit_amount"] = m["debit_amount"];
      m["total_credit_amount"] = m["credit_amount"];

      m["cred_minus_deb"] = parseFloat(
        parseFloat(m["credit_amount"]) - parseFloat(m["debit_amount"])
      ).toFixed(decimal_places);
      m["deb_minus_cred"] = parseFloat(
        parseFloat(m["debit_amount"]) - parseFloat(m["credit_amount"])
      ).toFixed(decimal_places);
      return m;
    });

    for (let i = max_account_level - 1; i >= 0; i--) {
      // for (let k = 0; k < levels_group[i].length; k++) {
      levels_group[i].map((item) => {
        let immediate_childs = levels_group[i + 1].filter((child) => {
          if (item.finance_account_head_id == child.parent_acc_id) {
            return item;
          }
        });

        const total_debit_amount = _.chain(immediate_childs)
          .sumBy((s) => parseFloat(s.total_debit_amount))
          .value()
          .toFixed(decimal_places);

        const total_credit_amount = _.chain(immediate_childs)
          .sumBy((s) => parseFloat(s.total_credit_amount))
          .value()
          .toFixed(decimal_places);

        item["total_debit_amount"] = parseFloat(
          parseFloat(item["debit_amount"]) + parseFloat(total_debit_amount)
        ).toFixed(decimal_places);

        item["total_credit_amount"] = parseFloat(
          parseFloat(item["credit_amount"]) + parseFloat(total_credit_amount)
        ).toFixed(decimal_places);

        item["cred_minus_deb"] = parseFloat(
          parseFloat(item["total_credit_amount"]) -
            parseFloat(item["total_debit_amount"])
        ).toFixed(decimal_places);
        item["deb_minus_cred"] = parseFloat(
          parseFloat(item["total_debit_amount"]) -
            parseFloat(item["total_credit_amount"])
        ).toFixed(decimal_places);

        return item;
      });
      // }
    }
    const final_res = [];

    let len = Object.keys(levels_group).length;

    for (let i = 0; i < len; i++) {
      final_res.push(...levels_group[i]);
    }
    return final_res;
  } catch (e) {
    console.log("am55:", e);
    reject(e);
  }
}

//created by :IRFAN to build tree hierarchy
function buildHierarchyForProfitAndLoss(
  arry,
  child_data,
  head_data,
  trans_symbol,
  default_total,
  decimal_places
) {
  try {
    // const onlyChilds = [];
    // const utilities = new algaehUtilities();

    let roots = [],
      children = {};

    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      let item = arry[i],
        p = item.parent_acc_id,
        //if it has no parent_acc_id
        //seprating roots to roots array childerens to childeren array
        target = !p ? roots : children[p] || (children[p] = []);

      if (
        item.finance_account_child_id > 0 &&
        item.finance_account_head_id == item.head_id
      ) {
        let child =
          children[item.finance_account_head_id] ||
          (children[item.finance_account_head_id] = []);

        let subtitleObj = {};

        for (let child in child_data) {
          //ST---calulating Amount
          const BALANCE = child_data[child].find((f) => {
            return (
              item.finance_account_head_id == f.head_id &&
              item.finance_account_child_id == f.child_id
            );
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = parseFloat(BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );

              subtitleObj[child] = amount;
            } else {
              amount = parseFloat(BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );

              subtitleObj[child] = amount;
            }
          }
        }

        //END---calulating Amount
        child.push({
          finance_account_child_id: item["finance_account_child_id"],
          trans_symbol: trans_symbol,
          ...subtitleObj,
          ledger_code: item.ledger_code,
          label: item.child_name,
          head_id: item["head_id"],

          leafnode: "Y",
        });

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });

        if (!data) {
          let subtitleObj = {};
          //ST---calulating Amount
          for (let head in head_data) {
            const BALANCE = head_data[head].find((f) => {
              return item.finance_account_head_id == f.finance_account_head_id;
            });

            let amount = 0;
            if (BALANCE != undefined) {
              if (trans_symbol == "Dr.") {
                amount = BALANCE.deb_minus_cred;

                subtitleObj[head] = amount;
              } else {
                amount = BALANCE.cred_minus_deb;

                subtitleObj[head] = amount;
              }
            }
          }

          //END---calulating Amount

          target.push({
            ...item,
            trans_symbol: trans_symbol,
            ...subtitleObj,
            ledger_code: item.account_code,
            label: item.account_name,

            leafnode: "N",
          });
        }
      } else {
        let subtitleObj = {};
        //ST---calulating Amount
        for (let head in head_data) {
          const BALANCE = head_data[head].find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let amount = 0;
          if (BALANCE != undefined) {
            if (trans_symbol == "Dr.") {
              amount = BALANCE.deb_minus_cred;

              subtitleObj[head] = amount;
            } else {
              amount = BALANCE.cred_minus_deb;

              subtitleObj[head] = amount;
            }
          }
        }

        //END---calulating Amount

        target.push({
          ...item,
          trans_symbol: trans_symbol,
          ...subtitleObj,

          label: item.account_name,
          ledger_code: item.account_code,
          leafnode: "N",
        });
      }
    }

    // utilities.logger().log("roots:", roots);
    // utilities.logger().log("children:", children);

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        const tempchilds = children[parent.finance_account_head_id];

        parent.children = tempchilds;

        for (let i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (let i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    return roots;
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}

//created by :IRFAN MONTH wise profit and loss
function getLedgersForProfitAndLossMonthWise(
  _mysql,
  decimal_places,
  finance_account_head_id,
  whrStr,
  months
) {
  // const utilities = new algaehUtilities();

  return new Promise((resolve, reject) => {
    if (finance_account_head_id == 4 || finance_account_head_id == 5) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr.";
      if (finance_account_head_id == 5) {
        trans_symbol = "Dr.";
      }
      //concat(account_name,' / ',account_code)as
      //concat(child_name,' / ',ledger_code) as
      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code, account_name,account_parent,account_level,
          sort_order,parent_acc_id,root_id,          finance_account_child_id, child_name,head_id,ledger_code
          from finance_account_head H left join 
          finance_account_child C on C.head_id=H.finance_account_head_id 
           where root_id=? order by account_level,sort_order;  
          
          select max(account_level) as account_level from finance_account_head 
          where root_id=?; `,

          values: [finance_account_head_id, finance_account_head_id],
          printQuery: false,
        })
        .then((result) => {
          let headQuery = "";
          let childQuery = "";

          let i = 1,
            len = 12;
          for (i; i <= len; i++) {
            headQuery += `  select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level  
                            ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
                            ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount
                            from finance_account_head H              
                            left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A' 
                            ${whrStr} and VD.month=${i}  where H.root_id=${finance_account_head_id}   
                            group by H.finance_account_head_id   order by account_level; `;

            childQuery += ` select C.head_id,finance_account_child_id as child_id  
                          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
                          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount, 
                          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
                          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
                          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
                          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'    
                          ${whrStr} and VD.month=${i}  where H.root_id=${finance_account_head_id}   
                          group by C.finance_account_child_id ;`;
          }
          _mysql
            .executeQuery({
              query: `${headQuery} ${childQuery} `,
              printQuery: false,
            })
            .then((results) => {
              _mysql.releaseConnection();
              let child_iterator = len;

              const headObj = {};
              const childObj = {};

              for (let k = 0; k < len; k++) {
                let month_no = months[k]["month_no"];

                childObj[month_no] = results[child_iterator];
                child_iterator++;

                let head_data = calcAmountForProfitAndLoss(
                  results[k],
                  result[1],
                  decimal_places
                );

                headObj[month_no] = head_data;
              }

              const outputArray = buildHierarchyForProfitAndLoss(
                result[0],
                childObj,
                headObj,
                trans_symbol,
                default_total,
                decimal_places
              );

              resolve(outputArray[0]);
              // utilities.logger().log("headObj:", headObj);
            })
            .catch((e) => {
              _mysql.releaseConnection();
              reject(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}

//created by irfan:
function getTrialBalanceFunc(
  decimal_places,
  finance_account_head_id,
  options,
  next
) {
  //const utilities = new algaehUtilities();

  const _mysql = options._mysql;
  const non_zero = options.non_zero;
  return new Promise((resolve, reject) => {
    if (finance_account_head_id > 0 && finance_account_head_id < 6) {
      const default_total = parseFloat(0).toFixed(decimal_places);
      let trans_symbol = "Cr";
      if (finance_account_head_id == 1 || finance_account_head_id == 5) {
        trans_symbol = "Dr";
      }
      let str = "";
      let qryStr = "";

      if (finance_account_head_id == 3) {
        qryStr = " and  VD.child_id <> 1 ";
        str = " and  finance_account_child_id <> 1 ";
      }
      //VD.payment_date < ?
      const nonZeroQuery = non_zero
        ? " and (debit_amount !=0 or credit_amount !=0) "
        : "";
      //concat(account_name,' / ',account_code)
      //concat(child_name,' / ',coalesce(ledger_code,'')) as
      _mysql
        .executeQuery({
          query: `select finance_account_head_id,account_code, account_name,
           account_parent,account_level, parent_acc_id,root_id,
          finance_account_child_id, child_name,head_id, 
          coalesce(H.arabic_account_name,'') as arabic_account_name, coalesce(C.arabic_child_name,'') as arabic_child_name,
          H.group_code as header_ledger_code,C.ledger_code as child_ledger_code
          from finance_account_head H left join finance_account_child C on C.head_id=H.finance_account_head_id ${str} where root_id=?  ; 

          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount , 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'   ${qryStr}
          and date(VD.payment_date) < date(?)   where H.root_id=?  group by C.finance_account_child_id;

          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A'   ${qryStr}
          and date(VD.payment_date) < date(?)  where H.root_id=?  group by H.finance_account_head_id   ; 

          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount , 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'   ${qryStr}
          and date(VD.payment_date) between date(?) and date(?) where H.root_id=?  group by C.finance_account_child_id;

          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A'   ${qryStr}
          and  date(VD.payment_date) between date(?) and date(?) where H.root_id=?  group by H.finance_account_head_id   ; 

          select C.head_id,finance_account_child_id as child_id
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount , 
          ROUND((coalesce(sum(credit_amount) ,0.0000)- coalesce(sum(debit_amount) ,0.0000) ),${decimal_places}) as cred_minus_deb,
          ROUND( (coalesce(sum(debit_amount) ,0.0000)- coalesce(sum(credit_amount) ,0.0000)),${decimal_places})  as deb_minus_cred
          from finance_account_head H inner join finance_account_child C on C.head_id=H.finance_account_head_id              
          left join finance_voucher_details VD on C.finance_account_child_id=VD.child_id and VD.auth_status='A'   ${qryStr}
          and date(VD.payment_date) < date(?)  where H.root_id=?  group by C.finance_account_child_id;

          select finance_account_head_id,coalesce(parent_acc_id,'root') as parent_acc_id  ,account_level
          ,ROUND(coalesce(sum(debit_amount) ,0.0000),${decimal_places}) as debit_amount,
          ROUND( coalesce(sum(credit_amount) ,0.0000),${decimal_places})  as credit_amount          from finance_account_head H              
          left join finance_voucher_details VD on  VD.head_id=H.finance_account_head_id  and VD.auth_status='A'   ${qryStr}
          and date(VD.payment_date) < date(?)   where H.root_id=?  group by H.finance_account_head_id   ;

          select max(account_level) as account_level from finance_account_head where root_id=?;  
          
          
          `,
          // SELECT child_id,head_id, (sum(debit_amount) - sum(credit_amount)) as d_c_opening_balance
          // FROM finance_voucher_details where
          // auth_status='A'  and date(payment_date) <=  date(?)
          // group by  child_id,head_id;

          values: [
            finance_account_head_id,
            options.from_date,
            // options.to_date,
            finance_account_head_id,
            options.from_date,
            // options.to_date,
            finance_account_head_id,
            options.from_date,
            options.to_date,
            finance_account_head_id,
            options.from_date,
            options.to_date,
            finance_account_head_id,
            options.from_date,
            // options.to_date,
            finance_account_head_id,
            options.from_date,
            // options.to_date,
            finance_account_head_id,
            finance_account_head_id,
            // options.from_date,
          ],
          printQuery: true,
        })
        .then((result) => {
          const ledger_names = result[0];

          const op_child_data = result[1];
          const ob_heads = result[2];
          // console.log("<<<<<<ob_heads>>>>>>", ob_heads);
          const transaction_child_data = result[3];
          const transaction_heads = result[4];

          const cb_child_data = result[5];
          const cb_heads = result[6];
          const levels = result[7];
          // const openingBalanceList = result[8];
          calcAmount(ob_heads, levels, decimal_places)
            .then((op_head_data) => {
              calcAmount(transaction_heads, levels, decimal_places)
                .then((transaction_head_data) => {
                  calcAmount(cb_heads, levels, decimal_places)
                    .then((cb_head_data) => {
                      const outputArray = createHierarchyTransactionTB(
                        ledger_names,
                        op_head_data,
                        op_child_data,
                        transaction_head_data,
                        transaction_child_data,
                        cb_head_data,
                        cb_child_data,
                        trans_symbol,
                        default_total,
                        decimal_places,
                        options.drillDownLevel,
                        non_zero
                        // openingBalanceList
                      );
                      resolve(outputArray[0]);
                    })
                    .catch((e) => {
                      console.log("m2:", e);
                      next(e);
                    });
                })
                .catch((e) => {
                  console.log("m3:", e);
                  next(e);
                });
            })
            .catch((e) => {
              console.log("m4:", e);
              next(e);
            });
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please provide Valid Input",
      });
    }
  });
}

//created by :IRFAN to build tree hierarchy
function createHierarchyTransactionTB(
  arry,
  op_head_data,
  op_child_data,
  transaction_head_data,
  transaction_child_data,
  cb_head_data,
  cb_child_data,
  trans_symbol,
  default_total,
  decimal_places,
  drillDownLevel,
  nonZeroQuery
) {
  try {
    // const onlyChilds = [];
    //const utilities = new algaehUtilities();

    let roots = [],
      children = {};
    const _drillDownLevel =
      typeof drillDownLevel === "string" && drillDownLevel !== undefined
        ? parseInt(drillDownLevel, 10)
        : typeof drillDownLevel === "number"
        ? drillDownLevel
        : 999;
    // find the top level nodes and hash the children based on parent_acc_id
    for (let i = 0, len = arry.length; i < len; ++i) {
      if (_drillDownLevel !== 999) {
        if (arry[i]["account_level"] > _drillDownLevel) {
          break;
        }
      }
      let item = arry[i],
        p = item.parent_acc_id,
        //if it has no parent_acc_id
        //seprating roots to roots array childerens to childeren array
        target = !p ? roots : children[p] || (children[p] = []);

      if (
        item.finance_account_child_id > 0 &&
        item.finance_account_head_id == item.head_id
      ) {
        let child =
          children[item.finance_account_head_id] ||
          (children[item.finance_account_head_id] = []);

        //ST---calulating Amount

        //ST calculating opening balance of from date-----

        const OP_BALANCE = op_child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });

        let op_amount = default_total;
        if (OP_BALANCE != undefined) {
          if (trans_symbol == "Dr") {
            if (
              parseFloat(OP_BALANCE.deb_minus_cred) >
              parseFloat(OP_BALANCE.cred_minus_deb)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.deb_minus_cred).toFixed(decimal_places) +
                " Dr";
            } else if (
              parseFloat(OP_BALANCE.deb_minus_cred) <
              parseFloat(OP_BALANCE.cred_minus_deb)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.cred_minus_deb).toFixed(decimal_places) +
                " Cr";
            } else {
              op_amount = parseFloat(OP_BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            }
          } else {
            if (
              parseFloat(OP_BALANCE.cred_minus_deb) >
              parseFloat(OP_BALANCE.deb_minus_cred)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.cred_minus_deb).toFixed(decimal_places) +
                " Cr";
            } else if (
              parseFloat(OP_BALANCE.cred_minus_deb) <
              parseFloat(OP_BALANCE.deb_minus_cred)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.deb_minus_cred).toFixed(decimal_places) +
                " Dr";
            } else {
              op_amount = parseFloat(OP_BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            }
          }
        }
        ///END calculating opening balance of from date-----
        //ST calculating transaction amount between  from_date  and to_date-----
        const TR_BALANCE = transaction_child_data.find((f) => {
          return (
            item.finance_account_head_id == f.head_id &&
            item.finance_account_child_id == f.child_id
          );
        });
        let tr_debit_amount = default_total;
        let tr_credit_amount = default_total;
        if (TR_BALANCE != undefined) {
          tr_debit_amount = TR_BALANCE.debit_amount;
          tr_credit_amount = TR_BALANCE.credit_amount;
        }
        ///END calculating transaction amount between  from_date  and to_date-----
        //ST calculating closing balance on  to date-----
        let cb_amount =
          trans_symbol === "Dr"
            ? parseFloat(
                parseFloat(op_amount) +
                  (parseFloat(tr_debit_amount) - parseFloat(tr_credit_amount))
              ).toFixed(decimal_places)
            : parseFloat(
                parseFloat(op_amount) +
                  (parseFloat(tr_credit_amount) - parseFloat(tr_debit_amount))
              ).toFixed(decimal_places);
        // const CB_BALANCE = cb_child_data.find((f) => {
        //   return (
        //     item.finance_account_head_id == f.head_id &&
        //     item.finance_account_child_id == f.child_id
        //   );
        // });
        // let cb_amount = default_total;
        // if (CB_BALANCE) {
        //   if (trans_symbol == "Dr") {
        //     if (
        //       parseFloat(CB_BALANCE.deb_minus_cred) >
        //       parseFloat(CB_BALANCE.cred_minus_deb)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(decimal_places) +
        //         " Dr";
        //     } else if (
        //       parseFloat(CB_BALANCE.deb_minus_cred) <
        //       parseFloat(CB_BALANCE.cred_minus_deb)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(decimal_places) +
        //         " Cr";
        //     } else {
        //       cb_amount = parseFloat(CB_BALANCE.deb_minus_cred).toFixed(
        //         decimal_places
        //       );
        //     }
        //   } else {
        //     if (
        //       parseFloat(CB_BALANCE.cred_minus_deb) >
        //       parseFloat(CB_BALANCE.deb_minus_cred)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(decimal_places) +
        //         " Cr";
        //     } else if (
        //       parseFloat(CB_BALANCE.cred_minus_deb) <
        //       parseFloat(CB_BALANCE.deb_minus_cred)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(decimal_places) +
        //         " Dr";
        //     } else {
        //       cb_amount = parseFloat(CB_BALANCE.cred_minus_deb).toFixed(
        //         decimal_places
        //       );
        //     }
        //   }
        // }
        //END calculating closing balance on  to date-----

        //END---calulating Amount

        if (nonZeroQuery === "Y") {
          if (
            parseFloat(cb_amount) !== 0 ||
            parseFloat(op_amount) !== 0 ||
            parseFloat(tr_credit_amount) !== 0 ||
            parseFloat(tr_debit_amount)
          ) {
            child.push({
              finance_account_child_id: item["finance_account_child_id"],
              tr_debit_amount: tr_debit_amount,
              tr_credit_amount: tr_credit_amount,
              cb_amount: `${cb_amount} ${trans_symbol}`,
              op_amount: op_amount,
              title: item.child_name,
              label: item.child_name,
              ledger_code: item.child_ledger_code,
              head_id: item["head_id"],
              arabic_name: item.arabic_child_name,
              leafnode: "Y",
            });
          }
        } else {
          child.push({
            finance_account_child_id: item["finance_account_child_id"],
            ledger_code: item.child_ledger_code,
            tr_debit_amount: tr_debit_amount,
            tr_credit_amount: tr_credit_amount,
            cb_amount: `${cb_amount} ${trans_symbol}`,
            op_amount: op_amount,
            title: item.child_name,
            label: item.child_name,
            head_id: item["head_id"],
            arabic_name: item.arabic_child_name,
            leafnode: "Y",
          });
        }

        //if children array doesnt contain this non-leaf node then push
        const data = target.find((val) => {
          return val.finance_account_head_id == item.finance_account_head_id;
        });
        if (!data) {
          //ST calculating opening balance of from date-----

          const OP_BALANCE = op_head_data.find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });

          let op_amount = default_total;
          if (OP_BALANCE != undefined) {
            if (trans_symbol == "Dr") {
              if (
                parseFloat(OP_BALANCE.deb_minus_cred) >
                parseFloat(OP_BALANCE.cred_minus_deb)
              ) {
                op_amount =
                  parseFloat(OP_BALANCE.deb_minus_cred).toFixed(
                    decimal_places
                  ) + " Dr";
              } else if (
                parseFloat(OP_BALANCE.deb_minus_cred) <
                parseFloat(OP_BALANCE.cred_minus_deb)
              ) {
                op_amount =
                  parseFloat(OP_BALANCE.cred_minus_deb).toFixed(
                    decimal_places
                  ) + " Cr";
              } else {
                op_amount = parseFloat(OP_BALANCE.deb_minus_cred).toFixed(
                  decimal_places
                );
              }
            } else {
              if (
                parseFloat(OP_BALANCE.cred_minus_deb) >
                parseFloat(OP_BALANCE.deb_minus_cred)
              ) {
                op_amount =
                  parseFloat(OP_BALANCE.cred_minus_deb).toFixed(
                    decimal_places
                  ) + " Cr";
              } else if (
                parseFloat(OP_BALANCE.cred_minus_deb) <
                parseFloat(OP_BALANCE.deb_minus_cred)
              ) {
                op_amount =
                  parseFloat(OP_BALANCE.deb_minus_cred).toFixed(
                    decimal_places
                  ) + " Dr";
              } else {
                op_amount = parseFloat(OP_BALANCE.cred_minus_deb).toFixed(
                  decimal_places
                );
              }
            }
          }
          ///END calculating opening balance of from date-----
          //ST calculating transaction amount between  from_date  and to_date-----
          const TR_BALANCE = transaction_head_data.find((f) => {
            return item.finance_account_head_id == f.finance_account_head_id;
          });
          let tr_debit_amount = default_total;
          let tr_credit_amount = default_total;
          if (TR_BALANCE != undefined) {
            tr_debit_amount = TR_BALANCE.total_debit_amount;
            tr_credit_amount = TR_BALANCE.total_credit_amount;
          }
          ///END calculating transaction amount between  from_date  and to_date-----
          //ST calculating closing balance on  to date-----
          let cb_amount =
            trans_symbol === "Dr"
              ? parseFloat(
                  parseFloat(op_amount) +
                    (parseFloat(tr_debit_amount) - parseFloat(tr_credit_amount))
                ).toFixed(decimal_places)
              : parseFloat(
                  parseFloat(op_amount) +
                    (parseFloat(tr_credit_amount) - parseFloat(tr_debit_amount))
                ).toFixed(decimal_places);
          // const CB_BALANCE = cb_head_data.find((f) => {
          //   return item.finance_account_head_id == f.finance_account_head_id;
          // });
          // let cb_amount = default_total;
          // if (CB_BALANCE != undefined) {
          //   if (trans_symbol == "Dr") {
          //     if (
          //       parseFloat(CB_BALANCE.deb_minus_cred) >
          //       parseFloat(CB_BALANCE.cred_minus_deb)
          //     ) {
          //       cb_amount =
          //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(
          //           decimal_places
          //         ) + " Dr";
          //     } else if (
          //       parseFloat(CB_BALANCE.deb_minus_cred) <
          //       parseFloat(CB_BALANCE.cred_minus_deb)
          //     ) {
          //       cb_amount =
          //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(
          //           decimal_places
          //         ) + " Cr";
          //     } else {
          //       cb_amount = parseFloat(CB_BALANCE.deb_minus_cred).toFixed(
          //         decimal_places
          //       );
          //     }
          //   } else {
          //     if (
          //       parseFloat(CB_BALANCE.cred_minus_deb) >
          //       parseFloat(CB_BALANCE.deb_minus_cred)
          //     ) {
          //       cb_amount =
          //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(
          //           decimal_places
          //         ) + " Cr";
          //     } else if (
          //       parseFloat(CB_BALANCE.cred_minus_deb) <
          //       parseFloat(CB_BALANCE.deb_minus_cred)
          //     ) {
          //       cb_amount =
          //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(
          //           decimal_places
          //         ) + " Dr";
          //     } else {
          //       cb_amount = parseFloat(CB_BALANCE.cred_minus_deb).toFixed(
          //         decimal_places
          //       );
          //     }
          //   }
          // }
          //END calculating closing balance on  to date-----

          if (nonZeroQuery === "Y") {
            if (
              parseFloat(cb_amount) !== 0 ||
              parseFloat(op_amount) !== 0 ||
              parseFloat(tr_credit_amount) !== 0 ||
              parseFloat(tr_debit_amount)
            ) {
              target.push({
                ...item,

                tr_debit_amount: tr_debit_amount,
                tr_credit_amount: tr_credit_amount,
                cb_amount: `${cb_amount} ${trans_symbol}`,
                op_amount: op_amount,
                title: item.account_name,
                label: item.account_name,
                arabic_name: item.arabic_account_name,
                // ledger_code: item.header_ledger_code,
                ledger_code: item.account_code,
                leafnode: "N",
              });
            }
          } else {
            target.push({
              ...item,
              ledger_code: item.account_code,
              // ledger_code: item.header_ledger_code,
              tr_debit_amount: tr_debit_amount,
              tr_credit_amount: tr_credit_amount,
              cb_amount: `${cb_amount} ${trans_symbol}`,
              op_amount: op_amount,
              title: item.account_name,
              label: item.account_name,
              arabic_name: item.arabic_account_name,

              leafnode: "N",
            });
          }
        }
      } else {
        //ST calculating opening balance of from date-----

        const OP_BALANCE = op_head_data.find((f) => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });

        let op_amount = default_total;
        if (OP_BALANCE) {
          if (trans_symbol == "Dr") {
            if (
              parseFloat(OP_BALANCE.deb_minus_cred) >
              parseFloat(OP_BALANCE.cred_minus_deb)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.deb_minus_cred).toFixed(decimal_places) +
                " Dr";
            } else if (
              parseFloat(OP_BALANCE.deb_minus_cred) <
              parseFloat(OP_BALANCE.cred_minus_deb)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.cred_minus_deb).toFixed(decimal_places) +
                " Cr";
            } else {
              op_amount = parseFloat(OP_BALANCE.deb_minus_cred).toFixed(
                decimal_places
              );
            }
          } else {
            if (
              parseFloat(OP_BALANCE.cred_minus_deb) >
              parseFloat(OP_BALANCE.deb_minus_cred)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.cred_minus_deb).toFixed(decimal_places) +
                " Cr";
            } else if (
              parseFloat(OP_BALANCE.cred_minus_deb) <
              parseFloat(OP_BALANCE.deb_minus_cred)
            ) {
              op_amount =
                parseFloat(OP_BALANCE.deb_minus_cred).toFixed(decimal_places) +
                " Dr";
            } else {
              op_amount = parseFloat(OP_BALANCE.cred_minus_deb).toFixed(
                decimal_places
              );
            }
          }
        }

        ///END calculating opening balance of from date-----
        //ST calculating transaction amount between  from_date  and to_date-----
        const TR_BALANCE = transaction_head_data.find((f) => {
          return item.finance_account_head_id == f.finance_account_head_id;
        });
        let tr_debit_amount = default_total;
        let tr_credit_amount = default_total;
        if (TR_BALANCE != undefined) {
          tr_debit_amount = TR_BALANCE.total_debit_amount;
          tr_credit_amount = TR_BALANCE.total_credit_amount;
        }

        ///END calculating transaction amount between  from_date  and to_date-----
        //ST calculating closing balance on  to date-----
        let cb_amount =
          trans_symbol === "Dr"
            ? parseFloat(
                parseFloat(op_amount) +
                  (parseFloat(tr_debit_amount) - parseFloat(tr_credit_amount))
              ).toFixed(decimal_places)
            : parseFloat(
                parseFloat(op_amount) +
                  (parseFloat(tr_credit_amount) - parseFloat(tr_debit_amount))
              ).toFixed(decimal_places);
        // const CB_BALANCE = cb_head_data.find((f) => {
        //   return item.finance_account_head_id == f.finance_account_head_id;
        // });
        // let cb_amount = default_total;
        // if (CB_BALANCE != undefined) {
        //   if (trans_symbol == "Dr") {
        //     if (
        //       parseFloat(CB_BALANCE.deb_minus_cred) >
        //       parseFloat(CB_BALANCE.cred_minus_deb)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(decimal_places) +
        //         " Dr";
        //     } else if (
        //       parseFloat(CB_BALANCE.deb_minus_cred) <
        //       parseFloat(CB_BALANCE.cred_minus_deb)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(decimal_places) +
        //         " Cr";
        //     } else {
        //       cb_amount = parseFloat(CB_BALANCE.deb_minus_cred).toFixed(
        //         decimal_places
        //       );
        //     }
        //   } else {
        //     if (
        //       parseFloat(CB_BALANCE.cred_minus_deb) >
        //       parseFloat(CB_BALANCE.deb_minus_cred)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.cred_minus_deb).toFixed(decimal_places) +
        //         " Cr";
        //     } else if (
        //       parseFloat(CB_BALANCE.cred_minus_deb) <
        //       parseFloat(CB_BALANCE.deb_minus_cred)
        //     ) {
        //       cb_amount =
        //         parseFloat(CB_BALANCE.deb_minus_cred).toFixed(decimal_places) +
        //         " Dr";
        //     } else {
        //       cb_amount = parseFloat(CB_BALANCE.cred_minus_deb).toFixed(
        //         decimal_places
        //       );
        //     }
        //   }
        // }
        //END calculating closing balance on  to date-----

        if (nonZeroQuery === "Y") {
          if (
            parseFloat(cb_amount) !== 0 ||
            parseFloat(op_amount) !== 0 ||
            parseFloat(tr_credit_amount) !== 0 ||
            parseFloat(tr_debit_amount)
          ) {
            target.push({
              ...item,
              //  ledger_code: item.header_ledger_code,
              ledger_code: item.account_code,
              tr_debit_amount: tr_debit_amount,
              tr_credit_amount: tr_credit_amount,
              cb_amount: `${cb_amount} ${trans_symbol}`,
              op_amount: op_amount,
              title: item.account_name,
              label: item.account_name,
              arabic_name: item.arabic_account_name,

              leafnode: "N",
            });
          }
        } else {
          target.push({
            ...item,
            // ledger_code: item.header_ledger_code,
            ledger_code: item.account_code,
            tr_debit_amount: tr_debit_amount,
            tr_credit_amount: tr_credit_amount,
            cb_amount: `${cb_amount} ${trans_symbol}`,
            op_amount: op_amount,
            title: item.account_name,
            label: item.account_name,
            arabic_name: item.arabic_account_name,

            leafnode: "N",
          });
        }
      }
    }

    // utilities.logger().log("roots:", roots);
    // utilities.logger().log("children:", children);

    // function to recursively build the tree
    let findChildren = function (parent) {
      if (children[parent.finance_account_head_id]) {
        let tempchilds = children[parent.finance_account_head_id];
        if (tempchilds.length > 0) {
          parent.children = tempchilds;

          for (let i = 0, len = parent.children.length; i < len; ++i) {
            findChildren(parent.children[i]);
          }
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (let i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    return roots;
  } catch (e) {
    console.log("MY-ERORR:", e);
  }
}
