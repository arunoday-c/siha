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
import _ from "lodash";
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

    debugLog("auth_levels:", auth_levels);
    debugLog("user iden:", req.userIdentity);
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
          "INSERT INTO `hims_d_leave` (leave_code,leave_description,annual_maternity_leave,\
          include_weekoff,include_holiday,leave_mode,leave_accrual,leave_encash,leave_type,\
          encashment_percentage,leave_carry_forward,carry_forward_percentage,\
          religion_required,religion_id,holiday_reimbursement,exit_permit_required,\
          proportionate_leave,document_mandatory,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            input.leave_code,
            input.leave_description,
            input.annual_maternity_leave,
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

            debugLog("leaveHeadResult:", leaveHeadResult);
            if (leaveHeadResult.insertId > 0) {
              debugLog("inside encahsh");
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
                            debugLog("BBBBBB");
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
                debugLog("inside rule");
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
                      debugLog("else resole:2");
                      resolve({ leaveEncashRes });
                    }
                  } catch (e) {
                    reject(e);
                  }
                }).then(leaveRulesRes => {
                  debugLog("inside details");
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
                                debugLog("WWWWWWWWWWWWWWW");
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
              debugLog("AAAAAA");
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

    if (
      req.query.employee_id != "" &&
      req.query.employee_id != null &&
      req.query.employee_id != "null"
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          "select hims_f_attendance_regularize_id,regularization_code,employee_id,attendance_date,\
          regularize_status,login_date,logout_date,punch_in_time,punch_out_time,\
          regularize_in_time,regularize_out_time,regularization_reason\
          from hims_f_attendance_regularize where employee_id=? order by\
          hims_f_attendance_regularize_id desc ",
          req.query.employee_id,

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
        message: "please provide valid input"
      };
      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getEmployeeLeaveData,
  applyEmployeeLeave,
  getEmployeeLeaveHistory,
  getLeaveBalance,
  getLeaveLevels,
  addLeaveMaster,
  addAttendanceRegularization,
  getEmployeeAttendReg
};
