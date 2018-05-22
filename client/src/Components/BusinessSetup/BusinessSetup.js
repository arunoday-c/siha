import React, { Component } from "react";
import "./business_setup.css";
import "../../styles/site.css";
import DeptMaster from "./DeptMaster/DeptMaster.js";
import HolidayList from "./HolidayList/HolidayList.js";
import Header from "../../Components/common/Header/Header.js";
import OptionsTabs from "./Options/OptionsTabs.js";
import Counter from "./Counter/Counter.js";
import Shift from "./Shift/Shift.js";

class BusinessSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "DeptMaster" };
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

  render() {
    return (
      <div className="business_setup">
        <Header title="Business Setup" height={this.state.widthImg} />

        <br />

        <div className="tab-container toggle-section">
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
          {this.state.pageDisplay == "DeptMaster" ? (
            <DeptMaster />
          ) : this.state.pageDisplay == "OptionsTabs" ? (
            <OptionsTabs />
          ) : this.state.pageDisplay == "Holiday" ? (
            <HolidayList />
          ) : this.state.pageDisplay == "Counter" ? (
            <Counter />
          ) : this.state.pageDisplay == "Shift" ? (
            <Shift />
          ) : null}
        </div>
      </div>
    );
  }
}

export default BusinessSetup;
