import React, { PureComponent } from "react";
import PatientForm from "./PatientForm/PatientForm.js";
import OtherInfo from "./OtherInfo/OtherInfo.js";
import AlgaehLabel from "../../Wrapper/label.js";
import "./PatientDetails.css";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import MyContext from "../../../utils/MyContext.js";
import Enumerable from "linq";

export default class PatientDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      actionPatientDesign: true,
      actionInformationDesign: true
    };
  }

  openTab(dataValue, context) {
    const data = SetBulkState({ state: undefined });

    if (context !== undefined) {
      context.updateState({ ...data });
    }
    if (dataValue === "patient-details") {
      this.setState({
        actionPatientDesign: true,
        actionInformationDesign: true
      });
    } else if (dataValue === "other-information") {
      this.setState({
        actionInformationDesign: false,
        actionPatientDesign: false
      });
    }
  }

  render() {
    let patientSelect = this.state.actionPatientDesign ? "active" : "";
    let informationSelect = this.state.actionInformationDesign ? "" : "active";
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-patient-details margin-bottom-15">
              <div className="tab-container toggle-section">
                <ul className="nav">
                  <li
                    className={"nav-item tab-button " + patientSelect}
                    id="PatientForm"
                    onClick={this.openTab.bind(
                      this,
                      "patient-details",
                      context
                    )}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          fieldName: "tab_patdtls"
                        }}
                      />
                    }
                  </li>
                  <li
                    className={"nav-item tab-button " + informationSelect}
                    id="OtherInfo"
                    onClick={this.openTab.bind(
                      this,
                      "other-information",
                      context
                    )}
                  >
                    {
                      <AlgaehLabel
                        label={{
                          fieldName: "tab_othinf"
                        }}
                      />
                    }
                  </li>
                </ul>
              </div>
              <div className="patient-section">
                {this.state.actionPatientDesign ? (
                  <PatientForm
                    PatRegIOputs={this.props.PatRegIOputs}
                    clearData={this.props.clearData}
                  />
                ) : null}
                {this.state.actionInformationDesign ? null : (
                  <OtherInfo PatRegIOputs={this.props.PatRegIOputs} />
                )}
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}
