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
    debugLog("input:", input);
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

        connection.query(
          "select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
          to_date from hims_f_leave_application\
          where cancelled='N' and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
          ( date(?)>=date(from_date) and\
          date(?)<=date(to_date)) ) and employee_id=?",
          [
            input.from_date,
            input.from_date,
            input.to_date,
            input.to_date,
            input.employee_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }
            debugLog("result:", result);
            // DISCARDING LEAVE APPLICATION
            if (result.length > 0) {
              let clashing_dates = new LINQ(result)
                .Where(
                  w =>
                    w.to_date == input.from_date || w.from_date == input.to_date
                )
                .Select(s => {
                  return {
                    hims_f_leave_application_id: s.hims_f_leave_application_id,
                    employee_id: s.employee_id,
                    leave_application_code: s.leave_application_code,
                    from_leave_session: s.from_leave_session,
                    from_date: s.from_date,
                    to_leave_session: s.to_leave_session,

                    to_date: s.to_date
                  };
                })
                .ToArray();

              debugLog("clashing_dates:", clashing_dates);

              if (clashing_dates.length > 0) {
                let curr_from_session = input.from_leave_session;

                debugLog("result:", result);
                //fetch all previous to_leave_sessions

                let prev_to_leave_session_FH = new LINQ(clashing_dates)
                  .Where(w => w.to_leave_session == "FH")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                debugLog("prev_to_leave_session_FH:", prev_to_leave_session_FH);

                let prev_to_leave_session_FD = new LINQ(clashing_dates)
                  .Where(w => w.to_leave_session == "FD")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                debugLog("prev_to_leave_session_FD:", prev_to_leave_session_FD);

                let prev_to_leave_session_SH = new LINQ(clashing_dates)
                  .Where(w => w.to_leave_session == "SH")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                debugLog("prev_to_leave_session_SH:", prev_to_leave_session_SH);
                //rejection of to_leave_sessions

                if (
                  (prev_to_leave_session_FH == "FH" &&
                    curr_from_session == "FH") ||
                  (prev_to_leave_session_FD == "FD" &&
                    curr_from_session == "FH") ||
                  (prev_to_leave_session_SH == "SH" &&
                    curr_from_session == "FH") ||
                  ((prev_to_leave_session_FD == "FD" &&
                    curr_from_session == "SH") ||
                    (prev_to_leave_session_SH == "SH" &&
                      curr_from_session == "SH")) ||
                  ((prev_to_leave_session_FH == "FH" &&
                    curr_from_session == "FD") ||
                    (prev_to_leave_session_FD == "FD" &&
                      curr_from_session == "FD") ||
                    (prev_to_leave_session_SH == "SH" &&
                      curr_from_session == "FD"))
                ) {
                  debugLog("rejction_one:");
                }
                //-----------------------------------------------------------------------------------------------------

                let curr_to_session = input.to_leave_session;

                let prev_from_leave_session_FH = new LINQ(clashing_dates)
                  .Where(w => w.from_leave_session == "FH")
                  .Select(s => s.from_leave_session)
                  .FirstOrDefault();

                debugLog(
                  "prev_from_leave_session_FH:",
                  prev_from_leave_session_FH
                );

                let prev_from_leave_session_SH = new LINQ(clashing_dates)
                  .Where(w => w.from_leave_session == "SH")
                  .Select(s => s.from_leave_session)
                  .FirstOrDefault();
                debugLog(
                  "prev_from_leave_session_SH:",
                  prev_from_leave_session_SH
                );

                let prev_from_leave_session_FD = new LINQ(clashing_dates)
                  .Where(w => w.from_leave_session == "FD")
                  .Select(s => s.from_leave_session)
                  .FirstOrDefault();
                debugLog(
                  "prev_from_leave_session_FD:",
                  prev_from_leave_session_FD
                );

                if (
                  (prev_from_leave_session_FH == "FH" &&
                    curr_to_session == "FD") ||
                  (prev_from_leave_session_SH == "SH" &&
                    curr_to_session == "FD") ||
                  (prev_from_leave_session_FD == "FD" &&
                    curr_to_session == "FD") ||
                  (prev_from_leave_session_FD == "FD" &&
                    curr_to_session == "FH") ||
                  (prev_from_leave_session_FH == "FH" &&
                    curr_to_session == "FH") ||
                  (prev_from_leave_session_FH == "FH" &&
                    curr_to_session == "SH") ||
                  (prev_from_leave_session_FD == "FD" &&
                    curr_to_session == "SH") ||
                  (prev_from_leave_session_SH == "SH" &&
                    curr_to_session == "SH")
                ) {
                  debugLog("rejction two:");
                }
              } else {
                debugLog("Application DISCARDED");
              }
            } else {
              debugLog("Accept leave application here  with Num gen");
            }

            // new Promise((resolve, reject) => {
            //   try {
            //     runningNumberGen({
            //       db: connection,
            //       module_desc: ["EMPLOYEE_LEAVE"],
            //       onFailure: error => {
            //         reject(error);
            //       },
            //       onSuccess: result => {
            //         resolve(result);
            //       }
            //     });
            //   } catch (e) {
            //     reject(e);
            //   }
            // }).then(numGenLeave => {
            //   connection.query(
            //     "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
            //   from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days, created_date, created_by, updated_date, updated_by)\
            //   VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            //     [
            //       numGenLeave[0]["completeNumber"],
            //       input.employee_id,
            //       new Date(),
            //       input.sub_department_id,
            //       input.leave_id,
            //       input.leave_type,
            //       input.from_date,
            //       input.to_date,
            //       input.from_leave_session,
            //       input.to_leave_session,
            //       input.leave_applied_from,
            //       input.total_applied_days,
            //       new Date(),
            //       input.created_by,
            //       new Date(),
            //       input.updated_by
            //     ],
            //     (error, result) => {
            //       if (error) {
            //         connection.rollback(() => {
            //           releaseDBConnection(db, connection);
            //           next(error);
            //         });
            //       }
            //       if (result.affectedRows > 0) {
            //         connection.commit(error => {
            //           if (error) {
            //             connection.rollback(() => {
            //               releaseDBConnection(db, connection);
            //               next(error);
            //             });
            //           }
            //           releaseDBConnection(db, connection);
            //           req.records = result;
            //           next();
            //         });
            //       } else {
            //         connection.rollback(() => {
            //           releaseDBConnection(db, connection);
            //           next(error);
            //         });
            //       }
            //     }
            //   );
            // });
          }
        );
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

//only DATE validation
// select hims_f_leave_application_id,employee_id,leave_application_code,from_date,to_date from hims_f_leave_application
// where cancelled='N' and (('2018-12-01'>=from_date and '2018-12-01'<=to_date) or ('2018-12-04'>=from_date and
// '2018-12-04'<=to_date) ) and employee_id=94
module.exports = {
  getEmployeeLeaveData,
  applyEmployeeLeave,
  getEmployeeLeaveHistory
};
