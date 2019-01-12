import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentAuth.css";
import { texthandler } from "./LeaveEncashmentAuthEvents.js";

import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";

class LeaveEncashmentAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year()
    };
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }

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

    if (
      this.props.encashAuth === undefined ||
      this.props.encashAuth.length === 0
    ) {
      this.props.getLeaveEncashLevels({
        uri: "/encashmentprocess/getLeaveEncashLevels",
        method: "GET",

        redux: {
          type: "ENCASH_AUTH_GET_DATA",
          mappingName: "encashAuth"
        }
      });
    }
  }
  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search">
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
                  min: moment().year()
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Authorization Level",
                isImp: true
              }}
              selector={{
                name: "auth_level",
                value: this.state.auth_level,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.props.encashAuth
                },
                onChange: texthandler.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: false
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations
                },
                onChange: texthandler.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Departement",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",

                dataSource: {},
                others: {}
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Filter by Employee",
                isImp: false
              }}
              selector={{
                name: "",
                className: "select-fld",
                dataSource: {},
                others: {}
              }}
            />

            <div className="col form-group">
              <button style={{ marginTop: 21 }} className="btn btn-primary">
                Load
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Encashment Requests</h3>
              </div>
              <div className="actions">
                {/* <a className="btn btn-primary btn-circle active">
                  <i className="fas fa-pen" />
                </a> */}
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="leaveEncashGrid_Cntr">
                  <AlgaehDataGrid
                    id="leaveEncashGrid"
                    datavalidate="leaveEncashGrid"
                    columns={[
                      {
                        fieldName: "EncashmentRequestNo",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request No." }} />
                        )
                      },
                      {
                        fieldName: "leaveType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDesc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfLeave",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
                      },
                      {
                        fieldName: "EncashmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
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
                    dataSource={{ data: [] }}
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

        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  Encashment Details of: <b>Employee Name</b>
                </h3>
              </div>
              <div className="actions" />
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="previousLeaveAppGrid_Cntr">
                  <AlgaehDataGrid
                    id="previousLeaveAppGrid"
                    datavalidate="previousLeaveAppGrid"
                    columns={[
                      {
                        fieldName: "leaveType",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave Type" }} />
                        )
                      },
                      {
                        fieldName: "LeaveDesc",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
                      },
                      {
                        fieldName: "NoOfLeave",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "No. of Leave" }} />
                        )
                      },
                      {
                        fieldName: "EncashmentAmount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "Airfare Amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "BalanceLeaveInDays",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Balance Leave In Days" }}
                          />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: [] }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{}}
                    others={{}}
                  />
                </div>
              </div>
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
    leaveMaster: state.leaveMaster,
    encashAuth: state.encashAuth,
    organizations: state.organizations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployees: AlgaehActions,
      getLeaveMaster: AlgaehActions,
      getOrganizations: AlgaehActions,
      getLeaveEncashLevels: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LeaveEncashmentAuth)
);
