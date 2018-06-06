import React, { Component } from "react";
import "./business_setup.css";
import "../../styles/site.css";
import "../../index.css";
import DeptMaster from "./DeptMaster/DeptMaster.js";
import HolidayList from "./HolidayList/HolidayList.js";
import Header from "../../Components/common/Header/Header.js";
import OptionsTabs from "./Options/OptionsTabs.js";
import Counter from "./Counter/Counter.js";
import Shift from "./Shift/Shift.js";
import SideMenuBar from "../common/SideMenuBar/SideMenuBar.js";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "DeptMaster", sidBarOpen: true };
  }

  openTab(e) {
    var element = document.querySelectorAll("[alagehtabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.target.classList.add("active");
    var specified = e.target.attributes["alagehtabs"].value;
    this.setState({
      pageDisplay: specified
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    let margin = this.state.sidBarOpen ? "0" : "";
    return (
      <div className="business_setup">
        <BreadCrumb
          title="Business Setup"
          screenName="Master Setup"
          HideHalfbread={false}
        />

        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              alagehtabs={"DeptMaster"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              DEPARTMENTS
            </li>
            <li
              alagehtabs={"OptionsTabs"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              OPTIONS
            </li>
            <li
              alagehtabs={"Holiday"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              HOLIDAYS LIST
            </li>
            <li
              alagehtabs={"Shift"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              SHIFT
            </li>
            <li
              alagehtabs={"Counter"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              COUNTER
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
