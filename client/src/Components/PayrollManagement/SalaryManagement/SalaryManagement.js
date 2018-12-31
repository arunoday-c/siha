import React, { Component } from "react";
import "./SalaryManagement.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import SalaryPayments from "./SalaryPayments/SalaryPayments";
import SalaryProcessing from "./SalaryProcessing/SalaryProcessing";
import MiscEarningsDeductions from "./MiscEarningsDeductions/MiscEarningsDeductions";

export default class SalaryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "SalaryProcessing"
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
      <div className="salary_management">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"SalaryProcessing"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Salary Processing"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"SalaryPayments"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Salary Payments"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"MiscEarningsDeductions"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "miscellaneous Earnings & Deductions"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="salary-setion">
          {this.state.pageDisplay === "SalaryProcessing" ? (
            <SalaryProcessing />
          ) : this.state.pageDisplay === "SalaryPayments" ? (
            <SalaryPayments />
          ) : this.state.pageDisplay === "MiscEarningsDeductions" ? (
            <MiscEarningsDeductions />
          ) : null}
        </div>
      </div>
    );
  }
}
