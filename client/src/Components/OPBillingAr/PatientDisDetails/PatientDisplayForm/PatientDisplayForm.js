import React, { Component } from "react";
import DisPatientForm from "./DisPatientForm.js";

export default class PatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <DisPatientForm BillingIOputs={this.props.BillingIOputs} />;
  }
}
