import React, { Component } from "react";
import AddOPBillingDetails from "./AddOPBillingDetails/AddOPBillingForm";

import PrimaryInsurance from "../DisplayInsuranceDetails/PrimaryInsurance/PrimaryInsuranceDetails.js";
import SecondaryInsurance from "../DisplayInsuranceDetails/SecondaryInsurance/SecondaryInsuranceDetails.js";
import "./OPBillingDetails.css";
import "../DisplayInsuranceDetails/DisplayInsuranceDetails.css";
import "./../../../styles/site.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

export default class OPBillingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "BillingDetails"
    };
  }

  openTab(e) {
    var element = document.querySelectorAll("[algaehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.currentTarget.classList.add("active");
    var specified = e.currentTarget.getAttribute("algaehtabs");
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="hptl-phase1-opbilling-details margin-top-15 margin-bottom-15 ">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              algaehtabs={"BillingDetails"}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Billing Details"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"PrimaryInsurance"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Primary Insurance"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"SecondaryDetails"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Secondary Details"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="opbilling-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "BillingDetails" ? (
            <AddOPBillingDetails BillingIOputs={this.props.BillingIOputs} />
          ) : this.state.pageDisplay === "PrimaryInsurance" ? (
            <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
          ) : this.state.pageDisplay === "SecondaryDetails" ? (
            <SecondaryInsurance BillingIOputs={this.props.BillingIOputs} />
          ) : null}
        </div>
      </div>
    );
  }
}
