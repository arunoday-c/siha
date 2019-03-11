postTimeSheetMonthWise: (req, res, next) => {
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

    if (
      input.attendance_type == "MW" &&
      input.hims_d_employee_id > 0 &&
      input.hospital_id > 0 &&
      input.sub_department_id > 0
    ) {
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

            //  let  standard_hours = options[0]["standard_working_hours"]
            //     .toString()
            //     .split(".")[0];
            //   let standard_mins = options[0]["standard_working_hours"]
            //     .toString()
            //     .split(".")[1];

            _mysql
              .executeQuery({
                query:
                  "select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
                  attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
                  actual_minutes,worked_hours,consider_ot_shrtg,expected_out_date,expected_out_time,TS.hospital_id\
                  from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                  where TS.hospital_id=? and year=? and month=? and TS.sub_department_id=? " +
                  stringData +
                  " and attendance_date between date(?) and date(?);\
                  select hims_f_shift_roster_id,employee_id,religion_id,SR.sub_department_id,shift_date,shift_id,shift_end_date,\
                  shift_start_time,shift_end_time,shift_time,weekoff,holiday,SR.hospital_id\
                  from hims_f_shift_roster SR inner join hims_d_employee E on SR.employee_id=E.hims_d_employee_id where SR.hospital_id=? and SR.sub_department_id=? " +
                  stringData +
                  " and shift_date \
                  between date(?) and  date(?); \
                  select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
                  attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
                  actual_minutes,worked_hours,consider_ot_shrtg,expected_out_date,expected_out_time,TS.hospital_id\
                  from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                  where TS.hospital_id=? and year=? and month=? and TS.sub_department_id=? " +
                  stringData +
                  " and attendance_date between date(?) and date(?);\
                    select hims_f_leave_application_id,employee_id,leave_application_code,L.leave_type,from_leave_session,from_date,to_leave_session,\
                    to_date from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
                        where ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
                        ( date(?)>=date(from_date) and   date(?)<=date(to_date))   or (date(from_date)>= date(?)\
                        and date(from_date)<=date(?) ) or \
                        (date(to_date)>=date(?) and date(to_date)<= date(?) )\
                        )and employee_id=? and (`status`='APR' or `status`='PEN') ;\
                        select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
                        religion_id from hims_d_holiday where record_status='A' and date(holiday_date)\
                        between date(?) and date(?) and hospital_id=?",
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
                  lastMonth_end_date,
                  next_dayOf_cutoff,
                  next_dayOf_cutoff,
                  to_date,
                  to_date,
                  next_dayOf_cutoff,
                  to_date,
                  next_dayOf_cutoff,
                  to_date,
                  input.hims_d_employee_id,

                  next_dayOf_cutoff,
                  to_date,
                  input.hospital_id
                ],

                printQuery: true
              })
              .then(result => {
                let AttenResult = result[0];
                let RosterResult = result[1];
                let LastTenDaysResult = result[2];
                let LeaveResult = result[3];
                let HolidayResult = result[4];

                utilities.logger().log("AttenResult: ", AttenResult);
                utilities.logger().log("RosterResult: ", RosterResult);
                utilities
                  .logger()
                  .log("LastTenDaysResult: ", LastTenDaysResult);

                let total_biom_attend = AttenResult.concat(LastTenDaysResult);
                if (total_biom_attend.length > 0) {
                  let excptions = new LINQ(total_biom_attend)
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

                  if (excptions.length > 0) {
                    req.records = {
                      invalid_input: true,
                      employees: excptions,
                      message: "Please Notify Exceptions to proceed"
                    };
                    next();
                    return;
                  } else {
                    //present month first 20 days till cuttoff
                    for (let i = 0; i < AttenResult.length; i++) {
                      let shortage_time = 0;
                      let shortage_min = 0;
                      let ot_time = 0;
                      let ot_min = 0;

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

                        // utilities.logger().log("worked_minutes: ", worked_minutes);
                        // utilities.logger().log("diff: ", diff);
                        // utilities.logger().log("ot_time: ", ot_time);
                        // utilities.logger().log("shortage_time: ", shortage_time);
                        // utilities.logger().log("================: ");
                      }

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
                            : 0
                      });
                    }

                    let leave_Date_range = [];

                    //calculating leave date range
                    for (let m = 0; m < LeaveResult.length; m++) {
                      leave_Date_range.push({
                        leave_type: LeaveResult[m]["leave_type"],
                        dates: getDays(
                          new Date(LeaveResult[m]["from_date"]),
                          new Date(LeaveResult[m]["to_date"])
                        )
                      });
                    }

                    utilities
                      .logger()
                      .log("leave_Date_range: ", leave_Date_range);

                    let roster_Date_range = getDays(
                      new Date(next_dayOf_cutoff),
                      new Date(to_date)
                    );
                    utilities
                      .logger()
                      .log("roster_Date_range: ", roster_Date_range);
                    //workin here
                    for (let i = 0; i < roster_Date_range.length; i++) {
                      let whichLeave = 0;
                      // checking which leave is on particular date
                      for (let k = 0; k < leave_Date_range.length; k++) {
                        let leavData = leave_Date_range[k]["dates"].includes(
                          roster_Date_range[i]
                        );

                        utilities.logger().log("leavData: ", leavData);
                        utilities
                          .logger()
                          .log("roster_Date_range[i]: ", roster_Date_range[i]);
                        if (leavData == true) {
                          whichLeave = leave_Date_range[k]["leave_type"];
                          break;
                        }
                      }

                      utilities
                        .logger()
                        .log("roster_Date_range: ", roster_Date_range);

                      let holiday_or_weekOff = new LINQ(HolidayResult)
                        .Where(
                          w =>
                            w.holiday_date == roster_Date_range[i] &&
                            (w.weekoff == "Y" ||
                              (w.holiday == "Y" && w.holiday_type == "RE") ||
                              (w.holiday == "Y" &&
                                w.holiday_type == "RS" &&
                                w.religion_id ==
                                  RosterResult[0]["religion_id"]))
                        )
                        .Select(s => {
                          return {
                            holiday: s.holiday,
                            weekoff: s.weekoff
                          };
                        })
                        .FirstOrDefault({
                          holiday: "N",
                          weekoff: "N"
                        });
                      utilities
                        .logger()
                        .log("holiday_or_weekOff: ", holiday_or_weekOff);

                      RosterAttendance.push(
                        new LINQ(RosterResult)
                          .Where(w => roster_Date_range[i] == w.shift_date)
                          .Select(s => {
                            return {
                              employee_id: s.employee_id,
                              hospital_id: s.hospital_id,
                              sub_department_id: s.sub_department_id,
                              attendance_date: s.shift_date,
                              year: moment(s.shift_date).format("YYYY"),
                              month: moment(s.shift_date).format("M"),
                              total_days: 1,

                              weekoff_days:
                                whichLeave == 0 && s.weekoff == "Y" ? 1 : 0,
                              holidays:
                                whichLeave == 0 && s.holiday == "Y" ? 1 : 0,
                              present_days:
                                whichLeave == 0 &&
                                s.weekoff == "N" &&
                                s.holiday == "N"
                                  ? 1
                                  : 0,
                              absent_days: 0,
                              total_work_days: 1,
                              paid_leave: whichLeave == "P" ? 1 : 0,
                              unpaid_leave: whichLeave == "U" ? 1 : 0,
                              total_hours: s.shift_time,

                              hours: parseInt(s.shift_time),
                              minutes: (parseFloat(s.shift_time) % 1) * 100,
                              working_hours: s.shift_time,
                              shortage_hours: 0,
                              shortage_minutes: 0,
                              ot_work_hours: 0,
                              ot_minutes: 0
                            };
                          })
                          .FirstOrDefault({
                            employee_id: RosterResult[0].employee_id,
                            hospital_id: RosterResult[0].hospital_id,
                            sub_department_id:
                              RosterResult[0].sub_department_id,
                            attendance_date: roster_Date_range[i],
                            year: moment(roster_Date_range[i]).format("YYYY"),
                            month: moment(roster_Date_range[i]).format("M"),
                            total_days: 1,

                            weekoff_days:
                              whichLeave == 0 &&
                              holiday_or_weekOff.weekoff == "Y"
                                ? 1
                                : 0,
                            holidays:
                              whichLeave == 0 &&
                              holiday_or_weekOff.holiday == "Y"
                                ? 1
                                : 0,
                            present_days:
                              whichLeave == 0 &&
                              holiday_or_weekOff.weekoff == "N" &&
                              holiday_or_weekOff.holiday == "N"
                                ? 1
                                : 0,
                            absent_days: 0,
                            total_work_days: 1,
                            paid_leave: whichLeave == "P" ? 1 : 0,
                            unpaid_leave: whichLeave == "U" ? 1 : 0,
                            total_hours: 0,

                            hours: 0,
                            minutes: 0,
                            working_hours:
                              whichLeave != 0 ||
                              holiday_or_weekOff.weekoff == "Y" ||
                              holiday_or_weekOff.holiday == "Y"
                                ? 0
                                : options[0]["standard_working_hours"],
                            shortage_hours: 0,
                            shortage_minutes: 0,
                            ot_work_hours: 0,
                            ot_minutes: 0
                          })
                      );
                    }
                    utilities
                      .logger()
                      .log("RosterAttendance: ", RosterAttendance);

                    //ST---present month roster 10 days
                    // for (let j = 0; j < RosterResult.length; j++) {

                    //   let whichLeave=0;
                    //   // checking which leave is on puerticular date
                    //   for (let k = 0; k < leave_Date_range.length; k++){
                    //     let leavData=leave_Date_range[k]["dates"].includes(RosterResult[j]["shift_date"]);
                    //     if (leavData==true){
                    //       whichLeave=leave_Date_range[k]["leave_type"];
                    //       break;
                    //     }

                    //   }
                    //   utilities.logger().log("shift_date ", RosterResult[j]["shift_date"]);
                    //   utilities.logger().log("whichLeave: ", whichLeave);

                    //   RosterAttendance.push({
                    //     employee_id: RosterResult[j]["employee_id"],
                    //     hospital_id: RosterResult[j]["hospital_id"],
                    //     sub_department_id:
                    //       RosterResult[j]["sub_department_id"],
                    //     attendance_date: RosterResult[j]["shift_date"],
                    //     year: moment(RosterResult[j]["shift_date"]).format(
                    //       "YYYY"
                    //     ),
                    //     month: moment(RosterResult[j]["shift_date"]).format(
                    //       "M"
                    //     ),
                    //     total_days: 1,

                    //     weekoff_days:
                    //     whichLeave==0  &&RosterResult[j]["weekoff"] == "Y" ? 1 : 0,

                    //     holidays:  whichLeave==0&&RosterResult[j]["holiday"] == "Y" ? 1 : 0,
                    //     present_days:
                    //       RosterResult[j]["weekoff"] == "N" &&
                    //       RosterResult[j]["holiday"] == "N"
                    //         ? 1
                    //         : 0,
                    //     absent_days: 0,
                    //     total_work_days:
                    //       RosterResult[j]["weekoff"] == "N" &&
                    //       RosterResult[j]["holiday"] == "N"
                    //         ? 1
                    //         : 0,
                    //     paid_leave: whichLeave=="P"?1:0,
                    //     unpaid_leave: whichLeave=="U"?1:0,
                    //     total_hours: RosterResult[j]["shift_time"],
                    //     hours: parseInt(RosterResult[j]["shift_time"]),
                    //     minutes:
                    //       (parseFloat(RosterResult[j]["shift_time"]) % 1) *
                    //       100,
                    //     working_hours: RosterResult[j]["shift_time"],
                    //     shortage_hours: 0,
                    //     shortage_minutes: 0,
                    //     ot_work_hours: 0,
                    //     ot_minutes: 0
                    //   });
                    // }
                    //--ENDpresent month roster 10 days

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

                        total_hours:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? LastTenDaysResult[i]["worked_hours"]
                            : LastTenDaysResult[i]["actual_hours"] +
                              "." +
                              LastTenDaysResult[i]["actual_minutes"],
                        hours:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? LastTenDaysResult[i]["hours"]
                            : LastTenDaysResult[i]["actual_hours"],
                        minutes:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? LastTenDaysResult[i]["minutes"]
                            : LastTenDaysResult[i]["actual_minutes"],
                        working_hours:
                          LastTenDaysResult[i]["actual_hours"] +
                          "." +
                          LastTenDaysResult[i]["actual_minutes"],
                        shortage_hours:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? shortage_time
                            : 0,
                        shortage_minutes:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? shortage_min
                            : 0,
                        ot_work_hours:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? ot_time
                            : 0,
                        ot_minutes:
                          LastTenDaysResult[i]["consider_ot_shrtg"] == "Y"
                            ? ot_min
                            : 0
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

                              utilities
                                .logger()
                                .log("allPendingLeaves: ", allPendingLeaves);

                              utilities
                                .logger()
                                .log("pending_leaves: ", pending_leaves);

                              utilities
                                .logger()
                                .log(
                                  "shortage_hourss: ",
                                  attResult[i]["shortage_hourss"]
                                );
                              utilities
                                .logger()
                                .log("ot_hourss: ", attResult[i]["ot_hourss"]);

                              insertArray.push({
                                ...attResult[i],
                                total_paid_days:
                                  parseFloat(attResult[i]["present_days"]) +
                                  parseFloat(attResult[i]["paid_leave"]) +
                                  parseFloat(
                                    attResult[i]["total_weekoff_days"]
                                  ) +
                                  parseFloat(attResult[i]["total_holidays"]),
                                total_leave:
                                  parseFloat(attResult[i]["paid_leave"]) +
                                  parseFloat(attResult[i]["unpaid_leave"]),
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
                              "pending_unpaid_leave",
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
                                ,ot_work_hours=values(ot_work_hours),pending_unpaid_leave=values(pending_unpaid_leave),prev_month_shortage_hr=values(prev_month_shortage_hr)\
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
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input"
      };

      next();
      return;
    }
  } catch (e) {
    next(e);
  }
};
