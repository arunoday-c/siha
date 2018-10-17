import React, { Component } from "react";
import PrimaryInsurance from "./PrimaryInsurance/DisInsuranceDetails.js";
import SecondaryInsurance from "./SecondaryInsurance/DisplaySecondaryInsurance.js";
import "./DisplayInsuranceDetails.css";
import "./../../../../styles/site.css";

export default class DisplayInsuranceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionPrimaryDesign: true,
      actionSecondaryDesign: true
    };
  }

  openTab(dataValue) {
    if (dataValue === "primary-insurance") {
      this.setState({
        actionPrimaryDesign: true,
        actionSecondaryDesign: true
      });
    } else if (dataValue === "secondary-insurance") {
      this.setState({
        actionSecondaryDesign: false,
        actionPrimaryDesign: false
      });
    }
  }

  render() {
    let primaryInsurance = this.state.actionPrimaryDesign ? "active" : "";
    let secondaryInsurance = this.state.actionSecondaryDesign ? "" : "active";
    return (
      <div className="hptl-phase1-insuranceDis-details margin-top-15">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + primaryInsurance}
              id="PrimaryInsurance"
              onClick={this.openTab.bind(this, "primary-insurance")}
            >
              <label className="style_Label ">Primary Insurance</label>
            </li>
            <li
              className={"nav-item tab-button " + secondaryInsurance}
              id="SecondaryInsurance"
              onClick={this.openTab.bind(this, "secondary-insurance")}
            >
              <label className="style_Label ">Secondary Insurance</label>
            </li>
          </ul>
        </div>
        <div className="display-insurance-section">
          {this.state.actionPrimaryDesign ? (
            <PrimaryInsurance
              SALESRETURNIOputs={this.props.SALESRETURNIOputs}
            />
          ) : null}
          {this.state.actionSecondaryDesign ? null : (
            <SecondaryInsurance
              SALESRETURNIOputs={this.props.SALESRETURNIOputs}
            />
          )}
        </div>
      </div>
    );
  }
}
