import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import {getEmployeeWeekOffsHolidays,getDays} from "./shift_roster";
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
  addAttendanceRegularization: (req, res, next) => {
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
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            });
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
  regularizeAttendance: (req, res, next) => {
    let input = req.body;

    if (input.regularize_status == "REJ" || input.regularize_status == "APR") {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_f_attendance_regularize SET regularize_status = ?,\
             updated_date=?, updated_by=?  WHERE hims_f_attendance_regularize_id = ?",
          values: [
            input.regularize_status,
            new Date(),
            input.updated_by,
            input.hims_f_attendance_regularize_id
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

      _mysql
        .executeQuery({
          query:
            "select hims_f_attendance_regularize_id,regularization_code,employee_id,\
          E.employee_code,E.full_name as employee_name ,attendance_date,\
          regularize_status,login_date,logout_date,punch_in_time,punch_out_time,\
          regularize_in_time,regularize_out_time,regularization_reason , AR.created_date\
          from hims_f_attendance_regularize   AR inner join hims_d_employee E  on\
           AR.employee_id=E.hims_d_employee_id and record_status='A' where" +
            employee +
            "" +
            dateRange +
            " order by\
          hims_f_attendance_regularize_id desc ;"
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
    let employee_ = "";
    let selectData = "";
    if (selectWhere.hospital_id != null) {
      hospital = " and hospital_id=" + selectWhere.hospital_id;
      selectData += " and AM.hospital_id=" + selectWhere.hospital_id;
    }
    if (selectWhere.sub_department_id != null) {
      department = " and sub_department_id=" + selectWhere.sub_department_id;
      selectData +=
        " and AM.sub_department_id=" + selectWhere.sub_department_id;
    }
    if (selectWhere.hims_d_employee_id != null) {
      employee_ = " and employee_id=" + selectWhere.hims_d_employee_id;
      selectData += " and AM.employee_id=" + selectWhere.hims_d_employee_id;
    }

    let deleteString = ` delete from hims_f_attendance_monthly  where employee_id>0 and year=${year} and
                              month=${month_number}  ${hospital} ${department} ${employee_};`;

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
              values: inputValues
            })
            .then(result => {
              allEmployees = result[0];
              allHolidays = result[1];
              allAbsents = result[2];
              allMonthlyLeaves = result[3];
              allPendingLeaves = result[4];

              // utilities.logger().log("allEmployees my: ", allEmployees);
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
                        w =>
                          w.employee_id == allEmployees[i]["hims_d_employee_id"]
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
                          w.employee_id == allEmployees[i]["hims_d_employee_id"]
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
                            w.holiday_date > allEmployees[i]["date_of_joining"]
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
                              w.religion_id == allEmployees[i]["religion_id"])
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
                      parseFloat(allEmployees[i]["defaults"].total_holidays) +
                      parseFloat(allEmployees[i]["defaults"].total_week_off) -
                      parseFloat(allEmployees[i]["defaults"].pending_leaves);

                    attendanceArray.push({
                      employee_id: allEmployees[i]["hims_d_employee_id"],
                      year: year,
                      month: month_number,
                      hospital_id: allEmployees[i]["hospital_id"],
                      sub_department_id: allEmployees[i]["sub_department_id"],
                      total_days: totalMonthDays,
                      present_days: allEmployees[i]["defaults"].present_days,
                      absent_days: allEmployees[i]["defaults"].emp_absent_days,
                      total_work_days:
                        allEmployees[i]["defaults"].total_work_days,
                      total_weekoff_days:
                        allEmployees[i]["defaults"].total_week_off,
                      total_holidays:
                        allEmployees[i]["defaults"].total_holidays,
                      total_leave: allEmployees[i]["defaults"].total_leaves,
                      paid_leave: allEmployees[i]["defaults"].paid_leave,
                      unpaid_leave: allEmployees[i]["defaults"].unpaid_leave,
                      total_paid_days: allEmployees[i]["defaults"].paid_days,
                      pending_unpaid_leave:
                        allEmployees[i]["defaults"].pending_leaves,
                      created_date: new Date(),
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_date: new Date(),
                      updated_by: req.userIdentity.algaeh_d_app_user_id
                    });

                    // if (i == allEmployees.length - 1) {
                    //   resolve(attendanceArray);
                    // }
                  }
                  resolve(attendanceArray);
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
                "pending_unpaid_leave",
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
                  bulkInsertOrUpdate: true
                })
                .then(finalResult => {
                  _mysql
                    .executeQueryWithTransaction({
                      query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                year,month,AM.hospital_id,AM.sub_department_id,\
                total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave from hims_f_attendance_monthly AM \
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
  },

  getEmployeeToManualTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const input = req.query;
      let _strDate = "";
      let intValues = [input.branch_id];
      let strQuery = "";

      if (input.manual_timesheet_entry == "D") {
        if (input.sub_department_id != null) {
          _strDate += "and E.sub_department_id=?";
          intValues.push(input.sub_department_id);
        }

        strQuery = {
          query:
            "select PR.employee_id, E.employee_code,E.full_name,PR.attendance_date from hims_f_project_roster PR , \
          hims_d_employee E where E.hims_d_employee_id=PR.employee_id and E.hospital_id=? " +
            _strDate,
          values: intValues,
          printQuery: true
        };
      } else if (input.manual_timesheet_entry == "P") {
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
      }
      _mysql
        .executeQuery(strQuery)
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
  getDailyTimeSheet: (req, res, next) => {
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
              "SELECT * FROM hims_test_db.hims_d_hrms_options;\
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
                  utilities.logger().log("connection eror: ", "connection eror");
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
                    ORDER BY  AccessDate `,
  
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
                              employee_id: AllEmployees[i]["hims_d_employee_id"],
                              religion_id: AllEmployees[i]["religion_id"],
                              date_of_joining: AllEmployees[i]["date_of_joining"],
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
                              employee_id: AllEmployees[0]["hims_d_employee_id"],
                              religion_id: AllEmployees[0]["religion_id"],
                              date_of_joining: AllEmployees[0]["date_of_joining"],
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
                total_leave: result[i]["paid_leave"] + result[i]["unpaid_leave"],
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
          total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave from hims_f_attendance_monthly AM \
          inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
          where AM.record_status='A' and AM.year= ? and AM.month=? ${selectData} `,
                values: [year, month_number],
              printQuery:true}
        )
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
  }
  
  
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
