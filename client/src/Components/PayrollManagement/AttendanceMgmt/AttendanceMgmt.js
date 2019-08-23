import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
// import MonthlyAttendance from "./MonthlyAttendance/MonthlyAttendance";
import NewMonthlyAttendence from "./MonthlyAttendance/NewMonthlyAttendance";
import WeeklyAttendance from "./WeeklyAttendance/WeeklyAttendance";
import AbsenceManagement from "./AbsenceManagement/AbsenceManagement";
import ManualAttendance from "./ManualAttendance/ManualAttendance";
import BulkTimeSheet from "./BulkTimeSheet";
import "./AttendanceMgmt.css";
// import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
// import { AlgaehCloseContainer } from "../../../utils/GlobalFunctions";

export default class AttendanceMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "NewMonthlyAttendance"
    };
    // this.getOptions();
  }

  // getOptions() {
  //   algaehApiCall({
  //     uri: "/payrollOptions/getHrmsOptions",
  //     method: "GET",
  //     module: "hrManagement",
  //     onSuccess: res => {
  //       if (res.data.success) {
  //         sessionStorage.removeItem("hrOptions");
  //         sessionStorage.setItem(
  //           "hrOptions",
  //           AlgaehCloseContainer(JSON.stringify(res.data.result[0]))
  //         );
  //       }
  //     },
  //     onFailure: err => {
  //       swalMessage({
  //         title: err.message,
  //         type: "error"
  //       });
  //     }
  //   });
  // }

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
              {/* <li
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
              </li> */}
              <li
                algaehtabs={"NewMonthlyAttendance"}
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
                      forceLabel: "Employee Timesheet"
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
                      forceLabel: "Absence Management"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ManualAttendance"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Manual Timesheet"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"BulkManualTimeSheet"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Bulk Manual Timesheet"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="attendance-setion">
          {//   this.state.pageDisplay === "MonthlyAttendance" ? (
          //   <MonthlyAttendance />
          // ) :
          this.state.pageDisplay === "NewMonthlyAttendance" ? (
            <NewMonthlyAttendence />
          ) : this.state.pageDisplay === "WeeklyAttendance" ? (
            <WeeklyAttendance />
          ) : this.state.pageDisplay === "AbsenceManagement" ? (
            <AbsenceManagement />
          ) : this.state.pageDisplay === "ManualAttendance" ? (
            <ManualAttendance />
          ) : this.state.pageDisplay === "BulkManualTimeSheet" ? (
            <BulkTimeSheet />
          ) : null}
        </div>
      </div>
    );
  }
}
