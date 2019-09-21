import React, { Component } from "react";
import "./hr_settings.scss";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import EmployeeGroups from "./EmployeeGroups/EmployeeGroups";
import EmployeeDesignations from "./EmployeeDesignations/EmployeeDesignations";
import AuthorizationSetup from "./AuthorizationSetup/AuthorizationSetup";
import DocumentMaster from "./DocumentMaster/DocumentMaster";
import ProjectMaster from "./ProjectMaster/ProjectMaster";

class HRSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "EmployeeGroups"
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
      <div className="hr_settings">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"EmployeeGroups"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Groups"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"EmployeeDesignations"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Designations"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"DocMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Document Master"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AuthorizationSetup"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Authorization Setup"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"ProjectMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Project Master"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="hr-section">
          {this.state.pageDisplay === "EmployeeGroups" ? (
            <EmployeeGroups />
          ) : this.state.pageDisplay === "EmployeeDesignations" ? (
            <EmployeeDesignations />
          ) : this.state.pageDisplay === "AuthorizationSetup" ? (
            <AuthorizationSetup />
          ) : this.state.pageDisplay === "DocMaster" ? (
            <DocumentMaster />
          ) : this.state.pageDisplay === "ProjectMaster" ? (
            <ProjectMaster />
          ) : null}
        </div>
      </div>
    );
  }
}

export default HRSettings;
