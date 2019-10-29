import React, { Component } from "react";
import "./leave_mgmt.scss";
import LeaveAuth from "./LeaveAuthorization/LeaveAuthorization";
// import LeaveEncashmentProcess from "./LeaveEncashmentProcess/LeaveEncashmentProcess";
import LeaveEncashAuth from "./LeaveEncashmentAuth/LeaveEncashmentAuth";
import LeaveSalaryProcess from "./LeaveSalaryProcess/LeaveSalaryProcess";
import LeaveYearlyProcess from "./LeaveYearlyProcess/LeaveYearlyProcess";
//import LeaveSalaryAccural from "./LeaveSalaryAccural/LeaveSalaryAccural";

import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

export default class LeaveManagement extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "LeaveAuth" };
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
      <div className="row leave_mgmt">
        <div className="tabMaster toggle-section">
          <ul className="nav">
            <li
              algaehtabs={"LeaveAuth"}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Authorization"
                  }}
                />
              }
            </li>

            <li
              algaehtabs={"LeaveEncashAuth"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Encashment Authorization"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"LeaveSalaryProcess"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Annual Leave Salary Process"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"LeaveYearlyProcess"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Yearly Leave Process"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="col-12 leave-section">
          {this.state.pageDisplay === "LeaveAuth" ? (
            <LeaveAuth />
          ) : this.state.pageDisplay === "LeaveEncashAuth" ? (
            <LeaveEncashAuth />
          ) : this.state.pageDisplay === "LeaveSalaryProcess" ? (
            <LeaveSalaryProcess />
          ) : this.state.pageDisplay === "LeaveYearlyProcess" ? (
            <LeaveYearlyProcess />
          ) : // : this.state.pageDisplay === "LeaveSalaryAccural" ? (
          //   <LeaveSalaryAccural />
          null}
        </div>
      </div>
    );
  }
}
