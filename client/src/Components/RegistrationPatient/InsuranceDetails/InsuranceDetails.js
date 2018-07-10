import React, { PureComponent } from "react";
import InsuranceForm from "./InsuranceForm/InsuranceForm.js";
import SecondaryInsurance from "./SecondaryInsurance/SecondaryInsurance.js";
import "./InsuranceDetails.css";
import "./../../../styles/site.css";
import AlgaehLabel from "../../Wrapper/label.js";

import AddCircle from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";

export default class InsuranceDetails extends PureComponent {
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
      <div className="hptl-phase1-insurance-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + primaryInsurance}
              onClick={this.openTab.bind(this, "primary-insurance")}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_primaryins"
                  }}
                />
              }

              {/* <AddCircle style={{ padding: "2px", marginBottom: "-10px" }} /> */}
              {/* <IconButton className="newadd-button" color="primary">
                <AddCircle />
              </IconButton> */}
            </li>
            <li
              className={"nav-item tab-button " + secondaryInsurance}
              onClick={this.openTab.bind(this, "secondary-insurance")}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "tab_secondaryins"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="insurance-section">
          {this.state.actionPrimaryDesign ? <InsuranceForm /> : null}
          {this.state.actionSecondaryDesign ? null : <SecondaryInsurance />}
        </div>
        {/* <div>
          <InsuranceList />
        </div> */}
      </div>
    );
  }
}
