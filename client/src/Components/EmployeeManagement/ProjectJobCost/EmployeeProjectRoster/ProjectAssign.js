import React, { Component } from "react";
import { AlgaehDateHandler } from "../../../Wrapper/algaehWrapper";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import "./project_assign.css";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";

class ProjectAssign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeList: [],
      employees: [],
      projectList: [],
      projects: [],
      projEmp: []
    };
  }

  projectHandler(data, e) {
    this.setState(data);
  }

  addEmployees(row) {
    let myArray = this.state.projEmp;

    if (myArray.includes(row)) {
      myArray.pop(row);
    } else {
      myArray.push(row);
    }

    this.setState({
      projEmp: myArray
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      let myArray = this.state.projEmp;
      myArray.push(nextProps.sendRow);
      this.setState({
        ...nextProps.data,
        projEmp: myArray
      });
    } else {
      this.setState({
        projEmp: [],
        employeeList: this.state.employees,
        projectList: this.state.projects
      });
    }
  }

  SearchHandler(e) {
    switch (e.target.name) {
      case "searchEmployees":
        let search = e.target.value.toLowerCase(),
          employees = this.state.employees.filter(el => {
            let searchValue = el.employee_name.toLowerCase();
            return searchValue.indexOf(search) !== -1;
          });

        this.setState({
          employeeList: employees
        });
        break;

      default:
        let ProjectSearch = e.target.value.toLowerCase(),
          projects = this.state.projects.filter(el => {
            let searchValue = el.project_desc.toLowerCase();
            return searchValue.indexOf(ProjectSearch) !== -1;
          });

        this.setState({
          projectList: projects
        });
        break;
    }
  }

  processAssignment() {
    if (this.state.project_id === undefined || this.state.project_id === null) {
      swalMessage({
        title: "Please Select a project to assign",
        type: "warning"
      });
    } else if (
      this.state.projEmp.length === 0 ||
      this.state.projEmp === undefined
    ) {
      swalMessage({
        title: "Please select atleast one employee to asssign project",
        type: "warning"
      });
    } else if (
      moment(this.state.from_date).format("YYYYMMDD") >
      moment(this.state.to_date).format("YYYYMMDD")
    ) {
      swalMessage({
        title: "Please select a proper Date Range",
        type: "warning"
      });
    } else {
      let sendData = {
        from_date: moment(this.state.from_date).format("YYYY-MM-DD"),
        to_date: moment(this.state.to_date).format("YYYY-MM-DD"),
        project_id: this.state.project_id,
        employees: this.state.projEmp,
        hospital_id: this.state.hospital_id
      };

      algaehApiCall({
        uri: "/shift_roster/addShiftRoster",
        method: "POST",
        data: sendData,
        module: "hrManagement",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Record Added Successfully",
              type: "success"
            });
            document.getElementById("clsSftAsgn").click();
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });
        }
      });

      // console.log("SEND DATA:", JSON.stringify(sendData));
    }
  }

  render() {
    const _employeeList =
      this.state.employeeList.length === 0
        ? this.state.employees
        : this.state.employeeList;

    const _projectList =
      this.state.projectList.length === 0
        ? this.state.projects
        : this.state.projectList;

    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
        className="col-lg-12 ShiftAssign"
      >
        <div className="popupInner" data-validate="LvEdtGrd">
          <div className="col-12">
            <div className="row">
              <AlgaehDateHandler
                div={{ className: "col-3 margin-bottom-15" }}
                label={{
                  forceLabel: "From Date",
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
                    this.setState({
                      from_date: selDate
                    });
                  }
                }}
                maxDate={new Date()}
                value={this.state.from_date}
              />
              <AlgaehDateHandler
                div={{ className: "col-3 margin-bottom-15" }}
                label={{
                  forceLabel: "To Date",
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
                    this.setState({
                      to_date: selDate
                    });
                  }
                }}
                minDate={this.state.from_date}
                value={this.state.to_date}
              />
            </div>
            <div style={{ maxHeight: "400px" }} className="row">
              <div className="col-6">
                <h6>EMPLOYEES</h6>
                <input
                  type="text"
                  autoComplete="off"
                  name="searchEmployees"
                  className="rosterSrch"
                  placeholder="Search Employees"
                  value={this.state.searchEmployees}
                  onChange={this.SearchHandler.bind(this)}
                />
                <ul className="projEmployeeList">
                  {_employeeList.map((data, index) => (
                    <li key={index}>
                      <input
                        id={data.employee_code}
                        type="checkbox"
                        checked={this.state.projEmp.includes(data)}
                        onChange={this.addEmployees.bind(this, data)}
                      />
                      <label
                        htmlFor={data.employee_code}
                        style={{
                          width: "80%"
                        }}
                      >
                        {data.employee_name}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-6">
                <h6>PROJECTS</h6>
                <input
                  type="text"
                  autoComplete="off"
                  name="searchprojects"
                  className="rosterSrch"
                  placeholder="Search projects"
                  value={this.state.searchprojects}
                  onChange={this.SearchHandler.bind(this)}
                />
                <ul className="projectList">
                  {_projectList.map((data, index) => (
                    <li key={index}>
                      <input
                        id={data.project_code}
                        name="shift_id"
                        value={data}
                        onChange={this.projectHandler.bind(this, data)}
                        type="radio"
                      />
                      <label
                        htmlFor={data.project_code}
                        style={{
                          width: "80%"
                        }}
                      >
                        <span>
                          {data.project_desc + " (" + data.project_code + ") "}
                        </span>
                      </label>
                    </li>
                  ))}
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
                <button
                  // onClick={this.processAssignment.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  PROCESS
                </button>

                <button
                  onClick={this.props.onClose}
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
}

export default ProjectAssign;
