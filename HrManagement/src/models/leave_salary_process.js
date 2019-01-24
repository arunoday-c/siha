import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
import { processAttendance } from "./attendance";
import { processSalary, getSalaryProcess } from "./salary";
import Sync from "sync";
module.exports = {
  getLeaveSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _leaveSalary = req.query;

    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_leave_id,leave_category FROM hims_d_leave where leave_category='A';",
        printQuery: true
      })
      .then(annul_leave => {
        let leave_id = annul_leave[0].hims_d_leave_id;
        let leave_category = annul_leave[0].leave_category;
        _mysql
          .executeQuery({
            query:
              "SELECT hims_f_leave_application_id, from_date, to_date, leave_type, total_approved_days FROM hims_f_leave_application \
              where  status='APR' and cancelled = 'N' and leave_id=? and employee_id=?;",
            values: [leave_id, _leaveSalary.employee_id],
            printQuery: true
          })
          .then(annul_leave_app => {
            if (annul_leave_app.length > 0) {
              let leave_salary_detail = [];
              let from_date = moment(annul_leave_app[0].from_date).format(
                "YYYY-MM-DD"
              );
              let to_date = moment(annul_leave_app[0].to_date).format(
                "YYYY-MM-DD"
              );

              let to_date_month = moment(annul_leave_app[0].to_date).format(
                "M"
              );

              let leave_start_date = moment(
                annul_leave_app[0].from_date
              ).format("YYYY-MM-DD");

              while (from_date <= to_date) {
                let fromDate_firstDate = null;
                let fromDate_lastDate = null;

                let date_year = moment(from_date).year();
                let date_month = moment(from_date).format("M");

                let start_date = moment(from_date).add(-1, "days");
                let no_of_days = 0;
                fromDate_firstDate = moment(from_date)
                  .startOf("month")
                  .format("YYYY-MM-DD");
                fromDate_lastDate = moment(from_date)
                  .endOf("month")
                  .format("YYYY-MM-DD");

                if (to_date_month == date_month) {
                  start_date = moment(fromDate_firstDate).add(-1, "days");
                  no_of_days = moment(to_date).diff(moment(start_date), "days");
                } else {
                  no_of_days = moment(fromDate_lastDate).diff(
                    moment(start_date),
                    "days"
                  );
                }
                from_date = moment(fromDate_lastDate)
                  .add(1, "days")
                  .format("YYYY-MM-DD");

                leave_salary_detail.push({
                  year: date_year,
                  month: date_month,
                  start_date: fromDate_firstDate,
                  end_date: fromDate_lastDate,
                  leave_start_date: leave_start_date,
                  leave_end_date: to_date,
                  leave_period: no_of_days,
                  leave_category: leave_category,
                  leave_application_id:
                    annul_leave_app[0].hims_f_leave_application_id,
                  gross_amount: "10000.00",
                  net_amount: parseFloat("12000.00"),
                  salary_header_id: 6770
                });
              }

              let result = {
                year: moment(annul_leave_app[0].from_date).year(),
                month: moment(annul_leave_app[0].from_date).format("M"),
                leave_start_date: leave_start_date,
                leave_end_date: to_date,
                leave_salary_detail: leave_salary_detail,
                leave_period: _.sumBy(leave_salary_detail, s => {
                  return s.leave_period;
                }),
                leave_amount: "25000.00",
                airfare_amount: 0
              };
              _mysql.releaseConnection();
              req.records = result;
              next();
            } else {
              _mysql.releaseConnection();
              req.records = [];
              next();
            }
          })
          .catch(e => {
            next(e);
          });
      })
      .catch(e => {
        next(e);
      });
  },

  processLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _leaveSalary = req.query;

    let start_date = moment(_leaveSalary.leave_start_date).format("YYYY-MM-DD");
    let end_date = moment(_leaveSalary.leave_end_date).format("YYYY-MM-DD");
    let end_date_month = moment(_leaveSalary.leave_end_date).format("M");
    delete req.query.leave_end_date;
    utilities
      .AlgaehUtilities()
      .logger()
      .log("start_date:", start_date);
    utilities
      .AlgaehUtilities()
      .logger()
      .log("end_date:", end_date);

    utilities
      .AlgaehUtilities()
      .logger()
      .log("end_date_month:", end_date_month);

    _mysql
      .executeQueryWithTransaction({
        query:
          "select hospital_id from hims_d_employee where hims_d_employee_id=?",
        values: [req.query.hims_d_employee_id],
        printQuery: true
      })
      .then(employee_result => {
        let hospital_id = employee_result.hospital_id;

        while (start_date <= end_date) {
          Sync(() => {
            try {
              let fromDate_lastDate = null;

              let date_year = moment(start_date).year();
              let date_month = moment(start_date).format("M");

              utilities
                .AlgaehUtilities()
                .logger()
                .log("date_year:", date_year);
              utilities
                .AlgaehUtilities()
                .logger()
                .log("date_month:", date_month);
              req.query.leave_salary = "N";
              req.query.yearAndMonth = date_year + "-" + date_month + "-01";
              if (end_date_month == date_month) {
                req.query.leave_end_date = end_date;
                req.query.leave_salary = "Y";
              }

              utilities
                .AlgaehUtilities()
                .logger()
                .log("req.query:", req.query);

              req.mySQl = _mysql;
              // processAttendance(req, res, next);

              let _attendance = processAttendance.sync(null, req, res, next);
              let _attendance_result = _attendance.result;
              utilities
                .AlgaehUtilities()
                .logger()
                .log("_attendance_result:", _attendance_result);
              _attendance_result
                .then(attendance_result => {
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("attendance_result:", attendance_result);

                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = attendance_result;
                    next();
                  });
                  // delete req.query;

                  // req.query.year = date_year;
                  // req.query.month = date_month;
                  // req.query.hospital_id = hospital_id;
                  // req.query.employee_id = req.query.employee_id;

                  // req.query.leave_salary = "N";
                  // if (end_date_month == date_month) {
                  //   req.query.leave_salary = "Y";
                  // }

                  // utilities
                  //   .AlgaehUtilities()
                  //   .logger()
                  //   .log("req.query:", req.query);

                  // processSalary
                  //   .sync(null, req, res, next)
                  //   .then(salary_result => {
                  //     utilities
                  //       .AlgaehUtilities()
                  //       .logger()
                  //       .log("salary_result:", salary_result);

                  //     getSalaryProcess.sync(null, req, res, next).then(res => {
                  //       _mysql.commitTransaction(() => {
                  //         _mysql.releaseConnection();
                  //         req.records = {};
                  //         next();
                  //       });
                  //     });
                  //   })
                  //   .catch(e => {
                  //     _mysql.rollBackTransaction(() => {
                  //       next(e);
                  //     });
                  //   });
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                });

              fromDate_lastDate = moment(start_date)
                .endOf("month")
                .format("YYYY-MM-DD");

              start_date = moment(fromDate_lastDate)
                .add(1, "days")
                .format("YYYY-MM-DD");
            } catch (e) {
              console.log("error", e);
            }
          });
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  InsertLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    let inputParam = { ...req.body };
    let leave_salary_number = "";

    utilities
      .AlgaehUtilities()
      .logger()
      .log("inputParam: ", inputParam);

    _mysql
      .generateRunningNumber({
        modules: ["LEAVE_SALARY"]
      })
      .then(generatedNumbers => {
        leave_salary_number = generatedNumbers[0];
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_leave_salary_header` (leave_salary_number,employee_id,year,month,\
                leave_start_date,leave_end_date,salary_amount,leave_amount,\
                airfare_amount,total_amount,leave_period,status,created_date,created_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers[0],
              inputParam.employee_id,
              inputParam.year,
              inputParam.month,
              inputParam.leave_start_date,
              inputParam.leave_end_date,
              inputParam.salary_amount,
              inputParam.leave_amount,
              inputParam.airfare_amount,
              inputParam.total_amount,
              inputParam.leave_period,
              inputParam.status,
              new Date(),
              req.userIdentity.algaeh_d_app_user_id
            ],
            printQuery: true
          })
          .then(leave_header => {
            let IncludeValues = [
              "year",
              "month",
              "start_date",
              "end_date",
              "leave_start_date",
              "leave_end_date",
              "leave_application_id",
              "leave_period",
              "leave_category",
              "salary_header_id",
              "gross_amount",
              "net_amount"
            ];

            _mysql
              .executeQuery({
                query: "INSERT INTO hims_f_leave_salary_detail(??) VALUES ?",
                values: inputParam.leave_salary_detail,
                includeValues: IncludeValues,
                extraValues: {
                  leave_salary_header_id: leave_header.insertId
                },
                bulkInsertOrUpdate: true,
                printQuery: true
              })
              .then(leave_detail => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = {
                    leave_salary_number: leave_salary_number
                  };
                  next();
                });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
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
  }
};
