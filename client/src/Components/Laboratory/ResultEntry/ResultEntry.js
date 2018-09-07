import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Modal from "@material-ui/core/Modal";
import RichTextEditor from "react-quill";
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
import {
  RAD_EXAM_STATUS,
  FORMAT_RAD_STATUS,
  RAD_REPORT_TYPE
} from "../../../utils/GlobalVariables.json";
import { onchangegridcol, getAnalytes, onvalidate } from "./ResultEntryEvents";

class ResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test_analytes: []
    };
  }

  componentDidMount() {
    this.props.getUserDetails({
      uri: "/algaehappuser/selectAppUsers",
      method: "GET",
      redux: {
        type: "LAB_EMP_GET_DATA",
        mappingName: "labiologyusers"
      }
    });

    this.props.getProviderDetails({
      uri: "/employee/get",
      method: "GET",
      redux: {
        type: "DOCTOR_GET_DATA",
        mappingName: "providers"
      }
    });

    this.props.getLabAnalytes({
      uri: "/labmasters/selectAnalytes",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "labanalytes"
      }
    });
  }
  componentWillReceiveProps(newProps) {
    debugger;
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
    this.props.onClose && this.props.onClose(e);
  };

  dateFormater({ value }) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }
  render() {
    return (
      <div>
        <Modal open={this.props.open}>
          <div className="algaeh-modal">
            <div className="popupHeader">
              <h4>Result Entry</h4>
            </div>
            <div className="popupInner">
              <div className="patientInfo-lab-Top box-shadow-normal">
                <div className="patientName">
                  <h6>{this.state.full_name}</h6>
                  <p>{this.state.gender}</p>
                </div>
                <div className="patientDemographic">
                  <span>
                    DOB:
                    <b>
                      {moment(this.state.date_of_birth).format(
                        Options.dateFormat
                      )}
                    </b>
                  </span>
                  <span>
                    MRN: <b>{this.state.patient_code}</b>
                  </span>
                </div>
                <div className="patientDemographic">
                  <span>
                    Ref by:
                    <b>
                      {/* <AlagehAutoComplete
                        div={{}}
                        selector={{
                          name: "pre_approval",
                          className: "select-fld",
                          value: this.state.provider_id,
                          dataSource: {
                            textField: "full_name",
                            valueField: "hims_d_employee_id",
                            data: this.props.providers
                          },
                          onChange: null,
                          others: {
                            "data-subdata": true
                          }
                        }}
                      /> */}
                      {this.state.provider_id}
                    </b>
                  </span>
                  <span>
                    Ordered Date:
                    <b>
                      {moment(this.state.ordered_date).format(
                        Options.dateFormat
                      )}
                    </b>
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <h5 style={{ color: "gray" }}>
                          {this.state.service_code} -{this.state.service_name}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                      <div className="col-lg-12">
                        <div className="row">
                          <AlagehAutoComplete
                            div={{ className: "col-lg-3" }}
                            label={{
                              forceLabel: "Entered By"
                            }}
                            selector={{
                              name: "technician_id",
                              className: "select-fld",
                              value: this.state.technician_id,
                              dataSource: {
                                textField: "user_displayname",
                                valueField: "algaeh_d_app_user_id",
                                data: this.props.radiologyusers
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
                              name: "technician_id",
                              className: "select-fld",
                              value: this.state.technician_id,
                              dataSource: {
                                textField: "user_displayname",
                                valueField: "algaeh_d_app_user_id",
                                data: this.props.radiologyusers
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
                              name: "technician_id",
                              className: "select-fld",
                              value: this.state.technician_id,
                              dataSource: {
                                textField: "user_displayname",
                                valueField: "algaeh_d_app_user_id",
                                data: this.props.radiologyusers
                              },
                              onChange: null,
                              others: {
                                disabled: true
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 next_plain">
                      <div className="col-lg-12">
                        <div className="row">
                          <AlgaehDataGrid
                            id="Scheduled_list_grid"
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
                                  <AlgaehLabel
                                    label={{ forceLabel: "Analyte" }}
                                  />
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
                              //TODO
                              {
                                fieldName: "status",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Last Result" }}
                                  />
                                )
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
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        value: row.result,
                                        className: "txt-fld",
                                        name: "result",
                                        events: {
                                          onChange: onchangegridcol.bind(
                                            this,
                                            this,
                                            row
                                          )
                                        }
                                      }}
                                    />
                                  );
                                }
                              },

                              {
                                fieldName: "result_unit",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Units" }}
                                  />
                                )
                              },

                              {
                                fieldName: "confirm",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Confirm" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.confirm === "N" ? "No" : "Yes";
                                }
                              },
                              {
                                fieldName: "validate",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Validate" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.confirm === "N" ? "No" : "Yes";
                                }
                              },
                              {
                                fieldName: "run1",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Run1"
                                    }}
                                  />
                                )
                              },

                              {
                                fieldName: "run2",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Run2" }} />
                                )
                              },
                              {
                                fieldName: "run3",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "Run3" }} />
                                )
                              },
                              {
                                fieldName: "normal_low",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Normal Low" }}
                                  />
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
                                fieldName: "full_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Critical Type" }}
                                  />
                                )
                              },
                              //TODO
                              {
                                fieldName: "ordered_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Ammend" }}
                                  />
                                )
                              },
                              //TODO
                              {
                                fieldName: "status",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Equipment Name" }}
                                  />
                                )
                              },
                              //TODO
                              {
                                fieldName: "scheduled_date_time",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Remarks"
                                    }}
                                  />
                                )
                              }
                            ]}
                            keyId="patient_code"
                            dataSource={{
                              data: this.state.test_analytes
                            }}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="popupFooter">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onvalidate.bind(this, this)}
              >
                Validate
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
