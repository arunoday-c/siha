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

//created by irfan: to define all week off's for particular year
let addWeekOffs = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let input = extend({}, req.body);
    debugLog("input:", input);

    const year = moment("'" + input.year + "'").format("YYYY");

    debugLog("year:", year);
    const today = moment().format("YYYY-MM-DD");
    debugLog("today:", today);

    const start_of_year = moment(year)
      .startOf("year")
      .format("YYYY-MM-DD");
    debugLog("start_of_year:", start_of_year);

    const end_of_year = moment(year)
      .endOf("year")
      .format("YYYY-MM-DD");
    debugLog("end_of_year:", end_of_year);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      let holidays = [];

      let inputDays = [
        req.body.sunday,
        req.body.monday,
        req.body.tuesday,
        req.body.wednesday,
        req.body.thursday,
        req.body.friday,
        req.body.saturday
      ];

      for (let d = 0; d < 7; d++) {
        if (inputDays[d] == "Y") {
          holidays.push(d);
        }
      }

      debugLog("holidays:", holidays);
      let newDateList = [];
      if (today >= start_of_year) {
        newDateList = getDaysArray(
          new Date(today),
          new Date(end_of_year),
          holidays
        );
        debugLog("present :");
      } else if (start_of_year > today) {
        newDateList = getDaysArray(
          new Date(start_of_year),
          new Date(end_of_year),
          holidays
        );
        debugLog("next year:");
      }

      newDateList.map(v => v.toLocaleString());

      debugLog("newDateList:", newDateList);
      debugLog("newDateList len:", newDateList.length);

      connection.query(
        "select hims_d_holiday_id,hospital_id,holiday_date,\
        holiday_description,weekoff,holiday,holiday_type\
        from  hims_d_holiday  where record_status='A' and date(holiday_date) \
        between date(?) and date(?) and hospital_id=? ",
        [start_of_year, end_of_year, input.hospital_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (result.length > 0) {
            releaseDBConnection(db, connection);
            req.records = {
              weekOff_exist: true,
              message: "week off is already defind for the year " + year
            };
            next();
            return;
          } else if (newDateList.length > 0) {
            const insurtColumns = ["holiday_date", "created_by", "updated_by"];
            debugLog("kkkkkkkkkkkkkkkk:", newDateList);

            connection.query(
              "INSERT INTO hims_d_holiday(" +
                insurtColumns.join(",") +
                ",hospital_id, holiday_description ,weekoff,holiday,holiday_type,created_date,updated_date) VALUES ?",
              [
                jsonArrayToObject({
                  sampleInputObject: insurtColumns,
                  arrayObj: newDateList,
                  newFieldToInsert: [
                    input.hospital_id,
                    "Week Off",
                    "Y",
                    "N",
                    "RE",

                    new Date(),
                    new Date()
                  ],
                  req: req
                })
              ],
              (error, weekOfResult) => {
                releaseDBConnection(db, connection);
                if (error) {
                  next(error);
                }
                debugLog("weekOfResult:", weekOfResult);
                req.records = weekOfResult;
                next();
              }
            );
          } else {
            releaseDBConnection(db, connection);
            req.records = {
              weekOff_exist: true,
              message: "please select week off days"
            };
            next();
            return;
          }
        }
      );
    });
    //query  ends
  } catch (e) {
    next(e);
  }
};

function getDaysArray(start, end, days) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    const dat = new Date(dt);
    const day = new Date(dat).getDay();

    if (days.indexOf(day) > -1) {
      arr.push({ holiday_date: dat });
    }
  }

  return arr;
}

