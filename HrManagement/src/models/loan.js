import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import extend from "extend";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";
import { getMaxAuth } from "../models/leave";
module.exports = {
  //created by irfan:
  addLoanApplication: (req, res, next) => {
    const utilities = new algaehUtilities();
    try {
      const _mysql = new algaehMysql();
      let input = req.body;
      mysql
        .executeQuery({
          query:
            "select hims_d_employee_id,date_of_joining,exit_date ,employee_status from hims_d_employee\
              where record_status='A' and  hims_d_employee_id=?",

          values: [input.employee_id],

          printQuery: true
        })
        .then(emp => {
          if (emp.length > 0) {
            let today = moment(new Date()).format("YYYY-MM-DD");

            if (emp[0].employee_status != "A") {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan ,your status is inactive"
              };
              next();
              return;
            } else if (
              emp[0].date_of_joining > today ||
              emp[0].exit_date != null
            ) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "Cant apply for loan before joining date"
              };
              next();
              return;
            } else {
              _mysql
                .generateRunningNumber({
                  modules: ["EMPLOYEE_LOAN"]
                })
                .then(numGenLeave => {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO `hims_f_loan_application` (loan_application_number,employee_id,loan_id,\
                application_reason,loan_application_date,loan_amount,start_month,start_year,loan_tenure,\
                installment_amount, pending_loan,created_date, created_by, updated_date, updated_by)\
                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                      values: [
                        numGenLeave[0],

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
                        req.userIdentity.algaeh_d_app_user_id
                      ],

                      printQuery: true
                    })
                    .then(result => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = result;
                        next();
                      });
                    })
                    .catch(e => {
                      utilities.logger().log("e: ", e);
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
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Employee doesn't exist"
            };
            next();
            return;
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
            input.hims_f_loan_application_id
          ],

          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
            };
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
        message: "please provide valid input"
      };

      next();
      return;
    }
  },

  //created by irfan: to show loan application to authorize
  getLoanApplication: (req, res, next) => {
    let employee = "";
    let range = "";

    if (
      req.query.employee_id != "" &&
      req.query.employee_id != null &&
      req.query.employee_id != "null"
    ) {
      employee = ` and employee_id=${req.query.employee_id} `;
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
    if (req.query.auth_level == "AL1") {
      auth_level = " and authorized1='P' ";
    } else if (req.query.auth_level == "AL2") {
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

    if (req.userIdentity.leave_authorize_privilege != "N") {
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
            loan_closed,

          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
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
        message: "you dont have admin privilege "
      };

      next();
      return;
    }
  },
  //created by irfan:
  getLoanLevels(req, res, next) {
    try {
      let userPrivilege = req.userIdentity.loan_authorize_privilege;

      let auth_levels = [];
      switch (userPrivilege) {
        case "AL1":
          auth_levels.push({ name: "Level 1", value: 1 });
          break;
        case "AL2":
          auth_levels.push(
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
        mysql: _mysql
      })
        .then(maxAuth => {
          if (
            req.userIdentity.loan_authorize_privilege != maxAuth.MaxLoan ||
            input.auth_level != maxAuth.MaxLoan
          ) {
          } else if (
            req.userIdentity.loan_authorize_privilege == maxAuth.MaxLoan &&
            input.auth_level == maxAuth.MaxLoan
          ) {
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege"
      };
      next();
    }
  }
};
