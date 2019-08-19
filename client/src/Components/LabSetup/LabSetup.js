import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabSetup.css";
import "../../index.css";
// import LabSection from "./LabSection/LabSection";
import LabContainer from "./LabContainer/LabContainer";
import LabSpecimen from "./LabSpecimen/LabSpecimen";
// import Equipment from "./Equipment/Equipment";
import Analyte from "./Analyte/Analyte";
import TestCategory from "./TestCategory/TestCategory";
import AntiBioMaster from "./AntiBioMaster/AntiBioMaster";
import MicroGroupType from "./MicroGroupType/MicroGroupType";

// import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import { AlgaehLabel } from "../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../actions/algaehActions";

class LabSetup extends Component {
  constructor(props) {
    super(props);

    this.state = { pageDisplay: "LabContainer", sidBarOpen: true };
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

  componentDidMount() {
    if (
      this.props.userdrtails === undefined ||
      this.props.userdrtails.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "USER_DETAILS_GET_DATA",
          mappingName: "userdrtails"
        }
      });
    }
  }

  render() {
    return (
      <div className="hims_lab_setup">
        <div className="row">
          <div className="tabMaster toggle-section">
            <ul className="nav">
              {/*<li
                algaehtabs={"LabSection"}
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
              </li>*/}
              <li
                algaehtabs={"LabContainer"}
                className={"nav-item tab-button active"}
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
              {/* <li
              algaehtabs={"Equipment"}

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
            </li> */}

              <li
                algaehtabs={"TestCategory"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      fieldName: "test_category"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"AntiBioMaster"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Antibiotic Master"
                    }}
                  />
                }
              </li>
              <li
                algaehtabs={"MicroGroupType"}
                className={"nav-item tab-button "}
                onClick={this.openTab.bind(this)}
              >
                {
                  <AlgaehLabel
                    label={{
                      forceLabel: "Organism - Type and Group"
                    }}
                  />
                }
              </li>
            </ul>
          </div>
        </div>

        <div className="common-section">
          {/*  {<this.state.pageDisplay />} */}

          {this.state.pageDisplay === "LabContainer" ? (
            <LabContainer />
          ) : this.state.pageDisplay === "LabSpecimen" ? (
            <LabSpecimen />
          ) : this.state.pageDisplay === "Analyte" ? (
            <Analyte />
          ) : this.state.pageDisplay === "TestCategory" ? (
            <TestCategory />
          ) : this.state.pageDisplay === "AntiBioMaster" ? (
            <AntiBioMaster />
          ) : this.state.pageDisplay === "MicroGroupType" ? (
            <MicroGroupType />
          ) : null}

          {/* : this.state.pageDisplay === "Equipment" ? (
            <Equipment />
          ) */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userdrtails: state.userdrtails
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LabSetup)
);
