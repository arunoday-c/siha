import React, { Component } from "react";
import "./project_assign.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehModalPopUp from "../../../Wrapper/modulePopUp";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import isEqual from "lodash/isEqual";
class ProjectAssign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      projects: [],
      employee: {}
    };
  }

  projectHandler(data, e) {
    this.setState(data);
  }

  componentDidMount() {
    this.setState({
      employee: this.props.sendRow,
      ...this.props.data
    });
  }

  SearchHandler(e) {
    let ProjectSearch = e.target.value.toLowerCase(),
      projects = this.state.projects.filter(el => {
        let searchValue = el.project_desc.toLowerCase();
        return searchValue.indexOf(ProjectSearch) !== -1;
      });

    this.setState({
      projectList: projects,
      searchprojects: e.target.value
    });
  }

  processAssignment() {
    if (
      this.state.hims_d_project_id === undefined ||
      this.state.hims_d_project_id === null
    ) {
      swalMessage({
        title: "Please Select a project to assign",
        type: "warning"
      });
    } else if (!this.state.employee.hasOwnProperty("employee_code")) {
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
        project_id: this.state.hims_d_project_id,
        employees: [this.state.employee],
        hospital_id: this.state.hospital_id
      };

      // console.log(JSON.stringify(sendData));

      algaehApiCall({
        uri: "/projectjobcosting/addProjectRoster",
        method: "POST",
        data: sendData,
        module: "hrManagement",
        onSuccess: res => {
          if (res.data.success) {
            swalMessage({
              title: "Record Added Successfully",
              type: "success"
            });
            document.getElementById("clsProjAsgn").click();
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
    const _projectList =
      this.state.projectList.length === 0
        ? this.state.projects
        : this.state.projectList;
    const { employee } = this.state;
    return (
      <AlgaehModalPopUp
        class="projectAssignModal"
        openPopup={this.props.open}
        title="Project Assign"
        events={{
          onClose: this.props.onClose
        }}
        className="col-lg-12 ShiftAssign"
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
                    this.setState({
                      from_date: selDate
                    });
                  }
                }}
                maxDate={new Date()}
                value={this.state.from_date}
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
                    this.setState({
                      to_date: selDate
                    });
                  }
                }}
                minDate={this.state.from_date}
                value={this.state.to_date}
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
                      value: this.state.searchprojects,
                      events: {
                        onChange: this.SearchHandler.bind(this)
                      },
                      option: {
                        type: "text"
                      },
                      others: {
                        placeholder: "Search projects",
                        tabIndex: "4"
                      }
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
                  {_projectList.map((data, index) => {
                    return (
                      <li key={index}>
                        <input
                          id={data.project_code}
                          name="hims_d_project_id"
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
                            {`${data.project_desc} (${data.project_code})`}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="col-8">
                {/* <h6>Assign Employee</h6>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    textBox={{
                      className: "txt-fld",
                      name: "searchEmployees",
                      value: this.state.searchEmployees,
                      events: {
                        onChange: this.SearchHandler.bind(this)
                      },
                      option: {
                        type: "text"
                      },
                      others: {
                        placeholder: "Search Employee",
                        tabIndex: "3",
                        disabled: this.state.allChecked
                      }
                    }}
                  />
                </div> */}

                <ul className="projEmployeeList">
                  <li>
                    <p>Selected Employee</p>
                  </li>
                  <li>
                    <p>
                      <b>{employee.employee_name}</b>
                      <small>{employee.employee_code}</small>
                    </p>
                  </li>
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
                  onClick={this.processAssignment.bind(this)}
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
