import React, { Component } from "react";
import "./OrgChart.css";
import EmployeeView from "./EmployeeView/EmployeeView";
import DepartmentView from "./DepartmentView/DepartmentView";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
export default class OrgChart extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "DepartmentView" };
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
      <div className="orgChartUI">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"DepartmentView"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Department View"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"EmployeeView"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee View"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="orgChart-section">
          {this.state.pageDisplay === "EmployeeView" ? (
            <EmployeeView />
          ) : this.state.pageDisplay === "DepartmentView" ? (
            <DepartmentView />
          ) : null}
        </div>
      </div>
    );
  }
}
