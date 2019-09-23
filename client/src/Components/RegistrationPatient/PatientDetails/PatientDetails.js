import React, { PureComponent } from "react";
import PatientForm from "./PatientForm/PatientForm.js";
import OtherInfo from "./OtherInfo/OtherInfo.js";
import AlgaehLabel from "../../Wrapper/label.js";
import "./PatientDetails.scss";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import MyContext from "../../../utils/MyContext.js";

// import {
//   AlgaehDateHandler,
//   AlagehFormGroup,
//   AlgaehDataGrid,
//   AlagehAutoComplete
// } from "../../Wrapper/algaehWrapper";
import AlgaehSecurity from "../../Wrapper/algehSecurity";
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
            <div className="hptl-phase1-patient-details margin-bottom-15 margin-top-15">
              <div className="col-12 patIDCard">
                <div className="row cardHeader">
                  <div className="col-4">Hospital Logo</div>
                  <div className="col-8">
                    <h5>Hospital Name</h5>
                    <p>Address</p>
                  </div>
                </div>
                <div className="row cardContent">
                  <div className="col-8">
                    <h4>Brinna Dave</h4>
                    <p>
                      Patient Id: <span>PAT-074563-234</span>
                    </p>
                    <p>
                      DOB: <span>10/12/1988</span>
                    </p>
                    <p>
                      Gender: <span>F</span>
                    </p>
                    <p>
                      Issued Date: <span>05/08/2017</span>
                    </p>
                    <p>
                      <span className="bardcodeCntr" />
                    </p>
                  </div>
                  <div className="col-4">
                    <img src="" alt="patient_id" />
                  </div>
                </div>

                <div className="row cardFooter">
                  <p>
                    If lost and found please return to above mention address.
                  </p>
                </div>
              </div>

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
                    ref={patientForm => {
                      this.patientForm = patientForm;
                    }}
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
                    ref={otherInFormation => {
                      this.otherInFormation = otherInFormation;
                    }}
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
                  <AlgaehSecurity
                    component_code="FD_PR_PAT_DETAIL"
                    module_code="FTDSK"
                    screen_code="FD0002"
                    elementLink={{
                      that: this,
                      elements: [
                        {
                          ref: "patientForm",
                          event: () => {
                            this.setState(
                              { actionPatientDesign: false },
                              () => {
                                this.otherInFormation.click();
                                this.patientForm.classList.add("d-none");
                              }
                            );
                          }
                        }
                      ]
                    }}
                  >
                    <PatientForm
                      PatRegIOputs={this.props.PatRegIOputs}
                      clearData={this.props.clearData}
                    />
                  </AlgaehSecurity>
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
