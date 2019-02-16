import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ManualAttendance.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getYears } from "../../../../utils/GlobalFunctions";
import { AlgaehActions } from "../../../../actions/algaehActions";
import ManualAttendanceEvents from "./ManualAttendanceEvents.js";
import moment from "moment";

class ManualAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_department_id: null,
      employee_group_id: null,
      project_id: null,

      hospital_id: JSON.parse(sessionStorage.getItem("CurrencyDetail"))
        .hims_d_hospital_id
    };
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }

    if (
      this.props.emp_groups === undefined ||
      this.props.emp_groups.length === 0
    ) {
      this.props.getEmpGroups({
        uri: "/hrsettings/getEmployeeGroups",
        module: "hrManagement",
        method: "GET",
        data: { record_status: "A" },
        redux: {
          type: "EMP_GROUP_GET",
          mappingName: "emp_groups"
        }
      });
    }

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        data: {
          sub_department_status: "A"
        },
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment"
        }
      });
    }

    if (this.props.projects === undefined || this.props.projects.length === 0) {
      this.props.getProjects({
        uri: "/hrsettings/getProjects",
        module: "hrManagement",
        method: "GET",
        date: { pjoject_status: "A" },
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "projects"
        }
      });
    }
  }

  eventHandaler(e) {
    ManualAttendanceEvents().texthandle(this, e);
  }

  render() {
    let allYears = getYears();
    return (
      <div id="ManualAttendanceScreen">
        <div className="row inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Branch.",
              isImp: true
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.props.organizations
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col form-group" }}
            label={{
              forceLabel: "Select Project",
              isImp: true
            }}
            selector={{
              name: "project_id",
              className: "select-fld",
              value: this.state.project_id,
              dataSource: {
                textField: "project_desc",
                valueField: "hims_d_project_id",
                data: this.props.projects
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  project_id: null
                });
              }
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select Employee Group",
              isImp: true
            }}
            selector={{
              name: "employee_group_id",
              className: "select-fld",
              value: this.state.employee_group_id,
              dataSource: {
                textField: "group_description",
                valueField: "hims_d_employee_group_id",
                data: this.props.emp_groups
              },
              onChange: this.eventHandaler.bind(this)
            }}
          />

          <div className="col form-group">
            <button style={{ marginTop: 21 }} className="btn btn-default">
              Load
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered">
              <div className="portlet-body">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "Select Date", isImp: false }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    maxDate={new Date()}
                    events={{}}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Start Time",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "End Time",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Total Hours",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time",
                        disabled: "disabled"
                      }
                    }}
                  />{" "}
                  <div className="col">
                    <button
                      style={{ marginTop: 21 }}
                      className="btn btn-default"
                    >
                      Add to all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EnterGridIdHere_Cntr">
                    <AlgaehDataGrid
                      id="EnterGridIdHere"
                      datavalidate="EnterGridIdHere"
                      columns={[
                        {
                          fieldName: "empName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "empCode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Selected Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "startTime",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Start Time" }} />
                          )
                        },
                        {
                          fieldName: "endTime",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "End Time" }} />
                          )
                        },
                        {
                          fieldName: "totalHr",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Hour" }} />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
                      isEditable={false}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button className="btn btn-primary">Process Attendance</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subdepartment: state.subdepartment,
    organizations: state.organizations,
    projects: state.projects,
    emp_groups: state.emp_groups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions,
      getProjects: AlgaehActions,
      getEmpGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ManualAttendance)
);
