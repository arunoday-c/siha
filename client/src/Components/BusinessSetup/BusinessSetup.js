import React, { Component } from "react";
import "./business_setup.css";
import "../../styles/site.css";
import "../../index.css";
import DeptMaster from "./DeptMaster/DeptMaster.js";
import HolidayList from "./HolidayList/HolidayList.js";
import OptionsTabs from "./Options/OptionsTabs.js";
import Counter from "./Counter/Counter.js";
import Shift from "./Shift/Shift.js";
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
        <BreadCrumb
          title="Business Setup"
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: "Settings"
            },
            {
              pageName: "Business Setup"
            }
          ]}
        />

        <div className="tab-container toggle-section spacing-push">
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
              algaehtabs={"OptionsTabs"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "options"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Holiday"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "holidays_list"
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
          </ul>
        </div>

        <div className="business-section">
          {this.state.pageDisplay === "DeptMaster" ? (
            <DeptMaster />
          ) : this.state.pageDisplay === "OptionsTabs" ? (
            <OptionsTabs />
          ) : this.state.pageDisplay === "Holiday" ? (
            <HolidayList />
          ) : this.state.pageDisplay === "Counter" ? (
            <Counter />
          ) : this.state.pageDisplay === "Shift" ? (
            <Shift />
          ) : null}
        </div>
      </div>
    );
  }
}

export default BusinessSetup;
