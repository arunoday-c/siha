"use strict";
import extend from "extend";
import utils from "../../utils";
import httpStatus from "../../utils/httpStatus";

import logUtils from "../../utils/logging";
import moment from "moment";
import _ from "lodash";

const { debugLog } = logUtils;
const {
  // selectStatement,
  // whereCondition,
  // deleteRecord,
  // runningNumberGen,
  releaseDBConnection,
  jsonArrayToObject
} = utils;

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
      // let newDateList = [];
      // if (today >= start_of_year) {
      //   newDateList = getDaysArray(
      //     new Date(today),
      //     new Date(end_of_year),
      //     holidays
      //   );
      //   debugLog("present :");
      // } else if (start_of_year > today) {
      //   newDateList = getDaysArray(
      //     new Date(start_of_year),
      //     new Date(end_of_year),
      //     holidays
      //   );
      //   debugLog("next year:");
      // }
      let newDateList = [];

      newDateList = getDaysArray(
        new Date(start_of_year),
        new Date(end_of_year),
        holidays
      );
      debugLog("next year:");

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
        between date(?) and date(?) and hospital_id=? order by holiday_date " +
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
    sql.connect(config, function(err) {
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
    });
  } catch (e) {
    next(e);
  }
};
//created by irfan:
let getTimeSheetOLD = (req, res, next) => {
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
        let actual_hours = "";

        let year = moment(req.query.from_date).format("YYYY");
        const syscCall = async function(attDate, religion_id) {
          debugLog("am in synchronous");
          return await new Promise((resolve, reject) => {
            try {
              //St-----if Absent, 2 queries---1 for if he is on leave ----2 for is that day is holiday or weekoff
              connection.query(
                " select hims_f_leave_application_id ,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                where employee_id=?     and `status`='APR'  and date(?) \
                between date(from_date) and date(to_date) and LA.leave_id=L.hims_d_leave_id;\
                select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
                [2, attDate, attDate, attDate, attDate, religion_id],
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

        //St----- fetch biometric device info to connect
        connection.query(
          "select hims_d_hrms_options_id,salary_process_date,salary_pay_before_end_date,\
        payroll_payment_date,salary_calendar,salary_calendar_fixed_days,attendance_type,\
        fetch_punch_data_reporting,gratuity_in_final_settle,leave_level,loan_level,leave_encash_level,\
        review_auth_level,yearly_working_days,biometric_port_no,advance_deduction,overtime_payment,\
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
            actual_hours = result[0]["standard_working_hours"];
            if (
              result.length > 0 &&
              result[0]["biometric_database"] == "MSACCESS"
            ) {
              var sql = require("mssql");

              // config for your database
              var config = {
                user: result[0]["biometric_database_login"],
                password: result[0]["biometric_database_password"],

                server:
                  result[0]["biometric_server_name"] +
                  ":" +
                  result[0]["biometric_port_no"],
                database: result[0]["biometric_database_name"]
              };

              // connect to your database
              sql.connect(config, function(err) {
                if (err) {
                  debugLog("connection error");
                  next(err);
                }
                // create Request object
                var request = new sql.Request();
                let from_date = moment(req.query.from_date).format(
                  "YYYY-MM-DD"
                );
                let to_date = moment(req.query.to_date).format("YYYY-MM-DD");

                let biometric_id =
                  req.query.biometric_id > 0 ? req.query.biometric_id : [106];
                let bio_ids = "";

                if (req.query.biometric_id > 0) {
                  bio_ids = ` and TS.biometric_id=${req.query.biometric_id} `;
                }
                debugLog("from_date:", from_date);
                debugLog("to_date:", to_date);
                // query to the biometric database and get the records
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

                    if (timeSheetArray.length > 0) {
                      let _myPromises = [];
                      try {
                        for (let i = 0; i < timeSheetArray.length; i++) {
                          debugLog("value of i", i);

                          //--ST------IF HE PRESENT
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
                          }
                          //---------EN--IF HE PRESENT
                          //----------------------------ST--IF HE IS ABSENT
                          else if (
                            timeSheetArray[i]["in_time"] == null &&
                            timeSheetArray[i]["out_time"] == null
                          ) {
                            //check leave
                            debugLog("he did not come");

                            //--------------START OF WEEK HOLIDAY
                            let _timePass = syscCall(
                              timeSheetArray[i]["attendance_date"],
                              1
                            );

                            _myPromises.push(_timePass);
                            _timePass
                              .then(leaveHoliday => {
                                debugLog("am in result absent or holiday");
                                if (leaveHoliday[0].length > 0) {
                                  //its a leave
                                  if (leaveHoliday[0][0]["leave_type"] == "U") {
                                    timeSheetArray[i] = {
                                      ...timeSheetArray[i],
                                      hours: null,
                                      minutes: null,
                                      worked_hours: null,
                                      status: "UL"
                                    };
                                  } else if (
                                    leaveHoliday[0][0]["leave_type"] == "P"
                                  ) {
                                    timeSheetArray[i] = {
                                      ...timeSheetArray[i],
                                      hours: null,
                                      minutes: null,
                                      worked_hours: null,
                                      status: "PL"
                                    };
                                  }
                                } else if (leaveHoliday[1].length > 0) {
                                  if (leaveHoliday[1][0]["weekoff"] == "Y") {
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
                                  debugLog("absent:", timeSheetArray);
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
                          }

                          //---------END--IF HE IS ABSENT

                          //-------------------------------START OF--EXCEPTION
                          else if (
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

                          // if (i == timeSheetArray.length - 1) {
                          //   debugLog("am resolving");
                          //   resolve(timeSheetArray);
                          // }
                        }

                        // resolve(timeSheetArray);

                        debugLog("timeSheetArray:", timeSheetArray);

                        Promise.all(_myPromises)
                          .then(calcResult => {
                            debugLog("calcResult:", timeSheetArray);

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
                                ",actual_hours,year) VALUES ?",
                              [
                                jsonArrayToObject({
                                  sampleInputObject: insurtColumns,
                                  arrayObj: timeSheetArray,
                                  newFieldToInsert: [actual_hours, year]
                                })
                              ],
                              (error, insertResult) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                connection.query(
                                  " select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
                                    in_time, out_date, out_time, year, month, status,\
                                     posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
                                     expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
                                     from  hims_f_daily_time_sheet TS \
                                    left join hims_d_employee E on TS.biometric_id=E.biometric_id\
                                    where attendance_date between (?) and (?)" +
                                    bio_ids,
                                  [req.query.from_date, req.query.to_date],
                                  (error, retResult) => {
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
                                      req.records = retResult;
                                      next();
                                    });
                                  }
                                );
                              }
                            );
                          })
                          .catch(e => {
                            debugLog("e:", e);
                          });
                      } catch (e) {}
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
              });
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

    let bio_ids = "";

    if (req.query.bio_ids > 0) {
      bio_ids = ` and TS.biometric_id=${req.query.bio_ids} `;
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
          bio_ids,
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
let postTimeSheet = (req, res, next) => {
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    db.getConnection((error, connection) => {
      let from_date = moment(req.query.from_date).format("YYYY-MM-DD");
      let to_date = moment(req.query.to_date).format("YYYY-MM-DD");
      let employee_id = "";

      if (req.query.hims_d_employee_id > 0) {
        employee_id = "AND TS.employee_id=" + req.query.hims_d_employee_id;
      }

      const month_number = moment(from_date).format("M");
      const year = moment(from_date).format("YYYY");

      let dailyAttendance = [];
      connection.query(
        " select hims_f_daily_time_sheet_id,employee_id,TS.biometric_id,attendance_date,in_time,out_date,\
        out_time,year,month,status,posted,hours,minutes,actual_hours,actual_minutes,worked_hours,\
        expected_out_date,expected_out_time ,hims_d_employee_id,hospital_id,sub_department_id \
        from hims_f_daily_time_sheet TS ,hims_d_employee E where  date(attendance_date) between\
                date(?) and date(?) and TS.employee_id=E.hims_d_employee_id " +
          employee_id,
        [from_date, to_date],
        (error, result) => {
          if (error) {
            releaseDBConnection(db, connection);
            next(error);
          }
          debugLog("result:", result);
          //  employee_id, hospital_id, sub_department_id, year, month
          if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
              dailyAttendance.push({
                employee_id: result[i]["hims_d_employee_id"],
                hospital_id: result[i]["hospital_id"],
                sub_department_id: result[i]["sub_department_id"],
                year: year,
                month: month_number,
                attendance_date: result[i]["attendance_date"],
                total_days: 1,
                present_days: result[i]["status"] == "PR" ? 1 : 0,
                absent_days: result[i]["status"] == "AB" ? 1 : 0,
                total_work_days: result[i]["status"] == "PR" ? 1 : 0,
                weekoff_days: result[i]["status"] == "WO" ? 1 : 0,
                holidays: result[i]["status"] == "HO" ? 1 : 0,
                paid_leave: result[i]["status"] == "PL" ? 1 : 0,
                unpaid_leave: result[i]["status"] == "UL" ? 1 : 0,
                total_hours: result[i]["worked_hours"],
                hours: result[i]["hours"],
                minutes: result[i]["minutes"],

                working_hours:
                  result[i]["actual_hours"] + result[i]["actual_minutes"]
              });
            }
            debugLog("dailyAttendance:", dailyAttendance);
            connection.beginTransaction(error => {
              if (error) {
                connection.rollback(() => {
                  releaseDBConnection(db, connection);
                  next(error);
                });
              }
              const insurtColumns = [
                "employee_id",
                "hospital_id",
                "sub_department_id",
                "year",
                "month",
                "attendance_date",
                "total_days",
                "present_days",
                "absent_days",
                "total_work_days",
                "weekoff_days",
                "holidays",
                "paid_leave",
                "unpaid_leave",
                "hours",
                "minutes",
                "total_hours",
                "working_hours"
              ];

              connection.query(
                "INSERT   INTO hims_f_daily_attendance(" +
                  insurtColumns.join(",") +
                  ") VALUES ? ON DUPLICATE KEY UPDATE employee_id=values(employee_id),hospital_id=values(hospital_id),sub_department_id=values(sub_department_id),\
                year=values(year),month=values(month),attendance_date=values(attendance_date),total_days=values(total_days),\
                present_days=values(present_days),absent_days=values(absent_days),total_work_days=values(total_work_days),\
                weekoff_days=values(weekoff_days),holidays=values(holidays),paid_leave=values(paid_leave),\
                unpaid_leave=values(unpaid_leave),hours=values(hours),minutes=values(minutes),total_hours=values(total_hours),\
                working_hours=values(working_hours)",
                [
                  jsonArrayToObject({
                    sampleInputObject: insurtColumns,
                    arrayObj: dailyAttendance
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
                    req.records = insertResult;
                    next();
                  });
                }
              );
            });
          } else {
            releaseDBConnection(db, connection);
            req.records = {
              no_data: true,
              message: "no data found for this date range"
            };
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
        let actual_hours = "";

        let year = moment(req.query.from_date).format("YYYY");
        const syscCall = async function(attDate, religion_id) {
          debugLog("am in synchronous");
          return await new Promise((resolve, reject) => {
            try {
              //St-----if Absent, 2 queries---1 for if he is on leave ----2 for is that day is holiday or weekoff
              connection.query(
                " select hims_f_leave_application_id ,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                where employee_id=?     and `status`='APR'  and date(?) \
                between date(from_date) and date(to_date) and LA.leave_id=L.hims_d_leave_id;\
                select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
                [2, attDate, attDate, attDate, attDate, religion_id],
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

        //St----- fetch biometric device info to connect
        connection.query(
          "select hims_d_hrms_options_id,salary_process_date,salary_pay_before_end_date,\
        payroll_payment_date,salary_calendar,salary_calendar_fixed_days,attendance_type,\
        fetch_punch_data_reporting,gratuity_in_final_settle,leave_level,loan_level,leave_encash_level,\
        review_auth_level,yearly_working_days,biometric_port_no,advance_deduction,overtime_payment,\
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
            actual_hours = result[0]["standard_working_hours"];
            if (
              result.length > 0 &&
              result[0]["biometric_database"] == "MSACCESS"
            ) {
              var sql = require("mssql");

              // config for your database
              var config = {
                user: result[0]["biometric_database_login"],
                password: result[0]["biometric_database_password"],
                server:
                  result[0]["biometric_server_name"] +
                  ":" +
                  result[0]["biometric_port_no"],
                database: result[0]["biometric_database_name"]
              };

              // connect to your database
              sql.connect(config, function(err) {
                if (err) {
                  debugLog("connection error");
                  next(err);
                }
                // create Request object
                var request = new sql.Request();
                let from_date = moment(req.query.from_date).format(
                  "YYYY-MM-DD"
                );
                let to_date = moment(req.query.to_date).format("YYYY-MM-DD");

                let biometric_id =
                  req.query.biometric_id > 0 ? req.query.biometric_id : [106];
                let bio_ids = "";

                if (req.query.biometric_id > 0) {
                  bio_ids = ` and TS.biometric_id=${req.query.biometric_id} `;
                }
                debugLog("from_date:", from_date);
                debugLog("to_date:", to_date);
                // query to the biometric database and get the records
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

                    if (timeSheetArray.length > 0) {
                      let _myPromises = [];
                      try {
                        for (let i = 0; i < timeSheetArray.length; i++) {
                          debugLog("value of i", i);

                          //--ST------IF HE PRESENT
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
                          }
                          //---------EN--IF HE PRESENT
                          //----------------------------ST--IF HE IS ABSENT
                          else if (
                            timeSheetArray[i]["in_time"] == null &&
                            timeSheetArray[i]["out_time"] == null
                          ) {
                            //check leave
                            debugLog("he did not come");

                            //--------------START OF WEEK HOLIDAY
                            let _timePass = syscCall(
                              timeSheetArray[i]["attendance_date"],
                              1
                            );

                            _myPromises.push(_timePass);
                            _timePass
                              .then(leaveHoliday => {
                                debugLog("am in result absent or holiday");
                                if (leaveHoliday[0].length > 0) {
                                  //its a leave
                                  if (leaveHoliday[0][0]["leave_type"] == "U") {
                                    timeSheetArray[i] = {
                                      ...timeSheetArray[i],
                                      hours: null,
                                      minutes: null,
                                      worked_hours: null,
                                      status: "UL"
                                    };
                                  } else if (
                                    leaveHoliday[0][0]["leave_type"] == "P"
                                  ) {
                                    timeSheetArray[i] = {
                                      ...timeSheetArray[i],
                                      hours: null,
                                      minutes: null,
                                      worked_hours: null,
                                      status: "PL"
                                    };
                                  }
                                } else if (leaveHoliday[1].length > 0) {
                                  if (leaveHoliday[1][0]["weekoff"] == "Y") {
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
                                  debugLog("absent:", timeSheetArray);
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
                          }

                          //---------END--IF HE IS ABSENT

                          //-------------------------------START OF--EXCEPTION
                          else if (
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

                          // if (i == timeSheetArray.length - 1) {
                          //   debugLog("am resolving");
                          //   resolve(timeSheetArray);
                          // }
                        }

                        // resolve(timeSheetArray);

                        debugLog("timeSheetArray:", timeSheetArray);

                        Promise.all(_myPromises)
                          .then(calcResult => {
                            debugLog("calcResult:", timeSheetArray);

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
                                ",actual_hours,year) VALUES ?",
                              [
                                jsonArrayToObject({
                                  sampleInputObject: insurtColumns,
                                  arrayObj: timeSheetArray,
                                  newFieldToInsert: [actual_hours, year]
                                })
                              ],
                              (error, insertResult) => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                connection.query(
                                  " select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
                                    in_time, out_date, out_time, year, month, status,\
                                     posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
                                     expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
                                     from  hims_f_daily_time_sheet TS \
                                    left join hims_d_employee E on TS.biometric_id=E.biometric_id\
                                    where attendance_date between (?) and (?)" +
                                    bio_ids,
                                  [req.query.from_date, req.query.to_date],
                                  (error, retResult) => {
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
                                      req.records = retResult;
                                      next();
                                    });
                                  }
                                );
                              }
                            );
                          })
                          .catch(e => {
                            debugLog("e:", e);
                          });
                      } catch (e) {}
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
              });
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

export default {
  addWeekOffs,
  getAllHolidays,
  addHoliday,
  deleteHoliday,
  getMSDb,
  getTimeSheet,
  getDailyTimeSheet,
  postTimeSheet
};
// select employee_id,hospital_id,sub_department_id,year,month,sum(total_days)as total_days,sum(present_days)as present_days,sum(absent_days)as absent_days,
// sum(total_work_days)as total_work_days,sum(weekoff_days)as weekoff_days,sum(holidays)as holidays,
// sum(paid_leave)as paid_leave,sum(unpaid_leave)as unpaid_leave,sum(hours)as hours,sum(minutes)as minutes,
// COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) as total_hours,
// sum(working_hours)as working_hours  from hims_f_daily_attendance where
// sub_department_id=26 and year=2019 and month=1 group by employee_id
