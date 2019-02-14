//created by irfan:
proxAttendance: (req, res, next) => {
  const utilities = new algaehUtilities();

  const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
  let yearAndMonth = req.query.yearAndMonth;
  let leave_end_date = req.query.leave_end_date;
  delete req.query.yearAndMonth;
  const startOfMonth = moment(yearAndMonth)
    .startOf("month")
    .format("YYYY-MM-DD");

  const endOfMonth =
    leave_end_date == null
      ? moment(yearAndMonth)
          .endOf("month")
          .format("YYYY-MM-DD")
      : moment(leave_end_date).format("YYYY-MM-DD");

  const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
  const month_name = moment(yearAndMonth).format("MMMM");
  const month_number = moment(yearAndMonth).format("M");
  const year = moment(new Date(yearAndMonth)).format("YYYY");

  let selectWhere = {
    date_of_joining: endOfMonth,
    exit_date: startOfMonth,
    date_of_joining1: endOfMonth,
    ...req.query
  };

  let inputValues = [
    year,
    month_number,
    year,
    endOfMonth,
    startOfMonth,
    endOfMonth
  ];

  //ST---------delete old records
  let department = "";
  let hospital = "";
  if (selectWhere.hospital_id != null) {
    hospital = " and hospital_id=" + selectWhere.hospital_id;
  }
  if (selectWhere.sub_department_id != null) {
    department = " and sub_department_id=" + selectWhere.sub_department_id;
  }
  let deleteString = ` delete from hims_f_attendance_monthly where employee_id>0 and year=${year} and
                              month=${month_number}  ${hospital} ${department};`;

  //EN---------delete old records

  //ST---pending unpaid leaves
  let pendingYear = "";
  let pendingMonth = "";

  if (month_number == 1) {
    pendingYear = year - 1;
    pendingMonth = 12;
  } else {
    pendingYear = year;
    pendingMonth = month_number;
  }
  //EN---pending unpaid leaves

  //ST---------to fetch employee data
  let _stringData = "";

  if (selectWhere.hospital_id != null) {
    _stringData += " and E.hospital_id=?";
    inputValues.push(selectWhere.hospital_id);
  }
  if (selectWhere.sub_department_id != null) {
    _stringData += " and E.sub_department_id=? ";
    inputValues.push(selectWhere.sub_department_id);
  }

  if (selectWhere.hims_d_employee_id != null) {
    _stringData += " and E.hims_d_employee_id=? ";
    inputValues.push(selectWhere.hims_d_employee_id);
  }

  inputValues.push(
    startOfMonth,
    endOfMonth,
    selectWhere.hospital_id,
    startOfMonth,
    endOfMonth,
    year,
    startOfMonth,
    endOfMonth,
    startOfMonth,
    endOfMonth,
    startOfMonth,
    endOfMonth,
    pendingYear,
    pendingMonth
  );
  //EN---------to fetch employee data

  let allEmployees = [];
  let allHolidays = [];
  let allAbsents = [];

  let allMonthlyLeaves = [];
  let allPendingLeaves = [];
  let attendanceArray = [];

  new Promise((resolve, reject) => {
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id, employee_code,full_name  as employee_name,\
              employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,\
              exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
              and  A.year=? and A.month=? and A.cancelled='N' left join hims_f_employee_yearly_leave YL on E.hims_d_employee_id=YL.employee_id and  YL.year=?\
                where employee_status <>'I' and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
              (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'" +
            _stringData +
            " and hims_f_employee_annual_leave_id is null ;\
              select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
               religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
               select hims_f_absent_id, employee_id, absent_date, from_session, to_session,cancel ,absent_duration from hims_f_absent where\
                record_status='A' and cancel='N'  and date(absent_date) between date(?) and date(?) ;\
                select hims_f_leave_application_id, LA.employee_id,LA.leave_id,LA.weekoff_days,LA.holidays, L.leave_type, L.include_weekoff,L.include_holiday,LA.status,\
                hims_f_employee_monthly_leave_id,year,total_eligible,availed_till_date,close_balance," +
            month_name +
            " as present_month FROM \
                hims_f_leave_application  LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
                inner join hims_f_employee_monthly_leave  ML on LA.leave_id=ML.leave_id and LA.employee_id=ML.employee_id and ML.year=?\
                where  status= 'APR' AND ((from_date>= ? and from_date <= ?) or\
                (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?));\
                select hims_f_pending_leave_id,PL.employee_id,year,month,leave_application_id,adjusted,\
                adjusted_year,adjusted_month,updaid_leave_duration,status from hims_f_pending_leave PL \
                inner join hims_f_leave_application LA on  PL.leave_application_id=LA.hims_f_leave_application_id\
                  where LA.status='APR' and  year=? and month=?",
          values: inputValues,
          printQuery: true
        })
        .then(result => {
          allEmployees = result[0];
          allHolidays = result[1];
          allAbsents = result[2];
          allMonthlyLeaves = result[3];
          allPendingLeaves = result[4];

          //  utilities.logger().log("allEmployees: ", allEmployees);
          //  utilities.logger().log("allHolidays: ", allHolidays);
          //  utilities.logger().log("allAbsents: ", allAbsents);
          //  utilities.logger().log("allMonthlyLeaves: ", allMonthlyLeaves);
          //  utilities.logger().log("allPendingLeaves: ", allPendingLeaves);

          if (allEmployees.length > 0) {
            //ST-----checking if yearly leaves not proccessed for any employee
            let noYearlyLeave = new LINQ(allEmployees)
              .Where(w => w.hims_f_employee_yearly_leave_id == null)
              .Select(s => {
                return {
                  employee_code: s.employee_code,
                  employee_name: s.employee_name
                };
              })
              .ToArray();
            utilities.logger().log("noYearlyLeave: ", noYearlyLeave);
            if (noYearlyLeave.length > 0) {
              req.records = {
                invalid_input: true,
                message: " please proces yearly leave for ",
                employees: noYearlyLeave
              };
              next();
              return;
            }
            //EN-----checking if yearly leaves not proccessed for any employee
            else {
              for (let i = 0; i < allEmployees.length; i++) {
                allEmployees[i]["defaults"] = {
                  total_work_days: totalMonthDays,
                  emp_absent_days: 0,
                  total_holidays: 0,
                  total_week_off: 0,
                  paid_leave: 0,
                  unpaid_leave: 0,
                  total_leaves: 0,
                  present_days: 0,
                  paid_days: 0,
                  week_off_include: 0,
                  holiday_include: 0
                };

                //ST--- checking date of joining  to calculate total_work_days
                if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] == null
                ) {
                  allEmployees[i]["defaults"].total_work_days -= moment(
                    allEmployees[i]["date_of_joining"],
                    "YYYY-MM-DD"
                  ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days");
                } else if (
                  allEmployees[i]["exit_date"] < endOfMonth &&
                  allEmployees[i]["date_of_joining"] < startOfMonth
                ) {
                  allEmployees[i]["defaults"].total_work_days -= moment(
                    endOfMonth,
                    "YYYY-MM-DD"
                  ).diff(
                    moment(allEmployees[i]["exit_date"], "YYYY-MM-DD"),
                    "days"
                  );
                } else if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] < endOfMonth
                ) {
                  allEmployees[i]["defaults"].total_work_days -=
                    moment(
                      allEmployees[i]["date_of_joining"],
                      "YYYY-MM-DD"
                    ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days") +
                    moment(endOfMonth, "YYYY-MM-DD").diff(
                      moment(allEmployees[i]["exit_date"], "YYYY-MM-DD"),
                      "days"
                    );
                }
                //EN--- checking date of joining  to calculate total_work_days

                //ST---- adding employee absent days

                allEmployees[i]["defaults"].emp_absent_days = new LINQ(
                  allAbsents
                )
                  .Where(
                    w => w.employee_id == allEmployees[i]["hims_d_employee_id"]
                  )
                  .Sum(s => s.absent_duration);

                //EN---- adding employee absent days

                //ST---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include
                allEmployees[i]["defaults"].paid_leave = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.leave_type == "P"
                  )
                  .Sum(s => s.present_month);

                allEmployees[i]["defaults"].unpaid_leave = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.leave_type == "U"
                  )
                  .Sum(s => s.present_month);

                allEmployees[i]["defaults"].week_off_include = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.include_weekoff == "Y"
                  )
                  .Sum(s => s.weekoff_days);

                allEmployees[i]["defaults"].holiday_include = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.include_holiday == "Y"
                  )
                  .Sum(s => s.holidays);

                allEmployees[i]["defaults"].total_leaves =
                  allEmployees[i]["defaults"].paid_leave +
                  allEmployees[i]["defaults"].unpaid_leave;
                //EN---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include

                //ST ----------- CALCULATING WEEK OFF AND HOLIDAYS

                if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] == null
                ) {
                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        w.holiday_date > allEmployees[i]["date_of_joining"]
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date > allEmployees[i]["date_of_joining"]
                      );
                    }
                  ).length;
                } else if (
                  allEmployees[i]["exit_date"] < endOfMonth &&
                  allEmployees[i]["date_of_joining"] < startOfMonth
                ) {
                  //---------------

                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        w.holiday_date < allEmployees[i]["exit_date"]
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date < allEmployees[i]["exit_date"]
                      );
                    }
                  ).length;
                } else if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] < endOfMonth
                ) {
                  //---------------

                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        (w.holiday_date > allEmployees[i]["date_of_joining"] &&
                          w.holiday_date < allEmployees[i]["exit_date"])
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date > allEmployees[i]["date_of_joining"] &&
                        obj.holiday_date < allEmployees[i]["exit_date"]
                      );
                    }
                  ).length;
                } else {
                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        (w.holiday == "Y" && w.holiday_type == "RE") ||
                        (w.holiday == "Y" &&
                          w.holiday_type == "RS" &&
                          w.religion_id == allEmployees[i]["religion_id"])
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return obj.weekoff === "Y" && obj.holiday_type === "RE";
                    }
                  ).length;
                }

                //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

                allEmployees[i]["defaults"].present_days =
                  req.query.leave_salary == "Y"
                    ? 0
                    : allEmployees[i]["defaults"].total_work_days -
                      allEmployees[i]["defaults"].emp_absent_days -
                      allEmployees[i]["defaults"].total_leaves -
                      allEmployees[i]["defaults"].total_week_off -
                      allEmployees[i]["defaults"].total_holidays +
                      allEmployees[i]["defaults"].week_off_include +
                      allEmployees[i]["defaults"].holiday_include;

                allEmployees[i]["defaults"].paid_days =
                  parseFloat(allEmployees[i]["defaults"].present_days) +
                  parseFloat(allEmployees[i]["defaults"].paid_leave) +
                  parseFloat(allEmployees[i]["defaults"].total_holidays) +
                  parseFloat(allEmployees[i]["defaults"].total_week_off);

                attendanceArray.push({
                  employee_id: allEmployees[i]["hims_d_employee_id"],
                  year: year,
                  month: month_number,
                  hospital_id: allEmployees[i]["hospital_id"],
                  sub_department_id: allEmployees[i]["sub_department_id"],
                  total_days: totalMonthDays,
                  present_days: allEmployees[i]["defaults"].present_days,
                  absent_days: allEmployees[i]["defaults"].emp_absent_days,
                  total_work_days: allEmployees[i]["defaults"].total_work_days,
                  total_weekoff_days:
                    allEmployees[i]["defaults"].total_week_off,
                  total_holidays: allEmployees[i]["defaults"].total_holidays,
                  total_leave: allEmployees[i]["defaults"].total_leaves,
                  paid_leave: allEmployees[i]["defaults"].paid_leave,
                  unpaid_leave: allEmployees[i]["defaults"].unpaid_leave,
                  total_paid_days: allEmployees[i]["defaults"].paid_days,
                  created_date: new Date(),
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id
                });

                if (i == allEmployees.length - 1) {
                  resolve(attendanceArray);
                }
              }

              utilities.logger().log("allEmployees: ", allEmployees);
            }
            _mysql.releaseConnection();
            req.records = attendanceArray;
            next();
          } else {
            if (req.mySQl == null) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "No Employees found"
              };
              next();
              return;
            } else {
              resolve("No Employee found");
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      reject(e);
    }
  }).then(attendanceResult => {
    _mysql
      .executeQueryWithTransaction({
        query: deleteString,
        printQuery: true
      })
      .then(del => {
        if (attendanceArray.length > 0) {
          //functionality plus commit

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
            "created_date",
            "created_by",
            "updated_date",
            "updated_by"
          ];

          _mysql
            .executeQueryWithTransaction({
              query: "INSERT INTO hims_f_attendance_monthly(??) VALUES ?",
              values: attendanceArray,
              includeValues: insurtColumns,

              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(finalResult => {
              utilities.logger().log("finalResult: ", finalResult);
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = finalResult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "No Employee data found"
            };
            next();
            return;
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  });
};
//created by irfan:
proxAttendance: (req, res, next) => {
  const utilities = new algaehUtilities();

  const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
  let yearAndMonth = req.query.yearAndMonth;
  let leave_end_date = req.query.leave_end_date;
  delete req.query.yearAndMonth;
  const startOfMonth = moment(yearAndMonth)
    .startOf("month")
    .format("YYYY-MM-DD");

  const endOfMonth =
    leave_end_date == null
      ? moment(yearAndMonth)
          .endOf("month")
          .format("YYYY-MM-DD")
      : moment(leave_end_date).format("YYYY-MM-DD");

  const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
  const month_name = moment(yearAndMonth).format("MMMM");
  const month_number = moment(yearAndMonth).format("M");
  const year = moment(new Date(yearAndMonth)).format("YYYY");

  let selectWhere = {
    date_of_joining: endOfMonth,
    exit_date: startOfMonth,
    date_of_joining1: endOfMonth,
    ...req.query
  };

  let inputValues = [
    year,
    month_number,
    year,
    endOfMonth,
    startOfMonth,
    endOfMonth
  ];

  //ST---------delete old records
  let department = "";
  let hospital = "";
  if (selectWhere.hospital_id != null) {
    hospital = " and hospital_id=" + selectWhere.hospital_id;
  }
  if (selectWhere.sub_department_id != null) {
    department = " and sub_department_id=" + selectWhere.sub_department_id;
  }
  let deleteString = ` delete from hims_f_attendance_monthly where employee_id>0 and year=${year} and
                              month=${month_number}  ${hospital} ${department};`;

  //EN---------delete old records

  //ST---pending unpaid leaves
  let pendingYear = "";
  let pendingMonth = "";

  if (month_number == 1) {
    pendingYear = year - 1;
    pendingMonth = 12;
  } else {
    pendingYear = year;
    pendingMonth = month_number;
  }
  //EN---pending unpaid leaves

  //ST---------to fetch employee data
  let _stringData = "";

  if (selectWhere.hospital_id != null) {
    _stringData += " and E.hospital_id=?";
    inputValues.push(selectWhere.hospital_id);
  }
  if (selectWhere.sub_department_id != null) {
    _stringData += " and E.sub_department_id=? ";
    inputValues.push(selectWhere.sub_department_id);
  }

  if (selectWhere.hims_d_employee_id != null) {
    _stringData += " and E.hims_d_employee_id=? ";
    inputValues.push(selectWhere.hims_d_employee_id);
  }

  inputValues.push(
    startOfMonth,
    endOfMonth,
    selectWhere.hospital_id,
    startOfMonth,
    endOfMonth,
    year,
    startOfMonth,
    endOfMonth,
    startOfMonth,
    endOfMonth,
    startOfMonth,
    endOfMonth,
    pendingYear,
    pendingMonth
  );
  //EN---------to fetch employee data

  let allEmployees = [];
  let allHolidays = [];
  let allAbsents = [];

  let allMonthlyLeaves = [];
  let allPendingLeaves = [];
  let attendanceArray = [];

  new Promise((resolve, reject) => {
    try {
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id, employee_code,full_name  as employee_name,\
              employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,\
              exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
              and  A.year=? and A.month=? and A.cancelled='N' left join hims_f_employee_yearly_leave YL on E.hims_d_employee_id=YL.employee_id and  YL.year=?\
                where employee_status <>'I' and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
              (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'" +
            _stringData +
            " and hims_f_employee_annual_leave_id is null ;\
              select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
               religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
               select hims_f_absent_id, employee_id, absent_date, from_session, to_session,cancel ,absent_duration from hims_f_absent where\
                record_status='A' and cancel='N'  and date(absent_date) between date(?) and date(?) ;\
                select hims_f_leave_application_id, LA.employee_id,LA.leave_id,LA.weekoff_days,LA.holidays, L.leave_type, L.include_weekoff,L.include_holiday,LA.status,\
                hims_f_employee_monthly_leave_id,year,total_eligible,availed_till_date,close_balance," +
            month_name +
            " as present_month FROM \
                hims_f_leave_application  LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
                inner join hims_f_employee_monthly_leave  ML on LA.leave_id=ML.leave_id and LA.employee_id=ML.employee_id and ML.year=?\
                where  status= 'APR' AND ((from_date>= ? and from_date <= ?) or\
                (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?));\
                select hims_f_pending_leave_id,PL.employee_id,year,month,leave_application_id,adjusted,\
                adjusted_year,adjusted_month,updaid_leave_duration,status from hims_f_pending_leave PL \
                inner join hims_f_leave_application LA on  PL.leave_application_id=LA.hims_f_leave_application_id\
                  where LA.status='APR' and  year=? and month=?",
          values: inputValues,
          printQuery: true
        })
        .then(result => {
          allEmployees = result[0];
          allHolidays = result[1];
          allAbsents = result[2];
          allMonthlyLeaves = result[3];
          allPendingLeaves = result[4];

          //  utilities.logger().log("allEmployees: ", allEmployees);
          //  utilities.logger().log("allHolidays: ", allHolidays);
          //  utilities.logger().log("allAbsents: ", allAbsents);
          //  utilities.logger().log("allMonthlyLeaves: ", allMonthlyLeaves);
          //  utilities.logger().log("allPendingLeaves: ", allPendingLeaves);

          if (allEmployees.length > 0) {
            //ST-----checking if yearly leaves not proccessed for any employee
            let noYearlyLeave = new LINQ(allEmployees)
              .Where(w => w.hims_f_employee_yearly_leave_id == null)
              .Select(s => {
                return {
                  employee_code: s.employee_code,
                  employee_name: s.employee_name
                };
              })
              .ToArray();
            utilities.logger().log("noYearlyLeave: ", noYearlyLeave);
            if (noYearlyLeave.length > 0) {
              req.records = {
                invalid_input: true,
                message: " please proces yearly leave for ",
                employees: noYearlyLeave
              };
              next();
              return;
            }
            //EN-----checking if yearly leaves not proccessed for any employee
            else {
              for (let i = 0; i < allEmployees.length; i++) {
                allEmployees[i]["defaults"] = {
                  total_work_days: totalMonthDays,
                  emp_absent_days: 0,
                  total_holidays: 0,
                  total_week_off: 0,
                  paid_leave: 0,
                  unpaid_leave: 0,
                  total_leaves: 0,
                  present_days: 0,
                  paid_days: 0,
                  week_off_include: 0,
                  holiday_include: 0
                };

                //ST--- checking date of joining  to calculate total_work_days
                if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] == null
                ) {
                  allEmployees[i]["defaults"].total_work_days -= moment(
                    allEmployees[i]["date_of_joining"],
                    "YYYY-MM-DD"
                  ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days");
                } else if (
                  allEmployees[i]["exit_date"] < endOfMonth &&
                  allEmployees[i]["date_of_joining"] < startOfMonth
                ) {
                  allEmployees[i]["defaults"].total_work_days -= moment(
                    endOfMonth,
                    "YYYY-MM-DD"
                  ).diff(
                    moment(allEmployees[i]["exit_date"], "YYYY-MM-DD"),
                    "days"
                  );
                } else if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] < endOfMonth
                ) {
                  allEmployees[i]["defaults"].total_work_days -=
                    moment(
                      allEmployees[i]["date_of_joining"],
                      "YYYY-MM-DD"
                    ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days") +
                    moment(endOfMonth, "YYYY-MM-DD").diff(
                      moment(allEmployees[i]["exit_date"], "YYYY-MM-DD"),
                      "days"
                    );
                }
                //EN--- checking date of joining  to calculate total_work_days

                //ST---- adding employee absent days

                allEmployees[i]["defaults"].emp_absent_days = new LINQ(
                  allAbsents
                )
                  .Where(
                    w => w.employee_id == allEmployees[i]["hims_d_employee_id"]
                  )
                  .Sum(s => s.absent_duration);

                //EN---- adding employee absent days

                //ST---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include
                allEmployees[i]["defaults"].paid_leave = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.leave_type == "P"
                  )
                  .Sum(s => s.present_month);

                allEmployees[i]["defaults"].unpaid_leave = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.leave_type == "U"
                  )
                  .Sum(s => s.present_month);

                allEmployees[i]["defaults"].week_off_include = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.include_weekoff == "Y"
                  )
                  .Sum(s => s.weekoff_days);

                allEmployees[i]["defaults"].holiday_include = new LINQ(
                  allMonthlyLeaves
                )
                  .Where(
                    w =>
                      w.employee_id == allEmployees[i]["hims_d_employee_id"] &&
                      w.include_holiday == "Y"
                  )
                  .Sum(s => s.holidays);

                allEmployees[i]["defaults"].total_leaves =
                  allEmployees[i]["defaults"].paid_leave +
                  allEmployees[i]["defaults"].unpaid_leave;
                //EN---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include

                //ST ----------- CALCULATING WEEK OFF AND HOLIDAYS

                if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] == null
                ) {
                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        w.holiday_date > allEmployees[i]["date_of_joining"]
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date > allEmployees[i]["date_of_joining"]
                      );
                    }
                  ).length;
                } else if (
                  allEmployees[i]["exit_date"] < endOfMonth &&
                  allEmployees[i]["date_of_joining"] < startOfMonth
                ) {
                  //---------------

                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        w.holiday_date < allEmployees[i]["exit_date"]
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date < allEmployees[i]["exit_date"]
                      );
                    }
                  ).length;
                } else if (
                  allEmployees[i]["date_of_joining"] > startOfMonth &&
                  allEmployees[i]["exit_date"] < endOfMonth
                ) {
                  //---------------

                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        ((w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == allEmployees[i]["religion_id"])) &&
                        (w.holiday_date > allEmployees[i]["date_of_joining"] &&
                          w.holiday_date < allEmployees[i]["exit_date"])
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return (
                        obj.weekoff === "Y" &&
                        obj.holiday_type === "RE" &&
                        obj.holiday_date > allEmployees[i]["date_of_joining"] &&
                        obj.holiday_date < allEmployees[i]["exit_date"]
                      );
                    }
                  ).length;
                } else {
                  allEmployees[i]["defaults"].total_holidays = new LINQ(
                    allHolidays
                  )
                    .Where(
                      w =>
                        (w.holiday == "Y" && w.holiday_type == "RE") ||
                        (w.holiday == "Y" &&
                          w.holiday_type == "RS" &&
                          w.religion_id == allEmployees[i]["religion_id"])
                    )
                    .Count();

                  allEmployees[i]["defaults"].total_week_off = _.filter(
                    allHolidays,
                    obj => {
                      return obj.weekoff === "Y" && obj.holiday_type === "RE";
                    }
                  ).length;
                }

                //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

                allEmployees[i]["defaults"].present_days =
                  req.query.leave_salary == "Y"
                    ? 0
                    : allEmployees[i]["defaults"].total_work_days -
                      allEmployees[i]["defaults"].emp_absent_days -
                      allEmployees[i]["defaults"].total_leaves -
                      allEmployees[i]["defaults"].total_week_off -
                      allEmployees[i]["defaults"].total_holidays +
                      allEmployees[i]["defaults"].week_off_include +
                      allEmployees[i]["defaults"].holiday_include;

                allEmployees[i]["defaults"].paid_days =
                  parseFloat(allEmployees[i]["defaults"].present_days) +
                  parseFloat(allEmployees[i]["defaults"].paid_leave) +
                  parseFloat(allEmployees[i]["defaults"].total_holidays) +
                  parseFloat(allEmployees[i]["defaults"].total_week_off);

                attendanceArray.push({
                  employee_id: allEmployees[i]["hims_d_employee_id"],
                  year: year,
                  month: month_number,
                  hospital_id: allEmployees[i]["hospital_id"],
                  sub_department_id: allEmployees[i]["sub_department_id"],
                  total_days: totalMonthDays,
                  present_days: allEmployees[i]["defaults"].present_days,
                  absent_days: allEmployees[i]["defaults"].emp_absent_days,
                  total_work_days: allEmployees[i]["defaults"].total_work_days,
                  total_weekoff_days:
                    allEmployees[i]["defaults"].total_week_off,
                  total_holidays: allEmployees[i]["defaults"].total_holidays,
                  total_leave: allEmployees[i]["defaults"].total_leaves,
                  paid_leave: allEmployees[i]["defaults"].paid_leave,
                  unpaid_leave: allEmployees[i]["defaults"].unpaid_leave,
                  total_paid_days: allEmployees[i]["defaults"].paid_days,
                  created_date: new Date(),
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id
                });

                if (i == allEmployees.length - 1) {
                  resolve(attendanceArray);
                }
              }

              utilities.logger().log("allEmployees: ", allEmployees);
            }
            _mysql.releaseConnection();
            req.records = attendanceArray;
            next();
          } else {
            if (req.mySQl == null) {
              _mysql.releaseConnection();
              req.records = {
                invalid_input: true,
                message: "No Employees found"
              };
              next();
              return;
            } else {
              resolve("No Employee found");
            }
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      reject(e);
    }
  }).then(attendanceResult => {
    _mysql
      .executeQueryWithTransaction({
        query: deleteString,
        printQuery: true
      })
      .then(del => {
        if (attendanceArray.length > 0) {
          //functionality plus commit

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
            "created_date",
            "created_by",
            "updated_date",
            "updated_by"
          ];

          _mysql
            .executeQueryWithTransaction({
              query: "INSERT INTO hims_f_attendance_monthly(??) VALUES ?",
              values: attendanceArray,
              includeValues: insurtColumns,

              bulkInsertOrUpdate: true,
              printQuery: true
            })
            .then(finalResult => {
              utilities.logger().log("finalResult: ", finalResult);
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = finalResult;
                next();
              });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        } else {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "No Employee data found"
            };
            next();
            return;
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  });
};
