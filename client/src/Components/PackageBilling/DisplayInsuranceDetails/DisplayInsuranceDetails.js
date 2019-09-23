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
      <div className="col-12 popRightDiv">
       
        <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
        {/* <h6
          style={{
            borderBottom: " 1px solid #d0d0d0",
            fontSize: "0.9rem",
            paddingBottom: 5
          }}
        >
          Secondary Insurance
        </h6>
        <SecondaryInsurance BillingIOputs={this.props.BillingIOputs} /> */}
      </div>
    );
  }
}
