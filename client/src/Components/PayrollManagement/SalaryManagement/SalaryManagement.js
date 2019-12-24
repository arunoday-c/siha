import React, { Component } from "react";
import "./SalaryManagement.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import NewSalaryProcessing from "./SalaryProcessing/NewSalaryProcessing";
import MiscEarningsDeductions from "./MiscEarningsDeductions/MiscEarningsDeductions";
import MiscEarningsDeductionsNew from "./MiscEarningsDeductionsNew/MiscEarningsDeductionsNew";
import LeaveSalaryProcess from "./LeaveSalaryProcess/LeaveSalaryProcess";

export default class SalaryManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "MiscEarningsDeductions"
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
              {/* <li
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
              </li> */}
              <li
                algaehtabs={"MiscEarningsDeductions"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Miscellaneous E&D"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"MiscEarningsDeductionsNew"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Miscellaneous E&D Bulk"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"NewSalaryProcessing"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Normal Salary Process"
                    }}
                  />
                }
              </li>
              {/* <li
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
              </li> */}{" "}
              <li
                algaehtabs={"LeaveSalaryProcess"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Leave Salary Process"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="salary-setion">
          {this.state.pageDisplay === "NewSalaryProcessing" ? (
            <NewSalaryProcessing />
          ) : this.state.pageDisplay === "MiscEarningsDeductions" ? (
            <MiscEarningsDeductions />
          ) : this.state.pageDisplay === "MiscEarningsDeductionsNew" ? (
            <MiscEarningsDeductionsNew />
          ) : this.state.pageDisplay === "LeaveSalaryProcess" ? (
            <LeaveSalaryProcess />
          ) : null}
        </div>
      </div>
    );
  }
}
