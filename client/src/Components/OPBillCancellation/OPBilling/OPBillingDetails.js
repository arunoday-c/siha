import React, { Component } from "react";
import AddOPBillingDetails from "./AddOPBillingDetails/AddOPBillingForm";

import DisplayInsuranceDetails from "../DisplayInsuranceDetails/DisplayInsuranceDetails.js";
import "./OPBillingDetails.scss";
import "./../../../styles/site.scss";
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
      <div className="hptl-phase1-opbilling-cancel-details margin-top-15 margin-bottom-15 ">
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
            {this.props.BillingIOputs.insured === "Y" ? (
              <li
                algaehtabs={"PrimaryInsurance"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Insurance Details"
                    }}
                  />
                }
              </li>
            ) : null}
          </ul>
        </div>

        <div className="opbilling-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "BillingDetails" ? (
            <AddOPBillingDetails BillingIOputs={this.props.BillingIOputs} />
          ) : this.state.pageDisplay === "PrimaryInsurance" ? (
            <DisplayInsuranceDetails BillingIOputs={this.props.BillingIOputs} />
          ) : null}
        </div>
      </div>
    );
  }
}
