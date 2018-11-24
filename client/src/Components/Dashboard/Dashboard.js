import React, { Component } from "react";
import "./dashboard.css";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
// import { setCookie } from "../../utils/algaehApiCall.js";

const BarData = {
  labels: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  datasets: [
    {
      data: [0, 40, 60, 60, 80, 90, 80],
      label: "Patients Count Weekly",
      backgroundColor: "#DCAC66",
      hoverBackgroundColor: "#34b8bc"
    }
  ]
};

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

const LineData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  datasets: [
    {
      fill: false,
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
      data: [6500, 5900, 8000, 8100, 5600]
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
          {/* Bar Graph Start */}

          <div className="card">
            <Bar
              width={100}
              height={70}
              data={BarData}
              options={{
                maintainAspectRatio: true
              }}
            />
          </div>

          {/* Bar Graph End */}

          {/* Pie Chart Start */}
          <div className="card">
            <Doughnut
              data={PieData}
              width={100}
              height={50}
              options={{
                maintainAspectRatio: true
              }}
            />
          </div>

          {/* Pie Chart End */}

          {/* Score Card Start */}
          <div className="card">
            <label> TOTAL PATIENTS REGISTERED TODAY</label>
            <h5> 72 </h5>
            <hr />
            <label> CASH PATIENTS TODAY</label>
            <h5> 38 </h5>
            <hr />
            <label> INSURANCE REGISTERED TODAY</label>
            <h5> 34 </h5>
          </div>

          {/* Score Card End */}
        </div>
        <div className="row card-deck" style={{ marginTop: "15px" }}>
          <div className="col card">
            <label> Month Wise Patient Visits</label>
            <br />
            <Line
              height={60}
              options={{
                maintainAspectRatio: true,
                legend: false
              }}
              data={LineData}
            />
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
