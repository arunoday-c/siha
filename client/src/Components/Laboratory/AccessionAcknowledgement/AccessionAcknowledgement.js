import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./AccessionAcknowledgement.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getSampleCollectionDetails,
  AcceptandRejectSample,
  Refresh
} from "./AccessionAcknowledgementHandaler";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import {
  FORMAT_PRIORITY,
  FORMAT_TEST_STATUS
} from "../../../utils/GlobalVariables.json";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

class AccessionAcknowledgement extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    this.state = {
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      isOpen: false
    };
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  changeTimeFormat = date => {
    if (date != null) {
      return moment(date).format(Options.timeFormat);
    }
  };

  ShowCollectionModel(row, e) {
    this.setState({
      isOpen: !this.state.isOpen,
      selected_patient: row
    });
  }
  CloseCollectionModel(e) {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  componentDidMount() {
    getSampleCollectionDetails(this, this);
  }

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-accession-acknowledgement-form">
          <BreadCrumb
            title={
              <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      fieldName: "form_home",
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ fieldName: "form_name", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-6">
              <div className="row">
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "from_date" }}
                  textBox={{ className: "txt-fld", name: "from_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.from_date}
                />
                <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ fieldName: "to_date" }}
                  textBox={{ className: "txt-fld", name: "to_date" }}
                  events={{
                    onChange: datehandle.bind(this, this)
                  }}
                  value={this.state.to_date}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "patient_code"
                  }}
                  textBox={{
                    value: this.state.patient_code,
                    className: "txt-fld",
                    name: "patient_code",

                    events: {
                      onChange: texthandle.bind(this, this)
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <div className="col-lg-1 form-group">
                  <span
                    className="fas fa-search"
                    style={{
                      fontSize: " 1.2rem",
                      marginTop: "6px",
                      paddingBottom: "10px"
                    }}
                    onClick={PatientSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "proiorty",
                    isImp: false
                  }}
                  selector={{
                    name: "proiorty",
                    className: "select-fld",
                    value: this.state.proiorty,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_PRIORITY
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "status",
                    isImp: false
                  }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_TEST_STATUS
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

                <div className="col" style={{ paddingTop: "21px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={getSampleCollectionDetails.bind(this, this)}
                  >
                    Load
                  </button>
                  <button
                    className="btn btn-default btn-sm"
                    style={{ marginLeft: "10px" }}
                    type="button"
                    onClick={Refresh.bind(this, this)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                {/* <div className="portlet-title"><div className="caption"><h3 className="caption-subject"></h3></div></div>
                */}
                <div className="portlet-body">
                  <AlgaehDataGrid
                    id="samplecollection_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                style={{
                                  pointerEvents:
                                    row.status === "O"
                                      ? ""
                                      : row.sample_status !== "N"
                                        ? "none"
                                        : "",

                                  opacity:
                                    row.status === "O"
                                      ? ""
                                      : row.sample_status !== "N"
                                        ? "0.1"
                                        : ""
                                }}
                                className="fa fa-check"
                                aria-hidden="true"
                                onClick={AcceptandRejectSample.bind(
                                  this,
                                  this,
                                  row,
                                  "A"
                                )}
                              />

                              <i
                                style={{
                                  pointerEvents:
                                    row.status === "O"
                                      ? ""
                                      : row.sample_status !== "N"
                                        ? "none"
                                        : "",

                                  opacity:
                                    row.status === "O"
                                      ? ""
                                      : row.sample_status !== "N"
                                        ? "0.1"
                                        : ""
                                }}
                                className="fa fa-times"
                                aria-hidden="true"
                                onClick={AcceptandRejectSample.bind(
                                  this,
                                  this,
                                  row,
                                  "R"
                                )}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 120,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "sample_status",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sample Status" }}
                          />
                        ),
                        displayTemplate: row => {
                          return row.sample_status == "N"
                            ? "Not Done"
                            : row.sample_status == "A"
                              ? "Accepted"
                              : row.sample_status == "R"
                                ? "Rejected"
                                : null;
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "lab_id_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Lab ID Number" }}
                          />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_code" }} />
                        ),
                        disabled: false,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_name" }} />
                        ),
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "test_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "proiorty" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.test_type === "S" ? "Stat" : "Rotinue"}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "left" }
                        }
                      },
                      {
                        fieldName: "ordered_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "ordered_date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {this.changeDateFormat(row.ordered_date)}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "test_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "proiorty" }} />
                        ),
                        displayTemplate: row => {
                          return row.test_type == "S" ? "Stat" : "Rotuine";
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "status",
                        label: <AlgaehLabel label={{ fieldName: "status" }} />,
                        displayTemplate: row => {
                          return row.status == "O"
                            ? "Ordered"
                            : row.status == "CL"
                              ? "Collected"
                              : row.status == "CN"
                                ? "Cancelled"
                                : row.status == "CF"
                                  ? "Confirmed"
                                  : "Validated";
                        },
                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: this.state.sample_collection
                    }}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    samplecollection: state.samplecollection
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSampleCollection: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccessionAcknowledgement)
);
