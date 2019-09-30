import algaehMysql from "algaeh-mysql";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";

//created by irfan: to getEmployeeWeekOffsHolidays
function getEmployeeWeekOffsHolidays(
  from_date,
  to_date,
  employee,
  allHolidays
) {
  const utilities = new algaehUtilities();

  try {
    //ST ----------- CALCULATING WEEK OFF AND HOLIDAYS
    let emp_holidays = 0;

    if (
      employee["date_of_joining"] > from_date &&
      employee["exit_date"] == null
    ) {
      emp_holidays = new LINQ(allHolidays)
        .Where(
          w =>
            ((w.holiday == "Y" && w.holiday_type == "RE") ||
              (w.holiday == "Y" &&
                w.holiday_type == "RS" &&
                w.religion_id == employee["religion_id"]) ||
              w.weekoff === "Y") &&
            w.holiday_date > employee["date_of_joining"]
        )
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
        .ToArray();
    } else if (
      employee["exit_date"] < to_date &&
      employee["date_of_joining"] < from_date
    ) {
      //---------------

      emp_holidays = new LINQ(allHolidays)
        .Where(
          w =>
            ((w.holiday == "Y" && w.holiday_type == "RE") ||
              (w.holiday == "Y" &&
                w.holiday_type == "RS" &&
                w.religion_id == employee["religion_id"]) ||
              w.weekoff === "Y") &&
            w.holiday_date < employee["exit_date"]
        )
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
        .ToArray();
    } else if (
      employee["date_of_joining"] > from_date &&
      employee["exit_date"] < to_date
    ) {
      //---------------

      emp_holidays = new LINQ(allHolidays)
        .Where(
          w =>
            ((w.holiday == "Y" && w.holiday_type == "RE") ||
              (w.holiday == "Y" &&
                w.holiday_type == "RS" &&
                w.religion_id == employee["religion_id"]) ||
              w.weekoff === "Y") &&
            (w.holiday_date > employee["date_of_joining"] &&
              w.holiday_date < employee["exit_date"])
        )
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
        .ToArray();
    } else {
      emp_holidays = new LINQ(allHolidays)
        .Where(
          w =>
            (w.holiday == "Y" && w.holiday_type == "RE") ||
            ((w.holiday == "Y" &&
              w.holiday_type == "RS" &&
              w.religion_id == employee["religion_id"]) ||
              w.weekoff === "Y")
        )
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
        .ToArray();
    }

    //EN --------- CALCULATING WEEK OFF AND HOLIDAYS

    return emp_holidays;
  } catch (e) {
    utilities.logger().log("error rr 5: ", e);
  }
}

