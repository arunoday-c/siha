import React, { Component } from "react";
import "./medical_wb_setup.css";
import "../../index.css";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import ReviewofSystems from "./ReviewofSystems/ReviewofSystems";
import VitalsMaster from "./VitalsMaster/VitalsMaster";

class MedicalWorkbenchSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "VitalsMaster", sidBarOpen: true };
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
      <div className="medical_wb_setup">
        <BreadCrumb
          title="Medical Workbench Setup"
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: "Settings"
            },
            {
              pageName: "Medical Workbench Setup"
            }
          ]}
          //screenName="Master Setup"
          //   HideHalfbread={false}
        />

        <div className="tab-container toggle-section spacing-push">
          <ul className="nav">
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"VitalsMaster"}
              className={"nav-item tab-button active"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "vitals_master"
                  }}
                />
              }
            </li>
            <li
              algaehtabs={"PhysicalExaminationMaster"}
              style={{ marginRight: 2 }}
              className={"nav-item tab-button"}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "physical_examination"
                  }}
                />
              }
            </li>
            <li
              style={{ marginRight: 2 }}
              algaehtabs={"ReviewofSystems"}
              className={"nav-item tab-button "}
              onClick={this.openTab.bind(this)}
            >
              {
                <AlgaehLabel
                  label={{
                    fieldName: "review_of_systems"
                  }}
                />
              }
            </li>
          </ul>
        </div>
        <div className="wb-setup-section">
          {this.state.pageDisplay === "PhysicalExaminationMaster" ? (
            <PhysicalExamination />
          ) : this.state.pageDisplay === "ReviewofSystems" ? (
            <ReviewofSystems />
          ) : this.state.pageDisplay === "VitalsMaster" ? (
            <VitalsMaster />
          ) : null}
        </div>
      </div>
    );
  }
}

export default MedicalWorkbenchSetup;
