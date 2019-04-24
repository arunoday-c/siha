import React, { PureComponent } from "react";
import PatientForm from "./PatientForm/PatientForm.js";
import OtherInfo from "./OtherInfo/OtherInfo.js";
import AlgaehLabel from "../../Wrapper/label.js";
import "./PatientDetails.css";
import { SetBulkState } from "../../../utils/GlobalFunctions";
import MyContext from "../../../utils/MyContext.js";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
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
              <div className="ucafEditCntr">
                <div className="row">
                  <div className="col-7">
                    <div className="receptionNurse">
                      <div className="row">
                        <div className="col-12">
                          <h5>
                            To be completed & ID verified by the
                            reception/nurse:
                          </h5>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-6   form-group" }}
                          label={{
                            forceLabel: "Provider Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6   form-group" }}
                          label={{
                            forceLabel: "Insurance Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "TPA Company Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Patient File Number",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Department",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col-4 form-group" }}
                          label={{ forceLabel: "Date of Visit", isImp: false }}
                          textBox={{
                            className: "txt-fld",
                            name: ""
                          }}
                          maxDate={new Date()}
                          events={{}}
                        />
                        <div
                          className="col-6 customRadio"
                          style={{ paddingTop: 24, borderBottom: "none" }}
                        >
                          <label className="radio inline">
                            <input type="radio" name="relationType" />
                            <span>Single</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="relationType" />
                            <span>Marred</span>
                          </label>
                          <label className="radio inline">
                            <input type="radio" name="relationType" />
                            <span>Plan Type</span>
                          </label>
                        </div>
                        <div className="col-12 customCheckbox">
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>New Visit</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Follow Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Refill</span>
                          </label>{" "}
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Walk In</span>
                          </label>{" "}
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Referral</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="IDCardUcaf">
                      <div className="row">
                        <div className="col-12">
                          <h5>Print/Fill in clear letters or Emboss Card:</h5>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Insured Name",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "ID. Card No.",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Sex",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Age",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Class",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Policy Holder",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Policy No.",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col-6" }}
                          label={{ forceLabel: "Expiry Date", isImp: false }}
                          textBox={{
                            className: "txt-fld",
                            name: ""
                          }}
                          maxDate={new Date()}
                          events={{}}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Approval",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12">
                          <h5>To be completed by the Attending Physician:</h5>
                        </div>
                        <div className="col-4 customCheckbox">
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Inpatient</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Outpatient</span>
                          </label>
                        </div>
                        <div className="col-8 customCheckbox">
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Emergency Case</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Level 1</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Level 2</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Level 3</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "BP",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Pulse",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "BP (bpm)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Temp (C)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Weight (kg)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Height (cm)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "R.R",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Duration of Illness (Days)",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Chief Complaints and Main Symptoms",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Significant Signs",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Other Conditions",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-12 form-group" }}
                          label={{
                            forceLabel: "Diagnosis",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 1",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 2",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 3",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />{" "}
                        <AlagehFormGroup
                          div={{ className: "col-3 form-group" }}
                          label={{
                            forceLabel: "Principal Code 4",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-12">
                    <div className="attendingPhysician">
                      <div className="row">
                        <div className="col-12">
                          <h5>Please tick () where appropriate</h5>
                        </div>

                        <div className="col-9 customCheckbox">
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Chronic</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Congential</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>RTA</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Work Related</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Vaccination</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Check-Up</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Psychiatric</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Infertility</span>
                          </label>
                          <label className="checkbox inline">
                            <input type="checkbox" name="relationType" />
                            <span>Pregnancy</span>
                          </label>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col form-group" }}
                          label={{
                            forceLabel: "Indicate LMP",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <div className="col-12">
                          <h5>
                            Suggestive line(s) of management: Kindly, enumerate
                            the recommended investigation, and/or procedures{" "}
                            <b>For outpatient approvals only:</b>
                          </h5>
                        </div>

                        <div className="col-12" id="EnterGridIdHere_Cntr">
                          <AlgaehDataGrid
                            id="EnterGridIdHere"
                            datavalidate="EnterGridIdHere"
                            columns={[
                              {
                                fieldName: "Column_1",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Column 1" }}
                                  />
                                )
                              },
                              {
                                fieldName: "Column_2",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Column 2" }}
                                  />
                                )
                              }
                            ]}
                            keyId=""
                            dataSource={{ data: [] }}
                            isEditable={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{}}
                            others={{}}
                          />
                        </div>

                        <div className="col-12">
                          <h5>
                            Providers Approval/Coding staff must review/code the
                            recommended services(s) and allocate cost and
                            complete the following:
                          </h5>
                        </div>

                        <div className="col-12" id="EnterGridIdHere_Cntr">
                          <AlgaehDataGrid
                            id="EnterGridIdHere"
                            datavalidate="EnterGridIdHere"
                            columns={[
                              {
                                fieldName: "Column_1",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Column 1" }}
                                  />
                                )
                              },
                              {
                                fieldName: "Column_2",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Column 2" }}
                                  />
                                )
                              }
                            ]}
                            keyId=""
                            dataSource={{ data: [] }}
                            isEditable={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{}}
                            others={{}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
