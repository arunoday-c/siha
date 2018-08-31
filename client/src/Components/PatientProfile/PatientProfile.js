import React, { Component } from "react";
import "./patientprofile.css";
import Overview from "./Overview/Overview";
import Subjective from "./Subjective/Subjective";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import Assesment from "./Assessment/Assessment";
import Plan from "./Plan/Plan";
import { algaehApiCall } from "../../utils/algaehApiCall";
import moment from "moment";
import { setGlobal, removeGlobal } from "../../utils/GlobalFunctions";

class PatientProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "subjective",
      patientData: {}
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

  componentWillUnmount() {
    removeGlobal("current_patient");
    removeGlobal("episode_id");
  }

  componentDidMount() {
    //TODO
    // Validations on API calls

    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientProfile",
      data: {
        patient_id: Window.global["current_patient"],
        episode_id: Window.global["episode_id"]
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.success) {
          console.log("Patient data:", response.data.records);
          this.setState({ patientData: response.data.records[0] });
        }
      },
      onFailure: error => {}
    });
  }

  render() {
    return (
      <div className="row patientProfile">
        <div className="patientInfo-Top box-shadow-normal">
          <div className="backBtn">
            <button
              onClick={() => {
                setGlobal({ "EHR-STD": "DoctorsWorkbench" });
                document.getElementById("ehr-router").click();
              }}
              type="button"
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="fas fa-angle-double-left fa-lg" />
              Back
            </button>
          </div>
          <div className="patientImg box-shadow">
            <img src="https://x1.xingassets.com/assets/frontend_minified/img/users/nobody_m.original.jpg" />
          </div>
          <div className="patientName">
            <h6>
              {this.state.patientData !== undefined
                ? this.state.patientData.full_name
                : ""}
            </h6>
            <p>
              {this.state.patientData !== undefined
                ? this.state.patientData.gender
                : ""}
              ,{" "}
              {this.state.patientData !== undefined
                ? this.state.patientData.age_in_years
                : ""}
              Y{" "}
              {this.state.patientData !== undefined
                ? this.state.patientData.age_in_months
                : ""}
              M{" "}
              {this.state.patientData !== undefined
                ? this.state.patientData.age_in_days
                : ""}
              D
            </p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB:
              <b>
                {moment(
                  this.state.patientData !== undefined
                    ? this.state.patientData.date_of_birth
                    : ""
                ).format("DD-MM-YYYY")}
              </b>
            </span>
            <span>
              Mobile:{" "}
              <b>
                {this.state.patientData !== undefined
                  ? this.state.patientData.contact_number
                  : ""}
              </b>
            </span>
            <span>
              Nationality:{" "}
              <b>
                {this.state.patientData !== undefined
                  ? this.state.patientData.nationality
                  : ""}
              </b>
            </span>
          </div>
          <div className="patientHospitalDetail">
            <span>
              MRN:{" "}
              <b>
                {this.state.patientData !== undefined
                  ? this.state.patientData.patient_code
                  : ""}
              </b>
            </span>
            <span>
              Encounter:{" "}
              <b>
                {moment(
                  this.state.patientData !== undefined
                    ? this.state.patientData.Encounter_Date
                    : ""
                ).format("DD-MM-YYYY HH:MM:SS A")}
              </b>
            </span>
            <span>
              Payment:{" "}
              <b>
                {this.state.patientData !== undefined
                  ? this.state.patientData.payment_type === "S"
                    ? "Self Paying"
                    : "Insurance"
                  : ""}
              </b>
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
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-caret-square-down fa-lg" />
              More
            </button>
          </div>
        </div>
        <div className="patientTopNav box-shadow-normal">
          <ul className="nav">
            {/* <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="overview"
                className="nav-link active"
              >
                Overview
              </span>
            </li> */}
            <li className="nav-item">
              <span
                onClick={this.changeTabs}
                algaehsoap="subjective"
                className="nav-link active"
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
            <ul className="float-right patient-quick-info">
              <li>
                <i class="fas fa-allergies" />
                <span>
                  <b> Allergies : </b>
                  <p>
                    {" "}
                    Allergy 1; Allergy 2; Allergy 1; Allergy 2; Allergy 1;
                    Allergy 2;
                  </p>
                </span>
              </li>
              <li>
                <i class="fas fa-diagnoses" />

                <span>
                  <b> Diagnosis : </b>
                  <p>
                    {" "}
                    Diagnosis 1; Diagnosis 2; Diagnosis 1; Diagnosis 2;
                    Diagnosis 1; Diagnosis 2;
                  </p>
                </span>
              </li>
              <li>
                <i class="fas fa-utensils" />

                <span>
                  <b> Diet : </b>
                  <p> Diet 1; Diet 2; Diet 1; Diet 2; Diet 1; Diet 2;</p>
                </span>
              </li>
            </ul>
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
