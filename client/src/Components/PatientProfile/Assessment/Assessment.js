import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./assessment.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";

import {
  assnotetexthandle,
  addFinalIcd,
  getPatientDiagnosis,
  onchangegridcol,
  deleteDiagnosis,
  deleteFinalDiagnosis,
  updateDiagnosis,
  IcdsSearch
} from "./AssessmentEvents";
import OrderingServices from "./OrderingServices/OrderingServices";
import LabResults from "./LabResult/LabResult";
import RadResults from "./RadResult/RadResult";
import { AlgaehActions } from "../../../actions/algaehActions";

import { DIAG_TYPE } from "../../../utils/GlobalVariables.json";

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
      finalICDS: [],
      icd_id: null,
      f_icd_id: null,

      insertInitialDiad: [],
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      search_by: "C",
      f_search_by: "C",
      showInitialDiagnosisLoader: true,
      showFinalDiagnosisLoader: true
    };
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
      // f_search_by: _type
    });
  }
  radioFinalDiagnosisChange(e) {
    this.setState({
      f_search_by: e.currentTarget.getAttribute("search_by")
    });
  }

  componentDidMount() {
    debugger;

    if (
      this.props.assservices === undefined ||
      this.props.assservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
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
        method: "GET",
        redux: {
          type: "LAB_DEPT_DOCTOR_GET_DATA",
          mappingName: "assdeptanddoctors"
        }
      });
    }

    getPatientDiagnosis(this);
  }
  render() {
    return (
      <div className="hptl-ehr-assetment-details">
        <div className="row margin-top-15">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Initial Diagnosis</h3>
                </div>
                <div className="actions">
                  <a
                    href="javascript:;"
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
                        data: this.state.InitialICDS
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteDiagnosis.bind(this, this),
                        onEdit: row => {},
                        onDone: updateDiagnosis.bind(this, this)
                      }}
                      loading={this.state.showInitialDiagnosisLoader}
                      noDataText="No initial diagnosis added"
                    />
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-default"
                      onClick={addFinalIcd.bind(this, this)}
                    >
                      Add to Final Diagnosis
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Final Diagnosis</h3>
                </div>
                <div className="actions">
                  <a
                    href="javascript:;"
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
                        data: this.state.finalICDS
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteFinalDiagnosis.bind(this, this),
                        onEdit: row => {},

                        onDone: updateDiagnosis.bind(this, this)
                      }}
                      loading={this.state.showFinalDiagnosisLoader}
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
                  style={{ marginRight: 2 }}
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
                  style={{ marginRight: 2 }}
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
                  style={{ marginRight: 2 }}
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
                  style={{ marginRight: 2 }}
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
                <OrderingServices vat_applicable={this.props.vat_applicable} />
              ) : this.state.pageDisplay === "LabResults" ? (
                <LabResults />
              ) : this.state.pageDisplay === "RisResults" ? (
                <RadResults />
              ) : this.state.pageDisplay === "AssesmentsNotes" ? (
                <div className="row" style={{ paddingBottom: "20px" }}>
                  <div className="container-fluid">
                    <AlagehFormGroup
                      div={{ className: "col-lg-12" }}
                      label={{
                        forceLabel: "Assesments Notes",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "assesments_notes",
                        value: this.state.assesments_notes,
                        others: {
                          multiline: true,
                          rows: "4"
                        },
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
    icdcodes: state.icdcodes,
    patientdiagnosis: state.patientdiagnosis,
    assservices: state.assservices,
    assdeptanddoctors: state.assdeptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      // getIcdCodes: AlgaehActions,
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
