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
  texthandle,
  assnotetexthandle,
  insertInitialICDS,
  insertFinalICDS,
  selectdIcd,
  addFinalIcd,
  getPatientDiagnosis,
  onchangegridcol,
  deleteDiagnosis,
  deleteFinalDiagnosis,
  updateDiagnosis
} from "./AssessmentEvents";
import OrderingServices from "./OrderingServices/OrderingServices";
import LabResults from "./LabResult/LabResult";
import RadResults from "./RadResult/RadResult";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
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
      f_icd_id: null,
      selectdIcd: [],
      insertInitialDiad: [],
      patient_id: Window.global["current_patient"],
      episode_id: Window.global["episode_id"],
      search_by: "C",
      f_search_by: "C",
      showInitialDiagnosisLoader: true,
      showFinalDiagnosisLoader: true
    };

    if (props.icdcodes === undefined || props.icdcodes.length === 0) {
      this.props.getIcdCodes({
        uri: "/icdcptcodes/selectIcdcptCodes",
        method: "GET",
        redux: {
          type: "ICDCODES_GET_DATA",
          mappingName: "icdcodes"
        }
      });
    }
    if (
      props.patientdiagnosis === undefined ||
      props.patientdiagnosis.length === 0
    ) {
      getPatientDiagnosis(this);
    }
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
      search_by: _type,
      f_search_by: _type
    });
  }
  radioFinalDiagnosisChange(e) {
    this.setState({
      f_search_by: e.currentTarget.getAttribute("search_by")
    });
  }
  render() {
    let _initalDiagnosis = [];
    let _finalDiagnosis = [];
    if (this.props.icdcodes !== undefined) {
      _initalDiagnosis = Enumerable.from(this.state.InitialICDS)
        .select(s => {
          const _rowICD = Enumerable.from(this.props.icdcodes)
            .where(w => w.hims_d_icd_id === s.daignosis_id)
            .firstOrDefault();
          const _records =
            _rowICD !== undefined
              ? {
                  daignosis_id: _rowICD.icd_code,
                  icd_description: _rowICD.icd_description
                }
              : {};
          return {
            ...s,
            ..._records
          };
        })
        .toArray();

      _finalDiagnosis = Enumerable.from(this.state.finalICDS)
        .select(s => {
          const _rowICD = Enumerable.from(this.props.icdcodes)
            .where(w => w.hims_d_icd_id === s.daignosis_id)
            .firstOrDefault();
          const _records =
            _rowICD !== undefined
              ? {
                  daignosis_id: _rowICD.icd_code,
                  icd_description: _rowICD.icd_description
                }
              : {};
          return {
            ...s,
            ..._records
          };
        })
        .toArray();
    }

    return (
      <div className="hptl-ehr-assetment-details">
        <div className="row margin-top-15">
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
              <div className="row portlet-title">
                <div className="col-lg-3 caption">
                  <h3 className="caption-subject">Initial Diagnosis</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Search By"
                      }}
                    />
                  </div>
                  <div className="col-lg-4 customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="daignosis_id"
                        value="ICD Code"
                        search_by="C"
                        checked={this.state.search_by === "C" ? true : false}
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>ICD Code</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="daignosis_id"
                        value="ICD Name"
                        search_by="D"
                        checked={this.state.search_by !== "C" ? true : false}
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>ICD Name</span>
                    </label>
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-lg-4" }}
                    selector={{
                      name: "daignosis_id",
                      className: "select-fld",
                      value: this.state.daignosis_id,
                      dataSource: {
                        textField:
                          this.state.search_by === "C"
                            ? "icd_code"
                            : "icd_description",
                        valueField: "hims_d_icd_id",
                        data: this.props.icdcodes
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />
                  <div className="col actions">
                    <a
                      // href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i
                        className="fas fa-plus"
                        onClick={insertInitialICDS.bind(this, this)}
                      />
                    </a>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <div className="col-lg-12">
                    <AlgaehDataGrid
                      id="intial_icd"
                      columns={[
                        {
                          fieldName: "Select",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Select"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              // <label className="radio inline">
                              //   <input
                              //     type="radio"
                              //     name="select"
                              //     value="ICD Name"
                              //     search_by="D"
                              //     checked={row.radioselect === 1 ? true : false}
                              //     onChange={selectdIcd.bind(this, this, row)}
                              //   />
                              // </label>
                              <button
                                onChange={selectdIcd.bind(this, this, row)}
                              >
                                Move to Final
                              </button>
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
                          }
                        },
                        {
                          fieldName: "daignosis_id",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "ICD Code"
                              }}
                            />
                          ),

                          disabled: true
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
                        data: _initalDiagnosis
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
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-default"
                      onClick={addFinalIcd.bind(this, this)}
                    >
                      Add to Final Diagnosis
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
              <div className="row portlet-title">
                <div className="col-lg-3 caption">
                  <h3 className="caption-subject">Final Diagnosis</h3>
                </div>

                <div className="col-lg-2">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Search By"
                    }}
                  />
                </div>
                <div className="col-lg-4 customRadio">
                  <label className="radio inline">
                    <input
                      type="radio"
                      name="finaldaignosis_id"
                      value="ICD Code"
                      search_by="C"
                      checked={this.state.f_search_by === "C" ? true : false}
                      onChange={this.radioFinalDiagnosisChange.bind(this)}
                    />
                    <span>ICD Code</span>
                  </label>
                  <label className="radio inline">
                    <input
                      type="radio"
                      name="finaldaignosis_id"
                      value="ICD Name"
                      search_by="D"
                      checked={this.state.f_search_by !== "C" ? true : false}
                      onChange={this.radioFinalDiagnosisChange.bind(this)}
                    />
                    <span>ICD Name</span>
                  </label>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "icd_id"
                  }}
                  selector={{
                    name: "f_icd_id",
                    className: "select-fld",
                    value: this.state.f_icd_id,
                    dataSource: {
                      textField:
                        this.state.f_search_by === "C"
                          ? "icd_code"
                          : "icd_description",
                      valueField: "hims_d_icd_id",
                      data: this.props.icdcodes
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

                <div className="col-lg-1 actions">
                  <a
                    // href="javascript:;"
                    className="btn btn-primary btn-circle active"
                  >
                    <i
                      className="fas fa-plus"
                      onClick={insertFinalICDS.bind(this, this)}
                    />
                  </a>
                </div>
              </div>
              <div className="portlet-body">
                <h4>
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
                        }
                      },
                      {
                        fieldName: "daignosis_id",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "ICD Code"
                            }}
                          />
                        ),
                        disabled: false
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
                      data: _finalDiagnosis
                    }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 3 }}
                    events={{
                      onDelete: deleteFinalDiagnosis.bind(this, this),
                      onEdit: row => {},

                      onDone: updateDiagnosis.bind(this, this)
                    }}
                    loading={this.state.showInitialDiagnosisLoader}
                  />
                </h4>
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
    patientdiagnosis: state.patientdiagnosis
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIcdCodes: AlgaehActions,
      getPatientDiagnosis: AlgaehActions
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
