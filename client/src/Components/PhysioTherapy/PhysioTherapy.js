import React, { Component } from "react";
import "./PhysioTherapy.css";
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
export default class PhysioTherapy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_name: "Search Here"
    };
  }
  render() {
    return (
      <div className="PhysioTherapyScreen">
        <div className="row">
          <div className="col-3">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Patient Details</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12 globalSearchCntr">
                    <AlgaehLabel label={{ forceLabel: "Search Patient" }} />
                    <h6
                      onClick={e => {
                        AlgaehSearch({
                          searchGrid: {
                            columns: spotlightSearch.frontDesk.patients
                          },
                          searchName: "patients",
                          uri: "/gloabelSearch/get",

                          onContainsChange: (text, serchBy, callBack) => {
                            callBack(text);
                          },
                          onRowSelect: row => {
                            console.log(row, "emp details");
                            this.setState({ emp_name: row.full_name });
                          }
                        });
                      }}
                    >
                      {this.state.emp_name}
                      <i className="fas fa-search"></i>
                    </h6>
                  </div>
                  <div className="col-12">
                    <label className="style_Label ">Patient Name</label>
                    <h6>----</h6>
                  </div>
                  <div className="col-6">
                    <label className="style_Label ">Sex</label>
                    <h6>----</h6>
                  </div>
                  <div className="col-6">
                    <label className="style_Label ">Age</label>
                    <h6>----</h6>
                  </div>
                  <div className="col-6">
                    <label className="style_Label ">Patient Code</label>
                    <h6>----</h6>
                  </div>{" "}
                  <div className="col-6">
                    <label className="style_Label ">Employee Code</label>
                    <h6>----</h6>
                  </div>
                  <div className="col-6">
                    <label className="style_Label ">Mobile No.</label>
                    <h6>----</h6>
                  </div>{" "}
                  <div className="col-6">
                    <label className="style_Label ">Insurance No.</label>
                    <h6>----</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Treatment Details</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  {" "}
                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory" }}
                    label={{
                      forceLabel: "Referred By",
                      isImp: true
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      value: "",
                      dataSource: {}
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-7 mandatory" }}
                    label={{
                      forceLabel: "Diagnosis",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "text"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-2 mandatory" }}
                    label={{
                      forceLabel: "No. of Sessions",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "number"
                      }
                    }}
                  />
                </div>
                <hr></hr>
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{ forceLabel: "Session Date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: ""
                    }}
                    events={{}}
                    value=""
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col-2 mandatory form-group" }}
                    label={{
                      forceLabel: "Session Time",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "time"
                      }
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Physiotherapy Type",
                      isImp: true
                    }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      value: "",
                      dataSource: {}
                    }}
                  />{" "}
                  <AlagehFormGroup
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Remarks",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      others: {
                        type: "text"
                      }
                    }}
                  />
                  <div className="col-1">
                    <button
                      style={{ marginTop: 19 }}
                      className="btn btn-primary"
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
                          fieldName: "status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col mandatory form-group" }}
                                // label={{
                                //     forceLabel: "Physiotherapy Type",
                                //     isImp: true
                                // }}
                                selector={{
                                  name: "",
                                  className: "select-fld",
                                  value: "",
                                  dataSource: {}
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Session Date " }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlgaehDateHandler
                                div={{ className: "" }}
                                // label={{
                                //   forceLabel: "Session Date",
                                //   isImp: true
                                // }}
                                textBox={{
                                  className: "txt-fld",
                                  name: ""
                                }}
                                events={{}}
                                value=""
                              />
                            );
                          }
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Session Time " }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "" }}
                                // label={{
                                //     forceLabel: "Session Time",
                                //     isImp: true
                                // }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: "",
                                  events: {},
                                  others: {
                                    type: "time"
                                  }
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Physiotherapy Type " }}
                            />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "" }}
                                // label={{
                                //     forceLabel: "Physiotherapy Type",
                                //     isImp: true
                                // }}
                                selector={{
                                  name: "",
                                  className: "select-fld",
                                  value: "",
                                  dataSource: {}
                                }}
                              />
                            );
                          }
                        },
                        {
                          fieldName: "date",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Remarks" }} />
                          ),
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{ className: "" }}
                                // label={{
                                //     forceLabel: "Remarks",
                                //     isImp: true
                                // }}
                                textBox={{
                                  className: "txt-fld",
                                  name: "",
                                  value: "",
                                  events: {},
                                  others: {
                                    type: "text"
                                  }
                                }}
                              />
                            );
                          }
                        }
                      ]}
                      keyId="physio_id"
                      dataSource={{}}
                      isEditable={true}
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
      </div>
    );
  }
}
