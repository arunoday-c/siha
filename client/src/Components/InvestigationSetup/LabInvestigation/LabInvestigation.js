import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LabInvestigation.scss";
import "./../../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";
import { AlgaehDataGrid } from "algaeh-react-components";
import {
  texthandle,
  handleCheck,
  containeridhandle,
  analyteidhandle,
  AddAnalytes,
  updateLabInvestigation,
  updateAnalyteGroup,
  deleteLabAnalyte,
  dataDrag,
} from "./LabInvestigationEvent";
import variableJson from "../../../utils/GlobalVariables.json";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import MyContext from "../../../utils/MyContext.js";
// import { AlgaehModal, AlgaehFormGroup } from "algaeh-react-components";
// import { swalMessage } from "../../../utils/algaehApiCall";
import Formula from "./Formula";
class LabInvestigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openFormula: false,
      original_formula: "",
      formula_description: "",
      selectedRow: {},
    };
  }

  static contextType = MyContext;

  componentDidMount() {
    if (
      this.props.labsection === undefined ||
      this.props.labsection.length === 0
    ) {
      this.props.getLabsection({
        uri: "/labmasters/selectSection",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SECTION_GET_DATA",
          mappingName: "labsection",
        },
      });
    }

    if (
      this.props.labspecimen === undefined ||
      this.props.labspecimen.length === 0
    ) {
      this.props.getLabSpecimen({
        uri: "/labmasters/selectSpecimen",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "SPECIMEN_GET_DATA",
          mappingName: "labspecimen",
        },
      });
    }

    if (
      this.props.labanalytes === undefined ||
      this.props.labanalytes.length === 0
    ) {
      this.props.getLabAnalytes({
        uri: "/labmasters/selectAnalytes",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "labanalytes",
        },
      });
    }
    if (
      this.props.labcontainer === undefined ||
      this.props.labcontainer.length === 0
    ) {
      this.props.getLabContainer({
        uri: "/labmasters/selectContainer",
        module: "laboratory",
        method: "GET",
        redux: {
          type: "CONTAINER_GET_DATA",
          mappingName: "labcontainer",
        },
      });
    }
  }

  // UNSAFE_componentWillReceiveProps(newProps) {
  //   let IOputs = newProps.InvestigationPop;
  //   this.setState({ ...this.state, ...IOputs });
  // }

  // events
  texthandle = texthandle.bind(this);
  handleCheck = handleCheck.bind(this);
  analyteidhandle = analyteidhandle.bind(this);
  containeridhandle = containeridhandle.bind(this);
  changeGridEditors(row, e) {
    const { state } = this.context;
    let analytes = state.analytes;

    let analytes_index = analytes.indexOf(row);
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;

    analytes[analytes_index] = row;

    if (this.context !== undefined) {
      this.context.updateState({
        analytes: analytes,
        analyte_report_group: "N",

        // update_analytes: update_analytes,
      });
    }
  }

  // Crud a
  AddAnalytes = AddAnalytes.bind(this);
  deleteLabAnalyte = deleteLabAnalyte.bind(this);
  dataDrag = dataDrag.bind(this);
  updateLabInvestigation = updateLabInvestigation.bind(this);
  updateAnalyteGroup = updateAnalyteGroup.bind(this);

  showFormulaPopup(row) {
    this.setState({
      openFormula: true,
      selectedRow: row,
    });
  }
  closeFormulaPopup() {
    this.setState({
      openFormula: false,
      // original_formula: "",
      // formula_description: "",
    });
  }
  onDeleteFormula(row) {
    const { state } = this.context;
    let analytes = [...state.analytes];

    let analytes_index = analytes.indexOf(row);

    row.display_formula = null;
    row.formula = null;
    row.original_formula = null;
    row.decimals = null;

    analytes[analytes_index] = row;

    if (this.context !== undefined) {
      this.context.updateState({
        analytes: analytes,
      });
    }
  }
  render() {
    const { state } = this.context;
    return (
      <React.Fragment>
        <Formula
          openFormula={this.state.openFormula}
          closeFormulaPopup={this.closeFormulaPopup.bind(this)}
          selectedRow={this.state.selectedRow}
          analytes={state.analytes}
        />
        <div className="row">
          <div className="col-3">
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  fieldName: "specimen_id",
                  isImp: true,
                }}
                selector={{
                  name: "specimen_id",
                  className: "select-fld",
                  value: state.specimen_id,
                  dataSource: {
                    textField: "SpeDescription",
                    valueField: "hims_d_lab_specimen_id",
                    data: this.props.labspecimen,
                  },
                  onChange: this.texthandle,
                  others: {
                    tabIndex: "5",
                  },
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group" }}
                label={{
                  fieldName: "container_type",
                  isImp: true,
                }}
                selector={{
                  name: "container_id",
                  className: "select-fld",
                  value: state.container_id,
                  dataSource: {
                    textField: "ConDescription",
                    valueField: "hims_d_lab_container_id",
                    data: this.props.labcontainer,
                  },
                  onChange: this.containeridhandle,
                  others: {
                    tabIndex: "6",
                  },
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12  form-group" }}
                label={{
                  fieldName: "available_in_house",
                  // isImp: true,
                }}
                selector={{
                  name: "available_in_house",
                  className: "select-fld",
                  value: state.available_in_house,
                  dataSource: {
                    textField:
                      state.selectedLang === "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  onChange: this.texthandle,
                  others: {
                    tabIndex: "7",
                  },
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12 mandatory form-group " }}
                label={{
                  fieldName: "send_out_test",
                  isImp: true,
                }}
                selector={{
                  name: "send_out_test",
                  className: "select-fld",
                  value: state.send_out_test,
                  dataSource: {
                    textField:
                      state.selectedLang === "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.FORMAT_YESNO,
                  },
                  onChange: this.texthandle,
                }}
              />
              <AlagehAutoComplete
                div={{ className: "col-12  form-group mandatory" }}
                label={{
                  fieldName: "lab_report_type",
                  isImp: true,
                }}
                selector={{
                  name: "isPCR",
                  className: "select-fld",
                  value: state.isPCR,
                  dataSource: {
                    textField:
                      state.selectedLang === "en" ? "name" : "arabic_name",
                    valueField: "value",
                    data: variableJson.LAB_REPORT_TYPE,
                  },
                  onChange: this.texthandle,
                  others: {
                    tabIndex: "7",
                  },
                }}
              />

              <AlagehFormGroup
                div={{ className: "col-12 form-group" }}
                label={{
                  forceLabel: "TAT Time (In Min.)",
                  isImp: false,
                }}
                textBox={{
                  className: "txt-fld",
                  name: "tat_standard_time",
                  value: state.tat_standard_time,
                  events: {
                    onChange: this.texthandle,
                  },
                  others: {
                    type: "number",
                    placeholder: "HHMM (0030)",
                  },
                }}
              />
            </div>
          </div>
          <div
            className="col-9"
            style={{ borderLeft: "1px solid rgba(0,0,0,.1)" }}
          >
            {state.analytes_required === true ? (
              <div>
                <div className="row" data-validate="analyte_details">
                  <AlagehAutoComplete
                    div={{ className: "col-4 mandatory" }}
                    label={{
                      fieldName: "analyte_id",
                      isImp: true,
                    }}
                    selector={{
                      name: "analyte_id",
                      className: "select-fld",
                      value: state.analyte_id,
                      dataSource: {
                        textField: "AnaDescription",
                        valueField: "hims_d_lab_analytes_id",
                        data: this.props.labanalytes,
                      },
                      onChange: this.analyteidhandle,
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col mandatory" }}
                    label={{
                      forceLabel: "Report Group",
                      isImp: true,
                    }}
                    selector={{
                      name: "analyte_report_group",
                      className: "select-fld",
                      value: state.analyte_report_group,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_ANLYTE_REPORT_GROUP,
                      },
                      onChange: this.texthandle,
                    }}
                  />

                  <div className="col">
                    <label>Show in report</label>
                    <div className="customCheckbox">
                      <label className="checkbox inline">
                        <input
                          type="checkbox"
                          name="includeInReport"
                          checked={state.includeInReport === "Y" ? true : false}
                          value={state.includeInReport}
                          onChange={this.handleCheck}
                        />
                        <span>Yes</span>
                      </label>
                    </div>
                  </div>

                  {/* 
                  <div
                    className="customCheckbox col-2"
                    style={{ border: "none", marginTop: "19px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="includeInReport"
                        checked={state.includeInReport === "Y" ? true : false}
                        value={state.includeInReport}
                        onChange={this.handleCheck}
                      />
                      <span style={{ fontSize: "0.8rem" }}>
                        Include In Report
                      </span>
                    </label>
                  </div> */}

                  <div className="col-1" style={{ padding: 0 }}>
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 20 }}
                      onClick={this.AddAnalytes}
                    >
                      Add
                    </button>
                  </div>

                  <div className="col-12" id="analyte_grid_cntr">
                    <AlgaehDataGrid
                      id="analyte_grid"
                      columns={[
                        {
                          fieldName: "analyte_description",
                          label: (
                            <AlgaehLabel label={{ fieldName: "analytes_id" }} />
                          ),
                          editorTemplate: (row) => {
                            return <span>{row.analyte_description}</span>;
                          },

                          others: {
                            minWidth: 200,
                            style: { textAlign: "left" },
                          },
                        },

                        {
                          fieldName: "display_formula",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Formula" }} />
                          ),
                          editorTemplate: (row) => {
                            return (
                              <div>
                                <label>{row.display_formula}</label>
                                <i
                                  className="fas fa-pen"
                                  onClick={this.showFormulaPopup.bind(
                                    this,
                                    row
                                  )}
                                />
                                {row.display_formula !== "" &&
                                row.display_formula ? (
                                  <i
                                    className="fas fa-trash-alt"
                                    onClick={this.onDeleteFormula.bind(
                                      this,
                                      row
                                    )}
                                  />
                                ) : null}
                              </div>
                            );
                          },
                          others: {
                            minWidth: 250,
                            style: { textAlign: "center" },
                          },
                        },
                        {
                          fieldName: "analyte_report_group",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Report Group" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.analyte_report_group === "M"
                                  ? "Microscopic Examination"
                                  : row.analyte_report_group === "P"
                                  ? "Physical Appearance"
                                  : row.analyte_report_group === "D"
                                  ? "Differential Leukocyte Count"
                                  : row.analyte_report_group === "C"
                                  ? "Chemical Examination"
                                  : row.analyte_report_group === "ME"
                                  ? "Macroscopic Examination"
                                  : row.analyte_report_group === "AG"
                                  ? "Agglutination"
                                  : row.analyte_report_group === "MT"
                                  ? "Motility"
                                  : row.analyte_report_group === "SM"
                                  ? "Sperm Morphology"
                                  : "None"}
                              </span>
                            );
                          },
                          editorTemplate: (row) => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col noLabel" }}
                                label={{
                                  isImp: true,
                                }}
                                selector={{
                                  name: "analyte_report_group",
                                  className: "select-fld",
                                  value: row.analyte_report_group,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_ANLYTE_REPORT_GROUP,
                                  },
                                  onChange: this.changeGridEditors.bind(
                                    this,
                                    row
                                  ),
                                }}
                              />
                            );
                          },
                          others: {
                            minWidth: 200,
                            style: { textAlign: "left" },
                          },
                        },
                        {
                          fieldName: "includeInReport",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Show in report" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.includeInReport === "Y" ? "YES" : "NO"}
                              </span>
                            );
                          },
                          editorTemplate: (row) => {
                            return (
                              <input
                                type="checkbox"
                                defaultChecked={
                                  row.includeInReport === "Y" ? true : false
                                }
                                onChange={(e) => {
                                  const status = e.target.checked;
                                  row["includeInReport"] =
                                    status === true ? "Y" : "N";

                                  // row.update();
                                }}
                              />
                            );
                          },
                          others: {
                            minWidth: 130,
                            style: { textAlign: "center" },
                          },
                        },
                      ]}
                      keyId="analyte_id"
                      data={state.analytes === undefined ? [] : state.analytes}
                      pagination={false}
                      isFilterable={false}
                      isEditable={true}
                      isDraggableRow={true}
                      events={{
                        onDelete: this.deleteLabAnalyte,
                        onEdit: (row) => {},
                        onDrop: this.dataDrag,
                        // onDone: this.updateLabInvestigation,
                        onSave: this.updateAnalyteGroup,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    labspecimen: state.labspecimen,
    labsection: state.labsection,
    labanalytes: state.labanalytes,
    labcontainer: state.labcontainer,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLabsection: AlgaehActions,
      getLabSpecimen: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getLabContainer: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LabInvestigation)
);
