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

//created by irfan:
let addLoanApplication = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        new Promise((resolve, reject) => {
          try {
            runningNumberGen({
              db: connection,
              module_desc: ["EMPLOYEE_LOAN"],
              onFailure: error => {
                reject(error);
              },
              onSuccess: result => {
                resolve(result);
              }
            });
          } catch (e) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              reject(e);
            });
          }
        }).then(numGenLoan => {
          connection.query(
            "INSERT INTO `hims_f_loan_application` (loan_application_number,employee_id,loan_id,\
              application_reason,loan_application_date,loan_amount,start_month,start_year,loan_tenure,\
              installment_amount, created_date, created_by, updated_date, updated_by)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              numGenLoan[0]["completeNumber"],
              input.employee_id,
              input.loan_id,
              input.application_reason,
              new Date(),
              input.loan_amount,
              input.start_month,
              input.start_year,
              input.loan_tenure,
              input.installment_amount,
              new Date(),
              input.created_by,
              new Date(),
              input.updated_by
            ],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              debugLog("inside loan application");
              if (results.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  debugLog("commit");
                  releaseDBConnection(db, connection);
                  req.records = results;
                  next();
                });
              } else {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
            }
          );
        });
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getLoanApplication = (req, res, next) => {
  // let selectWhere = {
  //   hims_f_loan_application_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let where = whereCondition(extend(selectWhere, req.query));

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
    if (req.query.auth_level == "L1") {
      auth_level = " and authorized1='P' ";
    } else if (req.query.auth_level == "L2") {
      auth_level = " and authorized1='A' and authorized2='P' ";
    }
    debugLog("level:", auth_level);
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_loan_application_id,loan_application_number,employee_id,loan_id,L.loan_code,L.loan_description,\
        L.loan_account,L.loan_limit_type,L.loan_maximum_amount,LA.application_reason,\
        loan_application_date,loan_authorized,authorized_date,authorized_by,loan_closed,loan_amount,approved_amount,\
        start_month,start_year,loan_tenure,installment_amount,pending_loan,authorized1_by,authorized1_date,\
        authorized1,authorized2_by,authorized2_date,authorized2 ,E.full_name as employee_name ,E.employee_code from hims_f_loan_application LA  inner join \
        hims_d_loan L on LA.loan_id=L.hims_d_loan_id  inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id\
         and E.record_status='A' where L.record_status='A' " +
          employee +
          "" +
          range +
          "" +
          auth_level,

        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          debugLog("user iden:", req.userIdentity);
          req.records = result;
          next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getLoanLevels = (req, res, next) => {
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

    debugLog("auth_levels:", auth_levels);
    debugLog("user iden:", req.userIdentity);
    req.records = { auth_levels };
    next();
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let authorizeLoan = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (input.auth_level != "L1" && input.auth_level != "L2") {
      debugLog("L1 and L2 not defind");
      req.records = { invalid_input: true };
      next();
    } else if (input.auth_level == "L1") {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "UPDATE hims_f_loan_application SET authorized1_by=?,authorized1_date=?,\
          authorized1=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",

            [
              input.updated_by,
              new Date(),
              input.authorized,
              input.approved_amount,
              input.start_year,
              input.start_month,
              input.installment_amount,
              input.loan_tenure,
              new Date(),
              input.updated_by,
              input.hims_f_loan_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              debugLog("L1 result:", result);
              if (result.affectedRows > 0 && input.authorized == "R") {
                connection.query(
                  "update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=?",
                  [input.hims_f_loan_application_id],
                  (error, rejResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }

                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = rejResult;
                      debugLog("L1 rejResult:", rejResult);
                      next();
                    });
                  }
                );
              } else if (result.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              } else {
                req.records = { invalid_input: true };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
            }
          );
        });
      });
    } else if (input.auth_level == "L2") {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }
          connection.query(
            "UPDATE hims_f_loan_application SET authorized2_by=?,authorized2_date=?,\
            authorized2=?,approved_amount=?,start_year=?,start_month=?,installment_amount=?,\
          loan_tenure=?, updated_date=?, updated_by=?  WHERE hims_f_loan_application_id=?",

            [
              input.updated_by,
              new Date(),
              input.authorized,
              input.approved_amount,
              input.start_year,
              input.start_month,
              input.installment_amount,
              input.loan_tenure,
              new Date(),
              input.updated_by,
              input.hims_f_loan_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              debugLog("L2 result:", result);
              if (
                result.affectedRows > 0 &&
                (input.authorized == "R" || input.authorized == "A")
              ) {
                let qry = "";

                if (input.authorized == "R") {
                  qry = `update hims_f_loan_application set loan_authorized='REJ'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                } else if (input.authorized == "A") {
                  qry = `update hims_f_loan_application set loan_authorized='APR'\
                  where record_status='A' and loan_authorized='PEN' and hims_f_loan_application_id=${
                    input.hims_f_loan_application_id
                  }`;
                }
                connection.query(qry, (error, rejResult) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  connection.commit(error => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    releaseDBConnection(db, connection);
                    req.records = rejResult;
                    next();
                  });
                });
              } else if (result.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  releaseDBConnection(db, connection);
                  req.records = result;
                  next();
                });
              } else {
                req.records = { invalid_input: true };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
            }
          );
        });
      });
    } else {
      debugLog("top else");
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addLoanApplication,
  getLoanApplication,
  getLoanLevels,
  authorizeLoan
};
