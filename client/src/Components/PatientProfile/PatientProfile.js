import React, { Component } from "react";
import "./patientprofile.css";
import Overview from "./Overview/Overview";
import Subjective from "./Subjective/Subjective";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import Assesment from "./Assessment/Assessment";
import Plan from "./Plan/Plan";

class PatientProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "overview"
    };
    this.changeTabs = this.changeTabs.bind(this);
  }

  changeTabs(e) {
    var element = document.querySelectorAll("[algaehsoap]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var page = e.currentTarget.getAttribute("algaehsoap");
    this.setState({
      pageDisplay: page
    });
  }

  render() {
    return (
      <div className="patientProfile">
        <div className="patientInfo-Top box-shadow-normal">
          <div className="backBtn">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-angle-double-left fa-lg" />
              Back
            </button>
          </div>
          <div className="patientImg box-shadow">
            <img src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg" />
          </div>
          <div className="patientName">
            <h6>SEBASTIAN TASSART</h6>
            <p>Male, 43Y 7M 10D</p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB: <b>31/12/1947</b>
            </span>
            <span>
              Mobile: <b>6756754544</b>
            </span>
            <span>
              Nationality: <b>Australian</b>
            </span>
          </div>
          <div className="patientHospitalDetail">
            <span>
              MRN: <b>0001195682</b>
            </span>
            <span>
              Encounter: <b>25/07/2018 11:27:38 PM</b>
            </span>
            <span>
              Payment: <b>Self Paying</b>
            </span>
          </div>
          <div className="patientVital">
            <span>
              BP: <b>120/80</b>
            </span>
            <span>
              Oral Temp: <b>36.8C</b>
            </span>
            <span>
              H: <b>175 CM</b>
            </span>
            <span>
              W: <b>95 KG</b>
            </span>
            <span>
              HR: <b>85</b>
            </span>
            <span>
              RR: <b>45</b>
            </span>
          </div>
          <div className="moreAction">
            <button type="button" class="btn btn-outline-secondary btn-sm">
              <i className="fas fa-caret-square-down fa-lg" />
              More
            </button>
          </div>
        </div>
        <div className="patientTopNav box-shadow-normal">
          <ul className="nav">
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="overview"
                className="nav-link active"
              >
                Overview
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="subjective"
                className="nav-link"
              >
                Subjective
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="phy_exam"
                className="nav-link"
              >
                Physical Examination
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="assesment"
                className="nav-link"
              >
                Assesment
              </span>
            </li>
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="plan"
                className="nav-link"
              >
                Plan
              </span>
            </li>
          </ul>
        </div>
        <div className="container-fluid">
          {this.state.pageDisplay === "overview" ? (
            <Overview />
          ) : this.state.pageDisplay === "subjective" ? (
            <Subjective />
          ) : this.state.pageDisplay === "phy_exam" ? (
            <PhysicalExamination />
          ) : this.state.pageDisplay === "assesment" ? (
            <Assesment />
          ) : this.state.pageDisplay === "plan" ? (
            <Plan />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PatientProfile;