//created by irfan: to generate dates for shift roster
function getDays(start, end) {
  // const utilities = new algaehUtilities();
  try {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      const dat = new Date(dt);

      arr.push(moment(dat).format("YYYY-MM-DD"));
    }
    return arr;
  } catch (e) {
    throw e;
    // utilities.logger().log("error rr: ", e);
  }
}
export default {
  //created by irfan: to
  getEmployeesForShiftRosterbackup18_feb: (req, res, next) => {
    const utilities = new algaehUtilities();
    let subdept = "";
    let employee = "";
    let fromDate = moment(req.query.fromDate).format("YYYY-MM-DD");
    let toDate = moment(req.query.toDate).format("YYYY-MM-DD");
    let allEmployees = [];
    let allHolidays = [];
    let allLeaves = [];

    let outputArray = [];
    if (req.query.sub_department_id > 0) {
      subdept = ` and E.sub_department_id=${req.query.sub_department_id} `;
    }
    if (req.query.hims_d_employee_id > 0) {
      employee = ` and E.hims_d_employee_id=${req.query.hims_d_employee_id} `;
    }

    if (
      req.query.hospital_id > 0 &&
      req.query.fromDate != null &&
      req.query.toDate != null
    ) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select hims_d_employee_id,employee_code,full_name as employee_name,sub_department_id,\
         date_of_joining,exit_date ,religion_id, SD.sub_department_code,SD.sub_department_name ,D.designation_code,D.designation\
         from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
         left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
         where E.record_status='A' and E.employee_status='A' and E.hospital_id=? ${subdept} ${employee} ;\
         select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,\
        weekoff, holiday, holiday_type, religion_id from \
        hims_d_holiday where record_status='A' and   date(holiday_date) between date(?) and date(?) \
         and (weekoff='Y' or holiday='Y') and hospital_id=?;\         
         select hims_f_leave_application_id,employee_id,leave_id,leave_description,L.leave_type,from_date,to_date,\
         from_leave_session,to_leave_session,status\
          FROM hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
          where (status= 'APR' or status= 'PEN' )AND   ((from_date>= ? and from_date <= ?) or\
        (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?))`,
          values: [
            req.query.hospital_id,
            fromDate,
            toDate,
            req.query.hospital_id,
            fromDate,
            toDate,
            fromDate,
            toDate,
            fromDate,
            toDate
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          allEmployees = result[0];
          allHolidays = result[1];
          allLeaves = result[2];

          //utilities.logger().log("allLeaves: ", allLeaves);

          for (let i = 0; i < allEmployees.length; i++) {
            let holidays = new LINQ(allHolidays)
              .Where(
                w =>
                  ((w.holiday == "Y" && w.holiday_type == "RE") ||
                    (w.holiday == "Y" &&
                      w.holiday_type == "RS" &&
                      w.religion_id == allEmployees[i]["religion_id"]) ||
                    (w.weekoff == "Y" && w.holiday == "N")) &&
                  w.holiday_date > allEmployees[i]["date_of_joining"]
              )
              .Select(s => {
                return {
                  hims_d_holiday_id: s.hims_d_holiday_id,
                  holiday_date: s.holiday_date,
                  holiday_description: s.holiday_description,
                  weekoff: s.weekoff,
                  holiday: s.holiday,
                  holiday_type: s.holiday_type,
                  religion_id: s.religion_id
                };
              })
              .ToArray();

            let leaves = new LINQ(allLeaves)
              .Where(
                w => w.employee_id == allEmployees[i]["hims_d_employee_id"]
              )
              .Select(s => {
                return {
                  hims_f_leave_application_id: s.hims_f_leave_application_id,
                  employee_id: s.employee_id,
                  leave_id: s.leave_id,
                  leave_description: s.leave_description,
                  leave_type: s.leave_type,
                  from_date: s.from_date,
                  to_date: s.to_date,
                  from_leave_session: s.from_leave_session,
                  to_leave_session: s.to_leave_session,
                  status: s.status
                };
              })
              .ToArray();

            //------------for each leave

            let employeeLeaves = [];

            utilities.logger().log("leaves: ", leaves);

            if (leaves.length > 0) {
              for (let m = 0; m < leaves.length; m++) {
                let curentLeave = getDaysArray(
                  new Date(leaves[m]["from_date"]),
                  new Date(leaves[m]["to_date"])
                );
                // generate date range
                if (curentLeave.length > 0) {
                  for (let k = 0; k < curentLeave.length; k++) {
                    if (k == 0) {
                      if (k == 0 && k == curentLeave.length - 1) {
                        let temp = new LINQ([leaves[m]])
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select(s => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              to_leave_session: s.to_leave_session,
                              status: s.status
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      } else {
                        let temp = new LINQ([leaves[m]])
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select(s => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              status: s.status
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      }
                    } else if (k == curentLeave.length - 1) {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          w =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,
                            to_leave_session: s.to_leave_session,
                            status: s.status
                          };
                        })
                        .ToArray();

                      employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                    } else {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          w =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,

                            status: s.status
                          };
                        })
                        .ToArray();
                      employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                    }
                  }
                }
              }
            }
            outputArray.push({
              ...allEmployees[i],
              employeeLeaves,
              holidays
            });
          }

          req.records = outputArray;
          next();
        })
        .catch(e => {
          utilities.logger().log("error: ", e);
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
  getEmployeesForShiftRoster: (req, res, next) => {
    const utilities = new algaehUtilities();
    let subdept = "";
    let employee = "";
    let shiftRange = "";
    let fromDate = moment(req.query.fromDate).format("YYYY-MM-DD");
    let toDate = moment(req.query.toDate).format("YYYY-MM-DD");
    let allEmployees = [];
    let allHolidays = [];
    let allLeaves = [];
    let allShiftRoster = [];

    let outputArray = [];
    if (req.query.sub_department_id > 0) {
      subdept = ` and E.sub_department_id=${req.query.sub_department_id} `;
      shiftRange += ` and sub_department_id=${req.query.sub_department_id} `;
    }
    if (req.query.hims_d_employee_id > 0) {
      employee = ` and E.hims_d_employee_id=${req.query.hims_d_employee_id} `;
      shiftRange += ` and employee_id=${req.query.hims_d_employee_id} `;
    }

    if (
      req.query.hospital_id > 0 &&
      req.query.sub_department_id > 0 &&
      req.query.fromDate != null &&
      req.query.toDate != null
    ) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select hims_d_employee_id,employee_code,full_name as employee_name,sub_department_id,\
         date_of_joining,exit_date ,religion_id, SD.sub_department_code,SD.sub_department_name ,D.designation_code,D.designation\
         from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
         left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
         where E.record_status='A' and E.employee_status='A' and E.hospital_id=? ${subdept} ${employee} ;\
         select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,\
        weekoff, holiday, holiday_type, religion_id from \
        hims_d_holiday where record_status='A' and   date(holiday_date) between date(?) and date(?) \
         and (weekoff='Y' or holiday='Y') and hospital_id=?;\         
         select hims_f_leave_application_id,employee_id,leave_id,leave_description,L.leave_type,from_date,to_date,\
         from_leave_session,to_leave_session,status\
          FROM hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
          where (status= 'APR' or status= 'PEN' ) AND   ((from_date>= ? and from_date <= ?) or\
        (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?));           
        select hims_f_shift_roster_id,employee_id,shift_date,shift_id,shift_end_date, weekoff,holiday,
        shift_start_time,shift_end_time,shift_time,
        shift_code,shift_description,arabic_name,shift_status,in_time1,out_time1,
        in_time2,out_time2,break,break_start,break_end,shift_abbreviation,shift_end_day
        from hims_f_shift_roster SR inner join hims_d_shift S
        on SR.shift_id=S.hims_d_shift_id and S.record_status='A'
        where date(shift_date) between date(?) and date(?) ${shiftRange}`,
          values: [
            req.query.hospital_id,
            fromDate,
            toDate,
            req.query.hospital_id,
            fromDate,
            toDate,
            fromDate,
            toDate,
            fromDate,
            toDate,
            fromDate,
            toDate
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          allEmployees = result[0];
          allHolidays = result[1];
          allLeaves = result[2];
          allShiftRoster = result[3];

          //utilities.logger().log("allLeaves: ", allLeaves);

          for (let i = 0; i < allEmployees.length; i++) {
            let holidays = new LINQ(allHolidays)
              .Where(
                w =>
                  ((w.holiday == "Y" && w.holiday_type == "RE") ||
                    (w.holiday == "Y" &&
                      w.holiday_type == "RS" &&
                      w.religion_id == allEmployees[i]["religion_id"]) ||
                    (w.weekoff == "Y" && w.holiday == "N")) &&
                  w.holiday_date > allEmployees[i]["date_of_joining"]
              )
              .Select(s => {
                return {
                  hims_d_holiday_id: s.hims_d_holiday_id,
                  holiday_date: s.holiday_date,
                  holiday_description: s.holiday_description,
                  weekoff: s.weekoff,
                  holiday: s.holiday,
                  holiday_type: s.holiday_type,
                  religion_id: s.religion_id
                };
              })
              .ToArray();

            let leaves = new LINQ(allLeaves)
              .Where(
                w => w.employee_id == allEmployees[i]["hims_d_employee_id"]
              )
              .Select(s => {
                return {
                  hims_f_leave_application_id: s.hims_f_leave_application_id,
                  employee_id: s.employee_id,
                  leave_id: s.leave_id,
                  leave_description: s.leave_description,
                  leave_type: s.leave_type,
                  from_date: s.from_date,
                  to_date: s.to_date,
                  from_leave_session: s.from_leave_session,
                  to_leave_session: s.to_leave_session,
                  status: s.status
                };
              })
              .ToArray();

            let empShift = new LINQ(allShiftRoster)
              .Where(
                w => w.employee_id == allEmployees[i]["hims_d_employee_id"]
              )
              .Select(s => {
                return {
                  hims_f_shift_roster_id: s.hims_f_shift_roster_id,
                  employee_id: s.employee_id,
                  shift_date: s.shift_date,
                  shift_id: s.shift_id,
                  shift_end_date: s.shift_end_date,
                  shift_start_time: s.shift_start_time,
                  shift_end_time: s.shift_end_time,
                  shift_time: s.shift_time,
                  hims_d_shift_id: s.hims_d_shift_id,
                  shift_code: s.shift_code,
                  shift_description: s.shift_description,
                  arabic_name: s.arabic_name,
                  shift_status: s.shift_status,
                  in_time1: s.in_time1,
                  out_time1: s.out_time1,
                  in_time2: s.in_time2,
                  out_time2: s.out_time2,
                  break: s.break,
                  break_start: s.break_start,
                  break_end: s.break_end,
                  shift_abbreviation: s.shift_abbreviation,
                  shift_end_day: s.shift_end_day,
                  weekoff: s.weekoff,
                  holiday: s.holiday
                };
              })
              .ToArray();

            //------------for each leave

            let employeeLeaves = [];

            utilities.logger().log("leaves: ", leaves);

            if (leaves.length > 0) {
              for (let m = 0; m < leaves.length; m++) {
                let curentLeave = getDaysArray(
                  new Date(leaves[m]["from_date"]),
                  new Date(leaves[m]["to_date"])
                );
                // generate date range
                if (curentLeave.length > 0) {
                  for (let k = 0; k < curentLeave.length; k++) {
                    if (k == 0) {
                      if (k == 0 && k == curentLeave.length - 1) {
                        let temp = new LINQ([leaves[m]])
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select(s => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              to_leave_session: s.to_leave_session,
                              status: s.status
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      } else {
                        let temp = new LINQ([leaves[m]])
                          .Where(
                            w =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select(s => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              status: s.status
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      }
                    } else if (k == curentLeave.length - 1) {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          w =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,
                            to_leave_session: s.to_leave_session,
                            status: s.status
                          };
                        })
                        .ToArray();

                      employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                    } else {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          w =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select(s => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,

                            status: s.status
                          };
                        })
                        .ToArray();
                      employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                    }
                  }
                }
              }
            }

            outputArray.push({
              ...allEmployees[i],
              employeeLeaves,
              holidays,
              empShift
            });
          }

          req.records = outputArray;
          next();
        })
        .catch(e => {
          utilities.logger().log("error: ", e);
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Select Branch & Department"
      };
      next();
      return;
    }
  },

  //created by irfan:
  addShiftRoster: (req, res, next) => {
    const utilities = new algaehUtilities();
    const _mysql = new algaehMysql();
    let input = req.body;

    let dateRange = getDays(new Date(input.from_date), new Date(input.to_date));
    utilities.logger().log("dateRange: ", dateRange);

    let insertArray = [];

    _mysql
      .executeQuery({
        query:
          "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
        religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?",
        values: [input.from_date, input.to_date, input.hospital_id],

        printQuery: true
      })
      .then(holidayResult => {
        for (let emp = 0; emp < input.employees.length; emp++) {
          let empHoliday = getEmployeeWeekOffsHolidays(
            input.from_date,
            input.to_date,
            input.employees[emp],
            holidayResult
          );

          for (let i = 0; i < dateRange.length; i++) {
            if (
              dateRange[i] >= input.employees[emp]["date_of_joining"] &&
              (input.employees[emp]["exit_date"] == null ||
                input.employees[emp]["exit_date"] < dateRange[i])
            ) {
              let week_off_Data = new LINQ(empHoliday)
                .Where(w => w.holiday_date == dateRange[i])
                .Select(s => {
                  return {
                    weekoff: s.weekoff,
                    holiday: s.holiday
                  };
                })
                .FirstOrDefault({
                  weekoff: "N",
                  holiday: "N"
                });

              if (week_off_Data.weekoff === "Y") {
                week_off_Data = {
                  ...week_off_Data,
                  shift_id: 100,
                  shift_start_time: 0,
                  shift_end_time: 0,
                  shift_time: 0
                };
              } else if (week_off_Data.holiday === "Y") {
                week_off_Data = {
                  ...week_off_Data,
                  shift_id: 101,

                  shift_start_time: 0,
                  shift_end_time: 0,
                  shift_time: 0
                };
              } else if (input.shift_id == 100) {
                week_off_Data = {
                  weekoff: "Y",
                  holiday: "N",
                  shift_id: input.shift_id,
                  shift_start_time: 0,
                  shift_end_time: 0,
                  shift_time: 0
                };
              } else if (input.shift_id == 101) {
                week_off_Data = {
                  weekoff: "N",
                  holiday: "Y",
                  shift_id: input.shift_id,
                  shift_start_time: 0,
                  shift_end_time: 0,
                  shift_time: 0
                };
              } else {
                week_off_Data = {
                  ...week_off_Data,
                  shift_id: input.shift_id,
                  shift_start_time: input.shift_start_time,
                  shift_end_time: input.shift_end_time,
                  shift_time: input.shift_time
                };
              }

              if (input.shift_end_day == "SD") {
                insertArray.push({
                  shift_date: dateRange[i],
                  shift_end_date: dateRange[i],
                  employee_id: input.employees[emp]["hims_d_employee_id"],
                  sub_department_id: input.employees[emp]["sub_department_id"],
                  ...week_off_Data
                });
              } else if (input.shift_end_day == "ND") {
                insertArray.push({
                  shift_date: dateRange[i],
                  shift_end_date: moment(dateRange[i], "YYYY-MM-DD")
                    .add(1, "days")
                    .format("YYYY-MM-DD"),
                  employee_id: input.employees[emp]["hims_d_employee_id"],
                  sub_department_id: input.employees[emp]["sub_department_id"],
                  sub_department_id: input.employees[emp]["sub_department_id"],
                  ...week_off_Data
                });
              }
            }
          }
        }
        //INSERT INTO `hims_f_shift_roster` employee_id,shift_date,shift_end_date values(?,?,?)
        utilities.logger().log("insertArray: ", insertArray);
        _mysql
          .executeQuery({
            query:
              "INSERT INTO `hims_f_shift_roster` (??) VALUES ? ON DUPLICATE KEY UPDATE shift_id=values(shift_id),shift_end_date=values(shift_end_date),\
            shift_start_time=values(shift_start_time),shift_end_time=values(shift_end_time),shift_time=values(shift_time),\
            weekoff=values(weekoff),holiday=values(holiday) ",
            values: insertArray,
            bulkInsertOrUpdate: true
          })
          .then(result => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch(e => {
            utilities.logger().log("emm: ", e);
            _mysql.releaseConnection();
            next(e);
          });
      })
      .catch(e => {
        utilities.logger().log("e: ", e);
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  deleteShiftRoster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    if (input.hims_f_shift_roster_id > 0) {
      _mysql
        .executeQuery({
          query:
            "delete from hims_f_shift_roster where hims_f_shift_roster_id = ?",
          values: [input.hims_f_shift_roster_id]
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
        message: "Please send valid input"
      };
      next();
    }
  },
  //created by irfan:
  pasteRoster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_shift_roster` (employee_id,sub_department_id,shift_date,shift_id,shift_end_date,\
          shift_start_time,shift_end_time,shift_time,weekoff,holiday,hospital_id) values(?,?,?,?,?,?,?,?,?,?,?)\
           ON DUPLICATE KEY UPDATE shift_id=?, sub_department_id=?,shift_end_date=?,\
          shift_start_time=?,shift_end_time=?,shift_time=?,weekoff=?,holiday=?",
        values: [
          input.employee_id,
          input.sub_department_id,
          input.shift_date,
          input.shift_id,
          input.shift_end_date,
          input.shift_start_time,
          input.shift_end_time,
          input.shift_time,
          input.weekoff,
          input.holiday,
          input.hospital_id,

          input.shift_id,
          input.sub_department_id,
          input.shift_end_date,
          input.shift_start_time,
          input.shift_end_time,
          input.shift_time,
          input.weekoff,
          input.holiday
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
  },
  getEmployeeWeekOffsHolidays,
  getDays
};

//created by irfan: to generate dates leave
function getDaysArray(start, end) {
  const utilities = new algaehUtilities();

  try {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      const dat = new Date(dt);

      arr.push({ leaveDate: dat });
    }

    return arr;
  } catch (e) {
    utilities.logger().log("error rr: ", e);
  }
}
