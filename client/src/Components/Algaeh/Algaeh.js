import React, { Component } from "react";
import Modules from "./Modules/Modules";
import Components from "./Components/Components";
import Screens from "./Screens/Screens";
import ScreenElements from "./ScreenElements/ScreenElements";
import Formula from "./Formula/Formula";
import LisConfig from "./LisConfig/LisConfig";

import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import "./algaeh.scss";

class Algaeh extends Component {
  constructor(props) {
    super(props);
    this.state = { pageDisplay: "Modules" };
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
      <div className="algaeh">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"Modules"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Modules"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Screens"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Screens"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Components"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Components"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ScreenElements"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Screen Elements"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Formula"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Formula"
                    }}
                  />
                }
              </li>{" "}
              <li
                algaehtabs={"LisConfig"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "LIS Configuration"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>

        <div className="">
          {this.state.pageDisplay === "Modules" ? (
            <Modules />
          ) : this.state.pageDisplay === "Screens" ? (
            <Screens />
          ) : this.state.pageDisplay === "Components" ? (
            <Components />
          ) : this.state.pageDisplay === "ScreenElements" ? (
            <ScreenElements />
          ) : this.state.pageDisplay === "Formula" ? (
            <Formula />
          ) : this.state.pageDisplay === "LisConfig" ? (
            <LisConfig />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Algaeh;
