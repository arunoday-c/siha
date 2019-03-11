//created by irfan:
postManualTimeSheetMonthWise: (req, res, next) => {
  const _mysql = new algaehMysql();
  let input = req.query;

  let month = moment(input.from_date).format("M");
  let year = moment(input.from_date).format("YYYY");

  let from_date = moment(input.from_date).format("YYYY-MM-DD");
  let to_date = moment(input.to_date).format("YYYY-MM-DD");

  let dailyAttendance = [];

  _mysql
    .executeQuery({
      query: `select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
          attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
          actual_minutes,worked_hours,consider_ot_shrtg,expected_out_date,expected_out_time,TS.hospital_id\
          from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
          where TS.hospital_id=? and year=? and month=? and TS.sub_department_id=? AND employee_id=? and attendance_date between date(?) and date(?);`,
      values: [
        input.hospital_id,
        year,
        month,
        input.sub_department_id,
        input.employee_id,
        from_date,
        to_date
      ],
      printQuery: true
    })
    .then(AttenResult => {
      //present month
      for (let i = 0; i < AttenResult.length; i++) {
        let shortage_time = 0;
        let shortage_min = 0;
        let ot_time = 0;
        let ot_min = 0;

        let week_off_ot_hour = 0;
        let week_off_ot_min = 0;
        let holiday_ot_hour = 0;
        let holiday_ot_min = 0;

        if (AttenResult[i]["status"] == "PR") {
          let total_minutes =
            parseInt(AttenResult[i]["actual_hours"] * 60) +
            parseInt(AttenResult[i]["actual_minutes"]);
          // utilities.logger().log("actual_hours: ", AttenResult[i]["actual_hours"]);
          // utilities.logger().log("actual_minutes: ", AttenResult[i]["actual_minutes"]);
          // utilities.logger().log("total_minutes: ", total_minutes);

          let worked_minutes =
            parseInt(AttenResult[i]["hours"] * 60) +
            parseInt(AttenResult[i]["minutes"]);

          let diff = total_minutes - worked_minutes;

          if (diff > 0) {
            //calculating shortage
            shortage_time = parseInt(parseInt(diff) / parseInt(60));
            shortage_min = parseInt(diff) % parseInt(60);
          } else if (diff < 0) {
            //calculating over time
            ot_time = parseInt(parseInt(Math.abs(diff)) / parseInt(60));
            ot_min = parseInt(Math.abs(diff)) % parseInt(60);
          }

          // utilities.logger().log("worked_minutes: ", worked_minutes);
          // utilities.logger().log("diff: ", diff);
          // utilities.logger().log("ot_time: ", ot_time);
          // utilities.logger().log("shortage_time: ", shortage_time);
          // utilities.logger().log("================: ");
        }

        if (AttenResult[i]["status"] == "WO") {
          let worked_minutes =
            parseInt(AttenResult[i]["hours"] * 60) +
            parseInt(AttenResult[i]["minutes"]);

          //calculating over time
          week_off_ot_hour = parseInt(
            parseInt(Math.abs(worked_minutes)) / parseInt(60)
          );
          week_off_ot_min = parseInt(Math.abs(worked_minutes)) % parseInt(60);
        }

        if (AttenResult[i]["status"] == "HO") {
          let worked_minutes =
            parseInt(AttenResult[i]["hours"] * 60) +
            parseInt(AttenResult[i]["minutes"]);

          //calculating over time
          holiday_ot_hour = parseInt(
            parseInt(Math.abs(worked_minutes)) / parseInt(60)
          );
          holiday_ot_min = parseInt(Math.abs(worked_minutes)) % parseInt(60);
        }

        dailyAttendance.push({
          employee_id: AttenResult[i]["employee_id"],
          hospital_id: AttenResult[i]["hospital_id"],
          sub_department_id: AttenResult[i]["sub_department_id"],
          attendance_date: AttenResult[i]["attendance_date"],
          year: moment(AttenResult[i]["attendance_date"]).format("YYYY"),
          month: moment(AttenResult[i]["attendance_date"]).format("M"),
          total_days: 1,
          present_days: AttenResult[i]["status"] == "PR" ? 1 : 0,
          absent_days: AttenResult[i]["status"] == "AB" ? 1 : 0,
          total_work_days: 1,
          weekoff_days: AttenResult[i]["status"] == "WO" ? 1 : 0,
          holidays: AttenResult[i]["status"] == "HO" ? 1 : 0,
          paid_leave: AttenResult[i]["status"] == "PL" ? 1 : 0,
          unpaid_leave: AttenResult[i]["status"] == "UL" ? 1 : 0,
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
            AttenResult[i]["consider_ot_shrtg"] == "Y" ? shortage_time : 0,
          shortage_minutes:
            AttenResult[i]["consider_ot_shrtg"] == "Y" ? shortage_min : 0,
          ot_work_hours:
            AttenResult[i]["consider_ot_shrtg"] == "Y" ? ot_time : 0,
          ot_minutes: AttenResult[i]["consider_ot_shrtg"] == "Y" ? ot_min : 0,

          ot_weekoff_hours: week_off_ot_hour,
          ot_weekoff_minutes: week_off_ot_min,
          ot_holiday_hours: holiday_ot_hour,
          ot_holiday_minutes: holiday_ot_min
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
        "working_hours",
        "shortage_hours",
        "shortage_minutes",
        "ot_work_hours",
        "ot_minutes",
        "ot_weekoff_hours",
        "ot_weekoff_minutes",
        "ot_holiday_hours",
        "ot_holiday_minutes"
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
                    ot_work_hours=values(ot_work_hours), ot_minutes=values(ot_minutes),ot_weekoff_hours=values(ot_weekoff_hours),ot_weekoff_minutes=values(ot_weekoff_minutes),\
                    ot_holiday_hours=values(ot_holiday_hours),ot_holiday_minutes=values(ot_holiday_minutes)",

          includeValues: insurtColumns,
          values: dailyAttendance,
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
                    hospital_id=?  and year=? and month=?  and sub_department_id=? and  employee_id=? and attendance_date between date(?) and\
                    date(?)  group by employee_id;",
              values: [
                input.hospital_id,
                year,
                month,
                input.sub_department_id,
                input.employee_id,
                from_date,
                to_date
              ],
              printQuery: true
            })
            .then(attResult => {
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
                "pending_unpaid_leave",
                "prev_month_shortage_hr",
                "prev_month_ot_hr",
                "ot_weekoff_hours",
                "ot_holiday_hours"
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
                  ,ot_work_hours=values(ot_work_hours),pending_unpaid_leave=values(pending_unpaid_leave),prev_month_shortage_hr=values(prev_month_shortage_hr)\
                  ,prev_month_ot_hr=values(prev_month_ot_hr) , ot_weekoff_hours=values(ot_weekoff_hours),ot_holiday_hours=values(ot_holiday_hours)",
                  values: insertArray,
                  includeValues: insurtColumns,
                  extraValues: {
                    created_date: new Date(),
                    created_by: req.userIdentity.algaeh_d_app_user_id,
                    updated_date: new Date(),
                    updated_by: req.userIdentity.algaeh_d_app_user_id
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
                  _mysql.releaseConnection();
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
    })
    .catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
};
