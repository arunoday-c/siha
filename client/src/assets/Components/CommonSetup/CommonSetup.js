import React, { Component } from "react";
import "./common_setup.css";
import "../../index.css";
import PatientType from "./PatientType/PatientType.js";
import AccidentType from "./AccidentType/AccidentType.js";
import VisaType from "./VisaType/VisaType.js";
import IDType from "./IDType/IDType";
import VisitType from "./VisitType/VisitType";
import EquipmentType from "./EquipmentType/EquipmentType";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class CommonSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "VisitType", sidBarOpen: true };
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

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen
    });
  }

  render() {
    return (
      <div className="common_setup">
        <BreadCrumb
          title="Common Setup"
          screenName="Master Setup"
          HideHalfbread={false}
        />
        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              algaehtabs={"VisitType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "visit_type"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"VisaType"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "visa_type"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"IDType"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "identification_type"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"PatientType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "patient_type"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"AccidentType"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "accident_type"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              algaehtabs={"EquipmentType"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "equipment_type"
                  }}
                />
              }
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
