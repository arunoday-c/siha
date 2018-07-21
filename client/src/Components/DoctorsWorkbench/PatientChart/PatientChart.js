import React, { Component } from "react";
import "./patient_chart.css";

class PatientChart extends Component {
  render() {
    return (
      <div className="patient_chart">
        <div className="patient_demographics row">
          <div className="col">
            <label>Patient ID : PAT-A-0000273</label>
          </div>
          <div className="col">
            <label>Patient Name : Peter</label>
          </div>
          <div className="col">
            <label>Gender : Male</label>
          </div>
          <div className="col">
            <label>Marital Status : Male</label>
          </div>
          <div className="col">
            <label>Nationality : Male</label>
          </div>
          <div className="col">
            <label>D.O.B : 20-06-1990</label>
          </div>
          <div className="col">
            <label> Age: 28 </label>
          </div>
          <div className="col">
            <label>Mob. no. : 2147483647</label>{" "}
          </div>
          <div className="col">
            <label>Encounter: 21-07-2018 10:00 </label>
          </div>
        </div>
      </div>
    );
  }
}

export default PatientChart;
