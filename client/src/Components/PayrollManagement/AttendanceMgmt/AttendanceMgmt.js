import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import MonthlyAttendance from "./MonthlyAttendance/MonthlyAttendance";
import WeeklyAttendance from "./WeeklyAttendance/WeeklyAttendance";
import AbsenceManagement from "./AbsenceManagement/AbsenceManagement";
import "./AttendanceMgmt.css";

export default class AttendanceMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "MonthlyAttendance"
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
                algaehtabs={"MonthlyAttendance"}
                className={"nav-item tab-button active"}
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
              <li
                algaehtabs={"WeeklyAttendance"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Weekly Attendance"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AbsenceManagement"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Absent Management "
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="attendance-setion">
          {this.state.pageDisplay === "MonthlyAttendance" ? (
            <MonthlyAttendance />
          ) : this.state.pageDisplay === "WeeklyAttendance" ? (
            <WeeklyAttendance />
          ) : this.state.pageDisplay === "AbsenceManagement" ? (
            <AbsenceManagement />
          ) : null}
        </div>
      </div>
    );
  }
}
