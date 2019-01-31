import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import utilities from "algaeh-utilities";
import moment from "moment";
import { processAttendance } from "./attendance";
import { processSalary } from "./salary";

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
              "SELECT hims_f_leave_application_id, from_date, to_date, leave_type, total_approved_days, E.hospital_id FROM \
              hims_f_leave_application,  hims_d_employee E \
              where E.hims_d_employee_id = hims_f_leave_application.employee_id and status='APR' and processed = 'N' and leave_id=? and \
              employee_id=?;",
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
                    annul_leave_app[0].hims_f_leave_application_id
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
                leave_application_id:
                  annul_leave_app[0].hims_f_leave_application_id,
                hospital_id: annul_leave_app[0].hospital_id
              };
              _mysql.releaseConnection();
              req.records = result;
              next();
            } else {
              _mysql.releaseConnection();
              req.records = {};
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

    let strGetdataQry = "";
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
          "select hospital_id,airfare_process from hims_d_employee where hims_d_employee_id=?;\
          SELECT balance_leave_days,balance_leave_salary_amount,balance_airticket_amount,airfare_months FROM \
          hims_f_employee_leave_salary_header where employee_id=? and `year`=?; \
          SELECT EE.employee_id,EE.earnings_id,EE.amount FROM hims_d_earning_deduction ED, \
          hims_d_employee_earnings EE where EE.earnings_id=ED.hims_d_earning_deduction_id and \
          ED.annual_salary_comp='Y' and EE.employee_id=?;",
        values: [
          req.query.hims_d_employee_id,
          req.query.hims_d_employee_id,
          req.query.year,
          req.query.hims_d_employee_id
        ],
        printQuery: true
      })
      .then(all_result => {
        let employee_result = all_result[0];
        let employee_leave_salary = all_result[1][0];
        let annual_leave_result = all_result[2];

        utilities
          .AlgaehUtilities()
          .logger()
          .log("all_result:", all_result);

        if (employee_leave_salary == undefined) {
          _mysql.commitTransaction((error, result) => {
            _mysql.releaseConnection();
            req.records = { message: "No Leave exists" };
            req.flag = 1;
            next();
          });
          return;
        }
        utilities
          .AlgaehUtilities()
          .logger()
          .log("employee_result:", employee_result[0].hospital_id);

        utilities
          .AlgaehUtilities()
          .logger()
          .log("employee_leave_salary:", employee_leave_salary);
        utilities
          .AlgaehUtilities()
          .logger()
          .log("annual_leave_result:", annual_leave_result);

        let balance_leave_days =
          parseFloat(employee_leave_salary.balance_leave_days) -
          parseFloat(req.query.leave_period);
        let leave_amount = 0;
        let airfare_amount =
          employee_result[0].airfare_process === "N"
            ? 0
            : employee_leave_salary.balance_airticket_amount;

        utilities
          .AlgaehUtilities()
          .logger()
          .log("balance_leave_days:", balance_leave_days);

        if (balance_leave_days > 0) {
          for (let k = 0; k < annual_leave_result.length; k++) {
            let per_day_sal = 0;
            per_day_sal = parseFloat(annual_leave_result[k].amount) * 12;
            per_day_sal = per_day_sal / 365;
            per_day_sal = per_day_sal * req.query.leave_period;

            leave_amount = leave_amount + per_day_sal;
          }

          utilities
            .AlgaehUtilities()
            .logger()
            .log("leave_amount:", leave_amount);

          req.query.hospital_id = employee_result[0].hospital_id;
          req.query.employee_id = req.query.hims_d_employee_id;

          const syscCall = async function() {
            while (start_date <= end_date) {
              try {
                let fromDate_lastDate = null;

                let date_year = moment(start_date).year();
                let date_month = moment(start_date).format("M");

                req.query.year = date_year;
                req.query.month = date_month;

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("date_year:", date_year);
                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("date_month:", date_month);
                req.query.leave_salary = "N";
                req.query.yearAndMonth = moment(
                  date_year + "-" + date_month + "-01",
                  "YYYY-MM-DD"
                )._d;
                if (end_date_month == date_month) {
                  req.query.leave_end_date = end_date;
                  req.query.leave_salary = "Y";
                }

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("req.query:", req.query);

                req.mySQl = _mysql;

                let _attandance = await processAttendance(req, res, next);

                req.mySQl = _mysql;
                let _sarary = await processSalary(req, res, next);

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("_sarary:", _sarary);

                _sarary = parseFloat(_sarary) + 1;

                Promise.all([_attandance, _sarary]).then(rse => {
                  strGetdataQry +=
                    "select hims_f_salary_id,salary_number,month,year,employee_id,salary_date,gross_salary,net_salary from hims_f_salary where hims_f_salary_id=" +
                    _sarary +
                    "; ";

                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("strGetdataQry:", strGetdataQry);

                  fromDate_lastDate = moment(start_date)
                    .endOf("month")
                    .format("YYYY-MM-DD");

                  start_date = moment(fromDate_lastDate)
                    .add(1, "days")
                    .format("YYYY-MM-DD");
                });
              } catch (e) {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              }
            }

            _mysql
              .executeQueryWithTransaction({
                query: strGetdataQry,
                printQuery: true
              })
              .then(Salary_result => {
                _mysql.commitTransaction((error, result) => {
                  _mysql.releaseConnection();
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("Salary_result:", Salary_result);

                  if (error) {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  } else {
                    let result_data = [];
                    let final_result = [];

                    for (let i = 0; i < Salary_result.length; i++) {
                      if (Array.isArray(Salary_result[i])) {
                        Array.prototype.push.apply(
                          result_data,
                          Salary_result[i]
                        );
                      } else {
                        result_data.push(Salary_result[i]);
                      }

                      utilities
                        .AlgaehUtilities()
                        .logger()
                        .log("result_data:", result_data);
                    }

                    let amount_data = [];
                    amount_data.push({
                      leave_amount: leave_amount,
                      airfare_amount: airfare_amount
                    });

                    final_result.push(result_data, amount_data);
                    utilities
                      .AlgaehUtilities()
                      .logger()
                      .log("final_result:", final_result);

                    req.records = final_result;
                    next();
                  }
                });
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          };
          syscCall();
        } else {
          _mysql.commitTransaction((error, result) => {
            _mysql.releaseConnection();
            req.records = { message: "Dont have enough leaves" };
            req.flag = 1;
            next();
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
        utilities
          .AlgaehUtilities()
          .logger()
          .log("leave_salary_number: ", generatedNumbers[0]);

        leave_salary_number = generatedNumbers[0];
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_leave_salary_header` (leave_salary_number,leave_salary_date,employee_id,year,month,\
                leave_start_date,leave_end_date,salary_amount,leave_amount,\
                airfare_amount,total_amount,leave_period,status,created_date,created_by)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            values: [
              generatedNumbers[0],
              moment(inputParam.leave_salary_date).format("YYYY-MM-DD"),
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
            utilities
              .AlgaehUtilities()
              .logger()
              .log("leave_header: ", leave_header);

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
                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("leave_salary_detail: ", inputParam.leave_salary_detail);

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("leave_detail: ", leave_detail);

                let leave_application_id = _.chain(
                  inputParam.leave_salary_detail
                )
                  .groupBy("leave_application_id")
                  .map(function(items, data) {
                    utilities
                      .AlgaehUtilities()
                      .logger()
                      .log("data: ", data);
                    return data;
                  })
                  .value();

                utilities
                  .AlgaehUtilities()
                  .logger()
                  .log("leave_application_id: ", leave_application_id);

                _mysql
                  .executeQuery({
                    query:
                      "update hims_f_leave_application SET processed='Y' where hims_f_leave_application_id in (?)",
                    values: [leave_application_id],
                    printQuery: true
                  })
                  .then(leave_application => {
                    const _salaryHeader_id = _.map(
                      inputParam.leave_salary_detail,
                      o => {
                        return o.salary_header_id;
                      }
                    );

                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE hims_f_salary SET salary_processed = 'Y' where hims_f_salary_id in (?)",
                        values: [_salaryHeader_id],
                        printQuery: true
                      })
                      .then(leave_application => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = {
                            leave_salary_number: leave_salary_number
                          };
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
  },

  getLeaveSalary: (req, res, next) => {
    const _mysql = new algaehMysql();
    const inputParam = req.query;

    let leaveSalary_header = [];

    _mysql
      .executeQuery({
        query:
          "select hims_f_leave_salary_header_id,leave_salary_date,employee_id,salary_amount,leave_amount,airfare_amount,\
          total_amount,leave_period, E.employee_code, E.full_name  as employee_name, E.hospital_id\
          from hims_f_leave_salary_header LSH, hims_d_employee E where LSH.employee_id = E.hims_d_employee_id  and \
          hims_f_leave_salary_header_id = ?; ",

        values: [inputParam.hims_f_leave_salary_header_id],
        printQuery: true
      })
      .then(leave_salary_header => {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("leave_salary_header: ", leave_salary_header);

        if (leave_salary_header.length > 0) {
          const leave_salary_header_id = leave_salary_header.map(item => {
            return item.hims_f_leave_salary_header_id;
          });
          leaveSalary_header = leave_salary_header[0];
          utilities
            .AlgaehUtilities()
            .logger()
            .log("leaveSalary_header: ", leaveSalary_header);

          _mysql
            .executeQuery({
              query:
                "select LSD.year,LSD.month,LSD.start_date,LSD.end_date,LSD.leave_start_date,LSD.leave_end_date,LSD.leave_category,\
                LSD.leave_period,LSD.gross_amount, LSD.net_amount,SL.salary_number as salary_no,SL.salary_date from \
                hims_f_leave_salary_detail LSD, hims_f_salary SL where  LSD.salary_header_id=SL.hims_f_salary_id\
                and  leave_salary_header_id= ?;",
              values: [leave_salary_header_id],
              printQuery: true
            })
            .then(leave_salary_detail => {
              _mysql.commitTransaction(() => {
                _mysql.releaseConnection();
                req.records = {
                  ...leaveSalary_header,
                  ...{ leave_salary_detail }
                };
                next();
              });
            })
            .catch(e => {
              next(e);
            });
        } else {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = leaveEncash_header;
            next();
          });
        }
      })
      .catch(e => {
        next(e);
      });
  }
};
