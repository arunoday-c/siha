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
import { GetAmountFormart } from "../../utils/GlobalFunctions";

const AdmissionsReadmissionData = {
  datasets: [
    {
      type: "line",
      label: "Total Sales",
      data: [10486, 9866, 11343, 11634, 10134, 8334],
      fill: false,
      backgroundColor: "#71B37C",
      borderColor: "#71B37C",
      hoverBackgroundColor: "#71B37C",
      hoverBorderColor: "#71B37C",
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
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
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

// const OutpatientsInpatientsData = {
//   datasets: [
//     {
//       type: "bar",
//       label: "Inpatients",
//       data: [2712, 1334, 2465, 2232],
//       fill: false,
//       backgroundColor: "#71B37C",
//       borderColor: "#71B37C",
//       // hoverBackgroundColor: "#71B37C",
//       // hoverBorderColor: "#71B37C",
//       yAxisID: "y-axis-1"
//     },
//     {
//       type: "bar",
//       label: "Outpatients",
//       data: [1712, 1134, 1965, 1832],
//       fill: false,
//       backgroundColor: "#34b8bc",
//       borderColor: "#34b8bc",
//       // hoverBackgroundColor: "#34b8bc",
//       // hoverBorderColor: "#34b8bc",
//       yAxisID: "y-axis-1"
//     }
//   ]
// };

// const OutpatientsInpatientsDataOptions = {
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
//         labels: ["Week 42 2018", "Week 43 2018", "Week 44 2018", "Week 45 2018"]
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
//       }
//     ]
//   }
// };

// const AvgWaitingTimeDep = {
//   labels: [
//     "Surgery",
//     "Gynaecology",
//     "Dermatology",
//     "Neurology",
//     "Oncology",
//     "Orthopedics",
//     "Cardiology"
//   ],
//   datasets: [
//     {
//       data: [65, 59, 80, 81, 56, 55, 45],
//       label: "Waiting Time",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

// const RevenuebyDepartment = {
//   labels: [
//     "Surgery",
//     "Gynaecology",
//     "Dermatology",
//     "Neurology",
//     "Oncology",
//     "Orthopedics",
//     "Cardiology"
//   ],
//   datasets: [
//     {
//       data: [95, 80, 73, 64, 56, 50, 48],
//       label: "Revenue",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

const DistributionbySales = {
  labels: ["Suhail", "Fathima", "Khalid", "Tony", "Ridhwan"],
  datasets: [
    {
      data: [81, 80, 65, 59, 56],
      label: "Sales Distribution",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

// const RevenuebyService = {
//   labels: [
//     "Pharmacy",
//     "Radiology",
//     "OT",
//     "Bed",
//     "Anesthesia",
//     "Nursing Care",
//     "Lab"
//   ],
//   datasets: [
//     {
//       data: [81, 80, 65, 59, 56, 55, 45],
//       label: "Revenue",
//       backgroundColor: "rgba(255,99,132,0.2)",
//       borderColor: "rgba(255,99,132,1)",
//       borderWidth: 1,
//       hoverBackgroundColor: "rgba(255,99,132,0.4)",
//       hoverBorderColor: "rgba(255,99,132,1)"
//     }
//   ]
// };

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

const PieData = {
  labels: [
    "Innohep 10,000 IU/0.5 ml Prefilled Syringe 2's ",
    "Livial 2.5 mg Tablets 28's",
    "Nevanac 0.1% Eye Drops 5 ml",
    "Pholcodine 5 mg/5 ml Linctus (200 ml)",
    "Pyrazinamide 500 mg Tablets 20'S (10'S X 2)"
  ],
  datasets: [
    {
      data: [24, 40, 35, 45, 19],
      backgroundColor: ["#34b8bc", "#DCAC66", "#EC932F", "#673ab7", "#009688"],
      hoverBackgroundColor: [
        "#34b8bc",
        "#DCAC66",
        "#EC932F",
        "#673ab7",
        "#009688"
      ]
    }
  ]
};

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
                <div className="col-3">
                  <div className="icon-big text-center">
                    <i className="fas fa-users" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Todays Customer Served</p>
                    124
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-3">
                  <div className="icon-big text-center">
                    <i className="fas fa-coins" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today's Sales</p>
                    {GetAmountFormart("8134.11")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card animated fadeInUp faster">
            <div className="content">
              <div className="row">
                <div className="col-3">
                  <div className="icon-big text-center">
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Total Monthly Sales</p>
                    {GetAmountFormart("124128.75")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <div className="card animated fadeInUp faster">
              <h6>Items Near Expiry </h6>
              <div className="dashboardChartsCntr">
                <table className="table  table-bordered table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Batch</th>
                      <th>Expiry Date</th>
                      <th>Days Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vozet</td>
                      <td>78546</td>
                      <td>05/05/2019</td>
                      <td>
                        <span class="badge badge-light">15 days</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Dextrose 10% Solution For Infusion (500 ml)</td>
                      <td>23232</td>
                      <td>29/04/2019</td>
                      <td>
                        <span class="badge badge-light">10 days</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Actifed Tablets 24'S</td>
                      <td>57566</td>
                      <td>24/04/2019</td>
                      <td>
                        <span class="badge badge-warning">8 days</span>
                      </td>
                    </tr>
                    <tr>
                      <td>Abelcet 5 mg/ml Vial (20 ml)</td>
                      <td>5222</td>
                      <td>05/04/2019</td>
                      <td>
                        <span class="badge badge-danger">Expired</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card animated fadeInUp faster">
              <h6>Product with low Stock</h6>
              <div className="dashboardChartsCntr">
                <table className="table  table-bordered table-sm table-striped">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quanity Left</th>
                      <th>UOM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Abelcet 5 mg/ml Vial (20 ml)</td>

                      <td>
                        <span class="badge badge-light">123</span>
                      </td>
                      <td>Capsule</td>
                    </tr>
                    <tr>
                      <td>Dermovate 0.05% Scalp Solution (25 ml)</td>

                      <td>
                        <span class="badge badge-warning">18</span>
                      </td>
                      <td>Bottle</td>
                    </tr>
                    <tr>
                      <td>Canesten 1% Cream (20 g)</td>

                      <td>
                        <span class="badge badge-warning">10</span>
                      </td>
                      <td>Tablet</td>
                    </tr>
                    <tr>
                      <td>Imodium 2 mg Capsules 6'S</td>
                      <td>
                        <span class="badge badge-danger">Out of Stock</span>
                      </td>
                      <td>Sachet</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={"col-4"}>
            <div className="card animated fadeInUp faster">
              <h6>Fast Moving Item</h6>
              <div className="dashboardChartsCntr">
                <Doughnut
                  data={PieData}
                  //options={AdmissionsReadmissionDataOptions}
                />
              </div>
            </div>
          </div>
          <div className={"col-4"}>
            <div className="card animated fadeInUp faster">
              <h6>Top 5 Sales Person - Distribution</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={DistributionbySales} />
              </div>
            </div>
          </div>
          <div className={"col-4"}>
            <div className="card animated fadeInUp faster">
              <h6>Sales Overview</h6>
              <div className="dashboardChartsCntr">
                <Bar
                  data={AdmissionsReadmissionData}
                  options={AdmissionsReadmissionDataOptions}
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
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
