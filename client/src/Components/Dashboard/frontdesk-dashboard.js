import React, { Component } from "react";
import "./dashboard.scss";
import { Bar } from "react-chartjs-2";
import { HorizontalBar } from "react-chartjs-2";
// import { Doughnut } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { getCookie } from "../../utils/algaehApiCall.js";
import { getAmountFormart } from "../../utils/GlobalFunctions";

// const AdmissionsReadmissionData = {
//   datasets: [
//     {
//       type: "line",
//       label: "Readmission Rate",
//       data: [0.2, 0.2, 0.22, 0.19],
//       fill: false,
//       backgroundColor: "#71B37C",
//       borderColor: "#71B37C",
//       hoverBackgroundColor: "#71B37C",
//       hoverBorderColor: "#71B37C",
//       yAxisID: "y-axis-2"
//     },
//     {
//       type: "bar",
//       label: "Admissions",
//       data: [2286, 2534, 2126, 2272],
//       fill: false,
//       borderColor: "#EC932F",
//       backgroundColor: "#EC932F",
//       pointBorderColor: "#EC932F",
//       pointBackgroundColor: "#EC932F",
//       pointHoverBackgroundColor: "#EC932F",
//       pointHoverBorderColor: "#EC932F",
//       yAxisID: "y-axis-1"
//     }
//   ]
// };

// const AdmissionsReadmissionDataOptions = {
//   responsive: true,
//   legend: {
//     position: "bottom",
//     labels: {
//       boxWidth: 10
//     }
//   },
//   tooltips: {
//     mode: "label"
//   },
//   elements: {
//     line: {
//       fill: false
//     }
//   },
//   scales: {
//     xAxes: [
//       {
//         display: true,
//         gridLines: {
//           display: false
//         },
//         labels: ["Q3 2017", "Q4 2017", "Q1 2018", "Q2 2018"]
//       }
//     ],
//     yAxes: [
//       {
//         type: "linear",
//         display: true,
//         position: "left",
//         id: "y-axis-1",
//         gridLines: {
//           display: false
//         },
//         labels: {
//           show: true
//         }
//       },
//       {
//         type: "linear",
//         display: true,
//         position: "right",
//         id: "y-axis-2",
//         gridLines: {
//           display: false
//         },
//         labels: {
//           show: true
//         }
//       }
//     ]
//   }
// };

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

