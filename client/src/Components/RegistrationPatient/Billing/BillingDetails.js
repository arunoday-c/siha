import React, { PureComponent } from "react";
import BillingForm from "./BillingDetails/BillingForm";

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
    return (
      <div className="hptl-phase1-billing-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + "active"}
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
          </ul>
        </div>
        <div className="billing-section">
          <BillingForm PatRegIOputs={this.props.PatRegIOputs} />
        </div>
      </div>
    );
  }
}
