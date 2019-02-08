import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import extend from "extend";
import moment from "moment";
import { LINQ } from "node-linq";
//import utilities from "algaeh-utilities";
import algaehUtilities from "algaeh-utilities/utilities";
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
                       
                          }
                          else{

                            resolve({ salResult})
                          }

                        }).then(pendingUpdaidResult=>{
                        
                          calc(_mysql, req.body)
                          .then(deductionResult => {
                           



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


                                                _mysql.commitTransaction(() => {
                                                  _mysql.releaseConnection();
                                                  req.records = finalRes;
                                                  next();
                                                })


                                              }) .catch(error => {
                                              

                                                reject(error);
                                                _mysql.rollBackTransaction(() => {
                                                  next(error);
                                                });
                                              });

                                    }
                                    else{

                                  

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
                                  _mysql.rollBackTransaction(() => {
                                    next();
                                  });
                                }



                          })
                          .catch(e => {
                            _mysql.rollBackTransaction(() => {
                              next(e);
                            });
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
      }).catch(e => {
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
  calculateLeaveDays: (req, res, next) => {
    try {
      //  let db = null;
      let _mysql = null;
      let input;


      if (req.options == null) {
        input = req.query;
      } else {
        input = req.body;
      }

  

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
                _mysql.releaseConnection();
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
  },

//created by irfan:
applyEmployeeLeave: (req, res, next) => {
  try {
    const _mysql = new algaehMysql();
    let input = req.body;
  
    const m_fromDate = moment(input.from_date).format("YYYY-MM-DD");
    const m_toDate = moment(input.to_date).format("YYYY-MM-DD");
    const from_year = moment(input.from_date).format("YYYY");
    const to_year = moment(input.to_date).format("YYYY");

    if (
      m_fromDate > m_toDate ||
      (m_fromDate == m_toDate &&
        ((input.from_leave_session == "SH" && input.to_leave_session == "FH") ||
          (input.from_leave_session == "SH" && input.to_leave_session == "FD")))
    ) {
      req.records = {
        leave_already_exist: true,
        message: "select proper sessions"
      };

      next();
      return;
    } else if (from_year == to_year) {
      _mysql
        .executeQuery({
          query:
            "select hims_d_employee_id,date_of_joining,exit_date from hims_d_employee\
          where record_status='A' and employee_status='A' and  hims_d_employee_id=?",
          values: [input.employee_id],

          printQuery: true
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
                    L.hims_d_leave_id,L.leave_code,L.leave_description,L.leave_type from \
                    hims_f_employee_monthly_leave ML inner join\
                    hims_d_leave L on ML.leave_id=L.hims_d_leave_id and L.record_status='A'\
                    where ML.employee_id=? and ML.leave_id=? and  ML.year in (?)",
                values: [
                  input.employee_id,
                  input.leave_id,
                  [from_year, to_year]
                ],

                printQuery: true
              })
              .then(result => {




                if (result.length > 0) {
                  let m_total_eligible = result[0]["total_eligible"];
                  let m_availed_till_date = result[0]["availed_till_date"];
                  let m_close_balance = result[0]["close_balance"];

                  if (m_close_balance >= input.total_applied_days) {
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

                        printQuery: true
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
                              let curr_from_session = input.from_leave_session;
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
                                        i < clashing_from_leave_session.length;
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
                                          clashing_from_leave_session.length - 1
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
                                        saveF(
                                          _mysql,req,  next,  input, 
                                          5
                                        );
                                      }
                                    }
                                  } else {
                                    // debugLog(
                                    //   "else of clashing_to_leave_session"
                                    // );
                                    saveF(_mysql,req,  next,  input,  6);
                                  }
                                });
                              } else {
                                resolve({});
                              }
                            } catch (e) {
                              reject(e);
                            }
                          }).then(noClashResult => {
                            saveF(_mysql,req,  next,  input, 1);
                          });
                        } else {
                          // debugLog(
                          //   "Accept leave application here  with Num gen"
                          // );


                          saveF(_mysql,req,  next,  input,  2);
                        }
                      })
                      .catch(e => {
                    
                        _mysql.releaseConnection();
                        next(e);
                      });
                  } else {
                    req.records = {
                      leave_already_exist: true,
                      message: "leave application exceed total eligible leaves"
                    };
                    _mysql.releaseConnection();
                    next();
                    return;
                  }
                } else {
                  req.records = {
                    leave_already_exist: true,
                    message: "you cant apply for this leave type"
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
                message: ` cant apply leave for inactive employee  `
              };
            } else if (empResult[0]["exit_date"] != null) {
              req.records = {
                leave_already_exist: true,
                message: ` cant apply leave for resigned employee `
              };
            } else {
              req.records = {
                leave_already_exist: true,
                message: ` cant apply leave before joining date, your joining date is: ${
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
    }
  } catch (e) {
    next(e);
  }
},
//created by irfan: to get which leaves applicable  for employee 
getEmployeeLeaveData: (req, res, next) => {
  const _mysql = new algaehMysql();
 
  if (
    req.query.year > 0 &&
    req.query.employee_id > 0
  ) {
      

    _mysql
    .executeQuery({
      query:
      "select hims_f_employee_monthly_leave_id, employee_id, year, leave_id, L.leave_code,\
      L.leave_description,total_eligible, availed_till_date, close_balance,\
      E.employee_code ,E.full_name as employee_name,\
      LD.hims_d_leave_detail_id,LD.employee_type, LD.eligible_days\
      from hims_f_employee_monthly_leave  ML inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id       \
      inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id\
      inner join hims_d_employee E on ML.employee_id=E.hims_d_employee_id and E.record_status='A'\
      and L.record_status='A' where ML.year=? and ML.employee_id=?  and  LD.employee_type=E.employee_type and  (LD.gender=E.sex or LD.gender='BOTH' )\
        order by hims_f_employee_monthly_leave_id desc;",
      values: [
        req.query.year,
        req.query.employee_id
     
      ],
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


  }
  else{
    req.records = {
      invalid_input: true,
      message:
        "Please Provide  Valid year and employee_id "
    };

    next();
    return;
  }
},
//created by irfan: to get all employees whose yearly leave is proccessed
getYearlyLeaveData: (req, res, next) => {
  const _mysql = new algaehMysql();
 
  if (
    req.query.year > 0 
  ) {
     

    _mysql
    .executeQuery({
      query:
      "select hims_f_employee_yearly_leave_id,employee_id,year ,\
      E.employee_code,  E.full_name as employee_name,SD.sub_department_code,\
      SD.sub_department_name from  hims_f_employee_yearly_leave EYL  inner join hims_d_employee E on\
      EYL.employee_id=E.hims_d_employee_id  left join hims_d_sub_department SD\
      on E.sub_department_id=SD.hims_d_sub_department_id  where EYL.year=? order by hims_f_employee_yearly_leave_id desc",
      values: [
        req.query.year
        
     
      ],
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


  }
  else{
    req.records = {
      invalid_input: true,
      message:
        "Please Provide valid year "
    };

    next();
    return;
  }
},
//created by irfan: to get all leave history about employee
getEmployeeLeaveHistory: (req, res, next) => {
  const _mysql = new algaehMysql();


  let status = "";
  if (req.query.status == "H") {
    status = " and `status`<>'PEN'";
  }
 
  if (
    req.query.employee_id > 0 
  ) { 

    _mysql
    .executeQuery({
      query:
      "select hims_f_leave_application_id,leave_application_code,employee_id,application_date,\
      leave_id,from_date,to_date,from_leave_session,to_leave_session,\
      leave_applied_from,total_applied_days,total_approved_days,status,authorized3,authorized2,authorized1,remarks,L.leave_code,\
      L.leave_description from hims_f_leave_application LA inner join hims_d_leave L on\
       LA.leave_id=L.hims_d_leave_id and L.record_status='A'\
       where LA.record_status='A' and LA.employee_id=? " +
          status +
          " order by hims_f_leave_application_id desc",
      values: [
        req.query.employee_id
        
     
      ],
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


  }
  else{
    req.records = {
      invalid_input: true,
      message:
        "Please Provide valid employee_id "
    };

    next();
    return;
  }
},

//created by irfan:
 getLeaveLevels (req, res, next)  {
  try {
    let userPrivilege = req.userIdentity.leave_authorize_privilege;
        if(userPrivilege!="N"){
          let auth_levels = [];
          switch (userPrivilege) {
            case "AL1":
              auth_levels.push({ name: "Level 1", value: 1 });
              break;
            case "AL2":
              auth_levels.push(
                { name: "Level 2", value: 2 },
                { name: "Level 1", value: 1 }
              );
              break;
            case "AL3":
              auth_levels.push(
                { name: "Level 3", value: 3 },
                { name: "Level 2", value: 2 },
                { name: "Level 1", value: 1 }
              );
              break;
            case "AL4":
              auth_levels.push(
                { name: "Level 4", value: 4 },
                { name: "Level 3", value: 3 },
                { name: "Level 2", value: 2 },
                { name: "Level 1", value: 1 }
              );
              break;
            case "AL5":
              auth_levels.push(
                { name: "Level 5", value: 5 },
                { name: "Level 4", value: 4 },
                { name: "Level 3", value: 3 },
                { name: "Level 2", value: 2 },
                { name: "Level 1", value: 1 }
              );
              break;
          }

          req.records = { auth_levels };
          next();
        }else{

            req.records = {
              invalid_input: true,
              message:
                "you dont have privilege"
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
          proportionate_leave,document_mandatory,created_by,created_date,updated_by,updated_date)\
          VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values: [
        input.leave_code,
        input.leave_description,
        input.leave_category,
        input.include_weekoff,
        input.include_holiday,
        input.leave_mode,
        input.calculation_type,
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
        req.userIdentity.algaeh_d_app_user_id,
        new Date(),
        req.userIdentity.algaeh_d_app_user_id,
        new Date()
      ],
      printQuery: true
    })
    .then(leaveHeadResult => {
      utilities.logger().log("leaveHeadResult: ", leaveHeadResult);

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
                  printQuery: true
                })
                .then(encashResult => {
                  utilities.logger().log("encashResult: ", encashResult);

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
                    printQuery: true
                  })
                  .then(ruleResult => {
                    utilities.logger().log("ruleResult: ", ruleResult);
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
                      printQuery: true
                    })
                    .then(detailResult => {
                      utilities.logger().log("detailResult: ", detailResult);

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
processYearlyLeave: (req, res, next) => {
  const _mysql = new algaehMysql();
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

    _mysql
      .executeQuery({
        query:
          "select hims_d_employee_id, employee_code,full_name  as employee_name,\
                employee_status,date_of_joining ,hospital_id ,employee_type,sex\
                from hims_d_employee where employee_status <>'I' and  record_status='A' " +
          employee_id +
          ";\
                select L.hims_d_leave_id,L.leave_code,LD.employee_type,LD.gender,LD.eligible_days from hims_d_leave  L \
                inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A' ;\
                select hims_f_employee_yearly_leave_id,employee_id,`year` from hims_f_employee_yearly_leave\
                 where record_status='A' and `year`=? ;\
                 select hims_f_employee_monthly_leave_id,employee_id,year,leave_id from\
                hims_f_employee_monthly_leave where   `year`=?; ",
        values: [year, year],
        printQuery: true
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
                      (w.gender == AllEmployees[i]["sex"] || w.gender == "BOTH")
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
                      (w.gender == AllEmployees[i]["sex"] || w.gender == "BOTH")
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
                        updated_by: req.userIdentity.algaeh_d_app_user_id
                      },
                      bulkInsertOrUpdate: true,
                      printQuery: true
                    })
                    .then(yearResult => {
                      utilities.logger().log("yearResult: ", yearResult);

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

                        bulkInsertOrUpdate: true,
                        printQuery: true
                      })
                      .then(monthResult => {
                        utilities.logger().log("monthResult: ", monthResult);

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
  const _mysql = new algaehMysql();

  let employee = "";
  let range = "";

  if (req.query.employee_id > 0) {
    employee = ` and employee_id=${req.query.employee_id} `;
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
        between date('${req.query.from_date}') and date('${
      req.query.to_date
    }') `;
  }

  let auth_level = "";
  if (req.query.auth_level == "AL1") {
    auth_level = "  authorized1='N' ";
  } else if (req.query.auth_level == "AL2") {
    auth_level = "  authorized1='Y' and authorized2='N' ";
  } else if (req.query.auth_level == "AL3") {
    auth_level = "  authorized1='Y' and authorized2='Y' and authorized3='N' ";
  } else if (req.query.auth_level == "AL4") {
    auth_level =
      "  authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='N' ";
  } else if (req.query.auth_level == "AL5") {
    auth_level =
      "  authorized1='Y' and authorized2='Y' and authorized3='Y' and authorized4='Y'  and authorized5='N' ";
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
    leave_status = "  status='PEN' and ";
  }

  if (req.userIdentity.leave_authorize_privilege != "N") {
    _mysql
      .executeQuery({
        query:
          "SELECT hims_f_leave_application_id,LA.leave_application_code,LA.employee_id,\
        LA.application_date,LA.sub_department_id,LA.leave_id,LA.from_leave_session,\
        LA.from_date,LA.to_date,LA.to_leave_session,LA.leave_applied_from,\
        LA.total_applied_days,LA.total_approved_days,LA.`status`\
        ,L.leave_code,L.leave_description,L.leave_type,E.employee_code,\
        E.full_name as employee_name,E.religion_id,SD.sub_department_code,SD.sub_department_name \
        from hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
        and L.record_status='A' inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
        and E.record_status='A' inner join hims_d_sub_department SD \
        on LA.sub_department_id=SD.hims_d_sub_department_id  where " +
          leave_status +
          "" +
          auth_level +
          "" +
          range +
          "" +
          employee +
          "order by hims_f_leave_application_id desc",

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
      message: "you dont have admin privilege "
    };

    next();
    return;
  }
},

//created by irfan: update leave header
updateLeaveMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input =  req.body;
  if (input.hims_d_leave_id > 0) {
    _mysql
      .executeQuery({
        query:
        "UPDATE hims_d_leave SET leave_description=?,leave_category=?, calculation_type=?,include_weekoff=?,include_holiday=?,leave_mode=?,leave_status=?,leave_accrual=?,\
        leave_encash=?,leave_type=?,encashment_percentage=?,leave_carry_forward=?,carry_forward_percentage=?,religion_required=?,\
        religion_id=?,holiday_reimbursement=?,exit_permit_required=?,proportionate_leave=?,document_mandatory=?,\
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
          new Date(),
          req.userIdentity.algaeh_d_app_user_id,
          input.hims_d_leave_id
        ],

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
      message: "please provide valid input" 
    };

    next();
    return;
  }
},
//created by irfan: to get leave details
getLeaveDetailsMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.query.leave_id > 0) {
    _mysql
      .executeQuery({
        query:
          "Select hims_d_leave_detail_id, leave_header_id, employee_type,\
          gender, eligible_days, min_service_required, service_years,\
          once_life_term, allow_probation, max_number_days, mandatory_utilize_days\
          from hims_d_leave_detail where leave_header_id=?",

        values: [req.query.leave_id],

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
      message: "please provide valid input"
    };

    next();
    return;
  }
},
//created by irfan: to add leave detail
addLeaveDetailMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;
  if (input.leave_id > 0) {
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
      message: "please provide valid input"
    };

    next();
    return;
  }
},

