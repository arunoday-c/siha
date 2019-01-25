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
                                      debugLog("leaveHoliday:", leaveHoliday);
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
