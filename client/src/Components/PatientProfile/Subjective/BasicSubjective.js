import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./subjective.css";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../Wrapper/algaehWrapper";
import Vitals from "../Vitals/Vitals";
import LabResults from "../Assessment/LabResult/LabResult";
import RadResults from "../Assessment/RadResult/RadResult";
import Enumerable from "linq";
import { AlgaehActions } from "../../../actions/algaehActions";
import OrderedList from "../Assessment/OrderedList/OrderedList";
import Plan from "../Plan/Plan";
import { algaehApiCall, swalMessage } from "../../../utils/algaehApiCall";
import SubjectiveHandler from "./SubjectiveHandler";
import PatientHistory from "../PatientHistory/PatientHistory";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import Allergies from "../Allergies/Allergies";

class BasicSubjective extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Orders",
      openMedication: false,
      openMedicaldata: false,
      openDiet: false,
      openVital: false,
      openAlergy: false,
      chief_complaint: null,

      duration: null,

      interval: null,
      onset_date: null,
      pain: null,
      severity: null,
      chronic: null,
      hims_f_episode_chief_complaint_id: null
    };
    this.getMasters();
    this.getPatientEncounterDetails();

    SubjectiveHandler().getPatientChiefComplaints(this);
  }

  getMasters() {
    if (
      this.props.assdeptanddoctors === undefined ||
      this.props.assdeptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        method: "GET",
        redux: {
          type: "LAB_DEPT_DOCTOR_GET_DATA",
          mappingName: "assdeptanddoctors"
        }
      });
    }

    if (
      this.props.assservices === undefined ||
      this.props.assservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "assservices"
        }
      });
    }
  }

  datehandle(e) {
    debugger;
    SubjectiveHandler().datehandle(this, e);
  }
  ChangeEventHandler(e) {
    SubjectiveHandler().ChangeEventHandler(this, e);
  }

  onchangegridcol(row, from, e) {
    SubjectiveHandler().onchangegridcol(this, row, from, e);
  }

  deleteFinalDiagnosis(row) {
    SubjectiveHandler().deleteFinalDiagnosis(this, row);
  }
  updateDiagnosis(row) {
    SubjectiveHandler().updateDiagnosis(this, row);
  }
  IcdsSearch(diagType) {
    SubjectiveHandler().IcdsSearch(this, diagType);
  }
  dataLevelUpdate(e) {
    SubjectiveHandler().dataLevelUpdate(this, e);
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

  getPatientEncounterDetails() {
    algaehApiCall({
      uri: "/doctorsWorkBench/getPatientEncounter",
      method: "GET",
      data: {
        encounter_id: Window.global.encounter_id
      },
      onSuccess: response => {
        let data = response.data.records[0];
        if (response.data.success) {
          this.setState({
            significant_signs: data.significant_signs,
            other_signs: data.other_signs
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  componentWillUnmount() {
    if (
      this.state.significant_signs !== null ||
      this.state.other_signs !== null
    ) {
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientEncounter",
        method: "PUT",
        data: {
          other_signs: this.state.other_signs,
          significant_signs: this.state.significant_signs,
          encounter_id: Window.global.encounter_id
        }
      });
      debugger;
      if (this.state.hims_f_episode_chief_complaint_id === null) {
        SubjectiveHandler().addChiefComplainToPatient(this);
      } else {
        SubjectiveHandler().updatePatientChiefComplaints(this);
      }
    }
  }

  showAllergies() {
    this.setState({
      openAlergy: !this.state.openAlergy
    });
  }
  showMedication() {
    this.setState({
      openMedication: !this.state.openMedication
    });
  }

  showMedicalData() {
    this.setState({
      openMedicaldata: !this.state.openMedicaldata
    });
  }

  showPatientHistory() {
    this.setState({
      openAddModal: !this.state.openAddModal
    });
  }

  showDietPlan() {
    this.setState({
      openDiet: !this.state.openDiet
    });
  }

  closeDietPlan() {
    this.setState({
      openDiet: !this.state.openDiet
    });
  }

  showVitals() {
    this.setState({
      openVital: !this.state.openVital
    });
  }

  closeVitals() {
    this.setState({
      openVital: !this.state.openVital
    });
  }

  textAreaEvent(e) {
    // significant_signs
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    debugger;
    const _diagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];
    const _finalDiagnosis = Enumerable.from(_diagnosis)
      .where(w => w.final_daignosis === "Y")
      .toArray();
    return (
      <div className="subjective basicSubjective">
        <div className="row margin-top-15">
          <div className="algaeh-col-3">
            <div className="row">
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-12">
                            {" "}
                            <AlgaehLabel
                              label={{
                                forceLabel: "Enter Chief Complaint"
                              }}
                            />
                            <textarea
                              style={{ height: "17vh" }}
                              value={this.state.chief_complaint}
                              name="chief_complaint"
                              onChange={this.textAreaEvent.bind(this)}
                            >
                              {this.state.chief_complaint}
                            </textarea>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Pain Level", isImp: false }}
                            selector={{
                              name: "pain",
                              className: "select-fld",
                              value: this.state.pain,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.PAIN_SCALE
                              },
                              onChange: this.ChangeEventHandler.bind(this)
                            }}
                          />

                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Severity Level",
                              isImp: false
                            }}
                            selector={{
                              name: "severity",
                              className: "select-fld",
                              value: this.state.severity,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.PAIN_SEVERITY
                              },
                              onChange: this.ChangeEventHandler.bind(this)
                            }}
                          />

                          <AlgaehDateHandler
                            div={{ className: "col-lg-3" }}
                            label={{
                              forceLabel: "Onset Date"
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "onset_date"
                            }}
                            maxDate={new Date()}
                            events={{
                              onChange: this.datehandle.bind(this)
                            }}
                            value={this.state.onset_date}
                          />

                          <AlagehFormGroup
                            div={{ className: "col-4 form-group" }}
                            label={{
                              forceLabel: "Duration",
                              isImp: false
                            }}
                            textBox={{
                              className: "txt-fld",
                              name: "duration",
                              number: true,
                              value: this.state.duration,
                              events: {
                                onChange: this.dataLevelUpdate.bind(this)
                              },
                              others: {
                                min: 0
                              }
                            }}
                          />

                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Interval", isImp: false }}
                            selector={{
                              name: "interval",
                              className: "select-fld",
                              value: this.state.interval,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.PAIN_DURATION
                              },
                              onChange: this.dataLevelUpdate.bind(this)
                            }}
                          />

                          <AlagehAutoComplete
                            div={{ className: "col-4 form-group" }}
                            label={{ forceLabel: "Chronic", isImp: false }}
                            selector={{
                              name: "chronic",
                              className: "select-fld",
                              value: this.state.chronic,
                              dataSource: {
                                textField: "name",
                                valueField: "value",
                                data: GlobalVariables.FORMAT_YESNO
                              },
                              onChange: this.ChangeEventHandler.bind(this)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Enter Significant Signs"
                          }}
                        />
                        <textarea
                          style={{ height: "17vh" }}
                          value={this.state.significant_signs}
                          name="significant_signs"
                          onChange={this.textAreaEvent.bind(this)}
                        >
                          {this.state.significant_signs}
                        </textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="algaeh-col-8">
            <div className="row">
              <div className="col-4">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body">
                    <div className="row">
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Other Signs"
                          }}
                        />
                        <textarea
                          style={{ height: "23vh" }}
                          value={this.state.other_signs}
                          name="other_signs"
                          onChange={this.textAreaEvent.bind(this)}
                        >
                          {this.state.other_signs}
                        </textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-title">
                    <div className="caption">
                      <h3 className="caption-subject">Diagnosis</h3>
                    </div>
                    <div className="actions">
                      <a
                        className="btn btn-primary btn-circle active"
                        onClick={this.IcdsSearch.bind(this, "Final")}
                      >
                        <i className="fas fa-plus" />
                      </a>
                    </div>
                  </div>

                  <div className="portlet-body">
                    <div id="finalDioGrid" className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="Finalintial_icd"
                          columns={[
                            {
                              fieldName: "diagnosis_type",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Type"
                                  }}
                                />
                              ),
                              displayTemplate: row => {
                                return row.diagnosis_type === "P"
                                  ? "Primary"
                                  : "Secondary";
                              },
                              editorTemplate: row => {
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "diagnosis_type",
                                      className: "select-fld",
                                      value: row.diagnosis_type,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: GlobalVariables.DIAG_TYPE
                                      },
                                      onChange: this.onchangegridcol.bind(
                                        this,
                                        row,
                                        "Final"
                                      )
                                    }}
                                  />
                                );
                              },
                              others: { maxWidth: 70, align: "center" }
                            },
                            {
                              fieldName: "icd_code",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "ICD Code"
                                  }}
                                />
                              ),
                              disabled: true,
                              others: { maxWidth: 70, align: "center" }
                            },
                            {
                              fieldName: "icd_description",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Description"
                                  }}
                                />
                              ),
                              disabled: true
                            }
                          ]}
                          keyId="code"
                          dataSource={{
                            // data: _finalDiagnosis
                            data: _finalDiagnosis
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 5 }}
                          events={{
                            onDelete: this.deleteFinalDiagnosis.bind(this),
                            onEdit: row => {},

                            onDone: this.updateDiagnosis.bind(this)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="tab-container toggle-section">
                  <ul className="nav">
                    <li
                      algaehtabs={"Orders"}
                      className={"nav-item tab-button active"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Orders"
                          }}
                        />
                      }
                    </li>

                    <li
                      algaehtabs={"LabResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "Lab Results"
                          }}
                        />
                      }
                    </li>
                    <li
                      algaehtabs={"RisResults"}
                      className={"nav-item tab-button"}
                      onClick={this.openTab.bind(this)}
                    >
                      {
                        <AlgaehLabel
                          label={{
                            forceLabel: "RIS Results"
                          }}
                        />
                      }
                    </li>
                    {/* <li
                            algaehtabs={"AssesmentsNotes"}
                            className={"nav-item tab-button"}
                            onClick={this.openTab.bind(this)}
                          >
                            {
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Assesments Notes"
                                }}
                              />
                            }
                          </li> */}
                  </ul>
                </div>

                <div className="grid-section">
                  {this.state.pageDisplay === "Orders" ? (
                    <OrderedList vat_applicable={this.props.vat_applicable} />
                  ) : this.state.pageDisplay === "LabResults" ? (
                    <LabResults />
                  ) : this.state.pageDisplay === "RisResults" ? (
                    <RadResults />
                  ) : null}
                  {/* this.state.pageDisplay === "AssesmentsNotes" ? (
                          <div className="row">
                            <div className="container-fluid">
                              <AlagehFormGroup
                                div={{ className: "col-lg-12 form-details" }}
                                label={{
                                  forceLabel: "Assesment Notes",
                                  isImp: true
                                }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "assesment_notes",
                                  value: this.state.assesment_notes,
                                  others: {
                                    multiline: true,
                                    rows: "4",
                                    style: {
                                      height: "25vh"
                                    }
                                  },
                                  events: {
                                    onChange: assnotetexthandle.bind(this, this)
                                  }
                                }}
                              />
                            </div>
                          </div>
                        ) : null */}
                </div>
              </div>
            </div>
          </div>
          <div className="algaeh-fixed-right-menu">
            <ul className="rightActionIcon">
              <li>
                <i
                  className="fas fa-heartbeat"
                  onClick={this.showVitals.bind(this)}
                />
                <Vitals
                  openVital={this.state.openVital}
                  onClose={this.closeVitals.bind(this)}
                />
              </li>
              <li>
                <i
                  className="fas fa-allergies"
                  onClick={this.showAllergies.bind(this)}
                />

                <Allergies
                  openAllergyModal={this.state.openAlergy}
                  onClose={this.showAllergies.bind(this)}
                />
              </li>
              <li>
                <i
                  className="fas fa-utensils"
                  onClick={this.showDietPlan.bind(this)}
                />
                <Plan
                  openDiet={this.state.openDiet}
                  onClose={this.closeDietPlan.bind(this)}
                />
              </li>
              <li>
                <i
                  className="fas fa-pills"
                  onClick={this.showMedication.bind(this)}
                />
                <Plan
                  openMedication={this.state.openMedication}
                  onClose={this.showMedication.bind(this)}
                />
              </li>
              <li>
                <i
                  className="fas fa-hourglass-half"
                  onClick={this.showPatientHistory.bind(this)}
                />
                <PatientHistory
                  openAddModal={this.state.openAddModal}
                  onClose={this.showPatientHistory.bind(this)}
                />
              </li>
              <li>
                <i
                  className="fas fa-notes-medical"
                  onClick={this.showMedicalData.bind(this)}
                />
                <Plan
                  openMedicaldata={this.state.openMedicaldata}
                  onClose={this.showMedicalData.bind(this)}
                />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assdeptanddoctors: state.assdeptanddoctors,
    assservices: state.assservices,
    patient_diagnosis: state.patient_diagnosis
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions,
      getServices: AlgaehActions,
      getPatientDiagnosis: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BasicSubjective)
);
