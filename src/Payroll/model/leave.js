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
let getEmployeeLeaveData = (req, res, next) => {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    //let where = whereCondition(extend(selectWhere, req.query));
    const year = moment().format("YYYY");

    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
        L.leave_description,total_eligible, availed_till_date, close_balance\
        from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on  \
        ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.year=?",
        [req.query.employee_id, year],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }
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
let applyEmployeeLeave = (req, res, next) => {
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
              module_desc: ["EMPLOYEE_LEAVE"],
              onFailure: error => {
                reject(error);
              },
              onSuccess: result => {
                resolve(result);
              }
            });
          } catch (e) {
            reject(e);
          }
        }).then(numGenLeave => {
          connection.query(
            "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
              from_date,to_date,from_leave_session,to_leave_session,total_applied_days, created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              numGenLeave[0]["completeNumber"],
              input.employee_id,
              new Date(),
              input.sub_department_id,
              input.leave_id,
              input.leave_type,
              input.from_date,
              input.to_date,
              input.from_leave_session,
              input.to_leave_session,
              input.total_applied_days,
              new Date(),
              input.created_by,
              new Date(),
              input.updated_by
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              if (result.affectedRows > 0) {
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
let getEmployeeLeaveHistory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (req.query.employee_id != "null" && req.query.employee_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_leave_application_id,leave_application_code,employee_id,application_date,\
        leave_id,from_date,to_date,from_leave_session,to_leave_session,\
        leave_applied_from,total_applied_days,total_approved_days,status,authorized,remarks,L.leave_code,\
        L.leave_description from hims_f_leave_application LA inner join hims_d_leave L on\
         LA.leave_id=L.hims_d_leave_id and L.record_status='A'\
         where LA.record_status='A' and LA.employee_id=? order by hims_f_leave_application_id desc",
          [req.query.employee_id],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            req.records = result;
            next();
          }
        );
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getEmployeeLeaveData,
  applyEmployeeLeave,
  getEmployeeLeaveHistory
};
