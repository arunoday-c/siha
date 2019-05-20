import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/PrimaryInsuranceDetails.js";
// import SecondaryInsurance from "./SecondaryInsurance/SecondaryInsuranceDetails.js";
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
      <div className="col-12">
      
        <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
   
      </div>
    );
  }
}
