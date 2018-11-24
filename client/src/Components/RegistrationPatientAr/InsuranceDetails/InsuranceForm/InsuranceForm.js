import React, { Component } from "react";
import AddInsuranceForm from "./AddInsuranceForm.js";

export default class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-insurance-form">
        <AddInsuranceForm PatRegIOputs={this.props.PatRegIOputs} />
      </div>
    );
  }
}
