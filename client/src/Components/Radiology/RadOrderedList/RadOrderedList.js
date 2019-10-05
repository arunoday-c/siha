import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./RadOrderedList.scss";
import "./../../../styles/site.scss";

import {
  datehandle,
  getRadTestList,
  UpdateRadOrder,
  Refresh
} from "./RadOrderedListEvents";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import _ from "lodash";

class RadOrderedList extends Component {
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
      category_id: null,
      test_status: null,
      rad_test_list: [],
      selected_patient: null,
      isOpen: false,
      proiorty: null
    };
  }

  componentDidMount() {
    getRadTestList(this, this);
  }
  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.datetimeFormat);
    }
  };

  render() {
    let _Ordered = [];
    let _Sheduled = [];

    let _Under_Process = [];

    let _Completed = [];

    let _Validated = [];

    let _Cancelled = [];
    if (this.props.radtestlist !== undefined) {
      _Ordered = _.filter(this.props.radtestlist, f => {
        return f.status === "O";
      });

      _Sheduled = _.filter(this.props.radtestlist, f => {
        return f.status === "S";
      });

      _Under_Process = _.filter(this.props.radtestlist, f => {
        return f.status === "UP";
      });

      _Completed = _.filter(this.props.radtestlist, f => {
        return f.status === "RC";
      });

      _Validated = _.filter(this.props.radtestlist, f => {
        return f.status === "RA";
      });

      _Cancelled = _.filter(this.props.radtestlist, f => {
        return f.status === "CN";
      });
    }
    return (
      <React.Fragment>
        <div className="hptl-phase1-rad-list-form">
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
                onClick={getRadTestList.bind(this, this)}
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
              {" "}
              <div className="card-group">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Ordered.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-light">Ordered</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Sheduled.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-secondary">Scheduled</span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Under_Process.length}</h5>
                    <p className="card-text">
                      <span className="badge badge-warning">
                        Process on going
                      </span>
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{_Completed.length}</h5>{" "}
                    <p className="card-text">
                      <span className="badge badge-primary">Completed</span>
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
                      <span className="badge badge-success">
                        Result Available
                      </span>
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
                    <h3 className="caption-subject">Radiology Ordered List</h3>
                  </div>

                  <div className="actions">
                    {/* <span> Status: </span> */}
                    {/* <ul className="ul-legend">
                      {FORMAT_RAD_STATUS.map((data, index) => (
                        <li key={index}>
                          <span
                            style={{
                              backgroundColor: data.color
                            }}
                          />
                          {data.name}
                        </li>
                      ))}
                    </ul> */}
                  </div>
                </div>
                <div className="portlet-body" id="RadOrderGridCntr">
                  <AlgaehDataGrid
                    id="Oedered_list_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                // disabled={row.arrived === "N" ? false : true}
                                style={{
                                  pointerEvents:
                                    row.arrived !== "N"
                                      ? "none"
                                      : row.billed === "N"
                                      ? "none"
                                      : "",

                                  opacity:
                                    row.arrived !== "N"
                                      ? "0.1"
                                      : row.billed === "N"
                                      ? "0.1"
                                      : ""
                                }}
                                className="fas fa-walking"
                                onClick={UpdateRadOrder.bind(this, this, row)}
                              />
                            </span>
                          );
                        },
                        others: {
                          fixed: "left",
                          maxWidth: 70,
                          resizable: false,
                          filterable: false
                        }
                      },
                      {
                        fieldName: "billed",
                        label: <AlgaehLabel label={{ fieldName: "billed" }} />,
                        displayTemplate: row => {
                          return row.billed === "N" ? (
                            <span className="badge badge-danger">
                              Not Billed
                            </span>
                          ) : (
                            <span className="badge badge-success">Billed</span>
                          );
                        },
                        others: {
                          maxWidth: 90,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },

                      {
                        fieldName: "ordered_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Ordered Date & Time" }}
                          />
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
                        fieldName: "scheduled_date_time",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Scheduled Date & Time" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {this.changeDateFormat(row.scheduled_date_time)}
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
                          <AlgaehLabel label={{ fieldName: "test_status" }} />
                        ),
                        displayTemplate: row => {
                          return row.status === "O" ? (
                            <span className="badge badge-light">Ordered</span>
                          ) : row.status === "S" ? (
                            <span className="badge badge-secondary">
                              Scheduled
                            </span>
                          ) : row.status === "UP" ? (
                            <span className="badge badge-warning">
                              Process On Going
                            </span>
                          ) : row.status === "CN" ? (
                            <span className="badge badge-danger">
                              Cancelled
                            </span>
                          ) : row.status === "RC" ? (
                            <span className="badge badge-primary">
                              Confirmed
                            </span>
                          ) : (
                            <span className="badge badge-success">
                              Result Available
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 90,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
                    keyId="patient_code"
                    dataSource={{
                      data:
                        this.props.radtestlist === undefined
                          ? []
                          : this.props.radtestlist
                    }}
                    // rowClassName={row => {
                    //   return row.status === "S"
                    //     ? "scheduledClass"
                    //     : row.status === "CN"
                    //     ? "cancelledClass"
                    //     : row.status === "RC"
                    //     ? "confirmedClass"
                    //     : row.status === "RA"
                    //     ? "availableClass"
                    //     : row.status === "UP"
                    //     ? "underProcessClass"
                    //     : null;
                    // }}
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
    testcategory: state.testcategory,
    radtestlist: state.radtestlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getTestCategory: AlgaehActions,
      getRadiologyTestList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadOrderedList)
);
