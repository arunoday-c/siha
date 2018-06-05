import React, { Component } from "react";
import "./common_setup.css";
import PatientType from "./PatientType/PatientType.js";
import AccidentType from "./AccidentType/AccidentType.js";
import VisaType from "./VisaType/VisaType.js";
import IDType from "./IDType/IDType";
import VisitType from "./VisitType/VisitType";
import Header from "../common/Header/Header";
import EquipmentType from "./EquipmentType/EquipmentType";
import SideMenuBar from "../common/SideMenuBar/SideMenuBar.js";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";

class CommonSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "PatientType", sidBarOpen: true };
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
    debugger;
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    let margin = this.state.sidBarOpen ? "200px" : "";
    return (
      <div className="common_setup">
        {/* {this.state.sidBarOpen === true ? (
          <div>
            <SideMenuBar />
          </div>
        ) : null}
        <div style={{ marginLeft: margin }}>
          <Header
            title="Common Setup"
            SideMenuBarOpen={this.SideMenuBarOpen.bind(this)}
            height={this.state.widthImg}
          /> */}
        <BreadCrumb
          title="Common Setup"
          screenName="Master Setup"
          HideHalfbread={false}
        />

        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              alagehtabs={"PatientType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              PATIENT TYPE
            </li>
            <li
              alagehtabs={"AccidentType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              ACCIDENT TYPE
            </li>
            <li
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              alagehtabs={"EquipmentType"}
              onClick={this.openTab.bind(this)}
            >
              EQUIPMENT TYPE
            </li>
            <li
              alagehtabs={"VisitType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              VISIT TYPE
            </li>
            <li
              style={{ marginRight: 2 }}
              alagehtabs={"VisaType"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              VISA TYPE
            </li>
            <li
              style={{ marginRight: 2 }}
              alagehtabs={"IDType"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              IDENTIFICATION TYPE
            </li>
          </ul>
        </div>

        <div className="common-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "PatientType" ? (
            <PatientType />
          ) : this.state.pageDisplay === "AccidentType" ? (
            <AccidentType />
          ) : this.state.pageDisplay === "VisaType" ? (
            <VisaType />
          ) : this.state.pageDisplay === "IDType" ? (
            <IDType />
          ) : this.state.pageDisplay === "VisitType" ? (
            <VisitType />
          ) : this.state.pageDisplay === "EquipmentType" ? (
            <EquipmentType />
          ) : null}
        </div>        
      </div>
    );
  }
}

export default CommonSetup;
