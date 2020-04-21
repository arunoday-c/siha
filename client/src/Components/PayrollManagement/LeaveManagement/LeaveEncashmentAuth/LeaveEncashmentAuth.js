import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./LeaveEncashmentAuth.scss";
import {
  texthandler,
  LoadEncashment,
  getLeaveEncashDetails,
  getLeaveLevels,
  dateFormater
} from "./LeaveEncashmentAuthEvents.js";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import Enumerable from "linq";

import moment from "moment";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall } from "../../../../utils/algaehApiCall";

import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import EncashmentAuthDtls from "./EncashmentAuthDtls";
import { MainContext } from "algaeh-react-components/context";

class LeaveEncashmentAuth extends Component {
  constructor(props) {
    super(props);
    let month = moment().format("MM");
    let year = moment().format("YYYY");

    this.state = {
      year: moment().year(),
      hospital_id: "",
      employee_name: null,
      employee_id: null,
      sub_department_id: null,
      EncashHeader: [],
      EncashDetail: [],
      EncashDetailPer: [],
      leave_levels: [],
      auth_level: null,
      isOpen: false,
      emp_name: null,
      authorized: "PEN",
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      leave_encash_level: null,
      encash_authorized: null
    };

    this.getHospitals();
    this.getHrmsOptions(this);
  }

  getHrmsOptions() {
    algaehApiCall({
      uri: "/payrollOptions/getHrmsOptions",
      method: "GET",
      module: "hrManagement",
      onSuccess: res => {
        if (res.data.success) {
          getLeaveLevels(this, res.data.result[0].leave_encash_level);
          this.setState({
            leave_encash_level: res.data.result[0].leave_encash_level
          });
        }
      }
    });
  }

  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records
          });
        }
      }
    });
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      hospital_id: userToken.hims_d_hospital_id
    });
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
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


  }
  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }
  clearState() {
    let month = moment().format("MM");
    let year = moment().format("YYYY");
    let auth_level =
      this.state.leave_levels.length > 0
        ? Enumerable.from(this.state.leave_levels).maxBy(w => w.value)
        : null;

    this.setState({
      to_date: new Date(),
      from_date: moment("01" + month + year, "DDMMYYYY")._d,
      employee_id: null,
      employee_name: null,
      auth_level: auth_level !== null ? auth_level.value : null,
      authorized: "PEN",
      leave_applns: [],
      EncashHeader: [],
      encash_authorized: null
    });
  }
  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id
          },
          () => { }
        );
      }
    });
  }

  closePopup() {
    this.setState(
      {
        isOpen: false
      },
      () => {
        LoadEncashment(this, this);
      }
    );
  }
  render() {
    return (
      <div className="leave_en_auth row">
        <div className="col-12">
          <div className="row inner-top-search" data-validate="loadEncashAuth">
            <AlagehAutoComplete
              div={{
                className: "col-lg-2 col-md-2 col-sm-12 form-group mandatory"
              }}
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

            <AlgaehDateHandler
              div={{
                className: "col-lg-2 col-md-2 col-sm-12 form-group mandatory"
              }}
              label={{ forceLabel: "From Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "from_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    from_date: selDate
                  });
                }
              }}
              value={this.state.from_date}
            />
            <AlgaehDateHandler
              div={{
                className: "col-lg-2 col-md-2 col-sm-12 form-group mandatory"
              }}
              label={{ forceLabel: "To Date", isImp: true }}
              textBox={{
                className: "txt-fld",
                name: "to_date"
              }}
              maxDate={new Date()}
              events={{
                onChange: selDate => {
                  this.setState({
                    to_date: selDate
                  });
                }
              }}
              value={this.state.to_date}
            />

            <AlagehAutoComplete
              div={{
                className: "col-lg-2 col-md-2 col-sm-12 form-group mandatory"
              }}
              label={{
                forceLabel: "Branch",
                isImp: true
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.state.hospitals
                },
                onChange: this.dropDownHandler.bind(this)
              }}
              showLoading={true}
            />

            <AlagehAutoComplete
              div={{ className: "col-lg-2 col-md-2 col-sm-12 form-group" }}
              label={{
                forceLabel: "Encashment Status",
                isImp: false
              }}
              selector={{
                name: "authorized",
                className: "select-fld",
                value: this.state.authorized,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.LEAVE_STATUS
                },
                onChange: this.dropDownHandler.bind(this)
              }}
            />

            <div className="col-lg-2 col-md-2 col-sm-12 globalSearchCntr">
              <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
              <h6 onClick={this.employeeSearch.bind(this)}>
                {this.state.employee_name
                  ? this.state.employee_name
                  : "Search Employee"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>

            <div
              className="col-lg-12 form-group"
              style={{ textAlign: "right" }}
            >
              <button
                onClick={this.clearState.bind(this)}
                className="btn btn-default"
              >
                Clear
              </button>
              <button
                //onClick={this.LoadEncashment.bind(this)}
                onClick={LoadEncashment.bind(this, this)}
                style={{ marginLeft: 5 }}
                className="btn btn-primary"
              >
                {!this.state.loading ? (
                  <span>Load</span>
                ) : (
                    <i className="fas fa-spinner fa-spin" />
                  )}
              </button>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">
                  List of Leave Encashment Request
                </h3>
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
                                className="fas fa-eye"
                                onClick={getLeaveEncashDetails.bind(
                                  this,
                                  this,
                                  row
                                )}
                              />
                            </span>
                          );
                        },
                        others: {
                          filterable: false,
                          maxWidth: 60
                        }
                      },
                      {
                        fieldName: "authorized",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.authorized === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : row.authorized === "APR" ? (
                                <span className="badge badge-success">
                                  Approved
                                </span>
                              ) : row.authorized === "REJ" ? (
                                <span className="badge badge-danger">
                                  Rejected
                                </span>
                              ) : row.authorized === "CAN" ? (
                                <span className="badge badge-danger">
                                  Cancelled
                                </span>
                              ) : (
                                        "------"
                                      )}
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
                        fieldName: "designation",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Designation" }} />
                        )
                      },
                      {
                        fieldName: "encashment_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request Code" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span className="pat-code">
                              {row.encashment_number}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "leave_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Applied Leave" }}
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
                        fieldName: "leave_days",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Applied Days" }} />
                        )
                      },

                      {
                        fieldName: "total_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total Amount" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{GetAmountFormart(row.total_amount)}</span>
                          );
                        }
                      }
                    ]}
                    keyId="hims_f_leave_encash_header_id"
                    dataSource={{ data: this.state.EncashHeader }}
                    isEditable={false}
                    filter={true}
                    loading={this.state.loading}
                    paging={{ page: 0, rowsPerPage: 10 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-12">
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
        </div> */}
        <EncashmentAuthDtls
          open={this.state.isOpen}
          onClose={this.closePopup.bind(this)}
          EncashDetailPer={this.state.EncashDetailPer}
          encash_authorized={this.state.encash_authorized}
        />
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
  connect(mapStateToProps, mapDispatchToProps)(LeaveEncashmentAuth)
);
