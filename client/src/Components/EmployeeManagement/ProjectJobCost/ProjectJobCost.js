import React, { Component } from "react";
import "./ProjectJobCost.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import NewEmployeeProjectRoster from "./EmployeeProjectRoster/Roster";
import ProjectPayroll from "./ProjectPayroll/ProjectPayroll";
import ProjectActivityMgmnt from "./ProjectActivityMgmnt/ProjectActivityMgmnt";
import { AlgaehTabs } from "algaeh-react-components";

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
        <AlgaehTabs
          removeCommonSection={true}
          content={[
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Project Roster"
                  }}
                />
              ),
              children: <NewEmployeeProjectRoster />,
              componentCode: "PRJ_PRJ_RST"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Project Payroll"
                  }}
                />
              ),
              children: <ProjectPayroll />,
              componentCode: "PRJ_PRJ_PAY"
            },
            {
              title: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Project Activity Management"
                  }}
                />
              ),
              children: <ProjectActivityMgmnt />,
              componentCode: "PRJ_ACT_MGT"
            }
          ]}
          renderClass="ProjectJobCostSec"
        />
      </div>
    );
  }
}

export default ProjectJobCost;
