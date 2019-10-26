import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentAuth.scss";
import {
  texthandler,
  employeeSearch,
  LoadEncashment,
  getLeaveEncashDetails,
  AuthorizeLEaveEncash,
  getLeaveLevels,
  dateFormater
} from "./LeaveEncashmentAuthEvents.js";

import moment from "moment";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getYears } from "../../../../utils/GlobalFunctions";

class LeaveEncashmentAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: moment().year(),
      hospital_id: null,
      employee_name: null,
      employee_id: null,
      sub_department_id: null,
      EncashHeader: [],
      EncashDetail: [],
      EncashDetailPer: [],
      leave_levels: [],
      auth_level: null
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
      this.props.all_departments === undefined ||
      this.props.all_departments.length === 0
    ) {
      this.props.getDepartments({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DEPARTENTS_GET_DATA",
          mappingName: "all_departments"
        }
      });
    }

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

    getLeaveLevels(this, this);
  }

  render() {
    let allYears = getYears();
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search" data-validate="loadEncashAuth">
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
                  min: moment().year()
                }
              }}
            /> */}

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
            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Auth. Level",
                isImp: true
              }}
              selector={{
                name: "auth_level",
                value: this.state.auth_level,
                className: "select-fld",
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: this.state.leave_levels
                },
                onChange: texthandler.bind(this, this)
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-2 form-group mandatory" }}
              label={{
                forceLabel: "Branch.",
                isImp: true
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

            {/* <AlagehAutoComplete
              div={{ className: "col-2 form-group" }}
              label={{
                forceLabel: "Sub Dept.",
                isImp: false
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.props.all_departments
                },
                onChange: texthandler.bind(this, this),
                onClear: () => {
                  this.setState({
                    sub_department_id: null
                  });
                }
              }}
            /> */}

            <div className="col-2 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={employeeSearch.bind(this, this)}>
                {this.state.employee_name
                  ? this.state.employee_name
                  : "Search Employee"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>

            {/* <div className="col-3" style={{ marginTop: 10 }}>
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
                  <h6>
                    {this.state.employee_name
                      ? this.state.employee_name
                      : "------"}
                  </h6>
                </div>
                <div
                  className="col-lg-3"
                  style={{ borderLeft: "1px solid #ced4d8" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer"
                    }}
                    onClick={employeeSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div> */}

            <div className="col form-group">
              <button
                //  onClick={this.clearState.bind(this)}
                style={{ marginTop: 19 }}
                className="btn btn-default"
              >
                Clear
              </button>{" "}
              <button
                style={{ marginTop: 19, marginLeft: 5 }}
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
                <h3 className="caption-subject">Request Leave Encashment</h3>
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
                        fieldName: "action",
                        label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <i
                                className="fas fa-thumbs-up"
                                onClick={AuthorizeLEaveEncash.bind(
                                  this,
                                  this,
                                  "APR",
                                  row
                                )}
                              />
                              <i
                                className="fas fa-thumbs-down"
                                onClick={AuthorizeLEaveEncash.bind(
                                  this,
                                  this,
                                  "REJ",
                                  row
                                )}
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 120,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "encashment_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request No." }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span
                              className="pat-code"
                              onClick={getLeaveEncashDetails.bind(
                                this,
                                this,
                                row
                              )}
                            >
                              {row.encashment_number}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        )
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Name" }}
                          />
                        )
                      },
                      {
                        fieldName: "encashment_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Encashment Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{dateFormater(row.encashment_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "year",
                        label: <AlgaehLabel label={{ forceLabel: "Year" }} />
                      },
                      {
                        fieldName: "total_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Amount" }} />
                        )
                      }
                      // {
                      //   fieldName: "Airfare Amount",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Airfare Amount" }}
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
                    keyId="hims_f_leave_encash_header_id"
                    dataSource={{ data: this.state.EncashHeader }}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    // onRowSelect={row => {
                    //   getLeaveEncashDetails(this, row);
                    // }}
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
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Leave Description" }}
                          />
                        )
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
                        )
                      },
                      {
                        fieldName: "airfare_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Airfare Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "total_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Amount" }} />
                        )
                      }
                    ]}
                    keyId=""
                    dataSource={{ data: this.state.EncashDetailPer }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
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
    organizations: state.organizations,
    all_departments: state.all_departments
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmployees: AlgaehActions,
      getLeaveMaster: AlgaehActions,
      getOrganizations: AlgaehActions,
      getLeaveEncashLevels: AlgaehActions,
      getDepartments: AlgaehActions
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
