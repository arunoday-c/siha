newFun: (req, res, next) => {
  const _mysql = new algaehMysql();
  try {
    let input = req.query;

    const utilities = new algaehUtilities();
    let month = moment(input.from_date).format("M");
    let year = moment(input.from_date).format("YYYY");

    let from_date = moment(input.from_date).format("YYYY-MM-DD");
    let to_date = moment(input.to_date).format("YYYY-MM-DD");

    let cut_off_date = null;
    let next_dayOf_cutoff = null;

    let lastMonth_after_cutoff_date = null;
    let lastMonth_end_date = null;
    let stringData = "";
    let dailyAttendance = [];
    let RosterAttendance = [];
    let mergedArray = [];
    let AttenResult = [];
    let RosterResult = [];
    let LastTenDaysResult = [];
    let previousMonthData = [];

    //ST---pending unpaid leaves,shoratge,ot
    let pendingYear = "";
    let pendingMonth = "";

    if (month == 1) {
      pendingYear = year - 1;
      pendingMonth = 12;
    } else {
      pendingYear = year;
      pendingMonth = month - 1;
    }
    //EN---pending unpaid leaves,shoratge,ot

    if (input.hims_d_employee_id > 0) {
      stringData = " AND employee_id=" + input.hims_d_employee_id;
    }

    if (input.attendance_type == "MW") {
      _mysql
        .executeQuery({
          query: "SELECT * FROM hims_d_hrms_options;"
        })
        .then(options => {
          if (
            input.attendance_type == "MW" &&
            options[0]["salary_pay_before_end_date"] == "Y" &&
            options[0]["payroll_payment_date"] != null
          ) {
            cut_off_date =
              moment(input.to_date)
                .clone()
                .format("YYYY-MM-") + options[0]["payroll_payment_date"];

            next_dayOf_cutoff =
              moment(input.to_date)
                .clone()
                .format("YYYY-MM-") +
              parseInt(options[0]["payroll_payment_date"] + 1);

            const prevDays = options[0]["payroll_payment_date"] + 1;

            const prevMonthYear = moment(input.from_date)
              .clone()
              .add(-1, "months");

            lastMonth_after_cutoff_date =
              moment(prevMonthYear)
                .clone()
                .format("YYYY-MM") +
              "-" +
              prevDays;
            utilities
              .logger()
              .log(
                "lastMonth_after_cutoff_date: ",
                lastMonth_after_cutoff_date
              );

            lastMonth_end_date = moment(prevMonthYear)
              .endOf("month")
              .format("YYYY-MM-DD");
            utilities.logger().log("lastMonth_end_date: ", lastMonth_end_date);

            _mysql
              .executeQuery({
                query:
                  "select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
                attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
                actual_minutes,worked_hours,expected_out_date,expected_out_time,TS.hospital_id\
                from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                where TS.hospital_id=? and year=? and month=? and TS.sub_department_id=? " +
                  stringData +
                  " and attendance_date between date(?) and date(?);\
                select hims_f_shift_roster_id,employee_id,sub_department_id,shift_date,shift_id,shift_end_date,\
                shift_start_time,shift_end_time,shift_time,weekoff,holiday,hospital_id\
                from hims_f_shift_roster  where hospital_id=? and sub_department_id=? " +
                  stringData +
                  " and shift_date \
                between date(?) and  date(?); \
                select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
                attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
                actual_minutes,worked_hours,expected_out_date,expected_out_time,TS.hospital_id\
                from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                where TS.hospital_id=? and year=? and month=? and TS.sub_department_id=? " +
                  stringData +
                  " and attendance_date between date(?) and date(?);",
                values: [
                  input.hospital_id,
                  year,
                  month,
                  input.sub_department_id,
                  from_date,
                  cut_off_date,
                  input.hospital_id,
                  input.sub_department_id,
                  next_dayOf_cutoff,
                  to_date,
                  input.hospital_id,
                  pendingYear,
                  pendingMonth,
                  input.sub_department_id,
                  lastMonth_after_cutoff_date,
                  lastMonth_end_date
                ],

                printQuery: true
              })
              .then(result => {
                let AttenResult = result[0];
                let RosterResult = result[1];
                let LastTenDaysResult = result[2];

                utilities.logger().log("AttenResult: ", AttenResult);
                utilities.logger().log("RosterResult: ", RosterResult);
                utilities
                  .logger()
                  .log("LastTenDaysResult: ", LastTenDaysResult);

                if (AttenResult.length > 0) {
                  let excptions = new LINQ(AttenResult)
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

                  if (excptions.length == 50) {
                    req.records = {
                      invalid_input: true,
                      employees: excptions,
                      message:
                        "Please Regularize attendance for these employees"
                    };
                    next();
                    return;
                  } else {
                    //present month
                    for (let i = 0; i < AttenResult.length; i++) {
                      let shortage_time = 0;
                      let shortage_min = 0;
                      let ot_time = 0;
                      let ot_min = 0;

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
                      }
                      // utilities.logger().log("total_minutes: ", total_minutes);
                      // utilities.logger().log("worked_minutes: ", worked_minutes);
                      // utilities.logger().log("diff: ", diff);
                      // utilities.logger().log("ot_time: ", ot_time);
                      // utilities.logger().log("shortage_time: ", shortage_time);
                      // utilities.logger().log("================: ");
                      dailyAttendance.push({
                        employee_id: AttenResult[i]["employee_id"],
                        hospital_id: AttenResult[i]["hospital_id"],
                        sub_department_id: AttenResult[i]["sub_department_id"],
                        attendance_date: AttenResult[i]["attendance_date"],
                        year: moment(AttenResult[i]["attendance_date"]).format(
                          "YYYY"
                        ),
                        month: moment(AttenResult[i]["attendance_date"]).format(
                          "M"
                        ),
                        total_days: 1,
                        present_days: AttenResult[i]["status"] == "PR" ? 1 : 0,
                        absent_days: AttenResult[i]["status"] == "AB" ? 1 : 0,
                        total_work_days:
                          AttenResult[i]["status"] == "PR" ? 1 : 0,
                        weekoff_days: AttenResult[i]["status"] == "WO" ? 1 : 0,
                        holidays: AttenResult[i]["status"] == "HO" ? 1 : 0,
                        paid_leave: AttenResult[i]["status"] == "PL" ? 1 : 0,
                        unpaid_leave: AttenResult[i]["status"] == "UL" ? 1 : 0,
                        total_hours: AttenResult[i]["worked_hours"],
                        hours: AttenResult[i]["hours"],
                        minutes: AttenResult[i]["minutes"],
                        working_hours:
                          AttenResult[i]["actual_hours"] +
                          "." +
                          AttenResult[i]["actual_minutes"],
                        shortage_hours: shortage_time,
                        shortage_minutes: shortage_min,
                        ot_work_hours: ot_time,
                        ot_minutes: ot_min
                      });
                    }

                    //present month
                    for (let j = 0; j < RosterResult.length; j++) {
                      RosterAttendance.push({
                        employee_id: RosterResult[j]["employee_id"],
                        hospital_id: RosterResult[j]["hospital_id"],
                        sub_department_id: RosterResult[j]["sub_department_id"],
                        attendance_date: RosterResult[j]["shift_date"],
                        year: moment(RosterResult[j]["shift_date"]).format(
                          "YYYY"
                        ),
                        month: moment(RosterResult[j]["shift_date"]).format(
                          "M"
                        ),
                        total_days: 1,
                        weekoff_days: RosterResult[j]["weekoff"] == "Y" ? 1 : 0,
                        holidays: RosterResult[j]["holiday"] == "Y" ? 1 : 0,
                        present_days:
                          RosterResult[j]["weekoff"] == "N" &&
                          RosterResult[j]["holiday"] == "N"
                            ? 1
                            : 0,
                        absent_days: 0,
                        total_work_days:
                          RosterResult[j]["weekoff"] == "N" &&
                          RosterResult[j]["holiday"] == "N"
                            ? 1
                            : 0,
                        paid_leave: 0,
                        unpaid_leave: 0,
                        total_hours: RosterResult[j]["shift_time"],
                        hours: parseInt(RosterResult[j]["shift_time"]),
                        minutes:
                          (parseFloat(RosterResult[j]["shift_time"]) % 1) * 100,
                        working_hours: RosterResult[j]["shift_time"],
                        shortage_hours: 0,
                        shortage_minutes: 0,
                        ot_work_hours: 0,
                        ot_minutes: 0
                      });
                    }

                    //last month 10 days
                    for (let i = 0; i < LastTenDaysResult.length; i++) {
                      let shortage_time = 0;
                      let shortage_min = 0;
                      let ot_time = 0;
                      let ot_min = 0;

                      if (LastTenDaysResult[i]["status"] == "PR") {
                        let total_minutes =
                          parseInt(LastTenDaysResult[i]["actual_hours"] * 60) +
                          parseInt(LastTenDaysResult[i]["actual_minutes"]);
                        let worked_minutes =
                          parseInt(LastTenDaysResult[i]["hours"] * 60) +
                          parseInt(LastTenDaysResult[i]["minutes"]);

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
                      }

                      previousMonthData.push({
                        employee_id: LastTenDaysResult[i]["employee_id"],
                        hospital_id: LastTenDaysResult[i]["hospital_id"],
                        sub_department_id:
                          LastTenDaysResult[i]["sub_department_id"],
                        attendance_date:
                          LastTenDaysResult[i]["attendance_date"],
                        year: moment(
                          LastTenDaysResult[i]["attendance_date"]
                        ).format("YYYY"),
                        month: moment(
                          LastTenDaysResult[i]["attendance_date"]
                        ).format("M"),
                        total_days: 1,
                        present_days:
                          LastTenDaysResult[i]["status"] == "PR" ? 1 : 0,
                        absent_days:
                          LastTenDaysResult[i]["status"] == "AB" ? 1 : 0,
                        total_work_days:
                          LastTenDaysResult[i]["status"] == "PR" ? 1 : 0,
                        weekoff_days:
                          LastTenDaysResult[i]["status"] == "WO" ? 1 : 0,
                        holidays:
                          LastTenDaysResult[i]["status"] == "HO" ? 1 : 0,
                        paid_leave:
                          LastTenDaysResult[i]["status"] == "PL" ? 1 : 0,
                        unpaid_leave:
                          LastTenDaysResult[i]["status"] == "UL" ? 1 : 0,
                        total_hours: LastTenDaysResult[i]["worked_hours"],
                        hours: LastTenDaysResult[i]["hours"],
                        minutes: LastTenDaysResult[i]["minutes"],
                        working_hours:
                          LastTenDaysResult[i]["actual_hours"] +
                          "." +
                          LastTenDaysResult[i]["actual_minutes"],
                        shortage_hours: shortage_time,
                        shortage_minutes: shortage_min,
                        ot_work_hours: ot_time,
                        ot_minutes: ot_min
                      });
                    }

                    utilities
                      .logger()
                      .log("dailyAttendance: ", dailyAttendance);
                    utilities
                      .logger()
                      .log("RosterAttendance: ", RosterAttendance);

                    mergedArray = dailyAttendance.concat(RosterAttendance);
                    utilities.logger().log("mergedArray: ", mergedArray);

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
                      "working_hours",
                      "shortage_hours",
                      "shortage_minutes",
                      "ot_work_hours",
                      "ot_minutes"
                    ];

                    _mysql
                      .executeQuery({
                        query:
                          "INSERT IGNORE INTO hims_f_daily_attendance(??) VALUES ? ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
                            hospital_id=values(hospital_id),sub_department_id=values(sub_department_id),\
                            year=values(year),month=values(month),attendance_date=values(attendance_date),total_days=values(total_days),\
                            present_days=values(present_days),absent_days=values(absent_days),total_work_days=values(total_work_days),\
                            weekoff_days=values(weekoff_days),holidays=values(holidays),paid_leave=values(paid_leave),\
                            unpaid_leave=values(unpaid_leave),hours=values(hours),minutes=values(minutes),total_hours=values(total_hours),\
                            working_hours=values(working_hours), shortage_hours=values(shortage_hours), shortage_minutes=values(shortage_minutes),\
                             ot_work_hours=values(ot_work_hours), ot_minutes=values(ot_minutes)",

                        includeValues: insurtColumns,
                        values: mergedArray,
                        bulkInsertOrUpdate: true
                      })
                      .then(insertResult => {
                        // _mysql.releaseConnection();

                        // req.records = finalAttenResult;
                        // next();

                        _mysql
                          .executeQuery({
                            query:
                              "select employee_id,hospital_id,sub_department_id,year,month,sum(total_days)as total_days,sum(present_days)as present_days,\
                              sum(absent_days)as absent_days,sum(total_work_days)as total_work_days,sum(weekoff_days)as total_weekoff_days,\
                              sum(holidays)as total_holidays,sum(paid_leave)as paid_leave,sum(unpaid_leave)as unpaid_leave,sum(hours)as hours,\
                              sum(minutes)as minutes,COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) \
                              as total_hours,sum(working_hours)as total_working_hours ,\
                              COALESCE(sum(shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as shortage_hourss ,\
                              COALESCE(sum(ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',sum(ot_minutes)%60),0) as ot_hourss\
                              from hims_f_daily_attendance where      \
                              hospital_id=?  and year=? and month=?  and sub_department_id=? " +
                              stringData +
                              " and attendance_date between date(?) and\
                              date(?)  group by employee_id;\
                              select hims_f_pending_leave_id,PL.employee_id,year,month,leave_application_id,adjusted,\
                              adjusted_year,adjusted_month,updaid_leave_duration,status from hims_f_pending_leave PL \
                              inner join hims_f_leave_application LA on  PL.leave_application_id=LA.hims_f_leave_application_id\
                              where LA.status='APR' and  year=? and month=?",
                            values: [
                              input.hospital_id,
                              year,
                              month,
                              input.sub_department_id,
                              from_date,
                              to_date,
                              pendingYear,
                              pendingMonth
                            ],

                            printQuery: true
                          })
                          .then(results => {
                            let attResult = results[0];
                            let allPendingLeaves = results[1];
                            let insertArray = [];

                            for (let i = 0; i < attResult.length; i++) {
                              //ST--shortage
                              let short_hrs = new LINQ(previousMonthData)
                                .Where(
                                  w =>
                                    w.employee_id == attResult[i]["employee_id"]
                                )
                                .Sum(s => s.shortage_hours);

                              let short_min = new LINQ(previousMonthData)
                                .Where(
                                  w =>
                                    w.employee_id == attResult[i]["employee_id"]
                                )
                                .Sum(s => s.shortage_minutes);

                              short_hrs +=
                                parseInt(parseInt(short_min) / parseInt(60)) +
                                "." +
                                (parseInt(short_min) % parseInt(60));
                              //EN--shortage

                              //ST--over time
                              let ot_hrs = new LINQ(previousMonthData)
                                .Where(
                                  w =>
                                    w.employee_id == attResult[i]["employee_id"]
                                )
                                .Sum(s => s.ot_work_hours);

                              let ot_min = new LINQ(previousMonthData)
                                .Where(
                                  w =>
                                    w.employee_id == attResult[i]["employee_id"]
                                )
                                .Sum(s => s.ot_minutes);

                              ot_hrs +=
                                parseInt(parseInt(ot_min) / parseInt(60)) +
                                "." +
                                (parseInt(ot_min) % parseInt(60));

                              //EN--over time

                              let pending_leaves = new LINQ(allPendingLeaves)
                                .Where(
                                  w =>
                                    w.employee_id == attResult[i]["employee_id"]
                                )
                                .Sum(s => s.updaid_leave_duration);

                              insertArray.push({
                                ...attResult[i],
                                total_paid_days:
                                  attResult[i]["present_days"] +
                                  attResult[i]["paid_leave"] +
                                  attResult[i]["total_weekoff_days"] +
                                  attResult[i]["total_holidays"],
                                total_leave:
                                  attResult[i]["paid_leave"] +
                                  attResult[i]["unpaid_leave"],
                                total_hours: attResult[i]["total_hours"],
                                total_working_hours:
                                  attResult[i]["total_working_hours"],
                                shortage_hours: attResult[i]["shortage_hourss"],
                                ot_work_hours: attResult[i]["ot_hourss"],
                                pending_unpaid_leave: pending_leaves,

                                prev_month_shortage_hr: short_hrs,
                                prev_month_ot_hr: ot_hrs
                              });
                            }

                            const insurtColumns = [
                              "employee_id",
                              "year",
                              "month",
                              "hospital_id",
                              "sub_department_id",
                              "total_days",
                              "present_days",
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
                              "pending_leaves",
                              "prev_month_shortage_hr",
                              "prev_month_ot_hr"
                            ];

                            _mysql
                              .executeQuery({
                                query:
                                  "INSERT INTO hims_f_attendance_monthly(??) VALUES ? ON DUPLICATE KEY UPDATE \
                              employee_id=values(employee_id),year=values(year),\
                              month=values(month),hospital_id=values(hospital_id),\
                              sub_department_id=values(sub_department_id),total_days=values(total_days),present_days=values(present_days),\
                              absent_days=values(absent_days),total_work_days=values(total_work_days),\
                              total_weekoff_days=values(total_weekoff_days),total_holidays=values(total_holidays),total_leave=values(total_leave),\
                              paid_leave=values(paid_leave),unpaid_leave=values(unpaid_leave),total_paid_days=values(total_paid_days),\
                              total_hours=values(total_hours),total_working_hours=values(total_working_hours),shortage_hours=values(shortage_hours)\
                              ,ot_work_hours=values(ot_work_hours),pending_leaves=values(pending_leaves),prev_month_shortage_hr=values(prev_month_shortage_hr)\
                              ,prev_month_ot_hr=values(prev_month_ot_hr)",
                                values: insertArray,
                                includeValues: insurtColumns,
                                extraValues: {
                                  created_date: new Date(),
                                  created_by:
                                    req.userIdentity.algaeh_d_app_user_id,
                                  updated_date: new Date(),
                                  updated_by:
                                    req.userIdentity.algaeh_d_app_user_id
                                },
                                bulkInsertOrUpdate: true,
                                printQuery: true
                              })
                              .then(result => {
                                _mysql.releaseConnection();
                                req.records = result;
                                next();
                              })
                              .catch(e => {
                                next(e);
                              });
                          })
                          .catch(e => {
                            _mysql.releaseConnection();
                            next(e);
                          });
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
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
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    }
  } catch (e) {
    next(e);
  }
};
