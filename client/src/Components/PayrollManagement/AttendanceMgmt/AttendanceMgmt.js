import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import NewMonthlyAttendence from "./MonthlyAttendance/NewMonthlyAttendance";
import WeeklyAttendance from "./WeeklyAttendance/WeeklyAttendance";
import BulkTimeSheet from "./BulkTimeSheet";
import AbsenceManagement from "./AbsenceManagement/AbsenceManagement";
import OverTimeMgmt from "./OvertimeManagement/OvertimeManagement";
import "./AttendanceMgmt.scss";
import { AlgaehTabs } from "algaeh-react-components";

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
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Absence Management"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <AbsenceManagement />
                </ChildrenItem>
              ),
              componentCode: "ATT_ABS_MGMT"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Overtime Management"
                  }}
                />
              ),
              children: (
                <ChildrenItem>
                  <OverTimeMgmt />
                </ChildrenItem>
              ),
              componentCode: "ATT_OVR_TIM"
            }
          ]}
        />
      </div>
    );
  }
}
function ChildrenItem({ children }) {
  return <div className="Attendance-Management-section">{children}</div>;
}
