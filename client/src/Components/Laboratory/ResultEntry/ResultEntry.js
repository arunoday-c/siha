import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Modal from "@material-ui/core/Modal";
import { bindActionCreators } from "redux";
import "react-quill/dist/quill.snow.css";
import "./ResultEntry.css";
import "./../../../styles/site.css";
import {
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel
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
  onchangegridamended
} from "./ResultEntryEvents";
import AlgaehReport from "../../Wrapper/printReports";

class ResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: [],
      run_type: "N"
    };
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
    this.setState({ test_analytes: [] }, () => {
      this.props.onClose && this.props.onClose(e);
    });
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
    return (
      <div>
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <div className="row">
                <div className="col-lg-8">
                  <h4>Result Entry</h4>
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    className=""
                    onClick={e => {
                      this.onClose(e);
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </button>
                </div>
              </div>
            </div>

            <div className="popupInner">
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
                            forceLabel: "Investigation Name"
                          }}
                        />

                        <h6>
                          {this.state.service_name
                            ? this.state.service_name
                            : "Lab Name"}
                        </h6>
                      </div>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
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
                        div={{ className: "col-lg-3" }}
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
                        div={{ className: "col-lg-3" }}
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
                            return row.status === "E"
                              ? "Entered"
                              : row.status === "C"
                              ? "Confirmed"
                              : row.status === "V"
                              ? "Validated"
                              : "Not Entered";
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
                          }
                        },

                        {
                          fieldName: "result_unit",
                          label: <AlgaehLabel label={{ forceLabel: "Units" }} />
                        },
                        {
                          fieldName: "run1",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Run1"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run1 !== "null" ? row.run1 : "----"}
                              </span>
                            );
                          }
                        },

                        {
                          fieldName: "run2",
                          label: <AlgaehLabel label={{ forceLabel: "Run2" }} />,
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run2 !== "null" ? row.run2 : "----"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "run3",
                          label: <AlgaehLabel label={{ forceLabel: "Run3" }} />,
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.run3 !== "null" ? row.run3 : "----"}
                              </span>
                            );
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
                            return row.critical_type === "N" ? (
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
                            ) : row.critical_type === "H" ? (
                              <span className="badge badge-warning">High</span>
                            ) : null;
                          }
                        },
                        {
                          fieldName: "normal_low",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Normal Low" }} />
                          )
                        },
                        {
                          fieldName: "normal_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Normal High" }}
                            />
                          )
                        },
                        {
                          fieldName: "critical_low",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Critical Low"
                              }}
                            />
                          )
                        },

                        {
                          fieldName: "critical_high",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Critical High" }}
                            />
                          )
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
                          }
                        },
                        //TODO
                        {
                          fieldName: "amended",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Ammend" }} />
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
                                      onChange: onchangegridamended.bind(
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
                          }
                        },
                        //TODO
                        // {
                        //   fieldName: "status",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Equipment Name" }}
                        //     />
                        //   )
                        // },
                        //TODO
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
                          }
                        }
                      ]}
                      keyId="patient_code"
                      dataSource={{
                        data: this.state.test_analytes
                      }}
                      paging={{ page: 0, rowsPerPage: 20 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <div className="col-lg-12">
                <button
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
                </button>

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
          </div>
        </Modal>
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResultEntry)
);
