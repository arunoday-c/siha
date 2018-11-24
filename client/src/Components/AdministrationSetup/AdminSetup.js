import React, { Component } from "react";
import "./admin_setup.css";
import LoginUsers from "./LoginUsers/LoginUsers";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class AdminSetup extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "LoginUsers" };
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
                algaehtabs={"LoginUsers"}
                className={"nav-item tab-button active"}
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
              {/* <li
                algaehtabs={"Speciality"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "speciality"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Category"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "category"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"CategorySpeciality"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "category_speciality_map"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"Shift"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "shift"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Counter"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "counter"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"UserShiftMapping"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "users_shift"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Currency"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "currency"
                    }}
                  />
                }
              </li> */}
            </ul>
          </div>
        </div>
        <div className="admin-section">
          {this.state.pageDisplay === "LoginUsers" ? <LoginUsers /> : null}
        </div>
      </div>
    );
  }
}

export default AdminSetup;
