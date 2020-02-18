import React, { Component } from "react";
import "./ProjectJobCost.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
// import EmployeeProjectRoster from "./EmployeeProjectRoster/EmployeeProjectRoster";
// import NewEmployeeProjectRoster from "./EmployeeProjectRoster/NewEmployeeProjectRoster";
import NewEmployeeProjectRoster from "./EmployeeProjectRoster/Roster";
import ProjectPayroll from "./ProjectPayroll/ProjectPayroll";
import ProjectActivityMgmnt from "./ProjectActivityMgmnt/ProjectActivityMgmnt";

class ProjectJobCost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "NewEmployeeProjectRoster"
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
                algaehtabs={"NewEmployeeProjectRoster"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Roster"
                    }}
                  />
                }
              </li>
              {/* <li
                algaehtabs={"ProjectActivityMgmnt"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Activity Management"
                    }}
                  />
                }
              </li> */}
              <li
                algaehtabs={"ProjectPayroll"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Payroll"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="ProjectJobCostSec">
          {//   this.state.pageDisplay === "EmployeeProjectRoster" ? (
            //   <EmployeeProjectRoster />
            // ) :
            this.state.pageDisplay === "NewEmployeeProjectRoster" ? (
              <NewEmployeeProjectRoster />
            ) : this.state.pageDisplay === "ProjectPayroll" ? (
              <ProjectPayroll />
            ) : this.state.pageDisplay === "ProjectActivityMgmnt" ? (
              <ProjectActivityMgmnt />
            ) : null}
        </div>
      </div>
    );
  }
}

export default ProjectJobCost;
