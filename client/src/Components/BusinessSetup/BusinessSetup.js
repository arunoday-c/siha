import React, { Component } from "react";
import "./business_setup.css";
import "../../styles/site.css";
import DeptMaster from "./DeptMaster/DeptMaster.js";
import HolidayList from "./HolidayList/HolidayList.js";
import Numbering from "./Numbering/Numbering";
import Transaction from "./Transaction/Transaction";
import Counter from "./Counter/Counter.js";
import Currency from "./Currency/Currency";
import Shift from "./Shift/Shift.js";
import UserShiftMapping from "./UserShiftMapping/UserShiftMapping";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "DeptMaster" };
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
      <div className="business_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"DeptMaster"}
                style={{ marginRight: 2 }}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {/* DEPARTMENTS */}
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "departments"
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"Shift"}
                style={{ marginRight: 2 }}
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
                style={{ marginRight: 2 }}
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
                style={{ marginRight: 2 }}
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
                style={{ marginRight: 2 }}
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
              </li>
            </ul>
          </div>
        </div>
        <div className="business-section">
          {this.state.pageDisplay === "DeptMaster" ? (
            <DeptMaster />
          ) : this.state.pageDisplay === "Holiday" ? (
            <HolidayList />
          ) : this.state.pageDisplay === "Counter" ? (
            <Counter />
          ) : this.state.pageDisplay === "Shift" ? (
            <Shift />
          ) : this.state.pageDisplay === "Transaction" ? (
            <Transaction />
          ) : this.state.pageDisplay === "Numbering" ? (
            <Numbering />
          ) : this.state.pageDisplay === "UserShiftMapping" ? (
            <UserShiftMapping />
          ) : this.state.pageDisplay === "Currency" ? (
            <Currency />
          ) : null}
        </div>
      </div>
    );
  }
}

export default BusinessSetup;
