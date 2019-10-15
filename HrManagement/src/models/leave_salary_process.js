import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";
// import mysql from "mysql";
import attendance from "./attendance";
import salary from "./salary";

const { newProcessSalary } = salary;
const { processAttendance } = attendance;

export default {
  getLeaveSalaryProcess: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const _leaveSalary = req.query;

      const utilities = new algaehUtilities();

      // utilities.logger().log("getLeaveSalaryProcess: ");
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
                "SELECT hims_f_leave_application_id, from_date, to_date, leave_type, total_approved_days, \
                E.hospital_id FROM hims_f_leave_application LA inner join  hims_d_employee E \
                on E.hims_d_employee_id = LA.employee_id left join  hims_f_employee_annual_leave AL \
                on LA.hims_f_leave_application_id = AL.leave_application_id where AL.from_normal_salary = 'N' \
                and status='APR' and processed = 'N' and leave_id=? and LA.employee_id=?; select * from hims_d_hrms_options;",
              values: [leave_id, _leaveSalary.employee_id],
              printQuery: true
            })
            .then(annul_leave => {
              let annul_leave_app = annul_leave[0];
              let hrms_options = annul_leave[1][0];

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

                let from_date_month = moment(
                  annul_leave_app[0].from_date
                ).format("M");

                if (hrms_options.attendance_starts === "PM") {
                  let from_selected_day = moment(from_date).format("DD");
                  let to_selected_day = moment(to_date).format("DD");

                  if (
                    parseFloat(from_selected_day) >=
                    parseFloat(hrms_options.at_st_date)
                  ) {
                    from_date_month = parseFloat(from_date_month) + 1;
                  } else {
                    from_date_month = parseFloat(from_date_month);
                  }

                  if (
                    parseFloat(to_selected_day) >=
                    parseFloat(hrms_options.at_st_date)
                  ) {
                    to_date_month = parseFloat(to_date_month) + 1;
                  } else {
                    to_date_month = parseFloat(to_date_month);
                  }
                } else {
                  from_date_month = parseFloat(from_date_month);
                }

                let leave_start_date = moment(
                  annul_leave_app[0].from_date
                ).format("YYYY-MM-DD");
                console.log("from_date", from_date);
                console.log("to_date", to_date);

                while (from_date <= to_date) {
                  console.log("to_date_month", to_date_month);

                  let fromDate_firstDate = null;
                  let fromDate_lastDate = null;

                  let date_year = moment(from_date).year();
                  let date_month = moment(from_date).format("M");

                  date_month = parseFloat(date_month);
                  // utilities.logger().log("from_date: ", from_date);
                  // utilities.logger().log("to_date: ", to_date);

                  let start_date = moment(from_date).add(-1, "days");

                  let no_of_days = 0;

                  if (hrms_options.attendance_starts === "PM") {
                    let selected_year = moment(from_date).year();
                    let selected_month = moment(from_date).format("M");
                    let selected_day = moment(from_date).format("DD");
                    console.log("selected_day", selected_day);
                    console.log("at_st_date", hrms_options.at_st_date);

                    if (
                      parseFloat(selected_day) >=
                      parseFloat(hrms_options.at_st_date)
                    ) {
                      date_month = date_month + 1;
                      console.log("date_month in if con:", date_month);
                    }

                    console.log("date_month", date_month);

                    if (to_date_month === date_month) {
                      console.log("Im here");
                      fromDate_firstDate = moment(
                        selected_year +
                          "-" +
                          selected_month +
                          "-" +
                          hrms_options.at_st_date,
                        "YYYY-MM-DD"
                      ).format("YYYY-MM-DD");

                      fromDate_lastDate = moment(
                        selected_year +
                          "-" +
                          selected_month +
                          "-" +
                          hrms_options.at_end_date
                      )
                        .add(1, "M")
                        .format("YYYY-MM-DD");
                    } else {
                      fromDate_firstDate = moment(
                        selected_year +
                          "-" +
                          selected_month +
                          "-" +
                          hrms_options.at_st_date,
                        "YYYY-MM-DD"
                      )
                        .add(-1, "M")
                        .format("YYYY-MM-DD");

                      fromDate_lastDate = moment(
                        selected_year +
                          "-" +
                          selected_month +
                          "-" +
                          hrms_options.at_end_date
                      ).format("YYYY-MM-DD");
                    }
                  } else {
                    fromDate_firstDate = moment(from_date)
                      .startOf("month")
                      .format("YYYY-MM-DD");
                    fromDate_lastDate = moment(from_date)
                      .endOf("month")
                      .format("YYYY-MM-DD");
                  }

                  console.log("fromDate_firstDate", fromDate_firstDate);
                  console.log("fromDate_lastDate", fromDate_lastDate);
                  if (to_date_month == date_month) {
                    // console.log("Im here 1");
                    // console.log("from_date_month", from_date_month);
                    // console.log("date_month", date_month);
                    if (from_date_month == date_month) {
                      start_date = moment(from_date).add(-1, "days");
                      no_of_days = moment(to_date).diff(
                        moment(start_date),
                        "days"
                      );
                    } else {
                      start_date = moment(fromDate_firstDate).add(-1, "days");
                      no_of_days = moment(to_date).diff(
                        moment(start_date),
                        "days"
                      );
                    }
                  } else {
                    // utilities.logger().log("start_date: ", start_date);
                    no_of_days = moment(fromDate_lastDate).diff(
                      moment(start_date),
                      "days"
                    );
                  }
                  from_date = moment(fromDate_lastDate)
                    .add(1, "days")
                    .format("YYYY-MM-DD");

                  // utilities.logger().log("no_of_days: ", no_of_days);
                  leave_salary_detail.push({
                    year: date_year,
                    month: String(date_month).toString(),
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
    } catch (e) {
      next(e);
    }
  },

  processLeaveSalary: (req, res, next) => {
    try {
      const utilities = new algaehUtilities();

      utilities.logger().log("processLeaveSalary: ");
      const _mysql = new algaehMysql();
      const _leaveSalary = req.query;

      let start_date = moment(_leaveSalary.leave_start_date).format("YYYYMMDD");
      let end_date = moment(_leaveSalary.leave_end_date).format("YYYYMMDD");
      let end_date_month = moment(_leaveSalary.leave_end_date).format("M");

      let strGetdataQry = "";
      delete req.query.leave_end_date;

      _mysql
        .executeQuery({
          query:
            "select hospital_id,airfare_process from hims_d_employee where hims_d_employee_id=?;\
          SELECT balance_leave_days,balance_leave_salary_amount,balance_airticket_amount,airfare_months FROM \
          hims_f_employee_leave_salary_header where employee_id=?; \
          SELECT EE.employee_id,EE.earnings_id,EE.amount FROM hims_d_earning_deduction ED, \
          hims_d_employee_earnings EE where EE.earnings_id=ED.hims_d_earning_deduction_id and \
          ED.annual_salary_comp='Y' and EE.employee_id=?;select * from hims_d_hrms_options;",
          values: [
            req.query.hims_d_employee_id,
            req.query.hims_d_employee_id,
            req.query.hims_d_employee_id
          ],
          printQuery: true
        })
        .then(all_result => {
          let employee_result = all_result[0];
          let employee_leave_salary = all_result[1][0];
          let annual_leave_result = all_result[2];
          let hrms_options = all_result[3];

          utilities.logger().log("hrms_options: ", hrms_options);

          if (employee_leave_salary == undefined) {
            _mysql.releaseConnection();
            req.records = { message: "No Leave exists" };
            req.flag = 1;
            next();
            return;
          }

          let balance_leave_days =
            parseFloat(employee_leave_salary.balance_leave_days) -
            parseFloat(req.query.leave_period);
          let leave_amount = 0;
          let airfare_amount =
            employee_result[0].airfare_process === "N"
              ? 0
              : employee_leave_salary.balance_airticket_amount;
          let intValue = 0;
          if (balance_leave_days > 0) {
            for (let k = 0; k < annual_leave_result.length; k++) {
              let per_day_sal = 0;
              per_day_sal = parseFloat(annual_leave_result[k].amount) * 12;
              per_day_sal = per_day_sal / 365;
              per_day_sal = per_day_sal * req.query.leave_period;

              leave_amount = leave_amount + per_day_sal;
            }

            req.query.hospital_id = employee_result[0].hospital_id;
            req.query.employee_id = req.query.hims_d_employee_id;

            const syscCall = async function() {
              while (start_date <= end_date) {
                utilities.logger().log("start start_date: ", start_date);
                utilities.logger().log("start end_date: ", end_date);
                try {
                  let fromDate_lastDate = null;

                  req.query.leave_salary = "N";
                  let date_year = moment(start_date).year();
                  let date_month = moment(start_date).format("M");

                  if (hrms_options[0].attendance_starts === "PM") {
                    let selected_year = moment(start_date).year();
                    let selected_month = moment(start_date).format("M");
                    let selected_day = moment(start_date).format("DD");

                    if (
                      parseFloat(selected_day) ===
                      parseFloat(hrms_options[0].at_st_date)
                    ) {
                      start_date = moment(start_date)
                        .add(1, "M")
                        .format("YYYYMMDD");
                      selected_month = parseFloat(selected_month) + 1;
                      selected_month = String(selected_month).toString();
                    }

                    req.query.year = selected_year;
                    req.query.month = selected_month;
                    date_month = selected_month;
                    req.query.yearAndMonth = moment(
                      selected_year +
                        "-" +
                        selected_month +
                        hrms_options[0].at_st_date,
                      "YYYY-MM-DD"
                    )._d;
                  } else {
                    req.query.year = date_year;
                    req.query.month = date_month;

                    req.query.yearAndMonth = moment(
                      date_year + "-" + date_month + "-01",
                      "YYYY-MM-DD"
                    )._d;
                  }

                  utilities.logger().log("end_date_month: ", end_date_month);
                  utilities.logger().log("date_month: ", date_month);
                  utilities.logger().log("intValue: ", intValue);

                  if (end_date_month == date_month && intValue > 0) {
                    utilities.logger().log("intValue_inside: ", intValue);
                    req.query.leave_end_date = end_date;
                    req.query.leave_salary = "Y";
                  }

                  let _attandance = null;
                  let _sarary = null;
                  req.connection = {
                    connection: _mysql.connection,
                    isTransactionConnection: _mysql.isTransactionConnection,
                    pool: _mysql.pool
                  };
                  if (hrms_options[0].attendance_type === "M") {
                    _attandance = await processAttendance(req, res, next);
                    _sarary = await newProcessSalary(req, res, next);
                  } else {
                    utilities.logger().log("attendance_type else: ", intValue);
                    _sarary = await newProcessSalary(req, res, next);
                    _attandance = Promise.resolve();
                  }

                  // let _sarary = await newProcessSalary(req, res, next);
                  utilities.logger().log("_sarary before:  ", _sarary);
                  if (_sarary === undefined) {
                    utilities.logger().log("Salary Inside: ");
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.flag = 1;
                      req.records = {
                        message: "Please Process Attandance"
                      };
                      next();
                      return;
                    });
                  }
                  // _sarary = _sarary !== null ? parseFloat(_sarary) + 1 : "";

                  // Promise.all([_attandance, _sarary]).then(rse => {
                  // utilities.logger().log("Promise: ", rse);
                  strGetdataQry +=
                    "select hims_f_salary_id,salary_number,month,year,employee_id,salary_date,gross_salary,net_salary from hims_f_salary where hims_f_salary_id=" +
                    _sarary +
                    "; ";

                  utilities
                    .logger()
                    .log(
                      "Promise attendance_starts: ",
                      hrms_options[0].attendance_starts
                    );
                  utilities
                    .logger()
                    .log("Promise at_end_date: ", hrms_options[0].at_end_date);
                  if (hrms_options[0].attendance_starts === "PM") {
                    let selected_year = moment(start_date).year();
                    let selected_month = moment(start_date).format("M");
                    // let selected_day = moment(from_date).format("DD");

                    fromDate_lastDate = moment(
                      selected_year +
                        "-" +
                        selected_month +
                        "-" +
                        hrms_options[0].at_end_date
                    ).format("YYYY-MM-DD");
                  } else {
                    fromDate_lastDate = moment(start_date)
                      .endOf("month")
                      .format("YYYY-MM-DD");
                  }
                  utilities
                    .logger()
                    .log("Promise fromDate_lastDate: ", fromDate_lastDate);

                  start_date = moment(fromDate_lastDate)
                    .add(1, "days")
                    .format("YYYYMMDD");
                  utilities.logger().log("Promise start_date: ", start_date);
                  // });
                } catch (e) {
                  _mysql.rollBackTransaction(() => {
                    next(e);
                  });
                }
                intValue++;
              }

              utilities.logger().log("strGetdataQry: ", strGetdataQry);

              _mysql
                .executeQuery({
                  query: strGetdataQry,
                  printQuery: true
                })
                .then(Salary_result => {
                  utilities.logger().log("Salary_result: ", Salary_result);
                  _mysql.commitTransaction(() => {
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
                    }

                    let amount_data = [];
                    amount_data.push({
                      leave_amount: leave_amount,
                      airfare_amount: airfare_amount
                    });
                    _mysql.releaseConnection();
                    final_result.push(result_data, amount_data);
                    delete req.connection;
                    req.records = final_result;
                    next();
                  });
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                  reject(e);
                });
            };

            syscCall();
          } else {
            // _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.records = { message: "Dont have enough leaves" };
            req.flag = 1;
            next();
            // });
          }
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  },

  InsertLeaveSalary: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let inputParam = { ...req.body };
      let leave_salary_number = "",
        leave_salary_acc_number = "";

      const utilities = new algaehUtilities();

      utilities.logger().log("InsertLeaveSalary: ");

      _mysql
        .generateRunningNumber({
          modules: ["LEAVE_SALARY"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          leave_salary_number = generatedNumbers[0];
          _mysql
            .generateRunningNumber({
              modules: ["LEAVE_ACCRUAL"],
              tableName: "hims_f_app_numgen",
              identity: {
                algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
                hospital_id: req.userIdentity.hospital_id
              }
            })
            .then(generated_Numbers => {
              leave_salary_acc_number = generated_Numbers[0];
              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO `hims_f_leave_salary_header` (leave_salary_number, leave_salary_date, employee_id, \
                      year, month, leave_start_date, leave_end_date, salary_amount, leave_amount,\
                      airfare_amount,total_amount,leave_period,status,created_date,created_by,hospital_id)\
                      VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                    req.userIdentity.algaeh_d_app_user_id,
                    req.userIdentity.hospital_id
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
                      query:
                        "INSERT INTO hims_f_leave_salary_detail(??) VALUES ?",
                      values: inputParam.leave_salary_detail,
                      includeValues: IncludeValues,
                      extraValues: {
                        leave_salary_header_id: leave_header.insertId
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(leave_detail => {
                      let leave_application_id = _.chain(
                        inputParam.leave_salary_detail
                      )
                        .groupBy("leave_application_id")
                        .map(function(items, data) {
                          return data;
                        })
                        .value();

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
                                "UPDATE hims_f_salary SET salary_processed = 'Y' where hims_f_salary_id in (?);\
                                select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
                                inputParam.year +
                                " as year," +
                                inputParam.month +
                                " as month, \
                                CASE when airfare_factor = 'PB' then ((amount / 100)*airfare_percentage) else (airfare_amount/airfare_eligibility) end airfare_amount,\
                                sum((EE.amount *12)/365)* EG.monthly_accrual_days as leave_salary\
                                from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
                                where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
                                EE.earnings_id=ED.hims_d_earning_deduction_id and \
                                ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';",
                              values: [
                                _salaryHeader_id,
                                inputParam.employee_id
                              ],
                              printQuery: true
                            })
                            .then(leave_application => {
                              let leave_accrual_detail = leave_application[1];
                              let annual_leave_data = leave_application[2];

                              let leave_salary_accrual_detail = leave_accrual_detail;

                              utilities
                                .logger()
                                .log(
                                  "leave_salary_accrual_detail: ",
                                  leave_salary_accrual_detail
                                );

                              utilities
                                .logger()
                                .log("annual_leave_data: ", annual_leave_data);

                              const total_leave_salary = _.sumBy(
                                leave_salary_accrual_detail,
                                s => {
                                  return s.leave_salary;
                                }
                              );

                              const total_airfare_amount = _.sumBy(
                                leave_salary_accrual_detail,
                                s => {
                                  return s.airfare_amount;
                                }
                              );

                              _mysql
                                .executeQuery({
                                  query:
                                    "INSERT INTO `hims_f_leave_salary_accrual_header` (leave_salary_number,year, month,  \
                                  total_leave_salary, total_airfare_amount, hospital_id, leave_salary_date , \
                                  created_date, created_by)\
                                VALUE(?,?,?,?,?,?,?,?,?);",
                                  values: [
                                    leave_salary_acc_number,
                                    inputParam.year,
                                    inputParam.month,
                                    total_leave_salary,
                                    total_airfare_amount,
                                    req.userIdentity.hospital_id,
                                    moment(new Date()).format("YYYY-MM-DD"),
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id
                                  ],
                                  printQuery: true
                                })
                                .then(accrual_header => {
                                  let leave_salary_header_id =
                                    accrual_header.insertId;

                                  let IncludeValues = [
                                    "employee_id",
                                    "year",
                                    "month",
                                    "leave_days",
                                    "leave_salary",
                                    "airfare_amount"
                                  ];

                                  _mysql
                                    .executeQuery({
                                      query:
                                        "INSERT INTO hims_f_leave_salary_accrual_detail(??) VALUES ?",
                                      values: leave_salary_accrual_detail,
                                      includeValues: IncludeValues,
                                      extraValues: {
                                        leave_salary_header_id: leave_salary_header_id
                                      },
                                      bulkInsertOrUpdate: true,
                                      printQuery: true
                                    })
                                    .then(leave_detail => {
                                      InsertEmployeeLeaveSalary({
                                        leave_salary_accrual_detail: leave_salary_accrual_detail,
                                        annual_leave_data: annual_leave_data,
                                        _mysql: _mysql,
                                        next: next,
                                        decimal_places:
                                          req.userIdentity.decimal_places
                                      })
                                        .then(Employee_Leave_Salary => {
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
                                    .catch(error => {
                                      _mysql.rollBackTransaction(() => {
                                        next(error);
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
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      next(e);
    }
  },

  getLeaveSalary: (req, res, next) => {
    try {
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
          if (leave_salary_header.length > 0) {
            const leave_salary_header_id = leave_salary_header.map(item => {
              return item.hims_f_leave_salary_header_id;
            });
            leaveSalary_header = leave_salary_header[0];

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
    } catch (e) {
      next(e);
    }
  }
};

function attendanceProcess(req, res, next) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    next(e);
  });
}

function InsertEmployeeLeaveSalary(options) {
  return new Promise((resolve, reject) => {
    try {
      let leave_salary_accrual_detail = options.leave_salary_accrual_detail[0];
      let _mysql = options._mysql;
      let decimal_places = options.decimal_places;
      let annual_leave_data = options.annual_leave_data;
      const utilities = new algaehUtilities();

      utilities
        .logger()
        .log("leave_salary_accrual_detail: ", leave_salary_accrual_detail);

      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_leave_salary_header_id,employee_id,leave_days,leave_salary_amount, \
                airticket_amount, balance_leave_days, balance_leave_salary_amount, balance_airticket_amount, \
                airfare_months, utilized_leave_days,  utilized_leave_salary_amount, utilized_airticket_amount \
                from hims_f_employee_leave_salary_header where employee_id = ?;\
                select hims_f_employee_monthly_leave_id, close_balance, accumulated_leaves, projected_applied_leaves\
                from hims_f_employee_monthly_leave where year = ? and employee_id = ? and leave_id=?;",
          values: [
            leave_salary_accrual_detail.employee_id,
            leave_salary_accrual_detail.year,
            leave_salary_accrual_detail.employee_id,
            annual_leave_data[0].hims_d_leave_id
          ],
          printQuery: true
        })
        .then(employee_leave_salary => {
          let employee_leave_salary_header = employee_leave_salary[0];
          let monthly_leave = employee_leave_salary[1][0];

          utilities
            .logger()
            .log(
              "employee_leave_salary_header: ",
              employee_leave_salary_header
            );
          utilities.logger().log("monthly_leave: ", monthly_leave);

          if (employee_leave_salary_header.length > 0) {
            let leave_days =
              parseFloat(employee_leave_salary_header[0].leave_days) +
              parseFloat(leave_salary_accrual_detail.leave_days);
            let leave_salary_amount =
              parseFloat(employee_leave_salary_header[0].leave_salary_amount) +
              parseFloat(leave_salary_accrual_detail.leave_salary);
            let airticket_amount =
              parseFloat(employee_leave_salary_header[0].airticket_amount) +
              parseFloat(leave_salary_accrual_detail.airfare_amount);
            let balance_leave_days =
              parseFloat(employee_leave_salary_header[0].balance_leave_days) +
              parseFloat(leave_salary_accrual_detail.leave_days);
            let balance_leave_salary_amount =
              parseFloat(
                employee_leave_salary_header[0].balance_leave_salary_amount
              ) + parseFloat(leave_salary_accrual_detail.leave_salary);
            let balance_airticket_amount =
              parseFloat(
                employee_leave_salary_header[0].balance_airticket_amount
              ) + parseFloat(leave_salary_accrual_detail.airfare_amount);

            let utilized_leave_days =
              parseFloat(employee_leave_salary_header[0].utilized_leave_days) +
              parseFloat(leave_salary_accrual_detail.leave_days);
            let utilized_leave_salary_amount =
              parseFloat(
                employee_leave_salary_header[0].utilized_leave_salary_amount
              ) + parseFloat(leave_salary_accrual_detail.leave_salary);
            let utilized_airticket_amount =
              parseFloat(
                employee_leave_salary_header[0].utilized_airticket_amount
              ) + parseFloat(leave_salary_accrual_detail.airfare_amount);

            let airfare_months =
              parseFloat(employee_leave_salary_header[0].airfare_months) + 1;

            let monthly_close_balance = parseFloat(monthly_leave.close_balance);

            leave_salary_amount = utilities.decimalPoints(
              leave_salary_amount,
              decimal_places
            );
            airticket_amount = utilities.decimalPoints(
              airticket_amount,
              decimal_places
            );
            balance_leave_salary_amount = utilities.decimalPoints(
              balance_leave_salary_amount,
              decimal_places
            );
            balance_airticket_amount = utilities.decimalPoints(
              balance_airticket_amount,
              decimal_places
            );
            utilized_leave_salary_amount = utilities.decimalPoints(
              utilized_leave_salary_amount,
              decimal_places
            );
            utilized_airticket_amount = utilities.decimalPoints(
              utilized_airticket_amount,
              decimal_places
            );

            let projected_applied_leaves = parseFloat(
              monthly_leave.projected_applied_leaves
            );
            let accumulated_leaves = parseFloat(
              monthly_leave.accumulated_leaves
            );
            let monthly_accruval_leave = parseFloat(
              leave_salary_accrual_detail.leave_days
            );
            if (projected_applied_leaves > 0) {
              if (projected_applied_leaves > monthly_accruval_leave) {
                projected_applied_leaves =
                  projected_applied_leaves - monthly_accruval_leave;
                accumulated_leaves =
                  accumulated_leaves + monthly_accruval_leave;
              } else {
                projected_applied_leaves =
                  monthly_accruval_leave - projected_applied_leaves;
                monthly_close_balance =
                  monthly_close_balance + projected_applied_leaves;
                accumulated_leaves =
                  accumulated_leaves +
                  monthly_accruval_leave -
                  projected_applied_leaves;
              }
            } else {
              monthly_close_balance =
                monthly_close_balance + monthly_accruval_leave;
            }

            _mysql
              .executeQuery({
                query:
                  "UPDATE `hims_f_employee_leave_salary_header` SET leave_days=?,`leave_salary_amount`=?,\
                  `airticket_amount`=?,`balance_leave_days`=?,`balance_leave_salary_amount`=?,\
                  `balance_airticket_amount`=?,`airfare_months`=?, `utilized_leave_days`=?, \
                  `utilized_leave_salary_amount` = ?, `utilized_airticket_amount` = ? where  hims_f_employee_leave_salary_header_id=?;\
                  UPDATE hims_f_employee_monthly_leave set close_balance=?, projected_applied_leaves=?, accumulated_leaves=? \
                  where hims_f_employee_monthly_leave_id=?;\
                  INSERT INTO `hims_f_employee_leave_salary_detail`(employee_leave_salary_header_id,leave_days,\
                    leave_salary_amount,airticket_amount, year, month) VALUE(?,?,?,?,?,?)",
                values: [
                  leave_days,
                  leave_salary_amount,
                  airticket_amount,
                  balance_leave_days,
                  balance_leave_salary_amount,
                  balance_airticket_amount,
                  airfare_months,
                  utilized_leave_days,
                  utilized_leave_salary_amount,
                  utilized_airticket_amount,
                  employee_leave_salary_header[0]
                    .hims_f_employee_leave_salary_header_id,
                  monthly_close_balance,
                  projected_applied_leaves,
                  accumulated_leaves,
                  monthly_leave.hims_f_employee_monthly_leave_id,
                  employee_leave_salary_header[0]
                    .hims_f_employee_leave_salary_header_id,
                  leave_salary_accrual_detail.leave_days,
                  leave_salary_accrual_detail.leave_salary,
                  leave_salary_accrual_detail.airfare_amount,
                  leave_salary_accrual_detail.year,
                  leave_salary_accrual_detail.month
                ],
                printQuery: true
              })
              .then(update_employee_leave => {
                // console.log("apple");
                utilities.logger().log("Done : ", update_employee_leave);
                resolve();
              })
              .catch(e => {
                // console.log("bottle");
                utilities.logger().log("reject: ", e);
                reject(e);
              });
          } else {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_f_employee_leave_salary_header`  (`year`,`employee_id`,`leave_days`,\
                      `leave_salary_amount`,`airticket_amount`,`balance_leave_days`,`balance_leave_salary_amount`,\
                      `balance_airticket_amount`,`airfare_months`, `utilized_leave_days`, `utilized_leave_salary_amount`, `utilized_airticket_amount`)\
                       VALUE(?,?,?,?,?,?,?,?,?,?,?,?)",
                values: [
                  leave_salary_accrual_detail.year,
                  leave_salary_accrual_detail.employee_id,
                  leave_salary_accrual_detail.leave_days,
                  leave_salary_accrual_detail.leave_salary,
                  leave_salary_accrual_detail.airfare_amount,
                  leave_salary_accrual_detail.leave_days,
                  leave_salary_accrual_detail.leave_salary,
                  leave_salary_accrual_detail.airfare_amount,
                  "1",
                  "0",
                  "0",
                  "0"
                ],
                printQuery: true
              })
              .then(employee_leave_header => {
                let IncludeValues = [
                  "employee_leave_salary_header_id",
                  "leave_days",
                  "leave_salary_amount",
                  "airticket_amount"
                ];
                let inputValues = [
                  {
                    employee_leave_salary_header_id:
                      employee_leave_header.insertId,
                    leave_days: leave_salary_accrual_detail.leave_days,
                    leave_salary_amount:
                      leave_salary_accrual_detail.leave_salary,
                    airticket_amount: leave_salary_accrual_detail.airfare_amount
                  }
                ];

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_f_employee_leave_salary_detail(??) VALUES ?",
                    values: inputValues,
                    includeValues: IncludeValues,
                    extraValues: {
                      year: leave_salary_accrual_detail.year,
                      month: leave_salary_accrual_detail.month
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: true
                  })
                  .then(leave_detail => {
                    let monthly_close_balance = parseFloat(
                      monthly_leave.close_balance
                    );

                    let projected_applied_leaves = parseFloat(
                      monthly_leave.projected_applied_leaves
                    );
                    let accumulated_leaves = parseFloat(
                      monthly_leave.accumulated_leaves
                    );
                    let monthly_accruval_leave = parseFloat(
                      leave_salary_accrual_detail.leave_days
                    );
                    if (projected_applied_leaves > 0) {
                      if (projected_applied_leaves > monthly_accruval_leave) {
                        projected_applied_leaves =
                          projected_applied_leaves - monthly_accruval_leave;
                        accumulated_leaves =
                          accumulated_leaves + monthly_accruval_leave;
                      } else {
                        projected_applied_leaves =
                          monthly_accruval_leave - projected_applied_leaves;
                        monthly_close_balance =
                          monthly_close_balance + projected_applied_leaves;
                        accumulated_leaves =
                          accumulated_leaves +
                          monthly_accruval_leave -
                          projected_applied_leaves;
                      }
                    } else {
                      monthly_close_balance =
                        monthly_close_balance + monthly_accruval_leave;
                    }

                    // utilities
                    //   .logger()
                    //   .log("monthly_close_balance: ", monthly_close_balance);
                    _mysql
                      .executeQuery({
                        query:
                          "UPDATE hims_f_employee_monthly_leave set close_balance=?,  projected_applied_leaves=?, \
                          accumulated_leaves=? where hims_f_employee_monthly_leave_id=?;",
                        values: [
                          monthly_close_balance,
                          projected_applied_leaves,
                          accumulated_leaves,
                          monthly_leave.hims_f_employee_monthly_leave_id
                        ],

                        printQuery: true
                      })
                      .then(monthly_leave => {
                        resolve();
                      })
                      .catch(error => {
                        reject(error);
                      });
                  })
                  .catch(error => {
                    reject(error);
                  });
              })
              .catch(e => {
                reject(e);
              });
          }
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  }).catch(e => {
    options.next(e);
  });
}
