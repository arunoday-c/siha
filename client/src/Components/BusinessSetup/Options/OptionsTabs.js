import "./Numbering/numbering.css";
import React, { Component } from "react";
import "../business_setup.css";
import "../../../styles/site.css";
import Transaction from "./Transaction/Transaction.js";
// import Numbering from "./Numbering/Numbering.js";

class OptionsTabs extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "Transaction" };
  }

  openTab(e) {
    var element = document.querySelectorAll("[optionstabs]");
    for (var i = 0; i < element.length; i++) {
      element[i].classList.remove("active");
    }
    e.target.classList.add("active");
    var specified = e.target.attributes["optionstabs"].value;
    this.setState({
      pageDisplay: specified
    });
  }

  render() {
    return (
      <div className="business_setup">
        <br />

        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              optionstabs={"Transaction"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              TRANSACTION
            </li>
            <li
              optionstabs={"Numbering"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              NUMBERING
            </li>
            <li
              optionstabs={"Holiday"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              LABEL SETUP
            </li>
            <li
              optionstabs={"Shift"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              EPISODE CREATION
            </li>
            <li
              optionstabs={"Counter"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              OPTION
            </li>

            <li
              optionstabs={"Counter"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              QUEUE OPTION
            </li>
          </ul>
        </div>
        <div className="business-section">
          {this.state.pageDisplay === "Transaction" ? <Transaction /> : null}
        </div>
      </div>
    );
  }
}

export default OptionsTabs;
