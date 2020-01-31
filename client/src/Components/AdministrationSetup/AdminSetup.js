import React, { Component } from "react";
import "./admin_setup.scss";
import LoginUsers from "./LoginUsers/LoginUsers";
import Roles from "./Roles/Roles";
import Groups from "./Groups/Groups";
import ScreenAssignment from "./ScreenAssignment/ScreenAssignment";
import AuditLog from "./AuditLog/AuditLog";
import ComponentElementAssignment from "./ComponentElementAssignment/ComponentElementAssignment";
// import ApiConfig from "./APIConfig";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehTabs } from "algaeh-react-components";
class AdminSetup extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "Groups" };
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
      <div className="admin_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"Groups"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "group"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Roles"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "role"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"LoginUsers"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "login_users"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ScreenAssignment"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "screen_assignment"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AuditLog"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Audit Log"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>
        <div className="admin-section">
          {this.state.pageDisplay === "LoginUsers" ? (
            <LoginUsers />
          ) : this.state.pageDisplay === "Groups" ? (
            <Groups />
          ) : this.state.pageDisplay === "Roles" ? (
            <Roles />
          ) : this.state.pageDisplay === "ScreenAssignment" ? (
            <ScreenAssignment />
          ) : this.state.pageDisplay === "AuditLog" ? (
            <AuditLog />
          ) : this.state.pageDisplay === "ComponentElementAssignment" ? (
            <ComponentElementAssignment />
          ) : //  this.state.pageDisplay === "apiconfig" ? (
          //   <ApiConfig />
          // ) :
          null}
        </div>
      </div>
    );
  }
}

export default AdminSetup;
