import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import extend from "extend";
import moment from "moment";
import { LINQ } from "node-linq";
import utilities from "algaeh-utilities";

//import { getMaxAuth } from "../../../src/utils";
// import Sync from "sync";
module.exports = {
  //created by irfan: to
  authorizeLeave: (req, res, next) => {
    const _mysql = new algaehMysql();
    const input = req.body;
    let salary_processed = "N";
    if (req.userIdentity.leave_authorize_privilege != "N") {
      // get highest auth level
      getMaxAuth({
        mysql: _mysql
      }).then(maxAuth => {
        utilities
          .AlgaehUtilities()
          .logger()
          .log("maxAuth: ", maxAuth);

        if (
          req.userIdentity.leave_authorize_privilege != maxAuth.MaxLeave ||
          input.auth_level != maxAuth.MaxLeave
        ) {
          //for lower level authorize
          getLeaveAuthFields(input.auth_level).then(authFields => {
            utilities
              .AlgaehUtilities()
              .logger()
              .log("myyy: ", authFields);

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
                printQuery: true
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
            utilities
              .AlgaehUtilities()
              .logger()
              .log("libbb: ", authFields);

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
                printQuery: true
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
                } else if (authResult.affectedRows > 0 && input.status == "A") {
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
                          hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                          values: [month_number, input.year, input.employee_id],
                          printQuery: true
                        })
                        .then(salResult => {
                          if (
                            salResult.length > 0 &&
                            salResult[0]["salary_processed"] == "Y"
                          ) {

                            salary_processed="Y"
                            resolve({ salResult})
                            utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("salResult: ",salResult);
                          }
                          else{

                            resolve({ salResult})
                          }

                        }).then(pendingUpdaidResult=>{
                          utilities
                          .AlgaehUtilities()
                          .logger()
                          .log("pendingUpdaidResult: ");
                          calc(_mysql, req.body)
                          .then(deductionResult => {
                            utilities
                              .AlgaehUtilities()
                              .logger()
                              .log("deductionResult: ", deductionResult);



                              if (deductionResult.invalid_input == true) {
                                _mysql.rollBackTransaction(() => {
                                  req.records = deductionResult;
                                  next();
                                  return;
                                });                               
                              }
                              
                              else {
                                return deductionResult;
                              }

                             
                          }).then(deductionResult =>{


                           

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
                                    query:
                                    `select hims_f_employee_monthly_leave_id, total_eligible,close_balance, ${monthArray} ,availed_till_date
                                    from hims_f_employee_monthly_leave where
                                   employee_id=? and year=? and leave_id=?`,
                                    values: [input.employee_id, input.year, input.leave_id]
                                  })
                                  .then(leaveData => {


                                    utilities
                                    .AlgaehUtilities()
                                    .logger()
                                    .log("leaveData:", leaveData);

                                    if (
                                      leaveData.length > 0 &&
                                      parseFloat(
                                        deductionResult.calculatedLeaveDays
                                      ) <= parseFloat(leaveData[0]["close_balance"])
                                    ) {



                                      let newCloseBal =
                                      parseFloat(leaveData[0]["close_balance"]) -
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
                    
                                   
                    
                                 
                                          for (let i = 0; i < monthArray.length; i++) {
                                            Object.keys(leaveData[0]).map(key => {
                                              if (key == monthArray[i]) {
                                            
                          
                                                oldMonthsData.push({
                                                  month_name: key,
                                                  finalLeave: leaveData[0][key]
                                                });
                                              }
                                            });
                                          }
                                   
                    
                                        utilities
                                        .AlgaehUtilities()
                                        .logger()
                                        .log("oldMonthsData:", oldMonthsData);

                                        let mergemonths = oldMonthsData.concat(
                                          deductionResult.monthWiseCalculatedLeaveDeduction
                                        );
                    
                                   
                    
                                         //debugLog("mergemonths:", mergemonths);
                    
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
                                                return s.finalLeave;
                                              });
                                            })
                                            .value();
                                         // debugLog("finalData:", finalData);
                          
                                         utilities
                                         .AlgaehUtilities()
                                         .logger()
                                         .log("finalData:", finalData);

                                              let insertPendLeave="";
                                              if (salary_processed=="Y"){
                                                insertPendLeave=` insert into hims_f_pending_leave (employee_id, year, month,leave_header_id,updaid_leave_duration) VALUE(${input.employee_id},
                                                  ${input.year},
                                                  ${month_number},
                                                  ${input.hims_f_leave_application_id},${updaid_leave_duration});`

                                              }



                                            _mysql
                                            .executeQuery({
                                              query:
                                              " update hims_f_leave_application set status='APR',approved_by=" +req.userIdentity.algaeh_d_app_user_id+", approved_date='"+moment().format("YYYY-MM-DD")+"' where record_status='A' \
                                              and hims_f_leave_application_id=" +
                                                  input.hims_f_leave_application_id +
                                                  ";update hims_f_employee_monthly_leave set ?  where \
                                              hims_f_employee_monthly_leave_id='" +
                                                  leaveData[0]
                                                    .hims_f_employee_monthly_leave_id +
                                                  "';"+insertPendLeave,
                                                  values: [{
                                                    ...finalData,
                                                    close_balance: newCloseBal,
                                                    availed_till_date: newAvailTillDate
                                                  }],printQuery:true
                                                  
                                              })
                                              .then(finalRes => {

                                                utilities
                                                .AlgaehUtilities()
                                                .logger()
                                                .log("finalRes:", finalRes);

                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                })


                                              }) .catch(error => {
                                                utilities
                                                .AlgaehUtilities()
                                                .logger()
                                                .log("error:", error);

                                                reject(error);
                                                _mysql.rollBackTransaction(() => {
                                                  next(error);
                                                });
                                              });

                                    }
                                    else{

                                      utilities
                                      .AlgaehUtilities()
                                      .logger()
                                      .log("else:");

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


                                  }).catch(error => {
                                    reject(error);
                                    _mysql.rollBackTransaction(() => {
                                      next(error);
                                    });
                                  });;


                                }
                                else {
                                  //invalid data
                        
                                  req.records = {
                                    invalid_input: true,
                                    message: "please provide valid month"
                                  };
                                  connection.rollback(() => {
                                    releaseDBConnection(db, connection);
                                    next();
                                  });
                                }



                          })
                          .catch(e => {
                            utilities
                              .AlgaehUtilities()
                              .logger()
                              .log("catch 5: ",e);
                            reject(e);
                          });

                        })
                        .catch(e => {
                          reject(e);
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
  calculateLeaveDays: (req, res, next) => {
    try {
      //  let db = null;
      let _mysql = null;
      let input;

      utilities
        .AlgaehUtilities()
        .logger()
        .log("calcul");
      if (req.options == null) {
        input = req.query;
      } else {
        input = req.body;
      }

      utilities
        .AlgaehUtilities()
        .logger()
        .log("input dd: ", input);

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

      utilities
        .AlgaehUtilities()
        .logger()
        .log("dateRange: ", dateRange);
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
      utilities
        .AlgaehUtilities()
        .logger()
        .log("dateRange: ", dateRange);
      //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      new Promise((resolve, reject) => {
        try {
          if (req.options == null) {
            _mysql = new algaehMysql();

            _mysql
              .executeQuery({
                query:
                  " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
                    from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?;\
                    select hims_d_holiday_id,holiday_date,holiday_description\
                    from hims_d_holiday where (((date(holiday_date)= date(?) and weekoff='Y') or \
                    (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                    (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?))\
                    or \
                    ((date(holiday_date)= date(?) and weekoff='Y') or \
                    (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RE') or\
                    (date(holiday_date)=date(?) and holiday='Y' and holiday_type='RS' and religion_id=?)))",
                values: [
                  input.employee_id,
                  year,
                  input.leave_id,
                  input.from_date,
                  input.from_date,
                  input.from_date,
                  my_religion,
                  input.to_date,
                  input.to_date,
                  input.to_date,
                  my_religion
                ],

                printQuery: true
              })
              .then(closeBalanceResult => {
                currentClosingBal = closeBalanceResult[0][0].close_balance;

                if (closeBalanceResult[1].length > 0) {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: `you cant apply leave,${
                      closeBalanceResult[1][0].holiday_date
                    } is holiday   `
                  };
                  next();
                  return;
                }
                resolve({ _mysql });
              })

              .catch(e => {
                next(e);
              });
          } else {
            _mysql = req.options.db;

            _mysql
              .executeQuery({
                query:
                  " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
                from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
                values: [input.employee_id, year, input.leave_id],

                printQuery: true
              })
              .then(closeBalanceResult => {
                // _mysql.releaseConnection();
                // req.records = result;
                // next();

                currentClosingBal = closeBalanceResult[0].close_balance;

                resolve({ db });
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          }
        } catch (e) {
          reject(e);
        }
      }).then(result => {
        _mysql
          .executeQuery({
            query:
              " select hims_d_leave_id,leave_code,leave_description,include_weekoff,\
            include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
            values: [input.leave_id],

            printQuery: true
          })
          .then(result => {
            // _mysql.releaseConnection();
            // req.records = result;
            // next();

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
                    from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ;",
                  values: [
                    moment(from_date).format("YYYY-MM-DD"),
                    moment(to_date).format("YYYY-MM-DD")
                  ],

                  printQuery: true
                })
                .then(holidayResult => {
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("holidayResult: ", holidayResult);

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
                      if (from_month === to_month && input.to_session == "FH") {
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
                    parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                  //-------END OF------ finally  subtracting week off and holidays from total Applied days

                  if (currentClosingBal >= calculatedLeaveDays) {
                    if (req.options == null) {
                      _mysql.releaseConnection();
                      req.records = {
                        leave_applied_days: leave_applied_days,
                        calculatedLeaveDays: calculatedLeaveDays,
                        monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                      };
                      next();
                      return;
                    } else {
                      req.options.onSuccess({
                        leave_applied_days: leave_applied_days,
                        calculatedLeaveDays: calculatedLeaveDays,
                        monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                      });
                    }
                  } else {
                    if (req.options == null) {
                      _mysql.releaseConnection();
                      req.records = {
                        invalid_input: true,
                        message: `you dont have enough leaves for :${
                          result[0]["leave_description"]
                        } `
                      };
                      next();
                      return;
                    } else {
                      req.options.onSuccess({
                        invalid_input: true,
                        message: `you dont have enough leaves for :${
                          result[0]["leave_description"]
                        } `
                      });
                    }
                  }
                })
                .catch(e => {
                  if (req.options == null) {
                    _mysql.releaseConnection();
                    next(e);
                  } else {
                    req.options.onFailure(holidayResult);
                  }
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
                        parseFloat(dateRange[k]["leaveDays"]) - parseFloat(0.5)
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
              if (currentClosingBal >= calculatedLeaveDays) {
                if (req.options == null) {
                  _mysql.releaseConnection();
                  req.records = {
                    leave_applied_days: leave_applied_days,
                    calculatedLeaveDays: calculatedLeaveDays,
                    monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                  };
                  next();
                } else {
                  req.options.onSuccess({
                    leave_applied_days: leave_applied_days,
                    calculatedLeaveDays: calculatedLeaveDays,
                    monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                  });
                }
              } else {
                if (req.options == null) {
                  _mysql.releaseConnection();
                  req.records = {
                    invalid_input: true,
                    message: `you dont have enough leaves for :${
                      result[0]["leave_description"]
                    } `
                  };
                  next();
                  return;
                } else {
                  req.options.onSuccess({
                    invalid_input: true,
                    message: `you dont have enough leaves for :${
                      result[0]["leave_description"]
                    } `
                  });
                }
              }
            } else {
              // invalid data

              if (req.options == null) {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: `invalid data `
                };
                next();
                return;
              } else {
                req.options.onSuccess({
                  invalid_input: true,
                  message: `invalid data`
                });
              }
            }
          })
          .catch(e => {
            if (req.options == null) {
              _mysql.releaseConnection();
              next(e);
            } else {
              req.options.onFailure(result);
            }
          });
      });
    } catch (e) {
      next(e);
    }
  }
};

function getMaxAuth(options) {
  const _mysql = options.mysql;
  let MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth;
  return new Promise((resolve, reject) => {
    _mysql
      .executeQuery({
        query: "SELECT * FROM hims_d_hrms_options"
      })
      .then(result => {
        //LEAVE
        switch (result[0]["leave_level"]) {
          case "1":
            MaxLeave = "AL1";
            break;

          case "2":
            MaxLeave = "AL2";
            break;
          case "3":
            MaxLeave = "AL3";
            break;
          case "4":
            MaxLeave = "AL4";
            break;
          case "5":
            MaxLeave = "AL5";
            break;
          default:
        }

        //LOAN
        switch (result[0]["loan_level"]) {
          case "1":
            MaxLoan = "AL1";
            break;

          case "2":
            MaxLoan = "AL2";
            break;
          case "3":
            MaxLoan = "AL3";
            break;
          case "4":
            MaxLoan = "AL4";
            break;
          case "5":
            MaxLoan = "AL5";
            break;
          default:
        }
        //LEAVE ENCASH
        switch (result[0]["leave_encash_level"]) {
          case "1":
            MaxLeaveEncash = "AL1";
            break;

          case "2":
            MaxLeaveEncash = "AL2";
            break;
          case "3":
            MaxLeaveEncash = "AL3";
            break;
          case "4":
            MaxLeaveEncash = "AL4";
            break;
          case "5":
            MaxLeaveEncash = "AL5";
            break;
          default:
        }
        //REVIEW AUTH
        switch (result[0]["review_auth_level"]) {
          case "1":
            MaxreviewAuth = "AL1";
            break;

          case "2":
            MaxreviewAuth = "AL2";
            break;
          case "3":
            MaxreviewAuth = "AL3";
            break;
          case "4":
            MaxreviewAuth = "AL4";
            break;
          case "5":
            MaxreviewAuth = "AL5";
            break;
          default:
        }

        resolve({ MaxLeave, MaxLoan, MaxLeaveEncash, MaxreviewAuth });
      })
      .catch(e => {
        reject(e);
      });
  });
}
function getLeaveAuthFields(auth_level) {
  utilities
    .AlgaehUtilities()
    .logger()
    .log("auth_level: ", auth_level);

  return new Promise((resolve, reject) => {
    let authFields;
    switch (auth_level) {
      case "AL1":
        authFields = [
          "authorized1=?",
          "authorized1_date=?",
          "authorized1_by=?",
          "authorized1_comment=?"
        ];
        break;

      case "AL2":
        authFields = [
          "authorized2=?",
          "authorized2_date=?",
          "authorized2_by=?",
          "authorized2_comment=?"
        ];
        break;

      case "AL3":
        authFields = [
          "authorized3=?",
          "authorized3_date=?",
          "authorized3_by=?",

          "authorized3_comment=?"
        ];
        break;

      case "AL4":
        authFields = [
          "authorized4=?",
          "authorized4_date=?",
          "authorized4_by=?",

          "authorized4_comment=?"
        ];
        break;
      case "AL5":
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

function calc(db, body) {
  try {
    return new Promise((resolve, reject) => {
      //  let db = null;
      let _mysql = db;
      let input = body;

      utilities
        .AlgaehUtilities()
        .logger()
        .log("ooption:");
      // if (options == null) {
      //   input = req.query;
      // } else {
      //   input = req.body;
      // }

      utilities
        .AlgaehUtilities()
        .logger()
        .log("input dd: ", input);

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

      utilities
        .AlgaehUtilities()
        .logger()
        .log("dateRange: ", dateRange);
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
      utilities
        .AlgaehUtilities()
        .logger()
        .log("dateRange: ", dateRange);
      //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      return new Promise((resolve, reject) => {
        try {
          utilities
            .AlgaehUtilities()
            .logger()
            .log("am one : ");

          _mysql
            .executeQuery({
              query:
                " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
              from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
              values: [input.employee_id, year, input.leave_id],

              printQuery: true
            })
            .then(closeBalanceResult => {
              // _mysql.releaseConnection();
              // req.records = result;
              // next();

              currentClosingBal = closeBalanceResult[0].close_balance;

              resolve({});
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
              " select hims_d_leave_id,leave_code,leave_description,include_weekoff,\
          include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
            values: [input.leave_id],

            printQuery: true
          })
          .then(result => {
            // _mysql.releaseConnection();
            // req.records = result;
            // next();

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
                  from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ;",
                  values: [
                    moment(from_date).format("YYYY-MM-DD"),
                    moment(to_date).format("YYYY-MM-DD")
                  ],

                  printQuery: true
                })
                .then(holidayResult => {
                  utilities
                    .AlgaehUtilities()
                    .logger()
                    .log("holidayResult: ", holidayResult);

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
                      if (from_month === to_month && input.to_session == "FH") {
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
                    parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                  //-------END OF------ finally  subtracting week off and holidays from total Applied days

                  if (currentClosingBal >= calculatedLeaveDays) {
                    resolve({
                      leave_applied_days: leave_applied_days,
                      calculatedLeaveDays: calculatedLeaveDays,
                      monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                    });
                  } else {
                    resolve({
                      invalid_input: true,
                      message: `you dont have enough leaves for :${
                        result[0]["leave_description"]
                      } `
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
                        parseFloat(dateRange[k]["leaveDays"]) - parseFloat(0.5)
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
              if (currentClosingBal >= calculatedLeaveDays) {
                resolve({
                  leave_applied_days: leave_applied_days,
                  calculatedLeaveDays: calculatedLeaveDays,
                  monthWiseCalculatedLeaveDeduction: leaveDeductionArray
                });
              } else {
                resolve({
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
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
    });
  } catch (e) {
    next(e);
  }
}
