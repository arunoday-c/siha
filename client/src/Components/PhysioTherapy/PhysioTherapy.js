import React, { Component } from "react";
import "./PhysioTherapy.scss";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import AlgaehSearch from "../Wrapper/globalSearch";
import spotlightSearch from "../../Search/spotlightSearch.json";
import PhysioTherapyEvent from "./PhysioTherapyEvent";
import moment from "moment";
import GlobalVariables from "../../utils/GlobalVariables.json";
import { AlgaehValidation } from "../../utils/GlobalFunctions";
import Options from "../../Options.json";

export default class PhysioTherapy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hims_f_physiotherapy_header_id: null,
      PhysiotherapyPatient: [],
      selectedPatient: {},
      physiotherapy_treatment_detail: [],
      physioth_diagnosis: null,
      no_of_session: null,
      session_time: null,
      session_date: null,
      treatment_remarks: null,
      physiotherapy_type: null,
      others_specify: null,
      saveEnable: true,
      data_exists: true
    };
    PhysioTherapyEvent().getPhysiotherapyTreatment(this);
  }

  AddtoList() {
    PhysioTherapyEvent().AddtoList(this);
  }

  texthandle(e) {
    PhysioTherapyEvent().texthandle(this, e);
  }
  dateFormater(value) {
    if (value !== null) {
      return String(moment(value).format(Options.dateFormat));
    }
  }

  savePhysiotherapyTreatment(e) {
    PhysioTherapyEvent().savePhysiotherapyTreatment(this, e);
  }

  ongridtexthandle(row, e) {
    PhysioTherapyEvent().ongridtexthandle(this, row, e);
  }

  gridOndateHandler(row, e) {
    PhysioTherapyEvent().gridOndateHandler(this, row, e);
  }

  ClearData() {
    this.setState({
      hims_f_physiotherapy_header_id: null,
      selectedPatient: {},
      physiotherapy_treatment_detail: [],
      physioth_diagnosis: null,
      no_of_session: null,
      session_time: null,
      session_date: null,
      treatment_remarks: null,
      physiotherapy_type: null,
      others_specify: null,
      saveEnable: true
    });
  }
  render() {
    return (
      <div className="PhysioTherapyScreen">
        <div className="row">
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">List of Patient</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12">
                    <AlgaehDataGrid
                      id="physioTreatPatientGrid"
                      columns={[
                        {
                          fieldName: "billed",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Bill Status" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.billed === "N" ? "Not Billed" : "Billed";
                          },
                          others: {
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "patient_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Patient Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "full_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Patient Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "employee_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee ID" }}
                            />
                          )
                        },

                        {
                          fieldName: "ordered_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Ordered Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "doctor_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Reffered By" }}
                            />
                          )
                        },
                        {
                          fieldName: "physiotherapy_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          )
                        }
                      ]}
                      keyId="physio_patient_id"
                      dataSource={{ data: this.state.PhysiotherapyPatient }}
                      isEditable={false}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      onRowSelect={row => {
                        this.setState({
                          ...row,
                          saveEnable: false
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Selected Patient Details</h3>
                </div>
              </div>
              <div className="portlet-body" data-validate="SessionDetails">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel label={{ forceLabel: "Patient Code" }} />
                    <h6>
                      {this.state.patient_code
                        ? this.state.patient_code
                        : "----------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel label={{ forceLabel: "Patient Name" }} />
                    <h6>
                      {this.state.full_name
                        ? this.state.full_name
                        : "----------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel label={{ forceLabel: "Referred By" }} />
                    <h6>
                      {this.state.doctor_name
                        ? this.state.doctor_name
                        : "----------"}
                    </h6>
                  </div>
                </div>
                <hr></hr>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-6 mandatory form-group" }}
                    label={{
                      forceLabel: "Diagnosis",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "physioth_diagnosis",
                      value: this.state.physioth_diagnosis,
                      events: {
                        onChange: this.texthandle.bind(this)
                      },
                      others: {
                        type: "text",
                        disabled: this.state.data_exists
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{
                      forceLabel: "No. of Sessions",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      dontAllowKeys: ["-", "e", "."],
                      name: "no_of_session",
                      value: this.state.no_of_session,
                      events: {
                        onChange: this.texthandle.bind(this)
                      },
                      others: {
                        disabled: this.state.data_exists
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{ forceLabel: "Session Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "session_date"
                    }}
                    events={{
                      onChange: e => {
                        this.setState({
                          session_date: moment(e)._d
                        });
                      }
                    }}
                    value={this.state.session_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
                    label={{
                      forceLabel: "Session Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "session_time",
                      value: this.state.session_time,
                      events: {
                        onChange: this.texthandle.bind(this)
                      },
                      others: {
                        type: "time"
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-4 mandatory form-group" }}
                    label={{
                      forceLabel: "Physiotherapy Type",
                      isImp: true
                    }}
                    selector={{
                      name: "physiotherapy_type",
                      className: "select-fld",
                      value: this.state.physiotherapy_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_PHYSIOTHERAPY_TYPE
                      },
                      onChange: this.texthandle.bind(this)
                    }}
                  />

                  {this.state.physiotherapy_type === "O" ? (
                    <AlagehFormGroup
                      div={{ className: "col-6 mandatory form-group" }}
                      label={{
                        forceLabel: "Others Specify",
                        isImp:
                          this.state.physiotherapy_type === "O" ? true : false
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "others_specify",
                        value: this.state.others_specify,
                        events: {
                          onChange: this.texthandle.bind(this)
                        },
                        others: {
                          type: "text"
                        }
                      }}
                    />
                  ) : null}

                  <AlagehFormGroup
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Remarks",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "treatment_remarks",
                      value: this.state.treatment_remarks,
                      events: {
                        onChange: this.texthandle.bind(this)
                      },
                      others: {
                        type: "text"
                      }
                    }}
                  />
                  <div
                    className="col-1"
                    style={{ paddingTop: 19, paddingLeft: 0 }}
                  >
                    <button
                      className="btn btn-primary"
                      onClick={this.AddtoList.bind(this)}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12" id="physioTreatGrid_Cntr">
                    <AlgaehDataGrid
                      id="physioTreatGrid"
                      columns={[
                        {
                          fieldName: "session_status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: row => {
                            let display = GlobalVariables.FORMAT_SESSION_STATUS.filter(
                              f => f.value === row.session_status
                            );
                            return row.session_status !== "C" ? (
                              <AlagehAutoComplete
                                div={{ className: "" }}
                                selector={{
                                  name: "session_status",
                                  className: "select-fld",
                                  value: row.session_status,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data: GlobalVariables.FORMAT_SESSION_STATUS
                                  },
                                  onChange: this.ongridtexthandle.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            ) : (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "session_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Session Date " }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.session_status !== "C" ? (
                              <AlgaehDateHandler
                                div={{ className: "" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "session_date"
                                }}
                                events={{
                                  onChange: this.gridOndateHandler.bind(
                                    this,
                                    row
                                  )
                                }}
                                value={row.session_date}
                              />
                            ) : (
                              <span>{this.dateFormater(row.session_date)}</span>
                            );
                          }
                        },
                        {
                          fieldName: "session_time",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Session Time " }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.session_status !== "C" ? (
                              <AlagehFormGroup
                                div={{ className: "" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "session_time",
                                  value: row.session_time,
                                  events: {
                                    onChange: this.ongridtexthandle.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    type: "time"
                                  }
                                }}
                              />
                            ) : (
                              row.session_time
                            );
                          }
                        },

                        {
                          fieldName: "physiotherapy_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Physiotherapy Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            let display = GlobalVariables.FORMAT_PHYSIOTHERAPY_TYPE.filter(
                              f => f.value === row.physiotherapy_type
                            );
                            return row.session_status !== "C" ? (
                              <AlagehAutoComplete
                                div={{ className: "" }}
                                selector={{
                                  name: "physiotherapy_type",
                                  className: "select-fld",
                                  value: row.physiotherapy_type,
                                  dataSource: {
                                    textField: "name",
                                    valueField: "value",
                                    data:
                                      GlobalVariables.FORMAT_PHYSIOTHERAPY_TYPE
                                  },
                                  onChange: this.ongridtexthandle.bind(
                                    this,
                                    row
                                  )
                                }}
                              />
                            ) : (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].name
                                  : ""}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "others_specify",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Others Specify" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.physiotherapy_type === "O" &&
                              row.session_status !== "C" ? (
                              <AlagehFormGroup
                                div={{ className: "" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "others_specify",
                                  value: row.others_specify,
                                  events: {
                                    onChange: this.ongridtexthandle.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    type: "text"
                                  }
                                }}
                              />
                            ) : (
                              row.others_specify
                            );
                          }
                        },
                        {
                          fieldName: "treatment_remarks",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Remarks" }} />
                          ),
                          displayTemplate: row => {
                            return row.session_status !== "C" ? (
                              <AlagehFormGroup
                                div={{ className: "" }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "treatment_remarks",
                                  value: row.treatment_remarks,
                                  events: {
                                    onChange: this.ongridtexthandle.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    type: "text"
                                  }
                                }}
                              />
                            ) : (
                              row.treatment_remarks
                            );
                          }
                        }
                      ]}
                      keyId="physio_id"
                      dataSource={{
                        data: this.state.physiotherapy_treatment_detail
                      }}
                      isEditable={false}
                      filter={true}
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
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.savePhysiotherapyTreatment.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={this.ClearData.bind(this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
