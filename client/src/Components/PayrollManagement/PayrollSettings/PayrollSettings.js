import React, { Component } from "react";
import "./payroll_settings.scss";
import EarningsDeductions from "./EarningsDeductions/EarningsDeductions";
import LoanMaster from "./LoanMaster/LoanMaster";
import HolidayMaster from "./HolidayMaster/HolidayMaster";
import LeaveMasterIndex from "./LeaveMasterIndex/LeaveMasterIndex";
import OvertimeGroups from "./OvertimeGroups/OvertimeGroups";
import { AlgaehTabs } from "algaeh-react-components";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class PayrollSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "LeaveMaster"
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
      <div className="payroll_settings">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Leave Master"
                  }}
                />
              ),
              children: <LeaveMasterIndex />,
              componentCode: "PAY_SET_LEV_MTR"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Earnings & Deductions"
                  }}
                />
              ),
              children: <EarningsDeductions />,
              componentCode: "PAY_SET_E&D_MTR"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Loan Master"
                  }}
                />
              ),
              children: <LoanMaster />,
              componentCode: "PAY_SET_LON"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Holiday Master"
                  }}
                />
              ),
              children: <HolidayMaster />,
              componentCode: "PAY_SET_HOL_MTR"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Overtime Groups"
                  }}
                />
              ),
              children: <OvertimeGroups />,
              componentCode: "PAY_SET_OVR_TIM"
            }
          ]}
          renderClass="payrollSettingsSection"
        />
      </div>
    );
  }
}

// function ChildrenItem({ children }) {
//   return <div className="payroll-settings-section">{children}</div>;
// }

export default PayrollSettings;
