import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ProjectPayroll.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  // AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";

import { getYears, GetAmountFormart } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import { AlgaehActions } from "../../../../actions/algaehActions";
import ProjectPayrollEvents from "./ProjectPayrollEvents";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { MainContext, AlgaehDataGrid } from "algaeh-react-components";
import ProjectPayrollSalaryBreakup from "./ProjectPayrollSalaryBreakup";
// import { getBranchDetails, getHospitals } from "./ProjectPayrollEvents";

class ProjectPayroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      hospital_id: "",

      project_wise_payroll: [],
      noEmployees: 0,
      no_projects: 0,
      total_worked_hours: 0,
      project_id: null,
      employee_id: null,
      employee_name: null,
      total_cost: 0,
      lbl_total: "Total Employees",
      decimal_places: 0,
      isOpen: false,
      currency_code: "",
      // allDepartments: [],
    };
    // this.baseState = this.state;
  }

  eventHandaler(e) {
    ProjectPayrollEvents().texthandle(this, e);
  }
  LoadData() {
    ProjectPayrollEvents().LoadProjectDetails(this);
  }
  openSalaryComponents(row) {
    ProjectPayrollEvents().openSalaryComponents(this, row);
  }
  closeSalaryComponents() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  clearState() {
    this.setState({
      selectedLang: this.props.SelectLanguage,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      // hospital_id: "",

      project_wise_payroll: [],
      noEmployees: 0,
      no_projects: 0,
      total_worked_hours: 0,
      project_id: null,
      employee_id: null,
      employee_name: null,
      total_cost: 0,
      lbl_total: "Total Employees",
      decimal_places: 0,
      isOpen: false,
    });
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
      decimal_places: userToken.decimal_places,
    });

    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
      });
    }

    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        // data: { hospital_id: this.state.hospital_id },
        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees",
        },
      });
    }

    if (this.props.projects === undefined || this.props.projects.length === 0) {
      this.props.getProjects({
        uri: "/hrsettings/getProjects",
        module: "hrManagement",
        method: "GET",
        date: { pjoject_status: "A" },
        redux: {
          type: "PROJECTS_GET_DATA",
          mappingName: "projects",
        },
      });
    }
  }

  render() {
    let allYears = getYears();

    const Project_name =
      this.props.projects === undefined
        ? []
        : this.props.projects.filter(
            (f) => f.hims_d_project_id === this.state.project_id
          );

    return (
      <div className="projectPayrollScreen">
        <div className="row  inner-top-search">
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "branch",
              isImp: true,
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id || "",
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.props.organizations,
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null,
                });
              },
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-1 mandatory" }}
            label={{
              fieldName: "year",
              isImp: true,
            }}
            selector={{
              name: "year",
              className: "select-fld",
              value: this.state.year,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: allYears,
              },
              onChange: this.eventHandaler.bind(this),

              onClear: () => {
                this.setState({
                  year: null,
                });
              },
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              fieldName: "select_month",
              isImp: true,
            }}
            selector={{
              sort: "off",
              name: "month",
              className: "select-fld",
              value: this.state.month,
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.MONTHS,
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  month: null,
                });
              },
            }}
          />

          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Select Project",
              // isImp: true,
              // isImp: false,
            }}
            selector={{
              name: "project_id",
              className: "select-fld",
              value: this.state.project_id,
              dataSource: {
                textField: "project_desc",
                valueField: "hims_d_project_id",
                data: this.props.projects,
              },
              onChange: this.eventHandaler.bind(this),
              onClear: () => {
                this.setState({
                  project_id: null,
                });
              },
            }}
          />

          <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ fieldName: "searchEmployee" }} />
            <h6
              onClick={ProjectPayrollEvents().employeeSearch.bind(this, this)}
            >
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>

          {/* <div className="col-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                <h6>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "------"}
                </h6>
              </div>
              <div
                className="col-lg-3"
                style={{ borderLeft: "1px solid #ced4d8" }}
              >
                <i
                  className="fas fa-search fa-lg"
                  style={{
                    paddingTop: 17,
                    paddingLeft: 3,
                    cursor: "pointer"
                  }}
                  onClick={ProjectPayrollEvents().employeeSearch.bind(
                    this,
                    this
                  )}
                />
              </div>
            </div>
          </div> */}

          <div className="col-2 form-group">
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 20 }}
              className="btn btn-default"
            >
              Clear
            </button>{" "}
            <button
              style={{ marginTop: 20, marginLeft: 5 }}
              className="btn btn-primary"
              onClick={this.LoadData.bind(this)}
            >
              <span>Load</span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Selected Project -
                    <b>
                      {Project_name.length > 0
                        ? Project_name[0].project_desc
                        : ""}
                    </b>
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="projectPayrollGrid_Cntr">
                    <AlgaehDataGrid
                      id="projectPayrollGrid"
                      datavalidate="projectPayrollGrid"
                      columns={[
                        {
                          fieldName: "Action",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Action",
                              }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                <i
                                  className="fas fa-eye"
                                  aria-hidden="true"
                                  onClick={this.openSalaryComponents.bind(
                                    this,
                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            minWidth: 50,
                            filterable: false,
                            sortable: false,
                          },
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />
                          ),
                          filterable: true,
                          others: {
                            maxWidth: 80,
                          },
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Name" }} />
                          ),
                          filterable: true,
                          others: {
                            style: {
                              textAlign: "left",
                            },
                          },
                        },
                        // {
                        //   fieldName: "department_name",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Department Name" }}
                        //     />
                        //   ),
                        // },
                        // {
                        //   fieldName: "sub_department_name",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Sub Depart. Name" }}
                        //     />
                        //   ),
                        // },
                        {
                          fieldName: "designation",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Designation " }}
                            />
                          ),
                          filterable: true,
                          others: {
                            maxWidth: 130,
                          },
                        },

                        {
                          fieldName: "basic_hours",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Basic Hrs" }} />
                          ),
                          others: {
                            maxWidth: 80,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "basic_cost",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Gross Amt." }} />
                          ),
                          displayTemplate: (row) => {
                            return GetAmountFormart(row.basic_cost);
                          },
                          others: {
                            maxWidth: 120,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        // {
                        //   fieldName: "ot_hours",
                        //   label: (
                        //     <AlgaehLabel label={{ forceLabel: "OT Hrs" }} />
                        //   ),
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "ot_cost",
                        //   label: (
                        //     <AlgaehLabel label={{ forceLabel: "Amount" }} />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return GetAmountFormart(row.ot_cost);
                        //   },
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "total_hours",

                        //   label: (
                        //     <AlgaehLabel label={{ forceLabel: "Total Hrs" }} />
                        //   ),
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "wot_hours",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Weekoff OT Hrs" }}
                        //     />
                        //   ),
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "wot_cost",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Weekoff OT Amount" }}
                        //     />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return GetAmountFormart(row.wot_cost);
                        //   },
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "hot_hours",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Holiday OT Hrs" }}
                        //     />
                        //   ),
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        // {
                        //   fieldName: "hot_cost",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Holiday OT Amount" }}
                        //     />
                        //   ),
                        //   displayTemplate: (row) => {
                        //     return GetAmountFormart(row.hot_cost);
                        //   },
                        //   others: {
                        //     maxWidth: 80,
                        //     resizable: false,
                        //     filterable: false,
                        //     style: { textAlign: "center" },
                        //   },
                        // },
                        {
                          fieldName: "total_ot_hours",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Total OT Hr" }}
                            />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "total_ot_cost",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Total OT Amt." }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return GetAmountFormart(row.total_ot_cost);
                          },
                          others: {
                            maxWidth: 120,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "total_hours",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Hr" }} />
                          ),
                          others: {
                            maxWidth: 100,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },

                        // {
                        //   fieldName: "complete_hours",
                        {
                          fieldName: "cost",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Total Cost" }} />
                          ),
                          displayTemplate: (row) => {
                            return GetAmountFormart(row.cost);
                          },
                          others: {
                            maxWidth: 120,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" },
                          },
                        },

                        {
                          fieldName: "project_desc",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Project Name" }}
                            />
                          ),
                          filterable: true,
                          others: {
                            style: {
                              textAlign: "left",
                            },
                          },
                        },
                      ]}
                      keyId="projectPayrollGrid"
                      data={this.state.project_wise_payroll}
                      // isEditable={false}
                      // filter={true}
                      // paging={{ page: 0, rowsPerPage: 20 }}
                      pagination={true}
                      isFilterable={true}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row">
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Employee",
                        // forceLabel: this.state.lbl_total,
                      }}
                    />
                    <h6>{this.state.noEmployees} Nos</h6>
                  </div>

                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Projects",
                        // forceLabel: this.state.lbl_total,
                      }}
                    />
                    <h6>{this.state.no_projects} Nos</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Total Worked Hr",
                      }}
                    />
                    <h6>{this.state.total_worked_hours} Hr</h6>
                  </div>
                  <div className="col-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Project Total Cost",
                      }}
                    />

                    <h6>{GetAmountFormart(this.state.total_cost)}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              {this.state.net_amount != null ? (
              <button
                type="button"
                className="btn btn-other"
                onClick={this.clearState.bind(this)}
                onClick={this.generateFinalSettlementSlip.bind(this)}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Generate Settlement Slip",
                    returnText: true,
                  }}
                />
              </button>
              ) : null}
            </div>
          </div>
        </div> */}

        <ProjectPayrollSalaryBreakup
          open={this.state.isOpen}
          onClose={this.closeSalaryComponents.bind(this)}
          selectedEmployee={this.state.selected_employee}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
    all_employees: state.all_employees,
    projects: state.projects,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions,
      getProjects: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectPayroll)
);
