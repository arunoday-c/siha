if (timeSheetArray.length > 0) {
  new Promise((resolve, reject) => {
    try {
      for (let i = 0; i < timeSheetArray.length; i++) {
        if (
          timeSheetArray[i]["in_time"] != null &&
          timeSheetArray[i]["out_time"] != null
        ) {
          let startTime = moment(timeSheetArray[i]["in_time"], "hh:mm:ss");
          let endTime = moment(timeSheetArray[i]["out_time"], "hh:mm:ss");
          let workMinutes = endTime.diff(startTime, "minutes");

          debugLog("workMinutes:", workMinutes);

          let hours = parseInt(parseFloat(workMinutes) / parseFloat(60));
          hours = hours > 0 ? hours : "0";
          debugLog("hours:", hours);

          let minutes = parseFloat(workMinutes) % parseFloat(60);
          debugLog("minutes:", minutes);

          let workedHours = hours + "." + minutes;
          debugLog("workedHours:", workedHours);

          timeSheetArray[i] = {
            ...timeSheetArray[i],
            hours: hours,
            minutes: minutes,
            workedHours: workedHours,
            status: "PR"
          };
        } else if (
          timeSheetArray[i]["in_time"] == null &&
          timeSheetArray[i]["out_time"] == null
        ) {
          //check leave

          // select * from hims_f_leave_application where employee_id=1 and cancelled='N'
          // and (`status`='APR' or `status`='PRO') and date('2019-02-05')
          // between date(from_date) and date(to_date);

          //week off

          //    select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday
          // from hims_d_holiday where (((date(holiday_date)= date('2019-01-05') and weekoff='Y') or
          // (date(holiday_date)=date('2019-01-05') and holiday='Y' and holiday_type='RE') or
          // (date(holiday_date)=date('2019-01-05') and holiday='Y' and holiday_type='RS' and religion_id=1)))
          //holiday
          //absent
          new Promise((resolve, reject) => {
            try {
              connection.query(
                " select * from hims_f_leave_application where employee_id=1 and cancelled='N'\
                and (`status`='APR' or `status`='PRO') and date(?) \
                between date(from_date) and date(to_date);\
                select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday\
                from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))); ",
                [
                  timeSheetArray[i]["attendance_date"],
                  timeSheetArray[i]["attendance_date"],
                  timeSheetArray[i]["attendance_date"],
                  timeSheetArray[i]["attendance_date"],
                  1
                ],
                (error, leaveHoliday) => {
                  if (error) {
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  debugLog("leave:", leaveHoliday[0]);
                  debugLog("leave:", leaveHoliday[1]);
                }
              );
            } catch (e) {
              reject(e);
            }
          }).then(leaveHoliday => {
            if (leaveHoliday[0].length > 0) {
              //its a leave

              timeSheetArray[i] = {
                ...timeSheetArray[i],
                hours: null,
                minutes: null,
                workedHours: null,
                status: "LV"
              };
            } else if (leaveHoliday[1].length > 0) {
              if (leaveHoliday[1][0]["weekoff"] == "Y") {
                // its a week off

                timeSheetArray[i] = {
                  ...timeSheetArray[i],
                  hours: null,
                  minutes: null,
                  workedHours: null,
                  status: "WO"
                };
              } else if (leaveHoliday[1][0]["holiday"] == "Y") {
                // its a holiday

                timeSheetArray[i] = {
                  ...timeSheetArray[i],
                  hours: null,
                  minutes: null,
                  workedHours: null,
                  status: "HO"
                };
              }
            } else {
              //its Absent

              timeSheetArray[i] = {
                ...timeSheetArray[i],
                hours: null,
                minutes: null,
                workedHours: null,
                status: "AB"
              };
              debugLog("absent:", timeSheetArray);
            }
          });
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
            workedHours: null,
            status: "EX"
          };

          debugLog("exwcption:", timeSheetArray);
        }
      }

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
      "out_time"
    ];

    connection.query(
      "INSERT IGNORE  INTO hims_f_daily_time_sheet(" +
        insurtColumns.join(",") +
        ") VALUES ?",
      [
        jsonArrayToObject({
          sampleInputObject: insurtColumns,
          arrayObj: attResult["recordset"]
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
}
