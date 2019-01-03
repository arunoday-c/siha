"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _algaehMysql = require("algaeh-mysql");

var _algaehMysql2 = _interopRequireDefault(_algaehMysql);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import { LINQ } from "node-linq";

module.exports = {
  //created by irfan: to
  processAttendance: function processAttendance(req, res, next) {
    var _mysql = new _algaehMysql2.default();
    var yearAndMonth = req.query.yearAndMonth;
    delete req.query.yearAndMonth;

    var startOfMonth = (0, _moment2.default)(yearAndMonth).startOf("month").format("YYYY-MM-DD");

    var endOfMonth = (0, _moment2.default)(yearAndMonth).endOf("month").format("YYYY-MM-DD");

    var totalMonthDays = (0, _moment2.default)(yearAndMonth, "YYYY-MM").daysInMonth();
    var month_name = (0, _moment2.default)(yearAndMonth).format("MMMM");
    var month_number = (0, _moment2.default)(yearAndMonth).format("MM");
    var year = (0, _moment2.default)(yearAndMonth).format("YYYY");

    var selectWhere = _extends({
      date_of_joining: endOfMonth,
      exit_date: startOfMonth,
      date_of_joining1: endOfMonth
    }, req.query);
    var _stringData = selectWhere.hospital_id != null ? " hospital_id=? " : "";
    if (_stringData != "" && selectWhere.sub_department_id != null) _stringData += " AND ";
    _stringData += selectWhere.sub_department_id != null ? " sub_department_id=?" : "";
    if (_stringData != "" && selectWhere.hims_d_employee_id != null) _stringData += " AND ";
    _stringData += selectWhere.hims_d_employee_id != null ? " hims_d_employee_id=?" : "";
    var _appendString = _stringData != "" ? " AND " + _stringData : "";
    _mysql.executeQueryWithTransaction({
      query: "select hims_d_employee_id, employee_code,full_name  as employee_name,\
      employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,exit_date from hims_d_employee where employee_status <>'I'\
      and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
      (date(date_of_joining) <= date(?) and exit_date is null)) and  record_status='A' " + _appendString,
      values: _lodash2.default.valuesIn(selectWhere)
    }).then(function (empResult) {
      if (empResult.length > 0) {
        _mysql.executeQuery({
          query: "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,\
          weekoff, holiday, holiday_type, religion_id from \
       hims_d_holiday where record_status='A' and  \
          date(holiday_date) between date(?) and date(?) \
          and (weekoff='Y' or holiday='Y') and hospital_id=?",
          values: [startOfMonth, endOfMonth, empResult[0]["hospital_id"]]
        }).then(function (holidayResult) {
          try {
            (function () {
              var _holidayResult = holidayResult;

              var _loop = function _loop(i) {
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
                _mysql.executeQuery({
                  query: "select hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
              reason, cancel ,count(employee_id) as absent_days\
              from hims_f_absent where record_status='A' and cancel='N' and employee_id=?\
              and date(absent_date) between date(?) and date(?) group by  employee_id",
                  values: [empResult[i]["hims_d_employee_id"], startOfMonth, endOfMonth]
                }).then(function (absentResult) {
                  if (absentResult.length > 0) {
                    empResult[i]["defaults"].emp_absent_days = absentResult[0].absent_days;
                  }

                  //HOLIDAYS CALCULATION------------------------------------------
                  var other_religion_holidays = _lodash2.default.chain(_holidayResult).filter(function (obj) {
                    return obj.weekoff == "N" && obj.holiday == "Y" && obj.holiday_type == "RS" && obj.religion_id != empResult[i]["religion_id"];
                  }).value();

                  empResult[i]["defaults"].emp_total_holidays = _holidayResult.length - other_religion_holidays.length;

                  //WEEK OFF CALCULATION---------------------------------------------
                  empResult[i]["defaults"].total_week_off = _lodash2.default.filter(_holidayResult, function (obj) {
                    return obj.weekoff === "Y" && obj.holiday_type === "RE";
                  }).length;
                  absentResult = empResult[i]["defaults"].emp_absent_days;
                  _mysql.executeQuery({
                    query: "select hims_f_leave_application_id, employee_id, leave_id, leave_type FROM hims_f_leave_application where\
                        employee_id =? and authorized= 'Y' and cancelled = 'N' AND\
                        ((from_date>= ? and from_date <= ?) or\
                        (to_date >= ? and to_date <= ?) or\
                        (from_date <= ? and to_date >= ?)) group by leave_id ",
                    values: [empResult[i]["hims_d_employee_id"], startOfMonth, endOfMonth, startOfMonth, endOfMonth, startOfMonth, endOfMonth]
                  }).then(function (leaveAppResult) {
                    var leave_ids = _lodash2.default.map(leaveAppResult, function (obj) {
                      return obj.leave_id;
                    });

                    if (leave_ids.length > 0) {
                      _mysql.executeQuery({
                        query: "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.leave_type,\
                                total_eligible, availed_till_date," + month_name + " as present_month,close_balance, processed,\
                                carry_forward_done, carry_forward_leave, encashment_leave FROM hims_f_employee_monthly_leave ML,hims_d_leave L\
                                where  employee_id=? and ML.leave_id=L.hims_d_leave_id and leave_id in (?)",
                        values: [empResult[i]["hims_d_employee_id"], leave_ids]
                      }).then(function (monthlyLeaveResult) {
                        if (monthlyLeaveResult.length > 0) {
                          var _paid_leave = _lodash2.default.chain(monthlyLeaveResult).filter(function (obj) {
                            return obj.leave_type == "P";
                          }).first().value();
                          empResult[i]["defaults"].paid_leave = _paid_leave == null ? 0 : _paid_leave.present_month;
                          //-------------------------------------------------------------------
                          var _unpaid_leave = _lodash2.default.chain(monthlyLeaveResult).filter(function (obj) {
                            return obj.leave_type == "U";
                          }).first().value();

                          //---------------

                          empResult[i]["defaults"].unpaid_leave = _unpaid_leave == null ? 0 : _unpaid_leave.present_month;
                          empResult[i]["defaults"].total_leaves = empResult[i]["defaults"].paid_leave + empResult[i]["defaults"].unpaid_leave;
                        }
                        empResult[i]["defaults"].present_days = totalMonthDays - empResult[i]["defaults"].emp_absent_days - empResult[i]["defaults"].total_leaves - empResult[i]["defaults"].total_week_off - empResult[i]["defaults"].emp_total_holidays;

                        empResult[i]["defaults"].paid_days = parseFloat(empResult[i]["defaults"].present_days) + parseFloat(empResult[i]["defaults"].paid_leave) + parseFloat(empResult[i]["defaults"].emp_total_holidays) + parseFloat(empResult[i]["defaults"].total_week_off);
                        // _mysql.mysqlQueryFormat("UPDATE ?",{total_days:totalMonthDays,
                        //   present_days: empResult[i]["defaults"].present_days,
                        //   absent_days:,
                        //   created_date:,
                        //   created_by:,

                        // })
                        _mysql.executeQuery({
                          query: "INSERT INTO `hims_f_attendance_monthly` (employee_id,year,month,hospital_id,sub_department_id,total_days,present_days,absent_days,\
                                    total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,unpaid_leave,total_paid_days,created_date,created_by,updated_date,updated_by)\
                                    VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE total_days=?,present_days=?,absent_days=?,\
                                    total_work_days=?,total_weekoff_days=?,total_holidays=?,total_leave=?,paid_leave=?,unpaid_leave=?,total_paid_days=?,updated_date=?,updated_by=? ",
                          values: [empResult[i]["hims_d_employee_id"], year, month_number, empResult[i]["hospital_id"], empResult[i]["sub_department_id"], totalMonthDays, empResult[i]["defaults"].present_days, empResult[i]["defaults"].emp_absent_days, empResult[i]["defaults"].present_days, empResult[i]["defaults"].total_week_off, empResult[i]["defaults"].emp_total_holidays, empResult[i]["defaults"].total_leaves, empResult[i]["defaults"].paid_leave, empResult[i]["defaults"].unpaid_leave, empResult[i]["defaults"].paid_days, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id, totalMonthDays, empResult[i]["defaults"].present_days, empResult[i]["defaults"].emp_absent_days, empResult[i]["defaults"].present_days, empResult[i]["defaults"].total_week_off, empResult[i]["defaults"].emp_total_holidays, empResult[i]["defaults"].total_leaves, empResult[i]["defaults"].paid_leave, empResult[i]["defaults"].unpaid_leave, empResult[i]["defaults"].paid_days, new Date(), req.userIdentity.algaeh_d_app_user_id]
                        }).then(function (finalFesult) {
                          if (i == empResult.length - 1) {
                            _mysql.executeQuery({
                              query: "select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                                            year,month,AM.hospital_id,AM.sub_department_id,\
                                            total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                                            total_leave,paid_leave,unpaid_leave,total_paid_days  from hims_f_attendance_monthly AM \
                                            inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                                            where AM.record_status='A' and AM.`year`= ? and AM.`month`=?",
                              values: [year, month_number]
                            }).then(function (attDataResult) {
                              _mysql.commitTransaction(function () {
                                _mysql.releaseConnection();
                                req.records = attDataResult;
                                next();
                              });
                            }).catch(function (e) {
                              next(e);
                            });
                          }
                        }).catch(function (e) {
                          next(e);
                        });
                      }).catch(function (e) {
                        next(e);
                      });
                    } else {
                      empResult[i]["defaults"].unpaid_leave = 0;
                      empResult[i]["defaults"].total_leaves = empResult[i]["defaults"].paid_leave + empResult[i]["defaults"].unpaid_leave;

                      empResult[i]["defaults"].present_days = totalMonthDays - empResult[i]["defaults"].emp_absent_days - empResult[i]["defaults"].total_leaves - empResult[i]["defaults"].total_week_off - empResult[i]["defaults"].emp_total_holidays;

                      empResult[i]["defaults"].paid_days = parseFloat(empResult[i]["defaults"].present_days) + parseFloat(empResult[i]["defaults"].paid_leave) + parseFloat(empResult[i]["defaults"].emp_total_holidays) + parseFloat(empResult[i]["defaults"].total_week_off);

                      _mysql.executeQuery({
                        query: "INSERT INTO `hims_f_attendance_monthly` (employee_id,year,month,hospital_id,sub_department_id,total_days,present_days,absent_days,\
                              total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,unpaid_leave,total_paid_days,created_date,created_by,updated_date,updated_by)\
                              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE total_days=?,present_days=?,absent_days=?,\
                              total_work_days=?,total_weekoff_days=?,total_holidays=?,total_leave=?,paid_leave=?,unpaid_leave=?,total_paid_days=?,updated_date=?,updated_by=? ",
                        values: [empResult[i]["hims_d_employee_id"], year, month_number, empResult[i]["hospital_id"], empResult[i]["sub_department_id"], totalMonthDays, empResult[i]["defaults"].present_days, empResult[i]["defaults"].emp_absent_days, empResult[i]["defaults"].present_days, empResult[i]["defaults"].total_week_off, empResult[i]["defaults"].emp_total_holidays, empResult[i]["defaults"].total_leaves, empResult[i]["defaults"].paid_leave, empResult[i]["defaults"].unpaid_leave, empResult[i]["defaults"].paid_days, new Date(), req.userIdentity.algaeh_d_app_user_id, new Date(), req.userIdentity.algaeh_d_app_user_id, totalMonthDays, empResult[i]["defaults"].present_days, empResult[i]["defaults"].emp_absent_days, empResult[i]["defaults"].present_days, empResult[i]["defaults"].total_week_off, empResult[i]["defaults"].emp_total_holidays, empResult[i]["defaults"].total_leaves, empResult[i]["defaults"].paid_leave, empResult[i]["defaults"].unpaid_leave, empResult[i]["defaults"].paid_days, new Date(), req.userIdentity.algaeh_d_app_user_id]
                      }).then(function (finalFesult) {
                        if (i == empResult.length - 1) {
                          _mysql.executeQuery({
                            query: "select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                                      year,month,AM.hospital_id,AM.sub_department_id,\
                                      total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                                      total_leave,paid_leave,unpaid_leave,total_paid_days  from hims_f_attendance_monthly AM \
                                      inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                                      where AM.record_status='A' and AM.`year`= ? and AM.`month`=?",
                            values: [year, month_number]
                          }).then(function (attDataResult) {
                            _mysql.commitTransaction(function () {
                              _mysql.releaseConnection();
                              req.records = attDataResult;
                              next();
                            });
                          }).catch(function (e) {
                            next(e);
                          });
                        }
                      }).catch(function (e) {
                        next(e);
                      });
                    }
                  }).catch(function (e) {
                    next(e);
                  });
                }).catch(function (e) {
                  next(e);
                });
              };

              for (var i = 0; i < empResult.length; i++) {
                _loop(i);
              }
            })();
          } catch (e) {
            next(e);
          }
        }).catch(function (e) {
          next(e);
        });
      } else {
        _mysql.commitTransaction(function () {
          _mysql.releaseConnection();
          req.records = empResult;
          next();
        });
      }
    }).catch(function (e) {
      next(e);
    });
  }
};
//# sourceMappingURL=attendance.js.map