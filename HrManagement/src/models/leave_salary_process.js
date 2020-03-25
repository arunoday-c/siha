import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import moment from "moment";
import mysql from "mysql";
import attendance from "./attendance";
import salary from "./salary";

const { newProcessSalary } = salary;
const { processAttendance } = attendance;

export default {
  getLeaveSalaryProcess: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const _leaveSalary = req.query;

      // const utilities = new algaehUtilities();

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
                "SELECT hims_f_leave_application_id, from_date, to_date, leave_type, total_applied_days, \
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
              let total_applied_days = annul_leave_app[0].total_applied_days;

              if (annul_leave_app.length > 0) {
                let leave_salary_detail = [];
                let from_date = moment(
                  annul_leave_app[0].from_date,
                  "YYYY-MM-DD"
                ).format("YYYY-MM-DD");
                let to_date = moment(
                  annul_leave_app[0].to_date,
                  "YYYY-MM-DD"
                ).format("YYYY-MM-DD");

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
                  if (to_date_month > 12) {
                    to_date_month = 1;
                  }
                } else {
                  from_date_month = parseFloat(from_date_month);
                  to_date_month = parseFloat(to_date_month);
                }

                let leave_start_date = moment(
                  annul_leave_app[0].from_date,
                  "YYYY-MM-DD"
                ).format("YYYY-MM-DD");
                // console.log("from_date", from_date);
                // console.log("to_date", to_date);
                let intValue = 0;
                while (from_date <= to_date) {
                  // console.log("from_date", from_date);
                  // console.log("to_date_month", to_date_month);

                  let fromDate_firstDate = null;
                  let fromDate_lastDate = null;

                  let date_year = moment(from_date).year();
                  let date_month = moment(from_date).format("M");

                  date_month = parseFloat(date_month);
                  // utilities.logger().log("from_date: ", from_date);
                  // utilities.logger().log("to_date: ", to_date);

                  let start_date = moment(from_date).add(-1, "days");

                  let no_of_days = 0;

                  // console.log(
                  //   "attendance_starts",
                  //   hrms_options.attendance_starts
                  // );
                  if (hrms_options.attendance_starts === "PM") {
                    let selected_year = moment(from_date).year();
                    let selected_month = moment(from_date).format("M");
                    let selected_day = moment(from_date).format("DD");

                    // console.log("selected_day", selected_day);
                    // console.log("at_st_date", hrms_options.at_st_date);
                    // console.log("selected_month", selected_month);

                    if (
                      parseFloat(selected_day) >=
                      parseFloat(hrms_options.at_st_date)
                    ) {
                      date_month = date_month + 1;
                      // console.log("date_month in if con:", date_month);
                    }
                    if (date_month > 12) {
                      date_month = 1;
                    }

                    // console.log("date_month", date_month);

                    if (to_date_month === date_month) {
                      let end_selected_day = moment(to_date).format("DD");
                      // console.log("end_selected_day", end_selected_day);
                      // console.log("at_end_date", hrms_options.at_end_date);
                      if (intValue > 0) {
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
                            hrms_options.at_end_date,
                          "YYYY-MM-DD"
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
                            hrms_options.at_end_date,
                          "YYYY-MM-DD"
                        ).format("YYYY-MM-DD");
                      }
                      // }
                    } else {
                      // console.log("selected_day", selected_day);
                      // console.log("at_st_date", hrms_options.at_st_date);
                      if (
                        parseFloat(selected_day) >=
                        parseFloat(hrms_options.at_st_date)
                      ) {
                        // console.log("True", selected_day);

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
                            hrms_options.at_end_date,
                          "YYYY-MM-DD"
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
                            hrms_options.at_end_date,
                          "YYYY-MM-DD"
                        ).format("YYYY-MM-DD");
                      }
                    }
                  } else {
                    fromDate_firstDate = moment(from_date)
                      .startOf("month")
                      .format("YYYY-MM-DD");
                    fromDate_lastDate = moment(from_date)
                      .endOf("month")
                      .format("YYYY-MM-DD");
                  }

                  // console.log("fromDate_firstDate", fromDate_firstDate);
                  // console.log("fromDate_lastDate", fromDate_lastDate);

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
                  intValue++;
                }

                let result = {
                  year: moment(annul_leave_app[0].from_date).year(),
                  month: moment(annul_leave_app[0].from_date).format("M"),
                  leave_start_date: leave_start_date,
                  leave_end_date: to_date,
                  leave_salary_detail: leave_salary_detail,
                  leave_period: total_applied_days,
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
      //const leaveDate = moment(_leaveSalary.leave_start_date);
      let start_date = moment(_leaveSalary.leave_start_date).format("YYYYMMDD");
      let end_date = moment(_leaveSalary.leave_end_date).format("YYYYMMDD");
      let end_date_month = moment(_leaveSalary.leave_end_date).format("M");

      let strGetdataQry = "";
      delete req.query.leave_end_date;

      _mysql
        .executeQuery({
          query:
            "select hospital_id, airfare_process, EG.airfare_eligibility, EG.airfare_amount  from hims_d_employee E \
            left join hims_d_employee_group EG on E.employee_group_id= EG.hims_d_employee_group_id where E.hims_d_employee_id=?;\
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

          // utilities.logger().log("hrms_options: ", hrms_options);

          if (employee_leave_salary == undefined) {
            _mysql.releaseConnection();
            req.records = { message: "No Leave exists" };
            req.flag = 1;
            next();
            return;
          }

          let leave_amount = 0;
          let airfare_amount = 0;

          let intValue = 0;
          // if (balance_leave_days > 0) {
          if (employee_result[0].airfare_process === "Y") {
            if (hrms_options[0].airfare_factor === "PB") {
              const basic_component = _.find(
                annual_leave_result,
                f => f.earnings_id == hrms_options[0].basic_earning_component
              );
              airfare_amount =
                (parseFloat(basic_component.amount) / 100) *
                parseFloat(hrms_options[0].airfare_percentage);
              airfare_amount =
                airfare_amount *
                parseFloat(employee_result[0].airfare_eligibility);
            } else {
              airfare_amount = employee_result[0].airfare_amount;
            }
          }
          // console.log("annual_leave_calculation: ", hrms_options[0].annual_leave_calculation)
          for (let k = 0; k < annual_leave_result.length; k++) {
            let per_day_sal = 0;
            if (hrms_options[0].annual_leave_calculation === "M") {
              per_day_sal = parseFloat(annual_leave_result[k].amount) / 30;
              per_day_sal = per_day_sal * req.query.leave_period;

              leave_amount = leave_amount + per_day_sal;
            } else {
              per_day_sal = parseFloat(annual_leave_result[k].amount) * 12;
              per_day_sal = per_day_sal / 365;
              per_day_sal = per_day_sal * req.query.leave_period;

              leave_amount = leave_amount + per_day_sal;
            }
          }

          req.query.hospital_id = employee_result[0].hospital_id;
          req.query.employee_id = req.query.hims_d_employee_id;

          if (hrms_options[0].attendance_starts === "PM") {
            let end_selected_day = moment(end_date).format("DD");
            // console.log("end_selected_day: ", end_selected_day);
            if (
              parseFloat(end_selected_day) >=
              parseFloat(hrms_options[0].at_end_date)
            ) {
              end_date_month = parseFloat(end_date_month) + 1;
              end_date_month = String(end_date_month).toString();
            }
          }
          const syscCall = async function() {
            while (start_date <= end_date) {
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
                    parseFloat(selected_day) >=
                    parseFloat(hrms_options[0].at_st_date)
                  ) {
                    start_date = moment(start_date)
                      .add(1, "M")
                      .format("YYYYMMDD");
                    selected_month = parseFloat(selected_month) + 1;
                    if (selected_month > 12) {
                      selected_month = 1;
                    }
                    selected_month = String(selected_month).toString();
                  }

                  // console.log("selected_month: ", selected_month);

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

                // console.log("end_date_month: ", end_date_month);
                // console.log("date_month: ", date_month);
                // console.log("intValue: ", intValue);

                if (end_date_month == date_month && intValue > 0) {
                  req.query.leave_end_date = end_date;
                  req.query.leave_salary = "Y";
                }
                if (intValue > 0) {
                  req.query.leave_salary = "Y";
                }
                // console.log("leave_salary: ", req.query.leave_salary);

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
                  // utilities.logger().log("attendance_type else: ", intValue);
                  _sarary = await newProcessSalary(req, res, next);
                  _attandance = Promise.resolve();
                }

                // let _sarary = await newProcessSalary(req, res, next);
                // console.log("_sarary before:  ", _sarary);
                if (_sarary === undefined) {
                  utilities.logger().log("Salary Inside: ");
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.flag = 1;
                    req.records = {
                      message:
                        "Process attendance till " +
                        moment(_leaveSalary.leave_start_date, "YYYY-MM-DD")
                          .add(-1, "days")
                          .format("DD-MM-YYYY")
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

                if (hrms_options[0].attendance_starts === "PM") {
                  let _selected_year = moment(start_date).year();
                  let _selected_month = moment(start_date).format("M");

                  // console.log("_selected_year: ", _selected_year);
                  // console.log("selected_month: ", _selected_month);

                  // let selected_day = moment(from_date).format("DD");

                  // if (
                  //   parseFloat(selected_day) >=
                  //   parseFloat(hrms_options[0].at_st_date)
                  // ) {
                  //   start_date = moment(start_date)
                  //     .add(1, "M")
                  //     .format("YYYYMMDD");
                  //   selected_month = parseFloat(selected_month) + 1;
                  //   selected_month = String(selected_month).toString();
                  // }

                  fromDate_lastDate = moment(
                    _selected_year +
                      "-" +
                      _selected_month +
                      "-" +
                      hrms_options[0].at_end_date
                  ).format("YYYY-MM-DD");
                } else {
                  fromDate_lastDate = moment(start_date)
                    .endOf("month")
                    .format("YYYY-MM-DD");
                }

                // console.log("Promise fromDate_lastDate: ", fromDate_lastDate);
                start_date = moment(fromDate_lastDate)
                  .add(1, "days")
                  .format("YYYYMMDD");
                // console.log("Promise start_date: ", start_date);
                // });
              } catch (e) {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              }
              intValue++;
            }
            // console.log("leave_amount: ", leave_amount)

            // utilities.logger().log("strGetdataQry: ", strGetdataQry);

            _mysql
              .executeQuery({
                query: strGetdataQry,
                printQuery: true
              })
              .then(Salary_result => {
                // utilities.logger().log("Salary_result: ", Salary_result);
                _mysql.commitTransaction(() => {
                  let result_data = [];
                  let final_result = [];

                  for (let i = 0; i < Salary_result.length; i++) {
                    if (Array.isArray(Salary_result[i])) {
                      Array.prototype.push.apply(result_data, Salary_result[i]);
                    } else {
                      result_data.push(Salary_result[i]);
                    }
                  }

                  let amount_data = [];
                  amount_data.push({
                    leave_amount: leave_amount,
                    airfare_amount: airfare_amount,
                    airfare_months: employee_result[0].airfare_eligibility
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
          // } else {
          //   // _mysql.commitTransaction(() => {
          //   _mysql.releaseConnection();
          //   req.records = { message: "Dont have enough leaves" };
          //   req.flag = 1;
          //   next();
          //   // });
          // }
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
      let inputParam = req.body;
      let leave_salary_number = "",
        leave_salary_acc_number = "";
      const decimal_places = req.userIdentity.decimal_places;
      // const utilities = new algaehUtilities();

      // utilities.logger().log("InsertLeaveSalary: ");

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["LEAVE_SALARY", "LEAVE_ACCRUAL"],
          table_name: "hims_f_hrpayroll_numgen"
        })
        .then(generatedNumbers => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };

          leave_salary_number = generatedNumbers.LEAVE_SALARY;
          leave_salary_acc_number = generatedNumbers.LEAVE_ACCRUAL;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_leave_salary_header` (leave_salary_number, leave_salary_date, employee_id, \
                      year, month, leave_start_date, leave_end_date, salary_amount, leave_amount,\
                      airfare_amount,total_amount,leave_period,status,airfare_months,created_date,created_by,hospital_id)\
                      VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                leave_salary_number,
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
                inputParam.airfare_months,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                req.userIdentity.hospital_id
              ]
              //printQuery: true
            })
            .then(leave_header => {
              req.body.leave_salary_number = leave_salary_number;
              req.body.hims_f_leave_salary_header_id = leave_header.insertId;
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
                  bulkInsertOrUpdate: true
                  //  printQuery: true
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
                      values: [leave_application_id]
                      // printQuery: true
                    })
                    .then(leave_application => {
                      req.body.salary_header_id =
                        inputParam.leave_salary_detail[0].salary_header_id;
                      let bulk_year = [];
                      let bulk_month = [];

                      for (
                        let i = 0;
                        i < inputParam.leave_salary_detail.length;
                        i++
                      ) {
                        const leave_end_date =
                          inputParam.leave_salary_detail[i].leave_end_date; //moment(inputParam.leave_salary_detail[i].leave_end_date, "YYYYMMDD").format("YYYYMMDD");
                        const sal_end_date =
                          inputParam.leave_salary_detail[i].end_date; //moment(inputParam.leave_salary_detail[i].end_date, "YYYYMMDD").format("YYYYMMDD");

                        //console.log("leave_end_date", leave_end_date)
                        // console.log("sal_end_date", sal_end_date)
                        if (
                          parseInt(leave_end_date) >= parseInt(sal_end_date)
                        ) {
                          bulk_year.push(
                            inputParam.leave_salary_detail[i].year
                          );
                          bulk_month.push(
                            inputParam.leave_salary_detail[i].month
                          );

                          let strQuery = "";
                          if (inputParam.annual_leave_calculation === "A") {
                            strQuery =
                              "UPDATE hims_f_salary SET salary_processed = 'Y', salary_processed_date=?, salary_processed_by=? \
                            where hims_f_salary_id in (?);\
                            select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
                              inputParam.leave_salary_detail[i].year +
                              " as year," +
                              inputParam.leave_salary_detail[i].month +
                              " as month, \
                            CASE when airfare_process = 'N' then 0 when airfare_factor = 'PB' then ROUND(((amount / 100)*airfare_percentage), " +
                              decimal_places +
                              ") \
                            else ROUND((airfare_amount/airfare_eligibility), " +
                              decimal_places +
                              ") end as airfare_amount,\
                            ROUND(sum((EE.amount *12)/365)* EG.monthly_accrual_days, " +
                              decimal_places +
                              ") as leave_salary \
                            from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
                            where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
                            EE.earnings_id=ED.hims_d_earning_deduction_id and \
                            ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; \
                            SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
                          } else if (
                            inputParam.annual_leave_calculation === "M"
                          ) {
                            strQuery =
                              "UPDATE hims_f_salary SET salary_processed = 'Y', salary_processed_date=?, salary_processed_by=? \
                            where hims_f_salary_id in (?);\
                              select E.hims_d_employee_id as employee_id,EG.monthly_accrual_days as leave_days, " +
                              inputParam.leave_salary_detail[i].year +
                              " as year," +
                              inputParam.leave_salary_detail[i].month +
                              " as month, \
                            CASE when airfare_process = 'N' then 0 when airfare_factor = 'PB' then ROUND(((amount / 100)*airfare_percentage), " +
                              decimal_places +
                              ") \
                            else ROUND((airfare_amount/airfare_eligibility), " +
                              decimal_places +
                              ") end as airfare_amount,\
                            ROUND(sum(EE.amount /30)* EG.monthly_accrual_days, " +
                              decimal_places +
                              ") as leave_salary\
                            from hims_d_employee E, hims_d_employee_group EG,hims_d_hrms_options O, hims_d_employee_earnings EE ,hims_d_earning_deduction ED\
                            where E.employee_group_id = EG.hims_d_employee_group_id and EE.employee_id = E.hims_d_employee_id and \
                            EE.earnings_id=ED.hims_d_earning_deduction_id and \
                            ED.annual_salary_comp='Y' and E.leave_salary_process = 'Y' and E.hims_d_employee_id in (?) group by EE.employee_id; \
                            SELECT hims_d_leave_id FROM hims_d_leave where leave_category='A';";
                          }

                          _mysql
                            .executeQuery({
                              query: strQuery,
                              values: [
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                inputParam.leave_salary_detail[i]
                                  .salary_header_id,
                                inputParam.employee_id
                              ],
                              printQuery: true
                            })
                            .then(leave_application => {
                              let leave_salary_accrual_detail =
                                leave_application[1];
                              let annual_leave_data = leave_application[2];

                              // const total_leave_salary = _.sumBy(
                              //   leave_salary_accrual_detail,
                              //   s => {
                              //     return parseFloat(s.leave_salary);
                              //   }
                              // );

                              // const total_airfare_amount = _.sumBy(
                              //   leave_salary_accrual_detail,
                              //   s => {
                              //     return parseFloat(s.airfare_amount);
                              //   }
                              // );
                              // console.log("Before");
                              _mysql
                                .executeQuery({
                                  query:
                                    "INSERT INTO `hims_f_leave_salary_accrual_header` (leave_salary_number,year, month,  \
                                    total_leave_salary, total_airfare_amount, hospital_id, leave_salary_date , \
                                    created_date, created_by)\
                                  VALUE(?,?,?,?,?,?,?,?,?);",
                                  values: [
                                    leave_salary_acc_number,
                                    inputParam.leave_salary_detail[i].year,
                                    inputParam.leave_salary_detail[i].month,
                                    leave_salary_accrual_detail[0].leave_salary,
                                    leave_salary_accrual_detail[0]
                                      .airfare_amount,
                                    req.userIdentity.hospital_id,
                                    moment(new Date()).format("YYYY-MM-DD"),
                                    new Date(),
                                    req.userIdentity.algaeh_d_app_user_id
                                  ]
                                  //printQuery: true
                                })
                                .then(accrual_header => {
                                  // console.log("accrual_header")
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

                                  let str_employee_qry =
                                    "select employee_code, full_name, hospital_id from hims_d_employee where hims_d_employee_id= " +
                                    inputParam.employee_id +
                                    ";";

                                  _mysql
                                    .executeQuery({
                                      query:
                                        "INSERT INTO hims_f_leave_salary_accrual_detail(??) VALUES ? ; " +
                                        str_employee_qry,
                                      values: leave_salary_accrual_detail,
                                      includeValues: IncludeValues,
                                      extraValues: {
                                        leave_salary_header_id: leave_salary_header_id
                                      },
                                      bulkInsertOrUpdate: true,
                                      printQuery: true
                                    })
                                    .then(leave_detail => {
                                      // console.log("leave_detail")
                                      req.body.employee_code =
                                        leave_detail[1][0].employee_code;
                                      req.body.employee_name =
                                        leave_detail[1][0].full_name;
                                      req.body.hospital_id =
                                        leave_detail[1][0].hospital_id;

                                      InsertEmployeeLeaveSalary({
                                        leave_salary_accrual_detail: leave_salary_accrual_detail,
                                        annual_leave_data: annual_leave_data,
                                        _mysql: _mysql,
                                        next: next,
                                        decimal_places:
                                          req.userIdentity.decimal_places
                                      })
                                        .then(Employee_Leave_Salary => {
                                          InsertGratuityProvision({
                                            salary_end_date:
                                              inputParam.leave_salary_detail[i]
                                                .end_date,
                                            inputParam: inputParam,
                                            _mysql: _mysql,
                                            next: next,
                                            decimal_places:
                                              req.userIdentity.decimal_places
                                          })
                                            .then(gratuity_provision => {
                                              // _mysql.commitTransaction(() => {
                                              //   _mysql.releaseConnection();
                                              if (
                                                i ==
                                                inputParam.leave_salary_detail
                                                  .length -
                                                  1
                                              ) {
                                                // console.log("bulk_year", bulk_year)

                                                req.body.bulk_year = bulk_year;
                                                req.body.bulk_month = bulk_month;
                                                req.records = {
                                                  leave_salary_number: leave_salary_number
                                                };
                                                // console.log("bulk_month", bulk_month)
                                                next();
                                              }
                                              // });
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
                                .catch(error => {
                                  // console.log("Data 1 ")
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
                        } else {
                          _mysql
                            .executeQuery({
                              query:
                                "select employee_code, full_name, hospital_id from hims_d_employee where hims_d_employee_id= ?;",
                              values: [inputParam.employee_id],
                              printQuery: true
                            })
                            .then(employee_detail => {
                              req.body.employee_code =
                                employee_detail[0].employee_code;
                              req.body.employee_name =
                                employee_detail[0].full_name;
                              req.body.hospital_id =
                                employee_detail[0].hospital_id;

                              if (
                                i ==
                                inputParam.leave_salary_detail.length - 1
                              ) {
                                req.body.bulk_year = bulk_year;
                                req.body.bulk_month = bulk_month;
                                req.records = {
                                  leave_salary_number: leave_salary_number
                                };
                                next();
                              }
                            })
                            .catch(error => {
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        }
                      }
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
          total_amount,leave_period, status, E.employee_code, E.full_name  as employee_name, E.hospital_id\
          from hims_f_leave_salary_header LSH, hims_d_employee E where E.suspend_salary='N' and LSH.employee_id = E.hims_d_employee_id  and \
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
  },
  getEmployeeAnnualLeaveToProcess: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const inputParam = req.query;

      let leaveSalary_header = [];

      _mysql
        .executeQuery({
          query:
            "select hims_d_leave_id from hims_d_leave where leave_category='A';",
          printQuery: true
        })
        .then(leave_master => {
          if (leave_master.length > 0) {
            const leave_id = leave_master[0].hims_d_leave_id;

            _mysql
              .executeQuery({
                query:
                  "select E.hims_d_employee_id, E.employee_code, E.full_name from hims_f_leave_application LA \
                  inner join hims_d_employee E on LA.employee_id = E.hims_d_employee_id\
                  inner join hims_f_employee_annual_leave EAL on EAL.leave_application_id = LA.hims_f_leave_application_id \
                  where LA.hospital_id=? and LA.leave_id = ? and LA.processed='N' and LA.status='APR' and \
                  EAL.from_normal_salary = 'N' and EAL.cancelled='N';",
                values: [inputParam.hospital_id, leave_id],
                printQuery: true
              })
              .then(leave_salary => {
                _mysql.releaseConnection();
                req.records = leave_salary;
                next();
              })
              .catch(e => {
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = leaveEncash_header;
            next();
          }
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },
  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    // console.log("generateAccountingEntry")
    try {
      let inputParam = req.body;
      _mysql
        .executeQueryWithTransaction({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;",
          printQuery: true
        })
        .then(org_data => {
          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {
            _mysql
              .executeQueryWithTransaction({
                query:
                  "select account, head_id, child_id from finance_accounts_maping \
              where account in ('SAL_PYBLS', 'LV_SAL_PYBL', 'AIRFR_PYBL', 'GRAT_PYBL');\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='LS';\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='AR';\
              select head_id, child_id from hims_d_earning_deduction where component_category='E' and component_type='EOS';"
              })
              .then(result => {
                const salary_pay_acc = result[0].find(
                  f => f.account === "SAL_PYBLS"
                );
                const lv_salary_pay_acc = result[0].find(
                  f => f.account === "LV_SAL_PYBL"
                );
                const airfair_pay_acc = result[0].find(
                  f => f.account === "AIRFR_PYBL"
                );
                const gratuity_pay_acc = result[0].find(
                  f => f.account === "GRAT_PYBL"
                );

                const leave_sal_expence_acc = result[1][0];
                const airfare_expence_acc = result[2][0];
                const gratuity_expence_acc = result[3][0];

                _mysql
                  .executeQueryWithTransaction({
                    query: `select hims_f_salary_id, curDate() payment_date,SE.amount as debit_amount, ED.head_id, ED.child_id,\
                  'DR' as payment_type, 0 as credit_amount, S.hospital_id, E.sub_department_id from hims_f_salary s 
                  left join hims_f_salary_earnings SE on SE.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SE.earnings_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?); 
                  select hims_f_salary_id, curDate() payment_date, SD.amount as credit_amount, ED.head_id, ED.child_id, \
                  'CR' as payment_type, 0 as debit_amount ,S.hospital_id, E.sub_department_id
                  from hims_f_salary s 
                  left join hims_f_salary_deductions SD on SD.salary_header_id = S.hims_f_salary_id 
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SD.deductions_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?); 
                  select hims_f_salary_id, curDate() payment_date, SC.amount as debit_amount, ED.head_id, ED.child_id, \
                  'DR' as payment_type,0 as credit_amount ,S.hospital_id, E.sub_department_id from hims_f_salary s 
                  left join hims_f_salary_contributions SC on SC.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SC.contributions_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id  
                  where hims_f_salary_id in(?);
                  select hims_f_salary_id, curDate() payment_date, SC.amount as credit_amount, ED.li_head_id as  head_id, 
                  ED.li_child_id as child_id, 'CR' as payment_type,0 as debit_amount, S.hospital_id, E.sub_department_id from hims_f_salary s 
                  left join hims_f_salary_contributions SC on SC.salary_header_id = S.hims_f_salary_id
                  inner join hims_d_earning_deduction ED on ED.hims_d_earning_deduction_id = SC.contributions_id
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id  
                  where hims_f_salary_id in(?);
                  select hims_f_salary_id, curDate() payment_date, SL.loan_due_amount as credit_amount, L.head_id, 
                  L.child_id, 'CR' as payment_type, 0 as debit_amount,S.hospital_id, E.sub_department_id from hims_f_salary s 
                  left join hims_f_salary_loans SL on SL.salary_header_id = S.hims_f_salary_id
                  left join hims_f_loan_application LA on LA.hims_f_loan_application_id = SL.loan_application_id
                  inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = S.employee_id 
                  where hims_f_salary_id in(?);
                  select employee_id, leave_salary, airfare_amount, E.hospital_id, E.sub_department_id from hims_f_leave_salary_accrual_detail D 
                  inner join hims_d_employee E on E.hims_d_employee_id =D.employee_id 
                  where year in (?) and month in (?) and employee_id in (?);
                  select employee_id, gratuity_amount, E.hospital_id, E.sub_department_id from hims_f_gratuity_provision G
                  inner join hims_d_employee E on E.hims_d_employee_id =G.employee_id 
                  where year in (?) and month in (?) and employee_id in (?);
                  select employee_id, head_id, child_id, E.hospital_id, approved_amount, E.sub_department_id from hims_f_loan_application LA
                  inner join hims_d_loan L on L.hims_d_loan_id = LA.loan_id 
                  inner join hims_d_employee E on E.hims_d_employee_id = LA.employee_id where loan_authorized='APR' 
                  and loan_closed='N' and loan_dispatch_from='SAL' and employee_id in (?);`,
                    values: [
                      inputParam.salary_header_id,
                      inputParam.salary_header_id,
                      inputParam.salary_header_id,
                      inputParam.salary_header_id,
                      inputParam.salary_header_id,
                      inputParam.bulk_year,
                      inputParam.bulk_month,
                      inputParam.employee_id,
                      inputParam.bulk_year,
                      inputParam.bulk_month,
                      inputParam.employee_id,
                      inputParam.employee_id
                    ],
                    printQuery: true
                  })
                  .then(headerResult => {
                    const leave_salary_booking = headerResult[5];
                    const gratuity_provision_booking = headerResult[6];
                    const loan_payable_amount = headerResult[7];

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_header (transaction_date, amount, \
                        voucher_type, document_id, document_number, from_screen, \
                        narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?)",
                        values: [
                          new Date(),
                          inputParam.salary_amount,
                          "journal",
                          inputParam.hims_f_leave_salary_header_id,
                          inputParam.leave_salary_number,
                          inputParam.ScreenCode,
                          "Salary for Employee " +
                            inputParam.employee_code +
                            "/" +
                            inputParam.employee_name +
                            " Amount " +
                            inputParam.salary_amount,
                          new Date(),
                          req.userIdentity.algaeh_d_app_user_id
                        ],
                        printQuery: true
                      })
                      .then(day_end_header => {
                        const insert_finance_detail = [];

                        insert_finance_detail.push(
                          ...headerResult[0],
                          ...headerResult[1],
                          ...headerResult[2],
                          ...headerResult[3],
                          ...headerResult[4],
                          {
                            payment_date: new Date(),
                            head_id: salary_pay_acc.head_id,
                            child_id: salary_pay_acc.child_id,
                            debit_amount: 0,
                            payment_type: "CR",
                            credit_amount: inputParam.salary_amount,
                            hospital_id: inputParam.hospital_id,
                            sub_department_id: null
                          }
                        );

                        leave_salary_booking.forEach(per_employee => {
                          //Booking Leave salary to Laibility account
                          insert_finance_detail.push({
                            payment_date: new Date(),
                            head_id: lv_salary_pay_acc.head_id,
                            child_id: lv_salary_pay_acc.child_id,
                            debit_amount: 0,
                            payment_type: "CR",
                            credit_amount: per_employee.leave_salary,
                            hospital_id: per_employee.hospital_id,
                            sub_department_id: per_employee.sub_department_id
                          });

                          //Booking Leave salary to Expence account
                          insert_finance_detail.push({
                            payment_date: new Date(),
                            head_id: leave_sal_expence_acc.head_id,
                            child_id: leave_sal_expence_acc.child_id,
                            debit_amount: per_employee.leave_salary,
                            payment_type: "DR",
                            credit_amount: 0,
                            hospital_id: per_employee.hospital_id,
                            sub_department_id: per_employee.sub_department_id
                          });

                          if (parseFloat(per_employee.airfare_amount) > 0) {
                            //Booking Airfaie to Laibility account
                            insert_finance_detail.push({
                              payment_date: new Date(),
                              head_id: airfair_pay_acc.head_id,
                              child_id: airfair_pay_acc.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: per_employee.airfare_amount,
                              hospital_id: per_employee.hospital_id,
                              sub_department_id: per_employee.sub_department_id
                            });

                            //Booking Airfaie to Expence account
                            insert_finance_detail.push({
                              payment_date: new Date(),
                              head_id: airfare_expence_acc.head_id,
                              child_id: airfare_expence_acc.child_id,
                              debit_amount: per_employee.airfare_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: per_employee.hospital_id,
                              sub_department_id: per_employee.sub_department_id
                            });
                          }
                        });

                        gratuity_provision_booking.forEach(per_employee => {
                          if (parseFloat(per_employee.gratuity_amount) > 0) {
                            //Booking Gratuity Provision to Laibility account
                            insert_finance_detail.push({
                              payment_date: new Date(),
                              head_id: gratuity_pay_acc.head_id,
                              child_id: gratuity_pay_acc.child_id,
                              debit_amount: 0,
                              payment_type: "CR",
                              credit_amount: per_employee.gratuity_amount,
                              hospital_id: per_employee.hospital_id,
                              sub_department_id: per_employee.sub_department_id
                            });

                            //Booking Gratuity Provision to Expence account
                            insert_finance_detail.push({
                              payment_date: new Date(),
                              head_id: gratuity_expence_acc.head_id,
                              child_id: gratuity_expence_acc.child_id,
                              debit_amount: per_employee.gratuity_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: per_employee.hospital_id,
                              sub_department_id: per_employee.sub_department_id
                            });
                          }
                        });

                        loan_payable_amount.forEach(per_employee => {
                          if (parseFloat(per_employee.approved_amount) > 0) {
                            //Booking Gratuity Provision to Laibility account
                            insert_finance_detail.push({
                              payment_date: new Date(),
                              head_id: per_employee.head_id,
                              child_id: per_employee.child_id,
                              debit_amount: per_employee.approved_amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              hospital_id: per_employee.hospital_id,
                              sub_department_id: per_employee.sub_department_id
                            });
                          }
                        });

                        const IncludeValuess = [
                          "payment_date",
                          "head_id",
                          "child_id",
                          "debit_amount",
                          "payment_type",
                          "credit_amount",
                          "hospital_id",
                          "sub_department_id"
                        ];

                        const month = moment().format("M");
                        const year = moment().format("YYYY");

                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                            values: insert_finance_detail,
                            includeValues: IncludeValuess,
                            bulkInsertOrUpdate: true,
                            extraValues: {
                              day_end_header_id: day_end_header.insertId,
                              year: year,
                              month: month
                            },
                            printQuery: true
                          })
                          .then(subResult => {
                            _mysql.commitTransaction(() => {
                              _mysql.releaseConnection();
                              // req.records = subResult;
                              next();
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
          } else {
            _mysql.commitTransaction(() => {
              _mysql.releaseConnection();
              // req.records = org_data;
              next();
            });
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
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
      // console.log("InsertEmployeeLeaveSalary")

      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_leave_salary_header_id,employee_id,leave_days,leave_salary_amount, \
                airticket_amount, balance_leave_days, balance_leave_salary_amount, balance_airticket_amount, \
                airfare_months from hims_f_employee_leave_salary_header where employee_id = ?;\
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
          // console.log("employee_leave_salary: ", employee_leave_salary);
          let employee_leave_salary_header = employee_leave_salary[0];
          let monthly_leave = employee_leave_salary[1][0];

          // console.log("employee_leave_salary_header: ", employee_leave_salary_header);
          // console.log("monthly_leave: ", monthly_leave);

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
                  `balance_airticket_amount`=?,`airfare_months`=? where  hims_f_employee_leave_salary_header_id=?;\
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
                resolve();
              })
              .catch(e => {
                // console.log("bottle");
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
          // console.log("reject 1", e)
          reject(e);
        });
    } catch (e) {
      // console.log("reject 2")
      reject(e);
    }
  }).catch(e => {
    // console.log("reject 3")
    options.next(e);
  });
}

function InsertGratuityProvision(options) {
  return new Promise((resolve, reject) => {
    try {
      let _mysql = options._mysql;
      const inputParam = options.inputParam;
      const salary_end_date = options.salary_end_date;
      const decimal_places = options.decimal_places;

      const utilities = new algaehUtilities();

      _mysql
        .executeQuery({
          query:
            "select date_of_joining, hims_d_employee_id, date_of_resignation, employee_status, employe_exit_type, \
            datediff(date(?),date(date_of_joining))/365 endOfServiceYears, employee_code, exit_date,\
            full_name, arabic_name, sex, employee_type, employee_designation_id, date_of_birth \
            from hims_d_employee where gratuity_applicable = 'Y' and hims_d_employee_id in(?);\
            select * from hims_d_end_of_service_options;",
          values: [salary_end_date, inputParam.employee_id],
          printQuery: true
        })
        .then(result => {
          const _employee = result[0];
          const _options = result[1];

          if (_employee.length == 0) {
            resolve();
            return;
          }
          if (_options.length == 0) {
            resolve();
            return;
          }
          const _optionsDetals = _options[0];
          if (_optionsDetals.gratuity_provision == 1) {
            let _eligibleDays = 0;

            let strQry = "";
            for (let k = 0; k < _employee.length; k++) {
              new Promise((resolve, reject) => {
                try {
                  if (_optionsDetals.end_of_service_type == "S") {
                    if (
                      _employee[k].endOfServiceYears >= 0 &&
                      _employee[k].endOfServiceYears <=
                        _optionsDetals.from_service_range1
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days1;
                    } else if (
                      _employee[k].endOfServiceYears >=
                        _optionsDetals.from_service_range1 &&
                      _employee[k].endOfServiceYears <=
                        _optionsDetals.from_service_range2
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days2;
                    } else if (
                      _employee[k].endOfServiceYears >=
                        _optionsDetals.from_service_range2 &&
                      _employee[k].endOfServiceYears <=
                        _optionsDetals.from_service_range3
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days3;
                    } else if (
                      _employee[k].endOfServiceYears >=
                        _optionsDetals.from_service_range3 &&
                      _employee[k].endOfServiceYears <=
                        _optionsDetals.from_service_range4
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days4;
                    } else if (
                      _employee[k].endOfServiceYears >=
                        _optionsDetals.from_service_range4 &&
                      _employee[k].endOfServiceYears <=
                        _optionsDetals.from_service_range5
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days5;
                    } else if (
                      _employee[k].endOfServiceYears >=
                      _optionsDetals.from_service_range5
                    ) {
                      _eligibleDays =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days5;
                    }
                  } else if (_optionsDetals.end_of_service_type == "H") {
                    let by =
                      _employee[k].endOfServiceYears -
                      _optionsDetals.from_service_range1;
                    let ted = 0;
                    if (by > 0) {
                      ted =
                        _optionsDetals.from_service_range1 *
                        _optionsDetals.eligible_days1;
                      by =
                        _employee[k].endOfServiceYears -
                        _optionsDetals.from_service_range2;
                      if (by > 0) {
                        ted =
                          (ted +
                            (_optionsDetals.from_service_range2 -
                              _optionsDetals.from_service_range1)) *
                          by;
                        by =
                          _employee[k].endOfServiceYears -
                          _optionsDetals.from_service_range3;
                        if (by > 0) {
                          ted =
                            (ted +
                              (_optionsDetals.from_service_range3 -
                                _optionsDetals.from_service_range2)) *
                            by;
                          by =
                            _employee[k].endOfServiceYears -
                            _optionsDetals.from_service_range3;
                          if (by > 0) {
                            ted =
                              (ted +
                                (_optionsDetals.from_service_range4 -
                                  _optionsDetals.from_service_range3)) *
                              by;
                            by =
                              _employee[k].endOfServiceYears -
                              _optionsDetals.from_service_range4;
                            if (by > 0) {
                              ted =
                                (ted +
                                  (_optionsDetals.from_service_range5 -
                                    _optionsDetals.from_service_range4)) *
                                by;
                            } else {
                              _eligibleDays =
                                ted + by * _optionsDetals.eligible_days4;
                            }
                          } else {
                            _eligibleDays =
                              ted + by * _optionsDetals.eligible_days3;
                          }
                        }
                      } else {
                        _eligibleDays =
                          ted + by * _optionsDetals.eligible_days2;
                      }
                    } else {
                      ted =
                        _employee[k].endOfServiceYears *
                        _optionsDetals.eligible_days1;
                    }
                    ted = _eligibleDays;
                  }

                  let _componentsList_total = [];
                  if (_optionsDetals.end_of_service_component1 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component1
                    );
                  }
                  if (_optionsDetals.end_of_service_component2 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component2
                    );
                  }
                  if (_optionsDetals.end_of_service_component3 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component3
                    );
                  }
                  if (_optionsDetals.end_of_service_component4 != null) {
                    _componentsList_total.push(
                      _optionsDetals.end_of_service_component4
                    );
                  }

                  _mysql
                    .executeQuery({
                      query:
                        "select hims_d_employee_earnings_id,employee_id, earnings_id,earning_deduction_description,\
                  EE.short_desc, amount from hims_d_employee_earnings EE, hims_d_earning_deduction ED where \
                  ED.hims_d_earning_deduction_id = EE.earnings_id \
                  and EE.employee_id=? and ED.hims_d_earning_deduction_id in(?) and ED.record_status='A'",
                      values: [
                        _employee[k].hims_d_employee_id,
                        _componentsList_total
                      ],
                      printQuery: true
                    })
                    .then(earnings => {
                      // _mysql.releaseConnection();
                      let _computatedAmout = [];
                      if (_optionsDetals.end_of_service_calculation == "AN") {
                        _computatedAmout = _.chain(earnings).map(items => {
                          return (items.amount * 12) / 365;
                        });
                      } else if (
                        _optionsDetals.end_of_service_calculation == "FI"
                      ) {
                        _computatedAmout = _.chain(earnings).map(items => {
                          return (
                            items.amount / _optionsDetals.end_of_service_days
                          );
                        });
                      }

                      let _computatedAmoutSum =
                        _computatedAmout.reduce((a, b) => {
                          return a + b;
                        }, 0) * _eligibleDays;

                      _computatedAmoutSum = utilities.decimalPoints(
                        _computatedAmoutSum,
                        decimal_places
                      );

                      strQry += mysql.format(
                        "INSERT IGNORE INTO `hims_f_gratuity_provision`(`employee_id`,`year`,\
                      `month`,`gratuity_amount`) VALUE(?,?,?,?);",
                        [
                          _employee[k].hims_d_employee_id,
                          inputParam.year,
                          inputParam.month,
                          _computatedAmoutSum
                        ]
                      );

                      if (k == _employee.length - 1) {
                        resolve();
                      }
                    })
                    .catch(e => {
                      reject(e);
                    });
                } catch (e) {
                  reject(e);
                }
              })
                .then(result => {
                  _mysql
                    .executeQuery({
                      query: strQry,
                      printQuery: true
                    })
                    .then(result => {
                      resolve();
                    })
                    .catch(e => {
                      reject(e);
                    });
                })
                .catch(e => {
                  reject(e);
                });
            }
          } else {
            resolve();
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
