import React, { useContext } from "react";
import swal from "sweetalert2";
import momemt from "moment";
import { ProjectRosterContext } from "../../index";
import {
  algaehApiCall,
  swalMessage
} from "../../../../../../../utils/algaehApiCall";
import AlgaehLoader from "../../../../../../Wrapper/fullPageLoader";
export default React.memo(function(props) {
  const { projects, employee_code } = props;
  const {
    getEmployeesForProjectRoster,
    getProjectRosterState,
    setProjectRosterState
  } = useContext(ProjectRosterContext);
  const { inputs } = getProjectRosterState();
  function deleteProjectRoster(data) {
    return new Promise((resolve, reject) => {
      swal({
        title: `Do you want to delete?`,
        text: `${data.project_desc} for the ${momemt(
          data.attendance_date
        ).format("DD-MM-YYYY")}`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#44b8bd",
        cancelButtonColor: "#d33",
        cancelButtonText: "No"
      }).then(willDelete => {
        if (willDelete.value) {
          algaehApiCall({
            uri: "/projectjobcosting/deleteProjectRoster",
            method: "DELETE",
            module: "hrManagement",
            data: {
              hims_f_project_roster_id: data.hims_f_project_roster_id
            },
            onSuccess: res => {
              const { success } = res.data;
              if (success) {
                swalMessage({
                  title: "Record Deleted Successfully . .",
                  type: "success"
                });
                resolve();
                // this.getEmployeesForProjectRoster();
              } else if (!success) {
                swalMessage({
                  title: res.data.records.message,
                  type: "warning"
                });
                reject();
              }
            },
            onCatch: e => {
              reject();
            }
          });
        } else {
          swalMessage({
            title: "Delete request cancelled",
            type: "error"
          });
          reject();
        }
      });
    });
  }
  return (
    <React.Fragment>
      {projects.map(item => {
        const style =
          item.status === "WO"
            ? { style: { backgroundColor: "#459C62", color: "#fff" } }
            : item.status === "HO"
            ? { style: { backgroundColor: "#3F789C", color: "#fff" } }
            : item.status === "APR"
            ? { style: { backgroundColor: "#879C3F", color: "#fff" } }
            : item.status === "PEN"
            ? { style: { backgroundColor: "#9C7D3F", color: "#fff" } }
            : item.status === "N"
            ? { style: { backgroundColor: "#f78fa2", color: "#000" } }
            : {};

        return (
          <td
            key={`${employee_code + item.attendance_date}`}
            className="time_cell editAction"
            {...style}
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
                            setProjectRosterState({
                              total_rosted: records.total_rosted,
                              total_non_rosted: records.total_non_rosted,
                              employees: records.roster,
                              dates: records.datesArray,
                              inputs: inputs,
                              fromDate: fromDate,
                              toDate: toDate
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
