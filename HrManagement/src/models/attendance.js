import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import shift_roster from "./shift_roster";
import mysql from "mysql";
import {
  insertTimeSheet,
  getDaysArray,
  getDaysMonthArray,
  bulkTimeValidate,
  getEmployeeWeekOffsandHolidays,
  generateExcelTimesheet,
  generateProjectRosterTimesheet,
  bulkTimesheetDataMatch,
  bulkTimesheetRosterDataMatch,
  mergeTimesheetData,
  processBulkAtt_Normal,
  processBulkAtt_with_cutoff,
} from "./attendance_part_1";
const { getEmployeeWeekOffsHolidays, getDays } = shift_roster;

export default {
  SaveAttendanceAndProject: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    let worked_hrs_mints = input.worked_hours.toString().split(".");

    _mysql
      .executeQuery({
        query:
          "UPDATE hims_f_project_roster set project_id=? where hims_f_project_roster_id=?;\
          UPDATE hims_f_daily_time_sheet set worked_hours=?, hours=?, minutes=?,project_id=? where hims_f_daily_time_sheet_id=?;",
        values: [
          input.project_id,
          input.hims_f_project_roster_id,
          input.worked_hours,
          worked_hrs_mints[0] === undefined ? 0 : worked_hrs_mints[0],
          worked_hrs_mints[1] === undefined ? 0 : worked_hrs_mints[1],
          input.project_id,
          input.hims_f_daily_time_sheet_id,
        ],
        printQuery: true,
      })
      .then((update_result) => {
        // select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id, TS.attendance_date, \
        //        status,worked_hours,employee_code,full_name as employee_name,PR.hims_f_project_roster_id,\
        //       PR.project_id,P.project_code,P.project_desc,P.abbreviation from  hims_f_daily_time_sheet TS \
        //       inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
        //       inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
        //       left join hims_f_project_roster PR on TS.employee_id=PR.employee_id and TS.hospital_id=PR.hospital_id  and TS.attendance_date=PR.attendance_date\
        //       left join hims_d_project P on PR.project_id=P.hims_d_project_id where \
        //       TS.hims_f_daily_time_sheet_id=? and PR.hims_f_project_roster_id=?;",
        _mysql
          .executeQuery({
            query:
              "select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id, TS.attendance_date, \
               status,worked_hours,employee_code,full_name as employee_name ,\
              TS.project_id,P.project_code,P.project_desc,P.abbreviation from  hims_f_daily_time_sheet TS \
              inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
              inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
              left join hims_d_project P on TS.project_id=P.hims_d_project_id where \
              TS.hims_f_daily_time_sheet_id=?  ",
            values: [
              input.hims_f_daily_time_sheet_id,
              input.hims_f_project_roster_id,
            ],
            printQuery: false,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch((e) => {
        _mysql.releaseConnection();
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
          req.userIdentity.algaeh_d_app_user_id,
        ],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
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
            input.hims_f_absent_id,
          ],
        })
        .then((result) => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid absent id",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
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
          from hims_f_absent A,hims_d_employee E where A.record_status='A' and E.hospital_id=?\
          and date(absent_date) between date(?) and date(?) and A.employee_id=E.hims_d_employee_id order by hims_f_absent_id desc",

          values: [req.userIdentity.hospital_id, startOfMonth, endOfMonth],
        })
        .then((result) => {
          _mysql.releaseConnection();

          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      _mysql.releaseConnection();
      req.records = {
        invalid_input: true,
        message: "Please provide valid year and month",
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
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_f_attendance_regularize` (employee_id,attendance_date,regularize_status,\
            login_date,logout_date,\
            punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason,\
            created_by,created_date,updated_by,updated_date,hospital_id)\
            VALUE(?,date(?),?,date(?),date(?),?,?,?,?,?,?,?,?,?,?)",
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
          new Date(),
          req.userIdentity.hospital_id,
        ],
      })
      .then((result) => {
        if (input.absent_id > 0) {
          _mysql
            .executeQuery({
              query:
                "update hims_f_absent  set status='CPR' where hims_f_absent_id=?;",
              values: [input.absent_id],
            })
            .then((result2) => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = result2;
                next();
              });
            })
            .catch((e) => {
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

        // _mysql.commitTransaction(() => {
        //   _mysql.releaseConnection();
        //   req.records = result;
        //   next();
        // });
      })
      .catch((e) => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //created by irfan:
  regularizeAttendance: (req, res, next) => {
    let input = req.body;
    // const utilities = new algaehUtilities();

    if (
      input.regularize_status == "REJ" ||
      input.regularize_status == "APR" ||
      input.regularize_status == "PEN"
    ) {
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
            input.hims_f_attendance_regularize_id,
          ],
        })
        .then((result) => {
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
                    input.attendance_date,
                  ],
                  printQuery: false,
                })
                .then((result2) => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = result2;
                    next();
                  });
                })
                .catch((e) => {
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
              message: "Please provide valid input",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
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
      dateRange = ` AND date(attendance_date)
        between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    if (
      req.query.employee_id != "" &&
      req.query.employee_id != null &&
      req.query.employee_id != "null"
    ) {
      employee = `AND  employee_id=${req.query.employee_id} `;
    }

    if (dateRange == "" && employee == "") {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
      };
      next();
      return;
    } else {
      const _mysql = new algaehMysql();

      let stringData = " and regularize_status <>'NFD' ";
      //for authorization
      if (req.query.type == "auth") {
        stringData = "AND regularize_status='PEN' ";
      }

      _mysql
        .executeQuery({
          query:
            "select hims_f_attendance_regularize_id,regularization_code,employee_id,\
          E.employee_code,E.full_name as employee_name ,attendance_date,\
          regularize_status,login_date,logout_date,punch_in_time,punch_out_time,\
          regularize_in_time,regularize_out_time,regularization_reason , AR.created_date\
          from hims_f_attendance_regularize   AR inner join hims_d_employee E  on\
           AR.employee_id=E.hims_d_employee_id  where AR.hospital_id=? and record_status='A'" +
            stringData +
            "  " +
            employee +
            "" +
            dateRange +
            " order by\
          hims_f_attendance_regularize_id desc ;",
          values: [req.userIdentity.hospital_id],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();

          next(e);
        });
    }
  },

  //created by irfan:
  processAttendance: (req, res, next) => {
    // console.log("req.connection", req.connection)
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
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
            ? moment(yearAndMonth).endOf("month").format("YYYY-MM-DD")
            : moment(leave_end_date).format("YYYY-MM-DD");

        const totalMonthDays = moment(yearAndMonth, "YYYY-MM").daysInMonth();
        const month_name = moment(yearAndMonth).format("MMMM");
        const month_number = moment(yearAndMonth).format("M");
        const year = moment(new Date(yearAndMonth)).format("YYYY");

        let selectWhere = {
          date_of_joining: endOfMonth,
          exit_date: startOfMonth,
          date_of_joining1: endOfMonth,
          ...req.query,
        };

        let inputValues = [
          year,
          month_number,
          year,
          year,
          month_number,
          endOfMonth,
          startOfMonth,
          endOfMonth,
        ];

        //ST---------delete old records
        let department = "";
        let hospital = "";
        let employee_ = "";
        let selectData = "";
        if (selectWhere.hospital_id > 0) {
          hospital = " and hospital_id=" + selectWhere.hospital_id;
          selectData += " and AM.hospital_id=" + selectWhere.hospital_id;
        }
        if (selectWhere.sub_department_id > 0) {
          department =
            " and sub_department_id=" + selectWhere.sub_department_id;
          selectData +=
            " and AM.sub_department_id=" + selectWhere.sub_department_id;
        }
        if (selectWhere.hims_d_employee_id > 0) {
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

        if (selectWhere.hospital_id > 0) {
          _stringData += " and E.hospital_id=?";
          inputValues.push(selectWhere.hospital_id);
        }
        if (selectWhere.sub_department_id > 0) {
          _stringData += " and E.sub_department_id=? ";
          inputValues.push(selectWhere.sub_department_id);
        }

        if (selectWhere.hims_d_employee_id > 0) {
          _stringData += " and E.hims_d_employee_id=? ";
          inputValues.push(selectWhere.hims_d_employee_id);
        }

        inputValues.push(
          startOfMonth,
          endOfMonth,
          selectWhere.hospital_id,
          startOfMonth,
          endOfMonth,
          selectWhere.hospital_id,
          year,
          selectWhere.hospital_id,
          startOfMonth,
          endOfMonth,
          startOfMonth,
          endOfMonth,
          startOfMonth,
          endOfMonth,
          pendingYear,
          pendingMonth,
          selectWhere.hospital_id
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

            let strQuery = "";
            if (
              req.query.leave_salary == null ||
              req.query.leave_salary == undefined
            ) {
              strQuery =
                "select hims_d_employee_id, employee_code,full_name  as employee_name,\
            employee_status,date_of_joining ,date_of_resignation ,religion_id,E.sub_department_id,E.hospital_id,\
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
            employee_status,date_of_joining ,date_of_resignation ,religion_id,E.sub_department_id,E.hospital_id,\
            exit_date ,hims_f_employee_yearly_leave_id from hims_d_employee E left join hims_f_employee_annual_leave A on E.hims_d_employee_id=A.employee_id \
            and  A.year=? and A.month=? and A.cancelled='N' left join hims_f_employee_yearly_leave YL on E.hims_d_employee_id=YL.employee_id and  YL.year=?\
            left join hims_f_salary S on E.hims_d_employee_id=S.employee_id and S.year= ? and S.month=?\
            where employee_status <>'I' and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or \
            (date(date_of_joining) <= date(?) and exit_date is null)) and  E.record_status='A'" +
                _stringData +
                " and  (S.salary_processed is null or  S.salary_processed='N');";
            }

            try {
              _mysql
                .executeQuery({
                  query:
                    strQuery +
                    "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
                  religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?;\
                  select hims_f_absent_id, employee_id, absent_date, from_session, to_session,cancel ,absent_duration from hims_f_absent where\
                  record_status='A' and cancel='N'  and date(absent_date) between date(?) and date(?) and hospital_id=?;\
                  select hims_f_leave_application_id, LA.employee_id,LA.leave_id,LA.weekoff_days,LA.holidays, L.leave_type, L.include_weekoff,L.include_holiday,LA.status,\
                  hims_f_employee_monthly_leave_id,year,total_eligible,availed_till_date,close_balance," +
                    month_name +
                    " as present_month FROM \
                  hims_f_leave_application  LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
                  inner join hims_f_employee_monthly_leave  ML on LA.leave_id=ML.leave_id and LA.employee_id=ML.employee_id and ML.year=?\
                  where  LA.hospital_id=? and status= 'APR' AND ((from_date>= ? and from_date <= ?) or\
                  (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?));\
                  select hims_f_pending_leave_id,PL.employee_id,year,month,leave_application_id,adjusted,\
                  adjusted_year,adjusted_month,updaid_leave_duration,status from hims_f_pending_leave PL \
                  inner join hims_f_leave_application LA on  PL.leave_application_id=LA.hims_f_leave_application_id\
                  where LA.status='APR' and  year=? and month=? and PL.hospital_id=?",
                  values: inputValues,
                  printQuery: false,
                })
                .then((result) => {
                  allEmployees = result[0];
                  allHolidays = result[1];
                  allAbsents = result[2];
                  allMonthlyLeaves = result[3];
                  allPendingLeaves = result[4];

                  if (allEmployees.length > 0) {
                    employee_ = new LINQ(allEmployees)
                      .Select((s) => s.hims_d_employee_id)
                      .ToArray();

                    deleteString = ` delete from hims_f_attendance_monthly  where employee_id>0 and year=${year} and
                    month=${month_number}  ${hospital} ${department}  and employee_id in (${employee_});`;

                    //ST-----checking if yearly leaves not proccessed for any employee
                    let noYearlyLeave = new LINQ(allEmployees)
                      .Where((w) => w.hims_f_employee_yearly_leave_id == null)
                      .Select((s) => {
                        return {
                          employee_code: s.employee_code,
                          employee_name: s.employee_name,
                        };
                      })
                      .ToArray();

                    if (noYearlyLeave.length > 0) {
                      req.records = {
                        invalid_input: true,
                        message: " Please proces yearly leave for ",
                        employees: noYearlyLeave,
                      };
                      next();
                      return;
                    } else {
                      //EN-----checking if yearly leaves not proccessed for any employee
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
                          pending_leaves: 0,
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
                            (w) =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Sum((s) => parseFloat(s.absent_duration));

                        //EN---- adding employee absent days

                        //ST---- calculating paid_leave,unpaid_leave,week_off_include,holiday_include,pending_leaves
                        allEmployees[i]["defaults"].paid_leave = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            (w) =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.leave_type == "P"
                          )
                          .Sum((s) => s.present_month);

                        allEmployees[i]["defaults"].unpaid_leave = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            (w) =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.leave_type == "U"
                          )
                          .Sum((s) => s.present_month);

                        allEmployees[i]["defaults"].week_off_include = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            (w) =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.include_weekoff == "Y"
                          )
                          .Sum((s) => s.weekoff_days);

                        allEmployees[i]["defaults"].holiday_include = new LINQ(
                          allMonthlyLeaves
                        )
                          .Where(
                            (w) =>
                              w.employee_id ==
                                allEmployees[i]["hims_d_employee_id"] &&
                              w.include_holiday == "Y"
                          )
                          .Sum((s) => s.holidays);

                        allEmployees[i]["defaults"].total_leaves =
                          allEmployees[i]["defaults"].paid_leave +
                          allEmployees[i]["defaults"].unpaid_leave;

                        allEmployees[i]["defaults"].pending_leaves = new LINQ(
                          allPendingLeaves
                        )
                          .Where(
                            (w) =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Sum((s) => s.updaid_leave_duration);

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
                              (w) =>
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
                            (obj) => {
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
                              (w) =>
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
                            (obj) => {
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
                              (w) =>
                                ((w.holiday == "Y" && w.holiday_type == "RE") ||
                                  (w.holiday == "Y" &&
                                    w.holiday_type == "RS" &&
                                    w.religion_id ==
                                      allEmployees[i]["religion_id"])) &&
                                w.holiday_date >
                                  allEmployees[i]["date_of_joining"] &&
                                w.holiday_date < allEmployees[i]["exit_date"]
                            )
                            .Count();

                          allEmployees[i]["defaults"].total_week_off = _.filter(
                            allHolidays,
                            (obj) => {
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
                              (w) =>
                                (w.holiday == "Y" && w.holiday_type == "RE") ||
                                (w.holiday == "Y" &&
                                  w.holiday_type == "RS" &&
                                  w.religion_id ==
                                    allEmployees[i]["religion_id"])
                            )
                            .Count();

                          allEmployees[i]["defaults"].total_week_off = _.filter(
                            allHolidays,
                            (obj) => {
                              return (
                                obj.weekoff === "Y" && obj.holiday_type === "RE"
                              );
                            }
                          ).length;
                        }

                        //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

                        //ST---- reduce include holidays and weekoff

                        allEmployees[i]["defaults"].total_holidays -=
                          allEmployees[i]["defaults"].holiday_include;
                        allEmployees[i]["defaults"].total_week_off -=
                          allEmployees[i]["defaults"].week_off_include;

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
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                        });

                        if (i == allEmployees.length - 1) {
                          resolve(attendanceArray);
                        }
                      }
                    }
                  } else {
                    if (req.connection == null) {
                      _mysql.releaseConnection();
                      req.records = {
                        invalid_input: true,
                        message: "No Employees found",
                      };
                      next();
                      return;
                    } else {
                      resolve("No Employee found");
                    }
                  }
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                  reject(e);
                });
            } catch (e) {
              reject(e);
            }
          }).then((attendanceResult) => {
            _mysql
              .executeQueryWithTransaction({
                query: deleteString,
              })
              .then((del) => {
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
                    "updated_by",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT INTO hims_f_attendance_monthly(??) VALUES ?",
                      values: attendanceArray,
                      includeValues: insurtColumns,
                      bulkInsertOrUpdate: true,
                    })
                    .then((finalResult) => {
                      _mysql
                        .executeQueryWithTransaction({
                          query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
                year,month,AM.hospital_id,AM.sub_department_id,\
                total_days,present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
                total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave,total_hours,total_working_hours,\
                shortage_hours,ot_work_hours,ot_weekoff_hours from hims_f_attendance_monthly AM \
                inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
                where AM.record_status='A' and AM.year= ? and AM.month=? ${selectData} `,
                          values: [year, month_number],
                        })
                        .then((selectData) => {
                          //utilities.logger().log("selectData: ", selectData);
                          if (req.connection == null) {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              req.records = selectData;
                              next();
                            });
                          } else {
                            resolve(selectData);
                          }
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.rollBackTransaction(() => {
                    req.records = {
                      invalid_input: true,
                      message: "No Employee data found",
                    };
                    next();
                    return;
                  });
                }
              })
              .catch((e) => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          });
        } else {
          if (req.connection == null) {
            req.records = {
              invalid_input: true,
              message: "Please select a branch",
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
    }).catch((e) => {
      _mysql.releaseConnection();
      next(e);
    });
  },

  addToDailyTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      const utilities = new algaehUtilities();
      const input = req.body;

      _mysql
        .executeQuery({
          query: "select standard_working_hours from hims_d_hrms_options",
          printQuery: false,
        })
        .then((result) => {
          const IncludeValues = [
            "employee_id",
            "attendance_date",
            "in_time",
            "out_date",
            "out_time",
            "hours",
            "minutes",
            "worked_hours",
            "sub_department_id",
            "status",
            "year",
            "month",
            "hospital_id",
          ];

          let _strQry = "";
          for (let i = 0; i < input.length; i++) {
            let actual_hours =
              input[i].status == "PR" || input[i].status == "AB"
                ? result[0]["standard_working_hours"]
                : 0;
            _strQry += _mysql.mysqlQueryFormat(
              "INSERT INTO `hims_f_daily_time_sheet` (employee_id,attendance_date,in_time,out_date,out_time,hours,\
							minutes,worked_hours,sub_department_id,status,year,month,hospital_id, actual_hours,project_id) \
							VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `in_time`=?,`out_date`=?,`hours`=?,\
							`minutes`=?,`worked_hours`=?,`status`=?,`actual_hours`=?, `project_id`=?;",
              [
                input[i].employee_id,
                input[i].attendance_date,
                input[i].in_time,
                input[i].out_date,
                input[i].out_time,
                input[i].hours,
                input[i].minutes > 0 ? input[i]["minutes"] : 0,
                input[i].worked_hours,
                input[i].sub_department_id,
                input[i].status,
                input[i].year,
                input[i].month,
                input[i].hospital_id,
                actual_hours,
                input[i].project_id,
                input[i].in_time,
                input[i].out_date,
                input[i].hours,
                input[i].minutes > 0 ? input[i].minutes : 0,
                input[i].worked_hours,
                input[i].status,
                actual_hours,
                input[i].project_id,
              ]
            );
          }

          _mysql
            .executeQuery({
              query: _strQry,
              printQuery: false,
            })
            .then((result) => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            })
            .catch((e) => {
              next(e);
            });
        })
        .catch((e) => {
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
            input[i].hims_f_daily_time_sheet_id,
          ]
        );
      }

      _mysql
        .executeQuery({
          query: qry,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
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
        let from_date = moment(input.from_date, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        let to_date = moment(input.to_date, "YYYY-MM-DD").format("YYYY-MM-DD");

        let stringData = "";
        if (input.sub_department_id > 0) {
          stringData += " and sub_department_id=" + input.sub_department_id;
          shiftRange += ` and sub_department_id=${req.query.sub_department_id} `;
        }
        if (input.hims_d_employee_id > 0) {
          stringData += " and hims_d_employee_id=" + input.hims_d_employee_id;
          shiftRange += ` and employee_id=${req.query.hims_d_employee_id} `;
          singleEmployee = "Y";
        }
        _mysql
          .executeQuery({
            query: "SELECT * FROM hims_d_hrms_options;",
          })
          .then((hrms_options) => {
            options = hrms_options;
            if (input.attendance_type == "MW") {
              if (
                options[0]["salary_pay_before_end_date"] == "Y" &&
                options[0]["payroll_payment_date"] != null
              ) {
                const _endDate =
                  moment(input.from_date).clone().format("YYYY-MM-") +
                  options[0]["payroll_payment_date"];
                const _prevDays = options[0]["payroll_payment_date"] + 1;
                const _prevMonthYear = moment(input.from_date, "YYYY-MM-DD")
                  .clone()
                  .add(-1, "months");
                _lastDayInPreMonth = moment(_prevMonthYear, "YYYY-MM-DD").endOf(
                  "month"
                );
                from_date =
                  moment(_prevMonthYear, "YYYY-MM-DD")
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
                    and employee_status='A'and biometric_id is not null and hospital_id=? and (( date(date_of_joining) <= date(?) and date(exit_date) >= date(?)) or\
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
                  to_date,
                ],
                printQuery: false,
              })
              .then((result) => {
                allHolidays = result[0];
                AllLeaves = result[1];
                AllEmployees = result[2];
                AllShifts = result[3];

                if (
                  AllEmployees.length > 0 &&
                  options.length > 0 &&
                  options[0]["biometric_database"] == "SQL"
                ) {
                  standard_hours = options[0]["standard_working_hours"]
                    .toString()
                    .split(".")[0];

                  if (
                    options[0]["standard_working_hours"]
                      .toString()
                      .split(".")[1] != undefined
                  ) {
                    standard_mins = options[0]["standard_working_hours"]
                      .toString()
                      .split(".")[1];
                  }

                  var sql = require("mssql");

                  // config for your database
                  var config = {
                    user: options[0]["biometric_database_login"],
                    password: options[0]["biometric_database_password"],
                    server: options[0]["biometric_server_name"],
                    database: options[0]["biometric_database_name"],
                  };

                  biometric_ids = new LINQ(AllEmployees)
                    .Select((s) => s.biometric_id)
                    .ToArray();

                  let employee_ids = new LINQ(AllEmployees)
                    .Select((s) => s.hims_d_employee_id)
                    .ToArray();

                  let returnQry = `  select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id,TS.biometric_id, TS.attendance_date, \
                in_time, out_date, out_time, year, month, status,\
                 posted, hours, minutes, actual_hours, actual_minutes, worked_hours,consider_ot_shrtg,\
                 expected_out_date, expected_out_time ,TS.hospital_id,hims_d_employee_id,employee_code,full_name as employee_name,\
                 P.project_code,P.project_desc from  hims_f_daily_time_sheet TS \
                inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
                left join hims_f_project_roster PR on TS.employee_id=PR.employee_id and TS.hospital_id=PR.hospital_id  and TS.attendance_date=PR.attendance_date
              left join hims_d_project P on PR.project_id=P.hims_d_project_id
                where  TS.hospital_id=${input.hospital_id} and  TS.attendance_date between ('${from_date}') and ('${to_date}') and TS.employee_id in (${employee_ids}) order by TS.attendance_date `;

                  //---------------------------------------------------
                  // connect to your database
                  sql.close();
                  sql.connect(config, function (err) {
                    if (err) {
                      next(err);
                    }
                    // create Request object
                    var request = new sql.Request();

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
                      function (err, attResult) {
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
                                (w) =>
                                  w.employee_id ==
                                    AllEmployees[i]["hims_d_employee_id"] &&
                                  w.shift_date == from_date
                              )
                              .Select((s) => {
                                return {
                                  shift_end_day: s.shift_end_day,
                                  shift_date: s.shift_date,
                                  shift_end_date: s.shift_end_date,
                                  shift_time: s.shift_time,
                                  shift_end_time: s.shift_end_time,
                                };
                              })
                              .FirstOrDefault({
                                shift_end_day: null,
                                shift_date: from_date,
                                shift_end_date: from_date,
                                shift_time: 0.0,
                                shift_end_time: 0,
                              });

                            let actual_hours = 0;
                            let actual_mins = 0;

                            if (shiftData["shift_time"] > 0) {
                              actual_hours = shiftData.shift_time
                                .toString()
                                .split(".")[0];

                              if (
                                shiftData.shift_time.toString().split(".")[1] !=
                                undefined
                              ) {
                                actual_mins = shiftData.shift_time
                                  .toString()
                                  .split(".")[1];
                              }
                            } else {
                              actual_hours = standard_hours;
                              actual_mins = standard_mins;
                            }

                            //---------------------------------begin logic

                            if (shiftData.shift_end_day == "ND") {
                              //--ST--punchin
                              let punchIn = new LINQ(attendcResult)
                                .Where(
                                  (w) =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_date
                                )
                                .Select((s) => {
                                  return {
                                    biometric_id: s.UserID,
                                    attendance_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    in_time: s.InTime,
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  attendance_date: shiftData.shift_date,
                                  in_time: null,
                                });

                              //--EN--punchin

                              //--ST--punchout
                              let punchOut = new LINQ(attendcResult)
                                .Where(
                                  (w) =>
                                    w.UserID ==
                                      AllEmployees[i]["biometric_id"] &&
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == shiftData.shift_end_date
                                )
                                .Select((s) => {
                                  return {
                                    biometric_id: s.UserID,
                                    out_date: moment(
                                      s.Date,
                                      "MM-DD-YYYY"
                                    ).format("YYYY-MM-DD"),
                                    out_time: s.OutTime,
                                  };
                                })
                                .FirstOrDefault({
                                  biometric_id: null,
                                  out_date: shiftData.shift_end_date,
                                  out_time: null,
                                });

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
                                  actual_minutes: actual_mins ? actual_mins : 0,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[i]["hospital_id"],
                                  hours: outDateTime.diff(inDateTime, "hours"),
                                  minutes:
                                    outDateTime.diff(inDateTime, "minute") % 60,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M"),
                                });
                              } else {
                                //exception

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
                                  actual_minutes: actual_mins ? actual_mins : 0,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[i]["hospital_id"],
                                  hours: 0,
                                  minutes: 0,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M"),
                                });
                              }
                            } else {
                              biometricData.push(
                                new LINQ(attendcResult)
                                  .Where(
                                    (w) =>
                                      w.UserID ==
                                      AllEmployees[i]["biometric_id"]
                                  )
                                  .Select((s) => {
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
                                      actual_minutes: actual_mins
                                        ? actual_mins
                                        : 0,
                                      expected_out_date:
                                        shiftData.shift_end_date,
                                      expected_out_time:
                                        shiftData.shift_end_time,
                                      hospital_id:
                                        AllEmployees[i]["hospital_id"],
                                      hours: s.Duration.split(".")[0],
                                      minutes: s.Duration.split(".")[1],
                                      year: moment(from_date).format("YYYY"),
                                      month: moment(from_date).format("M"),
                                    };
                                  })
                                  .FirstOrDefault({
                                    biometric_id:
                                      AllEmployees[i]["biometric_id"],
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
                                    actual_minutes: actual_mins
                                      ? actual_mins
                                      : 0,
                                    expected_out_date: shiftData.shift_end_date,
                                    expected_out_time: shiftData.shift_end_time,
                                    hospital_id: AllEmployees[i]["hospital_id"],
                                    hours: 0,
                                    minutes: 0,
                                    year: moment(from_date).format("YYYY"),
                                    month: moment(from_date).format("M"),
                                  })
                              );
                            }
                          }

                          ///----end logic

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

                          let fr_date = from_date;
                          if (AllEmployees[0]["date_of_joining"] > from_date) {
                            fr_date = AllEmployees[0]["date_of_joining"];
                          }

                          let date_range = getDays(
                            new Date(fr_date),
                            new Date(to_date)
                          );

                          for (let i = 0; i < date_range.length; i++) {
                            let shiftData = new LINQ(AllShifts)
                              .Where(
                                (w) =>
                                  w.employee_id ==
                                    AllEmployees[0]["hims_d_employee_id"] &&
                                  w.shift_date == date_range[i]
                              )
                              .Select((s) => {
                                return {
                                  shift_end_day: s.shift_end_day,
                                  shift_date: s.shift_date,
                                  shift_end_date: s.shift_end_date,
                                  shift_time: s.shift_time,
                                  shift_end_time: s.shift_end_time,
                                };
                              })
                              .FirstOrDefault({
                                shift_end_day: null,
                                shift_date: date_range[i],
                                shift_end_date: null,
                                shift_time: 0,
                                shift_end_time: 0,
                              });

                            let actual_hours = 0;
                            let actual_mins = 0;

                            if (shiftData["shift_time"] > 0) {
                              actual_hours = shiftData.shift_time
                                .toString()
                                .split(".")[0];

                              if (
                                shiftData.shift_time
                                  .toString()
                                  .split(".")[1] !== undefined
                              ) {
                                actual_mins = shiftData.shift_time
                                  .toString()
                                  .split(".")[1];
                              }
                            } else {
                              actual_hours = standard_hours;
                              actual_mins = standard_mins;
                            }

                            biometricData.push(
                              new LINQ(attendcResult)
                                .Where(
                                  (w) =>
                                    moment(w.Date, "MM-DD-YYYY").format(
                                      "YYYY-MM-DD"
                                    ) == date_range[i]
                                )
                                .Select((s) => {
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
                                    actual_minutes: actual_mins
                                      ? actual_mins
                                      : 0,
                                    expected_out_date: shiftData.shift_end_date,
                                    expected_out_time: shiftData.shift_end_time,
                                    hospital_id: AllEmployees[0]["hospital_id"],
                                    hours: s.Duration.split(".")[0],
                                    minutes: s.Duration.split(".")[1],
                                    year: moment(date_range[i]).format("YYYY"),
                                    month: moment(date_range[i]).format("M"),
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
                                  actual_minutes: actual_mins ? actual_mins : 0,
                                  expected_out_date: shiftData.shift_end_date,
                                  expected_out_time: shiftData.shift_end_time,
                                  hospital_id: AllEmployees[0]["hospital_id"],
                                  hours: 0,
                                  minutes: 0,
                                  year: moment(date_range[i]).format("YYYY"),
                                  month: moment(date_range[i]).format("M"),
                                })
                            );
                          }

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
                            message: "Biometric Data Not Available",
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
                    message: "Biometric Database or Employees not found ",
                  };
                  _mysql.releaseConnection();

                  next();
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and date",
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
            query: "SELECT * FROM hims_d_hrms_options;",
          })
          .then((options) => {
            //let options = hrms_options;

            if (input.attendance_type == "MW") {
              if (
                options[0]["salary_pay_before_end_date"] == "Y" &&
                options[0]["payroll_payment_date"] != null
              ) {
                let cut_off_date =
                  moment(input.to_date).clone().format("YYYY-MM-") +
                  options[0]["payroll_payment_date"];

                next_dayOf_cutoff =
                  moment(input.to_date).clone().format("YYYY-MM-") +
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
              as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
        '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
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
                  pendingMonth,
                ],
                printQuery: false,
              })
              .then((results) => {
                attResult = results[0];
                allPendingLeaves = results[1];

                for (let i = 0; i < attResult.length; i++) {
                  let pending_leaves = new LINQ(allPendingLeaves)
                    .Where((w) => w.employee_id == attResult[i]["employee_id"])
                    .Sum((s) => s.updaid_leave_duration);

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
                    pending_unpaid_leave: pending_leaves,
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
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_attendance_monthly (??) VALUES ? ON DUPLICATE KEY UPDATE \
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
                      updated_by: req.userIdentity.algaeh_d_app_user_id,
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: false,
                  })
                  .then((result) => {
                    _mysql.releaseConnection();
                    req.records = result;
                    next();
                  })
                  .catch((e) => {
                    next(e);
                  });
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please select a branch and  date",
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
      let input = req.query;

      const month_number =
        input.yearAndMonth === undefined
          ? input.month
          : moment(input.yearAndMonth, "YYYY-M-DD").format("M");

      const year =
        input.yearAndMonth === undefined
          ? input.year
          : moment(input.yearAndMonth, "YYYY-M-DD").format("YYYY");

      let strQry = "";
      if (input.hospital_id > 0) {
        strQry += " and AM.hospital_id=" + input.hospital_id;
      }

      if (input.department_id > 0) {
        strQry += ` and SD.department_id=${input.department_id} `;
      }

      if (input.sub_department_id > 0) {
        strQry += " and AM.sub_department_id=" + input.sub_department_id;
      }
      if (input.hims_d_employee_id > 0) {
        strQry += " and AM.employee_id=" + input.hims_d_employee_id;
      }
      if (input.designation_id > 0) {
        strQry += " and E.employee_designation_id=" + input.designation_id;
      }

      if (input.employee_group_id > 0) {
        strQry += ` and E.employee_group_id=${input.employee_group_id}`;
      }
      if (input.employee_type) {
        strQry += ` and E.employee_type= '${input.employee_type}'`;
      }

      // let from_date = null;
      // let to_date = null;

      let from_date = moment(input.yearAndMonth, "YYYY-M-DD")
        .startOf("month")
        .format("YYYY-MM-DD");
      let to_date = moment(input.yearAndMonth, "YYYY-M-DD")
        .endOf("month")
        .format("YYYY-MM-DD");
      // _mysql
      //   .executeQuery({
      //     query:
      //       "select attendance_starts,at_st_date,at_end_date ,attendance_type from hims_d_hrms_options;"
      //   })
      //   .then(options => {
      //     if (options.length > 0) {
      // if (
      //   options[0]["attendance_starts"] == "PM" &&
      //   options[0]["at_st_date"] > 0 &&
      //   options[0]["at_end_date"] > 0
      // ) {
      //   const f_date =
      //     year + "-" + month_number + "-" + options[0]["at_st_date"];
      //   const t_date =
      //     year + "-" + month_number + "-" + options[0]["at_end_date"];

      //   from_date = moment(f_date, "YYYY-M-DD")
      //     .subtract(1, "months")
      //     .format("YYYY-MM-DD");
      //   to_date = moment(t_date, "YYYY-M-DD").format("YYYY-MM-DD");
      // } else {
      //   from_date = moment(input.yearAndMonth, "YYYY-M-DD")
      //     .startOf("month")
      //     .format("YYYY-MM-DD");
      //   to_date = moment(input.yearAndMonth, "YYYY-M-DD")
      //     .endOf("month")
      //     .format("YYYY-MM-DD");
      // }

      // let presntdayStr = "";
      // if (options[0]["attendance_type"] == "D") {
      //   presntdayStr = " present_days ";
      // }

      _mysql
        .executeQuery({
          query: `select hims_f_attendance_monthly_id,employee_id,E.employee_code,E.full_name as employee_name,\
						year,month,AM.hospital_id,AM.sub_department_id,\
						total_days, display_present_days,absent_days,total_work_days,total_weekoff_days,total_holidays,\
						total_leave,paid_leave,unpaid_leave,total_paid_days ,pending_unpaid_leave,total_hours,total_working_hours,\
            shortage_hours,ot_work_hours,ot_weekoff_hours,ot_holiday_hours,prev_month_shortage_hr,prev_month_ot_hr,\
            prev_month_week_off_ot,prev_month_holiday_ot from hims_f_attendance_monthly AM \
            inner join hims_d_employee E on AM.employee_id=E.hims_d_employee_id \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
            inner join hims_d_department DP on SD.department_id=DP.hims_d_department_id\
						where AM.record_status='A' and AM.year= ? and AM.month=? ${strQry} ;`,
          values: [year, month_number],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = {
            attendance: result,
            from_date: from_date,
            to_date: to_date,
          };
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
      //   } else {
      //     _mysql.releaseConnection();
      //     req.records = {
      //       message: "Please define HRMS options",
      //       invalid_input: true
      //     };
      //     next();
      //   }
      // })
      // .catch(e => {
      //   _mysql.releaseConnection();
      //   next(e);
      // });
    } catch (e) {
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

      if (input.hims_d_employee_id > 0) {
        employee_id = " and employee_id=" + input.hims_d_employee_id;
      }

      _mysql
        .executeQuery({
          query: `select employee_id,attendance_date,\
            out_date as logout_date,in_time as punch_in_time,\
            out_time as punch_out_time,status ,hospital_id from hims_f_daily_time_sheet where hospital_id=? and  \
             date(attendance_date)>=date(?) and date(attendance_date) <=date(?) \
             and (status='EX' or status='AB') ${employee_id};`,
          values: [input.hospital_id, input.from_date, input.to_date],
          printQuery: false,
        })
        .then((result) => {
          if (result.length > 0) {
            let excptionArray = new LINQ(result)
              .Where((w) => w.status == "EX")
              .Select((s) => {
                return {
                  employee_id: s.employee_id,
                  attendance_date: s.attendance_date,
                  regularize_status: "NFD",
                  login_date: s.attendance_date,
                  logout_date: s.logout_date,
                  punch_in_time: s.punch_in_time,
                  punch_out_time: s.punch_out_time,
                  created_by: req.userIdentity.algaeh_d_app_user_id,
                  created_date: new Date(),
                  updated_by: req.userIdentity.algaeh_d_app_user_id,
                  updated_date: new Date(),
                  hospital_id: s.hospital_id,
                };
              })
              .ToArray();

            let absentArray = new LINQ(result)
              .Where((w) => w.status == "AB")
              .Select((s) => {
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
                  updated_date: new Date(),
                  hospital_id: s.hospital_id,
                };
              })
              .ToArray();

            new Promise((resolve, reject) => {
              try {
                if (excptionArray.length > 0) {
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
                    "updated_date",
                    "hospital_id",
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
                      bulkInsertOrUpdate: true,
                    })
                    .then((exptionResult) => {
                      resolve(exptionResult);
                    })
                    .catch((e) => {
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
            }).then((exptionResult) => {
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
                  "updated_date",
                  "hospital_id",
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
                    bulkInsertOrUpdate: true,
                  })
                  .then((result) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result;
                      next();
                    });
                  })
                  .catch((e) => {
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
            req.records = {
              no_exception: true,
              message: `No exception Found From   ${input.to_date} to ${input.to_date}`,
            };

            next();
            return;
          }
        })
        .catch((error) => {
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
          printQuery: false,
        })
        .then((result) => {
          if (result.length > 0) {
            let excptions = new LINQ(result)
              .Where((w) => w.status == "EX")
              .Select((s) => {
                return {
                  employee_code: s.employee_code,
                  employee_name: s.full_name,
                  attendance_date: s.attendance_date,
                };
              })
              .ToArray();

            if (excptions.length > 0) {
              req.records = {
                invalid_input: true,
                employees: excptions,
                message: "PLease Notify Exceptions to proceed",
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
                  ot_minutes: ot_min,
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
                  bulkInsertOrUpdate: true,
                })
                .then((finalResult) => {
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
                      as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
          '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
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
                        to_date,
                      ],

                      printQuery: false,
                    })
                    .then((attResult) => {
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
                          shortage_hours:
                            attResult[i]["shortage_hourss"] -
                              attResult[i]["ot_hourss"] >=
                            0
                              ? attResult[i]["shortage_hourss"] -
                                attResult[i]["ot_hourss"]
                              : 0,
                          ot_work_hours:
                            attResult[i]["ot_hourss"] -
                              attResult[i]["shortage_hourss"] >=
                            0
                              ? attResult[i]["ot_hourss"] -
                                attResult[i]["shortage_hourss"]
                              : 0,
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
                            updated_by: req.userIdentity.algaeh_d_app_user_id,
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: false,
                        })
                        .then((result) => {
                          _mysql.releaseConnection();
                          req.records = result;
                          next();
                        })
                        .catch((e) => {
                          _mysql.releaseConnection();
                          next(e);
                        });
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "No Data Found for this date range",
            };
            next();
            return;
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
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
            query: "SELECT * FROM hims_d_hrms_options;",
          })
          .then((options) => {
            if (
              input.attendance_type == "MW" &&
              options[0]["salary_pay_before_end_date"] == "Y" &&
              options[0]["payroll_payment_date"] != null
            ) {
              cut_off_date =
                moment(input.to_date).clone().format("YYYY-MM-") +
                options[0]["payroll_payment_date"];

              next_dayOf_cutoff =
                moment(input.to_date).clone().format("YYYY-MM-") +
                parseInt(options[0]["payroll_payment_date"] + 1);

              const prevDays = options[0]["payroll_payment_date"] + 1;

              const prevMonthYear = moment(input.from_date)
                .clone()
                .add(-1, "months");

              lastMonth_after_cutoff_date =
                moment(prevMonthYear).clone().format("YYYY-MM") +
                "-" +
                prevDays;

              lastMonth_end_date = moment(prevMonthYear)
                .endOf("month")
                .format("YYYY-MM-DD");

              let standard_hours = options[0]["standard_working_hours"]
                .toString()
                .split(".")[0];

              let standard_mins = 0;
              if (
                options[0]["standard_working_hours"].toString().split(".")[1] !=
                undefined
              ) {
                standard_mins = options[0]["standard_working_hours"]
                  .toString()
                  .split(".")[1];
              }

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
                        between date(?) and date(?) and hospital_id=?;",
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
                    input.hospital_id,
                  ],

                  printQuery: false,
                })
                .then((result) => {
                  let AttenResult = result[0];
                  let RosterResult = result[1];
                  let LastTenDaysResult = result[2];
                  let LeaveResult = result[3];
                  let HolidayResult = result[4];

                  let total_biom_attend = AttenResult.concat(LastTenDaysResult);
                  if (total_biom_attend.length > 0) {
                    let excptions = new LINQ(total_biom_attend)
                      .Where((w) => w.status == "EX" || w.status == "AB")
                      .Select((s) => {
                        return {
                          employee_code: s.employee_code,
                          employee_name: s.full_name,
                          attendance_date: s.attendance_date,
                        };
                      })
                      .ToArray();

                    if (excptions.length > 0) {
                      req.records = {
                        invalid_input: true,
                        employees: excptions,
                        message:
                          "Please Notify Exceptions and Absent to proceed",
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
                          total_work_days: 1,
                          weekoff_days:
                            AttenResult[i]["status"] == "WO" ? 1 : 0,
                          holidays: AttenResult[i]["status"] == "HO" ? 1 : 0,
                          paid_leave: AttenResult[i]["status"] == "PL" ? 1 : 0,
                          unpaid_leave:
                            AttenResult[i]["status"] == "UL" ? 1 : 0,
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
                              : 0,
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
                          ),
                        });
                      }

                      let roster_Date_range = getDays(
                        new Date(next_dayOf_cutoff),
                        new Date(to_date)
                      );

                      //workin here
                      for (let i = 0; i < roster_Date_range.length; i++) {
                        let whichLeave = 0;
                        // checking which leave is on particular date
                        for (let k = 0; k < leave_Date_range.length; k++) {
                          let leavData = leave_Date_range[k]["dates"].includes(
                            roster_Date_range[i]
                          );

                          if (leavData == true) {
                            whichLeave = leave_Date_range[k]["leave_type"];
                            break;
                          }
                        }

                        let holiday_or_weekOff = new LINQ(HolidayResult)
                          .Where(
                            (w) =>
                              w.holiday_date == roster_Date_range[i] &&
                              (w.weekoff == "Y" ||
                                (w.holiday == "Y" && w.holiday_type == "RE") ||
                                (w.holiday == "Y" &&
                                  w.holiday_type == "RS" &&
                                  w.religion_id ==
                                    RosterResult[0]["religion_id"]))
                          )
                          .Select((s) => {
                            return {
                              holiday: s.holiday,
                              weekoff: s.weekoff,
                            };
                          })
                          .FirstOrDefault({
                            holiday: "N",
                            weekoff: "N",
                          });

                        RosterAttendance.push(
                          new LINQ(RosterResult)
                            .Where((w) => roster_Date_range[i] == w.shift_date)
                            .Select((s) => {
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
                                ot_minutes: 0,
                              };
                            })
                            .FirstOrDefault({
                              employee_id: input.hims_d_employee_id,
                              hospital_id: input.hospital_id,
                              sub_department_id: input.sub_department_id,
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

                              hours:
                                whichLeave != 0 ||
                                holiday_or_weekOff.weekoff == "Y" ||
                                holiday_or_weekOff.holiday == "Y"
                                  ? 0
                                  : standard_hours,
                              minutes:
                                whichLeave != 0 ||
                                holiday_or_weekOff.weekoff == "Y" ||
                                holiday_or_weekOff.holiday == "Y"
                                  ? 0
                                  : standard_mins,
                              working_hours:
                                whichLeave != 0 ||
                                holiday_or_weekOff.weekoff == "Y" ||
                                holiday_or_weekOff.holiday == "Y"
                                  ? 0
                                  : options[0]["standard_working_hours"],
                              total_hours:
                                whichLeave != 0 ||
                                holiday_or_weekOff.weekoff == "Y" ||
                                holiday_or_weekOff.holiday == "Y"
                                  ? 0
                                  : options[0]["standard_working_hours"],
                              shortage_hours: 0,
                              shortage_minutes: 0,
                              ot_work_hours: 0,
                              ot_minutes: 0,
                            })
                        );
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
                              : 0,
                        });
                      }

                      mergedArray = dailyAttendance.concat(RosterAttendance);

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
                          bulkInsertOrUpdate: true,
                        })
                        .then((insertResult) => {
                          _mysql
                            .executeQuery({
                              query:
                                "select employee_id,hospital_id,sub_department_id,year,month,sum(total_days)as total_days,sum(present_days)as present_days,\
                                sum(absent_days)as absent_days,sum(total_work_days)as total_work_days,sum(weekoff_days)as total_weekoff_days,\
                                sum(holidays)as total_holidays,sum(paid_leave)as paid_leave,sum(unpaid_leave)as unpaid_leave,sum(hours)as hours,\
                                sum(minutes)as minutes,COALESCE(sum(hours),0)+ COALESCE(concat(floor(sum(minutes)/60)  ,'.',sum(minutes)%60),0) \
                                as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
                        '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
                                COALESCE(sum(shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as shortage_hourss ,\
                                COALESCE(sum(ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',right(concat('0',SUM(ot_minutes) % 60),2)),0) as ot_hourss\
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
                                pendingMonth,
                              ],

                              printQuery: false,
                            })
                            .then((results) => {
                              let attResult = results[0];
                              let allPendingLeaves = results[1];
                              let insertArray = [];

                              for (let i = 0; i < attResult.length; i++) {
                                //ST--shortage
                                let short_hrs = new LINQ(previousMonthData)
                                  .Where(
                                    (w) =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum((s) => s.shortage_hours);

                                let short_min = new LINQ(previousMonthData)
                                  .Where(
                                    (w) =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum((s) => s.shortage_minutes);

                                short_hrs =
                                  parseInt(short_hrs) +
                                  parseInt(parseInt(short_min) / parseInt(60)) +
                                  "." +
                                  (parseInt(short_min) % parseInt(60));
                                //EN--shortage

                                //ST--over time
                                let ot_hrs = new LINQ(previousMonthData)
                                  .Where(
                                    (w) =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum((s) => s.ot_work_hours);

                                let ot_min = new LINQ(previousMonthData)
                                  .Where(
                                    (w) =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum((s) => s.ot_minutes);

                                ot_hrs =
                                  parseInt(ot_hrs) +
                                  parseInt(parseInt(ot_min) / parseInt(60)) +
                                  "." +
                                  (parseInt(ot_min) % parseInt(60));

                                //EN--over time

                                let pending_leaves = new LINQ(allPendingLeaves)
                                  .Where(
                                    (w) =>
                                      w.employee_id ==
                                      attResult[i]["employee_id"]
                                  )
                                  .Sum((s) => s.updaid_leave_duration);

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
                                  shortage_hours:
                                    attResult[i]["shortage_hourss"],
                                  ot_work_hours: attResult[i]["ot_hourss"],
                                  pending_unpaid_leave: pending_leaves,

                                  prev_month_shortage_hr: short_hrs,
                                  prev_month_ot_hr: ot_hrs,
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
                                "prev_month_ot_hr",
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
                                      req.userIdentity.algaeh_d_app_user_id,
                                  },
                                  bulkInsertOrUpdate: true,
                                  printQuery: false,
                                })
                                .then((result) => {
                                  _mysql.releaseConnection();
                                  req.records = result;
                                  next();
                                })
                                .catch((e) => {
                                  next(e);
                                });
                            })
                            .catch((e) => {
                              _mysql.releaseConnection();
                              next(e);
                            });
                        })
                        .catch((e) => {
                          _mysql.releaseConnection();
                          next(e);
                        });
                    }
                  } else {
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: "No Data Found for this date range",
                    };
                    next();
                    return;
                  }
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          })
          .catch((error) => {
            _mysql.releaseConnection();
            next(error);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid input",
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
            query:
              "select hims_f_attendance_regularize_id,regularization_code,AR.employee_id,AR.updated_date,user_display_name as updated_by,attendance_date,regularize_status,login_date,\
          logout_date,punch_in_time,punch_out_time,regularize_in_time,regularize_out_time,regularization_reason\
          from hims_f_attendance_regularize AR left  join algaeh_d_app_user U on AR.updated_by= U.algaeh_d_app_user_id \
          where  AR.employee_id=? and regularize_status='NFD';\
          select hims_f_absent_id,A.employee_id,A.updated_date,user_display_name as updated_by,absent_date,\
          from_session,to_session,absent_reason,absent_duration,status,cancel from hims_f_absent A left  join algaeh_d_app_user U on\
          A.updated_by= U.algaeh_d_app_user_id  where A.employee_id=? and status='NFD' and cancel='N';",
            values: [req.query.employee_id, req.query.employee_id],
            printQuery: false,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = {
              exceptions: result[0],
              absents: result[1],
            };
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please provide valid input",
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

    if (
      input.regularize_status == "PEN" &&
      input.hims_f_attendance_regularize_id > 0
    ) {
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
            input.hims_f_attendance_regularize_id,
          ],
        })
        .then((result) => {
          if (result.affectedRows > 0) {
            _mysql.releaseConnection();
            req.records = result;
            next();
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Please provide valid input",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
      };
      next();
      return;
    }
  },

  considerOverTimeOrShortage: (req, res, next) => {
    let input = req.body;
    // const utilities = new algaehUtilities();

    if (input.time_sheet_ids.length > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "update hims_f_daily_time_sheet set consider_ot_shrtg=?  where hims_f_daily_time_sheet_id in (?)",
          values: [input.consider_ot_shrtg, input.time_sheet_ids],
        })
        .then((results) => {
          if (results.affectedRows > 0) {
            let employees = "";

            let sub_department = "";
            if (input.sub_department_id > 0) {
              sub_department =
                " and TS.sub_department_id =" + input.sub_department_id;
            }

            if (input.hims_d_employee_id > 0) {
              sub_department = " ";
              employees = " and TS.employee_id =" + input.hims_d_employee_id;
            }

            let returnQry = `select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id,TS.biometric_id, TS.attendance_date, \
											in_time, out_date, out_time, year, month, status,\
											posted, hours, minutes, actual_hours, actual_minutes, worked_hours,consider_ot_shrtg,\
											expected_out_date, expected_out_time ,TS.hospital_id,hims_d_employee_id,employee_code,full_name as employee_name,\
											P.project_code,P.project_desc from  hims_f_daily_time_sheet TS \
											inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
											left join hims_f_project_roster PR on TS.employee_id=PR.employee_id and TS.hospital_id=PR.hospital_id\
											 and TS.attendance_date=PR.attendance_date	left join hims_d_project P on PR.project_id=P.hims_d_project_id
											where  TS.hospital_id=${input.hospital_id} and   TS.attendance_date between ('${input.from_date}') and\
											 ('${input.to_date}') ${sub_department} ${employees}  order by attendance_date`;

            _mysql
              .executeQuery({
                query: returnQry,
                printQuery: false,
              })
              .then((result) => {
                _mysql.releaseConnection();
                //ST-whole month ot,shortage calculate

                let month_actual_hours = 0;
                let month_worked_hours = 0;
                // let month_shortage_hour=0;
                // let month_ot_hour=0;

                let sum_actual_hour = 0;
                let sum_actual_min = 0;
                let sum_work_hour = 0;
                let sum_work_min = 0;

                //ST----total_min
                sum_actual_hour = new LINQ(result).Sum((s) => s.actual_hours);
                sum_actual_min = new LINQ(result).Sum((s) => s.actual_minutes);

                let total_min =
                  parseInt(sum_actual_hour * 60) + parseInt(sum_actual_min);

                let month_actual_hr = parseInt(
                  parseInt(total_min) / parseInt(60)
                );
                let month_actual_min = parseInt(total_min) % parseInt(60);
                month_actual_hours = month_actual_hr + "." + month_actual_min;

                //EN----total_min

                //ST----worked_min
                sum_work_hour = new LINQ(result).Sum((s) => s.hours);
                sum_work_min = new LINQ(result).Sum((s) => s.minutes);

                let worked_min =
                  parseInt(sum_work_hour * 60) + parseInt(sum_work_min);

                let month_worked_hr = parseInt(
                  parseInt(worked_min) / parseInt(60)
                );
                let month_worked_min = parseInt(worked_min) % parseInt(60);
                month_worked_hours = month_worked_hr + "." + month_worked_min;
                //EN----worked_min

                //EN-whole month ot,shortage calculate

                //ST-indivisual date ot,shortage calculate
                let outputArray = [];
                for (let i = 0; i < result.length; i++) {
                  let total_minutes =
                    parseInt(result[i]["actual_hours"] * 60) +
                    parseInt(result[i]["actual_minutes"]);
                  let worked_minutes =
                    parseInt(result[i]["hours"] * 60) +
                    parseInt(result[i]["minutes"]);

                  let diff = total_minutes - worked_minutes;

                  let shortage_Time = 0;
                  let ot_Time = 0;

                  let shortage_hr = 0;
                  let shortage_min = 0;

                  let ot_hr = 0;
                  let ot_min = 0;

                  if (diff > 0) {
                    //calculating shortage
                    shortage_hr = parseInt(parseInt(diff) / parseInt(60));
                    shortage_min = parseInt(diff) % parseInt(60);
                    shortage_Time = shortage_hr + "." + shortage_min;
                  } else if (diff < 0) {
                    //calculating over time
                    ot_hr = parseInt(parseInt(Math.abs(diff)) / parseInt(60));
                    ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                    ot_Time = ot_hr + "." + ot_min;
                  }
                  if (result[i].consider_ot_shrtg == "N") {
                    shortage_Time = 0;
                    shortage_hr = 0;
                    shortage_min = 0;
                    ot_Time = 0;
                    ot_hr = 0;
                    ot_min = 0;
                  }

                  outputArray.push({
                    ...result[i],
                    shortage_Time,
                    shortage_hr,
                    shortage_min,
                    ot_Time,
                    ot_hr,
                    ot_min,
                  });
                }
                //EN-indivisual date ot,shortage calculate

                req.records = {
                  outputArray,
                  month_actual_hours,
                  month_worked_hours,
                };
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "Please provide valid input",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
      };
      next();
      return;
    }
  },

  //created by irfan:
  getDailyAttendance: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;
    _mysql
      .executeQuery({
        query: "select   attendance_type from hims_d_hrms_options;",
      })
      .then((options) => {
        if (options.length > 0) {
          let presntdayStr = "";
          if (options[0]["attendance_type"] == "D") {
            presntdayStr = " present_days ";
          }
          _mysql
            .executeQuery({
              query: `select hims_f_daily_attendance_id,employee_id,hospital_id,sub_department_id,year,month,attendance_date,\
          total_days,${presntdayStr} display_present_days,absent_days,total_work_days,weekoff_days,holidays,\
          paid_leave,unpaid_leave,hours,minutes,total_hours,working_hours,shortage_hours,shortage_minutes,\
          ot_work_hours,ot_minutes,ot_weekoff_hours,ot_weekoff_minutes,ot_holiday_hours,ot_holiday_minutes,pending_unpaid_leave,project_id\
           from hims_f_daily_attendance  where hospital_id=? and year=? and month=? and employee_id=?;`,
              values: [
                input.hospital_id,
                input.year,
                input.month,
                input.employee_id,
              ],
              printQuery: false,
            })
            .then((result) => {
              _mysql.releaseConnection();

              let outputArray = [];
              for (let i = 0; i < result.length; i++) {
                let lay_off = "";

                if (parseFloat(result[i]["weekoff_days"]) > 0) {
                  lay_off = "W";
                } else if (parseFloat(result[i]["holidays"]) > 0) {
                  lay_off = "H";
                } else if (parseFloat(result[i]["paid_leave"]) > 0) {
                  lay_off = "P";
                } else if (parseFloat(result[i]["unpaid_leave"]) > 0) {
                  lay_off = "U";
                }
                outputArray.push({
                  ...result[i],
                  lay_off: lay_off,
                  complete_shortage_hr:
                    result[i]["shortage_hours"] +
                    "." +
                    String("0" + parseInt(result[i]["shortage_minutes"])).slice(
                      -2
                    ),

                  complete_ot_hr:
                    result[i]["ot_work_hours"] +
                    "." +
                    String("0" + parseInt(result[i]["ot_minutes"])).slice(-2),
                  complete_weekoff_ot_hr:
                    result[i]["ot_weekoff_hours"] +
                    "." +
                    String(
                      "0" + parseInt(result[i]["ot_weekoff_minutes"])
                    ).slice(-2),
                  complete_holiday_ot_hr:
                    result[i]["ot_holiday_hours"] +
                    "." +
                    String(
                      "0" + parseInt(result[i]["ot_holiday_minutes"])
                    ).slice(-2),
                });
              }
              req.records = outputArray;
              next();
            })
            .catch((e) => {
              _mysql.releaseConnection();
              next(e);
            });
        } else {
          _mysql.releaseConnection();
          req.records = {
            message: "Please define HRMS options",
            invalid_input: true,
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  updateMonthlyAttendance: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    if (req.userIdentity.edit_monthly_attendance == "Y") {
      _mysql
        .executeQuery({
          query:
            "update hims_f_attendance_monthly set shortage_hours= ?,ot_work_hours=? where hims_f_attendance_monthly_id=?",
          values: [
            input.shortage_hours,
            input.ot_work_hours,
            input.hims_f_attendance_monthly_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();
          // req.records = result;
          // next();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid hims_f_attendance_monthly_id",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "You dont have previlege",
      };
      next();
    }
  },

  //created by irfan:
  getEmployeeToManualTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();

    try {
      const input = req.query;

      if (input.manual_timesheet_entry == "D") {
        let inputDValue = [input.branch_id];
        let strDQuery = "";

        if (input.employee_id > 0) {
          strDQuery = " and TS.employee_id = ?";
          inputDValue.push(input.employee_id);
        }

        if (input.select_wise == "M") {
          const startOfMonth = moment(new Date(input.yearAndMonth))
            .startOf("month")
            .format("YYYY-MM-DD");

          const endOfMonth = moment(new Date(input.yearAndMonth))
            .endOf("month")
            .format("YYYY-MM-DD");
          strDQuery +=
            " and date(TS.attendance_date) between date (?) and date(?) ";
          inputDValue.push(startOfMonth, endOfMonth);
        } else {
          strDQuery += " and TS.attendance_date=? and E.sub_department_id=?";
          inputDValue.push(input.attendance_date, input.sub_department_id);
        }

        _mysql
          .executeQuery({
            query:
              "SELECT TS.hims_f_daily_time_sheet_id,TS.attendance_date,TS.employee_id,TS.in_time,TS.out_time,TS.worked_hours,E.employee_code,\
              E.full_name,E.sub_department_id, year,month FROM hims_f_daily_time_sheet TS, hims_d_employee E where \
              TS.employee_id=E.hims_d_employee_id and (TS.status = 'AB' or TS.status = 'EX') and\
              E.hospital_id=? " +
              strDQuery,
            values: inputDValue,
            printQuery: false,
          })
          .then((time_sheet) => {
            _mysql.releaseConnection();
            req.records = { result: time_sheet, dataExist: true };
            next();
          })
          .catch((e) => {
            next(e);
          });
      } else if (input.manual_timesheet_entry == "P") {
        _mysql
          .executeQuery({
            query:
              "select attendance_starts,at_st_date,at_end_date  from hims_d_hrms_options",
          })
          .then((options) => {
            if (options.length > 0) {
              let from_date = null;
              let to_date = null;
              let employee = "";
              let project = "";

              const month = moment(input.yearAndMonth, "YYYY-M-DD").format("M");
              const year = moment(input.yearAndMonth, "YYYY-M-DD").format(
                "YYYY"
              );

              if (input.select_wise == "M") {
                if (
                  options[0]["attendance_starts"] == "PM" &&
                  options[0]["at_st_date"] > 0 &&
                  options[0]["at_end_date"] > 0
                ) {
                  const f_date =
                    year + "-" + month + "-" + options[0]["at_st_date"];
                  const t_date =
                    year + "-" + month + "-" + options[0]["at_end_date"];

                  from_date = moment(f_date, "YYYY-M-DD")
                    .subtract(1, "months")
                    .format("YYYY-MM-DD");
                  to_date = moment(t_date, "YYYY-M-DD").format("YYYY-MM-DD");
                } else {
                  from_date = moment(input.yearAndMonth, "YYYY-M-DD")
                    .startOf("month")
                    .format("YYYY-MM-DD");
                  to_date = moment(input.yearAndMonth, "YYYY-M-DD")
                    .endOf("month")
                    .format("YYYY-MM-DD");
                }
              } else {
                from_date = moment(input.attendance_date).format("YYYY-MM-DD");
                to_date = moment(input.attendance_date).format("YYYY-MM-DD");
              }

              if (input.employee_id > 0) {
                employee = " and employee_id=" + input.employee_id;
              }

              if (input.project_id > 0) {
                project = " and project_id=" + input.project_id;
              }

              _mysql
                .executeQuery({
                  query: `select PR.employee_id,PR.attendance_date,E.employee_code,E.full_name,E.sub_department_id,\
						E.religion_id, E.date_of_joining,PR.project_id,P.project_desc,D.designation\
						from hims_f_project_roster PR  inner join  hims_d_employee E on PR.employee_id=E.hims_d_employee_id\
						inner join  hims_d_project P on P.hims_d_project_id=PR.project_id\
						left join  hims_d_designation D on D.hims_d_designation_id=E.employee_designation_id\
						where PR.hospital_id=? and PR.attendance_date between date(?) and date(?)  ${employee} ${project};
						select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,L.leave_type,from_date,to_leave_session,\
						to_date,holiday_included,weekoff_included from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id \
						where status='APR' and ((  date('${from_date}')>=date(from_date) and date('${from_date}')<=date(to_date)) or\
						( date('${to_date}')>=date(from_date) and   date('${to_date}')<=date(to_date)) \
						or (date(from_date)>= date('${from_date}') and date(from_date)<=date('${to_date}') ) or \
						(date(to_date)>=date('${from_date}') and date(to_date)<= date('${to_date}') )) ${employee} and hospital_id=? ;\
						select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
						from hims_d_holiday  where hospital_id=? and date(holiday_date) between date('${from_date}') and date('${to_date}');    `,
                  values: [
                    input.branch_id,
                    from_date,
                    to_date,
                    input.branch_id,
                    input.branch_id,
                  ],
                  printQuery: false,
                })
                .then((result) => {
                  _mysql.releaseConnection();

                  let All_Project_Roster = result[0];
                  let AllLeaves = result[1];
                  let allHolidays = result[2];
                  let outputArray = [];

                  if (
                    All_Project_Roster.length > 0 &&
                    input.select_wise == "M" &&
                    input.employee_id > 0
                  ) {
                    let date_range = getDays(
                      new Date(from_date),
                      new Date(to_date)
                    );
                    // utilities.logger().log("date_range:", date_range);

                    let empHolidayweekoff = getEmployeeWeekOffsHolidays(
                      from_date,
                      to_date,
                      All_Project_Roster[0],
                      allHolidays
                    );
                    // utilities.logger().log("empHolidayweekoff:", empHolidayweekoff);
                    for (let i = 0; i < date_range.length; i++) {
                      let leave = new LINQ(AllLeaves)
                        .Where(
                          (w) =>
                            w.employee_id == input.employee_id &&
                            w.from_date <=
                              moment(date_range[i]).format("YYYY-MM-DD") &&
                            w.to_date >=
                              moment(date_range[i]).format("YYYY-MM-DD")
                        )
                        .Select((s) => {
                          return {
                            holiday_included: s.holiday_included,
                            weekoff_included: s.weekoff_included,
                            hospital_id: input.branch_id,
                            month: month,
                            year: year,
                            employee_id: All_Project_Roster[0].employee_id,
                            project_id: null,
                            full_name: All_Project_Roster[0].full_name,
                            sub_department_id:
                              All_Project_Roster[0].sub_department_id,
                            employee_code: All_Project_Roster[0].employee_code,
                            attendance_date: moment(date_range[i]).format(
                              "YYYY-MM-DD"
                            ),
                            status: s.leave_type == "P" ? "PL" : "UL",
                            project_desc: All_Project_Roster[0].project_desc,
                            designation: All_Project_Roster[0].designation,
                          };
                        })
                        .FirstOrDefault(null);

                      let holiday_or_weekOff = new LINQ(empHolidayweekoff)
                        .Where(
                          (w) =>
                            w.holiday_date ==
                            moment(date_range[i]).format("YYYY-MM-DD")
                        )
                        .Select((s) => {
                          return {
                            holiday: s.holiday,
                            weekoff: s.weekoff,
                          };
                        })
                        .FirstOrDefault(null);

                      if (
                        (holiday_or_weekOff == null && leave != null) ||
                        (leave != null &&
                          holiday_or_weekOff != null &&
                          holiday_or_weekOff.holiday == "Y" &&
                          leave.holiday_included == "Y") ||
                        (leave != null &&
                          holiday_or_weekOff != null &&
                          holiday_or_weekOff.weekoff == "Y" &&
                          leave.weekoff_included == "Y")
                      ) {
                        outputArray.push(leave);
                      } else if (holiday_or_weekOff != null) {
                        if (holiday_or_weekOff.weekoff == "Y") {
                          let projrct_on_Weekoff = null;

                          projrct_on_Weekoff = new LINQ(All_Project_Roster)
                            .Where(
                              (w) =>
                                w.attendance_date ==
                                moment(date_range[i]).format("YYYY-MM-DD")
                            )
                            .Select((s) => s.project_id)
                            .FirstOrDefault(null);

                          if (projrct_on_Weekoff != null) {
                            outputArray.push({
                              hospital_id: input.branch_id,
                              month: month,
                              year: year,
                              employee_id: All_Project_Roster[0].employee_id,
                              project_id: projrct_on_Weekoff,
                              full_name: All_Project_Roster[0].full_name,
                              sub_department_id:
                                All_Project_Roster[0].sub_department_id,
                              employee_code:
                                All_Project_Roster[0].employee_code,
                              attendance_date: moment(date_range[i]).format(
                                "YYYY-MM-DD"
                              ),
                              status: "WO",
                              project_desc: All_Project_Roster[0].project_desc,
                              designation: All_Project_Roster[0].designation,
                            });
                          } else {
                            outputArray.push({
                              hospital_id: input.branch_id,
                              month: month,
                              year: year,
                              employee_id: All_Project_Roster[0].employee_id,
                              project_id: null,
                              full_name: All_Project_Roster[0].full_name,
                              sub_department_id:
                                All_Project_Roster[0].sub_department_id,
                              employee_code:
                                All_Project_Roster[0].employee_code,
                              attendance_date: moment(date_range[i]).format(
                                "YYYY-MM-DD"
                              ),
                              status: "WO",
                              project_desc: All_Project_Roster[0].project_desc,
                              designation: All_Project_Roster[0].designation,
                            });
                          }
                        } else if (holiday_or_weekOff.holiday == "Y") {
                          let projrct_on_holiday = null;

                          projrct_on_holiday = new LINQ(All_Project_Roster)
                            .Where(
                              (w) =>
                                w.attendance_date ==
                                moment(date_range[i]).format("YYYY-MM-DD")
                            )
                            .Select((s) => s.project_id)
                            .FirstOrDefault(null);

                          if (projrct_on_holiday != undefined) {
                            outputArray.push({
                              hospital_id: input.branch_id,
                              month: month,
                              year: year,
                              employee_id: All_Project_Roster[0].employee_id,
                              project_id: projrct_on_holiday,
                              full_name: All_Project_Roster[0].full_name,
                              sub_department_id:
                                All_Project_Roster[0].sub_department_id,
                              employee_code:
                                All_Project_Roster[0].employee_code,
                              attendance_date: moment(date_range[i]).format(
                                "YYYY-MM-DD"
                              ),
                              status: "HO",
                              project_desc: All_Project_Roster[0].project_desc,
                              designation: All_Project_Roster[0].designation,
                            });
                          } else {
                            outputArray.push({
                              hospital_id: input.branch_id,
                              month: month,
                              year: year,
                              employee_id: All_Project_Roster[0].employee_id,
                              project_id: null,
                              full_name: All_Project_Roster[0].full_name,
                              sub_department_id:
                                All_Project_Roster[0].sub_department_id,
                              employee_code:
                                All_Project_Roster[0].employee_code,
                              attendance_date: moment(date_range[i]).format(
                                "YYYY-MM-DD"
                              ),
                              status: "HO",
                              project_desc: All_Project_Roster[0].project_desc,
                              designation: All_Project_Roster[0].designation,
                            });
                          }
                        }
                      } else {
                        let roster_data = new LINQ(All_Project_Roster)
                          .Where(
                            (w) =>
                              w.attendance_date ==
                              moment(date_range[i]).format("YYYY-MM-DD")
                          )
                          .Select((s) => {
                            return {
                              hospital_id: input.branch_id,
                              month: month,
                              year: year,
                              employee_id: s.employee_id,
                              project_id: s.project_id,
                              full_name: s.full_name,
                              employee_code: s.employee_code,
                              sub_department_id: s.sub_department_id,
                              attendance_date: s.attendance_date,
                              status: "PR",
                              project_desc: s.project_desc,
                              designation: s.designation,
                            };
                          })
                          .FirstOrDefault(null);

                        if (roster_data != undefined) {
                          outputArray.push(roster_data);
                        } else {
                          outputArray.push({
                            hospital_id: input.branch_id,
                            month: month,
                            year: year,
                            employee_id: All_Project_Roster[0].employee_id,
                            project_id: null,
                            full_name: All_Project_Roster[0].full_name,
                            sub_department_id:
                              All_Project_Roster[0].sub_department_id,
                            employee_code: All_Project_Roster[0].employee_code,
                            attendance_date: moment(date_range[i]).format(
                              "YYYY-MM-DD"
                            ),
                            status: "PR",
                            project_desc: All_Project_Roster[0].project_desc,
                            designation: All_Project_Roster[0].designation,
                          });
                        }
                      }
                    }

                    req.records = { result: outputArray, dataExist: false };
                    next();
                  } else {
                    req.records = {
                      result: All_Project_Roster,
                      dataExist: false,
                    };
                    next();
                  }
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "Please define HRMS options",
                dataExist: false,
              };
              next();
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      }
    } catch (e) {
      next(e);
    }
  },

  //created by irfan:
  postManualTimeSheetMonthWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.query;

    let month = moment(input.from_date).format("M");
    let year = moment(input.from_date).format("YYYY");

    let from_date = null;
    let to_date = null;
    // let from_date = moment(input.from_date).format('YYYY-MM-DD');
    // let to_date = moment(input.to_date).format('YYYY-MM-DD');

    let dailyAttendance = [];

    _mysql
      .executeQuery({
        query:
          "select attendance_starts,at_st_date,at_end_date  from hims_d_hrms_options",
      })
      .then((options) => {
        if (options.length > 0) {
          if (
            options[0]["attendance_starts"] == "PM" &&
            options[0]["at_st_date"] > 0 &&
            options[0]["at_end_date"] > 0
          ) {
            const f_date = year + "-" + month + "-" + options[0]["at_st_date"];
            const t_date = year + "-" + month + "-" + options[0]["at_end_date"];

            from_date = moment(f_date, "YYYY-M-DD")
              .subtract(1, "months")
              .format("YYYY-MM-DD");
            to_date = moment(t_date, "YYYY-M-DD").format("YYYY-MM-DD");
          } else {
            from_date = moment(input.from_date, "YYYY-M-DD")
              .startOf("month")
              .format("YYYY-MM-DD");
            to_date = moment(input.from_date, "YYYY-M-DD")
              .endOf("month")
              .format("YYYY-MM-DD");
          }

          if (
            input.hims_d_employee_id > 0 &&
            input.hospital_id > 0 &&
            input.from_date != undefined &&
            input.to_date != undefined
          ) {
            _mysql
              .executeQuery({
                query: `select hims_f_daily_time_sheet_id,employee_id,employee_code,full_name,TS.sub_department_id,TS.biometric_id,\
							attendance_date,in_time,out_date,out_time,year,month,status,posted,hours,minutes,actual_hours,\
							actual_minutes,worked_hours,consider_ot_shrtg,expected_out_date,expected_out_time,TS.hospital_id,TS.project_id\
							from hims_f_daily_time_sheet TS inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
							where TS.hospital_id=? and year=? and month=? and  employee_id=? and attendance_date between date(?) and date(?);`,
                values: [
                  input.hospital_id,
                  year,
                  month,
                  input.hims_d_employee_id,
                  from_date,
                  to_date,
                ],
                printQuery: false,
              })
              .then((AttenResult) => {
                //present month

                if (AttenResult.length > 0) {
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
                        ot_time = parseInt(
                          parseInt(Math.abs(diff)) / parseInt(60)
                        );
                        ot_min = parseInt(Math.abs(diff)) % parseInt(60);
                      }
                    }

                    if (AttenResult[i]["status"] == "WO") {
                      let worked_minutes =
                        parseInt(AttenResult[i]["hours"] * 60) +
                        parseInt(AttenResult[i]["minutes"]);

                      //calculating over time
                      week_off_ot_hour = parseInt(
                        parseInt(Math.abs(worked_minutes)) / parseInt(60)
                      );
                      week_off_ot_min =
                        parseInt(Math.abs(worked_minutes)) % parseInt(60);
                    }

                    if (AttenResult[i]["status"] == "HO") {
                      let worked_minutes =
                        parseInt(AttenResult[i]["hours"] * 60) +
                        parseInt(AttenResult[i]["minutes"]);

                      //calculating over time
                      holiday_ot_hour = parseInt(
                        parseInt(Math.abs(worked_minutes)) / parseInt(60)
                      );
                      holiday_ot_min =
                        parseInt(Math.abs(worked_minutes)) % parseInt(60);
                    }

                    dailyAttendance.push({
                      employee_id: AttenResult[i]["employee_id"],
                      project_id: AttenResult[i]["project_id"],
                      hospital_id: AttenResult[i]["hospital_id"],
                      sub_department_id: AttenResult[i]["sub_department_id"],
                      attendance_date: AttenResult[i]["attendance_date"],
                      // year: moment(AttenResult[i]['attendance_date']).format('YYYY'),
                      // month: moment(AttenResult[i]['attendance_date']).format('M'),
                      year: year,
                      month: month,
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
                        AttenResult[i]["consider_ot_shrtg"] == "Y" ? ot_min : 0,

                      ot_weekoff_hours: week_off_ot_hour,
                      ot_weekoff_minutes: week_off_ot_min,
                      ot_holiday_hours: holiday_ot_hour,
                      ot_holiday_minutes: holiday_ot_min,
                    });
                  }

                  // utilities
                  // .logger()
                  // .log("dailyAttendance: ", dailyAttendance);

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
                    "ot_holiday_minutes",
                    "project_id",
                  ];

                  _mysql
                    .executeQueryWithTransaction({
                      query:
                        "INSERT IGNORE INTO hims_f_daily_attendance(??) VALUES ? ON DUPLICATE KEY UPDATE employee_id=values(employee_id),\
									hospital_id=values(hospital_id),sub_department_id=values(sub_department_id),\
									year=values(year),month=values(month),attendance_date=values(attendance_date),total_days=values(total_days),\
									present_days=values(present_days),absent_days=values(absent_days),total_work_days=values(total_work_days),\
									weekoff_days=values(weekoff_days),holidays=values(holidays),paid_leave=values(paid_leave),\
									unpaid_leave=values(unpaid_leave),hours=values(hours),minutes=values(minutes),total_hours=values(total_hours),\
									working_hours=values(working_hours), shortage_hours=values(shortage_hours), shortage_minutes=values(shortage_minutes),\
									ot_work_hours=values(ot_work_hours), ot_minutes=values(ot_minutes),ot_weekoff_hours=values(ot_weekoff_hours),ot_weekoff_minutes=values(ot_weekoff_minutes),\
									ot_holiday_hours=values(ot_holiday_hours),ot_holiday_minutes=values(ot_holiday_minutes),project_id=values(project_id)",

                      includeValues: insurtColumns,
                      values: dailyAttendance,
                      bulkInsertOrUpdate: true,
                      printQuery: false,
                    })
                    .then((insertResult) => {
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
									as total_hours,concat(COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', 1)),0)+floor(sum(SUBSTRING_INDEX(working_hours, '.', -1))/60) ,\
              '.',COALESCE(sum(SUBSTRING_INDEX(working_hours, '.', -1))%60,00))  as total_working_hours ,\
									COALESCE(sum(shortage_hours),0)+ COALESCE(concat(floor(sum(shortage_minutes)/60)  ,'.',sum(shortage_minutes)%60),0) as shortage_hours ,\
									COALESCE(sum(ot_work_hours),0)+ COALESCE(concat(floor(sum(ot_minutes)/60)  ,'.',sum(ot_minutes)%60),0) as ot_work_hours ,   \
									COALESCE(sum(ot_weekoff_hours),0)+ COALESCE(concat(floor(sum(ot_weekoff_minutes)/60)  ,'.',sum(ot_weekoff_minutes)%60),0) as ot_weekoff_hours,\
									COALESCE(sum(ot_holiday_hours),0)+ COALESCE(concat(floor(sum(ot_holiday_minutes)/60)  ,'.',sum(ot_holiday_minutes)%60),0) as ot_holiday_hours\
									from hims_f_daily_attendance where      \
									hospital_id=?  and year=? and month=?   and  employee_id=? and attendance_date between date(?) and\
									date(?)  group by employee_id;\
									select employee_id,project_id,hospital_id,year,month,sum(hours)as worked_hours, sum(minutes) as worked_minutes\
									from hims_f_daily_attendance where      \
									hospital_id=?  and year=? and month=?   and  employee_id=? and attendance_date between date(?) and\
									date(?)  group by project_id;",
                          values: [
                            input.hospital_id,
                            year,
                            month,
                            input.hims_d_employee_id,
                            from_date,
                            to_date,
                            input.hospital_id,
                            year,
                            month,
                            input.hims_d_employee_id,
                            from_date,
                            to_date,
                          ],
                          printQuery: false,
                        })
                        .then((results) => {
                          let DilayResult = results[0];
                          let projectWisePayroll = results[1];

                          let attResult = [];

                          for (let i = 0; i < DilayResult.length; i++) {
                            attResult.push({
                              ...DilayResult[i],
                              total_paid_days:
                                parseFloat(DilayResult[i]["present_days"]) +
                                parseFloat(DilayResult[i]["paid_leave"]) +
                                parseFloat(
                                  DilayResult[i]["total_weekoff_days"]
                                ) +
                                parseFloat(DilayResult[i]["total_holidays"]),
                              total_leave:
                                parseFloat(DilayResult[i]["paid_leave"]) +
                                parseFloat(DilayResult[i]["unpaid_leave"]),
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
                            "ot_weekoff_hours",
                            "ot_holiday_hours",
                          ];

                          _mysql
                            .executeQueryWithTransaction({
                              query:
                                "INSERT INTO hims_f_attendance_monthly(??) VALUES ? ON DUPLICATE KEY UPDATE \
									employee_id=values(employee_id),year=values(year),\
									month=values(month),hospital_id=values(hospital_id),\
									sub_department_id=values(sub_department_id),total_days=values(total_days),present_days=values(present_days),\
									absent_days=values(absent_days),total_work_days=values(total_work_days),\
									total_weekoff_days=values(total_weekoff_days),total_holidays=values(total_holidays),total_leave=values(total_leave),\
									paid_leave=values(paid_leave),unpaid_leave=values(unpaid_leave),total_paid_days=values(total_paid_days),\
									total_hours=values(total_hours),total_working_hours=values(total_working_hours),shortage_hours=values(shortage_hours)\
									,ot_work_hours=values(ot_work_hours),ot_weekoff_hours=values(ot_weekoff_hours),ot_holiday_hours=values(ot_holiday_hours)",
                              values: attResult,
                              includeValues: insurtColumns,
                              extraValues: {
                                created_date: new Date(),
                                created_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                                updated_date: new Date(),
                                updated_by:
                                  req.userIdentity.algaeh_d_app_user_id,
                              },
                              bulkInsertOrUpdate: true,
                            })
                            .then((result) => {
                              // _mysql.releaseConnection();
                              // req.records = result;
                              // next();
                              const insertCol = [
                                "employee_id",
                                "project_id",
                                "month",
                                "year",
                                "worked_hours",
                                "worked_minutes",
                                "hospital_id",
                              ];

                              _mysql
                                .executeQueryWithTransaction({
                                  query:
                                    " INSERT   INTO hims_f_project_wise_payroll(??) VALUES ?  ON DUPLICATE KEY UPDATE \
                                    worked_hours=values(worked_hours),worked_minutes=values(worked_minutes)",
                                  values: projectWisePayroll,
                                  includeValues: insertCol,
                                  printQuery: false,

                                  bulkInsertOrUpdate: true,
                                })
                                .then((projectwiseInsert) => {
                                  _mysql.commitTransaction(() => {
                                    _mysql.releaseConnection();
                                    req.records = projectwiseInsert;
                                    next();
                                  });
                                })
                                .catch((e) => {
                                  _mysql.rollBackTransaction(() => {
                                    next(e);
                                  });
                                });
                            })
                            .catch((e) => {
                              _mysql.rollBackTransaction(() => {
                                next(e);
                              });
                            });
                        })
                        .catch((e) => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    })
                    .catch((e) => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: " Daily time sheet doesn't Exist ",
                  };

                  next();
                  return;
                }
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            req.records = {
              invalid_input: true,
              message: "Please provide valid input",
            };

            next();
            return;
          }
        } else {
          _mysql.releaseConnection();
          req.records = {
            message: "Please define HRMS options",
            dataExist: false,
          };
          next();
        }
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },
  //created by irfan:
  loadManualTimeSheet: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      let input = req.query;

      if (
        input.hospital_id > 0 &&
        input.hims_d_employee_id > 0 &&
        input.from_date != undefined &&
        input.to_date != undefined
      ) {
        _mysql
          .executeQuery({
            query:
              "select attendance_starts,at_st_date,at_end_date  from hims_d_hrms_options",
          })
          .then((options) => {
            if (options.length > 0) {
              let from_date = null;
              let to_date = null;
              const month = moment(input.from_date, "YYYY-M-DD").format("M");
              const year = moment(input.from_date, "YYYY-M-DD").format("YYYY");

              if (input.attendance_type == "MW") {
                if (
                  options[0]["attendance_starts"] == "PM" &&
                  options[0]["at_st_date"] > 0 &&
                  options[0]["at_end_date"] > 0
                ) {
                  const f_date =
                    year + "-" + month + "-" + options[0]["at_st_date"];
                  const t_date =
                    year + "-" + month + "-" + options[0]["at_end_date"];

                  from_date = moment(f_date, "YYYY-M-DD")
                    .subtract(1, "months")
                    .format("YYYY-MM-DD");
                  to_date = moment(t_date, "YYYY-M-DD").format("YYYY-MM-DD");
                } else {
                  from_date = moment(input.from_date, "YYYY-M-DD")
                    .startOf("month")
                    .format("YYYY-MM-DD");
                  to_date = moment(input.from_date, "YYYY-M-DD")
                    .endOf("month")
                    .format("YYYY-MM-DD");
                }
              } else {
                from_date = moment(input.from_date, "YYYY-M-DD").format(
                  "YYYY-MM-DD"
                );
                to_date = moment(input.to_date, "YYYY-M-DD").format(
                  "YYYY-MM-DD"
                );
              }

              _mysql
                .executeQuery({
                  query: `select hims_f_daily_time_sheet_id,TS.sub_department_id, TS.employee_id,TS.biometric_id, TS.attendance_date, \
									in_time, out_date, out_time, year, month, status,\
									posted, hours, minutes, actual_hours, actual_minutes, worked_hours,consider_ot_shrtg,\
									expected_out_date, expected_out_time ,TS.hospital_id,hims_d_employee_id,employee_code,full_name as employee_name,\
									P.project_code,P.project_desc from  hims_f_daily_time_sheet TS \
									inner join hims_d_employee E on TS.employee_id=E.hims_d_employee_id\
									left join hims_f_project_roster PR on TS.employee_id=PR.employee_id and TS.hospital_id=PR.hospital_id  and TS.attendance_date=PR.attendance_date\
									left join hims_d_project P on PR.project_id=P.hims_d_project_id\
									where  TS.hospital_id=? and  TS.attendance_date between (?) and (?) and TS.employee_id =? order by attendance_date; `,
                  values: [
                    input.hospital_id,
                    from_date,
                    to_date,
                    input.hims_d_employee_id,
                  ],
                  printQuery: false,
                })
                .then((result) => {
                  _mysql.releaseConnection();
                  req.records = result;

                  next();
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "Please define HRMS options",
                dataExist: false,
              };
              next();
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "Please send valid input",
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  //created by irfan:
  getAttendanceDates: (req, res, next) => {
    const _mysql = new algaehMysql();

    try {
      _mysql
        .executeQuery({
          query:
            "select  salary_pay_before_end_date,payroll_payment_date from hims_d_hrms_options limit 1;",
        })
        .then((opts) => {
          _mysql.releaseConnection();
          const options = opts[0];

          let attendance_starts,
            at_st_date,
            at_end_date = "";

          //ST-from date and to date calculation
          //is cutoff
          if (
            options.salary_pay_before_end_date == "Y" &&
            options.payroll_payment_date > 0
          ) {
            attendance_starts = "PM";

            at_st_date = parseInt(options.payroll_payment_date) + 1;
            at_end_date = options.payroll_payment_date;
          } else {
            attendance_starts = "FE";
            at_st_date = "01";

            at_end_date = "31";
          }

          req.records = [{ attendance_starts, at_st_date, at_end_date }];
          next();
          //END-fromdate and todate calculation
        });
    } catch (e) {
      // console.log("HERE error:", e);
      next(e);
    }
  },

  //created by irfan:
  getBulkManualTimeSheet: (req, res, next) => {
    const utilities = new algaehUtilities();

    try {
      const input = req.query;

      if (
        input.branch_id > 0 &&
        input.year > 0 &&
        input.month > 0 &&
        input.from_date != undefined &&
        input.to_date != undefined
      ) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "select standard_working_hours,attendance_type,salary_pay_before_end_date,payroll_payment_date from hims_d_hrms_options limit 1;",
          })
          .then((opts) => {
            const options = opts[0];

            if (
              options.attendance_type == "DM" ||
              options.attendance_type == "DMP"
            ) {
              // const STDWH = options["standard_working_hours"].split(".")[0];
              // const STDWM = options["standard_working_hours"].split(".")[1];

              let start_year,
                end_year,
                start_month,
                end_month,
                start_day,
                end_day,
                from_date,
                to_date = "";
              const { month, year } = input;
              //ST-from date and to date calculation
              //is cutoff
              if (
                options.salary_pay_before_end_date == "Y" &&
                options.payroll_payment_date > 0
              ) {
                if (month == 1) {
                  start_year = parseInt(year) - 1;
                  end_year = year;
                  start_month = 12;
                  end_month = 1;
                } else {
                  start_year = year;
                  end_year = year;
                  start_month = parseInt(month) - 1;
                  end_month = month;
                }

                start_day = parseInt(options.payroll_payment_date) + 1;
                end_day = options.payroll_payment_date;
              } else {
                start_year = year;
                end_year = year;
                start_month = month;
                end_month = month;
                start_day = 1;
                end_day = moment(year + "-" + month + "-01", "YYYY-MM-DD")
                  .endOf("month")
                  .format("D");
              }
              const valid_from_date = moment(
                `${start_year}-${start_month}-${start_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");

              const valid_to_date = moment(
                `${end_year}-${end_month}-${end_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");
              //END-fromdate and todate calculation

              const input_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              const input_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );

              if (
                valid_from_date <= input_from_date &&
                valid_to_date >= input_from_date &&
                input_to_date >= valid_from_date &&
                input_to_date <= valid_to_date
              ) {
                from_date = input_from_date;
                to_date = input_to_date;

                let deptStr = "";
                let strQry = "";

                if (input.department_id > 0 && !input.sub_department_id > 0) {
                  deptStr =
                    " left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id ";
                  strQry += " and SD.department_id=" + input.department_id;
                }

                if (input.sub_department_id > 0) {
                  strQry +=
                    " and E.sub_department_id=" + input.sub_department_id;
                }

                if (input.employee_group_id > 0) {
                  strQry +=
                    " and E.employee_group_id=" + input.employee_group_id;
                }

                if (input.employee_id > 0) {
                  strQry += " and E.hims_d_employee_id=" + input.employee_id;
                }

                if (options.attendance_type == "DM") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date , E.full_name,E.religion_id, E.date_of_joining,
                         case  when E.exit_date  between date(?) and date(?) then 'Y' else 'N' end as partial_attendance 
                          from hims_d_employee E  ${deptStr}  
                          where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                          E.date_of_joining <= date(?) and
                          (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'    ${strQry}  ;                
                          
                          select hims_f_leave_application_id,LA.employee_id,leave_application_code,from_leave_session,
                          case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type,
                          L.leave_description,from_date,to_leave_session, holiday_included,
                          LA.to_date,
                          weekoff_included,total_applied_days from hims_f_leave_application LA 
                          inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                          inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id 
                          left join hims_f_employee_annual_leave AN on 
                            LA.hims_f_leave_application_id=AN.leave_application_id ${deptStr}
                          where E.hospital_id=? and LA.status='APR' ${strQry} and  
                          (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                          date(?) between  from_date and to_date) ;
                          
                          select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                          holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                          date(holiday_date) between date(?) and date(?);

                          select employee_id,attendance_date,status,worked_hours from hims_d_employee E
                          inner join hims_f_daily_time_sheet  T on E.hims_d_employee_id=T.employee_id ${deptStr}
                          where E.hospital_id=?  ${strQry} and T.year=? and T.month=? and T.attendance_date between date(?) and date(?); `,
                      values: [
                        from_date,
                        to_date,

                        input.branch_id,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        input.branch_id,
                        input.year,
                        parseInt(input.month),
                        from_date,
                        to_date,
                      ],
                      printQuery: true,
                    })
                    .then((result) => {
                      _mysql.releaseConnection();

                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];
                        const timeSheetData = result[3];

                        req.records = generateExcelTimesheet({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          timeSheetData,
                          from_date,
                          to_date,
                        });
                        next();
                      } else {
                        req.records = {
                          message:
                            "Salary Already Processed or No Employees Found",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                } else if (options.attendance_type == "DMP") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date , E.full_name,E.religion_id, 
                        E.date_of_joining,PR.project_id,PR.attendance_date,P.project_desc,
                        case  when E.exit_date  between date(?) and  
                        date(?) then 'Y' else 'N' end as partial_attendance 
                        from hims_d_employee E  ${deptStr}   left join    hims_f_project_roster PR on E.hims_d_employee_id=PR.employee_id
                        and  PR.attendance_date between date(?) and date(?) 
                        left join  hims_d_project P on P.hims_d_project_id=PR.project_id
                        where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                        E.date_of_joining <= date(?) and
                        (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'  
                       ${strQry}  ;                
                        
                        select hims_f_leave_application_id,LA.employee_id,leave_application_code,from_leave_session,
                        case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type,
                        L.leave_description,from_date,to_leave_session,holiday_included, 
                        CASE WHEN LA.employee_joined = 'N' THEN to_date ELSE DATE_SUB(LA.to_date, INTERVAL 1 DAY) END as to_date,
                        weekoff_included,total_applied_days from hims_f_leave_application LA 
                        inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                        inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id 
                        left join hims_f_employee_annual_leave AN on 
                            LA.hims_f_leave_application_id=AN.leave_application_id ${deptStr}
                        where E.hospital_id=? and LA.status='APR' ${strQry} and  
                        (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                        date(?) between  from_date and to_date) ;
                        
                        select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                        holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                        date(holiday_date) between date(?) and date(?);

                        select employee_id,attendance_date,status,worked_hours ,T.project_id,P.project_desc from hims_d_employee E
                        inner join hims_f_daily_time_sheet  T on E.hims_d_employee_id=T.employee_id ${deptStr}
                        inner join  hims_d_project P on P.hims_d_project_id=T.project_id
                        where E.hospital_id=?  ${strQry}  and T.year=? and T.month=? and T.attendance_date between date(?) and date(?); `,
                      values: [
                        from_date,
                        to_date,

                        from_date,
                        to_date,
                        input.branch_id,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        input.branch_id,
                        input.year,
                        parseInt(input.month),
                        from_date,
                        to_date,
                      ],
                      printQuery: true,
                    })
                    .then((result) => {
                      _mysql.releaseConnection();

                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];
                        const timeSheetData = _.chain(result[3])
                          .groupBy((g) => g.employee_id)
                          .value();

                        req.records = generateProjectRosterTimesheet({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          timeSheetData,
                          from_date,
                          to_date,
                        });
                        next();
                      } else {
                        req.records = {
                          message:
                            "Salary Already Processed or No Employee Found",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              } else {
                _mysql.releaseConnection();

                req.records = {
                  message: ` date range should be between ${moment(
                    valid_from_date,
                    "YYYYMMDD"
                  ).format("DD-MM-YYYY")} and ${moment(
                    valid_to_date,
                    "YYYYMMDD"
                  ).format("DD-MM-YYYY")}`,
                  invalid_input: true,
                };
                next();
              }
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "You dont have access privilege for this feature",
                invalid_input: true,
              };
              next();
            }
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          message: "Please provide valid input",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      // console.log("e:", e);
      next(e);
    }
  },

  //created by irfan:
  uploadBulkManualTimeSheet: (req, res, next) => {
    const utilities = new algaehUtilities();

    try {
      // const rawData = req.body.data;
      const input = req.body;
      if (
        (input.branch_id > 0 &&
          input.year > 0 &&
          input.month > 0 &&
          input.from_date != undefined &&
          input.to_date != undefined,
        input.year > 0 && input.month > 0)
      ) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "select standard_working_hours,attendance_type,salary_pay_before_end_date,payroll_payment_date, \
              ramzan_timing_req, ramzan_start_date, ramzan_end_date, ramzan_working_hr_per_day, ramzan_eligible_category,working_hour_from \
               from hims_d_hrms_options limit 1;",
          })
          .then((opts) => {
            const options = opts[0];
            const workingHoursFrom = options["working_hour_from"];
            if (
              options.attendance_type == "DM" ||
              options.attendance_type == "DMP"
            ) {
              const STDWH = options["standard_working_hours"].split(".")[0];
              const STDWM = options["standard_working_hours"].split(".")[1];
              const total_minutes = parseInt(STDWH * 60) + parseInt(STDWM);
              //half day work hour
              const HALF_HR = parseInt(
                parseInt(total_minutes / 2) / parseInt(60)
              );
              const HALF_MIN = parseInt(total_minutes / 2) % parseInt(60);

              let start_year,
                end_year,
                start_month,
                end_month,
                start_day,
                end_day,
                from_date,
                to_date = "";
              const { month, year } = input;
              //ST-from date and to date calculation
              //is cutoff
              if (
                options.salary_pay_before_end_date == "Y" &&
                options.payroll_payment_date > 0
              ) {
                if (month == 1) {
                  start_year = parseInt(year) - 1;
                  end_year = year;
                  start_month = 12;
                  end_month = 1;
                } else {
                  start_year = year;
                  end_year = year;
                  start_month = parseInt(month) - 1;
                  end_month = month;
                }

                start_day = parseInt(options.payroll_payment_date) + 1;
                end_day = options.payroll_payment_date;
              } else {
                start_year = year;
                end_year = year;
                start_month = month;
                end_month = month;
                start_day = 1;
                end_day = moment(year + "-" + month + "-01", "YYYY-MM-DD")
                  .endOf("month")
                  .format("D");
              }
              const valid_from_date = moment(
                `${start_year}-${start_month}-${start_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");

              const valid_to_date = moment(
                `${end_year}-${end_month}-${end_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");
              //END-fromdate and todate calculation

              const input_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              const input_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );

              let is_ramzan,
                RMZ_HR,
                RMZ_MIN,
                RMZ_HF_WH,
                RMZ_HF_MIN = null;
              //RAMZAN working Hour
              if (
                options["ramzan_timing_req"] == "Y" &&
                ((input_from_date <= options["ramzan_start_date"] &&
                  options["ramzan_start_date"] <= input_to_date) ||
                  (input_from_date <= options["ramzan_end_date"] &&
                    options["ramzan_end_date"] <= input_to_date) ||
                  (options["ramzan_start_date"] <= input_from_date &&
                    input_from_date <= options["ramzan_end_date"]))
              ) {
                is_ramzan = "Y";

                RMZ_HR = options["ramzan_working_hr_per_day"].split(".")[0];
                RMZ_MIN = options["ramzan_working_hr_per_day"].split(".")[1];
                const RMZ_total_minutes =
                  parseInt(RMZ_HR * 60) + parseInt(RMZ_MIN);
                //half day work hour
                RMZ_HF_WH = parseInt(
                  parseInt(RMZ_total_minutes / 2) / parseInt(60)
                );
                RMZ_HF_MIN = parseInt(RMZ_total_minutes / 2) % parseInt(60);
              }

              if (
                valid_from_date <= input_from_date &&
                valid_to_date >= input_from_date &&
                input_to_date >= valid_from_date &&
                input_to_date <= valid_to_date
              ) {
                from_date = input_from_date;
                to_date = input_to_date;

                let deptStr = "";
                let strQry = "";

                if (input.department_id > 0 && !input.sub_department_id > 0) {
                  deptStr =
                    " left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id ";
                  strQry += " and SD.department_id=" + input.department_id;
                }

                if (input.sub_department_id > 0) {
                  strQry +=
                    " and E.sub_department_id=" + input.sub_department_id;
                }

                if (input.employee_group_id > 0) {
                  strQry +=
                    " and E.employee_group_id=" + input.employee_group_id;
                }

                if (input.employee_id > 0) {
                  strQry += " and E.hims_d_employee_id=" + input.employee_id;
                }

                let previewStr = `select  hims_f_daily_time_sheet_id,E.employee_code,E.full_name, employee_id,attendance_date,
                                status,worked_hours from hims_d_employee E
                                inner join hims_f_daily_time_sheet  T on E.hims_d_employee_id=T.employee_id 
                                and T.attendance_date between date('${from_date}') and date('${to_date}') ${deptStr}
                                where E.hospital_id= ${input.branch_id} and E.suspend_salary <>'Y' and                           
                                E.record_status='A' and E.employee_status<>'I' and (E.exit_date is null or E.exit_date >date('${from_date}') )                              
                                ${strQry}    ; `;

                const allDates = getDaysArray(
                  new Date(from_date),
                  new Date(to_date)
                );

                const allDatesMonthYear = getDaysMonthArray(
                  new Date(from_date),
                  new Date(to_date)
                );

                if (options.attendance_type == "DM") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date , E.sub_department_id, E.religion_id, E.date_of_joining,
                             case when   '${options["ramzan_eligible_category"]}'='ALL'  and G.ramzan_timing='Y' then 'Y' when E.religion_id=1 and G.ramzan_timing='Y' then 'Y'
                            else 'N' end as ramzan_enployee,E.standard_work_hours,E.consider_overtime,
                            E.ramzan_work_hours,E.week_day
                            from hims_d_employee E  ${deptStr} left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                            S.year=? and S.month=? and S.salary_type='NS'
                            left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id
                            where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                            E.date_of_joining <= date(?) and
                            (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'  
                            and ( S.salary_processed is null or  S.salary_processed='N') ${strQry};                
                            
                            select hims_f_leave_application_id,LA.employee_id,leave_application_code,from_leave_session,
                            case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type, 
                            case when  L.leave_category='A' and  AN.from_normal_salary='N' then 'A' else 'O' end as leave_category,
                            L.leave_description,from_date,to_leave_session, holiday_included,
                            LA.to_date,
                            weekoff_included,total_applied_days from hims_f_leave_application LA 
                            inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                            inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id 
                            left join hims_f_employee_annual_leave AN on 
                            LA.hims_f_leave_application_id=AN.leave_application_id ${deptStr}
                            where E.hospital_id=? and LA.status='APR' ${strQry} and  
                            (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                            date(?) between  from_date and to_date) ;
                            
                            select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                            holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                            date(holiday_date) between date(?) and date(?);   `,
                      values: [
                        input.year,
                        parseInt(input.month),
                        input.branch_id,
                        to_date,
                        from_date,
                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,
                        input.branch_id,
                        from_date,
                        to_date,
                      ],
                      printQuery: true,
                    })
                    .then((result) => {
                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];

                        const attResult = bulkTimesheetDataMatch({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          from_date,
                          to_date,
                          allDates: allDatesMonthYear,
                          is_ramzan,
                          RMZ_HR,
                          RMZ_MIN,
                          RMZ_HF_WH,
                          RMZ_HF_MIN,
                          ramzan_start_date: options["ramzan_start_date"],
                          ramzan_end_date: options["ramzan_end_date"],
                          workingHoursFrom,
                        });

                        mergeTimesheetData({
                          _mysql: _mysql,
                          attResult: attResult,
                          rawData: input.data,
                          attendance_type: options.attendance_type,
                          STDWH,
                          STDWM,
                          HALF_HR,
                          HALF_MIN,
                          hospital_id: input.branch_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          previewStr: previewStr,
                          allDates: allDates,
                          workingHoursFrom,
                        })
                          .then((finalResult) => {
                            req.records = {
                              hospital_id: input.branch_id,
                              from_date: from_date,
                              to_date: to_date,
                              allDates: allDates,
                              employee_id: input.employee_id,
                              department_id: input.department_id,
                              sub_department_id: input.sub_department_id,
                              year: input.year,
                              month: input.month,
                              data: finalResult,
                            };
                            next();
                          })
                          .catch((e) => {
                            _mysql.releaseConnection();
                            req.records = e;
                            next();
                          });
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          message: "Salary Already Processed ",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                } else if (options.attendance_type == "DMP") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date ,E.sub_department_id, E.full_name,E.religion_id, 
                      case when   '${options["ramzan_eligible_category"]}'='ALL'  and G.ramzan_timing='Y' then 'Y' when E.religion_id=1 and G.ramzan_timing='Y' then 'Y'
                            else 'N' end as ramzan_enployee,
                          E.date_of_joining,PR.project_id,PR.attendance_date,P.project_desc,
                          E.standard_work_hours,E.consider_overtime,
                          E.ramzan_work_hours,E.week_day from hims_d_employee E  ${deptStr} 
                          left join hims_d_employee_group G on E.employee_group_id=G.hims_d_employee_group_id
                          left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                          S.year=? and S.month=? and S.salary_type='NS' left join    hims_f_project_roster PR on E.hims_d_employee_id=PR.employee_id
                          and  PR.attendance_date between date(?) and date(?) 
                          left join  hims_d_project P on P.hims_d_project_id=PR.project_id
                          where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                          E.date_of_joining <= date(?) and
                          (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'  
                          and ( S.salary_processed is null or  S.salary_processed='N') ${strQry};                
                          
                          select hims_f_leave_application_id,LA.employee_id,leave_application_code,from_leave_session,
                          case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type, 
                          case when  L.leave_category='A' and  AN.from_normal_salary='N' then 'A' else 'O'
                          end as leave_category,
                          L.leave_description,from_date,to_leave_session,holiday_included,
                          CASE WHEN LA.employee_joined = 'N' THEN to_date ELSE DATE_SUB(LA.to_date, INTERVAL 1 DAY) END as to_date,
                          weekoff_included,total_applied_days from hims_f_leave_application LA 
                          inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                          inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id 
                          left join hims_f_employee_annual_leave AN on 
                          LA.hims_f_leave_application_id=AN.leave_application_id ${deptStr}
                          where E.hospital_id=? and LA.status='APR' ${strQry} and  
                          (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                          date(?) between  from_date and to_date) ;
                          
                          select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                          holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                          date(holiday_date) between date(?) and date(?);  `,
                      values: [
                        input.year,
                        parseInt(input.month),
                        from_date,
                        to_date,
                        input.branch_id,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                      ],
                      printQuery: true,
                    })
                    .then((result) => {
                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];

                        const attResult = bulkTimesheetRosterDataMatch({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          from_date,
                          to_date,
                          allDates: allDatesMonthYear,
                          is_ramzan,
                          RMZ_HR,
                          RMZ_MIN,
                          RMZ_HF_WH,
                          RMZ_HF_MIN,
                          ramzan_start_date: options["ramzan_start_date"],
                          ramzan_end_date: options["ramzan_end_date"],
                          workingHoursFrom,
                        });

                        mergeTimesheetData({
                          _mysql: _mysql,
                          attResult: attResult,
                          rawData: input.data,
                          attendance_type: options.attendance_type,
                          STDWH,
                          STDWM,
                          HALF_HR,
                          HALF_MIN,
                          hospital_id: input.branch_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          previewStr: previewStr,
                          allDates: allDates,
                          workingHoursFrom,
                        })
                          .then((finalResult) => {
                            req.records = {
                              hospital_id: input.branch_id,
                              from_date: from_date,
                              to_date: to_date,
                              allDates: allDates,
                              employee_id: input.employee_id,
                              department_id: input.department_id,
                              sub_department_id: input.sub_department_id,
                              year: input.year,
                              month: input.month,
                              data: finalResult,
                            };
                            next();
                          })
                          .catch((e) => {
                            _mysql.releaseConnection();
                            req.records = e;
                            next();
                          });
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          message: "Salary Already Processed ",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              } else {
                _mysql.releaseConnection();
                req.records = {
                  message: "Please upload valid file",
                  invalid_input: true,
                };
                next();
              }
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "You dont have access privilege for this feature",
                invalid_input: true,
              };
              next();
            }
          });
      } else {
        req.records = {
          message: "Please upload valid file",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  //created by irfan: before doing RAMZAN functionality
  uploadBulkManualTimeSheet_bkp_21_april_2020: (req, res, next) => {
    const utilities = new algaehUtilities();

    try {
      // const rawData = req.body.data;
      const input = req.body;
      if (
        (input.branch_id > 0 &&
          input.year > 0 &&
          input.month > 0 &&
          input.from_date != undefined &&
          input.to_date != undefined,
        input.year > 0 && input.month > 0)
      ) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "select standard_working_hours,attendance_type,salary_pay_before_end_date,payroll_payment_date from hims_d_hrms_options limit 1;",
          })
          .then((opts) => {
            const options = opts[0];

            if (
              options.attendance_type == "DM" ||
              options.attendance_type == "DMP"
            ) {
              const STDWH = options["standard_working_hours"].split(".")[0];
              const STDWM = options["standard_working_hours"].split(".")[1];
              const total_minutes = parseInt(STDWH * 60) + parseInt(STDWM);
              //half day work hour
              const HALF_HR = parseInt(
                parseInt(total_minutes / 2) / parseInt(60)
              );
              const HALF_MIN = parseInt(total_minutes / 2) % parseInt(60);

              let start_year,
                end_year,
                start_month,
                end_month,
                start_day,
                end_day,
                from_date,
                to_date = "";
              const { month, year } = input;
              //ST-from date and to date calculation
              //is cutoff
              if (
                options.salary_pay_before_end_date == "Y" &&
                options.payroll_payment_date > 0
              ) {
                if (month == 1) {
                  start_year = parseInt(year) - 1;
                  end_year = year;
                  start_month = 12;
                  end_month = 1;
                } else {
                  start_year = year;
                  end_year = year;
                  start_month = parseInt(month) - 1;
                  end_month = month;
                }

                start_day = parseInt(options.payroll_payment_date) + 1;
                end_day = options.payroll_payment_date;
              } else {
                start_year = year;
                end_year = year;
                start_month = month;
                end_month = month;
                start_day = 1;
                end_day = moment(year + "-" + month + "-01", "YYYY-MM-DD")
                  .endOf("month")
                  .format("D");
              }
              const valid_from_date = moment(
                `${start_year}-${start_month}-${start_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");

              const valid_to_date = moment(
                `${end_year}-${end_month}-${end_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");
              //END-fromdate and todate calculation

              const input_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              const input_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );

              if (
                valid_from_date <= input_from_date &&
                valid_to_date >= input_from_date &&
                input_to_date >= valid_from_date &&
                input_to_date <= valid_to_date
              ) {
                from_date = input_from_date;
                to_date = input_to_date;

                let deptStr = "";
                let strQry = "";

                if (input.department_id > 0 && !input.sub_department_id > 0) {
                  deptStr =
                    " left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id ";
                  strQry += " and SD.department_id=" + input.department_id;
                }

                if (input.sub_department_id > 0) {
                  strQry +=
                    " and E.sub_department_id=" + input.sub_department_id;
                }

                if (input.employee_group_id > 0) {
                  strQry +=
                    " and E.employee_group_id=" + input.employee_group_id;
                }

                if (input.employee_id > 0) {
                  strQry += " and E.hims_d_employee_id=" + input.employee_id;
                }

                let previewStr = `select  hims_f_daily_time_sheet_id,E.employee_code,E.full_name, employee_id,attendance_date,
                                status,worked_hours from hims_d_employee E
                                inner join hims_f_daily_time_sheet  T on E.hims_d_employee_id=T.employee_id 
                                and T.attendance_date between date('${from_date}') and date('${to_date}') ${deptStr}
                                where E.hospital_id= ${input.branch_id} and E.suspend_salary <>'Y' and                           
                                E.record_status='A' and E.employee_status<>'I' and (E.exit_date is null or E.exit_date >date('${from_date}') )                              
                                ${strQry}    ; `;

                const allDates = getDaysArray(
                  new Date(from_date),
                  new Date(to_date)
                );

                const allDatesMonthYear = getDaysMonthArray(
                  new Date(from_date),
                  new Date(to_date)
                );

                if (options.attendance_type == "DM") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date , E.sub_department_id, E.religion_id, E.date_of_joining
                            from hims_d_employee E  ${deptStr} left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                            S.year=? and S.month=?
                            where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                            E.date_of_joining <= date(?) and
                            (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'  
                            and ( S.salary_processed is null or  S.salary_processed='N') ${strQry};                
                            
                            select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,
                            case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type, L.leave_category,
                            L.leave_description,from_date,to_leave_session,to_date,holiday_included,
                            weekoff_included,total_applied_days from hims_f_leave_application LA 
                            inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                            inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id ${deptStr}
                            where E.hospital_id=? and LA.status='APR' ${strQry} and  
                            (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                            date(?) between  from_date and to_date) ;
                            
                            select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                            holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                            date(holiday_date) between date(?) and date(?);   `,
                      values: [
                        input.year,
                        parseInt(input.month),
                        input.branch_id,
                        to_date,
                        from_date,
                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,
                        input.branch_id,
                        from_date,
                        to_date,
                      ],
                      printQuery: false,
                    })
                    .then((result) => {
                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];

                        const attResult = bulkTimesheetDataMatch({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          from_date,
                          to_date,
                          allDates: allDatesMonthYear,
                        });

                        mergeTimesheetData({
                          _mysql: _mysql,
                          attResult: attResult,
                          rawData: input.data,
                          attendance_type: options.attendance_type,
                          STDWH,
                          STDWM,
                          HALF_HR,
                          HALF_MIN,
                          hospital_id: input.branch_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          previewStr: previewStr,
                          allDates: allDates,
                        })
                          .then((finalResult) => {
                            req.records = {
                              hospital_id: input.branch_id,
                              from_date: from_date,
                              to_date: to_date,
                              allDates: allDates,
                              employee_id: input.employee_id,
                              department_id: input.department_id,
                              sub_department_id: input.sub_department_id,
                              year: input.year,
                              month: input.month,
                              data: finalResult,
                            };
                            next();
                          })
                          .catch((e) => {
                            _mysql.releaseConnection();
                            req.records = e;
                            next();
                          });
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          message: "Salary Already Processed ",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                } else if (options.attendance_type == "DMP") {
                  _mysql
                    .executeQuery({
                      query: `select E.hims_d_employee_id ,E.employee_code,E.exit_date ,E.sub_department_id, E.full_name,E.religion_id, 
                          E.date_of_joining,PR.project_id,PR.attendance_date,P.project_desc
                          from hims_d_employee E  ${deptStr} left join hims_f_salary S on E.hims_d_employee_id =S.employee_id and  
                          S.year=? and S.month=? left join    hims_f_project_roster PR on E.hims_d_employee_id=PR.employee_id
                          and  PR.attendance_date between date(?) and date(?) 
                          left join  hims_d_project P on P.hims_d_project_id=PR.project_id
                          where E.hospital_id=? and E.record_status='A' and E.employee_status<>'I' and 
                          E.date_of_joining <= date(?) and
                          (E.exit_date is null or E.exit_date >date(?) )  and E.suspend_salary <>'Y'  
                          and ( S.salary_processed is null or  S.salary_processed='N') ${strQry};                
                          
                          select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,
                          case L.leave_type when 'P' then 'PL' when 'U' then 'UL'  end as leave_type, L.leave_category,
                          L.leave_description,from_date,to_leave_session,to_date,holiday_included,
                          weekoff_included,total_applied_days from hims_f_leave_application LA 
                          inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
                          inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id ${deptStr}
                          where E.hospital_id=? and LA.status='APR' ${strQry} and  
                          (from_date between date(?) and date(?) or to_date between date(?) and date(?) or
                          date(?) between  from_date and to_date) ;
                          
                          select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,
                          holiday_type,religion_id from hims_d_holiday  where hospital_id=? and
                          date(holiday_date) between date(?) and date(?);  `,
                      values: [
                        input.year,
                        parseInt(input.month),
                        from_date,
                        to_date,
                        input.branch_id,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                        from_date,
                        to_date,
                        from_date,

                        input.branch_id,
                        from_date,
                        to_date,
                      ],
                      printQuery: false,
                    })
                    .then((result) => {
                      if (result[0].length > 0) {
                        const allEmployees = result[0];
                        const allLeaves = result[1];
                        const allHolidays = result[2];

                        const attResult = bulkTimesheetRosterDataMatch({
                          allEmployees,
                          allLeaves,
                          allHolidays,
                          from_date,
                          to_date,
                          allDates: allDatesMonthYear,
                        });
                        // console.log("attResult", attResult);
                        mergeTimesheetData({
                          _mysql: _mysql,
                          attResult: attResult,
                          rawData: input.data,
                          attendance_type: options.attendance_type,
                          STDWH,
                          STDWM,
                          HALF_HR,
                          HALF_MIN,

                          hospital_id: input.branch_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          previewStr: previewStr,
                          allDates: allDates,
                        })
                          .then((finalResult) => {
                            req.records = {
                              hospital_id: input.branch_id,
                              from_date: from_date,
                              to_date: to_date,
                              allDates: allDates,
                              employee_id: input.employee_id,
                              department_id: input.department_id,
                              sub_department_id: input.sub_department_id,
                              year: input.year,
                              month: input.month,
                              data: finalResult,
                            };
                            next();
                          })
                          .catch((e) => {
                            _mysql.releaseConnection();
                            req.records = e;
                            next();
                          });
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          message: "Salary Already Processed ",
                          invalid_input: true,
                        };
                        next();
                      }
                    })
                    .catch((e) => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                }
              } else {
                _mysql.releaseConnection();
                req.records = {
                  message: "Please upload valid file",
                  invalid_input: true,
                };
                next();
              }
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "You dont have access privilege for this feature",
                invalid_input: true,
              };
              next();
            }
          });
      } else {
        req.records = {
          message: "Please upload valid file",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan:
  previewBulkTimeSheet: (req, res, next) => {
    try {
      const input = req.query;

      const _mysql = new algaehMysql();
      if (
        (input.branch_id > 0 &&
          input.year > 0 &&
          input.month > 0 &&
          input.from_date != undefined &&
          input.to_date != undefined,
        input.year > 0 && input.month > 0)
      ) {
        _mysql
          .executeQuery({
            query:
              "SELECT attendance_type,salary_pay_before_end_date,payroll_payment_date from hims_d_hrms_options limit 1; \
              select hims_f_leave_application_id, employee_code, full_name from hims_f_leave_application L \
              inner join hims_d_employee E on E.hims_d_employee_id=L.employee_id where status='PEN' and L.hospital_id=?;\
              select hims_f_leave_encash_header_id, employee_code, full_name from hims_f_leave_encash_header EH \
              inner join hims_d_employee E on E.hims_d_employee_id=EH.employee_id where authorized='PEN' and EH.hospital_id=?;\
              select hims_f_loan_application_id, employee_code, full_name from hims_f_loan_application LO \
              inner join hims_d_employee E on E.hims_d_employee_id=LO.employee_id where loan_authorized='PEN' and LO.hospital_id=?;",

            values: [input.branch_id, input.branch_id, input.branch_id],
            printQuery: true,
          })
          .then((opts) => {
            const options = opts[0][0];
            const pending_leave = opts[1];
            const employee_encash = opts[2];
            const employee_loan = opts[3];

            if (
              options.attendance_type == "DM" ||
              options.attendance_type == "DMP"
            ) {
              let start_year,
                end_year,
                start_month,
                end_month,
                start_day,
                end_day,
                from_date,
                to_date = "";
              const { month, year } = input;
              //ST-from date and to date calculation
              //is cutoff
              if (
                options.salary_pay_before_end_date == "Y" &&
                options.payroll_payment_date > 0
              ) {
                if (month == 1) {
                  start_year = parseInt(year) - 1;
                  end_year = year;
                  start_month = 12;
                  end_month = 1;
                } else {
                  start_year = year;
                  end_year = year;
                  start_month = parseInt(month) - 1;
                  end_month = month;
                }

                start_day = parseInt(options.payroll_payment_date) + 1;
                end_day = options.payroll_payment_date;
              } else {
                start_year = year;
                end_year = year;
                start_month = month;
                end_month = month;
                start_day = 1;
                end_day = moment(year + "-" + month + "-01", "YYYY-MM-DD")
                  .endOf("month")
                  .format("D");
              }
              const valid_from_date = moment(
                `${start_year}-${start_month}-${start_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");

              const valid_to_date = moment(
                `${end_year}-${end_month}-${end_day}`,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");
              //END-fromdate and todate calculation
              const input_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              const input_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );
              if (
                valid_from_date <= input_from_date &&
                valid_to_date >= input_from_date &&
                input_to_date >= valid_from_date &&
                input_to_date <= valid_to_date
              ) {
                from_date = input_from_date;
                to_date = input_to_date;

                let deptStr = "";
                let strQry = "";

                if (input.department_id > 0 && !input.sub_department_id > 0) {
                  deptStr =
                    " left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id ";
                  strQry += " and SD.department_id=" + input.department_id;
                }

                if (input.sub_department_id > 0) {
                  strQry +=
                    " and E.sub_department_id=" + input.sub_department_id;
                }

                if (input.employee_group_id > 0) {
                  strQry +=
                    " and E.employee_group_id=" + input.employee_group_id;
                }

                if (input.employee_id > 0) {
                  strQry += " and E.hims_d_employee_id=" + input.employee_id;
                }
                _mysql
                  .executeQuery({
                    query: `select  hims_f_daily_time_sheet_id,E.employee_code,E.full_name, employee_id,attendance_date,
                  status,worked_hours,T.project_id, P.project_desc, H.hospital_name, P.abbreviation from hims_d_employee E
                inner join hims_f_daily_time_sheet  T on E.hims_d_employee_id=T.employee_id 
                left join hims_d_project P on P.hims_d_project_id=T.project_id 
                inner join hims_d_hospital H on H.hims_d_hospital_id=T.hospital_id 
                 and T.attendance_date between date(?) and date(?)  ${deptStr}
                where E.hospital_id=? and E.suspend_salary <>'Y' and
                E.record_status='A' and E.employee_status<>'I' and (E.exit_date is null or E.exit_date >date(?) )
                ${strQry}  ; `,
                    values: [from_date, to_date, input.branch_id, from_date],
                    printQuery: true,
                  })
                  .then((prevResult) => {
                    _mysql.releaseConnection();

                    if (prevResult.length > 0) {
                      const allDates = getDaysArray(
                        new Date(from_date),
                        new Date(to_date)
                      );

                      const outputArray = [];
                      _.chain(prevResult)
                        .groupBy((g) => g.employee_id)
                        .forEach((emp) => {
                          const emp_details = {
                            employee_id: emp[0].employee_id,
                            employee_code: emp[0].employee_code,
                            employee_name: emp[0].full_name,
                            project_id: emp[0].project_id,
                            project_desc: emp[0].project_desc,
                            hospital_name: emp[0].hospital_name,
                            abbreviation: emp[0].abbreviation,
                          };
                          const data = [];
                          allDates.forEach((dat) => {
                            const attUplded = emp.find((e) => {
                              return e.attendance_date == dat;
                            });
                            if (attUplded) {
                              data.push({
                                hims_f_daily_time_sheet_id:
                                  attUplded.hims_f_daily_time_sheet_id,
                                attendance_date: attUplded.attendance_date,
                                status: attUplded.status,
                                worked_hours: attUplded.worked_hours,
                                project_id: attUplded.project_id,
                                project_desc: attUplded.project_desc,
                                hospital_name: attUplded.hospital_name,
                                abbreviation: attUplded.abbreviation,
                              });
                            } else {
                              data.push({
                                hims_f_daily_time_sheet_id: null,
                                attendance_date: dat,
                                status: "N",
                                worked_hours: "0.00",
                              });
                            }
                          });
                          outputArray.push({
                            ...emp_details,
                            roster: _.chain(data)
                              .sortBy((s) =>
                                parseInt(
                                  moment(
                                    s.attendance_date,
                                    "YYYY-MM-DD"
                                  ).format("MMDD")
                                )
                              )
                              .value(),
                          });
                        })
                        .value();
                      req.records = {
                        hospital_id: input.branch_id,
                        from_date: from_date,
                        to_date: to_date,
                        allDates: allDates,
                        employee_id: input.employee_id,
                        department_id: input.department_id,
                        sub_department_id: input.sub_department_id,
                        year: input.year,
                        month: input.month,
                        data: _.chain(outputArray).sortBy((s) =>
                          parseInt(s.employee_code)
                        ),
                        pending_leave: pending_leave,
                        employee_encash: employee_encash,
                        employee_loan: employee_loan,
                        invalid_input: false,
                      };

                      next();
                    } else {
                      req.records = {
                        message: "No Time sheet data found",
                        invalid_input: true,
                        pending_leave: pending_leave,
                        employee_encash: employee_encash,
                        employee_loan: employee_loan,
                        allDates: [],
                      };
                      next();
                    }
                  })
                  .catch((e) => {
                    _mysql.releaseConnection();
                    next(e);
                  });
              } else {
                _mysql.releaseConnection();
                req.records = {
                  message: "Please select valid date range",
                  invalid_input: true,
                };
                next();
              }
            } else {
              _mysql.releaseConnection();
              req.records = {
                message: "You dont have access privilege for this feature",
                invalid_input: true,
              };
              next();
            }
          });
      } else {
        req.records = {
          message: "Please valid input",
          invalid_input: true,
        };
        next();
      }
    } catch (e) {
      next(e);
    }
  },

  //created by irfan:
  postBulkTimeSheetMonthWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.query;

    if (input.hospital_id > 0 && input.year > 0 && input.month > 0) {
      let strQry = "";
      let deptStr = "";
      if (input.employee_id > 0) {
        strQry += " and employee_id =" + input.employee_id;
      }

      if (input.sub_department_id > 0) {
        strQry += " and E.sub_department_id=" + input.sub_department_id;
      }

      if (input.employee_group_id > 0) {
        strQry += " and E.employee_group_id=" + input.employee_group_id;
      }

      if (input.department_id > 0 && !input.sub_department_id > 0) {
        deptStr =
          " left join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id ";
        strQry += " and SD.department_id=" + input.department_id;
      }
      _mysql
        .executeQuery({
          query: `SELECT  attendance_type,salary_pay_before_end_date,payroll_payment_date,
          salary_calendar,salary_calendar_fixed_days,standard_working_hours,leave_salary_payment_days FROM hims_d_hrms_options limit 1; `,
          values: [],
          printQuery: false,
        })
        .then((result) => {
          const options = result[0];

          if (
            options.attendance_type == "DM" ||
            options.attendance_type == "DMP"
          ) {
            const STDWH = options["standard_working_hours"].split(".")[0];
            const STDWM = options["standard_working_hours"].split(".")[1];
            const total_minutes = parseInt(STDWH * 60) + parseInt(STDWM);
            //half day work hour
            const HALF_HR = parseInt(
              parseInt(total_minutes / 2) / parseInt(60)
            );
            const HALF_MIN = parseInt(total_minutes / 2) % parseInt(60);

            // console.log("options.salary_pay_before_end_date", options.salary_pay_before_end_date)
            // console.log("options.payroll_payment_date", options.payroll_payment_date)
            if (
              options.salary_pay_before_end_date == "Y" &&
              options.payroll_payment_date > 0
            ) {
              // console.log("1")
              processBulkAtt_with_cutoff({
                _mysql,
                options,
                strQry,
                deptStr,
                input,
                STDWH,
                STDWM,
                HALF_HR,
                HALF_MIN,
                user_id: req.userIdentity.algaeh_d_app_user_id,
              })
                .then((result) => {
                  req.records = result;
                  next();
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  req.records = e;
                  next(e);
                });
            } else {
              // console.log("2")
              processBulkAtt_Normal({
                _mysql,
                options,
                strQry,
                deptStr,
                input,
                STDWH,
                STDWM,
                HALF_HR,
                HALF_MIN,
                user_id: req.userIdentity.algaeh_d_app_user_id,
              })
                .then((result) => {
                  req.records = result;
                  next();
                })
                .catch((e) => {
                  _mysql.releaseConnection();
                  req.records = e;
                  next(e);
                });
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              message: "Please validate attendance_type in settings",
              invalid_input: true,
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please provide valid input",
      };

      next();
      return;
    }
  },
};
