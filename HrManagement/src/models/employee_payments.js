import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";

module.exports = {
  getLoanTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _loanDetails = req.query;

    let _stringData =
      _loanDetails.employee_id != null ? " and loan.employee_id=? " : "";

    _stringData +=
      _loanDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _loanDetails.loan_application_number != null
        ? " and loan.loan_application_number=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select loan.hims_f_loan_application_id, loan.loan_application_number as request_number, loan.employee_id, loan.approved_amount as payment_amount,\
          emp.employee_code,emp.full_name from hims_f_loan_application loan, hims_d_employee emp where loan.loan_authorized = 'APR' and \
          loan.employee_id = emp.hims_d_employee_id " +
          _stringData,
        values: _.valuesIn(_loanDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "LN"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getAdvanceTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _advDetails = req.query;

    let _stringData =
      _advDetails.employee_id != null ? " and adv.employee_id=? " : "";

    _stringData +=
      _advDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _advDetails.advance_number != null ? " and adv.advance_number=? " : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select adv.hims_f_employee_advance_id, adv.advance_number as request_number, adv.employee_id, adv.advance_amount as payment_amount,\
          adv.deducting_month,adv.deducting_year,emp.employee_code, emp.full_name from hims_f_employee_advance adv, \
          hims_d_employee emp where adv.advance_status = 'APR' and adv.employee_id = emp.hims_d_employee_id " +
          _stringData,
        values: _.valuesIn(_advDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "AD"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getEncashLeavesTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _encashLeaveDetails = req.query;

    let _stringData =
      _encashLeaveDetails.employee_id != null
        ? " and encash.employee_id=? "
        : "";

    _stringData +=
      _encashLeaveDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _encashLeaveDetails.encashment_number != null
        ? " and loan.encashment_number=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select encash.hims_f_leave_encash_header_id, encash.encashment_number as request_number, encash.employee_id, \
          encash.total_amount as payment_amount, emp.employee_code,emp.full_name from hims_f_leave_encash_header encash, \
          hims_d_employee emp where encash.authorized = 'APR' and encash.employee_id = emp.hims_d_employee_id" +
          _stringData,
        values: _.valuesIn(_encashLeaveDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "EN"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getGratuityTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _FSDetails = req.query;

    let _stringData =
      _FSDetails.employee_id != null ? " and GR.employee_id=? " : "";

    _stringData +=
      _FSDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _FSDetails.end_of_service_number != null
        ? " and GR.end_of_service_number=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select GR.hims_f_end_of_service_id, GR.end_of_service_number as request_number, GR.employee_id, \
          GR.payable_amount as payment_amount, emp.employee_code,emp.full_name from hims_f_end_of_service GR, \
          hims_d_employee emp where GR.settled = 'N' and GR.employee_id = emp.hims_d_employee_id" +
          _stringData,
        values: _.valuesIn(_FSDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "GR"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getFinalSettleTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _FSDetails = req.query;

    let _stringData =
      _FSDetails.employee_id != null ? " and FS.employee_id=? " : "";

    _stringData +=
      _FSDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _FSDetails.final_settlement_number != null
        ? " and FS.final_settlement_number=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select FS.hims_f_final_settlement_header_id, FS.final_settlement_number as request_number, FS.employee_id, \
          FS.total_amount as payment_amount, emp.employee_code,emp.full_name from hims_f_final_settlement_header FS, \
          hims_d_employee emp where FS.final_settlement_status = 'AUT' and FS.employee_id = emp.hims_d_employee_id" +
          _stringData,
        values: _.valuesIn(_FSDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "FS"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  getLeaveSettleTopayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _FSDetails = req.query;

    let _stringData =
      _FSDetails.employee_id != null ? " and LS.employee_id=? " : "";

    _stringData +=
      _FSDetails.hospital_id != null ? " and emp.hospital_id=? " : "";
    _stringData +=
      _FSDetails.leave_salary_number != null
        ? " and LS.leave_salary_number=? "
        : "";

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select LS.hims_f_leave_salary_header_id, LS.leave_salary_number as request_number, LS.employee_id, \
          LS.total_amount as payment_amount, emp.employee_code, emp.full_name from hims_f_leave_salary_header LS, \
          hims_d_employee emp where LS.status = 'PEN' and LS.employee_id = emp.hims_d_employee_id" +
          _stringData,
        values: _.valuesIn(_FSDetails),
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();

        req.records = result.map(data => {
          return {
            ...data,
            payment_type: "LS"
          };
        });
        next();
      })
      .catch(e => {
        next(e);
      });
  },

  InsertEmployeePayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };
    let payment_application_code = "";

    _mysql
      .generateRunningNumber({
        modules: ["EMPLOYEE_PAYMENT"]
      })
      .then(generatedNumbers => {
        payment_application_code = generatedNumbers[0];
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_employee_payments` (payment_application_code,employee_id,employee_advance_id,\
            employee_loan_id,employee_leave_encash_id,employee_end_of_service_id,employee_final_settlement_id,\
            employee_leave_settlement_id,payment_type,payment_date,remarks,earnings_id,deduction_month,year,payment_amount,\
            payment_mode,cheque_number,bank_id,created_date,created_by,updated_date,updated_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers[0],
              inputParam.employee_id,
              inputParam.employee_advance_id,
              inputParam.employee_loan_id,
              inputParam.employee_leave_encash_id,
              inputParam.employee_end_of_service_id,
              inputParam.employee_final_settlement_id,
              inputParam.employee_leave_settlement_id,
              inputParam.payment_type,
              inputParam.payment_date,
              inputParam.remarks,
              inputParam.earnings_id,
              inputParam.deduction_month,
              inputParam.year,
              inputParam.payment_amount,
              inputParam.payment_mode,
              inputParam.cheque_number,
              inputParam.bank_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ]
          })
          .then(result => {
            utilities
              .AlgaehUtilities()
              .logger()
              .log("payment_type: ", inputParam.payment_type);
            if (inputParam.payment_type == "AD") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_employee_advance` SET `advance_status`='PAI', `updated_date`=?, `updated_by`=? \
              where hims_f_employee_advance_id=?",
                  values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.employee_advance_id
                  ]
                })
                .then(AdvanceResult => {
                  let result = {
                    payment_application_code: payment_application_code
                  };
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(error => {
                  next(error);
                });
            } else if (inputParam.payment_type == "LN") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_loan_application` SET `loan_authorized`='IS', `updated_date`=?, `updated_by`=? \
              where hims_f_loan_application_id=?",
                  values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.employee_loan_id
                  ]
                })
                .then(LoanResult => {
                  let result = {
                    payment_application_code: payment_application_code
                  };
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(error => {
                  next(error);
                });
            } else if (inputParam.payment_type == "EN") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_leave_encash_header` SET `authorized`='PRO'\
                          where hims_f_leave_encash_header_id=?",
                  values: [inputParam.employee_leave_encash_id]
                })
                .then(EncashResult => {
                  _mysql
                    .executeQuery({
                      query:
                        "select H.employee_id, H.`year`, D.leave_id,D.leave_days,(M.close_balance-D.leave_days) as close_balance \
                    from hims_f_leave_encash_header H,hims_f_leave_encash_detail D,hims_f_employee_monthly_leave M\
                    where H.hims_f_leave_encash_header_id =D.leave_encash_header_id and M.employee_id=H.employee_id and M.`year`=H.`year`and \
                    M.leave_id = D.leave_id and H.hims_f_leave_encash_header_id=?;",
                      values: [inputParam.employee_leave_encash_id],
                      printQuery: true
                    })
                    .then(leave_encash_header => {
                      for (let i = 0; i < leave_encash_header.length; i++) {
                        _mysql
                          .executeQuery({
                            query:
                              "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                          where employee_id=? and `year`=? and leave_id=?;",
                            values: [
                              leave_encash_header[i].close_balance,
                              leave_encash_header[i].employee_id,
                              leave_encash_header[i].year,
                              leave_encash_header[i].leave_id
                            ],
                            printQuery: true
                          })
                          .then(monthly_leave => {
                            let result = {
                              payment_application_code: payment_application_code
                            };
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = result;
                              next();
                            });
                          })
                          .catch(error => {
                            next(error);
                          });
                      }
                    })
                    .catch(error => {
                      next(error);
                    });
                })
                .catch(error => {
                  next(error);
                });
            } else if (inputParam.payment_type == "GR") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_end_of_service` SET `settled`='Y', `updated_date`=?, `updated_by`=? \
                    where hims_f_end_of_service_id=?",
                  values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.employee_end_of_service_id
                  ]
                })
                .then(GratuityResult => {
                  let result = {
                    payment_application_code: payment_application_code
                  };
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(error => {
                  next(error);
                });
            } else if (inputParam.payment_type == "FS") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_final_settlement_header` SET `final_settlement_status`='SET', `updated_date`=?, `updated_by`=? \
                    where hims_f_final_settlement_header_id=?",
                  values: [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    inputParam.employee_final_settlement_id
                  ]
                })
                .then(FinalSettleResult => {
                  let result = {
                    payment_application_code: payment_application_code
                  };
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  });
                })
                .catch(error => {
                  next(error);
                });
            } else if (inputParam.payment_type == "LS") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_leave_salary_header` SET `status`='PRO' \
                    where hims_f_leave_salary_header_id=?; select * from `hims_f_leave_salary_header` where \
                    hims_f_leave_salary_header_id=?; select * from `hims_f_employee_leave_salary_header` where \
                    employee_id=?;",
                  values: [
                    inputParam.employee_leave_settlement_id,
                    inputParam.employee_leave_settlement_id,
                    inputParam.employee_id
                  ]
                })
                .then(LeaveSettleResult => {
                  // LeaveSettleResult
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("LeaveSettleResult:", LeaveSettleResult[1][0]);

                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("LeaveSettleResult2:", LeaveSettleResult[2][0]);

                  let leave_salary = LeaveSettleResult[1][0];
                  let leave_salary_header = LeaveSettleResult[2][0];

                  let start_year = moment(leave_salary.leave_start_date).format(
                    "YYYY"
                  );
                  let end_year = moment(leave_salary.leave_end_date).format(
                    "YYYY"
                  );
                  let balance_leave_days = 0;
                  let balance_leave_salary_amount = 0;
                  let balance_airticket_amount = 0;

                  if (start_year == end_year) {
                    balance_leave_days =
                      parseFloat(leave_salary_header.balance_leave_days) -
                      parseFloat(leave_salary.leave_period);

                    balance_leave_salary_amount =
                      parseFloat(
                        leave_salary_header.balance_leave_salary_amount
                      ) - parseFloat(leave_salary.leave_amount);

                    balance_airticket_amount =
                      parseFloat(leave_salary_header.balance_airticket_amount) -
                      parseFloat(leave_salary.airfare_amount);

                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                        `balance_airticket_amount` = ? where employee_id=? and `year`=?;\
                        UPDATE `hims_d_employee` SET \
                        `suspend_salary`='Y', `last_salary_process_date`=? where hims_d_employee_id=?;",
                        values: [
                          balance_leave_days,
                          balance_leave_salary_amount,
                          balance_airticket_amount,
                          inputParam.employee_id,
                          start_year,
                          moment(leave_salary.leave_end_date).format(
                            "YYYY-MM-DD"
                          ),
                          inputParam.employee_id
                        ]
                      })
                      .then(LeaveSettleResult => {
                        let result = {
                          payment_application_code: payment_application_code
                        };
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = result;
                          next();
                        });
                      })
                      .catch(error => {
                        next(error);
                      });
                  } else if (start_year != end_year) {
                    let Start_Date = moment(start_year)
                      .startOf("month")
                      .format("YYYY-MM-DD");

                    let values = [];

                    Start_Date = moment(Start_Date).add(-1, "days");

                    let End_date = moment(start_year)
                      .endOf("month")
                      .format("YYYY-MM-DD");

                    let total_days = moment(End_date).diff(
                      moment(Start_Date),
                      "days"
                    );
                    let no_of_days = moment(End_date).diff(
                      moment(leave_salary.leave_start_date),
                      "days"
                    );
                    balance_leave_days =
                      parseFloat(leave_salary_header.balance_leave_days) -
                      parseFloat(no_of_days);

                    balance_leave_salary_amount =
                      parseFloat(
                        leave_salary_header.balance_leave_salary_amount
                      ) - parseFloat(leave_salary.leave_amount);

                    balance_leave_salary_amount =
                      parseFloat(leave_salary_header.balance_airticket_amount) -
                      parseFloat(leave_salary.airfare_amount);

                    let strQuery =
                      "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ? where employee_id=? and `year`=?;";

                    values.push(
                      balance_leave_days,
                      balance_leave_salary_amount,
                      balance_airticket_amount,
                      inputParam.employee_id,
                      start_year
                    );

                    no_of_days =
                      parseFloat(leave_salary_header.balance_leave_days) -
                      parseFloat(no_of_days);

                    balance_leave_days =
                      parseFloat(leave_salary_header.balance_leave_days) -
                      parseFloat(no_of_days);

                    balance_leave_salary_amount =
                      parseFloat(
                        leave_salary_header.balance_leave_salary_amount
                      ) - parseFloat(leave_salary.leave_amount);

                    balance_leave_salary_amount =
                      parseFloat(leave_salary_header.balance_airticket_amount) -
                      parseFloat(leave_salary.airfare_amount);

                    strQuery +=
                      "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ? where employee_id=? and `year`=?;";

                    values.push(
                      balance_leave_days,
                      balance_leave_salary_amount,
                      balance_airticket_amount,
                      inputParam.employee_id,
                      end_year
                    );

                    utilities
                      .AlgaehUtilities()
                      .logger()
                      .log("strQuery:", strQuery);

                    _mysql
                      .executeQuery({
                        query: strQuery,
                        values: values
                      })
                      .then(LeaveSettleResult => {
                        let result = {
                          payment_application_code: payment_application_code
                        };
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = result;
                          next();
                        });
                      })
                      .catch(error => {
                        next(error);
                      });
                  }

                  // let result = {
                  //   payment_application_code: payment_application_code
                  // };
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  //   req.records = result;
                  //   next();
                  // });
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
  },

  CancelEmployeePayment: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };

    _mysql
      .executeQuery({
        query:
          "UPDATE `hims_f_employee_payments` SET cancel='Y', cancel_by=?, cancel_date=? WHERE \
          hims_f_employee_payments_id=?",
        values: [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          inputParam.hims_f_employee_payments_id
        ],
        printQuery: true
      })
      .then(result => {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("payment_type: ", inputParam.payment_type);
        if (inputParam.payment_type == "AD") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_employee_advance` SET `advance_status`='APR', `updated_date`=?, `updated_by`=? \
              where hims_f_employee_advance_id=?",
              values: [
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.employee_advance_id
              ]
            })
            .then(AdvanceResult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = AdvanceResult;
                next();
              });
            });
        } else if (inputParam.payment_type == "LN") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_loan_application` SET `loan_authorized`='APR', `updated_date`=?, `updated_by`=? \
              where hims_f_loan_application_id=?",
              values: [
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.employee_loan_id
              ]
            })
            .then(LoanResult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = LoanResult;
                next();
              });
            });
        } else if (inputParam.payment_type == "EN") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_leave_encash_header` SET `authorized`='APR'\
                where hims_f_leave_encash_header_id=?",
              values: [inputParam.employee_leave_encash_id]
            })
            .then(EncashResult => {
              _mysql
                .executeQuery({
                  query:
                    "select H.employee_id, H.`year`, D.leave_id,D.leave_days,(M.close_balance + D.leave_days) as close_balance \
                from hims_f_leave_encash_header H,hims_f_leave_encash_detail D,hims_f_employee_monthly_leave M\
                where H.hims_f_leave_encash_header_id =D.leave_encash_header_id and M.employee_id=H.employee_id and M.`year`=H.`year`and \
                M.leave_id = D.leave_id and H.hims_f_leave_encash_header_id=?;",
                  values: [inputParam.employee_leave_encash_id]
                })
                .then(leave_encash_header => {
                  for (let i = 0; i < leave_encash_header.length; i++) {
                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                      where employee_id=? and `year`=? and leave_id=?;",
                        values: [
                          leave_encash_header[i].close_balance,
                          leave_encash_header[i].employee_id,
                          leave_encash_header[i].year,
                          leave_encash_header[i].leave_id
                        ]
                      })
                      .then(monthly_leave => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = monthly_leave;
                          next();
                        });
                      })
                      .catch(error => {
                        next(error);
                      });
                  }
                })
                .catch(error => {
                  next(error);
                });
            })
            .catch(error => {
              next(error);
            });
        } else if (inputParam.payment_type == "GR") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_end_of_service` SET `settled`='N', `updated_date`=?, `updated_by`=? \
                    where hims_f_end_of_service_id=?",
              values: [
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.employee_end_of_service_id
              ]
            })
            .then(GratuityResult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = GratuityResult;
                next();
              });
            })
            .catch(error => {
              next(error);
            });
        } else if (inputParam.payment_type == "FS") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_final_settlement_header` SET `final_settlement_status`='AUT', `updated_date`=?, `updated_by`=? \
                where hims_f_final_settlement_header_id=?",
              values: [
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                inputParam.employee_final_settlement_id
              ]
            })
            .then(FinalSettleResult => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = FinalSettleResult;
                next();
              });
            })
            .catch(error => {
              next(error);
            });
        } else if (inputParam.payment_type == "LS") {
          _mysql
            .executeQuery({
              query:
                "UPDATE `hims_f_leave_salary_header` SET `status`='PEN' \
                    where hims_f_leave_salary_header_id=?; select * from `hims_f_leave_salary_header` where \
                    hims_f_leave_salary_header_id=?; select * from `hims_f_employee_leave_salary_header` where \
                    employee_id=?;",
              values: [
                inputParam.employee_leave_settlement_id,
                inputParam.employee_leave_settlement_id,
                inputParam.employee_id
              ],
              printQuery: true
            })
            .then(LeaveSettleResult => {
              utilities
                .AlgaehUtilities()
                .logger()
                .log("LeaveSettleResult:", LeaveSettleResult[2][0]);

              let leave_salary = LeaveSettleResult[1][0];
              let leave_salary_header = LeaveSettleResult[2][0];

              let start_year = moment(leave_salary.leave_start_date).format(
                "YYYY"
              );
              let end_year = moment(leave_salary.leave_end_date).format("YYYY");
              let balance_leave_days = 0;
              let balance_leave_salary_amount = 0;
              let balance_airticket_amount = 0;

              if (start_year == end_year) {
                balance_leave_days =
                  parseFloat(leave_salary_header.balance_leave_days) +
                  parseFloat(leave_salary.leave_period);

                balance_leave_salary_amount =
                  parseFloat(leave_salary_header.balance_leave_salary_amount) +
                  parseFloat(leave_salary.leave_amount);

                balance_airticket_amount =
                  parseFloat(leave_salary_header.balance_airticket_amount) +
                  parseFloat(leave_salary.airfare_amount);

                _mysql
                  .executeQuery({
                    query:
                      "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                        `balance_airticket_amount` = ? where employee_id=? and `year`=?; UPDATE `hims_d_employee` SET \
                        `suspend_salary`='N', `last_salary_process_date`=null where hims_d_employee_id=?;",
                    values: [
                      balance_leave_days,
                      balance_leave_salary_amount,
                      balance_airticket_amount,
                      inputParam.employee_id,
                      start_year,
                      inputParam.employee_id
                    ],
                    printQuery: true
                  })
                  .then(LeaveSettleResult => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = LeaveSettleResult;
                      next();
                    });
                  })
                  .catch(error => {
                    next(error);
                  });
              } else if (start_year != end_year) {
                let Start_Date = moment(start_year)
                  .startOf("month")
                  .format("YYYY-MM-DD");

                let values = [];

                Start_Date = moment(Start_Date).add(-1, "days");

                let End_date = moment(start_year)
                  .endOf("month")
                  .format("YYYY-MM-DD");

                let total_days = moment(End_date).diff(
                  moment(Start_Date),
                  "days"
                );
                let no_of_days = moment(End_date).diff(
                  moment(leave_salary.leave_start_date),
                  "days"
                );
                balance_leave_days =
                  parseFloat(leave_salary_header.balance_leave_days) +
                  parseFloat(no_of_days);

                balance_leave_salary_amount =
                  parseFloat(leave_salary_header.balance_leave_salary_amount) +
                  parseFloat(leave_salary.leave_amount);

                balance_leave_salary_amount =
                  parseFloat(leave_salary_header.balance_airticket_amount) +
                  parseFloat(leave_salary.airfare_amount);

                let strQuery =
                  "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ? where employee_id=? and `year`=?;";

                values.push(
                  balance_leave_days,
                  balance_leave_salary_amount,
                  balance_airticket_amount,
                  inputParam.employee_id,
                  start_year
                );

                no_of_days =
                  parseFloat(leave_salary_header.balance_leave_days) -
                  parseFloat(no_of_days);

                balance_leave_days =
                  parseFloat(leave_salary_header.balance_leave_days) +
                  parseFloat(no_of_days);

                balance_leave_salary_amount =
                  parseFloat(leave_salary_header.balance_leave_salary_amount) +
                  parseFloat(leave_salary.leave_amount);

                balance_leave_salary_amount =
                  parseFloat(leave_salary_header.balance_airticket_amount) +
                  parseFloat(leave_salary.airfare_amount);

                strQuery +=
                  "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ? where employee_id=? and `year`=?;";

                values.push(
                  balance_leave_days,
                  balance_leave_salary_amount,
                  balance_airticket_amount,
                  inputParam.employee_id,
                  end_year
                );

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("strQuery:", strQuery);

                _mysql
                  .executeQuery({
                    query: strQuery,
                    values: values
                  })
                  .then(LeaveSettleResult => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = LeaveSettleResult;
                      next();
                    });
                  })
                  .catch(error => {
                    next(error);
                  });
              }
              // _mysql.commitTransaction(() => {
              //   _mysql.releaseConnection();
              //   req.records = LeaveSettleResult;
              //   next();
              // });
            })
            .catch(error => {
              next(error);
            });
        }
      })
      .catch(e => {
        next(e);
      });
  },

  getEmployeePayments: (req, res, next) => {
    const _mysql = new algaehMysql();

    /* Select statemwnt  */

    _mysql
      .executeQuery({
        query:
          "select hims_f_employee_payments_id,employee_id,employee_advance_id,employee_loan_id,employee_leave_encash_id,\
          employee_end_of_service_id,employee_final_settlement_id,employee_leave_settlement_id,payment_application_code, \
          payment_type, payment_amount, payment_date, payment_mode, cheque_number, deduction_month, cancel, bank_id,\
          emp.employee_code, emp.full_name from hims_f_employee_payments, hims_d_employee emp where \
        hims_f_employee_payments.employee_id = emp.hims_d_employee_id;",
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
  }
};
