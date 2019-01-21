import React, { Component } from "react";
import "./payroll_settings.css";
import EarningsDeductions from "./EarningsDeductions/EarningsDeductions";
import LoanMaster from "./LoanMaster/LoanMaster";
import HolidayMaster from "./HolidayMaster/HolidayMaster";

import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class PayrollSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EarningsDeductions"
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
      <div className="payroll_settings">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"EarningsDeductions"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Earnings & Deductions"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LoanMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Loan Master"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"HolidayMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Holiday Master"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "EarningsDeductions" ? (
            <EarningsDeductions />
          ) : this.state.pageDisplay === "LoanMaster" ? (
            <LoanMaster />
          ) : this.state.pageDisplay === "HolidayMaster" ? (
            <HolidayMaster />
          ) : // this.state.pageDisplay === "AppointmentClinics" ? (
          //     <AppointmentClinics />
          null}
        </div>
      </div>
    );
  }
}

export default PayrollSettings;
