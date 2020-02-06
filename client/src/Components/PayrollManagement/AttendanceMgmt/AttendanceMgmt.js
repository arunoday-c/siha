import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import NewMonthlyAttendence from "./MonthlyAttendance/NewMonthlyAttendance";
import WeeklyAttendance from "./WeeklyAttendance/WeeklyAttendance";
import BulkTimeSheet from "./BulkTimeSheet";
import "./AttendanceMgmt.scss";
import { AlgaehTabs } from "algaeh-react-components";

// import AbsenceManagement from "./AbsenceManagement/AbsenceManagement";
// import OverTimeMgmt from "./OvertimeManagement/OvertimeManagement";

export default class AttendanceMgmt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "NewMonthlyAttendance"
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
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Monthly Attendance"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <NewMonthlyAttendence />
                </ChildrenItem>
              ),
              componentCode: "ATT_MON_ATT"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Manual Timesheet (Single/Bulk)"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <BulkTimeSheet />
                </ChildrenItem>
              ),
              componentCode: "ATT_MAN_TIM"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Biometric Timesheet"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <WeeklyAttendance />
                </ChildrenItem>
              ),
              componentCode: "ATT_BIO_TIM"
            }
          ]}
        />

        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
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
                algaehtabs={"BulkManualTimeSheet"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Manual Timesheet (Single/Bulk)"
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
                      forceLabel: "Biometric Timesheet"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="attendance-setion">
          {this.state.pageDisplay === "NewMonthlyAttendance" ? (
            <NewMonthlyAttendence />
          ) : this.state.pageDisplay === "WeeklyAttendance" ? (
            <WeeklyAttendance />
          ) : this.state.pageDisplay === "AbsenceManagement" ? (
            <AbsenceManagement />
          ) : this.state.pageDisplay === "BulkManualTimeSheet" ? (
            <BulkTimeSheet />
          ) : this.state.pageDisplay === "OverTimeMgmt" ? (
            <OverTimeMgmt />
          ) : null}
        </div> */}
      </div>
    );
  }
}
function ChildrenItem({ children }) {
  return <div className="Attendance-Management-section">{children}</div>;
}