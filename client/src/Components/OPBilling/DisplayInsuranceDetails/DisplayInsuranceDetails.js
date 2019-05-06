import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/PrimaryInsuranceDetails.js";
import SecondaryInsurance from "./SecondaryInsurance/SecondaryInsuranceDetails.js";
import "./DisplayInsuranceDetails.css";
import "./../../../styles/site.css";

export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    debugger;
    return (
      <div className="col-12 popRightDiv">
        <h6
          style={{
            borderBottom: " 1px solid #d0d0d0",
            fontSize: "0.9rem",
            paddingBottom: 5,
            paddingTop: "10px"
          }}
        >
          Primary Insurance
        </h6>
        <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
        {this.props.BillingIOputs.sec_insured === "Y" ? (
          <div>
            <h6
              style={{
                borderBottom: " 1px solid #d0d0d0",
                fontSize: "0.9rem",
                paddingBottom: 5
              }}
            >
              Secondary Insurance
            </h6>
            <SecondaryInsurance BillingIOputs={this.props.BillingIOputs} />
          </div>
        ) : null}
      </div>
    );
  }
}
