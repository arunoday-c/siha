import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentProcess.css";
import {
  texthandler,
  LoadEncashment,
  ClearData,
  ProcessEncash,
  employeeSearch
} from "./EncashmentProcessEvents.js";
import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import LeaveEncashmentProcessIOputs from "../../../../Models/LeaveEncashmentProcess";

class LeaveEncashmentProcess extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
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
  }

  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search" data-validate="loadEncash">
            <AlagehFormGroup
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
            />

            <AlagehFormGroup
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
            </div>

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Encashment Type",
                isImp: false
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
                    sel_payment_type: null
                  });
                }
              }}
            />

            <div className="col form-group">
              <button
                style={{ marginTop: 21 }}
                className="btn btn-primary"
                onClick={LoadEncashment.bind(this, this)}
              >
                Load
              </button>
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
                        fieldName: "leave_id",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.leaveMaster === undefined
                              ? []
                              : this.props.leaveMaster.filter(
                                  f => f.hims_d_leave_id === row.leave_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].leave_description
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "leave_days",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
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
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "AirfareAmount" }}
                          />
                        )
                      },
                      {
                        fieldName: "AirfareTotalMonth",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Total Month" }}
                          />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.encashDetail }}
                    isEditable={true}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
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
              >
                <AlgaehLabel
                  label={{ forceLabel: "Process", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LeaveEncashmentProcess)
);
