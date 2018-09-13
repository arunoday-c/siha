import React, { Component } from "react";
import AddOPBillingDetails from "./AddOPBillingDetails/AddOPBillingForm";
import ReciptForm from "./ReciptDetails/ReciptForm";
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
    let BillingDetails = this.state.actionBillingDetails ? "active" : "";
    let ReciptDetails = this.state.actionReciptDetails ? "" : "active";

    return (
      // <div className="hptl-phase1-opbilling-details margin-top-15 margin-bottom-15 ">
      //   <div className="tab-container toggle-section">
      //     <ul className="nav">
      //       <li
      //         className={"nav-item tab-button " + BillingDetails}
      //         id="BillingDetails"
      //         onClick={this.openTab.bind(this, "Billing-details")}
      //       >
      //         <label className="style_Label ">Billing Details</label>
      //       </li>
      //       <li
      //         className={"nav-item tab-button " + ReciptDetails}
      //         id="ReciptDetails"
      //         onClick={this.openTab.bind(this, "Recipts-details")}
      //       >
      //         <label className="style_Label ">Recipt Details</label>
      //       </li>
      //       <li
      //         className={"nav-item tab-button " + PrimaryInsurance}
      //         id="PrimaryInsurance"
      //         onClick={this.openTab.bind(this, "Primary-insurance")}
      //       >
      //         <label className="style_Label ">Primary Insurance</label>
      //       </li>
      //       <li
      //         className={"nav-item tab-button " + SecondaryInsurance}
      //         id="SecondaryInsurance"
      //         onClick={this.openTab.bind(this, "Secondary-insurance")}
      //       >
      //         <label className="style_Label ">Secondary Insurance</label>
      //       </li>
      //     </ul>
      //   </div>

      //   <div className="opbilling-section">
      //     {this.state.actionBillingDetails ? (
      //       <AddOPBillingDetails BillingIOputs={this.props.BillingIOputs} />
      //     ) : null}
      //     {this.state.actionReciptDetails ? null : (
      //       <ReciptForm BillingIOputs={this.props.BillingIOputs} />
      //     )}
      //     {this.state.actionPrimaryDesign ? null : (
      //       <PrimaryInsurance BillingIOputs={this.props.BillingIOputs} />
      //     )}
      //     {this.state.actionSecondaryDesign ? null : (
      //       <SecondaryInsurance BillingIOputs={this.props.BillingIOputs} />
      //     )}
      //   </div>

      // </div>
      <div className="hptl-phase1-opbilling-details margin-top-15 margin-bottom-15 ">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              algaehtabs={"BillingDetails"}
              style={{ marginRight: 2 }}
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
              style={{ marginRight: 2 }}
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
              style={{ marginRight: 2 }}
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
