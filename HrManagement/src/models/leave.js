import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import extend from "extend";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
import { promisify } from "util";

//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";

//created by irfan: to get hieghest auth level
function getMaxAuth(options) {
  const _mysql = options.mysql;
  let MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth;
  return new Promise((resolve, reject) => {
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_hrms_options"
      })
      .then(result => {
        _mysql.releaseConnection();
        //LEAVE
        switch (result[0]["leave_level"]) {
          case "1":
            MaxLeave = "1";
            break;

          case "2":
            MaxLeave = "2";
            break;
          case "3":
            MaxLeave = "3";
            break;
          case "4":
            MaxLeave = "4";
            break;
          case "5":
            MaxLeave = "5";
            break;
          default:
        }

        //LOAN
        switch (result[0]["loan_level"]) {
          case "1":
            MaxLoan = "1";
            break;

          case "2":
            MaxLoan = "2";
            break;
          case "3":
            MaxLoan = "3";
            break;
          case "4":
            MaxLoan = "4";
            break;
          case "5":
            MaxLoan = "5";
            break;
          default:
        }
        //LEAVE ENCASH
        switch (result[0]["leave_encash_level"]) {
          case "1":
            MaxLeaveEncash = "1";
            break;

          case "2":
            MaxLeaveEncash = "2";
            break;
          case "3":
            MaxLeaveEncash = "3";
            break;
          case "4":
            MaxLeaveEncash = "4";
            break;
          case "5":
            MaxLeaveEncash = "5";
            break;
          default:
        }
        //REVIEW AUTH
        switch (result[0]["review_auth_level"]) {
          case "1":
            MaxreviewAuth = "1";
            break;

          case "2":
            MaxreviewAuth = "2";
            break;
          case "3":
            MaxreviewAuth = "3";
            break;
          case "4":
            MaxreviewAuth = "4";
            break;
          case "5":
            MaxreviewAuth = "5";
            break;
          default:
        }

        resolve({ MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth });
      })
      .catch(e => {
        _mysql.releaseConnection();
        reject(e);
      });
  });
}
export default {
  getMaxAuth: getMaxAuth,
  //created by irfan: to
  authorizeLeaveBKP_14_sept_2019: (req, res, next) => {
    const utilities = new algaehUtilities();
    const input = req.body;
    let salary_processed = "N";
    let annual_leave_process_separately = "N";
    if (req.userIdentity.leave_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql
      })
        .then(maxAuth => {
          if (
            req.userIdentity.leave_authorize_privilege != maxAuth.MaxLeave ||
            input.auth_level != maxAuth.MaxLeave
          ) {
            //for lower level authorize
            getLeaveAuthFields(input.auth_level).then(authFields => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_leave_application SET " +
                    authFields +
                    ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=? ",
                  values: [
                    "Y",
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.authorized_comment,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_leave_application_id
                  ],
                  printQuery: false
                })
                .then(authResult => {
                  if (authResult.affectedRows > 0 && input.status == "R") {
                    _mysql
                      .executeQuery({
                        query:
                          "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                              and hims_f_leave_application_id=?",
                        values: [input.hims_f_leave_application_id]
                      })
                      .then(rejectResult => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejectResult;
                          next();
                        });
                      })
                      .catch(error => {
                        reject(error);
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (authResult.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = authResult;
                      next();
                    });
                  }
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          } else if (
            req.userIdentity.leave_authorize_privilege == maxAuth.MaxLeave &&
            input.auth_level == maxAuth.MaxLeave
          ) {
            //if he has highest previlege
            getLeaveAuthFields(input.auth_level).then(authFields => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_leave_application SET " +
                    authFields +
                    ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=? ",
                  values: [
                    "Y",
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.authorized_comment,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_leave_application_id
                  ],
                  printQuery: false
                })
                .then(authResult => {
                  if (authResult.affectedRows > 0 && input.status == "R") {
                    _mysql
                      .executeQuery({
                        query:
                          "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                              and hims_f_leave_application_id=?",
                        values: [input.hims_f_leave_application_id]
                      })
                      .then(rejectResult => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejectResult;
                          next();
                        });
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (
                    authResult.affectedRows > 0 &&
                    input.status == "A"
                  ) {
                    const month_number = moment(input.from_date).format("M");
                    const month_name = moment(input.from_date).format("MMMM");
                    let updaid_leave_duration = 0;
                    let id = 0;
                    //---START OF-------normal authrization

                    new Promise((resolve, reject) => {
                      try {
                        _mysql
                          .executeQuery({
                            query:
                              "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                                hims_f_salary where `month`=? and `year`=? and employee_id=?;\
                                SELECT annual_leave_process_separately from hims_d_hrms_options ",
                            values: [
                              month_number,
                              input.year,
                              input.employee_id
                            ],
                            printQuery: false
                          })
                          .then(salResult => {
                            annual_leave_process_separately =
                              salResult[1][0][
                              "annual_leave_process_separately"
                              ];
                            if (
                              salResult[0].length > 0 &&
                              salResult[0][0]["salary_processed"] == "Y"
                            ) {
                              salary_processed = "Y";
                              resolve({ salResult });
                            } else {
                              resolve({ salResult });
                            }
                          })
                          .then(pendingUpdaidResult => {
                            calc(_mysql, req.body)
                              .then(deductionResult => {
                                if (deductionResult.invalid_input == true) {
                                  _mysql.rollBackTransaction(() => {
                                    req.records = deductionResult;
                                    next();
                                  });
                                } else {
                                  return deductionResult;
                                }
                              })
                              .then(deductionResult => {
                                updaid_leave_duration = new LINQ(
                                  deductionResult.monthWiseCalculatedLeaveDeduction
                                )
                                  .Where(w => w.month_name == month_name)
                                  .Select(s => s.finalLeave)
                                  .FirstOrDefault();

                                let monthArray = new LINQ(
                                  deductionResult.monthWiseCalculatedLeaveDeduction
                                )
                                  .Select(s => s.month_name)
                                  .ToArray();

                                if (monthArray.length > 0) {
                                  _mysql
                                    .executeQuery({
                                      query: `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                                          from hims_f_employee_monthly_leave where
                                        employee_id=? and year=? and leave_id=?`,
                                      values: [
                                        input.employee_id,
                                        input.year,
                                        input.leave_id
                                      ]
                                    })
                                    .then(leaveData => {
                                      if (
                                        leaveData.length > 0 &&
                                        parseFloat(
                                          deductionResult.calculatedLeaveDays
                                        ) <=
                                        parseFloat(
                                          leaveData[0]["close_balance"]
                                        )
                                      ) {
                                        let newCloseBal =
                                          parseFloat(
                                            leaveData[0]["close_balance"]
                                          ) -
                                          parseFloat(
                                            deductionResult.calculatedLeaveDays
                                          );

                                        let newAvailTillDate =
                                          parseFloat(
                                            leaveData[0]["availed_till_date"]
                                          ) +
                                          parseFloat(
                                            deductionResult.calculatedLeaveDays
                                          );

                                        let oldMonthsData = [];

                                        for (
                                          let i = 0;
                                          i < monthArray.length;
                                          i++
                                        ) {
                                          Object.keys(leaveData[0]).map(key => {
                                            if (key == monthArray[i]) {
                                              oldMonthsData.push({
                                                month_name: key,
                                                finalLeave: leaveData[0][key]
                                              });
                                            }
                                          });
                                        }

                                        let mergemonths = oldMonthsData.concat(
                                          deductionResult.monthWiseCalculatedLeaveDeduction
                                        );

                                        let finalData = {};
                                        _.chain(mergemonths)
                                          .groupBy(g => g.month_name)
                                          .map(item => {
                                            finalData[
                                              _.get(
                                                _.find(item, "month_name"),
                                                "month_name"
                                              )
                                            ] = _.sumBy(item, s => {
                                              return parseFloat(s.finalLeave);
                                            });
                                          })
                                          .value();

                                        let insertPendLeave = "";
                                        if (
                                          salary_processed == "Y" &&
                                          input.leave_type == "U"
                                        ) {
                                          insertPendLeave = ` insert into hims_f_pending_leave (employee_id, year, month,leave_application_id,updaid_leave_duration) VALUE(${input.employee_id},
                                                        ${input.year},
                                                        ${month_number},
                                                        ${input.hims_f_leave_application_id},${updaid_leave_duration});`;
                                        }

                                        let anualLeave = "";
                                        if (
                                          annual_leave_process_separately ==
                                          "Y" &&
                                          input.leave_category == "A"
                                        ) {
                                          anualLeave = ` insert into hims_f_employee_annual_leave (employee_id,year,month,leave_application_id) VALUE(${input.employee_id},
                                                        ${input.year},
                                                        ${month_number},
                                                        ${input.hims_f_leave_application_id});`;
                                        }

                                        //if he is regularizing absent to leave
                                        let convertToLeave = "";
                                        if (
                                          input.leave_from == "AB" &&
                                          input.absent_id > 0
                                        ) {
                                          let paid = 0;
                                          let unpaid = 0;

                                          if (input.leave_type == "P") {
                                            paid = 1;
                                          } else if (input.leave_type == "U") {
                                            unpaid = 1;
                                          }

                                          let leave = "";
                                          if (input.leave_type == "P") {
                                            leave = `, paid_leave=paid_leave+1 `;
                                          } else if (input.leave_type == "U") {
                                            leave = `, unpaid_leave=unpaid_leave+1 `;
                                          }

                                          convertToLeave = ` update hims_f_daily_time_sheet set status='${input.leave_type +
                                            "L"}', actual_hours=0,actual_minutes=0 where hospital_id=${
                                            input.hospital_id
                                            }  and employee_id=${
                                            input.employee_id
                                            } and attendance_date='${
                                            input.from_date
                                            }';
                                                      update hims_f_daily_attendance set absent_days=0 ,paid_leave=${paid},unpaid_leave=${unpaid} where hospital_id=${
                                            input.hospital_id
                                            } and employee_id=${
                                            input.employee_id
                                            } and attendance_date='${
                                            input.from_date
                                            }';
                                                      update hims_f_attendance_monthly set absent_days=absent_days-1,total_leave=total_leave+1 ${leave}
                                                      where hospital_id=${
                                            input.hospital_id
                                            } and employee_id=${
                                            input.employee_id
                                            } and year=${
                                            input.year
                                            } and month=${month_number};
                                                      update hims_f_absent set status='CTL' ,processed='Y' where hims_f_absent_id=${
                                            input.absent_id
                                            };`;
                                        }

                                        _mysql
                                          .executeQuery({
                                            query:
                                              convertToLeave +
                                              " update hims_f_leave_application set status='APR',approved_by=" +
                                              req.userIdentity
                                                .algaeh_d_app_user_id +
                                              ", approved_date='" +
                                              moment().format("YYYY-MM-DD") +
                                              "' where record_status='A' \
                                                    and hims_f_leave_application_id=" +
                                              input.hims_f_leave_application_id +
                                              ";update hims_f_employee_monthly_leave set ?  where \
                                                    hims_f_employee_monthly_leave_id='" +
                                              leaveData[0]
                                                .hims_f_employee_monthly_leave_id +
                                              "';" +
                                              insertPendLeave +
                                              anualLeave,
                                            values: [
                                              {
                                                ...finalData,
                                                close_balance: newCloseBal,
                                                availed_till_date: newAvailTillDate
                                              }
                                            ],
                                            printQuery: false
                                          })
                                          .then(finalRes => {
                                            _mysql.commitTransaction(() => {
                                              _mysql.releaseConnection();
                                              req.records = finalRes;
                                              next();
                                            });
                                          })
                                          .catch(error => {
                                            utilities
                                              .logger()
                                              .log("error: ", error);
                                            _mysql.rollBackTransaction(() => {
                                              next(error);
                                            });
                                          });
                                      } else {
                                        //invalid data
                                        req.records = {
                                          invalid_input: true,
                                          message: "leave balance is low"
                                        };
                                        connection.rollback(() => {
                                          releaseDBConnection(db, connection);
                                          next();
                                        });
                                      }
                                    })
                                    .catch(error => {
                                      _mysql.rollBackTransaction(() => {
                                        next(error);
                                      });
                                    });
                                } else {
                                  //invalid data

                                  req.records = {
                                    invalid_input: true,
                                    message: "please provide valid month"
                                  };
                                  _mysql.rollBackTransaction(() => {
                                    next();
                                    return;
                                  });
                                }
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
                        reject(e);
                      }
                    });

                    //---END OF-------normal authrization
                  } else if (authResult.affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = authResult;
                      next();
                    });
                  }
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege"
      };
      next();
    }
  },
  //created by irfan: to

  authorizeLeave_BEFORE_ACROSS_YEAR: (req, res, next) => {
    const utilities = new algaehUtilities();
    const input = req.body;
    let salary_processed = "N";
    let annual_leave_process_separately = "N";
    if (req.userIdentity.leave_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql
      })
        .then(maxAuth => {
          if (
            req.userIdentity.leave_authorize_privilege < maxAuth.MaxLeave ||
            input.auth_level < maxAuth.MaxLeave
          ) {
            //for lower level authorize
            if (input.status == "R") {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                            and hims_f_leave_application_id=?",
                  values: [input.hims_f_leave_application_id]
                })
                .then(rejectResult => {
                  _mysql.commitTransaction(() => {
                    _mysql.releaseConnection();
                    req.records = rejectResult;
                    next();
                  });
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              _mysql
                .executeQuery({
                  query:
                    " select attendance_starts,at_end_date from hims_d_hrms_options limit 1; ",
                  printQuery: false
                })
                .then(authResult => {
                  req.body["attendance_starts"] =
                    authResult[0]["attendance_starts"];
                  req.body["at_end_date"] = authResult[0]["at_end_date"];

                  calc(_mysql, req.body)
                    .then(deductionResult => {
                      if (deductionResult.invalid_input == true) {
                        _mysql.releaseConnection();
                        req.records = {
                          invalid_input: true,
                          message:
                            " this Employee doesnt have Request-Days of leaves "
                        };
                        next();
                      } else {
                        getLeaveAuthFields(input["auth_level"]).then(
                          authFields => {
                            _mysql
                              .executeQuery({
                                query:
                                  "UPDATE hims_f_leave_application SET " +
                                  authFields +
                                  ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=? ",
                                values: [
                                  "Y",
                                  new Date(),
                                  req.userIdentity.algaeh_d_app_user_id,
                                  input.authorized_comment,
                                  new Date(),
                                  req.userIdentity.algaeh_d_app_user_id,
                                  input.hims_f_leave_application_id
                                ],
                                printQuery: false
                              })
                              .then(authResult => {
                                _mysql.releaseConnection();
                                req.records = authResult;
                                next();
                              })
                              .catch(error => {
                                _mysql.releaseConnection();
                                next(error);
                              });
                          }
                        );
                      }
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      next(e);
                    });
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            }
          } else if (
            req.userIdentity.leave_authorize_privilege >= maxAuth.MaxLeave &&
            input.auth_level >= maxAuth.MaxLeave
          ) {
            // const auth_level=input.auth_level;

            getLeaveAuthFields(input["auth_level"]).then(authFields => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_leave_application SET " +
                    authFields +
                    ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?;\
                          select attendance_starts,at_end_date from hims_d_hrms_options limit 1; ",
                  values: [
                    "Y",
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.authorized_comment,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_leave_application_id
                  ],
                  printQuery: false
                })
                .then(authResult => {
                  if (authResult[0].affectedRows > 0 && input.status == "R") {
                    _mysql
                      .executeQuery({
                        query:
                          "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                                and hims_f_leave_application_id=?",
                        values: [input.hims_f_leave_application_id]
                      })
                      .then(rejectResult => {
                        _mysql.commitTransaction(() => {
                          _mysql.releaseConnection();
                          req.records = rejectResult;
                          next();
                        });
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (
                    authResult[0].affectedRows > 0 &&
                    input.status == "A"
                  ) {
                    let month_number = 0;

                    req.body["attendance_starts"] =
                      authResult[1][0]["attendance_starts"];
                    req.body["at_end_date"] = authResult[1][0]["at_end_date"];
                    if (
                      authResult[1][0]["attendance_starts"] == "PM" &&
                      authResult[1][0]["at_end_date"] > 0
                    ) {
                      const day = moment(input.from_date, "YYYY-MM-DD").format(
                        "D"
                      );

                      if (day <= authResult[1][0]["at_end_date"]) {
                        month_number = moment(
                          input.from_date,
                          "YYYY-MM-DD"
                        ).format("M");
                      } else {
                        month_number =
                          parseInt(
                            moment(input.from_date, "YYYY-MM-DD").format("M")
                          ) + parseInt(1);
                      }
                    } else {
                      month_number = moment(
                        input.from_date,
                        "YYYY-MM-DD"
                      ).format("M");
                    }

                    const month_name = moment(input.from_date).format("MMMM");
                    let updaid_leave_duration = 0;
                    let id = 0;
                    //---START OF-------normal authrization

                    new Promise((resolve, reject) => {
                      try {
                        _mysql
                          .executeQuery({
                            query:
                              "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                                  hims_f_salary where `month`=? and `year`=? and employee_id=?;\
                                  SELECT annual_leave_process_separately from hims_d_hrms_options ",
                            values: [
                              month_number,
                              input.year,
                              input.employee_id
                            ],
                            printQuery: false
                          })
                          .then(salResult => {
                            annual_leave_process_separately =
                              salResult[1][0][
                              "annual_leave_process_separately"
                              ];
                            if (
                              salResult[0].length > 0 &&
                              salResult[0][0]["salary_processed"] == "Y"
                            ) {
                              salary_processed = "Y";
                              resolve({ salResult });
                            } else {
                              resolve({ salResult });
                            }
                          })
                          .then(pendingUpdaidResult => {
                            calc(_mysql, req.body)
                              .then(deductionResult => {
                                if (deductionResult.invalid_input == true) {
                                  _mysql.rollBackTransaction(() => {
                                    req.records = deductionResult;
                                    next();
                                    return;
                                  });
                                } else {
                                  return deductionResult;
                                }
                              })
                              .then(deductionResult => {
                                updaid_leave_duration = new LINQ(
                                  deductionResult.monthWiseCalculatedLeaveDeduction
                                )
                                  .Where(w => w.month_name == month_name)
                                  .Select(s => s.finalLeave)
                                  .FirstOrDefault();

                                let monthArray = new LINQ(
                                  deductionResult.monthWiseCalculatedLeaveDeduction
                                )
                                  .Select(s => s.month_name)
                                  .ToArray();

                                if (monthArray.length > 0) {
                                  _mysql
                                    .executeQuery({
                                      query: `select L.leave_category, hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                                            from hims_f_employee_monthly_leave ML inner join hims_d_leave L  on ML.leave_id=L.hims_d_leave_id where
                                          employee_id=? and year=? and ML.leave_id=?`,
                                      values: [
                                        input.employee_id,
                                        input.year,
                                        input.leave_id
                                      ],
                                      printQuery: false
                                    })
                                    .then(leaveData => {
                                      if (
                                        leaveData.length > 0 &&
                                        (parseFloat(
                                          deductionResult.calculatedLeaveDays
                                        ) <=
                                          parseFloat(
                                            leaveData[0]["close_balance"]
                                          ) ||
                                          deductionResult.annual_leave == "Y")
                                      ) {
                                        utilities
                                          .logger()
                                          .log("FOUR: ", "FOUR");

                                        let newCloseBal = "";
                                        let actualClosingBal = 0;
                                        let projected_applied_leaves = 0;

                                        let newAvailTillDate =
                                          parseFloat(
                                            leaveData[0]["availed_till_date"]
                                          ) +
                                          parseFloat(
                                            deductionResult.calculatedLeaveDays
                                          );
                                        if (
                                          deductionResult.annual_leave == "Y"
                                        ) {
                                          newCloseBal =
                                            deductionResult.currentClosingBal;
                                          actualClosingBal =
                                            deductionResult.actualClosingBal;
                                          projected_applied_leaves =
                                            deductionResult.projected_applied_leaves;
                                        } else {
                                          newCloseBal =
                                            parseFloat(
                                              leaveData[0]["close_balance"]
                                            ) -
                                            parseFloat(
                                              deductionResult.calculatedLeaveDays
                                            );
                                        }

                                        let oldMonthsData = [];

                                        for (
                                          let i = 0;
                                          i < monthArray.length;
                                          i++
                                        ) {
                                          Object.keys(leaveData[0]).map(key => {
                                            if (key == monthArray[i]) {
                                              oldMonthsData.push({
                                                month_name: key,
                                                finalLeave: leaveData[0][key]
                                              });
                                            }
                                          });
                                        }

                                        let mergemonths = oldMonthsData.concat(
                                          deductionResult.monthWiseCalculatedLeaveDeduction
                                        );

                                        let finalData = {};
                                        _.chain(mergemonths)
                                          .groupBy(g => g.month_name)
                                          .map(item => {
                                            finalData[
                                              _.get(
                                                _.find(item, "month_name"),
                                                "month_name"
                                              )
                                            ] = _.sumBy(item, s => {
                                              return parseFloat(s.finalLeave);
                                            });
                                          })
                                          .value();

                                        let insertPendLeave = "";
                                        if (
                                          salary_processed == "Y" &&
                                          input.leave_type == "U"
                                        ) {
                                          insertPendLeave = ` insert into hims_f_pending_leave (employee_id, year, month,leave_application_id,updaid_leave_duration) VALUE(${input.employee_id},
                                                          ${input.year},
                                                          ${month_number},
                                                          ${input.hims_f_leave_application_id},${updaid_leave_duration});`;
                                        }

                                        let anualLeave = "";

                                        if (
                                          annual_leave_process_separately ==
                                          "Y" &&
                                          input.leave_category == "A"
                                        ) {
                                          anualLeave = ` insert into hims_f_employee_annual_leave (employee_id,year,month,leave_application_id,hospital_id,from_normal_salary) VALUE(${input.employee_id},
                                                          ${input.year},
                                                          ${month_number},
                                                          ${input.hims_f_leave_application_id},
                                                          ${input.hospital_id},
                                                          '${input.from_normal_salary}'
                                                          );`;
                                        }

                                        //if he is regularizing absent to leave
                                        let convertToLeave = "";
                                        if (
                                          input.leave_from == "AB" &&
                                          input.absent_id > 0
                                        ) {
                                          let paid = 0;
                                          let unpaid = 0;

                                          if (input.leave_type == "P") {
                                            paid = 1;
                                          } else if (input.leave_type == "U") {
                                            unpaid = 1;
                                          }

                                          let leave = "";
                                          if (input.leave_type == "P") {
                                            leave = `, paid_leave=paid_leave+1 `;
                                          } else if (input.leave_type == "U") {
                                            leave = `, unpaid_leave=unpaid_leave+1 `;
                                          }

                                          convertToLeave = ` update hims_f_daily_time_sheet set status='${input.leave_type +
                                            "L"}', actual_hours=0,actual_minutes=0 where hospital_id=${
                                            input.hospital_id
                                            }  and employee_id=${
                                            input.employee_id
                                            } and attendance_date='${
                                            input.from_date
                                            }';
                                                        update hims_f_daily_attendance set absent_days=0 ,paid_leave=${paid},unpaid_leave=${unpaid} where hospital_id=${
                                            input.hospital_id
                                            } and employee_id=${
                                            input.employee_id
                                            } and attendance_date='${
                                            input.from_date
                                            }';
                                                        update hims_f_attendance_monthly set absent_days=absent_days-1,total_leave=total_leave+1 ${leave}
                                                        where hospital_id=${
                                            input.hospital_id
                                            } and employee_id=${
                                            input.employee_id
                                            } and year=${
                                            input.year
                                            } and month=${month_number};
                                                        update hims_f_absent set status='CTL' ,processed='Y' where hims_f_absent_id=${
                                            input.absent_id
                                            };`;
                                        }

                                        _mysql
                                          .executeQuery({
                                            query:
                                              convertToLeave +
                                              " update hims_f_leave_application set status='APR',approved_by=" +
                                              req.userIdentity
                                                .algaeh_d_app_user_id +
                                              ", approved_date='" +
                                              moment().format("YYYY-MM-DD") +
                                              "' where record_status='A' \
                                                      and hims_f_leave_application_id=" +
                                              input.hims_f_leave_application_id +
                                              ";update hims_f_employee_monthly_leave set ?  where \
                                                      hims_f_employee_monthly_leave_id='" +
                                              leaveData[0]
                                                .hims_f_employee_monthly_leave_id +
                                              "';" +
                                              insertPendLeave +
                                              anualLeave,
                                            values: [
                                              {
                                                ...finalData,
                                                close_balance: newCloseBal,
                                                availed_till_date: newAvailTillDate,
                                                projected_applied_leaves: projected_applied_leaves,
                                                actual_closing_balance: actualClosingBal
                                              }
                                            ],
                                            printQuery: false
                                          })
                                          .then(finalRes => {
                                            _mysql.commitTransaction(() => {
                                              _mysql.releaseConnection();
                                              req.records = finalRes;
                                              next();
                                            });
                                          })
                                          .catch(error => {
                                            utilities
                                              .logger()
                                              .log("error: ", error);
                                            _mysql.rollBackTransaction(() => {
                                              next(error);
                                            });
                                          });
                                      } else {
                                        //invalid data
                                        req.records = {
                                          invalid_input: true,
                                          message: "leave balance is low"
                                        };

                                        _mysql.rollBackTransaction(() => { });
                                        next();
                                      }
                                    })
                                    .catch(error => {
                                      console.log("error6:", error);
                                      _mysql.rollBackTransaction(() => {
                                        next(error);
                                      });
                                    });
                                } else {
                                  //invalid data

                                  req.records = {
                                    invalid_input: true,
                                    message: "please provide valid month"
                                  };
                                  _mysql.rollBackTransaction(() => {
                                    next();
                                    return;
                                  });
                                }
                              })
                              .catch(e => {
                                console.log("error2:", e);
                                _mysql.rollBackTransaction(() => {
                                  next(e);
                                });
                              });
                          })
                          .catch(e => {
                            console.log("error3:", e);
                            _mysql.rollBackTransaction(() => {
                              next(e);
                            });
                          });
                      } catch (e) {
                        console.log("error4:", e);
                        reject(e);
                      }
                    });

                    //---END OF-------normal authrization
                  } else if (authResult[0].affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = authResult;
                      next();
                    });
                  }
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege"
      };
      next();
    }
  },
  authorizeLeave: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    let salary_processed = "N";
    let annual_leave_process_separately = "N";
    if (req.userIdentity.leave_authorize_privilege != "N") {
      const _mysql = new algaehMysql();
      // get highest auth level
      getMaxAuth({
        mysql: _mysql
      })
        .then(maxAuth => {
          if (
            req.userIdentity.leave_authorize_privilege < maxAuth.MaxLeave ||
            input.auth_level < maxAuth.MaxLeave
          ) {
            //for lower level authorize
            if (input.status == "R") {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                            and hims_f_leave_application_id=?\
                            select hims_f_leave_application_id,employee_id,from_date,to_date,leave_id,is_across_year_leave\
                            from hims_f_leave_application where  `status`<>'APR' and employee_id=?\
                            and hims_f_leave_application_id=? ",
                  values: [
                    input.hims_f_leave_application_id,
                    input.employee_id,
                    input.hims_f_leave_application_id
                  ]
                })
                .then(rejectResult => {
                  // _mysql.commitTransaction(() => {
                  //   _mysql.releaseConnection();
                  //   req.records = rejectResult;
                  //   next();
                  // });

                  if (rejectResult[1][0]["is_across_year_leave"] == "Y") {
                    //YOU CAN CANCEL
                    input["cancel"] = "Y";
                    input = { ...input, ...rejectResult[1][0] };
                    // req.body["leave_id"]=result[0]["leave_id"];
                    //------------------------------------------------------------------
                    validateLeaveApplictn(input, _mysql)
                      .then(deductionResult => {
                        _mysql
                          .executeQuery({
                            query: `select * from hims_f_employee_monthly_leave where employee_id=? and year in (?) and leave_id=?;\
                          select leave_application_code from hims_f_leave_application where employee_id=? and leave_id=? and (date_format(from_date,'%Y')=? \
                           or date_format(to_date,'%Y')=? ) and status<>'CAN' and status<>'REJ'    and hims_f_leave_application_id<>?;
                          `,
                            values: [
                              input.employee_id,
                              [
                                deductionResult.from_year,
                                deductionResult.to_year
                              ],
                              input.leave_id,
                              input.employee_id,
                              input.leave_id,
                              deductionResult.to_year,
                              deductionResult.to_year,
                              input.hims_f_leave_application_id
                            ],
                            printQuery: false
                          })
                          .then(resdata => {
                            const leaveData = resdata[0];
                            const acrossYearSecondLeave = resdata[1];

                            if (leaveData.length > 0) {
                              if (deductionResult.is_across_year_leave == "Y") {
                                if (acrossYearSecondLeave.length > 0) {
                                  _mysql.releaseConnection();
                                  req.records = {
                                    invalid_input: true,
                                    message: `Please Cancel (${
                                      acrossYearSecondLeave[0][
                                      "leave_application_code"
                                      ]
                                      }) application First `
                                  };
                                  next();
                                } else {
                                  const cur_year_leaveData = leaveData.filter(
                                    f => f.year == deductionResult.from_year
                                  );
                                  const next_year_leaveData = leaveData.filter(
                                    f => f.year == deductionResult.to_year
                                  );

                                  acrossYearCancel(
                                    deductionResult,
                                    cur_year_leaveData,
                                    next_year_leaveData,
                                    input,
                                    req
                                  )
                                    .then(resu => {
                                      _mysql
                                        .executeQueryWithTransaction({
                                          query:
                                            resu.delete_partB +
                                            resu.deletePendingLeave +
                                            resu.anualLeave +
                                            "update hims_f_employee_monthly_leave set carry_forward_done='N',carry_forward_leave=0,processed='N' where\
                              hims_f_employee_monthly_leave_id=?",
                                          values: [
                                            resu.hims_f_employee_monthly_leave_id
                                          ],
                                          printQuery: false
                                        })
                                        .then(finalRes => {
                                          _mysql.commitTransaction(() => {
                                            _mysql.releaseConnection();
                                            req.records = finalRes;
                                            next();
                                          });
                                        })
                                        .catch(error => {
                                          console.log("error: ", error);
                                          _mysql.rollBackTransaction(() => {
                                            next(error);
                                          });
                                        });
                                    })
                                    .catch(error => {
                                      console.log("error55: ", error);
                                      _mysql.releaseConnection();
                                      req.records = error;
                                      next(error);
                                    });
                                }
                              } else {
                                //invalid data
                                _mysql.releaseConnection();
                                req.records = {
                                  invalid_input: true,
                                  message: "leave Not found"
                                };

                                _mysql.rollBackTransaction(() => { });
                                next();
                              }
                            } else {
                              //invalid data
                              _mysql.releaseConnection();
                              req.records = {
                                invalid_input: true,
                                message: "leave Not found"
                              };

                              _mysql.rollBackTransaction(() => { });
                              next();
                            }
                          })
                          .catch(error => {
                            console.log("error6:", error);
                            _mysql.rollBackTransaction(() => {
                              next(error);
                            });
                          });
                      })
                      .catch(error => {
                        console.log("error6:", error);
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = rejectResult;
                      next();
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
              _mysql
                .executeQuery({
                  query:
                    " select attendance_starts,at_end_date from hims_d_hrms_options limit 1; ",
                  printQuery: false
                })
                .then(authResult => {
                  req.body["attendance_starts"] =
                    authResult[0]["attendance_starts"];
                  req.body["at_end_date"] = authResult[0]["at_end_date"];

                  req.body["from_athurization"] = "Y";
                  validateLeaveApplictn(req.body, _mysql)
                    .then(deductionResult => {
                      getLeaveAuthFields(input["auth_level"]).then(
                        authFields => {
                          _mysql
                            .executeQuery({
                              query:
                                "UPDATE hims_f_leave_application SET " +
                                authFields +
                                ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=? ",
                              values: [
                                "Y",
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                input.authorized_comment,
                                new Date(),
                                req.userIdentity.algaeh_d_app_user_id,
                                input.hims_f_leave_application_id
                              ],
                              printQuery: false
                            })
                            .then(authResult => {
                              _mysql.releaseConnection();
                              req.records = authResult;
                              next();
                            })
                            .catch(error => {
                              _mysql.releaseConnection();
                              next(error);
                            });
                        }
                      );
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      console.log("error25:", e);
                      req.records = e;
                      next(e);
                      return;
                    });
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            }
          } else if (
            req.userIdentity.leave_authorize_privilege >= maxAuth.MaxLeave &&
            input.auth_level >= maxAuth.MaxLeave
          ) {
            // const auth_level=input.auth_level;

            getLeaveAuthFields(input["auth_level"]).then(authFields => {
              _mysql
                .executeQueryWithTransaction({
                  query:
                    "UPDATE hims_f_leave_application SET " +
                    authFields +
                    ", updated_date=?, updated_by=?  WHERE hims_f_leave_application_id=?;\
                          select attendance_starts,at_end_date from hims_d_hrms_options limit 1; ",
                  values: [
                    "Y",
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.authorized_comment,
                    new Date(),
                    req.userIdentity.algaeh_d_app_user_id,
                    input.hims_f_leave_application_id
                  ],
                  printQuery: false
                })
                .then(authResult => {
                  if (authResult[0].affectedRows > 0 && input.status == "R") {
                    _mysql
                      .executeQuery({
                        query:
                          "update hims_f_leave_application set `status`='REJ' where record_status='A' and `status`='PEN'\
                                and hims_f_leave_application_id=?;\
                                select hims_f_leave_application_id,employee_id,from_date,to_date,leave_id,is_across_year_leave\
                                 from hims_f_leave_application where  `status`<>'APR' and employee_id=?\
                                 and hims_f_leave_application_id=?",
                        values: [
                          input.hims_f_leave_application_id,
                          input.employee_id,
                          input.hims_f_leave_application_id
                        ]
                      })
                      .then(rejectResult => {
                        if (rejectResult[1][0]["is_across_year_leave"] == "Y") {
                          //YOU CAN CANCEL
                          input["cancel"] = "Y";
                          input = { ...input, ...rejectResult[1][0] };
                          // req.body["leave_id"]=result[0]["leave_id"];
                          //------------------------------------------------------------------
                          validateLeaveApplictn(input, _mysql)
                            .then(deductionResult => {
                              _mysql
                                .executeQuery({
                                  query: `select * from hims_f_employee_monthly_leave where employee_id=? and year in (?) and leave_id=?;\
                                select leave_application_code from hims_f_leave_application where employee_id=? and leave_id=? and (date_format(from_date,'%Y')=? \
                                 or date_format(to_date,'%Y')=? ) and status<>'CAN' and status<>'REJ'    and hims_f_leave_application_id<>?;
                                `,
                                  values: [
                                    input.employee_id,
                                    [
                                      deductionResult.from_year,
                                      deductionResult.to_year
                                    ],
                                    input.leave_id,
                                    input.employee_id,
                                    input.leave_id,
                                    deductionResult.to_year,
                                    deductionResult.to_year,
                                    input.hims_f_leave_application_id
                                  ],
                                  printQuery: false
                                })
                                .then(resdata => {
                                  const leaveData = resdata[0];
                                  const acrossYearSecondLeave = resdata[1];

                                  if (leaveData.length > 0) {
                                    if (
                                      deductionResult.is_across_year_leave ==
                                      "Y"
                                    ) {
                                      if (acrossYearSecondLeave.length > 0) {
                                        _mysql.releaseConnection();
                                        req.records = {
                                          invalid_input: true,
                                          message: `Please Cancel (${
                                            acrossYearSecondLeave[0][
                                            "leave_application_code"
                                            ]
                                            }) application First `
                                        };
                                        next();
                                      } else {
                                        const cur_year_leaveData = leaveData.filter(
                                          f =>
                                            f.year == deductionResult.from_year
                                        );
                                        const next_year_leaveData = leaveData.filter(
                                          f => f.year == deductionResult.to_year
                                        );

                                        acrossYearCancel(
                                          deductionResult,
                                          cur_year_leaveData,
                                          next_year_leaveData,
                                          input,
                                          req
                                        )
                                          .then(resu => {
                                            _mysql
                                              .executeQueryWithTransaction({
                                                query:
                                                  resu.delete_partB +
                                                  resu.deletePendingLeave +
                                                  resu.anualLeave +
                                                  "update hims_f_employee_monthly_leave set carry_forward_done='N',carry_forward_leave=0,processed='N' where\
                                    hims_f_employee_monthly_leave_id=?",
                                                values: [
                                                  resu.hims_f_employee_monthly_leave_id
                                                ],
                                                printQuery: false
                                              })
                                              .then(finalRes => {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                });
                                              })
                                              .catch(error => {
                                                console.log("error: ", error);
                                                _mysql.rollBackTransaction(
                                                  () => {
                                                    next(error);
                                                  }
                                                );
                                              });
                                          })
                                          .catch(error => {
                                            console.log("error55: ", error);
                                            _mysql.releaseConnection();
                                            req.records = error;
                                            next(error);
                                          });
                                      }
                                    } else {
                                      //invalid data
                                      _mysql.releaseConnection();
                                      req.records = {
                                        invalid_input: true,
                                        message: "leave Not found"
                                      };

                                      _mysql.rollBackTransaction(() => { });
                                      next();
                                    }
                                  } else {
                                    //invalid data
                                    _mysql.releaseConnection();
                                    req.records = {
                                      invalid_input: true,
                                      message: "leave Not found"
                                    };

                                    _mysql.rollBackTransaction(() => { });
                                    next();
                                  }
                                })
                                .catch(error => {
                                  console.log("error6:", error);
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                  });
                                });
                            })
                            .catch(error => {
                              console.log("error6:", error);
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });
                        } else {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = rejectResult;
                            next();
                          });
                        }
                      })
                      .catch(error => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  } else if (
                    authResult[0].affectedRows > 0 &&
                    input.status == "A"
                  ) {
                    let month_number = 0;

                    req.body["attendance_starts"] =
                      authResult[1][0]["attendance_starts"];
                    req.body["at_end_date"] = authResult[1][0]["at_end_date"];
                    if (
                      authResult[1][0]["attendance_starts"] == "PM" &&
                      authResult[1][0]["at_end_date"] > 0
                    ) {
                      const day = moment(input.from_date, "YYYY-MM-DD").format(
                        "D"
                      );

                      if (day <= authResult[1][0]["at_end_date"]) {
                        month_number = moment(
                          input.from_date,
                          "YYYY-MM-DD"
                        ).format("M");
                      } else {
                        month_number =
                          parseInt(
                            moment(input.from_date, "YYYY-MM-DD").format("M")
                          ) + parseInt(1);
                      }
                    } else {
                      month_number = moment(
                        input.from_date,
                        "YYYY-MM-DD"
                      ).format("M");
                    }

                    // let id = 0;
                    //---START OF-------normal authrization

                    new Promise((resolve, reject) => {
                      try {
                        _mysql
                          .executeQuery({
                            query:
                              "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                                  hims_f_salary where `month`=? and `year`=? and employee_id=?;\
                                  SELECT annual_leave_process_separately from hims_d_hrms_options ",
                            values: [
                              month_number,
                              input.year,
                              input.employee_id
                            ],
                            printQuery: false
                          })
                          .then(salResult => {
                            annual_leave_process_separately =
                              salResult[1][0][
                              "annual_leave_process_separately"
                              ];
                            if (
                              salResult[0].length > 0 &&
                              salResult[0][0]["salary_processed"] == "Y"
                            ) {
                              salary_processed = "Y";
                              resolve({ salResult });
                            } else {
                              resolve({ salResult });
                            }
                          })
                          .then(pendingUpdaidResult => {
                            req.body["from_athurization"] = "Y";
                            validateLeaveApplictn(req.body, _mysql)
                              .then(deductionResult => {
                                _mysql
                                  .executeQuery({
                                    query: `select * from hims_f_employee_monthly_leave where \
                                            employee_id=? and year in (?) and leave_id=?;`,
                                    values: [
                                      input.employee_id,
                                      [
                                        deductionResult.from_year,
                                        deductionResult.to_year
                                      ],
                                      input.leave_id
                                    ],
                                    printQuery: false
                                  })
                                  .then(leaveData => {
                                    if (leaveData.length > 0) {
                                      input[
                                        "salary_processed"
                                      ] = salary_processed;
                                      input[
                                        "annual_leave_process_separately"
                                      ] = annual_leave_process_separately;

                                      if (
                                        deductionResult.is_across_year_leave ==
                                        "Y"
                                      ) {
                                        const cur_year_leaveData = leaveData.filter(
                                          f =>
                                            f.year == deductionResult.from_year
                                        );
                                        const next_year_leaveData = leaveData.filter(
                                          f => f.year == deductionResult.to_year
                                        );
                                        acrossYearAuthorize(
                                          month_number,
                                          deductionResult,
                                          cur_year_leaveData,
                                          next_year_leaveData,
                                          input,
                                          req
                                        )
                                          .then(resu => {
                                            _mysql
                                              .executeQueryWithTransaction({
                                                query:
                                                  resu.convertToLeave +
                                                  resu.partA_update_leave_balnce +
                                                  resu.partB_update_leave_balnce +
                                                  resu.update_leave_application +
                                                  resu.insertPendLeave +
                                                  resu.anualLeave,
                                                printQuery: false
                                              })
                                              .then(finalRes => {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                });
                                              })
                                              .catch(error => {
                                                console.log("error: ", error);
                                                _mysql.rollBackTransaction(
                                                  () => {
                                                    next(error);
                                                  }
                                                );
                                              });
                                          })
                                          .catch(error => {
                                            console.log("error55: ", error);
                                            _mysql.releaseConnection();
                                            req.records = error;
                                            next(error);
                                          });
                                      } else {
                                        singleYearAuthorize(
                                          month_number,
                                          deductionResult,
                                          leaveData,
                                          input,
                                          req
                                        )
                                          .then(resul => {
                                            _mysql
                                              .executeQueryWithTransaction({
                                                query:
                                                  resul.convertToLeave +
                                                  resul.update_leave_balnce +
                                                  resul.update_leave_application +
                                                  resul.insertPendLeave +
                                                  resul.anualLeave,
                                                printQuery: false
                                              })
                                              .then(finalRes => {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                });
                                              })
                                              .catch(error => {
                                                console.log("error: ", error);
                                                _mysql.rollBackTransaction(
                                                  () => {
                                                    next(error);
                                                  }
                                                );
                                              });
                                          })
                                          .catch(error => {
                                            console.log("error65: ", error);
                                            _mysql.releaseConnection();
                                            req.records = error;
                                            next(error);
                                          });
                                      }
                                    } else {
                                      //invalid data
                                      req.records = {
                                        invalid_input: true,
                                        message: "leave Not found"
                                      };

                                      _mysql.rollBackTransaction(() => { });
                                      next();
                                    }
                                  })
                                  .catch(error => {
                                    console.log("error6:", error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              })
                              .catch(e => {
                                _mysql.releaseConnection();
                                console.log("error25:", e);
                                req.records = e;
                                next(e);
                                return;
                              });
                          })
                          .catch(e => {
                            console.log("error3:", e);
                            _mysql.releaseConnection();
                            req.records = e;
                            next();
                            return;
                          });
                      } catch (e) {
                        console.log("error4:", e);
                        reject(e);
                      }
                    });

                    //---END OF-------normal authrization
                  } else if (authResult[0].affectedRows > 0) {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = authResult;
                      next();
                    });
                  }
                })
                .catch(error => {
                  reject(error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            });
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_user: true,
        message: "you dont have authorization privilege"
      };
      next();
    }
  },
  //created by irfan: to
  calculateLeaveDays_bkp_before_doing_across_year: (req, res, next) => {
    try {
      let _mysql = new algaehMysql();
      const utilities = new algaehUtilities();
      let input = req.query;

      let from_date = moment(input.from_date).format("YYYY-MM-DD");
      let to_date = moment(input.to_date).format("YYYY-MM-DD");
      let leave_applied_days = 0;
      let calculatedLeaveDays = 0;
      let session_diff = 0;
      let my_religion = input.religion_id;
      let from_month = moment(from_date).format("M");
      let to_month = moment(to_date).format("M");
      let year = moment(from_date).format("YYYY");
      let dateStart = moment(from_date);
      let dateEnd = moment(to_date);
      let dateRange = [];
      let currentClosingBal = 0;
      let leaveDeductionArray = [];

      let include_week_offs = "Y";
      let no_include_week_offs = 0;
      let include_holidays = "Y";
      let no_include_holidays = 0;

      let allLeaves = [];
      let allHolidays = [];

      let annual_leave = "";

      //ST OF-------calculate Half-day or Full-day from session
      if (input.from_date == input.to_date) {
        if (input.from_session == "FH" && input.to_session == "FH") {
          session_diff += parseFloat(0.5);
        } else if (input.from_session == "SH" && input.to_session == "SH") {
          session_diff += parseFloat(0.5);
        }
      } else {
        if (input.from_session == "SH") {
          session_diff += parseFloat(0.5);
        }
        if (input.to_session == "FH") {
          session_diff += parseFloat(0.5);
        }
      }
      // EN OF---------calculate Half-day or Full-day from session

      //ST---------get month names and start_of_month and end_of_month number of days in a full month
      while (
        dateEnd > dateStart ||
        dateStart.format("M") === dateEnd.format("M")
      ) {
        dateRange.push({
          month_name: dateStart.format("MMMM"),
          startOfMonth: moment(dateStart)
            .startOf("month")
            .format("YYYY-MM-DD"),
          endOfMonth: moment(dateStart)
            .endOf("month")
            .format("YYYY-MM-DD"),

          numberOfDays: moment(dateStart).daysInMonth()
        });
        dateStart.add(1, "month");
      }
      //END OF---------get month names and start_of_month and end_of_month number of days in a full month

      //ST------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      if (dateRange.length > 1) {
        for (let i = 0; i < dateRange.length; i++) {
          if (i == 0) {
            let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
            let start = moment(from_date).format("YYYY-MM-DD");

            leave_applied_days +=
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1;
            extend(dateRange[i], {
              begning_of_leave: start,
              end_of_leave: end,
              leaveDays:
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1
            });
          } else if (i == dateRange.length - 1) {
            let start = moment(dateRange[i]["startOfMonth"]).format(
              "YYYY-MM-DD"
            );
            let end = moment(to_date).format("YYYY-MM-DD");

            leave_applied_days +=
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1;

            extend(dateRange[i], {
              begning_of_leave: start,
              end_of_leave: end,
              leaveDays:
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1
            });
          } else {
            leave_applied_days += dateRange[i]["numberOfDays"];

            extend(dateRange[i], {
              begning_of_leave: dateRange[i]["startOfMonth"],
              end_of_leave: dateRange[i]["endOfMonth"],
              leaveDays: dateRange[i]["numberOfDays"]
            });
          }
        }

        calculatedLeaveDays = leave_applied_days;
      } else if (dateRange.length == 1) {
        let end = moment(to_date).format("YYYY-MM-DD");
        let start = moment(from_date).format("YYYY-MM-DD");

        leave_applied_days +=
          moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") +
          1;
        extend(dateRange[0], {
          begning_of_leave: start,
          end_of_leave: end,
          leaveDays:
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1
        });

        calculatedLeaveDays = leave_applied_days;
      }
      //EN OF------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      _mysql
        .executeQuery({
          query:
            "select hospital_id from hims_d_employee where hims_d_employee_id=?;\
              SELECT attendance_starts,at_end_date FROM hims_d_hrms_options limit 1;",
          values: [input.employee_id],

          printQuery: false
        })
        .then(branch => {
          const hospital_id = branch[0][0]["hospital_id"];

          _mysql
            .executeQuery({
              query:
                "select hims_f_employee_monthly_leave_id, total_eligible,close_balance,processed, availed_till_date,\
            leave_id,L.leave_description,L.leave_category,L.avail_if_no_balance,include_weekoff,include_holiday from hims_f_employee_monthly_leave ML\
            inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id where employee_id=? and year=? and\
            leave_id=? and L.record_status='A';select hims_d_holiday_id,holiday_date,holiday_description,weekoff,\
            holiday,holiday_type,religion_id  from hims_d_holiday  where hospital_id=? and  date(holiday_date) between date(?) and date(?) ",
              values: [
                input.employee_id,
                year,
                input.leave_id,
                hospital_id,
                from_date,
                to_date
              ],

              printQuery: false
            })
            .then(result => {
              allLeaves = result[0];
              allHolidays = result[1];

              if (
                result[0][0].leave_category == "A" &&
                result[0][0].avail_if_no_balance == "Y"
              ) {
                annual_leave = "Y";
              }

              if (allLeaves.length > 0) {
                if (allLeaves[0].processed == "Y") {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: `Year ${year} leave has been closed, Apply from Year ${parseInt(
                      year
                    ) + 1}`
                  };
                  next();
                  return;
                } else {
                  currentClosingBal = allLeaves[0].close_balance;
                  let isHoliday = new LINQ(allHolidays)
                    .Where(
                      w =>
                        (w.holiday_date == from_date && w.weekoff == "Y") ||
                        (w.holiday_date == from_date &&
                          w.holiday == "Y" &&
                          w.holiday_type == "RE") ||
                        (w.holiday_date == from_date &&
                          w.holiday == "Y" &&
                          w.holiday_type == "RS" &&
                          w.religion_id == my_religion) ||
                        ((w.holiday_date == to_date && w.weekoff == "Y") ||
                          (w.holiday_date == to_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RE") ||
                          (w.holiday_date == to_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion))
                    )
                    .Select(s => {
                      return {
                        holiday_date: s.holiday_date,
                        holiday_description: s.holiday_description
                      };
                    })
                    .ToArray();

                  //s -------START OF--- get count of holidays and weekOffs betwen apllied leave range
                  let week_off_Data = new LINQ(allHolidays)
                    .Select(s => {
                      return {
                        hims_d_holiday_id: s.hims_d_holiday_id,
                        holiday_date: s.holiday_date,
                        holiday_description: s.holiday_description,
                        holiday: s.holiday,
                        weekoff: s.weekoff,
                        holiday_type: s.holiday_type,
                        religion_id: s.religion_id
                      };
                    })
                    .Where(w => w.weekoff == "Y")
                    .ToArray();
                  let total_weekOff = week_off_Data.length;

                  let holiday_Data = new LINQ(allHolidays)
                    .Select(s => {
                      return {
                        hims_d_holiday_id: s.hims_d_holiday_id,
                        holiday_date: s.holiday_date,
                        holiday_description: s.holiday_description,
                        holiday: s.holiday,
                        weekoff: s.weekoff,
                        holiday_type: s.holiday_type,
                        religion_id: s.religion_id
                      };
                    })
                    .Where(
                      w =>
                        (w.holiday == "Y" && w.holiday_type == "RE") ||
                        (w.holiday == "Y" &&
                          w.holiday_type == "RS" &&
                          w.religion_id == my_religion)
                    )
                    .ToArray();

                  let total_holiday = holiday_Data.length;
                  // -------END OF--- get count of holidays and weekOffs betwen apllied leave range

                  if (isHoliday.length > 0) {
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: `you can't apply leave on , ${isHoliday[0].holiday_date} is :( ${isHoliday[0].holiday_description} )`
                    };
                    next();
                    return;
                  } else {
                    // subtracting  week off or holidays fom LeaveApplied Days
                    if (
                      allLeaves[0].include_weekoff == "N" ||
                      allLeaves[0].include_holiday == "N"
                    ) {
                      let total_minus = 0;
                      for (let k = 0; k < dateRange.length; k++) {
                        let reduce_days = parseFloat(0);

                        //step 1 -------START OF------ getting total week offs and holidays to be subtracted from each month

                        //calculating holidays to remove from each month
                        if (allLeaves[0].include_holiday == "N") {
                          reduce_days += parseFloat(
                            new LINQ(holiday_Data)
                              .Where(
                                w =>
                                  dateRange[k]["begning_of_leave"] <=
                                  w.holiday_date &&
                                  w.holiday_date <= dateRange[k]["end_of_leave"]
                              )
                              .Count()
                          );
                        }

                        //calculating week off to remove from each month
                        if (allLeaves[0].include_weekoff == "N") {
                          reduce_days += parseFloat(
                            new LINQ(week_off_Data)
                              .Where(
                                w =>
                                  dateRange[k]["begning_of_leave"] <=
                                  w.holiday_date &&
                                  w.holiday_date <= dateRange[k]["end_of_leave"]
                              )
                              .Count()
                          );
                        }

                        //-------END OF------ getting total week offs and holidays to be subtracted from each month

                        //step 2-------START OF------ session belongs to which month and  subtract session from that month----------
                        if (input.from_session == "SH" && k == 0) {
                          if (
                            from_month === to_month &&
                            input.to_session == "FH"
                          ) {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(reduce_days) -
                                parseFloat(1)
                            });
                          } else {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(reduce_days) -
                                parseFloat(0.5)
                            });
                          }
                        } else if (
                          input.to_session == "FH" &&
                          k == dateRange.length - 1
                        ) {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days) -
                              parseFloat(0.5)
                          });
                        } else {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days)
                          });
                        }
                        //------- END OF----session belongs to which month and  subtract session from that month----------
                        total_minus += parseFloat(reduce_days);
                      }

                      //step3-------START OF------ finally  subtracting week off and holidays from total Applied days

                      if (allLeaves[0].include_weekoff == "N") {
                        include_week_offs = "N";
                        calculatedLeaveDays =
                          parseFloat(calculatedLeaveDays) -
                          parseFloat(total_weekOff);
                      }

                      if (allLeaves[0].include_holiday == "N") {
                        include_holidays = "N";
                        calculatedLeaveDays =
                          parseFloat(calculatedLeaveDays) -
                          parseFloat(total_holiday);
                      }

                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(session_diff);

                      //-------END OF------ finally  subtracting week off and holidays from total Applied days
                      if (currentClosingBal >= calculatedLeaveDays) {
                        _mysql.releaseConnection();
                        req.records = {
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff
                        };
                        next();
                        return;
                      } else if (
                        currentClosingBal < calculatedLeaveDays &&
                        annual_leave == "Y"
                      ) {
                        projectedleaveCalc(
                          {
                            from_date: new Date(),
                            to_date: input.to_date,
                            year: year,
                            attendance_starts:
                              branch[1][0]["attendance_starts"],
                            at_end_date: branch[1][0]["at_end_date"],

                            employee_id: input.employee_id,

                            leave_id: input.leave_id
                          },
                          _mysql
                        )
                          .then(anualResult => {
                            const max_available_leave =
                              parseFloat(anualResult["predicted_leave_days"]) +
                              parseFloat(currentClosingBal);

                            if (max_available_leave >= calculatedLeaveDays) {
                              req.records = {
                                leave_applied_days: leave_applied_days,
                                calculatedLeaveDays: calculatedLeaveDays,
                                monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                                include_holidays: include_holidays,
                                total_holiday: total_holiday,
                                include_week_offs: include_week_offs,
                                total_weekOff: total_weekOff
                              };
                              next();
                            } else {
                              req.records = {
                                invalid_input: true,
                                message: `max available is ${max_available_leave} days, you can't apply for  
                              ${calculatedLeaveDays} days`
                              };
                              next();
                              return;
                            }
                          })
                          .catch(e => {
                            _mysql.releaseConnection();
                            console.log("e3", e);
                            req.records = e;
                            next();
                            return;
                          });
                      } else {
                        _mysql.releaseConnection();
                        req.records = {
                          invalid_input: true,
                          message: `max available is ${currentClosingBal} days, you can't apply for  
                        ${calculatedLeaveDays} days`
                        };
                        next();
                        return;
                      }
                    } else {
                      for (let k = 0; k < dateRange.length; k++) {
                        if (input.from_session == "SH" && k == 0) {
                          if (
                            from_month === to_month &&
                            input.to_session == "FH"
                          ) {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(1)
                            });
                          } else {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(0.5)
                            });
                          }
                        } else if (
                          input.to_session == "FH" &&
                          k == dateRange.length - 1
                        ) {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(0.5)
                          });
                        } else {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave: parseFloat(dateRange[k]["leaveDays"])
                          });
                        }
                      }

                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(session_diff);

                      //checking if he has enough eligible days
                      if (currentClosingBal >= calculatedLeaveDays) {
                        _mysql.releaseConnection();
                        req.records = {
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff
                        };
                        next();
                      } else if (
                        currentClosingBal < calculatedLeaveDays &&
                        annual_leave == "Y"
                      ) {
                        projectedleaveCalc(
                          {
                            from_date: new Date(),
                            to_date: input.to_date,
                            year: year,
                            attendance_starts:
                              branch[1][0]["attendance_starts"],
                            at_end_date: branch[1][0]["at_end_date"],

                            employee_id: input.employee_id,

                            leave_id: input.leave_id
                          },
                          _mysql
                        )
                          .then(anualResult => {
                            const max_available_leave =
                              parseFloat(anualResult["predicted_leave_days"]) +
                              parseFloat(currentClosingBal);

                            if (max_available_leave >= calculatedLeaveDays) {
                              req.records = {
                                leave_applied_days: leave_applied_days,
                                calculatedLeaveDays: calculatedLeaveDays,
                                monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                                include_holidays: include_holidays,
                                total_holiday: total_holiday,
                                include_week_offs: include_week_offs,
                                total_weekOff: total_weekOff
                              };
                              next();
                            } else {
                              req.records = {
                                invalid_input: true,
                                message: `max available is ${max_available_leave} days, you can't apply for  
                              ${calculatedLeaveDays} days`
                              };
                              next();
                              return;
                            }
                          })
                          .catch(e => {
                            _mysql.releaseConnection();
                            console.log("e3", e);
                            req.records = e;
                            next();
                            return;
                          });
                      } else {
                        _mysql.releaseConnection();

                        req.records = {
                          invalid_input: true,
                          message: `max available is ${currentClosingBal} days, you can't apply for  
                        ${calculatedLeaveDays} days`
                        };
                        next();
                        return;
                      }
                    }
                  }
                }
              } else {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: `you are not eligible for this leave `
                };
                next();
                return;
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              next(e);
            });
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    } catch (e) {
      next(e);
    }
  },
  //created by irfan: to

  calculateLeaveDays: (req, res, next) => {
    try {
      let _mysql = new algaehMysql();

      validateLeaveApplictn(req.query, _mysql, req)
        .then(result => {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
          });
          req.records = result;
          next();

          console.log("DONE-calculateLeaveDays ONLY--");
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            _mysql.releaseConnection();
          });
          req.records = e;
          next();
        });
    } catch (e) {
      next(e);
    }
  },

  //created by irfan:
  applyEmployeeLeave_bkp_befor_across_year: (req, res, next) => {
    try {
      let input = req.body;

      const m_fromDate = moment(input.from_date).format("YYYY-MM-DD");
      const m_toDate = moment(input.to_date).format("YYYY-MM-DD");
      const from_year = moment(input.from_date).format("YYYY");
      const to_year = moment(input.to_date).format("YYYY");
      let annual_leave = "";
      if (
        m_fromDate > m_toDate ||
        (m_fromDate == m_toDate &&
          ((input.from_leave_session == "SH" &&
            input.to_leave_session == "FH") ||
            (input.from_leave_session == "SH" &&
              input.to_leave_session == "FD")))
      ) {
        req.records = {
          leave_already_exist: true,
          message: "select proper sessions"
        };

        next();
        return;
      } else if (from_year == to_year) {
        const _mysql = new algaehMysql();
        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_id,date_of_joining,exit_date from hims_d_employee\
          where record_status='A' and employee_status='A' and  hims_d_employee_id=?",
            values: [input.employee_id],

            printQuery: false
          })
          .then(empResult => {
            if (
              empResult.length > 0 &&
              empResult[0]["date_of_joining"] < m_fromDate &&
              empResult[0]["date_of_joining"] < m_toDate &&
              empResult[0]["exit_date"] == null
            ) {
              _mysql
                .executeQuery({
                  query:
                    "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, total_eligible,\
                    availed_till_date, close_balance,\
                    L.hims_d_leave_id,L.leave_code,L.leave_category,L.leave_description,L.leave_type from \
                    hims_f_employee_monthly_leave ML inner join\
                    hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
                    where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)",
                  values: [
                    input.employee_id,
                    input.leave_id,
                    [from_year, to_year]
                  ],

                  printQuery: false
                })
                .then(result => {
                  if (result.length > 0) {
                    let m_total_eligible = result[0]["total_eligible"];
                    let m_availed_till_date = result[0]["availed_till_date"];
                    let m_close_balance = result[0]["close_balance"];

                    annual_leave = result[0].leave_category;

                    if (
                      m_close_balance >= input.total_applied_days ||
                      annual_leave == "A"
                    ) {
                      _mysql
                        .executeQuery({
                          query:
                            "select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
                        to_date from hims_f_leave_application\
                        where (`status`='APR' or `status`='PEN') and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
                        ( date(?)>=date(from_date) and   date(?)<=date(to_date))   or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or \
                        (date(to_date)>=date(?) and date(to_date)<= date(?) )\
                        )and employee_id=?",
                          values: [
                            input.from_date,
                            input.from_date,
                            input.to_date,
                            input.to_date,
                            input.from_date,
                            input.to_date,
                            input.from_date,
                            input.to_date,
                            input.employee_id
                          ],

                          printQuery: false
                        })
                        .then(result => {
                          // DISCARDING LEAVE APPLICATION
                          if (result.length > 0) {
                            //clashing both from_leave_session and  to_leave_session
                            const clashing_sessions = new LINQ(result)
                              .Where(
                                w =>
                                  w.to_date == m_fromDate ||
                                  w.from_date == m_toDate
                              )
                              .Select(s => {
                                return {
                                  hims_f_leave_application_id:
                                    s.hims_f_leave_application_id,
                                  employee_id: s.employee_id,
                                  leave_application_code:
                                    s.leave_application_code,
                                  from_leave_session: s.from_leave_session,
                                  from_date: s.from_date,
                                  to_leave_session: s.to_leave_session,
                                  to_date: s.to_date
                                };
                              })
                              .ToArray();

                            // debugLog("clashing_sessions:", clashing_sessions);
                            //clashing only  new from_leave_session  with existing  to_leave_session
                            const clashing_to_leave_session = new LINQ(result)
                              .Where(w => w.to_date == m_fromDate)
                              .Select(s => {
                                return {
                                  hims_f_leave_application_id:
                                    s.hims_f_leave_application_id,
                                  employee_id: s.employee_id,
                                  leave_application_code:
                                    s.leave_application_code,
                                  from_leave_session: s.from_leave_session,
                                  from_date: s.from_date,
                                  to_leave_session: s.to_leave_session,
                                  to_date: s.to_date
                                };
                              })
                              .ToArray();

                            // debugLog(
                            //   "clashing_to_leave_session:",
                            //   clashing_to_leave_session
                            // );

                            //clashing only  new to_leave_session with existing  from_leave_session
                            const clashing_from_leave_session = new LINQ(result)
                              .Where(w => w.from_date == m_toDate)
                              .Select(s => {
                                return {
                                  hims_f_leave_application_id:
                                    s.hims_f_leave_application_id,
                                  employee_id: s.employee_id,
                                  leave_application_code:
                                    s.leave_application_code,
                                  from_leave_session: s.from_leave_session,
                                  from_date: s.from_date,
                                  to_leave_session: s.to_leave_session,
                                  to_date: s.to_date
                                };
                              })
                              .ToArray();

                            // debugLog(
                            //   "clashing_from_leave_session:",
                            //   clashing_from_leave_session
                            // );
                            //----------------------------------

                            let not_clashing_sessions = _.xorBy(
                              result,
                              clashing_sessions,
                              "hims_f_leave_application_id"
                            );

                            // debugLog(
                            //   "not_clashing_sessions:",
                            //   not_clashing_sessions
                            // );

                            new Promise((resolve, reject) => {
                              try {
                                let curr_from_session =
                                  input.from_leave_session;
                                let curr_to_session = input.to_leave_session;
                                if (not_clashing_sessions.length > 0) {
                                  //
                                  // debugLog("inside not classing loop ");
                                  _mysql.releaseConnection();
                                  req.records = {
                                    leave_already_exist: true,
                                    location:
                                      "inside not_clashing_sessions: date clash not session",
                                    message:
                                      " leave is already there between this dates " +
                                      not_clashing_sessions[0]["from_date"] +
                                      " AND " +
                                      not_clashing_sessions[0]["to_date"]
                                  };
                                  next();
                                  return;
                                } else if (
                                  clashing_from_leave_session.length > 0 ||
                                  clashing_to_leave_session.length > 0
                                ) {
                                  // debugLog("inside clashing_sessions BOTH  ");

                                  new Promise((resolve, reject) => {
                                    try {
                                      if (
                                        clashing_from_leave_session.length > 0
                                      ) {
                                        // debugLog(
                                        //   "inside clashing_from_leave_session:"
                                        // );
                                        for (
                                          let i = 0;
                                          i <
                                          clashing_from_leave_session.length;
                                          i++
                                        ) {
                                          let prev_from_leave_session_FH = new LINQ(
                                            [clashing_from_leave_session[i]]
                                          )
                                            .Where(
                                              w => w.from_leave_session == "FH"
                                            )
                                            .Select(s => s.from_leave_session)
                                            .FirstOrDefault();

                                          // debugLog(
                                          //   "prev_from_leave_session_FH:",
                                          //   prev_from_leave_session_FH
                                          // );

                                          let prev_from_leave_session_SH = new LINQ(
                                            [clashing_from_leave_session[i]]
                                          )
                                            .Where(
                                              w => w.from_leave_session == "SH"
                                            )
                                            .Select(s => s.from_leave_session)
                                            .FirstOrDefault();
                                          // debugLog(
                                          //   "prev_from_leave_session_SH:",
                                          //   prev_from_leave_session_SH
                                          // );

                                          let prev_from_leave_session_FD = new LINQ(
                                            [clashing_from_leave_session[i]]
                                          )
                                            .Where(
                                              w => w.from_leave_session == "FD"
                                            )
                                            .Select(s => s.from_leave_session)
                                            .FirstOrDefault();
                                          // debugLog(
                                          //   "prev_from_leave_session_FD:",
                                          //   prev_from_leave_session_FD
                                          // );

                                          if (
                                            (prev_from_leave_session_FH ==
                                              "FH" &&
                                              curr_to_session == "FD") ||
                                            (prev_from_leave_session_SH ==
                                              "SH" &&
                                              curr_to_session == "FD") ||
                                            (prev_from_leave_session_FD ==
                                              "FD" &&
                                              curr_to_session == "FD") ||
                                            (prev_from_leave_session_FD ==
                                              "FD" &&
                                              curr_to_session == "FH") ||
                                            (prev_from_leave_session_FH ==
                                              "FH" &&
                                              curr_to_session == "FH") ||
                                            (prev_from_leave_session_FH ==
                                              "FH" &&
                                              curr_to_session == "SH" &&
                                              curr_from_session == "FH") ||
                                            (prev_from_leave_session_FD ==
                                              "FD" &&
                                              curr_to_session == "SH") ||
                                            (prev_from_leave_session_SH ==
                                              "SH" &&
                                              curr_to_session == "SH")
                                          ) {
                                            // debugLog("rejction two:");
                                            //clashing only  new to_leave_session with existing  from_leave_session
                                            _mysql.releaseConnection();
                                            req.records = {
                                              leave_already_exist: true,
                                              location:
                                                "inside clashing_from_leave_session: session error: comparing prev_from_leave_session with  current:to_leave_session ",
                                              message:
                                                "leave is already there between this dates " +
                                                clashing_from_leave_session[i][
                                                "from_date"
                                                ] +
                                                " AND " +
                                                clashing_from_leave_session[i][
                                                "to_date"
                                                ]
                                            };
                                            next();
                                            return;
                                          }

                                          if (
                                            i ==
                                            clashing_from_leave_session.length -
                                            1
                                          ) {
                                            // debugLog(
                                            //   "clashing_from_leave_session last iteration:"
                                            // );
                                            resolve({});
                                          }
                                        }
                                      } else {
                                        resolve({});
                                      }
                                    } catch (e) {
                                      reject(e);
                                    }
                                  }).then(fromSessionREsult => {
                                    if (clashing_to_leave_session.length > 0) {
                                      // debugLog(
                                      //   "inside clashing_to_leave_session:"
                                      // );

                                      for (
                                        let i = 0;
                                        i < clashing_to_leave_session.length;
                                        i++
                                      ) {
                                        //fetch all previous to_leave_sessions

                                        let prev_to_leave_session_FH = new LINQ(
                                          [clashing_to_leave_session[i]]
                                        )
                                          .Where(
                                            w => w.to_leave_session == "FH"
                                          )
                                          .Select(s => s.to_leave_session)
                                          .FirstOrDefault();

                                        // debugLog(
                                        //   "prev_to_leave_session_FH:",
                                        //   prev_to_leave_session_FH
                                        // );

                                        let prev_to_leave_session_FD = new LINQ(
                                          [clashing_to_leave_session[i]]
                                        )
                                          .Where(
                                            w => w.to_leave_session == "FD"
                                          )
                                          .Select(s => s.to_leave_session)
                                          .FirstOrDefault();

                                        // debugLog(
                                        //   "prev_to_leave_session_FD:",
                                        //   prev_to_leave_session_FD
                                        // );

                                        let prev_to_leave_session_SH = new LINQ(
                                          [clashing_to_leave_session[i]]
                                        )
                                          .Where(
                                            w => w.to_leave_session == "SH"
                                          )
                                          .Select(s => s.to_leave_session)
                                          .FirstOrDefault();

                                        // debugLog(
                                        //   "prev_to_leave_session_SH:",
                                        //   prev_to_leave_session_SH
                                        // );

                                        let prev2_from_leave_session_FH = new LINQ(
                                          [clashing_to_leave_session[i]]
                                        )
                                          .Where(
                                            w => w.from_leave_session == "FH"
                                          )
                                          .Select(s => s.from_leave_session)
                                          .FirstOrDefault();

                                        // debugLog(
                                        //   "2nd time prev_to_leave_session_SH:",
                                        //   prev2_from_leave_session_FH
                                        // );
                                        //rejection of to_leave_sessions

                                        if (
                                          (prev_to_leave_session_FH == "FH" &&
                                            curr_from_session == "FH") ||
                                          (prev_to_leave_session_FD == "FD" &&
                                            curr_from_session == "FH") ||
                                          (prev2_from_leave_session_FH ==
                                            "FH" &&
                                            prev_to_leave_session_SH == "SH" &&
                                            curr_from_session == "FH") ||
                                          ((prev_to_leave_session_FD == "FD" &&
                                            curr_from_session == "SH") ||
                                            (prev_to_leave_session_SH == "SH" &&
                                              curr_from_session == "SH")) ||
                                          ((prev_to_leave_session_FH == "FH" &&
                                            curr_from_session == "FD") ||
                                            (prev_to_leave_session_FD == "FD" &&
                                              curr_from_session == "FD") ||
                                            (prev_to_leave_session_SH == "SH" &&
                                              curr_from_session == "FD"))
                                        ) {
                                          // debugLog("rejction_one:");
                                          //clashing only  new from_leave_session  with existing  to_leave_session
                                          _mysql.releaseConnection();
                                          req.records = {
                                            leave_already_exist: true,
                                            location:
                                              " inside clashing_to_leave_session:session error: comparing prev_to_leave_session with  current: from_leave_session ",
                                            message:
                                              "leave is already there between this dates " +
                                              clashing_to_leave_session[i][
                                              "from_date"
                                              ] +
                                              " AND " +
                                              clashing_to_leave_session[i][
                                              "to_date"
                                              ]
                                          };
                                          next();
                                          return;
                                        }

                                        if (
                                          i ==
                                          clashing_to_leave_session.length - 1
                                        ) {
                                          // debugLog(
                                          //   "clashing_to_leave_session last iteration:"
                                          // );
                                          saveF(_mysql, req, next, input, 5);
                                        }
                                      }
                                    } else {
                                      // debugLog(
                                      //   "else of clashing_to_leave_session"
                                      // );
                                      saveF(_mysql, req, next, input, 6);
                                    }
                                  });
                                } else {
                                  resolve({});
                                }
                              } catch (e) {
                                reject(e);
                              }
                            }).then(noClashResult => {
                              saveF(_mysql, req, next, input, 1);
                            });
                          } else {
                            // debugLog(
                            //   "Accept leave application here  with Num gen"
                            // );

                            saveF(_mysql, req, next, input, 2);
                          }
                        })
                        .catch(e => {
                          _mysql.releaseConnection();
                          next(e);
                        });
                    } else {
                      req.records = {
                        leave_already_exist: true,
                        message:
                          "leave application exceed total eligible leaves"
                      };
                      _mysql.releaseConnection();
                      next();
                      return;
                    }
                  } else {
                    req.records = {
                      leave_already_exist: true,
                      message: "you can't apply for this leave type"
                    };
                    _mysql.releaseConnection();
                    next();
                    return;
                  }
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            } else {
              _mysql.releaseConnection();
              if (empResult.length < 1) {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave for inactive employee  `
                };
              } else if (empResult[0]["exit_date"] != null) {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave for resigned employee `
                };
              } else {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave before joining date, your joining date is: ${
                    empResult[0]["date_of_joining"]
                    }   `
                };
              }
              next();
              return;
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        req.records = {
          leave_already_exist: true,
          message: "can't apply across year leave"
        };

        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan:

  applyEmployeeLeave: (req, res, next) => {
    try {
      let input = req.body;
      input["from_session"] = input["from_leave_session"];
      input["to_session"] = input["to_leave_session"];

      const m_fromDate = moment(input.from_date).format("YYYY-MM-DD");
      const m_toDate = moment(input.to_date).format("YYYY-MM-DD");
      const from_year = moment(input.from_date).format("YYYY");
      const to_year = moment(input.to_date).format("YYYY");
      let annual_leave = "";
      if (
        m_fromDate > m_toDate ||
        (m_fromDate == m_toDate &&
          ((input.from_leave_session == "SH" &&
            input.to_leave_session == "FH") ||
            (input.from_leave_session == "SH" &&
              input.to_leave_session == "FD")))
      ) {
        req.records = {
          leave_already_exist: true,
          message: "select proper sessions"
        };

        next();
        return;
      } else if (
        parseInt(from_year) == parseInt(to_year) ||
        parseInt(to_year) - 1
      ) {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_id,date_of_joining,exit_date from hims_d_employee\
               where record_status='A' and employee_status='A' and  hims_d_employee_id=?;\
              select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,from_date,to_leave_session,\
              to_date from hims_f_leave_application\
              where (`status`='APR' or `status`='PEN') and ((  date(?)>=date(from_date) and date(?)<=date(to_date)) or\
              ( date(?)>=date(from_date) and   date(?)<=date(to_date))   or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or \
              (date(to_date)>=date(?) and date(to_date)<= date(?) )\
              )and employee_id=?",
            values: [
              input.employee_id,
              input.from_date,
              input.from_date,
              input.to_date,
              input.to_date,
              input.from_date,
              input.to_date,
              input.from_date,
              input.to_date,
              input.employee_id
            ],

            printQuery: false
          })
          .then(rest => {
            const empResult = rest[0][0];
            const old_leave_applications = rest[1];
            if (
              rest[0].length > 0 &&
              empResult["date_of_joining"] < m_fromDate &&
              empResult["date_of_joining"] < m_toDate &&
              empResult["exit_date"] == null
            ) {
              // req.body["my_sql"]=_mysql;

              validateLeaveApplictn(input, _mysql, req)
                .then(result => {
                  if (result.calculatedLeaveDays > 0) {
                    console.log("CALCULATE ACROS-DAYS DONE-GOING FOR APPLY");

                    input["from_date"] = m_fromDate;
                    input["to_date"] = m_toDate;

                    input = { ...input, ...result };
                    if (old_leave_applications.length > 0) {
                      leaveSessionValidate(
                        old_leave_applications,
                        _mysql,
                        req,
                        next,
                        input
                      );
                    } else {
                      console.log("SESSION CHECK NOT NEEDED");
                      saveF(_mysql, req, next, input, 2);
                    }
                  } else {
                    req.records = "NO balance";
                    next();
                  }
                })
                .catch(e => {
                  console.log("error back:", e);
                  _mysql.rollBackTransaction(() => { });
                  req.records = e;
                  next();
                });

              // if (old_leave_applications.length > 0) {

              // }else {

              //   saveF(_mysql, req, next, input, 2);
              // }
            } else {
              _mysql.releaseConnection();
              if (!rest[0].length > 0) {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave for inactive employee  `
                };
              } else if (empResult["exit_date"] != null) {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave for resigned employee `
                };
              } else {
                req.records = {
                  leave_already_exist: true,
                  message: ` can't apply leave before joining date, your joining date is: ${
                    empResult["date_of_joining"]
                    }   `
                };
              }
              next();
              return;
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            next(e);
          });

        // req.records = {
        //   leave_already_exist: true,
        //   message: "can't apply across year leave"
        // };

        // next();
        // return;
      } else {
        req.records = {
          invalid_input: true,
          message: `can't apply leave for this Date range `
        };
        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan: to get which leaves applicable  for employee
  getEmployeeLeaveData: (req, res, next) => {
    if (req.query.year > 0 && req.query.employee_id > 0) {
      const _mysql = new algaehMysql();
      let strQryAppend = ""
      console.log("req.query.leave_encash", req.query.leave_encash);

      if (req.query.leave_encash !== null && req.query.leave_encash !== undefined) {
        strQryAppend += ` and leave_encash = '${req.query.leave_encash}' `;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
        L.leave_description,L.leave_type,total_eligible, availed_till_date, close_balance,\
        E.employee_code ,E.full_name as employee_name,\
        LD.hims_d_leave_detail_id,LD.employee_type, LD.eligible_days \
        from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id       \
        inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  \
        inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A' \
        and L.record_status='A' where ML.year=? and ML.employee_id=?  and  LD.employee_type=E.employee_type and  \
        (LD.gender=E.sex or LD.gender='BOTH' ) " + strQryAppend +
          "order by hims_f_employee_monthly_leave_id desc;",
          values: [req.query.year, req.query.employee_id],
          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "Please Provide  Valid year and employee_id "
      };

      next();
      return;
    }
  },
  //created by irfan: to get all employees whose yearly leave is proccessed
  getYearlyLeaveData: (req, res, next) => {
    const input = req.query;
    if (input.year > 0) {
      const _mysql = new algaehMysql();
      let strQry = "";
      if (input.employee_id > 0) {
        strQry += " and EYL.employee_id=" + input.employee_id;
      }
      if (input.employee_group_id > 0) {
        strQry += " and E.employee_group_id=" + input.employee_group_id;
      }
      _mysql
        .executeQuery({
          query:
            "select hims_f_employee_yearly_leave_id,employee_id,year ,\
            E.employee_code,  E.full_name as employee_name, SD.sub_department_name, D.department_name, EG.group_description \
            from  hims_f_employee_yearly_leave EYL  inner join hims_d_employee E on\
            EYL.employee_id=E.hims_d_employee_id  left join hims_d_sub_department SD\
            on E.sub_department_id = SD.hims_d_sub_department_id left join hims_d_employee_group EG\
            on E.employee_group_id = EG.hims_d_employee_group_id left join hims_d_department D\
            on SD.department_id=D.hims_d_department_id  where EYL.year=? and EYL.hospital_id=?" +
            strQry +
            " order by hims_f_employee_yearly_leave_id desc",
          values: [input.year, input.hospital_id],
          printQuery: true
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
      req.records = {
        invalid_input: true,
        message: "Please Provide valid year "
      };
      next();
      return;
    }
  },
  //created by irfan: to get all leave history about employee
  getEmployeeLeaveHistory: (req, res, next) => {
    let status = "";
    if (req.query.status == "H") {
      status = " and `status`<>'PEN'";
    }

    if (req.query.employee_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "select hims_f_leave_application_id,leave_application_code,employee_id,application_date,\
              leave_id,from_date,to_date,from_leave_session,to_leave_session,  \
              total_applied_days, total_approved_days,status,authorized3,authorized2,authorized1, \
              remarks,L.leave_code, L.leave_description, E.employee_code, E.full_name from hims_f_leave_application LA \
              inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id and L.record_status='A'\
              inner join hims_d_employee E on E.hims_d_employee_id=LA.employee_id\
              where LA.record_status='A' and LA.employee_id=? " +
            status +
            " order by hims_f_leave_application_id desc",
          values: [req.query.employee_id],
          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "Please Provide valid employee_id "
      };

      next();
      return;
    }
  },

  //created by irfan:
  getLeaveLevels(req, res, next) {
    try {
      const userPrivilege = req.userIdentity.leave_authorize_privilege;

      if (userPrivilege != "N") {
        const _mysql = new algaehMysql();

        _mysql
          .executeQuery({
            query:
              "SELECT authorization_plan FROM hims_d_hrms_options limit 1;\
            select leave_level1 from hims_d_authorization_setup where leave_level1=" +
              req.userIdentity.employee_id +
              " limit 1"
          })
          .then(result => {
            _mysql.releaseConnection();

            if (result.length > 0) {
              //----------------

              let auth_levels = [];

              if (result[0][0]["authorization_plan"] == "R") {
                switch (userPrivilege) {
                  case "1":
                    auth_levels.push({ name: "Level 1", value: 1 });
                    break;
                  case "2":
                    auth_levels.push(
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "3":
                    auth_levels.push(
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "4":
                    auth_levels.push(
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                  case "5":
                    auth_levels.push(
                      { name: "Level 5", value: 5 },
                      { name: "Level 4", value: 4 },
                      { name: "Level 3", value: 3 },
                      { name: "Level 2", value: 2 },
                      { name: "Level 1", value: 1 }
                    );
                    break;
                }
              } else if (result[0][0]["authorization_plan"] == "A") {
                ///------------------------

                switch (userPrivilege) {
                  case "1":
                    if (result[1].length > 0) {
                      auth_levels.push({ name: "Level 1", value: 1 });
                    }

                    break;
                  case "2":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 2", value: 2 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 2", value: 2 });
                    }

                    break;
                  case "3":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 3", value: 3 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 3", value: 3 });
                    }

                    break;
                  case "4":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 4", value: 4 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 4", value: 4 });
                    }

                    break;
                  case "5":
                    if (result[1].length > 0) {
                      auth_levels.push(
                        { name: "Level 5", value: 5 },
                        { name: "Level 1", value: 1 }
                      );
                    } else {
                      auth_levels.push({ name: "Level 5", value: 5 });
                    }

                    break;
                }
              }
              req.records = { auth_levels };
              next();
            } else {
              req.records = {
                invalid_input: true,
                message: "you dont have privilege"
              };

              next();
              return;
            }
          })
          .catch(e => {
            _mysql.releaseConnection();
            reject(e);
          });
      } else {
        req.records = {
          invalid_input: true,
          message: "you dont have privilege"
        };

        next();
        return;
      }
    } catch (e) {
      next(e);
    }
  },

  //created by irfan: to
  addLeaveMaster: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    _mysql
      .executeQueryWithTransaction({
        query:
          "INSERT INTO `hims_d_leave` (leave_code,leave_description,leave_category,calculation_type,\
          include_weekoff,include_holiday,leave_mode,leave_accrual,leave_encash,leave_type,\
          encashment_percentage,leave_carry_forward,carry_forward_percentage,\
          religion_required,religion_id,holiday_reimbursement,exit_permit_required,\
          proportionate_leave,document_mandatory,avail_if_no_balance,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        values: [
          input.leave_code,
          input.leave_description,
          input.leave_category,
          input.calculation_type,
          input.include_weekoff,
          input.include_holiday,
          input.leave_mode,

          input.leave_accrual,
          input.leave_encash,
          input.leave_type,
          input.encashment_percentage,
          input.leave_carry_forward,
          input.carry_forward_percentage,
          input.religion_required,
          input.religion_id,
          input.holiday_reimbursement,
          input.exit_permit_required,
          input.proportionate_leave,
          input.document_mandatory,
          input.avail_if_no_balance,
          req.userIdentity.algaeh_d_app_user_id,
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          new Date()
        ],
        printQuery: false
      })
      .then(leaveHeadResult => {
        if (leaveHeadResult.insertId > 0) {
          new Promise((resolve, reject) => {
            try {
              if (
                input.leaveEncash != undefined &&
                input.leaveEncash.length > 0
              ) {
                const insurtColumns = ["earnings_id", "percent"];

                _mysql
                  .executeQuery({
                    query: "INSERT INTO hims_d_leave_encashment(??) VALUES ?",
                    values: input.leaveEncash,
                    includeValues: insurtColumns,
                    extraValues: {
                      leave_header_id: leaveHeadResult.insertId,
                      created_date: new Date(),
                      updated_date: new Date(),
                      created_by: req.userIdentity.algaeh_d_app_user_id,
                      updated_by: req.userIdentity.algaeh_d_app_user_id
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: false
                  })
                  .then(encashResult => {
                    if (encashResult.insertId > 0) {
                      resolve({ encashResult });
                    } else {
                      _mysql.rollBackTransaction(() => {
                        req.records = {
                          invalid_data: true,
                          message: "please send correct encashment data"
                        };
                        next();
                        return;
                      });
                    }
                  })
                  .catch(e => {
                    _mysql.rollBackTransaction(() => {
                      next(e);
                    });
                  });
              } else {
                resolve({ leaveHeadResult });
              }
            } catch (e) {
              reject(e);
            }
          }).then(leaveEncashRes => {
            new Promise((resolve, reject) => {
              try {
                if (
                  input.leaveRules != undefined &&
                  input.leaveRules.length > 0
                ) {
                  const insurtColumnsRules = [
                    "calculation_type",
                    "earning_id",
                    "paytype",
                    "from_value",
                    "to_value",
                    "value_type",
                    "total_days"
                  ];

                  _mysql
                    .executeQuery({
                      query: "INSERT INTO hims_d_leave_rule(??) VALUES ?",
                      values: input.leaveRules,
                      includeValues: insurtColumnsRules,
                      extraValues: {
                        leave_header_id: leaveHeadResult.insertId
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: false
                    })
                    .then(ruleResult => {
                      if (ruleResult.insertId > 0) {
                        resolve({ ruleResult });
                      } else {
                        _mysql.rollBackTransaction(() => {
                          req.records = {
                            invalid_data: true,
                            message: "please send correct leave rule data"
                          };
                          next();
                          return;
                        });
                      }
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  resolve({ leaveEncashRes });
                }
              } catch (e) {
                reject(e);
              }
            }).then(leaveRulesRes => {
              new Promise((resolve, reject) => {
                try {
                  if (
                    input.leaveDetails != undefined &&
                    input.leaveDetails.length > 0
                  ) {
                    const insurtColumnsdetails = [
                      "employee_type",
                      "gender",
                      "eligible_days",
                      "min_service_required",
                      "service_years",
                      "once_life_term",
                      "allow_probation",
                      "max_number_days",
                      "mandatory_utilize_days"
                    ];

                    _mysql
                      .executeQuery({
                        query: "INSERT INTO hims_d_leave_detail(??) VALUES ?",
                        values: input.leaveDetails,
                        includeValues: insurtColumnsdetails,
                        extraValues: {
                          leave_header_id: leaveHeadResult.insertId,
                          created_date: new Date(),
                          updated_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: false
                      })
                      .then(detailResult => {
                        if (detailResult.insertId > 0) {
                          resolve({ detailResult });
                        } else {
                          _mysql.rollBackTransaction(() => {
                            req.records = {
                              invalid_data: true,
                              message: "please send correct leave details data"
                            };
                            next();
                            return;
                          });
                        }
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    resolve({ leaveRulesRes });
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(finalResult => {
                _mysql.commitTransaction(() => {
                  _mysql.releaseConnection();
                  req.records = finalResult;
                  next();
                });
              });
            });
          });
        } else {
          req.records = {
            invalid_input: true,
            message: "Please Provide valid input "
          };

          next();
          return;
        }
      })
      .catch(e => {
        _mysql.rollBackTransaction(() => {
          next(e);
        });
      });
  },

  //created by irfan: to assign leaves for all employees for a purticular year
  processYearlyLeave_BKP_11_oct_2019: (req, res, next) => {
    const utilities = new algaehUtilities();

    let year = "";

    let yearArray = [];
    let monthlyArray = [];

    let employee_id = "";

    let AllEmployees = [];
    let AllLeaves = [];
    let AllYearlyLeaves = [];
    let AllMonthlyLeaves = [];

    if (req.query.employee_id > 0) {
      employee_id = ` and hims_d_employee_id=${req.query.employee_id} `;
    }

    if (req.query.year > 0) {
      year = req.query.year;
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id, employee_code,full_name  as employee_name,religion_id,\
                employee_status,date_of_joining ,hospital_id ,employee_type,sex\
                from hims_d_employee where employee_status <>'I'  and hospital_id=? and  record_status='A'" +
            employee_id +
            ";\
                select L.hims_d_leave_id,L.leave_code,L.religion_required,L.religion_id,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
                inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' ;\
                select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
                 where  `year`=? and hospital_id=? and record_status='A' ;\
                 select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                hims_f_employee_monthly_leave where   `year`=? and hospital_id=?; ",
          values: [
            req.userIdentity.hospital_id,
            year,
            req.userIdentity.hospital_id,
            year,
            req.userIdentity.hospital_id
          ],
          printQuery: false
        })
        .then(allResult => {
          // utilities.logger().log("AllEmployees: ", allResult[0]);

          AllEmployees = allResult[0];
          AllLeaves = allResult[1];
          AllYearlyLeaves = allResult[2];
          AllMonthlyLeaves = allResult[3];

          if (AllEmployees.length > 0) {
            new Promise((resolve, reject) => {
              try {
                for (let i = 0; i < AllEmployees.length; i++) {
                  // fetch all the fileds of apllicable_leavs
                  const apllicable_leavsDetail = new LINQ(AllLeaves)
                    .Where(
                      w =>
                        w.employee_type == AllEmployees[i]["employee_type"] &&
                        (w.gender == AllEmployees[i]["sex"] ||
                          w.gender == "BOTH") &&
                        (w.religion_required == "N" ||
                          (w.religion_required == "Y" &&
                            w.religion_id == AllEmployees[i]["religion_id"]))
                    )
                    .Select(s => {
                      return {
                        hims_d_leave_id: s.hims_d_leave_id,
                        eligible_days: s.eligible_days,
                        eligible_days: s.eligible_days
                      };
                    })
                    .ToArray();

                  // fetch only leave ids of apllicable_leavs
                  const apllicable_leavs = new LINQ(AllLeaves)
                    .Where(
                      w =>
                        w.employee_type == AllEmployees[i]["employee_type"] &&
                        (w.gender == AllEmployees[i]["sex"] ||
                          w.gender == "BOTH") &&
                        (w.religion_required == "N" ||
                          (w.religion_required == "Y" &&
                            w.religion_id == AllEmployees[i]["religion_id"]))
                    )
                    .Select(s => s.hims_d_leave_id)
                    .ToArray();

                  if (apllicable_leavs.length > 0) {
                    let new_leave_ids = apllicable_leavs.filter((item, pos) => {
                      return apllicable_leavs.indexOf(item) == pos;
                    });
                    //  debugLog("new_leave_ids:", new_leave_ids);
                    //step1---checking if yearly leave is  already processed for this employee
                    const yearlyLvExist = new LINQ(AllYearlyLeaves)
                      .Where(
                        w =>
                          w.employee_id ==
                          AllEmployees[i]["hims_d_employee_id"] &&
                          w.year == year
                      )
                      .Select(s => s.hims_f_employee_yearly_leave_id)
                      .ToArray().length;

                    // debugLog("yearlyLvExist:", yearlyLvExist);
                    //if yearly leave is  not processed for this employee process now
                    if (yearlyLvExist < 1) {
                      yearArray.push({
                        employee_id: AllEmployees[i].hims_d_employee_id,
                        year: year
                      });
                    }

                    //step2----checking if monthly leave is  already processed for this employee
                    const monthlyLvExist = new LINQ(AllMonthlyLeaves)
                      .Where(
                        w =>
                          w.employee_id ==
                          AllEmployees[i]["hims_d_employee_id"] &&
                          w.year == year
                      )
                      .Select(s => s.leave_id)
                      .ToArray();

                    // debugLog("monthlyLvExist:", monthlyLvExist);
                    if (monthlyLvExist.length > 0) {
                      // const old_leave_ids = new LINQ(
                      //   monthlyLvExist
                      // )
                      //   .Select(s => s.leave_id)
                      //   .ToArray();

                      //   debugLog("old_leave_ids:", old_leave_ids);

                      // remove existing leave ids from applicable leave ids
                      let leaves_to_insert = new_leave_ids.filter(
                        val => !monthlyLvExist.includes(val)
                      );

                      const _leaves = leaves_to_insert.map(item => {
                        return _.chain(apllicable_leavsDetail)
                          .find(o => {
                            return o.hims_d_leave_id == item;
                          })

                          .omit(_.isNull)
                          .value();
                      });
                      //  debugLog("_leaves:", _leaves);
                      monthlyArray.push(
                        ...new LINQ(_leaves)
                          .Where(w => w.hims_d_leave_id > 0)
                          .Select(s => {
                            return {
                              employee_id: AllEmployees[i].hims_d_employee_id,
                              year: year,
                              leave_id: s.hims_d_leave_id,
                              total_eligible: s.eligible_days,
                              close_balance: s.eligible_days
                            };
                          })
                          .ToArray()
                      );
                    } else {
                      // if monthly table data not exist
                      monthlyArray.push(
                        ...new LINQ(apllicable_leavsDetail)
                          .Where(w => w.hims_d_leave_id > 0)
                          .Select(s => {
                            return {
                              employee_id: AllEmployees[i].hims_d_employee_id,
                              year: year,
                              leave_id: s.hims_d_leave_id,
                              total_eligible: s.eligible_days,
                              close_balance: s.eligible_days
                            };
                          })
                          .ToArray()
                      );
                    }
                  }

                  if (i == AllEmployees.length - 1) {
                    //insert in two tables
                    resolve(yearArray);
                  }
                }
              } catch (e) {
                reject(e);
              }
            }).then(arrayResult => {
              new Promise((resolve, reject) => {
                try {
                  if (yearArray.length > 0) {
                    const insurtColumns = ["employee_id", "year"];

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO hims_f_employee_yearly_leave(??) VALUES ?",
                        values: yearArray,
                        includeValues: insurtColumns,
                        extraValues: {
                          created_date: new Date(),
                          updated_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          hospital_id: req.userIdentity.hospital_id
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: false
                      })
                      .then(yearResult => {
                        if (yearResult.affectedRows > 0) {
                          resolve({ yearResult });
                        } else {
                          _mysql.rollBackTransaction(() => {
                            req.records = {
                              invalid_data: true,
                              message: "interuption in proccessing year "
                            };
                            next();
                            return;
                          });
                        }
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(e);
                        });
                      });
                  } else {
                    resolve({});
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(resultofYearInsert => {
                new Promise((resolve, reject) => {
                  try {
                    if (monthlyArray.length > 0) {
                      //functionality plus commit

                      const insurtColumns = [
                        "employee_id",
                        "year",
                        "leave_id",
                        "total_eligible",
                        "close_balance"
                      ];

                      _mysql
                        .executeQueryWithTransaction({
                          query:
                            "INSERT INTO hims_f_employee_monthly_leave(??) VALUES ?",
                          values: monthlyArray,
                          includeValues: insurtColumns,
                          extraValues: {
                            hospital_id: req.userIdentity.hospital_id
                          },
                          bulkInsertOrUpdate: true,
                          printQuery: false
                        })
                        .then(monthResult => {
                          _mysql.commitTransaction(() => {
                            _mysql.releaseConnection();
                            req.records = monthResult;
                            next();
                          });
                        })
                        .catch(e => {
                          _mysql.rollBackTransaction(() => {
                            next(e);
                          });
                        });
                    } else {
                      //commit

                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        if (Object.keys(resultofYearInsert).length === 0) {
                          req.records = {
                            already_processed: true,
                            message: "Leave already processed"
                          };
                          next();
                        } else {
                          req.records = resultofYearInsert;
                          next();
                        }
                      });
                    }
                  } catch (e) {
                    reject(e);
                  }
                }).then(resultMonthlyInsert => {
                  //pppppppppppp
                });
              });
            });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "No Employees found"
            };
            next();
            return;
          }
        })
        .catch(e => {
          _mysql.releaseConnection();

          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please Provide valid year "
      };

      next();
      return;
    }
  },

  //created by irfan: to show leave application to authorize
  getLeaveApllication: (req, res, next) => {
    let employee = "";
    let range = "";

    if (req.query.employee_id > 0) {
      employee = ` and LA.employee_id=${req.query.employee_id} `;
    }

    if (
      req.query.from_date != "null" &&
      req.query.from_date != "" &&
      req.query.from_date != null &&
      req.query.to_date != "null" &&
      req.query.to_date != "" &&
      req.query.to_date != null
    ) {
      range = ` and date(application_date)
        between date('${req.query.from_date}') and date('${req.query.to_date}') `;
    }

    const _mysql = new algaehMysql();

    _mysql
      .executeQuery({
        query: "select authorization_plan from hims_d_hrms_options;"
      })
      .then(options => {
        if (options.length > 0) {
          let auth_level = "";

          if (options[0]["authorization_plan"] == "A") {
            if (req.query.auth_level == "1") {
              auth_level =
                " and authorized1='N'  and AUS.leave_level1=" +
                req.userIdentity.employee_id;
            } else if (req.query.auth_level == "2") {
              auth_level =
                " and authorized1='Y' and authorized2='N'  and AUS.leave_level2=" +
                req.userIdentity.employee_id;
            } else if (req.query.auth_level == "3") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='N' and AUS.leave_level3=" +
                req.userIdentity.employee_id;
            } else if (req.query.auth_level == "4") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='N' ";
            } else if (req.query.auth_level == "5") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='Y'  and authorized5='N' ";
            }
          } else {
            if (req.query.auth_level == "1") {
              auth_level =
                " and authorized1='N' AND E.reporting_to_id=" +
                req.userIdentity.employee_id;
            } else if (req.query.auth_level == "2") {
              auth_level = " and authorized1='Y' and authorized2='N' ";
            } else if (req.query.auth_level == "3") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='N' ";
            } else if (req.query.auth_level == "4") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='N' ";
            } else if (req.query.auth_level == "5") {
              auth_level =
                " and authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='Y'  and authorized5='N' ";
            }
          }

          let leave_status = "";

          if (req.query.leave_status == "APR") {
            auth_level = "";
            leave_status = "  status='APR' ";
          } else if (req.query.leave_status == "REJ") {
            auth_level = "";
            leave_status = "  status='REJ' ";
          } else if (req.query.leave_status == "CAN") {
            auth_level = "";
            leave_status = "  status='CAN' ";
          } else {
            leave_status = "  status='PEN'  ";
          }

          if (req.userIdentity.leave_authorize_privilege != "N") {
            _mysql
              .executeQuery({
                query:
                  "SELECT hims_f_leave_application_id,LA.leave_application_code,LA.hospital_id,LA.employee_id,\
            LA.application_date,LA.sub_department_id,LA.leave_id,LA.from_leave_session,\
            LA.from_date,LA.to_date,LA.to_leave_session,\
            LA.total_applied_days,LA.leave_from,LA.absent_id,LA.total_approved_days,LA.status,LA.is_projected_leave \
            ,L.leave_code,L.leave_description,L.leave_type,L.leave_category,E.employee_code,\
            E.full_name as employee_name,E.religion_id,SD.sub_department_code,SD.sub_department_name, DE.designation,remarks,E.nationality \
            from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
            and L.record_status='A' inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
            and E.record_status='A' left join hims_d_sub_department SD \
            on LA.sub_department_id=SD.hims_d_sub_department_id left join hims_d_designation DE on\
            E.employee_designation_id = DE.hims_d_designation_id  \
            left join hims_d_authorization_setup AUS on  AUS.employee_id=E.hims_d_employee_id \
            where LA.hospital_id=? and " +
                  leave_status +
                  "" +
                  auth_level +
                  "" +
                  range +
                  "" +
                  employee +
                  " order by hims_f_leave_application_id desc",
                values: [req.query.hospital_id],

                printQuery: false
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
            req.records = {
              invalid_input: true,
              message: "you dont have admin privilege "
            };
            next();
            return;
          }
        } else {
          _mysql.releaseConnection();
          req.records = {
            message: "Please define HRMS options",
            invalid_input: true
          };
          next();
        }
      })
      .catch(e => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan: update leave header
  updateLeaveMaster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    if (input.hims_d_leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_leave SET leave_description=?,leave_category=?, calculation_type=?,include_weekoff=?,include_holiday=?,leave_mode=?,leave_status=?,leave_accrual=?,\
        leave_encash=?,leave_type=?,encashment_percentage=?,leave_carry_forward=?,carry_forward_percentage=?,religion_required=?,\
        religion_id=?,holiday_reimbursement=?,exit_permit_required=?,proportionate_leave=?,document_mandatory=?,avail_if_no_balance=?,\
        updated_date=?, updated_by=?  WHERE hims_d_leave_id = ?",
          values: [
            input.leave_description,
            input.leave_category,
            input.calculation_type,
            input.include_weekoff,
            input.include_holiday,
            input.leave_mode,
            input.leave_status,
            input.leave_accrual,
            input.leave_encash,
            input.leave_type,
            input.encashment_percentage,
            input.leave_carry_forward,
            input.carry_forward_percentage,
            input.religion_required,
            input.religion_id,
            input.holiday_reimbursement,
            input.exit_permit_required,
            input.proportionate_leave,
            input.document_mandatory,
            input.avail_if_no_balance,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_leave_id
          ],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },
  //created by irfan: to get leave details
  getLeaveDetailsMaster: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.query.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "Select hims_d_leave_detail_id, leave_header_id, employee_type,\
          gender, eligible_days, min_service_required, service_years,\
          once_life_term, allow_probation, max_number_days, mandatory_utilize_days\
          from hims_d_leave_detail where leave_header_id=?",

          values: [req.query.leave_id],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },
  //created by irfan: to add leave detail
  addLeaveDetailMaster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    if (input.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_leave_detail ( leave_header_id,\
            employee_type, gender, eligible_days, min_service_required, service_years,\
             once_life_term, allow_probation, max_number_days,\
            mandatory_utilize_days, created_date, created_by, updated_date, updated_by) values(\
           ?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.leave_id,
            input.employee_type,
            input.gender,
            input.eligible_days,
            input.min_service_required,
            input.service_years,
            input.once_life_term,
            input.allow_probation,
            input.max_number_days,
            input.mandatory_utilize_days,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },

  //created by irfan:
  deleteLeaveEncash: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.body.hims_d_leave_encashment_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "DELETE from  hims_d_leave_encashment WHERE hims_d_leave_encashment_id=?",
          values: [req.body.hims_d_leave_encashment_id],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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
  deleteLeaveRule: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.body.hims_d_leave_rule_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: "DELETE from  hims_d_leave_rule WHERE hims_d_leave_rule_id=?",
          values: [req.body.hims_d_leave_rule_id],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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
  deleteLeaveDetail: (req, res, next) => {
    const utilities = new algaehUtilities();

    if (req.body.hims_d_leave_detail_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "DELETE from  hims_d_leave_detail WHERE hims_d_leave_detail_id=?",
          values: [req.body.hims_d_leave_detail_id],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();

          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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

  //created by irfan: to addLeave Encashment Master
  addLeaveEncashmentMaster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    if (input.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_leave_encashment ( leave_header_id,\
          earnings_id, percent,created_date, created_by, updated_date, updated_by) values(\
          ?,?,?,?,?,?,?)",
          values: [
            input.leave_id,
            input.earnings_id,
            input.percent,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },
  //created by irfan: to addLeaveRulesMaster
  addLeaveRulesMaster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    if (input.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_d_leave_rule ( leave_header_id,\
          calculation_type, earning_id,\
          paytype, from_value, to_value, value_type, total_days) values(\
           ?,?,?,?,?,?,?,?)",
          values: [
            input.leave_id,
            input.calculation_type,
            input.earning_id,
            input.paytype,
            input.from_value,
            input.to_value,
            input.value_type,
            input.total_days
          ],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },

  //created by irfan: to
  getLeaveEncashmentMaster: (req, res, next) => {
    if (req.query.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "Select hims_d_leave_encashment_id, leave_header_id,\
        earnings_id, percent\
       from hims_d_leave_encashment where leave_header_id=?",

          values: [req.query.leave_id],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },
  //created by irfan: to
  getLeaveRulesMaster: (req, res, next) => {
    if (req.query.leave_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "Select hims_d_leave_rule_id, leave_header_id, calculation_type,\
        earning_id, paytype, from_value, to_value, value_type, total_days\
       from hims_d_leave_rule where leave_header_id=?",

          values: [req.query.leave_id],

          printQuery: false
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
      req.records = {
        invalid_input: true,
        message: "please provide valid input"
      };

      next();
      return;
    }
  },

  //created by irfan:
  updateLeaveDetailMaster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let input = req.body;
    if (input.hims_d_leave_detail_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_leave_detail SET leave_header_id = ?,\
        employee_type = ?, gender = ?, eligible_days = ?, min_service_required = ? , service_years = ?,\
        once_life_term = ?, allow_probation = ?, max_number_days = ?, mandatory_utilize_days = ?,\
          updated_date=?, updated_by=?  WHERE hims_d_leave_detail_id = ?",
          values: [
            input.leave_header_id,
            input.employee_type,
            input.gender,
            input.eligible_days,
            input.min_service_required,
            input.service_years,
            input.once_life_term,
            input.allow_probation,
            input.max_number_days,
            input.mandatory_utilize_days,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_leave_detail_id
          ],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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
  updateLeaveEncashMaster: (req, res, next) => {
    let input = req.body;
    if (input.hims_d_leave_encashment_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_leave_encashment SET leave_header_id = ?,\
        earnings_id = ?, percent = ?,\
          updated_date=?, updated_by=?  WHERE hims_d_leave_encashment_id = ?",
          values: [
            input.leave_header_id,
            input.earnings_id,
            input.percent,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_leave_encashment_id
          ],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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
  updateLeaveRuleMaster: (req, res, next) => {
    let input = req.body;
    if (input.hims_d_leave_rule_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_leave_rule SET leave_header_id = ?,\
        calculation_type = ?, earning_id = ?, paytype = ?, from_value = ? , to_value = ?,\
        value_type = ?, total_days = ?  WHERE hims_d_leave_rule_id = ?",
          values: [
            input.leave_header_id,
            input.calculation_type,
            input.earning_id,
            input.paytype,
            input.from_value,
            input.to_value,
            input.value_type,
            input.total_days,
            input.hims_d_leave_rule_id
          ],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id"
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
  deleteLeaveApplication: (req, res, next) => {
    let input = req.body;
    if (input.hims_f_leave_application_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "select hims_f_leave_application_id,employee_id,from_date,to_date,leave_id,authorized1,authorized2,\
          authorized3,`status`,is_across_year_leave from hims_f_leave_application where authorized1='N' \
          and authorized2='N' and authorized3='N' and `status`='PEN' and employee_id=?\
          and hims_f_leave_application_id=?",
          values: [req.body.employee_id, req.body.hims_f_leave_application_id],

          printQuery: false
        })
        .then(result => {
          if (result.length > 0) {
            if (result[0]["is_across_year_leave"] == "Y") {
              //YOU CAN CANCEL
              input["cancel"] = "Y";
              input = { ...input, ...result[0] };
              // req.body["leave_id"]=result[0]["leave_id"];
              //------------------------------------------------------------------
              validateLeaveApplictn(input, _mysql)
                .then(deductionResult => {
                  _mysql
                    .executeQuery({
                      query: `select * from hims_f_employee_monthly_leave where employee_id=? and year in (?) and leave_id=?;\
                              select leave_application_code from hims_f_leave_application where employee_id=? and leave_id=? and (date_format(from_date,'%Y')=? \
                               or date_format(to_date,'%Y')=? ) and status<>'CAN' and status<>'REJ'   and hims_f_leave_application_id<>?;
                              `,
                      values: [
                        input.employee_id,
                        [deductionResult.from_year, deductionResult.to_year],
                        input.leave_id,
                        input.employee_id,
                        input.leave_id,
                        deductionResult.to_year,
                        deductionResult.to_year,
                        input.hims_f_leave_application_id
                      ],
                      printQuery: false
                    })
                    .then(resdata => {
                      const leaveData = resdata[0];
                      const acrossYearSecondLeave = resdata[1];

                      if (leaveData.length > 0) {
                        if (deductionResult.is_across_year_leave == "Y") {
                          if (acrossYearSecondLeave.length > 0) {
                            _mysql.releaseConnection();
                            req.records = {
                              invalid_input: true,
                              message: `Please Cancel (${
                                acrossYearSecondLeave[0][
                                "leave_application_code"
                                ]
                                }) application First `
                            };
                            next();
                          } else {
                            const cur_year_leaveData = leaveData.filter(
                              f => f.year == deductionResult.from_year
                            );
                            const next_year_leaveData = leaveData.filter(
                              f => f.year == deductionResult.to_year
                            );

                            acrossYearCancel(
                              deductionResult,
                              cur_year_leaveData,
                              next_year_leaveData,
                              input,
                              req
                            )
                              .then(resu => {
                                _mysql
                                  .executeQueryWithTransaction({
                                    query:
                                      resu.delete_partB +
                                      resu.deletePendingLeave +
                                      resu.anualLeave +
                                      "delete from hims_f_leave_application where hims_f_leave_application_id=?;\
                                  update hims_f_employee_monthly_leave set carry_forward_done='N',carry_forward_leave=0,processed='N' where\
                                  hims_f_employee_monthly_leave_id=?",
                                    values: [
                                      req.body.hims_f_leave_application_id,
                                      resu.hims_f_employee_monthly_leave_id
                                    ],
                                    printQuery: false
                                  })
                                  .then(finalRes => {
                                    _mysql.commitTransaction(() => {
                                      _mysql.releaseConnection();
                                      req.records = finalRes;
                                      next();
                                    });
                                  })
                                  .catch(error => {
                                    console.log("error: ", error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });
                              })
                              .catch(error => {
                                console.log("error55: ", error);
                                _mysql.releaseConnection();
                                req.records = error;
                                next(error);
                              });
                          }
                        } else {
                          //invalid data
                          _mysql.releaseConnection();
                          req.records = {
                            invalid_input: true,
                            message: "leave Not found"
                          };

                          _mysql.rollBackTransaction(() => { });
                          next();
                        }
                      } else {
                        //invalid data
                        _mysql.releaseConnection();
                        req.records = {
                          invalid_input: true,
                          message: "leave Not found"
                        };

                        _mysql.rollBackTransaction(() => { });
                        next();
                      }
                    })
                    .catch(error => {
                      console.log("error6:", error);
                      _mysql.rollBackTransaction(() => {
                        next(error);
                      });
                    });
                })
                .catch(error => {
                  console.log("error6:", error);
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            } else {
              _mysql
                .executeQuery({
                  query:
                    "delete from hims_f_leave_application where hims_f_leave_application_id=?",
                  values: [req.body.hims_f_leave_application_id],

                  printQuery: false
                })
                .then(delResult => {
                  _mysql.releaseConnection();

                  if (delResult.affectedRows > 0) {
                    req.records = delResult;
                    next();
                  } else {
                    req.records = {
                      invalid_input: true,
                      message: `invalid input`
                    };
                    next();
                  }
                })
                .catch(e => {
                  _mysql.releaseConnection();
                  next(e);
                });
            }
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: `can't delete, Application is under proccess`
            };
            next();
            return;
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
  cancelLeave_BEFORE_ACROSS_YEAR: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leave_from == "AB") {
      req.records = {
        invalid_input: true,
        message: "You Can't Cancel Regularized Leave"
      };

      next();
      return;
    } else {
      getMaxAuth({
        mysql: _mysql
      })
        .then(result => {
          if (req.userIdentity.leave_authorize_privilege >= result.MaxLeave) {
            _mysql
              .executeQuery({
                query:
                  "select hims_f_leave_application_id,leave_application_code ,`status`\
             from hims_f_leave_application where hims_f_leave_application_id=? ",
                values: [input.hims_f_leave_application_id],

                printQuery: false
              })
              .then(leaveStaus => {
                if (leaveStaus.length > 0) {
                  if (leaveStaus[0]["status"] == "APR") {
                    const month_number = moment(input.from_date).format("M");
                    _mysql
                      .executeQuery({
                        query:
                          "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                      hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                        values: [month_number, input.year, input.employee_id],

                        printQuery: false
                      })
                      .then(salResult => {
                        if (
                          salResult.length < 1 ||
                          (salResult.length > 0 &&
                            salResult[0]["salary_processed"] == "N" &&
                            salResult[0]["salary_paid"] == "N")
                        ) {
                          //YOU CAN CANCEL

                          //------------------------------------------------------------------

                          calc(_mysql, { ...req.body, cancel: "Y" })
                            .then(deductionResult => {
                              if (deductionResult.invalid_input == true) {
                                _mysql.releaseConnection();

                                req.records = deductionResult;
                                next();
                                return;
                              } else {
                                return deductionResult;
                              }
                            })
                            .then(deductionResult => {
                              let monthArray = new LINQ(
                                deductionResult.monthWiseCalculatedLeaveDeduction
                              )
                                .Select(s => s.month_name)
                                .ToArray();

                              if (monthArray.length > 0) {
                                _mysql
                                  .executeQuery({
                                    query: `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                                 from hims_f_employee_monthly_leave where
                                employee_id=? and year=? and leave_id=?`,
                                    values: [
                                      input.employee_id,
                                      input.year,
                                      input.leave_id
                                    ],

                                    printQuery: false
                                  })
                                  .then(monthlyLeaveData => {
                                    let updateMonths = {};
                                    let newCloseBal =
                                      parseFloat(
                                        monthlyLeaveData[0]["close_balance"]
                                      ) +
                                      parseFloat(
                                        deductionResult.calculatedLeaveDays
                                      );
                                    let newAvailTillDate =
                                      parseFloat(
                                        monthlyLeaveData[0]["availed_till_date"]
                                      ) -
                                      parseFloat(
                                        deductionResult.calculatedLeaveDays
                                      );
                                    for (
                                      let i = 0;
                                      i <
                                      deductionResult
                                        .monthWiseCalculatedLeaveDeduction
                                        .length;
                                      i++
                                    ) {
                                      Object.keys(monthlyLeaveData[0]).map(
                                        key => {
                                          // debugLog("ke:",key);
                                          // debugLog("m name",deductionResult.monthWiseCalculatedLeaveDeduction[i]["month_name"]);
                                          if (
                                            key ==
                                            deductionResult
                                              .monthWiseCalculatedLeaveDeduction[
                                            i
                                            ]["month_name"]
                                          ) {
                                            updateMonths = {
                                              ...updateMonths,
                                              [key]:
                                                parseFloat(
                                                  monthlyLeaveData[0][key]
                                                ) -
                                                parseFloat(
                                                  deductionResult
                                                    .monthWiseCalculatedLeaveDeduction[
                                                  i
                                                  ]["finalLeave"]
                                                )
                                            };
                                          }
                                        }
                                      );
                                    }

                                    //oooooooooooooooooooo
                                    let anualLeave = "";
                                    if (input.leave_category == "A") {
                                      anualLeave =
                                        " update hims_f_employee_annual_leave set cancelled='Y' where leave_application_id=" +
                                        input.hims_f_leave_application_id +
                                        "; ";
                                    }

                                    _mysql
                                      .executeQueryWithTransaction({
                                        query:
                                          anualLeave +
                                          " update hims_f_leave_application set status='CAN',cancelled_date='" +
                                          moment().format("YYYY-MM-DD") +
                                          "',\
                                      cancelled_by=" +
                                          req.userIdentity
                                            .algaeh_d_app_user_id +
                                          ",cancelled_remarks='" +
                                          input.cancelled_remarks +
                                          "' where record_status='A' \
                                       and hims_f_leave_application_id=" +
                                          input.hims_f_leave_application_id +
                                          ";update hims_f_employee_monthly_leave set ?  where \
                                        hims_f_employee_monthly_leave_id='" +
                                          monthlyLeaveData[0]
                                            .hims_f_employee_monthly_leave_id +
                                          "'",
                                        values: [
                                          {
                                            ...updateMonths,
                                            close_balance: newCloseBal,
                                            availed_till_date: newAvailTillDate
                                          }
                                        ],

                                        printQuery: false
                                      })
                                      .then(finalRes => {
                                        _mysql.commitTransaction(() => {
                                          _mysql.releaseConnection();
                                          req.records = finalRes;
                                          next();
                                        });
                                      })
                                      .catch(e => {
                                        reject(error);
                                        _mysql.rollBackTransaction(() => {
                                          next(error);
                                        });
                                      });
                                    //oooooooooooooooooooo
                                  })
                                  .catch(e => {
                                    _mysql.releaseConnection();
                                    next(e);
                                  });
                              } else {
                                _mysql.releaseConnection();
                                req.records = {
                                  invalid_input: true,
                                  message: "leaves not found"
                                };
                                next();
                                return;
                              }
                            })
                            .catch(e => {
                              _mysql.rollBackTransaction(() => {
                                next(e);
                              });
                              reject(e);
                            });

                          //------------------------------------------------------------------
                        } else {
                          //salary is proceesd

                          _mysql.releaseConnection();
                          req.records = {
                            invalid_input: true,
                            message: "salary is already processed"
                          };
                          next();
                          return;
                        }
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
                  } else if (leaveStaus[0]["status"] == "CAN") {
                    // already cancelled
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: "leave already cancelled"
                    };
                    next();
                    return;
                  } else {
                    // already cancelled
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: "can't cancel,leave is not Approved yet"
                    };
                    next();
                    return;
                  }
                } else {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: "please send valid input"
                  };
                  next();
                  return;
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "you dont have privilege"
            };
            next();
            return;
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },
  //created by irfan:
  cancelLeave: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    let input = req.body;

    if (input.leave_from == "AB") {
      req.records = {
        invalid_input: true,
        message: "You Can't Cancel Regularized Leave"
      };

      next();
      return;
    } else {
      getMaxAuth({
        mysql: _mysql
      })
        .then(result => {
          if (req.userIdentity.leave_authorize_privilege >= result.MaxLeave) {
            _mysql
              .executeQuery({
                query:
                  "select hims_f_leave_application_id,leave_application_code ,`status`\
             from hims_f_leave_application where hims_f_leave_application_id=?;\
             select attendance_starts,at_st_date,at_end_date from hims_d_hrms_options limit 1; ",
                values: [input.hims_f_leave_application_id],

                printQuery: false
              })
              .then(leaveResult => {
                const leaveStaus=leaveResult[0];
                const attResult=leaveResult[1][0];
                if (leaveStaus.length > 0) {
                  if (leaveStaus[0]["status"] == "APR") {
                    let month_number = '';


                    if (attResult.attendance_starts == "PM" && attResult.at_end_date > 0) {
                      if (moment(input.from_date, "YYYY-MM-DD").format("D") > attResult.at_end_date) {
                        month_number =
                          parseInt(moment(input.from_date, "YYYY-MM-DD").format("M")) + 1;
                      }else {
                        month_number = moment(input.from_date, "YYYY-MM-DD").format("M");
                      }
                    }else{
                      month_number = moment(input.from_date).format("M");

                    }

                    _mysql
                      .executeQuery({
                        query:
                          "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                      hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                        values: [month_number, input.year, input.employee_id],

                        printQuery: false
                      })
                      .then(salResult => {
                        if (
                          salResult.length < 1 ||
                          (salResult.length > 0 &&
                            salResult[0]["salary_processed"] == "N" &&
                            salResult[0]["salary_paid"] == "N")
                        ) {
                          //YOU CAN CANCEL
                          input["cancel"] = "Y";
                          //------------------------------------------------------------------
                          validateLeaveApplictn(req.body, _mysql)
                            .then(deductionResult => {
                              _mysql
                                .executeQuery({
                                  query: `select * from hims_f_employee_monthly_leave where employee_id=? and year in (?) and leave_id=?;\
                              select leave_application_code from hims_f_leave_application where employee_id=? and leave_id=? and (date_format(from_date,'%Y')=? \
                               or date_format(to_date,'%Y')=? ) and status<>'CAN' and status<>'REJ'   and hims_f_leave_application_id<>?;
                              `,
                                  values: [
                                    input.employee_id,
                                    [
                                      deductionResult.from_year,
                                      deductionResult.to_year
                                    ],
                                    input.leave_id,
                                    input.employee_id,
                                    input.leave_id,
                                    deductionResult.to_year,
                                    deductionResult.to_year,
                                    input.hims_f_leave_application_id
                                  ],
                                  printQuery: false
                                })
                                .then(resdata => {
                                  const leaveData = resdata[0];
                                  const acrossYearSecondLeave = resdata[1];

                                  if (leaveData.length > 0) {
                                    if (
                                      deductionResult.is_across_year_leave ==
                                      "Y"
                                    ) {
                                      if (acrossYearSecondLeave.length > 0) {
                                        _mysql.releaseConnection();
                                        req.records = {
                                          invalid_input: true,
                                          message: `Please Cancel (${
                                            acrossYearSecondLeave[0][
                                            "leave_application_code"
                                            ]
                                            }) application First `
                                        };
                                        next();
                                      } else {
                                        const cur_year_leaveData = leaveData.filter(
                                          f =>
                                            f.year == deductionResult.from_year
                                        );
                                        const next_year_leaveData = leaveData.filter(
                                          f => f.year == deductionResult.to_year
                                        );

                                        acrossYearCancel(
                                          deductionResult,
                                          cur_year_leaveData,
                                          next_year_leaveData,
                                          input,
                                          req
                                        )
                                          .then(resu => {
                                            _mysql
                                              .executeQueryWithTransaction({
                                                query:
                                                  resu.partA_update_leave_balnce +
                                                  resu.delete_partB +
                                                  resu.update_leave_application +
                                                  resu.deletePendingLeave +
                                                  resu.anualLeave,
                                                printQuery: false
                                              })
                                              .then(finalRes => {
                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                });
                                              })
                                              .catch(error => {
                                                console.log("error: ", error);
                                                _mysql.rollBackTransaction(
                                                  () => {
                                                    next(error);
                                                  }
                                                );
                                              });
                                          })
                                          .catch(error => {
                                            console.log("error55: ", error);
                                            _mysql.releaseConnection();
                                            req.records = error;
                                            next(error);
                                          });
                                      }
                                    } else {
                                      singleYearCancel(
                                        deductionResult,
                                        leaveData,
                                        input,
                                        req
                                      )
                                        .then(resul => {
                                          _mysql
                                            .executeQueryWithTransaction({
                                              query:
                                                resul.update_leave_balnce +
                                                resul.update_leave_application +
                                                resul.deletePendingLeave +
                                                resul.anualLeave,
                                              printQuery: false
                                            })
                                            .then(finalRes => {
                                              _mysql.commitTransaction(() => {
                                                _mysql.releaseConnection();
                                                req.records = finalRes;
                                                next();
                                              });
                                            })
                                            .catch(error => {
                                              console.log("error: ", error);
                                              _mysql.rollBackTransaction(() => {
                                                next(error);
                                              });
                                            });
                                        })
                                        .catch(error => {
                                          console.log("error65: ", error);
                                          _mysql.releaseConnection();
                                          req.records = error;
                                          next(error);
                                        });
                                    }
                                  } else {
                                    //invalid data
                                    req.records = {
                                      invalid_input: true,
                                      message: "leave Not found"
                                    };

                                    _mysql.rollBackTransaction(() => { });
                                    next();
                                  }
                                })
                                .catch(error => {
                                  console.log("error6:", error);
                                  _mysql.rollBackTransaction(() => {
                                    next(error);
                                  });
                                });
                            })
                            .catch(error => {
                              console.log("error6:", error);
                              _mysql.rollBackTransaction(() => {
                                next(error);
                              });
                            });

                          //------------------------------------------------------------------
                        } else {
                          //salary is proceesd

                          _mysql.releaseConnection();
                          req.records = {
                            invalid_input: true,
                            message: "salary is already processed"
                          };
                          next();
                          return;
                        }
                      })
                      .catch(e => {
                        _mysql.releaseConnection();
                        next(e);
                      });
                  } else if (leaveStaus[0]["status"] == "CAN") {
                    // already cancelled
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: "leave already cancelled"
                    };
                    next();
                    return;
                  } else {
                    // already cancelled
                    _mysql.releaseConnection();
                    req.records = {
                      invalid_input: true,
                      message: "can't cancel,leave is not Approved yet"
                    };
                    next();
                    return;
                  }
                } else {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: "please send valid input"
                  };
                  next();
                  return;
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            _mysql.releaseConnection();
            req.records = {
              invalid_input: true,
              message: "you dont have privilege"
            };
            next();
            return;
          }
        })
        .catch(e => {
          _mysql.releaseConnection();
          next(e);
        });
    }
  },

  //created by irfan:
  getLeaveBalances: (req, res, next) => {
    let input = req.query;
    if (input.hospital_id > 0 && input.year > 0) {
      const _mysql = new algaehMysql();

      let strQry = "";
      if (input.employee_group_id > 0) {
        strQry += " and E.employee_group_id=" + input.employee_group_id;
      }
      if (input.hims_d_employee_id > 0) {
        strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
      }

      _mysql
        .executeQuery({
          query: `select E.hims_d_employee_id,E.employee_code,E.full_name,ML.leave_id ,ML.total_eligible,\
              ML.availed_till_date,ML.close_balance from hims_d_employee E \
              inner join  hims_f_employee_monthly_leave ML on ML.employee_id=E.hims_d_employee_id and ML.year=?\
              where  E.hospital_id=? and  E.record_status='A' ${strQry} order by hims_d_employee_id;\
              select hims_d_leave_id, leave_code, leave_description from hims_d_leave \
              where record_status='A';`,
          values: [input.year, input.hospital_id],

          printQuery: false
        })
        .then(result => {
          _mysql.releaseConnection();
          const employees = result[0];
          const leave_master = result[1];

          const outputArray = [];

          if (employees.length > 0 && leave_master.length > 0) {
            _.chain(employees)
              .groupBy(g => g.hims_d_employee_id)
              .forEach(emp => {
                let data = {
                  employee_code: emp[0]["employee_code"],
                  full_name: emp[0]["full_name"],
                  hims_d_employee_id: emp[0]["hims_d_employee_id"]
                };
                leave_master.forEach(leave => {
                  const leave_assignd = emp.find(item => {
                    return item["leave_id"] == leave["hims_d_leave_id"];
                  });
                  if (leave_assignd != undefined) {
                    data["" + leave["hims_d_leave_id"] + ""] =
                      leave_assignd["close_balance"];
                  } else {
                    data["" + leave["hims_d_leave_id"] + ""] = "N";
                  }
                });

                outputArray.push(data);
              })
              .value();

            req.records = outputArray;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: `No Employees Found`
            };
            next();
            return;
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

  updateEmployeeLeave: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      const input = req.body;
      let execute_query = "";

      for (let i = 0; i < input.length; i++) {
        execute_query += _mysql.mysqlQueryFormat(
          "UPDATE hims_f_employee_monthly_leave set close_balance=? \
          where  employee_id=? and leave_id=? and year=?;",
          [
            input[i].close_balance,
            input[i].employee_id,
            input[i].leave_id,
            input[i].year
          ]
        );

        if (i == input.length - 1) {
          _mysql
            .executeQuery({
              query: execute_query,
              printQuery: false
            })
            .then(result => {
              _mysql.releaseConnection();
              req.records = result;
              next();
            })
            .catch(e => {
              next(e);
            });
        }
      }
    } catch (e) {
      next(e);
    }
  },
  //created by irfan:
  processYearlyLeave: (req, res, next) => {
    const _mysql = new algaehMysql();

    yearlyLeaveProcess(req.query, req, _mysql)
      .then(result => {
        _mysql.commitTransaction(() => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        });
      })
      .catch(e => {
        console.log("CATCH:", e);
        if (e.invalid_input == true) {
          _mysql.rollBackTransaction(() => { });
          req.records = e;
          next();
        } else {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        }
      });
  }
};

// finish

//created by irfan: to get database field for authrzation
function getLeaveAuthFields(auth_level) {
  return new Promise((resolve, reject) => {
    let authFields;

    switch (auth_level) {
      case 1:
        authFields = [
          "authorized1=?",
          "authorized1_date=?",
          "authorized1_by=?",
          "authorized1_comment=?"
        ];
        break;

      case 2:
        authFields = [
          "authorized2=?",
          "authorized2_date=?",
          "authorized2_by=?",
          "authorized2_comment=?"
        ];
        break;

      case 3:
        authFields = [
          "authorized3=?",
          "authorized3_date=?",
          "authorized3_by=?",

          "authorized3_comment=?"
        ];
        break;

      case 4:
        authFields = [
          "authorized4=?",
          "authorized4_date=?",
          "authorized4_by=?",

          "authorized4_comment=?"
        ];
        break;
      case 5:
        authFields = [
          "authorized5=?",
          "authorized5_date=?",
          "authorized5_by=?",
          "authorized5_comment=?"
        ];
        break;
      default:
    }

    resolve(authFields);
  });
}
//created by irfan: to calculateLeaveDays internally
function calc(db, body) {
  try {
    return new Promise((resolve, reject) => {
      //  let db = null;
      let _mysql = db;
      let input = body;

      if (input.hospital_id > 0) {
        const utilities = new algaehUtilities();
        let from_date = moment(input.from_date).format("YYYY-MM-DD");
        let to_date = moment(input.to_date).format("YYYY-MM-DD");
        let leave_applied_days = 0;
        let calculatedLeaveDays = 0;
        let session_diff = 0;
        let my_religion = input.religion_id;

        let from_month = moment(from_date).format("M");
        let to_month = moment(to_date).format("M");

        let year = moment(from_date).format("YYYY");

        let dateStart = moment(from_date);
        let dateEnd = moment(to_date);
        let dateRange = [];
        let currentClosingBal = 0;
        let annual_leave = "";
        let leaveDeductionArray = [];

        //--- START OF-------calculate Half-day or Full-day from session

        if (input.from_date == input.to_date) {
          if (input.from_session == "FH" && input.to_session == "FH") {
            session_diff += parseFloat(0.5);
          } else if (input.from_session == "SH" && input.to_session == "SH") {
            session_diff += parseFloat(0.5);
          }
        } else {
          if (input.from_session == "SH") {
            session_diff += parseFloat(0.5);
          }
          if (input.to_session == "FH") {
            session_diff += parseFloat(0.5);
          }
        }
        //--- END OF---------calculate Half-day or Full-day from session

        //--- START OF---------get month names and start_of_month and end_of_month number of days in a full month
        while (
          dateEnd > dateStart ||
          dateStart.format("M") === dateEnd.format("M")
        ) {
          dateRange.push({
            month_name: dateStart.format("MMMM"),
            startOfMonth: moment(dateStart)
              .startOf("month")
              .format("YYYY-MM-DD"),
            endOfMonth: moment(dateStart)
              .endOf("month")
              .format("YYYY-MM-DD"),

            numberOfDays: moment(dateStart).daysInMonth()
          });
          dateStart.add(1, "month");
        }

        // ---END OF---------get month names and start_of_month and end_of_month number of days in a full month

        //---START OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
        if (dateRange.length > 1) {
          for (let i = 0; i < dateRange.length; i++) {
            if (i == 0) {
              let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
              let start = moment(from_date).format("YYYY-MM-DD");

              leave_applied_days +=
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1;
              extend(dateRange[i], {
                begning_of_leave: start,
                end_of_leave: end,
                leaveDays:
                  moment(end, "YYYY-MM-DD").diff(
                    moment(start, "YYYY-MM-DD"),
                    "days"
                  ) + 1
              });
            } else if (i == dateRange.length - 1) {
              let start = moment(dateRange[i]["startOfMonth"]).format(
                "YYYY-MM-DD"
              );
              let end = moment(to_date).format("YYYY-MM-DD");

              leave_applied_days +=
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1;

              extend(dateRange[i], {
                begning_of_leave: start,
                end_of_leave: end,
                leaveDays:
                  moment(end, "YYYY-MM-DD").diff(
                    moment(start, "YYYY-MM-DD"),
                    "days"
                  ) + 1
              });
            } else {
              leave_applied_days += dateRange[i]["numberOfDays"];

              extend(dateRange[i], {
                begning_of_leave: dateRange[i]["startOfMonth"],
                end_of_leave: dateRange[i]["endOfMonth"],
                leaveDays: dateRange[i]["numberOfDays"]
              });
            }
          }

          calculatedLeaveDays = leave_applied_days;
        } else if (dateRange.length == 1) {
          let end = moment(to_date).format("YYYY-MM-DD");
          let start = moment(from_date).format("YYYY-MM-DD");

          leave_applied_days +=
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1;
          extend(dateRange[0], {
            begning_of_leave: start,
            end_of_leave: end,
            leaveDays:
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1
          });

          calculatedLeaveDays = leave_applied_days;
        }

        //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
        return new Promise((resolve, reject) => {
          try {
            _mysql
              .executeQuery({
                query:
                  " select hims_f_employee_monthly_leave_id, total_eligible,close_balance,processed, availed_till_date\
                  from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
                values: [input.employee_id, year, input.leave_id],

                printQuery: false
              })
              .then(closeBalanceResult => {
                // _mysql.releaseConnection();
                // req.records = result;
                // next();
                if (closeBalanceResult[0].processed == "Y") {
                  resolve({
                    invalid_input: true,
                    message: `Year ${year} leave has been closed, Apply from Year ${parseInt(
                      year
                    ) + 1}`
                  });
                } else {
                  currentClosingBal = closeBalanceResult[0].close_balance;

                  resolve({});
                }
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          } catch (e) {
            reject(e);
          }
        }).then(result => {
          _mysql
            .executeQuery({
              query:
                " select hims_d_leave_id,leave_code,leave_category,avail_if_no_balance,leave_description,include_weekoff,\
              include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
              values: [input.leave_id],

              printQuery: false
            })
            .then(result => {
              if (
                result[0].leave_category == "A" &&
                result[0].avail_if_no_balance == "Y"
              ) {
                annual_leave = "Y";
              }

              // subtracting  week off or holidays fom LeaveApplied Days
              if (
                result.length > 0 &&
                (result[0].include_weekoff == "N" ||
                  result[0].include_holiday == "N")
              ) {
                _mysql
                  .executeQuery({
                    query:
                      "select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
                      from hims_d_holiday  where hospital_id=? and  date(holiday_date) between date(?) and date(?) ;",
                    values: [
                      input.hospital_id,
                      moment(from_date).format("YYYY-MM-DD"),
                      moment(to_date).format("YYYY-MM-DD")
                    ],

                    printQuery: false
                  })
                  .then(holidayResult => {
                    //s -------START OF--- get count of holidays and weekOffs betwen apllied leave range
                    let total_weekOff = new LINQ(holidayResult)
                      .Where(w => w.weekoff == "Y")
                      .Count();

                    let total_holiday = new LINQ(holidayResult)
                      .Where(
                        w =>
                          (w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion)
                      )
                      .Count();
                    // -------END OF--- get count of holidays and weekOffs betwen apllied leave range

                    //s -------START OF--- get holidays data and week of data
                    let week_off_Data = new LINQ(holidayResult)
                      .Select(s => {
                        return {
                          hims_d_holiday_id: s.hims_d_holiday_id,

                          holiday_date: s.holiday_date,

                          holiday_description: s.holiday_description,

                          holiday: s.holiday,

                          weekoff: s.weekoff,

                          holiday_type: s.holiday_type,

                          religion_id: s.religion_id
                        };
                      })
                      .Where(w => w.weekoff == "Y")
                      .ToArray();

                    let holiday_Data = new LINQ(holidayResult)
                      .Select(s => {
                        return {
                          hims_d_holiday_id: s.hims_d_holiday_id,

                          holiday_date: s.holiday_date,

                          holiday_description: s.holiday_description,

                          holiday: s.holiday,

                          weekoff: s.weekoff,

                          holiday_type: s.holiday_type,

                          religion_id: s.religion_id
                        };
                      })
                      .Where(
                        w =>
                          (w.holiday == "Y" && w.holiday_type == "RE") ||
                          (w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion)
                      )
                      .ToArray();

                    //s -------END OF--- get holidays data and week of data

                    //-------------------------------------------------------

                    let total_minus = 0;
                    for (let k = 0; k < dateRange.length; k++) {
                      let reduce_days = parseFloat(0);

                      //step 1 -------START OF------ getting total week offs and holidays to be subtracted from each month

                      //calculating holidays to remove from each month
                      if (result[0].include_holiday == "N") {
                        reduce_days += parseFloat(
                          new LINQ(holiday_Data)
                            .Where(
                              w =>
                                dateRange[k]["begning_of_leave"] <=
                                w.holiday_date &&
                                w.holiday_date <= dateRange[k]["end_of_leave"]
                            )
                            .Count()
                        );
                      }

                      //calculating week off to remove from each month
                      if (result[0].include_weekoff == "N") {
                        reduce_days += parseFloat(
                          new LINQ(week_off_Data)
                            .Where(
                              w =>
                                dateRange[k]["begning_of_leave"] <=
                                w.holiday_date &&
                                w.holiday_date <= dateRange[k]["end_of_leave"]
                            )
                            .Count()
                        );
                      }

                      //-------END OF------ getting total week offs and holidays to be subtracted from each month

                      //step 2-------START OF------ session belongs to which month and  subtract session from that month----------
                      if (input.from_session == "SH" && k == 0) {
                        if (
                          from_month === to_month &&
                          input.to_session == "FH"
                        ) {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days) -
                              parseFloat(1)
                          });
                        } else {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days) -
                              parseFloat(0.5)
                          });
                        }
                      } else if (
                        input.to_session == "FH" &&
                        k == dateRange.length - 1
                      ) {
                        leaveDeductionArray.push({
                          month_name: dateRange[k]["month_name"],
                          finalLeave:
                            parseFloat(dateRange[k]["leaveDays"]) -
                            parseFloat(reduce_days) -
                            parseFloat(0.5)
                        });
                      } else {
                        leaveDeductionArray.push({
                          month_name: dateRange[k]["month_name"],
                          finalLeave:
                            parseFloat(dateRange[k]["leaveDays"]) -
                            parseFloat(reduce_days)
                        });
                      }
                      //------- END OF----session belongs to which month and  subtract session from that month----------
                      total_minus += parseFloat(reduce_days);
                    }

                    //step3-------START OF------ finally  subtracting week off and holidays from total Applied days

                    if (result[0].include_weekoff == "N") {
                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(total_weekOff);
                    }

                    if (result[0].include_holiday == "N") {
                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(total_holiday);
                    }

                    calculatedLeaveDays =
                      parseFloat(calculatedLeaveDays) -
                      parseFloat(session_diff);

                    //-------END OF------ finally  subtracting week off and holidays from total Applied days

                    if (
                      currentClosingBal >= calculatedLeaveDays ||
                      input.cancel == "Y"
                    ) {
                      resolve({
                        leave_applied_days: leave_applied_days,
                        calculatedLeaveDays: calculatedLeaveDays,
                        monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                      });
                    } else if (
                      currentClosingBal < calculatedLeaveDays &&
                      annual_leave == "Y"
                    ) {
                      projectedleaveCalc(
                        {
                          from_date: new Date(),
                          to_date: input.to_date,
                          year: year,
                          attendance_starts: input["attendance_starts"],
                          at_end_date: input["at_end_date"],
                          employee_id: input.employee_id,
                          leave_id: input.leave_id
                        },
                        _mysql
                      )
                        .then(anualResult => {
                          const max_available_leave =
                            parseFloat(anualResult["predicted_leave_days"]) +
                            parseFloat(currentClosingBal);

                          if (max_available_leave >= calculatedLeaveDays) {
                            let projected_applied_leaves =
                              parseFloat(calculatedLeaveDays) -
                              parseFloat(currentClosingBal);
                            resolve({
                              leave_applied_days: leave_applied_days,
                              calculatedLeaveDays: calculatedLeaveDays,
                              monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                              projected_applied_leaves: projected_applied_leaves,
                              annual_leave: "Y",
                              currentClosingBal: 0,
                              actualClosingBal: currentClosingBal
                            });
                            //next();
                          } else {
                            resolve({
                              invalid_input: true,
                              message: `max available is ${max_available_leave} days, you can't apply for  
                              ${calculatedLeaveDays} days`
                            });
                            // next();
                            // return;
                          }
                        })
                        .catch(e => {
                          _mysql.releaseConnection();
                          console.log("e3", e);
                          req.records = resolve(e);
                          // next();
                          // return;
                        });
                    } else {
                      resolve({
                        invalid_input: true,
                        message: `max available is ${currentClosingBal} days, you can't apply for  
                        ${calculatedLeaveDays} days`
                      });
                    }
                  })
                  .catch(e => {
                    next(e);
                  });
              } // dont subtract  week off or holidays fom LeaveApplied Days
              else if (result.length > 0) {
                for (let k = 0; k < dateRange.length; k++) {
                  if (input.from_session == "SH" && k == 0) {
                    if (from_month === to_month && input.to_session == "FH") {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) - parseFloat(1)
                      });
                    } else {
                      leaveDeductionArray.push({
                        month_name: dateRange[k]["month_name"],
                        finalLeave:
                          parseFloat(dateRange[k]["leaveDays"]) -
                          parseFloat(0.5)
                      });
                    }
                  } else if (
                    input.to_session == "FH" &&
                    k == dateRange.length - 1
                  ) {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave:
                        parseFloat(dateRange[k]["leaveDays"]) - parseFloat(0.5)
                    });
                  } else {
                    leaveDeductionArray.push({
                      month_name: dateRange[k]["month_name"],
                      finalLeave: parseFloat(dateRange[k]["leaveDays"])
                    });
                  }
                }

                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                //checking if he has enough eligible days
                if (
                  currentClosingBal >= calculatedLeaveDays ||
                  input.cancel == "Y"
                ) {
                  resolve({
                    leave_applied_days: leave_applied_days,
                    calculatedLeaveDays: calculatedLeaveDays,
                    monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                  });
                } else if (
                  currentClosingBal < calculatedLeaveDays &&
                  annual_leave == "Y"
                ) {
                  projectedleaveCalc(
                    {
                      from_date: new Date(),
                      to_date: input.to_date,
                      year: year,
                      attendance_starts: input["attendance_starts"],
                      at_end_date: input["at_end_date"],
                      employee_id: input.employee_id,
                      leave_id: input.leave_id
                    },
                    _mysql
                  )
                    .then(anualResult => {
                      const max_available_leave =
                        parseFloat(anualResult["predicted_leave_days"]) +
                        parseFloat(currentClosingBal);

                      if (max_available_leave >= calculatedLeaveDays) {
                        let projected_applied_leaves =
                          parseFloat(calculatedLeaveDays) -
                          parseFloat(currentClosingBal);
                        resolve({
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          projected_applied_leaves: projected_applied_leaves,
                          annual_leave: "Y",
                          currentClosingBal: 0,
                          actualClosingBal: currentClosingBal
                        });
                        //next();
                      } else {
                        resolve({
                          invalid_input: true,
                          message: `max available is ${max_available_leave} days, you can't apply for  
                          ${calculatedLeaveDays} days`
                        });
                        // next();
                        // return;
                      }
                    })
                    .catch(e => {
                      _mysql.releaseConnection();
                      console.log("e3", e);
                      req.records = resolve(e);
                      // next();
                      // return;
                    });
                } else {
                  utilities.logger().log("FISH: ", "PART");
                  resolve({
                    invalid_input: true,
                    message: `max available is ${max_available_leave} days, you can't apply for  
                          ${calculatedLeaveDays} days`
                  });
                }
              } else {
                // invalid data

                resolve({
                  invalid_input: true,
                  message: `invalid data`
                });
              }
            })
            .catch(e => {
              next(e);
            });
        });
      } else {
        // invalid data

        resolve({
          invalid_input: true,
          message: `invalid data`
        });
      }
    });
  } catch (e) {
    next(e);
  }
}

//created by irfan: to save valid leave Application
function saveF(_mysql, req, next, input, msg) {
  // const utilities = new algaehUtilities();

  _mysql
    .generateRunningNumber({
      modules: ["EMPLOYEE_LEAVE"],
      tableName: "hims_f_app_numgen",
      identity: {
        algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
        hospital_id: req.userIdentity.hospital_id
      }
    })
    .then(numGenLeave => {
      _mysql
        .executeQuery({
          query:
            "select hospital_id from hims_d_employee where hims_d_employee_id=?;",
          values: [input.employee_id],

          printQuery: false
        })
        .then(branch => {
          const hospital_id = branch[0]["hospital_id"];

          _mysql
            .executeQuery({
              query:
                "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,hospital_id,application_date,sub_department_id,leave_id,leave_type,\
            from_date,to_date,actual_to_date,from_leave_session,to_leave_session,total_applied_days,remarks,weekoff_included,holiday_included,\
            weekoff_days,holidays,leave_from,absent_id,is_projected_leave,is_across_year_leave,from_year_applied_days,to_year_applied_days, created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                numGenLeave[0],
                input.employee_id,
                hospital_id,
                new Date(),
                input.sub_department_id,
                input.leave_id,
                input.leave_type,
                input.from_date,
                input.to_date,
                input.to_date,
                input.from_leave_session,
                input.to_leave_session,
                input.total_applied_days,
                input.remarks,
                input.weekoff_included,
                input.holiday_included,
                input.weekoff_days,
                input.holidays,
                input.leave_from,
                input.absent_id,
                input.is_projected_leave,
                input.is_across_year_leave ? input.is_across_year_leave : "N",
                input.from_year_calculatedLeaveDays,
                input.to_year_calculatedLeaveDays,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id,
                new Date(),
                req.userIdentity.algaeh_d_app_user_id
              ],

              printQuery: false
            })
            .then(result => {
              if (input.absent_id > 0) {
                _mysql
                  .executeQuery({
                    query:
                      "update hims_f_absent  set status='CTL' where hims_f_absent_id=?;",
                    values: [input.absent_id]
                  })
                  .then(result2 => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = result2;
                      next();
                    });
                  })
                  .catch(e => {
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
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(error => {
          _mysql.releaseConnection();
          next(error);
        });
    })
    .catch(e => {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    });
}

function projectedleaveCalcNEW(input, _mysql) {
  //let input = req.body;
  //const _mysql = new algaehMysql();
  let mysql = _mysql;

  const from_date = input.from_date;
  const to_date = input.to_date;
  // const year = moment(from_date, "YYYY-MM-DD").format("YYYY");

  const attendance_starts = input.attendance_starts;
  const at_end_date = input.at_end_date;

  const number_of_months_partA = [];
  const year_partA = input.year;
  const number_of_months_partB = [];
  let year_partB = "";

  let date_start = moment(from_date);
  let date_end = moment(to_date);

  // calculating numbers of months to predict annual leave
  //if attendance month from_date and to_date not normal

  return new Promise((resolve, reject) => {
    if (attendance_starts == "PM" && at_end_date > 0) {
      console.log("PM");
      const cur_year_max_date = parseInt(year_partA + "12" + at_end_date);
      const from_date_month_n_date = parseInt(
        moment(from_date, "YYYY-MM-DD").format("YYYYMMDD")
      );
      const to_date_month_n_date = parseInt(
        moment(to_date, "YYYY-MM-DD").format("YYYYMMDD")
      );
      //-----------NEW

      if (
        from_date_month_n_date > cur_year_max_date ||
        to_date_month_n_date > cur_year_max_date
      ) {
        console.log("ACROSS YEAR PROJECTED ");
        let from_month = moment(date_start, "YYYY-MM-DD").format("M");
        let to_month = moment(date_end, "YYYY-MM-DD").format("M");
        let from_day = moment(date_start, "YYYY-MM-DD").format("D");
        let to_day = moment(date_end, "YYYY-MM-DD").format("D");

        if (from_month == to_month) {
          console.log(" SAME MONTH ");
          if (from_day <= at_end_date && to_day > at_end_date) {
            number_of_months_partA.push(from_month);
            number_of_months_partB.push("1");
            year_partB = parseInt(year_partA) + 1;
          } else if (from_day > at_end_date && to_day > at_end_date) {
            number_of_months_partB.push("1");
            year_partB = parseInt(year_partA) + 1;
          }
        } else {
          year_partB = parseInt(year_partA) + 1;
          while (
            moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
            moment(date_start, "YYYY-MM-DD").format("YYYYMM")
          ) {
            let cur_month = 0;
            if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
              if (from_day <= at_end_date) {
                cur_month = parseInt(from_month);

                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              } else if (from_day > at_end_date) {
                cur_month = parseInt(from_month) + parseInt(1);

                if (cur_month > 12) {
                  cur_month = 1;

                  if (number_of_months_partB.indexOf(cur_month) === -1) {
                    number_of_months_partB.push(cur_month);
                  }
                } else {
                  if (number_of_months_partA.indexOf(cur_month) === -1) {
                    number_of_months_partA.push(cur_month);
                  }
                }
              }

              date_start.add(1, "M");
            } else if (
              to_month == moment(date_start, "YYYY-MM-DD").format("M")
            ) {
              if (to_day <= at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                if (number_of_months_partB.indexOf(cur_month) === -1) {
                  number_of_months_partB.push(cur_month);
                }
              } else if (to_day > at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                let runing_year = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("YYYY")
                );
                if (runing_year == year_partA) {
                  if (number_of_months_partA.indexOf(cur_month) === -1) {
                    number_of_months_partA.push(cur_month);
                  }
                } else {
                  if (number_of_months_partB.indexOf(cur_month) === -1) {
                    number_of_months_partB.push(cur_month);
                  }
                }

                cur_month = parseInt(cur_month) + parseInt(1);

                if (cur_month > 12) {
                  cur_month = 1;
                  if (number_of_months_partB.indexOf(cur_month) === -1) {
                    number_of_months_partB.push(cur_month);
                  }
                }
              }
              date_start.add(1, "M");
            } else {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );
              let runing_year = parseInt(
                moment(date_start, "YYYY-MM-DD").format("YYYY")
              );
              if (runing_year == year_partA) {
                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              } else {
                if (number_of_months_partB.indexOf(cur_month) === -1) {
                  number_of_months_partB.push(cur_month);
                }
              }

              date_start.add(1, "M");
            }
          }
        }
      } else {
        console.log(" NORMAL PROJECTED ");
        let from_month = moment(date_start, "YYYY-MM-DD").format("M");
        let to_month = moment(date_end, "YYYY-MM-DD").format("M");
        let from_day = moment(date_start, "YYYY-MM-DD").format("D");
        let to_day = moment(date_end, "YYYY-MM-DD").format("D");

        if (from_month == to_month) {
          if (from_day <= at_end_date && to_day <= at_end_date) {
            number_of_months_partA.push(parseInt(from_month));
          } else if (from_day <= at_end_date && to_day > at_end_date) {
            number_of_months_partA.push(
              from_month,
              parseInt(from_month) + parseInt(1)
            );
          } else if (from_day > at_end_date && to_day > at_end_date) {
            number_of_months_partA.push(parseInt(from_month) + parseInt(1));
          }
        } else if (from_month < to_month) {
          while (
            moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
            moment(date_start, "YYYY-MM-DD").format("YYYYMM")
          ) {
            let cur_month = 0;
            if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
              if (from_day <= at_end_date) {
                cur_month = parseInt(from_month);

                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              } else if (from_day > at_end_date) {
                cur_month = parseInt(from_month) + parseInt(1);
                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              }

              date_start.add(1, "M");
            } else if (
              to_month == moment(date_start, "YYYY-MM-DD").format("M")
            ) {
              if (to_day <= at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              } else if (to_day > at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }

                cur_month = parseInt(cur_month) + parseInt(1);

                if (number_of_months_partA.indexOf(cur_month) === -1) {
                  number_of_months_partA.push(cur_month);
                }
              }
              date_start.add(1, "M");
            } else {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );

              if (number_of_months_partA.indexOf(cur_month) === -1) {
                number_of_months_partA.push(cur_month);
              }
              date_start.add(1, "M");
            }
          }
        }
      }
      //-----------NEW
    } else {
      //if attendance month from_date and to_date are normal
      console.log("AM");
      let from_month = moment(date_start, "YYYY-MM-DD").format("M");
      let to_month = moment(date_end, "YYYY-MM-DD").format("M");

      if (from_month == to_month) {
        if (number_of_months_partA.indexOf(from_month) === -1) {
          number_of_months_partA.push(from_month);
        }
      } else if (parseInt(from_month) < parseInt(to_month)) {
        while (
          moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
          moment(date_start, "YYYY-MM-DD").format("YYYYMM")
        ) {
          let cur_month = 0;

          if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            cur_month = parseInt(from_month);

            if (number_of_months_partA.indexOf(cur_month) === -1) {
              number_of_months_partA.push(cur_month);
            }
            date_start.add(1, "M");
          } else if (to_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            cur_month = parseInt(to_month);
            if (number_of_months_partA.indexOf(cur_month) === -1) {
              number_of_months_partA.push(cur_month);
            }
            date_start.add(1, "M");
          } else {
            cur_month = parseInt(moment(date_start, "YYYY-MM-DD").format("M"));

            if (number_of_months_partA.indexOf(cur_month) === -1) {
              number_of_months_partA.push(cur_month);
            }
            date_start.add(1, "M");
          }
        }
      }
    }

    let strQry = "";
    if (number_of_months_partA.length > 0) {
      strQry += ` (month in (${number_of_months_partA}) and year=${year_partA}) `;
    }

    if (number_of_months_partB.length > 0) {
      strQry += `|| (month in (${number_of_months_partB}) and year=${year_partB}) `;
    }

    mysql
      .executeQuery({
        query: `select hims_f_salary_id,month,year,employee_id\
            from hims_f_salary where employee_id=? and ( ${strQry} ) and salary_processed='Y' group by month;\
            select hims_d_employee_id,coalesce(monthly_accrual_days,0) monthly_accrual_days  from hims_d_employee E left join \
            hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \
            where  E.hims_d_employee_id=? limit 1 ; \
            select hims_f_employee_monthly_leave_id,projected_applied_leaves,close_balance from\
            hims_f_employee_monthly_leave where employee_id=? and leave_id=? and processed='N' and \
            year in (?) ;    `,
        values: [
          input.employee_id,

          input.employee_id,
          input.employee_id,
          input.leave_id,
          [year_partA, year_partB]
        ],
        printQuery: false
      })
      .then(result => {
        // mysql.releaseConnection();

        if (result[2].length > 0) {
          if (
            !parseFloat(result[2][0]["projected_applied_leaves"]) >
            parseFloat(0)
          ) {
            const salary_to_be_months =
              number_of_months_partA.length - result[0].length;
            const monthly_accrual_days = result[1][0]["monthly_accrual_days"];

            const predicted_leave_days =
              parseFloat(salary_to_be_months) *
              parseFloat(monthly_accrual_days);

            resolve({ predicted_leave_days });
          } else {
            reject({
              invalid_input: true,
              message: "You already availed projected leaves"
            });
          }
        } else {
          reject({
            invalid_input: true,
            message: "You dont have this leave"
          });
        }
      })
      .catch(e => {
        console.log("e:", e);
        next(e);
      });
  });
}
function projectedleaveCalc_BEFORE_ACROSS(input, _mysql) {
  //let input = req.body;
  //const _mysql = new algaehMysql();
  let mysql = _mysql;

  const from_date = input.from_date;
  const to_date = input.to_date;
  // const year = moment(from_date, "YYYY-MM-DD").format("YYYY");

  const attendance_starts = input.attendance_starts;
  const at_end_date = input.at_end_date;

  const number_of_months = [];
  let date_start = moment(from_date);
  let date_end = moment(to_date);

  // calculating numbers of months to predict annual leave
  //if attendance month from_date and to_date not normal

  return new Promise((resolve, reject) => {
    if (attendance_starts == "PM" && at_end_date > 0) {
      console.log("PM");
      let from_month = moment(date_start, "YYYY-MM-DD").format("M");
      let to_month = moment(date_end, "YYYY-MM-DD").format("M");
      let from_day = moment(date_start, "YYYY-MM-DD").format("D");
      let to_day = moment(date_end, "YYYY-MM-DD").format("D");

      if (from_month == to_month) {
        if (from_day <= at_end_date && to_day <= at_end_date) {
          number_of_months.push(parseInt(from_month));
        } else if (from_day <= at_end_date && to_day > at_end_date) {
          number_of_months.push(from_month, parseInt(from_month) + parseInt(1));
        } else if (from_day > at_end_date && to_day > at_end_date) {
          number_of_months.push(parseInt(from_month) + parseInt(1));
        }
      } else if (from_month < to_month) {
        while (
          moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
          moment(date_start, "YYYY-MM-DD").format("YYYYMM")
        ) {
          let cur_month = 0;
          if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            if (from_day <= at_end_date) {
              cur_month = parseInt(from_month);

              if (number_of_months.indexOf(cur_month) === -1) {
                number_of_months.push(cur_month);
              }
            } else if (from_day > at_end_date) {
              cur_month = parseInt(from_month) + parseInt(1);
              if (number_of_months.indexOf(cur_month) === -1) {
                number_of_months.push(cur_month);
              }
            }

            date_start.add(1, "M");
          } else if (to_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            if (to_day <= at_end_date) {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );

              if (number_of_months.indexOf(cur_month) === -1) {
                number_of_months.push(cur_month);
              }
            } else if (to_day > at_end_date) {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );

              if (number_of_months.indexOf(cur_month) === -1) {
                number_of_months.push(cur_month);
              }

              cur_month = parseInt(cur_month) + parseInt(1);

              if (number_of_months.indexOf(cur_month) === -1) {
                number_of_months.push(cur_month);
              }
            }
            date_start.add(1, "M");
          } else {
            cur_month = parseInt(moment(date_start, "YYYY-MM-DD").format("M"));

            if (number_of_months.indexOf(cur_month) === -1) {
              number_of_months.push(cur_month);
            }
            date_start.add(1, "M");
          }
        }
      }
    } else {
      //if attendance month from_date and to_date are normal
      console.log("AM");
      let from_month = moment(date_start, "YYYY-MM-DD").format("M");
      let to_month = moment(date_end, "YYYY-MM-DD").format("M");

      if (from_month == to_month) {
        if (number_of_months.indexOf(from_month) === -1) {
          number_of_months.push(from_month);
        }
      } else if (parseInt(from_month) < parseInt(to_month)) {
        while (
          moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
          moment(date_start, "YYYY-MM-DD").format("YYYYMM")
        ) {
          let cur_month = 0;

          if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            cur_month = parseInt(from_month);

            if (number_of_months.indexOf(cur_month) === -1) {
              number_of_months.push(cur_month);
            }
            date_start.add(1, "M");
          } else if (to_month == moment(date_start, "YYYY-MM-DD").format("M")) {
            cur_month = parseInt(to_month);
            if (number_of_months.indexOf(cur_month) === -1) {
              number_of_months.push(cur_month);
            }
            date_start.add(1, "M");
          } else {
            cur_month = parseInt(moment(date_start, "YYYY-MM-DD").format("M"));

            if (number_of_months.indexOf(cur_month) === -1) {
              number_of_months.push(cur_month);
            }
            date_start.add(1, "M");
          }
        }
      }
    }

    mysql
      .executeQuery({
        query:
          "select hims_f_salary_id,month,year,employee_id\
          from hims_f_salary where employee_id=? and month in (?) and year=? and salary_processed='Y' group by month;\
          select hims_d_employee_id,coalesce(monthly_accrual_days,0) monthly_accrual_days  from hims_d_employee E left join \
          hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \
          where  E.hims_d_employee_id=? limit 1 ; \
          select hims_f_employee_monthly_leave_id,projected_applied_leaves,close_balance from\
          hims_f_employee_monthly_leave where employee_id=? and leave_id=? and \
          year=?;    ",
        values: [
          input.employee_id,
          number_of_months,
          input.year,
          input.employee_id,
          input.employee_id,
          input.leave_id,
          input.year
        ],
        printQuery: false
      })
      .then(result => {
        // mysql.releaseConnection();

        if (result[2].length > 0) {
          if (
            !parseFloat(result[2][0]["projected_applied_leaves"]) >
            parseFloat(0)
          ) {
            const salary_to_be_months =
              number_of_months.length - result[0].length;
            const monthly_accrual_days = result[1][0]["monthly_accrual_days"];

            const predicted_leave_days =
              parseFloat(salary_to_be_months) *
              parseFloat(monthly_accrual_days);

            resolve({ predicted_leave_days });
            // next();
          } else {
            reject({
              invalid_input: true,
              message: "You already availed projected leaves"
            });

            // req.records = {
            //   invalid_input: true,
            //   message: "You already availed projected leaves"
            // };
            // next();
          }
        } else {
          // req.records = {
          //   invalid_input: true,
          //   message: "You dont have this leave"
          // };
          // next();

          reject({
            invalid_input: true,
            message: "You dont have this leave"
          });
        }
      })
      .catch(e => {
        console.log("e:", e);
        next(e);
      });
  });
}
function projectedleaveCalc(input, _mysql) {
  try {
    //let input = req.body;
    //const _mysql = new algaehMysql();
    let mysql = _mysql;

    const from_date = input.from_date;
    const to_date = input.to_date;
    // const year = moment(from_date, "YYYY-MM-DD").format("YYYY");

    const attendance_starts = input.attendance_starts;
    const at_end_date = input.at_end_date;

    const number_of_months = [];
    const temp_number_of_months = [];
    let date_start = moment(from_date);
    let date_end = moment(to_date);

    // calculating numbers of months to predict annual leave
    //if attendance month from_date and to_date not normal

    let year = input.year;

    return new Promise((resolve, reject) => {

    if(moment( date_end, "YYYY-MM-DD").format("YYYYMMDD")>=moment(date_start, "YYYY-MM-DD").format("YYYYMMDD")){
      if (attendance_starts == "PM" && at_end_date > 0) {
        console.log("PM");

        let from_month = moment(date_start, "YYYY-MM-DD").format("M");
        let to_month = moment(date_end, "YYYY-MM-DD").format("M");
        let from_day = moment(date_start, "YYYY-MM-DD").format("D");
        let to_day = moment(date_end, "YYYY-MM-DD").format("D");
        if (from_month == to_month) {
    
          let cur_month = "";
          if (from_day <= at_end_date && to_day <= at_end_date) {
           
            temp_number_of_months.push(parseInt(from_month));
          } else if (from_day <= at_end_date && to_day > at_end_date) {
            
            temp_number_of_months.push(from_month);
            cur_month = parseInt(from_month) + parseInt(1);

            if (cur_month > 12) {
              cur_month = 1;
            }
            temp_number_of_months.push(cur_month);
          } else if (from_day > at_end_date && to_day > at_end_date) {            
            cur_month = parseInt(from_month) + parseInt(1);

            if (cur_month > 12) {
              cur_month = 1;
            }
            temp_number_of_months.push(cur_month);
          }
        } else {
          while (
            moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
            moment(date_start, "YYYY-MM-DD").format("YYYYMM")
          ) {
            let cur_month = 0;
            if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
              if (from_day <= at_end_date) {
                cur_month = parseInt(from_month);

                if (cur_month > 12) {
                  cur_month = 1;

                  temp_number_of_months.push(cur_month);
                } else {
                  temp_number_of_months.push(cur_month);
                }
              } else if (from_day > at_end_date) {
                cur_month = parseInt(from_month) + parseInt(1);
                if (cur_month > 12) {
                  cur_month = 1;

                  temp_number_of_months.push(cur_month);
                } else {
                  temp_number_of_months.push(cur_month);
                }
              }

              date_start.add(1, "M");
            } else if (
              to_month == moment(date_start, "YYYY-MM-DD").format("M")
            ) {
              if (to_day <= at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                if (cur_month > 12) {
                  cur_month = 1;

                  temp_number_of_months.push(cur_month);
                } else {
                  temp_number_of_months.push(cur_month);
                }
              } else if (to_day > at_end_date) {
                cur_month = parseInt(
                  moment(date_start, "YYYY-MM-DD").format("M")
                );

                if (cur_month > 12) {
                  cur_month = 1;

                  temp_number_of_months.push(cur_month);
                } else {
                  temp_number_of_months.push(cur_month);
                }

                cur_month = parseInt(cur_month) + parseInt(1);

                if (cur_month > 12) {
                  cur_month = 1;

                  temp_number_of_months.push(cur_month);
                } else {
                  temp_number_of_months.push(cur_month);
                }
              }
              date_start.add(1, "M");
            } else {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );

              if (cur_month > 12) {
                cur_month = 1;

                temp_number_of_months.push(cur_month);
              } else {
                temp_number_of_months.push(cur_month);
              }

              date_start.add(1, "M");
            }
          }
        }
      } else {
        //if attendance month from_date and to_date are normal
        console.log("AM");
        let from_month = moment(date_start, "YYYY-MM-DD").format("M");
        let to_month = moment(date_end, "YYYY-MM-DD").format("M");

        if (from_month == to_month) {
          if (temp_number_of_months.indexOf(from_month) === -1) {
            temp_number_of_months.push(from_month);
          }
        } else if (parseInt(from_month) < parseInt(to_month)) {
          while (
            moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
            moment(date_start, "YYYY-MM-DD").format("YYYYMM")
          ) {
            let cur_month = 0;

            if (from_month == moment(date_start, "YYYY-MM-DD").format("M")) {
              cur_month = parseInt(from_month);

              if (temp_number_of_months.indexOf(cur_month) === -1) {
                temp_number_of_months.push(cur_month);
              }
              date_start.add(1, "M");
            } else if (
              to_month == moment(date_start, "YYYY-MM-DD").format("M")
            ) {
              cur_month = parseInt(to_month);
              if (temp_number_of_months.indexOf(cur_month) === -1) {
                temp_number_of_months.push(cur_month);
              }
              date_start.add(1, "M");
            } else {
              cur_month = parseInt(
                moment(date_start, "YYYY-MM-DD").format("M")
              );

              if (temp_number_of_months.indexOf(cur_month) === -1) {
                temp_number_of_months.push(cur_month);
              }
              date_start.add(1, "M");
            }
          }
        }
      }
     
      temp_number_of_months.forEach(item => {
        if (number_of_months.indexOf(item) === -1) {
          number_of_months.push(item);
        }
      });

      mysql
        .executeQuery({
          query:
            "select hims_f_salary_id,month,year,employee_id\
            from hims_f_salary where employee_id=? and month in (?) and year=? and salary_processed='Y' group by month;\
            select hims_d_employee_id,coalesce(monthly_accrual_days,0) monthly_accrual_days  from hims_d_employee E left join \
            hims_d_employee_group EG on E.employee_group_id=EG.hims_d_employee_group_id \
            where  E.hims_d_employee_id=? limit 1 ; \
            select hims_f_employee_monthly_leave_id,projected_applied_leaves,close_balance from\
            hims_f_employee_monthly_leave where employee_id=? and leave_id=? and \
            year=?;    ",
          values: [
            input.employee_id,
            number_of_months,
            year,
            input.employee_id,
            input.employee_id,
            input.leave_id,
            year
          ],
          printQuery: true
        })
        .then(result => {
          // mysql.releaseConnection();

          if (result[2].length > 0) {
            if (
              !parseFloat(result[2][0]["projected_applied_leaves"]) >
              parseFloat(0)
            ) {
              const salary_to_be_months =
                number_of_months.length - result[0].length;
              const monthly_accrual_days = result[1][0]["monthly_accrual_days"];

              const predicted_leave_days =
                parseFloat(salary_to_be_months) *
                parseFloat(monthly_accrual_days);

              resolve({
                predicted_leave_days: predicted_leave_days,
                monthly_accrual_days: monthly_accrual_days
              });
              // next();
            } else {
              reject({
                invalid_input: true,
                message: "You already availed projected leaves"
              });

           
            }
          } else {
           
            reject({
              invalid_input: true,
              message: "You dont have this leave"
            });
          }
        })
        .catch(e => {
          console.log("e:", e);
          next(e);
        });
      }else{
        reject({
          invalid_input: true,
          message: "can't apply Projected leaves for Past Dates"
        });

      }
    });
  } catch (e) {
    reject(e);
  }
}

function yearlyLeaveProcess(inputs, req, mysql) {
  console.log("INSIDE YEARLY PROCESS");
  return new Promise((resolve, reject) => {
    let input = inputs;
    let _mysql = mysql;
    if (input.year > 0) {
      // const _mysql = new algaehMysql();

      let employee = "";
      let leave = "";

      let strQry = "";
      let yearlyEmployee = "";

      if (input.employee_id > 0) {
        yearlyEmployee = ` and employee_id=${input.employee_id} `;
        employee = ` and hims_d_employee_id=${input.employee_id} `;
        strQry += ` and employee_id=${input.employee_id} `;
      }

      if (input.leave_id > 0) {
        leave = ` and  L.hims_d_leave_id=${input.leave_id}`;
        strQry += ` and leave_id=${input.leave_id} `;
      }

      let insertYearlyleave = [];
      let insertMonthlyArray = [];
      let update_old_records = [];

      let deduct_close_Balance = 0;
      if (
        input["deduct_close_Balance"] != undefined &&
        input["deduct_close_Balance"] > 0
      ) {
        deduct_close_Balance = input["deduct_close_Balance"];
      }

      _mysql
        .executeQuery({
          query: `select hims_d_employee_id, employee_code,full_name  as employee_name,religion_id,
            employee_status,date_of_joining,datediff( concat(?,'-12-31'),date_of_joining) as no_days_til_eoy,
            hospital_id,employee_type,sex from hims_d_employee where employee_status <>'I'  
            and hospital_id=? and  record_status='A'  ${employee};          
            select L.hims_d_leave_id,L.leave_code,L.religion_required,L.religion_id,LD.employee_type,
            LD.gender,LD.eligible_days,L.proportionate_leave from hims_d_leave  L 
            inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id 
            and L.record_status='A' ${leave};
            select hims_f_employee_yearly_leave_id,employee_id,year from hims_f_employee_yearly_leave
            where  year=? and hospital_id=? and record_status='A'  ${yearlyEmployee};
            select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from
            hims_f_employee_monthly_leave where   year=? and hospital_id=? ${strQry} ;
            select hims_f_employee_monthly_leave_id,close_balance,employee_id,year,leave_id,leave_carry_forward,
            carry_forward_percentage   from hims_f_employee_monthly_leave ML inner join  hims_d_leave L
            on ML.leave_id=L.hims_d_leave_id
            where   year=? and hospital_id=? and  ML.processed='N' ${strQry};`,
          values: [
            input.year,
            input.hospital_id,
            input.year,
            input.hospital_id,
            input.year,
            input.hospital_id,
            parseInt(input.year) - 1,
            input.hospital_id
          ],
          printQuery: true
        })
        .then(result => {
          const AllEmployees = result[0];
          const AllLeaves = result[1];
          const AllYearlyLeaves = result[2];
          const AllMonthlyLeaves = result[3];
          const prevoius_year_leave = result[4];

          if (AllEmployees.length > 0 && prevoius_year_leave.length>0) {
            for (let i = 0; i < AllEmployees.length; i++) {
              //already proccesed leaves for selected year
              const already_processed_leaves = AllMonthlyLeaves.filter(item => {
                return (
                  item.employee_id == AllEmployees[i]["hims_d_employee_id"]
                );
              });

              // fetch all the fileds of apllicable_leavs
              const apllicable_leavs = AllLeaves.filter(w => {
                return (
                  w.employee_type == AllEmployees[i]["employee_type"] &&
                  (w.gender == AllEmployees[i]["sex"] || w.gender == "BOTH") &&
                  (w.religion_required == "N" ||
                    (w.religion_required == "Y" &&
                      w.religion_id == AllEmployees[i]["religion_id"]))
                );
              })
                .filter(item => {
                  const unique_leave = already_processed_leaves.find(
                    procesd => {
                      return item.hims_d_leave_id == procesd.leave_id;
                    }
                  );

                  return !unique_leave;
                })
                .map(m => {
                  //proportionate leave if date of joining is in between
                  if (
                    m.proportionate_leave == "Y" &&
                    AllEmployees[i]["no_days_til_eoy"] < 365
                  ) {
                    m["eligible_days"] = Math.round(
                      (parseFloat(m.eligible_days) / parseFloat(365)) *
                      parseFloat(AllEmployees[i]["no_days_til_eoy"])
                    );
                  }
                  return m;
                });

              //last year leave carry forwad
              const previous_leave = prevoius_year_leave.filter(item => {
                return (
                  item.employee_id == AllEmployees[i]["hims_d_employee_id"]
                );
              });

              //carry forwar previous year leaves
              const insert_monthly_leave = apllicable_leavs.map(m => {
                let carry_fwd_leav = previous_leave.find(p => {
                  return p.leave_id == m.hims_d_leave_id;
                });

                if (input.from_across_anual_leave == "Y") {
                  const carry_fwd = Math.round(
                    (parseFloat(input.carry_forward) *
                      parseFloat(carry_fwd_leav.carry_forward_percentage)) /
                    parseFloat(100)
                  );

                  update_old_records.push({
                    reduce_close_Balance: deduct_close_Balance,
                    leave_id: carry_fwd_leav.leave_id,
                    employee_id: carry_fwd_leav.employee_id,
                    year: carry_fwd_leav.year,
                    carry_forward_done: "Y",
                    carry_forward_leave: carry_fwd
                  });

                  m["close_balance"] =
                    parseFloat(carry_fwd) + parseFloat(m["eligible_days"]);

                  return {
                    ...m,
                    employee_id: AllEmployees[i]["hims_d_employee_id"],
                    year: input.year,
                    total_eligible: m["eligible_days"],
                    leave_id: m["hims_d_leave_id"]
                  };
                } else {
                  if (
                    carry_fwd_leav != undefined &&
                    carry_fwd_leav.leave_carry_forward == "Y" &&
                    carry_fwd_leav.carry_forward_percentage > 0
                  ) {
                    const oldclosingBal = Math.round(
                      ((parseFloat(carry_fwd_leav.close_balance) -
                        parseFloat(deduct_close_Balance)) *
                        parseFloat(carry_fwd_leav.carry_forward_percentage)) /
                      parseFloat(100)
                    );
                    m["close_balance"] = Math.round(
                      parseFloat(oldclosingBal) + parseFloat(m["eligible_days"])
                    );

                    update_old_records.push({
                      reduce_close_Balance: oldclosingBal,
                      leave_id: carry_fwd_leav.leave_id,
                      employee_id: carry_fwd_leav.employee_id,
                      year: carry_fwd_leav.year,
                      carry_forward_done: "Y",
                      carry_forward_leave: oldclosingBal
                    });
                  } else if (
                    carry_fwd_leav != undefined &&
                    carry_fwd_leav.leave_carry_forward == "N"
                  ) {
                    m["close_balance"] = m["eligible_days"];

                    update_old_records.push({
                      reduce_close_Balance:
                        parseFloat(deduct_close_Balance) + 0,
                      leave_id: carry_fwd_leav.leave_id,
                      employee_id: carry_fwd_leav.employee_id,
                      year: carry_fwd_leav.year,
                      carry_forward_done: "N",
                      carry_forward_leave: 0
                    });
                  }
                  return {
                    ...m,
                    employee_id: AllEmployees[i]["hims_d_employee_id"],
                    year: input.year,
                    total_eligible: m["eligible_days"],
                    leave_id: m["hims_d_leave_id"]
                  };
                }
              });

              insertMonthlyArray.push(...insert_monthly_leave);

              const yearlyLvExist = AllYearlyLeaves.find(w => {
                return (
                  w.employee_id == AllEmployees[i]["hims_d_employee_id"] &&
                  w.year == input.year
                );
              });

              if (!yearlyLvExist) {
                insertYearlyleave.push({
                  employee_id: AllEmployees[i]["hims_d_employee_id"],
                  year: input.year
                });
              }
            }

            if (insertMonthlyArray.length > 0) {
              let updateQry = "";

              //   if(input.from_across_anual_leave=="Y"){

              //     update_old_records.forEach(item => {
              //       updateQry += `update hims_f_employee_monthly_leave set close_balance= close_balance-${item.reduce_close_Balance},processed='Y',carry_forward_done='${item.carry_forward_done}',carry_forward_leave=${item.carry_forward_leave} where year=${item.year} and leave_id=${item.leave_id} and employee_id=${item.employee_id};\n `;
              //     });

              //   }else{

              //   update_old_records.forEach(item => {
              //     updateQry += `update hims_f_employee_monthly_leave set close_balance= close_balance-${item.reduce_close_Balance},processed='Y',carry_forward_done='${item.carry_forward_done}',carry_forward_leave=${item.carry_forward_leave} where year=${item.year} and leave_id=${item.leave_id} and employee_id=${item.employee_id};\n `;
              //   });
              // }

              update_old_records.forEach(item => {
                updateQry += `update hims_f_employee_monthly_leave set close_balance= close_balance-${item.reduce_close_Balance},processed='Y',carry_forward_done='${item.carry_forward_done}',carry_forward_leave=${item.carry_forward_leave} where year=${item.year} and leave_id=${item.leave_id} and employee_id=${item.employee_id};\n `;
              });

              //insertion procces
              new Promise((resolve, reject) => {
                try {
                  if (insertYearlyleave.length > 0) {
                    const insurtColumns = ["employee_id", "year"];

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT  INTO hims_f_employee_yearly_leave(??) VALUES ?",
                        values: insertYearlyleave,
                        includeValues: insurtColumns,
                        extraValues: {
                          created_date: new Date(),
                          updated_date: new Date(),
                          created_by: req.userIdentity.algaeh_d_app_user_id,
                          updated_by: req.userIdentity.algaeh_d_app_user_id,
                          hospital_id: input.hospital_id
                        },
                        bulkInsertOrUpdate: true,
                        printQuery: false
                      })
                      .then(yearResult => {
                        resolve(yearResult);
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          reject(e);
                        });
                      });
                  } else {
                    resolve({});
                  }
                } catch (e) {
                  reject(e);
                }
              }).then(resultofYearInsert => {
                const insurtColumns = [
                  "employee_id",
                  "year",
                  "leave_id",
                  "total_eligible",
                  "close_balance"
                ];

                _mysql
                  .executeQueryWithTransaction({
                    query:
                      " INSERT  INTO hims_f_employee_monthly_leave(??) VALUES ?;" +
                      updateQry,
                    values: insertMonthlyArray,
                    includeValues: insurtColumns,
                    extraValues: {
                      hospital_id: input.hospital_id
                    },
                    bulkInsertOrUpdate: true,
                    printQuery: false
                  })
                  .then(monthResult => {
                    if (updateQry == "") {
                      resolve(monthResult);
                    } else {
                      resolve(monthResult[0]);
                    }
                  })
                  .catch(e => {
                    console.log("e:", e);
                    _mysql.rollBackTransaction(() => {
                      reject(e);
                    });
                  });
              });
            } else {
              // _mysql.releaseConnection();
              // req.records = {
              //   invalid_input: true,
              //   message: "Leave already processed"
              // };
              // next();
              // return;

              reject({
                invalid_input: true,
                message: "Leave already processed"
              });
            }
          } else {
            // _mysql.releaseConnection();
            // req.records = {
            //   invalid_input: true,
            //   message: "No Employees found"
            // };
            // next();
            // return;
        
            reject({
              invalid_input: true,
              message: "No Data found"
            });
          }
        })
        .catch(e => {
          console.log("erorr2:",e)
          reject(e);
        });
    } else {
      reject({
        invalid_input: true,
        message: "Please Provide valid year "
      });
    }
  });
}

