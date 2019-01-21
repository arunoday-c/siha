import React, { Component } from "react";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import AttendanceSettings from "./AttendanceSettings/AttendanceSettings";

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
      <div className="payroll_settings">
        <div className="row">
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
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "AttendanceSettings" ? (
            <AttendanceSettings />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PayrollOptions;
