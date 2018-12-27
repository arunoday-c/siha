import React, { Component } from "react";
import "./leave_mgmt.css";
import LeaveAuth from "./LeaveAuthorization/LeaveAuthorization";
import LeaveEncashAuth from "./LeaveEncashmentAuth/LeaveEncashmentAuth";
import LeaveSalaryAirfare from "./LeaveSalaryAirfareBookings/LeaveSalaryAirfareBookings";
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
      <div className="leave_mgmt">
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
                    forceLabel: "Leave Encashment Authorization"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"LeaveSalaryAirfare"}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Salary Airfare Bookings"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="leave-section">
          {this.state.pageDisplay === "LeaveAuth" ? (
            <LeaveAuth />
          ) : this.state.pageDisplay === "LeaveEncashAuth" ? (
            <LeaveEncashAuth />
          ) : this.state.pageDisplay === "LeaveSalaryAirfare" ? (
            <LeaveSalaryAirfare />
          ) : null}
        </div>
      </div>
    );
  }
}
