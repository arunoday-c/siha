import React, { useContext } from "react";
import { ProjectRosterContext } from "./index";
import Table from "./table";
import { EmployeeFilter } from "../../../../common/EmployeeFilter";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
import { getEmployeesForProjectRoster } from "./employeeProjectRoster.event";
import "../EmployeeProjectRoster.css";
export default function EmpProjectRoster(props) {
  const { getProjectRosterState, setProjectRosterState } = useContext(
    ProjectRosterContext
  );
  const { employees, totalRosters } = getProjectRosterState();
  return (
    <div className="EmployeeProjectRoster">
      <EmployeeFilter
        loadFunc={inputs => {
          AlgaehLoader({ show: true });
          getEmployeesForProjectRoster(inputs)
            .then(result => {
              setProjectRosterState({ employees: result, inputs: inputs });
              AlgaehLoader({ show: false });
            })
            .catch(error => {
              setProjectRosterState({ employees: [] });
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
                  Project Rostering List :{" "}
                  <b style={{ color: "#33b8bc" }}>??</b>
                </h3>
                <span> Total {totalRosters}</span>
              </div>
              <div className="actions">
                <span style={{ background: "#3f9c62" }} className="legends">
                  Weekly Off (WO)
                </span>
                <span style={{ background: "#3f789c" }} className="legends">
                  Holiday (HO)
                </span>
                <span style={{ background: "#879c3f" }} className="legends">
                  Leave Authorized (LV)
                </span>
                <span style={{ background: "#9c7d3f" }} className="legends">
                  Leave Applied (LA)
                </span>
              </div>
              {employees.length !== 0 && (
                <button
                  className="btn btn-primary"
                  style={{ marginLeft: 25 }}
                  onClick={e => {}}
                >
                  Assign to all
                </button>
              )}
            </div>
            <div className="portlet-body">
              <div className="col-12" id="projectRosterTable">
                <div className="row">
                  {employees.length === 0 ? (
                    <div className="noTimeSheetData">
                      <h1>Employee Project Roster</h1>
                      <i className="fas fa-user-clock" />
                    </div>
                  ) : (
                    <Table {...props} />
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
