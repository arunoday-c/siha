import React, { Component } from "react";
import "./dashboard.scss";
import { Bar } from "react-chartjs-2";
import { HorizontalBar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { getCookie } from "../../utils/algaehApiCall.js";
import { getAmountFormart } from "../../utils/GlobalFunctions";
import DashBoardEvents from "./DashBoardEvents";

const orderedVScompleted = {
  datasets: [
    {
      type: "bar",
      label: "Ordered",
      data: [40, 38, 23, 56],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      // hoverBackgroundColor: "#71B37C",
      // hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-1"
    },
    {
      type: "bar",
      label: "Completed",
      data: [38, 40, 22, 50],
      fill: false,
      backgroundColor: "#34b8bc",
      borderColor: "#34b8bc",
      // hoverBackgroundColor: "#34b8bc",
      // hoverBorderColor: "#34b8bc",
      yAxisID: "y-axis-1"
    }
  ]
};
const orderedVScompletedOptions = {
  responsive: true,
  legend: {
    position: "bottom",
    labels: {
      boxWidth: 10
    }
  },
  tooltips: {
    mode: "label"
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        },
        labels: ["Week 42 2019", "Week 43 2019", "Week 44 2019", "Week 45 2019"]
      }
    ],
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};

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
      no_of_projects: 0
    };
    DashBoardEvents().getEmployeeList(this);
    DashBoardEvents().getEmployeeDepartmentsWise(this);
    DashBoardEvents().getEmployeeDesignationWise(this);

    DashBoardEvents().getProjectList(this);
  }

  showDetailHandler(event) {
    this.setState({
      showDetails: this.state.showDetails === "d-block" ? "d-none" : "d-block"
    });
  }

  // componentDidMount() {
  //   let HospitalId =
  //     getCookie("HospitalId") !== undefined ? getCookie("HospitalId") : "";
  //   this.props.getHospitalDetails({
  //     uri: "/organization/getOrganization",
  //     method: "GET",
  //     data: {
  //       hims_d_hospital_id: HospitalId
  //     },
  //     redux: {
  //       type: "HOSPITAL_DETAILS_GET_DATA",
  //       mappingName: "hospitaldetails"
  //     },
  //     afterSuccess: data => {
  //       if (data.length > 0) {
  //         sessionStorage.removeItem("CurrencyDetail");
  //         sessionStorage.setItem(
  //           "CurrencyDetail",
  //           AlgaehCloseContainer(JSON.stringify(data[0]))
  //         );
  //       }
  //     }
  //   });
  // }
  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    // let margin = this.state.sidBarOpen ? "" : "";
    return (
      <div className="dashboard ">
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
          {/* <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-4">
                  <div className="icon-big text-center">
                    <i className="fas fa-walking" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Avg. Salary</p>
                    {this.state.avg_salary} %
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row">
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Department</h6>
                  <div className="dashboardChartsCntr">
                    <Bar data={this.state.Dept_Employee} />
                  </div>
                </div>
              </div>{" "}
              <div className="col-6">
                <div className="card animated fadeInUp faster">
                  <h6>No. of Employee by Designation</h6>
                  <div className="dashboardChartsCntr">
                    <Bar data={this.state.Desig_Employee} />
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
                          {/*  <th className="text-center">Designation</th>
                          <th className="text-center">Nationality</th>
                          <th className="text-center">Department</th>
                         <th className="text-center">Sub Department</th>*/}
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
    hospitaldetails: state.hospitaldetails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Dashboard)
);
