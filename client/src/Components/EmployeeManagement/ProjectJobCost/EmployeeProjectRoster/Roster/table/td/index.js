import React, { useContext } from "react";

import { ProjectRosterContext } from "../../index";
import {
  algaehApiCall,
  swalMessage
} from "../../../../../../../utils/algaehApiCall";
import { deleteProjectRoster } from "./index.event";
import AlgaehLoader from "../../../../../../Wrapper/fullPageLoader";
export default React.memo(function(props) {
  const {
    projects,
    employee_code,
    editing,
    employee_name,
    designation,
    date_of_joining,
    exit_date,
    hims_d_employee_id
  } = props;
  const {
    getEmployeesForProjectRoster,
    getProjectRosterState,
    setProjectRosterState
  } = useContext(ProjectRosterContext);
  const { inputs, filterTrue, selectedFilter } = getProjectRosterState();

  return (
    <React.Fragment>
      {projects.map(item => {
        const style =
          item.status === "WO"
            ? {
                style: {
                  backgroundColor: "#459C62",
                  color: "#fff",
                  cursor: "pointer"
                }
              }
            : item.status === "HO"
            ? {
                style: {
                  backgroundColor: "#3F789C",
                  color: "#fff",
                  cursor: "pointer"
                }
              }
            : item.status === "APR"
            ? {
                style: {
                  backgroundColor: "#879C3F",
                  color: "#fff",
                  cursor: "pointer"
                }
              }
            : item.status === "PEN"
            ? {
                style: {
                  backgroundColor: "#9C7D3F",
                  color: "#fff",
                  cursor: "pointer"
                }
              }
            : item.status === "N"
            ? {
                style: {
                  backgroundColor: "#f78fa2",
                  color: "#000",
                  cursor: "pointer"
                }
              }
            : {};

        return (
          <td
            key={`${employee_code + item.attendance_date}`}
            className="time_cell editAction"
            {...style}
            onClick={e => {
              if (e.target.nodeName !== "LI") {
                editing({
                  ...item,
                  ...{
                    employee_name,
                    designation,
                    date_of_joining,
                    exit_date,
                    hims_d_employee_id,
                    employee_code
                  }
                });
              }
            }}
          >
            {item.status !== "N" ? (
              <React.Fragment>
                <i className="fas fa-ellipsis-v" />

                <ul>
                  <li
                    onClick={e => {
                      deleteProjectRoster(item).then(() => {
                        AlgaehLoader({ show: true });
                        getEmployeesForProjectRoster(inputs)
                          .then(result => {
                            const { records, fromDate, toDate } = result;
                            let filterData = {};

                            if (filterTrue === true && selectedFilter !== "0") {
                              const empl = records.roster;
                              const emp = empl.map(employee => {
                                let allProjects = employee.projects;
                                const projs = employee.projects.filter(f => {
                                  return f.status === "N";
                                });
                                if (selectedFilter === "1") {
                                  if (projs.length === 0) {
                                    return {
                                      ...employee,
                                      projects: allProjects
                                    };
                                  }
                                } else {
                                  if (projs.length > 0) {
                                    return {
                                      ...employee,
                                      projects: allProjects
                                    };
                                  }
                                }
                              });
                              const allEmployees = emp.filter(f => {
                                return f !== undefined;
                              });
                              filterData["filterEmployees"] = allEmployees;
                            }

                            setProjectRosterState({
                              total_rosted: records.total_rosted,
                              total_non_rosted: records.total_non_rosted,
                              employees: records.roster,
                              dates: records.datesArray,
                              inputs: inputs,
                              fromDate: fromDate,
                              toDate: toDate,
                              ...filterData
                            });
                            AlgaehLoader({ show: false });
                          })
                          .catch(error => {
                            setProjectRosterState({ employees: [], dates: [] });
                            AlgaehLoader({ show: false });
                          });
                      });
                    }}
                  >
                    Delete Project
                  </li>
                </ul>
              </React.Fragment>
            ) : null}

            <span>
              {item.abbreviation === null ? item.status : item.abbreviation}
            </span>
          </td>
        );
      })}
    </React.Fragment>
  );
});
