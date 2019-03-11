//created by irfan:
getEmployeeToManualTimeSheet: (req, res, next) => {
  const _mysql = new algaehMysql();

  const utilities = new algaehUtilities();

  try {
    const input = req.query;

    utilities.logger().log("manual_timesheet_entry:input ", input);

    if (input.manual_timesheet_entry == "D") {
      _mysql
        .executeQuery({
          query:
            "SELECT TS.hims_f_daily_time_sheet_id,TS.attendance_date,TS.employee_id,TS.in_time,TS.out_time,TS.worked_hours,E.employee_code,\
              E.full_name,E.sub_department_id FROM hims_f_daily_time_sheet TS, hims_d_employee E where \
              TS.employee_id=E.hims_d_employee_id and (TS.status = 'AB' or TS.status = 'EX') and\
              TS.attendance_date=? and E.sub_department_id=? and E.hospital_id=?;",
          values: [
            input.attendance_date,
            input.sub_department_id,
            input.branch_id
          ],
          printQuery: true
        })
        .then(time_sheet => {
          _mysql.releaseConnection();
          req.records = { result: time_sheet, dataExist: true };
          next();
        })
        .catch(e => {
          next(e);
        });
    } else if (input.manual_timesheet_entry == "P") {
      let from_date = null;
      let to_date = null;
      let employee = "";
      let TSEmployee = "";

      if (input.select_wise == "M") {
        from_date = moment(new Date(input.yearAndMonth))
          .startOf("month")
          .format("YYYY-MM-DD");

        to_date = moment(new Date(input.yearAndMonth))
          .endOf("month")
          .format("YYYY-MM-DD");
      } else {
        from_date = moment(input.attendance_date).format("YYYY-MM-DD");
        to_date = moment(input.attendance_date).format("YYYY-MM-DD");
      }

      if (input.employee_id > 0) {
        employee = " and employee_id=" + input.employee_id;
        TSEmployee = " and TS.employee_id=" + input.employee_id;
      }

      utilities.logger().log("employee: ", employee);

      utilities.logger().log("TSEmployee: ", TSEmployee);

      utilities.logger().log("from_date: ", from_date);

      utilities.logger().log("to_date: ", to_date);

      _mysql
        .executeQuery({
          query: ` select hims_f_daily_time_sheet_id,TS.employee_id,TS.attendance_date,in_time,out_time,worked_hours,\
    PR.hims_f_project_roster_id ,PR.project_id,E.employee_code,E.full_name,E.sub_department_id , E.date_of_joining    \ 
    from hims_f_daily_time_sheet TS  inner join  hims_f_project_roster PR  on TS.employee_id=PR.employee_id \
    and date(TS.attendance_date)=date(PR.attendance_date) and PR.project_id=?\
    inner join hims_d_employee E on PR.employee_id=E.hims_d_employee_id\
    where TS.hospital_id=? and TS.attendance_date between date(?) and date(?) ${TSEmployee};  `,
          values: [input.project_id, input.branch_id, from_date, to_date],
          printQuery: true
        })
        .then(time_sheet => {
          utilities.logger().log("time_sheet: ", time_sheet);

          if (time_sheet.length > 0) {
            _mysql.releaseConnection();
            req.records = { result: time_sheet, dataExist: true };
            next();
            return;
          } else {
            _mysql
              .executeQuery({
                query: `select PR.employee_id,PR.attendance_date,E.employee_code,E.full_name,E.sub_department_id,E.religion_id, E.date_of_joining\ 
            from hims_f_project_roster PR  inner join  hims_d_employee E on PR.employee_id=E.hims_d_employee_id\
            and PR.hospital_id=? and PR.attendance_date between date(?) and date(?)  ${employee}; 
            select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,L.leave_type,from_date,to_leave_session,\
            to_date from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id \
           where status='APR' and ((  date('${from_date}')>=date(from_date) and date('${from_date}')<=date(to_date)) or\
           ( date('${to_date}')>=date(from_date) and   date('${to_date}')<=date(to_date)) \
            or (date(from_date)>= date('${from_date}') and date(from_date)<=date('${to_date}') ) or \
            (date(to_date)>=date('${from_date}') and date(to_date)<= date('${to_date}') )) ${employee};\
           select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
           from hims_d_holiday H where date(holiday_date) between date('${from_date}') and date('${to_date}');    `,
                values: [input.branch_id, from_date, to_date],
                printQuery: true
              })
              .then(result => {
                // _mysql.releaseConnection();
                // req.records = { result, dataExist: false };
                // next();

                let All_Project_Roster = result[0];
                let AllLeaves = result[1];
                let allHolidays = result[2];
                let outputArray = [];

                //     utilities
                // .logger()
                // .log("All_Project_Roster: ", All_Project_Roster);

                // utilities
                // .logger()
                // .log("AllLeaves: ", AllLeaves);

                // utilities
                // .logger()
                // .log("allHolidays: ", allHolidays);

                if (
                  All_Project_Roster.length > 0 &&
                  input.select_wise == "M" &&
                  input.employee_id > 0
                ) {
                  let date_range = getDays(
                    new Date(from_date),
                    new Date(to_date)
                  );
                  // utilities.logger().log("date_range:", date_range);

                  let empHolidayweekoff = getEmployeeWeekOffsHolidays(
                    from_date,
                    to_date,
                    All_Project_Roster[0],
                    allHolidays
                  );
                  // utilities.logger().log("empHolidayweekoff:", empHolidayweekoff);
                  for (let i = 0; i < date_range.length; i++) {
                    let present = new LINQ(All_Project_Roster)
                      .Where(
                        w =>
                          w.attendance_date ==
                          moment(date_range[i]).format("YYYY-MM-DD")
                      )
                      .Select(s => {
                        return {
                          employee_name: s.full_name,
                          employee_code: s.employee_code,
                          attendance_date: s.attendance_date,
                          status: "PR"
                        };
                      })
                      .FirstOrDefault(null);

                    // utilities.logger().log("present:", present);

                    if (present != undefined) {
                      outputArray.push(present);
                    } else {
                      let leave = new LINQ(AllLeaves)
                        .Where(
                          w =>
                            w.employee_id == input.employee_id &&
                            w.from_date <=
                              moment(date_range[i]).format("YYYY-MM-DD") &&
                            w.to_date >=
                              moment(date_range[i]).format("YYYY-MM-DD")
                        )
                        .Select(s => {
                          return {
                            employee_name: All_Project_Roster[0].full_name,
                            employee_code: All_Project_Roster[0].employee_code,
                            attendance_date: moment(date_range[i]).format(
                              "YYYY-MM-DD"
                            ),
                            status: s.leave_type == "P" ? "PL" : "UL"
                          };
                        })
                        .FirstOrDefault(null);

                      let holiday_or_weekOff = new LINQ(empHolidayweekoff)
                        .Where(
                          w =>
                            w.holiday_date ==
                            moment(date_range[i]).format("YYYY-MM-DD")
                        )
                        .Select(s => {
                          return {
                            holiday: s.holiday,
                            weekoff: s.weekoff
                          };
                        })
                        .FirstOrDefault(null);

                      //utilities.logger().log("holiday_or_weekOff:", holiday_or_weekOff);

                      if (leave != undefined) {
                        outputArray.push(leave);
                      } else if (holiday_or_weekOff != undefined) {
                        if (holiday_or_weekOff.weekoff == "Y") {
                          outputArray.push({
                            employee_name: All_Project_Roster[0].full_name,
                            employee_code: All_Project_Roster[0].employee_code,
                            attendance_date: moment(date_range[i]).format(
                              "YYYY-MM-DD"
                            ),
                            status: "WO"
                          });
                        } else if (holiday_or_weekOff.holiday == "Y") {
                          outputArray.push({
                            employee_name: All_Project_Roster[0].full_name,
                            employee_code: All_Project_Roster[0].employee_code,
                            attendance_date: moment(date_range[i]).format(
                              "YYYY-MM-DD"
                            ),
                            status: "HO"
                          });
                        }
                      } else {
                        outputArray.push({
                          employee_name: All_Project_Roster[0].full_name,
                          employee_code: All_Project_Roster[0].employee_code,
                          attendance_date: moment(date_range[i]).format(
                            "YYYY-MM-DD"
                          ),
                          status: "AB"
                        });
                      }
                    }
                  }

                  _mysql.releaseConnection();
                  req.records = outputArray;
                  next();
                } else if (All_Project_Roster.length > 0) {
                  _mysql.releaseConnection();
                  req.records = All_Project_Roster;
                  next();
                } else {
                  _mysql.releaseConnection();
                  req.records = { result, dataExist: false };
                  next();
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  } catch (e) {
    next(e);
  }
};
