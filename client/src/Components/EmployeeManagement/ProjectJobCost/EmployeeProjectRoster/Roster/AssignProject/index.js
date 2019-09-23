import React, { useContext, useState } from "react";
import AlgaehModalPopUp from "../../../../../Wrapper/modulePopUp";
import {
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../../../Wrapper/algaehWrapper";
import ButtonType from "../../../../../Wrapper/algaehButton";
import { ProjectRosterContext } from "../index";
import _ from "lodash";
import "../../project_assign.scss";

export default function(props) {
  const { showPopup, onClose, loadingProjects, projects } = props;
  const { getProjectRosterState } = useContext(ProjectRosterContext);
  const { employees, toDate, fromDate } = getProjectRosterState();
  const [from_date, setFromDate] = useState("");
  const [to_date, setToDate] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const [searchProject, setSearchProject] = useState("");
  const [selectedProjectID, setSelectedProjectID] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [checkAllEmployees, setCheckAllEmployees] = useState(false);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [changeState, setChangeState] = useState(false);
  return (
    <AlgaehModalPopUp
      className="col-lg-12 ShiftAssign"
      openPopup={showPopup}
      title="Project Assign"
      events={{
        onClose: () => {
          onClose();
        }
      }}
    >
      <div className="popupInner" data-validate="LvEdtGrd">
        <div className="col-12">
          <div className="row margin-top-15">
            <AlgaehDateHandler
              div={{ className: "col-3 mandatory" }}
              label={{
                forceLabel: "Project Starts Date",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "from_date",
                others: {
                  tabIndex: "1"
                }
              }}
              events={{
                onChange: selDate => {
                  setFromDate(selDate);
                }
              }}
              maxDate={toDate}
              minDate={fromDate}
              value={from_date === "" ? fromDate : from_date}
            />
            <AlgaehDateHandler
              div={{ className: "col-3 mandatory" }}
              label={{
                forceLabel: "Project End Date",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "to_date",
                others: {
                  tabIndex: "2"
                }
              }}
              events={{
                onChange: selDate => {
                  setToDate(selDate);
                }
              }}
              maxDate={toDate}
              minDate={fromDate}
              value={to_date === "" ? toDate : to_date}
            />
          </div>
          <hr />
          <div className="row">
            <div className="col-4">
              <h6>Select Project</h6>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  textBox={{
                    className: "txt-fld",
                    name: "searchProjects",
                    value: searchProject,
                    events: {
                      onChange: e => {
                        setSearchProject(e.target.value);
                      }
                    },
                    option: {
                      type: "text"
                    },
                    others: {
                      placeholder: "Search projects"
                    }
                  }}
                />
              </div>
              {loadingProjects ? (
                <p>Please wait loading Project's</p>
              ) : (
                <ul className="projectList">
                  {projects.map(data => {
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
                            selectedProjectID === data.project_id ? true : false
                          }
                          onChange={e => {
                            setSelectedProjectID(data.project_id);
                          }}
                          type="radio"
                        />
                        <label
                          htmlFor={data.project_id}
                          style={{
                            width: "80%"
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
              <h6>Assign Employee</h6>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  textBox={{
                    className: "txt-fld",
                    name: "searchEmployees",
                    value: searchEmployee,
                    events: {
                      onChange: e => {
                        setSearchEmployee(e.target.value);
                      }
                    },
                    option: {
                      type: "text"
                    },
                    others: {
                      placeholder: "Search Employee By Name"

                      //disabled: this.state.allChecked
                    }
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
                      onChange={e => {
                        setCheckAllEmployees(e.target.checked);
                        if (e.target.checked) {
                          const checkedall = employees.map(employee => {
                            return employee.hims_d_employee_id;
                          });
                          setSelectedEmployees(checkedall);
                        } else {
                          setSelectedEmployees([]);
                        }
                      }}
                    />
                  </span>
                  <p>Employee Names</p>
                </li>
                {employees.map(data => {
                  if (
                    data.employee_name
                      .toLowerCase()
                      .indexOf(searchEmployee.toLowerCase()) === -1
                  ) {
                    return null;
                  }
                  console.log(
                    selectedEmployees.includes(data.hims_d_employee_id)
                  );
                  return (
                    <li key={data.hims_d_employee_id}>
                      <span>
                        <input
                          id={data.employee_code}
                          type="checkbox"
                          checked={selectedEmployees.includes(
                            data.hims_d_employee_id
                          )}
                          onChange={e => {
                            setChangeState(!changeState);
                            let existingEmployees = selectedEmployees;
                            if (e.target.checked) {
                              existingEmployees.push(data.hims_d_employee_id);
                            } else {
                              existingEmployees = _.filter(
                                existingEmployees,
                                f => f !== data.hims_d_employee_id
                              );
                            }

                            setSelectedEmployees(existingEmployees);
                          }}
                        />
                      </span>
                      <p>
                        <label htmlFor={data.employee_code}>
                          <b>{data.employee_name}</b>
                          <small>{data.employee_code}</small>
                        </label>
                      </p>
                    </li>
                  );
                })}
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
                }}
                label={{
                  forceLabel: "PROCESS",
                  returnText: true
                }}
              />

              <button
                onClick={() => {
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