function validateLeaveApplictn(inputs, my_sql, req) {
  return new Promise((resolve, reject) => {
    try {
      const utilities = new algaehUtilities();

      let input = inputs;
      let _mysql = my_sql;

      _mysql
        .executeQuery({
          query:
            " select attendance_starts,at_st_date,at_end_date from hims_d_hrms_options limit 1; ",
          printQuery: false
        })
        .then(authResult => {
          input["actual_to_date"] = input.to_date;
          // const actual_from_session = input["from_session"];
          const actual_to_session = input["to_session"];
          let from_year = "";
          let to_year = "";

          const attendance_starts = authResult[0]["attendance_starts"];
          const at_end_date = authResult[0]["at_end_date"];

          input["attendance_starts"] = attendance_starts;
          input["at_end_date"] = at_end_date;
          input["at_st_date"] = authResult[0]["at_st_date"];

          if (attendance_starts == "PM" && at_end_date > 0) {
            const temp_year = moment().format("YYYY");
            const cur_year_max_date = parseInt(temp_year + "12" + at_end_date);
            const from_date_month_n_date = parseInt(
              moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD")
            );
            const to_date_month_n_date = parseInt(
              moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD")
            );

            if (from_date_month_n_date > cur_year_max_date) {
              from_year = parseInt(temp_year) + 1;
            } else {
              from_year = temp_year;
            }

            if (to_date_month_n_date > cur_year_max_date) {
              to_year = parseInt(temp_year) + 1;
            } else {
              to_year = temp_year;
            }
          } else {
            from_year = moment(input.from_date).format("YYYY");
            to_year = moment(input.to_date).format("YYYY");
          }

          input["year"] = from_year;
          //for same year leave
          if (parseInt(from_year) == parseInt(to_year)) {
            console.log("OPTION1:");

            calculateNoLeaveDays(input, _mysql)
              .then(sameYearResult => {
                if (sameYearResult.is_projected_leave == "Y") {
                  const max_available_leave =
                    parseFloat(sameYearResult["predicted_leave_days"]) +
                    parseFloat(sameYearResult["actualClosingBal"]);

                  if (
                    max_available_leave >= sameYearResult.calculatedLeaveDays ||
                    input.cancel == "Y"
                  ) {
                    let projected_applied_leaves =
                      parseFloat(sameYearResult.calculatedLeaveDays) -
                      parseFloat(sameYearResult.actualClosingBal);

                    resolve({
                      ...sameYearResult,
                      from_year: from_year,
                      to_year: to_year,
                      projected_applied_leaves: projected_applied_leaves
                    });
                  } else {
                    reject({
                      invalid_input: true,
                      message: `max available is ${max_available_leave} days, you can't apply for  
              ${sameYearResult.calculatedLeaveDays} days`
                    });
                  }
                } else {
                  resolve({
                    ...sameYearResult,
                    from_year: from_year,
                    to_year: to_year
                  });
                }
              })
              .catch(e => {
                reject(e);
              });
          }
          // for accross the year leave
          else if (parseInt(from_year) == parseInt(to_year) - 1) {
            console.log("OPTION2:");

            let same_year_from_date = "";
            let same_year_to_date = "";

            let next_year_from_date = "";
            let next_year_to_date = "";

            if (attendance_starts == "PM" && at_end_date > 0) {
              console.log("IN PM:");
              same_year_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              same_year_to_date = moment(
                from_year + "-" + 12 + "-" + at_end_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              next_year_from_date = moment(
                from_year +
                "-" +
                12 +
                "-" +
                (parseInt(at_end_date) + parseInt(1)),
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              next_year_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );
            } else {
              console.log("IN AM:");
              same_year_from_date = moment(
                input.from_date,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              same_year_to_date = moment(
                from_year + "-" + 12 + "-" + 31,
                "YYYY-MM-DD"
              ).format("YYYY-MM-DD");
              next_year_from_date = moment(
                to_year + "-" + 1 + "-" + 1,
                "YYYY-M-D"
              ).format("YYYY-MM-DD");
              next_year_to_date = moment(input.to_date, "YYYY-MM-DD").format(
                "YYYY-MM-DD"
              );
            }

            input["from_date"] = same_year_from_date;
            input["to_date"] = same_year_to_date;
            input["to_session"] = "SH";
            input["part"] = "A";

            input["is_across_year_leave"] = "Y";

            //FIRST YEAR CALCULATION
            calculateNoLeaveDays(input, _mysql)
              .then(partA_res => {
                if (
                  partA_res.annual_leave == "Y" &&
                  partA_res.is_projected_leave == "Y"
                ) {
                  const calculatedLeaveDays = partA_res.calculatedLeaveDays;
                  const actualClosingBal = partA_res.actualClosingBal;

                  //------------------

                  const max_available_leave =
                    parseFloat(partA_res["predicted_leave_days"]) +
                    parseFloat(actualClosingBal);

                  input["from_across_anual_leave"] = "Y";

                  if (
                    max_available_leave >= calculatedLeaveDays ||
                    input.cancel == "Y"
                  ) {
                    partA_res["projected_applied_leaves"] =
                      parseFloat(calculatedLeaveDays) -
                      parseFloat(actualClosingBal);
                    input["carry_forward"] =
                      parseFloat(max_available_leave) -
                      parseFloat(calculatedLeaveDays);
                  } else {
                    reject({
                      invalid_input: true,
                      message: `max available is ${max_available_leave} days, you can't apply for  
                  ${calculatedLeaveDays} days`
                    });
                  }
                }

                //----------two
                _mysql
                  .executeQuery({
                    query:
                      "select hospital_id from hims_d_employee where hims_d_employee_id=?;",
                    values: [input.employee_id],

                    printQuery: false
                  })
                  .then(branch => {
                    const hospital_id = branch[0]["hospital_id"];
                    // input["hospital_id"]= branch[0]["hospital_id"];
                    _mysql
                      .executeQuery({
                        query:
                          "select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                        hims_f_employee_monthly_leave where   year=? and employee_id=? and leave_id=?;\
                        select hims_d_holiday_id,holiday_date,holiday_description,weekoff,\
                      holiday,holiday_type,religion_id  from hims_d_holiday  where hospital_id=?\
                        and  date(holiday_date) between DATE_FORMAT(? ,'%Y-01-01')  and DATE_FORMAT(? ,'%Y-12-31');  ",
                        values: [
                          to_year,
                          input.employee_id,
                          input.leave_id,
                          hospital_id,
                          next_year_from_date,
                          next_year_from_date
                        ],

                        printQuery: false
                      })
                      .then(Result => {
                        input["year"] = to_year;
                        if (Result[1].length > 0) {
                          new Promise((resolve, reject) => {
                            if (Result[0].length > 0) {
                              resolve({});
                              //exist, so call calc function
                            } else {
                              //process next year

                              if (input.from_across_anual_leave == "Y") {
                                input["deduct_close_Balance"] = 0;
                              } else {
                                input["deduct_close_Balance"] =
                                  partA_res["calculatedLeaveDays"];
                              }

                              yearlyLeaveProcess(input, req, _mysql)
                                .then(procRes => {
                                  resolve(procRes);
                                })
                                .catch(e => {
                                  _mysql.rollBackTransaction(() => { });
                                  reject(e);
                                });
                            }
                          }).then(leavePresent => {
                            console.log("PART A DONE");

                            input["from_date"] = next_year_from_date;
                            input["to_date"] = next_year_to_date;
                            input["from_session"] = "FH";
                            input["to_session"] = actual_to_session;
                            input["part"] = "B";

                            calculateNoLeaveDays(input, _mysql)
                              .then(partB_res => {
                                const calculatedLeaveDays =
                                  parseFloat(partA_res.calculatedLeaveDays) +
                                  parseFloat(partB_res.calculatedLeaveDays);
                                const leave_applied_days =
                                  parseFloat(partA_res.leave_applied_days) +
                                  parseFloat(partB_res.leave_applied_days);
                                const total_holiday =
                                  parseFloat(partA_res.total_holiday) +
                                  parseFloat(partB_res.total_holiday);
                                const total_weekOff =
                                  parseFloat(partA_res.total_weekOff) +
                                  parseFloat(partB_res.total_weekOff);

                                if (input.from_across_anual_leave == "Y") {
                                  const A_Max =
                                    parseFloat(
                                      partA_res["predicted_leave_days"]
                                    ) +
                                    parseFloat(partA_res["actualClosingBal"]);
                                  const B_Max =
                                    parseFloat(
                                      partB_res["predicted_leave_days"]
                                    ) +
                                    parseFloat(partB_res["actualClosingBal"]);

                                  let partA_projected_applied_leaves = 0;

                                  if (
                                    parseFloat(partA_res.calculatedLeaveDays) -
                                    parseFloat(partA_res.actualClosingBal) >
                                    0
                                  ) {
                                    partA_projected_applied_leaves =
                                      parseFloat(
                                        partA_res.calculatedLeaveDays
                                      ) -
                                      parseFloat(partA_res.actualClosingBal);
                                  }

                                  let partB_projected_applied_leaves = 0;

                                  if (
                                    parseFloat(
                                      partB_res["calculatedLeaveDays"]
                                    ) >
                                    parseFloat(partB_res.actualClosingBal) &&
                                    B_Max >=
                                    parseFloat(partB_res.calculatedLeaveDays)
                                  ) {
                                    partB_projected_applied_leaves =
                                      parseFloat(
                                        partB_res["predicted_leave_days"]
                                      ) -
                                      (parseFloat(B_Max) -
                                        parseFloat(
                                          partB_res.calculatedLeaveDays
                                        ));
                                  }

                                  const projected_applied_leaves =
                                    parseFloat(partA_projected_applied_leaves) +
                                    parseFloat(partB_projected_applied_leaves);

                                  if (
                                    A_Max >= partA_res.calculatedLeaveDays &&
                                    B_Max >= partB_res.calculatedLeaveDays
                                  ) {
                                    resolve({
                                      partA_predicted_leave_days:
                                        partA_res["predicted_leave_days"],
                                      partB_projected_applied_leaves: partB_projected_applied_leaves,
                                      partA_actualClosingBal:
                                        partA_res.actualClosingBal,
                                      partB_actualClosingBal:
                                        partB_res.actualClosingBal,
                                      projected_applied_leaves: projected_applied_leaves,
                                      calculatedLeaveDays: calculatedLeaveDays,
                                      leave_applied_days: leave_applied_days,
                                      include_holidays:
                                        partA_res.include_holidays,
                                      include_week_offs:
                                        partA_res.include_week_offs,
                                      total_holiday: total_holiday,
                                      total_weekOff: total_weekOff,
                                      is_across_year_leave: "Y",
                                      is_projected_leave: "Y",
                                      carry_forward:
                                        input["carry_forward"] > 0
                                          ? input["carry_forward"]
                                          : 0,
                                      from_year_calculatedLeaveDays:
                                        partA_res.calculatedLeaveDays,
                                      to_year_calculatedLeaveDays:
                                        partB_res.calculatedLeaveDays,
                                      partA_monthWise:
                                        partA_res.monthWiseCalculatedLeaveDeduction,
                                      partB_monthWise:
                                        partB_res.monthWiseCalculatedLeaveDeduction,
                                      from_year: from_year,
                                      to_year: to_year
                                    });
                                  } else {
                                    let max_days;
                                    let applying_days;
                                    let calc_year;

                                    if (A_Max < partA_res.calculatedLeaveDays) {
                                      max_days = A_Max;
                                      applying_days =
                                        partA_res.calculatedLeaveDays;
                                      calc_year = from_year;
                                    } else if (
                                      B_Max < partB_res.calculatedLeaveDays
                                    ) {
                                      max_days = B_Max;
                                      applying_days =
                                        partB_res.calculatedLeaveDays;
                                      calc_year = to_year;
                                    }
                                    reject({
                                      invalid_input: true,
                                      message: `max available is ${max_days} days in ${calc_year}, you can't apply for  
                                ${applying_days} days`
                                    });
                                  }
                                } else {
                                  resolve({
                                    calculatedLeaveDays: calculatedLeaveDays,
                                    leave_applied_days: leave_applied_days,
                                    include_holidays:
                                      partA_res.include_holidays,
                                    include_week_offs:
                                      partA_res.include_week_offs,
                                    total_holiday: total_holiday,
                                    total_weekOff: total_weekOff,
                                    is_across_year_leave: "Y",
                                    annual_leave: partA_res.annual_leave,
                                    from_year_calculatedLeaveDays:
                                      partA_res.calculatedLeaveDays,
                                    to_year_calculatedLeaveDays:
                                      partB_res.calculatedLeaveDays,
                                    partA_monthWise:
                                      partA_res.monthWiseCalculatedLeaveDeduction,
                                    partB_monthWise:
                                      partB_res.monthWiseCalculatedLeaveDeduction,
                                    from_year: from_year,
                                    to_year: to_year
                                  });
                                }
                                console.log("PART-B DONE ");
                              })
                              .catch(e => {
                                reject(e);
                              });
                          }). catch(e => {
                            _mysql.rollBackTransaction(() => { });
                            reject(e);
                          });
                        } else {
                          reject({
                            invalid_input: true,
                            message: `Please Notify HR to process weekOff and Holidays for ${to_year}`
                          });
                        }
                      })
                      .catch(e => {
                        console.log("e:", e);
                        _mysql.rollBackTransaction(() => {
                          reject(e);
                        });
                      });
                  })
                  .catch(e => {
                    console.log("e:", e);
                    _mysql.rollBackTransaction(() => {
                      reject(e);
                    });
                  });

                //----------------two
              })
              .catch(e => {
                reject(e);
              });
          } else {
            reject({
              invalid_input: true,
              message: `can't apply leave for this Date range `
            });
          }
        })
        .catch(e => {
          console.log("e79:", e);
          reject(e);
        });
    } catch (e) {
      console.log("e76:", e);
      reject(e);
    }
  });
}

function calculateNoLeaveDays(inputs, _mysql) {
  return new Promise((resolve, reject) => {
    try {
      //let _mysql = mysql;
      const utilities = new algaehUtilities();
      let input = inputs;
      console.log("inside calculateNoLeaveDays:");
      let from_date = moment(input.from_date).format("YYYY-MM-DD");
      let to_date = moment(input.to_date).format("YYYY-MM-DD");
      let leave_applied_days = 0;
      let calculatedLeaveDays = 0;
      let session_diff = 0;
      let my_religion = input.religion_id;

      let year = input.year;

      const attendance_starts = input["attendance_starts"];
      const at_end_date = input["at_end_date"];
      const at_st_date = input["at_st_date"];

      let from_month = "";
      let to_month = "";

      if (attendance_starts == "PM" && at_end_date > 0) {
        if (moment(from_date, "YYYY-MM-DD").format("D") > at_end_date) {
          from_month =
            parseInt(moment(from_date, "YYYY-MM-DD").format("M")) + 1;
        } else {
          from_month = moment(from_date, "YYYY-MM-DD").format("M");
        }

        if (moment(to_date, "YYYY-MM-DD").format("D") > at_end_date) {
          to_month = parseInt(moment(to_date, "YYYY-MM-DD").format("M")) + 1;
        } else {
          to_month = moment(to_date, "YYYY-MM-DD").format("M");
        }
      } else {
        from_month = moment(from_date).format("M");
        to_month = moment(to_date).format("M");
      }

      let dateStart = moment(from_date);
      let dateEnd = moment(to_date);
      let dateRange = [];
      let currentClosingBal = 0;
      let leaveDeductionArray = [];

      let include_week_offs = "Y";
      let no_include_week_offs = 0;
      let include_holidays = "Y";
      let no_include_holidays = 0;

      let allLeaves = [];
      let allHolidays = [];

      let check_from_date = "N";
      let check_to_date = "N";

      let annual_leave = "";

      //ST OF-------calculate Half-day or Full-day from session
      if (input.from_date == input.to_date) {
        if (input.from_session == "FH" && input.to_session == "FH") {
          session_diff += parseFloat(0.5);
        } else if (input.from_session == "SH" && input.to_session == "SH") {
          session_diff += parseFloat(0.5);
        }
      } else {
        if (input.from_session == "SH") {
          session_diff += parseFloat(0.5);
        }
        if (input.to_session == "FH") {
          session_diff += parseFloat(0.5);
        }
      }

      // EN OF---------calculate Half-day or Full-day from session

      //ST---------get month names and start_of_month and end_of_month number of days in a full month
      if (attendance_starts == "PM" && at_end_date > 0) {
        const len = numberOfMonths(at_end_date, dateStart, dateEnd);
        let skip_adding_month = "N";
        console.log("len:", len);
        for (let i = 0; i < len; i++) {
          if (moment(from_date).format("D") > at_end_date) {
            dateStart.add(1, "month");
            skip_adding_month = "Y";
          }
          let copy_of_dateStart = moment(dateStart.valueOf());
          const prev_month = moment(copy_of_dateStart).add(-1, "month");

          const startOfMonth =
            moment(prev_month, "YYYY-MM-DD").format("YYYY-MM") +
            "-" +
            at_st_date;
          const endOfMonth =
            moment(dateStart, "YYYY-MM-DD").format("YYYY-MM") +
            "-" +
            at_end_date;

          const numberOfDays =
            moment(endOfMonth, "YYYY-MM-DD").diff(
              moment(startOfMonth, "YYYY-MM-DD"),
              "days"
            ) + 1;

          dateRange.push({
            month_name: dateStart.format("MMMM"),
            startOfMonth: startOfMonth,
            endOfMonth: endOfMonth,
            numberOfDays: numberOfDays
          });

          if (skip_adding_month == "N") dateStart.add(1, "month");
        }
      } else {
        while (
          dateEnd > dateStart ||
          dateStart.format("M") === dateEnd.format("M")
        ) {
          dateRange.push({
            month_name: dateStart.format("MMMM"),
            startOfMonth: moment(dateStart)
              .startOf("month")
              .format("YYYY-MM-DD"),
            endOfMonth: moment(dateStart)
              .endOf("month")
              .format("YYYY-MM-DD"),

            numberOfDays: moment(dateStart).daysInMonth()
          });
          dateStart.add(1, "month");
        }
      }

      //END OF---------get month names and start_of_month and end_of_month number of days in a full month

      //ST------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      if (dateRange.length > 1) {
        for (let i = 0; i < dateRange.length; i++) {
          if (i == 0) {
            let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
            let start = moment(from_date).format("YYYY-MM-DD");

            leave_applied_days +=
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1;
            extend(dateRange[i], {
              begning_of_leave: start,
              end_of_leave: end,
              leaveDays:
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1
            });
          } else if (i == dateRange.length - 1) {
            let start = moment(dateRange[i]["startOfMonth"]).format(
              "YYYY-MM-DD"
            );
            let end = moment(to_date).format("YYYY-MM-DD");

            leave_applied_days +=
              moment(end, "YYYY-MM-DD").diff(
                moment(start, "YYYY-MM-DD"),
                "days"
              ) + 1;

            extend(dateRange[i], {
              begning_of_leave: start,
              end_of_leave: end,
              leaveDays:
                moment(end, "YYYY-MM-DD").diff(
                  moment(start, "YYYY-MM-DD"),
                  "days"
                ) + 1
            });
          } else {
            leave_applied_days += dateRange[i]["numberOfDays"];

            extend(dateRange[i], {
              begning_of_leave: dateRange[i]["startOfMonth"],
              end_of_leave: dateRange[i]["endOfMonth"],
              leaveDays: dateRange[i]["numberOfDays"]
            });
          }
        }

        calculatedLeaveDays = leave_applied_days;
      } else if (dateRange.length == 1) {
        let end = moment(to_date).format("YYYY-MM-DD");
        let start = moment(from_date).format("YYYY-MM-DD");

        leave_applied_days +=
          moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") +
          1;
        extend(dateRange[0], {
          begning_of_leave: start,
          end_of_leave: end,
          leaveDays:
            moment(end, "YYYY-MM-DD").diff(
              moment(start, "YYYY-MM-DD"),
              "days"
            ) + 1
        });

        calculatedLeaveDays = leave_applied_days;
      }
      //EN OF------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range

      //ST --- SKIP HOLIDAYS ON 2019-12-31 and 2020-01-01 if these days in between leave days

      if (input.part != undefined && input.part == "A") {
        if (from_date == to_date) check_to_date = "Y";
        else check_from_date = "Y";
      } else if (input.part != undefined && input.part == "B") {
        if (from_date == to_date) check_from_date = "Y";
        else check_to_date = "Y";
      }
      //EN --- SKIP HOLIDAYS ON 2019-12-31 and 2020-01-01 if these days in between leave days

      _mysql
        .executeQuery({
          query:
            "select hospital_id from hims_d_employee where hims_d_employee_id=?;\
              SELECT attendance_starts,at_end_date FROM hims_d_hrms_options limit 1;",
          values: [input.employee_id],

          printQuery: false
        })
        .then(branch => {
          const hospital_id = branch[0][0]["hospital_id"];

          _mysql
            .executeQuery({
              query:
                "select hims_f_employee_monthly_leave_id, total_eligible,close_balance,processed, availed_till_date,\
            leave_id,L.leave_description,L.leave_category,L.avail_if_no_balance,include_weekoff,include_holiday from hims_f_employee_monthly_leave ML\
            inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id where employee_id=? and year=? and\
            leave_id=? and L.record_status='A';select hims_d_holiday_id,holiday_date,holiday_description,weekoff,\
            holiday,holiday_type,religion_id  from hims_d_holiday  where hospital_id=? and  date(holiday_date) between date(?) and date(?);\
            select hims_f_salary_id from hims_f_salary where employee_id=? and \
            year=? and month=? and hospital_id=? and salary_processed='Y'; ",
              values: [
                input.employee_id,
                year,
                input.leave_id,
                hospital_id,
                from_date,
                to_date,
                input.employee_id,
                year,
                from_month,
                hospital_id

              ],

              printQuery: false
            })
            .then(result => {
              allLeaves = result[0];
              allHolidays = result[1];

              if (allLeaves.length > 0) {
                if (
                  allLeaves[0].leave_category == "A" &&
                  allLeaves[0].avail_if_no_balance == "Y"
                ) {
                  annual_leave = "Y";
                }

                if (result[2].length>0&&annual_leave=="Y"){

                  _mysql.releaseConnection();
                  reject({
                    invalid_input: true,
                    message: `Salary is processed for this month can't apply Annual leave`
                  });
                }
                else {
                if (
                  allLeaves[0].processed == "Y" &&
                  input["part"] != "B" &&
                  input["from_athurization"] != "Y" &&
                  input["cancel"] != "Y"
                ) {
                  _mysql.releaseConnection();

                  reject({
                    invalid_input: true,
                    message: `Year ${year} leave has been closed, Apply from Year ${parseInt(
                      year
                    ) + 1}`
                  });
                } else {
                  currentClosingBal = allLeaves[0].close_balance;
                  let isHoliday = [];

                  if (check_to_date == "Y") {
                    isHoliday = new LINQ(allHolidays)
                      .Where(
                        w =>
                          (w.holiday_date == to_date && w.weekoff == "Y") ||
                          (w.holiday_date == to_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RE") ||
                          (w.holiday_date == to_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion)
                      )
                      .Select(s => {
                        return {
                          holiday_date: s.holiday_date,
                          holiday_description: s.holiday_description
                        };
                      })
                      .ToArray();
                  } else if (check_from_date == "Y") {
                    isHoliday = new LINQ(allHolidays)
                      .Where(
                        w =>
                          (w.holiday_date == from_date && w.weekoff == "Y") ||
                          (w.holiday_date == from_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RE") ||
                          (w.holiday_date == from_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion)
                      )
                      .Select(s => {
                        return {
                          holiday_date: s.holiday_date,
                          holiday_description: s.holiday_description
                        };
                      })
                      .ToArray();
                  } else {
                    isHoliday = new LINQ(allHolidays)
                      .Where(
                        w =>
                          (w.holiday_date == from_date && w.weekoff == "Y") ||
                          (w.holiday_date == from_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RE") ||
                          (w.holiday_date == from_date &&
                            w.holiday == "Y" &&
                            w.holiday_type == "RS" &&
                            w.religion_id == my_religion) ||
                          ((w.holiday_date == to_date && w.weekoff == "Y") ||
                            (w.holiday_date == to_date &&
                              w.holiday == "Y" &&
                              w.holiday_type == "RE") ||
                            (w.holiday_date == to_date &&
                              w.holiday == "Y" &&
                              w.holiday_type == "RS" &&
                              w.religion_id == my_religion))
                      )
                      .Select(s => {
                        return {
                          holiday_date: s.holiday_date,
                          holiday_description: s.holiday_description
                        };
                      })
                      .ToArray();
                  }

                  //s -------START OF--- get count of holidays and weekOffs betwen apllied leave range
                  let week_off_Data = new LINQ(allHolidays)
                    .Select(s => {
                      return {
                        hims_d_holiday_id: s.hims_d_holiday_id,
                        holiday_date: s.holiday_date,
                        holiday_description: s.holiday_description,
                        holiday: s.holiday,
                        weekoff: s.weekoff,
                        holiday_type: s.holiday_type,
                        religion_id: s.religion_id
                      };
                    })
                    .Where(w => w.weekoff == "Y")
                    .ToArray();
                  let total_weekOff = week_off_Data.length;

                  let holiday_Data = new LINQ(allHolidays)
                    .Select(s => {
                      return {
                        hims_d_holiday_id: s.hims_d_holiday_id,
                        holiday_date: s.holiday_date,
                        holiday_description: s.holiday_description,
                        holiday: s.holiday,
                        weekoff: s.weekoff,
                        holiday_type: s.holiday_type,
                        religion_id: s.religion_id
                      };
                    })
                    .Where(
                      w =>
                        (w.holiday == "Y" && w.holiday_type == "RE") ||
                        (w.holiday == "Y" &&
                          w.holiday_type == "RS" &&
                          w.religion_id == my_religion)
                    )
                    .ToArray();

                  let total_holiday = holiday_Data.length;
                  // -------END OF--- get count of holidays and weekOffs betwen apllied leave range

                  if (isHoliday.length > 0) {
                    _mysql.releaseConnection();
                    // req.records = {
                    //   invalid_input: true,
                    //   message: `you can't apply leave on , ${isHoliday[0].holiday_date} is :( ${isHoliday[0].holiday_description} )`
                    // };
                    // next();
                    // return;
                    reject({
                      invalid_input: true,
                      message: `you can't apply leave on , ${isHoliday[0].holiday_date} is :( ${isHoliday[0].holiday_description} )`
                    });
                  } else {
                    // subtracting  week off or holidays fom LeaveApplied Days
                    if (
                      allLeaves[0].include_weekoff == "N" ||
                      allLeaves[0].include_holiday == "N"
                    ) {
                      let total_minus = 0;
                      for (let k = 0; k < dateRange.length; k++) {
                        let reduce_days = parseFloat(0);

                        //step 1 -------START OF------ getting total week offs and holidays to be subtracted from each month

                        //calculating holidays to remove from each month
                        if (allLeaves[0].include_holiday == "N") {
                          reduce_days += parseFloat(
                            new LINQ(holiday_Data)
                              .Where(
                                w =>
                                  dateRange[k]["begning_of_leave"] <=
                                  w.holiday_date &&
                                  w.holiday_date <= dateRange[k]["end_of_leave"]
                              )
                              .Count()
                          );
                        }

                        //calculating week off to remove from each month
                        if (allLeaves[0].include_weekoff == "N") {
                          reduce_days += parseFloat(
                            new LINQ(week_off_Data)
                              .Where(
                                w =>
                                  dateRange[k]["begning_of_leave"] <=
                                  w.holiday_date &&
                                  w.holiday_date <= dateRange[k]["end_of_leave"]
                              )
                              .Count()
                          );
                        }

                        //-------END OF------ getting total week offs and holidays to be subtracted from each month

                        //step 2-------START OF------ session belongs to which month and  subtract session from that month----------
                        if (input.from_session == "SH" && k == 0) {
                          if (
                            from_month === to_month &&
                            input.to_session == "FH"
                          ) {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(reduce_days) -
                                parseFloat(1)
                            });
                          } else {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(reduce_days) -
                                parseFloat(0.5)
                            });
                          }
                        } else if (
                          input.to_session == "FH" &&
                          k == dateRange.length - 1
                        ) {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days) -
                              parseFloat(0.5)
                          });
                        } else {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(reduce_days)
                          });
                        }
                        //------- END OF----session belongs to which month and  subtract session from that month----------
                        total_minus += parseFloat(reduce_days);
                      }

                      //step3-------START OF------ finally  subtracting week off and holidays from total Applied days

                      if (allLeaves[0].include_weekoff == "N") {
                        include_week_offs = "N";
                        calculatedLeaveDays =
                          parseFloat(calculatedLeaveDays) -
                          parseFloat(total_weekOff);
                      }

                      if (allLeaves[0].include_holiday == "N") {
                        include_holidays = "N";
                        calculatedLeaveDays =
                          parseFloat(calculatedLeaveDays) -
                          parseFloat(total_holiday);
                      }

                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(session_diff);

                      //-------END OF------ finally  subtracting week off and holidays from total Applied days

                      if (
                        input.cancel != "Y" &&
                        ((currentClosingBal < calculatedLeaveDays &&
                          annual_leave == "Y") ||
                          (annual_leave == "Y" &&
                            input.is_across_year_leave == "Y"))
                      ) {
                        let Pr_from_date = "";
                        let Pr_to_date = "";

                        if (input.part == "A") {
                          Pr_from_date = new Date();
                          Pr_to_date = input.to_date;
                        } else if (input.part == "B") {
                          Pr_from_date = input.from_date;
                          Pr_to_date = input.to_date;
                        } else {
                          Pr_from_date = new Date();
                          Pr_to_date = input.to_date;
                        }

                        projectedleaveCalc(
                          {
                            from_date: Pr_from_date,
                            to_date: Pr_to_date,
                            year: year,
                            attendance_starts:
                              branch[1][0]["attendance_starts"],
                            at_end_date: branch[1][0]["at_end_date"],
                            employee_id: input.employee_id,
                            leave_id: input.leave_id
                          },
                          _mysql
                        )
                          .then(anualResult => {
                            resolve({
                              ...anualResult,
                              leave_applied_days: leave_applied_days,
                              calculatedLeaveDays: calculatedLeaveDays,
                              monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                              include_holidays: include_holidays,
                              total_holiday: total_holiday,
                              include_week_offs: include_week_offs,
                              total_weekOff: total_weekOff,

                              annual_leave: "Y",
                              is_projected_leave: "Y",
                              currentClosingBal: 0,
                              actualClosingBal: currentClosingBal
                            });
                          })
                          .catch(e => {
                            console.log("e**:", e);
                            _mysql.releaseConnection();
                            reject(e);
                          });
                      } else if (
                        currentClosingBal >= calculatedLeaveDays ||
                        (input.cancel == "Y" && input.is_projected_leave != "Y")
                      ) {
                        // _mysql.releaseConnection();
                        resolve({
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff
                        });
                        // next();
                        // return;
                      } else if (
                        input.cancel == "Y" &&
                        input.is_projected_leave == "Y"
                      ) {
                        resolve({
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff,
                          annual_leave: annual_leave
                        });
                      } else {
                        _mysql.releaseConnection();
                        reject({
                          invalid_input: true,
                          message: `max available is ${currentClosingBal} days, you can't apply for  
                        ${calculatedLeaveDays} days`
                        });
                      }
                    } else {
                      for (let k = 0; k < dateRange.length; k++) {
                        if (input.from_session == "SH" && k == 0) {
                          if (
                            from_month === to_month &&
                            input.to_session == "FH"
                          ) {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(1)
                            });
                          } else {
                            leaveDeductionArray.push({
                              month_name: dateRange[k]["month_name"],
                              finalLeave:
                                parseFloat(dateRange[k]["leaveDays"]) -
                                parseFloat(0.5)
                            });
                          }
                        } else if (
                          input.to_session == "FH" &&
                          k == dateRange.length - 1
                        ) {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave:
                              parseFloat(dateRange[k]["leaveDays"]) -
                              parseFloat(0.5)
                          });
                        } else {
                          leaveDeductionArray.push({
                            month_name: dateRange[k]["month_name"],
                            finalLeave: parseFloat(dateRange[k]["leaveDays"])
                          });
                        }
                      }

                      calculatedLeaveDays =
                        parseFloat(calculatedLeaveDays) -
                        parseFloat(session_diff);

                      if (
                        (currentClosingBal < calculatedLeaveDays &&
                          annual_leave == "Y" &&
                          input.cancel != "Y") ||
                        (annual_leave == "Y" &&
                          input.is_across_year_leave == "Y")
                      ) {
                        let Pr_from_date = "";
                        let Pr_to_date = "";

                        if (input.part == "A") {
                          Pr_from_date = new Date();
                          Pr_to_date = input.to_date;
                        } else if (input.part == "B") {
                          Pr_from_date = input.from_date;
                          Pr_to_date = input.to_date;
                        } else {
                          Pr_from_date = new Date();
                          Pr_to_date = input.to_date;
                        }

                        projectedleaveCalc(
                          {
                            from_date: Pr_from_date,
                            to_date: Pr_to_date,
                            year: year,
                            attendance_starts:
                              branch[1][0]["attendance_starts"],
                            at_end_date: branch[1][0]["at_end_date"],

                            employee_id: input.employee_id,

                            leave_id: input.leave_id
                          },
                          _mysql
                        )
                          .then(anualResult => {
                            resolve({
                              ...anualResult,
                              leave_applied_days: leave_applied_days,
                              calculatedLeaveDays: calculatedLeaveDays,
                              monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                              include_holidays: include_holidays,
                              total_holiday: total_holiday,
                              include_week_offs: include_week_offs,
                              total_weekOff: total_weekOff,

                              annual_leave: "Y",
                              is_projected_leave: "Y",
                              currentClosingBal: 0,
                              actualClosingBal: currentClosingBal
                            });
                          })
                          .catch(e => {
                            console.log("e*0*:", e);
                            _mysql.releaseConnection();
                            reject(e);
                          });
                      }

                      //checking if he has enough eligible days
                      else if (
                        currentClosingBal >= calculatedLeaveDays ||
                        (input.cancel == "Y" && input.is_projected_leave != "Y")
                      ) {
                        // _mysql.releaseConnection();
                        resolve({
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff
                        });
                      } else if (
                        input.cancel == "Y" &&
                        input.is_projected_leave == "Y"
                      ) {
                        resolve({
                          leave_applied_days: leave_applied_days,
                          calculatedLeaveDays: calculatedLeaveDays,
                          monthWiseCalculatedLeaveDeduction: leaveDeductionArray,
                          include_holidays: include_holidays,
                          total_holiday: total_holiday,
                          include_week_offs: include_week_offs,
                          total_weekOff: total_weekOff
                        });
                      } else {
                        _mysql.releaseConnection();

                        reject({
                          invalid_input: true,
                          message: `max available is ${currentClosingBal} days, you can't apply for  
                          ${calculatedLeaveDays} days`
                        });
                      }
                    }
                  }
                }


              }
              } else {
                _mysql.releaseConnection();
                reject({
                  invalid_input: true,
                  message: `Please Process yearly leave  for ${year}`
                });
              }
            })
            .catch(e => {
              _mysql.releaseConnection();
              reject(e);
            });
        })
        .catch(error => {
          _mysql.releaseConnection();
          reject(error);
        });
    } catch (e) {
      console.log("e456:", e);

      reject(e);
    }
  });
}