//created by irfan: fetch all holidays
let getAllHolidays = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    const start_of_year = moment()
      .startOf("year")
      .format("YYYY-MM-DD");

    debugLog("start_of_year:", start_of_year);

    const end_of_year = moment()
      .endOf("year")
      .format("YYYY-MM-DD");
    debugLog("end_of_year:", end_of_year);

    let type = " ";
    if (req.query.type == "W") {
      type = " and  H.weekoff='Y' ";
    } else if (req.query.type == "H") {
      type = " and  H.holiday='Y' ";
    }
    db.getConnection((error, connection) => {
      connection.query(
        "select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
        holiday_type,religion_id,R.religion_name,R.arabic_religion_name from  hims_d_holiday  H left join\
        hims_d_religion R on H.religion_id=R.hims_d_religion_id where H.record_status='A' and date(holiday_date) \
        between date(?) and date(?) and hospital_id=? " +
          type,
        [start_of_year, end_of_year, req.query.hospital_id],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
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

//created by irfan: define a holiday
let addHoliday = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (
      req.body.religion_id == "null" ||
      req.body.religion_id == "" ||
      req.body.religion_id == null
    ) {
      delete req.body.religion_id;
    }
    let input = extend({}, req.body);

    db.getConnection((error, connection) => {
      if (error) {
        next(error);
      }

      connection.query(
        "select hims_d_holiday_id,hospital_id,holiday_date,holiday_description,weekoff,holiday,\
        holiday_type from  hims_d_holiday  where \
        record_status='A' and date(holiday_date) = date(?) and hospital_id=?",
        [input.holiday_date, input.hospital_id],
        (error, existResult) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }

          if (existResult.length > 0) {
            releaseDBConnection(db, connection);
            req.records = {
              holiday_exist: true,
              message:
                "holiday is already defind for this :" + input.holiday_date
            };
            next();
            return;
          } else {
            connection.query(
              "INSERT INTO `hims_d_holiday` (hospital_id,holiday_date,holiday_description,\
          weekoff,holiday,holiday_type,religion_id, created_date, created_by, updated_date, updated_by)\
          VALUE(?,date(?),?,?,?,?,?,?,?,?,?)",
              [
                input.hospital_id,
                input.holiday_date,
                input.holiday_description,
                "N",
                "Y",
                input.holiday_type,
                input.religion_id,
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
          }
        }
      );
    });
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let deleteHoliday = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    if (
      req.body.hims_d_holiday_id != "null" &&
      req.body.hims_d_holiday_id != undefined
    ) {
      db.getConnection((error, connection) => {
        connection.query(
          " DELETE FROM hims_d_holiday WHERE hims_d_holiday_id = ?; ",
          [req.body.hims_d_holiday_id],
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

//created by irfan: connect to other db
let getMSDb = (req, res, next) => {
  try {
    var sql = require("mssql");

    // config for your database
    var config = {
      user: "sa",
      password: "sa123",

      server: "192.168.0.169",
      database: "datacosec"
    };

    debugLog("am in get MS DB");
    debugLog("sql", sql);

    // connect to your database
    sql.connect(
      config,
      function(err) {
        if (err) {
          debugLog("connection error");
          next(err);
        }
        // create Request object
        var request = new sql.Request();

        // query to the database and get the records
        request.query(" select  TOP (100) *   from Mx_DATDTrn ", function(
          err,
          result
        ) {
          if (err) {
            debugLog("query error");
            next(err);
          }
          //request.close();

          debugLog("result:", result);
          // send records as a response
          req.records = result["recordset"];
          sql.close();
          next();
        });
      }
    );
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let getTimeSheet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    db.getConnection((error, connection) => {
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }
        let timeSheetArray = [];
        // if (from_date == to_date) {
        // var startTime = moment("12:16:00 ", "hh:mm:ss");
        // var endTime = moment("21:15:00", "hh:mm:ss");
        // var workMinutes = endTime.diff(startTime, "minutes");

        // debugLog("workMinutes:", workMinutes);

        // let hours = parseInt(parseFloat(workMinutes) / parseFloat(60));
        // hours = hours > 0 ? hours : "0";
        // debugLog("hours:", hours);

        // let minutes = parseFloat(workMinutes) % parseFloat(60);
        // debugLog("minutes:", minutes);

        // let worked_hours = hours + "." + minutes;
        // debugLog("worked_hours:", worked_hours);
        // }
        const syscCall = async function(attDate, religion_id) {
          debugLog("am in synchronous");
          return await new Promise((resolve, reject) => {
            try {
              connection.query(
                " select * from hims_f_leave_application where employee_id=? and cancelled='N'\
                and (`status`='APR' or `status`='PRO') and date(?) \
                between date(from_date) and date(to_date);\
                select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
                [1, attDate, attDate, attDate, attDate, religion_id],
                (error, leaveHoliday) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  resolve(leaveHoliday);
                }
              );
            } catch (e) {
              reject(e);
            }
          });
        };

        connection.query(
          "select hims_d_hrms_options_id,salary_process_date,salary_pay_before_end_date,\
        payroll_payment_date,salary_calendar,salary_calendar_fixed_days,attendance_type,\
        fetch_punch_data_reporting,gratuity_in_final_settle,leave_level,loan_level,leave_encash_level,\
        review_auth_level,yearly_working_days,end_of_service_calculation,advance_deduction,overtime_payment,\
        overtime_calculation,overtime_hourly_calculation,standard_intime,standard_outime,\
        standard_working_hours,standard_break_hours,biometric_database,biometric_server_name,\
        biometric_database_name,biometric_database_login,biometric_database_password,\
        biometric_swipe_id from hims_d_hrms_options",
          (error, result) => {
            if (error) {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            if (
              result.length > 0 &&
              result[0]["biometric_database"] == "MSACCESS"
            ) {
              var sql = require("mssql");

              // config for your database
              var config = {
                user: result[0]["biometric_database_login"],
                password: result[0]["biometric_database_password"],

                server: result[0]["biometric_server_name"],
                database: result[0]["biometric_database_name"]
              };

              // connect to your database
              sql.connect(
                config,
                function(err) {
                  if (err) {
                    debugLog("connection error");
                    next(err);
                  }
                  // create Request object
                  var request = new sql.Request();
                  let from_date = moment("2017-05-01").format("YYYY-MM-DD");
                  let to_date = moment("2017-07-31").format("YYYY-MM-DD");

                  let biometric_id = [101, 106, 108];

                  debugLog("from_date:", from_date);
                  debugLog("to_date:", to_date);
                  // query to the database and get the records
                  request.query(
                    ` select  TOP (100) UserID as biometric_id ,PDate as attendance_date,Punch1 as in_time,Punch2 as out_time,\
            Punch2 as out_date   from Mx_DATDTrn  where UserID in (${biometric_id}) and PDate>='${from_date}'  and\
            PDate<='${to_date}'`,
                    function(err, attResult) {
                      if (err) {
                        debugLog("query error");
                        next(err);
                      }

                      debugLog("attResult:", attResult);

                      timeSheetArray = attResult["recordset"];
                      sql.close();
                      //next();

                      // var startTime = moment("12:16:59 am", 'hh:mm:ss a');
                      // var endTime = moment("06:12:07 pm", 'hh:mm:ss a');

                      // endTime.diff(startTime, 'hours');
                      if (timeSheetArray.length > 0) {
                        new Promise((resolve, reject) => {
                          try {
                            const forloop = async function() {
                              for (let i = 0; i < timeSheetArray.length; i++) {
                                if (
                                  timeSheetArray[i]["in_time"] != null &&
                                  timeSheetArray[i]["out_time"] != null
                                ) {
                                  let startTime = moment(
                                    timeSheetArray[i]["in_time"],
                                    "hh:mm:ss"
                                  );
                                  let endTime = moment(
                                    timeSheetArray[i]["out_time"],
                                    "hh:mm:ss"
                                  );
                                  let workMinutes = endTime.diff(
                                    startTime,
                                    "minutes"
                                  );

                                  debugLog("workMinutes:", workMinutes);

                                  let hours = parseInt(
                                    parseFloat(workMinutes) / parseFloat(60)
                                  );
                                  hours = hours > 0 ? hours : "0";
                                  debugLog("hours:", hours);

                                  let minutes =
                                    parseFloat(workMinutes) % parseFloat(60);
                                  debugLog("minutes:", minutes);

                                  // let worked_hours = hours + "." + minutes;

                                  let worked_hours = "";
                                  if (minutes < 10) {
                                    worked_hours = hours + ".0" + minutes;
                                  } else {
                                    worked_hours = hours + "." + minutes;
                                  }
                                  debugLog("worked_hours:", worked_hours);

                                  timeSheetArray[i] = {
                                    ...timeSheetArray[i],
                                    hours: hours,
                                    minutes: minutes,
                                    worked_hours: worked_hours,
                                    status: "PR"
                                  };
                                } else if (
                                  timeSheetArray[i]["in_time"] == null &&
                                  timeSheetArray[i]["out_time"] == null
                                ) {
                                  //check leave
                                  debugLog("he did not come");

                                  //--------------START OF WEEK HOLIDAY
                                  syscCall(
                                    timeSheetArray[i]["attendance_date"],
                                    1
                                  )
                                    .then(leaveHoliday => {
                                      debugLog("am in result of out quey");
                                      if (leaveHoliday[0].length > 0) {
                                        //its a leave

                                        timeSheetArray[i] = {
                                          ...timeSheetArray[i],
                                          hours: null,
                                          minutes: null,
                                          worked_hours: null,
                                          status: "LV"
                                        };
                                      } else if (leaveHoliday[1].length > 0) {
                                        if (
                                          leaveHoliday[1][0]["weekoff"] == "Y"
                                        ) {
                                          // its a week off
                                          debugLog("week off");
                                          timeSheetArray[i] = {
                                            ...timeSheetArray[i],
                                            hours: null,
                                            minutes: null,
                                            worked_hours: null,
                                            status: "WO"
                                          };
                                        } else if (
                                          leaveHoliday[1][0]["holiday"] == "Y"
                                        ) {
                                          // its a holiday
                                          debugLog("holiday");
                                          timeSheetArray[i] = {
                                            ...timeSheetArray[i],
                                            hours: null,
                                            minutes: null,
                                            worked_hours: null,
                                            status: "HO"
                                          };
                                        }
                                      } else {
                                        //its Absent
                                        debugLog("absent");
                                        timeSheetArray[i] = {
                                          ...timeSheetArray[i],
                                          hours: null,
                                          minutes: null,
                                          worked_hours: null,
                                          status: "AB"
                                        };
                                      }
                                    })
                                    .catch(e => {});
                                  //---------END OF HOLIDAY WEEK OFF
                                } else if (
                                  (timeSheetArray[i]["in_time"] == null &&
                                    timeSheetArray[i]["out_time"] != null) ||
                                  (timeSheetArray[i]["in_time"] != null &&
                                    timeSheetArray[i]["out_time"] == null)
                                ) {
                                  timeSheetArray[i] = {
                                    ...timeSheetArray[i],
                                    hours: null,
                                    minutes: null,
                                    worked_hours: null,
                                    status: "EX"
                                  };

                                  debugLog("exwcption:", timeSheetArray);
                                }

                                if (i == timeSheetArray.length - 1) {
                                  debugLog("am resolving");
                                  resolve(timeSheetArray);
                                }
                              }
                            };
                            forloop();
                            // resolve(timeSheetArray);

                            debugLog("timeSheetArray:", timeSheetArray);
                          } catch (e) {
                            reject(e);
                          }
                        }).then(calcResult => {
                          debugLog("calcResult:", calcResult);
                          const insurtColumns = [
                            "biometric_id",
                            "attendance_date",
                            "in_time",
                            "out_date",
                            "out_time",
                            "status",
                            "hours",
                            "minutes",
                            "worked_hours"
                          ];

                          connection.query(
                            "INSERT IGNORE  INTO hims_f_daily_time_sheet(" +
                              insurtColumns.join(",") +
                              ") VALUES ?",
                            [
                              jsonArrayToObject({
                                sampleInputObject: insurtColumns,
                                arrayObj: calcResult
                              })
                            ],
                            (error, insertResult) => {
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

                                debugLog("commit");
                                releaseDBConnection(db, connection);
                                req.records = insertResult;
                                next();
                              });
                            }
                          );
                        });
                      } else {
                        req.records = {
                          invalid_data: true,
                          message: "no punches exist"
                        };
                        connection.rollback(() => {
                          releaseDBConnection(db, connection);
                          next();
                        });
                      }
                    }
                  );
                }
              );
            } else {
              //no matchimg data
              req.records = {
                invalid_data: true,
                message: "biometric database not found"
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
  } catch (e) {
    next(e);
  }
};

//created by irfan:
let getDailyTimeSheet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;

    let biometric_id = "";

    if (req.query.biometric_id > 0) {
      biometric_id = ` and TS.biometric_id=${req.query.biometric_id} `;
    }
    db.getConnection((error, connection) => {
      connection.query(
        " select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
        in_time, out_date, out_time, year, month, status,\
         posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
         expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
         from  hims_f_daily_time_sheet TS \
        left join hims_d_employee E on TS.biometric_id=E.biometric_id\
        where attendance_date between (?) and (?)" +
          biometric_id,
        [req.query.from_date, req.query.to_date],
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
let processTimeSheet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      const syscCall = async function(attDate, religion_id) {
        debugLog("am in synchronous");
        return await new Promise((resolve, reject) => {
          try {
            connection.query(
              " select * from hims_f_leave_application where employee_id=1 and cancelled='N'\
              and (`status`='APR' or `status`='PRO') and date(?) \
              between date(from_date) and date(to_date);\
              select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
              from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
              (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
              (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
              [attDate, attDate, attDate, attDate, religion_id],
              (error, leaveHoliday) => {
                if (error) {
                  connection.rollback(() => {
                    releaseDBConnection(db, connection);
                    next(error);
                  });
                }

                resolve(leaveHoliday);
              }
            );
          } catch (e) {
            reject(e);
          }
        });
      };

      for (let i = 0; i < 10; i++) {
        syscCall("2017-05-05", 1).then(result => {
          debugLog("result:", result);
        });
      }
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addWeekOffs,
  getAllHolidays,
  addHoliday,
  deleteHoliday,
  getMSDb,
  getTimeSheet,
  getDailyTimeSheet
};
