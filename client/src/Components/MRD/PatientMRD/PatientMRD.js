import React, { Component } from "react";
import "./patient_mrd.css";
import { setGlobal } from "../../../utils/GlobalFunctions";
import Encounters from "./Encounters/Encounters";
import HistoricalData from "./HistoricalData/HistoricalData";

class PatientMRD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "encounters"
    };
    this.changeTabs = this.changeTabs.bind(this);
  }

  changeTabs(e) {
    var element = document.querySelectorAll("[algaehmrd]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var page = e.currentTarget.getAttribute("algaehmrd");
    this.setState({
      pageDisplay: page
    });
  }

  render() {
    return (
      // Main Render Start
      <div className="patient-mrd">
        {/* Top Bar Start */}
        <div className="row patientProfile">
          <div className="patientInfo-Top box-shadow-normal">
            <div className="backBtn">
              <button id="btn-outer-component-load" className="d-none" />
              <button
                onClick={() => {
                  setGlobal({ "MRD-STD": "MRDList" });
                  document.getElementById("mrd-router").click();
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
                  : "Sebastian Tassard"}
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
                  {/* {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].date_of_birth
                    : ""
                ).format("DD-MM-YYYY")} */}
                  DD-MM-YYYY
                </b>
              </span>
              <span>
                Mobile:{" "}
                <b>
                  {this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].contact_number
                    : "9098909878"}
                </b>
              </span>
              <span>
                Nationality:{" "}
                <b>
                  {this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].nationality
                    : "Indian"}
                </b>
              </span>
            </div>
            <div className="patientHospitalDetail">
              <span>
                MRN:{" "}
                <b>
                  {this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].patient_code
                    : "000000"}
                </b>
              </span>
              <span>
                Encounter:{" "}
                <b>
                  {/* {moment(
                  this.props.patient_profile !== undefined
                    ? this.props.patient_profile[0].Encounter_Date
                    : ""
                ).format("DD-MM-YYYY HH:MM:SS A")} */}
                  DD-MM-YYYY HH:MM:SS A
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

            <div className="moreAction">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
              >
                <img
                  src={require("../../common/BreadCrumb/images/print.png")}
                />
              </button>
            </div>
          </div>
          {/* Top Bar End */}
          {/* Tabs Start */}
          <div className="patientTopNav box-shadow-normal">
            <ul className="nav">
              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehmrd="encounters"
                  className="nav-link active"
                >
                  Encounters
                </span>
              </li>

              <li className="nav-item">
                <span
                  onClick={this.changeTabs}
                  algaehmrd="histrorical_data"
                  className="nav-link"
                >
                  Historical Data
                </span>
              </li>
            </ul>
          </div>
          {/* Tabs End */}

          {/* Bottom Body Start */}
          <div className="componentRenderArea">
            {this.state.pageDisplay === "encounters" ? (
              <Encounters />
            ) : this.state.pageDisplay === "histrorical_data" ? (
              <HistoricalData />
            ) : null}
          </div>
        </div>
      </div>
      //Main Render End
    );
  }
}

export default PatientMRD;
