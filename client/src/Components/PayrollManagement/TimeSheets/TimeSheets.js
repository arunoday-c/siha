import React, { Component } from "react";
import "./time_Sheets.css";
import EarningsDeductions from "./EarningsDeductions/EarningsDeductions";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class TimeSheets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EarningsDeductions"
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
                algaehtabs={"AppointmentStatus"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Earnings & Deductions"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "EarningsDeductions" ? (
            <EarningsDeductions />
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

export default TimeSheets;
