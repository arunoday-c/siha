import React, { Component } from "react";
import "./SelfService.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import Dashboard from "./Dashboard/Dashboard";
import AttendanceRegularization from "./AttendanceRegularization/AttendanceRegularization";
import ApplyLeave from "./ApplyLeave/ApplyLeave";

export default class SelfService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Dashboard"
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
      <div className="hr_settings">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"Dashboard"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Dashboard"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AttendanceRegularization"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Attendance Regularization"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ApplyLeave"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Apply Leave"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="hr-setion">
          {this.state.pageDisplay === "Dashboard" ? (
            <Dashboard />
          ) : this.state.pageDisplay === "AttendanceRegularization" ? (
            <AttendanceRegularization />
          ) : this.state.pageDisplay === "ApplyLeave" ? (
            <ApplyLeave />
          ) : //)
          //   : this.state.pageDisplay === "AppointmentRooms" ? (
          //     <AppointmentRooms />
          //   ) : this.state.pageDisplay === "AppointmentClinics" ? (
          //     <AppointmentClinics />
          null}
        </div>
      </div>
    );
  }
}
