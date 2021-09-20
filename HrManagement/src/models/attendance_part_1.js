import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
//created by irfan: to insert timesheet
export function insertTimeSheet(
  returnQry,
  biometricData,
  AllLeaves,
  allHolidays,
  from_date,
  to_date,
  _mysql,
  req,
  res,
  next,
  singleEmployee
) {
  const utilities = new algaehUtilities();

  let insertArray = [];
  try {
    if (singleEmployee == "N") {
      for (let i = 0; i < biometricData.length; i++) {
        if (
          biometricData[i]["in_time"] != null &&
          biometricData[i]["out_time"] != null
        ) {
          //present
          insertArray.push({ ...biometricData[i], status: "PR" });
        } else if (
          (biometricData[i]["out_time"] == null &&
            biometricData[i]["in_time"] != null) ||
          (biometricData[i]["out_time"] != null &&
            biometricData[i]["in_time"] == null)
        ) {
          //Exception
          insertArray.push({ ...biometricData[i], status: "EX" });
        } else if (
          biometricData[i]["out_time"] == null ||
          biometricData[i]["in_time"] == null
        ) {
          let leave = new LINQ(AllLeaves)
            .Where(
              (w) =>
                w.employee_id == biometricData[i]["hims_d_employee_id"] &&
                w.from_date <= biometricData[i]["attendance_date"] &&
                w.to_date >= biometricData[i]["attendance_date"]
            )
            .Select((s) => {
              return {
                hims_f_leave_application_id: s.hims_f_leave_application_id,
                employee_id: s.employee_id,
                leave_id: s.leave_id,
                leave_description: s.leave_description,
                leave_type: s.leave_type,
                from_date: s.from_date,
                to_date: s.to_date,
                from_leave_session: s.from_leave_session,
                to_leave_session: s.to_leave_session,
                status: s.status,
              };
            })
            .ToArray();

          let empHolidayweekoff = getEmployeeWeekOffsHolidays(
            from_date,
            to_date,
            biometricData[i],
            allHolidays
          );

          let holidayweekoff = new LINQ(empHolidayweekoff)
            .Where((w) => w.holiday_date == from_date)
            .Select((s) => {
              return {
                holiday: s.holiday,
                weekoff: s.weekoff,
              };
            })
            .ToArray();

          if (leave.length > 0) {
            //check leave

            insertArray.push({
              ...biometricData[i],
              status: leave[0]["leave_type"] + "L",
            });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].weekoff == "Y"
          ) {
            //check weekoff

            insertArray.push({ ...biometricData[i], status: "WO" });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].holiday == "Y"
          ) {
            //check holiday

            insertArray.push({ ...biometricData[i], status: "HO" });
          } else {
            //else mark absent
            insertArray.push({ ...biometricData[i], status: "AB" });
          }
        }
      }
    } else {
      let empHolidayweekoff = getEmployeeWeekOffsHolidays(
        from_date,
        to_date,
        biometricData[0],
        allHolidays
      );

      for (let i = 0; i < biometricData.length; i++) {
        if (
          biometricData[i]["in_time"] != null &&
          biometricData[i]["out_time"] != null
        ) {
          //present
          insertArray.push({ ...biometricData[i], status: "PR" });
        } else if (
          (biometricData[i]["in_time"] != null &&
            biometricData[i]["out_time"] == null) ||
          (biometricData[i]["in_time"] == null &&
            biometricData[i]["out_time"] != null)
        ) {
          //Exception
          insertArray.push({ ...biometricData[i], status: "EX" });
        } else if (
          biometricData[i]["out_time"] == null ||
          biometricData[i]["in_time"] == null
        ) {
          let leave = new LINQ(AllLeaves)
            .Where(
              (w) =>
                w.employee_id == biometricData[i]["employee_id"] &&
                w.from_date <= biometricData[i]["attendance_date"] &&
                w.to_date >= biometricData[i]["attendance_date"]
            )
            .Select((s) => {
              return {
                hims_f_leave_application_id: s.hims_f_leave_application_id,
                employee_id: s.employee_id,
                leave_id: s.leave_id,
                leave_description: s.leave_description,
                leave_type: s.leave_type,
                from_date: s.from_date,
                to_date: s.to_date,
                from_leave_session: s.from_leave_session,
                to_leave_session: s.to_leave_session,
                status: s.status,
              };
            })
            .ToArray();

          let holidayweekoff = new LINQ(empHolidayweekoff)
            .Where((w) => w.holiday_date == biometricData[i]["attendance_date"])
            .Select((s) => {
              return {
                holiday: s.holiday,
                weekoff: s.weekoff,
              };
            })
            .ToArray();

          if (leave.length > 0) {
            //check leave

            insertArray.push({
              ...biometricData[i],
              status: leave[0]["leave_type"] + "L",
              actual_hours: 0,
              actual_minutes: 0,
            });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].weekoff == "Y"
          ) {
            //check weekoff
            insertArray.push({
              ...biometricData[i],
              status: "WO",
              actual_hours: 0,
              actual_minutes: 0,
            });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].holiday == "Y"
          ) {
            //check holiday

            insertArray.push({
              ...biometricData[i],
              status: "HO",
              actual_hours: 0,
              actual_minutes: 0,
            });
          } else {
            //else mark absent
            insertArray.push({
              ...biometricData[i],
              status: "AB",
            });
          }
        }
      }
    }

    // let month = moment(from_date).format("M");
    // let year = moment(from_date).format("YYYY");
    const insurtColumns = [
      "sub_department_id",
      "employee_id",
      "biometric_id",
      "attendance_date",
      "in_time",
      "out_date",
      "out_time",
      "status",
      "worked_hours",
      "actual_hours",
      "hours",
      "minutes",
      "actual_minutes",
      "expected_out_date",
      "expected_out_time",
      "hospital_id",
      "year",
      "month",
    ];

    // "INSERT INTO hims_f_daily_time_sheet(??) VALUES ?  ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
    // biometric_id=values(biometric_id),attendance_date=values(attendance_date),\
    // in_time=values(in_time),out_date=values(out_date),out_time=values(out_time),status=values(status),\
    // hours=values(hours),minutes=values(minutes),worked_hours=values(worked_hours),actual_hours=values(actual_hours)",
    _mysql
      .executeQueryWithTransaction({
        query: "INSERT IGNORE INTO hims_f_daily_time_sheet(??) VALUES ? ",
        values: insertArray,
        includeValues: insurtColumns,

        bulkInsertOrUpdate: true,
      })
      .then((finalResult) => {
        //------------------------------------------------

        _mysql
          .executeQuery({
            query: returnQry,
            printQuery: false,
          })
          .then((result) => {
            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = result;
            //   next();
            // });

            //ST-whole month ot,shortage calculate

            let month_actual_hours = 0;
            let month_worked_hours = 0;
            // let month_shortage_hour=0;
            // let month_ot_hour=0;

            let sum_actual_hour = 0;
            let sum_actual_min = 0;
            let sum_work_hour = 0;
            let sum_work_min = 0;

            //ST----total_min
            sum_actual_hour = new LINQ(result).Sum((s) => s.actual_hours);
            sum_actual_min = new LINQ(result).Sum((s) => s.actual_minutes);

            let total_min =
              parseInt(sum_actual_hour * 60) + parseInt(sum_actual_min);

            let month_actual_hr = parseInt(parseInt(total_min) / parseInt(60));
            let month_actual_min = parseInt(total_min) % parseInt(60);
            month_actual_hours = month_actual_hr + "." + month_actual_min;

            //EN----total_min

            //ST----worked_min
            sum_work_hour = new LINQ(result).Sum((s) => s.hours);
            sum_work_min = new LINQ(result).Sum((s) => s.minutes);

            let worked_min =
              parseInt(sum_work_hour * 60) + parseInt(sum_work_min);

            let month_worked_hr = parseInt(parseInt(worked_min) / parseInt(60));
            let month_worked_min = parseInt(worked_min) % parseInt(60);
            month_worked_hours = month_worked_hr + "." + month_worked_min;
            //EN----worked_min

            // let diff = total_min - worked_min;

            // if (diff > 0) {
            //   //calculating shortage
            // let shortage_hr = parseInt(parseInt(diff) / parseInt(60));
            // let shortage_min = parseInt(diff) % parseInt(60);
            // month_shortage_hour=shortage_hr+"."+shortage_min;
            // } else if (diff < 0) {
            //   //calculating over time
            //   let ot_hr = parseInt(parseInt(Math.abs(diff)) / parseInt(60));
            //   let ot_min = parseInt(Math.abs(diff)) % parseInt(60);
            //   month_ot_hour=ot_hr+"."+ot_min;
            // }

            //EN-whole month ot,shortage calculate

            //ST-indivisual date ot,shortage calculate
            let outputArray = [];
            for (let i = 0; i < result.length; i++) {
              let total_minutes =
                parseInt(result[i]["actual_hours"] * 60) +
                parseInt(result[i]["actual_minutes"]);
              let worked_minutes =
                parseInt(result[i]["hours"] * 60) +
                parseInt(result[i]["minutes"]);

              let diff = total_minutes - worked_minutes;

              let shortage_Time = 0;
              let ot_Time = 0;

              let shortage_hr = 0;
              let shortage_min = 0;

              let ot_hr = 0;
              let ot_min = 0;

              if (diff > 0) {
                //calculating shortage
                shortage_hr = parseInt(parseInt(diff) / parseInt(60));
                shortage_min = parseInt(diff) % parseInt(60);
                shortage_Time = shortage_hr + "." + shortage_min;
              } else if (diff < 0) {
                //calculating over time
                ot_hr = parseInt(parseInt(Math.abs(diff)) / parseInt(60));
                ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                ot_Time = ot_hr + "." + ot_min;
              }

              if (result[i].consider_ot_shrtg == "N") {
                shortage_Time = 0;
                shortage_hr = 0;
                shortage_min = 0;
                ot_Time = 0;
                ot_hr = 0;
                ot_min = 0;
              }
              outputArray.push({
                ...result[i],
                shortage_Time,
                shortage_hr,
                shortage_min,
                ot_Time,
                ot_hr,
                ot_min,
              });
            }
            //EN-indivisual date ot,shortage calculate

            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = {
                outputArray,
                month_actual_hours,
                month_worked_hours,
              };
              next();
            });
          })
          .catch((e) => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });

        //------------------------------------------------
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    next(e);
  }
}

//created by irfan: to generate dates
export function getDaysArray(start, end) {
  try {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      // const dat = new Date(dt);
      arr.push(moment(dt).format("YYYY-MM-DD"));
    }

    return arr;
  } catch (e) {}
}

//created by irfan: to generate dates,month,year
export function getDaysMonthArray(start, end) {
  try {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      // const dat = new Date(dt);

      arr.push({
        attendance_date: moment(dt).format("YYYY-MM-DD"),
        month: moment(dt).format("M"),
        year: moment(dt).format("YYYY"),
      });
    }

    return arr;
  } catch (e) {
    // console.log("dates:", e);
  }
}

//created by :irfan to validate entered time string
export function bulkTimeValidate(
  day,
  employee_code,
  STDWH,
  STDWM,
  HALF_HR,
  HALF_MIN
) {
  let actual_hours = 0;
  let actual_mins = 0;

  // console.log("1", STDWH)
  // console.log("2", STDWM)
  // console.log("3", day.status)
  if (day.status == "PR") {
    actual_hours = STDWH;
    actual_mins = STDWM;
  } else if (day.status == "HPL" || day.status == "HUL") {
    actual_hours = HALF_HR;
    actual_mins = HALF_MIN;
  }

  let time = String(day["worked_status"])
    .replace(/\s+?/g, "")
    .replace(/:+?/g, ".");

  if (time.length < 3) {
    const patt = "[0-9]?[0-9]";
    const output = time.match(patt);

    if (output == null) {
      return {
        error: true,
        message: ` invalid time for ${employee_code} on ${moment(
          day.attendance_date,
          "YYYY-MM-DD"
        ).format("DD-MM-YYYY")}`,
      };
    } else {
      const num = parseFloat(output[0]).toFixed(2).split(".");

      if (num[0] < 25 && num[1] < 60) {
        return {
          error: false,
          obj: {
            worked_hours: num[0] + "." + num[1],
            hours: num[0],
            minutes: num[1],
            actual_hours: day["RMZ_HR"] > 0 ? day["RMZ_HR"] : actual_hours,
            actual_minutes: day["RMZ_HR"] > 0 ? day["RMZ_MIN"] : actual_mins,
            employee_id: day.employee_id,
            attendance_date: day.attendance_date,
            status: day.status,
            sub_department_id: day.sub_department_id,
            project_id: day.project_id,
            is_anual_leave: day.leave_category == "A" ? "Y" : "N",
          },
        };
      } else {
        return {
          error: true,
          message: ` invalid time for ${employee_code} on
                        ${moment(day.attendance_date, "YYYY-MM-DD").format(
                          "DD-MM-YYYY"
                        )}`,
        };
      }
    }
  } else if (time.length < 6) {
    //  time=time.replace(/:+?/g,'.');
    const patt = "[0-9]?[0-9][.|:][0-9]?[0-9]";
    const output = time.match(patt);

    if (output == null) {
      return {
        error: true,
        message: ` invalid time for ${employee_code} on ${moment(
          day.attendance_date,
          "YYYY-MM-DD"
        ).format("DD-MM-YYYY")}`,
      };
    } else {
      // console.log("output:", output);
      const num = parseFloat(output[0]).toFixed(2).split(".");

      if (num[0] < 25 && num[1] < 60) {
        return {
          error: false,
          obj: {
            worked_hours: num[0] + "." + num[1],
            hours: num[0],
            minutes: num[1],

            actual_hours: day["RMZ_HR"] > 0 ? day["RMZ_HR"] : actual_hours,
            actual_minutes: day["RMZ_HR"] > 0 ? day["RMZ_MIN"] : actual_mins,

            employee_id: day.employee_id,
            attendance_date: day.attendance_date,
            status: day.status,
            sub_department_id: day.sub_department_id,
            project_id: day.project_id,
            is_anual_leave: day.leave_category == "A" ? "Y" : "N",
          },
        };
      } else {
        return {
          error: true,
          message: ` invalid time for ${employee_code} on
             ${moment(day.attendance_date, "YYYY-MM-DD").format("DD-MM-YYYY")}`,
        };
      }
    }
  } else {
    return {
      error: true,
      message: ` invalid time for ${employee_code} on ${moment(
        day.attendance_date,
        "YYYY-MM-DD"
      ).format("DD-MM-YYYY")}`,
    };
  }
}

//created by irfan: to getEmployeeWeekOffsHolidays
export function getEmployeeWeekOffsandHolidays(
  from_date,
  employee,
  allHolidays
) {
  try {
    //ST ----------- CALCULATING WEEK OFF AND HOLIDAYS
    let emp_holidays = [];
    if (
      employee["date_of_joining"] > from_date &&
      employee["exit_date"] == null
    ) {
      emp_holidays = allHolidays.filter((w) => {
        if (employee["week_day"]) {
          return (
            ((w.holiday == "Y" && w.holiday_type == "RE") ||
              (w.holiday == "Y" &&
                w.holiday_type == "RS" &&
                w.religion_id == employee["religion_id"]) ||
              moment(w.holiday_date).format("dd").toUpperCase() ===
                employee["week_day"]) &&
            w.holiday_date >= employee["date_of_joining"]
          );
        }
        return (
          ((w.holiday == "Y" && w.holiday_type == "RE") ||
            (w.holiday == "Y" &&
              w.holiday_type == "RS" &&
              w.religion_id == employee["religion_id"]) ||
            w.weekoff === "Y" ||
            moment(w.holiday_date).format("dd").toUpperCase() ===
              employee["week_day"]) &&
          w.holiday_date >= employee["date_of_joining"]
        );
      });
    } else {
      emp_holidays = allHolidays.filter((w) => {
        if (employee["week_day"]) {
          return (
            (w.holiday == "Y" && w.holiday_type == "RE") ||
            (w.holiday == "Y" &&
              w.holiday_type == "RS" &&
              w.religion_id == employee["religion_id"]) ||
            w.weekoff === "Y"
          );
        }
        return (
          (w.holiday == "Y" && w.holiday_type == "RE") ||
          (w.holiday == "Y" &&
            w.holiday_type == "RS" &&
            w.religion_id == employee["religion_id"]) ||
          w.weekoff === "Y"
        );
      });
    }
    // console.log("employee", employee);
    //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

    return emp_holidays;
  } catch (e) {
    return e;
  }
}

//created by irfan :to
export function generateExcelTimesheet(input) {
  try {
    const {
      allEmployees,
      allLeaves,
      allHolidays,
      timeSheetData,
      from_date,
      to_date,
    } = input;
    const allDates = getDaysArray(new Date(from_date), new Date(to_date));

    const outputArray = [];

    allEmployees.map((emp) => {
      const date_of_joining = emp["date_of_joining"];
      const empHolidayweekoff = getEmployeeWeekOffsandHolidays(
        from_date,
        emp,
        allHolidays
      );

      const holidayLen = empHolidayweekoff.length;
      const empLeave = allLeaves.filter((f) => {
        return f.employee_id == emp.hims_d_employee_id;
      });
      const leaveLen = empLeave.length;

      emp["data"] = [];
      const empTimeSheet = timeSheetData.filter((item) => {
        return item.employee_id == emp.hims_d_employee_id;
      });

      if (emp["partial_attendance"] == "N") {
        allDates.forEach((attendance_date) => {
          const TimeSheetUploaded = empTimeSheet.find((e) => {
            return e.attendance_date == attendance_date;
          });

          let color = "";

          if (TimeSheetUploaded != undefined) {
            switch (TimeSheetUploaded.status) {
              case "PL":
              case "HPL":
                color = "#ec7c00";
                break;

              case "UL":
              case "HUL":
                color = "#ff0000";
                break;
              case "WO":
                color = "#E7FEFD";
                break;
              case "HO":
                color = "#EAEAFD";
                break;
              case "AB":
                color = "9C9A99";
                break;
            }
            if (
              TimeSheetUploaded.status == "PL" ||
              TimeSheetUploaded.status == "UL" ||
              TimeSheetUploaded.status == "AB"
            ) {
              emp["data"].push({
                attendance_date: attendance_date,
                status: TimeSheetUploaded.status,
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                  TimeSheetUploaded.status,
                isTimeSheet: "Y",
                color: color,
              });
            } else {
              emp["data"].push({
                attendance_date: attendance_date,
                status: TimeSheetUploaded.status,
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                  TimeSheetUploaded.worked_hours,
                isTimeSheet: "Y",
                color: color,
              });
            }
          } else {
            // emp["data"].push({
            //   attendance_date: attendance_date,
            //   worked_hours: null,
            //   isTimeSheet: "N"
            // });

            let leave,
              holiday_or_weekOff = null;

            if (leaveLen > 0) {
              const leaveFound = empLeave.find((f) => {
                return (
                  f.from_date <= attendance_date && attendance_date <= f.to_date
                );
              });

              if (leaveFound) {
                if (
                  leaveFound.from_date == leaveFound.to_date &&
                  leaveFound.to_date == attendance_date &&
                  parseFloat(leaveFound.total_applied_days) == parseFloat(0.5)
                ) {
                  leaveFound.leave_type =
                    leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                } else if (leaveFound.from_date != leaveFound.to_date) {
                  if (
                    leaveFound.from_date == attendance_date &&
                    leaveFound.from_leave_session == "SH"
                  ) {
                    leaveFound.leave_type =
                      leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                  } else if (
                    leaveFound.to_date == attendance_date &&
                    leaveFound.to_leave_session == "FH"
                  ) {
                    leaveFound.leave_type =
                      leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                  }
                }

                leave = {
                  holiday_included: leaveFound.holiday_included,
                  weekoff_included: leaveFound.weekoff_included,
                  attendance_date: attendance_date,
                  status: leaveFound.leave_type,
                  leave_description: leaveFound.leave_description,
                };
              }
            }

            if (holidayLen > 0) {
              const HolidayFound = empHolidayweekoff.find((f) => {
                return f.holiday_date == attendance_date;
              });

              if (HolidayFound) {
                holiday_or_weekOff = HolidayFound;
              }
            }

            //-------------------------------------------
            if (
              (holiday_or_weekOff == null && leave != null) ||
              (leave != null &&
                holiday_or_weekOff != null &&
                holiday_or_weekOff.holiday == "Y" &&
                leave.holiday_included == "Y") ||
              (leave != null &&
                holiday_or_weekOff != null &&
                holiday_or_weekOff.weekoff == "Y" &&
                leave.weekoff_included == "Y")
            ) {
              if (leave.status == "PL" || leave.status == "HPL") {
                color = "#ec7c00";
              } else if (leave.status == "UL" || leave.status == "HUL") {
                color = "#ff0000";
              }

              emp["data"].push({
                status: leave.status,
                project_desc: leave.leave_description,
                attendance_date: attendance_date,
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                  leave.status,
                color: color,
              });
            } else if (holiday_or_weekOff != null) {
              if (holiday_or_weekOff.weekoff == "Y") {
                emp["data"].push({
                  status: "WO",

                  attendance_date: attendance_date,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    "WO",

                  color: "#E7FEFD",
                });
              } else if (holiday_or_weekOff.holiday == "Y") {
                emp["data"].push({
                  status: "HO",
                  attendance_date: attendance_date,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    "HO",
                  color: "#EAEAFD",
                });
              }
            } else if (date_of_joining <= attendance_date) {
              emp["data"].push({
                status: "PR",
                attendance_date: attendance_date,
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                  "PR",
                color: "#F5F5F5",
              });
            } else {
              emp["data"].push({
                status: "N",
                attendance_date: attendance_date,
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]: "N",
                color: "",
              });
            }

            //-------------------------------------------
          }
        });
      } else {
        allDates.forEach((attendance_date) => {
          if (attendance_date <= emp["exit_date"]) {
            const TimeSheetUploaded = empTimeSheet.find((e) => {
              return e.attendance_date == attendance_date;
            });

            let color = "";

            if (TimeSheetUploaded != undefined) {
              switch (TimeSheetUploaded.status) {
                case "PL":
                case "HPL":
                  color = "#ec7c00";
                  break;

                case "UL":
                case "HUL":
                  color = "#ff0000";
                  break;
                case "WO":
                  color = "#E7FEFD";
                  break;
                case "HO":
                  color = "#EAEAFD";
                  break;
                case "AB":
                  color = "9C9A99";
                  break;
              }
              if (
                TimeSheetUploaded.status == "PL" ||
                TimeSheetUploaded.status == "UL" ||
                TimeSheetUploaded.status == "AB"
              ) {
                emp["data"].push({
                  attendance_date: attendance_date,
                  status: TimeSheetUploaded.status,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    TimeSheetUploaded.status,
                  isTimeSheet: "Y",
                  color: color,
                });
              } else {
                emp["data"].push({
                  attendance_date: attendance_date,
                  status: TimeSheetUploaded.status,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    TimeSheetUploaded.worked_hours,
                  isTimeSheet: "Y",
                  color: color,
                });
              }
            } else {
              // emp["data"].push({
              //   attendance_date: attendance_date,
              //   worked_hours: null,
              //   isTimeSheet: "N"
              // });

              let leave,
                holiday_or_weekOff = null;

              if (leaveLen > 0) {
                const leaveFound = empLeave.find((f) => {
                  return (
                    f.from_date <= attendance_date &&
                    attendance_date <= f.to_date
                  );
                });

                if (leaveFound) {
                  if (
                    leaveFound.from_date == leaveFound.to_date &&
                    leaveFound.to_date == attendance_date &&
                    parseFloat(leaveFound.total_applied_days) == parseFloat(0.5)
                  ) {
                    leaveFound.leave_type =
                      leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                  } else if (leaveFound.from_date != leaveFound.to_date) {
                    if (
                      leaveFound.from_date == attendance_date &&
                      leaveFound.from_leave_session == "SH"
                    ) {
                      leaveFound.leave_type =
                        leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                    } else if (
                      leaveFound.to_date == attendance_date &&
                      leaveFound.to_leave_session == "FH"
                    ) {
                      leaveFound.leave_type =
                        leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                    }
                  }

                  leave = {
                    holiday_included: leaveFound.holiday_included,
                    weekoff_included: leaveFound.weekoff_included,
                    attendance_date: attendance_date,
                    status: leaveFound.leave_type,
                    leave_description: leaveFound.leave_description,
                  };
                }
              }

              if (holidayLen > 0) {
                const HolidayFound = empHolidayweekoff.find((f) => {
                  return f.holiday_date == attendance_date;
                });

                if (HolidayFound) {
                  holiday_or_weekOff = HolidayFound;
                }
              }

              //-------------------------------------------
              if (
                (holiday_or_weekOff == null && leave != null) ||
                (leave != null &&
                  holiday_or_weekOff != null &&
                  holiday_or_weekOff.holiday == "Y" &&
                  leave.holiday_included == "Y") ||
                (leave != null &&
                  holiday_or_weekOff != null &&
                  holiday_or_weekOff.weekoff == "Y" &&
                  leave.weekoff_included == "Y")
              ) {
                if (leave.status == "PL" || leave.status == "HPL") {
                  color = "#ec7c00";
                } else if (leave.status == "UL" || leave.status == "HUL") {
                  color = "#ff0000";
                }

                emp["data"].push({
                  status: leave.status,
                  project_desc: leave.leave_description,
                  attendance_date: attendance_date,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    leave.status,
                  color: color,
                });
              } else if (holiday_or_weekOff != null) {
                if (holiday_or_weekOff.weekoff == "Y") {
                  emp["data"].push({
                    status: "WO",

                    attendance_date: attendance_date,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      "WO",

                    color: "#E7FEFD",
                  });
                } else if (holiday_or_weekOff.holiday == "Y") {
                  emp["data"].push({
                    status: "HO",
                    attendance_date: attendance_date,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      "HO",
                    color: "#EAEAFD",
                  });
                }
              } else if (date_of_joining <= attendance_date) {
                emp["data"].push({
                  status: "PR",
                  attendance_date: attendance_date,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    "PR",
                  color: "#F5F5F5",
                });
              } else {
                emp["data"].push({
                  status: "N",
                  attendance_date: attendance_date,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    "N",
                  color: "",
                });
              }

              //-------------------------------------------
            }
          } else {
            emp["data"].push({
              status: "EXT",
              attendance_date: attendance_date,
              [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]: "EXT",
              color: "#FCF802",
            });
          }
        });
      }

      outputArray.push({
        full_name: emp.full_name,
        employee_code: emp.employee_code,
        dates: _.sortBy(emp["data"], (s) =>
          parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
        ),
      });
    });

    const sort_data = _.sortBy(outputArray, (s) => parseInt(s.employee_code));
    return sort_data;
  } catch (e) {
    return e;
  }
}

