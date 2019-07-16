import React, { Component } from "react";
import "./dashboard.css";
// import { Bar } from "react-chartjs-2";
import { HorizontalBar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { getCookie } from "../../utils/algaehApiCall.js";
// import { getAmountFormart } from "../../utils/GlobalFunctions";
// import DashBoardEvents from "./DashBoardEvents";

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

// const RevenuebyDoctor = {
//   labels: [
//     "Dr. Suhail",
//     "Dr. Fathima",
//     "Dr. Khalid",
//     "Dr. Tony",
//     "Dr. Ridhwan",
//     "Dr. Joseph",
//     "Dr. Aysha"
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

const DoctorExplained = {
  labels: [
    "Fully Agree",
    "Rather Agree",
    "Rather Disagree",
    "Fully Disagree",
    "Don't Know"
  ],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 45],
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const DoctorExplainedDataOptions = {
  responsive: true,
  legend: {
    display: false
  }
};

const TreatingPhysician = {
  labels: [
    "Fully Agree",
    "Rather Agree",
    "Rather Disagree",
    "Fully Disagree",
    "Don't Know"
  ],
  datasets: [
    {
      data: [65, 59, 80, 81, 56, 55, 45],
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)"
    }
  ]
};

const TreatingPhysicianDataOptions = {
  responsive: true,
  legend: {
    display: false
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
  labels: ["Excellent", "Good", "Neutral/Negative"],
  datasets: [
    {
      data: [24, 40, 35],
      backgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"],
      hoverBackgroundColor: ["#34b8bc", "#DCAC66", "#EC932F"]
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
      showDetails: "d-none",
      sample_collection: []
    };
    // DashBoardEvents().getSampleCollectionDetails(this);
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
        <div className="row">
          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Employee Survery for this Month</h6>

              <div className="dashboardChartsCntr">
                <p>
                  {" "}
                  Do you think that work is distributed evenly across your team?{" "}
                </p>
                <Doughnut
                  data={PieData}
                  //options={AdmissionsReadmissionDataOptions}
                />
              </div>
              <hr />
              <div className="dashboardChartsCntr">
                <p>Do you find your work meaningful?</p>
                <HorizontalBar
                  data={DoctorExplained}
                  options={DoctorExplainedDataOptions}
                />
              </div>
              <hr />

              <div className="dashboardChartsCntr">
                <p>Do you feel valued for your contributions?</p>
                <HorizontalBar
                  data={TreatingPhysician}
                  options={TreatingPhysicianDataOptions}
                />
              </div>
            </div>
          </div>

          <div className="col-8">
            <div className="row">
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>Document Expiring Soon</h6>
                  <div className="dashboardGridCntr">
                    <table className="table  table-bordered table-sm table-striped ">
                      <thead>
                        <tr>
                          <th className="text-center">Employee Code</th>
                          <th className="text-center">Employee Name</th>
                          <th className="text-center">Document Type</th>
                          <th className="text-center">Expiry On</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">EMP-0000686</td>
                          <td className="text-center">Tejaswi Surya</td>
                          <td className="text-center">Iqama</td>
                          <td className="text-center">2019-04-01</td>
                        </tr>
                        <tr>
                          <td className="text-center">EMP-0000674 </td>
                          <td className="text-center">Zakir Khan</td>
                          <td className="text-center">Iqama</td>
                          <td className="text-center">2019-04-04</td>
                        </tr>
                        <tr>
                          <td className="text-center">EMP-0000685 </td>
                          <td className="text-center">KHALID AL-HAMDAN</td>
                          <td className="text-center">Passport</td>
                          <td className="text-center">2019-04-05</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>New Joinee for this month</h6>
                  <div className="dashboardGridCntr">
                    <table className="table  table-bordered table-sm table-striped ">
                      <thead>
                        <tr>
                          <th className="text-center">Employee Code</th>
                          <th className="text-center">Employee Name</th>
                          <th className="text-center">Department</th>
                          <th className="text-center">Joined On</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">EMP-0000986</td>
                          <td className="text-center">Irfan Khan</td>
                          <td className="text-center">Front Desk</td>
                          <td className="text-center">2019-04-25</td>
                        </tr>
                        <tr>
                          <td className="text-center">EMP-0000989 </td>
                          <td className="text-center">Noushad Ahmed</td>
                          <td className="text-center">Lab Technician</td>
                          <td className="text-center">2019-04-23</td>
                        </tr>
                        <tr>
                          <td className="text-center">EMP-0000990 </td>
                          <td className="text-center">Noor Mohsin</td>
                          <td className="text-center">IT Department</td>
                          <td className="text-center">2019-04-23</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card animated fadeInUp faster">
                  <h6>Employee Resigned/Terminated this month</h6>
                  <div className="dashboardGridCntr">
                    <table className="table  table-bordered table-sm table-striped ">
                      <thead>
                        <tr>
                          <th className="text-center">Employee Code</th>
                          <th className="text-center">Employee Name</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">
                            Resigned/Terminated On
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">EMP-0000459 </td>
                          <td className="text-center">Munees Abdulla</td>
                          <td className="text-center">
                            <span className="badge badge-info">Resigned</span>
                          </td>
                          <td className="text-center">2019-04-23</td>
                        </tr>
                        <tr>
                          <td className="text-center">EMP-00001240 </td>
                          <td className="text-center">Shahid Ahmed</td>
                          <td className="text-center">
                            <span className="badge badge-info">Resigned</span>
                          </td>
                          <td className="text-center">2019-04-23</td>
                        </tr>
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
