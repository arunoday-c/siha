import React, { Component } from "react";
import "./dashboard.scss";
import { Bar, HorizontalBar } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { getCookie } from "../../utils/algaehApiCall.js";
import { GetAmountFormart } from "../../utils/GlobalFunctions";

const AppoWalkInData = {
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
      yAxisID: "y-axis-1",
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
      yAxisID: "y-axis-1",
    },
  ],
};

const AppoWalkInDataOptions = {
  responsive: true,
  legend: {
    position: "bottom",
    labels: {
      boxWidth: 10,
    },
  },
  tooltips: {
    mode: "label",
  },
  elements: {
    line: {
      fill: false,
    },
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        display: true,
        gridLines: {
          display: false,
        },
        labels: [
          "Week 42 2018",
          "Week 43 2018",
          "Week 44 2018",
          "Week 45 2018",
        ],
      },
    ],
    yAxes: [
      {
        stacked: true,
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    ],
  },
};

const RevenuebyDepartment = {
  labels: [
    "General Medcine",
    "Gynaecology",
    "Dermatology",
    "Neurology",
    "Oncology",
    "Orthopedics",
  ],
  datasets: [
    {
      data: [73, 11, 11, 3, 7, 2],
      label: "Total Booking",

      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
    },
  ],
};

const RevenuebyDoctor = {
  labels: [
    "Dr. Suhail",
    "Dr. Fathima",
    "Dr. Khalid",
    "Dr. Tony",
    "Dr. Ridhwan",
    "Dr. Joseph",
    "Dr. Aysha",
  ],
  datasets: [
    {
      data: [6, 11, 15, 6, 4, 10, 9],
      label: "Total Booking",
      backgroundColor: "rgba(255,99,132,0.2)",
      borderColor: "rgba(255,99,132,1)",
      borderWidth: 1,
      hoverBackgroundColor: "rgba(255,99,132,0.4)",
      hoverBorderColor: "rgba(255,99,132,1)",
    },
  ],
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidBarOpen: true,
      showDetails: "d-none",
    };
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

  render() {
    return (
      <div className="dashboard front-dash">
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
                    <p>Today Received by Cash</p>

                    {GetAmountFormart("10378.00")}
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
                    <i className="fas fa-hand-holding-usd" />
                  </div>
                </div>
                <div className="col-8">
                  <div className="numbers">
                    <p>Today Received by Card</p>
                    {GetAmountFormart("10378.00")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Appointments vs Walk-In</h6>
              <div className="dashboardChartsCntr">
                <Bar data={AppoWalkInData} options={AppoWalkInDataOptions} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Patients Booking by Department</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={RevenuebyDepartment} />
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card animated fadeInUp faster">
              <h6>Patients Booking by Doctor</h6>
              <div className="dashboardChartsCntr">
                <HorizontalBar data={RevenuebyDoctor} />
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getHospitalDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Dashboard)
);
