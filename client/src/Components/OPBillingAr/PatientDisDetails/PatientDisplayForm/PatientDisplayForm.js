import React, { Component } from "react";
import DisPatientForm from "./DisPatientForm.js";
import styles from "./PatientDisplayForm.scss";

export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <DisPatientForm BillingIOputs={this.props.BillingIOputs} />;
  }
}
