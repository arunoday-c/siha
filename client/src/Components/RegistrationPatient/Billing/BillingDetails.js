import React, { PureComponent } from "react";
import BillingForm from "./BillingDetails/BillingForm";
import ReciptForm from "./ReciptDetails/ReciptForm";
import "./BillingDetails.css";
import "./../../../styles/site.css";
import AlgaehLabel from "../../Wrapper/label.js";

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
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_billdtls"
                  }}
                />
              }
            </li>
            <li
              className={"nav-item tab-button " + ReciptDetails}
              onClick={this.openTab.bind(this, "Recipts-details")}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_recipts"
                  }}
                />
              }
            </li>
          </ul>          
        </div>
        <div className="billing-section">
          {this.state.actionBillingDetails ? <BillingForm /> : null}
          {this.state.actionReciptDetails ? null : <ReciptForm />}
        </div>
      </div>
    );
  }
}
