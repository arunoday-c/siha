import React, { Component } from "react";
import styles from "./SecondaryInsurance.css";
import AddSecInsuranceForm from "./AddSecInsuranceForm.js";

export default class SecondaryInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="hptl-phase1-secinsurance-form">
        <AddSecInsuranceForm PatRegIOputs={this.props.PatRegIOputs} />
      </div>
    );
  }
}
