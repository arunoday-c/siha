import React, { Component } from "react";
import "./medical_wb_setup.scss";
import "../../index.scss";
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
                      fieldName: "vitals_master"
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
                      fieldName: "physical_examination"
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
          ) : null}
        </div>
      </div>
    );
  }
}

export default MedicalWorkbenchSetup;
