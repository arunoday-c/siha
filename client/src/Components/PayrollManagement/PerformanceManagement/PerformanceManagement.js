import React, { Component } from "react";
import "./perf_mgmt.css";
import PerformanceReview from "./PerformanceReview/PerformanceReview";
import SalaryApprisal from "./SalaryApprisal/SalaryApprisal";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";

class PerformanceManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "SalaryApprisal"
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
      <div className="perf_mgmt">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"SalaryApprisal"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "SALARY APPRAISAL"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"PerformanceReview"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Performance Review"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="payroll-setion">
          {this.state.pageDisplay === "PerformanceReview" ? (
            <PerformanceReview />
          ) : this.state.pageDisplay === "SalaryApprisal" ? (
            <SalaryApprisal />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PerformanceManagement;
