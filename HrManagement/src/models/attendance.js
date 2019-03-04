import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import { getEmployeeWeekOffsHolidays, getDays } from "./shift_roster";
import mysql from "mysql";

module.exports = {
  //created by irfan: to
  processAttendanceOLD: (req, res, next) => {
    return new Promise((resolve, reject) => {
      try {
        const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
        const utilities = new algaehUtilities();
        let yearAndMonth = req.query.yearAndMonth;
        let leave_end_date = req.query.leave_end_date;
        delete req.query.yearAndMonth;
        utilities.logger().log("yearAndMonth: ", yearAndMonth);
        const startOfMonth = moment(yearAndMonth)
          .startOf("month")
          .format("YYYY-MM-DD");

        utilities.logger().log("leave_end_date: ", leave_end_date);
        const endOfMonth =
          leave_end_date == null
            ? moment(new Date(yearAndMonth))
                .endOf("month")
                .format("YYYY-MM-DD")
            : moment(new Date(leave_end_date)).format("YYYY-MM-DD");

        utilities.logger().log("startOfMonth: ", startOfMonth);

        utilities.logger().log("endOfMonth: ", endOfMonth);

        const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
        const month_name = moment(yearAndMonth).format("MMMM");
        const month_number = moment(yearAndMonth).format("M");
        const year = moment(new Date(yearAndMonth)).format("YYYY");

        let selectWhere = {
          date_of_joining: endOfMonth,
          exit_date: startOfMonth,
          date_of_joining1: endOfMonth,
          //   hospital_id: "ALL",
          //   sub_department_id: "ALL",
          //   hims_d_employee_id: "ALL",
          ...req.query
        };

        utilities.logger().log("selectWhere: ", selectWhere);

        let inputValues = [
          year,
          month_number,
          endOfMonth,
          startOfMonth,
          endOfMonth
        ];

        //---------delete old records
        let department = "";
        let hospital = "";
        if (selectWhere.hospital_id != null) {
          hospital = " and hospital_id=" + selectWhere.hospital_id;
        }
        if (selectWhere.sub_department_id != null) {
          department =
            " and sub_department_id=" + selectWhere.sub_department_id;
        }
        let deleteString = ` delete from hims_f_attendance_monthly where employee_id>0 and year=${year} and
                         month=${month_number}  ${hospital} ${department};`;

        //---------delete old records
        let _stringData = "";

        if (selectWhere.hospital_id != null) {
          _stringData += " and hospital_id=?";
          inputValues.push(selectWhere.hospital_id);
        }
        if (selectWhere.sub_department_id != null) {
          _stringData += " and sub_department_id=? ";
          inputValues.push(selectWhere.sub_department_id);
        }

        if (selectWhere.hims_d_employee_id != null) {
          _stringData += " and hims_d_employee_id=? ";
          inputValues.push(selectWhere.hims_d_employee_id);
        }

        utilities.logger().log("_stringData: ", _stringData);

        utilities.logger().log("inputValues: ", inputValues);

        _mysql
          .executeQuery({
            query: deleteString,
            printQuery: true
          })
          .then(del => {
            _mysql
              .executeQueryWithTransaction({
                query:
                  "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,\
            exit_date from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
            and  A.year=? and A.month=? and A.cancelled='N' where employee_status <>'I'\
            and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
            (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'\
            and hims_f_employee_annual_leave_id is null" +
                  _stringData,
                values: inputValues,
                printQuery: true
              })
              .then(empResult => {
                if (empResult.length > 0) {
                  utilities
                    .logger()
                    .log("hospital_id: ", empResult[0]["hospital_id"]);
                  _mysql
                    .executeQuery({
                      query:
                        "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,\
                      weekoff, holiday, holiday_type, religion_id from \
                  hims_d_holiday where record_status='A' and  \
                      date(holiday_date) between date(?) and date(?) \
                      and (weekoff='Y' or holiday='Y') and hospital_id=?",
                      values: [
                        startOfMonth,
                        endOfMonth,
                        empResult[0]["hospital_id"]
                      ]
                    })
                    .then(holidayResult => {
                      try {
                        const _holidayResult = holidayResult;
                        for (let i = 0; i < empResult.length; i++) {
                          empResult[i]["defaults"] = {
                            emp_absent_days: 0,
                            emp_total_holidays: 0,
                            total_week_off: 0,
                            paid_leave: 0,
                            unpaid_leave: 0,
                            total_leaves: 0,
                            present_days: 0,
                            paid_days: 0,
                            total_work_days: totalMonthDays
                          };

                          if (
                            empResult[i]["date_of_joining"] > startOfMonth &&
                            empResult[i]["exit_date"] == null
                          ) {
                            empResult[i]["defaults"].total_work_days -= moment(
                              empResult[i]["date_of_joining"],
                              "YYYY-MM-DD"
                            ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days");
                          } else if (
                            empResult[i]["exit_date"] < endOfMonth &&
                            empResult[i]["date_of_joining"] < startOfMonth
                          ) {
                            empResult[i]["defaults"].total_work_days -= moment(
                              endOfMonth,
                              "YYYY-MM-DD"
                            ).diff(
                              moment(empResult[i]["exit_date"], "YYYY-MM-DD"),
                              "days"
                            );
                          } else if (
                            empResult[i]["date_of_joining"] > startOfMonth &&
                            empResult[i]["exit_date"] < endOfMonth
                          ) {
                            empResult[i]["defaults"].total_work_days -=
                              moment(
                                empResult[i]["date_of_joining"],
                                "YYYY-MM-DD"
                              ).diff(
                                moment(startOfMonth, "YYYY-MM-DD"),
                                "days"
                              ) +
                              moment(endOfMonth, "YYYY-MM-DD").diff(
                                moment(empResult[i]["exit_date"], "YYYY-MM-DD"),
                                "days"
                              );
                          }

                          //   let emp_absent_days = "0";
                          //   let emp_total_holidays = "0";
                          //   let total_week_off = "0";
                          //   let paid_leave = "0";
                          //   let unpaid_leave = "0";
                          //   let total_leaves = "0";
                          //   let present_days = "0";
                          //   let paid_days = "0";
                          _mysql
                            .executeQuery({
                              query:
                                "select hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
               cancel ,sum(absent_duration) as absent_days\
              from hims_f_absent where record_status='A' and cancel='N' and employee_id=?\
              and date(absent_date) between date(?) and date(?) group by  employee_id",
                              values: [
                                empResult[i]["hims_d_employee_id"],
                                startOfMonth,
                                endOfMonth
                              ]
                            })
                            .then(absentResult => {
                              if (absentResult.length > 0) {
                                empResult[i]["defaults"].emp_absent_days =
                                  absentResult[0].absent_days;
                              }

                              //ST ----------- CALCULATING WEEK OFF AND HOLIDAYS
                              // empResult[i]["defaults"].emp_total_holidays = new LINQ(
                              //   _holidayResult
                              // )
                              //   .Where(
                              //     w =>
                              //       (w.holiday == "Y" && w.holiday_type == "RE") ||
                              //       (w.holiday == "Y" &&
                              //         w.holiday_type == "RS" &&
                              //         w.religion_id == empResult[i]["religion_id"])
                              //   )
                              //   .Count();

                              // empResult[i]["defaults"].total_week_off = _.filter(
                              //   _holidayResult,
                              //   obj => {
                              //     return (
                              //       obj.weekoff === "Y" && obj.holiday_type === "RE"
                              //     );
                              //   }
                              // ).length;

                              if (
                                empResult[i]["date_of_joining"] >
                                  startOfMonth &&
                                empResult[i]["exit_date"] == null
                              ) {
                                empResult[i][
                                  "defaults"
                                ].emp_total_holidays = new LINQ(_holidayResult)
                                  .Where(
                                    w =>
                                      ((w.holiday == "Y" &&
                                        w.holiday_type == "RE") ||
                                        (w.holiday == "Y" &&
                                          w.holiday_type == "RS" &&
                                          w.religion_id ==
                                            empResult[i]["religion_id"])) &&
                                      w.holiday_date >
                                        empResult[i]["date_of_joining"]
                                  )
                                  .Count();

                                empResult[i][
                                  "defaults"
                                ].total_week_off = _.filter(
                                  _holidayResult,
                                  obj => {
                                    return (
                                      obj.weekoff === "Y" &&
                                      obj.holiday_type === "RE" &&
                                      obj.holiday_date >
                                        empResult[i]["date_of_joining"]
                                    );
                                  }
                                ).length;
                              } else if (
                                empResult[i]["exit_date"] < endOfMonth &&
                                empResult[i]["date_of_joining"] < startOfMonth
                              ) {
                                //---------------

                                empResult[i][
                                  "defaults"
                                ].emp_total_holidays = new LINQ(_holidayResult)
                                  .Where(
                                    w =>
                                      ((w.holiday == "Y" &&
                                        w.holiday_type == "RE") ||
                                        (w.holiday == "Y" &&
                                          w.holiday_type == "RS" &&
                                          w.religion_id ==
                                            empResult[i]["religion_id"])) &&
                                      w.holiday_date < empResult[i]["exit_date"]
                                  )
                                  .Count();

                                empResult[i][
                                  "defaults"
                                ].total_week_off = _.filter(
                                  _holidayResult,
                                  obj => {
                                    return (
                                      obj.weekoff === "Y" &&
                                      obj.holiday_type === "RE" &&
                                      obj.holiday_date <
                                        empResult[i]["exit_date"]
                                    );
                                  }
                                ).length;
                              } else if (
                                empResult[i]["date_of_joining"] >
                                  startOfMonth &&
                                empResult[i]["exit_date"] < endOfMonth
                              ) {
                                //---------------

                                empResult[i][
                                  "defaults"
                                ].emp_total_holidays = new LINQ(_holidayResult)
                                  .Where(
                                    w =>
                                      ((w.holiday == "Y" &&
                                        w.holiday_type == "RE") ||
                                        (w.holiday == "Y" &&
                                          w.holiday_type == "RS" &&
                                          w.religion_id ==
                                            empResult[i]["religion_id"])) &&
                                      (w.holiday_date >
                                        empResult[i]["date_of_joining"] &&
                                        w.holiday_date <
                                          empResult[i]["exit_date"])
                                  )
                                  .Count();

                                empResult[i][
                                  "defaults"
                                ].total_week_off = _.filter(
                                  _holidayResult,
                                  obj => {
                                    return (
                                      obj.weekoff === "Y" &&
                                      obj.holiday_type === "RE" &&
                                      obj.holiday_date >
                                        empResult[i]["date_of_joining"] &&
                                      obj.holiday_date <
                                        empResult[i]["exit_date"]
                                    );
                                  }
                                ).length;
                              } else {
                                empResult[i][
                                  "defaults"
                                ].emp_total_holidays = new LINQ(_holidayResult)
                                  .Where(
                                    w =>
                                      (w.holiday == "Y" &&
                                        w.holiday_type == "RE") ||
                                      (w.holiday == "Y" &&
                                        w.holiday_type == "RS" &&
                                        w.religion_id ==
                                          empResult[i]["religion_id"])
                                  )
                                  .Count();

                                empResult[i][
                                  "defaults"
                                ].total_week_off = _.filter(
                                  _holidayResult,
                                  obj => {
                                    return (
                                      obj.weekoff === "Y" &&
                                      obj.holiday_type === "RE"
                                    );
                                  }
                                ).length;
                              }

                              //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

                              absentResult =
                                empResult[i]["defaults"].emp_absent_days;
                              _mysql
                                .executeQuery({
                                  query:
                                    "select hims_f_leave_application_id, employee_id, leave_id, leave_type FROM hims_f_leave_application where\
                        employee_id =? and status= 'APR' AND\
                        ((from_date>= ? and from_date <= ?) or\
                        (to_date >= ? and to_date <= ?) or\
                        (from_date <= ? and to_date >= ?)) group by leave_id ",
                                  values: [
                                    empResult[i]["hims_d_employee_id"],
                                    startOfMonth,
                                    endOfMonth,
                                    startOfMonth,
                                    endOfMonth,
                                    startOfMonth,
                                    endOfMonth
                                  ],
                                  printQuery: true
                                })
                                .then(leaveAppResult => {
                                  let leave_ids = _.map(leaveAppResult, obj => {
                                    return obj.leave_id;
                                  });

                                  utilities
                                    .logger()
                                    .log("leave_ids: ", leave_ids);

                                  utilities
                                    .logger()
                                    .log("month_name: ", month_name);

                                  if (leave_ids.length > 0) {
                                    _mysql
                                      .executeQuery({
                                        query:
                                          "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.leave_type,\
                                total_eligible, availed_till_date," +
                                          month_name +
                                          " as present_month,close_balance, processed,\
                                carry_forward_done, carry_forward_leave, encashment_leave FROM hims_f_employee_monthly_leave ML,hims_d_leave L\
                                where  employee_id=? and ML.leave_id=L.hims_d_leave_id and leave_id in (?) and year=?",
                                        values: [
                                          empResult[i]["hims_d_employee_id"],
                                          leave_ids,
                                          year
                                        ],
                                        printQuery: true
                                      })
                                      .then(monthlyLeaveResult => {
                                        utilities
                                          .logger()
                                          .log(
                                            "monthlyLeaveResult: ",
                                            monthlyLeaveResult
                                          );

                                        if (monthlyLeaveResult.length > 0) {
                                          const _paid_leave = _.chain(
                                            monthlyLeaveResult
                                          )
                                            .filter(obj => {
                                              return obj.leave_type == "P";
                                            })
                                            .first()
                                            .value();

                                          utilities
                                            .logger()
                                            .log("_paid_leave: ", _paid_leave);

                                          empResult[i]["defaults"].paid_leave =
                                            _paid_leave == null
                                              ? 0
                                              : _paid_leave.present_month;
                                          //-------------------------------------------------------------------
                                          let _unpaid_leave = _.chain(
                                            monthlyLeaveResult
                                          )
                                            .filter(obj => {
                                              return obj.leave_type == "U";
                                            })
                                            .first()
                                            .value();

                                          //---------------

                                          empResult[i][
                                            "defaults"
                                          ].unpaid_leave =
                                            _unpaid_leave == null
                                              ? 0
                                              : _unpaid_leave.present_month;
                                          empResult[i][
                                            "defaults"
                                          ].total_leaves =
                                            empResult[i]["defaults"]
                                              .paid_leave +
                                            empResult[i]["defaults"]
                                              .unpaid_leave;
                                        }
                                        utilities
                                          .logger()
                                          .log(
                                            "leave_salary: ",
                                            req.query.leave_salary
                                          );

                                        empResult[i]["defaults"].present_days =
                                          req.query.leave_salary == "Y"
                                            ? 0
                                            : empResult[i]["defaults"]
                                                .total_work_days -
                                              empResult[i]["defaults"]
                                                .emp_absent_days -
                                              empResult[i]["defaults"]
                                                .total_leaves -
                                              empResult[i]["defaults"]
                                                .total_week_off -
                                              empResult[i]["defaults"]
                                                .emp_total_holidays;

                                        empResult[i]["defaults"].paid_days =
                                          parseFloat(
                                            empResult[i]["defaults"]
                                              .present_days
                                          ) +
                                          parseFloat(
                                            empResult[i]["defaults"].paid_leave
                                          ) +
                                          parseFloat(
                                            empResult[i]["defaults"]
                                              .emp_total_holidays
                                          ) +
                                          parseFloat(
                                            empResult[i]["defaults"]
                                              .total_week_off
                                          );
                                        // _mysql.mysqlQueryFormat("UPDATE ?",{total_days:totalMonthDays,
                                        //   present_days: empResult[i]["defaults"].present_days,
                                        //   absent_days:,
                                        //   created_date:,
                                        //   created_by:,

                                        // })
                                        _mysql
                                          .executeQuery({
                                            query:
                                              "INSERT INTO `hims_f_attendance_monthly` (employee_id,year,month,hospital_id,sub_department_id,total_days,present_days,absent_days,\
                                    total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,unpaid_leave,total_paid_days,created_date,created_by,updated_date,updated_by)\
                                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE total_days=?,present_days=?,absent_days=?,\
                                    total_work_days=?,total_weekoff_days=?,total_holidays=?,total_leave=?,paid_leave=?,unpaid_leave=?,total_paid_days=?,updated_date=?,updated_by=? ",
                                            values: [
                                              empResult[i][
                                                "hims_d_employee_id"
                                              ],
                                              year,
                                              month_number,
                                              empResult[i]["hospital_id"],
                                              empResult[i]["sub_department_id"],
                                              totalMonthDays,
                                              empResult[i]["defaults"]
                                                .present_days,
                                              empResult[i]["defaults"]
                                                .emp_absent_days,
                                              empResult[i]["defaults"]
                                                .total_work_days,
                                              empResult[i]["defaults"]
                                                .total_week_off,
                                              empResult[i]["defaults"]
                                                .emp_total_holidays,
                                              empResult[i]["defaults"]
                                                .total_leaves,
                                              empResult[i]["defaults"]
                                                .paid_leave,
                                              empResult[i]["defaults"]
                                                .unpaid_leave,
                                              empResult[i]["defaults"]
                                                .paid_days,

                                              new Date(),
                                              req.userIdentity
                                                .algaeh_d_app_user_id,
                                              new Date(),

                                              req.userIdentity
                                                .algaeh_d_app_user_id,
                                              totalMonthDays,
                                              empResult[i]["defaults"]
                                                .present_days,
                                              empResult[i]["defaults"]
                                                .emp_absent_days,
                                              empResult[i]["defaults"]
                                                .total_work_days,
                                              empResult[i]["defaults"]
                                                .total_week_off,
                                              empResult[i]["defaults"]
                                                .emp_total_holidays,
                                              empResult[i]["defaults"]
                                                .total_leaves,
                                              empResult[i]["defaults"]
                                                .paid_leave,
                                              empResult[i]["defaults"]
                                                .unpaid_leave,
                                              empResult[i]["defaults"]
                                                .paid_days,
                                              new Date(),
                                              req.userIdentity
                                                .algaeh_d_app_user_id
                                            ],
                                            printQuery: true
                                          })
                                          .then(finalFesult => {
                                            if (i == empResult.length - 1) {
                                              _mysql
                                                .executeQuery({
                                                  query:
                                                    "select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                                            year,month,AM.hospital_id,AM.sub_department_id,\
                                            total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                                            total_leave,paid_leave,unpaid_leave,total_paid_days  from hims_f_attendance_monthly AM \
                                            inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                                            where AM.record_status='A' and AM.`year`= ? and AM.`month`=?",
                                                  values: [year, month_number]
                                                })
                                                .then(attDataResult => {
                                                  if (req.mySQl == null) {
                                                    _mysql.commitTransaction(
                                                      () => {
                                                        _mysql.releaseConnection();
                                                        req.records = attDataResult;
                                                        next();
                                                      }
                                                    );
                                                  } else {
                                                    resolve(attDataResult);
                                                  }
                                                })
                                                .catch(error => {
                                                  reject(error);
                                                  _mysql.rollBackTransaction(
                                                    () => {
                                                      next(error);
                                                    }
                                                  );
                                                });
                                            }
                                          })
                                          .catch(error => {
                                            reject(error);
                                            _mysql.rollBackTransaction(() => {
                                              next(error);
                                            });
                                          });
                                      })
                                      .catch(error => {
                                        reject(error);
                                        _mysql.rollBackTransaction(() => {
                                          next(error);
                                        });
                                      });
                                  } else {
                                    empResult[i]["defaults"].unpaid_leave = 0;
                                    empResult[i]["defaults"].total_leaves =
                                      empResult[i]["defaults"].paid_leave +
                                      empResult[i]["defaults"].unpaid_leave;

                                    empResult[i]["defaults"].present_days =
                                      empResult[i]["defaults"].total_work_days -
                                      empResult[i]["defaults"].emp_absent_days -
                                      empResult[i]["defaults"].total_leaves -
                                      empResult[i]["defaults"].total_week_off -
                                      empResult[i]["defaults"]
                                        .emp_total_holidays;

                                    empResult[i]["defaults"].paid_days =
                                      parseFloat(
                                        empResult[i]["defaults"].present_days
                                      ) +
                                      parseFloat(
                                        empResult[i]["defaults"].paid_leave
                                      ) +
                                      parseFloat(
                                        empResult[i]["defaults"]
                                          .emp_total_holidays
                                      ) +
                                      parseFloat(
                                        empResult[i]["defaults"].total_week_off
                                      );

                                    _mysql
                                      .executeQuery({
                                        query:
                                          "INSERT INTO `hims_f_attendance_monthly` (employee_id,year,month,hospital_id,sub_department_id,total_days,present_days,absent_days,\
                              total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,unpaid_leave,total_paid_days,created_date,created_by,updated_date,updated_by)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE total_days=?,present_days=?,absent_days=?,\
                              total_work_days=?,total_weekoff_days=?,total_holidays=?,total_leave=?,paid_leave=?,unpaid_leave=?,total_paid_days=?,updated_date=?,updated_by=? ",
                                        values: [
                                          empResult[i]["hims_d_employee_id"],
                                          year,
                                          month_number,
                                          empResult[i]["hospital_id"],
                                          empResult[i]["sub_department_id"],
                                          totalMonthDays,
                                          empResult[i]["defaults"].present_days,
                                          empResult[i]["defaults"]
                                            .emp_absent_days,
                                          empResult[i]["defaults"]
                                            .total_work_days,
                                          empResult[i]["defaults"]
                                            .total_week_off,
                                          empResult[i]["defaults"]
                                            .emp_total_holidays,
                                          empResult[i]["defaults"].total_leaves,
                                          empResult[i]["defaults"].paid_leave,
                                          empResult[i]["defaults"].unpaid_leave,
                                          empResult[i]["defaults"].paid_days,

                                          new Date(),
                                          req.userIdentity.algaeh_d_app_user_id,
                                          new Date(),

                                          req.userIdentity.algaeh_d_app_user_id,
                                          totalMonthDays,
                                          empResult[i]["defaults"].present_days,
                                          empResult[i]["defaults"]
                                            .emp_absent_days,
                                          empResult[i]["defaults"]
                                            .total_work_days,
                                          empResult[i]["defaults"]
                                            .total_week_off,
                                          empResult[i]["defaults"]
                                            .emp_total_holidays,
                                          empResult[i]["defaults"].total_leaves,
                                          empResult[i]["defaults"].paid_leave,
                                          empResult[i]["defaults"].unpaid_leave,
                                          empResult[i]["defaults"].paid_days,
                                          new Date(),
                                          req.userIdentity.algaeh_d_app_user_id
                                        ],
                                        printQuery: true
                                      })
                                      .then(finalFesult => {
                                        if (i == empResult.length - 1) {
                                          _mysql
                                            .executeQuery({
                                              query:
                                                "select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                                      year,month,AM.hospital_id,AM.sub_department_id,\
                                      total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                                      total_leave,paid_leave,unpaid_leave,total_paid_days,ot_work_hours,ot_weekoff_hours,ot_holiday_hours,shortage_hours  from hims_f_attendance_monthly AM \
                                      inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                                      where AM.record_status='A' and AM.`year`= ? and AM.`month`=?",
                                              values: [year, month_number]
                                            })
                                            .then(attDataResult => {
                                              if (req.mySQl == null) {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = attDataResult;
                                                  next();
                                                });
                                              } else {
                                                resolve(attDataResult);
                                              }

                                              // _mysql.commitTransaction(() => {
                                              //   _mysql.releaseConnection();
                                              //   req.records = attDataResult;

                                              //   next();
                                              // });
                                            })
                                            .catch(error => {
                                              reject(error);
                                              _mysql.rollBackTransaction(() => {
                                                next(error);
                                              });
                                            });
                                        }
                                      })
                                      .catch(error => {
                                        reject(error);
                                        _mysql.rollBackTransaction(() => {
                                          next(error);
                                        });
                                      });
                                  }
                                })
                                .catch(error => {
                                  reject(error);
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                  });
                                });
                            })
                            .catch(error => {
                              reject(error);
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        }
                      } catch (error) {
                        reject(error);
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      }
                    })
                    .catch(error => {
                      reject(error);
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                } else {
                  if (req.mySQl == null) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {
                        no_data: true,
                        message: "No Employees found"
                      };
                      next();
                    });
                  } else {
                    resolve("No Employee found");
                  }
                }
              })
              .catch(error => {
                reject(error);
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      } catch (e) {
        reject(e);
        next(e);
      }
    }).catch(e => {
      next(e);
    });
  },

  //created by irfan: to mark absent
  markAbsent: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_absent` (employee_id,absent_date,from_session,to_session, absent_duration,\
            absent_reason,created_date, created_by, updated_date, updated_by)\
            VALUE(?,date(?),?,?,?,?,?,?,?,?)",
        values: [
          input.employee_id,
          input.absent_date,
          input.from_session,
          input.to_session,
          input.absent_duration,
          input.absent_reason,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id
        ]
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
  },
  //created by irfan:
  cancelAbsent: (req, res, next) => {
    let input = req.body;

    if (input.hims_f_absent_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_absent SET cancel='Y',cancel_by=?,cancel_date=?,cancel_reason=?,\
          updated_date=?, updated_by=?  WHERE hims_f_absent_id = ?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            input.cancel_reason,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_absent_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid absent id"
            };
            next();
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
  },
  //created by irfan:
  getAllAbsentEmployee: (req, res, next) => {
    let input = req.query;

    if (input.yearAndMonth != undefined && input.yearAndMonth != "null") {
      const _mysql = new algaehMysql();
      const startOfMonth = moment(new Date(input.yearAndMonth))
        .startOf("month")
        .format("YYYY-MM-DD");

      const endOfMonth = moment(new Date(input.yearAndMonth))
        .endOf("month")
        .format("YYYY-MM-DD");

      _mysql
        .executeQuery({
          query:
            "select  hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
          absent_reason, cancel ,absent_duration,cancel_reason,E.employee_code,E.full_name as employee_name\
          from hims_f_absent A,hims_d_employee E where A.record_status='A'\
          and date(absent_date) between date(?) and date(?) and A.employee_id=E.hims_d_employee_id order by hims_f_absent_id desc",

          values: [startOfMonth, endOfMonth]
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
    } else {
      _mysql.releaseConnection();
      req.records = {
        invalid_input: true,
        message: "Please provide valid year and month"
      };

      next();
      return;
    }
  },

  //created by irfan:
  addAttendanceRegularizationBAKUP_04_march: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
      .generateRunningNumber({
        modules: ["ATTENDANCE_REGULARIZE"]
      })
      .then(numGenReg => {
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_attendance_regularize` (regularization_code,employee_id,attendance_date,\
            login_date,logout_date,\
            punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason,\
            created_by,created_date,updated_by,updated_date)\
            VALUE(?,?,date(?),date(?),date(?),?,?,?,?,?,?,?,?,?)",
            values: [
              numGenReg[0],
              input.employee_id,
              input.attendance_date,
              input.login_date,
              input.logout_date,
              input.punch_in_time,
              input.punch_out_time,
              input.regularize_in_time,
              input.regularize_out_time,
              input.regularization_reason,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ]
          })
          .then(result => {
            if (req.mySQl == null) {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = attDataResult;
                next();
              });
            } else {
              resolve(attDataResult);
            }

            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = result;
            //   next();
            // });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //created by irfan:
  addAttendanceRegularization: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    _mysql
          .executeQueryWithTransaction({
            query:
              "INSERT INTO `hims_f_attendance_regularize` (employee_id,attendance_date,regularize_status,\
            login_date,logout_date,\
            punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason,\
            created_by,created_date,updated_by,updated_date)\
            VALUE(?,date(?),date(?),date(?),?,?,?,?,?,?,?,?,?)",
            values: [
              
              input.employee_id,
              input.attendance_date,
              input.regularize_status,
              input.login_date,
              input.logout_date,
              input.punch_in_time,
              input.punch_out_time,
              input.regularize_in_time,
              input.regularize_out_time,
              input.regularization_reason,
              req.userIdentity.algaeh_d_app_user_id,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id,
              new Date()
            ]
          })
          .then(result => {

            if(input.absent_id>0){

              _mysql
              .executeQuery({
                query:
                  "update hims_f_absent  set status='CPR' where hims_f_absent_id=?;",
                values: [input.absent_id
                ]       
          
              })
              .then(result2 => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = result2;
                  next();
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });





            }else{
        
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });
           

            }

            // _mysql.commitTransaction(() => {
            //   _mysql.releaseConnection();
            //   req.records = result;
            //   next();
            // });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(e);
            });
          });
  },

  //created by irfan:
  regularizeAttendance: (req, res, next) => {
    let input = req.body;
    const utilities = new algaehUtilities();
    utilities.logger().log("regularizeAttendance: ");
    if (input.regularize_status == "REJ" || input.regularize_status == "APR"||input.regularize_status == "PEN" ) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQueryWithTransaction({
          query:
            "UPDATE hims_f_attendance_regularize SET regularize_status = ?,\
             updated_date=?, updated_by=?  WHERE hims_f_attendance_regularize_id = ?",
          values: [
            input.regularize_status,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_f_attendance_regularize_id
          ]
        })
        .then(result => {
          if (result.affectedRows > 0) {
            
            if (input.regularize_status == "APR") {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_daily_time_sheet` SET status='PR', in_time=?,\
                  `out_time`=?,`hours`=?,`minutes`=?,`worked_hours`=? \
                  where employee_id=? and attendance_date=?;",
                  values: [
                    input.in_time,
                    input.out_time,
                    input.hours,
                    input.minutes,
                    input.worked_hours,
                    input.employee_id,
                    input.attendance_date
                  ],
                  printQuery: true
                })
                .then(result2 => {                 
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result2;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });
            } else {



              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              });


              
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Please provide valid input"
            };
            next();
          }
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input"
      };

      next();
      return;
    }
  },

  //created by irfan:
  getEmployeeAttendReg: (req, res, next) => {
    let dateRange = "";
    let employee = "";
    if (
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.from_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null &&
      req.query.to_date != "null"
    ) {
      dateRange = ` date(attendance_date)
        between date('${req.query.from_date}') and date('${
        req.query.to_date
      }') `;
    }

    if (
      req.query.employee_id != "" &&
      req.query.employee_id != null &&
      req.query.employee_id != "null"
    ) {
      employee = ` employee_id=${req.query.employee_id} `;
    }

    if (dateRange == "" && employee == "") {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input"
      };
      next();
      return;
    } else {
      const _mysql = new algaehMysql();

      let stringData= " regularize_status <>'NFD' ";

      if(req.query.type=="auth"){

        stringData="regularize_status='PEN' ";

      }

      _mysql
        .executeQuery({
          query:
            "select hims_f_attendance_regularize_id,regularization_code,employee_id,\
          E.employee_code,E.full_name as employee_name ,attendance_date,\
          regularize_status,login_date,logout_date,punch_in_time,punch_out_time,\
          regularize_in_time,regularize_out_time,regularization_reason , AR.created_date\
          from hims_f_attendance_regularize   AR inner join hims_d_employee E  on\
           AR.employee_id=E.hims_d_employee_id and record_status='A' where "+stringData+" and " +
            employee +
            "" +
            dateRange +
            " order by\
          hims_f_attendance_regularize_id desc ;",
         
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
    }
  },

  //created by irfan:
  processAttendance: (req, res, next) => {
    const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
    return new Promise((resolve, reject) => {
      try {
        const utilities = new algaehUtilities();

        // const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
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
          year,
          month_number,
          endOfMonth,
          startOfMonth,
          endOfMonth
        ];

        //ST---------delete old records
        let department = "";
        let hospital = "";
        let employee_ = "";
        let selectData = "";
        if (selectWhere.hospital_id != null) {
          hospital = " and hospital_id=" + selectWhere.hospital_id;
          selectData += " and AM.hospital_id=" + selectWhere.hospital_id;
        }
        if (selectWhere.sub_department_id != null) {
          department =
            " and sub_department_id=" + selectWhere.sub_department_id;
          selectData +=
            " and AM.sub_department_id=" + selectWhere.sub_department_id;
        }
        if (selectWhere.hims_d_employee_id != null) {
          selectData += " and AM.employee_id=" + selectWhere.hims_d_employee_id;
        }

        let deleteString = "";

        //EN---------delete old records

        //ST---pending unpaid leaves
        let pendingYear = "";
        let pendingMonth = "";

        if (month_number == 1) {
          pendingYear = year - 1;
          pendingMonth = 12;
        } else {
          pendingYear = year;
          pendingMonth = month_number - 1;
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
        if (selectWhere.hospital_id > 0) {
          new Promise((resolve, reject) => {
            // select hims_d_employee_id, employee_code,full_name  as employee_name,
            // employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,
            // exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on
            // E.hims_d_employee_id=A.employee_id
            //   and  A.year='2019' and A.month='3' and A.cancelled='N' left join hims_f_employee_yearly_leave YL on
            //   E.hims_d_employee_id=YL.employee_id and  YL.year='2019'
            //   where employee_status <>'I' and (( date(date_of_joining) <= date('2019-03-31') and date(exit_date) >= date('2019-03-01'))
            //   or(date(date_of_joining) <= date('2019-03-31') and exit_date is null)) and
            //   E.record_status='A' and E.hospital_id='1' and E.sub_department_id='38'  and hims_f_employee_annual_leave_id is null ;

            utilities.logger().log("strQuery Data ");

            let strQuery = "";
            if (
              req.query.leave_salary == null ||
              req.query.leave_salary == undefined
            ) {
              strQuery =
                "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,date_of_resignation ,religion_id,E.sub_department_id,hospital_id,\
            exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
            and  A.year=? and A.month=? and A.cancelled='N' left join hims_f_employee_yearly_leave YL on E.hims_d_employee_id=YL.employee_id and  YL.year=?\
            left join hims_f_salary S on E.hims_d_employee_id=S.employee_id and S.year= ? and S.month=?\
            where employee_status <>'I' and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
            (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'" +
                _stringData +
                " and hims_f_employee_annual_leave_id is null and (S.salary_processed is null or  S.salary_processed='N');";
            } else {
              strQuery =
                "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,date_of_resignation ,religion_id,E.sub_department_id,hospital_id,\
            exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
            and  A.year=? and A.month=? and A.cancelled='N' left join hims_f_employee_yearly_leave YL on E.hims_d_employee_id=YL.employee_id and  YL.year=?\
            left join hims_f_salary S on E.hims_d_employee_id=S.employee_id and S.year= ? and S.month=?\
            where employee_status <>'I' and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
            (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'" +
                _stringData +
                " and  (S.salary_processed is null or  S.salary_processed='N');";
            }
            utilities.logger().log("strQuery ", strQuery);
            try {
              _mysql
                .executeQuery({
                  query:
                    strQuery +
                    "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
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
                  utilities.logger().log("Result[0]: ", result[0]);
                  allEmployees = result[0];
                  allHolidays = result[1];
                  allAbsents = result[2];
                  allMonthlyLeaves = result[3];
                  allPendingLeaves = result[4];

                  // utilities.logger().log("result: ", result);
                  utilities.logger().log("allEmployees my: ", allEmployees);
                  //  utilities.logger().log("allHolidays: ", allHolidays);
                  //  utilities.logger().log("allAbsents: ", allAbsents);
                  //  utilities.logger().log("allMonthlyLeaves: ", allMonthlyLeaves);
                  //  utilities.logger().log("allPendingLeaves: ", allPendingLeaves);

                  if (allEmployees.length > 0) {
                    employee_ = new LINQ(allEmployees)
                      .Select(s => s.hims_d_employee_id)
                      .ToArray();

                    utilities.logger().log("employee_", employee_);

                    deleteString = ` delete from hims_f_attendance_monthly  where employee_id>0 and year=${year} and
                    month=${month_number}  ${hospital} ${department}  and employee_id in (${employee_});`;

                    utilities.logger().log("deleteString", deleteString);

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
                        message: " Please proces yearly leave for ",
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
                          holiday_include: 0,
                          pending_leaves: 0
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
                              moment(
                                allEmployees[i]["exit_date"],
                                "YYYY-MM-DD"
                              ),
                              "days"
                            );
                        }
                        //EN--- checking date of joining  to calculate total_work_days

                        //ST---- adding employee absent days

                        allEmployees[i]["defaults"].emp_absent_days = new LINQ(
                          allAbsents
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Sum(s => s.absent_duration);

                        //EN---- adding employee absent days

                        //ST---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include,pending_leaves
                        allEmployees[i]["defaults"].paid_leave = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.leave_type == "P"
                          )
                          .Sum(s => s.present_month);

                        allEmployees[i]["defaults"].unpaid_leave = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.leave_type == "U"
                          )
                          .Sum(s => s.present_month);

                        allEmployees[i]["defaults"].week_off_include = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.include_weekoff == "Y"
                          )
                          .Sum(s => s.weekoff_days);

                        allEmployees[i]["defaults"].holiday_include = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.include_holiday == "Y"
                          )
                          .Sum(s => s.holidays);

                        allEmployees[i]["defaults"].total_leaves =
                          allEmployees[i]["defaults"].paid_leave +
                          allEmployees[i]["defaults"].unpaid_leave;

                        allEmployees[i]["defaults"].pending_leaves = new LINQ(
                          allPendingLeaves
                        )
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Sum(s => s.updaid_leave_duration);

                        //EN---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include,pending_leaves

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
                                    w.religion_id ==
                                      allEmployees[i]["religion_id"])) &&
                                w.holiday_date >
                                  allEmployees[i]["date_of_joining"]
                            )
                            .Count();

                          allEmployees[i]["defaults"].total_week_off = _.filter(
                            allHolidays,
                            obj => {
                              return (
                                obj.weekoff === "Y" &&
                                obj.holiday_type === "RE" &&
                                obj.holiday_date >
                                  allEmployees[i]["date_of_joining"]
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
                                    w.religion_id ==
                                      allEmployees[i]["religion_id"])) &&
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
                                    w.religion_id ==
                                      allEmployees[i]["religion_id"])) &&
                                (w.holiday_date >
                                  allEmployees[i]["date_of_joining"] &&
                                  w.holiday_date < allEmployees[i]["exit_date"])
                            )
                            .Count();

                          allEmployees[i]["defaults"].total_week_off = _.filter(
                            allHolidays,
                            obj => {
                              return (
                                obj.weekoff === "Y" &&
                                obj.holiday_type === "RE" &&
                                obj.holiday_date >
                                  allEmployees[i]["date_of_joining"] &&
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
                                  w.religion_id ==
                                    allEmployees[i]["religion_id"])
                            )
                            .Count();

                          allEmployees[i]["defaults"].total_week_off = _.filter(
                            allHolidays,
                            obj => {
                              return (
                                obj.weekoff === "Y" && obj.holiday_type === "RE"
                              );
                            }
                          ).length;
                        }

                        //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

                        //ST---- reduce include holidays and weekoff

                        utilities
                          .logger()
                          .log(
                            "total_week_off: befor",
                            allEmployees[i]["defaults"].total_week_off
                          );

                        allEmployees[i]["defaults"].total_holidays -=
                          allEmployees[i]["defaults"].holiday_include;
                        allEmployees[i]["defaults"].total_week_off -=
                          allEmployees[i]["defaults"].week_off_include;

                        utilities
                          .logger()
                          .log(
                            "total_week_off: afte",
                            allEmployees[i]["defaults"].total_week_off
                          );
                        //EN---- reduce include holidays and weekoff

                        allEmployees[i]["defaults"].present_days =
                          req.query.leave_salary == "Y"
                            ? 0
                            : allEmployees[i]["defaults"].total_work_days -
                              allEmployees[i]["defaults"].emp_absent_days -
                              allEmployees[i]["defaults"].total_leaves -
                              allEmployees[i]["defaults"].total_week_off -
                              allEmployees[i]["defaults"].total_holidays;

                        allEmployees[i]["defaults"].paid_days =
                          parseFloat(allEmployees[i]["defaults"].present_days) +
                          parseFloat(allEmployees[i]["defaults"].paid_leave) +
                          parseFloat(
                            allEmployees[i]["defaults"].total_holidays
                          ) +
                          parseFloat(
                            allEmployees[i]["defaults"].total_week_off
                          ) -
                          parseFloat(
                            allEmployees[i]["defaults"].pending_leaves
                          );

                        attendanceArray.push({
                          employee_id: allEmployees[i]["hims_d_employee_id"],
                          year: year,
                          month: month_number,
                          hospital_id: allEmployees[i]["hospital_id"],
                          sub_department_id:
                            allEmployees[i]["sub_department_id"],
                          total_days: totalMonthDays,
                          present_days:
                            allEmployees[i]["defaults"].present_days,
                          absent_days:
                            allEmployees[i]["defaults"].emp_absent_days,
                          total_work_days:
                            allEmployees[i]["defaults"].total_work_days,
                          total_weekoff_days:
                            allEmployees[i]["defaults"].total_week_off,
                          total_holidays:
                            allEmployees[i]["defaults"].total_holidays,
                          total_leave: allEmployees[i]["defaults"].total_leaves,
                          paid_leave: allEmployees[i]["defaults"].paid_leave,
                          unpaid_leave:
                            allEmployees[i]["defaults"].unpaid_leave,
                          total_paid_days:
                            allEmployees[i]["defaults"].paid_days,
                          pending_unpaid_leave:
                            allEmployees[i]["defaults"].pending_leaves,
                          created_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_date: new Date(),
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        });

                        if (i == allEmployees.length - 1) {
                          resolve(attendanceArray);
                        }
                      }
                      // resolve(attendanceArray);
                      //utilities.logger().log("allEmployees: ", allEmployees);
                    }
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
                  reject(e);
                });
            } catch (e) {
              reject(e);
            }
          }).then(attendanceResult => {
            utilities.logger().log("deleteString", deleteString);
            _mysql
              .executeQueryWithTransaction({
                query: deleteString
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
                    "pending_unpaid_leave",
                    "created_date",
                    "created_by",
                    "updated_date",
                    "updated_by"
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO hims_f_attendance_monthly(??) VALUES ?",
                      values: attendanceArray,
                      includeValues: insurtColumns,
                      bulkInsertOrUpdate: true
                    })
                    .then(finalResult => {
                      _mysql
                        .executeQueryWithTransaction({
                          query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                year,month,AM.hospital_id,AM.sub_department_id,\
                total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave,total_hours,total_working_hours,\
                shortage_hours,ot_work_hours,ot_weekoff_hours from hims_f_attendance_monthly AM \
                inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                where AM.record_status='A' and AM.year= ? and AM.month=? ${selectData} `,
                          values: [year, month_number]
                        })
                        .then(selectData => {
                          //utilities.logger().log("selectData: ", selectData);
                          if (req.mySQl == null) {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = selectData;
                              next();
                            });
                          } else {
                            resolve(selectData);
                          }
                        })
                        .catch(e => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.rollBackTransaction(() => {
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
                utilities.logger().log("e", e);
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          });
        } else {
          if (req.mySQl == null) {
            req.records = {
              invalid_input: true,
              message: "Please select a branch"
            };
            next();
          } else {
            resolve("Please select a branch");
          }
        }
      } catch (e) {
        _mysql.releaseConnection();
        next(e);
        reject(e);
      }
    }).catch(e => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  getEmployeeToManualTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    const utilities = new algaehUtilities();

    utilities.logger().log("getEmployeeToManualTimeSheet: ");

    try {
      const input = req.query;

      utilities
        .logger()
        .log("manual_timesheet_entry: ", input.manual_timesheet_entry);

      if (input.manual_timesheet_entry == "D") {
        _mysql
          .executeQuery({
            query:
              "SELECT TS.hims_f_daily_time_sheet_id,TS.attendance_date,TS.employee_id,TS.in_time,TS.out_time,TS.worked_hours,E.employee_code,\
              E.full_name FROM hims_f_daily_time_sheet TS, hims_d_employee E where \
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
        _mysql
          .executeQuery({
            query:
              "SELECT TS.hims_f_daily_time_sheet_id,TS.attendance_date,TS.employee_id,TS.in_time,TS.out_time,TS.worked_hours,E.employee_code,E.full_name FROM \
              algaeh_hims_db.hims_f_daily_time_sheet TS, algaeh_hims_db.hims_d_employee E, hims_f_project_roster PR where \
              TS.employee_id=E.hims_d_employee_id and PR.employee_id = TS.employee_id and\
              TS.attendance_date=? and E.hospital_id=? and PR.project_id=?;",
            values: [input.attendance_date, input.branch_id, input.project_id],
            printQuery: true
          })
          .then(time_sheet => {
            if (time_sheet.length > 0) {
              _mysql.releaseConnection();
              req.records = { result: time_sheet, dataExist: true };
              next();
            } else {
              let _strDate = "";
              let intValues = [input.branch_id];
              let strQuery = "";
              if (input.attendance_date != null) {
                _strDate += "and attendance_date=?";
                intValues.push(input.attendance_date);
              }

              if (input.project_id != null) {
                _strDate += "and project_id=?";
                intValues.push(input.project_id);
              }

              strQuery = {
                query:
                  "select PR.employee_id, E.employee_code,E.full_name,PR.attendance_date from hims_f_project_roster PR , \
                hims_d_employee E where E.hims_d_employee_id=PR.employee_id and E.hospital_id=? " +
                  _strDate,
                values: intValues,
                printQuery: true
              };

              _mysql
                .executeQuery(strQuery)
                .then(result => {
                  _mysql.releaseConnection();
                  req.records = { result, dataExist: false };
                  next();
                })
                .catch(e => {
                  next(e);
                });
            }
          })
          .catch(e => {
            next(e);
          });
      }
    } catch (e) {
      next(e);
    }
  },

  addToDailyTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      const input = req.body;
      utilities.logger().log("input: ", input);

      _mysql
        .executeQuery({
          query: "select standard_working_hours from hims_d_hrms_options",
          printQuery: true
        })
        .then(result => {
          utilities
            .logger()
            .log(
              "standard_working_hours: ",
              result[0]["standard_working_hours"]
            );
          const IncludeValues = [
            "employee_id",
            "attendance_date",
            "in_time",
            "out_date",
            "out_time",
            "hours",
            "minutes",
            "worked_hours"
          ];

          _mysql
            .executeQuery({
              query: "INSERT INTO hims_f_daily_time_sheet(??) VALUES ?",
              values: input,
              includeValues: IncludeValues,
              extraValues: {
                actual_hours: result[0]["standard_working_hours"]
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
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },
  updateToDailyTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      const input = req.body;
      utilities.logger().log("input: ", input);

      let qry = "";

      for (let i = 0; i < input.length; i++) {
        qry += mysql.format(
          "UPDATE `hims_f_daily_time_sheet` SET status='PR', in_time=?,\
        `out_time`=?,`hours`=?,`minutes`=?,`worked_hours`=? where hims_f_daily_time_sheet_id=?;",
          [
            input[i].in_time,
            input[i].out_time,
            input[i].hours,
            input[i].minutes,
            input[i].worked_hours,
            input[i].hims_f_daily_time_sheet_id
          ]
        );
      }

      _mysql
        .executeQuery({
          query: qry
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },
  getDailyTimeSheetBAckup23FEb: (req, res, next) => {
    const _mysql = new algaehMysql();

    const utilities = new algaehUtilities();

    let options = [];
    let allHolidays = [];
    let AllLeaves = [];
    let AllEmployees = [];
    let biometric_ids = [];

    utilities.logger().log("yearAndMonth: ", "yearAndMonth");

    let input = req.query;
    try {
      if (
        input.from_date != null &&
        input.to_date != null &&
        input.hospital_id > 0
      ) {
        let attendcResult = [];
        let actual_hours = "";
        let biometricData = [];
        let singleEmployee = "N";

        let from_date = moment(input.from_date).format("YYYY-MM-DD");
        let to_date = moment(input.to_date).format("YYYY-MM-DD");

        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and hims_d_employee_id=" + input.hims_d_employee_id;
        }

        _mysql
          .executeQuery({
            query:
              "SELECT * FROM hims_d_hrms_options;\
                select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
                religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
                select hims_f_leave_application_id,leave_application_code,employee_id,application_date,sub_department_id,\
                    leave_id,from_leave_session,from_date,to_date,to_leave_session,status,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                    where `status`='APR'  and LA.leave_id=L.hims_d_leave_id  AND ((from_date>= ? and from_date <= ?) or\
                    (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)); \
                    select hims_d_employee_id,biometric_id,date_of_joining,exit_date,sub_department_id,religion_id from hims_d_employee where record_status='A'\
                    and employee_status='A'and biometric_id is not null and hospital_id=? and hims_d_employee_id>491 and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or\
                    (date(date_of_joining) <= date(?) and exit_date is null))" +
              stringData,
            values: [
              from_date,
              to_date,
              input.hospital_id,
              from_date,
              to_date,
              from_date,
              to_date,
              from_date,
              to_date,
              input.hospital_id,
              to_date,
              from_date,
              to_date
            ],
            printQuery: true
          })
          .then(result => {
            options = result[0];
            allHolidays = result[1];
            AllLeaves = result[2];
            AllEmployees = result[3];

            utilities.logger().log("options: ", options);
            utilities.logger().log("allHolidays: ", allHolidays);
            utilities.logger().log("AllLeaves: ", AllLeaves);
            utilities.logger().log("AllEmployees: ", AllEmployees);

            if (
              AllEmployees.length > 0 &&
              options.length > 0 &&
              options[0]["biometric_database"] == "SQL"
            ) {
              actual_hours = options[0]["standard_working_hours"];

              var sql = require("mssql");

              // config for your database
              var config = {
                user: options[0]["biometric_database_login"],
                password: options[0]["biometric_database_password"],
                server: options[0]["biometric_server_name"],
                port: options[0]["biometric_port_no"],
                database: options[0]["biometric_database_name"]
              };

              biometric_ids = new LINQ(AllEmployees)
                .Select(s => s.biometric_id)
                .ToArray();

              let employee_ids = new LINQ(AllEmployees)
                .Select(s => s.hims_d_employee_id)
                .ToArray();

              let returnQry = `  select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
                in_time, out_date, out_time, year, month, status,\
                 posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
                 expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
                 from  hims_f_daily_time_sheet TS \
                inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                where attendance_date between ('${from_date}') and ('${to_date}') and employee_id in (${employee_ids})`;

              utilities.logger().log("biometric_ids : ", biometric_ids);
              //---------------------------------------------------
              // connect to your database
              sql.close();
              sql.connect(config, function(err) {
                if (err) {
                  utilities
                    .logger()
                    .log("connection eror: ", "connection eror");
                  next(err);
                }
                // create Request object
                var request = new sql.Request();

                // let biometric_id =
                //   req.query.biometric_id > 0 ? req.query.biometric_id : [106];
                // let bio_ids = "";

                // if (req.query.biometric_id > 0) {
                //   bio_ids = ` and TS.biometric_id=${req.query.biometric_id} `;
                // }

                utilities.logger().log("from_date ", from_date);
                utilities.logger().log("to_date ", to_date);
                // query to the biometric database and get the records

                // select  TOP (100) UserID as biometric_id ,PDate as attendance_date,Punch1 as in_time,Punch2 as out_time,\
                // Punch2 as out_date   from Mx_DATDTrn  where UserID in (${biometric_id}) and PDate>='${from_date}'  and\
                // PDate<='${to_date}'
                const _query = `;WITH CTE AS(
                    SELECT
                        UserID,
                        DateTime,
                        AccessDate = CAST(DateTime AS DATE),
                        AccessTime = CAST(DateTime AS TIME),       
                        InOut,
                        In_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) ASC),
                        Out_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) DESC)
                    FROM [FTDP].[dbo].[Transaction] where cast(DateTime  as date)between 
                    '${from_date}' and '${to_date}' and UserId in (${biometric_ids})
                  )
                  SELECT
                    UserID,  
                    [Date] = CONVERT(VARCHAR(10), AccessDate, 101),
                    InTime= ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END)), 1, 5), null),
                    OutTime = ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)), 1, 5), null),
                    Duration =  ISNULL(RIGHT('00' +             
                                CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                    MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                    MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                )/60), 2) + '.' +
                                RIGHT('00' +CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                    MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                    MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                )%60), 2)
                            ,0.0)
                  FROM CTE
                  GROUP BY UserID, AccessDate
                  ORDER BY  AccessDate `;
                console.log("MSSSQL Query : ", _query);
                request.query(
                  _query,

                  function(err, attResult) {
                    if (err) {
                      utilities.logger().log("qry error ", err);
                      next(err);
                    }

                    utilities.logger().log("attResult", attResult["recordset"]);
                    attendcResult = attResult["recordset"];
                    sql.close();

                    if (attendcResult.length > 0 && from_date == to_date) {
                      for (let i = 0; i < AllEmployees.length; i++) {
                        biometricData.push(
                          new LINQ(attendcResult)
                            .Where(
                              w => w.UserID == AllEmployees[i]["biometric_id"]
                            )
                            .Select(s => {
                              return {
                                biometric_id: s.UserID,
                                attendance_date: moment(
                                  s.Date,
                                  "MM-DD-YYYY"
                                ).format("YYYY-MM-DD"),
                                out_date: moment(s.Date, "MM-DD-YYYY").format(
                                  "YYYY-MM-DD"
                                ),
                                in_time: s.InTime,
                                out_time: s.OutTime,
                                worked_hours: s.Duration,
                                employee_id:
                                  AllEmployees[i]["hims_d_employee_id"],
                                religion_id: AllEmployees[i]["religion_id"],
                                date_of_joining:
                                  AllEmployees[i]["date_of_joining"],
                                exit_date: AllEmployees[i]["exit_date"],
                                actual_hours: actual_hours,
                                hours: s.Duration.split(".")[0],
                                minutes: s.Duration.split(".")[1]
                              };
                            })
                            .FirstOrDefault({
                              biometric_id: null,
                              attendance_date: from_date,
                              out_date: from_date,
                              in_time: null,
                              out_time: null,
                              worked_hours: 0,
                              employee_id:
                                AllEmployees[i]["hims_d_employee_id"],
                              religion_id: AllEmployees[i]["religion_id"],
                              date_of_joining:
                                AllEmployees[i]["date_of_joining"],
                              exit_date: AllEmployees[i]["exit_date"],
                              actual_hours: actual_hours,
                              hours: 0,
                              minutes: 0
                            })
                        );
                      }
                      utilities.logger().log("biometricData", biometricData);

                      insertTimeSheet(
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
                      );
                    } else if (
                      input.hims_d_employee_id > 0 &&
                      attendcResult.length > 0 &&
                      from_date < to_date
                    ) {
                      singleEmployee = "Y";

                      utilities.logger().log("date_range:", "date_range");

                      let date_range = getDays(
                        new Date(from_date),
                        new Date(to_date)
                      );
                      utilities.logger().log("date_range:", date_range);

                      for (let i = 0; i < date_range.length; i++) {
                        utilities.logger().log("i ", date_range[i]);

                        biometricData.push(
                          new LINQ(attendcResult)
                            .Where(
                              w =>
                                moment(w.Date, "MM-DD-YYYY").format(
                                  "YYYY-MM-DD"
                                ) == date_range[i]
                            )
                            .Select(s => {
                              return {
                                biometric_id: s.UserID,
                                attendance_date: date_range[i],
                                out_date: date_range[i],
                                in_time: s.InTime,
                                out_time: s.OutTime,
                                worked_hours: s.Duration,
                                employee_id:
                                  AllEmployees[0]["hims_d_employee_id"],
                                religion_id: AllEmployees[0]["religion_id"],
                                date_of_joining:
                                  AllEmployees[0]["date_of_joining"],
                                exit_date: AllEmployees[0]["exit_date"],
                                actual_hours: actual_hours,
                                hours: s.Duration.split(".")[0],
                                minutes: s.Duration.split(".")[1]
                              };
                            })
                            .FirstOrDefault({
                              biometric_id: null,
                              attendance_date: date_range[i],
                              out_date: null,
                              in_time: null,
                              out_time: null,
                              worked_hours: 0,
                              employee_id:
                                AllEmployees[0]["hims_d_employee_id"],
                              religion_id: AllEmployees[0]["religion_id"],
                              date_of_joining:
                                AllEmployees[0]["date_of_joining"],
                              exit_date: AllEmployees[0]["exit_date"],
                              actual_hours: actual_hours,
                              hours: 0,
                              minutes: 0
                            })
                        );
                      }
                      utilities
                        .logger()
                        .log("biometricData single emp", biometricData);
                      insertTimeSheet(
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
                      );
                    } else {
                      req.records = {
                        invalid_data: true,
                        message: "Biometric Data Not Available"
                      };
                      _mysql.releaseConnection();

                      next();
                    }
                  }
                );
              });
              //---------------------------------------------------
            } else {
              //no matchimg data
              req.records = {
                invalid_data: true,
                message: "biometric database or Employees not found "
              };
              _mysql.releaseConnection();

              next();
            }
          })
          .catch(e => {
            utilities.logger().log("error: ", e);
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  getDailyTimeSheetbukp28_feb: (req, res, next) => {
    const _mysql = new algaehMysql();

    const utilities = new algaehUtilities();

    let options = [];
    let allHolidays = [];
    let AllLeaves = [];
    let AllEmployees = [];
    let AllShifts = [];
    let biometric_ids = [];

    let input = req.query;
    try {
      if (
        input.from_date != null &&
        input.to_date != null &&
        input.hospital_id > 0
      ) {
        let attendcResult = [];
        let actual_hours = "";
        let biometricData = [];
        let singleEmployee = "N";
        let shiftRange = "";
        let totalTime = "";
        let _lastDayInPreMonth = null;
        let to_date_plus_one = moment(input.to_date)
          .add(1, "days")
          .format("YYYY-MM-DD");
        let from_date = moment(input.from_date).format("YYYY-MM-DD");
        let to_date = moment(input.to_date).format("YYYY-MM-DD");

        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
          shiftRange += ` and sub_department_id=${
            req.query.sub_department_id
          } `;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and hims_d_employee_id=" + input.hims_d_employee_id;
          shiftRange += ` and employee_id=${req.query.hims_d_employee_id} `;
        }
        _mysql
          .executeQuery({
            query: "SELECT * FROM hims_d_hrms_options;"
          })
          .then(hrms_options => {
            options = hrms_options;
            if (input.attendance_type == "MW") {
              if (
                options[0]["salary_pay_before_end_date"] == "Y" &&
                options[0]["payroll_payment_date"] != null
              ) {
                const _endDate =
                  moment(input.from_date)
                    .clone()
                    .format("YYYY-MM-") + options[0]["payroll_payment_date"];
                const _prevDays = options[0]["payroll_payment_date"] + 1;
                const _prevMonthYear = moment(input.from_date)
                  .clone()
                  .add(-1, "months");
                _lastDayInPreMonth = moment(_prevMonthYear).endOf("month");
                from_date =
                  moment(_prevMonthYear)
                    .clone()
                    .format("YYYY-MM") +
                  "-" +
                  _prevDays;
                to_date = _endDate;
              }
            }

            _mysql
              .executeQuery({
                query: ` select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
                religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
                select hims_f_leave_application_id,leave_application_code,employee_id,application_date,sub_department_id,\
                    leave_id,from_leave_session,from_date,to_date,to_leave_session,status,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                    where status='APR'  and LA.leave_id=L.hims_d_leave_id  AND ((from_date>= ? and from_date <= ?) or\
                    (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)); \
                    select hims_d_employee_id,biometric_id,date_of_joining,exit_date,sub_department_id,religion_id from hims_d_employee where record_status='A'\
                    and employee_status='A'and biometric_id is not null and hospital_id=? and hims_d_employee_id>491 and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or\
                    (date(date_of_joining) <= date(?) and exit_date is null)) ${stringData};\
                     select hims_f_shift_roster_id,employee_id,shift_date,shift_id,shift_end_date, weekoff,holiday,\
                    shift_start_time,shift_end_time,shift_time,\
                    shift_code,shift_description,arabic_name,shift_status,in_time1,out_time1,\
                    in_time2,out_time2,break,break_start,break_end,shift_abbreviation,shift_end_day\
                    from hims_f_shift_roster SR inner join hims_d_shift S\
                    on SR.shift_id=S.hims_d_shift_id and S.record_status='A'\
                    where date(shift_date) between date(?) and date(?) ${shiftRange}`,
                values: [
                  from_date,
                  to_date,
                  input.hospital_id,
                  from_date,
                  to_date,
                  from_date,
                  to_date,
                  from_date,
                  to_date,
                  input.hospital_id,
                  to_date,
                  from_date,
                  to_date,
                  from_date,
                  to_date
                ]
              })
              .then(result => {
                allHolidays = result[0];
                AllLeaves = result[1];
                AllEmployees = result[2];
                AllShifts = result[3];

                // utilities.logger().log("options: ", options);
                // utilities.logger().log("allHolidays: ", allHolidays);
                // utilities.logger().log("AllLeaves: ", AllLeaves);
                // utilities.logger().log("AllEmployees: ", AllEmployees);
                // utilities.logger().log("AllShifts: ", AllShifts);

                if (
                  AllEmployees.length > 0 &&
                  options.length > 0 &&
                  options[0]["biometric_database"] == "SQL"
                ) {
                  actual_hours = options[0]["standard_working_hours"];

                  var sql = require("mssql");

                  // config for your database
                  var config = {
                    user: options[0]["biometric_database_login"],
                    password: options[0]["biometric_database_password"],
                    server: options[0]["biometric_server_name"],
                    database: options[0]["biometric_database_name"]
                  };

                  biometric_ids = new LINQ(AllEmployees)
                    .Select(s => s.biometric_id)
                    .ToArray();

                  let employee_ids = new LINQ(AllEmployees)
                    .Select(s => s.hims_d_employee_id)
                    .ToArray();

                  let returnQry = `  select hims_f_daily_time_sheet_id, employee_id,TS.biometric_id, attendance_date, \
                in_time, out_date, out_time, year, month, status,\
                 posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
                 expected_out_date, expected_out_time ,hims_d_employee_id,employee_code,full_name as employee_name\
                 from  hims_f_daily_time_sheet TS \
                inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                where attendance_date between ('${from_date}') and ('${to_date}') and employee_id in (${employee_ids})`;

                  utilities.logger().log("biometric_ids : ", biometric_ids);
                  //---------------------------------------------------
                  // connect to your database
                  sql.close();
                  sql.connect(config, function(err) {
                    if (err) {
                      utilities
                        .logger()
                        .log("connection eror: ", "connection eror");
                      next(err);
                    }
                    // create Request object
                    var request = new sql.Request();

                    // let biometric_id =
                    //   req.query.biometric_id > 0 ? req.query.biometric_id : [106];
                    // let bio_ids = "";

                    // if (req.query.biometric_id > 0) {
                    //   bio_ids = ` and TS.biometric_id=${req.query.biometric_id} `;
                    // }

                    utilities.logger().log("from_date ", from_date);
                    utilities.logger().log("to_date ", to_date);
                    // query to the biometric database and get the records

                    // select  TOP (100) UserID as biometric_id ,PDate as attendance_date,Punch1 as in_time,Punch2 as out_time,\
                    // Punch2 as out_date   from Mx_DATDTrn  where UserID in (${biometric_id}) and PDate>='${from_date}'  and\
                    // PDate<='${to_date}'

                    request.query(
                      `;WITH CTE AS(
                      SELECT
                          UserID,
                          DateTime,
                          AccessDate = CAST(DateTime AS DATE),
                          AccessTime = CAST(DateTime AS TIME),       
                          InOut,
                          In_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) ASC),
                          Out_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) DESC)
                      FROM [FTDP].[dbo].[Transaction] where cast(DateTime  as date)between 
                      '${from_date}' and '${to_date_plus_one}' and UserId in (${biometric_ids})
                    )
                    SELECT
                      UserID,  
                      [Date] = CONVERT(VARCHAR(10), AccessDate, 101),
                      InTime= ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END)), 1, 5), null),
                      OutTime = ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)), 1, 5), null),
                      Duration =  ISNULL(RIGHT('00' +             
                                  CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                      MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                      MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                  )/60), 2) + '.' +
                                  RIGHT('00' +CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                      MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                      MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                  )%60), 2)
                              ,0.0)
                    FROM CTE
                    GROUP BY UserID, AccessDate
                    ORDER BY  AccessDate `,

                      function(err, attResult) {
                        sql.close();
                        if (err) {
                          _mysql.releaseConnection();
                          next(err);
                          return;
                        }

                        // utilities
                        //   .logger()
                        //   .log("attResult", attResult["recordset"]);
                        attendcResult = attResult["recordset"];

                        if (attendcResult.length > 0 && from_date == to_date) {
                          for (let i = 0; i < AllEmployees.length; i++) {
                            let shiftData = new LINQ(AllShifts)
                              .Where(
                                w =>
                                  w.employee_id ==
                                    AllEmployees[i]["hims_d_employee_id"] &&
                                  w.shift_date == from_date
                              )
                              .Select(s => {
                                return {
                                  shift_end_day: s.shift_end_day,
                                  shift_date: s.shift_date,
                                  shift_end_date: s.shift_end_date
                                };
                              })
                              .FirstOrDefault({
                                shift_end_day: null,
                                shift_date: null,
                                shift_end_date: null
                              });

                            // utilities.logger().log("shiftData", shiftData);

                            //---------------------------------begin logic

                            if (shiftData.shift_end_day == "ND") {
                              //--ST--punchin
                              let punchIn = new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_date
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    attendance_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    in_time: s.InTime
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  attendance_date: shiftData.shift_date,
                                  in_time: null
                                });

                              // utilities.logger().log("punchIn", punchIn);
                              //--EN--punchin

                              //--ST--punchout
                              let punchOut = new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_end_date
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    out_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    out_time: s.OutTime
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  out_date: shiftData.shift_end_date,
                                  out_time: null
                                });

                              // utilities.logger().log("punchOut", punchOut);
                              //--EN--punchout
                              if (
                                punchIn.in_time != null &&
                                punchOut.out_time != null
                              ) {
                                let inDateTime = moment(
                                  punchIn.attendance_date +
                                    " " +
                                    punchIn.in_time,
                                  "YYYY-MM-DD HH:mm"
                                );
                                let outDateTime = moment(
                                  punchOut.out_date + " " + punchOut.out_time,
                                  "YYYY-MM-DD HH:mm"
                                );
                                totalTime =
                                  outDateTime.diff(inDateTime, "hours") +
                                  ":" +
                                  (outDateTime.diff(inDateTime, "minute") % 60);
                              } else {
                                //exception
                              }
                            } else {
                              biometricData.push(
                                new LINQ(attendcResult)
                                  .Where(
                                    w =>
                                      w.UserID ==
                                      AllEmployees[i]["biometric_id"]
                                  )
                                  .Select(s => {
                                    return {
                                      biometric_id: s.UserID,
                                      attendance_date: moment(
                                        s.Date,
                                        "MM-DD-YYYY"
                                      ).format("YYYY-MM-DD"),
                                      out_date: moment(
                                        s.Date,
                                        "MM-DD-YYYY"
                                      ).format("YYYY-MM-DD"),
                                      in_time: s.InTime,
                                      out_time: s.OutTime,
                                      worked_hours: s.Duration,
                                      employee_id:
                                        AllEmployees[i]["hims_d_employee_id"],
                                      religion_id:
                                        AllEmployees[i]["religion_id"],
                                      date_of_joining:
                                        AllEmployees[i]["date_of_joining"],
                                      exit_date: AllEmployees[i]["exit_date"],
                                      actual_hours: actual_hours,
                                      hours: s.Duration.split(".")[0],
                                      minutes: s.Duration.split(".")[1]
                                    };
                                  })
                                  .FirstOrDefault({
                                    biometric_id: null,
                                    attendance_date: from_date,
                                    out_date: from_date,
                                    in_time: null,
                                    out_time: null,
                                    worked_hours: 0,
                                    employee_id:
                                      AllEmployees[i]["hims_d_employee_id"],
                                    religion_id: AllEmployees[i]["religion_id"],
                                    date_of_joining:
                                      AllEmployees[i]["date_of_joining"],
                                    exit_date: AllEmployees[i]["exit_date"],
                                    actual_hours: actual_hours,
                                    hours: 0,
                                    minutes: 0
                                  })
                              );
                            }
                          }

                          ///----end logic
                          // utilities
                          //   .logger()
                          //   .log("biometricData", biometricData);

                          insertTimeSheet(
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
                          );
                        } else if (
                          input.hims_d_employee_id > 0 &&
                          attendcResult.length > 0 &&
                          from_date < to_date
                        ) {
                          singleEmployee = "Y";

                          // utilities.logger().log("date_range:", "date_range");

                          let date_range = getDays(
                            new Date(from_date),
                            new Date(to_date)
                          );
                          // utilities.logger().log("date_range:", date_range);

                          for (let i = 0; i < date_range.length; i++) {
                            utilities.logger().log("i ", date_range[i]);

                            biometricData.push(
                              new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == date_range[i]
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    attendance_date: date_range[i],
                                    out_date: date_range[i],
                                    in_time: s.InTime,
                                    out_time: s.OutTime,
                                    worked_hours: s.Duration,
                                    employee_id:
                                      AllEmployees[0]["hims_d_employee_id"],
                                    religion_id: AllEmployees[0]["religion_id"],
                                    date_of_joining:
                                      AllEmployees[0]["date_of_joining"],
                                    exit_date: AllEmployees[0]["exit_date"],
                                    actual_hours: actual_hours,
                                    hours: s.Duration.split(".")[0],
                                    minutes: s.Duration.split(".")[1]
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  attendance_date: date_range[i],
                                  out_date: null,
                                  in_time: null,
                                  out_time: null,
                                  worked_hours: 0,
                                  employee_id:
                                    AllEmployees[0]["hims_d_employee_id"],
                                  religion_id: AllEmployees[0]["religion_id"],
                                  date_of_joining:
                                    AllEmployees[0]["date_of_joining"],
                                  exit_date: AllEmployees[0]["exit_date"],
                                  actual_hours: actual_hours,
                                  hours: 0,
                                  minutes: 0
                                })
                            );
                          }
                          // utilities
                          //   .logger()
                          //   .log("biometricData single emp", biometricData);
                          insertTimeSheet(
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
                          );
                        } else {
                          req.records = {
                            invalid_data: true,
                            message: "no punches exist"
                          };
                          _mysql.releaseConnection();

                          next();
                        }
                      }
                    );
                  });
                  //---------------------------------------------------
                } else {
                  //no matchimg data
                  req.records = {
                    invalid_data: true,
                    message: "biometric database or Employees not found "
                  };
                  _mysql.releaseConnection();

                  next();
                }
              })
              .catch(e => {
                // utilities.logger().log("error: ", e);
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  getDailyTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    const utilities = new algaehUtilities();

    let options = [];
    let allHolidays = [];
    let AllLeaves = [];
    let AllEmployees = [];
    let AllShifts = [];
    let biometric_ids = [];

    let input = req.query;
    try {
      if (
        input.from_date != null &&
        input.to_date != null &&
        input.hospital_id > 0
      ) {
        let attendcResult = [];
        let standard_hours = 0;
        let standard_mins = 0;
        let biometricData = [];
        let singleEmployee = "N";
        let shiftRange = "";
        let totalTime = "";
        let _lastDayInPreMonth = null;
        let to_date_plus_one = moment(input.to_date)
          .add(1, "days")
          .format("YYYY-MM-DD");
        let from_date = moment(input.from_date).format("YYYY-MM-DD");
        let to_date = moment(input.to_date).format("YYYY-MM-DD");

        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
          shiftRange += ` and sub_department_id=${
            req.query.sub_department_id
          } `;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and hims_d_employee_id=" + input.hims_d_employee_id;
          shiftRange += ` and employee_id=${req.query.hims_d_employee_id} `;
          singleEmployee = "Y";
        }
        _mysql
          .executeQuery({
            query: "SELECT * FROM hims_d_hrms_options;"
          })
          .then(hrms_options => {
            options = hrms_options;
            if (input.attendance_type == "MW") {
              if (
                options[0]["salary_pay_before_end_date"] == "Y" &&
                options[0]["payroll_payment_date"] != null
              ) {
                const _endDate =
                  moment(input.from_date)
                    .clone()
                    .format("YYYY-MM-") + options[0]["payroll_payment_date"];
                const _prevDays = options[0]["payroll_payment_date"] + 1;
                const _prevMonthYear = moment(input.from_date)
                  .clone()
                  .add(-1, "months");
                _lastDayInPreMonth = moment(_prevMonthYear).endOf("month");
                from_date =
                  moment(_prevMonthYear)
                    .clone()
                    .format("YYYY-MM") +
                  "-" +
                  _prevDays;
                to_date = _endDate;
              }
            }

            _mysql
              .executeQuery({
                query: ` select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
                religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
                select hims_f_leave_application_id,leave_application_code,employee_id,application_date,sub_department_id,\
                    leave_id,from_leave_session,from_date,to_date,to_leave_session,status,L.leave_type from hims_f_leave_application LA,hims_d_leave L \
                    where status='APR'  and LA.leave_id=L.hims_d_leave_id  AND ((from_date>= ? and from_date <= ?) or\
                    (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)); \
                    select hims_d_employee_id,biometric_id,date_of_joining,exit_date,sub_department_id,religion_id,hospital_id from hims_d_employee where record_status='A'\
                    and employee_status='A'and biometric_id is not null and hospital_id=? and hims_d_employee_id>491 and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or\
                    (date(date_of_joining) <= date(?) and exit_date is null)) ${stringData};\
                     select hims_f_shift_roster_id,employee_id,shift_date,shift_id,shift_end_date, weekoff,holiday,\
                    shift_start_time,shift_end_time,shift_time,\
                    shift_code,shift_description,arabic_name,shift_status,in_time1,out_time1,\
                    in_time2,out_time2,break,break_start,break_end,shift_abbreviation,shift_end_day\
                    from hims_f_shift_roster SR inner join hims_d_shift S\
                    on SR.shift_id=S.hims_d_shift_id and S.record_status='A'\
                    where date(shift_date) between date(?) and date(?) ${shiftRange}`,
                values: [
                  from_date,
                  to_date,
                  input.hospital_id,
                  from_date,
                  to_date,
                  from_date,
                  to_date,
                  from_date,
                  to_date,
                  input.hospital_id,
                  to_date,
                  from_date,
                  to_date,
                  from_date,
                  to_date
                ],
                printQuery: true
              })
              .then(result => {
                allHolidays = result[0];
                AllLeaves = result[1];
                AllEmployees = result[2];
                AllShifts = result[3];

                // utilities.logger().log("options: ", options);
                // utilities.logger().log("allHolidays: ", allHolidays);
                // utilities.logger().log("AllLeaves: ", AllLeaves);
                // utilities.logger().log("AllEmployees: ", AllEmployees);
                // utilities.logger().log("AllShifts: ", AllShifts);

                if (
                  AllEmployees.length > 0 &&
                  options.length > 0 &&
                  options[0]["biometric_database"] == "SQL"
                ) {
                  standard_hours = options[0]["standard_working_hours"]
                    .toString()
                    .split(".")[0];
                  standard_mins = options[0]["standard_working_hours"]
                    .toString()
                    .split(".")[1];

                  var sql = require("mssql");

                  // config for your database
                  var config = {
                    user: options[0]["biometric_database_login"],
                    password: options[0]["biometric_database_password"],
                    server: options[0]["biometric_server_name"],
                    database: options[0]["biometric_database_name"]
                  };

                  biometric_ids = new LINQ(AllEmployees)
                    .Select(s => s.biometric_id)
                    .ToArray();

                  let employee_ids = new LINQ(AllEmployees)
                    .Select(s => s.hims_d_employee_id)
                    .ToArray();

                  let returnQry = `  select hims_f_daily_time_sheet_id,TS.sub_department_id, employee_id,TS.biometric_id, attendance_date, \
                in_time, out_date, out_time, year, month, status,\
                 posted, hours, minutes, actual_hours, actual_minutes, worked_hours,\
                 expected_out_date, expected_out_time ,TS.hospital_id,hims_d_employee_id,employee_code,full_name as employee_name\
                 from  hims_f_daily_time_sheet TS \
                inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                where attendance_date between ('${from_date}') and ('${to_date}') and employee_id in (${employee_ids})`;

                  //---------------------------------------------------
                  // connect to your database
                  sql.close();
                  sql.connect(config, function(err) {
                    if (err) {
                      utilities
                        .logger()
                        .log("connection eror: ", "connection eror");
                      next(err);
                    }
                    // create Request object
                    var request = new sql.Request();

                    utilities.logger().log("from_date ", from_date);
                    utilities.logger().log("to_date ", to_date);
                    // query to the biometric database and get the records

                    // select  TOP (100) UserID as biometric_id ,PDate as attendance_date,Punch1 as in_time,Punch2 as out_time,\
                    // Punch2 as out_date   from Mx_DATDTrn  where UserID in (${biometric_id}) and PDate>='${from_date}'  and\
                    // PDate<='${to_date}'

                    request.query(
                      `;WITH CTE AS(
                      SELECT
                          UserID,
                          DateTime,
                          AccessDate = CAST(DateTime AS DATE),
                          AccessTime = CAST(DateTime AS TIME),       
                          InOut,
                          In_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) ASC),
                          Out_RN = ROW_NUMBER() OVER(PARTITION BY UserID, CAST(DateTime AS DATE), InOut ORDER BY CAST(DateTime AS TIME) DESC)
                      FROM [FTDP].[dbo].[Transaction] where cast(DateTime  as date)between 
                      '${from_date}' and '${to_date_plus_one}' and UserId in (${biometric_ids})
                    )
                    SELECT
                      UserID,  
                      [Date] = CONVERT(VARCHAR(10), AccessDate, 101),
                      InTime= ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END)), 1, 5), null),
                      OutTime = ISNULL(SUBSTRING(CONVERT(VARCHAR(20), MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)), 1, 5), null),
                      Duration =  ISNULL(RIGHT('00' +             
                                  CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                      MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                      MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                  )/60), 2) + '.' +
                                  RIGHT('00' +CONVERT(VARCHAR(2), DATEDIFF(MINUTE, 
                                      MAX(CASE WHEN InOut = 0 AND In_RN = 1 THEN AccessTime END), 
                                      MAX(CASE WHEN InOut = 1 AND OUT_RN = 1 THEN AccessTime END)
                                  )%60), 2)
                              ,0.0)
                    FROM CTE
                    GROUP BY UserID, AccessDate
                    ORDER BY  AccessDate `,

                      function(err, attResult) {
                        sql.close();
                        if (err) {
                          _mysql.releaseConnection();
                          next(err);
                          return;
                        }

                        // utilities
                        //   .logger()
                        //   .log("attResult", attResult["recordset"]);
                        attendcResult = attResult["recordset"];

                        if (attendcResult.length > 0 && from_date == to_date) {
                          for (let i = 0; i < AllEmployees.length; i++) {
                            let shiftData = new LINQ(AllShifts)
                              .Where(
                                w =>
                                  w.employee_id ==
                                    AllEmployees[i]["hims_d_employee_id"] &&
                                  w.shift_date == from_date
                              )
                              .Select(s => {
                                return {
                                  shift_end_day: s.shift_end_day,
                                  shift_date: s.shift_date,
                                  shift_end_date: s.shift_end_date,
                                  shift_time: s.shift_time,
                                  shift_end_time: s.shift_end_time
                                };
                              })
                              .FirstOrDefault({
                                shift_end_day: null,
                                shift_date: null,
                                shift_end_date: null,
                                shift_time: 0.0,
                                shift_end_time: 0
                              });

                            let actual_hours = 0;
                            let actual_mins = 0;
                            if (shiftData["shift_time"] > 0) {
                              actual_hours = shiftData.shift_time
                                .toString()
                                .split(".")[0];
                              actual_mins = shiftData.shift_time
                                .toString()
                                .split(".")[1];
                            } else {
                              actual_hours = standard_hours;
                              actual_mins = standard_mins;
                            }

                            utilities
                              .logger()
                              .log("actual_hours", actual_hours);

                            //---------------------------------begin logic

                            if (shiftData.shift_end_day == "ND") {
                              //--ST--punchin
                              let punchIn = new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_date
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    attendance_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    in_time: s.InTime
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  attendance_date: shiftData.shift_date,
                                  in_time: null
                                });

                              // utilities.logger().log("punchIn", punchIn);
                              //--EN--punchin

                              //--ST--punchout
                              let punchOut = new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_end_date
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    out_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    out_time: s.OutTime
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  out_date: shiftData.shift_end_date,
                                  out_time: null
                                });

                              // utilities.logger().log("punchOut", punchOut);
                              //--EN--punchout
                              if (
                                punchIn.in_time != null &&
                                punchOut.out_time != null
                              ) {
                                let inDateTime = moment(
                                  punchIn.attendance_date +
                                    " " +
                                    punchIn.in_time,
                                  "YYYY-MM-DD HH:mm"
                                );
                                let outDateTime = moment(
                                  punchOut.out_date + " " + punchOut.out_time,
                                  "YYYY-MM-DD HH:mm"
                                );
                                totalTime =
                                  outDateTime.diff(inDateTime, "hours") +
                                  "." +
                                  (outDateTime.diff(inDateTime, "minute") % 60);

                                biometricData.push({
                                  biometric_id: punchIn.biometric_id,
                                  attendance_date: punchIn.attendance_date,
                                  out_date: punchOut.out_date,
                                  in_time: punchIn.in_time,
                                  out_time: punchOut.out_time,
                                  worked_hours: totalTime,
                                  employee_id:
                                    AllEmployees[i]["hims_d_employee_id"],
                                  sub_department_id:
                                    AllEmployees[i]["sub_department_id"],
                                  religion_id: AllEmployees[i]["religion_id"],
                                  date_of_joining:
                                    AllEmployees[i]["date_of_joining"],
                                  exit_date: AllEmployees[i]["exit_date"],
                                  actual_hours: actual_hours,
                                  actual_minutes: actual_mins,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[i]["hospital_id"],
                                  hours: outDateTime.diff(inDateTime, "hours"),
                                  minutes:
                                    outDateTime.diff(inDateTime, "minute") % 60,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M")
                                });
                              } else {
                                //exception
                                utilities
                                  .logger()
                                  .log("excption", "am in excption");
                                biometricData.push({
                                  biometric_id: punchIn.biometric_id,
                                  attendance_date: punchIn.attendance_date,
                                  out_date: punchOut.out_date,
                                  in_time: punchIn.in_time,
                                  out_time: punchOut.out_time,
                                  worked_hours: 0,
                                  employee_id:
                                    AllEmployees[i]["hims_d_employee_id"],
                                  sub_department_id:
                                    AllEmployees[i]["sub_department_id"],
                                  religion_id: AllEmployees[i]["religion_id"],
                                  date_of_joining:
                                    AllEmployees[i]["date_of_joining"],
                                  exit_date: AllEmployees[i]["exit_date"],
                                  actual_hours: actual_hours,
                                  actual_minutes: actual_mins,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[i]["hospital_id"],
                                  hours: 0,
                                  minutes: 0,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M")
                                });
                              }
                            } else {
                              utilities.logger().log("same day", "same day");
                              biometricData.push(
                                new LINQ(attendcResult)
                                  .Where(
                                    w =>
                                      w.UserID ==
                                      AllEmployees[i]["biometric_id"]
                                  )
                                  .Select(s => {
                                    return {
                                      biometric_id: s.UserID,
                                      attendance_date: moment(
                                        s.Date,
                                        "MM-DD-YYYY"
                                      ).format("YYYY-MM-DD"),
                                      out_date: moment(
                                        s.Date,
                                        "MM-DD-YYYY"
                                      ).format("YYYY-MM-DD"),
                                      in_time: s.InTime,
                                      out_time: s.OutTime,
                                      worked_hours: s.Duration,
                                      employee_id:
                                        AllEmployees[i]["hims_d_employee_id"],
                                      sub_department_id:
                                        AllEmployees[i]["sub_department_id"],
                                      religion_id:
                                        AllEmployees[i]["religion_id"],
                                      date_of_joining:
                                        AllEmployees[i]["date_of_joining"],
                                      exit_date: AllEmployees[i]["exit_date"],
                                      actual_hours: actual_hours,
                                      actual_minutes: actual_mins,
                                      expected_out_date:
                                        shiftData.shift_end_date,
                                      expected_out_time:
                                        shiftData.shift_end_time,
                                      hospital_id:
                                        AllEmployees[i]["hospital_id"],
                                      hours: s.Duration.split(".")[0],
                                      minutes: s.Duration.split(".")[1],
                                      year: moment(date_range[i]).format(
                                        "YYYY"
                                      ),
                                      month: moment(date_range[i]).format("M")
                                    };
                                  })
                                  .FirstOrDefault({
                                    biometric_id: null,
                                    attendance_date: from_date,
                                    out_date: from_date,
                                    in_time: null,
                                    out_time: null,
                                    worked_hours: 0,
                                    employee_id:
                                      AllEmployees[i]["hims_d_employee_id"],
                                    sub_department_id:
                                      AllEmployees[i]["sub_department_id"],
                                    religion_id: AllEmployees[i]["religion_id"],
                                    date_of_joining:
                                      AllEmployees[i]["date_of_joining"],
                                    exit_date: AllEmployees[i]["exit_date"],
                                    actual_hours: actual_hours,
                                    actual_minutes: actual_mins,
                                    expected_out_date: shiftData.shift_end_date,
                                    expected_out_time: shiftData.shift_end_time,
                                    hospital_id: AllEmployees[i]["hospital_id"],
                                    hours: 0,
                                    minutes: 0,
                                    year: moment(date_range[i]).format("YYYY"),
                                    month: moment(date_range[i]).format("M")
                                  })
                              );
                            }
                          }

                          ///----end logic
                          // utilities
                          //   .logger()
                          //   .log("biometricData", biometricData);

                          insertTimeSheet(
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
                          );
                        } else if (
                          input.hims_d_employee_id > 0 &&
                          attendcResult.length > 0 &&
                          from_date < to_date
                        ) {
                          singleEmployee = "Y";

                          // utilities.logger().log("date_range:", "date_range");


                          let fr_date=from_date;
                          if(AllEmployees[0]["date_of_joining"]>from_date){
                            fr_date=AllEmployees[0]["date_of_joining"];

                          }

                          let date_range = getDays(
                            new Date(fr_date),
                            new Date(to_date)
                          );
                          // utilities.logger().log("date_range:", date_range);

                          for (let i = 0; i < date_range.length; i++) {
                            let shiftData = new LINQ(AllShifts)
                              .Where(
                                w =>
                                  w.employee_id ==
                                    AllEmployees[0]["hims_d_employee_id"] &&
                                  w.shift_date == from_date
                              )
                              .Select(s => {
                                return {
                                  shift_end_day: s.shift_end_day,
                                  shift_date: s.shift_date,
                                  shift_end_date: s.shift_end_date,
                                  shift_time: s.shift_time,
                                  shift_end_time: s.shift_end_time
                                };
                              })
                              .FirstOrDefault({
                                shift_end_day: null,
                                shift_date: null,
                                shift_end_date: null,
                                shift_time: 0,
                                shift_end_time: 0
                              });

                            let actual_hours = 0;
                            let actual_mins = 0;

                            if (shiftData["shift_time"] > 0) {
                              actual_hours = shiftData.shift_time
                                .toString()
                                .split(".")[0];
                              actual_mins = shiftData.shift_time
                                .toString()
                                .split(".")[1];
                            } else {
                              actual_hours = standard_hours;
                              actual_mins = standard_mins;
                            }

                            utilities.logger().log("i ", date_range[i]);

                            biometricData.push(
                              new LINQ(attendcResult)
                                .Where(
                                  w =>
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == date_range[i]
                                )
                                .Select(s => {
                                  return {
                                    biometric_id: s.UserID,
                                    attendance_date: date_range[i],
                                    out_date: date_range[i],
                                    in_time: s.InTime,
                                    out_time: s.OutTime,
                                    worked_hours: s.Duration,
                                    employee_id:
                                      AllEmployees[0]["hims_d_employee_id"],
                                    sub_department_id:
                                      AllEmployees[0]["sub_department_id"],
                                    religion_id: AllEmployees[0]["religion_id"],
                                    date_of_joining:
                                      AllEmployees[0]["date_of_joining"],
                                    exit_date: AllEmployees[0]["exit_date"],
                                    actual_hours: actual_hours,
                                    actual_minutes: actual_mins,
                                    expected_out_date: shiftData.shift_end_date,
                                    expected_out_time: shiftData.shift_end_time,
                                    hospital_id: AllEmployees[0]["hospital_id"],
                                    hours: s.Duration.split(".")[0],
                                    minutes: s.Duration.split(".")[1],
                                    year: moment(date_range[i]).format("YYYY"),
                                    month: moment(date_range[i]).format("M")
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  attendance_date: date_range[i],
                                  out_date: null,
                                  in_time: null,
                                  out_time: null,
                                  worked_hours: 0,
                                  employee_id:
                                    AllEmployees[0]["hims_d_employee_id"],
                                  sub_department_id:
                                    AllEmployees[0]["sub_department_id"],
                                  religion_id: AllEmployees[0]["religion_id"],
                                  date_of_joining:
                                    AllEmployees[0]["date_of_joining"],
                                  exit_date: AllEmployees[0]["exit_date"],
                                  actual_hours: actual_hours,
                                  actual_minutes: actual_mins,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[0]["hospital_id"],
                                  hours: 0,
                                  minutes: 0,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M")
                                })
                            );
                          }
                          // utilities
                          //   .logger()
                          //   .log("biometricData single emp", biometricData);
                          insertTimeSheet(
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
                          );
                        } else {
                          req.records = {
                            invalid_data: true,
                            message: "no punches exist"
                          };
                          _mysql.releaseConnection();

                          next();
                        }
                      }
                    );
                  });
                  //---------------------------------------------------
                } else {
                  //no matchimg data
                  req.records = {
                    invalid_data: true,
                    message: "biometric database or Employees not found "
                  };
                  _mysql.releaseConnection();

                  next();
                }
              })
              .catch(e => {
                // utilities.logger().log("error: ", e);
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch(error => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  processBiometricAttendanceBkp27feb: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      const input = req.query;
      utilities.logger().log("input: ", input);

      if (
        input.from_date != null &&
        input.to_date != null &&
        input.hospital_id > 0
      ) {
        let month = moment(input.from_date).format("M");
        let year = moment(input.from_date).format("YYYY");

        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and employee_id=" + input.hims_d_employee_id;
        }
        let insertArray = [];

        _mysql
          .executeQuery({
            query:
              " select employee_id,hospital_id,sub_department_id,year,month,sum(total_days)as total_days,sum(present_days)as present_days,sum(absent_days)as absent_days,\
            sum(total_work_days)as total_work_days,sum(weekoff_days)as total_weekoff_days,sum(holidays)as total_holidays,\
            sum(paid_leave)as paid_leave,sum(unpaid_leave)as unpaid_leave,sum(hours)as hours,sum(minutes)as minutes,\
            COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) as total_hours,\
            sum(working_hours)as total_working_hours  from hims_f_daily_attendance where\
             year=? and month=? and hospital_id=? " +
              stringData +
              " group by employee_id",
            values: [year, month, input.hospital_id],
            printQuery: true
          })
          .then(result => {
            utilities.logger().log("result: ", result);

            for (let i = 0; i < result.length; i++) {
              insertArray.push({
                ...result[i],
                total_paid_days:
                  result[i]["present_days"] +
                  result[i]["paid_leave"] +
                  result[i]["total_weekoff_days"] +
                  result[i]["total_holidays"],
                total_leave:
                  result[i]["paid_leave"] + result[i]["unpaid_leave"],
                total_hours: result[i]["total_hours"],
                total_working_hours: result[i]["total_working_hours"],
                shortage_hours:
                  parseInt(result[i]["total_working_hours"]) -
                    parseInt(result[i]["total_hours"]) >
                  0
                    ? parseInt(result[i]["total_working_hours"]) -
                      parseInt(result[i]["total_hours"])
                    : 0,
                ot_work_hours:
                  parseInt(result[i]["total_hours"]) -
                    parseInt(result[i]["total_working_hours"]) >
                  0
                    ? parseInt(result[i]["total_hours"]) -
                      parseInt(result[i]["total_working_hours"])
                    : 0
              });
            }

            utilities.logger().log("insertArray: ", insertArray);

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
              "ot_work_hours"
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
                ,ot_work_hours=values(ot_work_hours)",
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
                next(e);
              });
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  processBiometricAttendance: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      const input = req.query;
      utilities.logger().log("input: ", input);

      if (
        input.from_date != null &&
        input.to_date != null &&
        input.hospital_id > 0
      ) {
        let month = moment(input.from_date).format("M");
        let year = moment(input.from_date).format("YYYY");

        let from_date = moment(input.from_date).format("YYYY-MM-DD");
        let to_date = moment(input.to_date).format("YYYY-MM-DD");
        let next_dayOf_cutoff = null;
        let endOfMonth = moment(input.to_date).format("YYYY-MM-DD");
        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and employee_id=" + input.hims_d_employee_id;
        }

        //ST---pending unpaid leaves
        let pendingYear = "";
        let pendingMonth = "";

        if (month == 1) {
          pendingYear = year - 1;
          pendingMonth = 12;
        } else {
          pendingYear = year;
          pendingMonth = month - 1;
        }
        //EN---pending unpaid leaves
        let attResult = [];
        let allPendingLeaves = [];
        let insertArray = [];

        _mysql
          .executeQuery({
            query: "SELECT * FROM hims_d_hrms_options;"
          })
          .then(options => {
            //let options = hrms_options;

            utilities.logger().log("options: ", options);
            if (input.attendance_type == "MW") {
              if (
                options[0]["salary_pay_before_end_date"] == "Y" &&
                options[0]["payroll_payment_date"] != null
              ) {
                let cut_off_date =
                  moment(input.to_date)
                    .clone()
                    .format("YYYY-MM-") + options[0]["payroll_payment_date"];

                next_dayOf_cutoff =
                  moment(input.to_date)
                    .clone()
                    .format("YYYY-MM-") +
                  options[0]["payroll_payment_date"] +
                  1;

                to_date = cut_off_date;
              }
            }

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
              from hims_f_daily_attendance where     \
              hospital_id=?  and year=? and month=?   " +
                  stringData +
                  " and attendance_date between date(?) and\
              date(?) group by employee_id; select hims_f_pending_leave_id,PL.employee_id,year,month,leave_application_id,adjusted,\
              adjusted_year,adjusted_month,updaid_leave_duration,status from hims_f_pending_leave PL \
              inner join hims_f_leave_application LA on  PL.leave_application_id=LA.hims_f_leave_application_id\
                where LA.status='APR' and  year=? and month=?",
                values: [
                  input.hospital_id,
                  year,
                  month,
                  from_date,
                  to_date,
                  pendingYear,
                  pendingMonth
                ],
                printQuery: true
              })
              .then(results => {
                attResult = results[0];
                allPendingLeaves = results[1];
                utilities.logger().log("attResult: ", attResult);

                for (let i = 0; i < attResult.length; i++) {
                  let pending_leaves = new LINQ(allPendingLeaves)
                    .Where(w => w.employee_id == attResult[i]["employee_id"])
                    .Sum(s => s.updaid_leave_duration);

                  insertArray.push({
                    ...attResult[i],
                    total_paid_days:
                      attResult[i]["present_days"] +
                      attResult[i]["paid_leave"] +
                      attResult[i]["total_weekoff_days"] +
                      attResult[i]["total_holidays"],
                    total_leave:
                      attResult[i]["paid_leave"] + attResult[i]["unpaid_leave"],
                    total_hours: attResult[i]["total_hours"],
                    total_working_hours: attResult[i]["total_working_hours"],
                    shortage_hours:
                      parseInt(attResult[i]["total_working_hours"]) -
                        parseInt(attResult[i]["total_hours"]) >
                      0
                        ? parseInt(attResult[i]["total_working_hours"]) -
                          parseInt(attResult[i]["total_hours"])
                        : 0,
                    ot_work_hours:
                      parseInt(attResult[i]["total_hours"]) -
                        parseInt(attResult[i]["total_working_hours"]) >
                      0
                        ? parseInt(attResult[i]["total_hours"]) -
                          parseInt(attResult[i]["total_working_hours"])
                        : 0,
                    pending_unpaid_leave: pending_leaves
                  });
                }

                utilities.logger().log("insertArray: ", insertArray);

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
                  "pending_leaves"
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
                ,ot_work_hours=values(ot_work_hours),pending_leaves=values(pending_leaves)",
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
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date"
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  loadAttendance: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const month_number = moment(req.query.yearAndMonth).format("M");
      const year = moment(new Date(req.query.yearAndMonth)).format("YYYY");

      let selectWhere = {
        ...req.query
      };
      let selectData = "";
      if (selectWhere.hospital_id != null) {
        selectData += " and AM.hospital_id=" + selectWhere.hospital_id;
      }
      if (selectWhere.sub_department_id != null) {
        selectData +=
          " and AM.sub_department_id=" + selectWhere.sub_department_id;
      }
      if (selectWhere.hims_d_employee_id != null) {
        selectData += " and AM.employee_id=" + selectWhere.hims_d_employee_id;
      }

      _mysql
        .executeQuery({
          query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
          year,month,AM.hospital_id,AM.sub_department_id,\
          total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
          total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave,total_hours,total_working_hours,\
          shortage_hours,ot_work_hours,ot_weekoff_hours from hims_f_attendance_monthly AM \
          inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
          where AM.record_status='A' and AM.year= ? and AM.month=? ${selectData} `,
          values: [year, month_number],
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
    } catch (e) {
      next(e);
    }
  },
  //created by noor:
  notifyExceptionbkupMarch_01: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const input = req.body;
      let _values = [input.from_date, input.to_date];
      let _QueryDtl =
        "select employee_id,attendance_date,\
      'PEN' as regularize_status,attendance_date as login_date,\
      out_date as logout_date,in_time as punch_in_time,\
      out_time as punch_out_time from hims_f_daily_time_sheet where  \
       date(attendance_date)>=date(?) and date(out_date) <=date(?) and status='EX' or status='AB' ";

      if (input.hims_d_employee_id != null) {
        _QueryDtl += " and employee_id=?;";
        _values.push(input.hims_d_employee_id);
      } else {
        _QueryDtl += ";";
      }

      _mysql
        .executeQuery({
          query: _QueryDtl,
          values: _values,
          printQuery: true
        })
        .then(result => {
          if (result.length > 0) {
            let _query = "";

            for (let i = 0; i < result.length; i++) {
              _query += _mysql.mysqlQueryFormat(
                "insert into hims_f_attendance_regularize(`employee_id`,`attendance_date`,\
              `regularize_status`,`login_date`,`logout_date`,`punch_in_time`,`punch_out_time`,created_by, created_date, updated_by, updated_date)values(?,?,?,?,?,?,?,?,?,?,?)\
              ON DUPLICATE KEY UPDATE `punch_in_time`=?,`punch_out_time`=?;",
                [
                  result[i]["employee_id"],
                  result[i]["attendance_date"],
                  "NFD",
                  result[i]["login_date"],
                  result[i]["logout_date"],
                  result[i]["punch_in_time"],
                  result[i]["punch_out_time"],
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),

                  result[i]["punch_in_time"],
                  result[i]["punch_out_time"]
                ]
              );
            }

            _mysql
              .executeQuery({
                query: _query,
                printQuery: true
              })
              .then(attandance => {
                _mysql.releaseConnection();
                req.records = attandance;
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            req.records =
              "No exception records found for the date range '" +
              input.from_date +
              " - '" +
              input.to_date +
              "'";
            next();
          }
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by irfan:
  notifyException: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const input = req.body;

      let employee_id = "";

      if (input.hims_d_employee_id != null) {
        employee_id = " and employee_id=" + input.hims_d_employee_id;
      }

      _mysql
        .executeQuery({
          query: `select employee_id,attendance_date,attendance_date as login_date,\
            out_date as logout_date,in_time as punch_in_time,\
            out_time as punch_out_time,status from hims_f_daily_time_sheet where hospital_id=? and  \
             date(attendance_date)>=date(?) and date(out_date) <=date(?) \
             and (status='EX' or status='AB') ${employee_id};`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: true
        })
        .then(result => {
          if (result.length > 0) {
            let excptionArray = new LINQ(result)
              .Where(w => w.status == "EX")
              .Select(s => {
                return {
                  employee_id: s.employee_id,
                  attendance_date: s.attendance_date,
                  regularize_status: "NFD",
                  login_date: s.login_date,
                  logout_date: s.logout_date,
                  punch_in_time: s.punch_in_time,
                  punch_out_time: s.punch_out_time,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date()
                };
              })
              .ToArray();

            let absentArray = new LINQ(result)
              .Where(w => w.status == "AB")
              .Select(s => {
                return {
                  employee_id: s.employee_id,
                  absent_date: s.attendance_date,
                  from_session: "FD",
                  to_session: "FD",
                  status: "NFD",
                  absent_duration: 1,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date()
                };
              })
              .ToArray();

            utilities.logger().log("absentArray: ", absentArray);
            utilities.logger().log("excptionArray: ", excptionArray);

            new Promise((resolve, reject) => {
              try {
                if (excptionArray.length > 0) {
                  utilities.logger().log("am one: ", "am one");
                  const insurtColumns = [
                    "employee_id",
                    "attendance_date",
                    "regularize_status",
                    "login_date",
                    "logout_date",
                    "punch_in_time",
                    "punch_out_time",
                    "created_by",
                    "created_date",
                    "updated_by",
                    "updated_date"
                  ];
                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "insert into hims_f_attendance_regularize(??) values?\
                      ON DUPLICATE KEY UPDATE punch_in_time=values(punch_in_time),punch_out_time=values(punch_out_time)\
                      ,login_date=values(login_date),logout_date=values(logout_date)\
                      ,updated_by=values(updated_by),updated_date=values(updated_date);",

                      values: excptionArray,
                      includeValues: insurtColumns,
                      bulkInsertOrUpdate: true
                    })
                    .then(exptionResult => {
                      utilities.logger().log("exptionResult: ", exptionResult);
                      resolve(exptionResult);
                    })
                    .catch(e => {
                      utilities.logger().log("eroo22: ", e);
                      mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  resolve({});
                }
              } catch (e) {
                reject(e);
              }
            }).then(exptionResult => {
              if (absentArray.length > 0) {
                const insertColumns = [
                  "employee_id",
                  "absent_date",
                  "from_session",
                  "to_session",
                  "absent_duration",
                  "status",
                  "created_by",
                  "created_date",
                  "updated_by",
                  "updated_date"
                ];
                _mysql
                  .executeQueryWithTransaction({
                    query:
                      "insert into hims_f_absent(??) values?\
                      ON DUPLICATE KEY UPDATE from_session=values(from_session),to_session=values(to_session)\
                      ,absent_duration=values(absent_duration),status=values(status)\
                      ,updated_by=values(updated_by),updated_date=values(updated_date);",

                    values: absentArray,
                    includeValues: insertColumns,
                    bulkInsertOrUpdate: true
                  })
                  .then(result => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  })
                  .catch(e => {
                    utilities.logger().log("ero6: ", e);
                    mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = exptionResult;
                  next();
                });
              }
            });
          } else {
            _mysql.releaseConnection();
            req.records =
              "No exception records found for the date range '" +
              input.from_date +
              " - '" +
              input.to_date +
              "'";
            next();
            return;
          }
        })
        .catch(error => {
          utilities.logger().log("ero33: ", error);
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by irfan:
  postTimeSheet: (req, res, next) => {
    let input = req.query;
    const utilities = new algaehUtilities();

    let month = moment(input.from_date).format("M");
    let year = moment(input.from_date).format("YYYY");

    let from_date = moment(input.from_date).format("YYYY-MM-DD");
    let to_date = moment(input.to_date).format("YYYY-MM-DD");
    let stringData = "";
    let dailyAttendance = [];
    let fetchData = "";
    if (
      input.hospital_id > 0 &&
      (input.hims_d_employee_id > 0 || input.sub_department_id > 0)
    ) {
      if (input.hims_d_employee_id > 0) {
        stringData = "AND TS.employee_id=" + input.hims_d_employee_id;
        fetchData = "AND employee_id=" + input.hims_d_employee_id;
      }

      if (input.sub_department_id > 0) {
        stringData = "AND TS.sub_department_id=" + input.sub_department_id;
        fetchData = "AND sub_department_id=" + input.sub_department_id;
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

            if (excptions.length > 0) {
              req.records = {
                invalid_input: true,
                employees: excptions,
                message: "PLease Notify Exceptions to proceed"
              };
              next();
              return;
            } else {
              for (let i = 0; i < result.length; i++) {
                let shortage_time = 0;
                let shortage_min = 0;
                let ot_time = 0;
                let ot_min = 0;

                if (result[i]["status"] == "PR") {
                  let total_minutes =
                    parseInt(result[i]["actual_hours"] * 60) +
                    parseInt(result[i]["actual_minutes"]);
                  let worked_minutes =
                    parseInt(result[i]["hours"] * 60) +
                    parseInt(result[i]["minutes"]);

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
                }
                // utilities.logger().log("total_minutes: ", total_minutes);
                // utilities.logger().log("worked_minutes: ", worked_minutes);
                // utilities.logger().log("diff: ", diff);
                // utilities.logger().log("ot_time: ", ot_time);
                // utilities.logger().log("shortage_time: ", shortage_time);
                // utilities.logger().log("================: ");
                dailyAttendance.push({
                  employee_id: result[i]["employee_id"],
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
                    result[i]["actual_hours"] +
                    "." +
                    result[i]["actual_minutes"],
                  shortage_hours: shortage_time,
                  shortage_minutes: shortage_min,
                  ot_work_hours: ot_time,
                  ot_minutes: ot_min
                });
              }

              utilities.logger().log("dailyAttendance: ", dailyAttendance);

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
                  values: dailyAttendance,
                  bulkInsertOrUpdate: true
                })
                .then(finalResult => {
                  // _mysql.releaseConnection();

                  // req.records = finalResult;
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
                      hospital_id=?  and year=? and month=?  " +
                        fetchData +
                        " and attendance_date between date(?) and\
                      date(?)  group by employee_id;",
                      values: [
                        input.hospital_id,
                        year,
                        month,
                        from_date,
                        to_date
                      ],

                      printQuery: true
                    })
                    .then(attResult => {
                      let insertArray = [];
                      for (let i = 0; i < attResult.length; i++) {
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
                          shortage_hours: attResult[i]["shortage_hourss"]-attResult[i]["ot_hourss"]>=0?attResult[i]["shortage_hourss"]-attResult[i]["ot_hourss"]:0,
                          ot_work_hours: attResult[i]["ot_hourss"]-attResult[i]["shortage_hourss"]>=0?attResult[i]["ot_hourss"]-attResult[i]["shortage_hourss"]:0
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
                        "ot_work_hours"
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
                      ,ot_work_hours=values(ot_work_hours)",
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
                          utilities.logger().log("erro1: ", e);
                          _mysql.releaseConnection();
                          next(e);
                        });
                    })
                    .catch(e => {
                      utilities.logger().log("erro52: ", e);
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
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input"
      };

      next();
      return;
    }
  },

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
              utilities
                .logger()
                .log("lastMonth_end_date: ", lastMonth_end_date);

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

                    if (excptions.length > 0) {
                      req.records = {
                        invalid_input: true,
                        employees: excptions,
                        message: "PLease Notify Exceptions to proceed"
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
                          sub_department_id:
                            AttenResult[i]["sub_department_id"],
                          attendance_date: AttenResult[i]["attendance_date"],
                          year: moment(
                            AttenResult[i]["attendance_date"]
                          ).format("YYYY"),
                          month: moment(
                            AttenResult[i]["attendance_date"]
                          ).format("M"),
                          total_days: 1,
                          present_days:
                            AttenResult[i]["status"] == "PR" ? 1 : 0,
                          absent_days: AttenResult[i]["status"] == "AB" ? 1 : 0,
                          total_work_days:
                            AttenResult[i]["status"] == "PR" ? 1 : 0,
                          weekoff_days:
                            AttenResult[i]["status"] == "WO" ? 1 : 0,
                          holidays: AttenResult[i]["status"] == "HO" ? 1 : 0,
                          paid_leave: AttenResult[i]["status"] == "PL" ? 1 : 0,
                          unpaid_leave:
                            AttenResult[i]["status"] == "UL" ? 1 : 0,
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
                          sub_department_id:
                            RosterResult[j]["sub_department_id"],
                          attendance_date: RosterResult[j]["shift_date"],
                          year: moment(RosterResult[j]["shift_date"]).format(
                            "YYYY"
                          ),
                          month: moment(RosterResult[j]["shift_date"]).format(
                            "M"
                          ),
                          total_days: 1,
                          weekoff_days:
                            RosterResult[j]["weekoff"] == "Y" ? 1 : 0,
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
                            (parseFloat(RosterResult[j]["shift_time"]) % 1) *
                            100,
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
                            parseInt(
                              LastTenDaysResult[i]["actual_hours"] * 60
                            ) +
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

                      mergedArray = RosterAttendance.concat(dailyAttendance);

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
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum(s => s.shortage_hours);

                                let short_min = new LINQ(previousMonthData)
                                  .Where(
                                    w =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
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
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum(s => s.ot_work_hours);

                                let ot_min = new LINQ(previousMonthData)
                                  .Where(
                                    w =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
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
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum(s => s.updaid_leave_duration);

                                utilities
                                  .logger()
                                  .log("allPendingLeaves: ", allPendingLeaves);

                                utilities
                                  .logger()
                                  .log("pending_leaves: ", pending_leaves);

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
                                    shortage_hours: attResult[i]["shortage_hourss"]-attResult[i]["ot_hourss"]>=0?attResult[i]["shortage_hourss"]-attResult[i]["ot_hourss"]:0,
                                    ot_work_hours: attResult[i]["ot_hourss"]-attResult[i]["shortage_hourss"]>=0?attResult[i]["ot_hourss"]-attResult[i]["shortage_hourss"]:0,
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
  },
  getActivityFeed: (req, res, next) => {
    const _mysql = new algaehMysql();
   
    try {
   
      if (req.query.employee_id > 0) {
   
      _mysql
        .executeQuery({
          query: "select hims_f_attendance_regularize_id,regularization_code,employee_id,AR.updated_date,user_display_name as updated_by,attendance_date,regularize_status,login_date,\
          logout_date,punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason\
          from hims_f_attendance_regularize AR left  join algaeh_d_app_user U on AR.updated_by= U.algaeh_d_app_user_id \
          where  AR.employee_id=? and regularize_status='NFD';\
          select hims_f_absent_id,employee_id,A.updated_date,user_display_name as updated_by,absent_date,\
          from_session,to_session,absent_reason,absent_duration,status,cancel from hims_f_absent A left  join algaeh_d_app_user U on\
          A.updated_by= U.algaeh_d_app_user_id  where employee_id=? and status='NFD' and cancel='N';",
        values: [req.query.employee_id,req.query.employee_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = {
           exceptions: result[0],
          absents:  result[1],
          };
          next();
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
      }
        else {
          req.records = {
            invalid_input: true,
            message: "Please provide valid input"
          };
          next();
        }
    } catch (e) {
      next(e);
    }
  },
    //created by irfan:
  requestAttndncReglztion: (req, res, next) => {
        let input = req.body;
        const utilities = new algaehUtilities();
      
        if (input.regularize_status == "PEN" &&   input.hims_f_attendance_regularize_id>0) {
          const _mysql = new algaehMysql();
          _mysql
            .executeQuery({
              query:
                "UPDATE hims_f_attendance_regularize SET regularize_status = ?,regularization_reason=?,regularize_in_time=?,regularize_out_time=?,\
                updated_date=?, updated_by=?  WHERE hims_f_attendance_regularize_id = ?",
              values: [
                input.regularize_status,
                input.regularization_reason,
                input.regularize_in_time,
                input.regularize_out_time,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                input.hims_f_attendance_regularize_id
              ]
            })
            .then(result => {
              if (result.affectedRows > 0) {
                
                _mysql.releaseConnection();
              req.records = result;
              next();
              } else {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: "Please provide valid input"
                };
                next();
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
      },


  };

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

    // utilities.logger().log("insertArray-66: ", insertArray);

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
      "month"
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
