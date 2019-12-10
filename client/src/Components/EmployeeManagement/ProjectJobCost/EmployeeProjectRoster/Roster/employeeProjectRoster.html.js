import React, { useContext, useState, createRef } from "react";
import { ProjectRosterContext } from "./index";
import Table from "./table";
import ProjectAssigned from "./AssignProject";
import { EmployeeFilter } from "../../../../common/EmployeeFilter";
import AlgaehLoader from "../../../../Wrapper/fullPageLoader";
// import { Search } from "semantic-ui-react";
// import ReactPrint from "react-to-print";
import {
  getEmployeesForProjectRoster,
  getProjects,
  createReport
} from "./employeeProjectRoster.event";
import { swalMessage } from "../../../../../utils/algaehApiCall";
import "../EmployeeProjectRoster.scss";
export default function EmpProjectRoster(props) {
  const { getProjectRosterState, setProjectRosterState } = useContext(
    ProjectRosterContext
  );
  const {
    // filterTrue,
    employees,
    total_rosted,
    total_non_rosted,
    // fromDate,
    // toDate,
    inputs
  } = getProjectRosterState();
  const [showPopup, setShowPopup] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isEditing, setIsEditing] = useState(undefined);
  const [filterStatus, setFilterStatus] = useState("0");
  // const [filterValue, setFilterValue] = useState("");
  // const [filterLoading, setFilterLoading] = useState(false);
  const tableRef = createRef();
  function editingProjectRoster(data) {
    setShowPopup(true);
    setIsEditing(data);

    setLoadingProjects(true);
    getProjects(inputs.hospital_id)
      .then(result => {
        setLoadingProjects(false);
        setProjects(result);
      })
      .catch(error => {
        setProjects([]);
        setLoadingProjects(false);
      });
  }
  return (
    <div className="EmployeeProjectRoster">
      <EmployeeFilter
        loadFunc={inputs => {
          AlgaehLoader({ show: true });
          setFilterStatus("0");
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
                toDate: toDate,
                filterTrue: false,
                filterEmployees: []
              });
              AlgaehLoader({ show: false });
            })
            .catch(error => {
              AlgaehLoader({ show: false });
              swalMessage({ title: error, type: "info" });
              setProjectRosterState({
                employees: [],
                dates: [],
                filterTrue: false,
                filterEmployees: []
              });
            });
        }}
      />
      <div className="row">
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption" style={{ paddingRight: 10 }}>
                <h3 className="caption-subject">
                  Project Rostering List:
                  <small> Assigned :{total_rosted}</small> |
                  <small> Pending :{total_non_rosted}</small>
                </h3>
              </div>
              <div className="actions">
                {" "}
                <span
                  style={{
                    background: "rgb(255, 230, 234)",
                    color: "rgb(228, 34, 69)"
                  }}
                  className="legends"
                >
                  Not Assigned
                </span>{" "}
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
              <select
                style={{ marginLeft: 10 }}
                onChange={e => {
                  let selected = e.target.value;
                  setFilterStatus(selected);
                  if (selected === "0") {
                    setProjectRosterState({
                      filterEmployees: [],
                      filterTrue: false,
                      selectedFilter: selected
                    });
                  } else {
                    const emp = employees.map(employee => {
                      let allProjects = employee.projects;

                      const projs = employee.projects.filter(f => {
                        return f.status === "N";
                      });
                      if (selected === "1") {
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
                    setProjectRosterState({
                      selectedFilter: selected,
                      filterTrue: true,
                      filterEmployees: allEmployees
                    });
                  }
                }}
                value={filterStatus}
              >
                <option value="0">Show All</option>
                <option value="1">Show Assigned</option>
                <option value="2">Show Pending</option>
              </select>
            </div>
            <ProjectAssigned
              showPopup={showPopup}
              projects={projects}
              loadingProjects={loadingProjects}
              isEditing={isEditing}
              onRefreshTable={() => {
                AlgaehLoader({ show: true });
                getEmployeesForProjectRoster(inputs)
                  .then(result => {
                    const { records, fromDate, toDate } = result;
                    setProjectRosterState({
                      total_rosted: records.total_rosted,
                      total_non_rosted: records.total_non_rosted,
                      employees: records.roster
                    });
                    AlgaehLoader({ show: false });
                  })
                  .catch(error => {
                    setProjectRosterState({ employees: [], dates: [] });
                    AlgaehLoader({ show: false });
                  });
              }}
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
                    <Table ref={tableRef} editing={editingProjectRoster} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div className="hptl-phase1-footer">
        <div className="row">
          <div className="col-lg-12">
            <button
              className="btn btn-primary"
              onClick={e => {
                setIsEditing(undefined);
                setShowPopup(true);

                if (projects.length === 0) {
                  setLoadingProjects(true);
                  getProjects(inputs.hospital_id)
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
            <button type="button" className="btn btn-default">
              Download as Excel
            </button>
            <button
              type="button"
              className="btn btn-default"
              onClick={() => {
                let newTable = tableRef.current.cloneNode(true);
                newTable.classList.remove("rosterTableStyle");

                let elements = newTable.querySelectorAll("i");
                for (let i = 0; i < elements.length; i++) {
                  elements[i].nextElementSibling.remove();
                  elements[i].remove();
                }
                createReport(newTable.outerHTML).catch(error => {
                  console.error(error);
                });
              }}
            >
              Download as PDF
            </button>
            {/* <ReactPrint
              trigger={() => (
                <button type="button" className="btn btn-default">
                  Download as PDF
                </button>
              )}
              content={() => {
                let newTable = tableRef.current.cloneNode(true);
                
                let elements = newTable.querySelectorAll("i");
                for (let i = 0; i < elements.length; i++) {
                  elements[i].nextElementSibling.remove();
                  elements[i].remove();
                }
                return newTable;
              }}
              removeAfterPrint={true}
              pageStyle="ProjectJobCost printing"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
