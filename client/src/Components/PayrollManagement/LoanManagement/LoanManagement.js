import React, { Component } from "react";
import "./loan_mgmt.scss";
import LoanAdjustment from "./LoanAdjustment/LoanAdjustment";
import LoanAuthorization from "./LoanAuthorization/LoanAuthorization";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class LoanManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "LoanAuth"
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
      <div className="loan_mgmt">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"LoanAuth"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Loan Authorization"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LoanAdjustment"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Loan Adjustment"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "LoanAuth" ? (
            <LoanAuthorization />
          ) : this.state.pageDisplay === "LoanAdjustment" ? (
            <LoanAdjustment />
          ) : null}
        </div>
      </div>
    );
  }
}

export default LoanManagement;