function leaveSessionValidate(result, _mysql, req, next, input) {
  if (result.length > 0) {
    const m_fromDate = moment(input.from_date).format("YYYY-MM-DD");
    const m_toDate = moment(input.to_date).format("YYYY-MM-DD");

    //clashing both from_leave_session and  to_leave_session
    const clashing_sessions = new LINQ(result)
      .Where(w => w.to_date == m_fromDate || w.from_date == m_toDate)
      .Select(s => {
        return {
          hims_f_leave_application_id: s.hims_f_leave_application_id,
          employee_id: s.employee_id,
          leave_application_code: s.leave_application_code,
          from_leave_session: s.from_leave_session,
          from_date: s.from_date,
          to_leave_session: s.to_leave_session,
          to_date: s.to_date
        };
      })
      .ToArray();

    // debugLog("clashing_sessions:", clashing_sessions);
    //clashing only  new from_leave_session  with existing  to_leave_session
    const clashing_to_leave_session = new LINQ(result)
      .Where(w => w.to_date == m_fromDate)
      .Select(s => {
        return {
          hims_f_leave_application_id: s.hims_f_leave_application_id,
          employee_id: s.employee_id,
          leave_application_code: s.leave_application_code,
          from_leave_session: s.from_leave_session,
          from_date: s.from_date,
          to_leave_session: s.to_leave_session,
          to_date: s.to_date
        };
      })
      .ToArray();

    // debugLog(
    //   "clashing_to_leave_session:",
    //   clashing_to_leave_session
    // );

    //clashing only  new to_leave_session with existing  from_leave_session
    const clashing_from_leave_session = new LINQ(result)
      .Where(w => w.from_date == m_toDate)
      .Select(s => {
        return {
          hims_f_leave_application_id: s.hims_f_leave_application_id,
          employee_id: s.employee_id,
          leave_application_code: s.leave_application_code,
          from_leave_session: s.from_leave_session,
          from_date: s.from_date,
          to_leave_session: s.to_leave_session,
          to_date: s.to_date
        };
      })
      .ToArray();

    // debugLog(
    //   "clashing_from_leave_session:",
    //   clashing_from_leave_session
    // );
    //----------------------------------

    let not_clashing_sessions = _.xorBy(
      result,
      clashing_sessions,
      "hims_f_leave_application_id"
    );

    // debugLog(
    //   "not_clashing_sessions:",
    //   not_clashing_sessions
    // );

    new Promise((resolve, reject) => {
      try {
        let curr_from_session = input.from_leave_session;
        let curr_to_session = input.to_leave_session;
        if (not_clashing_sessions.length > 0) {
          //
          // debugLog("inside not classing loop ");
          _mysql.releaseConnection();
          req.records = {
            leave_already_exist: true,
            location: "inside not_clashing_sessions: date clash not session",
            message:
              " leave is already there between this dates " +
              not_clashing_sessions[0]["from_date"] +
              " AND " +
              not_clashing_sessions[0]["to_date"]
          };
          next();
          return;
        } else if (
          clashing_from_leave_session.length > 0 ||
          clashing_to_leave_session.length > 0
        ) {
          // debugLog("inside clashing_sessions BOTH  ");

          new Promise((resolve, reject) => {
            try {
              if (clashing_from_leave_session.length > 0) {
                // debugLog(
                //   "inside clashing_from_leave_session:"
                // );
                for (let i = 0; i < clashing_from_leave_session.length; i++) {
                  let prev_from_leave_session_FH = new LINQ([
                    clashing_from_leave_session[i]
                  ])
                    .Where(w => w.from_leave_session == "FH")
                    .Select(s => s.from_leave_session)
                    .FirstOrDefault();

                  // debugLog(
                  //   "prev_from_leave_session_FH:",
                  //   prev_from_leave_session_FH
                  // );

                  let prev_from_leave_session_SH = new LINQ([
                    clashing_from_leave_session[i]
                  ])
                    .Where(w => w.from_leave_session == "SH")
                    .Select(s => s.from_leave_session)
                    .FirstOrDefault();
                  // debugLog(
                  //   "prev_from_leave_session_SH:",
                  //   prev_from_leave_session_SH
                  // );

                  let prev_from_leave_session_FD = new LINQ([
                    clashing_from_leave_session[i]
                  ])
                    .Where(w => w.from_leave_session == "FD")
                    .Select(s => s.from_leave_session)
                    .FirstOrDefault();
                  // debugLog(
                  //   "prev_from_leave_session_FD:",
                  //   prev_from_leave_session_FD
                  // );

                  if (
                    (prev_from_leave_session_FH == "FH" &&
                      curr_to_session == "FD") ||
                    (prev_from_leave_session_SH == "SH" &&
                      curr_to_session == "FD") ||
                    (prev_from_leave_session_FD == "FD" &&
                      curr_to_session == "FD") ||
                    (prev_from_leave_session_FD == "FD" &&
                      curr_to_session == "FH") ||
                    (prev_from_leave_session_FH == "FH" &&
                      curr_to_session == "FH") ||
                    (prev_from_leave_session_FH == "FH" &&
                      curr_to_session == "SH" &&
                      curr_from_session == "FH") ||
                    (prev_from_leave_session_FD == "FD" &&
                      curr_to_session == "SH") ||
                    (prev_from_leave_session_SH == "SH" &&
                      curr_to_session == "SH")
                  ) {
                    // debugLog("rejction two:");
                    //clashing only  new to_leave_session with existing  from_leave_session
                    _mysql.releaseConnection();
                    req.records = {
                      leave_already_exist: true,
                      location:
                        "inside clashing_from_leave_session: session error: comparing prev_from_leave_session with  current:to_leave_session ",
                      message:
                        "leave is already there between this dates " +
                        clashing_from_leave_session[i]["from_date"] +
                        " AND " +
                        clashing_from_leave_session[i]["to_date"]
                    };
                    next();
                    return;
                  }

                  if (i == clashing_from_leave_session.length - 1) {
                    // debugLog(
                    //   "clashing_from_leave_session last iteration:"
                    // );
                    resolve({});
                  }
                }
              } else {
                resolve({});
              }
            } catch (e) {
              reject(e);
            }
          }).then(fromSessionREsult => {
            if (clashing_to_leave_session.length > 0) {
              // debugLog(
              //   "inside clashing_to_leave_session:"
              // );

              for (let i = 0; i < clashing_to_leave_session.length; i++) {
                //fetch all previous to_leave_sessions

                let prev_to_leave_session_FH = new LINQ([
                  clashing_to_leave_session[i]
                ])
                  .Where(w => w.to_leave_session == "FH")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                // debugLog(
                //   "prev_to_leave_session_FH:",
                //   prev_to_leave_session_FH
                // );

                let prev_to_leave_session_FD = new LINQ([
                  clashing_to_leave_session[i]
                ])
                  .Where(w => w.to_leave_session == "FD")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                // debugLog(
                //   "prev_to_leave_session_FD:",
                //   prev_to_leave_session_FD
                // );

                let prev_to_leave_session_SH = new LINQ([
                  clashing_to_leave_session[i]
                ])
                  .Where(w => w.to_leave_session == "SH")
                  .Select(s => s.to_leave_session)
                  .FirstOrDefault();

                // debugLog(
                //   "prev_to_leave_session_SH:",
                //   prev_to_leave_session_SH
                // );

                let prev2_from_leave_session_FH = new LINQ([
                  clashing_to_leave_session[i]
                ])
                  .Where(w => w.from_leave_session == "FH")
                  .Select(s => s.from_leave_session)
                  .FirstOrDefault();

                // debugLog(
                //   "2nd time prev_to_leave_session_SH:",
                //   prev2_from_leave_session_FH
                // );
                //rejection of to_leave_sessions

                if (
                  (prev_to_leave_session_FH == "FH" &&
                    curr_from_session == "FH") ||
                  (prev_to_leave_session_FD == "FD" &&
                    curr_from_session == "FH") ||
                  (prev2_from_leave_session_FH == "FH" &&
                    prev_to_leave_session_SH == "SH" &&
                    curr_from_session == "FH") ||
                  ((prev_to_leave_session_FD == "FD" &&
                    curr_from_session == "SH") ||
                    (prev_to_leave_session_SH == "SH" &&
                      curr_from_session == "SH")) ||
                  ((prev_to_leave_session_FH == "FH" &&
                    curr_from_session == "FD") ||
                    (prev_to_leave_session_FD == "FD" &&
                      curr_from_session == "FD") ||
                    (prev_to_leave_session_SH == "SH" &&
                      curr_from_session == "FD"))
                ) {
                  // debugLog("rejction_one:");
                  //clashing only  new from_leave_session  with existing  to_leave_session
                  _mysql.releaseConnection();
                  req.records = {
                    leave_already_exist: true,
                    location:
                      " inside clashing_to_leave_session:session error: comparing prev_to_leave_session with  current: from_leave_session ",
                    message:
                      "leave is already there between this dates " +
                      clashing_to_leave_session[i]["from_date"] +
                      " AND " +
                      clashing_to_leave_session[i]["to_date"]
                  };
                  next();
                  return;
                }

                if (i == clashing_to_leave_session.length - 1) {
                  // debugLog(
                  //   "clashing_to_leave_session last iteration:"
                  // );
                  saveF(_mysql, req, next, input, 5);
                }
              }
            } else {
              // debugLog(
              //   "else of clashing_to_leave_session"
              // );
              saveF(_mysql, req, next, input, 6);
            }
          });
        } else {
          resolve({});
        }
      } catch (e) {
        reject(e);
      }
    }).then(noClashResult => {
      saveF(_mysql, req, next, input, 1);
    });
  }
}

