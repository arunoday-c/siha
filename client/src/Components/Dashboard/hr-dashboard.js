import React, { Component } from "react";
import "./dashboard.scss";
import { HorizontalBar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import DashBoardEvents, {
  chartLegends,
  chartOptionsHorizontal,
} from "./DashBoardEvents";
import { MainContext } from "algaeh-react-components";
import { AlagehAutoComplete } from "../Wrapper/algaehWrapper";
import {
  AlgaehDataGrid,
  AlgaehDateHandler,
  // AlgaehMessagePop,
} from "algaeh-react-components";
import moment from "moment";
const dashEvents = DashBoardEvents();

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
      no_of_employees: 0,
      total_company_salary: 0,
      total_staff_count: 0,
      total_labour_count: 0,
      total_staff_salary: 0,
      total_labor_salary: 0,
      total_localite_count: 0,
      total_expatriate_count: 0,
      projectEmployee: {},
      Dept_Employee: {},
      Desig_Employee: {},
      no_of_emp_join: [],
      avg_salary: 0,
      no_of_projects: 0,
      hospital_id: "",
      dateRange: [moment().startOf("month"), moment().endOf("month")],
      dateRangeEmployee: [moment().startOf("month"), moment().endOf("month")],
      documentExipryData: [],
      employeeJoinedThisMonth: [],
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.props.getOrganizations({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      redux: {
        type: "ORGS_GET_DATA",
        mappingName: "organizations",
      },
    });

    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
      },
      () => {
        dashEvents.getEmployeeList(this);
        dashEvents.getEmployeeDepartmentsWise(this);
        dashEvents.getEmployeeDesignationWise(this);
        dashEvents.getProjectList(this);
        dashEvents.getEmployeeProjectWise(this);
        dashEvents.getDocumentExpiryCurrentMonth(this);
        dashEvents.getEmployeeCurrentMonth(this);
      }
    );
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block",
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
    });
  }

  eventHandaler(e) {
    console.log(e, "eventObj");
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState(
      {
        [name]: value,
      },
      () => {
        dashEvents.getEmployeeList(this);
        dashEvents.getEmployeeDepartmentsWise(this);
        dashEvents.getEmployeeDesignationWise(this);
        dashEvents.getProjectList(this);
        dashEvents.getEmployeeProjectWise(this);
      }
    );
  }

  render() {
    return (
      <div className="dashboard hr-dash">
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-lg-3 col-md-3 col-sm-12  form-group" }}
            label={{
              forceLabel: "Select a Branch",
              isImp: true,
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
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
              autoComplete: "off",
            }}
          />
        </div>
        <div className="row card-deck">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Total Project</p>
                    {this.state.no_of_projects}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Total Staff</p>
                    {this.state.total_staff_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Total Labour</p>
                    {this.state.total_labour_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Total Localite</p>
                    {this.state.total_localite_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Total Expatriate</p>
                    {this.state.total_expatriate_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-building" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Staff Cost</p>
                    {GetAmountFormart(this.state.total_staff_salary)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                {/* <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-users" />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="text">
                    <p>Labour Cost</p>
                    {GetAmountFormart(this.state.total_labor_salary)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row">
              {" "}
              <div className="col-sm-12 col-md-4 col-lg-4">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Projects</h6>
                  <div className="dashboardChartsCntr">
                    <HorizontalBar
                      data={this.state.projectEmployee}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Department</h6>
                  <div className="dashboardChartsCntr">
                    <HorizontalBar
                      data={this.state.Dept_Employee}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </div>
                </div>
              </div>{" "}
              <div className="col-sm-12 col-md-4 col-lg-4">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Designation</h6>
                  <div className="dashboardChartsCntr">
                    <HorizontalBar
                      data={this.state.Desig_Employee}
                      legend={chartLegends}
                      options={chartOptionsHorizontal}
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>New Employee Joined this Month</h6>

                  <div className="row dashboardGridCntr">
                    <div className="col">
                      {" "}
                      <div className="col">
                        <div className="row">
                          {" "}
                          <AlgaehDateHandler
                            type={"range"}
                            div={{
                              className: "col-6 form-group",
                            }}
                            label={{
                              forceLabel: "Select Date Range",
                            }}
                            textBox={{
                              name: "selectRange",
                              value: this.state.dateRangeEmployee,
                            }}
                            // maxDate={new date()}
                            events={{
                              onChange: (dateSelected) => {
                                // const months = moment(dateSelected[1]).diff(
                                //   dateSelected[0],
                                //   "months"
                                // );
                                // if (months <= 11) {
                                this.setState(
                                  { dateRange: dateSelected },
                                  () => {
                                    dashEvents.getEmployeeCurrentMonth(this);
                                  }
                                );
                                // } else {
                                //   AlgaehMessagePop({
                                //     title: "error",
                                //     display: "you can select maximum one year.",
                                //   });
                                // }
                              },
                            }}
                            // others={{
                            //   ...format,
                            // }}
                          />
                          <div className="col-12">
                            <AlgaehDataGrid
                              className="dashboardGrd"
                              columns={[
                                {
                                  fieldName: "row_num",
                                  label: "Sl.no",
                                },
                                {
                                  fieldName: "date_of_joining",
                                  label: "Join Date",
                                },
                                {
                                  fieldName: "employee_code",
                                  label: "Employee Code",
                                },
                                {
                                  fieldName: "full_name",
                                  label: "Employee Name",
                                },
                                {
                                  fieldName: "sex",
                                  label: "Gender",
                                },
                                {
                                  fieldName: "designation",
                                  label: "Designation",
                                },
                                {
                                  fieldName: "sub_department_name",
                                  label: "Sub Department",
                                },
                              ]}
                              // height="40vh"
                              rowUnique="finance_voucher_id"
                              data={
                                this.state.employeeJoinedThisMonth
                                  ? this.state.employeeJoinedThisMonth
                                  : []
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>Document Expire next month</h6>
                  <div className="row dashboardGridCntr">
                    <div className="col">
                      {" "}
                      <div className="col">
                        <div className="row">
                          {" "}
                          <AlgaehDateHandler
                            type={"range"}
                            div={{
                              className: "col-6 form-group",
                            }}
                            label={{
                              forceLabel: "Select Date Range",
                            }}
                            textBox={{
                              name: "selectRange",
                              value: this.state.dateRange,
                            }}
                            // maxDate={new date()}
                            events={{
                              onChange: (dateSelected) => {
                                // const months = moment(dateSelected[1]).diff(
                                //   dateSelected[0],
                                //   "months"
                                // );
                                // if (months <= 11) {
                                this.setState(
                                  { dateRange: dateSelected },
                                  () => {
                                    dashEvents.getDocumentExpiryCurrentMonth(
                                      this
                                    );
                                  }

                                  //     });
                                  //   } else {
                                  //     AlgaehMessagePop({
                                  //       title: "error",
                                  //       display: "you can select maximum one year.",
                                  //     });
                                  //   }
                                );
                              },
                            }}
                            // others={{
                            //   ...format,
                            // }}
                          />
                          <div className="col-12">
                            <AlgaehDataGrid
                              className="dashboardGrd"
                              columns={[
                                {
                                  fieldName: "row_num",
                                  label: "Sl.no",
                                },
                                {
                                  fieldName: "employee_code",
                                  label: "Employee Code",
                                },
                                {
                                  fieldName: "full_name",
                                  label: "Employee Name",
                                },
                                {
                                  fieldName: "identity_document_name",
                                  label: "Document Type",
                                },
                                {
                                  fieldName: "valid_upto",
                                  label: "Valid Upto",
                                },
                              ]}
                              // height="40vh"
                              rowUnique="identity_documents_id"
                              data={
                                this.state.documentExpiryData
                                  ? this.state.documentExpiryData
                                  : []
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hospitaldetails: state.hospitaldetails,
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions,
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
