import React, { Component } from "react";
import "./hr_settings.css";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import EmployeeGroups from "./EmployeeGroups/EmployeeGroups";
import EmployeeDesignations from "./EmployeeDesignations/EmployeeDesignations";
import OvertimeGroups from "./OvertimeGroups/OvertimeGroups";
import AuthorizationSetup from "./AuthorizationSetup/AuthorizationSetup";
import DocumentMaster from "./DocumentMaster/DocumentMaster";

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
                algaehtabs={"OvertimeGroups"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Overtime Groups"
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
            </ul>
          </div>
        </div>
        <div className="hr-section">
          {this.state.pageDisplay === "EmployeeGroups" ? (
            <EmployeeGroups />
          ) : this.state.pageDisplay === "EmployeeDesignations" ? (
            <EmployeeDesignations />
          ) : this.state.pageDisplay === "OvertimeGroups" ? (
            <OvertimeGroups />
          ) : this.state.pageDisplay === "AuthorizationSetup" ? (
            <AuthorizationSetup />
          ) : this.state.pageDisplay === "DocMaster" ? (
            <DocumentMaster />
          ) : null}
        </div>
      </div>
    );
  }
}

export default HRSettings;
