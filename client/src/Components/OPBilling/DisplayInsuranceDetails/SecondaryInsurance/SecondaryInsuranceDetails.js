import React, { Component } from "react";
import DisplaySecondaryInsurance from "./DisplaySecondaryInsurance";
import "./SecondaryInsuranceDetails.css";

export default class DisplaySecInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-secinsurancedis-form">
        <DisplaySecondaryInsurance BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
