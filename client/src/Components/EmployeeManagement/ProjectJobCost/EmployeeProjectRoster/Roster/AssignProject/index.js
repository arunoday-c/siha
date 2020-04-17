import React, { useContext, useState } from "react";
import _ from "lodash";
import moment from "moment";
import AlgaehModalPopUp from "../../../../../Wrapper/modulePopUp";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
} from "../../../../../Wrapper/algaehWrapper";
import ButtonType from "../../../../../Wrapper/algaehButton";
import { ProjectRosterContext } from "../index";

import "../../project_assign.scss";
import {
  algaehApiCall,
  swalMessage,
} from "../../../../../../utils/algaehApiCall";
export default function (props) {
  const {
    showPopup,
    onClose,
    loadingProjects,
    projects,
    isEditing,
    onRefreshTable,
  } = props;
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const {
    employees,
    filterEmployees,
    filterTrue,
    toDate,
    fromDate,
    inputs,
  } = getProjectRosterState();
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [checkAllEmployees, setCheckAllEmployees] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [changeState, setChangeState] = useState(false);

  let from_dt =
    from_date === "" && isEditing !== undefined
      ? isEditing.attendance_date
      : from_date === "" && isEditing === undefined
      ? fromDate
      : from_date;
  let to_dt =
    to_date === "" && isEditing !== undefined
      ? isEditing.attendance_date
      : to_date === "" && isEditing === undefined
      ? toDate
      : to_date;
  const employeeShow = filterTrue === false ? employees : filterEmployees;
  function processAsssignProject(data) {
    const {
      selectedProjectID,
      selectedEmployees,
      from_date,
      to_date,
      hospital_id,
      isEditing,
    } = data;

    return new Promise((resolve, reject) => {
      try {
        if (isEditing === undefined) {
          if (selectedProjectID === "") {
            reject(new Error("Project id is not selected"));
            return;
          }
          if (selectedEmployees.length === 0) {
            reject(new Error("Please select atleast one employee"));
            return;
          }
        }
        let rosters = selectedEmployees;
        let projectID = selectedProjectID;
        if (isEditing !== undefined) {
          rosters = [isEditing.hims_d_employee_id];
          projectID =
            selectedProjectID === "" ? isEditing.project_id : selectedProjectID;
        }

        algaehApiCall({
          uri: "/projectjobcosting/addProjectRoster",
          method: "post",
          module: "hrManagement",
          data: {
            from_date: from_date,
            to_date: to_date,
            project_id: projectID,
            roster: rosters,
            hospital_id: hospital_id,
          },
          onSuccess: (res) => {
            const { success, records } = res.data;
            if (success) {
              swalMessage({
                title: "Records updated successfully",
                type: "success",
              });
              onRefreshTable();
              resolve();
            } else if (!success) {
              swalMessage({
                title: records.message,
                type: "warning",
              });
              reject();
            }
          },
          onCatch: (err) => {
            reject(err);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  return (
    <AlgaehModalPopUp
      className="col-lg-12 ShiftAssign"
      openPopup={showPopup}
      title="Project Assign"
      events={{
        onClose: () => {
          onClose();
        },
      }}
    >
      <div className="popupInner" data-validate="LvEdtGrd">
        <div className="col-12">
          <div className="row margin-top-15">
            <AlgaehDateHandler
              div={{ className: "col-3 mandatory" }}
              label={{
                forceLabel: "Project Starts Date",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "from_date",
                others: {
                  tabIndex: "1",
                },
              }}
              events={{
                onChange: (selDate) => {
                  setFromDate(moment(selDate).format("YYYY-MM-DD"));
                },
              }}
              maxDate={toDate}
              minDate={fromDate}
              value={from_dt}
            />
            <AlgaehDateHandler
              div={{ className: "col-3 mandatory" }}
              label={{
                forceLabel: "Project End Date",
                isImp: true,
              }}
              textBox={{
                className: "txt-fld",
                name: "to_date",
                others: {
                  tabIndex: "2",
                },
              }}
              events={{
                onChange: (selDate) => {
                  setToDate(moment(selDate).format("YYYY-MM-DD"));
                },
              }}
              //maxDate={toDate}
              minDate={fromDate}
              value={to_dt}
            />
          </div>
          <hr />
          <div className="row">
            <div className="col-4">
              <h6>
                Select Project{" "}
                {isEditing !== undefined ? (
                  <small> &#123;{isEditing.project_desc}&#125;</small>
                ) : null}{" "}
              </h6>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  textBox={{
                    className: "txt-fld",
                    name: "searchProjects",
                    value: searchProject,
                    events: {
                      onChange: (e) => {
                        setSearchProject(e.target.value);
                      },
                    },
                    option: {
                      type: "text",
                    },
                    others: {
                      placeholder: "Search projects",
                    },
                  }}
                />
              </div>
              {loadingProjects ? (
                <p>Please wait loading Project's</p>
              ) : (
                <ul className="projectList">
                  {projects.map((data) => {
                    if (
                      data.project_desc
                        .toLowerCase()
                        .indexOf(searchProject.toLowerCase()) === -1
                    ) {
                      return null;
                    }
                    return (
                      <li key={data.project_id}>
                        <input
                          id={data.project_id}
                          name="hims_d_project_id"
                          checked={
                            selectedProjectID === "" && isEditing !== undefined
                              ? isEditing.project_id === data.project_id
                              : selectedProjectID === data.project_id
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            setSelectedProjectID(data.project_id);
                          }}
                          type="radio"
                        />
                        <label
                          htmlFor={data.project_id}
                          style={{
                            width: "80%",
                          }}
                        >
                          <span>{data.project_desc}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="col-8">
              <h6>{`Selected Employees - (${selectedEmployees.length})`}</h6>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  textBox={{
                    className: "txt-fld",
                    name: "searchEmployees",
                    value: searchEmployee,
                    events: {
                      onChange: (e) => {
                        setSearchEmployee(e.target.value);
                      },
                    },
                    option: {
                      type: "text",
                    },
                    others: {
                      placeholder: "Search employee by code only",

                      //disabled: this.state.allChecked
                    },
                  }}
                />
              </div>
              <ul className="projEmployeeList">
                <li>
                  <span>
                    <input
                      type="checkbox"
                      name="choose-all"
                      checked={checkAllEmployees}
                      onChange={(e) => {
                        setCheckAllEmployees(e.target.checked);
                        if (e.target.checked) {
                          const checkedall = employeeShow.map((employee) => {
                            return employee.hims_d_employee_id;
                          });
                          setSelectedEmployees(checkedall);
                        } else {
                          setSelectedEmployees([]);
                        }
                      }}
                    />
                  </span>
                  <p>Employee Codes & Names</p>
                </li>
                {isEditing === undefined ? (
                  employeeShow.map((data) => {
                    if (
                      data.employee_code
                        .toLowerCase()
                        .indexOf(searchEmployee.toLowerCase()) === -1
                    ) {
                      return null;
                    }

                    return (
                      <li key={data.hims_d_employee_id}>
                        <span>
                          <input
                            id={data.employee_code}
                            type="checkbox"
                            checked={selectedEmployees.includes(
                              data.hims_d_employee_id
                            )}
                            onChange={(e) => {
                              setChangeState(!changeState);
                              let existingEmployees = selectedEmployees;
                              if (e.target.checked) {
                                existingEmployees.push(data.hims_d_employee_id);
                              } else {
                                existingEmployees = _.filter(
                                  existingEmployees,
                                  (f) => f !== data.hims_d_employee_id
                                );
                              }

                              setSelectedEmployees(existingEmployees);
                            }}
                          />
                        </span>
                        <p>
                          <label htmlFor={data.employee_code}>
                            <small>{data.employee_code}</small>
                            <b>{data.employee_name}</b>
                          </label>
                        </p>
                      </li>
                    );
                  })
                ) : (
                  <li>
                    <span>
                      <input
                        id={isEditing.employee_code}
                        type="checkbox"
                        checked={true}
                        disabled
                      />
                    </span>
                    <p>
                      <label htmlFor={isEditing.employee_code}>
                        <small>{isEditing.employee_code}</small>
                        <b>{isEditing.employee_name}</b>
                      </label>
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="popupFooter">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-4"> &nbsp;</div>

            <div className="col-lg-8">
              <ButtonType
                classname="btn-primary"
                loading={loadingProcess}
                onClick={() => {
                  setLoadingProcess(true);
                  let from_dt =
                    from_date === "" && isEditing !== undefined
                      ? isEditing.attendance_date
                      : from_date === "" && isEditing === undefined
                      ? fromDate
                      : from_date;
                  let to_dt =
                    to_date === "" && isEditing !== undefined
                      ? isEditing.attendance_date
                      : to_date === "" && isEditing === undefined
                      ? toDate
                      : to_date;

                  processAsssignProject({
                    selectedProjectID,
                    selectedEmployees,
                    from_date: from_dt,
                    to_date: to_dt,
                    hospital_id: inputs.hospital_id,
                    isEditing,
                  })
                    .then(() => {
                      setLoadingProcess(false);
                      setSelectedProjectID("");
                      setSelectedEmployees([]);
                      setCheckAllEmployees(false);
                      setFromDate("");
                      setToDate("");
                      onClose();
                    })
                    .catch((error) => {
                      setLoadingProcess(false);
                    });
                }}
                label={{
                  forceLabel: "PROCESS",
                  returnText: true,
                }}
              />

              <button
                onClick={() => {
                  setSelectedProjectID("");
                  setSelectedEmployees([]);
                  setCheckAllEmployees(false);
                  setFromDate("");
                  setToDate("");
                  onClose();
                }}
                type="button"
                className="btn btn-default"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </AlgaehModalPopUp>
  );
}
