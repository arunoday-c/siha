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
              children: <NewMonthlyAttendence />,
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
              children: <BulkTimeSheet />,
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
              children: <WeeklyAttendance />,
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
              children: <AbsenceManagement />,
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
              children: <OverTimeMgmt />,
              componentCode: "ATT_OVR_TIM"
            }
          ]}
          renderClass="AttMgmntSection"
        />
      </div>
    );
  }
}
// function ChildrenItem({ children }) {
//   return <div className="Attendance-Management-section">{children}</div>;
// }
