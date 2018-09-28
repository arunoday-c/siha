import React, { Component } from "react";
import DisInsuranceDetails from "./DisInsuranceDetails.js";
import "./PrimaryInsuranceDetails.css";

export default class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-primary-insurance-form">
        <DisInsuranceDetails BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
