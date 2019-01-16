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
import _ from "lodash";
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

    let year = "";

    let selservice = "";
    if ((req.query.selservice = "Y")) {
      selservice = ` and  (LD.employee_type='${
        req.query.employee_type
      }' and  (LD.gender='${req.query.gender}' or LD.gender='BOTH' ))`;
    }

    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined &&
      req.query.employee_id > 0
    ) {
      year = moment(req.query.year).format("YYYY");

      // select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
      // L.leave_description,total_eligible, availed_till_date, close_balance,\
      // E.employee_code ,E.full_name as employee_name\
      // from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id \
      // inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
      // and L.record_status='A' where ML.year=? and ML.employee_id=? \
      //  order by hims_f_employee_monthly_leave_id desc;
      db.getConnection((error, connection) => {
        connection.query(
          "	select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
          L.leave_description,total_eligible, availed_till_date, close_balance,\
          E.employee_code ,E.full_name as employee_name,\
          LD.hims_d_leave_detail_id,LD.employee_type, LD.eligible_days\
          from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id       \
          inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id\
          inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
          and L.record_status='A' where ML.year=? and ML.employee_id=?" +
            selservice +
            " \
            order by hims_f_employee_monthly_leave_id desc;",
          [year, req.query.employee_id],
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
        message: "please provide year and employee"
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

    let year = "";

    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined
    ) {
      year = moment(req.query.year).format("YYYY");
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_employee_yearly_leave_id,employee_id,year ,\
          E.employee_code,  E.full_name as employee_name,SD.sub_department_code,\
          SD.sub_department_name from  hims_f_employee_yearly_leave EYL  inner join hims_d_employee E on\
          EYL.employee_id=E.hims_d_employee_id  left join hims_d_sub_department SD\
          on E.sub_department_id=SD.hims_d_sub_department_id  where EYL.year=? order by hims_f_employee_yearly_leave_id desc",
          year,
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
    }

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
                where cancelled='N' and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
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
    from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days, created_date, created_by, updated_date, updated_by)\
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
          "INSERT INTO `hims_d_leave` (leave_code,leave_description,leave_category,\
          include_weekoff,include_holiday,leave_mode,leave_accrual,leave_encash,leave_type,\
          encashment_percentage,leave_carry_forward,carry_forward_percentage,\
          religion_required,religion_id,holiday_reimbursement,exit_permit_required,\
          proportionate_leave,document_mandatory,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.leave_code,
            input.leave_description,
            input.leave_category,
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
                  message: "please send correct data"
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
          from hims_f_attendance_regularize   AR inner join hims_d_employee E  on\
           AR.employee_id=E.hims_d_employee_id and record_status='A' where" +
            employee +
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
let processYearlyLeave = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let year = "";
    if (
      req.query.year != "" &&
      req.query.year != null &&
      req.query.year != "null" &&
      req.query.year != undefined
    ) {
      year = req.query.year;
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide year"
      };

      next();
      return;
    }

    let yearArray = [];
    let monthlyArray = [];

    let employee_id = "";

    if (req.query.employee_id > 0) {
      employee_id = ` and hims_d_employee_id=${req.query.employee_id}; `;
    }

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

                      if (leaveRes.length > 0) {
                        const apllicable_leavs = new LINQ(leaveRes)
                          .Select(s => s.hims_d_leave_id)
                          .ToArray();

                        let new_leave_ids = apllicable_leavs.filter(
                          (item, pos) => {
                            return apllicable_leavs.indexOf(item) == pos;
                          }
                        );

                        new Promise((resolve, reject) => {
                          try {
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

                                if (yearOrLeavExist[1].length > 0) {
                                  const old_leave_ids = new LINQ(
                                    yearOrLeavExist[1]
                                  )
                                    .Select(s => s.leave_id)
                                    .ToArray();

                                  let leaves_to_insert = new_leave_ids.filter(
                                    val => !old_leave_ids.includes(val)
                                  );

                                  const _leaves = leaves_to_insert.map(item => {
                                    return _.chain(leaveRes)
                                      .find(o => {
                                        return o.hims_d_leave_id == item;
                                      })

                                      .omit(_.isNull)
                                      .value();
                                  });

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
                                  const insurtColumns = ["employee_id", "year"];

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
                  if (input.month != "null" && input.month != undefined) {
                    connection.query(
                      `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${
                        input.month
                      } as leave_month,availed_till_date
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

                        if (
                          leaveData.length > 0 &&
                          parseFloat(input.total_approved_days) <=
                            parseFloat(leaveData[0]["close_balance"])
                        ) {
                          let newCloseBal =
                            parseFloat(leaveData[0]["close_balance"]) -
                            parseFloat(input.total_approved_days);

                          let monthBal =
                            parseFloat(leaveData[0]["leave_month"]) +
                            parseFloat(input.total_approved_days);

                          connection.query(
                            `update hims_f_leave_application set status='APR' where record_status='A' \
                          and hims_f_leave_application_id=?;
                            update hims_f_employee_monthly_leave set  close_balance=?, ${
                              input.month
                            }=? where \
                          hims_f_employee_monthly_leave_id=?`,
                            [
                              input.hims_f_leave_application_id,
                              newCloseBal,
                              monthBal,
                              leaveData[0].hims_f_employee_monthly_leave_id
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
      auth_level = " and authorize1='N' ";
    } else if (req.query.auth_level == "L2") {
      auth_level = " and authorize1='Y' and authorized2='N' ";
    } else if (req.query.auth_level == "L3") {
      auth_level =
        " and authorize1='Y' and authorized2='Y' and authorized3='N' ";
    }

    let leave_status = "";

    if (req.query.leave_status == "A") {
      leave_status = " and status='APR' ";
    } else if (req.query.leave_status == "R") {
      leave_status = " and status='REJ' ";
    } else {
      leave_status = " and status='PEN' ";
    }

    db.getConnection((error, connection) => {
      connection.query(
        "SELECT hims_f_leave_application_id,LA.leave_application_code,LA.employee_id,\
        LA.application_date,LA.sub_department_id,LA.leave_id,LA.from_leave_session,\
        LA.from_date,LA.to_date,LA.to_leave_session,LA.leave_applied_from,\
        LA.total_applied_days,LA.total_approved_days,LA.`status`\
        ,L.leave_code,L.leave_description,L.leave_type,E.employee_code,\
        E.full_name as employee_name,SD.sub_department_code,SD.sub_department_name \
        from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
        and L.record_status='A' inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
        and E.record_status='A' inner join hims_d_sub_department SD \
        on LA.sub_department_id=SD.hims_d_sub_department_id  " +
          employee +
          "" +
          range +
          "" +
          auth_level +
          "" +
          leave_status +
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
          "UPDATE hims_d_leave SET leave_description=?,leave_category=?,include_weekoff=?,include_holiday=?,leave_mode=?,leave_status=?,leave_accrual=?,\
          leave_encash=?,leave_type=?,encashment_percentage=?,leave_carry_forward=?,carry_forward_percentage=?,religion_required=?,\
          religion_id=?,holiday_reimbursement=?,exit_permit_required=?,proportionate_leave=?,document_mandatory=?,\
          updated_date=?, updated_by=?  WHERE hims_d_leave_id = ?",

          [
            input.leave_description,
            input.leave_category,
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
let calculateLeaveDaysBKP = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    let from_date = "2019-01-15";
    let to_date = "2019-05-05";
    let leave_applied_days = 0;

    var dateStart = moment(from_date);
    var dateEnd = moment(to_date);
    var dateRange = [];

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
    if (dateRange.length > 0) {
      for (let i = 0; i < dateRange.length; i++) {
        if (i == 0) {
          var end = moment(dateRange[i]["endOfMonth"]);
          var start = moment(from_date);
          debugLog("hiiii:", end.diff(start, "days") + 1);

          leave_applied_days += end.diff(start, "days") + 1;
        } else if (i == dateRange.length - 1) {
          var start = moment(dateRange[i]["startOfMonth"]);
          var end = moment(to_date);

          debugLog("byeee:", end.diff(start, "days") + 1);

          leave_applied_days += end.diff(start, "days") + 1;
        } else {
          leave_applied_days += dateRange[i]["numberOfDays"];
          debugLog("num:", dateRange[i]["numberOfDays"]);
        }
      }
    }

    debugLog("leave_applied_days:", leave_applied_days);

    // const startOfMonth = moment(input.yearAndMonth)
    //   .startOf("month")
    //   .format("YYYY-MM-DD");

    // const endOfMonth = moment(input.yearAndMonth)
    //   .endOf("month")
    //   .format("YYYY-MM-DD");

    // var a = moment([2007, 0, 29]);
    // var b = moment([2007, 0, 28]);

    var a = moment("2019-01-20");
    var b = moment("2019-01-01");

    // let db = req.db;
    // db.getConnection((error, connection) => {
    //   connection.query(
    //     "select hims_d_appointment_status_id, color_code, description, default_status,steps,authorized FROM hims_d_appointment_status where record_status='A'  order by steps ",
    //     (error, result) => {
    //       releaseDBConnection(db, connection);
    //       if (error) {
    //         next(error);
    //       }
    //       req.records = result;
    //       next();
    //     }
    //   );
    // });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let calculateLeaveDays = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }

    debugLog("hh:");

    let input = extend({}, req.query);

    // let from_date = "2019-01-15";
    // let to_date = "2019-05-05";

    let from_date = new Date(input.from_date).toLocaleDateString();
    let to_date = new Date(input.to_date).toLocaleDateString();
    let leave_applied_days = 0;
    let calculatedLeaveDays = 0;
    let session_diff = 0;
    let my_religion = input.religion_id;

    debugLog("from_date:", from_date);
    debugLog("to_date:", to_date);

    let dateStart = moment(from_date);
    let dateEnd = moment(to_date);
    let dateRange = [];

    debugLog("dateStart:", dateStart);
    debugLog("dateEnd:", dateEnd);

    let leaveDeductionArray = [];

    if (input.from_session == "SH") {
      session_diff += parseFloat(0.5);
    }
    if (input.to_session == "FH") {
      session_diff += parseFloat(0.5);
    }

    debugLog("session_diff:", session_diff);

    // calculating month names and month details
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

    //calculating to leave days applicable
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
    debugLog("dateRange:", dateRange);
    debugLog("leave_applied_days:", leave_applied_days);
    debugLog("calculatedLeaveDays:", calculatedLeaveDays);

    let db = req.db;
    db.getConnection((error, connection) => {
      connection.query(
        "select L.hims_d_leave_id,L.leave_code,L.leave_description,LD.employee_type,hims_d_leave_detail_id,LD.gender,LD.eligible_days ,\
        L.include_weekoff,L.include_holiday from hims_d_leave  L \
        inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A'\
        where hims_d_leave_detail_id=?",
        input.hims_d_leave_detail_id,
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          debugLog("result:", result);

          if (
            result.length > 0 &&
            (result[0].include_weekoff == "N" ||
              result[0].include_holiday == "N")
          ) {
            connection.query(
              "select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
    from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ",
              [
                moment(from_date).format("YYYY-MM-DD"),
                moment(to_date).format("YYYY-MM-DD")
              ],
              (error, holidayResult) => {
                if (error) {
                  releaseDBConnection(db, connection);
                  next(error);
                }
                debugLog("holidayResult:", holidayResult);

                let total_weekOff = new LINQ(holidayResult)
                  .Where(w => w.weekoff == "Y")
                  .Count();

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

                debugLog("week_off_Data:", week_off_Data);
                //-----------------------------------------------

                let total_holiday = new LINQ(holidayResult)
                  .Where(
                    w =>
                      (w.holiday == "Y" && w.holiday_type == "RE") ||
                      (w.holiday == "Y" &&
                        w.holiday_type == "RS" &&
                        w.religion_id == my_religion)
                  )
                  .Count();

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
                debugLog("holiday_Data:", holiday_Data);
                //-------------------------------------------------------
                debugLog("total_weekOff:", total_weekOff);
                debugLog("total_holiday:", total_holiday);
                //dateRange.length

                let total_minus = 0;
                for (let k = 0; k < dateRange.length; k++) {
                  let reduce_days = parseFloat(0);
                  reduce_days += parseFloat(
                    new LINQ(holiday_Data)
                      .Where(
                        w =>
                          dateRange[k]["begning_of_leave"] <= w.holiday_date &&
                          w.holiday_date <= dateRange[k]["end_of_leave"]
                      )
                      .Count()
                  );
                  debugLog(
                    "holiday reduce:" + dateRange[k]["month_name"],
                    reduce_days
                  );

                  reduce_days += parseFloat(
                    new LINQ(week_off_Data)
                      .Where(
                        w =>
                          dateRange[k]["begning_of_leave"] <= w.holiday_date &&
                          w.holiday_date <= dateRange[k]["end_of_leave"]
                      )
                      .Count()
                  );

                  debugLog(
                    "holiday reduce:" + dateRange[k]["month_name"],
                    reduce_days
                  );
                  debugLog("===================:");

                  leaveDeductionArray.push({
                    month_name: dateRange[k]["month_name"],
                    finalLeave:
                      parseFloat(dateRange[k]["leaveDays"]) -
                      parseFloat(reduce_days)
                  });

                  total_minus += parseFloat(reduce_days);
                }

                debugLog("leaveDeductionArray:", leaveDeductionArray);
                debugLog("total_minus:", total_minus);
                //===================================================

                debugLog("before:", calculatedLeaveDays);
                if (result[0].include_weekoff == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_weekOff);
                  debugLog("am one:", calculatedLeaveDays);
                }

                if (result[0].include_holiday == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_holiday);

                  debugLog("am two:", calculatedLeaveDays);
                }

                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                debugLog("after:", calculatedLeaveDays);

                if (result[0]["eligible_days"] >= calculatedLeaveDays) {
                  debugLog("calculatedLeaveDays:", calculatedLeaveDays);
                  releaseDBConnection(db, connection);
                  req.records = {
                    calculatedLeaveDays: calculatedLeaveDays,
                    monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                  };
                  next();
                } else {
                  releaseDBConnection(db, connection);
                  req.records = {
                    invalid_input: true,
                    message: `you dont have enough leaves for :${
                      result[0]["leave_description"]
                    } `
                  };
                  next();
                  return;
                }
              }
            );
          } else if (result.length > 0) {
            for (let k = 0; k < dateRange.length; k++) {
              leaveDeductionArray.push({
                month_name: dateRange[k]["month_name"],
                finalLeave: dateRange[k]["leaveDays"]
              });

              // reduce_days = parseFloat(0);
            }
            debugLog("week off and holidaay included");

            if (result[0]["eligible_days"] >= calculatedLeaveDays) {
              debugLog("calculatedLeaveDays:", calculatedLeaveDays);
              releaseDBConnection(db, connection);
              req.records = {
                calculatedLeaveDays: calculatedLeaveDays,
                monthWiseCalculatedLeaveDeduction: leaveDeductionArray
              };
              next();
            } else {
              releaseDBConnection(db, connection);
              req.records = {
                invalid_input: true,
                message: `you dont have enough leaves for :${
                  result[0]["leave_description"]
                } `
              };
              next();
              return;
            }
          } else {
            // invalid data

            releaseDBConnection(db, connection);
            req.records = {
              invalid_input: true,
              message: "invalid data"
            };
            next();
            return;
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
  getLeaveRulesMaster
};
