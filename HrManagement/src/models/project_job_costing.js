import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import moment from "moment";
import { LINQ } from "node-linq";
import algaehUtilities from "algaeh-utilities/utilities";

module.exports = {
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
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
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
            req.userIdentity.algaeh_d_app_user_id
          ]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
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
          values: [input.hims_m_division_project_id]
        })
        .then(result => {
          _mysql.releaseConnection();
          req.records = result;
          next();
        })
        .catch(e => {
          next(e);
        });
    } catch (e) {
      next(e);
    }
  },

  //created by Adnan: to
  getEmployeesForProjectRoster: (req, res, next) => {
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
          (to_date >= ? and to_date <= ?) or (from_date <= ? and to_date >= ?)); `,
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
  }
};
