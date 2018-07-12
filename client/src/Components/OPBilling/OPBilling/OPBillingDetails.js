import React, { Component } from "react";
import AddOPBillingDetails from "./AddOPBillingDetails/AddOPBillingForm";
import ReciptForm from "./ReciptDetails/ReciptForm";
import "./OPBillingDetails.css";
import "./../../../styles/site.css";

export default class OPBillingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionBillingDetails: true,
      actionReciptDetails: true
    };
  }

  openTab(dataValue) {
    if (dataValue === "Billing-details") {
      this.setState({
        actionBillingDetails: true,
        actionReciptDetails: true
      });
    } else if (dataValue === "Recipts-details") {
      this.setState({
        actionReciptDetails: false,
        actionBillingDetails: false
      });
    }
  }

  render() {
    let BillingDetails = this.state.actionBillingDetails ? "active" : "";
    let ReciptDetails = this.state.actionReciptDetails ? "" : "active";

    return (
      <div className="hptl-phase1-opbilling-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + BillingDetails}
              id="PrimaryInsurance"
              onClick={this.openTab.bind(this, "Billing-details")}
            >
              Billing Details
            </li>
            <li
              className={"nav-item tab-button " + ReciptDetails}
              id="SecondaryInsurance"
              onClick={this.openTab.bind(this, "Recipts-details")}
            >
              Recipt Details
            </li>
          </ul>
        </div>
        <div className="opbilling-section">
          {this.state.actionBillingDetails ? (
            <AddOPBillingDetails BillingIOputs={this.props.BillingIOputs} />
          ) : null}
          {this.state.actionReciptDetails ? null : (
            <ReciptForm BillingIOputs={this.props.BillingIOputs} />
          )}
        </div>
      </div>
    );
  }
}
