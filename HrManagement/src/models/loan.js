import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";
import leave from "../models/leave";

const { getMaxAuth } = leave;

export default {
  getEmployeeLoanOpenBal: (req, res, next) => {
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

      _mysql
        .executeQuery({
          query:
            "select E.employee_code, E.full_name, LA.loan_amount, LA.approved_amount, LA.start_month, LA.start_year, \
             LA.loan_tenure, LA.pending_tenure, LA.installment_amount, LA.pending_loan, L.loan_description, LA.hims_f_loan_application_id from hims_f_loan_application LA \
             inner join hims_d_employee E on E.hims_d_employee_id=LA.employee_id \
             inner join hims_d_loan L on L.hims_d_loan_id=LA.loan_id where E.hospital_id=? " +
            strQry,
          values: [input.hospital_id],
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

  //created by irfan:
  addLoanApplication: (req, res, next) => {
    const utilities = new algaehUtilities();
    try {
      const _mysql = new algaehMysql();
      let input = req.body;
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id,date_of_joining,exit_date ,employee_status from hims_d_employee\
              where record_status='A' and  hims_d_employee_id=?",

          values: [input.employee_id],

          printQuery: true,
        })
        .then((emp) => {
          if (emp.length > 0) {
            let today = moment(new Date()).format("YYYY-MM-DD");

            if (emp[0].employee_status != "A") {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan ,your status is inactive",
              };
              next();
              return;
            } else if (emp[0].date_of_joining > today) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan before joining date",
              };
              next();
              return;
            } else if (emp[0].exit_date != null) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan for resigned employee",
              };
              next();
              return;
            } else {
              // console.log("userIdentity: ", req.userIdentity);
              _mysql
                .generateRunningNumber({
                  user_id: req.userIdentity.algaeh_d_app_user_id,
                  numgen_codes: ["EMPLOYEE_LOAN"],
                  table_name: "hims_f_hrpayroll_numgen",
                })
                .then((generatedNumbers) => {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO `hims_f_loan_application` (loan_application_number,employee_id,loan_id,\
                application_reason,loan_application_date,loan_amount,start_month,start_year,loan_tenure,\
                installment_amount, pending_loan,created_date, created_by, updated_date, updated_by,hospital_id)\
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        generatedNumbers.EMPLOYEE_LOAN,

                        input.employee_id,
                        input.loan_id,
                        input.application_reason,
                        new Date(),
                        input.loan_amount,
                        input.start_month,
                        input.start_year,
                        input.loan_tenure,
                        input.installment_amount,
                        input.loan_amount,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        new Date(),
                        req.userIdentity.algaeh_d_app_user_id,
                        input.hospital_id,
                      ],

                      printQuery: true,
                    })
                    .then((result) => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result;
                        next();
                      });
                    })
                    .catch((e) => {
                      utilities.logger().log("e: ", e);
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
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Employee doesn't exist",
            };
            next();
            return;
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

  //created by irfan:
  adjustLoanApplication: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;

    if (input.hims_f_loan_application_id > 0 && input.loan_skip_months >= 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_loan_application SET loan_skip_months = ?,\
          updated_date=?, updated_by=?  WHERE record_status='A' and  hims_f_loan_application_id = ?",
          values: [
            input.loan_skip_months,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_loan_application_id,
          ],

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid loan application id",
            };
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
        message: "please provide valid input",
      };

      next();
      return;
    }
  },

  //created by irfan: to show loan application to authorize
  getLoanApplication_bkp_09_06_2020: (req, res, next) => {
    let employee = "";
    let range = "";

    if (req.query.employee_id > 0) {
      employee = ` and employee_id=${req.query.employee_id} `;
    }

    console.log("req.query.loan_authorized ", req.query.loan_authorized);
    if (
      req.query.loan_authorized !== null &&
      req.query.loan_authorized !== undefined
    ) {
      employee += ` and loan_authorized= '${req.query.loan_authorized}'`;
    }

    if (req.query.hospital_id > 0) {
      employee += ` and  LA.hospital_id=${req.query.hospital_id} `;
    }

    if (
      req.query.from_date != "null" &&
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.to_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null
    ) {
      range = ` and date(loan_application_date)
      between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    let auth_level = "";
    if (req.query.auth_level == "1") {
      auth_level = " and authorized1='P' ";
    } else if (req.query.auth_level == "2") {
      auth_level = " and authorized1='A' and authorized2='P' ";
    }

    let loan_issued = "";

    if (req.query.loan_issued == "Y") {
      loan_issued = " and loan_authorized='IS' ";
    }

    let loan_closed = "";
    if (req.query.loan_closed == "Y" || req.query.loan_closed == "N") {
      loan_closed = ` and LA.loan_closed='${req.query.loan_closed}' `;
    }

    // if (req.userIdentity.loan_authorize_privilege != "N") {
    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          "select hims_f_loan_application_id,loan_application_number, loan_skip_months , employee_id,loan_id,L.loan_code,L.loan_description,\
          L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
          loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
          start_month,start_year,loan_tenure,pending_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
          authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
          hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
           and E.record_status='A' where L.record_status='A' " +
          employee +
          "" +
          range +
          "" +
          auth_level +
          "" +
          loan_issued +
          "" +
          loan_closed +
          " order by hims_f_loan_application_id desc",

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: to show loan application to authorize
  getLoanApplication: (req, res, next) => {
    let input = req.query;
    let employee = "";
    let range = "";

    if (input.employee_id > 0) {
      employee = ` and LA.employee_id=${input.employee_id} `;
    }

    if (input.loan_authorized) {
      employee += ` and loan_authorized= '${input.loan_authorized}'`;
    }

    if (input.hospital_id > 0) {
      employee += ` and  E.hospital_id=${input.hospital_id} `;
    }

    if (input.from_date && input.to_date) {
      range = ` and date(loan_application_date)
      between date('${input.from_date}') and date('${input.to_date}') `;
    }

    let loan_issued = "";

    if (input.loan_issued == "Y") {
      loan_issued = " and loan_authorized='IS' ";
    }

    let loan_closed = "";
    if (input.loan_closed == "Y" || input.loan_closed == "N") {
      loan_closed = ` and LA.loan_closed='${input.loan_closed}' `;
    }

    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: "select authorization_plan from hims_d_hrms_options;",
      })
      .then((options) => {
        if (options.length > 0) {
          let auth_level = "";

          if (options[0]["authorization_plan"] == "A") {
            if (input.auth_level == "1") {
              auth_level =
                " and authorized1='P'  and AUS.loan_level1=" +
                req.userIdentity.employee_id;
            } else if (input.auth_level == "2") {
              auth_level =
                " and authorized1='A' and authorized2='P'  and AUS.loan_level2=" +
                req.userIdentity.employee_id;
            }
          } else {
            switch (input.auth_level) {
              case "1":
                if (req.userIdentity.loan_authorize_privilege > 1) {
                  auth_level = " and authorized1='P'  ";
                } else {
                  // auth_level =
                  //   " and authorized1='P' AND E.reporting_to_id=" +
                  //   req.userIdentity.employee_id;

                  auth_level = " and authorized1='P'  ";
                }
                break;
              case "2":
                auth_level = " and authorized1='A' and authorized2='P' ";
                break;
            }
          }

          _mysql
            .executeQuery({
              query:
                "select hims_f_loan_application_id,loan_application_number, loan_skip_months , LA.employee_id,loan_id,L.loan_code,L.loan_description,\
            L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
            loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
            start_month,start_year,loan_tenure,pending_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
            authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
            hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
             and E.record_status='A'  left join hims_d_authorization_setup AUS on  AUS.employee_id=E.hims_d_employee_id\
             where L.record_status='A' " +
                employee +
                "" +
                range +
                "" +
                auth_level +
                "" +
                loan_issued +
                "" +
                loan_closed +
                " order by hims_f_loan_application_id desc ;",

              printQuery: true,
            })
            .then((result) => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            message: "Please define HRMS options",
            invalid_input: true,
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  getLoanLevels(req, res, next) {
    try {
      let userPrivilege = req.userIdentity.loan_authorize_privilege;

      let auth_levels = [];
      switch (userPrivilege) {
        case "1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "2":
          auth_levels.push(
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
        case "3":
          auth_levels.push(
            { name: "Level 3", value: 3 },
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
        case "4":
          auth_levels.push(
            { name: "Level 4", value: 4 },
            { name: "Level 3", value: 3 },
            { name: "Level 2", value: 2 },
            { name: "Level 1", value: 1 }
          );
          break;
      }

      req.records = { auth_levels };
      next();
    } catch (e) {
      next(e);
    }
  },
  //created by irfan: to
  authorizeLoan: (req, res, next) => {
    const utilities = new algaehUtilities();
    const input = req.body;

    if (req.userIdentity.loan_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql,
      })
        .then((maxAuth) => {
          if (
            req.userIdentity.loan_authorize_privilege < maxAuth.MaxLoan ||
            input.auth_level < maxAuth.MaxLoan
          ) {
            //for lower level authorize
            getLoanAuthFields(input.auth_level).then((authFields) => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_loan_application SET " +
                    authFields +
                    ",approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
                  loan_tenure=?,pending_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?;",
                  values: [
                    input.authorized,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    input.approved_amount,
                    input.start_year,
                    input.start_month,
                    input.installment_amount,
                    input.loan_tenure,
                    input.loan_tenure,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_loan_application_id,
                  ],
                  printQuery: true,
                })
                .then((result) => {
                  if (result.affectedRows > 0 && input.authorized == "R") {
                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "update hims_f_loan_application set loan_authorized='REJ'\
                          where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=?",
                        values: [input.hims_f_loan_application_id],
                        printQuery: true,
                      })
                      .then((rejResult) => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejResult;
                          next();
                        });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (result.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  } else {
                    req.records = {
                      invalid_input: true,
                      message: "Please provide valid loan application id ",
                    };
                    _mysql.rollBackTransaction(() => {
                      next();
                    });
                  }
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          } else if (
            req.userIdentity.loan_authorize_privilege >= maxAuth.MaxLoan &&
            input.auth_level >= maxAuth.MaxLoan
          ) {
            //if he has highest previlege
            getLoanAuthFields(input.auth_level).then((authFields) => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_loan_application SET " +
                    authFields +
                    ",approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
                  loan_tenure=?,pending_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",
                  values: [
                    input.authorized,
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    input.approved_amount,
                    input.start_year,
                    input.start_month,
                    input.installment_amount,
                    input.loan_tenure,
                    input.loan_tenure,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_loan_application_id,
                  ],
                  printQuery: true,
                })
                .then((result) => {
                  if (
                    result.affectedRows > 0 &&
                    (input.authorized == "R" || input.authorized == "A")
                  ) {
                    let qry = "";

                    if (input.authorized == "R") {
                      qry = `update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${input.hims_f_loan_application_id}`;
                    } else if (input.authorized == "A") {
                      qry = `update hims_f_loan_application set loan_authorized='APR',authorized_date='${moment().format(
                        "YYYY-MM-DD"
                      )}', authorized_by=${
                        req.userIdentity.algaeh_d_app_user_id
                      }\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                    }

                    //---------------

                    _mysql
                      .executeQueryWithTransaction({
                        query: qry,
                        printQuery: true,
                      })
                      .then((rejResult) => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejResult;
                          next();
                        });
                      })
                      .catch((error) => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (result.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  } else {
                    req.records = {
                      invalid_input: true,
                      message: "Please provide valid loan application id ",
                    };
                    _mysql.releaseConnection();
                    next();
                  }
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          } else {
            req.records = {
              invalid_user: true,
              message: "Please provide valid Auth level",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege",
      };
      next();
    }
  },
  //created by irfan: to
  addLoanReciept: (req, res, next) => {
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_f_employee_reciepts` (employee_id,reciepts_type,recievable_amount,\
            write_off_amount,loan_application_id,remarks,balance_amount,reciepts_mode,cheque_number,\
             created_date, created_by, updated_date, updated_by,hospital_id=?)\
            VALUE(?,?,?,?,?,?,?,?,?,  ?,?,?,?)",
        values: [
          input.employee_id,
          input.reciepts_type,
          input.recievable_amount,
          input.write_off_amount,
          input.loan_application_id,
          input.remarks,
          input.balance_amount,
          input.reciepts_mode,
          input.cheque_number,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          req.userIdentity.hospital_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        if (result.insertId > 0) {
          _mysql
            .executeQuery({
              query:
                "select hims_f_loan_application_id,pending_loan from\
              hims_f_loan_application where hims_f_loan_application_id=?",
              values: [input.loan_application_id],
              printQuery: true,
            })
            .then((pendingResult) => {
              const cur_pending_loan =
                parseFloat(pendingResult[0]["pending_loan"]) -
                parseFloat(input.recievable_amount) -
                parseFloat(input.write_off_amount);

              let close_loan = "";
              if (cur_pending_loan == parseFloat(0)) {
                close_loan = ",loan_closed='Y'";
              }

              if (cur_pending_loan === parseFloat(input.balance_amount)) {
                _mysql
                  .executeQueryWithTransaction({
                    query:
                      "update hims_f_loan_application set pending_loan=?" +
                      close_loan +
                      " where hims_f_loan_application_id=?",
                    values: [cur_pending_loan, input.loan_application_id],
                    printQuery: true,
                  })
                  .then((updateResult) => {
                    mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = updateResult;
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              } else {
                _mysql.rollBackTransaction(() => {
                  req.records = {
                    invalid_input: true,
                    message: "calculation incorrect",
                  };
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
          //roll back

          _mysql.rollBackTransaction(() => {
            req.records = {
              invalid_input: true,
              message: "Please provide valid input",
            };
            next();
          });
        }
      })
      .catch((error) => {
        _mysql.rollBackTransaction(() => {
          next(error);
        });
      });
  },

  //created by irfan:
  getEmployeeLoanReciept: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.query.employee_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_reciepts_id,ER.employee_id,reciepts_type,\
              recievable_amount,write_off_amount,loan_application_id,LA.loan_application_number,LA.application_reason,\
              final_settlement_id,remarks,balance_amount,reciepts_mode,cheque_number,posted,posted_by,posted_date,\
              L.loan_code,L.loan_description,E.employee_code,E.full_name as employee_name from hims_f_employee_reciepts ER inner join hims_f_loan_application LA on\
              ER.loan_application_id=LA.hims_f_loan_application_id inner join hims_d_loan L on\
              LA.loan_id=L.hims_d_loan_id inner join hims_d_employee E on ER.employee_id=E.hims_d_employee_id\
                where ER.employee_id=? order by hims_f_employee_reciepts_id desc",
          values: [req.query.employee_id],

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide employee id",
      };

      next();
      return;
    }
  },

  //created by irfan:
  getLoanLevels(req, res, next) {
    try {
      const userPrivilege = req.userIdentity.loan_authorize_privilege;

      if (userPrivilege != "N") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query: `SELECT authorization_plan FROM hims_d_hrms_options limit 1;\
            select leave_level1 from hims_d_authorization_setup where leave_level1=
              ${req.userIdentity.employee_id}  limit 1`,
          })
          .then((result) => {
            _mysql.releaseConnection();

            if (result.length > 0) {
              //----------------

              let auth_levels = [];

              if (result[0][0]["authorization_plan"] == "R") {
                switch (userPrivilege.toString()) {
                  case "1":
                    auth_levels.push({ name: "Level 1", value: 1 });
                    break;
                  case "2":
                    auth_levels.push(
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "3":
                    auth_levels.push(
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "4":
                    auth_levels.push(
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "5":
                    auth_levels.push(
                      { name: "Level 5", value: 5 },
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                }
              } else if (result[0][0]["authorization_plan"] == "A") {
                ///------------------------

                switch (userPrivilege.toString()) {
                  case "1":
                    if (result[1].length > 0) {
                      auth_levels.push({ name: "Level 1", value: 1 });
                    }

                    break;
                  case "2":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 2", value: 2 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 2", value: 2 });
                    }

                    break;
                  case "3":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 3", value: 3 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 3", value: 3 });
                    }

                    break;
                  case "4":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 4", value: 4 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 4", value: 4 });
                    }

                    break;
                  case "5":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 5", value: 5 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 5", value: 5 });
                    }

                    break;
                }
              }
              req.records = { auth_levels };
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "you dont have privilege",
              };

              next();
              return;
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            reject(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "you dont have privilege",
        };

        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },
};
//created by irfan: to get database field for authorization
function getLoanAuthFields(auth_level) {
  return new Promise((resolve, reject) => {
    let authFields;
    switch (auth_level.toString()) {
      case "1":
        authFields = [
          "authorized1=?",
          "authorized1_by=?",
          "authorized1_date=?",
        ];
        break;

      case "2":
        authFields = [
          "authorized2=?",
          "authorized2_by=?",
          "authorized2_date=?",
        ];
        break;

      case "3":
        authFields = [
          "authorized3=?",
          "authorized3_by=?",
          "authorized3_date=?",
        ];
        break;

      case "4":
        authFields = [
          "authorized4=?",
          "authorized4_by=?",
          "authorized4_date=?",
        ];
        break;
      case "5":
        authFields = [
          "authorized5=?",
          "authorized5_by=?",
          "authorized5_date=?",
        ];
        break;
      default:
    }

    resolve(authFields);
  });
}
