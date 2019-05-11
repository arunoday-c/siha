import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import RadResultEntry from "../RadResultEntry/RadResultEntry";

import "./RadScheduledList.css";
import "./../../../styles/site.css";

import {
  texthandle,
  PatientSearch,
  datehandle,
  getRadTestList,
  openResultEntry,
  closeResultEntry,
  Refresh
} from "./RadScheduledListEvents";

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
import { algaehApiCall } from "../../../utils/algaehApiCall";

import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";

class RadScheduledList extends Component {
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
      resultEntry: false,
      selectedPatient: {}
    };
  }

  componentDidMount() {
    getRadTestList(this, this);
  }
  changeDateFormat = date => {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  generateReport(row) {
    debugger;
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: "radiologyReport",
          reportParams: [
            {
              name: "hims_d_patient_id",
              value: row.patient_id
            },
            {
              name: "visit_id",
              value: row.visit_id
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = "Radiology";
      }
    });
  }

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

  render() {
    // let sampleCollection =
    //   this.state.billdetails === null ? [{}] : this.state.billdetails;
    return (
      <React.Fragment>
        <div className="hptl-phase1-rad-work-list-form">
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
                    fieldName: "status"
                  }}
                  selector={{
                    name: "status",
                    className: "select-fld",
                    value: this.state.status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: FORMAT_RAD_STATUS
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

                <div className="col" style={{ paddingTop: "21px" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={getRadTestList.bind(this, this)}
                  >
                    Load{" "}
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
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Radiology Work List</h3>
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
                <div className="portlet-body">
                  <AlgaehDataGrid
                    id="Scheduled_list_grid"
                    columns={[
                      {
                        fieldName: "actions",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Print Report" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <i
                              style={{
                                pointerEvents:
                                  row.status === "RA" ? "" : "none",
                                opacity: row.status === "RA" ? "" : "0.1"
                              }}
                              className="fa fa-print"
                              onClick={this.generateReport.bind(this, row)}
                            />
                          );
                        },
                        others: {
                          fixed: "left",
                          maxWidth: 100
                        }
                      },
                      {
                        fieldName: "patient_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "patient_code" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span
                              className={row.status !== "O" ? "pat-code" : ""}
                              onClick={
                                row.status !== "O"
                                  ? openResultEntry.bind(this, this, row)
                                  : null
                              }
                            >
                              {row.patient_code}
                            </span>
                          );
                        },
                        className: drow => {
                          return drow.status !== "O" ? "greenCell" : null;
                        },
                        disabled: false,
                        others: {
                          maxWidth: 200,
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
                          maxWidth: 200,
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
                            ? "Ordered"
                            : row.status === "S"
                            ? "Scheduled"
                            : row.status === "UP"
                            ? "Under Process"
                            : row.status === "CN"
                            ? "Cancelled"
                            : row.status === "RC"
                            ? "Confirmed"
                            : "Validated";
                        },
                        others: {
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "scheduled_date_time",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "scheduled_date_time" }}
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
                          maxWidth: 200,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      }
                    ]}
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
                    keyId="patient_code"
                    dataSource={{
                      data:
                        this.props.radtestlist === undefined
                          ? []
                          : this.props.radtestlist
                    }}
                    noDataText="No data available for selected period"
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
          <RadResultEntry
            open={this.state.resultEntry}
            onClose={closeResultEntry.bind(this, this)}
            selectedPatient={this.state.selectedPatient}
          />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    radtestlist: state.radtestlist,
    templatelist: state.templatelist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRadiologyTestList: AlgaehActions,
      getTemplateList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RadScheduledList)
);
