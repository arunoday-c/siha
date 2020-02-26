import React, { Component } from "react";
import "./payrollOption.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import AttendanceSettings from "./AttendanceSettings/AttendanceSettings";
import EndServiceOption from "./EndServiceOption/EndServiceOption";
import LeaveSalarySetup from "./LeaveSalarySetup/LeaveSalarySetup";
import { AlgaehTabs } from "algaeh-react-components";

class PayrollOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "AttendanceSettings"
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
      <div className="payroll_options">
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Attendance Settings"
                  }}
                />
              ),
              children: <AttendanceSettings />,
              componentCode: "PAY_ATT_SET"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "End of Service"
                  }}
                />
              ),
              children: <EndServiceOption />,
              componentCode: "PAY_EOS_SER&D_MTR"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Annual Leave Salary Setup"
                  }}
                />
              ),
              children: <LeaveSalarySetup />,
              componentCode: "PAY_ANN_LEV_SAL_SET"
            }
          ]}
          renderClass="payrollOptionSection"
        />
        {/* <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"AttendanceSettings"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Attendance Settings"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"EndServiceOption"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "End of Service"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LeaveSalarySetup"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Annual Leave Salary Setup"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        {this.state.pageDisplay === "AttendanceSettings" ? (
          <AttendanceSettings />
        ) : this.state.pageDisplay === "EndServiceOption" ? (
          <EndServiceOption />
        ) : this.state.pageDisplay === "LeaveSalarySetup" ? (
          <LeaveSalarySetup />
        ) : null} */}
      </div>
    );
  }
}

// function ChildrenItem({ children }) {
//   return <div className="payroll-options-section">{children}</div>;
// }

export default PayrollOptions;
