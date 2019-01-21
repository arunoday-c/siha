import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
import { processAttendance } from "./attendance";
import { processSalary } from "./salary";
import Sync from "sync";
module.exports = {
  getLeaveSalaryProcess: (req, res, next) => {
    const _mysql = new algaehMysql();
    const _leaveSalary = req.query;

    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';",
        printQuery: true
      })
      .then(annul_leave => {
        let leave_id = annul_leave[0].hims_d_leave_id;
        _mysql
          .executeQuery({
            query:
              "SELECT from_date, to_date, leave_type, total_approved_days FROM hims_f_leave_application \
              where  status='APR' and leave_id=? and employee_id=?;",
            values: [leave_id, _leaveSalary.employee_id],
            printQuery: true
          })
          .then(annul_leave_app => {
            let leave_salary_detail = [];
            let from_date = moment(annul_leave_app[0].from_date).format(
              "YYYY-MM-DD"
            );
            let to_date = moment(annul_leave_app[0].to_date).format(
              "YYYY-MM-DD"
            );

            let to_date_month = moment(annul_leave_app[0].to_date).format("M");

            let leave_start_date = moment(annul_leave_app[0].from_date).format(
              "YYYY-MM-DD"
            );

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
                leave_type: annul_leave_app[0].leave_type
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
              })
            };
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
        query: "select 1"
      })
      .then(result => {
        while (start_date <= end_date) {
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
          Sync(() => {
            processAttendance
              .sync(null, req, res, next)
              .then(res => {
                processSalary
                  .sync(null, req, res, next)
                  .then(res => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = {};
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
          });

          fromDate_lastDate = moment(start_date)
            .endOf("month")
            .format("YYYY-MM-DD");

          start_date = moment(fromDate_lastDate)
            .add(1, "days")
            .format("YYYY-MM-DD");
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  }
};
