import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
// import Sync from "sync";
module.exports = {
  //created by irfan: to
  processAttendance: (req, res, next) => {
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
            ? moment(yearAndMonth)
                .endOf("month")
                .format("YYYY-MM-DD")
            : moment(leave_end_date).format("YYYY-MM-DD");

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

        let inputValues = [year,month_number,endOfMonth, startOfMonth, endOfMonth];

        //---------delete old records
        let department="";
        let hospital="";
        if (selectWhere.hospital_id != null) {
          hospital = " and hospital_id="+selectWhere.hospital_id;
         
        }
        if (selectWhere.sub_department_id != null) {
          department = " and sub_department_id="+selectWhere.sub_department_id;         
        }
        let deleteString=` delete from hims_f_attendance_monthly where employee_id>0 and year=${year} and
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
          query:
          deleteString,   
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
                          ).diff(moment(startOfMonth, "YYYY-MM-DD"), "days") +
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
                            empResult[i]["date_of_joining"] > startOfMonth &&
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

                            empResult[i]["defaults"].total_week_off = _.filter(
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

                            empResult[i]["defaults"].total_week_off = _.filter(
                              _holidayResult,
                              obj => {
                                return (
                                  obj.weekoff === "Y" &&
                                  obj.holiday_type === "RE" &&
                                  obj.holiday_date < empResult[i]["exit_date"]
                                );
                              }
                            ).length;
                          } else if (
                            empResult[i]["date_of_joining"] > startOfMonth &&
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
                                    w.holiday_date < empResult[i]["exit_date"])
                              )
                              .Count();

                            empResult[i]["defaults"].total_week_off = _.filter(
                              _holidayResult,
                              obj => {
                                return (
                                  obj.weekoff === "Y" &&
                                  obj.holiday_type === "RE" &&
                                  obj.holiday_date >
                                    empResult[i]["date_of_joining"] &&
                                  obj.holiday_date < empResult[i]["exit_date"]
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

                            empResult[i]["defaults"].total_week_off = _.filter(
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

                              utilities.logger().log("leave_ids: ", leave_ids);

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

                                      empResult[i]["defaults"].unpaid_leave =
                                        _unpaid_leave == null
                                          ? 0
                                          : _unpaid_leave.present_month;
                                      empResult[i]["defaults"].total_leaves =
                                        empResult[i]["defaults"].paid_leave +
                                        empResult[i]["defaults"].unpaid_leave;
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
                                            total_leave,paid_leave,unpaid_leave,total_paid_days  from hims_f_attendance_monthly AM \
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
                                  empResult[i]["defaults"].emp_total_holidays;

                                empResult[i]["defaults"].paid_days =
                                  parseFloat(
                                    empResult[i]["defaults"].present_days
                                  ) +
                                  parseFloat(
                                    empResult[i]["defaults"].paid_leave
                                  ) +
                                  parseFloat(
                                    empResult[i]["defaults"].emp_total_holidays
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
                                      empResult[i]["defaults"].emp_absent_days,
                                      empResult[i]["defaults"].total_work_days,
                                      empResult[i]["defaults"].total_week_off,
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
                                      empResult[i]["defaults"].emp_absent_days,
                                      empResult[i]["defaults"].total_work_days,
                                      empResult[i]["defaults"].total_week_off,
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
              message: "please provide valid absent id"
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
        message: "please provide valid input"
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
      const startOfMonth = moment(input.yearAndMonth)
        .startOf("month")
        .format("YYYY-MM-DD");

      const endOfMonth = moment(input.yearAndMonth)
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
        message: "please provide valid year and month"
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
              message: "please provide valid input"
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
        message: "please provide valid input"
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
        between date('${req.query.from_date}') and date('${req.query.to_date}') `;
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
          message: "please provide valid input"
        };
        next();
        return;
      }
      else {
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



    }
};
