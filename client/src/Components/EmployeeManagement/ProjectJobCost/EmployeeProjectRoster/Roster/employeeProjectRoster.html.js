import React, { useContext, useState } from "react";
import { ProjectRosterContext } from "./index";
import Table from "./table";
import ProjectAssigned from "./AssignProject";
import { EmployeeFilter } from "../../../../common/EmployeeFilter";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
import {
  getEmployeesForProjectRoster,
  getProjects
} from "./employeeProjectRoster.event";
import "../EmployeeProjectRoster.css";
export default function EmpProjectRoster(props) {
  const { getProjectRosterState, setProjectRosterState } = useContext(
    ProjectRosterContext
  );
  const {
    employees,
    total_rosted,
    total_non_rosted,
    fromDate,
    toDate
  } = getProjectRosterState();
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  return (
    <div className="EmployeeProjectRoster">
      <EmployeeFilter
        loadFunc={inputs => {
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
        }}
      />
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div
                className="caption"
                style={{ borderRight: " 1px solid #000", paddingRight: 25 }}
              >
                <h3 className="caption-subject">
                  Project Rostering List : Total Rosters :{total_rosted}
                  <b style={{ color: "#33b8bc" }}>
                    Total Non Rosters :{total_non_rosted}
                  </b>
                </h3>
              </div>
              <div className="actions">
                <span style={{ background: "#3f9c62" }} className="legends">
                  Weekly Off (WO)
                </span>
                <span style={{ background: "#3f789c" }} className="legends">
                  Holiday (HO)
                </span>
                <span style={{ background: "#879c3f" }} className="legends">
                  Leave Approved (APR)
                </span>
                <span style={{ background: "#9c7d3f" }} className="legends">
                  Leave Approval Pending (PEN)
                </span>
              </div>
              {total_rosted === 0 && (
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: 25 }}
                  onClick={e => {
                    setShowPopup(true);
                    if (projects.length === 0) {
                      setLoadingProjects(true);
                      getProjects()
                        .then(result => {
                          setLoadingProjects(false);
                          setProjects(result);
                        })
                        .catch(error => {
                          setProjects([]);
                          setLoadingProjects(false);
                        });
                    }
                  }}
                >
                  Assign New Project
                </button>
              )}
            </div>
            <ProjectAssigned
              showPopup={showPopup}
              projects={projects}
              loadingProjects={loadingProjects}
              onClose={() => {
                setShowPopup(false);
              }}
            />
            <div className="portlet-body">
              <div className="col-12" id="projectRosterTable">
                <div className="row">
                  {employees.length === 0 ? (
                    <div className="noTimeSheetData">
                      <h1>Employee Project Roster</h1>
                      <i className="fas fa-user-clock" />
                    </div>
                  ) : (
                    <Table />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
