"use strict";
import extend from "extend";
import {
  selectStatement,
  whereCondition,
  deleteRecord,
  releaseDBConnection,
  jsonArrayToObject
} from "../../utils";
import httpStatus from "../../utils/httpStatus";
import { LINQ } from "node-linq";

import { debugLog } from "../../utils/logging";
import moment from "moment";

//created by irfan: to
let processAttendance = async (req, res, next) => {
  let selectWhere = {
    hims_d_employee_id: "ALL",
    sub_department_id: "ALL",
    hospital_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(httpStatus.dataBaseNotInitilizedError());
    }
    let db = req.db;
    let yearAndMonth = req.query.yearAndMonth;
    delete req.query.yearAndMonth;
    let where = whereCondition(extend(selectWhere, req.query));

    await db.getConnection((error, connection) => {
      connection.beginTransaction(error => {
        if (error) {
          connection.rollback(() => {
            releaseDBConnection(db, connection);
            next(error);
          });
        }

        const startOfMonth = moment(yearAndMonth)
          .startOf("month")
          .format("YYYY-MM-DD");

        const endOfMonth = moment(yearAndMonth)
          .endOf("month")
          .format("YYYY-MM-DD");

        const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
        const month_name = moment(yearAndMonth).format("MMMM");
        const month_number = moment(yearAndMonth).format("MM");
        const year = moment(yearAndMonth).format("YYYY");

        //debugLog("month_number:", month_number);
        //debugLog("year:", year);

        //debugLog("month_name:", month_name);

        //debugLog("startOfMonth:", startOfMonth);
        //debugLog("endOfMonth:", endOfMonth);
        //debugLog("totalMonthDays:", totalMonthDays);

        connection.query(
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
          employee_status,date_of_joining ,date_of_resignation ,religion_id,sub_department_id,hospital_id,exit_date from hims_d_employee where employee_status <>'I'\
          and (( date(date_of_joining) <= date('" +
            endOfMonth +
            "') and date(exit_date) >= date('" +
            startOfMonth +
            "')) or \
          (date(date_of_joining) <= date('" +
            endOfMonth +
            "') and exit_date is null)) and  record_status='A' AND  " +
            where.condition,
          where.values,
          (error, empResult) => {
            if (error) {
              //debugLog("error::", error);
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                next(error);
              });
            }

            //debugLog("empResult:", empResult);

            if (empResult.length > 0) {
              connection.query(
                "select hims_d_holiday_id, hospital_id, holiday_date, holiday_descritpion,\
                weekoff, holiday, holiday_type, religion_id from \
             hims_d_holiday where record_status='A' and  \
                date(holiday_date) between date(?) and date(?) \
                and (weekoff='Y' or holiday='Y') and hospital_id=?",
                [startOfMonth, endOfMonth, empResult[0]["hospital_id"]],
                (error, holidayResult) => {
                  if (error) {
                    //debugLog("error::", error);
                    connection.rollback(() => {
                      releaseDBConnection(db, connection);
                      next(error);
                    });
                  }

                  //debugLog("holidayResult", holidayResult);

                  for (let i = 0; i < empResult.length; i++) {
                    //debugLog("empforrResult:", i);
                    let emp_absent_days = "0";
                    let emp_total_holidays = "0";
                    let total_week_off = "0";
                    let paid_leave = "0";
                    let unpaid_leave = "0";
                    let total_leaves = "0";
                    let present_days = "0";
                    let paid_days = "0";

                    new Promise((resolve, reject) => {
                      try {
                        connection.query(
                          "select hims_f_absent_id, employee_id, absent_date, from_session, to_session,\
                      reason, cancel ,count(employee_id) as absent_days\
                      from hims_f_absent where record_status='A' and cancel='N' and employee_id=?\
                      and date(absent_date) between date(?) and date(?) group by  employee_id",
                          [
                            empResult[i]["hims_d_employee_id"],
                            startOfMonth,
                            endOfMonth
                          ],
                          (error, absentResult) => {
                            if (error) {
                              //debugLog("error::", error);
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            //debugLog("absentResult", absentResult);

                            if (absentResult.length > 0) {
                              emp_absent_days = absentResult[0].absent_days;
                            }

                            //HOLIDAYS CALCULATION------------------------------------------
                            let other_religion_holidays = new LINQ(
                              holidayResult
                            )
                              .Where(
                                w =>
                                  (w.weekoff =
                                    "N" &&
                                    w.holiday == "Y" &&
                                    w.holiday_type == "RS" &&
                                    w.religion_id !=
                                      empResult[i]["religion_id"])
                              )
                              .Select(s => {
                                return {
                                  hims_d_holiday_id: s.hims_d_holiday_id
                                };
                              })
                              .ToArray().length;

                            //debugLog("all holidays:", holidayResult.length);

                            //debugLog(
                            // "other_religion_holidays:",
                            // other_religion_holidays
                            //);

                            emp_total_holidays =
                              holidayResult.length - other_religion_holidays;
                            //debugLog("emp_total_holidays:", emp_total_holidays);

                            //WEEK OFF CALCULATION---------------------------------------------
                            total_week_off = new LINQ(holidayResult)
                              .Where(
                                w => w.weekoff == "Y" && w.holiday_type == "RE"
                              )
                              .Select(s => {
                                return {
                                  hims_d_holiday_id: s.hims_d_holiday_id
                                };
                              })
                              .ToArray().length;

                            //debugLog("total_week_off:", total_week_off);
                            //debugLog(
                            //  "=========================================================="
                            // );
                            resolve(emp_absent_days);
                          }
                        );
                      } catch (e) {
                        reject(e);
                      }
                    })
                      .then(absentResult => {
                        //

                        connection.query(
                          "select hims_f_leave_application_id, employee_id, leave_id, leave_type FROM hims_f_leave_application where\
                        employee_id =? and authorized= 'Y' and cancelled = 'N' AND\
                        ((from_date>= ? and from_date <= ?) or\
                        (to_date >= ? and to_date <= ?) or\
                        (from_date <= ? and to_date >= ?)) group by leave_id ",
                          [
                            empResult[i]["hims_d_employee_id"],
                            startOfMonth,
                            endOfMonth,
                            startOfMonth,
                            endOfMonth,
                            startOfMonth,
                            endOfMonth
                          ],
                          (error, leaveAppResult) => {
                            if (error) {
                              //debugLog("error::", error);
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }
                            //debugLog("leaveAppResult:", leaveAppResult);

                            //---------------LEAVE CALCULATION -----------

                            let leave_ids = new LINQ(leaveAppResult)
                              .Select(s => s.leave_id)
                              .ToArray();

                            //debugLog("leave_ids:", leave_ids);
                            if (leave_ids.length > 0) {
                              connection.query(
                                "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id,L.leave_type,\
                              total_eligible, availed_till_date," +
                                  month_name +
                                  " as present_month,close_balance, processed,\
                              carry_forward_done, carry_forward_leave, encashment_leave FROM hims_f_employee_monthly_leave ML,hims_d_leave L\
                              where  employee_id=? and ML.leave_id=L.hims_d_leave_id and leave_id in (?)",
                                [empResult[i]["hims_d_employee_id"], leave_ids],
                                (error, monthlyLeaveResult) => {
                                  if (error) {
                                    //debugLog("error::", error);
                                    connection.rollback(() => {
                                      releaseDBConnection(db, connection);
                                      next(error);
                                    });
                                  }
                                  //debugLog(
                                  // "monthlyLeaveResult:",
                                  //monthlyLeaveResult
                                  // );

                                  //---PAID AND UNPAID LEAVES
                                  if (monthlyLeaveResult.length > 0) {
                                    paid_leave = new LINQ(monthlyLeaveResult)
                                      .Where(w => w.leave_type == "P")
                                      .Select(s => s.present_month)
                                      .FirstOrDefault("0");
                                    //debugLog("paid_leave_cal:", paid_leave);

                                    unpaid_leave = new LINQ(monthlyLeaveResult)
                                      .Where(w => w.leave_type == "U")
                                      .Select(s => s.present_month)
                                      .FirstOrDefault("0");
                                    //debugLog("unpaid_leave_cal:", unpaid_leave);

                                    total_leaves = paid_leave + unpaid_leave;
                                    //debugLog("total_leaves:", total_leaves);
                                  }
                                }
                              );
                            }
                          }
                        );
                      })
                      .then(leaveResult => {
                        //-----------------PRESENT AND  PAID DAYS CALCULATION
                        //debugLog("EMP_ID:", empResult[i]["hims_d_employee_id"]);
                        //debugLog("1.present_days:", present_days);
                        //debugLog("2.totalMonthDays:", totalMonthDays);
                        //debugLog("3.emp_absent_days:", emp_absent_days);
                        //debugLog("4.total_leaves:", total_leaves);
                        //debugLog("5.total_week_off:", total_week_off);
                        //debugLog("6.emp_total_holidays:", emp_total_holidays);
                        //debugLog("7.paid_leave:", paid_leave);
                        //debugLog("8.unpaid_leave:", unpaid_leave);

                        present_days =
                          totalMonthDays -
                          emp_absent_days -
                          total_leaves -
                          total_week_off -
                          emp_total_holidays;

                        //debugLog("present_days:", present_days);

                        paid_days =
                          parseFloat(present_days) +
                          parseFloat(paid_leave) +
                          parseFloat(emp_total_holidays) +
                          parseFloat(total_week_off);

                        //debugLog("paid_days:", paid_days);

                        //----------FINAL INSERTION  IN MONTHLY ATTENDANCE TABLE
                        connection.query(
                          "INSERT INTO `hims_f_attendance_monthly` (employee_id,year,month,hospital_id,sub_department_id,total_days,present_days,absent_days,\
                            total_work_days,total_weekoff_days,total_holidays,total_leave,paid_leave,unpaid_leave)\
                            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                          [
                            empResult[i]["hims_d_employee_id"],
                            year,
                            month_number,
                            empResult[i]["hospital_id"],
                            empResult[i]["sub_department_id"],
                            totalMonthDays,
                            present_days,
                            emp_absent_days,
                            present_days,
                            total_week_off,
                            emp_total_holidays,
                            total_leaves,
                            paid_leave,
                            unpaid_leave
                          ],
                          (error, finalFesult) => {
                            if (error) {
                              //debugLog("error::", error);
                              connection.rollback(() => {
                                releaseDBConnection(db, connection);
                                next(error);
                              });
                            }

                            debugLog("finalFesult:", [
                              empResult[i]["hims_d_employee_id"],
                              year,
                              month_number,
                              empResult[i]["hospital_id"],
                              empResult[i]["sub_department_id"],
                              totalMonthDays,
                              present_days,
                              emp_absent_days,
                              present_days,
                              total_week_off,
                              emp_total_holidays,
                              total_leaves,
                              paid_leave,
                              unpaid_leave
                            ]);

                            if (i == empResult.length - 1) {
                              connection.commit(error => {
                                if (error) {
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next(error);
                                  });
                                }

                                req.records = finalFesult;
                                next();
                              });
                            }
                          }
                        );
                      });
                  }

                  //------For loop ends here
                }
              );

              //--------------------------------------------------
            } else {
              connection.rollback(() => {
                releaseDBConnection(db, connection);
                req.records = empResult;
                next();
              });
            }
            //-------------------------------
          }
        );
      });
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { processAttendance };
