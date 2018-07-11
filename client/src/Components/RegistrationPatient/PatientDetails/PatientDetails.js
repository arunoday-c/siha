import React, { PureComponent } from "react";
import PatientForm from "./PatientForm/PatientForm.js";
import OtherInfo from "./OtherInfo/OtherInfo.js";
import AlgaehLabel from "../../Wrapper/label.js";
import "./PatientDetails.css";
var intervalId;

export default class PatientDetails extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      actionPatientDesign: true,
      actionInformationDesign: true
    };
  }

  openTab(dataValue) {
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
  texthandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  patcodehandle(e) {
    this.setState(
      {
        patient_code: e.target.value
      },
      () => {
        clearInterval(intervalId);
        intervalId = setInterval(() => {
          this.getSinglePatientDetails(e);
          clearInterval(intervalId);
        }, 500);
      }
    );
  }

  render() {
    let patientSelect = this.state.actionPatientDesign ? "active" : "";
    let informationSelect = this.state.actionInformationDesign ? "" : "active";
    return (
      <div className="hptl-phase1-patient-details">
        <div className="tab-container toggle-section">
          <ul className="nav">
            <li
              className={"nav-item tab-button " + patientSelect}
              id="PatientForm"
              onClick={this.openTab.bind(this, "patient-details")}
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
              onClick={this.openTab.bind(this, "other-information")}
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
    );
  }
}
