import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";
import shift_roster from "./shift_roster";

const { getEmployeeWeekOffsHolidays, getDays } = shift_roster;

export default {
  getDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();

      let _strQuery = "";
      if (req.query.division_id != null) {
        _strQuery = "and division_id = " + req.query.division_id;
      }

      _mysql
        .executeQuery({
          query:
            "select hims_m_division_project_id, division_id, project_id, d_p_status, DP.inactive_date, \
            P.start_date, P.end_date, P.project_desc,P.hims_d_project_id from hims_m_division_project DP, \
            hims_d_project P where DP.project_id=P.hims_d_project_id " +
            _strQuery +
            " order by hims_m_division_project_id desc;",
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  addDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "INSERT  INTO hims_m_division_project(division_id,project_id,\
            created_date,created_by,updated_date,updated_by) \
            values(?,?,?,?,?,?)",
          values: [
            input.division_id,
            input.project_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  deleteDivisionProject: (req, res, next) => {
    try {
      const _mysql = new algaehMysql();
      let input = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "DELETE FROM hims_m_division_project WHERE hims_m_division_project_id = ?",
          values: [input.hims_m_division_project_id],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by irfan: to
  getEmployeesForProjectRosterOLD: (req, res, next) => {
    const input = req.query;
    const utilities = new algaehUtilities();
    let subdept = "";
    let employee = "";
    let designation = "";
    let fromDate = moment(input.fromDate).format("YYYY-MM-DD");
    let toDate = moment(input.toDate).format("YYYY-MM-DD");
    let allEmployees = [];
    let allHolidays = [];
    let allLeaves = [];
    let allProjects = [];

    let outputArray = [];

    if (input.department_id > 0) {
      subdept += ` and SD.department_id=${input.department_id} `;
    }

    if (input.sub_department_id > 0) {
      subdept += ` and E.sub_department_id=${input.sub_department_id} `;
    }
    if (input.hims_d_employee_id > 0) {
      employee = ` and E.hims_d_employee_id=${input.hims_d_employee_id} `;
    }
    if (input.designation_id > 0) {
      designation = ` and E.employee_designation_id=${input.designation_id} `;
    }

    if (
      input.hospital_id > 0 &&
      (input.department_id > 0 || input.sub_department_id > 0) &&
      input.fromDate != null &&
      input.toDate != null
    ) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select hims_d_employee_id,employee_code,full_name as employee_name,sub_department_id,\
           date_of_joining,exit_date ,religion_id, SD.sub_department_code,SD.sub_department_name ,D.designation_code,D.designation\
           from hims_d_employee E inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
           inner join hims_d_department DP on SD.department_id=DP.hims_d_department_id\
           left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id\
           where E.record_status='A' and E.employee_status='A' and E.hospital_id=? ${subdept} ${designation} ${employee} ;\
           select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,\
          weekoff, holiday, holiday_type, religion_id from \
          hims_d_holiday where record_status='A' and   date(holiday_date) between date(?) and date(?) \
           and (weekoff='Y' or holiday='Y') and hospital_id=?;\
           select hims_f_leave_application_id,employee_id,leave_id,leave_description,L.leave_type,from_date,to_date,\
           from_leave_session,to_leave_session,status\
            FROM hims_f_leave_application LA inner join hims_d_leave L on LA.leave_id=L.hims_d_leave_id\
            inner join hims_d_employee E on LA.employee_id=E.hims_d_employee_id \
            inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id\
            inner join hims_d_department DP on SD.department_id=DP.hims_d_department_id\
            where (status= 'APR' or status= 'PEN' )AND   ((from_date>= ? and from_date <= ?) or\
          (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)) and LA.hospital_id=?;
          select hims_f_project_roster_id,employee_id,PR.hospital_id,attendance_date,project_id ,abbreviation,
           project_desc,project_code,start_date,end_date
        from hims_f_project_roster PR inner join hims_d_project P   on PR.project_id = P.hims_d_project_id
        inner join hims_d_employee E on PR.employee_id=E.hims_d_employee_id
        inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
        inner join hims_d_department DP on SD.department_id=DP.hims_d_department_id
        where PR.hospital_id=? and P.record_status='A' and  date(attendance_date) between date(?) and date(?) ${subdept} ${designation} ${employee} ;`,
          values: [
            input.hospital_id,
            fromDate,
            toDate,
            input.hospital_id,
            fromDate,
            toDate,
            fromDate,
            toDate,
            fromDate,
            toDate,
            input.hospital_id,
            input.hospital_id,
            fromDate,
            toDate,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          allEmployees = result[0];
          allHolidays = result[1];
          allLeaves = result[2];
          allProjects = result[3];

          //utilities.logger().log("allProjects: ", allProjects);

          for (let i = 0; i < allEmployees.length; i++) {
            let holidays = new LINQ(allHolidays)
              .Where(
                (w) =>
                  ((w.holiday == "Y" && w.holiday_type == "RE") ||
                    (w.holiday == "Y" &&
                      w.holiday_type == "RS" &&
                      w.religion_id == allEmployees[i]["religion_id"]) ||
                    (w.weekoff == "Y" && w.holiday == "N")) &&
                  w.holiday_date > allEmployees[i]["date_of_joining"]
              )
              .Select((s) => {
                return {
                  hims_d_holiday_id: s.hims_d_holiday_id,
                  holiday_date: s.holiday_date,
                  holiday_description: s.holiday_description,
                  weekoff: s.weekoff,
                  holiday: s.holiday,
                  holiday_type: s.holiday_type,
                  religion_id: s.religion_id,
                };
              })
              .ToArray();

            let leaves = new LINQ(allLeaves)
              .Where(
                (w) => w.employee_id == allEmployees[i]["hims_d_employee_id"]
              )
              .Select((s) => {
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
                  status: s.status,
                };
              })
              .ToArray();

            let empProject = new LINQ(allProjects)
              .Where(
                (w) => w.employee_id == allEmployees[i]["hims_d_employee_id"]
              )
              .Select((s) => {
                return {
                  hims_f_project_roster_id: s.hims_f_project_roster_id,
                  employee_id: s.employee_id,
                  attendance_date: s.attendance_date,
                  project_id: s.project_id,
                  project_desc: s.project_desc,
                  project_code: s.project_code,
                  abbreviation: s.abbreviation,
                  start_date: s.start_date,
                  end_date: s.end_date,
                };
              })
              .ToArray();

            // utilities.logger().log("Projects: ", empProject);

            //------------for each leave
            let employeeLeaves = [];

            // utilities.logger().log("leaves: ", leaves);

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
                            (w) =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select((s) => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              to_leave_session: s.to_leave_session,
                              status: s.status,
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      } else {
                        let temp = new LINQ([leaves[m]])
                          .Where(
                            (w) =>
                              w.employee_id ==
                              allEmployees[i]["hims_d_employee_id"]
                          )
                          .Select((s) => {
                            return {
                              hims_f_leave_application_id:
                                s.hims_f_leave_application_id,
                              employee_id: s.employee_id,
                              leave_id: s.leave_id,
                              leave_description: s.leave_description,
                              leave_type: s.leave_type,
                              from_leave_session: s.from_leave_session,
                              status: s.status,
                            };
                          })
                          .ToArray();

                        employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                      }
                    } else if (k == curentLeave.length - 1) {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          (w) =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select((s) => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,
                            to_leave_session: s.to_leave_session,
                            status: s.status,
                          };
                        })
                        .ToArray();

                      employeeLeaves.push({ ...temp[0], ...curentLeave[k] });
                    } else {
                      let temp = new LINQ([leaves[m]])
                        .Where(
                          (w) =>
                            w.employee_id ==
                            allEmployees[i]["hims_d_employee_id"]
                        )
                        .Select((s) => {
                          return {
                            hims_f_leave_application_id:
                              s.hims_f_leave_application_id,
                            employee_id: s.employee_id,
                            leave_id: s.leave_id,
                            leave_description: s.leave_description,
                            leave_type: s.leave_type,

                            status: s.status,
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
              empProject,
            });
          }

          req.records = outputArray;
          next();
        })
        .catch((e) => {
          utilities.logger().log("error: ", e);
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Select Branch &  Department",
      };
      next();
      return;
    }
  },
  //created by irfan: to
  getEmployeesForProjectRoster: (req, res, next) => {
    const input = req.query;
    // const utilities = new algaehUtilities();

    let fromDate = moment(input.fromDate, "YYYY-MM-DD").format("YYYYMMDD");
    let toDate = moment(input.toDate, "YYYY-MM-DD").format("YYYYMMDD");

    // let outputArray = [];

    let strQry = "";

    if (input.hims_d_employee_id > 0) {
      strQry += " and E.hims_d_employee_id=" + input.hims_d_employee_id;
    }

    if (input.department_id > 0) {
      strQry += " and SD.department_id=" + input.department_id;
    }
    if (input.sub_department_id > 0) {
      strQry += " and E.sub_department_id=" + input.sub_department_id;
    }
    if (input.designation_id > 0) {
      strQry += " and E.employee_designation_id=" + input.designation_id;
    }
    if (input.employee_group_id > 0) {
      strQry += " and E.employee_group_id=" + input.employee_group_id;
    }

    if (input.hospital_id > 0 && fromDate > 0 && toDate > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query: `select PR.hims_f_project_roster_id, E.hims_d_employee_id as employee_id,PR.attendance_date,P.abbreviation,E.employee_code,E.full_name,E.sub_department_id,
        E.religion_id,E.exit_date, E.date_of_joining,PR.project_id,P.project_desc,D.designation
        from hims_d_employee E left join    hims_f_project_roster PR on E.hims_d_employee_id=PR.employee_id
        and (PR.attendance_date is null or  PR.attendance_date between date(?) and date(?))
        left join  hims_d_project P on P.hims_d_project_id=PR.project_id
        inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
        left join  hims_d_designation D on D.hims_d_designation_id=E.employee_designation_id
        where E.hospital_id=? and E.record_status='A' and E.employee_status='A' ${strQry}
        order by hims_d_employee_id ;
        select hims_f_leave_application_id,employee_id,leave_application_code,from_leave_session,status,
        from_date,to_leave_session,to_date,holiday_included,weekoff_included,total_applied_days
        from hims_f_leave_application LA inner join hims_d_leave L on 	LA.leave_id=L.hims_d_leave_id
        inner join  hims_d_employee E on LA.employee_id=E.hims_d_employee_id
        inner join hims_d_sub_department SD on E.sub_department_id=SD.hims_d_sub_department_id
        left join  hims_d_designation D on D.hims_d_designation_id=E.employee_designation_id
        where    E.hospital_id=?    ${strQry.replace(
          /PR/gi,
          "LA"
        )} and (status= 'APR' or status= 'PEN' ) and
          (    (  date(?)>=date(from_date) and	date(?)<=date(to_date)) or
          ( date(?)>=date(from_date) and   date(?)<=date(to_date))
        or (date(from_date)>= date(?) and date(from_date)<=date(?) ) or
        (date(to_date)>=date(?) and date(to_date)<= date(?) ))  ;
        select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,
        weekoff, holiday, holiday_type, religion_id from
        hims_d_holiday where record_status='A' and   date(holiday_date) between date(?) and date(?)
         and (weekoff='Y' or holiday='Y') and hospital_id=?;

        `,
          values: [
            input.fromDate,
            input.toDate,
            input.hospital_id,
            input.hospital_id,
            input.fromDate,
            input.fromDate,
            input.toDate,
            input.toDate,
            input.fromDate,
            input.toDate,
            input.fromDate,
            input.toDate,
            input.fromDate,
            input.toDate,
            input.hospital_id,
          ],
          printQuery: false,
        })
        .then((result) => {
          _mysql.releaseConnection();

          if (result[0].length > 0) {
            const final_roster = [];
            const allLeaves = result[1];
            const allHolidays = result[2];

            const allDates = getDaysArray2(
              new Date(input.fromDate),
              new Date(input.toDate)
            );
            let total_rosetd = 0;
            let total_non_rosted = 0;

            const allEmployees = _.chain(result[0])
              .groupBy((g) => g.employee_id)
              .map((emp) => {
                // utilities.logger().log("emp: ", emp);

                //if employee doesnt have sigle roster
                if (emp.length == 1 && emp[0]["attendance_date"] == null) {
                  const employ = emp[0];
                  emp = [];

                  allDates.forEach((dat) => {
                    const ProjAssgned = emp.find((e) => {
                      return e.attendance_date == dat;
                    });

                    if (ProjAssgned == undefined) {
                      emp.push({
                        employee_id: employ.employee_id,
                        attendance_date: dat,
                        employee_code: employ.employee_code,
                        full_name: employ.full_name,
                        sub_department_id: employ.sub_department_id,
                        religion_id: employ.religion_id,
                        date_of_joining: employ.date_of_joining,
                        project_id: null,
                        project_desc: null,
                        abbreviation: null,
                        designation: employ.designation,
                        exit_date: employ.exit_date,
                        hims_f_project_roster_id: null,
                      });
                    }
                  });
                } else {
                  allDates.forEach((dat) => {
                    const ProjAssgned = emp.find((e) => {
                      return e.attendance_date == dat;
                    });

                    if (ProjAssgned == undefined) {
                      emp.push({
                        employee_id: emp[0].employee_id,
                        attendance_date: dat,
                        employee_code: emp[0].employee_code,
                        full_name: emp[0].full_name,
                        sub_department_id: emp[0].sub_department_id,
                        religion_id: emp[0].religion_id,
                        date_of_joining: emp[0].date_of_joining,
                        project_id: null,
                        project_desc: null,
                        abbreviation: null,
                        designation: emp[0].designation,
                        exit_date: emp[0].exit_date,
                        hims_f_project_roster_id: null,
                      });
                    }
                  });
                }

                const rosterAssigned = _.find(emp, (f) => f.project_id == null);

                if (rosterAssigned == undefined) {
                  total_rosetd = total_rosetd + 1;
                } else {
                  total_non_rosted = total_non_rosted + 1;
                }
                return emp;
              })
              .value();

            //----------------------------------------------------

            allEmployees.forEach((employee) => {
              const outputArray = [];
              let empHolidayweekoff = getEmployeeWeekOffsHolidays(
                input.from_date,
                input.to_date,
                employee[0],
                allHolidays
              );

              const empLeave = new LINQ(allLeaves)
                .Where((w) => w.employee_id == employee[0].employee_id)
                .Select((s) => s)
                .ToArray();

              employee.forEach((row, i) => {
                let leave = null;
                if (empLeave.length > 0) {
                  leave = new LINQ(empLeave)
                    .Where(
                      (w) =>
                        w.from_date <= row["attendance_date"] &&
                        w.to_date >= row["attendance_date"]
                    )
                    .Select((s) => {
                      return {
                        holiday_included: s.holiday_included,
                        weekoff_included: s.weekoff_included,
                        hospital_id: input.branch_id,
                        employee_id: row.employee_id,
                        project_id: row.project_id,
                        project_desc: row.project_desc,
                        full_name: row.full_name,
                        sub_department_id: row.sub_department_id,
                        employee_code: row.employee_code,
                        attendance_date: row["attendance_date"],
                        status: s.status,
                        designation: row.designation,
                      };
                    })
                    .FirstOrDefault(null);
                }

                const holiday_or_weekOff = new LINQ(empHolidayweekoff)
                  .Where((w) => w.holiday_date == row["attendance_date"])
                  .Select((s) => {
                    return {
                      holiday: s.holiday,
                      weekoff: s.weekoff,
                    };
                  })
                  .FirstOrDefault(null);

                //----------------------------

                if (
                  (holiday_or_weekOff == null && leave != null) ||
                  (leave != null &&
                    holiday_or_weekOff != null &&
                    holiday_or_weekOff.holiday == "Y" &&
                    leave.holiday_included == "Y") ||
                  (leave != null &&
                    holiday_or_weekOff != null &&
                    holiday_or_weekOff.weekoff == "Y" &&
                    leave.weekoff_included == "Y")
                ) {
                  outputArray.push({
                    hims_f_project_roster_id: row.hims_f_project_roster_id,
                    project_id: row.project_id,
                    project_desc: row.project_desc,
                    abbreviation: row.abbreviation,
                    attendance_date: leave.attendance_date,
                    status: leave.status,
                  });
                } else if (holiday_or_weekOff != null) {
                  if (holiday_or_weekOff.weekoff == "Y") {
                    outputArray.push({
                      hims_f_project_roster_id: row.hims_f_project_roster_id,
                      project_id: row.project_id,
                      project_desc: row.project_desc,
                      abbreviation: row.abbreviation,
                      attendance_date: row["attendance_date"],

                      status: "WO",
                    });
                  } else if (holiday_or_weekOff.holiday == "Y") {
                    outputArray.push({
                      hims_f_project_roster_id: row.hims_f_project_roster_id,
                      project_id: row.project_id,
                      project_desc: row.project_desc,
                      abbreviation: row.abbreviation,
                      attendance_date: row["attendance_date"],

                      status: "HO",
                    });
                  } else {
                    outputArray.push({
                      hims_f_project_roster_id: row.hims_f_project_roster_id,
                      project_id: row.project_id,
                      project_desc: row.project_desc,
                      abbreviation: row.abbreviation,
                      attendance_date: row["attendance_date"],
                      status: row.project_id > 0 ? "PA" : "N",
                    });
                  }
                } else {
                  outputArray.push({
                    hims_f_project_roster_id: row.hims_f_project_roster_id,
                    project_id: row.project_id,
                    project_desc: row.project_desc,
                    abbreviation: row.abbreviation,
                    attendance_date: row["attendance_date"],
                    status: row.project_id > 0 ? "PA" : "N",
                  });
                }
              });
              const projectList = _.sortBy(outputArray, (s) =>
                parseInt(moment(s.attendance_date, "YYYY-MM-DD").format("MMDD"))
              );

              final_roster.push({
                hims_f_project_roster_id: employee[0].hims_f_project_roster_id,
                hims_d_employee_id: employee[0].employee_id,
                employee_name: employee[0].full_name,
                employee_code: employee[0].employee_code,
                sub_department_name: employee[0].sub_department_name,
                date_of_joining: employee[0].date_of_joining,
                designation: employee[0].designation,
                exit_date: employee[0].exit_date,

                projects: projectList,
              });
            });
            //----------------------------------------------------

            req.records = {
              datesArray: allDates,
              roster: final_roster,
              total_rosted: total_rosetd,
              total_non_rosted: total_non_rosted,
            };
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "No Employee Exist",
            };
            next();
            return;
          }
        })
        .catch((e) => {
          utilities.logger().log("error: ", e);
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Select Branch & Department",
      };
      next();
      return;
    }
  },

  //created by Adnan:
  deleteProjectRoster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    if (input.hims_f_project_roster_id > 0) {
      _mysql
        .executeQuery({
          query:
            "delete from hims_f_project_roster where hims_f_project_roster_id = ?",
          values: [input.hims_f_project_roster_id],
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please send valid input",
      };
      next();
    }
  },
  addProjectRosterOLD: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    try {
      let input = req.body;
      if (!moment(input.from_date).isValid) {
        next(
          utilities
            .httpStatus()
            .generateError(
              utilities.httpStatus().badRequest,
              "Date range is invalid"
            )
        );
        return;
      }
      if (!moment(input.to_date).isValid) {
        next(
          utilities
            .httpStatus()
            .generateError(
              utilities.httpStatus().badRequest,
              "Date range is invalid"
            )
        );
        return;
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_holiday_id, hospital_id, holiday_date, holiday_description,weekoff, holiday, holiday_type,\
        religion_id from hims_d_holiday where record_status='A' and date(holiday_date) between date(?) and date(?) and hospital_id=?",
          values: [input.from_date, input.to_date, input.hospital_id],
        })
        .then((holidayResult) => {
          let _days = [];
          if (input.employees.length > 0) {
            _days = getDays(
              moment(input.from_date)._d,
              moment(input.to_date)._d
            );
          }
          let insertData = "";
          const _employees = input.employees.map((employee, index) => {
            let empHoliday = getEmployeeWeekOffsHolidays(
              input.from_date,
              input.to_date,
              employee,
              holidayResult
            );
            _days.map((date) => {
              if (
                moment(date).format("YYYYMMDD") >=
                  moment(employee["date_of_joining"]).format("YYYYMMDD") &&
                (employee["exit_date"] == null ||
                  moment(employee["exit_date"]).format("YYYYMMDD") <
                    moment(date).format("YYYYMMDD"))
              ) {
                const week_off_Data = _.find(empHoliday, (f) => {
                  return (
                    moment(f.holiday_date).format("YYYYMMDD") ==
                    moment(date).format("YYYYMMDD")
                  );
                });
                if (
                  week_off_Data == null ||
                  week_off_Data.weekoff == "N" ||
                  week_off_Data.holiday == "N"
                ) {
                  const _leave = _.find(employee["employeeLeaves"], (l) => {
                    return (
                      moment(l["leaveDate"]).format("YYYYMMDD") ==
                      moment(date).format("YYYYMMDD")
                    );
                  });
                  insertData += _mysql.mysqlQueryFormat(
                    "insert into hims_f_project_roster(`employee_id`,\
                  `attendance_date`,`project_id`,`hims_f_leave_application_id`,hospital_id) \
                  values(?,?,?,?,?);",
                    [
                      employee["hims_d_employee_id"],
                      moment(date)._d,
                      input.project_id,
                      _leave != null
                        ? _leave.hims_f_leave_application_id
                        : null,
                      input.hospital_id,
                    ]
                  );
                }
              }
            });
          });
          if (insertData != "") {
            _mysql
              .executeQuery({
                query: insertData,
              })
              .then((result) => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          } else {
            req.records = {};
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by irfan: to
  addProjectRoster_04_april_2020: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    try {
      let input = req.body;
      if (
        moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
        moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
      ) {
        const allDates = getDaysArray2(
          new Date(input.from_date),
          new Date(input.to_date)
        );

        const insertArray = [];

        input.roster.forEach((item) => {
          allDates.forEach((dat) => {
            insertArray.push({
              employee_id: item,
              attendance_date: dat,
              project_id: input["project_id"],
              hospital_id: input["hospital_id"],
            });
          });
        });

        _mysql
          .executeQuery({
            query:
              "INSERT INTO hims_f_project_roster (??) VALUES ? \
              ON DUPLICATE KEY UPDATE project_id= values(project_id); ",
            values: insertArray,
            bulkInsertOrUpdate: true,
            printQuery: false,
          })
          .then((result) => {
            _mysql.releaseConnection();
            req.records = result;
            next();
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        //please send valid

        req.records = {
          invalid_input: true,
          message: "Please Provide valid From & to dates",
        };

        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },
  //created by irfan: to
  addProjectRoster: (req, res, next) => {
    const _mysql = new algaehMysql();
    const utilities = new algaehUtilities();
    try {
      let input = req.body;
      console.log("input", input);
      if (
        moment(input.from_date, "YYYY-MM-DD").format("YYYYMMDD") > 0 &&
        moment(input.to_date, "YYYY-MM-DD").format("YYYYMMDD") > 0
      ) {
        _mysql
          .executeQuery({
            query:
              "select hims_d_employee_id,date_of_joining from hims_d_employee where hims_d_employee_id in (?); ",
            values: [input.roster],
            // bulkInsertOrUpdate: true,
            printQuery: false,
          })
          .then((employee) => {
            const allDates = getDaysArray2(
              new Date(input.from_date),
              new Date(input.to_date)
            );

            const insertArray = [];

            employee.forEach((item) => {
              if (item.date_of_joining <= input.from_date) {
                allDates.forEach((dat) => {
                  insertArray.push({
                    employee_id: item.hims_d_employee_id,
                    attendance_date: dat,
                    project_id: input["project_id"],
                    hospital_id: input["hospital_id"],
                  });
                });
              } else {
                const custmDates = getDaysArray2(
                  new Date(item.date_of_joining),
                  new Date(input.to_date)
                );

                custmDates.forEach((dat) => {
                  insertArray.push({
                    employee_id: item.hims_d_employee_id,
                    attendance_date: dat,
                    project_id: input["project_id"],
                    hospital_id: input["hospital_id"],
                  });
                });
              }
            });

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_f_project_roster (??) VALUES ? \
              ON DUPLICATE KEY UPDATE project_id= values(project_id); ",
                values: insertArray,
                bulkInsertOrUpdate: true,
                printQuery: false,
              })
              .then((result) => {
                _mysql.releaseConnection();
                req.records = result;
                next();
              })
              .catch((e) => {
                _mysql.releaseConnection();
                next(e);
              });
          })
          .catch((e) => {
            _mysql.releaseConnection();
            next(e);
          });
      } else {
        //please send valid

        req.records = {
          invalid_input: true,
          message: "Please Provide valid From & to dates",
        };

        next();
      }
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  },

  //created by irfan:
  pasteProjectRoster: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;

    _mysql
      .executeQuery({
        query:
          "INSERT INTO `hims_f_project_roster` (`employee_id`,\
          `attendance_date`,`project_id`,`hims_f_leave_application_id`,`hospital_id`) values(?,?,?,?,?)\
          ON DUPLICATE KEY UPDATE project_id=?, hims_f_leave_application_id=?",
        values: [
          input.employee_id,
          moment(input.attendance_date)._d,
          input.project_id,
          input.hims_f_leave_application_id,
          input.hospital_id,
          input.project_id,
          input.hims_f_leave_application_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getProjectWiseJobCost: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let employee = "";
    let project = "";
    let groupBy = " PWP.employee_id ";

    if (input.employee_id > 0) {
      employee = " and PWP.employee_id=" + input.employee_id;
      groupBy = " PWP.project_id ";
    }

    if (input.project_id > 0) {
      project = " and project_id=" + input.project_id;
    }
    // COALESCE(sum(worked_hours),0)+ COALESCE(concat(floor(sum(worked_minutes)/60)  ,'.',sum(worked_minutes)%60),0) as complete_hours
    if (input.hospital_id > 0 && input.year > 0 && input.month > 0) {
      _mysql
        .executeQuery({
          query: `select hims_f_project_wise_payroll_id, PWP.employee_id,E.employee_code,E.full_name,d.designation, \
          project_id, P.project_code,P.project_desc, PWP.month, PWP.year,sum(worked_hours) as worked_hours, \
          sum(worked_minutes) as worked_minutes, sum(cost) as project_cost,PWP.hospital_id, SD.sub_department_name, \ DPT.department_name, SAL.ot_work_hours + SAL.ot_weekoff_hours + SAL.ot_holiday_hours as ot_work, \
          SAL.total_working_hours, coalesce (SE.amount, 0) as ot_amount,SE.component_type from hims_f_project_wise_payroll PWP \
          inner join hims_d_employee  E on PWP.employee_id=E.hims_d_employee_id \
          inner join hims_d_project  P on PWP.project_id=P.hims_d_project_id  \
          left join hims_d_employee_group EG on EG.hims_d_employee_group_id = E.employee_group_id  \
          left join hims_d_designation d on E.employee_designation_id = d.hims_d_designation_id \
          left join hims_d_sub_department SD on SD.hims_d_sub_department_id = E.sub_department_id\
          inner join hims_d_department DPT on SD.department_id = DPT.hims_d_department_id \
          inner join hims_f_salary SAL on SAL.employee_id = PWP.employee_id and  SAL.month = PWP.month and \
          SAL.year = PWP.year left join \
          (select ER.*,ERD.component_type from  hims_f_salary_earnings ER \
          inner join hims_d_earning_deduction ERD on ER.earnings_id=ERD.hims_d_earning_deduction_id \
          and ERD.component_type='OV') as SE on SAL.hims_f_salary_id=SE.salary_header_id \
          where PWP.hospital_id=? \
          and PWP.year=? and PWP.month=?  ${employee} ${project} group by ${groupBy} ;`,
          values: [input.hospital_id, input.year, input.month],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          // req.records = result;
          // next();
          let total_worked_hours = 0;
          let minutes = 0;
          let total_cost = 0;
          // if (input.project_id > 0) {
          //ST---COST calculation

          let outputArray = [];
          for (let i = 0; i < result.length; i++) {
            let complete_hours = parseInt(result[i]["worked_hours"]);

            let worked_minutes = result[i]["worked_minutes"];

            complete_hours += parseInt(worked_minutes / 60);
            let mins = String("0" + parseInt(worked_minutes % 60)).slice(-2);
            outputArray.push({
              ...result[i],
              complete_hours: complete_hours + "." + mins,
            });
          }

          total_cost = new LINQ(result).Sum((s) => parseFloat(s.project_cost));

          //ST---time calculation

          total_worked_hours = new LINQ(result).Sum((s) =>
            parseInt(s.worked_hours)
          );

          let worked_minutes = new LINQ(result).Sum((s) =>
            parseInt(s.worked_minutes)
          );

          total_worked_hours += parseInt(worked_minutes / 60);
          minutes = String("0" + parseInt(worked_minutes % 60)).slice(-2);

          req.records = {
            project_wise_payroll: outputArray,
            total_worked_hours: total_worked_hours + "." + minutes,
            noEmployees: result.length,
            total_cost: total_cost,
          };
          next();
          // } else {
          //   _mysql.releaseConnection();
          //   req.records = result;
          //   next();
          // }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please send valid input",
      };
      next();
      return;
    }
  },
  //created by irfan:
  addActivity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    if (input.description != "null" && input.description != undefined) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_activity` ( description,created_date,created_by,updated_date,updated_by) values(?,?,?,?,?)",
          values: [
            input.description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please send valid input",
      };
      next();
      return;
    }
  },
  //created by irfan:
  addSubActivity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.body;
    if (
      input.description != "null" &&
      input.description != undefined &&
      input.activity_id > 0
    ) {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_sub_activity` (activity_id, description,created_date,created_by,updated_date,updated_by) values(?,?,?,?,?,?)",
          values: [
            input.activity_id,
            input.description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "Please send valid input",
      };
      next();
      return;
    }
  },
  //created by irfan:
  getActivity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let activity_id = "";
    if (input.hims_d_activity_id > 0) {
      activity_id = " and hims_d_activity_id=" + input.hims_d_activity_id;
    }

    _mysql
      .executeQuery({
        query: `SELECT hims_d_activity_id,description FROM hims_d_activity where record_status='A' ${activity_id};`,

        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  getSubActivity: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    let activity_id = "";
    if (input.hims_d_activity_id > 0) {
      activity_id = " and activity_id=" + input.hims_d_activity_id;
    }

    _mysql
      .executeQuery({
        query: `select hims_d_sub_activity_id,activity_id,description from hims_d_sub_activity where \
        record_status='A' ${activity_id};`,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((e) => {
        _mysql.releaseConnection();
        next(e);
      });
  },

  //created by irfan:
  updateActivity: (req, res, next) => {
    //const utilities = new algaehUtilities();
    let input = req.body;

    if (input.hims_d_activity_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_activity SET description = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_activity_id = ?",
          values: [
            input.description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_activity_id,
          ],

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input",
      };

      next();
      return;
    }
  },
  //created by irfan:
  updateSubActivity: (req, res, next) => {
    //const utilities = new algaehUtilities();
    let input = req.body;

    if (input.hims_d_sub_activity_id > 0) {
      const _mysql = new algaehMysql();
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_sub_activity SET activity_id=?,description = ?,\
            updated_date=?, updated_by=?  WHERE record_status='A' and  hims_d_sub_activity_id = ?",
          values: [
            input.activity_id,
            input.description,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_sub_activity_id,
          ],

          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (result.affectedRows > 0) {
            req.records = result;
            next();
          } else {
            req.records = {
              invalid_input: true,
              message: "please provide valid id",
            };
            next();
          }
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      req.records = {
        invalid_input: true,
        message: "please provide valid input",
      };

      next();
      return;
    }
  },

  //created by irfan:
  getNoEmployeesProjectWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    if (input.hospital_id > 0) {
      _mysql
        .executeQuery({
          query: `select count(distinct employee_id) as no_employees,project_id,P.project_desc from 
        hims_f_project_roster PR left join hims_d_project P on 
        PR.project_id=P.hims_d_project_id where PR.hospital_id=?  group by project_id;`,
          values: [input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      next(new Error("Please provide valid input"));
    }
  },

  //created by irfan:
  getNoEmployeesDesgnationWise: (req, res, next) => {
    const _mysql = new algaehMysql();
    let input = req.query;

    if (input.project_id > 0 && input.hospital_id > 0) {
      _mysql
        .executeQuery({
          query: `select count(hims_d_employee_id) as no_emp, coalesce(D.designation,'No Designation' ) as designation
          from hims_d_employee E left join hims_d_designation D on E.employee_designation_id=D.hims_d_designation_id
          where hims_d_employee_id  in(SELECT distinct employee_id FROM  hims_f_project_roster
          where project_id=? and hospital_id=?) group by E.employee_designation_id;`,
          values: [input.project_id, input.hospital_id],
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch((e) => {
          _mysql.releaseConnection();
          next(e);
        });
    } else {
      next(new Error("Please provide valid input"));
    }
  },
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

//created by irfan: to generate dates
function getDaysArray2(start, end) {
  const utilities = new algaehUtilities();

  try {
    for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push(moment(dt).format("YYYY-MM-DD"));
    }
    return arr;
  } catch (e) {
    utilities.logger().log("error rr: ", e);
  }
}
