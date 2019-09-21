import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./assessment.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";

import {
  assnotetexthandle,
  addFinalIcd,
  onchangegridcol,
  deleteDiagnosis,
  deleteFinalDiagnosis,
  updateDiagnosis,
  IcdsSearch,
  getPatientEncounterDetails
} from "./AssessmentEvents";
import { getPatientDiagnosis } from "../PatientProfileHandlers";

import LabResults from "./LabResult/LabResult";
import RadResults from "./RadResult/RadResult";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import { DIAG_TYPE } from "../../../utils/GlobalVariables.json";
import OrderedList from "./OrderedList/OrderedList";
import { algaehApiCall } from "../../../utils/algaehApiCall";

class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplay: "Orders",
      sidBarOpen: true,
      diagnosis_type: null,
      InitialICDS: [],
      daignosis_id: null,
      icd_code: null,
      icd_description: null,

      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      search_by: "C",
      f_search_by: "C",
      showInitialDiagnosisLoader: true,
      showFinalDiagnosisLoader: true,
      assesment_notes: null
    };
    getPatientEncounterDetails(this);
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
  radioChange(e) {
    const _type = e.currentTarget.getAttribute("search_by");
    this.setState({
      search_by: _type
    });
  }
  radioFinalDiagnosisChange(e) {
    this.setState({
      f_search_by: e.currentTarget.getAttribute("search_by")
    });
  }

  componentWillUnmount() {
    if (this.state.assesment_notes !== null) {
      algaehApiCall({
        uri: "/doctorsWorkBench/updatePatientEncounter",
        method: "PUT",
        data: {
          assesment_notes: this.state.assesment_notes,
          encounter_id: Window.global.encounter_id
        }
      });
    }
  }

  componentDidMount() {
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

    if (
      this.props.assdeptanddoctors === undefined ||
      this.props.assdeptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "LAB_DEPT_DOCTOR_GET_DATA",
          mappingName: "assdeptanddoctors"
        }
      });
    }

    getPatientDiagnosis(this, true);
  }
  render() {
    const _diagnosis =
      this.props.patient_diagnosis !== undefined
        ? this.props.patient_diagnosis
        : [];
    const _finalDiagnosis = Enumerable.from(_diagnosis)
      .where(w => w.final_daignosis === "Y")
      .toArray();

    return (
      <div className="hptl-ehr-assetment-details">
        <div className="row margin-top-15">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered margin-bottom-30">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Initial Diagnosis</h3>
                </div>
                <div className="actions">
                  <a
                    // href="javascript"
                    className="btn btn-primary btn-circle active"
                    onClick={IcdsSearch.bind(this, this, "Intial")}
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>

              <div className="portlet-body">
                <div
                  id="initalDioGrid"
                  className="row"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="intial_icd"
                      columns={[
                        {
                          fieldName: "Move",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Move"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <i
                                className="fas fa-arrow-right"
                                onClick={addFinalIcd.bind(this, this, row)}
                              />
                            );
                          },
                          disabled: true,
                          others: { maxWidth: 50, align: "center" }
                        },
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
                                    data: DIAG_TYPE
                                  },
                                  onChange: onchangegridcol.bind(
                                    this,
                                    this,
                                    row,
                                    "Intial"
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
                        data: _diagnosis
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteDiagnosis.bind(this, this),
                        onEdit: row => {},
                        onDone: updateDiagnosis.bind(this, this)
                      }}
                      // loading={this.state.showInitialDiagnosisLoader}
                      noDataText="No initial diagnosis added"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered margin-bottom-30">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Final Diagnosis</h3>
                </div>
                <div className="actions">
                  <a
                    // href="javascript"
                    className="btn btn-primary btn-circle active"
                    onClick={IcdsSearch.bind(this, this, "Final")}
                  >
                    <i className="fas fa-plus" />
                  </a>
                </div>
              </div>

              <div className="portlet-body">
                {" "}
                <div
                  id="finalDioGrid"
                  className="row"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
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
                                    data: DIAG_TYPE
                                  },
                                  onChange: onchangegridcol.bind(
                                    this,
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
                          disabled: false,
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
                          disabled: false
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        // data: _finalDiagnosis
                        data: _finalDiagnosis
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteFinalDiagnosis.bind(this, this),
                        onEdit: row => {},

                        onDone: updateDiagnosis.bind(this, this)
                      }}
                      // loading={this.state.showFinalDiagnosisLoader}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row margin-top-15">
          <div className="col-lg-12">
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
                <li
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
                </li>
              </ul>
            </div>
            {/* : this.state.pageDisplay === "Packages" ? (
                  "Packages"
                ) */}
            <div className="grid-section">
              {this.state.pageDisplay === "Orders" ? (
                <OrderedList vat_applicable={this.props.vat_applicable} />
              ) : this.state.pageDisplay === "LabResults" ? (
                <LabResults />
              ) : this.state.pageDisplay === "RisResults" ? (
                <RadResults />
              ) : this.state.pageDisplay === "AssesmentsNotes" ? (
                <div className="row">
                  <div className="container-fluid">
                    <AlagehFormGroup
                      div={{ className: "col-lg-12 textArea" }}
                      label={{
                        forceLabel: "",
                        isImp: false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "assesment_notes",
                        value: this.state.assesment_notes,
                        others: {
                          multiline: true,
                          rows: "6",
                          style: {
                            height: "25vh"
                          }
                        },
                        options: {},
                        events: {
                          onChange: assnotetexthandle.bind(this, this)
                        }
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    patient_diagnosis: state.patient_diagnosis,
    assservices: state.assservices,
    assdeptanddoctors: state.assdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDiagnosis: AlgaehActions,
      getServices: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Assessment)
);
