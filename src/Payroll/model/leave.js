"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject,
  getMaxAuth
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";
import _ from "lodash";
import { debugLog } from "../../utils/logging";
import moment from "moment";
import Promise from "bluebird";
import mysql from "mysql";
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






    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // let year = "";

    // let selfservice = "";
    // if (req.query.selfservice == "Y") {
    //   selfservice = ` and  (LD.employee_type='${
    //     req.query.employee_type
    //   }' and  (LD.gender='${req.query.gender}' or LD.gender='BOTH' ))`;
    // }

    if (
  
     
      req.query.year > 0 &&
      req.query.employee_id > 0
    ) {
      // select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
      // L.leave_description,total_eligible, availed_till_date, close_balance,\
      // E.employee_code ,E.full_name as employee_name\
      // from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id \
      // inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
      // and L.record_status='A' where ML.year=? and ML.employee_id=? \
      //  order by hims_f_employee_monthly_leave_id desc;
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
          L.leave_description,total_eligible, availed_till_date, close_balance,\
          E.employee_code ,E.full_name as employee_name,\
          LD.hims_d_leave_detail_id,LD.employee_type, LD.eligible_days\
          from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id       \
          inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id\
          inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
          and L.record_status='A' where ML.year=? and ML.employee_id=?  and  LD.employee_type=E.employee_type and  (LD.gender=E.sex or LD.gender='BOTH' )\
            order by hims_f_employee_monthly_leave_id desc;",
          [
            req.query.year,
            req.query.employee_id
         
          ],
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
      req.records = {
        invalid_input: true,
        message:
          "Please Provide  Valid (year,employee_id,gender,employee_type) "
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getYearlyLeaveData = (req, res, next) => {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    // let year = "";

    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined
    ) {
      //year = moment(req.query.year).format("YYYY");
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_yearly_leave_id,employee_id,year ,\
          E.employee_code,  E.full_name as employee_name,SD.sub_department_code,\
          SD.sub_department_name from  hims_f_employee_yearly_leave EYL  inner join hims_d_employee E on\
          EYL.employee_id=E.hims_d_employee_id  left join hims_d_sub_department SD\
          on E.sub_department_id=SD.hims_d_sub_department_id  where EYL.year=? order by hims_f_employee_yearly_leave_id desc",
          req.query.year,
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
      req.records = {
        invalid_input: true,
        message: "please provide year"
      };

      next();
      return;
    }
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

    const m_fromDate = moment(input.from_date).format("YYYY-MM-DD");
    debugLog("m_fromDate:", m_fromDate);
    const m_toDate = moment(input.to_date).format("YYYY-MM-DD");
    debugLog("m_toDate:", m_toDate);

    const from_year = moment(input.from_date).format("YYYY");
    const to_year = moment(input.to_date).format("YYYY");

    debugLog("from_year:", from_year);
    debugLog("to_year:", to_year);

    if (
      m_fromDate > m_toDate ||
      (m_fromDate == m_toDate &&
        ((input.from_leave_session == "SH" && input.to_leave_session == "FH") ||
          (input.from_leave_session == "SH" && input.to_leave_session == "FD")))
    ) {
      debugLog("ffffffffffffffff:");

      req.records = {
        leave_already_exist: true,
        message: "select proper sessions"
      };

      next();
      return;
    } else if (from_year == to_year) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
        availed_till_date, close_balance,\
        L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
        hims_f_employee_monthly_leave ML inner join\
        hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)",
          [input.employee_id, input.leave_id, [from_year, to_year]],
          (error, result) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }

            debugLog("result:", result);
            if (result.length > 0) {
              let m_total_eligible = result[0]["total_eligible"];
              let m_availed_till_date = result[0]["availed_till_date"];
              let m_close_balance = result[0]["close_balance"];

              debugLog("m_total_eligible:", m_total_eligible);
              debugLog("m_availed_till_date:", m_availed_till_date);
              debugLog("m_close_balance:", m_close_balance);

              if (m_close_balance >= input.total_applied_days) {
                //folow start here

                connection.query(
                  "select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
                to_date from hims_f_leave_application\
                where (`status`='APR' or `status`='PEN') and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
                ( date(?)>=date(from_date) and   date(?)<=date(to_date))   or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or \
                (date(to_date)>=date(?) and date(to_date)<= date(?) )\
                )and employee_id=?",
                  [
                    input.from_date,
                    input.from_date,
                    input.to_date,
                    input.to_date,
                    input.from_date,
                    input.to_date,
                    input.from_date,
                    input.to_date,
                    input.employee_id
                  ],
                  (error, result) => {
                    if (error) {
                      releaseDBConnection(db, connection);
                      next(error);
                    }
                    debugLog("result:", result);
                    // DISCARDING LEAVE APPLICATION
                    if (result.length > 0) {
                      //clashing both from_leave_session and  to_leave_session
                      const clashing_sessions = new LINQ(result)
                        .Where(
                          w =>
                            w.to_date == m_fromDate || w.from_date == m_toDate
                        )
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_application_code: s.leave_application_code,
                            from_leave_session: s.from_leave_session,
                            from_date: s.from_date,
                            to_leave_session: s.to_leave_session,
                            to_date: s.to_date
                          };
                        })
                        .ToArray();

                      debugLog("clashing_sessions:", clashing_sessions);
                      //clashing only  new from_leave_session  with existing  to_leave_session
                      const clashing_to_leave_session = new LINQ(result)
                        .Where(w => w.to_date == m_fromDate)
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_application_code: s.leave_application_code,
                            from_leave_session: s.from_leave_session,
                            from_date: s.from_date,
                            to_leave_session: s.to_leave_session,
                            to_date: s.to_date
                          };
                        })
                        .ToArray();

                      debugLog(
                        "clashing_to_leave_session:",
                        clashing_to_leave_session
                      );

                      //clashing only  new to_leave_session with existing  from_leave_session
                      const clashing_from_leave_session = new LINQ(result)
                        .Where(w => w.from_date == m_toDate)
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_application_code: s.leave_application_code,
                            from_leave_session: s.from_leave_session,
                            from_date: s.from_date,
                            to_leave_session: s.to_leave_session,
                            to_date: s.to_date
                          };
                        })
                        .ToArray();

                      debugLog(
                        "clashing_from_leave_session:",
                        clashing_from_leave_session
                      );
                      //----------------------------------

                      let not_clashing_sessions = _.xorBy(
                        result,
                        clashing_sessions,
                        "hims_f_leave_application_id"
                      );

                      debugLog("not_clashing_sessions:", not_clashing_sessions);
                      new Promise((resolve, reject) => {
                        try {
                          let curr_from_session = input.from_leave_session;
                          let curr_to_session = input.to_leave_session;
                          if (not_clashing_sessions.length > 0) {
                            //
                            debugLog("inside not classing loop ");
                            releaseDBConnection(db, connection);
                            req.records = {
                              leave_already_exist: true,
                              location:
                                "inside not_clashing_sessions: date clash not session",
                              message:
                                " leave is already there between this dates " +
                                not_clashing_sessions[0]["from_date"] +
                                " AND " +
                                not_clashing_sessions[0]["to_date"]
                            };
                            next();
                            return;
                          } else if (
                            clashing_from_leave_session.length > 0 ||
                            clashing_to_leave_session.length > 0
                          ) {
                            debugLog("inside clashing_sessions BOTH  ");

                            new Promise((resolve, reject) => {
                              try {
                                if (clashing_from_leave_session.length > 0) {
                                  debugLog(
                                    "inside clashing_from_leave_session:"
                                  );
                                  for (
                                    let i = 0;
                                    i < clashing_from_leave_session.length;
                                    i++
                                  ) {
                                    let prev_from_leave_session_FH = new LINQ([
                                      clashing_from_leave_session[i]
                                    ])
                                      .Where(w => w.from_leave_session == "FH")
                                      .Select(s => s.from_leave_session)
                                      .FirstOrDefault();

                                    debugLog(
                                      "prev_from_leave_session_FH:",
                                      prev_from_leave_session_FH
                                    );

                                    let prev_from_leave_session_SH = new LINQ([
                                      clashing_from_leave_session[i]
                                    ])
                                      .Where(w => w.from_leave_session == "SH")
                                      .Select(s => s.from_leave_session)
                                      .FirstOrDefault();
                                    debugLog(
                                      "prev_from_leave_session_SH:",
                                      prev_from_leave_session_SH
                                    );

                                    let prev_from_leave_session_FD = new LINQ([
                                      clashing_from_leave_session[i]
                                    ])
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
                                        curr_to_session == "SH" &&
                                        curr_from_session == "FH") ||
                                      (prev_from_leave_session_FD == "FD" &&
                                        curr_to_session == "SH") ||
                                      (prev_from_leave_session_SH == "SH" &&
                                        curr_to_session == "SH")
                                    ) {
                                      debugLog("rejction two:");
                                      //clashing only  new to_leave_session with existing  from_leave_session
                                      releaseDBConnection(db, connection);
                                      req.records = {
                                        leave_already_exist: true,
                                        location:
                                          "inside clashing_from_leave_session: session error: comparing prev_from_leave_session with  current:to_leave_session ",
                                        message:
                                          "leave is already there between this dates " +
                                          clashing_from_leave_session[i][
                                            "from_date"
                                          ] +
                                          " AND " +
                                          clashing_from_leave_session[i][
                                            "to_date"
                                          ]
                                      };
                                      next();
                                      return;
                                    }

                                    if (
                                      i ==
                                      clashing_from_leave_session.length - 1
                                    ) {
                                      debugLog(
                                        "clashing_from_leave_session last iteration:"
                                      );
                                      resolve({});
                                    }
                                  }
                                } else {
                                  resolve({});
                                }
                              } catch (e) {
                                reject(e);
                              }
                            }).then(fromSessionREsult => {
                              if (clashing_to_leave_session.length > 0) {
                                debugLog("inside clashing_to_leave_session:");

                                for (
                                  let i = 0;
                                  i < clashing_to_leave_session.length;
                                  i++
                                ) {
                                  //fetch all previous to_leave_sessions

                                  let prev_to_leave_session_FH = new LINQ([
                                    clashing_to_leave_session[i]
                                  ])
                                    .Where(w => w.to_leave_session == "FH")
                                    .Select(s => s.to_leave_session)
                                    .FirstOrDefault();

                                  debugLog(
                                    "prev_to_leave_session_FH:",
                                    prev_to_leave_session_FH
                                  );

                                  let prev_to_leave_session_FD = new LINQ([
                                    clashing_to_leave_session[i]
                                  ])
                                    .Where(w => w.to_leave_session == "FD")
                                    .Select(s => s.to_leave_session)
                                    .FirstOrDefault();

                                  debugLog(
                                    "prev_to_leave_session_FD:",
                                    prev_to_leave_session_FD
                                  );

                                  let prev_to_leave_session_SH = new LINQ([
                                    clashing_to_leave_session[i]
                                  ])
                                    .Where(w => w.to_leave_session == "SH")
                                    .Select(s => s.to_leave_session)
                                    .FirstOrDefault();

                                  debugLog(
                                    "prev_to_leave_session_SH:",
                                    prev_to_leave_session_SH
                                  );

                                  let prev2_from_leave_session_FH = new LINQ([
                                    clashing_to_leave_session[i]
                                  ])
                                    .Where(w => w.from_leave_session == "FH")
                                    .Select(s => s.from_leave_session)
                                    .FirstOrDefault();

                                  debugLog(
                                    "2nd time prev_to_leave_session_SH:",
                                    prev2_from_leave_session_FH
                                  );
                                  //rejection of to_leave_sessions

                                  if (
                                    (prev_to_leave_session_FH == "FH" &&
                                      curr_from_session == "FH") ||
                                    (prev_to_leave_session_FD == "FD" &&
                                      curr_from_session == "FH") ||
                                    (prev2_from_leave_session_FH == "FH" &&
                                      prev_to_leave_session_SH == "SH" &&
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
                                    //clashing only  new from_leave_session  with existing  to_leave_session
                                    releaseDBConnection(db, connection);
                                    req.records = {
                                      leave_already_exist: true,
                                      location:
                                        " inside clashing_to_leave_session:session error: comparing prev_to_leave_session with  current: from_leave_session ",
                                      message:
                                        "leave is already there between this dates " +
                                        clashing_to_leave_session[i][
                                          "from_date"
                                        ] +
                                        " AND " +
                                        clashing_to_leave_session[i]["to_date"]
                                    };
                                    next();
                                    return;
                                  }

                                  if (
                                    i ==
                                    clashing_to_leave_session.length - 1
                                  ) {
                                    debugLog(
                                      "clashing_to_leave_session last iteration:"
                                    );
                                    saveF(req, db, next, connection, input, 5);
                                  }
                                }
                              } else {
                                debugLog("else of clashing_to_leave_session");
                                saveF(req, db, next, connection, input, 6);
                              }
                            });
                          } else {
                            resolve({});
                          }
                        } catch (e) {
                          reject(e);
                        }
                      }).then(noClashResult => {
                        saveF(req, db, next, connection, input, 1);
                      });
                    } else {
                      debugLog("Accept leave application here  with Num gen");
                      saveF(req, db, next, connection, input, 2);
                    }
                  }
                );

                // req.records = result;
                // next();
              } else {
                req.records = {
                  leave_already_exist: true,
                  message: "leave application exceed total eligible leaves"
                };
                releaseDBConnection(db, connection);
                next();
                return;
              }
            } else {
              req.records = {
                leave_already_exist: true,
                message: "you cant apply for this leave type"
              };
              releaseDBConnection(db, connection);
              next();
              return;
            }
          }
        );
      });
    } else {
      req.records = {
        leave_already_exist: true,
        message: "cannot apply leave for next year "
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};
let saveF = (req, db, next, connection, input, msg) => {
  connection.beginTransaction(error => {
    if (error) {
      connection.rollback(() => {
        releaseDBConnection(db, connection);
        next(error);
      });
    }

    debugLog("inside saveF:", msg);
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
        connection.rollback(() => {
          releaseDBConnection(db, connection);
          reject(e);
        });
      }
    }).then(numGenLeave => {
      connection.query(
        "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
    from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days,remarks, created_date, created_by, updated_date, updated_by)\
    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
          input.leave_applied_from,
          input.total_applied_days,
          input.remarks,
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
          debugLog("inside leave application");
          if (results.affectedRows > 0) {
            debugLog("affectedRows");

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
};

//created by irfan:
let getEmployeeLeaveHistory = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let status = "";
    if (req.query.status == "H") {
      status = " and `status`<>'PEN'";
    }

    if (req.query.employee_id != "null" && req.query.employee_id != undefined) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_leave_application_id,leave_application_code,employee_id,application_date,\
        leave_id,from_date,to_date,from_leave_session,to_leave_session,\
        leave_applied_from,total_applied_days,total_approved_days,status,authorized3,authorized2,authorized1,remarks,L.leave_code,\
        L.leave_description from hims_f_leave_application LA inner join hims_d_leave L on\
         LA.leave_id=L.hims_d_leave_id and L.record_status='A'\
         where LA.record_status='A' and LA.employee_id=? " +
            status +
            " order by hims_f_leave_application_id desc",
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
//created by irfan:
let getLeaveBalance = (req, res, next) => {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    //let where = whereCondition(extend(selectWhere, req.query));
    const from_year = moment(input.from_date).format("YYYY");
    const to_year = moment(input.to_date).format("YYYY");

    debugLog("from_year:", from_year);
    debugLog("to_year:", to_year);
    if (from_year == to_year) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
        availed_till_date, close_balance,\
        L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
        hims_f_employee_monthly_leave ML inner join\
        hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)",
          [input.employee_id, input.leave_id, [from_year, to_year]],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }

            debugLog("result:", result);
            if (result.length > 0) {
              let m_total_eligible = result[0]["total_eligible"];
              let m_availed_till_date = result[0]["availed_till_date"];
              let m_close_balance = result[0]["close_balance"];

              debugLog("m_total_eligible:", m_total_eligible);
              debugLog("m_availed_till_date:", m_availed_till_date);
              debugLog("m_close_balance:", m_close_balance);

              if (m_close_balance >= input.total_applied_days) {
                //folow start here

                req.records = result;
                next();
              } else {
                req.records = {
                  leave_already_exist: true,
                  message: "leave application exceed total eligible leaves"
                };
                next();
                return;
              }
            } else {
              req.records = {
                leave_already_exist: true,
                message: "you cant apply for this leave type"
              };
              next();
              return;
            }
          }
        );
      });
    } else {
      req.records = {
        leave_already_exist: true,
        message: "cannot apply leave for next year "
      };
      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getLeaveLevels = (req, res, next) => {
  try {
    let userPrivilege = req.userIdentity.leave_authorize_privilege;

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
      case "AL3":
        auth_levels.push(
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
};

//only DATE validation
// select hims_f_leave_application_id,employee_id,leave_application_code,from_date,to_date from hims_f_leave_application
// where cancelled='N' and (('2018-12-01'>=from_date and '2018-12-01'<=to_date) or ('2018-12-04'>=from_date and
// '2018-12-04'<=to_date) ) and employee_id=94

//created by irfan:
let addLeaveMaster = (req, res, next) => {
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
        connection.query(
          "INSERT INTO `hims_d_leave` (leave_code,leave_description,leave_category,calculation_type,\
          include_weekoff,include_holiday,leave_mode,leave_accrual,leave_encash,leave_type,\
          encashment_percentage,leave_carry_forward,carry_forward_percentage,\
          religion_required,religion_id,holiday_reimbursement,exit_permit_required,\
          proportionate_leave,document_mandatory,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.leave_code,
            input.leave_description,
            input.leave_category,
            input.calculation_type,
            input.include_weekoff,
            input.include_holiday,
            input.leave_mode,
            input.leave_accrual,
            input.leave_encash,
            input.leave_type,
            input.encashment_percentage,
            input.leave_carry_forward,
            input.carry_forward_percentage,
            input.religion_required,
            input.religion_id,
            input.holiday_reimbursement,
            input.exit_permit_required,
            input.proportionate_leave,
            input.document_mandatory,
            input.created_by,
            new Date(),
            input.updated_by,
            new Date()
          ],
          (error, leaveHeadResult) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (leaveHeadResult.insertId > 0) {
              new Promise((resolve, reject) => {
                try {
                  //==============
                  if (
                    input.leaveEncash != undefined &&
                    input.leaveEncash.length > 0
                  ) {
                    const insurtColumns = [
                      "earnings_id",
                      "percent",
                      "created_by",
                      "updated_by"
                    ];

                    connection.query(
                      "INSERT INTO hims_d_leave_encashment (" +
                        insurtColumns.join(",") +
                        ",`leave_header_id`,created_date,updated_date) VALUES ?",
                      [
                        jsonArrayToObject({
                          sampleInputObject: insurtColumns,
                          arrayObj: input.leaveEncash,
                          newFieldToInsert: [
                            leaveHeadResult.insertId,
                            new Date(),
                            new Date()
                          ],
                          req: req
                        })
                      ],
                      (error, encashResult) => {
                        if (error) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next(error);
                          });
                        }

                        if (encashResult.insertId > 0) {
                          resolve({ encashResult });
                        } else {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            req.records = {
                              invalid_data: true,
                              message: "please send correct data"
                            };
                            next();
                            return;
                          });
                        }
                      }
                    );
                  } else {
                    debugLog("else resole:1");
                    resolve({ leaveHeadResult });
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(leaveEncashRes => {
                new Promise((resolve, reject) => {
                  try {
                    if (
                      input.leaveRules != undefined &&
                      input.leaveRules.length > 0
                    ) {
                      const insurtColumnsRules = [
                        "calculation_type",
                        "earning_id",
                        "paytype",
                        "from_value",
                        "to_value",
                        "value_type",
                        "total_days"
                      ];

                      connection.query(
                        "INSERT INTO hims_d_leave_rule (" +
                          insurtColumnsRules.join(",") +
                          ",`leave_header_id`) VALUES ?",
                        [
                          jsonArrayToObject({
                            sampleInputObject: insurtColumnsRules,
                            arrayObj: input.leaveRules,
                            newFieldToInsert: [leaveHeadResult.insertId],
                            req: req
                          })
                        ],
                        (error, ruleResult) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }

                          if (ruleResult.insertId > 0) {
                            resolve({ ruleResult });
                          } else {
                            debugLog("CCCCCCCC");
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              req.records = {
                                invalid_data: true,
                                message: "please send correct data"
                              };
                              next();
                              return;
                            });
                          }
                        }
                      );
                    } else {
                      resolve({ leaveEncashRes });
                    }
                  } catch (e) {
                    reject(e);
                  }
                }).then(leaveRulesRes => {
                  new Promise((resolve, reject) => {
                    try {
                      if (
                        input.leaveDetails != undefined &&
                        input.leaveDetails.length > 0
                      ) {
                        const insurtColumnsdetails = [
                          "employee_type",
                          "gender",
                          "eligible_days",
                          "min_service_required",
                          "service_years",
                          "once_life_term",
                          "allow_probation",
                          "max_number_days",
                          "mandatory_utilize_days",
                          "created_by",
                          "updated_by"
                        ];

                        connection.query(
                          "INSERT INTO hims_d_leave_detail (" +
                            insurtColumnsdetails.join(",") +
                            ",`leave_header_id`,created_date,updated_date) VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumnsdetails,
                              arrayObj: input.leaveDetails,
                              newFieldToInsert: [
                                leaveHeadResult.insertId,
                                new Date(),
                                new Date()
                              ],
                              req: req
                            })
                          ],
                          (error, detailResult) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            if (detailResult.insertId > 0) {
                              resolve({ detailResult });
                            } else {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                req.records = {
                                  invalid_data: true,
                                  message: "please send correct data"
                                };
                                next();
                                return;
                              });
                            }
                          }
                        );
                      } else {
                        resolve({ leaveRulesRes });
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(finalResult => {
                    connection.commit(error => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      releaseDBConnection(db, connection);
                      req.records = finalResult;
                      next();
                    });
                  });
                });
              });
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                req.records = {
                  invalid_data: true,
                  message: "Please Send Correct Data"
                };
                next();
                return;
              });
            }
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let addAttendanceRegularization = (req, res, next) => {
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
              module_desc: ["ATTENDANCE_REGULARIZE"],
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
        }).then(numGenReg => {
          connection.query(
            "INSERT INTO `hims_f_attendance_regularize` (regularization_code,employee_id,attendance_date,\
             login_date,logout_date,\
              punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason,\
              created_by,created_date,updated_by,updated_date)\
        VALUE(?,?,date(?),date(?),date(?),?,?,?,?,?,?,?,?,?)",
            [
              numGenReg[0]["completeNumber"],

              input.employee_id,
              input.attendance_date,

              input.login_date,
              input.logout_date,
              input.punch_in_time,
              input.punch_out_time,
              input.regularize_in_time,
              input.regularize_out_time,
              input.regularization_reason,

              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ],
            (error, results) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (results.affectedRows > 0) {
                connection.commit(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

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
let getEmployeeAttendReg = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let dateRange = "";
    let employee = "";
    let requested = "";
    if (
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.from_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null &&
      req.query.to_date != "null"
    ) {
      dateRange = ` date(attendance_date)
      between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    if (req.query.requested != "" &&
    req.query.requested != null &&
    req.query.requested != "null"){
       requested = ` and requested=${req.query.requested}`
    }

    if (
      req.query.employee_id != "" &&
      req.query.employee_id != null &&
      req.query.employee_id != "null"
    ) {
      employee = ` employee_id=${req.query.employee_id} `;
    }

    if (dateRange == "" && employee == "") {
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };
      next();
      return;
    } else {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_attendance_regularize_id,regularization_code,employee_id,\
          E.employee_code,E.full_name as employee_name ,attendance_date,\
          regularize_status,login_date,logout_date,punch_in_time,punch_out_time,\
          regularize_in_time,regularize_out_time,regularization_reason , AR.created_date\
          from hims_f_attendance_regularize AR inner join hims_d_employee E  on\
           AR.employee_id=E.hims_d_employee_id and record_status='A' where" +
            employee +
            "" +
            requested +
            "" +
            dateRange +
            " order by\
          hims_f_attendance_regularize_id desc ",

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
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let processYearlyLeaveBACKUP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let year = "";

    debugLog("input:", req.query);

    let yearArray = [];
    let monthlyArray = [];

    let employee_id = "";

    if (req.query.employee_id > 0) {
      employee_id = ` and hims_d_employee_id=${req.query.employee_id}; `;
    }
    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined
    ) {
      year = req.query.year;

      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,hospital_id ,employee_type,sex\
            from hims_d_employee where employee_status <>'I' and  record_status='A' " +
            employee_id,

          (error, employees) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }

            debugLog("employees:", employees);
            // req.records = result;
            // next();
            if (employees.length > 0) {
              for (let i = 0; i < employees.length; i++) {
                new Promise((resolve, reject) => {
                  try {
                    connection.query(
                      " select L.hims_d_leave_id,L.leave_code,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
                    inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' \
                  where (LD.employee_type=?  and  (LD.gender=? or LD.gender='BOTH' )) ;",
                      [employees[i].employee_type, employees[i].sex],

                      (error, leaveRes) => {
                        if (error) {
                          releaseDBConnection(db, connection);
                          next(error);
                        }

                        debugLog("leaveRes:", leaveRes);
                        if (leaveRes.length > 0) {
                          const apllicable_leavs = new LINQ(leaveRes)
                            .Select(s => s.hims_d_leave_id)
                            .ToArray();

                          debugLog("apllicable_leavs:", apllicable_leavs);
                          let new_leave_ids = apllicable_leavs.filter(
                            (item, pos) => {
                              return apllicable_leavs.indexOf(item) == pos;
                            }
                          );

                          debugLog("new_leave_ids:", new_leave_ids);
                          new Promise((resolve, reject) => {
                            try {
                              // check if data already thier im year and monthly table
                              connection.query(
                                " select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
                                where record_status='A' and employee_id=? and `year`=? ; \
                                 select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                                hims_f_employee_monthly_leave where employee_id=? and `year`=?;",
                                [
                                  employees[i].hims_d_employee_id,
                                  year,
                                  employees[i].hims_d_employee_id,
                                  year
                                ],

                                (error, yearOrLeavExist) => {
                                  if (error) {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  }
                                  // if monthly table data exist

                                  if (yearOrLeavExist[1].length > 0) {
                                    const old_leave_ids = new LINQ(
                                      yearOrLeavExist[1]
                                    )
                                      .Select(s => s.leave_id)
                                      .ToArray();

                                    debugLog("old_leave_ids:", old_leave_ids);

                                    // remove existing leave ids from applicable leave ids
                                    let leaves_to_insert = new_leave_ids.filter(
                                      val => !old_leave_ids.includes(val)
                                    );
                                    debugLog(
                                      "leaves_to_insert:",
                                      leaves_to_insert
                                    );

                                    const _leaves = leaves_to_insert.map(
                                      item => {
                                        return _.chain(leaveRes)
                                          .find(o => {
                                            return o.hims_d_leave_id == item;
                                          })

                                          .omit(_.isNull)
                                          .value();
                                      }
                                    );
                                    debugLog("_leaves:", _leaves);
                                    monthlyArray.push(
                                      ...new LINQ(_leaves)
                                        .Where(w => w.hims_d_leave_id > 0)
                                        .Select(s => {
                                          return {
                                            employee_id:
                                              employees[i].hims_d_employee_id,
                                            year: year,
                                            leave_id: s.hims_d_leave_id,
                                            total_eligible: s.eligible_days,
                                            close_balance: s.eligible_days
                                          };
                                        })
                                        .ToArray()
                                    );
                                  } else {
                                    // if monthly table data not exist
                                    monthlyArray.push(
                                      ...new LINQ(leaveRes)
                                        .Where(w => w.hims_d_leave_id > 0)
                                        .Select(s => {
                                          return {
                                            employee_id:
                                              employees[i].hims_d_employee_id,
                                            year: year,
                                            leave_id: s.hims_d_leave_id,
                                            total_eligible: s.eligible_days,
                                            close_balance: s.eligible_days
                                          };
                                        })
                                        .ToArray()
                                    );
                                  }

                                  if (yearOrLeavExist[0].length < 1) {
                                    yearArray.push({
                                      employee_id:
                                        employees[i].hims_d_employee_id,
                                      year: year
                                    });
                                  }

                                  if (i == employees.length - 1) {
                                    //insert in two tables
                                    resolve(yearArray);
                                  }
                                }
                              );
                            } catch (e) {
                              reject(e);
                            }
                          }).then(insertyearlyMonthly => {
                            connection.beginTransaction(error => {
                              if (error) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }
                              new Promise((resolve, reject) => {
                                try {
                                  if (yearArray.length > 0) {
                                    const insurtColumns = [
                                      "employee_id",
                                      "year"
                                    ];

                                    connection.query(
                                      "INSERT INTO hims_f_employee_yearly_leave(" +
                                        insurtColumns.join(",") +
                                        ",created_date,updated_date,created_by,updated_by) VALUES ?",
                                      [
                                        jsonArrayToObject({
                                          sampleInputObject: insurtColumns,
                                          arrayObj: yearArray,
                                          newFieldToInsert: [
                                            new Date(),
                                            new Date(),
                                            req.userIdentity
                                              .algaeh_d_app_user_id,
                                            req.userIdentity
                                              .algaeh_d_app_user_id
                                          ]
                                        })
                                      ],
                                      (error, yearResult) => {
                                        if (error) {
                                          connection.rollback(() => {
                                            releaseDBConnection(db, connection);
                                            next(error);
                                          });
                                        }

                                        if (yearResult.affectedRows > 0) {
                                          resolve({ yearResult });
                                        } else {
                                          connection.rollback(() => {
                                            releaseDBConnection(db, connection);
                                            next(error);
                                          });
                                        }
                                      }
                                    );
                                  } else {
                                    resolve({});
                                  }
                                } catch (e) {
                                  reject(e);
                                }
                              }).then(resultofYearInsert => {
                                new Promise((resolve, reject) => {
                                  try {
                                    if (monthlyArray.length > 0) {
                                      //functionality plus commit

                                      const insurtColumns = [
                                        "employee_id",
                                        "year",
                                        "leave_id",
                                        "total_eligible",
                                        "close_balance"
                                      ];

                                      connection.query(
                                        "INSERT INTO hims_f_employee_monthly_leave(" +
                                          insurtColumns.join(",") +
                                          ") VALUES ?",
                                        [
                                          jsonArrayToObject({
                                            sampleInputObject: insurtColumns,
                                            arrayObj: monthlyArray
                                          })
                                        ],
                                        (error, monthResult) => {
                                          if (error) {
                                            connection.rollback(() => {
                                              releaseDBConnection(
                                                db,
                                                connection
                                              );
                                              next(error);
                                            });
                                          }

                                          connection.commit(error => {
                                            if (error) {
                                              connection.rollback(() => {
                                                releaseDBConnection(
                                                  db,
                                                  connection
                                                );
                                                next(error);
                                              });
                                            }
                                            releaseDBConnection(db, connection);
                                            req.records = monthResult;
                                            next();
                                          });
                                        }
                                      );
                                    } else {
                                      //commit

                                      connection.commit(error => {
                                        if (error) {
                                          connection.rollback(() => {
                                            releaseDBConnection(db, connection);
                                            next(error);
                                          });
                                        }

                                        releaseDBConnection(db, connection);

                                        if (
                                          Object.keys(resultofYearInsert)
                                            .length === 0
                                        ) {
                                          req.records = {
                                            already_processed: true,
                                            message: "Leave already processed"
                                          };
                                          next();
                                        } else {
                                          req.records = resultofYearInsert;
                                          next();
                                        }
                                      });
                                    }
                                  } catch (e) {
                                    reject(e);
                                  }
                                }).then(resultMonthlyInsert => {
                                  //pppppppppppp
                                });
                              });
                            });
                          });
                        }
                      }
                    );
                  } catch (e) {
                    reject(e);
                  }
                }).then(result => {
                  //pppppppppppp
                });
              }
            } else {
              req.records = "No Employees found";
              next();
              return;
            }
          }
        );
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide year"
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let processYearlyLeave = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let year = "";

    debugLog("input:", req.query);

    let yearArray = [];
    let monthlyArray = [];

    let employee_id = "";

    let AllEmployees = [];
    let AllLeaves = [];
    let AllYearlyLeaves = [];
    let AllMonthlyLeaves = [];

    if (req.query.employee_id > 0) {
      employee_id = ` and hims_d_employee_id=${req.query.employee_id}; `;
    }
    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined
    ) {
      year = req.query.year;

      db.getConnection((error, connection) => {
        connection.query(
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,hospital_id ,employee_type,sex\
            from hims_d_employee where employee_status <>'I' and  record_status='A' " +
            employee_id +
            ";\
            select L.hims_d_leave_id,L.leave_code,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
            inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' ;\
            select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
             where record_status='A' and `year`=? ;\
             select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
            hims_f_employee_monthly_leave where   `year`=?; ",

          [year, year],

          (error, allResult) => {
            if (error) {
              releaseDBConnection(db, connection);
              next(error);
            }
            AllEmployees = allResult[0];
            AllLeaves = allResult[1];
            AllYearlyLeaves = allResult[2];
            AllMonthlyLeaves = allResult[3];

            // debugLog("AllEmployees:", AllEmployees);
            // debugLog("AllLeaves:", AllLeaves);
            // debugLog("AllYearlyLeaves:", AllYearlyLeaves);
            // debugLog("AllMonthlyLeaves:", AllMonthlyLeaves);

            if (AllEmployees.length > 0) {
              new Promise((resolve, reject) => {
                try {
                  for (let i = 0; i < AllEmployees.length; i++) {
                    // fetch all the fileds of apllicable_leavs
                    const apllicable_leavsDetail = new LINQ(AllLeaves)
                      .Where(
                        w =>
                          w.employee_type == AllEmployees[i]["employee_type"] &&
                          (w.gender == AllEmployees[i]["sex"] ||
                            w.gender == "BOTH")
                      )
                      .Select(s => {
                        return {
                          hims_d_leave_id: s.hims_d_leave_id,
                          eligible_days: s.eligible_days,
                          eligible_days: s.eligible_days
                        };
                      })
                      .ToArray();

                    // fetch only leave ids of apllicable_leavs
                    const apllicable_leavs = new LINQ(AllLeaves)
                      .Where(
                        w =>
                          w.employee_type == AllEmployees[i]["employee_type"] &&
                          (w.gender == AllEmployees[i]["sex"] ||
                            w.gender == "BOTH")
                      )
                      .Select(s => s.hims_d_leave_id)
                      .ToArray();

                    // debugLog("apllicable_leavs:", apllicable_leavs);
                    // debugLog(
                    //   "apllicable_leavsLength:",
                    //   apllicable_leavs.length
                    // );

                    if (apllicable_leavs.length > 0) {
                      debugLog("here");

                      let new_leave_ids = apllicable_leavs.filter(
                        (item, pos) => {
                          return apllicable_leavs.indexOf(item) == pos;
                        }
                      );
                    //  debugLog("new_leave_ids:", new_leave_ids);
                      //step1---checking if yearly leave is  already processed for this employee
                      const yearlyLvExist = new LINQ(AllYearlyLeaves)
                        .Where(
                          w =>
                            w.employee_id ==
                              AllEmployees[i]["hims_d_employee_id"] &&
                            w.year == year
                        )
                        .Select(s => s.hims_f_employee_yearly_leave_id)
                        .ToArray().length;

                     // debugLog("yearlyLvExist:", yearlyLvExist);
                      //if yearly leave is  not processed for this employee process now
                      if (yearlyLvExist < 1) {
                        yearArray.push({
                          employee_id: AllEmployees[i].hims_d_employee_id,
                          year: year
                        });
                      }

                      //step2----checking if monthly leave is  already processed for this employee
                      const monthlyLvExist = new LINQ(AllMonthlyLeaves)
                        .Where(
                          w =>
                            w.employee_id ==
                              AllEmployees[i]["hims_d_employee_id"] &&
                            w.year == year
                        )
                        .Select(s => s.leave_id)
                        .ToArray();

                     // debugLog("monthlyLvExist:", monthlyLvExist);
                      if (monthlyLvExist.length > 0) {
                        // const old_leave_ids = new LINQ(
                        //   monthlyLvExist
                        // )
                        //   .Select(s => s.leave_id)
                        //   .ToArray();

                        //   debugLog("old_leave_ids:", old_leave_ids);

                        // remove existing leave ids from applicable leave ids
                        let leaves_to_insert = new_leave_ids.filter(
                          val => !monthlyLvExist.includes(val)
                        );
                        debugLog("leaves_to_insert:", leaves_to_insert);

                        const _leaves = leaves_to_insert.map(item => {
                          return _.chain(apllicable_leavsDetail)
                            .find(o => {
                              return o.hims_d_leave_id == item;
                            })

                            .omit(_.isNull)
                            .value();
                        });
                      //  debugLog("_leaves:", _leaves);
                        monthlyArray.push(
                          ...new LINQ(_leaves)
                            .Where(w => w.hims_d_leave_id > 0)
                            .Select(s => {
                              return {
                                employee_id: AllEmployees[i].hims_d_employee_id,
                                year: year,
                                leave_id: s.hims_d_leave_id,
                                total_eligible: s.eligible_days,
                                close_balance: s.eligible_days
                              };
                            })
                            .ToArray()
                        );
                      } else {
                        // if monthly table data not exist
                        monthlyArray.push(
                          ...new LINQ(apllicable_leavsDetail)
                            .Where(w => w.hims_d_leave_id > 0)
                            .Select(s => {
                              return {
                                employee_id: AllEmployees[i].hims_d_employee_id,
                                year: year,
                                leave_id: s.hims_d_leave_id,
                                total_eligible: s.eligible_days,
                                close_balance: s.eligible_days
                              };
                            })
                            .ToArray()
                        );
                      }
                    }

                    if (i == AllEmployees.length - 1) {
                      //insert in two tables
                      resolve(yearArray);
                    }
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(arrayResult => {
                debugLog("yearArray:", yearArray);
                debugLog("monthlyArray:", monthlyArray);
                connection.beginTransaction(error => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }
                  new Promise((resolve, reject) => {
                    try {
                      if (yearArray.length > 0) {
                        const insurtColumns = ["employee_id", "year"];

                        connection.query(
                          "INSERT  INTO hims_f_employee_yearly_leave(" +
                            insurtColumns.join(",") +
                            ",created_date,updated_date,created_by,updated_by) VALUES ?",
                          [
                            jsonArrayToObject({
                              sampleInputObject: insurtColumns,
                              arrayObj: yearArray,
                              newFieldToInsert: [
                                new Date(),
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                req.userIdentity.algaeh_d_app_user_id
                              ]
                            })
                          ],
                          (error, yearResult) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            if (yearResult.affectedRows > 0) {
                              resolve({ yearResult });
                            } else {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                          }
                        );
                      } else {
                        resolve({});
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(resultofYearInsert => {
                    new Promise((resolve, reject) => {
                      try {
                        if (monthlyArray.length > 0) {
                          //functionality plus commit

                          const insurtColumns = [
                            "employee_id",
                            "year",
                            "leave_id",
                            "total_eligible",
                            "close_balance"
                          ];

                          connection.query(
                            "INSERT INTO hims_f_employee_monthly_leave(" +
                              insurtColumns.join(",") +
                              ") VALUES ?",
                            [
                              jsonArrayToObject({
                                sampleInputObject: insurtColumns,
                                arrayObj: monthlyArray
                              })
                            ],
                            (error, monthResult) => {
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
                                req.records = monthResult;
                                next();
                              });
                            }
                          );
                        } else {
                          //commit

                          connection.commit(error => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            releaseDBConnection(db, connection);

                            if (Object.keys(resultofYearInsert).length === 0) {
                              req.records = {
                                already_processed: true,
                                message: "Leave already processed"
                              };
                              next();
                            } else {
                              req.records = resultofYearInsert;
                              next();
                            }
                          });
                        }
                      } catch (e) {
                        reject(e);
                      }
                    }).then(resultMonthlyInsert => {
                      //pppppppppppp
                    });
                  });
                });
              });
            } else {
              releaseDBConnection(db, connection);
              req.records = {
                invalid_input: true,
                message: "No Employees found"
              };
              next();
              return;
            }
          }
        );
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide year"
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let markAbsent = (req, res, next) => {
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

      connection.query(
        "INSERT INTO `hims_f_absent` (employee_id,absent_date,from_session,to_session, absent_duration,\
          absent_reason,created_date, created_by, updated_date, updated_by)\
          VALUE(?,date(?),?,?,?,?,?,?,?,?)",
        [
          input.employee_id,
          input.absent_date,
          input.from_session,
          input.to_session,
          input.absent_duration,
          input.absent_reason,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ],
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
let cancelAbsent = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      connection.query(
        "UPDATE hims_f_absent SET cancel='Y',cancel_by=?,cancel_date=?,cancel_reason=?, updated_date=?, updated_by=?  WHERE hims_f_absent_id = ?",

        [
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          input.cancel_reason,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_f_absent_id
        ],
        (error, result) => {
          releaseDBConnection(db, connection);
          if (error) {
            next(error);
          }

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = { invalid_input: true };
            next();
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getAllAbsentEmployee = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    if (input.yearAndMonth != undefined && input.yearAndMonth != "null") {
      const startOfMonth = moment(input.yearAndMonth)
        .startOf("month")
        .format("YYYY-MM-DD");

      const endOfMonth = moment(input.yearAndMonth)
        .endOf("month")
        .format("YYYY-MM-DD");
      db.getConnection((error, connection) => {
        connection.query(
          "select  hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
          absent_reason, cancel ,absent_duration,cancel_reason,E.employee_code,E.full_name as employee_name\
          from hims_f_absent A,hims_d_employee E where A.record_status='A'\
          and date(absent_date) between date(?) and date(?) and A.employee_id=E.hims_d_employee_id order by hims_f_absent_id desc",
          [startOfMonth, endOfMonth],
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

//created by irfan:
let authorizeLeaveBACK1 = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.auth_level != "L1" &&
      input.auth_level != "L2" &&
      input.auth_level != "L3"
    ) {
      req.records = {
        invalid_input: true,
        message: "please provide valid  auth level"
      };
      next();
      return;
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
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorized1=?,\
            authorize1_date=?,authorize1_by=?,authorize1_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorize1,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize1_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (result.affectedRows > 0 && input.status == "R") {
                connection.query(
                  "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                  and hims_f_leave_application_id=?",
                  [input.hims_f_leave_application_id],
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
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
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorized2=?,\
            authorized2_date=?,authorized2_by=?,authorize2_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorized2,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize2_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (result.affectedRows > 0 && input.status == "R") {
                connection.query(
                  "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                    and hims_f_leave_application_id=?",
                  [input.hims_f_leave_application_id],
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else if (
      input.auth_level == "L3" &&
      input.status != "null" &&
      input.status != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.query(
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorized3=?,\
            authorized3_date=?,authorized3_by=?,authorize3_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorized3,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize3_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (
                result.affectedRows > 0 &&
                (input.status == "R" || input.status == "A")
              ) {
                if (input.status == "R") {
                  connection.query(
                    "update hims_f_leave_application set status='REJ' where record_status='A' and status='PEN'\
                  and hims_f_leave_application_id=?",
                    input.hims_f_leave_application_id,
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
                        next();
                      });
                    }
                  );
                } else if (input.status == "A") {
                  new Promise((resolve, reject) => {
                    req.options = {
                      db: connection,
                      onFailure: error => {
                        reject(error);
                      },
                      onSuccess: result => {
                        resolve(result);
                      }
                    };
                    calculateLeaveDays(req, res, next);
                  }).then(deductionResult => {
                    new Promise((resolve, reject) => {
                      try {
                        debugLog(" wow deduc:", deductionResult);

                        if (deductionResult.invalid_input == true) {
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                          });
                          req.records = deductionResult;
                          next();
                          return;
                        } else {
                          resolve(deductionResult);
                        }
                      } catch (e) {
                        reject(e);
                      }
                    }).then(deductionResult => {
                      let monthArray = new LINQ(
                        deductionResult.monthWiseCalculatedLeaveDeduction
                      )
                        .Select(s => s.month_name)
                        .ToArray();

                      debugLog("monthArray:", monthArray);

                      if (monthArray.length > 0) {
                        connection.query(
                          `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                        from hims_f_employee_monthly_leave where
                        employee_id=? and year=? and leave_id=?`,
                          [input.employee_id, input.year, input.leave_id],
                          (error, leaveData) => {
                            if (error) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            debugLog("leaveData:", leaveData);

                            if (
                              leaveData.length > 0 &&
                              parseFloat(deductionResult.calculatedLeaveDays) <=
                                parseFloat(leaveData[0]["close_balance"])
                            ) {
                              let newCloseBal =
                                parseFloat(leaveData[0]["close_balance"]) -
                                parseFloat(deductionResult.calculatedLeaveDays);

                              let newAvailTillDate =
                                parseFloat(leaveData[0]["availed_till_date"]) +
                                parseFloat(deductionResult.calculatedLeaveDays);

                              let oldMonthsData = [];

                              debugLog("oldMonthsData:", oldMonthsData);

                              debugLog("kkk");
                              for (let i = 0; i < monthArray.length; i++) {
                                Object.keys(leaveData[0]).map(key => {
                                  if (key == monthArray[i]) {
                                    debugLog(key, leaveData[0][key]);

                                    oldMonthsData.push({
                                      month_name: key,
                                      finalLeave: leaveData[0][key]
                                    });
                                  }
                                });
                              }
                              debugLog("oldMonthsData:", oldMonthsData);

                              let mergemonths = oldMonthsData.concat(
                                deductionResult.monthWiseCalculatedLeaveDeduction
                              );

                              // let finalData = new LINQ(mergemonths)
                              //   .GroupBy(g => g.month_name)
                              //   .Select(s => s.month_name);

                              // debugLog("finalData:", finalData);

                              debugLog("mergemonths:", mergemonths);

                              let finalData = {};
                              _.chain(mergemonths)
                                .groupBy(g => g.month_name)
                                .map(item => {
                                  finalData[
                                    _.get(
                                      _.find(item, "month_name"),
                                      "month_name"
                                    )
                                  ] = _.sumBy(item, s => {
                                    return s.finalLeave;
                                  });
                                  // return {
                                  //   [_.get(
                                  //     _.find(item, "month_name"),
                                  //     "month_name"
                                  //   )]: _.sumBy(item, s => {
                                  //     return s.finalLeave;
                                  //   })
                                  //   //    finalLeave:_.get(_.find(item,'finalLeave'),'finalLeave') +
                                  //   // _.get(_.find(item,'oldLeave'),'oldLeave')
                                  // };
                                })
                                .value();
                              debugLog("finalData:", finalData);

                              //         connection.query('UPDATE users SET ? WHERE UserID = :UserID',
                              //  {UserID: userId, Name: name})
                              let ba = mysql.format(
                                " update hims_f_leave_application set status='APR' where record_status='A' \
                                and hims_f_leave_application_id=" +
                                  input.hims_f_leave_application_id +
                                  ";update hims_f_employee_monthly_leave set ?  where \
                                hims_f_employee_monthly_leave_id='" +
                                  leaveData[0]
                                    .hims_f_employee_monthly_leave_id +
                                  "'",
                                {
                                  ...finalData,
                                  close_balance: newCloseBal,
                                  availed_till_date: newAvailTillDate
                                }
                              );

                              debugLog("query:", ba);

                              connection.query(
                                " update hims_f_leave_application set status='APR' where record_status='A' \
                                and hims_f_leave_application_id=" +
                                  input.hims_f_leave_application_id +
                                  ";update hims_f_employee_monthly_leave set ?  where \
                                hims_f_employee_monthly_leave_id='" +
                                  leaveData[0]
                                    .hims_f_employee_monthly_leave_id +
                                  "'",
                                {
                                  ...finalData,
                                  close_balance: newCloseBal,
                                  availed_till_date: newAvailTillDate
                                },
                                (error, finalRes) => {
                                  if (error) {
                                    debugLog("errr:");
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }
                                  debugLog("pakka:");
                                  connection.commit(error => {
                                    if (error) {
                                      connection.rollback(() => {
                                        releaseDBConnection(db, connection);
                                        next(error);
                                      });
                                    }
                                    releaseDBConnection(db, connection);
                                    req.records = finalRes;
                                    next();
                                  });
                                }
                              );
                            } else {
                              //invalid data
                              req.records = {
                                invalid_input: true,
                                message: "leave balance is low"
                              };
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next();
                              });
                            }
                          }
                        );
                      } else {
                        //invalid data

                        req.records = {
                          invalid_input: true,
                          message: "please provide valid month"
                        };
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next();
                        });
                      }
                    });
                  });
                }
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let authorizeLeave = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.auth_level != "L1" &&
      input.auth_level != "L2" &&
      input.auth_level != "L3"
    ) {
      req.records = {
        invalid_input: true,
        message: "please provide valid  auth level"
      };
      next();
      return;
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
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorize1=?,\
            authorize1_date=?,authorize1_by=?,authorize1_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorize1,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize1_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (result.affectedRows > 0 && input.status == "R") {
                connection.query(
                  "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                  and hims_f_leave_application_id=?",
                  [input.hims_f_leave_application_id],
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
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
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorized2=?,\
            authorized2_date=?,authorized2_by=?,authorize2_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorized2,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize2_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (result.affectedRows > 0 && input.status == "R") {
                connection.query(
                  "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                    and hims_f_leave_application_id=?",
                  [input.hims_f_leave_application_id],
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else if (
      input.auth_level == "L3" &&
      input.status != "null" &&
      input.status != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.beginTransaction(error => {
          if (error) {
            connection.rollback(() => {
              releaseDBConnection(db, connection);
              next(error);
            });
          }

          connection.query(
            "UPDATE hims_f_leave_application SET total_approved_days=?,authorized3=?,\
            authorized3_date=?,authorized3_by=?,authorize3_comment=?,\
             updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?",

            [
              input.total_approved_days,
              input.authorized3,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.authorize3_comment,

              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              input.hims_f_leave_application_id
            ],
            (error, result) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (
                result.affectedRows > 0 &&
                (input.status == "R" || input.status == "A")
              ) {
                if (input.status == "R") {
                  connection.query(
                    "update hims_f_leave_application set status='REJ' where record_status='A' and status='PEN'\
                  and hims_f_leave_application_id=?",
                    input.hims_f_leave_application_id,
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
                        next();
                      });
                    }
                  );
                } else if (input.status == "A") {
                  const month_number = moment(input.from_date).format("M");
                  const month_name = moment(input.from_date).format("MMMM");
                  let updaid_leave_duration = 0;
                  let id = 0;
                  new Promise((resolve, reject) => {
                    try {
                      connection.query(
                        "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                  hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                        [month_number, input.year, input.employee_id],
                        (error, salResult) => {
                          if (error) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              next(error);
                            });
                          }

                          if (
                            salResult.length > 0 &&
                            salResult[0]["salary_processed"] == "Y"
                          ) {
                            connection.query(
                              "insert into hims_f_pending_leave (employee_id, year, month,leave_header_id) VALUE(?,?,?,?)",

                              [
                                input.employee_id,
                                input.year,
                                month_number,
                                input.hims_f_leave_application_id
                              ],
                              (error, resultPL) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                if (resultPL.insertId > 0) {
                                  id = resultPL.insertId;
                                  resolve(resultPL);
                                } else {
                                  req.records = {
                                    invalid_input: true,
                                    message: "unpaid leave error"
                                  };
                                  next();
                                  return;
                                }
                              }
                            );

                            //insert
                          } else {
                            resolve(salResult);
                          }
                        }
                      );
                    } catch (e) {
                      reject(e);
                    }
                  }).then(pendingUpdaidResult => {
                    //---START OF-------normal authrization

                    new Promise((resolve, reject) => {
                      req.options = {
                        db: connection,
                        onFailure: error => {
                          reject(error);
                        },
                        onSuccess: result => {
                          resolve(result);
                        }
                      };
                      calculateLeaveDays(req, res, next);
                    }).then(deductionResult => {
                      new Promise((resolve, reject) => {
                        try {
                          debugLog(" wow deduc:", deductionResult);

                          if (deductionResult.invalid_input == true) {
                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                            });
                            req.records = deductionResult;
                            next();
                            return;
                          } else {
                            resolve(deductionResult);
                          }
                        } catch (e) {
                          reject(e);
                        }
                      }).then(deductionResult => {
                        updaid_leave_duration = new LINQ(
                          deductionResult.monthWiseCalculatedLeaveDeduction
                        )
                          .Where(w => w.month_name == month_name)
                          .Select(s => s.finalLeave)
                          .FirstOrDefault();

                        debugLog(
                          "updaid_leave_duration:",
                          updaid_leave_duration
                        );

                        let monthArray = new LINQ(
                          deductionResult.monthWiseCalculatedLeaveDeduction
                        )
                          .Select(s => s.month_name)
                          .ToArray();

                        debugLog("monthArray:", monthArray);

                        if (monthArray.length > 0) {
                          connection.query(
                            `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                        from hims_f_employee_monthly_leave where
                        employee_id=? and year=? and leave_id=?`,
                            [input.employee_id, input.year, input.leave_id],
                            (error, leaveData) => {
                              if (error) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next(error);
                                });
                              }

                              debugLog("leaveData:", leaveData);

                              if (
                                leaveData.length > 0 &&
                                parseFloat(
                                  deductionResult.calculatedLeaveDays
                                ) <= parseFloat(leaveData[0]["close_balance"])
                              ) {
                                let newCloseBal =
                                  parseFloat(leaveData[0]["close_balance"]) -
                                  parseFloat(
                                    deductionResult.calculatedLeaveDays
                                  );

                                let newAvailTillDate =
                                  parseFloat(
                                    leaveData[0]["availed_till_date"]
                                  ) +
                                  parseFloat(
                                    deductionResult.calculatedLeaveDays
                                  );

                                let oldMonthsData = [];

                                debugLog("oldMonthsData:", oldMonthsData);

                                debugLog("kkk");
                                for (let i = 0; i < monthArray.length; i++) {
                                  Object.keys(leaveData[0]).map(key => {
                                    if (key == monthArray[i]) {
                                      debugLog(key, leaveData[0][key]);

                                      oldMonthsData.push({
                                        month_name: key,
                                        finalLeave: leaveData[0][key]
                                      });
                                    }
                                  });
                                }
                                debugLog("oldMonthsData:", oldMonthsData);

                                let mergemonths = oldMonthsData.concat(
                                  deductionResult.monthWiseCalculatedLeaveDeduction
                                );

                                // let finalData = new LINQ(mergemonths)
                                //   .GroupBy(g => g.month_name)
                                //   .Select(s => s.month_name);

                                // debugLog("finalData:", finalData);

                                debugLog("mergemonths:", mergemonths);

                                let finalData = {};
                                _.chain(mergemonths)
                                  .groupBy(g => g.month_name)
                                  .map(item => {
                                    finalData[
                                      _.get(
                                        _.find(item, "month_name"),
                                        "month_name"
                                      )
                                    ] = _.sumBy(item, s => {
                                      return s.finalLeave;
                                    });
                                  })
                                  .value();
                                debugLog("finalData:", finalData);

                                // let ba = mysql.format(
                                //   " update hims_f_leave_application set status='APR' where record_status='A' \
                                //   and hims_f_leave_application_id=" +
                                //     input.hims_f_leave_application_id +
                                //     ";update hims_f_employee_monthly_leave set ?  where \
                                //   hims_f_employee_monthly_leave_id='" +
                                //     leaveData[0]
                                //       .hims_f_employee_monthly_leave_id +
                                //     "';update hims_f_pending_leave set updaid_leave_duration=" +
                                //     updaid_leave_duration +
                                //     " where hims_f_pending_leave_id=" +
                                //     id +
                                //     "",
                                //   {
                                //     ...finalData,
                                //     close_balance: newCloseBal,
                                //     availed_till_date: newAvailTillDate
                                //   }
                                // );

                                connection.query(
                                  " update hims_f_leave_application set status='APR' where record_status='A' \
                                and hims_f_leave_application_id=" +
                                    input.hims_f_leave_application_id +
                                    ";update hims_f_employee_monthly_leave set ?  where \
                                hims_f_employee_monthly_leave_id='" +
                                    leaveData[0]
                                      .hims_f_employee_monthly_leave_id +
                                    "';update hims_f_pending_leave set updaid_leave_duration=" +
                                    updaid_leave_duration +
                                    " where hims_f_pending_leave_id=" +
                                    id +
                                    "",
                                  {
                                    ...finalData,
                                    close_balance: newCloseBal,
                                    availed_till_date: newAvailTillDate
                                  },
                                  (error, finalRes) => {
                                    if (error) {
                                      debugLog("errr:");
                                      connection.rollback(() => {
                                        releaseDBConnection(db, connection);
                                        next(error);
                                      });
                                    }
                                    debugLog("pakka:");
                                    connection.commit(error => {
                                      if (error) {
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next(error);
                                        });
                                      }
                                      releaseDBConnection(db, connection);
                                      req.records = finalRes;
                                      next();
                                    });
                                  }
                                );
                              } else {
                                //invalid data
                                req.records = {
                                  invalid_input: true,
                                  message: "leave balance is low"
                                };
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                  next();
                                });
                              }
                            }
                          );
                        } else {
                          //invalid data

                          req.records = {
                            invalid_input: true,
                            message: "please provide valid month"
                          };
                          connection.rollback(() => {
                            releaseDBConnection(db, connection);
                            next();
                          });
                        }
                      });
                    });
                  });
                  //---END OF-------normal authrization
                }
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
                req.records = {
                  invalid_input: true,
                  message: "please provide valid input"
                };
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next();
                });
              }
            }
          );
        });
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getLeaveApllication = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    // if (
    //   req.query.auth_level != "L1" &&
    //   req.query.auth_level != "L2" &&
    //   req.query.auth_level != "L3"
    // ) {
    //   req.records = { invalid_input: true, message: "invalid auth level " };
    //   next();
    //   return;
    // }
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
      range = ` and date(application_date)
      between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    let auth_level = "";
    if (req.query.auth_level == "L1") {
      auth_level = "  authorized1='N' ";
    } else if (req.query.auth_level == "L2") {
      auth_level = "  authorized1='Y' and authorized2='N' ";
    } else if (req.query.auth_level == "L3") {
      auth_level = "  authorized1='Y' and authorized2='Y' and authorized3='N' ";
    }

    let leave_status = "";

    if (req.query.leave_status == "APR") {
      auth_level = "";
      leave_status = "  status='APR' ";
    } else if (req.query.leave_status == "REJ") {
      auth_level = "";
      leave_status = "  status='REJ' ";
    } else if (req.query.leave_status == "CAN") {
      auth_level = "";
      leave_status = "  status='CAN' ";
    } else {
      leave_status = "  status='PEN' and ";
    }

    // let cancelled = " LA.cancelled='N' ";
    // if (req.query.leave_status == "CAN") {
    //   cancelled = " LA.cancelled='Y' ";
    // }

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_f_leave_application_id,LA.leave_application_code,LA.employee_id,\
        LA.application_date,LA.sub_department_id,LA.leave_id,LA.from_leave_session,\
        LA.from_date,LA.to_date,LA.to_leave_session,LA.leave_applied_from,\
        LA.total_applied_days,LA.total_approved_days,LA.`status`\
        ,L.leave_code,L.leave_description,L.leave_type,E.employee_code,\
        E.full_name as employee_name,E.religion_id,SD.sub_department_code,SD.sub_department_name \
        from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
        and L.record_status='A' inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
        and E.record_status='A' inner join hims_d_sub_department SD \
        on LA.sub_department_id=SD.hims_d_sub_department_id  where " +
          leave_status +
          "" +
          auth_level +
          "" +
          range +
          "" +
          employee +
          "order by hims_f_leave_application_id desc",

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
let updateLeaveMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (input.hims_d_leave_id > 0) {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_leave SET leave_description=?,leave_category=?, calculation_type=?,include_weekoff=?,include_holiday=?,leave_mode=?,leave_status=?,leave_accrual=?,\
          leave_encash=?,leave_type=?,encashment_percentage=?,leave_carry_forward=?,carry_forward_percentage=?,religion_required=?,\
          religion_id=?,holiday_reimbursement=?,exit_permit_required=?,proportionate_leave=?,document_mandatory=?,\
          updated_date=?, updated_by=?  WHERE hims_d_leave_id = ?",

          [
            input.leave_description,
            input.leave_category,
            input.calculation_type,
            input.include_weekoff,
            input.include_holiday,
            input.leave_mode,
            input.leave_status,
            input.leave_accrual,
            input.leave_encash,
            input.leave_type,
            input.encashment_percentage,
            input.leave_carry_forward,
            input.carry_forward_percentage,
            input.religion_required,
            input.religion_id,
            input.holiday_reimbursement,
            input.exit_permit_required,
            input.proportionate_leave,
            input.document_mandatory,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_leave_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "please provide valid input"
              };
              next();
            }
          }
        );
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};



//created by irfan:
let calculateLeaveDays = (req, res, next) => {
  try {
    let db = null;
    debugLog(" today");
    // debugLog("req.options:", req.body);
    // debugLog(" db:", db);

    let input = {};

    if (req.options == null) {
      input = extend({}, req.query);
    } else {
      input = extend({}, req.body);
    }

    debugLog("input:", input);

    let from_date = new Date(input.from_date).toLocaleString();
    let to_date = new Date(input.to_date).toLocaleString();
    let leave_applied_days = 0;
    let calculatedLeaveDays = 0;
    let session_diff = 0;
    let my_religion = input.religion_id;

    let from_month = moment(from_date).format("M");
    let to_month = moment(to_date).format("M");

    let year = moment(from_date).format("YYYY");
    debugLog("from_month:", from_month);
    debugLog("to_month:", to_month);

    debugLog("from_date:", from_date);
    debugLog("to_date:", to_date);

    let dateStart = moment(from_date);
    let dateEnd = moment(to_date);
    let dateRange = [];
    let currentClosingBal = 0;
    debugLog("dateStart:", dateStart);
    debugLog("dateEnd:", dateEnd);

    let leaveDeductionArray = [];
    //--- START OF-------calculate Half-day or Full-day from session

    if (input.from_date == input.to_date) {
      debugLog("same date:");
      if (input.from_session == "FH" && input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      } else if (input.from_session == "SH" && input.to_session == "SH") {
        session_diff += parseFloat(0.5);
      }
    } else {
      debugLog("not same date");
      if (input.from_session == "SH") {
        session_diff += parseFloat(0.5);
      }
      if (input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      }
    }
    //--- END OF---------calculate Half-day or Full-day from session

    debugLog("session_diff:", session_diff);

    //--- START OF---------get month names and start_of_month and end_of_month number of days in a full month
    while (
      dateEnd > dateStart ||
      dateStart.format("M") === dateEnd.format("M")
    ) {
      dateRange.push({
        month_name: dateStart.format("MMMM"),
        startOfMonth: moment(dateStart)
          .startOf("month")
          .format("YYYY-MM-DD"),
        endOfMonth: moment(dateStart)
          .endOf("month")
          .format("YYYY-MM-DD"),

        numberOfDays: moment(dateStart).daysInMonth()
      });
      dateStart.add(1, "month");
    }

    debugLog("dateRange:", dateRange);
    // ---END OF---------get month names and start_of_month and end_of_month number of days in a full month

    //---START OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
    if (dateRange.length > 1) {
      for (let i = 0; i < dateRange.length; i++) {
        if (i == 0) {
          let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
          let start = moment(from_date).format("YYYY-MM-DD");

          debugLog("end:", end);
          debugLog("start:", start);

          leave_applied_days +=
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1;
          extend(dateRange[i], {
            begning_of_leave: start,
            end_of_leave: end,
            leaveDays:
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1
          });
        } else if (i == dateRange.length - 1) {
          let start = moment(dateRange[i]["startOfMonth"]).format("YYYY-MM-DD");
          let end = moment(to_date).format("YYYY-MM-DD");

          leave_applied_days +=
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1;

          extend(dateRange[i], {
            begning_of_leave: start,
            end_of_leave: end,
            leaveDays:
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1
          });
        } else {
          debugLog("am three");
          leave_applied_days += dateRange[i]["numberOfDays"];

          extend(dateRange[i], {
            begning_of_leave: dateRange[i]["startOfMonth"],
            end_of_leave: dateRange[i]["endOfMonth"],
            leaveDays: dateRange[i]["numberOfDays"]
          });
        }
      }

      calculatedLeaveDays = leave_applied_days;
    } else if (dateRange.length == 1) {
      debugLog("salman");
      let end = moment(to_date).format("YYYY-MM-DD");
      let start = moment(from_date).format("YYYY-MM-DD");

      debugLog("end:", end);
      debugLog("start:", start);

      leave_applied_days +=
        moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") + 1;
      extend(dateRange[0], {
        begning_of_leave: start,
        end_of_leave: end,
        leaveDays:
          moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") +
          1
      });

      calculatedLeaveDays = leave_applied_days;
    }

    //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range

    debugLog("dateRange:", dateRange);
    debugLog("leave_applied_days:", leave_applied_days);

    new Promise((resolve, reject) => {
      try {
        if (req.options == null) {
          req.db.getConnection((error, connection) => {
            if (error) {
              debugLog("eooeee");
              releaseDBConnection(req.db, connection);
              next(error);
            } else {
              db = connection;

              db.query(
                " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
                from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?;\
                select hims_d_holiday_id,holiday_date,holiday_description\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))\
                or \
                ((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?)))",
                [
                  input.employee_id,
                  year,
                  input.leave_id,

                  input.from_date,
                  input.from_date,
                  input.from_date,
                  my_religion,
                  input.to_date,
                  input.to_date,
                  input.to_date,
                  my_religion
                ],
                (error, closeBalanceResult) => {
                  if (error) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  }

                  currentClosingBal = closeBalanceResult[0][0].close_balance;
                  debugLog("closeBalanceResult:", closeBalanceResult[0]);
                  debugLog("res1:", closeBalanceResult[0]);
                  debugLog("res2:", closeBalanceResult[1]);
                  debugLog("currentClosingBal:", currentClosingBal);
                  if (closeBalanceResult[1].length > 0) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      invalid_input: true,
                      message: `you cant apply leave,${
                        closeBalanceResult[1][0].holiday_date
                      } is holiday   `
                    };
                    next();
                    return;
                  }
                  resolve({ db });
                }
              );
            }
          });
        } else {
          db = req.options.db;
          debugLog("else db:", db);

          db.query(
            " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
            from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
            [input.employee_id, year, input.leave_id],
            (error, closeBalanceResult) => {
              if (error) {
                releaseDBConnection(req.db, db);
                next(error);
              }
              currentClosingBal = closeBalanceResult[0].close_balance;
              debugLog("closeBalanceResult:", closeBalanceResult);
              debugLog("currentClosingBal:", currentClosingBal);
              resolve({ db });
            }
          );
        }
      } catch (e) {
        reject(e);
      }
    }).then(result => {
      debugLog("my result:", result);

      //   "select L.hims_d_leave_id,L.leave_code,L.leave_description,LD.employee_type,hims_d_leave_detail_id,LD.gender,LD.eligible_days ,\
      //   L.include_weekoff,L.include_holiday from hims_d_leave  L \
      //   inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A'\
      //   where hims_d_leave_detail_id=?",
      // input.hims_d_leave_detail_id,

      db.query(
        "select hims_d_leave_id,leave_code,leave_description,include_weekoff,\
        include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
        input.leave_id,
        (error, result) => {
          if (error) {
            if (req.options == null) {
              releaseDBConnection(req.db, db);
              next(error);
            } else {
              req.options.onFailure(result);
            }
          }
          debugLog("result:", result);

          // subtracting  week off or holidays fom LeaveApplied Days
          if (
            result.length > 0 &&
            (result[0].include_weekoff == "N" ||
              result[0].include_holiday == "N")
          ) {
            db.query(
              "select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
      from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ;          ",

              [
                moment(from_date).format("YYYY-MM-DD"),
                moment(to_date).format("YYYY-MM-DD")
              ],
              (error, holidayResult) => {
                if (error) {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  } else {
                    req.options.onFailure(holidayResult);
                  }
                }
                debugLog("holidayResult:", holidayResult);

                //s -------START OF--- get count of holidays and weekOffs betwen apllied leave range
                let total_weekOff = new LINQ(holidayResult)
                  .Where(w => w.weekoff == "Y")
                  .Count();

                let total_holiday = new LINQ(holidayResult)
                  .Where(
                    w =>
                      (w.holiday == "Y" && w.holiday_type == "RE") ||
                      (w.holiday == "Y" &&
                        w.holiday_type == "RS" &&
                        w.religion_id == my_religion)
                  )
                  .Count();
                // -------END OF--- get count of holidays and weekOffs betwen apllied leave range

                //s -------START OF--- get holidays data and week of data
                let week_off_Data = new LINQ(holidayResult)
                  .Select(s => {
                    return {
                      hims_d_holiday_id: s.hims_d_holiday_id,

                      holiday_date: s.holiday_date,

                      holiday_description: s.holiday_description,

                      holiday: s.holiday,

                      weekoff: s.weekoff,

                      holiday_type: s.holiday_type,

                      religion_id: s.religion_id
                    };
                  })
                  .Where(w => w.weekoff == "Y")
                  .ToArray();

                let holiday_Data = new LINQ(holidayResult)
                  .Select(s => {
                    return {
                      hims_d_holiday_id: s.hims_d_holiday_id,

                      holiday_date: s.holiday_date,

                      holiday_description: s.holiday_description,

                      holiday: s.holiday,

                      weekoff: s.weekoff,

                      holiday_type: s.holiday_type,

                      religion_id: s.religion_id
                    };
                  })
                  .Where(
                    w =>
                      (w.holiday == "Y" && w.holiday_type == "RE") ||
                      (w.holiday == "Y" &&
                        w.holiday_type == "RS" &&
                        w.religion_id == my_religion)
                  )
                  .ToArray();

                //s -------END OF--- get holidays data and week of data

                //-------------------------------------------------------
                debugLog("total_weekOff:", total_weekOff);
                debugLog("total_holiday:", total_holiday);
                //dateRange.length

                let total_minus = 0;
                for (let k = 0; k < dateRange.length; k++) {
                  let reduce_days = parseFloat(0);

                  //step 1 -------START OF------ getting total week offs and holidays to be subtracted from each month

                  //calculating holidays to remove from each month
                  if (result[0].include_holiday == "N") {
                    reduce_days += parseFloat(
                      new LINQ(holiday_Data)
                        .Where(
                          w =>
                            dateRange[k]["begning_of_leave"] <=
                              w.holiday_date &&
                            w.holiday_date <= dateRange[k]["end_of_leave"]
                        )
                        .Count()
                    );
                  }

                  //calculating week off to remove from each month
                  if (result[0].include_weekoff == "N") {
                    reduce_days += parseFloat(
                      new LINQ(week_off_Data)
                        .Where(
                          w =>
                            dateRange[k]["begning_of_leave"] <=
                              w.holiday_date &&
                            w.holiday_date <= dateRange[k]["end_of_leave"]
                        )
                        .Count()
                    );
                  }

                  //-------END OF------ getting total week offs and holidays to be subtracted from each month

                  //step 2-------START OF------ session belongs to which month and  subtract session from that month----------
                  if (input.from_session == "SH" && k == 0) {
                    if (from_month === to_month && input.to_session == "FH") {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) -
                          parseFloat(reduce_days) -
                          parseFloat(1)
                      });
                    } else {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) -
                          parseFloat(reduce_days) -
                          parseFloat(0.5)
                      });
                    }
                  } else if (
                    input.to_session == "FH" &&
                    k == dateRange.length - 1
                  ) {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave:
                        parseFloat(dateRange[k]["leaveDays"]) -
                        parseFloat(reduce_days) -
                        parseFloat(0.5)
                    });
                  } else {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave:
                        parseFloat(dateRange[k]["leaveDays"]) -
                        parseFloat(reduce_days)
                    });
                  }
                  //------- END OF----session belongs to which month and  subtract session from that month----------
                  total_minus += parseFloat(reduce_days);
                }

                debugLog("leaveDeductionArray:", leaveDeductionArray);
                debugLog("total_minus:", total_minus);

                //step3-------START OF------ finally  subtracting week off and holidays from total Applied days
                debugLog("total apllied days:", calculatedLeaveDays);
                if (result[0].include_weekoff == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_weekOff);
                  debugLog("after reducing weekoff:", calculatedLeaveDays);
                }

                if (result[0].include_holiday == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_holiday);

                  debugLog("after reducnng holiday:", calculatedLeaveDays);
                }

                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                //-------END OF------ finally  subtracting week off and holidays from total Applied days

                debugLog(
                  "after reducing weekoff and holdy and session:",
                  calculatedLeaveDays
                );
                debugLog("currentClosingBal:", currentClosingBal);
                if (currentClosingBal >= calculatedLeaveDays) {
                  debugLog("calculatedLeaveDays:", calculatedLeaveDays);

                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      leave_applied_days: leave_applied_days,
                      calculatedLeaveDays: calculatedLeaveDays,
                      monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                    };
                    next();
                    return;
                  } else {
                    req.options.onSuccess({
                      leave_applied_days: leave_applied_days,
                      calculatedLeaveDays: calculatedLeaveDays,
                      monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                    });
                  }
                } else {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      invalid_input: true,
                      message: `you dont have enough leaves for :${
                        result[0]["leave_description"]
                      } `
                    };
                    next();
                    return;
                  } else {
                    req.options.onSuccess({
                      invalid_input: true,
                      message: `you dont have enough leaves for :${
                        result[0]["leave_description"]
                      } `
                    });
                  }
                }
              }
            );
          }
          // dont subtract  week off or holidays fom LeaveApplied Days
          else if (result.length > 0) {
            for (let k = 0; k < dateRange.length; k++) {
              if (input.from_session == "SH" && k == 0) {
                if (from_month === to_month && input.to_session == "FH") {
                  leaveDeductionArray.push({
                    month_name: dateRange[k]["month_name"],
                    finalLeave:
                      parseFloat(dateRange[k]["leaveDays"]) - parseFloat(1)
                  });
                } else {
                  leaveDeductionArray.push({
                    month_name: dateRange[k]["month_name"],
                    finalLeave:
                      parseFloat(dateRange[k]["leaveDays"]) - parseFloat(0.5)
                  });
                }
              } else if (
                input.to_session == "FH" &&
                k == dateRange.length - 1
              ) {
                leaveDeductionArray.push({
                  month_name: dateRange[k]["month_name"],
                  finalLeave:
                    parseFloat(dateRange[k]["leaveDays"]) - parseFloat(0.5)
                });
              } else {
                leaveDeductionArray.push({
                  month_name: dateRange[k]["month_name"],
                  finalLeave: parseFloat(dateRange[k]["leaveDays"])
                });
              }
            }

            calculatedLeaveDays =
              parseFloat(calculatedLeaveDays) - parseFloat(session_diff);
            debugLog("week off and holidaay included");
            debugLog("currentClosingBal:", currentClosingBal);
            //checking if he has enough eligible days
            if (currentClosingBal >= calculatedLeaveDays) {
              debugLog("calculatedLeaveDays:", calculatedLeaveDays);
              if (req.options == null) {
                releaseDBConnection(req.db, db);
                req.records = {
                  leave_applied_days: leave_applied_days,
                  calculatedLeaveDays: calculatedLeaveDays,
                  monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                };
                next();
              } else {
                req.options.onSuccess({
                  leave_applied_days: leave_applied_days,
                  calculatedLeaveDays: calculatedLeaveDays,
                  monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                });
              }
            } else {
              if (req.options == null) {
                releaseDBConnection(req.db, db);
                req.records = {
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                };
                next();
                return;
              } else {
                req.options.onSuccess({
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                });
              }
            }
          } else {
            // invalid data

            if (req.options == null) {
              releaseDBConnection(req.db, db);
              req.records = {
                invalid_input: true,
                message: `invalid data `
              };
              next();
              return;
            } else {
              req.options.onSuccess({
                invalid_input: true,
                message: `invalid data`
              });
            }
          }

          // req.records = result;
          // next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let calculateLeaveDaysBAckup = (req, res, next) => {
  try {
    let db = null;
    debugLog(" today");
    // debugLog("req.options:", req.body);
    // debugLog(" db:", db);

    let input = {};

    if (req.options == null) {
      input = extend({}, req.query);
    } else {
      input = extend({}, req.body);
    }

    debugLog("input:", input);

    let from_date = new Date(input.from_date).toLocaleString();
    let to_date = new Date(input.to_date).toLocaleString();
    let leave_applied_days = 0;
    let calculatedLeaveDays = 0;
    let session_diff = 0;
    let my_religion = input.religion_id;

    let from_month = moment(from_date).format("M");
    let to_month = moment(to_date).format("M");

    let year = moment(from_date).format("YYYY");
    debugLog("from_month:", from_month);
    debugLog("to_month:", to_month);

    debugLog("from_date:", from_date);
    debugLog("to_date:", to_date);

    let dateStart = moment(from_date);
    let dateEnd = moment(to_date);
    let dateRange = [];
    let currentClosingBal = 0;
    debugLog("dateStart:", dateStart);
    debugLog("dateEnd:", dateEnd);

    let leaveDeductionArray = [];
    //--- START OF-------calculate Half-day or Full-day from session

    if (input.from_date == input.to_date) {
      debugLog("same date:");
      if (input.from_session == "FH" && input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      } else if (input.from_session == "SH" && input.to_session == "SH") {
        session_diff += parseFloat(0.5);
      }
    } else {
      debugLog("not same date");
      if (input.from_session == "SH") {
        session_diff += parseFloat(0.5);
      }
      if (input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      }
    }
    //--- END OF---------calculate Half-day or Full-day from session

    debugLog("session_diff:", session_diff);

    //--- START OF---------get month names and start_of_month and end_of_month number of days in a full month
    while (
      dateEnd > dateStart ||
      dateStart.format("M") === dateEnd.format("M")
    ) {
      dateRange.push({
        month_name: dateStart.format("MMMM"),
        startOfMonth: moment(dateStart)
          .startOf("month")
          .format("YYYY-MM-DD"),
        endOfMonth: moment(dateStart)
          .endOf("month")
          .format("YYYY-MM-DD"),

        numberOfDays: moment(dateStart).daysInMonth()
      });
      dateStart.add(1, "month");
    }

    debugLog("dateRange:", dateRange);
    // ---END OF---------get month names and start_of_month and end_of_month number of days in a full month

    //---START OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
    if (dateRange.length > 1) {
      for (let i = 0; i < dateRange.length; i++) {
        if (i == 0) {
          let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
          let start = moment(from_date).format("YYYY-MM-DD");

          debugLog("end:", end);
          debugLog("start:", start);

          leave_applied_days +=
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1;
          extend(dateRange[i], {
            begning_of_leave: start,
            end_of_leave: end,
            leaveDays:
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1
          });
        } else if (i == dateRange.length - 1) {
          let start = moment(dateRange[i]["startOfMonth"]).format("YYYY-MM-DD");
          let end = moment(to_date).format("YYYY-MM-DD");

          leave_applied_days +=
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1;

          extend(dateRange[i], {
            begning_of_leave: start,
            end_of_leave: end,
            leaveDays:
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1
          });
        } else {
          debugLog("am three");
          leave_applied_days += dateRange[i]["numberOfDays"];

          extend(dateRange[i], {
            begning_of_leave: dateRange[i]["startOfMonth"],
            end_of_leave: dateRange[i]["endOfMonth"],
            leaveDays: dateRange[i]["numberOfDays"]
          });
        }
      }

      calculatedLeaveDays = leave_applied_days;
    } else if (dateRange.length == 1) {
      debugLog("salman");
      let end = moment(to_date).format("YYYY-MM-DD");
      let start = moment(from_date).format("YYYY-MM-DD");

      debugLog("end:", end);
      debugLog("start:", start);

      leave_applied_days +=
        moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") + 1;
      extend(dateRange[0], {
        begning_of_leave: start,
        end_of_leave: end,
        leaveDays:
          moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") +
          1
      });

      calculatedLeaveDays = leave_applied_days;
    }

    //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range

    debugLog("dateRange:", dateRange);
    debugLog("leave_applied_days:", leave_applied_days);

    new Promise((resolve, reject) => {
      try {
        if (req.options == null) {
          req.db.getConnection((error, connection) => {
            if (error) {
              debugLog("eooeee");
              releaseDBConnection(req.db, connection);
              next(error);
            } else {
              db = connection;

              db.query(
                " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
                from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?;\
                select hims_d_holiday_id,holiday_date,holiday_description\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))\
                or \
                ((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?)))",
                [
                  input.employee_id,
                  year,
                  input.leave_id,

                  input.from_date,
                  input.from_date,
                  input.from_date,
                  my_religion,
                  input.to_date,
                  input.to_date,
                  input.to_date,
                  my_religion
                ],
                (error, closeBalanceResult) => {
                  if (error) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  }

                  currentClosingBal = closeBalanceResult[0][0].close_balance;
                  debugLog("closeBalanceResult:", closeBalanceResult[0]);
                  debugLog("res1:", closeBalanceResult[0]);
                  debugLog("res2:", closeBalanceResult[1]);
                  debugLog("currentClosingBal:", currentClosingBal);
                  if (closeBalanceResult[1].length > 0) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      invalid_input: true,
                      message: `you cant apply leave,${
                        closeBalanceResult[1][0].holiday_date
                      } is holiday   `
                    };
                    next();
                    return;
                  }
                  resolve({ db });
                }
              );
            }
          });
        } else {
          db = req.options.db;
          debugLog("else db:", db);

          db.query(
            " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
            from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
            [input.employee_id, year, input.leave_id],
            (error, closeBalanceResult) => {
              if (error) {
                releaseDBConnection(req.db, db);
                next(error);
              }
              currentClosingBal = closeBalanceResult[0].close_balance;
              debugLog("closeBalanceResult:", closeBalanceResult);
              debugLog("currentClosingBal:", currentClosingBal);
              resolve({ db });
            }
          );
        }
      } catch (e) {
        reject(e);
      }
    }).then(result => {
      debugLog("my result:", result);

      //   "select L.hims_d_leave_id,L.leave_code,L.leave_description,LD.employee_type,hims_d_leave_detail_id,LD.gender,LD.eligible_days ,\
      //   L.include_weekoff,L.include_holiday from hims_d_leave  L \
      //   inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A'\
      //   where hims_d_leave_detail_id=?",
      // input.hims_d_leave_detail_id,

      db.query(
        "select hims_d_leave_id,leave_code,leave_description,include_weekoff,\
        include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
        input.leave_id,
        (error, result) => {
          if (error) {
            if (req.options == null) {
              releaseDBConnection(req.db, db);
              next(error);
            } else {
              req.options.onFailure(result);
            }
          }
          debugLog("result:", result);

          // subtracting  week off or holidays fom LeaveApplied Days
          if (
            result.length > 0 &&
            (result[0].include_weekoff == "N" ||
              result[0].include_holiday == "N")
          ) {
            db.query(
              "select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
      from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ;          ",

              [
                moment(from_date).format("YYYY-MM-DD"),
                moment(to_date).format("YYYY-MM-DD")
              ],
              (error, holidayResult) => {
                if (error) {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  } else {
                    req.options.onFailure(holidayResult);
                  }
                }
                debugLog("holidayResult:", holidayResult);

                //s -------START OF--- get count of holidays and weekOffs betwen apllied leave range
                let total_weekOff = new LINQ(holidayResult)
                  .Where(w => w.weekoff == "Y")
                  .Count();

                let total_holiday = new LINQ(holidayResult)
                  .Where(
                    w =>
                      (w.holiday == "Y" && w.holiday_type == "RE") ||
                      (w.holiday == "Y" &&
                        w.holiday_type == "RS" &&
                        w.religion_id == my_religion)
                  )
                  .Count();
                // -------END OF--- get count of holidays and weekOffs betwen apllied leave range

                //s -------START OF--- get holidays data and week of data
                let week_off_Data = new LINQ(holidayResult)
                  .Select(s => {
                    return {
                      hims_d_holiday_id: s.hims_d_holiday_id,

                      holiday_date: s.holiday_date,

                      holiday_description: s.holiday_description,

                      holiday: s.holiday,

                      weekoff: s.weekoff,

                      holiday_type: s.holiday_type,

                      religion_id: s.religion_id
                    };
                  })
                  .Where(w => w.weekoff == "Y")
                  .ToArray();

                let holiday_Data = new LINQ(holidayResult)
                  .Select(s => {
                    return {
                      hims_d_holiday_id: s.hims_d_holiday_id,

                      holiday_date: s.holiday_date,

                      holiday_description: s.holiday_description,

                      holiday: s.holiday,

                      weekoff: s.weekoff,

                      holiday_type: s.holiday_type,

                      religion_id: s.religion_id
                    };
                  })
                  .Where(
                    w =>
                      (w.holiday == "Y" && w.holiday_type == "RE") ||
                      (w.holiday == "Y" &&
                        w.holiday_type == "RS" &&
                        w.religion_id == my_religion)
                  )
                  .ToArray();

                //s -------END OF--- get holidays data and week of data

                //-------------------------------------------------------
                debugLog("total_weekOff:", total_weekOff);
                debugLog("total_holiday:", total_holiday);
                //dateRange.length

                let total_minus = 0;
                for (let k = 0; k < dateRange.length; k++) {
                  let reduce_days = parseFloat(0);

                  //step 1 -------START OF------ getting total week offs and holidays to be subtracted from each month

                  //calculating holidays to remove from each month
                  if (result[0].include_holiday == "N") {
                    reduce_days += parseFloat(
                      new LINQ(holiday_Data)
                        .Where(
                          w =>
                            dateRange[k]["begning_of_leave"] <=
                              w.holiday_date &&
                            w.holiday_date <= dateRange[k]["end_of_leave"]
                        )
                        .Count()
                    );
                  }

                  //calculating week off to remove from each month
                  if (result[0].include_weekoff == "N") {
                    reduce_days += parseFloat(
                      new LINQ(week_off_Data)
                        .Where(
                          w =>
                            dateRange[k]["begning_of_leave"] <=
                              w.holiday_date &&
                            w.holiday_date <= dateRange[k]["end_of_leave"]
                        )
                        .Count()
                    );
                  }

                  //-------END OF------ getting total week offs and holidays to be subtracted from each month

                  //step 2-------START OF------ session belongs to which month and  subtract session from that month----------
                  if (input.from_session == "SH" && k == 0) {
                    if (from_month === to_month && input.to_session == "FH") {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) -
                          parseFloat(reduce_days) -
                          parseFloat(1)
                      });
                    } else {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) -
                          parseFloat(reduce_days) -
                          parseFloat(0.5)
                      });
                    }
                  } else if (
                    input.to_session == "FH" &&
                    k == dateRange.length - 1
                  ) {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave:
                        parseFloat(dateRange[k]["leaveDays"]) -
                        parseFloat(reduce_days) -
                        parseFloat(0.5)
                    });
                  } else {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave:
                        parseFloat(dateRange[k]["leaveDays"]) -
                        parseFloat(reduce_days)
                    });
                  }
                  //------- END OF----session belongs to which month and  subtract session from that month----------
                  total_minus += parseFloat(reduce_days);
                }

                debugLog("leaveDeductionArray:", leaveDeductionArray);
                debugLog("total_minus:", total_minus);

                //step3-------START OF------ finally  subtracting week off and holidays from total Applied days
                debugLog("total apllied days:", calculatedLeaveDays);
                if (result[0].include_weekoff == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_weekOff);
                  debugLog("after reducing weekoff:", calculatedLeaveDays);
                }

                if (result[0].include_holiday == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_holiday);

                  debugLog("after reducnng holiday:", calculatedLeaveDays);
                }

                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                //-------END OF------ finally  subtracting week off and holidays from total Applied days

                debugLog(
                  "after reducing weekoff and holdy and session:",
                  calculatedLeaveDays
                );
                debugLog("currentClosingBal:", currentClosingBal);
                if (currentClosingBal >= calculatedLeaveDays) {
                  debugLog("calculatedLeaveDays:", calculatedLeaveDays);

                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      leave_applied_days: leave_applied_days,
                      calculatedLeaveDays: calculatedLeaveDays,
                      monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                    };
                    next();
                    return;
                  } else {
                    req.options.onSuccess({
                      leave_applied_days: leave_applied_days,
                      calculatedLeaveDays: calculatedLeaveDays,
                      monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                    });
                  }
                } else {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      invalid_input: true,
                      message: `you dont have enough leaves for :${
                        result[0]["leave_description"]
                      } `
                    };
                    next();
                    return;
                  } else {
                    req.options.onSuccess({
                      invalid_input: true,
                      message: `you dont have enough leaves for :${
                        result[0]["leave_description"]
                      } `
                    });
                  }
                }
              }
            );
          }
          // dont subtract  week off or holidays fom LeaveApplied Days
          else if (result.length > 0) {
            for (let k = 0; k < dateRange.length; k++) {
              leaveDeductionArray.push({
                month_name: dateRange[k]["month_name"],
                finalLeave: dateRange[k]["leaveDays"]
              });

              // reduce_days = parseFloat(0);
            }
            debugLog("week off and holidaay included");
            debugLog("currentClosingBal:", currentClosingBal);
            //checking if he has enough eligible days
            if (currentClosingBal >= calculatedLeaveDays) {
              debugLog("calculatedLeaveDays:", calculatedLeaveDays);
              if (req.options == null) {
                releaseDBConnection(req.db, db);
                req.records = {
                  leave_applied_days: leave_applied_days,
                  calculatedLeaveDays: calculatedLeaveDays,
                  monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                };
                next();
              } else {
                req.options.onSuccess({
                  leave_applied_days: leave_applied_days,
                  calculatedLeaveDays: calculatedLeaveDays,
                  monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                });
                debugLog("updateResult", updateResult);
              }
            } else {
              if (req.options == null) {
                releaseDBConnection(req.db, db);
                req.records = {
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                };
                next();
                return;
              } else {
                req.options.onSuccess({
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                });
              }
            }
          } else {
            // invalid data

            if (req.options == null) {
              releaseDBConnection(req.db, db);
              req.records = {
                invalid_input: true,
                message: `invalid data `
              };
              next();
              return;
            } else {
              req.options.onSuccess({
                invalid_input: true,
                message: `invalid data`
              });
            }
          }

          // req.records = result;
          // next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by Adnan:
let getLeaveDetailsMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    if (input.leave_id != undefined && input.leave_id != "null") {
      db.getConnection((error, connection) => {
        connection.query(
          "Select hims_d_leave_detail_id, leave_header_id, employee_type,\
          gender, eligible_days, min_service_required, service_years,\
          once_life_term, allow_probation, max_number_days, mandatory_utilize_days\
          from hims_d_leave_detail where leave_header_id=?",
          input.leave_id,
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

//created by Adnan
let addLeaveDetailMaster = (req, res, next) => {
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

      connection.query(
        "INSERT  INTO hims_d_leave_detail ( leave_header_id,\
           employee_type, gender, eligible_days, min_service_required, service_years,\
            once_life_term, allow_probation, max_number_days,\
           mandatory_utilize_days, created_date, created_by, updated_date, updated_by) values(\
          ?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          input.leave_id,
          input.employee_type,
          input.gender,
          input.eligible_days,
          input.min_service_required,
          input.service_years,
          input.once_life_term,
          input.allow_probation,
          input.max_number_days,
          input.mandatory_utilize_days,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
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



//created by Adnan
let deleteLeaveEncash = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    let db = req.db;
    if (
      input.hims_d_leave_encashment_id != "null" &&
      input.hims_d_leave_encashment_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "DELETE from  hims_d_leave_encashment WHERE hims_d_leave_encashment_id=?",
          input.hims_d_leave_encashment_id,
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.records.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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

//created by Adnan
let deleteLeaveRule = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    let db = req.db;
    if (
      input.hims_d_leave_rule_id != "null" &&
      input.hims_d_leave_rule_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "DELETE from  hims_d_leave_rule WHERE hims_d_leave_rule_id=?",
          input.hims_d_leave_rule_id,
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.records.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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
//created by Adnan
let deleteLeaveDetail = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let input = extend({}, req.body);
    let db = req.db;

    if (
      input.hims_d_leave_detail_id != "null" &&
      input.hims_d_leave_detail_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "DELETE from  hims_d_leave_detail WHERE hims_d_leave_detail_id=?",
          input.hims_d_leave_detail_id,
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.records.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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

//created by Adnan
let addLeaveEncashmentMaster = (req, res, next) => {
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

      connection.query(
        "INSERT  INTO hims_d_leave_encashment ( leave_header_id,\
          earnings_id, percent,created_date, created_by, updated_date, updated_by) values(\
          ?,?,?,?,?,?,?)",
        [
          input.leave_id,
          input.earnings_id,
          input.percent,
          new Date(),
          input.created_by,
          new Date(),
          input.updated_by
        ],
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

//created by Adnan
let addLeaveRulesMaster = (req, res, next) => {
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

      connection.query(
        "INSERT  INTO hims_d_leave_rule ( leave_header_id,\
         calculation_type, earning_id,\
         paytype, from_value, to_value, value_type, total_days) values(\
          ?,?,?,?,?,?,?,?)",
        [
          input.leave_id,
          input.calculation_type,
          input.earning_id,
          input.paytype,
          input.from_value,
          input.to_value,
          input.value_type,
          input.total_days
        ],
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

//created by Adnan:
let getLeaveEncashmentMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    if (input.leave_id != undefined && input.leave_id != "null") {
      db.getConnection((error, connection) => {
        connection.query(
          "Select hims_d_leave_encashment_id, leave_header_id,\
           earnings_id, percent\
          from hims_d_leave_encashment where leave_header_id=?",
          input.leave_id,
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
//created by Adnan:
let getLeaveRulesMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.query);

    if (input.leave_id != undefined && input.leave_id != "null") {
      db.getConnection((error, connection) => {
        connection.query(
          "Select hims_d_leave_rule_id, leave_header_id, calculation_type,\
           earning_id, paytype, from_value, to_value, value_type, total_days\
          from hims_d_leave_rule where leave_header_id=?",
          input.leave_id,
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

let updateLeaveDetailMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
 
  

    let input = extend({}, req.body);
    if (
      input.hims_d_leave_detail_id >0){
     
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_leave_detail SET leave_header_id = ?,\
          employee_type = ?, gender = ?, eligible_days = ?, min_service_required = ? , service_years = ?,\
          once_life_term = ?, allow_probation = ?, max_number_days = ?, mandatory_utilize_days = ?,\
            updated_date=?, updated_by=?  WHERE hims_d_leave_detail_id = ?",

          [
            input.leave_header_id,
            input.employee_type,
            input.gender,
            input.eligible_days,
            input.min_service_required,
            input.service_years,
            input.once_life_term,
            input.allow_probation,
            input.max_number_days,
            input.mandatory_utilize_days,
            new Date(),
            input.updated_by,
            input.hims_d_leave_detail_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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




let updateLeaveEncashMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_leave_encashment_id != "null" &&
      input.hims_d_leave_encashment_id != undefined
    ) {
      //hims_d_leave_encashment_id, leave_header_id, earnings_id, percent, created_date, created_by, updated_date, updated_by
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_leave_encashment SET leave_header_id = ?,\
          earnings_id = ?, percent = ?,\
            updated_date=?, updated_by=?  WHERE hims_d_leave_encashment_id = ?",

          [
            input.leave_header_id,
            input.earnings_id,
            input.percent,
            new Date(),
            input.updated_by,
            input.hims_d_leave_encashment_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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
let updateLeaveRuleMaster = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (
      input.hims_d_leave_rule_id != "null" &&
      input.hims_d_leave_rule_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_d_leave_rule SET leave_header_id = ?,\
          calculation_type = ?, earning_id = ?, paytype = ?, from_value = ? , to_value = ?,\
          value_type = ?, total_days = ?  WHERE hims_d_leave_rule_id = ?",
          [
            input.leave_header_id,
            input.calculation_type,
            input.earning_id,
            input.paytype,
            input.from_value,
            input.to_value,
            input.value_type,
            input.total_days,
            input.hims_d_leave_rule_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = { invalid_input: true };
              next();
            }
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
//created by irfan:
let cancelLeave = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    new Promise((resolve, reject) => {
      try {
        getMaxAuth({
          req: req,
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
    }).then(result => {
      if (req.userIdentity.leave_authorize_privilege == result.MaxLeave) {
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
              "select hims_f_leave_application_id,leave_application_code ,`status`\
            from hims_f_leave_application where hims_f_leave_application_id=? ",
              [input.hims_f_leave_application_id],
              (error, leaveStaus) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                if (leaveStaus[0]["status"] == "APR") {
                  debugLog("Apprd", leaveStaus[0]["status"]);
                  // let month = "1";
                  // let year = "2019";
                  // let employee_id = "2";
                  const month_number = moment(input.from_date).format("M");

                  connection.query(
                    "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                 hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                    [month_number, input.year, input.employee_id],
                    (error, salResult) => {
                      if (error) {
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next(error);
                        });
                      }
                      debugLog("salResult:", salResult);
                      if (
                        salResult.length < 1 ||
                        (salResult.length > 0 &&
                          salResult[0]["salary_processed"] == "N" &&
                          salResult[0]["salary_paid"] == "N")
                      ) {
                        //YOU CAN CANCEL

                        new Promise((resolve, reject) => {
                          req.options = {
                            db: connection,
                            onFailure: error => {
                              reject(error);
                            },
                            onSuccess: result => {
                              resolve(result);
                            }
                          };
                          calculateLeaveDays(req, res, next);
                        }).then(deductionResult => {
                          new Promise((resolve, reject) => {
                            try {
                              debugLog(" meo deduc:", deductionResult);

                              if (deductionResult.invalid_input == true) {
                                connection.rollback(() => {
                                  releaseDBConnection(db, connection);
                                });
                                req.records = deductionResult;
                                next();
                                return;
                              } else {
                                resolve(deductionResult);
                              }
                            } catch (e) {
                              reject(e);
                            }
                          }).then(deductionResult => {
                            let monthArray = new LINQ(
                              deductionResult.monthWiseCalculatedLeaveDeduction
                            )
                              .Select(s => s.month_name)
                              .ToArray();

                            debugLog("monthArray:", monthArray);

                            if (monthArray.length > 0) {
                              connection.query(
                                `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                      from hims_f_employee_monthly_leave where
                      employee_id=? and year=? and leave_id=?`,
                                [input.employee_id, input.year, input.leave_id],
                                (error, monthlyLeaveData) => {
                                  if (error) {
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }

                                  debugLog(
                                    "monthlyLeaveData:",
                                    monthlyLeaveData
                                  );

                                  let updateMonths = {};
                                  let newCloseBal =
                                    parseFloat(
                                      monthlyLeaveData[0]["close_balance"]
                                    ) +
                                    parseFloat(
                                      deductionResult.calculatedLeaveDays
                                    );
                                  let newAvailTillDate =
                                    parseFloat(
                                      monthlyLeaveData[0]["availed_till_date"]
                                    ) -
                                    parseFloat(
                                      deductionResult.calculatedLeaveDays
                                    );
                                  for (
                                    let i = 0;
                                    i <
                                    deductionResult
                                      .monthWiseCalculatedLeaveDeduction.length;
                                    i++
                                  ) {
                                    Object.keys(monthlyLeaveData[0]).map(
                                      key => {
                                        // debugLog("ke:",key);
                                        // debugLog("m name",deductionResult.monthWiseCalculatedLeaveDeduction[i]["month_name"]);
                                        if (
                                          key ==
                                          deductionResult
                                            .monthWiseCalculatedLeaveDeduction[
                                            i
                                          ]["month_name"]
                                        ) {
                                          updateMonths = {
                                            ...updateMonths,
                                            [key]:
                                              parseFloat(
                                                monthlyLeaveData[0][key]
                                              ) -
                                              parseFloat(
                                                deductionResult
                                                  .monthWiseCalculatedLeaveDeduction[
                                                  i
                                                ]["finalLeave"]
                                              )
                                          };
                                        }
                                      }
                                    );
                                  }

                                  debugLog("newCloseBal:", newCloseBal);
                                  debugLog(
                                    "newAvailTillDate:",
                                    newAvailTillDate
                                  );
                                  debugLog("updateMonths:", updateMonths);
                                  connection.query(
                                    " update hims_f_leave_application set status='CAN',cancelled_date='" +
                                      moment().format("YYYY-MM-DD") +
                                      "',\
                            cancelled_by=" +
                                      req.userIdentity.algaeh_d_app_user_id +
                                      ",cancelled_remarks='" +
                                      input.cancelled_remarks +
                                      "' where record_status='A' \
                            and hims_f_leave_application_id=" +
                                      input.hims_f_leave_application_id +
                                      ";update hims_f_employee_monthly_leave set ?  where \
                            hims_f_employee_monthly_leave_id='" +
                                      monthlyLeaveData[0]
                                        .hims_f_employee_monthly_leave_id +
                                      "'",
                                    {
                                      ...updateMonths,
                                      close_balance: newCloseBal,
                                      availed_till_date: newAvailTillDate
                                    },
                                    (error, finalRes) => {
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
                                        req.records = finalRes;
                                        next();
                                      });
                                    }
                                  );
                                }
                              );
                            } else if (
                              (salResult.length > 0 &&
                                salResult[0]["salary_processed"] == "Y") ||
                              (salResult.length > 0 &&
                                salResult[0]["salary_paid"] == "Y")
                            ) {
                              // -- CANT CANCEL, salary already process

                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                req.records = {
                                  invalid_input: true,
                                  message: "salary already processed"
                                };
                                next();
                              });
                            }
                          });
                        });
                      } else {
                        //salary is proceesd
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          req.records = {
                            invalid_input: true,
                            message: "salary is already processed"
                          };
                          next();
                        });
                      }
                    }
                  );
                } else if (leaveStaus[0]["status"] == "CAN") {
                  // already cancelled
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    req.records = {
                      invalid_input: true,
                      message: "leave already cancelled"
                    };
                    next();
                  });
                } else {
                  // status is not in PEN, APR, REJ
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    req.records = {
                      invalid_input: true,
                      message: "cant cancel,leave is not Approved yet"
                    };
                    next();
                  });
                }
              }
            );
          });
        });
      } else {
        req.records = {
          invalid_input: true,
          message: "you dont have privilege"
        };
        next();
      }
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let cancelLeaveBACKup_28_JAN_2018 = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);
    if (
      req.userIdentity.leave_authorize_privilege == "AL1" ||
      req.userIdentity.leave_authorize_privilege == "AL2" ||
      req.userIdentity.leave_authorize_privilege == "AL3"
    ) {
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
            "select hims_f_leave_application_id,leave_application_code ,`status`,cancelled\
            from hims_f_leave_application where hims_f_leave_application_id=? ",
            [input.hims_f_leave_application_id],
            (error, leaveStaus) => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }

              if (
                leaveStaus[0]["status"] == "APR" &&
                leaveStaus[0]["cancelled"] == "N"
              ) {
                debugLog("Apprd", leaveStaus[0]["status"]);
                // let month = "1";
                // let year = "2019";
                // let employee_id = "2";
                const month_number = moment(input.from_date).format("M");

                connection.query(
                  "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                 hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                  [month_number, input.year, input.employee_id],
                  (error, salResult) => {
                    if (error) {
                      connection.rollback(() => {
                        releaseDBConnection(db, connection);
                        next(error);
                      });
                    }
                    debugLog("salResult:", salResult);
                    if (
                      salResult.length < 1 ||
                      (salResult.length > 0 &&
                        salResult[0]["salary_processed"] == "N" &&
                        salResult[0]["salary_paid"] == "N")
                    ) {
                      //YOU CAN CANCEL

                      new Promise((resolve, reject) => {
                        req.options = {
                          db: connection,
                          onFailure: error => {
                            reject(error);
                          },
                          onSuccess: result => {
                            resolve(result);
                          }
                        };
                        calculateLeaveDays(req, res, next);
                      }).then(deductionResult => {
                        new Promise((resolve, reject) => {
                          try {
                            debugLog(" meo deduc:", deductionResult);

                            if (deductionResult.invalid_input == true) {
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                              });
                              req.records = deductionResult;
                              next();
                              return;
                            } else {
                              resolve(deductionResult);
                            }
                          } catch (e) {
                            reject(e);
                          }
                        }).then(deductionResult => {
                          let monthArray = new LINQ(
                            deductionResult.monthWiseCalculatedLeaveDeduction
                          )
                            .Select(s => s.month_name)
                            .ToArray();

                          debugLog("monthArray:", monthArray);

                          if (monthArray.length > 0) {
                            connection.query(
                              `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                      from hims_f_employee_monthly_leave where
                      employee_id=? and year=? and leave_id=?`,
                              [input.employee_id, input.year, input.leave_id],
                              (error, monthlyLeaveData) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                debugLog("monthlyLeaveData:", monthlyLeaveData);

                                let updateMonths = {};
                                let newCloseBal =
                                  parseFloat(
                                    monthlyLeaveData[0]["close_balance"]
                                  ) +
                                  parseFloat(
                                    deductionResult.calculatedLeaveDays
                                  );
                                let newAvailTillDate =
                                  parseFloat(
                                    monthlyLeaveData[0]["availed_till_date"]
                                  ) -
                                  parseFloat(
                                    deductionResult.calculatedLeaveDays
                                  );
                                for (
                                  let i = 0;
                                  i <
                                  deductionResult
                                    .monthWiseCalculatedLeaveDeduction.length;
                                  i++
                                ) {
                                  Object.keys(monthlyLeaveData[0]).map(key => {
                                    // debugLog("ke:",key);
                                    // debugLog("m name",deductionResult.monthWiseCalculatedLeaveDeduction[i]["month_name"]);
                                    if (
                                      key ==
                                      deductionResult
                                        .monthWiseCalculatedLeaveDeduction[i][
                                        "month_name"
                                      ]
                                    ) {
                                      updateMonths = {
                                        ...updateMonths,
                                        [key]:
                                          parseFloat(monthlyLeaveData[0][key]) -
                                          parseFloat(
                                            deductionResult
                                              .monthWiseCalculatedLeaveDeduction[
                                              i
                                            ]["finalLeave"]
                                          )
                                      };
                                    }
                                  });
                                }

                                debugLog("newCloseBal:", newCloseBal);
                                debugLog("newAvailTillDate:", newAvailTillDate);
                                debugLog("updateMonths:", updateMonths);
                                connection.query(
                                  " update hims_f_leave_application set cancelled='Y',cancelled_date='" +
                                    moment().format("YYYY-MM-DD") +
                                    "',\
                            cancelled_by=" +
                                    req.userIdentity.algaeh_d_app_user_id +
                                    ",cancelled_remarks='" +
                                    input.cancelled_remarks +
                                    "' where record_status='A' \
                            and hims_f_leave_application_id=" +
                                    input.hims_f_leave_application_id +
                                    ";update hims_f_employee_monthly_leave set ?  where \
                            hims_f_employee_monthly_leave_id='" +
                                    monthlyLeaveData[0]
                                      .hims_f_employee_monthly_leave_id +
                                    "'",
                                  {
                                    ...updateMonths,
                                    close_balance: newCloseBal,
                                    availed_till_date: newAvailTillDate
                                  },
                                  (error, finalRes) => {
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
                                      req.records = finalRes;
                                      next();
                                    });
                                  }
                                );
                              }
                            );
                          } else if (
                            (salResult.length > 0 &&
                              salResult[0]["salary_processed"] == "Y") ||
                            (salResult.length > 0 &&
                              salResult[0]["salary_paid"] == "Y")
                          ) {
                            // -- CANT CANCEL, salary already process

                            connection.rollback(() => {
                              releaseDBConnection(db, connection);
                              req.records = {
                                invalid_input: true,
                                message: "salary already processed"
                              };
                              next();
                            });
                          }
                        });
                      });
                    }
                  }
                );
              } else if (
                (leaveStaus[0]["status"] == "PEN" ||
                  leaveStaus[0]["status"] == "REJ") &&
                leaveStaus[0]["cancelled"] == "N"
              ) {
                debugLog("pending or rjrctd", leaveStaus[0]["status"]);
                connection.query(
                  " update hims_f_leave_application set cancelled='Y',cancelled_date=?,\
                     cancelled_by=?,cancelled_remarks=? where record_status='A' \
                         and hims_f_leave_application_id=? ",
                  [
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.cancelled_remarks,
                    input.hims_f_leave_application_id
                  ],
                  (error, finalRes) => {
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
                      req.records = finalRes;
                      next();
                    });
                  }
                );
              } else if (leaveStaus[0]["cancelled"] == "Y") {
                // already cancelled
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  req.records = {
                    invalid_input: true,
                    message: "leave already cancelled"
                  };
                  next();
                });
              } else {
                // status is not in PEN, APR, REJ
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  req.records = {
                    invalid_input: true,
                    message: "salary is already processed"
                  };
                  next();
                });
              }
            }
          );
        });
      });
    } else {
      req.records = {
        invalid_input: true,
        message: "you dont have privilege"
      };
      next();
    }
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let deleteLeaveApplication = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_f_leave_application_id,employee_id,authorized1,authorized2,\
        authorized3,`status`from hims_f_leave_application where authorized1='N' \
        and authorized2='N' and authorized3='N' and `status`='PEN' and employee_id=?\
        and hims_f_leave_application_id=?",
        [req.body.employee_id, req.body.hims_f_leave_application_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            connection.query(
              "delete from hims_f_leave_application where hims_f_leave_application_id=?",
              [req.body.hims_f_leave_application_id],
              (error, delResult) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                // delete
                debugLog("delResult:", delResult);

                if (delResult.affectedRows > 0) {
                  req.records = delResult;
                  next();
                } else {
                  req.records = {
                    invalid_input: true,
                    message: `invalid input`
                  };
                  next();
                }
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = {
              invalid_input: true,
              message: `can't delete ,leave already authorized`
            };
            next();
            return;
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let regularizeAttendance = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let input = extend({}, req.body);

    if (input.regularize_status == "REJ" || input.regularize_status == "APR") {
      db.getConnection((error, connection) => {
        connection.query(
          "UPDATE hims_f_attendance_regularize SET regularize_status = ?, updated_date=?, updated_by=?  WHERE hims_f_attendance_regularize_id = ?",

          [
            input.regularize_status,
            new Date(),
            input.updated_by,
            input.hims_f_attendance_regularize_id
          ],
          (error, result) => {
            releaseDBConnection(db, connection);
            if (error) {
              next(error);
            }

            if (result.affectedRows > 0) {
              req.records = result;
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "please send valid input"
              };
              next();
            }
          }
        );
      });
    } else {
      req.records = { invalid_input: true, message: "please send valid input" };
      next();
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getEmployeeLeaveData,
  getYearlyLeaveData,
  applyEmployeeLeave,
  getEmployeeLeaveHistory,
  getLeaveBalance,
  getLeaveLevels,
  addLeaveMaster,
  addAttendanceRegularization,
  getEmployeeAttendReg,
  processYearlyLeave,
  markAbsent,
  cancelAbsent,
  getAllAbsentEmployee,
  authorizeLeave,
  getLeaveApllication,
  updateLeaveMaster,
  calculateLeaveDays,
  getLeaveDetailsMaster,
  getLeaveEncashmentMaster,
  getLeaveRulesMaster,
  addLeaveDetailMaster,
  addLeaveEncashmentMaster,
  addLeaveRulesMaster,
  deleteLeaveDetail,
  deleteLeaveEncash,
  deleteLeaveRule,
  updateLeaveDetailMaster,
  updateLeaveEncashMaster,
  updateLeaveRuleMaster,
  deleteLeaveApplication,
  cancelLeave,
  regularizeAttendance
};