//created by irfan:
deleteLeaveEncash: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.body.hims_d_leave_encashment_id > 0) {
    _mysql
      .executeQuery({
        query:
          "DELETE from  hims_d_leave_encashment WHERE hims_d_leave_encashment_id=?",
        values: [req.body.hims_d_leave_encashment_id],

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.body.hims_d_leave_rule_id > 0) {
    _mysql
      .executeQuery({
        query:
        "DELETE from  hims_d_leave_rule WHERE hims_d_leave_rule_id=?",
        values: [req.body.hims_d_leave_rule_id],

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.body.hims_d_leave_detail_id > 0) {
    _mysql
      .executeQuery({
        query:
        "DELETE from  hims_d_leave_detail WHERE hims_d_leave_detail_id=?",
        values: [req.body.hims_d_leave_detail_id],

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;
  if (input.leave_id > 0) {
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
      message: "please provide valid input"
    };

    next();
    return;
  }
},
//created by irfan: to addLeaveRulesMaster
addLeaveRulesMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;
  if (input.leave_id > 0) {
    _mysql
      .executeQuery({
        query:
        "INSERT  INTO hims_d_leave_rule ( leave_header_id,\
          calculation_type, earning_id,\
          paytype, from_value, to_value, value_type, total_days) values(\
           ?,?,?,?,?,?,?,?)",
        values:  [
          input.leave_id,
          input.calculation_type,
          input.earning_id,
          input.paytype,
          input.from_value,
          input.to_value,
          input.value_type,
          input.total_days
        ],

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
      message: "please provide valid input"
    };

    next();
    return;
  }
},


//created by irfan: to 
getLeaveEncashmentMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.query.leave_id > 0) {
    _mysql
      .executeQuery({
        query:
        "Select hims_d_leave_encashment_id, leave_header_id,\
        earnings_id, percent\
       from hims_d_leave_encashment where leave_header_id=?",

        values: [req.query.leave_id],

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
      message: "please provide valid input"
    };

    next();
    return;
  }
},
//created by irfan: to 
getLeaveRulesMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();

  if (req.query.leave_id > 0) {
    _mysql
      .executeQuery({
        query:
        "Select hims_d_leave_rule_id, leave_header_id, calculation_type,\
        earning_id, paytype, from_value, to_value, value_type, total_days\
       from hims_d_leave_rule where leave_header_id=?",

        values: [req.query.leave_id],

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
      message: "please provide valid input"
    };

    next();
    return;
  }
},

//created by irfan: 
updateLeaveDetailMaster: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input =  req.body;
  if (input.hims_d_leave_detail_id > 0) {
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

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input =  req.body;
  if (input.hims_d_leave_encashment_id > 0) {
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

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input =  req.body;
  if (input.hims_d_leave_rule_id > 0) {
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

        printQuery: true
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
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;
  if (input.hims_f_leave_application_id > 0) {
    _mysql
      .executeQuery({
        query:
          "select hims_f_leave_application_id,employee_id,authorized1,authorized2,\
          authorized3,`status`from hims_f_leave_application where authorized1='N' \
          and authorized2='N' and authorized3='N' and `status`='PEN' and employee_id=?\
          and hims_f_leave_application_id=?",
        values: [req.body.employee_id, req.body.hims_f_leave_application_id],

        printQuery: true
      })
      .then(result => {
      
        if (result.length > 0) {
          _mysql
            .executeQuery({
              query:
                "delete from hims_f_leave_application where hims_f_leave_application_id=?",
              values: [req.body.hims_f_leave_application_id],

              printQuery: true
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
cancelLeave: (req, res, next) => {
  const _mysql = new algaehMysql();
  const utilities = new algaehUtilities();
  let input = req.body;

  getMaxAuth({
    mysql: _mysql
  })
    .then(result => {
      if (req.userIdentity.leave_authorize_privilege == result.MaxLeave) {
        _mysql
          .executeQuery({
            query:
              "select hims_f_leave_application_id,leave_application_code ,`status`\
           from hims_f_leave_application where hims_f_leave_application_id=? ",
            values: [input.hims_f_leave_application_id],

            printQuery: true
          })
          .then(leaveStaus => {
            
          if(leaveStaus.length>0){
            if (leaveStaus[0]["status"] == "APR") {
              const month_number = moment(input.from_date).format("M");
              _mysql
                .executeQuery({
                  query:
                    "select hims_f_salary_id ,`month`,`year`,employee_id, salary_processed,salary_paid from \
                    hims_f_salary where `month`=? and `year`=? and employee_id=? ",
                  values: [month_number, input.year, input.employee_id],

                  printQuery: true
                })
                .then(salResult => {
                  utilities.logger().log("salResult: ", salResult);

                  if (
                    salResult.length < 1 ||
                    (salResult.length > 0 &&
                      salResult[0]["salary_processed"] == "N" &&
                      salResult[0]["salary_paid"] == "N")
                  ) {
                    //YOU CAN CANCEL

                    //------------------------------------------------------------------

                    calc(_mysql, req.body)
                      .then(deductionResult => {
                        if (deductionResult.invalid_input == true) {
                          _mysql.releaseConnection();


                          req.records = deductionResult;
                          next();
                          return;
                        } else {
                          utilities.logger().log("deductionResult: ", deductionResult);
                          return deductionResult;
                          
                        }
                      })
                      .then(deductionResult => {
                        utilities.logger().log("deductionResult 55: ", deductionResult);
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

                              printQuery: true
                            })
                            .then(monthlyLeaveData => {
                              let updateMonths = {};
                              let newCloseBal =
                                parseFloat(
                                  monthlyLeaveData[0]["close_balance"]
                                ) +
                                parseFloat(deductionResult.calculatedLeaveDays);
                              let newAvailTillDate =
                                parseFloat(
                                  monthlyLeaveData[0]["availed_till_date"]
                                ) -
                                parseFloat(deductionResult.calculatedLeaveDays);
                              for (
                                let i = 0;
                                i <
                                deductionResult
                                  .monthWiseCalculatedLeaveDeduction.length;
                                i++
                              ) {
                                Object.keys(monthlyLeaveData[0]).map(key => {
                                  // debugLog("ke:",key);
                                  // debugLog("m name",deductionResult.monthWiseCalculatedLeaveDeduction[i]["month_name"]);
                                  if (
                                    key ==
                                    deductionResult
                                      .monthWiseCalculatedLeaveDeduction[i][
                                      "month_name"
                                    ]
                                  ) {
                                    updateMonths = {
                                      ...updateMonths,
                                      [key]:
                                        parseFloat(monthlyLeaveData[0][key]) -
                                        parseFloat(
                                          deductionResult
                                            .monthWiseCalculatedLeaveDeduction[
                                            i
                                          ]["finalLeave"]
                                        )
                                    };
                                  }
                                });
                              }

                              //oooooooooooooooooooo

                              _mysql
                                .executeQueryWithTransaction({
                                  query:
                                    " update hims_f_leave_application set status='CAN',cancelled_date='" +
                                    moment().format("YYYY-MM-DD") +
                                    "',\
                                    cancelled_by=" +
                                    req.userIdentity.algaeh_d_app_user_id +
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

                                  printQuery: true
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
                message: "cant cancel,leave is not Approved yet"
              };
              next();
              return;
            }

          }
          else{

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

};












// finish





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
        _mysql.releaseConnection();
        reject(e);
      });
  });
}

 //created by irfan: to get database field for authrzation
function getLeaveAuthFields(auth_level) {


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
//created by irfan: to calculateLeaveDays internally
function calc(db, body) {
  try {
    return new Promise((resolve, reject) => {
      //  let db = null;
      let _mysql = db;
      let input = body;

    

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
     
      //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
      return new Promise((resolve, reject) => {
        try {
      

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

//created by irfan: to save valid leave Application
function saveF  (_mysql,req,  next,  input, msg){

 

  _mysql
  .generateRunningNumber({
    modules: ["EMPLOYEE_LEAVE"]
  })
  .then(numGenLeave => {

   
    _mysql
    .executeQuery({
      query:
      "INSERT INTO `hims_f_leave_application` (leave_application_code,employee_id,application_date,sub_department_id,leave_id,leave_type,\
        from_date,to_date,from_leave_session,to_leave_session,leave_applied_from,total_applied_days, created_date, created_by, updated_date, updated_by)\
        VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      values: [
        numGenLeave[0],
        input.employee_id,
        new Date(),
        input.sub_department_id,
        input.leave_id,
        input.leave_type,
        input.from_date,
        input.to_date,
        input.from_leave_session,
        input.to_leave_session,
        input.leave_applied_from,
        input.total_applied_days,
        new Date(),
        input.created_by,
        new Date(),
        input.updated_by
      ],

      printQuery: true
    })
    .then(result => {
      _mysql.commitTransaction(() => {
        _mysql.releaseConnection();
        req.records = result;
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




}


