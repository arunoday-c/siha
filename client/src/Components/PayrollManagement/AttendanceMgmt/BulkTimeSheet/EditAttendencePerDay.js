import React, { useState, useEffect } from "react";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import {
  AlgaehLabel,
  // AlagehAutoComplete,
  AlagehFormGroup,
} from "../../../Wrapper/algaehWrapper";
import ButtonType from "../../../Wrapper/algaehButton";
import { AlgaehSecurityElement } from "algaeh-react-components";

import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
export default function EditAttendencePerDay(props) {
  const { onClose, project_state } = props;
  const [projectId, setProjectId] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [searchprojects, setSearchProject] = useState("");
  const [projectList, setProjectList] = useState([]);
  const [project_desc, setProjectDesc] = useState("");

  const [loadingProcess, setLoadingProcess] = useState(false);

  useEffect(() => {
    if (project_state.showPopup) {
      setProjectList(project_state.projects);
      setProjectId(project_state.project_id || "");
      setWorkingHours(project_state.worked_hours || "");
      setProjectDesc(project_state.project_desc || "");
    } else {
      setProjectId("");
      setWorkingHours("");
      setProjectDesc("");
    }
  }, [project_state]);

  function SaveAttendanceAndProject(options) {
    const { projectId, workingHours } = options;

    algaehApiCall({
      uri: "/attendance/SaveAttendanceAndProject",
      module: "hrManagement",
      method: "POST",
      data: {
        hims_f_project_roster_id: project_state.hims_f_project_roster_id,
        hims_f_daily_time_sheet_id: project_state.hims_f_daily_time_sheet_id,
        project_id: projectId === "" ? null : projectId,
        worked_hours: workingHours,
      },
      onSuccess: (response) => {
        if (response.data.success) {
          setLoadingProcess(false);
          setSearchProject("");
          if (response.data.result[0] === undefined) {
            const split_hr_min = workingHours.toString().split(".");
            let mins = "00";
            if (split_hr_min.length > 1) {
              mins =
                split_hr_min[1].length === 1
                  ? split_hr_min[1] + "0"
                  : split_hr_min[1];
            }
            const hr_min = `${split_hr_min[0].substring(0, 2)}.${mins}`;
            onClose({ project_id: projectId, worked_hours: hr_min });
          } else {
            onClose(response.data.result[0]);
          }
        }
      },
      onFailure: (error) => {
        swalMessage({
          title: error.message,
          type: "error",
        });
      },
    });
  }
  const SearchHandler = (e) => {
    let ProjectSearch = e.target.value.toLowerCase(),
      projects = project_state.projects.filter((el) => {
        let searchValue = el.project_desc.toLowerCase();
        return searchValue.indexOf(ProjectSearch) !== -1;
      });
    setSearchProject(e.target.value);
    setProjectList(projects);
  };
  const projectHandler = (data, e) => {
    setSearchProject(data.project_desc);
    setProjectId(data.hims_d_project_id);
  };
  return (
    <AlgaehModalPopUp
      class="editBulkCellPopup"
      openPopup={project_state.showPopup}
      title="Edit Time or Project"
      events={{
        onClose: () => {
          onClose();
        },
      }}
    >
      <div className="popupInner" data-validate="editBulkCell">
        <div className="col-12">
          <div className="row margin-top-15">
            <div className="col form-group">
              <AlgaehLabel
                label={{
                  forceLabel: "Employee Name",
                }}
              />
              <h6>
                {project_state.employee_name
                  ? project_state.employee_name
                  : "--------"}
              </h6>
            </div>
            <div className="col form-group">
              <AlgaehLabel
                label={{
                  forceLabel: "Selected Date",
                }}
              />
              <h6>
                {project_state.attendance_date
                  ? project_state.attendance_date
                  : "--------"}
              </h6>
            </div>
            <AlagehFormGroup
              div={{ className: "col form-group mandatory" }}
              label={{
                forceLabel: "Worked Hours",
                isImp: true,
              }}
              textBox={{
                decimal: { allowNegative: false },
                className: "txt-fld",
                name: "worked_hours",
                value: workingHours,
                events: {
                  onChange: (e) => {
                    let value = e.target.value;
                    setWorkingHours(value);
                  },
                },
              }}
            />
            <div className="col-12">
              <h6>
                Selected Project - {project_desc}
                {/* {isEditing !== undefined ? (
                  <b> {isEditing.project_desc}</b>
                ) : null} */}
              </h6>
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col" }}
                  textBox={{
                    className: "txt-fld",
                    name: "searchProjects",
                    value: searchprojects,
                    events: {
                      onChange: SearchHandler,
                    },
                    option: {
                      type: "text",
                    },
                    others: {
                      placeholder: "Search projects",
                      tabIndex: "4",
                    },
                  }}
                />
              </div>

              {/* <input
                  type="text"
                  autoComplete="off"
                  name="searchprojects"
                  className="rosterSrch"
                  placeholder="Search projects"
                  value={this.state.searchprojects}
                  onChange={this.SearchHandler.bind(this)}
                /> */}
              <ul className="projectList">
                {projectList.map((data, index) => {
                  return (
                    <li key={index}>
                      <input
                        id={data.project_id}
                        name="hims_d_project_id"
                        value={data}
                        checked={projectId === data.project_id ? true : false}
                        onChange={() => {
                          projectHandler(data);
                        }}
                        type="radio"
                      />
                      <label
                        htmlFor={data.project_id}
                        style={{
                          width: "80%",
                        }}
                      >
                        <span>
                          {data.project_desc + " / " + data.hospital_name}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* <AlagehAutoComplete
              div={{ className: "col-7 form-group mandatory" }}
              label={{
                forceLabel: "Assigned Project",
                isImp: true,
              }}
              selector={{
                name: "project_id",
                className: "select-fld",
                value: project_state.project_id || undefined,
                dataSource: {
                  textField: "project_desc",
                  valueField: "hims_d_project_id",
                  data: project_state.projects,
                },
                onChange: (e) => {
                  let value = e.value;
                  setProjectId(value);
                },
                onClear: () => {
                  setProjectId("");
                  setWorkingHours("");
                },
              }}
            /> */}
          </div>
        </div>
      </div>
      <div className="popupFooter">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-4"> &nbsp;</div>

            <div className="col-lg-8">
              <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                <ButtonType
                  classname="btn-primary"
                  loading={loadingProcess}
                  onClick={() => {
                    setLoadingProcess(true);
                    SaveAttendanceAndProject({ workingHours, projectId });
                  }}
                  label={{
                    forceLabel: "SAVE",
                    returnText: true,
                  }}
                />{" "}
              </AlgaehSecurityElement>

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
