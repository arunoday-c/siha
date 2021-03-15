import React, { Component } from "react";
import "./medical_wb_setup.scss";
import "../../index.scss";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import PhysicalExamination from "./PhysicalExamination/PhysicalExamination";
import ReviewofSystems from "./ReviewofSystems/ReviewofSystems";
import VitalsMaster from "./VitalsMaster/VitalsMaster";
import Allergies from "./Allergies/Allergies";
import ICDMaster from "./ICDMaster/ICDMaster";
import NphiesMaster from "./NphiesMaster/NphiesMaster";
import ReferringMaster from "./ReferringInstituteMaster/RefferingMaster";

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
      pageDisplay: specified,
    });
  }

  SideMenuBarOpen(sidOpen) {
    this.setState({
      sidBarOpen: sidOpen,
    });
  }

  render() {
    return (
      <div className="medical_wb_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              <li
                algaehtabs={"VitalsMaster"}
                className={"nav-item tab-button active"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "vitals_master",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"PhysicalExaminationMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "physical_examination",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"Allergies"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Allergies",
                    }}
                  />
                }
              </li>

              <li
                algaehtabs={"ICDMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "ICD Master",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"NphiesMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "NPHIES master",
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"ReferringMaster"}
                className={"nav-item tab-button"}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Referring Institution master",
                    }}
                  />
                }
              </li>

              {/* <li
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
              </li> */}
            </ul>
          </div>
        </div>
        <div className="medicalSetupSection">
          {this.state.pageDisplay === "PhysicalExaminationMaster" ? (
            <PhysicalExamination />
          ) : this.state.pageDisplay === "ReviewofSystems" ? (
            <ReviewofSystems />
          ) : this.state.pageDisplay === "VitalsMaster" ? (
            <VitalsMaster />
          ) : this.state.pageDisplay === "Allergies" ? (
            <Allergies />
          ) : this.state.pageDisplay === "ICDMaster" ? (
            <ICDMaster />
          ) : this.state.pageDisplay === "NphiesMaster" ? (
            <NphiesMaster />
          ) : this.state.pageDisplay === "ReferringMaster" ? (
            <ReferringMaster />
          ) : null}
        </div>
      </div>
    );
  }
}

export default MedicalWorkbenchSetup;
