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
postTimeSheet: (req, res, next) => {
  let input = req.query;
  const utilities = new algaehUtilities();

  let from_date = moment(input.from_date).format("YYYY-MM-DD");
  let to_date = moment(input.to_date).format("YYYY-MM-DD");
  let stringData = "";

  if (
    input.hospital_id > 0 &&
    (input.hims_d_employee_id > 0 || input.sub_department_id > 0)
  ) {
    if (input.hims_d_employee_id > 0) {
      stringData = "AND TS.employee_id=" + input.hims_d_employee_id;
    }

    if (input.sub_department_id > 0) {
      stringData = "AND TS.sub_department_id=" + input.sub_department_id;
    }

    const _mysql = new algaehMysql();
    _mysql
      .executeQuery({
        query:
          " select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.biometric_id,attendance_date,in_time,out_date,\
        out_time,year,month,status,posted,hours,minutes,actual_hours,actual_minutes,worked_hours,\
        expected_out_date,expected_out_time ,hims_d_employee_id,TS.hospital_id,TS.sub_department_id \
        from hims_f_daily_time_sheet TS ,hims_d_employee E where TS.hospital_id=? and  date(attendance_date) between\
                date(?) and date(?) and  TS.employee_id=E.hims_d_employee_id " +
          stringData,
        values: [input.hospital_id, from_date, to_date],
        printQuery: true
      })
      .then(result => {
        // utilities.logger().log("result: ",result);

        if (result.length > 0) {
          let excptions = new LINQ(result)
            .Where(w => w.status == "EX")
            .Select(s => {
              return {
                employee_code: s.employee_code,
                employee_name: s.full_name,
                attendance_date: s.attendance_date
              };
            })
            .ToArray();

          utilities.logger().log("excptions: ", excptions);

          if (excptions.length == 0) {
            req.records = {
              invalid_input: true,
              employees: excptions,
              message: "Please Regularize attendance for these employees"
            };

            next();
            return;
          } else {
            for (let i = 0; i < result.length; i++) {
              let total_minutes =
                parseInt(result[i]["actual_hours"] * 60) +
                parseInt(result[i]["actual_minutes"]);
              let worked_minutes =
                parseInt(result[i]["hours"] * 60) +
                parseInt(result[i]["minutes"]);
              let diff = total_minutes - worked_minutes;
              let shortage_time = 0;
              let ot_time = 0;

              if (diff > 0) {
                //calculating shortage
                shortage_time =
                  parseInt(parseInt(diff) / parseInt(60)) +
                  "." +
                  (parseInt(diff) % parseInt(60));
              } else if (diff < 0) {
                //calculating over time
                ot_time =
                  parseInt(parseInt(Math.abs(diff)) / parseInt(60)) +
                  "." +
                  (parseInt(Math.abs(diff)) % parseInt(60));
              }

              utilities.logger().log("diff: ", diff);
              utilities.logger().log("ot_time: ", ot_time);
              utilities.logger().log("shortage_time: ", shortage_time);

              dailyAttendance.push({
                employee_id: result[i]["hims_d_employee_id"],
                hospital_id: result[i]["hospital_id"],
                sub_department_id: result[i]["sub_department_id"],
                attendance_date: result[i]["attendance_date"],
                year: moment(result[i]["attendance_date"]).format("YYYY"),
                month: moment(result[i]["attendance_date"]).format("M"),
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
                  result[i]["actual_hours"] + "." + result[i]["actual_minutes"],
                shortage_hours: shortage_time,
                ot_work_hours: ot_time
              });
            }
          }
        } else {
          _mysql.releaseConnection();
          req.records = {
            invalid_input: true,
            message: "No Data Found for this date range"
          };
          next();
          return;
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  } else {
    req.records = {
      invalid_input: true,
      message: "Please provide valid input"
    };

    next();
    return;
  }
};
