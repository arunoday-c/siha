import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/PrimaryInsuranceDetails.js";
// import SecondaryInsurance from "./SecondaryInsurance/SecondaryInsuranceDetails.js";
import "./DisplayInsuranceDetails.scss";
import "./../../../styles/site.scss";

export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className="col-12"
        style={{ background: "#fff", border: "1px solid #d3d3d3" }}
      >
        <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
      </div>
    );
  }
}
