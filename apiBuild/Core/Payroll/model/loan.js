"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import moment from "moment";

//created by irfan:
var addLoanApplication = function addLoanApplication(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);

    db.getConnection(function (error, connection) {
      if (error) {
        next(error);
      }

      connection.beginTransaction(function (error) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }

        new Promise(function (resolve, reject) {
          try {
            (0, _utils.runningNumberGen)({
              db: connection,
              module_desc: ["EMPLOYEE_LOAN"],
              onFailure: function onFailure(error) {
                reject(error);
              },
              onSuccess: function onSuccess(result) {
                resolve(result);
              }
            });
          } catch (e) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              reject(e);
            });
          }
        }).then(function (numGenLoan) {
          connection.query("INSERT INTO `hims_f_loan_application` (loan_application_number,employee_id,loan_id,\
              application_reason,loan_application_date,loan_amount,start_month,start_year,loan_tenure,\
              installment_amount, pending_loan,created_date, created_by, updated_date, updated_by)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numGenLoan[0]["completeNumber"], input.employee_id, input.loan_id, input.application_reason, new Date(), input.loan_amount, input.start_month, input.start_year, input.loan_tenure, input.installment_amount, input.loan_amount, new Date(), input.created_by, new Date(), input.updated_by], function (error, results) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _logging.debugLog)("inside loan application");
            if (results.affectedRows > 0) {
              connection.commit(function (error) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }

                (0, _logging.debugLog)("commit");
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = results;
                next();
              });
            } else {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
          });
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:

//import { LINQ } from "node-linq";

var getLoanApplication = function getLoanApplication(req, res, next) {
  // let selectWhere = {
  //   hims_f_loan_application_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    // let where = whereCondition(extend(selectWhere, req.query));

    var employee = "";
    var range = "";

    if (req.query.employee_id != "" && req.query.employee_id != null && req.query.employee_id != "null") {
      employee = " and employee_id=" + req.query.employee_id + " ";
    }

    if (req.query.from_date != "null" && req.query.from_date != "" && req.query.from_date != null && req.query.to_date != "null" && req.query.to_date != "" && req.query.to_date != null) {
      range = " and date(loan_application_date)\nbetween date('" + req.query.from_date + "') and date('" + req.query.to_date + "') ";
    }

    var auth_level = "";
    if (req.query.auth_level == "L1") {
      auth_level = " and authorized1='P' ";
    } else if (req.query.auth_level == "L2") {
      auth_level = " and authorized1='A' and authorized2='P' ";
    }
    (0, _logging.debugLog)("level:", auth_level);
    db.getConnection(function (error, connection) {
      connection.query("select hims_f_loan_application_id,loan_application_number,employee_id,loan_id,L.loan_code,L.loan_description,\
        L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
        loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
        start_month,start_year,loan_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
        authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
        hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
         and E.record_status='A' where L.record_status='A' " + employee + "" + range + "" + auth_level, function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }

        (0, _logging.debugLog)("user iden:", req.userIdentity);
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var getLoanLevels = function getLoanLevels(req, res, next) {
  try {
    var userPrivilege = req.userIdentity.loan_authorize_privilege;

    var auth_levels = [];
    switch (userPrivilege) {
      case "AL1":
        auth_levels.push({ name: "Level 1", value: 1 });
        break;
      case "AL2":
        auth_levels.push({ name: "Level 2", value: 2 }, { name: "Level 1", value: 1 });
        break;
    }

    (0, _logging.debugLog)("auth_levels:", auth_levels);
    (0, _logging.debugLog)("user iden:", req.userIdentity);
    req.records = { auth_levels: auth_levels };
    next();
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var authorizeLoan = function authorizeLoan(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    var input = (0, _extend2.default)({}, req.body);

    if (input.auth_level != "L1" && input.auth_level != "L2") {
      (0, _logging.debugLog)("L1 and L2 not defind");
      req.records = { invalid_input: true };
      next();
    } else if (input.auth_level == "L1") {
      db.getConnection(function (error, connection) {
        connection.beginTransaction(function (error) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.query("UPDATE hims_f_loan_application SET authorized1_by=?,authorized1_date=?,\
          authorized1=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?", [input.updated_by, new Date(), input.authorized, input.approved_amount, input.start_year, input.start_month, input.installment_amount, input.loan_tenure, new Date(), input.updated_by, input.hims_f_loan_application_id], function (error, result) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _logging.debugLog)("L1 result:", result);
            if (result.affectedRows > 0 && input.authorized == "R") {
              connection.query("update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=?", [input.hims_f_loan_application_id], function (error, rejResult) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }

                connection.commit(function (error) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _utils.releaseDBConnection)(db, connection);
                  req.records = rejResult;
                  (0, _logging.debugLog)("L1 rejResult:", rejResult);
                  next();
                });
              });
            } else if (result.affectedRows > 0) {
              connection.commit(function (error) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = result;
                next();
              });
            } else {
              req.records = { invalid_input: true };
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
          });
        });
      });
    } else if (input.auth_level == "L2") {
      db.getConnection(function (error, connection) {
        connection.beginTransaction(function (error) {
          if (error) {
            connection.rollback(function () {
              (0, _utils.releaseDBConnection)(db, connection);
              next(error);
            });
          }
          connection.query("UPDATE hims_f_loan_application SET authorized2_by=?,authorized2_date=?,\
            authorized2=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?", [input.updated_by, new Date(), input.authorized, input.approved_amount, input.start_year, input.start_month, input.installment_amount, input.loan_tenure, new Date(), input.updated_by, input.hims_f_loan_application_id], function (error, result) {
            if (error) {
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
            (0, _logging.debugLog)("L2 result:", result);
            if (result.affectedRows > 0 && (input.authorized == "R" || input.authorized == "A")) {
              var qry = "";

              if (input.authorized == "R") {
                qry = "update hims_f_loan_application set loan_authorized='REJ'                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=" + input.hims_f_loan_application_id;
              } else if (input.authorized == "A") {
                qry = "update hims_f_loan_application set loan_authorized='APR'                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=" + input.hims_f_loan_application_id;
              }
              connection.query(qry, function (error, rejResult) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }

                connection.commit(function (error) {
                  if (error) {
                    connection.rollback(function () {
                      (0, _utils.releaseDBConnection)(db, connection);
                      next(error);
                    });
                  }
                  (0, _utils.releaseDBConnection)(db, connection);
                  req.records = rejResult;
                  next();
                });
              });
            } else if (result.affectedRows > 0) {
              connection.commit(function (error) {
                if (error) {
                  connection.rollback(function () {
                    (0, _utils.releaseDBConnection)(db, connection);
                    next(error);
                  });
                }
                (0, _utils.releaseDBConnection)(db, connection);
                req.records = result;
                next();
              });
            } else {
              req.records = { invalid_input: true };
              connection.rollback(function () {
                (0, _utils.releaseDBConnection)(db, connection);
                next(error);
              });
            }
          });
        });
      });
    } else {
      (0, _logging.debugLog)("top else");
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addLoanApplication: addLoanApplication,
  getLoanApplication: getLoanApplication,
  getLoanLevels: getLoanLevels,
  authorizeLoan: authorizeLoan
};
//# sourceMappingURL=loan.js.map