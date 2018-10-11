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
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
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
  updateDiagnosis,
  searchByhandaler
} from "./AssessmentEvents";
import OrderingServices from "./OrderingServices/OrderingServices";
import LabResults from "./LabResult/LabResult";
import RadResults from "./RadResult/RadResult";
import { AlgaehActions } from "../../../actions/algaehActions";

import { DIAG_TYPE, SEARCH_BY_ICD } from "../../../utils/GlobalVariables.json";

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
      f_search_by: "C"
    };
  }

  componentDidMount() {
    this.props.getIcdCodes({
      uri: "/icdcptcodes/selectIcdcptCodes",
      method: "GET",
      redux: {
        type: "ICDCODES_GET_DATA",
        mappingName: "icdcodes"
      }
    });

    getPatientDiagnosis(this);
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

  render() {
    return (
      <div className="hptl-ehr-assetment-details">
     
          <div className="row margin-top-15">
            <div className="col-lg-6">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-30">
                <div className="row portlet-title">
                  <div className="col-lg-3 caption">
                    <h3 className="caption-subject">Initial Diagnosis</h3>
                  </div>
                  <div className="col-lg-2">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Search By"
                      }}
                    />
                  </div>

                  <AlagehAutoComplete
                    div={{ className: "col-lg-2" }}
                    selector={{
                      name: "search_by",
                      className: "select-fld",
                      value: this.state.search_by,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: SEARCH_BY_ICD
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "daignosis_id"
                    }}
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
                  <div className="col-lg-1 actions">
                    <a
                      href="javascript:;"
                      className="btn btn-primary btn-circle active"
                    >
                      <i
                        className="fas fa-plus"
                        onClick={insertInitialICDS.bind(this, this)}
                      />
                    </a>
                  </div>
                </div>
                <div className="row portlet-title">
                  <div className="col-lg-4 actions">
                    <Button
                      style={{ backgroundColor: "#D5D5D5" }}
                      size="small"
                      onClick={addFinalIcd.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Add to Final Diagnosis"
                        }}
                      />
                    </Button>
                  </div>
                </div>
                <div className="portlet-body">
                  <h4>
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
                              <span>
                                <Radio
                                  style={{ maxHeight: "10px" }}
                                  name="select"
                                  color="primary"
                                  onChange={selectdIcd.bind(this, this, row)}
                                  checked={row.radioselect == 1 ? true : false}
                                />
                              </span>
                            );
                          },
                          disabled: true,
                          others:{maxWidth:50}
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
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_code
                                  : ""}
                              </span>
                            );
                          },
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
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_description
                                  : ""}
                              </span>
                            );
                          },
                          disabled: true
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        data: this.state.InitialICDS
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 3 }}
                      events={{
                        onDelete: deleteDiagnosis.bind(this, this),
                        onEdit: row => {},
                        onDone: updateDiagnosis.bind(this, this)
                      }}
                    />
                  </h4>
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

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    selector={{
                      name: "f_search_by",
                      className: "select-fld",
                      value: this.state.f_search_by,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: SEARCH_BY_ICD
                      },
                      onChange: texthandle.bind(this, this)
                    }}
                  />

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
                      href="javascript:;"
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
                      id="intial_icd"
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
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_code
                                  : ""}
                              </span>
                            );
                          },
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
                          displayTemplate: row => {
                            let display = [];
                            this.props.icdcodes != 0
                              ? (display =
                                  this.props.icdcodes === undefined
                                    ? []
                                    : this.props.icdcodes.filter(
                                        f => f.hims_d_icd_id == row.daignosis_id
                                      ))
                              : [];

                            return (
                              <span>
                                {display != null && display.length != 0
                                  ? display[0].icd_description
                                  : ""}
                              </span>
                            );
                          },
                          disabled: false
                        }
                      ]}
                      keyId="code"
                      dataSource={{
                        data: this.state.finalICDS
                      }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 3 }}
                      events={{
                        onDelete: deleteFinalDiagnosis.bind(this, this),
                        onEdit: row => {},

                        onDone: updateDiagnosis.bind(this, this)
                      }}
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
                  <OrderingServices
                    vat_applicable={this.props.vat_applicable}
                  />
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
