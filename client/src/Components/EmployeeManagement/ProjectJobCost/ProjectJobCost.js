import React, { Component } from "react";
import "./ProjectJobCost.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import EmployeeProjectRoster from "./EmployeeProjectRoster/EmployeeProjectRoster";
import ProjectMapping from "./ProjectMapping/ProjectMapping";

class ProjectJobCost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EmployeeProjectRoster"
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
      <div className="ProjectJobCost">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"EmployeeProjectRoster"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Project Roster"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ProjectMapping"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Mapping"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="ProjectJobCostSec">
          {this.state.pageDisplay === "EmployeeProjectRoster" ? (
            <EmployeeProjectRoster />
          ) : this.state.pageDisplay === "ProjectMapping" ? (
            <ProjectMapping />
          ) : null}
        </div>
      </div>
    );
  }
}

export default ProjectJobCost;
