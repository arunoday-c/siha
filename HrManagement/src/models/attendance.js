import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
//import { LINQ } from "node-linq";
import utilities from "algaeh-utilities";
import Sync from "sync";
module.exports = {
  //created by irfan: to
  processAttendance: (req, res, next) => {
    return new Promise((resolve, reject) => {
      const _mysql = req.mySQl == null ? new algaehMysql() : req.mySQl;
      let yearAndMonth = req.query.yearAndMonth;
      let leave_end_date = req.query.leave_end_date;
      delete req.query.yearAndMonth;

      const startOfMonth = moment(yearAndMonth)
        .startOf("month")
        .format("YYYY-MM-DD");

      // const endOfMonth = moment(yearAndMonth)
      //   .endOf("month")
      //   .format("YYYY-MM-DD");

      utilities
        .AlgaehUtilities()
        .logger()
        .log("leave_end_date: ", leave_end_date);

      utilities
        .AlgaehUtilities()
        .logger()
        .log("yearAndMonth: ", yearAndMonth);
      const endOfMonth =
        leave_end_date === undefined
          ? moment(yearAndMonth)
              .endOf("month")
              .format("YYYY-MM-DD")
          : moment(leave_end_date).format("YYYY-MM-DD");

      utilities
        .AlgaehUtilities()
        .logger()
        .log("startOfMonth: ", startOfMonth);

      utilities
        .AlgaehUtilities()
        .logger()
        .log("endOfMonth: ", endOfMonth);

      const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
      const month_name = moment(yearAndMonth).format("MMMM");
      const month_number = moment(yearAndMonth).format("M");
      const year = moment(yearAndMonth).format("YYYY");

      let selectWhere = {
        date_of_joining: endOfMonth,
        exit_date: startOfMonth,
        date_of_joining1: endOfMonth,
        //   hospital_id: "ALL",
        //   sub_department_id: "ALL",
        //   hims_d_employee_id: "ALL",
        ...req.query
      };

      let _stringData = selectWhere.hospital_id > 0 ? " hospital_id=? " : "";
      if (_stringData != "" && selectWhere.sub_department_id > 0)
        _stringData += " AND ";
      _stringData +=
        selectWhere.sub_department_id > 0 ? " sub_department_id=?" : "";
      if (_stringData != "" && selectWhere.hims_d_employee_id != null)
        _stringData += " AND ";
      _stringData +=
        selectWhere.hims_d_employee_id != null ? " hims_d_employee_id=?" : "";
      const _appendString = _stringData != "" ? " AND " + _stringData : "";

      utilities
        .AlgaehUtilities()
        .logger()
        .log("_appendString: ", _appendString);

      utilities
        .AlgaehUtilities()
        .logger()
        .log("selectWhere: ", selectWhere);

      // Sync(() => {
      // .sync(null,
      _mysql
        .executeQueryWithTransaction({
          query:
            "select hims_d_employee_id, employee_code,full_name  as employee_name,\
      employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,exit_date from hims_d_employee where employee_status <>'I'\
      and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
      (date(date_of_joining) <= date(?) and exit_date is null)) and  record_status='A' " +
            _appendString,
          values: _.valuesIn(selectWhere)
        })
        .then(empResult => {
          if (empResult.length > 0) {
            utilities
              .AlgaehUtilities()
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
                values: [startOfMonth, endOfMonth, empResult[0]["hospital_id"]]
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
                      paid_days: 0
                    };

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

                        //HOLIDAYS CALCULATION------------------------------------------
                        let other_religion_holidays = _.chain(_holidayResult)
                          .filter(obj => {
                            return (
                              obj.weekoff == "N" &&
                              obj.holiday == "Y" &&
                              obj.holiday_type == "RS" &&
                              obj.religion_id != empResult[i]["religion_id"]
                            );
                          })
                          .value();

                        empResult[i]["defaults"].emp_total_holidays =
                          other_religion_holidays.length === 0
                            ? _holidayResult.length
                            : _holidayResult.length -
                              other_religion_holidays.length;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("_holidayResult: ", _holidayResult);

                        //WEEK OFF CALCULATION---------------------------------------------
                        empResult[i]["defaults"].total_week_off = _.filter(
                          _holidayResult,
                          obj => {
                            return (
                              obj.weekoff === "Y" && obj.holiday_type === "RE"
                            );
                          }
                        ).length;

                        utilities
                          .AlgaehUtilities()
                          .logger()
                          .log(
                            "total_week_off: ",
                            empResult[i]["defaults"].total_week_off
                          );

                        absentResult = empResult[i]["defaults"].emp_absent_days;
                        _mysql
                          .executeQuery({
                            query:
                              "select hims_f_leave_application_id, employee_id, leave_id, leave_type FROM hims_f_leave_application where\
                        employee_id =? and status= 'APR' and cancelled = 'N' AND\
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
                              .AlgaehUtilities()
                              .logger()
                              .log("leave_ids: ", leave_ids);

                            if (leave_ids.length > 0) {
                              _mysql
                                .executeQuery({
                                  query:
                                    "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.leave_type,\
                                total_eligible, availed_till_date," +
                                    month_name +
                                    " as present_month,close_balance, processed,\
                                carry_forward_done, carry_forward_leave, encashment_leave FROM hims_f_employee_monthly_leave ML,hims_d_leave L\
                                where  employee_id=? and ML.leave_id=L.hims_d_leave_id and leave_id in (?)",
                                  values: [
                                    empResult[i]["hims_d_employee_id"],
                                    leave_ids
                                  ],
                                  printQuery: true
                                })
                                .then(monthlyLeaveResult => {
                                  utilities
                                    .AlgaehUtilities()
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
                                      .AlgaehUtilities()
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
                                    .AlgaehUtilities()
                                    .logger()
                                    .log(
                                      "leave_salary: ",
                                      req.query.leave_salary
                                    );

                                  empResult[i]["defaults"].present_days =
                                    req.query.leave_salary == "Y"
                                      ? 0
                                      : totalMonthDays -
                                        empResult[i]["defaults"]
                                          .emp_absent_days -
                                        empResult[i]["defaults"].total_leaves -
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
                                        empResult[i]["defaults"].present_days,
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
                                        empResult[i]["defaults"]
                                          .emp_absent_days,
                                        empResult[i]["defaults"].present_days,
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
                                              utilities
                                                .AlgaehUtilities()
                                                .logger()
                                                .log("else : ", "resolve");
                                              resolve(attDataResult);
                                            }
                                          })
                                          .catch(e => {
                                            reject(e);
                                            next(e);
                                          });
                                      }
                                    })
                                    .catch(e => {
                                      reject(e);
                                      next(e);
                                    });
                                })
                                .catch(e => {
                                  reject(e);
                                  next(e);
                                });
                            } else {
                              empResult[i]["defaults"].unpaid_leave = 0;
                              empResult[i]["defaults"].total_leaves =
                                empResult[i]["defaults"].paid_leave +
                                empResult[i]["defaults"].unpaid_leave;

                              empResult[i]["defaults"].present_days =
                                totalMonthDays -
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
                                    empResult[i]["defaults"].present_days,
                                    empResult[i]["defaults"].total_week_off,
                                    empResult[i]["defaults"].emp_total_holidays,
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
                                    empResult[i]["defaults"].present_days,
                                    empResult[i]["defaults"].total_week_off,
                                    empResult[i]["defaults"].emp_total_holidays,
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
                                        } else resolve(attDataResult);

                                        // _mysql.commitTransaction(() => {
                                        //   _mysql.releaseConnection();
                                        //   req.records = attDataResult;

                                        //   next();
                                        // });
                                      })
                                      .catch(e => {
                                        reject(e);
                                        next(e);
                                      });
                                  }
                                })
                                .catch(e => {
                                  reject(e);
                                  next(e);
                                });
                            }
                          })
                          .catch(e => {
                            reject(e);
                            next(e);
                          });
                      })
                      .catch(e => {
                        reject(e);
                        next(e);
                      });
                  }
                } catch (e) {
                  reject(e);
                  next(e);
                }
              })
              .catch(e => {
                reject(e);
                next(e);
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
            } else resolve({ no_data: true, message: "No Employees found" });
          }
        })
        .catch(e => {
          reject(e);
          next(e);
        });
      // });
    });
  }

  // addAttendanceRegularization: (req, res, next) => {
  //   console.log("First Hit");
  //   const _mysql = new algaehMysql();
  //   let input = { ...req.body };

  //   console.log("im here");

  //   runningNumberGen({
  //     db: _mysql,
  //     module_desc: ["ATTENDANCE_REGULARIZE"],
  //     onFailure: error => {
  //       reject(error);
  //     },
  //     onSuccess: result => {
  //       resolve(result);
  //     }
  //   }).then(numGenReg => {
  //     _mysql
  //       .executeQuery({
  //         query: "INSERT INTO hims_f_attendance_regularize(??) VALUES ?",
  //         values: [
  //           {
  //             input
  //           }
  //         ],

  //         printQuery: true
  //       })
  //       .then(result => {
  //         _mysql.releaseConnection();
  //         req.records = result;
  //         next();
  //       })
  //       .catch(e => {
  //         next(e);
  //       });
  //   });
  // }
};
