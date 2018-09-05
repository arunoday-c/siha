import React, { Component } from "react";
import PatientDisplayForm from "./PatientDisplayForm/PatientDisplayForm.js";
import "./../../../styles/site.css";
import "./PatientDetails.css";

export default class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionPatientDesign: true,
      actionInformationDesign: true
    };
  }

  openTab(dataValue) {
    if (dataValue === "patient-details") {
      this.setState({
        actionPatientDesign: true,
        actionInformationDesign: true
      });
    } else if (dataValue === "other-information") {
      this.setState({
        actionInformationDesign: false,
        actionPatientDesign: false
      });
    }
  }

  render() {
    let patientSelect = this.state.actionPatientDesign ? "active" : "";

    return (
      <div className="hptl-phase1-Display-patient-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li className={"nav-item tab-button active"}>
              <label class="style_Label ">Patient Details</label>
            </li>
          </ul>
        </div>
        <div className="patient-section">
          <PatientDisplayForm BillingIOputs={this.props.BillingIOputs} />
        </div>
      </div>
    );
  }
}
