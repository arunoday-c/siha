"use strict";

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _utils = require("../../utils");

var _httpStatus = require("../../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _nodeLinq = require("node-linq");

var _logging = require("../../utils/logging");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//created by irfan:
var getEmployeeLeaveData = function getEmployeeLeaveData(req, res, next) {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;

    //let where = whereCondition(extend(selectWhere, req.query));
    var year = (0, _moment2.default)().format("YYYY");

    db.getConnection(function (error, connection) {
      connection.query("select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
        L.leave_description,total_eligible, availed_till_date, close_balance\
        from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on  \
        ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.year=?", [req.query.employee_id, year], function (error, result) {
        (0, _utils.releaseDBConnection)(db, connection);
        if (error) {
          next(error);
        }
        req.records = result;
        next();
      });
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
var applyEmployeeLeave = function applyEmployeeLeave(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    (0, _logging.debugLog)("input:", input);

    var m_fromDate = (0, _moment2.default)(input.from_date).format("YYYY-MM-DD");
    (0, _logging.debugLog)("m_fromDate:", m_fromDate);
    var m_toDate = (0, _moment2.default)(input.to_date).format("YYYY-MM-DD");
    (0, _logging.debugLog)("m_toDate:", m_toDate);

    var from_year = (0, _moment2.default)(input.from_date).format("YYYY");
    var to_year = (0, _moment2.default)(input.to_date).format("YYYY");

    (0, _logging.debugLog)("from_year:", from_year);
    (0, _logging.debugLog)("to_year:", to_year);

    if (m_fromDate > m_toDate || m_fromDate == m_toDate && (input.from_leave_session == "SH" && input.to_leave_session == "FH" || input.from_leave_session == "SH" && input.to_leave_session == "FD")) {
      (0, _logging.debugLog)("ffffffffffffffff:");

      req.records = {
        leave_already_exist: true,
        message: "select proper sessions"
      };

      next();
      return;
    }

    if (from_year == to_year) {
      db.getConnection(function (error, connection) {
        connection.query("select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
        availed_till_date, close_balance,\
        L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
        hims_f_employee_monthly_leave ML inner join\
        hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)", [input.employee_id, input.leave_id, [from_year, to_year]], function (error, result) {
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }

          (0, _logging.debugLog)("result:", result);
          if (result.length > 0) {
            var m_total_eligible = result[0]["total_eligible"];
            var m_availed_till_date = result[0]["availed_till_date"];
            var m_close_balance = result[0]["close_balance"];

            (0, _logging.debugLog)("m_total_eligible:", m_total_eligible);
            (0, _logging.debugLog)("m_availed_till_date:", m_availed_till_date);
            (0, _logging.debugLog)("m_close_balance:", m_close_balance);

            if (m_close_balance >= input.total_applied_days) {
              //folow start here

              connection.query("select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
                to_date from hims_f_leave_application\
                where cancelled='N' and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
                ( date(?)>=date(from_date) and   date(?)<=date(to_date))   or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or \
                (date(to_date)>=date(?) and date(to_date)<= date(?) )\
                )and employee_id=?", [input.from_date, input.from_date, input.to_date, input.to_date, input.from_date, input.to_date, input.from_date, input.to_date, input.employee_id], function (error, result) {
                if (error) {
                  (0, _utils.releaseDBConnection)(db, connection);
                  next(error);
                }
                (0, _logging.debugLog)("result:", result);
                // DISCARDING LEAVE APPLICATION
                if (result.length > 0) {
                  //clashing both from_leave_session and  to_leave_session
                  var clashing_sessions = new _nodeLinq.LINQ(result).Where(function (w) {
                    return w.to_date == m_fromDate || w.from_date == m_toDate;
                  }).Select(function (s) {
                    return {
                      hims_f_leave_application_id: s.hims_f_leave_application_id,
                      employee_id: s.employee_id,
                      leave_application_code: s.leave_application_code,
                      from_leave_session: s.from_leave_session,
                      from_date: s.from_date,
                      to_leave_session: s.to_leave_session,
                      to_date: s.to_date
                    };
                  }).ToArray();

                  (0, _logging.debugLog)("clashing_sessions:", clashing_sessions);
                  //clashing only  new from_leave_session  with existing  to_leave_session
                  var clashing_to_leave_session = new _nodeLinq.LINQ(result).Where(function (w) {
                    return w.to_date == m_fromDate;
                  }).Select(function (s) {
                    return {
                      hims_f_leave_application_id: s.hims_f_leave_application_id,
                      employee_id: s.employee_id,
                      leave_application_code: s.leave_application_code,
                      from_leave_session: s.from_leave_session,
                      from_date: s.from_date,
                      to_leave_session: s.to_leave_session,
                      to_date: s.to_date
                    };
                  }).ToArray();

                  (0, _logging.debugLog)("clashing_to_leave_session:", clashing_to_leave_session);

                  //clashing only  new to_leave_session with existing  from_leave_session
                  var clashing_from_leave_session = new _nodeLinq.LINQ(result).Where(function (w) {
                    return w.from_date == m_toDate;
                  }).Select(function (s) {
                    return {
                      hims_f_leave_application_id: s.hims_f_leave_application_id,
                      employee_id: s.employee_id,
                      leave_application_code: s.leave_application_code,
                      from_leave_session: s.from_leave_session,
                      from_date: s.from_date,
                      to_leave_session: s.to_leave_session,
                      to_date: s.to_date
                    };
                  }).ToArray();

                  (0, _logging.debugLog)("clashing_from_leave_session:", clashing_from_leave_session);
                  //----------------------------------

                  var not_clashing_sessions = _lodash2.default.xorBy(result, clashing_sessions, "hims_f_leave_application_id");

                  (0, _logging.debugLog)("not_clashing_sessions:", not_clashing_sessions);
                  new Promise(function (resolve, reject) {
                    try {
                      var curr_from_session = input.from_leave_session;
                      var curr_to_session = input.to_leave_session;
                      if (not_clashing_sessions.length > 0) {
                        //
                        (0, _logging.debugLog)("inside not classing loop ");
                        (0, _utils.releaseDBConnection)(db, connection);
                        req.records = {
                          leave_already_exist: true,
                          location: "inside not_clashing_sessions: date clash not session",
                          message: " leave is already there between this dates " + not_clashing_sessions[0]["from_date"] + " AND " + not_clashing_sessions[0]["to_date"]
                        };
                        next();
                        return;
                      } else if (clashing_from_leave_session.length > 0 || clashing_to_leave_session.length > 0) {
                        (0, _logging.debugLog)("inside clashing_sessions BOTH  ");

                        new Promise(function (resolve, reject) {
                          try {
                            if (clashing_from_leave_session.length > 0) {
                              (0, _logging.debugLog)("inside clashing_from_leave_session:");
                              for (var i = 0; i < clashing_from_leave_session.length; i++) {
                                var prev_from_leave_session_FH = new _nodeLinq.LINQ([clashing_from_leave_session[i]]).Where(function (w) {
                                  return w.from_leave_session == "FH";
                                }).Select(function (s) {
                                  return s.from_leave_session;
                                }).FirstOrDefault();

                                (0, _logging.debugLog)("prev_from_leave_session_FH:", prev_from_leave_session_FH);

                                var prev_from_leave_session_SH = new _nodeLinq.LINQ([clashing_from_leave_session[i]]).Where(function (w) {
                                  return w.from_leave_session == "SH";
                                }).Select(function (s) {
                                  return s.from_leave_session;
                                }).FirstOrDefault();
                                (0, _logging.debugLog)("prev_from_leave_session_SH:", prev_from_leave_session_SH);

                                var prev_from_leave_session_FD = new _nodeLinq.LINQ([clashing_from_leave_session[i]]).Where(function (w) {
                                  return w.from_leave_session == "FD";
                                }).Select(function (s) {
                                  return s.from_leave_session;
                                }).FirstOrDefault();
                                (0, _logging.debugLog)("prev_from_leave_session_FD:", prev_from_leave_session_FD);

                                if (prev_from_leave_session_FH == "FH" && curr_to_session == "FD" || prev_from_leave_session_SH == "SH" && curr_to_session == "FD" || prev_from_leave_session_FD == "FD" && curr_to_session == "FD" || prev_from_leave_session_FD == "FD" && curr_to_session == "FH" || prev_from_leave_session_FH == "FH" && curr_to_session == "FH" || prev_from_leave_session_FH == "FH" && curr_to_session == "SH" && curr_from_session == "FH" || prev_from_leave_session_FD == "FD" && curr_to_session == "SH" || prev_from_leave_session_SH == "SH" && curr_to_session == "SH") {
                                  (0, _logging.debugLog)("rejction two:");
                                  //clashing only  new to_leave_session with existing  from_leave_session
                                  (0, _utils.releaseDBConnection)(db, connection);
                                  req.records = {
                                    leave_already_exist: true,
                                    location: "inside clashing_from_leave_session: session error: comparing prev_from_leave_session with  current:to_leave_session ",
                                    message: "leave is already there between this dates " + clashing_from_leave_session[i]["from_date"] + " AND " + clashing_from_leave_session[i]["to_date"]
                                  };
                                  next();
                                  return;
                                }

                                if (i == clashing_from_leave_session.length - 1) {
                                  (0, _logging.debugLog)("clashing_from_leave_session last iteration:");
                                  resolve({});
                                }
                              }
                            } else {
                              resolve({});
                            }
                          } catch (e) {
                            reject(e);
                          }
                        }).then(function (fromSessionREsult) {
                          if (clashing_to_leave_session.length > 0) {
                            (0, _logging.debugLog)("inside clashing_to_leave_session:");

                            for (var i = 0; i < clashing_to_leave_session.length; i++) {
                              //fetch all previous to_leave_sessions

                              var prev_to_leave_session_FH = new _nodeLinq.LINQ([clashing_to_leave_session[i]]).Where(function (w) {
                                return w.to_leave_session == "FH";
                              }).Select(function (s) {
                                return s.to_leave_session;
                              }).FirstOrDefault();

                              (0, _logging.debugLog)("prev_to_leave_session_FH:", prev_to_leave_session_FH);

                              var prev_to_leave_session_FD = new _nodeLinq.LINQ([clashing_to_leave_session[i]]).Where(function (w) {
                                return w.to_leave_session == "FD";
                              }).Select(function (s) {
                                return s.to_leave_session;
                              }).FirstOrDefault();

                              (0, _logging.debugLog)("prev_to_leave_session_FD:", prev_to_leave_session_FD);

                              var prev_to_leave_session_SH = new _nodeLinq.LINQ([clashing_to_leave_session[i]]).Where(function (w) {
                                return w.to_leave_session == "SH";
                              }).Select(function (s) {
                                return s.to_leave_session;
                              }).FirstOrDefault();

                              (0, _logging.debugLog)("prev_to_leave_session_SH:", prev_to_leave_session_SH);

                              var prev2_from_leave_session_FH = new _nodeLinq.LINQ([clashing_to_leave_session[i]]).Where(function (w) {
                                return w.from_leave_session == "FH";
                              }).Select(function (s) {
                                return s.from_leave_session;
                              }).FirstOrDefault();

                              (0, _logging.debugLog)("2nd time prev_to_leave_session_SH:", prev2_from_leave_session_FH);
                              //rejection of to_leave_sessions

                              if (prev_to_leave_session_FH == "FH" && curr_from_session == "FH" || prev_to_leave_session_FD == "FD" && curr_from_session == "FH" || prev2_from_leave_session_FH == "FH" && prev_to_leave_session_SH == "SH" && curr_from_session == "FH" || prev_to_leave_session_FD == "FD" && curr_from_session == "SH" || prev_to_leave_session_SH == "SH" && curr_from_session == "SH" || prev_to_leave_session_FH == "FH" && curr_from_session == "FD" || prev_to_leave_session_FD == "FD" && curr_from_session == "FD" || prev_to_leave_session_SH == "SH" && curr_from_session == "FD") {
                                (0, _logging.debugLog)("rejction_one:");
                                //clashing only  new from_leave_session  with existing  to_leave_session
                                (0, _utils.releaseDBConnection)(db, connection);
                                req.records = {
                                  leave_already_exist: true,
                                  location: " inside clashing_to_leave_session:session error: comparing prev_to_leave_session with  current: from_leave_session ",
                                  message: "leave is already there between this dates " + clashing_to_leave_session[i]["from_date"] + " AND " + clashing_to_leave_session[i]["to_date"]
                                };
                                next();
                                return;
                              }

                              if (i == clashing_to_leave_session.length - 1) {
                                (0, _logging.debugLog)("clashing_to_leave_session last iteration:");
                                saveF(req, db, next, connection, input, 5);
                              }
                            }
                          } else {
                            (0, _logging.debugLog)("else of clashing_to_leave_session");
                            saveF(req, db, next, connection, input, 6);
                          }
                        });
                      } else {
                        resolve({});
                      }
                    } catch (e) {
                      reject(e);
                    }
                  }).then(function (noClashResult) {
                    saveF(req, db, next, connection, input, 1);
                  });
                } else {
                  (0, _logging.debugLog)("Accept leave application here  with Num gen");
                  saveF(req, db, next, connection, input, 2);
                }
              });

              // req.records = result;
              // next();
            } else {
              req.records = {
                leave_already_exist: true,
                message: "leave application exceed total eligible leaves"
              };
              (0, _utils.releaseDBConnection)(db, connection);
              next();
              return;
            }
          } else {
            req.records = {
              leave_already_exist: true,
              message: "you cant apply for this leave type"
            };
            (0, _utils.releaseDBConnection)(db, connection);
            next();
            return;
          }
        });
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
var saveF = function saveF(req, db, next, connection, input, msg) {
  connection.beginTransaction(function (error) {
    if (error) {
      connection.rollback(function () {
        (0, _utils.releaseDBConnection)(db, connection);
        next(error);
      });
    }

    (0, _logging.debugLog)("inside saveF:", msg);
    new Promise(function (resolve, reject) {
      try {
        (0, _utils.runningNumberGen)({
          db: connection,
          module_desc: ["EMPLOYEE_LEAVE"],
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
    }).then(function (numGenLeave) {
      connection.query("INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
    from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days, created_date, created_by, updated_date, updated_by)\
    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [numGenLeave[0]["completeNumber"], input.employee_id, new Date(), input.sub_department_id, input.leave_id, input.leave_type, input.from_date, input.to_date, input.from_leave_session, input.to_leave_session, input.leave_applied_from, input.total_applied_days, new Date(), input.created_by, new Date(), input.updated_by], function (error, results) {
        if (error) {
          connection.rollback(function () {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          });
        }
        (0, _logging.debugLog)("inside leave application");
        if (results.affectedRows > 0) {
          (0, _logging.debugLog)("affectedRows");

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
};

//created by irfan:
var getEmployeeLeaveHistory = function getEmployeeLeaveHistory(req, res, next) {
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    if (req.query.employee_id != "null" && req.query.employee_id != undefined) {
      db.getConnection(function (error, connection) {
        connection.query("select hims_f_leave_application_id,leave_application_code,employee_id,application_date,\
        leave_id,from_date,to_date,from_leave_session,to_leave_session,\
        leave_applied_from,total_applied_days,total_approved_days,status,authorized,remarks,L.leave_code,\
        L.leave_description from hims_f_leave_application LA inner join hims_d_leave L on\
         LA.leave_id=L.hims_d_leave_id and L.record_status='A'\
         where LA.record_status='A' and LA.employee_id=? order by hims_f_leave_application_id desc", [req.query.employee_id], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            next(error);
          }
          req.records = result;
          next();
        });
      });
    } else {
      req.records = { invalid_input: true };
      next();
    }
  } catch (e) {
    next(e);
  }
};

var getLeaveBalance = function getLeaveBalance(req, res, next) {
  // let selectWhere = {
  //   employee_id: "ALL"
  // };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var db = req.db;
    var input = (0, _extend2.default)({}, req.body);
    //let where = whereCondition(extend(selectWhere, req.query));
    var from_year = (0, _moment2.default)(input.from_date).format("YYYY");
    var to_year = (0, _moment2.default)(input.to_date).format("YYYY");

    (0, _logging.debugLog)("from_year:", from_year);
    (0, _logging.debugLog)("to_year:", to_year);
    if (from_year == to_year) {
      db.getConnection(function (error, connection) {
        connection.query("select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
        availed_till_date, close_balance,\
        L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
        hims_f_employee_monthly_leave ML inner join\
        hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
        where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)", [input.employee_id, input.leave_id, [from_year, to_year]], function (error, result) {
          (0, _utils.releaseDBConnection)(db, connection);
          if (error) {
            (0, _utils.releaseDBConnection)(db, connection);
            next(error);
          }

          (0, _logging.debugLog)("result:", result);
          if (result.length > 0) {
            var m_total_eligible = result[0]["total_eligible"];
            var m_availed_till_date = result[0]["availed_till_date"];
            var m_close_balance = result[0]["close_balance"];

            (0, _logging.debugLog)("m_total_eligible:", m_total_eligible);
            (0, _logging.debugLog)("m_availed_till_date:", m_availed_till_date);
            (0, _logging.debugLog)("m_close_balance:", m_close_balance);

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
        });
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

//only DATE validation
// select hims_f_leave_application_id,employee_id,leave_application_code,from_date,to_date from hims_f_leave_application
// where cancelled='N' and (('2018-12-01'>=from_date and '2018-12-01'<=to_date) or ('2018-12-04'>=from_date and
// '2018-12-04'<=to_date) ) and employee_id=94
module.exports = {
  getEmployeeLeaveData: getEmployeeLeaveData,
  applyEmployeeLeave: applyEmployeeLeave,
  getEmployeeLeaveHistory: getEmployeeLeaveHistory,
  getLeaveBalance: getLeaveBalance
};
//# sourceMappingURL=leave.js.map