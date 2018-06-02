import React, { PureComponent } from "react";
import BillingForm from "./BillingDetails/BillingForm";
import ReciptForm from "./ReciptDetails/ReciptForm";
import styles from "./BillingDetails.css";
import style from "./../../../styles/site.css";

export default class BillingDetails extends PureComponent {
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
      <div className="hptl-phase1-billing-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + BillingDetails}
              onClick={this.openTab.bind(this, "Billing-details")}
            >
              BILLING DETAILS
            </li>
            <li
              className={"nav-item tab-button " + ReciptDetails}
              onClick={this.openTab.bind(this, "Recipts-details")}
            >
              RECIPTS
            </li>
          </ul>
          {/* <div className="row">
						<div className="col-xs-4 col-sm-3 col-md-3 col-lg-2 tab">
							<button className={"tab-button " + BillingDetails} onClick={this.openTab.bind(this, "Billing-details")}>Billing Details</button>
						</div>

						<div className="col-xs-4 col-sm-3 col-md-3 col-lg-2 tab">
							<button className={"tab-button " + ReciptDetails}  onClick={this.openTab.bind(this, "Recipts-details")}>Recipts</button>
						</div>
					</div> */}
        </div>
        <div className="billing-section">
          {this.state.actionBillingDetails ? <BillingForm /> : null}
          {this.state.actionReciptDetails ? null : <ReciptForm />}
        </div>
      </div>
    );
  }
}