//created by irfan :to
export function generateProjectRosterTimesheet(input) {
  try {
    const {
      allEmployees,
      allLeaves,
      allHolidays,
      timeSheetData,
      from_date,
      to_date,
    } = input;

    const allDates = getDaysArray(new Date(from_date), new Date(to_date));

    const final_roster = [];

    _.chain(allEmployees)
      .groupBy((g) => g.hims_d_employee_id)
      .map((emp) => {
        const outputArray = [];
        const empTimeSheet = timeSheetData[emp[0]["hims_d_employee_id"]];

        const empHolidayweekoff = getEmployeeWeekOffsandHolidays(
          from_date,

          emp[0],
          allHolidays
        );

        const holidayLen = empHolidayweekoff.length;
        const empLeave = allLeaves.filter((f) => {
          return f.employee_id == emp[0].hims_d_employee_id;
        });
        const leaveLen = empLeave.length;

        if (emp[0]["partial_attendance"] == "N") {
          allDates.forEach((attendance_date) => {
            const TimeSheetUploaded = empTimeSheet
              ? empTimeSheet.find((e) => {
                  return e.attendance_date == attendance_date;
                })
              : undefined;

            let color = "";

            if (TimeSheetUploaded != undefined) {
              switch (TimeSheetUploaded.status) {
                case "PL":
                case "HPL":
                  color = "#ec7c00";
                  break;

                case "UL":
                case "HUL":
                  color = "#ff0000";
                  break;
                case "WO":
                  color = "#E7FEFD";
                  break;
                case "HO":
                  color = "#EAEAFD";
                  break;
                case "AB":
                  color = "9C9A99";
                  break;
              }

              if (
                TimeSheetUploaded.status == "PL" ||
                TimeSheetUploaded.status == "UL" ||
                TimeSheetUploaded.status == "AB"
              ) {
                outputArray.push({
                  attendance_date: attendance_date,
                  status: TimeSheetUploaded.status,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    TimeSheetUploaded.status,
                  project_id: TimeSheetUploaded.project_id,
                  project_desc: TimeSheetUploaded.project_desc,
                  isTimeSheet: "Y",
                  color: color,
                });
              } else {
                outputArray.push({
                  attendance_date: attendance_date,
                  status: TimeSheetUploaded.status,
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    TimeSheetUploaded.worked_hours,
                  project_id: TimeSheetUploaded.project_id,
                  project_desc: TimeSheetUploaded.project_desc,
                  isTimeSheet: "Y",
                  color: color,
                });
              }
            } else {
              const ProjAssgned = emp.find((e) => {
                return e.attendance_date == attendance_date;
              });

              //--------------------------------
              if (ProjAssgned) {
                let leave,
                  holiday_or_weekOff = null;

                if (leaveLen > 0) {
                  const leaveFound = empLeave.find((f) => {
                    return (
                      f.from_date <= attendance_date &&
                      attendance_date <= f.to_date
                    );
                  });

                  if (leaveFound) {
                    if (
                      leaveFound.from_date == leaveFound.to_date &&
                      leaveFound.to_date == attendance_date &&
                      parseFloat(leaveFound.total_applied_days) ==
                        parseFloat(0.5)
                    ) {
                      leaveFound.leave_type =
                        leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                    } else if (leaveFound.from_date != leaveFound.to_date) {
                      if (
                        leaveFound.from_date == attendance_date &&
                        leaveFound.from_leave_session == "SH"
                      ) {
                        leaveFound.leave_type =
                          leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                      } else if (
                        leaveFound.to_date == attendance_date &&
                        leaveFound.to_leave_session == "FH"
                      ) {
                        leaveFound.leave_type =
                          leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                      }
                    }

                    leave = {
                      holiday_included: leaveFound.holiday_included,
                      weekoff_included: leaveFound.weekoff_included,
                      attendance_date: attendance_date,
                      status: leaveFound.leave_type,
                      leave_description: leaveFound.leave_description,
                    };
                  }
                }

                if (holidayLen > 0) {
                  const HolidayFound = empHolidayweekoff.find((f) => {
                    return f.holiday_date == attendance_date;
                  });

                  if (HolidayFound) {
                    holiday_or_weekOff = HolidayFound;
                  }
                }

                //-------------------------------------------
                if (
                  (holiday_or_weekOff == null && leave != null) ||
                  (leave != null &&
                    holiday_or_weekOff != null &&
                    holiday_or_weekOff.holiday == "Y" &&
                    leave.holiday_included == "Y") ||
                  (leave != null &&
                    holiday_or_weekOff != null &&
                    holiday_or_weekOff.weekoff == "Y" &&
                    leave.weekoff_included == "Y")
                ) {
                  if (leave.status == "PL" || leave.status == "HPL") {
                    color = "#ec7c00";
                  } else if (leave.status == "UL" || leave.status == "HUL") {
                    color = "#ff0000";
                  }

                  outputArray.push({
                    status: leave.status,
                    project_desc: leave.leave_description,
                    attendance_date: attendance_date,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      leave.status,
                    project_id: ProjAssgned.project_id,

                    color: color,
                  });
                } else if (holiday_or_weekOff != null) {
                  if (holiday_or_weekOff.weekoff == "Y") {
                    outputArray.push({
                      status: "WO",

                      attendance_date: attendance_date,
                      [moment(attendance_date, "YYYY-MM-DD").format(
                        "YYYYMMDD"
                      )]: "WO",
                      project_id: ProjAssgned.project_id,
                      project_desc: ProjAssgned.project_desc,
                      color: "#E7FEFD",
                    });
                  } else if (holiday_or_weekOff.holiday == "Y") {
                    outputArray.push({
                      status: "HO",
                      attendance_date: attendance_date,
                      [moment(attendance_date, "YYYY-MM-DD").format(
                        "YYYYMMDD"
                      )]: "HO",
                      project_id: ProjAssgned.project_id,
                      project_desc: ProjAssgned.project_desc,
                      color: "#EAEAFD",
                    });
                  }
                } else {
                  outputArray.push({
                    status: "PR",
                    attendance_date: attendance_date,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      "PR",
                    project_id: ProjAssgned.project_id,
                    project_desc: ProjAssgned.project_desc,
                    color: "#F5F5F5",
                  });
                }
              } else {
                outputArray.push({
                  attendance_date: attendance_date,
                  status: "N",
                  [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                    "N",
                  project_id: null,
                  project_desc: "Not Assigned",
                  color: "#F5F5F5",
                });
              }
              //-------------------------------------------
            }
          });

          // final_roster.push({
          //   full_name: emp[0].full_name,
          //   employee_code: emp[0].employee_code,
          //   dates: _.sortBy(outputArray, (s) =>
          //     parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
          //   ),
          // });
        } else {
          allDates.forEach((attendance_date) => {
            if (attendance_date <= emp[0]["exit_date"]) {
              const TimeSheetUploaded = empTimeSheet
                ? empTimeSheet.find((e) => {
                    return e.attendance_date == attendance_date;
                  })
                : undefined;

              let color = "";

              if (TimeSheetUploaded != undefined) {
                switch (TimeSheetUploaded.status) {
                  case "PL":
                  case "HPL":
                    color = "#ec7c00";
                    break;

                  case "UL":
                  case "HUL":
                    color = "#ff0000";
                    break;
                  case "WO":
                    color = "#E7FEFD";
                    break;
                  case "HO":
                    color = "#EAEAFD";
                    break;
                  case "AB":
                    color = "9C9A99";
                    break;
                }

                if (
                  TimeSheetUploaded.status == "PL" ||
                  TimeSheetUploaded.status == "UL" ||
                  TimeSheetUploaded.status == "AB"
                ) {
                  outputArray.push({
                    attendance_date: attendance_date,
                    status: TimeSheetUploaded.status,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      TimeSheetUploaded.status,
                    project_id: TimeSheetUploaded.project_id,
                    project_desc: TimeSheetUploaded.project_desc,
                    isTimeSheet: "Y",
                    color: color,
                  });
                } else {
                  outputArray.push({
                    attendance_date: attendance_date,
                    status: TimeSheetUploaded.status,
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      TimeSheetUploaded.worked_hours,
                    project_id: TimeSheetUploaded.project_id,
                    project_desc: TimeSheetUploaded.project_desc,
                    isTimeSheet: "Y",
                    color: color,
                  });
                }
              } else {
                const ProjAssgned = emp.find((e) => {
                  return e.attendance_date == attendance_date;
                });

                //--------------------------------
                if (ProjAssgned) {
                  let leave,
                    holiday_or_weekOff = null;

                  if (leaveLen > 0) {
                    const leaveFound = empLeave.find((f) => {
                      return (
                        f.from_date <= attendance_date &&
                        attendance_date <= f.to_date
                      );
                    });

                    if (leaveFound) {
                      if (
                        leaveFound.from_date == leaveFound.to_date &&
                        leaveFound.to_date == attendance_date &&
                        parseFloat(leaveFound.total_applied_days) ==
                          parseFloat(0.5)
                      ) {
                        leaveFound.leave_type =
                          leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                      } else if (leaveFound.from_date != leaveFound.to_date) {
                        if (
                          leaveFound.from_date == attendance_date &&
                          leaveFound.from_leave_session == "SH"
                        ) {
                          leaveFound.leave_type =
                            leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                        } else if (
                          leaveFound.to_date == attendance_date &&
                          leaveFound.to_leave_session == "FH"
                        ) {
                          leaveFound.leave_type =
                            leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                        }
                      }

                      leave = {
                        holiday_included: leaveFound.holiday_included,
                        weekoff_included: leaveFound.weekoff_included,
                        attendance_date: attendance_date,
                        status: leaveFound.leave_type,
                        leave_description: leaveFound.leave_description,
                      };
                    }
                  }

                  if (holidayLen > 0) {
                    const HolidayFound = empHolidayweekoff.find((f) => {
                      return f.holiday_date == attendance_date;
                    });

                    if (HolidayFound) {
                      holiday_or_weekOff = HolidayFound;
                    }
                  }

                  //-------------------------------------------
                  if (
                    (holiday_or_weekOff == null && leave != null) ||
                    (leave != null &&
                      holiday_or_weekOff != null &&
                      holiday_or_weekOff.holiday == "Y" &&
                      leave.holiday_included == "Y") ||
                    (leave != null &&
                      holiday_or_weekOff != null &&
                      holiday_or_weekOff.weekoff == "Y" &&
                      leave.weekoff_included == "Y")
                  ) {
                    if (leave.status == "PL" || leave.status == "HPL") {
                      color = "#ec7c00";
                    } else if (leave.status == "UL" || leave.status == "HUL") {
                      color = "#ff0000";
                    }

                    outputArray.push({
                      status: leave.status,
                      project_desc: leave.leave_description,
                      attendance_date: attendance_date,
                      [moment(attendance_date, "YYYY-MM-DD").format(
                        "YYYYMMDD"
                      )]: leave.status,
                      project_id: ProjAssgned.project_id,

                      color: color,
                    });
                  } else if (holiday_or_weekOff != null) {
                    if (holiday_or_weekOff.weekoff == "Y") {
                      outputArray.push({
                        status: "WO",

                        attendance_date: attendance_date,
                        [moment(attendance_date, "YYYY-MM-DD").format(
                          "YYYYMMDD"
                        )]: "WO",
                        project_id: ProjAssgned.project_id,
                        project_desc: ProjAssgned.project_desc,
                        color: "#E7FEFD",
                      });
                    } else if (holiday_or_weekOff.holiday == "Y") {
                      outputArray.push({
                        status: "HO",
                        attendance_date: attendance_date,
                        [moment(attendance_date, "YYYY-MM-DD").format(
                          "YYYYMMDD"
                        )]: "HO",
                        project_id: ProjAssgned.project_id,
                        project_desc: ProjAssgned.project_desc,
                        color: "#EAEAFD",
                      });
                    }
                  } else {
                    outputArray.push({
                      status: "PR",
                      attendance_date: attendance_date,
                      [moment(attendance_date, "YYYY-MM-DD").format(
                        "YYYYMMDD"
                      )]: "PR",
                      project_id: ProjAssgned.project_id,
                      project_desc: ProjAssgned.project_desc,
                      color: "#F5F5F5",
                    });
                  }
                } else {
                  outputArray.push({
                    attendance_date: attendance_date,
                    status: "N",
                    [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                      "N",
                    project_id: null,
                    project_desc: "Not Assigned",
                    color: "#F5F5F5",
                  });
                }
                //-------------------------------------------
              }
            } else {
              outputArray.push({
                attendance_date: attendance_date,
                status: "EXT",
                [moment(attendance_date, "YYYY-MM-DD").format("YYYYMMDD")]:
                  "EXT",
                project_id: null,
                project_desc: "employee is resigned",
                color: "#FCF802",
              });
            }
          });
        }

        final_roster.push({
          full_name: emp[0].full_name,
          employee_code: emp[0].employee_code,
          dates: _.sortBy(outputArray, (s) =>
            parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
          ),
        });
      })
      .value();
    const sort_data = _.sortBy(final_roster, (s) => parseInt(s.employee_code));
    return sort_data;
  } catch (e) {
    // console.log("ERRR:", e);
    return e;
  }
}

//created by irfan :to
export function bulkTimesheetDataMatch(input) {
  try {
    const {
      allEmployees,
      allLeaves,
      allHolidays,
      from_date,
      to_date,
      allDates,
      is_ramzan,
      RMZ_HR,
      RMZ_MIN,
      RMZ_HF_WH,
      RMZ_HF_MIN,
      ramzan_start_date,
      ramzan_end_date,
    } = input;

    const outputArray = [];

    allEmployees.map((emp) => {
      const empHolidayweekoff = getEmployeeWeekOffsandHolidays(
        from_date,
        emp,
        allHolidays
      );

      const holidayLen = empHolidayweekoff.length;
      const empLeave = allLeaves.filter((f) => {
        return f.employee_id == emp.hims_d_employee_id;
      });
      const leaveLen = empLeave.length;

      emp["data"] = [];

      allDates.forEach((dat) => {
        let leave,
          holiday_or_weekOff = null;

        if (leaveLen > 0) {
          const leaveFound = empLeave.find((f) => {
            return (
              f.from_date <= dat.attendance_date &&
              dat.attendance_date <= f.to_date
            );
          });

          if (leaveFound) {
            if (
              leaveFound.from_date == leaveFound.to_date &&
              leaveFound.to_date == dat.attendance_date &&
              parseFloat(leaveFound.total_applied_days) == parseFloat(0.5)
            ) {
              leaveFound.leave_type =
                leaveFound.leave_type == "PL" ? "HPL" : "HUL";
              is_ramzan, RMZ_HR, RMZ_MIN, RMZ_HF_WH, RMZ_HF_MIN;
            } else if (leaveFound.from_date != leaveFound.to_date) {
              if (
                leaveFound.from_date == dat.attendance_date &&
                leaveFound.from_leave_session == "SH"
              ) {
                leaveFound.leave_type =
                  leaveFound.leave_type == "PL" ? "HPL" : "HUL";
              } else if (
                leaveFound.to_date == dat.attendance_date &&
                leaveFound.to_leave_session == "FH"
              ) {
                leaveFound.leave_type =
                  leaveFound.leave_type == "PL" ? "HPL" : "HUL";
              }
            }

            leave = {
              holiday_included: leaveFound.holiday_included,
              weekoff_included: leaveFound.weekoff_included,
              attendance_date: dat.attendance_date,
              status: leaveFound.leave_type,
              leave_description: leaveFound.leave_description,
              leave_category: leaveFound.leave_category,
            };
          }
        }

        if (holidayLen > 0) {
          const HolidayFound = empHolidayweekoff.find((f) => {
            return f.holiday_date == dat.attendance_date;
          });

          if (HolidayFound) {
            holiday_or_weekOff = HolidayFound;
          }
        }

        //-------------------------------------------
        if (
          (holiday_or_weekOff == null && leave != null) ||
          (leave != null &&
            holiday_or_weekOff != null &&
            holiday_or_weekOff.holiday == "Y" &&
            leave.holiday_included == "Y") ||
          (leave != null &&
            holiday_or_weekOff != null &&
            holiday_or_weekOff.weekoff == "Y" &&
            leave.weekoff_included == "Y")
        ) {
          let ramzan_half_leav = {};

          if (
            is_ramzan == "Y" &&
            emp.ramzan_enployee == "Y" &&
            ramzan_start_date <= dat.attendance_date &&
            dat.attendance_date <= ramzan_end_date
          ) {
            if (leave.status == "HPL" || leave.status == "HUL") {
              ramzan_half_leav["RMZ_HR"] = RMZ_HF_WH;
              ramzan_half_leav["RMZ_MIN"] = RMZ_HF_MIN;
            }
          }

          emp["data"].push({
            ...ramzan_half_leav,
            status: leave.status,
            attendance_date: dat.attendance_date,
            leave_category: leave.leave_category,
            employee_id: emp.hims_d_employee_id,
            sub_department_id: emp.sub_department_id,
            month: dat.month,
            year: dat.year,
          });
        } else if (holiday_or_weekOff != null) {
          if (holiday_or_weekOff.weekoff == "Y") {
            emp["data"].push({
              status: "WO",
              attendance_date: dat.attendance_date,
              employee_id: emp.hims_d_employee_id,
              sub_department_id: emp.sub_department_id,
              month: dat.month,
              year: dat.year,
            });
          } else if (holiday_or_weekOff.holiday == "Y") {
            emp["data"].push({
              status: "HO",
              attendance_date: dat.attendance_date,
              employee_id: emp.hims_d_employee_id,
              sub_department_id: emp.sub_department_id,
              month: dat.month,
              year: dat.year,
            });
          }
        } else {
          if (
            is_ramzan == "Y" &&
            emp.ramzan_enployee == "Y" &&
            ramzan_start_date <= dat.attendance_date &&
            dat.attendance_date <= ramzan_end_date
          ) {
            emp["data"].push({
              status: "PR",
              attendance_date: dat.attendance_date,
              employee_id: emp.hims_d_employee_id,
              sub_department_id: emp.sub_department_id,
              month: dat.month,
              year: dat.year,
              RMZ_HR: RMZ_HR,
              RMZ_MIN: RMZ_MIN,
            });
          } else {
            emp["data"].push({
              status: "PR",
              attendance_date: dat.attendance_date,
              employee_id: emp.hims_d_employee_id,
              sub_department_id: emp.sub_department_id,
              month: dat.month,
              year: dat.year,
            });
          }
        }

        //-------------------------------------------
      });

      outputArray.push({
        full_name: emp.full_name,
        employee_code: emp.employee_code,
        standard_work_hours: emp.standard_work_hours,
        consider_overtime: emp.consider_overtime,
        ramzan_work_hours: emp.ramzan_work_hours,
        week_day: emp.week_day,
        dates: _.sortBy(emp["data"], (s) =>
          parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
        ),
      });
    });

    return outputArray;
  } catch (e) {
    return e;
  }
}

//created by irfan :to
export function bulkTimesheetRosterDataMatch(input) {
  try {
    const {
      allEmployees,
      allLeaves,
      allHolidays,
      from_date,
      to_date,
      allDates,
      is_ramzan,
      RMZ_HR,
      RMZ_MIN,
      RMZ_HF_WH,
      RMZ_HF_MIN,
      ramzan_start_date,
      ramzan_end_date,
      workingHoursFrom,
    } = input;

    const final_roster = [];

    _.chain(allEmployees)
      .groupBy((g) => g.hims_d_employee_id)
      .map((emp) => {
        const outputArray = [];

        const empHolidayweekoff = getEmployeeWeekOffsandHolidays(
          from_date,
          emp[0],
          allHolidays
        );

        const holidayLen = empHolidayweekoff.length;
        const empLeave = allLeaves.filter((f) => {
          return f.employee_id == emp[0].hims_d_employee_id;
        });
        const leaveLen = empLeave.length;

        allDates.forEach((dat) => {
          const ProjAssgned = emp.find((e) => {
            return e.attendance_date == dat.attendance_date;
          });

          //--------------------------------
          if (ProjAssgned) {
            let leave,
              holiday_or_weekOff = null;

            if (leaveLen > 0) {
              const leaveFound = empLeave.find((f) => {
                return (
                  f.from_date <= dat.attendance_date &&
                  dat.attendance_date <= f.to_date
                );
              });

              if (leaveFound) {
                if (
                  leaveFound.from_date == leaveFound.to_date &&
                  leaveFound.to_date == dat.attendance_date &&
                  parseFloat(leaveFound.total_applied_days) == parseFloat(0.5)
                ) {
                  leaveFound.leave_type =
                    leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                } else if (leaveFound.from_date != leaveFound.to_date) {
                  if (
                    leaveFound.from_date == dat.attendance_date &&
                    leaveFound.from_leave_session == "SH"
                  ) {
                    leaveFound.leave_type =
                      leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                  } else if (
                    leaveFound.to_date == dat.attendance_date &&
                    leaveFound.to_leave_session == "FH"
                  ) {
                    leaveFound.leave_type =
                      leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                  }
                }

                leave = {
                  holiday_included: leaveFound.holiday_included,
                  weekoff_included: leaveFound.weekoff_included,
                  attendance_date: dat.attendance_date,
                  status: leaveFound.leave_type,
                  leave_description: leaveFound.leave_description,
                  leave_category: leaveFound.leave_category,
                };
              }
            }

            if (holidayLen > 0) {
              const HolidayFound = empHolidayweekoff.find((f) => {
                return f.holiday_date == dat.attendance_date;
              });

              if (HolidayFound) {
                holiday_or_weekOff = HolidayFound;
              }
            }

            //-------------------------------------------
            if (
              (holiday_or_weekOff == null && leave != null) ||
              (leave != null &&
                holiday_or_weekOff != null &&
                holiday_or_weekOff.holiday == "Y" &&
                leave.holiday_included == "Y") ||
              (leave != null &&
                holiday_or_weekOff != null &&
                holiday_or_weekOff.weekoff == "Y" &&
                leave.weekoff_included == "Y")
            ) {
              let ramzan_half_leav = {};

              if (
                is_ramzan == "Y" &&
                emp[0].ramzan_enployee == "Y" &&
                ramzan_start_date <= dat.attendance_date &&
                dat.attendance_date <= ramzan_end_date
              ) {
                if (leave.status == "HPL" || leave.status == "HUL") {
                  ramzan_half_leav["RMZ_HR"] = RMZ_HF_WH;
                  ramzan_half_leav["RMZ_MIN"] = RMZ_HF_MIN;
                }
              }
              outputArray.push({
                ...ramzan_half_leav,
                status: leave.status,
                leave_category: leave.leave_category,
                attendance_date: dat.attendance_date,
                project_id: ProjAssgned.project_id,
                employee_id: emp[0].hims_d_employee_id,
                sub_department_id: emp[0].sub_department_id,
                month: dat.month,
                year: dat.year,
              });
            } else if (holiday_or_weekOff != null) {
              if (holiday_or_weekOff.weekoff == "Y") {
                outputArray.push({
                  status: "WO",
                  attendance_date: dat.attendance_date,
                  project_id: ProjAssgned.project_id,
                  employee_id: emp[0].hims_d_employee_id,
                  sub_department_id: emp[0].sub_department_id,
                  month: dat.month,
                  year: dat.year,
                });
              } else if (holiday_or_weekOff.holiday == "Y") {
                outputArray.push({
                  status: "HO",
                  attendance_date: dat.attendance_date,
                  project_id: ProjAssgned.project_id,
                  employee_id: emp[0].hims_d_employee_id,
                  sub_department_id: emp[0].sub_department_id,
                  month: dat.month,
                  year: dat.year,
                });
              }
            } else {
              if (
                is_ramzan == "Y" &&
                emp[0].ramzan_enployee == "Y" &&
                ramzan_start_date <= dat.attendance_date &&
                dat.attendance_date <= ramzan_end_date
              ) {
                outputArray.push({
                  status: "PR",
                  attendance_date: dat.attendance_date,
                  project_id: ProjAssgned.project_id,
                  employee_id: emp[0].hims_d_employee_id,
                  sub_department_id: emp[0].sub_department_id,
                  month: dat.month,
                  year: dat.year,
                  RMZ_HR: RMZ_HR,
                  RMZ_MIN: RMZ_MIN,
                });
              } else {
                outputArray.push({
                  status: "PR",
                  attendance_date: dat.attendance_date,
                  project_id: ProjAssgned.project_id,
                  employee_id: emp[0].hims_d_employee_id,
                  sub_department_id: emp[0].sub_department_id,
                  month: dat.month,
                  year: dat.year,
                });
              }
            }
          } else {
            outputArray.push({
              attendance_date: dat.attendance_date,
              status: "N",
              project_id: null,
              month: dat.month,
              year: dat.year,
            });
          }
          //-------------------------------------------
        });
        const {
          full_name,
          employee_code,
          standard_work_hours,
          consider_overtime,
          ramzan_work_hours,
          week_day,
        } = emp[0];
        final_roster.push({
          full_name,
          employee_code,
          standard_work_hours,
          consider_overtime,
          ramzan_work_hours,
          week_day,

          dates: _.sortBy(outputArray, (s) =>
            parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
          ),
        });
      })
      .value();
    return final_roster;
  } catch (e) {
    // console.log("ERRR:", e);
    return e;
  }
}

//created by irfan :
export function mergeTimesheetData(input) {
  const {
    _mysql,
    rawData,
    attResult,
    attendance_type,
    STDWH,
    STDWM,
    HALF_HR,
    HALF_MIN,
    hospital_id,
    updated_by,
    previewStr,
    allDates,
    workingHoursFrom,
  } = input;

  const register = [];
  return new Promise((resolve, reject) => {
    try {
      rawData.forEach((employee) => {
        const attEmp = attResult.find((emp) => {
          return emp["employee_code"] == employee["employee_code"];
        });

        if (attEmp) {
          const data = employee.dates.map((date) => {
            const projInfo = attEmp.dates.find((dat) => {
              return (
                dat["attendance_date"] ==
                moment(Object.keys(date)[0], "DD-MM-YYYY").format("YYYY-MM-DD")
              );
            });

            return {
              ...projInfo,
              worked_status: Object.values(date)[0],
            };
          });
          let timingObject = {};
          if (workingHoursFrom === "E") {
            timingObject["standard_work_hours"] = attEmp["standard_work_hours"];
            timingObject["consider_overtime"] = attEmp["consider_overtime"];
            timingObject["ramzan_work_hours"] = attEmp["ramzan_work_hours"];
            timingObject["week_day"] = attEmp["week_day"];
          }
          register.push({
            employee_code: employee["employee_code"],
            ...timingObject,
            dates: data,
          });
        }
      });

      const insertArray = [];

      let errorString = "";

      register.forEach((employee) => {
        employee.dates.forEach((day) => {
          let RMZ_HR_ = day["RMZ_HR"];
          let RMZ_MIN_ = day["RMZ_MIN"];
          let STD_WH_ = STDWH;
          let STD_WM_ = STDWM;
          let HALF_HR_ = HALF_HR;
          let HALF_MIN_ = HALF_MIN;
          if (workingHoursFrom === "E") {
            if (employee["standard_work_hours"]) {
              STD_WH_ = employee["standard_work_hours"].split(".")[0];
              STD_WM_ = employee["standard_work_hours"].split(".")[1];
              const total_minutes = parseInt(STD_WH_ * 60) + parseInt(STD_WM_);
              HALF_HR_ = total_minutes / 2 / 60;
              HALF_MIN_ = (total_minutes / 2) % 60;
            }
            if (employee["ramzan_work_hours"]) {
              const RMZ_DB = moment(employee["ramzan_work_hours"], "HH:mm:ss");
              RMZ_HR_ = RMZ_DB.format("HH");
              RMZ_MIN_ = RMZ_DB.format("mm");
            }
          }
          // console.log("STD_WH_", STD_WH_)
          // console.log("STD_WM_", STD_WM_)
          // console.log("day_worked_status", day["worked_status"])
          switch (day["worked_status"]) {
            case "AB":
              if (
                day["status"] == "WO" ||
                day["status"] == "PR" ||
                day["status"] == "HO"
              ) {
                insertArray.push({
                  worked_hours: 0,
                  hours: 0,
                  minutes: 0,
                  actual_hours: day["RMZ_HR"] > 0 ? RMZ_HR_ : STD_WH_, //day["RMZ_HR"] : STDWH,
                  actual_minutes: day["RMZ_HR"] > 0 ? RMZ_MIN_ : STD_WM_, //day["RMZ_MIN"] : STDWM,
                  employee_id: day.employee_id,
                  attendance_date: day.attendance_date,
                  status: day["worked_status"],
                  sub_department_id: day.sub_department_id,
                  project_id: day.project_id,
                  is_anual_leave: day.leave_category == "A" ? "Y" : "N",
                  month: day.month,
                  year: day.year,
                  hospital_id: hospital_id,
                  created_by: updated_by,
                  updated_by: updated_by,
                  updated_date: new Date(),
                });
              } else {
                errorString += ` <li> ${employee["employee_code"]} on  ${moment(
                  day.attendance_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY")} is ${day["status"]} not  PR </li>`;
              }
              break;

            case "PR":
              if (day["worked_status"] == day["status"]) {
                insertArray.push({
                  worked_hours:
                    day["RMZ_HR"] > 0
                      ? `${RMZ_HR_}.${RMZ_MIN_}` //day["RMZ_HR"] + "." + day["RMZ_MIN"]
                      : `${STD_WH_}.${STD_WM_}`, //STDWH + "." + STDWM,
                  hours: day["RMZ_HR"] > 0 ? RMZ_HR_ : STD_WH_, //day["RMZ_HR"] : STDWH,
                  minutes: day["RMZ_HR"] > 0 ? RMZ_MIN_ : STD_WM_, //day["RMZ_MIN"] : STDWM,
                  actual_hours: day["RMZ_HR"] > 0 ? RMZ_HR_ : STD_WH_, //day["RMZ_HR"] : STDWH,
                  actual_minutes: day["RMZ_HR"] > 0 ? RMZ_MIN_ : STD_WM_, //day["RMZ_MIN"] : STDWM,
                  employee_id: day.employee_id,
                  attendance_date: day.attendance_date,
                  status: day["worked_status"],
                  sub_department_id: day.sub_department_id,
                  project_id: day.project_id,
                  is_anual_leave: day.leave_category == "A" ? "Y" : "N",
                  month: day.month,
                  year: day.year,
                  hospital_id: hospital_id,
                  created_by: updated_by,
                  updated_by: updated_by,
                  updated_date: new Date(),
                });
              } else {
                errorString += ` <li> ${employee["employee_code"]} on  ${moment(
                  day.attendance_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY")} is ${day["status"]} not  PR   </li>`;
              }

              break;
            case "WO":

            case "HO":

            case "PL":

            case "UL":
              if (day["worked_status"] == day["status"]) {
                insertArray.push({
                  worked_hours: 0,
                  hours: 0,
                  minutes: 0,
                  actual_hours: 0,
                  actual_minutes: 0,
                  employee_id: day.employee_id,
                  attendance_date: day.attendance_date,
                  status: day["worked_status"],
                  sub_department_id: day.sub_department_id,
                  project_id: day.project_id,
                  is_anual_leave: day.leave_category == "A" ? "Y" : "N",
                  month: day.month,
                  year: day.year,
                  hospital_id: hospital_id,
                  created_by: updated_by,
                  updated_by: updated_by,
                  updated_date: new Date(),
                });
              } else {
                let actual = "";
                let neww = "";

                switch (day["status"]) {
                  case "PR":
                    actual = " Present day ";
                    break;
                  case "WO":
                    actual = " week off ";
                    break;

                  case "HO":
                    actual = " Holiday ";
                    break;
                  case "PL":
                    actual = " Paid Leave ";
                    break;
                  case "UL":
                    actual = " UnPaid Leave ";
                    break;
                  case "HPL":
                    actual = "Half Day Paid Leave ";
                    break;
                  case "HUL":
                    actual = " Half UnPaid Leave ";
                    break;
                }

                switch (day["worked_status"]) {
                  case "WO":
                    neww = " week off ";
                    break;

                  case "HO":
                    neww = " Holiday ";
                    break;
                  case "PL":
                    neww = " Paid Leave ";
                    break;
                  case "UL":
                    neww = " UnPaid Leave ";
                    break;
                  case "HPL":
                    neww = "Half Day Paid Leave ";
                    break;
                  case "HUL":
                    neww = " Half UnPaid Leave ";
                    break;
                }

                errorString += ` <li> ${employee["employee_code"]} on  ${moment(
                  day.attendance_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY")} is ${actual} not ${neww} </li>`;
              }

              break;

            case "HUL":

            case "HPL":
              if (day["worked_status"] == day["status"]) {
                insertArray.push({
                  worked_hours:
                    day["RMZ_HR"] > 0
                      ? `${RMZ_HR_}.${RMZ_MIN_}` //day["RMZ_HR"] + "." + day["RMZ_MIN"]
                      : `${HALF_HR_}.${HALF_MIN_}`, //HALF_HR + "." + HALF_MIN,
                  hours: day["RMZ_HR"] > 0 ? RMZ_HR_ : HALF_HR_, //day["RMZ_HR"] : HALF_HR_,
                  minutes: day["RMZ_HR"] > 0 ? RMZ_MIN_ : HALF_MIN_, //day["RMZ_MIN"] : HALF_MIN_,
                  actual_hours: day["RMZ_HR"] > 0 ? RMZ_HR_ : HALF_HR_, //day["RMZ_HR"] : HALF_HR,
                  actual_minutes: day["RMZ_HR"] > 0 ? RMZ_MIN_ : HALF_MIN_, //day["RMZ_MIN"] : HALF_MIN,
                  employee_id: day.employee_id,
                  attendance_date: day.attendance_date,
                  status: day["worked_status"],
                  sub_department_id: day.sub_department_id,
                  project_id: day.project_id,
                  is_anual_leave: day.leave_category == "A" ? "Y" : "N",
                  month: day.month,
                  year: day.year,
                  hospital_id: hospital_id,
                  created_by: updated_by,
                  updated_by: updated_by,
                  updated_date: new Date(),
                });
              } else {
                let actual = "";
                let neww = "";

                switch (day["status"]) {
                  case "PR":
                    actual = " Present day ";
                    break;
                  case "WO":
                    actual = " week off ";
                    break;

                  case "HO":
                    actual = " Holiday ";
                    break;
                  case "PL":
                    actual = " Paid Leave ";
                    break;
                  case "UL":
                    actual = " UnPaid Leave ";
                    break;
                  case "HPL":
                    actual = "Half Day Paid Leave ";
                    break;
                  case "HUL":
                    actual = " Half UnPaid Leave ";
                    break;
                }
                switch (day["worked_status"]) {
                  case "WO":
                    neww = " week off ";
                    break;

                  case "HO":
                    neww = " Holiday ";
                    break;
                  case "PL":
                    neww = " Paid Leave ";
                    break;
                  case "UL":
                    neww = " UnPaid Leave ";
                    break;
                  case "HPL":
                    neww = "Half Day Paid Leave ";
                    break;
                  case "HUL":
                    neww = " Half UnPaid Leave ";
                    break;
                }

                errorString += ` <li> ${employee["employee_code"]} on  ${moment(
                  day.attendance_date,
                  "YYYY-MM-DD"
                ).format("DD-MM-YYYY")} is ${actual} not ${neww} </li>`;
              }
              break;

            case "N":
              // insertArray.push({
              //   worked_hours: 0,
              //   hours: 0,
              //   minutes: 0,
              //   actual_hours: STDWH,
              //   actual_minutes: STDWM,
              //   employee_id: day.employee_id,
              //   attendance_date: day.attendance_date,
              //   status: "AB",
              //   sub_department_id: day.sub_department_id,
              //   project_id: day.project_id,
              //   is_anual_leave: day.leave_category == "A" ? "Y" : "N",
              //   month: day.month,
              //   year: day.year,
              //   hospital_id: hospital_id,
              //   created_by: updated_by,
              //   updated_by: updated_by,
              //   updated_date: new Date()
              // });
              break;
            case "EXT":
              insertArray.push({
                worked_hours: 0,
                hours: 0,
                minutes: 0,
                actual_hours: 0,
                actual_minutes: 0,
                employee_id: day.employee_id,
                attendance_date: day.attendance_date,
                status: day["worked_status"],
                sub_department_id: day.sub_department_id,
                project_id: day.project_id,
                is_anual_leave: day.leave_category == "A" ? "Y" : "N",
                month: day.month,
                year: day.year,
                hospital_id: hospital_id,
                created_by: updated_by,
                updated_by: updated_by,
                updated_date: new Date(),
              });

              break;

            default:
              if (day["status"] != "N") {
                const respond = bulkTimeValidate(
                  day,
                  employee["employee_code"],
                  STD_WH_,
                  STD_WM_,
                  HALF_HR_,
                  HALF_MIN_
                );

                if (respond.error == true) {
                  errorString += "<li>" + respond.message + "</li>";
                } else {
                  insertArray.push({
                    ...respond.obj,
                    month: day.month,
                    year: day.year,
                    hospital_id: hospital_id,
                    created_by: updated_by,
                    updated_by: updated_by,
                    updated_date: new Date(),
                  });
                }
              } else {
                errorString += ` <li> No project is Assigned for ${
                  employee["employee_code"]
                } on  ${moment(day.attendance_date, "YYYY-MM-DD").format(
                  "DD-MM-YYYY"
                )} </li>`;
              }
              break;
          }
        });
      });

      if (insertArray.length > 0 && errorString == "") {
        let insurtColumns = "";

        let Qry = "";
        if (attendance_type == "DMP") {
          insurtColumns = [
            "sub_department_id",
            "employee_id",
            "attendance_date",
            "status",
            "is_anual_leave",
            "worked_hours",
            "actual_hours",
            "actual_minutes",
            "hours",
            "minutes",
            "project_id",
            "hospital_id",
            "year",
            "month",
            "updated_date",
            "created_by",
            "updated_by",
          ];

          Qry =
            " INSERT INTO hims_f_daily_time_sheet(??) VALUES ?  ON DUPLICATE KEY UPDATE \
            status=values(status),is_anual_leave=values(is_anual_leave),hours=values(hours),minutes=values(minutes),\
            worked_hours=values(worked_hours),actual_hours=values(actual_hours),\
            actual_minutes=values(actual_minutes),project_id=values(project_id),updated_by=values(updated_by),\
            updated_date=values(updated_date);";
        } else if (attendance_type == "DM") {
          insurtColumns = [
            "sub_department_id",
            "employee_id",
            "attendance_date",
            "status",
            "is_anual_leave",
            "worked_hours",
            "actual_hours",
            "actual_minutes",
            "hours",
            "minutes",
            "hospital_id",
            "year",
            "month",
            "created_by",
            "updated_date",
            "updated_by",
          ];

          Qry =
            " INSERT INTO hims_f_daily_time_sheet(??) VALUES ?  ON DUPLICATE KEY UPDATE \
            status=values(status),is_anual_leave=values(is_anual_leave),hours=values(hours),minutes=values(minutes),\
            worked_hours=values(worked_hours),actual_hours=values(actual_hours),\
            actual_minutes=values(actual_minutes) ,updated_by=values(updated_by),\
            updated_date=values(updated_date);";
        }
        // console.log("insertArray", insertArray)
        _mysql
          .executeQuery({
            query: Qry,
            values: insertArray,
            includeValues: insurtColumns,
            bulkInsertOrUpdate: true,
            printQuery: false,
          })
          .then((finalResult) => {
            _mysql
              .executeQuery({
                query: previewStr,
                printQuery: false,
              })
              .then((prevResult) => {
                _mysql.releaseConnection();

                if (prevResult.length > 0) {
                  const outputArray = [];

                  _.chain(prevResult)
                    .groupBy((g) => g.employee_id)
                    .forEach((emp) => {
                      const emp_details = {
                        employee_id: emp[0].employee_id,
                        employee_code: emp[0].employee_code,
                        employee_name: emp[0].full_name,
                      };
                      const data = [];
                      allDates.forEach((dat) => {
                        const attUplded = emp.find((e) => {
                          return e.attendance_date == dat;
                        });

                        if (attUplded) {
                          data.push({
                            hims_f_daily_time_sheet_id:
                              attUplded.hims_f_daily_time_sheet_id,
                            attendance_date: attUplded.attendance_date,
                            status: attUplded.status,
                            worked_hours: attUplded.worked_hours,
                          });
                        } else {
                          data.push({
                            hims_f_daily_time_sheet_id: null,
                            attendance_date: dat,
                            status: "N",
                            worked_hours: "0.00",
                          });
                        }
                      });

                      outputArray.push({
                        ...emp_details,
                        roster: _.chain(data)
                          .sortBy((s) =>
                            parseInt(
                              moment(s.attendance_date, "YYYY-MM-DD").format(
                                "MMDD"
                              )
                            )
                          )
                          .value(),
                      });
                    })
                    .value();

                  resolve(
                    _.chain(outputArray).sortBy((s) =>
                      parseInt(s.employee_code)
                    )
                  );
                } else {
                  reject({
                    message: "No  Time sheet data found",
                    invalid_input: true,
                    allDates: [],
                  });
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                reject(e);
              });
          })
          .catch((e) => {
            _mysql.releaseConnection();
            reject(e);
          });
      } else if (errorString != "") {
        reject({
          invalid_input: true,
          message: errorString,
        });
      } else {
        reject({
          invalid_input: true,
          message: "No data found to upload",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}
//created by irfan :

export function processBulkAtt_Normal(data) {
  const {
    _mysql,
    options,
    strQry,
    input,
    deptStr,
    STDWH,
    STDWM,
    HALF_HR,
    HALF_MIN,
    user_id,
  } = data;
  const dailyAttendance = [];
  return new Promise((resolve, reject) => {
    try {
      // console.log("input", input);
      let month_start = moment(input.year + "-" + input.month, "YYYY-M")
        .startOf("month")
        .format("YYYY-MM-DD");

      let month_end = moment(input.year + "-" + input.month, "YYYY-M")
        .endOf("month")
        .format("YYYY-MM-DD");

      const total_no_Days =
        moment(month_end, "YYYY-MM-DD").diff(
          moment(month_start, "YYYY-MM-DD"),
          "days"
        ) + 1;

      let year, month, prev_year, prev_month;

      year = input.year;
      month = parseInt(input.month);
      if (month == 1) {
        prev_year = parseInt(year) - 1;
        prev_month = 12;
      } else {
        prev_year = year;
        prev_month = parseInt(month) - 1;
      }
      _mysql
        .executeQuery({
          query: ` 
            select E.employee_code,E.full_name, E.hims_d_employee_id
          from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id and E.suspend_salary <>'Y' \
          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\          
           left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
          S.year=? and S.month=? and S.salary_type='NS' where    (E.exit_date is null or E.exit_date >date(?) ) and 
          E.date_of_joining<= date(?) and ( S.salary_processed is null or  S.salary_processed='N')  and TS.hospital_id=? and TS.year=? and TS.month=?    ${strQry.replace(
            /employee_id/gi,
            "TS.employee_id"
          )} group by TS.employee_id having count(*)< ?; 
          select L.from_date,L.to_date, L.employee_joined, L.actual_to_date, L.employee_id from hims_f_leave_application L 
          inner join hims_f_employee_annual_leave AL on AL.leave_application_id=L.hims_f_leave_application_id and from_normal_salary='N'
          where status ='APR' and month=? and year=? and L.employee_id in (?);`,
          values: [
            input.year,
            input.month,
            month_end,
            month_start,
            input.hospital_id,
            input.year,
            input.month,
            total_no_Days,
            input.month,
            input.year,
            input._myemp,
          ],
          printQuery: true,
        })
        .then((att_result) => {
          const partialAtt = att_result[0];
          const annual_leave_data = att_result[1];

          if (partialAtt.length > 0) {
            let message = "";

            partialAtt.forEach((emp) => {
              message += ` <li> ${emp["employee_code"]} -  ${emp["full_name"]} </li>`;
            });

            _mysql.releaseConnection();
            reject({ invalid_input: true, message: message });
          } else {
            _mysql
              .executeQuery({
                query: ` 
              select hims_f_daily_time_sheet_id,TS.employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
            attendance_date,in_time,out_date,out_time,TS.year,TS.month,status,is_anual_leave,posted,hours,minutes,actual_hours,\
            actual_minutes,worked_hours,consider_ot_shrtg,expected_out_date,expected_out_time,TS.hospital_id,TS.project_id, \
            case  when E.exit_date  between date(?) and date(?) then 'Y' else 'N' end as partial_attendance ,E.exit_date 
            from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id and E.suspend_salary <>'Y' \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\          
             left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
            S.year=? and S.month=? and S.salary_type='NS' where   ( S.salary_processed is null or  S.salary_processed='N')  and TS.hospital_id=? and TS.year=? and TS.month=?    ${strQry.replace(
              /employee_id/gi,
              "TS.employee_id"
            )};`,
                values: [
                  month_start,
                  month_end,

                  input.year,
                  input.month,
                  input.hospital_id,
                  input.year,
                  input.month,
                ],
                printQuery: true,
              })
              .then((result) => {
                // const AttenResult = result;
                //present month
                if (result.length > 0) {
                  _.chain(result)
                    .groupBy((g) => g.employee_id)
                    .map((AttenResult) => {
                      const at_leng = AttenResult.length;
                      // console.log("AttenResult", AttenResult.length)
                      const selected_employee_id = _.head(AttenResult);
                      // console.log("selected_employee_id", selected_employee_id)

                      const annual_leave = annual_leave_data.filter(
                        (f) =>
                          f.employee_id === selected_employee_id.employee_id
                      );
                      // console.log("annual_leave", annual_leave)
                      let ann_from_date_mnth = null;
                      let ann_to_date_mnth = null;
                      let attence_till_date = null;
                      // let calc_mnth_annl_leav = 0
                      if (annual_leave.length > 0) {
                        ann_from_date_mnth = moment(
                          annual_leave[0].from_date
                        ).format("M");
                        ann_to_date_mnth = moment(
                          annual_leave[0].actual_to_date
                        ).format("M");
                        if (ann_from_date_mnth == ann_to_date_mnth) {
                          if (annual_leave[0].employee_joined == "N") {
                            attence_till_date = annual_leave[0].actual_to_date;
                          }
                        }
                      }

                      if (AttenResult[0]["partial_attendance"] == "N") {
                        for (let i = 0; i < at_leng; i++) {
                          let shortage_time = 0;
                          let shortage_min = 0;
                          let ot_time = 0;
                          let ot_min = 0;

                          let week_off_ot_hour = 0;
                          let week_off_ot_min = 0;
                          let holiday_ot_hour = 0;
                          let holiday_ot_min = 0;

                          let paid_leave = 0;
                          let unpaid_leave = 0;
                          let anual_leave = 0;
                          if (AttenResult[i]["status"] == "PR") {
                            let total_minutes =
                              parseInt(AttenResult[i]["actual_hours"] * 60) +
                              parseInt(AttenResult[i]["actual_minutes"]);

                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            let diff = total_minutes - worked_minutes;

                            if (diff > 0) {
                              //calculating shortage
                              shortage_time = parseInt(
                                parseInt(diff) / parseInt(60)
                              );
                              shortage_min = parseInt(diff) % parseInt(60);
                            } else if (diff < 0) {
                              //calculating over time
                              ot_time = parseInt(
                                parseInt(Math.abs(diff)) / parseInt(60)
                              );
                              ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                            }
                          } else if (
                            AttenResult[i]["status"] == "WO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            week_off_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            week_off_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else if (
                            AttenResult[i]["status"] == "HO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            holiday_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            holiday_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else {
                            switch (AttenResult[i]["status"]) {
                              case "PL":
                                paid_leave = 1;

                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "UL":
                                unpaid_leave = 1;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "HPL":
                                paid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                              case "HUL":
                                unpaid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                            }
                          }

                          let display_present_days = 0;
                          let present_days = 0;
                          let absent = AttenResult[i]["status"] == "AB" ? 1 : 0;

                          if (AttenResult[i]["status"] == "PR") {
                            display_present_days = 1;
                            present_days = 1;
                          } else if (
                            AttenResult[i]["status"] == "HPL" ||
                            AttenResult[i]["status"] == "HUL"
                          ) {
                            if (AttenResult[i]["hours"] > 0) {
                              display_present_days = 0.5;
                            } else {
                              absent = 0.5;
                            }
                          }

                          if (
                            week_off_ot_hour > 0 ||
                            week_off_ot_min > 0 ||
                            holiday_ot_hour > 0 ||
                            holiday_ot_min > 0
                          ) {
                            display_present_days = 1;
                          }
                          // console.log("attence_till_date", attence_till_date)

                          if (attence_till_date === null) {
                            dailyAttendance.push({
                              employee_id: AttenResult[i]["employee_id"],
                              project_id: AttenResult[i]["project_id"],
                              hospital_id: AttenResult[i]["hospital_id"],
                              sub_department_id:
                                AttenResult[i]["sub_department_id"],
                              attendance_date:
                                AttenResult[i]["attendance_date"],
                              year: input.year,
                              month: input.month,
                              total_days: 1,
                              present_days: present_days,
                              display_present_days: display_present_days,
                              absent_days: absent,
                              total_work_days: 1,
                              weekoff_days:
                                AttenResult[i]["status"] == "WO" ? 1 : 0,
                              holidays:
                                AttenResult[i]["status"] == "HO" ? 1 : 0,
                              paid_leave: paid_leave,
                              unpaid_leave: unpaid_leave,
                              anual_leave: anual_leave,
                              total_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["worked_hours"]
                                  : AttenResult[i]["actual_hours"] +
                                    "." +
                                    AttenResult[i]["actual_minutes"],
                              hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["hours"]
                                  : AttenResult[i]["actual_hours"],
                              minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["minutes"]
                                  : AttenResult[i]["actual_minutes"],
                              working_hours:
                                AttenResult[i]["actual_hours"] +
                                "." +
                                AttenResult[i]["actual_minutes"],

                              shortage_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_time
                                  : 0,
                              shortage_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_min
                                  : 0,
                              ot_work_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_time
                                  : 0,
                              ot_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_min
                                  : 0,

                              ot_weekoff_hours: week_off_ot_hour,
                              ot_weekoff_minutes: week_off_ot_min,
                              ot_holiday_hours: holiday_ot_hour,
                              ot_holiday_minutes: holiday_ot_min,
                            });
                          } else {
                            const date_match = moment(
                              AttenResult[i]["attendance_date"]
                            ).isSameOrBefore(
                              moment(attence_till_date).format("YYYY-MM-DD")
                            );
                            if (date_match) {
                              // console.log("attendance_date", AttenResult[i]["attendance_date"])
                              dailyAttendance.push({
                                employee_id: AttenResult[i]["employee_id"],
                                project_id: AttenResult[i]["project_id"],
                                hospital_id: AttenResult[i]["hospital_id"],
                                sub_department_id:
                                  AttenResult[i]["sub_department_id"],
                                attendance_date:
                                  AttenResult[i]["attendance_date"],
                                year: input.year,
                                month: input.month,
                                total_days: 1,
                                present_days: present_days,
                                display_present_days: display_present_days,
                                absent_days: absent,
                                total_work_days: 1,
                                weekoff_days:
                                  AttenResult[i]["status"] == "WO" ? 1 : 0,
                                holidays:
                                  AttenResult[i]["status"] == "HO" ? 1 : 0,
                                paid_leave: paid_leave,
                                unpaid_leave: unpaid_leave,
                                anual_leave: anual_leave,
                                total_hours:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? AttenResult[i]["worked_hours"]
                                    : AttenResult[i]["actual_hours"] +
                                      "." +
                                      AttenResult[i]["actual_minutes"],
                                hours:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? AttenResult[i]["hours"]
                                    : AttenResult[i]["actual_hours"],
                                minutes:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? AttenResult[i]["minutes"]
                                    : AttenResult[i]["actual_minutes"],
                                working_hours:
                                  AttenResult[i]["actual_hours"] +
                                  "." +
                                  AttenResult[i]["actual_minutes"],

                                shortage_hours:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? shortage_time
                                    : 0,
                                shortage_minutes:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? shortage_min
                                    : 0,
                                ot_work_hours:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? ot_time
                                    : 0,
                                ot_minutes:
                                  AttenResult[i]["consider_ot_shrtg"] == "Y"
                                    ? ot_min
                                    : 0,

                                ot_weekoff_hours: week_off_ot_hour,
                                ot_weekoff_minutes: week_off_ot_min,
                                ot_holiday_hours: holiday_ot_hour,
                                ot_holiday_minutes: holiday_ot_min,
                              });
                            }
                          }
                        }
                      } else {
                        for (let i = 0; i < at_leng; i++) {
                          let shortage_time = 0;
                          let shortage_min = 0;
                          let ot_time = 0;
                          let ot_min = 0;

                          let week_off_ot_hour = 0;
                          let week_off_ot_min = 0;
                          let holiday_ot_hour = 0;
                          let holiday_ot_min = 0;

                          let paid_leave = 0;
                          let unpaid_leave = 0;
                          let anual_leave = 0;
                          if (AttenResult[i]["status"] == "PR") {
                            let total_minutes =
                              parseInt(AttenResult[i]["actual_hours"] * 60) +
                              parseInt(AttenResult[i]["actual_minutes"]);

                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            let diff = total_minutes - worked_minutes;

                            if (diff > 0) {
                              //calculating shortage
                              shortage_time = parseInt(
                                parseInt(diff) / parseInt(60)
                              );
                              shortage_min = parseInt(diff) % parseInt(60);
                            } else if (diff < 0) {
                              //calculating over time
                              ot_time = parseInt(
                                parseInt(Math.abs(diff)) / parseInt(60)
                              );
                              ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                            }
                          } else if (
                            AttenResult[i]["status"] == "WO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            week_off_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            week_off_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else if (
                            AttenResult[i]["status"] == "HO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            holiday_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            holiday_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else {
                            switch (AttenResult[i]["status"]) {
                              case "PL":
                                paid_leave = 1;

                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "UL":
                                unpaid_leave = 1;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "HPL":
                                paid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                              case "HUL":
                                unpaid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                            }
                          }

                          let display_present_days = 0;
                          let present_days = 0;
                          let absent = AttenResult[i]["status"] == "AB" ? 1 : 0;

                          if (AttenResult[i]["status"] == "PR") {
                            display_present_days = 1;
                            present_days = 1;
                          } else if (
                            AttenResult[i]["status"] == "HPL" ||
                            AttenResult[i]["status"] == "HUL"
                          ) {
                            if (AttenResult[i]["hours"] > 0) {
                              display_present_days = 0.5;
                            } else {
                              absent = 0.5;
                            }
                          }

                          if (
                            week_off_ot_hour > 0 ||
                            week_off_ot_min > 0 ||
                            holiday_ot_hour > 0 ||
                            holiday_ot_min > 0
                          ) {
                            display_present_days = 1;
                          }

                          if (
                            AttenResult[i]["attendance_date"] <=
                            AttenResult[0]["exit_date"]
                          ) {
                            dailyAttendance.push({
                              employee_id: AttenResult[i]["employee_id"],
                              project_id: AttenResult[i]["project_id"],
                              hospital_id: AttenResult[i]["hospital_id"],
                              sub_department_id:
                                AttenResult[i]["sub_department_id"],
                              attendance_date:
                                AttenResult[i]["attendance_date"],
                              year: input.year,
                              month: input.month,
                              total_days: 1,
                              present_days: present_days,
                              display_present_days: display_present_days,
                              absent_days: absent,
                              total_work_days: 1,
                              weekoff_days:
                                AttenResult[i]["status"] == "WO" ? 1 : 0,
                              holidays:
                                AttenResult[i]["status"] == "HO" ? 1 : 0,
                              paid_leave: paid_leave,
                              unpaid_leave: unpaid_leave,
                              anual_leave: anual_leave,
                              total_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["worked_hours"]
                                  : AttenResult[i]["actual_hours"] +
                                    "." +
                                    AttenResult[i]["actual_minutes"],
                              hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["hours"]
                                  : AttenResult[i]["actual_hours"],
                              minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["minutes"]
                                  : AttenResult[i]["actual_minutes"],
                              working_hours:
                                AttenResult[i]["actual_hours"] +
                                "." +
                                AttenResult[i]["actual_minutes"],

                              shortage_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_time
                                  : 0,
                              shortage_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_min
                                  : 0,
                              ot_work_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_time
                                  : 0,
                              ot_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_min
                                  : 0,

                              ot_weekoff_hours: week_off_ot_hour,
                              ot_weekoff_minutes: week_off_ot_min,
                              ot_holiday_hours: holiday_ot_hour,
                              ot_holiday_minutes: holiday_ot_min,
                            });
                          } else {
                            dailyAttendance.push({
                              employee_id: AttenResult[i]["employee_id"],
                              project_id: AttenResult[i]["project_id"],
                              hospital_id: AttenResult[i]["hospital_id"],
                              sub_department_id:
                                AttenResult[i]["sub_department_id"],
                              attendance_date:
                                AttenResult[i]["attendance_date"],
                              year: input.year,
                              month: input.month,
                              total_days: 1,
                              present_days: 0,
                              display_present_days: 0,
                              absent_days: 1,
                              total_work_days: 1,
                              weekoff_days: 0,
                              holidays: 0,
                              paid_leave: 0,
                              unpaid_leave: 0,
                              anual_leave: 0,
                              total_hours: 0,
                              hours: 0,
                              minutes: 0,
                              working_hours: 0,

                              shortage_hours: 0,
                              shortage_minutes: 0,
                              ot_work_hours: 0,
                              ot_minutes: 0,

                              ot_weekoff_hours: 0,
                              ot_weekoff_minutes: 0,
                              ot_holiday_hours: 0,
                              ot_holiday_minutes: 0,
                            });
                          }
                        }
                      }
                    })
                    .value();

                  const insurtColumns = [
                    "employee_id",
                    "hospital_id",
                    "sub_department_id",
                    "year",
                    "month",
                    "attendance_date",
                    "total_days",
                    "present_days",
                    "display_present_days",
                    "absent_days",
                    "total_work_days",
                    "weekoff_days",
                    "holidays",
                    "paid_leave",
                    "unpaid_leave",
                    "anual_leave",
                    "hours",
                    "minutes",
                    "total_hours",
                    "working_hours",
                    "shortage_hours",
                    "shortage_minutes",
                    "ot_work_hours",
                    "ot_minutes",
                    "ot_weekoff_hours",
                    "ot_weekoff_minutes",
                    "ot_holiday_hours",
                    "ot_holiday_minutes",
                    "project_id",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT  INTO hims_f_daily_attendance(??) VALUES ? ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
          hospital_id=values(hospital_id),sub_department_id=values(sub_department_id),\
          year=values(year),month=values(month),attendance_date=values(attendance_date),total_days=values(total_days),\
          present_days=values(present_days), display_present_days= values(display_present_days),absent_days=values(absent_days),total_work_days=values(total_work_days),\
          weekoff_days=values(weekoff_days),holidays=values(holidays),paid_leave=values(paid_leave),\
          unpaid_leave=values(unpaid_leave),anual_leave=values(anual_leave), hours=values(hours),minutes=values(minutes),total_hours=values(total_hours),\
          working_hours=values(working_hours), shortage_hours=values(shortage_hours), shortage_minutes=values(shortage_minutes),\
          ot_work_hours=values(ot_work_hours), ot_minutes=values(ot_minutes),ot_weekoff_hours=values(ot_weekoff_hours),ot_weekoff_minutes=values(ot_weekoff_minutes),\
          ot_holiday_hours=values(ot_holiday_hours),ot_holiday_minutes=values(ot_holiday_minutes),project_id=values(project_id)",

                      includeValues: insurtColumns,
                      values: dailyAttendance,
                      bulkInsertOrUpdate: true,
                      printQuery: true,
                    })
                    .then((insertResult) => {
                      let projectQry = "";
                      if (options.attendance_type == "DMP") {
                        projectQry = `select employee_id,project_id,DA.hospital_id,year,month,
                          COALESCE(sum(hours),0 )+ COALESCE( floor(sum(minutes)/60) ,0) as worked_hours,
                          COALESCE(sum(minutes)%60,0) as worked_minutes,\
  
                          COALESCE(sum(ot_work_hours),0 )+ COALESCE( floor(sum(ot_minutes)/60) ,0) as ot_hours,
                          COALESCE(sum(ot_minutes)%60,0) as ot_minutes,
                          COALESCE(sum(ot_weekoff_hours),0 )+ COALESCE( floor(sum(ot_weekoff_minutes)/60) ,0) as wot_hours,
                          COALESCE(sum(ot_weekoff_minutes)%60,0) as wot_minutes ,
                          COALESCE(sum(ot_holiday_hours),0 )+ COALESCE( floor(sum(ot_holiday_minutes)/60) ,0) as hot_hours,
                          COALESCE(sum(ot_holiday_minutes)%60,0) as hot_minutes, 
                           floor((((sum(hours)*60)+ sum(minutes) )-
                          (COALESCE(sum(ot_work_hours)+sum(ot_weekoff_hours)+sum(ot_holiday_hours),0)*60
                          +COALESCE(sum(ot_minutes)+sum(ot_weekoff_minutes)+sum(ot_holiday_minutes),0)))/60) basic_hours,
                           COALESCE((((sum(hours)*60)+ sum(minutes) )-
                          (COALESCE(sum(ot_work_hours)+sum(ot_weekoff_hours)+sum(ot_holiday_hours),0)*60
                          +COALESCE(sum(ot_minutes)+sum(ot_weekoff_minutes)+sum(ot_holiday_minutes),0)))%60,0) basic_minutes
  
                  from hims_f_daily_attendance DA\
                  inner join hims_d_employee E on DA.employee_id=E.hims_d_employee_id\
                  inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
                   where      \
                  DA.hospital_id=${input.hospital_id}  and year=${
                          input.year
                        } and month=${
                          input.month
                        }   ${strQry}    group by employee_id,project_id;
        
                  delete from hims_f_project_wise_payroll  where  
                  hospital_id=${input.hospital_id}  and year=${
                          input.year
                        }  and month=${input.month}  and employee_id in 
                  ( select hims_d_employee_id from hims_d_employee E 
                    left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                    S.year=${input.year} and S.month=${
                          input.month
                        } inner join hims_d_sub_department SD
                   on E.sub_department_id=SD.hims_d_sub_department_id ${strQry.replace(
                     /employee_id/gi,
                     "hims_d_employee_id"
                   )} where   E.suspend_salary <>'Y' and ( S.salary_processed is null or  S.salary_processed='N') ) and hims_f_project_wise_payroll_id>0 ; `;
                      }

                      let total_days = 0;
                      if (options["salary_calendar"] == "F") {
                        total_days = options["salary_calendar_fixed_days"];
                      } else {
                        total_days = moment(month_start).daysInMonth();
                      }

                      _mysql
                        .executeQueryWithTransaction({
                          query: `select DA.employee_id,DA.hospital_id,DA.sub_department_id,DA.year,DA.month,  ${total_days} as total_days,sum(DA.present_days)as present_days,\
                  sum(DA.display_present_days) as display_present_days  ,  sum(DA.absent_days)as absent_days,sum(DA.total_work_days)as total_work_days,sum(DA.weekoff_days)as total_weekoff_days,\
          sum(holidays)as total_holidays,sum(DA.paid_leave)as paid_leave,sum(DA.unpaid_leave)as unpaid_leave,  sum(DA.anual_leave)as anual_leave,   sum(hours)as hours,\
          sum(minutes)as minutes,COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) \
          as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
        '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
          COALESCE(sum(DA.shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as shortage_hours ,\
          COALESCE(sum(DA.ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',sum(ot_minutes)%60),0) as ot_work_hours ,   \
          COALESCE(sum(DA.ot_weekoff_hours),0)+ COALESCE(concat(floor(sum(ot_weekoff_minutes)/60)  ,'.',sum(ot_weekoff_minutes)%60),0) as ot_weekoff_hours,\
          COALESCE(sum(DA.ot_holiday_hours),0)+ COALESCE(concat(floor(sum(ot_holiday_minutes)/60)  ,'.',sum(ot_holiday_minutes)%60),0) as ot_holiday_hours\
         , case  when E.exit_date  between date(?) and date(?) then 'Y' else 'N' end as partial_attendance ,E.exit_date ,
            case when date_of_joining >date(?) then 'Y' else 'N' end as late_joined
          from hims_f_daily_attendance DA\
          inner join hims_d_employee E on DA.employee_id=E.hims_d_employee_id  and E.suspend_salary <>'Y' 
               ${deptStr}      left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
               S.year=? and S.month=? and S.salary_type='NS' where ( S.salary_processed is null or  S.salary_processed='N') and  \
          DA.hospital_id=?  and DA.year=? and DA.month=? and (E.exit_date is null or E.exit_date >date(?) ) ${strQry.replace(
            /employee_id/gi,
            "DA.employee_id"
          )}   group by employee_id;  
          select employee_id, sum(updaid_leave_duration) as updaid_leave_duration from hims_f_pending_leave 
  where month=? and year=? group by employee_id;  ${projectQry}       `,
                          values: [
                            month_start,
                            month_end,
                            month_start,
                            input.year,
                            input.month,
                            input.hospital_id,
                            input.year,
                            input.month,
                            month_start,

                            prev_month,
                            prev_year,
                          ],
                          printQuery: false,
                        })
                        .then((results) => {
                          let DilayResult, pending_unpaid, projectWisePayroll;

                          // if (options.attendance_type == "DMP") {
                          //   DilayResult = results[0];
                          //   projectWisePayroll = results[1];
                          // } else {
                          //   DilayResult = results;
                          // }

                          DilayResult = results[0];
                          pending_unpaid = results[1];
                          if (options.attendance_type == "DMP") {
                            projectWisePayroll = results[2];
                          }

                          let pending_len = pending_unpaid.length;
                          let attResult = [];

                          // console.log("DilayResult", DilayResult)
                          for (let i = 0; i < DilayResult.length; i++) {
                            let pending_unpaid_leave = 0;

                            // console.log("total_work_days", parseFloat(DilayResult[i]["total_work_days"]), options["salary_calendar_fixed_days"])

                            if (pending_len > 0) {
                              let emp_leave = pending_unpaid.find((f) => {
                                return (
                                  DilayResult[i]["employee_id"] == f.employee_id
                                );
                              });

                              if (emp_leave) {
                                pending_unpaid_leave =
                                  emp_leave.updaid_leave_duration;
                              }
                            }
                            if (
                              options["salary_calendar"] == "F" &&
                              DilayResult[i]["partial_attendance"] == "N" &&
                              DilayResult[i]["late_joined"] == "N"
                            ) {
                              let t_paid_days = "";

                              const total_work_days =
                                DilayResult[i]["total_work_days"];
                              // console.log("1", total_work_days)
                              DilayResult[i]["total_work_days"] =
                                options["salary_calendar_fixed_days"];
                              const annual_leave = annual_leave_data.filter(
                                (f) =>
                                  f.employee_id ===
                                  DilayResult[i]["employee_id"]
                              );
                              // console.log("annual_leave", annual_leave)
                              let ann_from_date_mnth = null;
                              let ann_to_date_mnth = null;
                              let calc_mnth_annl_leav = 0;
                              let employee_join = false;
                              let _salary_paid_days = 0;
                              if (annual_leave.length > 0) {
                                ann_from_date_mnth = moment(
                                  annual_leave[0].from_date
                                ).format("M");
                                ann_to_date_mnth = moment(
                                  annual_leave[0].actual_to_date
                                ).format("M");
                                if (ann_from_date_mnth == ann_to_date_mnth) {
                                  if (annual_leave[0].employee_joined == "Y") {
                                    employee_join = true;

                                    const fromDate_firstDate = moment(
                                      annual_leave[0].from_date
                                    )
                                      .startOf("month")
                                      .format("YYYY-MM-DD");
                                    calc_mnth_annl_leav = moment(
                                      annual_leave[0].from_date
                                    ).diff(moment(fromDate_firstDate), "days");
                                  }
                                } else {
                                  if (annual_leave[0].employee_joined == "Y") {
                                    const total_no_Days = moment(
                                      annual_leave[0].to_date,
                                      "YYYY-MM-DD"
                                    ).diff(
                                      moment(month_start, "YYYY-MM-DD"),
                                      "days"
                                    );

                                    // console.log("total_no_Days", total_no_Days);

                                    _salary_paid_days =
                                      total_no_Days -
                                      DilayResult[i]["anual_leave"];
                                  }
                                }
                              }

                              // console.log(
                              //   "_salary_paid_days",
                              //   _salary_paid_days
                              // );
                              // console.log(
                              //   "salary_calendar_fixed_days",
                              //   options["salary_calendar_fixed_days"]
                              // );
                              // console.log("ann_to_date_mnth", ann_to_date_mnth);
                              // console.log("annual_leave", annual_leave.length);
                              // console.log("employee_join", employee_join);
                              // console.log(options["leave_salary_payment_days"]);

                              if (
                                parseFloat(total_work_days) <
                                  parseFloat(
                                    options["salary_calendar_fixed_days"]
                                  ) &&
                                ann_to_date_mnth !== null &&
                                employee_join == false
                              ) {
                                DilayResult[i]["total_work_days"] =
                                  total_work_days;
                              }

                              // console.log(
                              //   "total_work_days",
                              //   DilayResult[i]["total_work_days"]
                              // );

                              // console.log("employee_join", employee_join);
                              // console.log(
                              //   "anual_leave",
                              //   DilayResult[i]["anual_leave"]
                              // );
                              // console.log(
                              //   "leave_salary_payment_days",
                              //   options["leave_salary_payment_days"]
                              // );
                              if (
                                DilayResult[i]["anual_leave"] > 0 &&
                                options["leave_salary_payment_days"] == "P" &&
                                employee_join == false
                              ) {
                                // console.log("DilayResult", DilayResult[i]);
                                // let _earlyjoin;
                                const month_days =
                                  moment(month_start).daysInMonth();
                                DilayResult[i]["total_days"] = month_days;

                                // console.log(
                                //   "total_days",
                                //   parseFloat(DilayResult[i]["total_days"])
                                // );
                                // console.log(
                                //   "total_work_days",
                                //   parseFloat(DilayResult[i]["total_work_days"])
                                // );
                                // console.log("annual_leave", annual_leave);
                                // if (annual_leave[0].employee_joined == "Y") {
                                // }
                                if (
                                  parseFloat(DilayResult[i]["total_days"]) <
                                  parseFloat(DilayResult[i]["total_work_days"])
                                ) {
                                  // console.log("1");
                                  t_paid_days =
                                    DilayResult[i]["total_work_days"] -
                                    parseFloat(DilayResult[i]["absent_days"]) -
                                    parseFloat(DilayResult[i]["unpaid_leave"]) -
                                    parseFloat(DilayResult[i]["anual_leave"]) -
                                    parseFloat(pending_unpaid_leave) -
                                    parseFloat(calc_mnth_annl_leav) -
                                    parseFloat(_salary_paid_days);
                                } else {
                                  // console.log("2");
                                  t_paid_days =
                                    parseFloat(DilayResult[i]["present_days"]) +
                                    parseFloat(DilayResult[i]["paid_leave"]) +
                                    parseFloat(
                                      DilayResult[i]["total_weekoff_days"]
                                    ) +
                                    parseFloat(
                                      DilayResult[i]["total_holidays"]
                                    ) -
                                    parseFloat(DilayResult[i]["anual_leave"]) -
                                    parseFloat(pending_unpaid_leave) -
                                    parseFloat(calc_mnth_annl_leav) -
                                    parseFloat(_salary_paid_days);
                                }

                                // DilayResult[i]["total_work_days"] = month_days;
                              } else {
                                // console.log("2 else")
                                let annual_leaves = parseFloat(
                                  DilayResult[i]["anual_leave"]
                                );
                                // console.log("annual_leaves", annual_leaves)
                                if (
                                  parseFloat(DilayResult[i]["anual_leave"]) >
                                  parseFloat(
                                    options["salary_calendar_fixed_days"]
                                  )
                                ) {
                                  annual_leaves = parseFloat(
                                    options["salary_calendar_fixed_days"]
                                  );
                                }

                                t_paid_days =
                                  parseFloat(DilayResult[i]["absent_days"]) >
                                  DilayResult[i]["total_days"]
                                    ? 0
                                    : DilayResult[i]["total_work_days"] -
                                      parseFloat(
                                        DilayResult[i]["absent_days"]
                                      ) -
                                      parseFloat(
                                        DilayResult[i]["unpaid_leave"]
                                      ) -
                                      annual_leaves -
                                      //parseFloat(DilayResult[i]["anual_leave"]) -
                                      parseFloat(pending_unpaid_leave) -
                                      parseFloat(calc_mnth_annl_leav);
                              }

                              // DilayResult[i]["total_days"]=options["salary_calendar_fixed_days"];

                              // console.log("t_paid_days", t_paid_days);
                              // console.log(
                              //   "paid_leave",
                              //   DilayResult[i]["paid_leave"]
                              // );
                              // console.log(
                              //   "unpaid_leave",
                              //   DilayResult[i]["unpaid_leave"]
                              // );
                              // console.log(
                              //   "pending_unpaid_leave",
                              //   pending_unpaid_leave
                              // );
                              attResult.push({
                                ...DilayResult[i],
                                total_paid_days:
                                  t_paid_days >=
                                  options["salary_calendar_fixed_days"]
                                    ? options["salary_calendar_fixed_days"]
                                    : t_paid_days,
                                total_leave:
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(DilayResult[i]["unpaid_leave"]) +
                                  parseFloat(pending_unpaid_leave),
                                pending_unpaid_leave: pending_unpaid_leave,
                                created_date: new Date(),
                                created_by: user_id,
                                updated_date: new Date(),
                                updated_by: user_id,
                              });
                            } else {
                              // console.log("Here im i");
                              attResult.push({
                                ...DilayResult[i],
                                total_paid_days:
                                  parseFloat(DilayResult[i]["present_days"]) +
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(
                                    DilayResult[i]["total_weekoff_days"]
                                  ) +
                                  parseFloat(DilayResult[i]["total_holidays"]) -
                                  parseFloat(DilayResult[i]["anual_leave"]) -
                                  parseFloat(pending_unpaid_leave),
                                total_leave:
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(DilayResult[i]["unpaid_leave"]) +
                                  parseFloat(pending_unpaid_leave),
                                pending_unpaid_leave: pending_unpaid_leave,
                                created_date: new Date(),
                                created_by: user_id,
                                updated_date: new Date(),
                                updated_by: user_id,
                              });
                            }
                          }

                          const insurtColumns = [
                            "employee_id",
                            "year",
                            "month",
                            "hospital_id",
                            "sub_department_id",
                            "total_days",
                            "present_days",
                            "display_present_days",
                            "absent_days",
                            "total_work_days",
                            "total_weekoff_days",
                            "total_holidays",
                            "total_leave",
                            "paid_leave",
                            "unpaid_leave",
                            "total_paid_days",
                            "total_hours",
                            "total_working_hours",
                            "shortage_hours",
                            "ot_work_hours",
                            "ot_weekoff_hours",
                            "ot_holiday_hours",
                            "pending_unpaid_leave",
                            "created_date",
                            "created_by",
                            "updated_date",
                            "updated_by",
                          ];

                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "INSERT INTO hims_f_attendance_monthly(??) VALUES ? ON DUPLICATE KEY UPDATE \
                    employee_id=values(employee_id),year=values(year),\
                    month=values(month),hospital_id=values(hospital_id),\
                    sub_department_id=values(sub_department_id),total_days=values(total_days),present_days=values(present_days),\
                    display_present_days=values(display_present_days), absent_days=values(absent_days),total_work_days=values(total_work_days),\
                    total_weekoff_days=values(total_weekoff_days),total_holidays=values(total_holidays),total_leave=values(total_leave),\
                    paid_leave=values(paid_leave),unpaid_leave=values(unpaid_leave),total_paid_days=values(total_paid_days),\
                    total_hours=values(total_hours),total_working_hours=values(total_working_hours),shortage_hours=values(shortage_hours)\
                    ,ot_work_hours=values(ot_work_hours),ot_weekoff_hours=values(ot_weekoff_hours),ot_holiday_hours=values(ot_holiday_hours),\
                    pending_unpaid_leave =values(pending_unpaid_leave)  ,   updated_by=values(updated_by),updated_date=values(updated_date);",
                              values: attResult,
                              includeValues: insurtColumns,
                              bulkInsertOrUpdate: true,
                              printQuery: true,
                            })
                            .then((result) => {
                              if (options.attendance_type == "DMP") {
                                const insertCol = [
                                  "employee_id",
                                  "project_id",
                                  "month",
                                  "year",
                                  "basic_hours",
                                  "basic_minutes",
                                  "ot_hours",
                                  "ot_minutes",
                                  "wot_hours",
                                  "wot_minutes",
                                  "hot_hours",
                                  "hot_minutes",
                                  "worked_hours",
                                  "worked_minutes",
                                  "hospital_id",
                                ];

                                _mysql
                                  .executeQueryWithTransaction({
                                    query:
                                      " INSERT   INTO hims_f_project_wise_payroll(??) VALUES ?  ON DUPLICATE KEY UPDATE \
                                        basic_hours=values(basic_hours),basic_minutes=values(basic_minutes),ot_hours=values(ot_hours),\
                                        ot_minutes=values(ot_minutes),wot_hours=values(wot_hours),\
                                        wot_minutes=values(wot_minutes),hot_hours=values(hot_hours),hot_minutes=values(hot_minutes),\
                                         worked_hours=values(worked_hours),worked_minutes=values(worked_minutes)",
                                    values: projectWisePayroll,
                                    includeValues: insertCol,
                                    printQuery: false,

                                    bulkInsertOrUpdate: true,
                                  })
                                  .then((projectwiseInsert) => {
                                    _mysql.commitTransaction(() => {
                                      _mysql.releaseConnection();
                                      resolve(projectwiseInsert);
                                    });
                                  })
                                  .catch((e) => {
                                    _mysql.rollBackTransaction(() => {
                                      reject({
                                        invalid_input: true,
                                        message: e,
                                      });
                                    });
                                  });
                              } else {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();
                                  resolve(result);
                                });
                              }
                            })
                            .catch((e) => {
                              _mysql.rollBackTransaction(() => {
                                reject({ invalid_input: true, message: e });
                              });
                            });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            reject({ invalid_input: true, message: e });
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        reject({ invalid_input: true, message: e });
                      });
                    });
                } else {
                  _mysql.releaseConnection();

                  reject({
                    invalid_input: true,
                    message: " Daily time sheet doesn't Exist ",
                  });
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                reject({ invalid_input: true, message: e });
              });
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          reject({ invalid_input: true, message: e });
        });
    } catch (e) {
      reject(e);
    }
  });
}
//created by irfan :
export function processBulkAtt_with_cutoff(data) {
  const {
    _mysql,
    options,
    strQry,
    input,
    deptStr,
    STDWH,
    STDWM,
    HALF_HR,
    HALF_MIN,
    user_id,
  } = data;
  const dailyAttendance = [];

  let year, month, prev_year, prev_month;

  year = input.year;
  month = parseInt(input.month);

  if (month == 1) {
    prev_year = parseInt(year) - 1;
    prev_month = 12;
  } else {
    prev_year = year;
    prev_month = parseInt(month) - 1;
  }

  let month_start,
    month_end,
    cutoff_day,
    cutoff_next_day,
    prev_cutoff_next_day,
    prev_month_end;

  month_start = moment(year + "-" + month, "YYYY-M")
    .startOf("month")
    .format("YYYY-MM-DD");

  month_end = moment(year + "-" + month, "YYYY-M")
    .endOf("month")
    .format("YYYY-MM-DD");

  cutoff_day = moment(
    year + "-" + month + "-" + options.payroll_payment_date,
    "YYYY-M-D"
  ).format("YYYY-MM-DD");

  cutoff_next_day = moment(
    year + "-" + month + "-" + (parseInt(options.payroll_payment_date) + 1),
    "YYYY-M-D"
  ).format("YYYY-MM-DD");

  prev_cutoff_next_day = moment(
    prev_year +
      "-" +
      prev_month +
      "-" +
      (parseInt(options.payroll_payment_date) + 1),
    "YYYY-M-D"
  ).format("YYYY-MM-DD");

  prev_month_end = moment(prev_year + "-" + prev_month, "YYYY-M")
    .endOf("month")
    .format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    try {
      const total_no_Days =
        moment(cutoff_day, "YYYY-MM-DD").diff(
          moment(prev_cutoff_next_day, "YYYY-MM-DD"),
          "days"
        ) + 1;
      _mysql
        .executeQuery({
          query: `    
     select E.employee_code,E.full_name
    from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id 
    and E.suspend_salary <>'Y'  ${deptStr}  left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
    S.year=? and S.month=? where E.date_of_joining<= date(?) and ( S.salary_processed is null or  S.salary_processed='N')   and 
    TS.hospital_id=? and attendance_date between
    date(?) and date(?)   ${strQry.replace(
      /employee_id/gi,
      "TS.employee_id"
    )}  group by TS.employee_id  
      having count(*)< ?;    `,
          values: [
            year,
            month,
            prev_cutoff_next_day,
            input.hospital_id,
            prev_cutoff_next_day,
            cutoff_day,
            total_no_Days,
          ],
          printQuery: false,
        })
        .then((partialAtt) => {
          if (partialAtt.length > 0) {
            let message = "";

            partialAtt.forEach((emp) => {
              message += ` <li> ${emp["employee_code"]} -  ${emp["full_name"]} </li>`;
            });

            _mysql.releaseConnection();
            reject({ invalid_input: true, message: message });
          } else {
            let cur_mon_after_cutoff_roster = "";
            if (options.attendance_type == "DMP") {
              cur_mon_after_cutoff_roster = `select hims_f_project_roster_id,employee_id,attendance_date,project_id
                from   hims_d_employee E inner join hims_f_project_roster PR on PR.employee_id=E.hims_d_employee_id  ${deptStr} 
                where PR.hospital_id=${input.hospital_id} and attendance_date between date('${cutoff_next_day}') and date('${month_end}')   ${strQry};  `;
            }
            _mysql
              .executeQuery({
                query: ` select hims_f_daily_time_sheet_id,employee_id,TS.sub_department_id, 
            attendance_date, year,month,status,is_anual_leave,posted,hours,minutes,actual_hours,
            actual_minutes,worked_hours, TS.hospital_id,TS.project_id
            from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id ${deptStr} 
            where  year=? and month=? and TS.hospital_id=?  and attendance_date between
            date(?) and date(?)            ${strQry};
            
            select hims_f_daily_time_sheet_id,TS.employee_id,TS.sub_department_id,E.religion_id, 
            attendance_date, TS.year,TS.month,status,is_anual_leave,posted,hours,minutes,actual_hours,
            actual_minutes,worked_hours,  TS.hospital_id,TS.project_id,
            case  when E.exit_date  between date(?) and date(?) then 'Y' else 'N' end as partial_attendance ,E.exit_date 
            from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id 
            and E.suspend_salary <>'Y'  ${deptStr} 
            left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
            S.year=? and S.month=? 
            where  ( S.salary_processed is null or  S.salary_processed='N') and TS.year=? and TS.month=? and   TS.hospital_id=? and attendance_date between
            date(?) and date(?)        ${strQry.replace(
              /employee_id/gi,
              "TS.employee_id"
            )} ; 
            
  
            select hims_f_pending_leave_id, hims_f_leave_application_id,P.employee_id,
            leave_application_code,from_leave_session,case L.leave_type when 'P' then 'PL' when 
            'U' then 'UL'  end as leave_type,L.leave_description,from_date,to_leave_session,to_date,
            holiday_included,weekoff_included,total_applied_days ,leave_category from hims_f_pending_leave  P 
            inner join hims_f_leave_application LA  on P.leave_application_id=LA.hims_f_leave_application_id
            inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id
            where P.year=? and  P.month=?;
  
            select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,
            case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type,
            L.leave_description,from_date,to_leave_session,to_date,holiday_included,
            weekoff_included,total_applied_days ,leave_category from hims_f_leave_application LA 
            inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
            inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id ${deptStr}
            where E.hospital_id=? and LA.status='APR' ${strQry} and  
            (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
            date(?) between  from_date and to_date) ;
  
  
            select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
            holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
            date(holiday_date) between date(?) and date(?);  
            
            ${cur_mon_after_cutoff_roster}
            `,
                values: [
                  prev_year,
                  prev_month,
                  input.hospital_id,
                  prev_cutoff_next_day,
                  prev_month_end,

                  month_start,
                  month_end,
                  year,
                  month,
                  year,
                  month,
                  input.hospital_id,
                  month_start,
                  cutoff_day,

                  prev_year,
                  prev_month,

                  input.hospital_id,
                  cutoff_next_day,
                  month_end,
                  cutoff_next_day,
                  month_end,
                  cutoff_next_day,

                  input.hospital_id,
                  cutoff_next_day,
                  month_end,
                ],
                printQuery: false,
              })
              .then((result) => {
                const prev_month_timesheet = result[0];
                const current_month_timesheet = result[1];
                const pending_leaves = result[2];
                const current_leaves = result[3];
                const allHolidays = result[4];

                let cm_after_cutoff_roster = null;

                if (options.attendance_type == "DMP") {
                  cm_after_cutoff_roster = _.chain(result[5])
                    .groupBy((g) => g.employee_id)
                    .value();
                }

                const prev_left_days = getDaysArray(
                  new Date(prev_cutoff_next_day),
                  new Date(prev_month_end)
                );

                const current_left_days = getDaysArray(
                  new Date(cutoff_next_day),
                  new Date(month_end)
                );

                if (current_month_timesheet.length > 0) {
                  const prev_month_timesheet_data = _.chain(
                    prev_month_timesheet
                  )
                    .groupBy((g) => g.employee_id)
                    .value();

                  _.chain(current_month_timesheet)
                    .groupBy((g) => g.employee_id)
                    .forEach((AttenResult) => {
                      const len = AttenResult.length;

                      const prev_data =
                        prev_month_timesheet_data[
                          AttenResult[0]["employee_id"]
                        ];

                      const empUnpaidPending = pending_leaves.filter((f) => {
                        return f.employee_id == AttenResult[0].employee_id;
                      });

                      const pendingLen = empUnpaidPending.length;
                      //if employee exit in current month
                      if (AttenResult[0]["partial_attendance"] == "N") {
                        for (let i = 0; i < len; i++) {
                          let shortage_time = 0;
                          let shortage_min = 0;
                          let ot_time = 0;
                          let ot_min = 0;

                          let week_off_ot_hour = 0;
                          let week_off_ot_min = 0;
                          let holiday_ot_hour = 0;
                          let holiday_ot_min = 0;

                          let paid_leave = 0;
                          let unpaid_leave = 0;
                          let anual_leave = 0;

                          if (AttenResult[i]["status"] == "PR") {
                            let total_minutes =
                              parseInt(AttenResult[i]["actual_hours"] * 60) +
                              parseInt(AttenResult[i]["actual_minutes"]);

                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            let diff = total_minutes - worked_minutes;

                            if (diff > 0) {
                              //calculating shortage
                              shortage_time = parseInt(
                                parseInt(diff) / parseInt(60)
                              );
                              shortage_min = parseInt(diff) % parseInt(60);
                            } else if (diff < 0) {
                              //calculating over time
                              ot_time = parseInt(
                                parseInt(Math.abs(diff)) / parseInt(60)
                              );
                              ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                            }
                          } else if (
                            AttenResult[i]["status"] == "WO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            week_off_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            week_off_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else if (
                            AttenResult[i]["status"] == "HO" &&
                            AttenResult[i]["worked_hours"] > 0
                          ) {
                            let worked_minutes =
                              parseInt(AttenResult[i]["hours"] * 60) +
                              parseInt(AttenResult[i]["minutes"]);

                            //calculating over time
                            holiday_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            holiday_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          } else {
                            switch (AttenResult[i]["status"]) {
                              case "PL":
                                paid_leave = 1;

                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "UL":
                                unpaid_leave = 1;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 1;
                                break;
                              case "HPL":
                                paid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                              case "HUL":
                                unpaid_leave = 0.5;
                                if (AttenResult[i]["is_anual_leave"] == "Y")
                                  anual_leave = 0.5;
                                break;
                            }
                          }

                          let display_present_days = 0;
                          let present_days = 0;
                          let absent = AttenResult[i]["status"] == "AB" ? 1 : 0;

                          if (AttenResult[i]["status"] == "PR") {
                            display_present_days = 1;
                            present_days = 1;
                          } else if (
                            AttenResult[i]["status"] == "HPL" ||
                            AttenResult[i]["status"] == "HUL"
                          ) {
                            if (AttenResult[i]["hours"] > 0) {
                              display_present_days = 0.5;
                            } else {
                              absent = 0.5;
                            }
                          }

                          if (
                            week_off_ot_hour > 0 ||
                            week_off_ot_min > 0 ||
                            holiday_ot_hour > 0 ||
                            holiday_ot_min > 0
                          ) {
                            display_present_days = 1;
                          }

                          dailyAttendance.push({
                            employee_id: AttenResult[i]["employee_id"],
                            project_id: AttenResult[i]["project_id"],
                            hospital_id: AttenResult[i]["hospital_id"],
                            sub_department_id:
                              AttenResult[i]["sub_department_id"],
                            attendance_date: AttenResult[i]["attendance_date"],
                            year: input.year,
                            month: input.month,
                            total_days: 1,
                            present_days: present_days,
                            display_present_days: display_present_days,
                            absent_days: absent,
                            total_work_days: 1,
                            weekoff_days:
                              AttenResult[i]["status"] == "WO" ? 1 : 0,
                            holidays: AttenResult[i]["status"] == "HO" ? 1 : 0,
                            paid_leave: paid_leave,
                            unpaid_leave: unpaid_leave,
                            anual_leave: anual_leave,
                            total_hours:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? AttenResult[i]["worked_hours"]
                                : AttenResult[i]["actual_hours"] +
                                  "." +
                                  AttenResult[i]["actual_minutes"],
                            hours:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? AttenResult[i]["hours"]
                                : AttenResult[i]["actual_hours"],
                            minutes:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? AttenResult[i]["minutes"]
                                : AttenResult[i]["actual_minutes"],
                            working_hours:
                              AttenResult[i]["actual_hours"] +
                              "." +
                              AttenResult[i]["actual_minutes"],

                            shortage_hours:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? shortage_time
                                : 0,
                            shortage_minutes:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? shortage_min
                                : 0,
                            ot_work_hours:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? ot_time
                                : 0,
                            ot_minutes:
                              AttenResult[i]["consider_ot_shrtg"] == "Y"
                                ? ot_min
                                : 0,

                            ot_weekoff_hours: week_off_ot_hour,
                            ot_weekoff_minutes: week_off_ot_min,
                            ot_holiday_hours: holiday_ot_hour,
                            ot_holiday_minutes: holiday_ot_min,
                          });
                        }

                        const empLeave = current_leaves.filter((f) => {
                          return f.employee_id == AttenResult[0].employee_id;
                        });
                        const leaveLen = empLeave.length;

                        const empHolidayweekoff =
                          getEmployeeWeekOffsandHolidays(
                            cutoff_next_day,
                            AttenResult[0],
                            allHolidays
                          );

                        // const empUnpaidPending = pending_leaves.filter((f) => {
                        //   return f.employee_id == AttenResult[0].employee_id;
                        // });

                        // const pendingLen = empUnpaidPending.length;

                        const holidayLen = empHolidayweekoff.length;

                        //ST-CURRENT MONTH AFTER CUTTOFF

                        if (options.attendance_type == "DMP") {
                          const rosterData =
                            cm_after_cutoff_roster[
                              AttenResult[0]["employee_id"]
                            ];

                          current_left_days.forEach((attendance_date) => {
                            let leave,
                              holiday_or_weekOff = null;

                            if (leaveLen > 0) {
                              const leaveFound = empLeave.find((f) => {
                                return (
                                  f.from_date <= attendance_date &&
                                  attendance_date <= f.to_date
                                );
                              });

                              if (leaveFound) {
                                let leave_days = 1;
                                if (
                                  leaveFound.from_date == leaveFound.to_date &&
                                  leaveFound.to_date == attendance_date &&
                                  parseFloat(leaveFound.total_applied_days) ==
                                    parseFloat(0.5)
                                ) {
                                  leaveFound.leave_type =
                                    leaveFound.leave_type == "PL"
                                      ? "HPL"
                                      : "HUL";
                                  leave_days = "0.5";
                                } else if (
                                  leaveFound.from_date != leaveFound.to_date
                                ) {
                                  if (
                                    leaveFound.from_date == attendance_date &&
                                    leaveFound.from_leave_session == "SH"
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  } else if (
                                    leaveFound.to_date == attendance_date &&
                                    leaveFound.to_leave_session == "FH"
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  }
                                }

                                leave = {
                                  holiday_included: leaveFound.holiday_included,
                                  weekoff_included: leaveFound.weekoff_included,
                                  attendance_date: attendance_date,
                                  status: leaveFound.leave_type,
                                  leave_category: leaveFound.leave_category,
                                  leave_days: leave_days,
                                };
                              }
                            }

                            if (holidayLen > 0) {
                              const HolidayFound = empHolidayweekoff.find(
                                (f) => {
                                  return f.holiday_date == attendance_date;
                                }
                              );

                              if (HolidayFound) {
                                holiday_or_weekOff = HolidayFound;
                              }
                            }

                            const rosterDay = rosterData.find((f) => {
                              return f.attendance_date == attendance_date;
                            });

                            //-------------------------------------------
                            if (
                              (holiday_or_weekOff == null && leave != null) ||
                              (leave != null &&
                                holiday_or_weekOff != null &&
                                holiday_or_weekOff.holiday == "Y" &&
                                leave.holiday_included == "Y") ||
                              (leave != null &&
                                holiday_or_weekOff != null &&
                                holiday_or_weekOff.weekoff == "Y" &&
                                leave.weekoff_included == "Y")
                            ) {
                              let present_days,
                                display_present_days = 0;

                              if (
                                leave.status == "HPL" ||
                                leave.status == "HUL"
                              ) {
                                present_days = "0.5";
                                display_present_days = "0.5";
                              }

                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: rosterDay["project_id"],
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: present_days,
                                display_present_days: display_present_days,
                                absent_days: 0,
                                total_work_days: 1,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave:
                                  leave.status == "PL" || leave.status == "HPL"
                                    ? leave.leave_days
                                    : 0,
                                unpaid_leave:
                                  leave.status == "UL" || leave.status == "HUL"
                                    ? leave.leave_days
                                    : 0,
                                anual_leave:
                                  leave.leave_category == "A"
                                    ? leave.leave_days
                                    : 0,
                                total_hours:
                                  present_days == "0.5"
                                    ? HALF_HR + "." + HALF_MIN
                                    : 0,
                                hours: present_days == "0.5" ? HALF_HR : 0,
                                minutes: present_days == "0.5" ? HALF_MIN : 0,
                                working_hours:
                                  present_days == "0.5"
                                    ? HALF_HR + "." + HALF_MIN
                                    : 0,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            } else if (holiday_or_weekOff != null) {
                              if (holiday_or_weekOff.weekoff == "Y") {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: rosterDay["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 0,
                                  display_present_days: 0,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 1,
                                  holidays: 0,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: 0,
                                  hours: 0,
                                  minutes: 0,
                                  working_hours: 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              } else if (holiday_or_weekOff.holiday == "Y") {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: rosterDay["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 0,
                                  display_present_days: 0,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 0,
                                  holidays: 1,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: 0,
                                  hours: 0,
                                  minutes: 0,
                                  working_hours: 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              }
                            } else {
                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: rosterDay["project_id"],
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: 1,
                                display_present_days: 1,
                                absent_days: 0,
                                total_work_days: 0,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave: 0,

                                unpaid_leave: 0,
                                anual_leave: 0,
                                total_hours: STDWH + "." + STDWM,
                                hours: STDWH,
                                minutes: STDWM,
                                working_hours: STDWH + "." + STDWM,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            }
                          });
                        } else {
                          current_left_days.forEach((attendance_date) => {
                            let leave,
                              holiday_or_weekOff = null;

                            if (leaveLen > 0) {
                              const leaveFound = empLeave.find((f) => {
                                return (
                                  f.from_date <= attendance_date &&
                                  attendance_date <= f.to_date
                                );
                              });

                              if (leaveFound) {
                                let leave_days = 1;
                                if (
                                  leaveFound.from_date == leaveFound.to_date &&
                                  leaveFound.to_date == attendance_date &&
                                  parseFloat(leaveFound.total_applied_days) ==
                                    parseFloat(0.5)
                                ) {
                                  leaveFound.leave_type =
                                    leaveFound.leave_type == "PL"
                                      ? "HPL"
                                      : "HUL";
                                  leave_days = "0.5";
                                } else if (
                                  leaveFound.from_date != leaveFound.to_date
                                ) {
                                  if (
                                    leaveFound.from_date == attendance_date &&
                                    leaveFound.from_leave_session == "SH"
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  } else if (
                                    leaveFound.to_date == attendance_date &&
                                    leaveFound.to_leave_session == "FH"
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  }
                                }

                                leave = {
                                  holiday_included: leaveFound.holiday_included,
                                  weekoff_included: leaveFound.weekoff_included,
                                  attendance_date: attendance_date,
                                  status: leaveFound.leave_type,
                                  leave_category: leaveFound.leave_category,
                                  leave_days: leave_days,
                                };
                              }
                            }

                            if (holidayLen > 0) {
                              const HolidayFound = empHolidayweekoff.find(
                                (f) => {
                                  return f.holiday_date == attendance_date;
                                }
                              );

                              if (HolidayFound) {
                                holiday_or_weekOff = HolidayFound;
                              }
                            }

                            //-------------------------------------------
                            if (
                              (holiday_or_weekOff == null && leave != null) ||
                              (leave != null &&
                                holiday_or_weekOff != null &&
                                holiday_or_weekOff.holiday == "Y" &&
                                leave.holiday_included == "Y") ||
                              (leave != null &&
                                holiday_or_weekOff != null &&
                                holiday_or_weekOff.weekoff == "Y" &&
                                leave.weekoff_included == "Y")
                            ) {
                              let present_days,
                                display_present_days = 0;

                              if (
                                leave.status == "HPL" ||
                                leave.status == "HUL"
                              ) {
                                present_days = "0.5";
                                display_present_days = "0.5";
                              }

                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: AttenResult[0]["project_id"],
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: present_days,
                                display_present_days: display_present_days,
                                absent_days: 0,
                                total_work_days: 1,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave:
                                  leave.status == "PL" || leave.status == "HPL"
                                    ? leave.leave_days
                                    : 0,
                                unpaid_leave:
                                  leave.status == "UL" || leave.status == "HUL"
                                    ? leave.leave_days
                                    : 0,
                                anual_leave:
                                  leave.leave_category == "A"
                                    ? leave.leave_days
                                    : 0,
                                total_hours:
                                  present_days == "0.5"
                                    ? HALF_HR + "." + HALF_MIN
                                    : 0,
                                hours: present_days == "0.5" ? HALF_HR : 0,
                                minutes: present_days == "0.5" ? HALF_MIN : 0,
                                working_hours:
                                  present_days == "0.5"
                                    ? HALF_HR + "." + HALF_MIN
                                    : 0,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            } else if (holiday_or_weekOff != null) {
                              if (holiday_or_weekOff.weekoff == "Y") {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: AttenResult[0]["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 0,
                                  display_present_days: 0,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 1,
                                  holidays: 0,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: 0,
                                  hours: 0,
                                  minutes: 0,
                                  working_hours: 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              } else if (holiday_or_weekOff.holiday == "Y") {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: AttenResult[0]["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 0,
                                  display_present_days: 0,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 0,
                                  holidays: 1,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: 0,
                                  hours: 0,
                                  minutes: 0,
                                  working_hours: 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              }
                            } else {
                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: AttenResult[0]["project_id"],
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: 1,
                                display_present_days: 1,
                                absent_days: 0,
                                total_work_days: 0,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave: 0,

                                unpaid_leave: 0,
                                anual_leave: 0,
                                total_hours: STDWH + "." + STDWM,
                                hours: STDWH,
                                minutes: STDWM,
                                working_hours: STDWH + "." + STDWM,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            }
                          });
                        }

                        //END-CURRENT MONTH AFTER CUTTOFF
                      } else {
                        for (let i = 0; i < len; i++) {
                          if (
                            AttenResult[i]["attendance_date"] <
                            AttenResult[0]["exit_date"]
                          ) {
                            let shortage_time = 0;
                            let shortage_min = 0;
                            let ot_time = 0;
                            let ot_min = 0;

                            let week_off_ot_hour = 0;
                            let week_off_ot_min = 0;
                            let holiday_ot_hour = 0;
                            let holiday_ot_min = 0;

                            let paid_leave = 0;
                            let unpaid_leave = 0;
                            let anual_leave = 0;

                            if (AttenResult[i]["status"] == "PR") {
                              let total_minutes =
                                parseInt(AttenResult[i]["actual_hours"] * 60) +
                                parseInt(AttenResult[i]["actual_minutes"]);

                              let worked_minutes =
                                parseInt(AttenResult[i]["hours"] * 60) +
                                parseInt(AttenResult[i]["minutes"]);

                              let diff = total_minutes - worked_minutes;

                              if (diff > 0) {
                                //calculating shortage
                                shortage_time = parseInt(
                                  parseInt(diff) / parseInt(60)
                                );
                                shortage_min = parseInt(diff) % parseInt(60);
                              } else if (diff < 0) {
                                //calculating over time
                                ot_time = parseInt(
                                  parseInt(Math.abs(diff)) / parseInt(60)
                                );
                                ot_min =
                                  parseInt(Math.abs(diff)) % parseInt(60);
                              }
                            } else if (
                              AttenResult[i]["status"] == "WO" &&
                              AttenResult[i]["worked_hours"] > 0
                            ) {
                              let worked_minutes =
                                parseInt(AttenResult[i]["hours"] * 60) +
                                parseInt(AttenResult[i]["minutes"]);

                              //calculating over time
                              week_off_ot_hour = parseInt(
                                parseInt(Math.abs(worked_minutes)) /
                                  parseInt(60)
                              );
                              week_off_ot_min =
                                parseInt(Math.abs(worked_minutes)) %
                                parseInt(60);
                            } else if (
                              AttenResult[i]["status"] == "HO" &&
                              AttenResult[i]["worked_hours"] > 0
                            ) {
                              let worked_minutes =
                                parseInt(AttenResult[i]["hours"] * 60) +
                                parseInt(AttenResult[i]["minutes"]);

                              //calculating over time
                              holiday_ot_hour = parseInt(
                                parseInt(Math.abs(worked_minutes)) /
                                  parseInt(60)
                              );
                              holiday_ot_min =
                                parseInt(Math.abs(worked_minutes)) %
                                parseInt(60);
                            } else {
                              switch (AttenResult[i]["status"]) {
                                case "PL":
                                  paid_leave = 1;

                                  if (AttenResult[i]["is_anual_leave"] == "Y")
                                    anual_leave = 1;
                                  break;
                                case "UL":
                                  unpaid_leave = 1;
                                  if (AttenResult[i]["is_anual_leave"] == "Y")
                                    anual_leave = 1;
                                  break;
                                case "HPL":
                                  paid_leave = 0.5;
                                  if (AttenResult[i]["is_anual_leave"] == "Y")
                                    anual_leave = 0.5;
                                  break;
                                case "HUL":
                                  unpaid_leave = 0.5;
                                  if (AttenResult[i]["is_anual_leave"] == "Y")
                                    anual_leave = 0.5;
                                  break;
                              }
                            }

                            let display_present_days = 0;
                            let present_days = 0;
                            let absent =
                              AttenResult[i]["status"] == "AB" ? 1 : 0;

                            if (AttenResult[i]["status"] == "PR") {
                              display_present_days = 1;
                              present_days = 1;
                            } else if (
                              AttenResult[i]["status"] == "HPL" ||
                              AttenResult[i]["status"] == "HUL"
                            ) {
                              if (AttenResult[i]["hours"] > 0) {
                                display_present_days = 0.5;
                              } else {
                                absent = 0.5;
                              }
                            }

                            if (
                              week_off_ot_hour > 0 ||
                              week_off_ot_min > 0 ||
                              holiday_ot_hour > 0 ||
                              holiday_ot_min > 0
                            ) {
                              display_present_days = 1;
                            }

                            dailyAttendance.push({
                              employee_id: AttenResult[i]["employee_id"],
                              project_id: AttenResult[i]["project_id"],
                              hospital_id: AttenResult[i]["hospital_id"],
                              sub_department_id:
                                AttenResult[i]["sub_department_id"],
                              attendance_date:
                                AttenResult[i]["attendance_date"],
                              year: input.year,
                              month: input.month,
                              total_days: 1,
                              present_days: present_days,
                              display_present_days: display_present_days,
                              absent_days: absent,
                              total_work_days: 1,
                              weekoff_days:
                                AttenResult[i]["status"] == "WO" ? 1 : 0,
                              holidays:
                                AttenResult[i]["status"] == "HO" ? 1 : 0,
                              paid_leave: paid_leave,
                              unpaid_leave: unpaid_leave,
                              anual_leave: anual_leave,
                              total_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["worked_hours"]
                                  : AttenResult[i]["actual_hours"] +
                                    "." +
                                    AttenResult[i]["actual_minutes"],
                              hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["hours"]
                                  : AttenResult[i]["actual_hours"],
                              minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? AttenResult[i]["minutes"]
                                  : AttenResult[i]["actual_minutes"],
                              working_hours:
                                AttenResult[i]["actual_hours"] +
                                "." +
                                AttenResult[i]["actual_minutes"],

                              shortage_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_time
                                  : 0,
                              shortage_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? shortage_min
                                  : 0,
                              ot_work_hours:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_time
                                  : 0,
                              ot_minutes:
                                AttenResult[i]["consider_ot_shrtg"] == "Y"
                                  ? ot_min
                                  : 0,

                              ot_weekoff_hours: week_off_ot_hour,
                              ot_weekoff_minutes: week_off_ot_min,
                              ot_holiday_hours: holiday_ot_hour,
                              ot_holiday_minutes: holiday_ot_min,
                            });
                          } else {
                            dailyAttendance.push({
                              employee_id: AttenResult[0]["employee_id"],
                              project_id: undefined,
                              hospital_id: AttenResult[0]["hospital_id"],
                              sub_department_id:
                                AttenResult[0]["sub_department_id"],
                              attendance_date:
                                AttenResult[i]["attendance_date"],
                              year: year,
                              month: month,
                              total_days: 1,
                              present_days: 0,
                              display_present_days: 0,
                              absent_days: 1,
                              total_work_days: 1,
                              weekoff_days: 0,
                              holidays: 0,
                              paid_leave: 0,
                              unpaid_leave: 0,
                              anual_leave: 0,
                              total_hours: 0,
                              hours: 0,
                              minutes: 0,
                              working_hours: 0,

                              shortage_hours: 0,
                              shortage_minutes: 0,
                              ot_work_hours: 0,
                              ot_minutes: 0,

                              ot_weekoff_hours: 0,
                              ot_weekoff_minutes: 0,
                              ot_holiday_hours: 0,
                              ot_holiday_minutes: 0,
                            });
                          }
                        }

                        const empLeave = current_leaves.filter((f) => {
                          return f.employee_id == AttenResult[0].employee_id;
                        });
                        const leaveLen = empLeave.length;

                        const empHolidayweekoff =
                          getEmployeeWeekOffsandHolidays(
                            cutoff_next_day,
                            AttenResult[0],
                            allHolidays
                          );

                        const holidayLen = empHolidayweekoff.length;

                        //ST-CURRENT MONTH AFTER CUTTOFF

                        if (options.attendance_type == "DMP") {
                          const rosterData =
                            cm_after_cutoff_roster[
                              AttenResult[0]["employee_id"]
                            ];

                          current_left_days.forEach((attendance_date) => {
                            if (attendance_date < AttenResult[0]["exit_date"]) {
                              let leave,
                                holiday_or_weekOff = null;

                              if (leaveLen > 0) {
                                const leaveFound = empLeave.find((f) => {
                                  return (
                                    f.from_date <= attendance_date &&
                                    attendance_date <= f.to_date
                                  );
                                });

                                if (leaveFound) {
                                  let leave_days = 1;
                                  if (
                                    leaveFound.from_date ==
                                      leaveFound.to_date &&
                                    leaveFound.to_date == attendance_date &&
                                    parseFloat(leaveFound.total_applied_days) ==
                                      parseFloat(0.5)
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  } else if (
                                    leaveFound.from_date != leaveFound.to_date
                                  ) {
                                    if (
                                      leaveFound.from_date == attendance_date &&
                                      leaveFound.from_leave_session == "SH"
                                    ) {
                                      leaveFound.leave_type =
                                        leaveFound.leave_type == "PL"
                                          ? "HPL"
                                          : "HUL";
                                      leave_days = "0.5";
                                    } else if (
                                      leaveFound.to_date == attendance_date &&
                                      leaveFound.to_leave_session == "FH"
                                    ) {
                                      leaveFound.leave_type =
                                        leaveFound.leave_type == "PL"
                                          ? "HPL"
                                          : "HUL";
                                      leave_days = "0.5";
                                    }
                                  }

                                  leave = {
                                    holiday_included:
                                      leaveFound.holiday_included,
                                    weekoff_included:
                                      leaveFound.weekoff_included,
                                    attendance_date: attendance_date,
                                    status: leaveFound.leave_type,
                                    leave_category: leaveFound.leave_category,
                                    leave_days: leave_days,
                                  };
                                }
                              }

                              if (holidayLen > 0) {
                                const HolidayFound = empHolidayweekoff.find(
                                  (f) => {
                                    return f.holiday_date == attendance_date;
                                  }
                                );

                                if (HolidayFound) {
                                  holiday_or_weekOff = HolidayFound;
                                }
                              }

                              const rosterDay = rosterData.find((f) => {
                                return f.attendance_date == attendance_date;
                              });

                              //-------------------------------------------
                              if (
                                (holiday_or_weekOff == null && leave != null) ||
                                (leave != null &&
                                  holiday_or_weekOff != null &&
                                  holiday_or_weekOff.holiday == "Y" &&
                                  leave.holiday_included == "Y") ||
                                (leave != null &&
                                  holiday_or_weekOff != null &&
                                  holiday_or_weekOff.weekoff == "Y" &&
                                  leave.weekoff_included == "Y")
                              ) {
                                let present_days,
                                  display_present_days = 0;

                                if (
                                  leave.status == "HPL" ||
                                  leave.status == "HUL"
                                ) {
                                  present_days = "0.5";
                                  display_present_days = "0.5";
                                }

                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: rosterDay["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: present_days,
                                  display_present_days: display_present_days,
                                  absent_days: 0,
                                  total_work_days: 1,
                                  weekoff_days: 0,
                                  holidays: 0,
                                  paid_leave:
                                    leave.status == "PL" ||
                                    leave.status == "HPL"
                                      ? leave.leave_days
                                      : 0,
                                  unpaid_leave:
                                    leave.status == "UL" ||
                                    leave.status == "HUL"
                                      ? leave.leave_days
                                      : 0,
                                  anual_leave:
                                    leave.leave_category == "A"
                                      ? leave.leave_days
                                      : 0,
                                  total_hours:
                                    present_days == "0.5"
                                      ? HALF_HR + "." + HALF_MIN
                                      : 0,
                                  hours: present_days == "0.5" ? HALF_HR : 0,
                                  minutes: present_days == "0.5" ? HALF_MIN : 0,
                                  working_hours:
                                    present_days == "0.5"
                                      ? HALF_HR + "." + HALF_MIN
                                      : 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              } else if (holiday_or_weekOff != null) {
                                if (holiday_or_weekOff.weekoff == "Y") {
                                  dailyAttendance.push({
                                    employee_id: AttenResult[0]["employee_id"],
                                    project_id: rosterDay["project_id"],
                                    hospital_id: AttenResult[0]["hospital_id"],
                                    sub_department_id:
                                      AttenResult[0]["sub_department_id"],
                                    attendance_date: attendance_date,
                                    year: year,
                                    month: month,
                                    total_days: 1,
                                    present_days: 0,
                                    display_present_days: 0,
                                    absent_days: 0,
                                    total_work_days: 0,
                                    weekoff_days: 1,
                                    holidays: 0,
                                    paid_leave: 0,

                                    unpaid_leave: 0,
                                    anual_leave: 0,
                                    total_hours: 0,
                                    hours: 0,
                                    minutes: 0,
                                    working_hours: 0,

                                    shortage_hours: 0,
                                    shortage_minutes: 0,
                                    ot_work_hours: 0,
                                    ot_minutes: 0,

                                    ot_weekoff_hours: 0,
                                    ot_weekoff_minutes: 0,
                                    ot_holiday_hours: 0,
                                    ot_holiday_minutes: 0,
                                  });
                                } else if (holiday_or_weekOff.holiday == "Y") {
                                  dailyAttendance.push({
                                    employee_id: AttenResult[0]["employee_id"],
                                    project_id: rosterDay["project_id"],
                                    hospital_id: AttenResult[0]["hospital_id"],
                                    sub_department_id:
                                      AttenResult[0]["sub_department_id"],
                                    attendance_date: attendance_date,
                                    year: year,
                                    month: month,
                                    total_days: 1,
                                    present_days: 0,
                                    display_present_days: 0,
                                    absent_days: 0,
                                    total_work_days: 0,
                                    weekoff_days: 0,
                                    holidays: 1,
                                    paid_leave: 0,

                                    unpaid_leave: 0,
                                    anual_leave: 0,
                                    total_hours: 0,
                                    hours: 0,
                                    minutes: 0,
                                    working_hours: 0,

                                    shortage_hours: 0,
                                    shortage_minutes: 0,
                                    ot_work_hours: 0,
                                    ot_minutes: 0,

                                    ot_weekoff_hours: 0,
                                    ot_weekoff_minutes: 0,
                                    ot_holiday_hours: 0,
                                    ot_holiday_minutes: 0,
                                  });
                                }
                              } else {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: rosterDay["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 1,
                                  display_present_days: 1,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 0,
                                  holidays: 0,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: STDWH + "." + STDWM,
                                  hours: STDWH,
                                  minutes: STDWM,
                                  working_hours: STDWH + "." + STDWM,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              }
                            } else {
                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: undefined,
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: 0,
                                display_present_days: 0,
                                absent_days: 1,
                                total_work_days: 1,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave: 0,
                                unpaid_leave: 0,
                                anual_leave: 0,
                                total_hours: 0,
                                hours: 0,
                                minutes: 0,
                                working_hours: 0,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            }
                          });
                        } else {
                          current_left_days.forEach((attendance_date) => {
                            if (attendance_date < AttenResult[0]["exit_date"]) {
                              let leave,
                                holiday_or_weekOff = null;

                              if (leaveLen > 0) {
                                const leaveFound = empLeave.find((f) => {
                                  return (
                                    f.from_date <= attendance_date &&
                                    attendance_date <= f.to_date
                                  );
                                });

                                if (leaveFound) {
                                  let leave_days = 1;
                                  if (
                                    leaveFound.from_date ==
                                      leaveFound.to_date &&
                                    leaveFound.to_date == attendance_date &&
                                    parseFloat(leaveFound.total_applied_days) ==
                                      parseFloat(0.5)
                                  ) {
                                    leaveFound.leave_type =
                                      leaveFound.leave_type == "PL"
                                        ? "HPL"
                                        : "HUL";
                                    leave_days = "0.5";
                                  } else if (
                                    leaveFound.from_date != leaveFound.to_date
                                  ) {
                                    if (
                                      leaveFound.from_date == attendance_date &&
                                      leaveFound.from_leave_session == "SH"
                                    ) {
                                      leaveFound.leave_type =
                                        leaveFound.leave_type == "PL"
                                          ? "HPL"
                                          : "HUL";
                                      leave_days = "0.5";
                                    } else if (
                                      leaveFound.to_date == attendance_date &&
                                      leaveFound.to_leave_session == "FH"
                                    ) {
                                      leaveFound.leave_type =
                                        leaveFound.leave_type == "PL"
                                          ? "HPL"
                                          : "HUL";
                                      leave_days = "0.5";
                                    }
                                  }

                                  leave = {
                                    holiday_included:
                                      leaveFound.holiday_included,
                                    weekoff_included:
                                      leaveFound.weekoff_included,
                                    attendance_date: attendance_date,
                                    status: leaveFound.leave_type,
                                    leave_category: leaveFound.leave_category,
                                    leave_days: leave_days,
                                  };
                                }
                              }

                              if (holidayLen > 0) {
                                const HolidayFound = empHolidayweekoff.find(
                                  (f) => {
                                    return f.holiday_date == attendance_date;
                                  }
                                );

                                if (HolidayFound) {
                                  holiday_or_weekOff = HolidayFound;
                                }
                              }

                              //-------------------------------------------

                              if (
                                (holiday_or_weekOff == null && leave != null) ||
                                (leave != null &&
                                  holiday_or_weekOff != null &&
                                  holiday_or_weekOff.holiday == "Y" &&
                                  leave.holiday_included == "Y") ||
                                (leave != null &&
                                  holiday_or_weekOff != null &&
                                  holiday_or_weekOff.weekoff == "Y" &&
                                  leave.weekoff_included == "Y")
                              ) {
                                let present_days,
                                  display_present_days = 0;

                                if (
                                  leave.status == "HPL" ||
                                  leave.status == "HUL"
                                ) {
                                  present_days = "0.5";
                                  display_present_days = "0.5";
                                }

                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: AttenResult[0]["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: present_days,
                                  display_present_days: display_present_days,
                                  absent_days: 0,
                                  total_work_days: 1,
                                  weekoff_days: 0,
                                  holidays: 0,
                                  paid_leave:
                                    leave.status == "PL" ||
                                    leave.status == "HPL"
                                      ? leave.leave_days
                                      : 0,
                                  unpaid_leave:
                                    leave.status == "UL" ||
                                    leave.status == "HUL"
                                      ? leave.leave_days
                                      : 0,
                                  anual_leave:
                                    leave.leave_category == "A"
                                      ? leave.leave_days
                                      : 0,
                                  total_hours:
                                    present_days == "0.5"
                                      ? HALF_HR + "." + HALF_MIN
                                      : 0,
                                  hours: present_days == "0.5" ? HALF_HR : 0,
                                  minutes: present_days == "0.5" ? HALF_MIN : 0,
                                  working_hours:
                                    present_days == "0.5"
                                      ? HALF_HR + "." + HALF_MIN
                                      : 0,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              } else if (holiday_or_weekOff != null) {
                                if (holiday_or_weekOff.weekoff == "Y") {
                                  dailyAttendance.push({
                                    employee_id: AttenResult[0]["employee_id"],
                                    project_id: AttenResult[0]["project_id"],
                                    hospital_id: AttenResult[0]["hospital_id"],
                                    sub_department_id:
                                      AttenResult[0]["sub_department_id"],
                                    attendance_date: attendance_date,
                                    year: year,
                                    month: month,
                                    total_days: 1,
                                    present_days: 0,
                                    display_present_days: 0,
                                    absent_days: 0,
                                    total_work_days: 0,
                                    weekoff_days: 1,
                                    holidays: 0,
                                    paid_leave: 0,

                                    unpaid_leave: 0,
                                    anual_leave: 0,
                                    total_hours: 0,
                                    hours: 0,
                                    minutes: 0,
                                    working_hours: 0,

                                    shortage_hours: 0,
                                    shortage_minutes: 0,
                                    ot_work_hours: 0,
                                    ot_minutes: 0,

                                    ot_weekoff_hours: 0,
                                    ot_weekoff_minutes: 0,
                                    ot_holiday_hours: 0,
                                    ot_holiday_minutes: 0,
                                  });
                                } else if (holiday_or_weekOff.holiday == "Y") {
                                  dailyAttendance.push({
                                    employee_id: AttenResult[0]["employee_id"],
                                    project_id: AttenResult[0]["project_id"],
                                    hospital_id: AttenResult[0]["hospital_id"],
                                    sub_department_id:
                                      AttenResult[0]["sub_department_id"],
                                    attendance_date: attendance_date,
                                    year: year,
                                    month: month,
                                    total_days: 1,
                                    present_days: 0,
                                    display_present_days: 0,
                                    absent_days: 0,
                                    total_work_days: 0,
                                    weekoff_days: 0,
                                    holidays: 1,
                                    paid_leave: 0,

                                    unpaid_leave: 0,
                                    anual_leave: 0,
                                    total_hours: 0,
                                    hours: 0,
                                    minutes: 0,
                                    working_hours: 0,

                                    shortage_hours: 0,
                                    shortage_minutes: 0,
                                    ot_work_hours: 0,
                                    ot_minutes: 0,

                                    ot_weekoff_hours: 0,
                                    ot_weekoff_minutes: 0,
                                    ot_holiday_hours: 0,
                                    ot_holiday_minutes: 0,
                                  });
                                }
                              } else {
                                dailyAttendance.push({
                                  employee_id: AttenResult[0]["employee_id"],
                                  project_id: AttenResult[0]["project_id"],
                                  hospital_id: AttenResult[0]["hospital_id"],
                                  sub_department_id:
                                    AttenResult[0]["sub_department_id"],
                                  attendance_date: attendance_date,
                                  year: year,
                                  month: month,
                                  total_days: 1,
                                  present_days: 1,
                                  display_present_days: 1,
                                  absent_days: 0,
                                  total_work_days: 0,
                                  weekoff_days: 0,
                                  holidays: 0,
                                  paid_leave: 0,

                                  unpaid_leave: 0,
                                  anual_leave: 0,
                                  total_hours: STDWH + "." + STDWM,
                                  hours: STDWH,
                                  minutes: STDWM,
                                  working_hours: STDWH + "." + STDWM,

                                  shortage_hours: 0,
                                  shortage_minutes: 0,
                                  ot_work_hours: 0,
                                  ot_minutes: 0,

                                  ot_weekoff_hours: 0,
                                  ot_weekoff_minutes: 0,
                                  ot_holiday_hours: 0,
                                  ot_holiday_minutes: 0,
                                });
                              }
                            } else {
                              dailyAttendance.push({
                                employee_id: AttenResult[0]["employee_id"],
                                project_id: null,
                                hospital_id: AttenResult[0]["hospital_id"],
                                sub_department_id:
                                  AttenResult[0]["sub_department_id"],
                                attendance_date: attendance_date,
                                year: year,
                                month: month,
                                total_days: 1,
                                present_days: 0,
                                display_present_days: 0,
                                absent_days: 1,
                                total_work_days: 1,
                                weekoff_days: 0,
                                holidays: 0,
                                paid_leave: 0,
                                unpaid_leave: 0,
                                anual_leave: 0,
                                total_hours: 0,
                                hours: 0,
                                minutes: 0,
                                working_hours: 0,

                                shortage_hours: 0,
                                shortage_minutes: 0,
                                ot_work_hours: 0,
                                ot_minutes: 0,

                                ot_weekoff_hours: 0,
                                ot_weekoff_minutes: 0,
                                ot_holiday_hours: 0,
                                ot_holiday_minutes: 0,
                              });
                            }
                          });
                        }

                        //END-CURRENT MONTH AFTER CUTTOFF
                      }

                      //ST-PREVIOUS MONTH AFTER CUTTOFF
                      prev_left_days.forEach((attendance_date) => {
                        let leave = null;

                        if (pendingLen > 0) {
                          const leaveFound = empUnpaidPending.find((f) => {
                            return (
                              f.from_date <= attendance_date &&
                              attendance_date <= f.to_date
                            );
                          });

                          if (leaveFound) {
                            let leave_days = 1;
                            if (
                              leaveFound.from_date == leaveFound.to_date &&
                              leaveFound.to_date == attendance_date &&
                              parseFloat(leaveFound.total_applied_days) ==
                                parseFloat(0.5)
                            ) {
                              leaveFound.leave_type =
                                leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                              leave_days = "0.5";
                            } else if (
                              leaveFound.from_date != leaveFound.to_date
                            ) {
                              if (
                                leaveFound.from_date == attendance_date &&
                                leaveFound.from_leave_session == "SH"
                              ) {
                                leaveFound.leave_type =
                                  leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                                leave_days = "0.5";
                              } else if (
                                leaveFound.to_date == attendance_date &&
                                leaveFound.to_leave_session == "FH"
                              ) {
                                leaveFound.leave_type =
                                  leaveFound.leave_type == "PL" ? "HPL" : "HUL";
                                leave_days = "0.5";
                              }
                            }

                            leave = {
                              holiday_included: leaveFound.holiday_included,
                              weekoff_included: leaveFound.weekoff_included,
                              attendance_date: attendance_date,
                              status: leaveFound.leave_type,
                              leave_category: leaveFound.leave_category,
                              leave_days: leave_days,
                            };
                          }
                        }

                        const Day = prev_data.find((f) => {
                          return f.attendance_date == attendance_date;
                        });

                        //-------------------------------------------
                        if (
                          (leave != null &&
                            Day.status == "HO" &&
                            leave.holiday_included == "Y") ||
                          (leave != null &&
                            Day.status == "WO" &&
                            leave.weekoff_included == "Y") ||
                          (leave != null &&
                            Day.status != "WO" &&
                            Day.status != "HO")
                        ) {
                          let present_days = 0;
                          let display_present_days = 0;

                          if (leave.status == "HPL" || leave.status == "HUL") {
                            present_days = "0.5";
                            display_present_days = "0.5";
                          }

                          dailyAttendance.push({
                            employee_id: Day["employee_id"],
                            project_id: Day["project_id"],
                            hospital_id: Day["hospital_id"],
                            sub_department_id: Day["sub_department_id"],
                            attendance_date: attendance_date,
                            year: prev_year,
                            month: prev_month,
                            total_days: 1,
                            present_days: present_days,
                            display_present_days: display_present_days,
                            absent_days: 0,
                            total_work_days: 1,
                            weekoff_days: 0,
                            holidays: 0,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            pending_unpaid_leave:
                              leave.status == "UL" || leave.status == "HUL"
                                ? leave.leave_days
                                : 0,
                            anual_leave:
                              leave.leave_category == "A"
                                ? leave.leave_days
                                : 0,
                            total_hours:
                              present_days == "0.5"
                                ? HALF_HR + "." + HALF_MIN
                                : 0,
                            hours: present_days == "0.5" ? HALF_HR : 0,
                            minutes: present_days == "0.5" ? HALF_MIN : 0,
                            working_hours:
                              present_days == "0.5"
                                ? HALF_HR + "." + HALF_MIN
                                : 0,

                            shortage_hours: 0,
                            shortage_minutes: 0,
                            ot_work_hours: 0,
                            ot_minutes: 0,

                            ot_weekoff_hours: 0,
                            ot_weekoff_minutes: 0,
                            ot_holiday_hours: 0,
                            ot_holiday_minutes: 0,
                          });
                        } else if (Day.status == "HO") {
                          let holiday_ot_min,
                            holiday_ot_hour = 0;

                          if (Day.worked_hours > 0) {
                            let worked_minutes =
                              parseInt(Day["hours"] * 60) +
                              parseInt(Day["minutes"]);

                            //calculating over time
                            holiday_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            holiday_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          }

                          dailyAttendance.push({
                            employee_id: Day["employee_id"],
                            project_id: Day["project_id"],
                            hospital_id: Day["hospital_id"],
                            sub_department_id: Day["sub_department_id"],
                            attendance_date: attendance_date,
                            year: prev_year,
                            month: prev_month,
                            total_days: 1,
                            present_days: 0,
                            display_present_days: 1,
                            absent_days: 0,
                            total_work_days: 1,
                            weekoff_days: 0,
                            holidays: 1,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            pending_unpaid_leave: 0,
                            anual_leave: 0,
                            total_hours: Day["hours"] + "." + Day["minutes"],
                            hours: Day["hours"],
                            minutes: Day["minutes"],
                            working_hours: 0,

                            shortage_hours: 0,
                            shortage_minutes: 0,
                            ot_work_hours: 0,
                            ot_minutes: 0,

                            ot_weekoff_hours: 0,
                            ot_weekoff_minutes: 0,
                            ot_holiday_hours: holiday_ot_hour,
                            ot_holiday_minutes: holiday_ot_min,
                          });
                        } else if (Day.status == "WO") {
                          let week_off_ot_hour = 0;
                          let week_off_ot_min = 0;

                          if (Day.worked_hours > 0) {
                            let worked_minutes =
                              parseInt(Day["hours"] * 60) +
                              parseInt(Day["minutes"]);

                            //calculating over time
                            week_off_ot_hour = parseInt(
                              parseInt(Math.abs(worked_minutes)) / parseInt(60)
                            );
                            week_off_ot_min =
                              parseInt(Math.abs(worked_minutes)) % parseInt(60);
                          }

                          dailyAttendance.push({
                            employee_id: Day["employee_id"],
                            project_id: Day["project_id"],
                            hospital_id: Day["hospital_id"],
                            sub_department_id: Day["sub_department_id"],
                            attendance_date: attendance_date,
                            year: prev_year,
                            month: prev_month,
                            total_days: 1,
                            present_days: 0,
                            display_present_days: 1,
                            absent_days: 0,
                            total_work_days: 0,
                            weekoff_days: 1,
                            holidays: 0,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            pending_unpaid_leave: 0,
                            anual_leave: 0,
                            total_hours: Day["hours"] + "." + Day["minutes"],
                            hours: Day["hours"],
                            minutes: Day["minutes"],
                            working_hours: 0,

                            shortage_hours: 0,
                            shortage_minutes: 0,
                            ot_work_hours: 0,
                            ot_minutes: 0,

                            ot_weekoff_hours: week_off_ot_hour,
                            ot_weekoff_minutes: week_off_ot_min,
                            ot_holiday_hours: 0,
                            ot_holiday_minutes: 0,
                          });
                        } else if (Day.status == "PR") {
                          let shortage_time = 0;
                          let shortage_min = 0;
                          let ot_time = 0;
                          let ot_min = 0;

                          let total_minutes =
                            parseInt(Day["actual_hours"] * 60) +
                            parseInt(Day["actual_minutes"]);

                          let worked_minutes =
                            parseInt(Day["hours"] * 60) +
                            parseInt(Day["minutes"]);

                          let diff = total_minutes - worked_minutes;

                          if (diff > 0) {
                            //calculating shortage
                            shortage_time = parseInt(
                              parseInt(diff) / parseInt(60)
                            );
                            shortage_min = parseInt(diff) % parseInt(60);
                          } else if (diff < 0) {
                            //calculating over time
                            ot_time = parseInt(
                              parseInt(Math.abs(diff)) / parseInt(60)
                            );
                            ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                          }
                          dailyAttendance.push({
                            employee_id: Day["employee_id"],
                            project_id: Day["project_id"],
                            hospital_id: Day["hospital_id"],
                            sub_department_id: Day["sub_department_id"],
                            attendance_date: attendance_date,
                            year: prev_year,
                            month: prev_month,
                            total_days: 1,
                            present_days: 1,
                            display_present_days: 1,
                            absent_days: 0,
                            total_work_days: 1,
                            weekoff_days: 0,
                            holidays: 0,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            pending_unpaid_leave: 0,
                            anual_leave: 0,
                            total_hours: Day["hours"] + "." + Day["minutes"],
                            hours: Day["hours"],
                            minutes: Day["minutes"],
                            working_hours: STDWH + "." + STDWM,

                            shortage_hours: shortage_time,
                            shortage_minutes: shortage_min,
                            ot_work_hours: ot_time,
                            ot_minutes: ot_min,

                            ot_weekoff_hours: 0,
                            ot_weekoff_minutes: 0,
                            ot_holiday_hours: 0,
                            ot_holiday_minutes: 0,
                          });
                        } else if (Day.status == "AB") {
                          dailyAttendance.push({
                            employee_id: Day["employee_id"],
                            project_id: Day["project_id"],
                            hospital_id: Day["hospital_id"],
                            sub_department_id: Day["sub_department_id"],
                            attendance_date: attendance_date,
                            year: prev_year,
                            month: prev_month,
                            total_days: 1,
                            present_days: 0,
                            display_present_days: 0,
                            absent_days: 1,
                            total_work_days: 1,
                            weekoff_days: 0,
                            holidays: 0,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            pending_unpaid_leave: 0,
                            anual_leave: 0,
                            total_hours: 0,
                            hours: 0,
                            minutes: 0,
                            working_hours: STDWH + "." + STDWM,

                            shortage_hours: 0,
                            shortage_minutes: 0,
                            ot_work_hours: 0,
                            ot_minutes: 0,

                            ot_weekoff_hours: 0,
                            ot_weekoff_minutes: 0,
                            ot_holiday_hours: 0,
                            ot_holiday_minutes: 0,
                          });
                        }
                      });
                      //END-PREVIOUS MONTH AFTER CUTTOFF
                    })
                    .value();

                  const insurtColumns = [
                    "employee_id",
                    "hospital_id",
                    "sub_department_id",
                    "year",
                    "month",
                    "attendance_date",
                    "total_days",
                    "present_days",
                    "display_present_days",
                    "absent_days",
                    "total_work_days",
                    "weekoff_days",
                    "holidays",
                    "paid_leave",
                    "unpaid_leave",
                    "pending_unpaid_leave",
                    "anual_leave",
                    "hours",
                    "minutes",
                    "total_hours",
                    "working_hours",
                    "shortage_hours",
                    "shortage_minutes",
                    "ot_work_hours",
                    "ot_minutes",
                    "ot_weekoff_hours",
                    "ot_weekoff_minutes",
                    "ot_holiday_hours",
                    "ot_holiday_minutes",
                    "project_id",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT  INTO hims_f_daily_attendance(??) VALUES ? ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
                  hospital_id=values(hospital_id),sub_department_id=values(sub_department_id),\
                  year=values(year),month=values(month),attendance_date=values(attendance_date),total_days=values(total_days),\
                  present_days=values(present_days), display_present_days= values(display_present_days),absent_days=values(absent_days),total_work_days=values(total_work_days),\
                  weekoff_days=values(weekoff_days),holidays=values(holidays),paid_leave=values(paid_leave),\
                  unpaid_leave=values(unpaid_leave),pending_unpaid_leave=values(pending_unpaid_leave),anual_leave=values(anual_leave), hours=values(hours),minutes=values(minutes),total_hours=values(total_hours),\
                  working_hours=values(working_hours), shortage_hours=values(shortage_hours), shortage_minutes=values(shortage_minutes),\
                  ot_work_hours=values(ot_work_hours), ot_minutes=values(ot_minutes),ot_weekoff_hours=values(ot_weekoff_hours),ot_weekoff_minutes=values(ot_weekoff_minutes),\
                  ot_holiday_hours=values(ot_holiday_hours),ot_holiday_minutes=values(ot_holiday_minutes),project_id=values(project_id);",

                      includeValues: insurtColumns,
                      values: dailyAttendance,
                      bulkInsertOrUpdate: true,
                      printQuery: false,
                    })
                    .then((insertResult) => {
                      let projectQry = "";
                      if (options.attendance_type == "DMP") {
                        projectQry = `select employee_id,project_id,DA.hospital_id,year,month,sum(hours)as worked_hours, sum(minutes) as worked_minutes\
                          from hims_f_daily_attendance DA\
                          inner join hims_d_employee E on DA.employee_id=E.hims_d_employee_id\
                          inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
                           where      \
                          DA.hospital_id=${
                            input.hospital_id
                          }  and year=${year} and month=${month}   ${strQry}    group by employee_id,project_id;
                
                          delete from hims_f_project_wise_payroll  where  
                          hospital_id=${
                            input.hospital_id
                          }  and year=${year}  and month=${month}  and employee_id in 
                          ( select hims_d_employee_id from hims_d_employee E 
                            left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                            S.year=${year} and S.month=${month} 
                            inner join hims_d_sub_department SD
                           on E.sub_department_id=SD.hims_d_sub_department_id ${strQry.replace(
                             /employee_id/gi,
                             "hims_d_employee_id"
                           )} where   E.suspend_salary <>'Y' and ( S.salary_processed is null or  S.salary_processed='N')  ) and hims_f_project_wise_payroll_id>0 ; `;
                      }

                      _mysql
                        .executeQueryWithTransaction({
                          query: `select DA.employee_id,DA.hospital_id,DA.sub_department_id,DA.year,DA.month,sum(DA.total_days)as total_days,sum(DA.present_days)as present_days,\
                          sum(DA.display_present_days) as display_present_days  ,  sum(DA.absent_days)as absent_days,sum(DA.total_work_days)as total_work_days,sum(DA.weekoff_days)as total_weekoff_days,\
                  sum(holidays)as total_holidays,sum(DA.paid_leave)as paid_leave,sum(DA.unpaid_leave)as unpaid_leave,  sum(anual_leave)as anual_leave,   sum(hours)as hours,\
                  sum(minutes)as minutes,COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) \
                  as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
                '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
                  COALESCE(sum(DA.shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as shortage_hours ,\
                  COALESCE(sum(DA.ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',sum(ot_minutes)%60),0) as ot_work_hours ,   \
                  COALESCE(sum(DA.ot_weekoff_hours),0)+ COALESCE(concat(floor(sum(ot_weekoff_minutes)/60)  ,'.',sum(ot_weekoff_minutes)%60),0) as ot_weekoff_hours,\
                  COALESCE(sum(DA.ot_holiday_hours),0)+ COALESCE(concat(floor(sum(ot_holiday_minutes)/60)  ,'.',sum(ot_holiday_minutes)%60),0) as ot_holiday_hours\
                  from hims_f_daily_attendance DA  inner join hims_d_employee E on DA.employee_id=E.hims_d_employee_id and E.suspend_salary <>'Y'  \
                   ${deptStr} 
                   left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                   S.year=? and S.month=?  
                   where ( S.salary_processed is null or  S.salary_processed='N') and DA.year=? and DA.month=? 
                   and DA.hospital_id=?    and (E.exit_date is null or E.exit_date >date(?) )${strQry.replace(
                     /employee_id/gi,
                     "DA.employee_id"
                   )}    group by employee_id;
                    
                   select employee_id,COALESCE(sum(pending_unpaid_leave) ,0) as pending_unpaid_leave,COALESCE(sum(shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as prev_month_shortage_hr ,
                   COALESCE(sum(ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',sum(ot_minutes)%60),0) as prev_month_ot_hr ,   
                   COALESCE(sum(ot_weekoff_hours),0)+ COALESCE(concat(floor(sum(ot_weekoff_minutes)/60)  ,'.',sum(ot_weekoff_minutes)%60),0) as prev_month_week_off_ot,
                   COALESCE(sum(ot_holiday_hours),0)+ COALESCE(concat(floor(sum(ot_holiday_minutes)/60)  ,'.',sum(ot_holiday_minutes)%60), 0) as prev_month_holiday_ot
                   from hims_f_daily_attendance DA  inner join hims_d_employee E on DA.employee_id=E.hims_d_employee_id  ${deptStr}
                   where  year=? and month=? and DA.hospital_id=?  and attendance_date between date(?) and date(?) ${strQry} group by employee_id; 
                    
                    ${projectQry}       `,
                          values: [
                            year,
                            month,
                            year,
                            month,
                            input.hospital_id,
                            month_start,

                            prev_year,
                            prev_month,
                            input.hospital_id,
                            prev_cutoff_next_day,
                            prev_month_end,
                          ],
                          printQuery: false,
                        })
                        .then((results) => {
                          const DilayResult = results[0];
                          const prev_Result = results[1];
                          const projectWisePayroll =
                            options.attendance_type == "DMP"
                              ? results[2]
                              : null;

                          let attResult = [];
                          let at_len = DilayResult.length;

                          for (let i = 0; i < at_len; i++) {
                            const prevs_data = prev_Result.find((f) => {
                              return (f.employee_id =
                                DilayResult[i].employee_id);
                            });

                            let pending_unpaid_leave = 0;

                            if (prevs_data) {
                              pending_unpaid_leave = parseFloat(
                                prevs_data["pending_unpaid_leave"]
                              );
                            }

                            if (options["salary_calendar"] == "F") {
                              const t_paid_days =
                                options["salary_calendar_fixed_days"] -
                                parseFloat(DilayResult[i]["absent_days"]) -
                                parseFloat(DilayResult[i]["unpaid_leave"]) -
                                parseFloat(pending_unpaid_leave) -
                                parseFloat(DilayResult[i]["anual_leave"]);

                              DilayResult[i]["total_work_days"] =
                                options["salary_calendar_fixed_days"];
                              // DilayResult[i]["total_days"]=options["salary_calendar_fixed_days"];

                              attResult.push({
                                ...DilayResult[i],
                                total_paid_days:
                                  t_paid_days >=
                                  options["salary_calendar_fixed_days"]
                                    ? options["salary_calendar_fixed_days"]
                                    : t_paid_days,
                                total_leave:
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(DilayResult[i]["unpaid_leave"]),

                                prev_month_shortage_hr:
                                  prevs_data.prev_month_shortage_hr
                                    ? prevs_data.prev_month_shortage_hr
                                    : 0,
                                prev_month_ot_hr: prevs_data.prev_month_ot_hr
                                  ? prevs_data.prev_month_ot_hr
                                  : 0,
                                prev_month_week_off_ot:
                                  prevs_data.prev_month_week_off_ot
                                    ? prevs_data.prev_month_week_off_ot
                                    : 0,
                                prev_month_holiday_ot:
                                  prevs_data.prev_month_holiday_ot
                                    ? prevs_data.prev_month_holiday_ot
                                    : 0,
                                pending_unpaid_leave:
                                  prevs_data.pending_unpaid_leave
                                    ? prevs_data.pending_unpaid_leave
                                    : 0,

                                created_date: new Date(),
                                created_by: user_id,
                                updated_date: new Date(),
                                updated_by: user_id,
                              });
                            } else {
                              attResult.push({
                                ...DilayResult[i],
                                total_paid_days:
                                  parseFloat(DilayResult[i]["present_days"]) +
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(
                                    DilayResult[i]["total_weekoff_days"]
                                  ) +
                                  parseFloat(DilayResult[i]["total_holidays"]) -
                                  parseFloat(DilayResult[i]["anual_leave"]) -
                                  parseFloat(pending_unpaid_leave),
                                total_leave:
                                  parseFloat(DilayResult[i]["paid_leave"]) +
                                  parseFloat(DilayResult[i]["unpaid_leave"]) +
                                  parseFloat(pending_unpaid_leave),
                                prev_month_shortage_hr:
                                  prevs_data.prev_month_shortage_hr
                                    ? prevs_data.prev_month_shortage_hr
                                    : 0,
                                prev_month_ot_hr: prevs_data.prev_month_ot_hr
                                  ? prevs_data.prev_month_ot_hr
                                  : 0,
                                prev_month_week_off_ot:
                                  prevs_data.prev_month_week_off_ot
                                    ? prevs_data.prev_month_week_off_ot
                                    : 0,
                                prev_month_holiday_ot:
                                  prevs_data.prev_month_holiday_ot
                                    ? prevs_data.prev_month_holiday_ot
                                    : 0,
                                pending_unpaid_leave:
                                  prevs_data.pending_unpaid_leave
                                    ? prevs_data.pending_unpaid_leave
                                    : 0,
                                created_date: new Date(),
                                created_by: user_id,
                                updated_date: new Date(),
                                updated_by: user_id,
                              });
                            }
                          }

                          const insurtColumns = [
                            "employee_id",
                            "year",
                            "month",
                            "hospital_id",
                            "sub_department_id",
                            "total_days",
                            "present_days",
                            "display_present_days",
                            "absent_days",
                            "total_work_days",
                            "total_weekoff_days",
                            "total_holidays",
                            "total_leave",
                            "paid_leave",
                            "unpaid_leave",
                            "total_paid_days",
                            "total_hours",
                            "total_working_hours",
                            "shortage_hours",
                            "ot_work_hours",
                            "ot_weekoff_hours",
                            "ot_holiday_hours",
                            "prev_month_shortage_hr",
                            "prev_month_ot_hr",
                            "prev_month_week_off_ot",
                            "prev_month_holiday_ot",
                            "pending_unpaid_leave",
                            "created_date",
                            "created_by",
                            "updated_date",
                            "updated_by",
                          ];

                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "INSERT INTO hims_f_attendance_monthly(??) VALUES ? ON DUPLICATE KEY UPDATE \
                            employee_id=values(employee_id),year=values(year),\
                            month=values(month),hospital_id=values(hospital_id),\
                            sub_department_id=values(sub_department_id),total_days=values(total_days),present_days=values(present_days),\
                            display_present_days=values(display_present_days), absent_days=values(absent_days),total_work_days=values(total_work_days),\
                            total_weekoff_days=values(total_weekoff_days),total_holidays=values(total_holidays),total_leave=values(total_leave),\
                            paid_leave=values(paid_leave),unpaid_leave=values(unpaid_leave),total_paid_days=values(total_paid_days),\
                            total_hours=values(total_hours),total_working_hours=values(total_working_hours),shortage_hours=values(shortage_hours)\
                            ,ot_work_hours=values(ot_work_hours),ot_weekoff_hours=values(ot_weekoff_hours),ot_holiday_hours=values(ot_holiday_hours),\
                            prev_month_shortage_hr= values(prev_month_shortage_hr), prev_month_ot_hr= values(prev_month_ot_hr),\
                            prev_month_week_off_ot= values(prev_month_week_off_ot),prev_month_holiday_ot= values(prev_month_holiday_ot),\
                            pending_unpaid_leave= values(pending_unpaid_leave),updated_by=values(updated_by),updated_date=values(updated_date);",
                              values: attResult,
                              includeValues: insurtColumns,

                              bulkInsertOrUpdate: true,
                              printQuery: false,
                            })
                            .then((result4) => {
                              if (options.attendance_type == "DMP") {
                                const insertCol = [
                                  "employee_id",
                                  "project_id",
                                  "month",
                                  "year",
                                  "worked_hours",
                                  "worked_minutes",
                                  "hospital_id",
                                ];

                                _mysql
                                  .executeQueryWithTransaction({
                                    query:
                                      " INSERT   INTO hims_f_project_wise_payroll(??) VALUES ?  ON DUPLICATE KEY UPDATE \
                                    worked_hours=values(worked_hours),worked_minutes=values(worked_minutes)",
                                    values: projectWisePayroll,
                                    includeValues: insertCol,
                                    printQuery: false,

                                    bulkInsertOrUpdate: true,
                                  })
                                  .then((projectwiseInsert) => {
                                    _mysql.commitTransaction(() => {
                                      _mysql.releaseConnection();

                                      resolve(projectwiseInsert);
                                    });
                                  })
                                  .catch((e) => {
                                    _mysql.rollBackTransaction(() => {
                                      reject(e);
                                    });
                                  });
                              } else {
                                _mysql.commitTransaction(() => {
                                  _mysql.releaseConnection();

                                  resolve(result4);
                                });
                              }
                            })
                            .catch((e) => {
                              _mysql.rollBackTransaction(() => {
                                reject(e);
                              });
                            });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            reject(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        reject({
                          invalid_input: true,
                          message: e,
                        });
                      });
                    });
                } else {
                  _mysql.releaseConnection();
                  reject({
                    invalid_input: true,
                    message: "Please upload timesheet for this month",
                  });
                }
              })
              .catch((e) => {
                // console.log("ERR3", e);
                _mysql.releaseConnection();
                reject({ invalid_input: true, message: e });
              });
          }
        })
        .catch((e) => {
          // console.log("ERR4", e);
          _mysql.releaseConnection();
          reject({ invalid_input: true, message: e });
        });
    } catch (e) {
      // console.log("ERR:0", e);
      reject(e);
    }
  });
}
