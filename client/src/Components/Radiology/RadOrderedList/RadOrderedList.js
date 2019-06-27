import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import "./RadOrderedList.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  UpdateRadOrder,
  Refresh
} from "./RadOrderedListEvents";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import {
  FORMAT_PRIORITY,
  FORMAT_RAD_STATUS
} from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

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
    {
      /*this.props.getTestCategory({
      uri: "/labmasters/selectTestCategory",
      module: "laboratory",
      method: "GET",
      redux: {
        type: "TESTCATEGORY_GET_DATA",
        mappingName: "testcategory"
      }
    });*/
    }
    getRadTestList(this, this);
  }
  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-rad-list-form">
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
          > <AlgaehDateHandler
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
            {/*    <div className="col-lg-6">
              <div className="row">
               
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
                    fieldName: "Priority",
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
                    fieldName: "category_id"
                  }}
                  selector={{
                    name: "category_id",
                    className: "select-fld",
                    value: this.state.category_id,
                    dataSource: {
                      textField: "category_name",
                      valueField: "hims_d_test_category_id",
                      data: this.props.testcategory
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

              </div>
            </div>*/}
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
                    <ul className="ul-legend">
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
                    </ul>
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
                    filterable: false,

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
                        fieldName: "billed",
                        label: <AlgaehLabel label={{ fieldName: "billed" }} />,
                        displayTemplate: row => {
                          return row.billed === "N" ? <span className="badge badge-danger">Not Billed</span> : <span className="badge badge-success">Billed</span>;
                        },
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "service_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Test Name" }}
                          />
                        ),

                        disabled: true,
                          others: {
                          maxWidth: 130,
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
                          return row.status === "O"
                             ? <span className="badge badge-info">Ordered</span>
                            : row.status === "S"
                            ? <span className="badge badge-warning">Scheduled</span>
                            : row.status === "UP"
                            ? <span className="badge badge-warning">Under Process</span>
                            : row.status === "CN"
                            ? <span className="badge badge-danger">Cancelled</span>
                            : row.status === "RC"
                            ? <span className="badge badge-success">Result Confirmed</span>
                            : <span className="badge badge-success">Result Available</span>
                        },
                        others: {
                          maxWidth: 130,
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
                          return (
                            <span>
                              {row.test_type === "S" ? "Stat" : "Routine"}
                            </span>
                          );
                        },
                        disabled: true,
                        others: {
                          maxWidth: 130,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "ordered_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Ordered Date & Time" }} />
                        ),
                        // displayTemplate: row => {
                        //   return (
                        //     <span>
                        //       {this.changeDateFormat(row.ordered_date)}
                        //     </span>
                        //   );
                        // },
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
                        // displayTemplate: row => {
                        //   return (
                        //     <span>
                        //       {this.changeDateFormat(row.scheduled_date_time)}
                        //     </span>
                        //   );
                        // },
                        disabled: true,
                        others: {
                          maxWidth: 150,
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
                    rowClassName={row => {
                      return row.status === "S"
                        ? "scheduledClass"
                        : row.status === "CN"
                        ? "cancelledClass"
                        : row.status === "RC"
                        ? "confirmedClass"
                        : row.status === "RA"
                        ? "availableClass"
                        : row.status === "UP"
                        ? "underProcessClass"
                        : null;
                    }}
                    filter="true"
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
