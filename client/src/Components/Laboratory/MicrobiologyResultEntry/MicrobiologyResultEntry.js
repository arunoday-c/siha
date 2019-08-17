import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "react-quill/dist/quill.snow.css";
import "./MicrobiologyResultEntry.css";
import "./../../../styles/site.css";
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
  texthandle,
  onvalidate,
  onconfirm,
  resultEntryUpdate,
  onchangegridcol,
  generateLabResultReport,
  radioChange,
  getMicroResult
} from "./MicrobiologyResultEntryEvents";
import AlgaehReport from "../../Wrapper/printReports";

class MicrobiologyResultEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: "",
      group_id: null,
      radioGrowth: false,
      radioNoGrowth: true,
      organism_type: null,
      microAntbiotic: [],
      data_exists: false
    };
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
    this.props.getMicroGroups({
      uri: "/labmasters/selectMicroGroup",
      module: "laboratory",
      method: "GET",
      data: { group_status: "A" },
      redux: {
        type: "MICROGROUPS_GET_DATA",
        mappingName: "microGroups"
      }
    });
  }
  componentWillReceiveProps(newProps) {
    debugger;
    if (
      newProps.selectedPatient !== undefined &&
      newProps.selectedPatient.microopen === true
    ) {
      debugger;
      newProps.selectedPatient.microopen = false;
      newProps.selectedPatient.radioNoGrowth =
        newProps.selectedPatient.bacteria_type === "NG" ? true : false;
      newProps.selectedPatient.radioGrowth =
        newProps.selectedPatient.bacteria_type === "G" ? true : false;
      this.setState({ ...this.state, ...newProps.selectedPatient }, () => {
        getMicroResult(this, this);
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        comments: "",
        group_id: null,
        radioGrowth: false,
        radioNoGrowth: true,
        organism_type: null,
        microAntbiotic: []
      },
      () => {
        console.log(this.state);
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
              {" "}
              <div className="col-12">
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
                  <div className="col-12 growthDetailsCntr">
                    <div className="row">
                      <div className="col">
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
                      <AlagehAutoComplete
                        div={{ className: "col" }}
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
                        div={{ className: "col" }}
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
                        div={{ className: "col" }}
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
                      <div className="col">
                        <label>Growth Type</label>
                        <div
                          className="customRadio"
                          style={{ borderBottom: 0 }}
                        >
                          <label className="radio inline">
                            <input
                              type="radio"
                              value="NoGrowth"
                              checked={this.state.radioNoGrowth}
                              onChange={radioChange.bind(this, this)}
                              disabled={this.state.data_exists}
                            />
                            <span>
                              <AlgaehLabel
                                label={{
                                  forceLabel: "No Growth"
                                }}
                              />
                            </span>
                          </label>

                          <label className="radio inline">
                            <input
                              type="radio"
                              value="Growth"
                              checked={this.state.radioGrowth}
                              onChange={radioChange.bind(this, this)}
                              disabled={this.state.data_exists}
                            />
                            <span>
                              <AlgaehLabel
                                label={{
                                  forceLabel: "growth"
                                }}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-8">
                    {this.state.radioGrowth === true ? (
                      <div className="row">
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Select Group",
                            isImp: this.state.radioGrowth
                          }}
                          selector={{
                            name: "group_id",
                            className: "select-fld",
                            value: this.state.group_id,
                            dataSource: {
                              textField: "group_name",
                              valueField: "hims_d_micro_group_id",
                              data: this.props.microGroups
                            },
                            onChange: texthandle.bind(this, this),
                            others: {
                              disabled: this.state.data_exists
                            }
                          }}
                        />
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Organism Type"
                            }}
                          />
                          <h6>
                            {this.state.organism_type
                              ? this.state.organism_type === "F"
                                ? "Fascideous"
                                : "Non-Fascideous"
                              : "------"}
                          </h6>
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Bacteria Name",
                            isImp: this.state.radioGrowth
                          }}
                          textBox={{
                            value: this.state.bacteria_name,
                            className: "txt-fld",
                            name: "bacteria_name",

                            events: {
                              onChange: texthandle.bind(this, this)
                            },
                            others: {
                              disabled: this.state.data_exists
                            }
                          }}
                        />
                        <div className="col-lg-12" id="microLabResultGrid_Cntr">
                          <AlgaehDataGrid
                            id="antibiotic_result"
                            columns={[
                              {
                                fieldName: "antibiotic_name",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Antibiotic" }}
                                  />
                                ),

                                others: {
                                  minWidth: 250,
                                  resizable: false,
                                  style: { textAlign: "left" }
                                }
                              },

                              {
                                fieldName: "susceptible",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "S"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <label className="checkbox inline">
                                      <input
                                        type="checkbox"
                                        name="susceptible"
                                        checked={
                                          row.susceptible === "Y" ? true : false
                                        }
                                        disabled={
                                          this.state.status === "V"
                                            ? true
                                            : false
                                        }
                                        onChange={onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </label>
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  filterable: false,
                                  style: { textAlign: "center" }
                                }
                              },

                              {
                                fieldName: "intermediate",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "I" }} />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <label className="checkbox inline">
                                      <input
                                        type="checkbox"
                                        name="intermediate"
                                        checked={
                                          row.intermediate === "Y"
                                            ? true
                                            : false
                                        }
                                        disabled={
                                          this.state.status === "V"
                                            ? true
                                            : false
                                        }
                                        onChange={onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </label>
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  filterable: false,
                                  style: { textAlign: "center" }
                                }
                              },
                              {
                                fieldName: "resistant",
                                label: (
                                  <AlgaehLabel label={{ forceLabel: "R" }} />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <label className="checkbox inline">
                                      <input
                                        type="checkbox"
                                        name="resistant"
                                        checked={
                                          row.resistant === "Y" ? true : false
                                        }
                                        disabled={
                                          this.state.status === "V"
                                            ? true
                                            : false
                                        }
                                        onChange={onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </label>
                                  );
                                },
                                others: {
                                  maxWidth: 200,
                                  resizable: false,
                                  filterable: false,
                                  style: { textAlign: "center" }
                                }
                              }
                            ]}
                            keyId="microAntbiotic"
                            filter={true}
                            dataSource={{
                              data: this.state.microAntbiotic
                            }}
                            paging={{ page: 0, rowsPerPage: 30 }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Remarks"
                      }}
                    />

                    <textarea
                      style={{ minHeight: "40vh" }}
                      value={this.state.comments}
                      name="comments"
                      onChange={this.textAreaEvent.bind(this)}
                    />
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

              <button
                type="button"
                className="btn btn-primary"
                onClick={onvalidate.bind(this, this)}
                disabled={this.state.status === "V" ? true : false}
              >
                Validate
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
                Confirm
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
    labanalytes: state.labanalytes,
    microGroups: state.microGroups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getTestAnalytes: AlgaehActions,
      getLabAnalytes: AlgaehActions,
      getMicroGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MicrobiologyResultEntry)
);
