//created by irfan: to insert timesheet
function insertTimeSheet(
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
          biometricData[i]["biometric_id"] != null &&
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
        } else if (biometricData[i]["biometric_id"] == null) {
          let leave = new LINQ(AllLeaves)
            .Where(
              w =>
                w.employee_id == biometricData[i]["hims_d_employee_id"] &&
                w.from_date <= biometricData[i]["attendance_date"] &&
                w.from_date >= biometricData[i]["attendance_date"]
            )
            .Select(s => {
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
                status: s.status
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
            .Where(w => w.holiday_date == from_date)
            .Select(s => {
              return {
                holiday: s.holiday,
                weekoff: s.weekoff
              };
            })
            .ToArray();

          if (leave.length > 0) {
            //check leave

            insertArray.push({
              ...biometricData[i],
              status: leave[0]["leave_type"] + "L"
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

      utilities.logger().log("empHolidayweekoff: ", empHolidayweekoff);
      for (let i = 0; i < biometricData.length; i++) {
        if (
          biometricData[i]["biometric_id"] != null &&
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
        } else if (biometricData[i]["biometric_id"] == null) {
          let leave = new LINQ(AllLeaves)
            .Where(
              w =>
                w.employee_id == biometricData[i]["hims_d_employee_id"] &&
                w.from_date <= biometricData[i]["attendance_date"] &&
                w.from_date >= biometricData[i]["attendance_date"]
            )
            .Select(s => {
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
                status: s.status
              };
            })
            .ToArray();

          let holidayweekoff = new LINQ(empHolidayweekoff)
            .Where(w => w.holiday_date == biometricData[i]["attendance_date"])
            .Select(s => {
              return {
                holiday: s.holiday,
                weekoff: s.weekoff
              };
            })
            .ToArray();

          utilities.logger().log("holidayweekoff: ", holidayweekoff);
          if (leave.length > 0) {
            //check leave
            utilities.logger().log("apple: ", "APPLE");

            insertArray.push({
              ...biometricData[i],
              status: leave[0]["leave_type"] + "L"
            });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].weekoff == "Y"
          ) {
            utilities.logger().log("BALL: ", "BAAL");
            //check weekoff
            insertArray.push({ ...biometricData[i], status: "WO" });
          } else if (
            holidayweekoff.length > 0 &&
            holidayweekoff[0].holiday == "Y"
          ) {
            //check holiday

            utilities.logger().log("CAT: ", "CAT");
            insertArray.push({ ...biometricData[i], status: "HO" });
          } else {
            utilities.logger().log("DOG: ", "DOG");
            //else mark absent
            insertArray.push({ ...biometricData[i], status: "AB" });
          }
        }
      }
    }

    utilities.logger().log("insertArray: ", insertArray);

    let month = moment(from_date).format("M");
    let year = moment(from_date).format("YYYY");
    const insurtColumns = [
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
      "minutes"
    ];

    // "hours",
    // "minutes",
    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO hims_f_daily_time_sheet(??) VALUES ?  ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
          biometric_id=values(biometric_id),attendance_date=values(attendance_date),\
          in_time=values(in_time),out_date=values(out_date),out_time=values(out_time),status=values(status),\
          hours=values(hours),minutes=values(minutes),worked_hours=values(worked_hours),actual_hours=values(actual_hours)",
        values: insertArray,
        includeValues: insurtColumns,
        extraValues: { year: year, month: month },
        bulkInsertOrUpdate: true
      })
      .then(finalResult => {
        //------------------------------------------------

        _mysql
          .executeQuery({
            query: returnQry,
            printQuery: true
          })
          .then(result => {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });

        //------------------------------------------------
      })
      .catch(e => {
        utilities.logger().log("error: ", e);
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  } catch (e) {
    utilities.logger().log("error rr: ", e);
  }
}
