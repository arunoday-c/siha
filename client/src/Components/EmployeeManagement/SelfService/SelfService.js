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
        <div className="row EmployeeProfile">
          <div className="EmployeeInfo-Top box-shadow-normal">
            <div className="EmployeeImg box-shadow">
              <img
                alt="Algaeh-HIS"
                // src={
                //   this.state.patImg.length > 0
                //     ? this.state.patImg
                //     : "../assets/images/nobody_m.original.webp"
                // }
              />
            </div>
            <div className="EmployeeName">
              <h6>Shane Warne</h6>
              <p>Male ,49Y 2M 27D</p>
            </div>
            <div className="EmployeeDemographic">
              <span>
                DOB:<b>13-09-1969</b>
              </span>
              <span>
                Mobile: <b>6180123456123</b>
              </span>
              <span>
                Nationality: <b>Australian </b>
              </span>
            </div>
          </div>
        </div>
        <div className="row EmployeeTopNav box-shadow-normal">
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