const RevenuebyDepartment = {
  labels: [
    "General Medcine",
    "Gynaecology",
    "Dermatology",
    "Neurology",
    "Oncology",
    "Orthopedics"
  ],
  datasets: [
    {
      data: [73, 11, 11, 3, 7, 2],
      label: "Total Booking",

      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const RevenuebyDoctor = {
  labels: [
    "Dr. Suhail",
    "Dr. Fathima",
    "Dr. Khalid",
    "Dr. Tony",
    "Dr. Ridhwan",
    "Dr. Joseph",
    "Dr. Aysha"
  ],
  datasets: [
    {
      data: [6, 11, 15, 6, 4, 10, 9],
      label: "Total Booking",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const RevenuebyService = {
  labels: [
    "Pharmacy",
    "Radiology",
    "OT",
    "Bed",
    "Anesthesia",
    "Nursing Care",
    "Lab"
  ],
  datasets: [
    {
      data: [3, 2, 5, 3, 7, 4, 2],
      label: "Total Booking",

      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

// const DoctorExplained = {
//   labels: [
//     "Fully Agree",
//     "Rather Agree",
//     "Rather Disagree",
//     "Fully Disagree",
//     "Don't Know"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const DoctorExplainedDataOptions = {
//   responsive: true,
//   legend: {
//     display: false
//   }
// };

// const TreatingPhysician = {
//   labels: [
//     "Fully Agree",
//     "Rather Agree",
//     "Rather Disagree",
//     "Fully Disagree",
//     "Don't Know"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const TreatingPhysicianDataOptions = {
//   responsive: true,
//   legend: {
//     display: false
//   }
// };
// const plugins = [
//   {
//     afterDraw: (chartInstance, easing) => {
//       const ctx = chartInstance.chart.ctx;
//       ctx.fillText("This text drawn by a plugin", 100, 100);
//     }
//   }
// ];

// const PieData = {
//   labels: ["Excellent", "Good", "Neutral/Negative"],
//   datasets: [
//     {
//       data: [24, 40, 35],
//       backgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"],
//       hoverBackgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"]
//     }
//   ]
// };

// const CostPayerTypeData = {
//   labels: ["Medicare", "Medicaid", "Private Insurance", "Uninsured"],
//   datasets: [
//     {
//       data: [65, 69, 90, 61],
//       backgroundColor: ["#34b8bc", "#34b8bc", "#34b8bc", "#34b8bc"],
//       label: "Surgical Stays"
//     },
//     {
//       data: [315, 89, 101, 81],
//       backgroundColor: ["#EC932F", "#EC932F", "#EC932F", "#EC932F"],
//       label: "Medical Stays"
//     },
//     {
//       data: [415, 109, 131, 101],
//       backgroundColor: ["#DCAC66", "#DCAC66", "#DCAC66", "#DCAC66"],
//       label: "Maternal and Neonatal Stays"
//     }
//   ]
// };

// const CostPayerTypeDataOption = {
//   tooltips: {
//     mode: "point",
//     intersect: false
//   },

//   responsive: true,
//   scales: {
//     xAxes: [
//       {
//         stacked: true
//       }
//     ],
//     yAxes: [
//       {
//         ticks: {
//           beginAtZero: true
//         },
//         stacked: false
//       }
//     ]
//   }
// };

// const AreaData = {
//   labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
//   datasets: [
//     {
//       fill: true,
//       lineTension: 0.1,
//       backgroundColor: "#34b8bc",
//       borderColor: "#DCAC66",
//       borderCapStyle: "butt",
//       borderDash: [],
//       borderDashOffset: 0.0,
//       borderJoinStyle: "miter",
//       pointBorderColor: "#34b8bc",
//       pointBackgroundColor: "#34b8bc",
//       pointBorderWidth: 1,
//       pointHoverRadius: 5,
//       pointRadius: 4,
//       pointHitRadius: 50,
//       data: [10, 5, 8, 3, 5]
//     }
//   ]
// };

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none"
    };
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
                    <i className="fas fa-calendar-check" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today's Appointments</p>80
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  <b onClick={this.showDetailHandler.bind(this)}>
                    {this.state.showDetails === "d-block"
                      ? "Hide"
                      : "Show"}
                  </b>
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
                    <p>Today's Walk-In</p>
                    27
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
                    <p>Total Cash Received</p>

                    {getAmountFormart("10378.00")}
                  </div>
                </div>
              </div>
              <div className="footer">
                <hr />
                <div className="stats">
                  By Cash <span>{getAmountFormart("3540.33")} </span> | By Card{" "}
                  <span>{getAmountFormart("6837.67")} </span>
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
        </div>

        <div className="row">
          <div className={"col-4 " + this.state.showDetails}>
            <div className="card animated fadeInUp faster">
              <h6>Patients Booking by Department</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={RevenuebyDepartment} />
              </div>
            </div>
          </div>
          <div className={"col-4 " + this.state.showDetails}>
            <div className="card animated fadeInUp faster">
              <h6>Patients Booking by Doctor</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={RevenuebyDoctor} />
              </div>
            </div>
          </div>
          <div className={"col-4 " + this.state.showDetails}>
            <div className="card animated fadeInUp faster">
              <h6>Patients Booking by Service</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={RevenuebyService} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Appointments By Department</h6>
              <div className="dashboardChartsCntr">
                <table className="table  table-bordered table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Appointment</th>
                      <th>Walk In</th>
                      <th>Cancelled</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Gynaecology</td>
                      <td>11</td>
                      <td>0</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>Dermatology</td>
                      <td>5</td>
                      <td>6</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Neurology</td>
                      <td>2</td>
                      <td>1</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Oncology</td>
                      <td>3</td>
                      <td>4</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>Cardiology</td>
                      <td>0</td>
                      <td>2</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td>General</td>
                      <td>59</td>
                      <td>14</td>
                      <td>0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Outpatients vs. Inpatients Trend</h6>
              <div className="dashboardChartsCntr">
                <Bar
                  data={OutpatientsInpatientsData}
                  options={OutpatientsInpatientsDataOptions}
                />
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
