import React, { Component } from "react";
import DisPatientForm from "./DisPatientForm.js";
import styles from "./PatientDisplayForm.scss";

export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-display-patient-form">
        <DisPatientForm BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
