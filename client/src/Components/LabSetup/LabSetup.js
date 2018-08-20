import React, { Component } from "react";
import "./LabSetup.css";
import "../../index.css";
import LabSection from "./LabSection/LabSection";
import LabContainer from "./LabContainer/LabContainer";
import LabSpecimen from "./LabSpecimen/LabSpecimen";
import Equipment from "./Equipment/Equipment";
import Analyte from "./Analyte/Analyte";

import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";

class LabSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "LabSection", sidBarOpen: true };
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
      <div className="investigation_setup">
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ fieldName: "investigation_setup", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    fieldName: "lab_settings",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ fieldName: "investigation_setup", align: "ltr" }}
                />
              )
            }
          ]}
          //screenName="Master Setup"
          //   HideHalfbread={false}
        />
        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              algaehtabs={"LabSection"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "lab_section"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"LabContainer"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "lab_container"
                  }}
                />
              }
            </li>

            <li
              algaehtabs={"LabSpecimen"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "lab_specimen"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              algaehtabs={"Analyte"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "lab_analyte"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"Equipment"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "lab_equipment"
                  }}
                />
              }
            </li>
          </ul>
        </div>

        <div className="common-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "LabSection" ? (
            <LabSection />
          ) : this.state.pageDisplay === "LabContainer" ? (
            <LabContainer />
          ) : this.state.pageDisplay === "LabSpecimen" ? (
            <LabSpecimen />
          ) : this.state.pageDisplay === "Analyte" ? (
            <Analyte />
          ) : this.state.pageDisplay === "Equipment" ? (
            <Equipment />
          ) : null}
        </div>
      </div>
    );
  }
}

export default LabSetup;
