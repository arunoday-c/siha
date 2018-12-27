import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import DailyAttendance from "./DailyAttendance/DailyAttendance";
import MonthlyAttendance from "./MonthlyAttendance/MonthlyAttendance";

export default class AttendanceMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "DailyAttendance"
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
      <div className="attendance_mgmt">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"DailyAttendance"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Daily Attendance"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"MonthlyAttendance"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Monthly Attendance"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="attendance-setion">
          {this.state.pageDisplay === "DailyAttendance" ? (
            <DailyAttendance />
          ) : this.state.pageDisplay === "MonthlyAttendance" ? (
            <MonthlyAttendance />
          ) : null}
        </div>
      </div>
    );
  }
}
