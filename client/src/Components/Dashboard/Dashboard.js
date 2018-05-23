import React, { Component } from "react";
import Header from "../common/Header/Header.js";
import SideMenuBar from "../common/SideMenuBar/SideMenuBar.js";
import "./dashboard.css";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Paper } from "material-ui";
import { Line } from "react-chartjs-2";

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
      hoverBackgroundColor: "#00BCB0"
    }
  ]
};

const PieData = {
  labels: ["Cash Patient", "Insurance Patient"],
  datasets: [
    {
      data: [50, 300],
      backgroundColor: ["#00BCB0", "#DCAC66"],
      hoverBackgroundColor: ["#00BCB0", "#DCAC66"]
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
      backgroundColor: "#00BCB0",
      borderColor: "#DCAC66",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderColor: "#00BCB0",
      pointBackgroundColor: "#00BCB0",
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
      sidBarOpen: false
    };
  }

  SideMenuBarOpen(sidOpen) {
    debugger;
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    let margin = this.state.sidBarOpen ? "200px" : "";
    return (
      <div className="dashboard ">
        {this.state.sidBarOpen === true ? (
          <div>
            <SideMenuBar />
          </div>
        ) : null}
        <div style={{ marginLeft: margin }}>
          <Header
            title="Dashboard"
            SideMenuBarOpen={this.SideMenuBarOpen.bind(this)}
          />

          <div className="row card-deck" style={{ margin: 40 }}>
            {/* Bar Graph Start */}

            <div className="col-lg-4 card">
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
            <div className="col-lg-4 card">
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
            <div className="col-lg-4 card">
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
          <div className="row" style={{ margin: 40 }}>
            <div className="col card" style={{ margin: "auto" }}>
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
      </div>
    );
  }
}

export default Dashboard;
