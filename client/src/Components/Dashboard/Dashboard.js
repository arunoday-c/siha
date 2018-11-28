import React, { Component } from "react";
import "./dashboard.css";
import { Bar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { setCookie } from "../../utils/algaehApiCall.js";

const AdmissionsReadmissionData = {
  datasets: [
    {
      type: "line",
      label: "Readmission Rate",
      data: [0.2, 0.2, 0.22, 0.19],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      hoverBackgroundColor: "#71B37C",
      hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-2"
    },
    {
      type: "bar",
      label: "Admissions",
      data: [2286, 2534, 2126, 2272],
      fill: false,
      borderColor: "#EC932F",
      backgroundColor: "#EC932F",
      pointBorderColor: "#EC932F",
      pointBackgroundColor: "#EC932F",
      pointHoverBackgroundColor: "#EC932F",
      pointHoverBorderColor: "#EC932F",
      yAxisID: "y-axis-1"
    }
  ]
};

const AdmissionsReadmissionDataOptions = {
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
        labels: ["Q3 2017", "Q4 2017", "Q1 2018", "Q2 2018"]
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
      },
      {
        type: "linear",
        display: true,
        position: "right",
        id: "y-axis-2",
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

const OutpatientsInpatientsData = {
  datasets: [
    {
      type: "bar",
      label: "Inpatients",
      data: [2712, 1334, 2465, 2232],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      // hoverBackgroundColor: "#71B37C",
      // hoverBorderColor: "#71B37C",
      yAxisID: "y-axis-1"
    },
    {
      type: "bar",
      label: "Outpatients",
      data: [1712, 1134, 1965, 1832],
      fill: false,
      backgroundColor: "#34b8bc",
      borderColor: "#34b8bc",
      // hoverBackgroundColor: "#34b8bc",
      // hoverBorderColor: "#34b8bc",
      yAxisID: "y-axis-1"
    }
  ]
};

const OutpatientsInpatientsDataOptions = {
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
        labels: ["Week 42 2018", "Week 43 2018", "Week 44 2018", "Week 45 2018"]
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

// const plugins = [
//   {
//     afterDraw: (chartInstance, easing) => {
//       const ctx = chartInstance.chart.ctx;
//       ctx.fillText("This text drawn by a plugin", 100, 100);
//     }
//   }
// ];

const PieData = {
  labels: ["Cash Patient", "Insurance Patient"],
  datasets: [
    {
      data: [50, 300],
      backgroundColor: ["#34b8bc", "#DCAC66"],
      hoverBackgroundColor: ["#34b8bc", "#DCAC66"]
    }
  ]
};

const AreaData = {
  labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  datasets: [
    {
      fill: true,
      lineTension: 0.1,
      backgroundColor: "#34b8bc",
      borderColor: "#DCAC66",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#34b8bc",
      pointBackgroundColor: "#34b8bc",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointRadius: 4,
      pointHitRadius: 50,
      data: [10, 5, 8, 3, 5]
    }
  ]
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true
    };
  }

  componentDidMount() {
    this.props.getHospitalDetails({
      uri: "/organization/getOrganization",
      method: "GET",
      data: { hims_d_hospital_id: 1 },
      redux: {
        type: "HOSPITAL_DETAILS_GET_DATA",
        mappingName: "hospitaldetails"
      },
      afterSuccess: data => {
        if (data.length > 0) {
          let CurrencyDetail = {
            Symbol: data[0].currency_symbol,
            Position: data[0].symbol_position
          };
          sessionStorage.setItem(
            "CurrencyDetail",
            JSON.stringify(CurrencyDetail)
          );
        }
      }
    });
  }
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
          <div className="card">
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
          </div>
          <div className="card">
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
                    SR 150,378.00
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  Avg. Cost per Patient - <span>SR 500</span>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
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
          <div className="card">
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

        <div className="row">
          <div className="col-5">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <h6>Admissions & 30-Day Readmission Rate</h6>
                  <div className="dashboardChartsCntr">
                    <Bar
                      data={AdmissionsReadmissionData}
                      options={AdmissionsReadmissionDataOptions}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <h6>Overall Patient Satisfacation</h6>
                  <p>The doctor explained the treatment understandably.</p>
                  <p>I had confidence and trust in the treating physician.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-7">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <h6>Outpatients vs. Inpatients Trend</h6>
                  <div className="dashboardChartsCntr">
                    <Bar
                      data={OutpatientsInpatientsData}
                      options={OutpatientsInpatientsDataOptions}
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card">
                  <h6>Patients By Department</h6>
                </div>
              </div>
              <div className="col-6">
                <div className="card">
                  {" "}
                  <h6>Avg Waiting Time By Department</h6>
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
