import React, { Component } from "react";
import "./dashboard.scss";
import { Bar, HorizontalBar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import DashBoardEvents, {
  chartLegends,
  chartOptions,
  chartOptionsHorizontal
} from "./DashBoardEvents";
import { MainContext } from "algaeh-react-components/context";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../Wrapper/algaehWrapper";

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
      hospital_id: ""
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
        mappingName: "organizations"
      }
    });

    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id
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

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block"
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  eventHandaler(e) {
    console.log(e, "eventObj");
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState(
      {
        [name]: value
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
      <div className="dashboard ">
        <div className="row">
          <AlagehAutoComplete
            div={{ className: "col-3  form-group" }}
            label={{
              forceLabel: "Select a Branch",
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
              },
              autoComplete: "off"
            }}
          />
        </div>
        <div className="row card-deck">
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hospital" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Operational Cost</p>

                    {GetAmountFormart("150378.00")}
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Avg. Cost per Patient -
                  <span>{GetAmountFormart("500.00")} </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Revenue by MTD</p>
                    {GetAmountFormart("124128.75")}
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Avg. Revenue per day-
                  <span>{GetAmountFormart("4128.75")} </span>
                  {/* <b onClick={this.showDetailHandler.bind(this)}>
                    {this.state.showDetails === "d-block" ? "Hide" : "Show"}
                  </b> */}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-users" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Total Patients</p>
                    61,938
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Patients Admitted - <span>31,374</span>
                </div>
              </div>
            </div>
          </div> */}

          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-user-md" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Avg. Patient per Dr. (MTD)</p>
                    26.79
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Today Available Dr. - <span>190</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-walking" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Patient footfall (MTD)</p>
                    58%
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Today Patient Fall - <span>18%</span>
                </div>
              </div>
            </div>
          </div>
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
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions,
      getOrganizations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
