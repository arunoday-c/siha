import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentProcess.scss";
import {
  texthandler,
  LoadEncashment,
  ClearData,
  ProcessEncash,
  employeeSearch,
  numberhandle
} from "./EncashmentProcessEvents.js";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import LeaveEncashmentProcessIOputs from "../../../Models/LeaveEncashmentProcess";
import Options from "../../../Options.json";
import { getYears } from "../../../utils/GlobalFunctions";

class LeaveEncashmentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let IOputs = LeaveEncashmentProcessIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",

        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees"
        }
      });
    }

    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getLeaveMaster({
        uri: "/selfService/getLeaveMaster",
        method: "GET",

        redux: {
          type: "LEAVE_MASTER_GET_DATA",
          mappingName: "leaveMaster"
        }
      });
    }

    if (this.props.empData) {
      this.setState({
        employee_id: this.props.empData.hims_d_employee_id,
        sub_department_id: this.props.empData.sub_department_id,
        employee_type: this.props.empData.employee_type,
        gender: this.props.empData.sex,
        religion_id: this.props.empData.religion_id,
        isEmployee: true
      });
    }
  }

  render() {
    let allYears = getYears();
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div
            className="row inner-top-search"
            data-validate="loadEncash"
            style={{ marginTop: 2 }}
          >
            <AlagehAutoComplete
              div={{ className: "col-1 form-group mandatory" }}
              label={{
                forceLabel: "Year.",
                isImp: true
              }}
              selector={{
                name: "year",
                className: "select-fld",
                value: this.state.year,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: allYears
                },
                onChange: texthandler.bind(this, this),

                onClear: () => {
                  this.setState({
                    year: null
                  });
                }
              }}
            />
            {/* <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: texthandler.bind(this, this)
                },
                others: {
                  type: "number",
                  min: moment().year(),
                  disabled: this.state.lockEarnings
                }
              }}
            /> */}

            {/* <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Select A Employee",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "employee_name",
                value: this.state.employee_name,
                events: {},
                option: {
                  type: "text"
                },
                others: {
                  disabled: true
                }
              }}
            />
            <div
              className="col-1"
              style={{
                paddingLeft: 0,
                paddingTop: 25,
                paddingRight: 0
              }}
            >
              <span
                onClick={employeeSearch.bind(this, this)}
                style={{ cursor: "pointer" }}
              >
                <i className="fas fa-search" />
              </span>
            </div> */}

            {/* <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Encashment Type",
                isImp: true
              }}
              selector={{
                name: "encash_type",
                className: "select-fld",
                value: this.state.encash_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.ENCASH_TYPE
                },
                onChange: texthandler.bind(this, this),

                onClear: () => {
                  this.setState({
                    encash_type: null
                  });
                }
              }}
            /> */}
            {this.props.from_screen !== "SS" ? (
              <div className="col globalSearchCntr">
                <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                <h6 onClick={employeeSearch.bind(this, this)}>
                  {this.state.employee_name
                    ? this.state.employee_name
                    : "Search Employee"}
                  <i className="fas fa-search fa-lg"></i>
                </h6>
              </div>
            ) : null}

            <div className="col form-group">
              <button
                style={{ marginTop: 19 }}
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>{" "}
              <button
                style={{ marginTop: 19, marginLeft: 5 }}
                className="btn btn-primary"
                onClick={LoadEncashment.bind(this, this)}
              >
                Load
              </button>
            </div>

            {this.state.processed_already === true ? (
              <div className="col">
                <h6>Already Processed</h6>
              </div>
            ) : null}

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Generate Document No."
                }}
              />
              <h6>
                {this.state.encashment_number
                  ? this.state.encashment_number
                  : "----------"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Date"
                }}
              />
              <h6>
                {this.state.encashment_date
                  ? moment(this.state.encashment_date).format(
                      Options.dateFormat
                    )
                  : Options.dateFormat}
              </h6>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Encashment Details</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveEncashProcessGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveEncashProcessGrid"
                    datavalidate="leaveEncashProcessGrid"
                    columns={[
                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "close_balance",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Close Balance" }}
                          />
                        )
                      },
                      {
                        fieldName: "leave_days",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        ),
                        displayTemplate: row => {
                          return this.state.processed_already === false ? (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.leave_days,
                                className: "txt-fld",
                                name: "leave_days",
                                number: {
                                  thousandSeparator: ",",
                                  allowNegative: false
                                },
                                dontAllowKeys: ["-", "e"],
                                events: {
                                  onChange: numberhandle.bind(this, this, row)
                                },
                                others: {
                                  disabled: this.state.processed_already
                                }
                              }}
                            />
                          ) : (
                            row.leave_days
                          );
                        }
                      },
                      {
                        fieldName: "leave_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{getAmountFormart(row.leave_amount)}</span>
                          );
                        }
                      }
                      // {
                      //   fieldName: "Airfare Amount",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "AirfareAmount" }}
                      //     />
                      //   )
                      // },
                      // {
                      //   fieldName: "AirfareTotalMonth",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Airfare Total Month" }}
                      //     />
                      //   )
                      // }
                    ]}
                    keyId="leave_id"
                    dataSource={{ data: this.state.encashDetail }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={ProcessEncash.bind(this, this)}
                disabled={this.state.processBtn}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Request for Encashment",
                    returnText: true
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    all_employees: state.all_employees,
    leaveMaster: state.leaveMaster
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployees: AlgaehActions,
      getLeaveMaster: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LeaveEncashmentProcess)
);
