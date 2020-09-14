import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";

export default {
  getLoanTopayment: (req, res, next) => {
    try {
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
            "select loan.hims_f_loan_application_id, loan.loan_application_number as request_number, \
            loan.employee_id, loan.approved_amount as payment_amount, emp.employee_code,emp.full_name \
            from hims_f_loan_application loan, hims_d_employee emp where loan.loan_authorized = 'APR' \
            and loan.loan_dispatch_from = 'EMP' and loan.employee_id = emp.hims_d_employee_id " +
            _stringData,
          values: _.valuesIn(_loanDetails),
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "LN",
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

  getAdvanceTopayment: (req, res, next) => {
    try {
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
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "AD",
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

  getEncashLeavesTopayment: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const _encashLeaveDetails = req.query;

      let _stringData =
        _encashLeaveDetails.employee_id != null
          ? " and encash.employee_id=? "
          : "";

      _stringData +=
        _encashLeaveDetails.hospital_id != null
          ? " and EMP.hospital_id=? "
          : "";
      _stringData +=
        _encashLeaveDetails.encashment_number != null
          ? " and loan.encashment_number=? "
          : "";

      /* Select statemwnt  */

      _mysql
        .executeQuery({
          query:
            "select EH.hims_f_leave_encash_header_id, EH.encashment_number as request_number, EH.employee_id, \
            EH.total_amount as payment_amount, EMP.employee_code,EMP.full_name, L.leave_category \
            from hims_f_leave_encash_header EH \
            inner join hims_d_employee EMP on EMP.hims_d_employee_id = EH.employee_id \
            inner join hims_d_leave L on L.hims_d_leave_id = EH.leave_id \
            where EH.authorized = 'APR' " +
            _stringData,
          values: _.valuesIn(_encashLeaveDetails),
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "EN",
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

  getGratuityTopayment: (req, res, next) => {
    try {
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
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "GR",
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

  getFinalSettleTopayment: (req, res, next) => {
    try {
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
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "FS",
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

  getLeaveSettleTopayment: (req, res, next) => {
    try {
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
          LS.total_amount as payment_amount, LS.salary_amount, LS.leave_amount, LS.airfare_amount, \
          emp.employee_code, emp.full_name from hims_f_leave_salary_header LS, \
          hims_d_employee emp where LS.status = 'PEN' and LS.employee_id = emp.hims_d_employee_id" +
            _stringData,
          values: _.valuesIn(_FSDetails),
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result.map((data) => {
            return {
              ...data,
              payment_type: "LS",
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

  InsertEmployeePayment: (req, res, next) => {
    try {
      const utilities = new algaehUtilities();
      const _mysql = new algaehMysql();
      let inputParam = { ...req.body };
      let payment_application_code = "";

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["EMPLOYEE_PAYMENT"],
          table_name: "hims_f_hrpayroll_numgen",
        })
        .then((generatedNumbers) => {
          payment_application_code = generatedNumbers.EMPLOYEE_PAYMENT;
          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_employee_payments` (payment_application_code,employee_id,employee_advance_id,\
            employee_loan_id,employee_leave_encash_id,employee_end_of_service_id,employee_final_settlement_id,\
            employee_leave_settlement_id,payment_type,payment_date,remarks,earnings_id,deduction_month,year,payment_amount,\
            payment_mode,cheque_number,bank_id,head_id, child_id, created_date,created_by,updated_date,updated_by,hospital_id)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                payment_application_code,
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
                inputParam.head_id,
                inputParam.child_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id,
              ],
            })
            .then((result) => {
              req.body.payment_application_code = payment_application_code;
              req.body.hims_f_employee_payments_id = result.insertId;
              req.connection = {
                connection: _mysql.connection,
                isTransactionConnection: _mysql.isTransactionConnection,
                pool: _mysql.pool,
              };
              // utilities.logger().log("payment_type: ", inputParam.payment_type);
              if (inputParam.payment_type == "AD") {
                _mysql
                  .executeQuery({
                    query:
                      "UPDATE `hims_f_employee_advance` SET `advance_status`='PAI', `updated_date`=?, `updated_by`=? \
                      where hims_f_employee_advance_id=? ; select head_id, child_id from hims_d_earning_deduction where hims_d_earning_deduction_id=?",
                    values: [
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      inputParam.employee_advance_id,
                      inputParam.earnings_id,
                    ],
                    printQuery: true,
                  })
                  .then((AdvanceResult) => {
                    req.body.advance_acc = AdvanceResult[1];
                    let result = {
                      payment_application_code: payment_application_code,
                    };
                    // _mysql.commitTransaction(() => {
                    //   _mysql.releaseConnection();
                    req.records = result;
                    next();
                    // });
                  })
                  .catch((error) => {
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
                      inputParam.employee_loan_id,
                    ],
                  })
                  .then((LoanResult) => {
                    let result = {
                      payment_application_code: payment_application_code,
                    };
                    // _mysql.commitTransaction(() => {
                    //   _mysql.releaseConnection();
                    req.records = result;
                    next();
                    // });
                  })
                  .catch((error) => {
                    next(error);
                  });
              } else if (inputParam.payment_type == "EN") {
                _mysql
                  .executeQuery({
                    query:
                      "UPDATE `hims_f_leave_encash_header` SET `authorized`='PRO',`payment_date`=?, `posted`='Y', posted_by=?, posted_date=? \
                          where hims_f_leave_encash_header_id=?",
                    values: [
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      inputParam.employee_leave_encash_id,
                    ],
                  })
                  .then((EncashResult) => {
                    let strAnual_Qry = "";
                    if (inputParam.leave_category === "A") {
                      strAnual_Qry += _mysql.mysqlQueryFormat(
                        "select H.employee_id, H.`year`, H.leave_id,H.leave_days,(M.close_balance-H.leave_days) as close_balance, \
                        (LH.balance_leave_days - H.leave_days) as balance_leave_days, (LH.balance_leave_salary_amount - H.leave_amount) as balance_leave_salary_amount, \
                        M.hims_f_employee_monthly_leave_id, LH.hims_f_employee_leave_salary_header_id from hims_f_leave_encash_header H \
                        inner join hims_f_employee_monthly_leave M on M.employee_id=H.employee_id \
                        and M.`year`=H.`year`and M.leave_id = H.leave_id\
                        inner join hims_f_employee_leave_salary_header LH on LH.employee_id=H.employee_id \
                        where H.hims_f_leave_encash_header_id=?;",
                        [inputParam.employee_leave_encash_id]
                      );
                    } else {
                      strAnual_Qry += _mysql.mysqlQueryFormat(
                        "select H.employee_id, H.`year`, H.leave_id,H.leave_days,(M.close_balance-H.leave_days) as close_balance, \
                        M.hims_f_employee_monthly_leave_id from hims_f_leave_encash_header H,hims_f_employee_monthly_leave M\
                        where M.employee_id=H.employee_id and M.`year`=H.`year`and \
                        M.leave_id = H.leave_id and H.hims_f_leave_encash_header_id=?;",
                        [inputParam.employee_leave_encash_id]
                      );
                    }
                    _mysql
                      .executeQuery({
                        query: strAnual_Qry,
                        printQuery: true,
                      })
                      .then((leave_encash_header) => {
                        let strQuery = "";
                        if (leave_encash_header.length === 0) {
                          req.records = {
                            payment_application_code: payment_application_code,
                          };
                          next();
                        }
                        if (inputParam.leave_category === "A") {
                          strQuery += _mysql.mysqlQueryFormat(
                            "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                          where hims_f_employee_monthly_leave_id=?; \
                          UPDATE hims_f_employee_leave_salary_header SET balance_leave_days = ?, \
                          balance_leave_salary_amount = ? where hims_f_employee_leave_salary_header_id=?",
                            [
                              leave_encash_header[0].close_balance,
                              leave_encash_header[0]
                                .hims_f_employee_monthly_leave_id,
                              leave_encash_header[0].balance_leave_days,
                              parseFloat(
                                leave_encash_header[0]
                                  .balance_leave_salary_amount
                              ) > 0
                                ? leave_encash_header[0]
                                    .balance_leave_salary_amount
                                : 0,
                              leave_encash_header[0]
                                .hims_f_employee_leave_salary_header_id,
                            ]
                          );
                        } else {
                          strQuery += _mysql.mysqlQueryFormat(
                            "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                          where hims_f_employee_monthly_leave_id=?;",
                            [
                              leave_encash_header[0].close_balance,
                              leave_encash_header[0]
                                .hims_f_employee_monthly_leave_id,
                            ]
                          );
                        }
                        _mysql
                          .executeQuery({
                            query: strQuery,
                            printQuery: true,
                          })
                          .then((monthly_leave) => {
                            let result = {
                              payment_application_code: payment_application_code,
                            };
                            // _mysql.commitTransaction(() => {
                            //   _mysql.releaseConnection();
                            req.records = result;
                            next();
                            // });
                          })
                          .catch((error) => {
                            next(error);
                          });

                        // for (let i = 0; i < leave_encash_header.length; i++) {
                        //   strQuery += _mysql.mysqlQueryFormat(
                        //     "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                        //     where employee_id=? and `year`=? and leave_id=?;",
                        //     [
                        //       leave_encash_header[i].close_balance,
                        //       leave_encash_header[i].employee_id,
                        //       leave_encash_header[i].year,
                        //       leave_encash_header[i].leave_id,
                        //     ]
                        //   );
                        //   if (i === leave_encash_header.length - 1) {
                        //     _mysql
                        //       .executeQuery({
                        //         query: strQuery,
                        //         printQuery: true,
                        //       })
                        //       .then((monthly_leave) => {
                        //         let result = {
                        //           payment_application_code: payment_application_code,
                        //         };
                        //         // _mysql.commitTransaction(() => {
                        //         //   _mysql.releaseConnection();
                        //         req.records = result;
                        //         next();
                        //         // });
                        //       })
                        //       .catch((error) => {
                        //         next(error);
                        //       });
                        //   }
                        // }
                      })
                      .catch((error) => {
                        next(error);
                      });
                  })
                  .catch((error) => {
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
                      inputParam.employee_end_of_service_id,
                    ],
                  })
                  .then((GratuityResult) => {
                    let result = {
                      payment_application_code: payment_application_code,
                    };
                    // _mysql.commitTransaction(() => {
                    //   _mysql.releaseConnection();
                    req.records = result;
                    next();
                    // });
                  })
                  .catch((error) => {
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
                      inputParam.employee_final_settlement_id,
                    ],
                  })
                  .then((FinalSettleResult) => {
                    let result = {
                      payment_application_code: payment_application_code,
                    };
                    // _mysql.commitTransaction(() => {
                    //   _mysql.releaseConnection();
                    req.records = result;
                    next();
                    // });
                  })
                  .catch((error) => {
                    next(error);
                  });
              } else if (inputParam.payment_type == "LS") {
                _mysql
                  .executeQuery({
                    query:
                      "UPDATE `hims_f_leave_salary_header` SET `status`='PRO' \
                    where hims_f_leave_salary_header_id=?; select * from `hims_f_leave_salary_header` where \
                    hims_f_leave_salary_header_id=?; select * from `hims_f_employee_leave_salary_header` where \
                    employee_id=?; select * from `hims_f_leave_salary_detail` where \
                    leave_salary_header_id in (?);",
                    values: [
                      inputParam.employee_leave_settlement_id,
                      inputParam.employee_leave_settlement_id,
                      inputParam.employee_id,
                      inputParam.employee_leave_settlement_id,
                    ],
                  })
                  .then((LeaveSettleResult) => {
                    // LeaveSettleResult

                    let leave_salary = LeaveSettleResult[1][0];
                    let leave_salary_header = LeaveSettleResult[2][0];
                    let leave_salary_detail = LeaveSettleResult[3];

                    let salary_header_id = _.map(leave_salary_detail, (o) => {
                      return o.salary_header_id;
                    });

                    let start_year = moment(
                      leave_salary.leave_start_date
                    ).format("YYYY");
                    let end_year = moment(leave_salary.leave_end_date).format(
                      "YYYY"
                    );
                    let balance_leave_days = 0;
                    let balance_leave_salary_amount = 0;
                    let balance_airticket_amount = 0;

                    let utilized_leave_days = 0;
                    let utilized_leave_salary_amount = 0;
                    let utilized_airticket_amount = 0;
                    let airfare_months = 0;

                    // console.log("start_year", start_year)
                    // console.log("end_year", end_year)
                    if (parseInt(start_year) == parseInt(end_year)) {
                      balance_leave_days =
                        parseFloat(leave_salary_header.balance_leave_days) -
                        parseFloat(leave_salary.leave_period);

                      balance_leave_salary_amount =
                        parseFloat(
                          leave_salary_header.balance_leave_salary_amount
                        ) - parseFloat(leave_salary.leave_amount);

                      balance_airticket_amount =
                        parseFloat(
                          leave_salary_header.balance_airticket_amount
                        ) - parseFloat(leave_salary.airfare_amount);

                      airfare_months =
                        parseFloat(leave_salary_header.airfare_months) -
                        parseFloat(leave_salary.airfare_months);

                      utilized_leave_days =
                        parseFloat(leave_salary_header.utilized_leave_days) +
                        parseFloat(leave_salary.leave_period);

                      utilized_leave_salary_amount =
                        parseFloat(
                          leave_salary_header.utilized_leave_salary_amount
                        ) + parseFloat(leave_salary.leave_amount);

                      utilized_airticket_amount =
                        parseFloat(
                          leave_salary_header.utilized_airticket_amount
                        ) + parseFloat(leave_salary.airfare_amount);

                      // console.log("If cond")
                      _mysql
                        .executeQuery({
                          query:
                            "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
                        `balance_leave_salary_amount` = ?, `balance_airticket_amount` = ?, `utilized_leave_days`=?, \
                        `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ?, airfare_months=? \
                        where employee_id=?;\
                        UPDATE `hims_d_employee` SET \
                        `suspend_salary`='Y', `last_salary_process_date`=? where hims_d_employee_id=?; UPDATE `hims_f_salary` SET \
                        `salary_paid`='Y' where hims_f_salary_id in (?);",
                          values: [
                            balance_leave_days,
                            balance_leave_salary_amount,
                            balance_airticket_amount,
                            utilized_leave_days,
                            utilized_leave_salary_amount,
                            utilized_airticket_amount,
                            airfare_months,
                            inputParam.employee_id,
                            moment(leave_salary.leave_end_date).format(
                              "YYYY-MM-DD"
                            ),
                            inputParam.employee_id,
                            salary_header_id,
                          ],
                          printQuery: true,
                        })
                        .then((LeaveSettleResult) => {
                          let result = {
                            payment_application_code: payment_application_code,
                          };
                          // _mysql.commitTransaction(() => {
                          //   _mysql.releaseConnection();
                          req.records = result;
                          next();
                          // });
                        })
                        .catch((error) => {
                          next(error);
                        });
                    } else if (parseInt(start_year) != parseInt(end_year)) {
                      // console.log("else Con")
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

                      balance_airticket_amount =
                        parseFloat(
                          leave_salary_header.balance_airticket_amount
                        ) - parseFloat(leave_salary.airfare_amount);

                      airfare_months =
                        parseFloat(leave_salary_header.airfare_months) -
                        parseFloat(leave_salary.airfare_months);

                      utilized_leave_days =
                        parseFloat(leave_salary_header.utilized_leave_days) +
                        parseFloat(no_of_days);

                      utilized_leave_salary_amount =
                        parseFloat(
                          leave_salary_header.utilized_leave_salary_amount
                        ) + parseFloat(leave_salary.leave_amount);

                      utilized_airticket_amount =
                        parseFloat(
                          leave_salary_header.utilized_airticket_amount
                        ) + parseFloat(leave_salary.airfare_amount);

                      let strQuery =
                        "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
                        `balance_leave_salary_amount` = ?, `balance_airticket_amount` = ?, airfare_months=?, \
                        `utilized_leave_days`=?, `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ? \
                        where employee_id=?;";

                      values.push(
                        balance_leave_days,
                        balance_leave_salary_amount,
                        balance_airticket_amount,
                        airfare_months,
                        utilized_leave_days,
                        utilized_leave_salary_amount,
                        utilized_airticket_amount,
                        inputParam.employee_id
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

                      balance_airticket_amount =
                        parseFloat(
                          leave_salary_header.balance_airticket_amount
                        ) - parseFloat(leave_salary.airfare_amount);

                      airfare_months =
                        parseFloat(leave_salary_header.airfare_months) -
                        parseFloat(leave_salary.airfare_months);

                      utilized_leave_days =
                        parseFloat(leave_salary_header.utilized_leave_days) +
                        parseFloat(no_of_days);

                      utilized_leave_salary_amount =
                        parseFloat(
                          leave_salary_header.utilized_leave_salary_amount
                        ) + parseFloat(leave_salary.leave_amount);

                      utilized_airticket_amount =
                        parseFloat(
                          leave_salary_header.utilized_airticket_amount
                        ) + parseFloat(leave_salary.airfare_amount);

                      strQuery +=
                        "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
                        `balance_leave_salary_amount` = ?, `balance_airticket_amount` = ? , airfare_months = ?, \
                         `utilized_leave_days`=?, `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ? \
                         where employee_id=?;";

                      values.push(
                        balance_leave_days,
                        balance_leave_salary_amount,
                        balance_airticket_amount,
                        airfare_months,
                        utilized_leave_days,
                        utilized_leave_salary_amount,
                        utilized_airticket_amount,
                        inputParam.employee_id
                      );

                      strQuery +=
                        "UPDATE `hims_d_employee` SET  `suspend_salary`='Y', `last_salary_process_date`=? \
                      where hims_d_employee_id=?; UPDATE `hims_f_salary` SET `salary_paid`='Y' where hims_f_salary_id in (?);";

                      values.push(
                        moment(leave_salary.leave_end_date).format(
                          "YYYY-MM-DD"
                        ),
                        inputParam.employee_id,
                        salary_header_id
                      );
                      _mysql
                        .executeQuery({
                          query: strQuery,
                          values: values,
                          printQuery: true,
                        })
                        .then((LeaveSettleResult) => {
                          let result = {
                            payment_application_code: payment_application_code,
                          };
                          // _mysql.commitTransaction(() => {
                          //   _mysql.releaseConnection();
                          req.records = result;
                          next();
                          // });
                        })
                        .catch((error) => {
                          next(error);
                        });
                    }
                  })
                  .catch((error) => {
                    next(error);
                  });
              }
            })
            .catch((e) => {
              next(e);
            });
        })
        .catch((error) => {
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },

  CancelEmployeePayment: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      let inputParam = req.body;

      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE `hims_f_employee_payments` SET cancel='Y', cancel_by=?, cancel_date=? WHERE \
          hims_f_employee_payments_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_f_employee_payments_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          req.body.payment_cancel = "Y";
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          // console.log("inputParam.payment_type", inputParam.payment_type)
          // console.log("inputParam.earnings_id", inputParam.earnings_id)
          if (inputParam.payment_type == "AD") {
            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_employee_advance` SET `advance_status`='REJ', `updated_date`=?, `updated_by`=? \
              where hims_f_employee_advance_id=?; select head_id, child_id from hims_d_earning_deduction where hims_d_earning_deduction_id=?",
                values: [
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  inputParam.employee_advance_id,
                  inputParam.earnings_id,
                ],
              })
              .then((AdvanceResult) => {
                req.body.advance_acc = AdvanceResult[1];
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = AdvanceResult;
                next();
                // });
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
                  inputParam.employee_loan_id,
                ],
              })
              .then((LoanResult) => {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = LoanResult;
                next();
                // });
              });
          } else if (inputParam.payment_type == "EN") {
            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_leave_encash_header` SET `authorized`='APR', `posted`='N'\
                where hims_f_leave_encash_header_id=?",
                values: [inputParam.employee_leave_encash_id],
                printQuery: true,
              })
              .then((EncashResult) => {
                let strAnual_Qry = "";
                if (inputParam.leave_category === "A") {
                  strAnual_Qry += _mysql.mysqlQueryFormat(
                    "select H.employee_id, H.`year`, H.leave_id,H.leave_days,(M.close_balance + H.leave_days) as close_balance, \
                        (LH.balance_leave_days + H.leave_days) as balance_leave_days, (LH.balance_leave_salary_amount + H.leave_amount) as balance_leave_salary_amount, \
                        M.hims_f_employee_monthly_leave_id, LH.hims_f_employee_leave_salary_header_id from hims_f_leave_encash_header H \
                        inner join hims_f_employee_monthly_leave M on M.employee_id=H.employee_id \
                        and M.`year`=H.`year`and M.leave_id = H.leave_id\
                        inner join hims_f_employee_leave_salary_header LH on LH.employee_id=H.employee_id \
                        where H.hims_f_leave_encash_header_id=?;",
                    [inputParam.employee_leave_encash_id]
                  );
                } else {
                  strAnual_Qry += _mysql.mysqlQueryFormat(
                    "select H.employee_id, H.`year`, H.leave_id,H.leave_days,(M.close_balance + H.leave_days) as close_balance, \
                        M.hims_f_employee_monthly_leave_id from hims_f_leave_encash_header H,hims_f_employee_monthly_leave M\
                        where M.employee_id=H.employee_id and M.`year`=H.`year`and \
                        M.leave_id = H.leave_id and H.hims_f_leave_encash_header_id=?;",
                    [inputParam.employee_leave_encash_id]
                  );
                }

                _mysql
                  .executeQuery({
                    query: strAnual_Qry,
                  })
                  .then((leave_encash_header) => {
                    let strQuery = "";
                    if (leave_encash_header.length === 0) {
                      req.records = leave_encash_header;
                      next();
                    }

                    if (inputParam.leave_category === "A") {
                      strQuery += _mysql.mysqlQueryFormat(
                        "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                      where hims_f_employee_monthly_leave_id=?; \
                      UPDATE hims_f_employee_leave_salary_header SET balance_leave_days = ?, \
                      balance_leave_salary_amount = ? where hims_f_employee_leave_salary_header_id=?",
                        [
                          leave_encash_header[0].close_balance,
                          leave_encash_header[0]
                            .hims_f_employee_monthly_leave_id,
                          leave_encash_header[0].balance_leave_days,
                          parseFloat(
                            leave_encash_header[0].balance_leave_salary_amount
                          ) > 0
                            ? leave_encash_header[0].balance_leave_salary_amount
                            : 0,
                          leave_encash_header[0]
                            .hims_f_employee_leave_salary_header_id,
                        ]
                      );
                    } else {
                      strQuery += _mysql.mysqlQueryFormat(
                        "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                      where hims_f_employee_monthly_leave_id=?;",
                        [
                          leave_encash_header[0].close_balance,
                          leave_encash_header[0]
                            .hims_f_employee_monthly_leave_id,
                        ]
                      );
                    }
                    _mysql
                      .executeQuery({
                        query: strQuery,
                        printQuery: true,
                      })
                      .then((monthly_leave) => {
                        // _mysql.commitTransaction(() => {
                        //   _mysql.releaseConnection();
                        req.records = monthly_leave;
                        next();
                        // });
                      })
                      .catch((error) => {
                        next(error);
                      });

                    // for (let i = 0; i < leave_encash_header.length; i++) {
                    //   strQuery += _mysql.mysqlQueryFormat(
                    //     "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                    //   where employee_id=? and `year`=? and leave_id=?;",
                    //     [
                    //       leave_encash_header[i].close_balance,
                    //       leave_encash_header[i].employee_id,
                    //       leave_encash_header[i].year,
                    //       leave_encash_header[i].leave_id,
                    //     ]
                    //   );
                    //   if (i === leave_encash_header.length - 1) {
                    //     _mysql
                    //       .executeQuery({
                    //         query: strQuery,
                    //         printQuery: true,
                    //       })
                    //       .then((monthly_leave) => {
                    //         // _mysql.commitTransaction(() => {
                    //         //   _mysql.releaseConnection();
                    //         req.records = monthly_leave;
                    //         next();
                    //         // });
                    //       })
                    //       .catch((error) => {
                    //         next(error);
                    //       });
                    //   }
                    //   // _mysql
                    //   //   .executeQuery({
                    //   //     query:
                    //   //       "UPDATE `hims_f_employee_monthly_leave` SET `close_balance`=?\
                    //   // where employee_id=? and `year`=? and leave_id=?;",
                    //   //     values: [
                    //   //       leave_encash_header[i].close_balance,
                    //   //       leave_encash_header[i].employee_id,
                    //   //       leave_encash_header[i].year,
                    //   //       leave_encash_header[i].leave_id
                    //   //     ]
                    //   //   })
                    //   //   .then(monthly_leave => {
                    //   //     _mysql.commitTransaction(() => {
                    //   //       _mysql.releaseConnection();
                    //   //       req.records = monthly_leave;
                    //   //       next();
                    //   //     });
                    //   //   })
                    //   //   .catch(error => {
                    //   //     next(error);
                    //   //   });
                    // }
                  })
                  .catch((error) => {
                    next(error);
                  });
              })
              .catch((error) => {
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
                  inputParam.employee_end_of_service_id,
                ],
              })
              .then((GratuityResult) => {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = GratuityResult;
                next();
                // });
              })
              .catch((error) => {
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
                  inputParam.employee_final_settlement_id,
                ],
              })
              .then((FinalSettleResult) => {
                // _mysql.commitTransaction(() => {
                //   _mysql.releaseConnection();
                req.records = FinalSettleResult;
                next();
                // });
              })
              .catch((error) => {
                next(error);
              });
          } else if (inputParam.payment_type == "LS") {
            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_leave_salary_header` SET `status`='PEN' \
                    where hims_f_leave_salary_header_id=?; select * from `hims_f_leave_salary_header` where \
                    hims_f_leave_salary_header_id=?; select * from `hims_f_employee_leave_salary_header` where \
                    employee_id=?; select * from `hims_f_leave_salary_detail` where \
                    leave_salary_header_id in (?);",
                values: [
                  inputParam.employee_leave_settlement_id,
                  inputParam.employee_leave_settlement_id,
                  inputParam.employee_id,
                  inputParam.employee_leave_settlement_id,
                ],
                printQuery: true,
              })
              .then((LeaveSettleResult) => {
                let leave_salary = LeaveSettleResult[1][0];
                let leave_salary_header = LeaveSettleResult[2][0];
                let leave_salary_detail = LeaveSettleResult[3][0];

                let salary_header_id = _.map(leave_salary_detail, (o) => {
                  return o.salary_header_id;
                });

                let start_year = moment(leave_salary.leave_start_date).format(
                  "YYYY"
                );
                let end_year = moment(leave_salary.leave_end_date).format(
                  "YYYY"
                );
                let balance_leave_days = 0;
                let balance_leave_salary_amount = 0;
                let balance_airticket_amount = 0;

                let utilized_leave_days = 0;
                let utilized_leave_salary_amount = 0;
                let utilized_airticket_amount = 0;

                let airfare_months = 0;

                if (start_year == end_year) {
                  balance_leave_days =
                    parseFloat(leave_salary_header.balance_leave_days) +
                    parseFloat(leave_salary.leave_period);

                  balance_leave_salary_amount =
                    parseFloat(
                      leave_salary_header.balance_leave_salary_amount
                    ) + parseFloat(leave_salary.leave_amount);

                  balance_airticket_amount =
                    parseFloat(leave_salary_header.balance_airticket_amount) +
                    parseFloat(leave_salary.airfare_amount);

                  utilized_leave_days =
                    parseFloat(leave_salary_header.utilized_leave_days) -
                    parseFloat(leave_salary.leave_period);

                  utilized_leave_salary_amount =
                    parseFloat(
                      leave_salary_header.utilized_leave_salary_amount
                    ) - parseFloat(leave_salary.leave_amount);

                  utilized_airticket_amount =
                    parseFloat(leave_salary_header.utilized_airticket_amount) -
                    parseFloat(leave_salary.airfare_amount);

                  airfare_months =
                    parseFloat(leave_salary_header.airfare_months) +
                    parseFloat(leave_salary.airfare_months);
                  _mysql
                    .executeQuery({
                      query:
                        "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, \
                        `balance_leave_salary_amount` = ?, `balance_airticket_amount` = ?, `utilized_leave_days`=?, \
                        `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ?, airfare_months=? \
                        where employee_id=?; \
                        UPDATE `hims_d_employee` SET `suspend_salary`='N', `last_salary_process_date`=null \
                        where hims_d_employee_id=?; UPDATE `hims_f_salary` SET `salary_paid`='N' where hims_f_salary_id in (?);",
                      values: [
                        balance_leave_days,
                        balance_leave_salary_amount,
                        balance_airticket_amount,
                        utilized_leave_days,
                        utilized_leave_salary_amount,
                        utilized_airticket_amount,
                        airfare_months,
                        inputParam.employee_id,
                        inputParam.employee_id,
                        salary_header_id,
                      ],
                      printQuery: true,
                    })
                    .then((LeaveSettleResult) => {
                      // _mysql.commitTransaction(() => {
                      //   _mysql.releaseConnection();
                      req.records = LeaveSettleResult;
                      next();
                      // });
                    })
                    .catch((error) => {
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
                    parseFloat(
                      leave_salary_header.balance_leave_salary_amount
                    ) + parseFloat(leave_salary.leave_amount);

                  balance_leave_salary_amount =
                    parseFloat(leave_salary_header.balance_airticket_amount) +
                    parseFloat(leave_salary.airfare_amount);

                  utilized_leave_days =
                    parseFloat(leave_salary_header.utilized_leave_days) -
                    parseFloat(no_of_days);

                  utilized_leave_salary_amount =
                    parseFloat(
                      leave_salary_header.utilized_leave_salary_amount
                    ) - parseFloat(leave_salary.leave_amount);

                  utilized_airticket_amount =
                    parseFloat(leave_salary_header.utilized_airticket_amount) -
                    parseFloat(leave_salary.airfare_amount);

                  airfare_months =
                    parseFloat(leave_salary_header.airfare_months) +
                    parseFloat(leave_salary.airfare_months);
                  let strQuery =
                    "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ?, `utilized_leave_days`=?, \
                      `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ?, airfare_months=? where employee_id=?;";

                  values.push(
                    balance_leave_days,
                    balance_leave_salary_amount,
                    balance_airticket_amount,
                    utilized_leave_days,
                    utilized_leave_salary_amount,
                    utilized_airticket_amount,
                    airfare_months,
                    inputParam.employee_id
                  );

                  no_of_days =
                    parseFloat(leave_salary_header.balance_leave_days) -
                    parseFloat(no_of_days);

                  balance_leave_days =
                    parseFloat(leave_salary_header.balance_leave_days) +
                    parseFloat(no_of_days);

                  balance_leave_salary_amount =
                    parseFloat(
                      leave_salary_header.balance_leave_salary_amount
                    ) + parseFloat(leave_salary.leave_amount);

                  balance_leave_salary_amount =
                    parseFloat(leave_salary_header.balance_airticket_amount) +
                    parseFloat(leave_salary.airfare_amount);

                  utilized_leave_days =
                    parseFloat(leave_salary_header.utilized_leave_days) -
                    parseFloat(no_of_days);

                  utilized_leave_salary_amount =
                    parseFloat(
                      leave_salary_header.utilized_leave_salary_amount
                    ) - parseFloat(leave_salary.leave_amount);

                  utilized_airticket_amount =
                    parseFloat(leave_salary_header.utilized_airticket_amount) -
                    parseFloat(leave_salary.airfare_amount);

                  airfare_months =
                    parseFloat(leave_salary_header.airfare_months) +
                    parseFloat(leave_salary.airfare_months);
                  strQuery +=
                    "UPDATE `hims_f_employee_leave_salary_header` SET `balance_leave_days`=?, `balance_leave_salary_amount` = ?, \
                      `balance_airticket_amount` = ?, `utilized_leave_days`=?, \
                      `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ?, airfare_months=? where employee_id=?;";

                  values.push(
                    balance_leave_days,
                    balance_leave_salary_amount,
                    balance_airticket_amount,
                    utilized_leave_days,
                    utilized_leave_salary_amount,
                    utilized_airticket_amount,
                    airfare_months,
                    inputParam.employee_id
                  );

                  _mysql
                    .executeQuery({
                      query: strQuery,
                      values: values,
                    })
                    .then((LeaveSettleResult) => {
                      // _mysql.commitTransaction(() => {
                      //   _mysql.releaseConnection();
                      req.records = LeaveSettleResult;
                      next();
                      // });
                    })
                    .catch((error) => {
                      next(error);
                    });
                }
              })
              .catch((error) => {
                next(error);
              });
          }
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  getEmployeePayments: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const input = req.query;

      let inputValues = [];
      let _stringData = "";
      inputValues.push(input.hospital_id);
      inputValues.push(input.payment_type);

      let strAppend = "";
      let strField = "";
      if (input.payment_type === "EN") {
        strField = ", L.leave_category";
        strAppend =
          " inner join hims_f_leave_encash_header EH on EH.hims_f_leave_encash_header_id = EP.employee_leave_encash_id \
        inner join hims_d_leave L on L.hims_d_leave_id = EH.leave_id ";
      }
      if (input.employee_id != null) {
        _stringData += " and employee_id=? ";
        inputValues.push(input.employee_id);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_payments_id, EP.employee_id, employee_advance_id,employee_loan_id,employee_leave_encash_id,\
          employee_end_of_service_id,employee_final_settlement_id,employee_leave_settlement_id,payment_application_code, \
          payment_type, payment_amount, EP.payment_date, payment_mode, cheque_number, deduction_month, cancel, bank_id,\
          head_id, child_id, emp.employee_code, emp.full_name,earnings_id" +
            strField +
            " from hims_f_employee_payments EP \
          inner join hims_d_employee emp on EP.employee_id = emp.hims_d_employee_id " +
            strAppend +
            "where emp.hospital_id=? and payment_type=?" +
            _stringData,
          values: inputValues,
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

  getEmployeeLeaveSalary: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const input = req.query;

      let inputValues = [];

      let strQry = "";
      if (input.employee_group_id > 0) {
        strQry += " and E.employee_group_id=" + input.employee_group_id;
      }
      if (input.hims_d_employee_id > 0) {
        strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
      }

      if (input.hospital_id > 0) {
        strQry += " and  E.hospital_id =" + input.hospital_id;
      }

      _mysql
        .executeQuery({
          query:
            "select E.employee_code, E.full_name, LS.hims_f_employee_leave_salary_header_id, LS.leave_days, \
            LS.leave_salary_amount, LS.airticket_amount, LS.balance_leave_days, LS.balance_leave_salary_amount, \
            LS.balance_airticket_amount, LS.airfare_months, LS.utilized_leave_days, LS.utilized_leave_salary_amount, \
            LS.utilized_airticket_amount from hims_d_employee E inner join hims_f_employee_leave_salary_header LS \
            on E.hims_d_employee_id=LS.employee_id where E.leave_salary_process = 'Y'" +
            strQry,
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
  updateEmployeeLeaveSalary: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const input = req.body;

      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_employee_leave_salary_header set leave_days=?, leave_salary_amount=?, airticket_amount=?, \
            balance_leave_days=?, balance_leave_salary_amount=?, balance_airticket_amount=?, airfare_months=? \
            where  hims_f_employee_leave_salary_header_id=?",

          values: [
            input.balance_leave_days,
            input.balance_leave_salary_amount,
            input.balance_airticket_amount,
            input.balance_leave_days,
            input.balance_leave_salary_amount,
            input.balance_airticket_amount,
            input.airfare_months,
            input.hims_f_employee_leave_salary_header_id,
          ],
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

  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      // console.log("generateAccountingEntry")
      let inputParam = req.body;
      let str_bank_qry = "select 1";
      if (inputParam.bank_id !== null) {
        str_bank_qry = _mysql.mysqlQueryFormat(
          "select head_id, child_id from hims_d_bank where hims_d_bank_id=?;",
          [inputParam.bank_id]
        );
      }
      _mysql
        .executeQueryWithTransaction({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
          printQuery: true,
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
              where account in ('SAL_PYBLS', 'LV_SAL_PYBL', 'AIRFR_PYBL', 'GRAT_PYBL','FIN_STL_PYBL');" +
                  str_bank_qry,
                printQuery: true,
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
                const fs_pay_acc = result[0].find(
                  (f) => f.account === "FIN_STL_PYBL"
                );

                // const org_data = result[0]
                const bank_acc = result[1][0];

                // inputParam.payment_mode,
                let strQuery = "";
                if (inputParam.payment_type === "AD") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "select advance_amount as pay_amount, employee_code, full_name,E.hospital_id, E.sub_department_id\
                from hims_f_employee_advance LA  \
                inner join hims_d_employee E on E.hims_d_employee_id = LA.employee_id \
                where hims_f_employee_advance_id = ?;",
                    [inputParam.employee_advance_id]
                  );
                } else if (inputParam.payment_type === "LN") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "select head_id, child_id, approved_amount as pay_amount, employee_code, full_name,E.hospital_id, \
                E.sub_department_id from hims_f_loan_application LA \
                inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id \
                inner join hims_d_employee E on E.hims_d_employee_id = LA.employee_id \
                where hims_f_loan_application_id = ?",
                    [inputParam.employee_loan_id]
                  );
                } else if (inputParam.payment_type === "LS") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "select salary_amount, leave_amount, airfare_amount, total_amount as pay_amount, employee_code, full_name,\
                E.hospital_id, E.sub_department_id from hims_f_leave_salary_header LA \
                inner join hims_d_employee E on E.hims_d_employee_id = LA.employee_id \
                where hims_f_leave_salary_header_id = ?;",
                    [inputParam.employee_leave_settlement_id]
                  );
                } else if (inputParam.payment_type === "GR") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "select payable_amount as pay_amount, employee_code, full_name, \
                E.hospital_id, E.sub_department_id from hims_f_end_of_service ES \
                inner join hims_d_employee E on E.hims_d_employee_id = ES.employee_id \
                where hims_f_end_of_service_id = ?;",
                    [inputParam.employee_end_of_service_id]
                  );
                } else if (inputParam.payment_type === "EN") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "SELECT total_amount as pay_amount,employee_code, full_name, E.hospital_id, L.leave_category, E.sub_department_id \
                FROM hims_f_leave_encash_header EH \
                inner join hims_d_employee E on E.hims_d_employee_id = EH.employee_id \
                inner join hims_d_leave L on L.hims_d_leave_id = EH.leave_id \
                where hims_f_leave_encash_header_id=?;",
                    [inputParam.employee_leave_encash_id]
                  );
                } else if (inputParam.payment_type === "FS") {
                  strQuery += _mysql.mysqlQueryFormat(
                    "SELECT total_amount as pay_amount,employee_code, full_name, E.hospital_id, E.sub_department_id\
                FROM hims_f_final_settlement_header EH \
                inner join hims_d_employee E on E.hims_d_employee_id = EH.employee_id \
                where hims_f_final_settlement_header_id=?;",
                    [inputParam.employee_final_settlement_id]
                  );
                }

                // console.log("strQuery", strQuery)
                _mysql
                  .executeQueryWithTransaction({
                    query: strQuery,
                    printQuery: true,
                  })
                  .then((headerResult) => {
                    let _header_narattion = "";

                    if (inputParam.payment_type === "AD") {
                      _header_narattion =
                        "Advance Payment For " +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                      headerResult[0].head_id =
                        inputParam.advance_acc[0].head_id;
                      headerResult[0].child_id =
                        inputParam.advance_acc[0].child_id;
                    } else if (inputParam.payment_type === "LN") {
                      _header_narattion =
                        "Loan Payment " +
                        headerResult[0].loan_description +
                        " For " +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                    } else if (inputParam.payment_type === "LS") {
                      _header_narattion =
                        "Leave Salary Payment For" +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                    } else if (inputParam.payment_type === "GR") {
                      _header_narattion =
                        "Gratuity Payment For" +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                    } else if (inputParam.payment_type === "EN") {
                      // console.log("headerResult[0].leave_category", headerResult[0].leave_category)
                      if (headerResult[0].leave_category !== "A") {
                        // console.log("inside")
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          next();
                        });
                        return;
                      }
                      // console.log("commit")
                      _header_narattion =
                        "Encashment For" +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                    } else if (inputParam.payment_type === "FS") {
                      _header_narattion =
                        "Final Settlement For" +
                        headerResult[0].employee_code +
                        "/" +
                        headerResult[0].full_name;
                    }

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_header (transaction_date, amount, \
                    voucher_type, document_id, document_number, from_screen, \
                    narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          inputParam.payment_amount,
                          "payment",
                          inputParam.hims_f_employee_payments_id,
                          inputParam.payment_cancel === "Y"
                            ? "C-" + inputParam.payment_application_code
                            : inputParam.payment_application_code,
                          inputParam.ScreenCode,
                          _header_narattion,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id,
                        ],
                        printQuery: true,
                      })
                      .then((day_end_header) => {
                        const insertSubDetail = [];

                        // console.log("payment_cancel", inputParam.payment_cancel)

                        if (inputParam.payment_mode === "CS") {
                          //Cash in Hand Entry
                          if (inputParam.payment_cancel === "Y") {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: inputParam.head_id,
                              child_id: inputParam.child_id,
                              debit_amount: headerResult[0].pay_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          } else {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: inputParam.head_id,
                              child_id: inputParam.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: headerResult[0].pay_amount,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          }
                        } else if (inputParam.payment_mode === "CH") {
                          //Bank Entry
                          if (inputParam.payment_cancel === "Y") {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: bank_acc.head_id,
                              child_id: bank_acc.child_id,
                              debit_amount: headerResult[0].pay_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          } else {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: bank_acc.head_id,
                              child_id: bank_acc.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: headerResult[0].pay_amount,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          }
                        }

                        if (inputParam.payment_type === "LS") {
                          //Laibility Entry Leave Settlementß
                          if (inputParam.payment_cancel === "Y") {
                            if (parseFloat(headerResult[0].salary_amount) > 0) {
                              //Leave Salary
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: lv_salary_pay_acc.head_id,
                                child_id: lv_salary_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "CR",
                                credit_amount: headerResult[0].leave_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }

                            if (parseFloat(headerResult[0].salary_amount) > 0) {
                              //Salary Payable
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: salary_pay_acc.head_id,
                                child_id: salary_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "DR",
                                credit_amount: headerResult[0].salary_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }

                            if (
                              parseFloat(headerResult[0].airfare_amount) > 0
                            ) {
                              //Airfare
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: airfair_pay_acc.head_id,
                                child_id: airfair_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "DR",
                                credit_amount: headerResult[0].airfare_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          } else {
                            if (parseFloat(headerResult[0].salary_amount) > 0) {
                              //Leave Salary
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: lv_salary_pay_acc.head_id,
                                child_id: lv_salary_pay_acc.child_id,
                                debit_amount: headerResult[0].leave_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }

                            if (parseFloat(headerResult[0].salary_amount) > 0) {
                              //Salary Payable
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: salary_pay_acc.head_id,
                                child_id: salary_pay_acc.child_id,
                                debit_amount: headerResult[0].salary_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }

                            if (
                              parseFloat(headerResult[0].airfare_amount) > 0
                            ) {
                              //Airfare
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: airfair_pay_acc.head_id,
                                child_id: airfair_pay_acc.child_id,
                                debit_amount: headerResult[0].airfare_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          }
                        } else if (inputParam.payment_type === "GR") {
                          //Laibility Entry for Gratuity
                          if (inputParam.payment_cancel === "Y") {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Gratuity
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: gratuity_pay_acc.head_id,
                                child_id: gratuity_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "CR",
                                credit_amount: headerResult[0].pay_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          } else {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Gratuity
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: gratuity_pay_acc.head_id,
                                child_id: gratuity_pay_acc.child_id,
                                debit_amount: headerResult[0].pay_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          }
                        } else if (inputParam.payment_type === "EN") {
                          //Laibility Entry Encashment
                          if (inputParam.payment_cancel === "Y") {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Gratuity
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: lv_salary_pay_acc.head_id,
                                child_id: lv_salary_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "CR",
                                credit_amount: headerResult[0].pay_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          } else {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Gratuity
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: lv_salary_pay_acc.head_id,
                                child_id: lv_salary_pay_acc.child_id,
                                debit_amount: headerResult[0].pay_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          }
                        } else if (inputParam.payment_type === "FS") {
                          //Laibility Entry Final Settlement
                          if (inputParam.payment_cancel === "Y") {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Final Settlement
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: fs_pay_acc.head_id,
                                child_id: fs_pay_acc.child_id,
                                debit_amount: 0,
                                payment_type: "CR",
                                credit_amount: headerResult[0].pay_amount,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          } else {
                            if (parseFloat(headerResult[0].pay_amount) > 0) {
                              //Final Settlement
                              insertSubDetail.push({
                                payment_date: new Date(),
                                head_id: fs_pay_acc.head_id,
                                child_id: fs_pay_acc.child_id,
                                debit_amount: headerResult[0].pay_amount,
                                payment_type: "DR",
                                credit_amount: 0,
                                hospital_id: headerResult[0].hospital_id,
                                sub_department_id:
                                  headerResult[0].sub_department_id,
                              });
                            }
                          }
                        } else {
                          //Asset Loan Entry
                          if (inputParam.payment_cancel === "Y") {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: headerResult[0].head_id,
                              child_id: headerResult[0].child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: headerResult[0].pay_amount,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          } else {
                            insertSubDetail.push({
                              payment_date: new Date(),
                              head_id: headerResult[0].head_id,
                              child_id: headerResult[0].child_id,
                              debit_amount: headerResult[0].pay_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: headerResult[0].hospital_id,
                              sub_department_id:
                                headerResult[0].sub_department_id,
                            });
                          }
                        }
                        const IncludeValuess = [
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
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
};
