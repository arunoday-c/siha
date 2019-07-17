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
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import Enumerable from "linq";
import {
  FORMAT_PRIORITY,
  FORMAT_TEST_STATUS
} from "../../../utils/GlobalVariables.json";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import _ from "lodash";
// import { swalMessage } from "../../../utils/algaehApiCall";

class AccessionAcknowledgement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      to_date: new Date(),
      // from_date: moment("01" + month + year, "DDMMYYYY")._d,
      from_date: new Date(),
      patient_code: null,
      patient_name: null,
      patient_id: null,
      sample_collection: [],
      selected_patient: null,
      isOpen: false,
      reject_popup: false,
      selectedRow: {},
      remarks: "",
      proiorty: null,
      status: null
    };
  }

  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
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
    let _Ordered = [];

    let _Collected = [];

    let _Confirmed = [];
    let _Validated = [];

    let _Cancelled = [];
    if (this.state.sample_collection !== undefined) {
      _Ordered = _.filter(this.state.sample_collection, f => {
        return f.status === "O";
      });

      _Collected = _.filter(this.state.sample_collection, f => {
        return f.status === "CL";
      });

      _Validated = _.filter(this.state.sample_collection, f => {
        return f.status === "V";
      });
      _Confirmed = _.filter(this.state.sample_collection, f => {
        return f.status === "CF";
      });

      _Cancelled = _.filter(this.state.sample_collection, f => {
        return f.status === "CN";
      });
    }

    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          title="Remarks"
          openPopup={this.state.reject_popup}
          class="accessionRemarkPopUp"
          events={{
            onClose: () => {
              this.setState({
                reject_popup: false
              });
            }
          }}
        >
          {/* <AlagehFormGroup
           div={{ className: "col form-group" }}
           label={{
           forceLabel: "Enter Label Here",
          isImp: false
            }}
           textBox={{
          className: "txt-fld",
          name: "remarks" ,
          value: this.state.remarks,
          events: {},
          others:{{
          type:"text"
           }}
          }}
          /> */}
          <div className="popupInner">
            <div className="col-12">
              <label>Reason for Rejection</label>
              <textarea
                className="textArea"
                name="remarks"
                value={this.state.remarks}
                onChange={texthandle.bind(this, this)}
              />
            </div>
          </div>
          <div className="popupFooter">
            <div className="col-12">
              <button
                onClick={AcceptandRejectSample.bind(
                  this,
                  this,
                  this.state.selectedRow,
                  "R"
                )}
                type="button"
                className="btn btn-primary"
              >
                Save
              </button>
              <button
                onClick={() => {
                  this.setState({
                    reject_popup: false,
                    remarks: ""
                  });
                }}
                type="button"
                className="btn btn-default"
              >
                Cancel
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>

        <div className="hptl-phase1-accession-acknowledgement-form">
          {/* <BreadCrumb
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
          /> */}

          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "from_date" }}
              textBox={{ className: "txt-fld", name: "from_date" }}
              events={{
                onChange: datehandle.bind(this, this)
              }}
              value={this.state.from_date}
            />
            <AlgaehDateHandler
              div={{ className: "col-2" }}
              label={{ fieldName: "to_date" }}
              textBox={{ className: "txt-fld", name: "to_date" }}
              events={{
                onChange: datehandle.bind(this, this)
              }}
              value={this.state.to_date}
            />

            <div className="col" style={{ paddingTop: "19px" }}>
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
          <div className="row  margin-bottom-15 topResultCard">
            <div className="col-12">
              <div className="card-group">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Collected.length}</h5>{" "}
                    <p className="card-text">
                      <span className="badge badge-secondary">Collected</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Confirmed.length}</h5>{" "}
                    <p className="card-text">
                      <span className="badge badge-primary">Confirmed</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Cancelled.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-danger">Cancelled</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Validated.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-success">Validated</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Specimen Acknowledgement List
                    </h3>
                  </div>
                </div>

                <div
                  className="portlet-body"
                  id="accessionAcknoweldgeGrid_Cntr"
                >
                  <AlgaehDataGrid
                    id="accessionAcknoweldgeGrid"
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
                                    row.sample_status === "A" ? "none" : "",

                                  opacity:
                                    row.sample_status === "A" ? "0.1" : ""
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
                                    row.sample_status === "A" ? "none" : "",

                                  opacity:
                                    row.sample_status === "A" ? "0.1" : ""
                                }}
                                className="fa fa-times"
                                aria-hidden="true"
                                onClick={() => {
                                  this.setState({
                                    reject_popup: true,
                                    selectedRow: row
                                  });
                                }}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 120,
                          resizable: false,
                          style: { textAlign: "center" },
                          filterable: false
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
                          maxWidth: 150,
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
                          return row.test_type === "S" ? (
                            <span className="badge badge-danger">Stat</span>
                          ) : (
                            <span className="badge badge-secondary">
                              Routine
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 90,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "sample_status",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Specimen Status" }}
                          />
                        ),
                        displayTemplate: row => {
                          return row.sample_status === "N" ? (
                            <span className="badge badge-warning">Pending</span>
                          ) : row.sample_status === "A" ? (
                            <span className="badge badge-success">
                              Accepted
                            </span>
                          ) : row.sample_status === "R" ? (
                            <span className="badge badge-danger">Rejected</span>
                          ) : null;
                        },
                        disabled: true,
                        others: {
                          maxWidth: 140,
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
                          maxWidth: 140,
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
                          maxWidth: 150,
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
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Test Name" }} />
                        ),

                        disabled: true,
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "status",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Test Status" }} />
                        ),
                        displayTemplate: row => {
                          return row.status === "CL" ? (
                            <span className="badge badge-secondary">
                              Collected
                            </span>
                          ) : row.status === "CN" ? (
                            <span className="badge badge-danger">
                              Cancelled
                            </span>
                          ) : row.status === "CF" ? (
                            <span className="badge badge-primary">
                              Confirmed
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              Validated
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 90,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data: Enumerable.from(this.state.sample_collection)
                        .where(w => w.status !== "O")
                        .toArray()
                    }}
                    filter={true}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 20 }}
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