function singleYearAuthorize(
  month_number,
  deductionResult,
  leaveData,
  input,
  req
) {
  return new Promise((resolve, reject) => {
    try {
      let monthArray = deductionResult.monthWiseCalculatedLeaveDeduction;
      const month_name = moment(input.from_date).format("MMMM");
      let updaid_leave_duration = 0;

      if (monthArray.length > 0) {
        if (
          leaveData.length > 0 &&
          (parseFloat(deductionResult.calculatedLeaveDays) <=
            parseFloat(leaveData[0]["close_balance"]) ||
            deductionResult.is_projected_leave == "Y")
        ) {
          let newCloseBal = "";
          let actualClosingBal = 0;
          let projected_applied_leaves = 0;
          let newAvailTillDate =
            parseFloat(leaveData[0]["availed_till_date"]) +
            parseFloat(deductionResult.calculatedLeaveDays);

          if (deductionResult.is_projected_leave == "Y") {
            newCloseBal = deductionResult.currentClosingBal;
            actualClosingBal = deductionResult.actualClosingBal;
            projected_applied_leaves = deductionResult.projected_applied_leaves;
          } else {
            newCloseBal =
              parseFloat(leaveData[0]["close_balance"]) -
              parseFloat(deductionResult.calculatedLeaveDays);
          }

          let month_new_balances = "";

          monthArray.forEach(item => {
            let month_name;
            for (month_name in leaveData[0]) {
              if (month_name.toUpperCase() == item.month_name.toUpperCase()) {
                if (month_new_balances == "") {
                  month_new_balances += `${month_name}=${parseFloat(
                    leaveData[0][month_name]
                  ) + parseFloat(item.finalLeave)}`;
                } else {
                  month_new_balances += `,${month_name}=${parseFloat(
                    leaveData[0][month_name]
                  ) + parseFloat(item.finalLeave)}`;
                }
              }
            }
          });

          if (month_new_balances == "") {
            month_new_balances += ` close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                            projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
          } else {
            month_new_balances += ` , close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                            projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
          }

          let update_leave_balnce = ` update hims_f_employee_monthly_leave set ${month_new_balances}  where \
                      hims_f_employee_monthly_leave_id= ${leaveData[0].hims_f_employee_monthly_leave_id} ;`;

          let update_leave_application = ` update hims_f_leave_application set status='APR',
                      approved_by= ${
            req.userIdentity.algaeh_d_app_user_id
            },approved_date= '${moment().format("YYYY-MM-DD")}'
                      where record_status='A'  and hims_f_leave_application_id= ${
            input.hims_f_leave_application_id
            };`;

          //-------------------GGG

          updaid_leave_duration = new LINQ(
            deductionResult.monthWiseCalculatedLeaveDeduction
          )
            .Where(w => w.month_name == month_name)
            .Select(s => s.finalLeave)
            .FirstOrDefault();

          let insertPendLeave = "";
          if (input.salary_processed == "Y" && input.leave_type == "U") {
            insertPendLeave = ` insert into hims_f_pending_leave (employee_id, year, month,leave_application_id,updaid_leave_duration)\
                 VALUE(${input.employee_id},${input.year},  ${month_number}, ${input.hims_f_leave_application_id},${updaid_leave_duration});`;
          }

          let anualLeave = "";

          if (
            input.annual_leave_process_separately == "Y" &&
            input.leave_category == "A"
          ) {
            anualLeave = ` insert into hims_f_employee_annual_leave (employee_id,year,month,leave_application_id,hospital_id,from_normal_salary) VALUE(${input.employee_id},\
                              ${input.year},${month_number},${input.hims_f_leave_application_id},${input.hospital_id},'${input.from_normal_salary}');`;
          }

          //if he is regularizing absent to leave
          let convertToLeave = "";
          if (input.leave_from == "AB" && input.absent_id > 0) {
            let paid = 0;
            let unpaid = 0;

            if (input.leave_type == "P") {
              paid = 1;
            } else if (input.leave_type == "U") {
              unpaid = 1;
            }

            let leave = "";
            if (input.leave_type == "P") {
              leave = `, paid_leave=paid_leave+1 `;
            } else if (input.leave_type == "U") {
              leave = `, unpaid_leave=unpaid_leave+1 `;
            }

            convertToLeave = ` update hims_f_daily_time_sheet set status='${input.leave_type +
              "L"}',
                actual_hours=0,actual_minutes=0 where hospital_id=${
              input.hospital_id
              }  and 
                employee_id=${input.employee_id} and attendance_date='${
              input.from_date
              }';
                update hims_f_daily_attendance set absent_days=0 ,paid_leave=${paid},unpaid_leave=${unpaid}
                where hospital_id=${input.hospital_id} and employee_id=${
              input.employee_id
              }
                and attendance_date='${input.from_date}';
                update hims_f_attendance_monthly set absent_days=absent_days-1,total_leave=total_leave+1 ${leave}
                where hospital_id=${input.hospital_id} and employee_id=${
              input.employee_id
              } and 
                year=${input.year} and month=${month_number};
                update hims_f_absent set status='CTL' ,processed='Y' where hims_f_absent_id=${
              input.absent_id
              };`;
          }

          resolve({
            convertToLeave: convertToLeave,
            update_leave_balnce: update_leave_balnce,
            update_leave_application: update_leave_application,
            insertPendLeave: insertPendLeave,
            anualLeave: anualLeave
          });
        } else {
          //invalid data
          reject({
            invalid_input: true,
            message: "leave balance is low"
          });
        }
      } else {
        //invalid data
        reject({
          invalid_input: true,
          message: "please provide valid month"
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

function acrossYearAuthorize(
  month_number,
  deductionResult,
  cur_year_leaveData,
  next_year_leaveData,
  input,
  req
) {
  console.log("INSIDE acrossYearAuthorize");

  return new Promise((resolve, reject) => {
    try {
      new Promise((resolve, reject) => {
        let monthArray = deductionResult.partA_monthWise;
        const month_name = moment(input.from_date).format("MMMM");
        let updaid_leave_duration = 0;

        if (monthArray.length > 0) {
          if (
            cur_year_leaveData.length > 0 &&
            (parseFloat(deductionResult.from_year_calculatedLeaveDays) <=
              parseFloat(cur_year_leaveData[0]["close_balance"]) ||
              deductionResult.is_projected_leave == "Y")
          ) {
            let newCloseBal = "";
            let actualClosingBal = 0;
            let projected_applied_leaves = 0;
            let newAvailTillDate =
              parseFloat(cur_year_leaveData[0]["availed_till_date"]) +
              parseFloat(deductionResult.from_year_calculatedLeaveDays);

            if (deductionResult.is_projected_leave == "Y") {
              newCloseBal =
                parseFloat(deductionResult.partA_actualClosingBal) +
                parseFloat(deductionResult.partA_predicted_leave_days) -
                parseFloat(deductionResult.from_year_calculatedLeaveDays) -
                parseFloat(deductionResult.carry_forward);

              actualClosingBal = deductionResult.partA_actualClosingBal;
              projected_applied_leaves =
                deductionResult.partA_predicted_leave_days;

              // let december_days=0;
              // deductionResult.partB_monthWise.find((item,index)=>{
              //   if( item.month_name.toUpperCase()=="DECEMBER"){
              //     december_days= item.finalLeave;
              //     deductionResult.partB_monthWise[index]["finalLeave"]=0;
              //   }
              // });

              // deductionResult.partA_monthWise.find((item,index)=>{
              //   if( item.month_name.toUpperCase()=="DECEMBER"){
              //     deductionResult.partA_monthWise[index]["finalLeave"]+=december_days;
              //   }
              // });
            } else {
              newCloseBal = parseFloat(cur_year_leaveData[0]["close_balance"]);
            }

            let month_new_balances = "";

            monthArray.forEach(item => {
              let month_name;
              for (month_name in cur_year_leaveData[0]) {
                if (month_name.toUpperCase() == item.month_name.toUpperCase()) {
                  if (month_new_balances == "") {
                    month_new_balances += `${month_name}=${parseFloat(
                      cur_year_leaveData[0][month_name]
                    ) + parseFloat(item.finalLeave)}`;
                  } else {
                    month_new_balances += `,${month_name}=${parseFloat(
                      cur_year_leaveData[0][month_name]
                    ) + parseFloat(item.finalLeave)}`;
                  }
                }
              }
            });

            if (month_new_balances == "") {
              month_new_balances += ` close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
            projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
            } else {
              month_new_balances += ` , close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
            projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
            }

            let partA_update_leave_balnce = ` update hims_f_employee_monthly_leave set ${month_new_balances}  where \
      hims_f_employee_monthly_leave_id= ${cur_year_leaveData[0].hims_f_employee_monthly_leave_id} ;`;

            //-------------------GGG

            updaid_leave_duration = new LINQ(deductionResult.partA_monthWise)
              .Where(w => w.month_name == month_name)
              .Select(s => s.finalLeave)
              .FirstOrDefault();

            let insertPendLeave = "";
            if (input.salary_processed == "Y" && input.leave_type == "U") {
              insertPendLeave = ` insert into hims_f_pending_leave (employee_id, year, month,leave_application_id,updaid_leave_duration)\
                VALUE(${input.employee_id},${input.year},  ${month_number}, ${input.hims_f_leave_application_id},${updaid_leave_duration});`;
            }

            let anualLeave = "";

            if (
              input.annual_leave_process_separately == "Y" &&
              input.leave_category == "A"
            ) {
              anualLeave = ` insert into hims_f_employee_annual_leave (employee_id,year,month,leave_application_id,hospital_id,from_normal_salary) VALUE(${input.employee_id},\
                            ${input.year},${month_number},${input.hims_f_leave_application_id},${input.hospital_id},'${input.from_normal_salary}');`;
            }

            //if he is regularizing absent to leave
            let convertToLeave = "";
            if (input.leave_from == "AB" && input.absent_id > 0) {
              let paid = 0;
              let unpaid = 0;

              if (input.leave_type == "P") {
                paid = 1;
              } else if (input.leave_type == "U") {
                unpaid = 1;
              }

              let leave = "";
              if (input.leave_type == "P") {
                leave = `, paid_leave=paid_leave+1 `;
              } else if (input.leave_type == "U") {
                leave = `, unpaid_leave=unpaid_leave+1 `;
              }

              convertToLeave = ` update hims_f_daily_time_sheet set status='${input.leave_type +
                "L"}',
              actual_hours=0,actual_minutes=0 where hospital_id=${
                input.hospital_id
                }  and 
              employee_id=${input.employee_id} and attendance_date='${
                input.from_date
                }';
              update hims_f_daily_attendance set absent_days=0 ,paid_leave=${paid},unpaid_leave=${unpaid}
              where hospital_id=${input.hospital_id} and employee_id=${
                input.employee_id
                }
              and attendance_date='${input.from_date}';
              update hims_f_attendance_monthly set absent_days=absent_days-1,total_leave=total_leave+1 ${leave}
              where hospital_id=${input.hospital_id} and employee_id=${
                input.employee_id
                } and 
              year=${input.year} and month=${month_number};
              update hims_f_absent set status='CTL' ,processed='Y' where hims_f_absent_id=${
                input.absent_id
                };`;
            }

            resolve({
              convertToLeave: convertToLeave,
              partA_update_leave_balnce: partA_update_leave_balnce,
              insertPendLeave: insertPendLeave,
              anualLeave: anualLeave
            });
          } else {
            //invalid data
            reject({
              invalid_input: true,
              message: "leave balance is low"
            });
          }
        } else {
          //invalid data
          reject({
            invalid_input: true,
            message: "please provide valid month"
          });
        }
      })
        .then(resultA => {
          let monthArray = deductionResult.partB_monthWise;

          if (monthArray.length > 0) {
            if (
              next_year_leaveData.length > 0 &&
              (parseFloat(deductionResult.to_year_calculatedLeaveDays) <=
                parseFloat(next_year_leaveData[0]["close_balance"]) ||
                deductionResult.is_projected_leave == "Y")
            ) {
              let newCloseBal = "";
              let actualClosingBal = 0;
              let projected_applied_leaves = 0;

              let newAvailTillDate =
                parseFloat(next_year_leaveData[0]["availed_till_date"]) +
                parseFloat(deductionResult.to_year_calculatedLeaveDays);

              if (deductionResult.is_projected_leave == "Y") {
                newCloseBal =
                  parseFloat(deductionResult.partB_actualClosingBal) +
                  parseFloat(deductionResult.partB_projected_applied_leaves) -
                  parseFloat(deductionResult.to_year_calculatedLeaveDays);
                projected_applied_leaves =
                  deductionResult.partB_projected_applied_leaves;
              } else {
                newCloseBal =
                  parseFloat(next_year_leaveData[0]["close_balance"]) -
                  parseFloat(deductionResult.to_year_calculatedLeaveDays);
              }

              let month_new_balances = "";

              monthArray.forEach(item => {
                let month_name;
                for (month_name in next_year_leaveData[0]) {
                  if (
                    month_name.toUpperCase() == item.month_name.toUpperCase()
                  ) {
                    if (month_new_balances == "") {
                      month_new_balances += `${month_name}=${parseFloat(
                        next_year_leaveData[0][month_name]
                      ) + parseFloat(item.finalLeave)}`;
                    } else {
                      month_new_balances += `,${month_name}=${parseFloat(
                        next_year_leaveData[0][month_name]
                      ) + parseFloat(item.finalLeave)}`;
                    }
                  }
                }
              });

              if (month_new_balances == "") {
                month_new_balances += ` close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                          projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
              } else {
                month_new_balances += ` , close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                          projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
              }

              let partB_update_leave_balnce = ` update hims_f_employee_monthly_leave set ${month_new_balances}  where \
                    hims_f_employee_monthly_leave_id= ${next_year_leaveData[0].hims_f_employee_monthly_leave_id} ;`;

              let update_leave_application = ` update hims_f_leave_application set status='APR',
                    approved_by= ${
                req.userIdentity.algaeh_d_app_user_id
                },approved_date= '${moment().format("YYYY-MM-DD")}'
                    where record_status='A'  and hims_f_leave_application_id= ${
                input.hims_f_leave_application_id
                };`;

              resolve({
                ...resultA,
                partB_update_leave_balnce: partB_update_leave_balnce,
                update_leave_application: update_leave_application
              });
            } else {
              //invalid data
              reject({
                invalid_input: true,
                message: "leave balance is low"
              });
            }
          } else {
            //invalid data
            reject({
              invalid_input: true,
              message: "please provide valid month"
            });
          }
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

function singleYearCancel(deductionResult, leaveData, input, req) {
  console.log("INSIDE singleYearCancel");
  return new Promise((resolve, reject) => {
    try {
      let monthArray = deductionResult.monthWiseCalculatedLeaveDeduction;
      // const month_name = moment(input.from_date).format("MMMM");

      if (monthArray.length > 0) {
        let projected_string = "";

        let newCloseBal = 0;
        let newAvailTillDate = 0;
        if (input.is_projected_leave == "Y") {
          newCloseBal =
            parseFloat(leaveData[0]["close_balance"]) +
            parseFloat(leaveData[0]["actual_closing_balance"]) +
            parseFloat(leaveData[0]["accumulated_leaves"]);

          newAvailTillDate =
            parseFloat(leaveData[0]["availed_till_date"]) -
            parseFloat(deductionResult.calculatedLeaveDays);

          projected_string =
            ", accumulated_leaves=0,projected_applied_leaves=0,actual_closing_balance=0";
        } else {
          newCloseBal =
            parseFloat(leaveData[0]["close_balance"]) +
            parseFloat(deductionResult.calculatedLeaveDays);
          newAvailTillDate =
            parseFloat(leaveData[0]["availed_till_date"]) -
            parseFloat(deductionResult.calculatedLeaveDays);
        }

        let month_new_balances = "";

        monthArray.forEach(item => {
          let month_name;
          for (month_name in leaveData[0]) {
            if (month_name.toUpperCase() == item.month_name.toUpperCase()) {
              if (month_new_balances == "") {
                month_new_balances += `${month_name}=${parseFloat(
                  leaveData[0][month_name]
                ) - parseFloat(item.finalLeave)}`;
              } else {
                month_new_balances += `,${month_name}=${parseFloat(
                  leaveData[0][month_name]
                ) - parseFloat(item.finalLeave)}`;
              }
            }
          }
        });

        if (month_new_balances == "") {
          month_new_balances += ` close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate}`;
        } else {
          month_new_balances += ` , close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate} `;
        }

        let update_leave_balnce = ` update hims_f_employee_monthly_leave set ${month_new_balances}  ${projected_string} where \
        hims_f_employee_monthly_leave_id= ${leaveData[0].hims_f_employee_monthly_leave_id} ;`;

        let update_leave_application = ` update hims_f_leave_application set status='CAN',
        cancelled_by= ${
          req.userIdentity.algaeh_d_app_user_id
          },cancelled_date= '${moment().format("YYYY-MM-DD")}',
        cancelled_remarks='${input.cancelled_remarks}'
        where record_status='A'  and hims_f_leave_application_id= ${
          input.hims_f_leave_application_id
          };`;

        let anualLeave = "";
        if (
          input.annual_leave_process_separately == "Y" &&
          input.leave_category == "A"
        ) {
          anualLeave = ` update hims_f_employee_annual_leave set cancelled='Y' where leave_application_id=${input.hims_f_leave_application_id};`;
        }

        let deletePendingLeave = ` delete from  hims_f_pending_leave where leave_application_id=${input.hims_f_leave_application_id};`;
        resolve({
          update_leave_balnce: update_leave_balnce,
          update_leave_application: update_leave_application,
          deletePendingLeave: deletePendingLeave,
          anualLeave: anualLeave
        });
      } else {
        resolve({
          invalid_input: true,
          message: "leaves not found"
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}
function acrossYearCancel(
  deductionResult,
  cur_year_leaveData,
  next_year_leaveData,
  input,
  req
) {
  console.log("INSIDE acrossYearCancel");
  return new Promise((resolve, reject) => {
    try {
      new Promise((resolve, reject) => {
        // let december_days=0;
        // deductionResult.partB_monthWise.find(item=>{
        //   if( item.month_name.toUpperCase()=="DECEMBER"){
        //     december_days= item.finalLeave;

        //   }
        // });

        // deductionResult.partA_monthWise.find((item,index)=>{
        //   if( item.month_name.toUpperCase()=="DECEMBER"){
        //     deductionResult.partA_monthWise[index]["finalLeave"]+=december_days;
        //   }
        // });

        let monthArray = deductionResult.partA_monthWise;

        if (monthArray.length > 0) {
          if (cur_year_leaveData.length > 0) {
            let projected_string = "";
            let newCloseBal = "";
            let actualClosingBal = 0;
            let projected_applied_leaves = 0;
            let newAvailTillDate =
              parseFloat(cur_year_leaveData[0]["availed_till_date"]) -
              parseFloat(deductionResult.from_year_calculatedLeaveDays);

            if (
              deductionResult.is_across_year_leave == "Y" &&
              deductionResult.annual_leave == "Y"
            ) {
              newCloseBal =
                parseFloat(cur_year_leaveData[0]["close_balance"]) +
                parseFloat(cur_year_leaveData[0]["actual_closing_balance"]) +
                parseFloat(cur_year_leaveData[0]["accumulated_leaves"]);

              newAvailTillDate =
                parseFloat(cur_year_leaveData[0]["availed_till_date"]) -
                parseFloat(deductionResult.from_year_calculatedLeaveDays);

              projected_string =
                ", accumulated_leaves=0,projected_applied_leaves=0,actual_closing_balance=0";
            } else {
              newCloseBal =
                parseFloat(cur_year_leaveData[0]["close_balance"]) +
                parseFloat(deductionResult.from_year_calculatedLeaveDays);
            }

            let month_new_balances = "";

            monthArray.forEach(item => {
              let month_name;
              for (month_name in cur_year_leaveData[0]) {
                if (month_name.toUpperCase() == item.month_name.toUpperCase()) {
                  if (month_new_balances == "") {
                    month_new_balances += `${month_name}=${parseFloat(
                      cur_year_leaveData[0][month_name]
                    ) - parseFloat(item.finalLeave)}`;
                  } else {
                    month_new_balances += `,${month_name}=${parseFloat(
                      cur_year_leaveData[0][month_name]
                    ) - parseFloat(item.finalLeave)}`;
                  }
                }
              }
            });

            if (month_new_balances == "") {
              month_new_balances += ` close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                          projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
            } else {
              month_new_balances += ` , close_balance=${newCloseBal} , availed_till_date=${newAvailTillDate},\
                          projected_applied_leaves=${projected_applied_leaves} , actual_closing_balance=${actualClosingBal}   `;
            }

            let partA_update_leave_balnce = ` update hims_f_employee_monthly_leave set ${month_new_balances},processed='N',carry_forward_done='N',carry_forward_leave=0 ${projected_string}  where \
                    hims_f_employee_monthly_leave_id= ${cur_year_leaveData[0].hims_f_employee_monthly_leave_id} ;`;

            //-------------------GGG

            let deletePendingLeave = ` delete from  hims_f_pending_leave where leave_application_id=${input.hims_f_leave_application_id};`;

            let anualLeave = "";
            if (
              input.annual_leave_process_separately == "Y" &&
              input.leave_category == "A"
            ) {
              anualLeave = ` update hims_f_employee_annual_leave set cancelled='Y' where leave_application_id=${input.hims_f_leave_application_id};`;
            }

            resolve({
              partA_update_leave_balnce: partA_update_leave_balnce,
              deletePendingLeave: deletePendingLeave,
              anualLeave: anualLeave
            });
          } else {
            //invalid data
            reject({
              invalid_input: true,
              message: "leave balance is low"
            });
          }
        } else {
          //invalid data
          reject({
            invalid_input: true,
            message: "please provide valid month"
          });
        }
      })
        .then(resultA => {
          let monthArray = deductionResult.partB_monthWise;

          if (monthArray.length > 0) {
            if (next_year_leaveData.length > 0) {
              let delete_partB = ` delete from hims_f_employee_monthly_leave where hims_f_employee_monthly_leave_id= ${next_year_leaveData[0].hims_f_employee_monthly_leave_id} ;`;

              let update_leave_application = ` update hims_f_leave_application set status='CAN',
                    cancelled_by= ${
                req.userIdentity.algaeh_d_app_user_id
                },cancelled_date= '${moment().format("YYYY-MM-DD")}',
                    cancelled_remarks='${input.cancelled_remarks}'
                    where record_status='A'  and hims_f_leave_application_id= ${
                input.hims_f_leave_application_id
                };`;

              resolve({
                ...resultA,
                delete_partB: delete_partB,
                update_leave_application: update_leave_application,
                hims_f_employee_monthly_leave_id:
                  cur_year_leaveData[0].hims_f_employee_monthly_leave_id
              });
            } else {
              //invalid data
              reject({
                invalid_input: true,
                message: "leave balance is low"
              });
            }
          } else {
            //invalid data
            reject({
              invalid_input: true,
              message: "please provide valid month"
            });
          }
        })
        .catch(e => {
          reject(e);
        });
    } catch (e) {
      reject(e);
    }
  });
}

function numberOfMonths(at_end_date, dateStart, dateEnd) {
  let date_start = moment(dateStart.valueOf());
  let date_end = moment(dateEnd.valueOf());

  try {
    const number_of_months = [];
    const temp_number_of_months = [];
    console.log("PM");

    let from_month = moment(date_start, "YYYY-MM-DD").format("M");
    let to_month = moment(date_end, "YYYY-MM-DD").format("M");
    let from_day = moment(date_start, "YYYY-MM-DD").format("D");
    let to_day = moment(date_end, "YYYY-MM-DD").format("D");
    if (from_month == to_month) {
      let cur_month = "";
      if (from_day <= at_end_date && to_day <= at_end_date) {
        temp_number_of_months.push(parseInt(from_month));
      } else if (from_day <= at_end_date && to_day > at_end_date) {
        temp_number_of_months.push(from_month);
        cur_month = parseInt(from_month) + parseInt(1);

        if (cur_month > 12) {
          cur_month = 1;
        }
        temp_number_of_months.push(cur_month);
      } else if (from_day > at_end_date && to_day > at_end_date) {
        cur_month = parseInt(from_month) + parseInt(1);

        if (cur_month > 12) {
          cur_month = 1;
        }
        temp_number_of_months.push(cur_month);
      }
    } else {
      while (
        moment(date_end, "YYYY-MM-DD").format("YYYYMM") >=
        moment(date_start, "YYYY-MM-DD").format("YYYYMM")
      ) {
        let cur_month = 0;
        if (
          from_month == moment(date_start, "YYYY-MM-DD").format("M")
        ) {
          if (from_day <= at_end_date) {
            cur_month = parseInt(from_month);

            if (cur_month > 12) {
              cur_month = 1;

              temp_number_of_months.push(cur_month);
            } else {
              temp_number_of_months.push(cur_month);
            }
          } else if (from_day > at_end_date) {
            cur_month = parseInt(from_month) + parseInt(1);
            if (cur_month > 12) {
              cur_month = 1;

              temp_number_of_months.push(cur_month);
            } else {
              temp_number_of_months.push(cur_month);
            }
          }

          date_start.add(1, "M");
        } else if (
          to_month == moment(date_start, "YYYY-MM-DD").format("M")
        ) {
          if (to_day <= at_end_date) {
            cur_month = parseInt(
              moment(date_start, "YYYY-MM-DD").format("M")
            );

            if (cur_month > 12) {
              cur_month = 1;

              temp_number_of_months.push(cur_month);
            } else {
              temp_number_of_months.push(cur_month);
            }
          } else if (to_day > at_end_date) {
            cur_month = parseInt(
              moment(date_start, "YYYY-MM-DD").format("M")
            );

            if (cur_month > 12) {
              cur_month = 1;

              temp_number_of_months.push(cur_month);
            } else {
              temp_number_of_months.push(cur_month);
            }

            cur_month = parseInt(cur_month) + parseInt(1);

            if (cur_month > 12) {
              cur_month = 1;

              temp_number_of_months.push(cur_month);
            } else {
              temp_number_of_months.push(cur_month);
            }
          }
          date_start.add(1, "M");
        } else {
          cur_month = parseInt(
            moment(date_start, "YYYY-MM-DD").format("M")
          );

          if (cur_month > 12) {
            cur_month = 1;

            temp_number_of_months.push(cur_month);
          } else {
            temp_number_of_months.push(cur_month);
          }

          date_start.add(1, "M");
        }
      }
    }

    temp_number_of_months.forEach(item => {
      if (number_of_months.indexOf(item) === -1) {
        number_of_months.push(item);
      }
    });
    console.log("number_of_months:", number_of_months);
    return number_of_months.length;
  } catch (e) {
    console.log("e89e:", e);
    reject(e);
  }
}
