import React, { Component } from "react";
import "./dashboard.scss";
import { Bar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import DashBoardEvents from "./DashBoardEvents";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../Wrapper/algaehWrapper";
import { AlgaehOpenContainer } from "../../utils/GlobalFunctions";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
      no_of_employees: 0,
      total_company_salary: 0,
      Dept_Employee: {},
      Desig_Employee: {},
      no_of_emp_join: [],
      avg_salary: 0,
      no_of_projects: 0,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id
    };
  }

  componentWillMount() {
    DashBoardEvents().getEmployeeList(this);
    DashBoardEvents().getEmployeeDepartmentsWise(this);
    DashBoardEvents().getEmployeeDesignationWise(this);
    DashBoardEvents().getProjectList(this);

    this.props.getOrganizations({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      redux: {
        type: "ORGS_GET_DATA",
        mappingName: "organizations"
      }
    });
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
        DashBoardEvents().getEmployeeList(this);
        DashBoardEvents().getEmployeeDepartmentsWise(this);
        DashBoardEvents().getEmployeeDesignationWise(this);
        DashBoardEvents().getProjectList(this);
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
                    <i className="fas fa-building" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
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
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-users" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Total Employees</p>
                    {this.state.no_of_employees}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-money-bill-wave" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Total Cost to Company</p>
                    {getAmountFormart(this.state.total_company_salary)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Department</h6>
                  <div className="dashboardChartsCntr">
                    <Bar
                      data={this.state.Dept_Employee}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                                min: 0
                              }
                            }
                          ]
                        }
                      }}
                    />
                  </div>
                </div>
              </div>{" "}
              <div className="col-sm-12 col-md-6 col-lg-6">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Designation</h6>
                  <div className="dashboardChartsCntr">
                    <Bar
                      data={this.state.Desig_Employee}
                      options={{
                        scales: {
                          yAxes: [
                            {
                              ticks: {
                                beginAtZero: true,
                                min: 0
                              }
                            }
                          ]
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>New Employee Joined this Month</h6>
                  <div className="dashboardGridCntr">
                    <table className="table  table-bordered table-sm table-striped ">
                      <thead>
                        <tr>
                          <th className="text-center">Join Date </th>
                          <th className="text-center">Employee Code</th>
                          <th className="text-center">Employee Name</th>
                          <th className="text-center">Gender</th>
                          <th className="text-center">Designation</th>
                          <th className="text-center">Sub Department</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.no_of_emp_join.length > 0 ? (
                          this.state.no_of_emp_join.map((row, index) => (
                            <tr key={index}>
                              <td className="text-center">
                                {row.date_of_joining}
                              </td>
                              <td className="text-center">
                                {row.employee_code}
                              </td>
                              <td className="text-center">{row.full_name}</td>
                              <td className="text-center">{row.sex}</td>
                              <td className="text-center">{row.designation}</td>
                              <td className="text-center">
                                {row.sub_department_name}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="text-center" colSpan="6">
                              No New Joinee for this Month
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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
