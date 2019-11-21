import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "react-quill/dist/quill.snow.css";
import "./ResultEntry.scss";
import "./../../../styles/site.scss";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import moment from "moment";
import Options from "../../../Options.json";
import { FORMAT_YESNO } from "../../../utils/GlobalVariables.json";
import {
  onchangegridcol,
  getAnalytes,
  onvalidate,
  onconfirm,
  confirmedgridcol,
  onReRun,
  resultEntryUpdate,
  onchangegridresult,
  onchangeAmend,
  generateLabResultReport,
  addComments,
  deleteComment
} from "./ResultEntryEvents";
import AlgaehReport from "../../Wrapper/printReports";

class ResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: [],
      run_type: "N",
      comments: "",
      comments_data: [],
      test_comments_id: null,
      comment_list: [],
      selcted_comments: ""
    };
  }

  selectCommentEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value,
      selcted_comments: e.selected.commet
    });
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  showReport(refBy) {
    // console.log("test_analytes:", this.state.test_analytes);

    AlgaehReport({
      report: {
        fileName: "haematologyReport"
      },
      data: {
        investigation_name: this.state.service_name,
        test_analytes: this.state.test_analytes,
        payment_type: "cash",
        patient_code: this.state.patient_code,
        full_name: this.state.full_name,
        advance_amount: "PAT-00000asdfadsf",
        receipt_number: "123456",
        receipt_date: this.state.ordered_date,
        doctor_name: refBy,
        test_name: this.state.service_name,
        specimen: this.state.specimen
      }
    });
  }

  componentDidMount() {
    if (
      this.props.labiologyusers === undefined ||
      this.props.labiologyusers.length === 0
    ) {
      this.props.getUserDetails({
        uri: "/algaehappuser/selectAppUsers",
        method: "GET",
        redux: {
          type: "LAB_EMP_GET_DATA",
          mappingName: "labiologyusers"
        }
      });
    }
    if (
      this.props.providers === undefined ||
      this.props.providers.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "providers"
        }
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
          mappingName: "labanalytes"
        }
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (
      newProps.selectedPatient !== undefined &&
      newProps.selectedPatient.open === true
    ) {
      newProps.selectedPatient.open = false;
      this.setState({ ...this.state, ...newProps.selectedPatient }, () => {
        getAnalytes(this, this);
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        test_analytes: [],
        comments_data: [],
        test_comments_id: null,
        comment_list: []
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  render() {
    let display =
      this.props.providers === undefined
        ? []
        : this.props.providers.filter(
          f => f.hims_d_employee_id === this.state.provider_id
        );
    let color_display = this.state.critical_status === "N" ? "badge badge-primary" : "badge badge-danger"
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Result Entry"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div
              className="popRightDiv"
              style={{ padding: 0, maxHeight: "79vh" }}
            >
              <div className="col-lg-12">
                <div className="row">
                  <div className="patientInfo-lab-Top box-shadow-normal">
                    <div className="patientName">
                      <h6>{this.state.full_name}</h6>
                      <p>{this.state.gender}</p>
                    </div>
                    <div className="patientDemographic">
                      <span>
                        DOB:&nbsp;
                        <b>
                          {moment(this.state.date_of_birth).format(
                            Options.dateFormat
                          )}
                        </b>
                      </span>
                      <span>
                        MRN:&nbsp;<b>{this.state.patient_code}</b>
                      </span>
                    </div>
                    <div className="patientDemographic">
                      <span>
                        Ref by:&nbsp;
                        <b>
                          {display !== null && display.length !== 0
                            ? display[0].full_name
                            : ""}
                        </b>
                      </span>
                      <span>
                        Ordered Date:&nbsp;
                        <b>
                          {moment(this.state.ordered_date).format(
                            Options.dateFormat
                          )}
                        </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-3">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Test Name"
                          }}
                        />

                        <h6>
                          {this.state.service_name
                            ? this.state.service_name
                            : "------"}
                        </h6>
                      </div>
                      <div className="col-lg-2">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Critical"
                          }}
                        />

                        <h6 className={color_display}>
                          {this.state.critical_status === "N"
                            ? "No"
                            : "Yes"}
                        </h6>
                      </div>


                      <AlagehAutoComplete
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Entered By"
                        }}
                        selector={{
                          name: "entered_by",
                          className: "select-fld",
                          value: this.state.entered_by,
                          dataSource: {
                            textField: "username",
                            valueField: "algaeh_d_app_user_id",
                            data: this.props.labiologyusers
                          },
                          onChange: null,
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Confirmed By"
                        }}
                        selector={{
                          name: "confirmed_by",
                          className: "select-fld",
                          value: this.state.confirmed_by,
                          dataSource: {
                            textField: "username",
                            valueField: "algaeh_d_app_user_id",
                            data: this.props.labiologyusers
                          },
                          onChange: null,
                          others: {
                            disabled: true
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-2" }}
                        label={{
                          forceLabel: "Validtaed By"
                        }}
                        selector={{
                          name: "validated_by",
                          className: "select-fld",
                          value: this.state.validated_by,
                          dataSource: {
                            textField: "username",
                            valueField: "algaeh_d_app_user_id",
                            data: this.props.labiologyusers
                          },
                          onChange: null,
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-lg-12" id="labResultGrid_Cntr">
                    <AlgaehDataGrid
                      id="labResult_list_grid"
                      columns={[
                        {
                          fieldName: "status",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Analyte Status" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.status === "E" ? (
                              <span className="badge badge-secondary">
                                Result Entered
                              </span>
                            ) : row.status === "C" ? (
                              <span className="badge badge-primary">
                                Confirmed
                              </span>
                            ) : row.status === "V" ? (
                              <span className="badge badge-success">
                                Validated
                              </span>
                            ) : (
                                    <span className="badge badge-light">
                                      Result Not Entered
                              </span>
                                  );
                          },
                          others: {
                            maxWidth: 150,
                            resizable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "analyte_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Analyte" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.labanalytes === undefined
                                ? []
                                : this.props.labanalytes.filter(
                                  f =>
                                    f.hims_d_lab_analytes_id ===
                                    row.analyte_id
                                );

                            return (
                              <span>
                                {display !== null && display.length !== 0
                                  ? display[0].description
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 250,
                            resizable: false,
                            style: { textAlign: "left" }
                          }
                        },
                        {
                          fieldName: "analyte_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Analyte Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return row.analyte_type === "QU"
                              ? "Quality"
                              : row.analyte_type === "QN"
                                ? "Quantity"
                                : "Text";
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "result",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Result"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.result,
                                      className: "txt-fld",
                                      name: "result",
                                      number:
                                        row.analyte_type === "QN"
                                          ? true
                                          : undefined,
                                      events: {
                                        onChange: onchangegridresult.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        placeholder: "Enter Result"
                                      }
                                    }}
                                  />
                                ) : (
                                    row.result
                                  )}
                              </span>
                            );
                          },
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },

                        {
                          fieldName: "result_unit",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Units" }} />
                          ),
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "run1",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Run 1"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run1 !== "null" ? row.run1 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },

                        {
                          fieldName: "run2",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Run 2" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run2 !== "null" ? row.run2 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "run3",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Run 3" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run3 !== "null" ? row.run3 : "----"}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "critical_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return !row.critical_type ? null : row.critical_type ===
                              "N" ? (
                                <span className="badge badge-success">
                                  Normal
                              </span>
                              ) : row.critical_type === "CL" ? (
                                <span className="badge badge-danger">
                                  Critical Low
                              </span>
                              ) : row.critical_type === "CH" ? (
                                <span className="badge badge-danger">
                                  Critical High
                              </span>
                              ) : row.critical_type === "L" ? (
                                <span className="badge badge-warning">Low</span>
                              ) : (
                                      row.critical_type === "H" && (
                                        <span className="badge badge-warning">
                                          High
                                </span>
                                      )
                                    );
                          }
                        },
                        {
                          fieldName: "normal_low",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                          ),
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "normal_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Normal High" }}
                            />
                          ),
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "critical_low",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Critical Low"
                              }}
                            />
                          ),
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },

                        {
                          fieldName: "critical_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical High" }}
                            />
                          ),
                          others: {
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        //TODO
                        {
                          fieldName: "confirm",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Confirm" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "confirm",
                                      className: "select-fld",
                                      value: row.confirm,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO
                                      },
                                      onChange: confirmedgridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }}
                                  />
                                ) : row.confirm === "N" ? (
                                  "No"
                                ) : (
                                      "Yes"
                                    )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "validate",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Validate" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "validate",
                                      className: "select-fld",
                                      value: row.validate,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO
                                      },
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }}
                                  />
                                ) : row.confirm === "N" ? (
                                  "No"
                                ) : (
                                      "Yes"
                                    )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        //TODO
                        {
                          fieldName: "amended",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Amend" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.amended === "N" ? (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "amended",
                                      className: "select-fld",
                                      value: row.amended,
                                      dataSource: {
                                        textField: "name",
                                        valueField: "value",
                                        data: FORMAT_YESNO
                                      },
                                      onChange: onchangeAmend.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }}
                                  />
                                ) : row.amended === "N" ? (
                                  "No"
                                ) : (
                                      "Yes"
                                    )}
                              </span>
                            );
                          },
                          others: {
                            maxWidth: 70,
                            resizable: false,
                            filterable: false,
                            style: { textAlign: "center" }
                          }
                        },
                        {
                          fieldName: "remarks",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Remarks"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.validate === "N" ? (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.remarks,
                                      className: "txt-fld",
                                      name: "remarks",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                ) : row.remarks !== "null" ? (
                                  row.remarks
                                ) : (
                                      ""
                                    )}
                              </span>
                            );
                          },
                          others: {
                            filterable: false,
                            minWidth: 250,
                            resizable: false
                          }
                        }
                      ]}
                      keyId="patient_code"
                      filter={true}
                      dataSource={{
                        data: this.state.test_analytes
                      }}
                      paging={{ page: 0, rowsPerPage: 30 }}
                    />
                  </div>
                  <div className="col-5">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-12" }}
                        label={{
                          forceLabel: "Select Comment"
                        }}
                        selector={{
                          name: "test_comments_id",
                          className: "select-fld",
                          value: this.state.test_comments_id,
                          dataSource: {
                            textField: "commnet_name",
                            valueField: "hims_d_investigation_test_comments_id",
                            data: this.state.comments_data
                          },
                          onChange: this.selectCommentEvent.bind(this),
                          onClear: () => {
                            this.setState({
                              test_comments_id: null,
                              selcted_comments: ""
                            })
                          }
                        }}
                      />
                      <div className="col-12">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Enter Comment"
                          }}
                        />

                        <textarea
                          value={this.state.selcted_comments}
                          name="selcted_comments"
                          onChange={this.textAreaEvent.bind(this)}
                        />
                      </div>

                      <div className="col-12">
                        <button
                          onClick={addComments.bind(this, this)}
                          className="btn btn-primary"
                          style={{ marginBottom: 15 }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-7">
                    <div className="row finalCommentsSection">
                      <h6>View Final Comments</h6>
                      <ol>
                        {this.state.comment_list.length > 0
                          ? this.state.comment_list.map((row, index) => {
                            return (
                              <React.Fragment key={index}>
                                <li key={index}>
                                  <a>{row}</a>
                                  <i className="fas fa-times" onClick={deleteComment.bind(this, this, row)}></i>
                                </li>
                              </React.Fragment>
                            );
                          })
                          : null}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <button
                className="btn btn-primary"
                onClick={generateLabResultReport.bind(this, this.state)}
                disabled={this.state.status === "V" ? false : true}
              >
                Print
              </button>

              {/* <button
                className="btn btn-primary"
                onClick={this.showReport.bind(
                  this,
                  display !== null && display.length !== 0
                    ? display[0].full_name
                    : ""
                )}
                disabled={this.state.status === "V" ? false : true}
              >
                Print
              </button> */}

              <button
                type="button"
                className="btn btn-primary"
                onClick={onReRun.bind(this, this)}
                disabled={
                  this.state.entered_by !== null
                    ? this.state.run_type === 3
                      ? true
                      : false
                    : true
                }
              >
                Re-Run
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onvalidate.bind(this, this)}
                disabled={this.state.status === "V" ? true : false}
              >
                Validate All
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={onconfirm.bind(this, this)}
                disabled={
                  this.state.status === "C"
                    ? true
                    : this.state.status === "V"
                      ? true
                      : false
                }
              >
                Confirm All
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={resultEntryUpdate.bind(this, this)}
                disabled={this.state.status === "V" ? true : false}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={e => {
                  this.onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    labiologyusers: state.labiologyusers,
    providers: state.providers,
    testanalytes: state.testanalytes,
    labanalytes: state.labanalytes
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getTestAnalytes: AlgaehActions,
      getLabAnalytes: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ResultEntry)
);
