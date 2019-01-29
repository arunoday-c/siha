//created by irfan:
let calculateLeaveDays = (req, res, next) => {
  try {
    let db = null;
    debugLog(" today");
    // debugLog("req.options:", req.body);
    // debugLog(" db:", db);

    let input = {};

    if (req.options == null) {
      input = extend({}, req.query);
    } else {
      input = extend({}, req.body);
    }

    debugLog("input:", input);

    let from_date = new Date(input.from_date).toLocaleString();
    let to_date = new Date(input.to_date).toLocaleString();
    let leave_applied_days = 0;
    let calculatedLeaveDays = 0;
    let session_diff = 0;
    let my_religion = input.religion_id;

    let from_month = moment(from_date).format("M");
    let to_month = moment(to_date).format("M");

    let year = moment(from_date).format("YYYY");
    debugLog("from_month:", from_month);
    debugLog("to_month:", to_month);

    debugLog("from_date:", from_date);
    debugLog("to_date:", to_date);

    let dateStart = moment(from_date);
    let dateEnd = moment(to_date);
    let dateRange = [];
    let currentClosingBal = 0;
    debugLog("dateStart:", dateStart);
    debugLog("dateEnd:", dateEnd);

    let leaveDeductionArray = [];
    //--- START OF-------calculate Half-day or Full-day from session

    if (input.from_date == input.to_date) {
      debugLog("same date:");
      if (input.from_session == "FH" && input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      } else if (input.from_session == "SH" && input.to_session == "SH") {
        session_diff += parseFloat(0.5);
      }
    } else {
      debugLog("not same date");
      if (input.from_session == "SH") {
        session_diff += parseFloat(0.5);
      }
      if (input.to_session == "FH") {
        session_diff += parseFloat(0.5);
      }
    }
    //--- END OF---------calculate Half-day or Full-day from session

    debugLog("session_diff:", session_diff);

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

    debugLog("dateRange:", dateRange);
    // ---END OF---------get month names and start_of_month and end_of_month number of days in a full month

    //---START OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range
    if (dateRange.length > 1) {
      for (let i = 0; i < dateRange.length; i++) {
        if (i == 0) {
          let end = moment(dateRange[i]["endOfMonth"]).format("YYYY-MM-DD");
          let start = moment(from_date).format("YYYY-MM-DD");

          debugLog("end:", end);
          debugLog("start:", start);

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
          let start = moment(dateRange[i]["startOfMonth"]).format("YYYY-MM-DD");
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
          debugLog("am three");
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
      debugLog("salman");
      let end = moment(to_date).format("YYYY-MM-DD");
      let start = moment(from_date).format("YYYY-MM-DD");

      debugLog("end:", end);
      debugLog("start:", start);

      leave_applied_days +=
        moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") + 1;
      extend(dateRange[0], {
        begning_of_leave: start,
        end_of_leave: end,
        leaveDays:
          moment(end, "YYYY-MM-DD").diff(moment(start, "YYYY-MM-DD"), "days") +
          1
      });

      calculatedLeaveDays = leave_applied_days;
    }

    //---END OF-------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range

    debugLog("dateRange:", dateRange);
    debugLog("leave_applied_days:", leave_applied_days);

    new Promise((resolve, reject) => {
      try {
        if (req.options == null) {
          req.db.getConnection((error, connection) => {
            if (error) {
              debugLog("eooeee");
              releaseDBConnection(req.db, connection);
              next(error);
            } else {
              db = connection;

              db.query(
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
                [
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
                (error, closeBalanceResult) => {
                  if (error) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  }

                  currentClosingBal = closeBalanceResult[0][0].close_balance;
                  debugLog("closeBalanceResult:", closeBalanceResult[0]);
                  debugLog("res1:", closeBalanceResult[0]);
                  debugLog("res2:", closeBalanceResult[1]);
                  debugLog("currentClosingBal:", currentClosingBal);
                  if (closeBalanceResult[1].length > 0) {
                    releaseDBConnection(req.db, db);
                    req.records = {
                      invalid_input: true,
                      message: `you cant apply leave,${
                        closeBalanceResult[1][0].holiday_date
                      } is holiday   `
                    };
                    next();
                    return;
                  }
                  resolve({ db });
                }
              );
            }
          });
        } else {
          db = req.options.db;
          debugLog("else db:", db);

          db.query(
            " select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date\
            from hims_f_employee_monthly_leave where      employee_id=? and year=? and leave_id=?",
            [input.employee_id, year, input.leave_id],
            (error, closeBalanceResult) => {
              if (error) {
                releaseDBConnection(req.db, db);
                next(error);
              }
              currentClosingBal = closeBalanceResult[0].close_balance;
              debugLog("closeBalanceResult:", closeBalanceResult);
              debugLog("currentClosingBal:", currentClosingBal);
              resolve({ db });
            }
          );
        }
      } catch (e) {
        reject(e);
      }
    }).then(result => {
      debugLog("my result:", result);

      //   "select L.hims_d_leave_id,L.leave_code,L.leave_description,LD.employee_type,hims_d_leave_detail_id,LD.gender,LD.eligible_days ,\
      //   L.include_weekoff,L.include_holiday from hims_d_leave  L \
      //   inner join hims_d_leave_detail LD on L.hims_d_leave_id=LD.leave_header_id  and L.record_status='A'\
      //   where hims_d_leave_detail_id=?",
      // input.hims_d_leave_detail_id,

      db.query(
        "select hims_d_leave_id,leave_code,leave_description,include_weekoff,\
        include_holiday from hims_d_leave where hims_d_leave_id=?  and record_status='A'",
        input.leave_id,
        (error, result) => {
          if (error) {
            if (req.options == null) {
              releaseDBConnection(req.db, db);
              next(error);
            } else {
              req.options.onFailure(result);
            }
          }
          debugLog("result:", result);

          // subtracting  week off or holidays fom LeaveApplied Days
          if (
            result.length > 0 &&
            (result[0].include_weekoff == "N" ||
              result[0].include_holiday == "N")
          ) {
            db.query(
              "select hims_d_holiday_id,holiday_date,holiday_description,weekoff,holiday,holiday_type,religion_id\
            from hims_d_holiday H where date(holiday_date) between date(?) and date(?) ;          ",

              [
                moment(from_date).format("YYYY-MM-DD"),
                moment(to_date).format("YYYY-MM-DD")
              ],
              (error, holidayResult) => {
                if (error) {
                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
                    next(error);
                  } else {
                    req.options.onFailure(holidayResult);
                  }
                }
                debugLog("holidayResult:", holidayResult);

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
                debugLog("total_weekOff:", total_weekOff);
                debugLog("total_holiday:", total_holiday);
                //dateRange.length

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

                debugLog("leaveDeductionArray:", leaveDeductionArray);
                debugLog("total_minus:", total_minus);

                //step3-------START OF------ finally  subtracting week off and holidays from total Applied days
                debugLog("total apllied days:", calculatedLeaveDays);
                if (result[0].include_weekoff == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_weekOff);
                  debugLog("after reducing weekoff:", calculatedLeaveDays);
                }

                if (result[0].include_holiday == "N") {
                  calculatedLeaveDays =
                    parseFloat(calculatedLeaveDays) - parseFloat(total_holiday);

                  debugLog("after reducnng holiday:", calculatedLeaveDays);
                }

                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

                //-------END OF------ finally  subtracting week off and holidays from total Applied days

                debugLog(
                  "after reducing weekoff and holdy and session:",
                  calculatedLeaveDays
                );
                debugLog("currentClosingBal:", currentClosingBal);
                if (currentClosingBal >= calculatedLeaveDays) {
                  debugLog("calculatedLeaveDays:", calculatedLeaveDays);

                  if (req.options == null) {
                    releaseDBConnection(req.db, db);
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
                    releaseDBConnection(req.db, db);
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
              }
            );
          }

          // dont subtract  week off or holidays fom LeaveApplied Days
          else if (result.length > 0) {
            for (let k = 0; k < dateRange.length; k++) {
              leaveDeductionArray.push({
                month_name: dateRange[k]["month_name"],
                finalLeave: dateRange[k]["leaveDays"]
              });

              // reduce_days = parseFloat(0);
            }
            debugLog("week off and holidaay included");
            debugLog("currentClosingBal:", currentClosingBal);
            //checking if he has enough eligible days
            if (currentClosingBal >= calculatedLeaveDays) {
              debugLog("calculatedLeaveDays:", calculatedLeaveDays);
              if (req.options == null) {
                releaseDBConnection(req.db, db);
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
                debugLog("updateResult", updateResult);
              }
            } else {
              if (req.options == null) {
                releaseDBConnection(req.db, db);
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
              releaseDBConnection(req.db, db);
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

          // req.records = result;
          // next();
        }
      );
    });
  } catch (e) {
    next(e);
  }
};
