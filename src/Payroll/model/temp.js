//created by irfan: to
calculateLeaveDays: (req, res, next) => {
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
    //EN OF------calculate begning_of_leave and end_of_leave and leaveDays in leaveDates Range

    _mysql
      .executeQuery({
        query:
          "select hims_f_employee_monthly_leave_id, total_eligible,close_balance, availed_till_date,\
        leave_id,L.leave_description,include_weekoff,include_holiday from hims_f_employee_monthly_leave ML\
        inner join hims_d_leave L on ML.leave_id=L.hims_d_leave_id where employee_id=? and year=? and\
        leave_id=? and L.record_status='A';select hims_d_holiday_id,holiday_date,holiday_description,weekoff,\
        holiday,holiday_type,religion_id  from hims_d_holiday  where date(holiday_date) between date(?) and date(?) ",
        values: [input.employee_id, year, input.leave_id, from_date, to_date],

        printQuery: true
      })
      .then(result => {
        allLeaves = result[0];
        allHolidays = result[1];
        currentClosingBal = allLeaves[0].close_balance;

        if (allLeaves.length > 0) {
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

          utilities.logger().log("allHolidays: ", allHolidays);
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
              message: `you cant apply leave, ${
                isHoliday[0].holiday_date
              } is : ${isHoliday[0].holiday_description}`
            };
            next();
            return;
          } else {
            utilities.logger().log("gggg: ", from_date);

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
                          dateRange[k]["begning_of_leave"] <= w.holiday_date &&
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
                          dateRange[k]["begning_of_leave"] <= w.holiday_date &&
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

              if (allLeaves[0].include_weekoff == "N") {
                include_week_offs = "N";
                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(total_weekOff);
              }

              if (allLeaves[0].include_holiday == "N") {
                include_holidays = "N";
                calculatedLeaveDays =
                  parseFloat(calculatedLeaveDays) - parseFloat(total_holiday);
              }

              calculatedLeaveDays =
                parseFloat(calculatedLeaveDays) - parseFloat(session_diff);

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
              } else {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                };
                next();
                return;
              }
            } else {
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
              } else {
                _mysql.releaseConnection();
                req.records = {
                  invalid_input: true,
                  message: `you dont have enough leaves for :${
                    result[0]["leave_description"]
                  } `
                };
                next();
                return;
              }
            }
          }
        } else {
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
  } catch (e) {
    next(e);
  }
};
