import React, { Component } from "react";
import "./patientprofile.css";
import Overview from "./Overview/Overview";
import Subjective from "./Subjective/Subjective";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import Assesment from "./Assessment/Assessment";
import Plan from "./Plan/Plan";
import { algaehApiCall, cancelRequest } from "../../utils/algaehApiCall";
import moment from "moment";
import { setGlobal, removeGlobal } from "../../utils/GlobalFunctions";
import algaehLoader from "../Wrapper/fullPageLoader";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../actions/algaehActions";
import {
  getPatientProfile,
  getPatientVitals,
  getPatientDiet,
  getPatientDiagnosis
  // getPatientChiefComplaints
} from "./PatientProfileHandlers";
import Enumerable from "linq";

class PatientProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageDisplay: "subjective",
      patientData: {},
      patientVitals: {},
      patientAllergies: [],
      patientDiagnosis: [],
      patientDiet: []
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
    cancelRequest("getPatientProfile");
    cancelRequest("getPatientVitals");
    cancelRequest("getPatientDiet");
    cancelRequest("getPatientDiagnosis");
    // removeGlobal("current_patient");
    // removeGlobal("episode_id");
  }

  componentDidMount() {
    getPatientProfile(this);
    // if (
    //   this.props.patient_allergies === undefined ||
    //   this.props.patient_allergies.length === 0
    // ) {
    //   getPatientAllergies(this);
    // } else {
    //   this.setState({
    //     patientAllergies: this.props.patient_allergies
    //   });
    // }
    if (
      this.props.patient_vitals === undefined ||
      this.props.patient_vitals.length === 0
    ) {
      getPatientVitals(this);
    }
  }

  render() {
    const _patient_allergies =
      this.props.patient_allergies === undefined
        ? []
        : Enumerable.from(this.props.patient_allergies)
            .groupBy("$.allergy_type", null, (k, g) => {
              return {
                allergy_type: k,
                allergy_type_desc:
                  k === "F"
                    ? "Food"
                    : k === "A"
                      ? "Airborne"
                      : k === "AI"
                        ? "Animal  &  Insect"
                        : k === "C"
                          ? "Chemical & Others"
                          : "",
                allergyList: g.getSource()
              };
            })
            .toArray();
    return (
      <div className="row patientProfile">
        <div className="patientInfo-Top box-shadow-normal">
          <div className="backBtn">
            <button
              id="btn-outer-component-load"
              className="d-none"
              //  onClick={this.setPatientGlobalParameters.bind(this)}
            />
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
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].full_name
                : ""}
            </h6>
            <p>
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].gender
                : ""}
              ,{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_years
                : 0}
              Y{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_months
                : 0}
              M{" "}
              {this.props.patient_profile !== undefined
                ? this.props.patient_profile[0].age_in_days
                : 0}
              D
            </p>
          </div>
          <div className="patientDemographic">
            <span>
              DOB:
              <b>
                {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].date_of_birth
                    : ""
                ).format("DD-MM-YYYY")}
              </b>
            </span>
            <span>
              Mobile:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].contact_number
                  : ""}
              </b>
            </span>
            <span>
              Nationality:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].nationality
                  : ""}
              </b>
            </span>
          </div>
          <div className="patientHospitalDetail">
            <span>
              MRN:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].patient_code
                  : ""}
              </b>
            </span>
            <span>
              Encounter:{" "}
              <b>
                {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].Encounter_Date
                    : ""
                ).format("DD-MM-YYYY HH:MM:SS A")}
              </b>
            </span>
            <span>
              Payment:{" "}
              <b>
                {this.props.patient_profile !== undefined
                  ? this.props.patient_profile[0].payment_type === "I"
                    ? "Insurance"
                    : "Self"
                  : ""}
              </b>
            </span>
          </div>
          <div className="patientVital">
            <span>
              BP:{" "}
              <b>
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].systolic
                  : 0}
                /
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].diastolic
                  : 0}
              </b>
            </span>
            <span>
              Temp &deg;C:{" "}
              <b>
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].temperature_celsisus
                  : 0}{" "}
                (
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].temperature_from
                  : 0}
                )
              </b>
            </span>
            <span>
              H:{" "}
              <b>
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].height
                  : 0}{" "}
                CM
              </b>
            </span>
            <span>
              W:{" "}
              <b>
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].weight
                  : 0}{" "}
                KG
              </b>
            </span>

            <span>
              BMI :{" "}
              <b>
                {" "}
                {this.props.patient_vitals !== undefined &&
                this.props.patient_vitals.length !== 0
                  ? this.props.patient_vitals[0].bmi
                  : 0}{" "}
              </b>
            </span>
          </div>
          <div className="moreAction">
            <button type="button" className="btn btn-outline-secondary btn-sm">
              <i className="fas fa-caret-square-down fa-lg" />
              More
            </button>
            <ul className="moreActionUl">
              <li><span>Open MRD</span></li>
            </ul>
          </div>
        </div>
        <div className="patientTopNav box-shadow-normal">
          <ul className="nav">
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
                <i className="fas fa-allergies" />
                <p>
                  <b>Allergies:</b>

                  {_patient_allergies.map((data, index) => (
                    <React.Fragment key={index}>
                      <b>{data.allergy_type_desc}</b>
                      {data.allergyList.map((allergy, aIndex) => (
                        <span
                          key={aIndex}
                          className={
                            "listofA-D-D " +
                            (allergy.allergy_inactive === "Y" ? "red" : "")
                          }
                          title={
                            "Onset Date : " +
                            allergy.onset_date +
                            "\n Comment : " +
                            allergy.comment +
                            "\n Severity : " +
                            allergy.severity
                          }
                        >
                          {allergy.allergy_name}
                        </span>
                      ))}
                    </React.Fragment>
                  ))}
                </p>
              </li>
              <li>
                <i className="fas fa-diagnoses" />
                <p>
                  <b>Diagnosis:</b>
                  {this.state.patientDiagnosis.map((data, index) => (
                    <span key={index} className="listofA-D-D">
                      {data.diagnosis_name}
                    </span>
                  ))}
                </p>
              </li>
              <li>
                <i className="fas fa-utensils" />
                <p>
                  <b>Diet:</b>
                  {this.state.patientDiet.map((data, index) => (
                    <span key={index} className="listofA-D-D">
                      {data.hims_d_diet_description}
                    </span>
                  ))}
                </p>
              </li>
            </ul>
          </ul>
        </div>
        <div className="patientContentArea">
          {this.state.pageDisplay === "overview" ? (
            <Overview />
          ) : this.state.pageDisplay === "subjective" ? (
            <Subjective />
          ) : this.state.pageDisplay === "phy_exam" ? (
            <PhysicalExamination />
          ) : this.state.pageDisplay === "assesment" ? (
            <Assesment
              vat_applicable={this.props.patient_profile[0].vat_applicable}
            />
          ) : this.state.pageDisplay === "plan" ? (
            <Plan />
          ) : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_profile: state.patient_profile,
    patient_allergies: state.patient_allergies,
    patient_vitals: state.patient_vitals,
    patient_diet: state.patient_diet,
    patient_diagnosis: state.patient_diagnosis
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientProfile: AlgaehActions,
      getPatientAllergies: AlgaehActions,
      getPatientVitals: AlgaehActions,
      getPatientDiet: AlgaehActions,
      getPatientDiagnosis: AlgaehActions

      // getPatientChiefComplaints: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientProfile)
);
