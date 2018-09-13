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
        <PatientDisplayForm BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
