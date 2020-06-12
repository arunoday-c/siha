import React, { Component } from "react";
import "./AuthorizationSetup.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
// import GlobalVariables from "../../../../utils/GlobalVariables";

import { AlgaehActions } from "../../../../actions/algaehActions";
import { getCookie } from "../../../../utils/algaehApiCall";
// import Options from "../../../../Options.json";
// import moment from "moment";
import AuthorizationSetupEvent from "./AuthorizationSetupEvent";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

const handlers = AuthorizationSetupEvent();

class AuthorizationSetup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allDepartments: [],
      subDepts: [],
      designations: [],
      leave_level: null,
      loan_level: null,
      employees_list: [],
      department_id: null,
      sub_department_id: null,
      designation_id: null,
      processLeaveBtn: true,
      processLoanBtn: true,
      checkAll: false,
      Employeedetails: [],
      leave_level_set: "1",
      loan_level_set: "1",
      employee_id: null,
      saveEnable: true,

      lo_sub_department_id: null,
      lo_employee_id: null,
      lo_full_name: "",
      l_sub_department_id: null,
      l_employee_id: null,
      l_full_name: ""
    };
    this.baseState = this.state;

    // handlers.getAllSubDepartments(this);
    handlers.getDepartments(this);
    handlers.getOptions(this);
    handlers.getEmployeeDetails(this);
  }

  componentDidMount() {
    let prevLang = getCookie("Language");

    this.setState({
      selectedLang: prevLang
    });
  }
  dropDownHandler(e) {
    handlers.texthandle(this, e);
  }

  loadEmployees() {
    handlers.loadEmployees(this);
  }
  clearState() {
    this.setState({
      subDepts: [],
      designations: [],
      employees_list: [],
      department_id: null,
      sub_department_id: null,
      designation_id: null,
      processLeaveBtn: true,
      processLoanBtn: true,
      checkAll: false,
      Employeedetails: [],
      lo_sub_department_id: null,
      lo_employee_id: null,
      lo_full_name: "",
      l_sub_department_id: null,
      l_employee_id: null,
      l_full_name: "",
      leave_level_set: "1",
      loan_level_set: "1"
    });
  }
  selectAll(e) {
    handlers.selectAll(this, e);
  }
  selectToProcess(row, e) {
    handlers.selectToProcess(this, row, e);
  }
  radioChange(e) {
    const { name, value } = e.target;
    const type = name.split("_")[0];
    console.log(type);
    if (type === "leave") {
      this.setState({
        l_sub_department_id: null,
        l_employee_id: null,
        l_full_name: "",
        processLeaveBtn: true
      });
    }
    if (type === "loan") {
      this.setState({
        lo_sub_department_id: null,
        lo_employee_id: null,
        lo_full_name: "",
        processLoanBtn: true
      });
    }
    handlers.texthandle(this, { target: { name, value } });
  }

  searchSelect(frm_type, data) {
    if (frm_type === "Leave") {
      this.setState({
        l_sub_department_id: data.sub_department_id,
        l_employee_id: data.hims_d_employee_id,
        l_full_name: data.full_name,
        processLeaveBtn: false
      });
    } else if (frm_type === "Loan") {
      this.setState({
        lo_sub_department_id: data.sub_department_id,
        lo_employee_id: data.hims_d_employee_id,
        lo_full_name: data.full_name,
        processLoanBtn: false
      });
    }
  }

  processLoanAuth() {
    handlers.processLoanAuth(this);
  }
  processLeaveLevel() {
    handlers.processLeaveLevel(this);
  }

  SaveAuthorizationSetup() {
    handlers.SaveAuthorizationSetup(this);
  }

  render() {
    return (
      <div className="row">
        <div className="col-12">
          <div className="row inner-top-search FilterCompnentDiv">
            <AlagehAutoComplete
              div={{ className: "col-3 form-group mandatory" }}
              label={{ forceLabel: "Department", isImp: true }}
              selector={{
                name: "department_id",
                value: this.state.department_id,
                className: "select-fld",
                dataSource: {
                  textField: "department_name",
                  valueField: "hims_d_department_id",
                  data: this.state.allDepartments
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    department_id: null,
                    sub_department_id: null,
                    designation_id: null,
                    subDepts: [],
                    designations: []
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-3 form-group" }}
              label={{ forceLabel: "Sub Deptartment" }}
              selector={{
                name: "sub_department_id",
                value: this.state.sub_department_id,
                className: "select-fld",
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.state.subDepts
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    sub_department_id: null,
                    designation_id: null,
                    designations: []
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col-3 form-group" }}
              label={{ forceLabel: "Designation" }}
              selector={{
                name: "designation_id",
                value: this.state.designation_id,
                className: "select-fld",
                dataSource: {
                  textField: "designation",
                  valueField: "hims_d_designation_id",
                  data: this.state.designations
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    designation_id: null
                  });
                }
              }}
            />

            <div className="colform-group" style={{ paddingTop: 19 }}>
              <button
                onClick={this.loadEmployees.bind(this)}
                style={{ marginLeft: 10, float: "right" }}
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

        <div className="col-6">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Leave Authorization</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div
                  className="col-5 customRadio"
                  style={{ paddingTop: 24, borderBottom: "none" }}
                >
                  <label className="radio inline">
                    <input
                      type="radio"
                      name="leave_level_set"
                      value="1"
                      checked={
                        this.state.leave_level_set === "1" ? true : false
                      }
                      onChange={this.radioChange.bind(this)}
                    />
                    <span>Level 1</span>
                  </label>
                  {this.state.leave_level >= 2 ? (
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="leave_level_set"
                        value="2"
                        checked={
                          this.state.leave_level_set === "2" ? true : false
                        }
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>Level 2</span>
                    </label>
                  ) : null}
                  {this.state.leave_level >= 3 ? (
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="leave_level_set"
                        value="3"
                        checked={
                          this.state.leave_level_set === "3" ? true : false
                        }
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>Level 3</span>
                    </label>
                  ) : null}
                </div>

                <AlgaehAutoSearch
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Employee",
                    isImp: true
                  }}
                  ref={this.inputRef}
                  title="Search Employees"
                  id="item_id_search"
                  template={result => {
                    return (
                      <section className="resultSecStyles">
                        <div className="row">
                          <div className="col-8">
                            <h4 className="title">{result.employee_code}</h4>
                            <small>{result.full_name}</small>
                            <small>{result.department_name}</small>
                            <small>{result.sub_department_name}</small>
                          </div>
                          <div className="col-4" />
                        </div>
                      </section>
                    );
                  }}
                  name="l_employee_id"
                  columns={spotlightSearch.Employee_details.loginNewEmployee}
                  displayField="l_full_name"
                  value={this.state.l_full_name}
                  searchName="leave_auth"
                  onClick={this.searchSelect.bind(this, "Leave")}
                  extraParameters={{
                    leave_authorize_privilege: this.state.leave_level_set
                  }}
                  onClear={() => {
                    this.setState({
                      l_sub_department_id: null,
                      l_employee_id: null,
                      l_full_name: "",
                      processLeaveBtn: true
                    });
                  }}
                />

                <div className="col-2" style={{ paddingTop: 19 }}>
                  <button
                    onClick={this.processLeaveLevel.bind(this)}
                    style={{ marginLeft: 10, float: "right" }}
                    className="btn btn-primary"
                    disabled={this.state.processLeaveBtn}
                  >
                    {!this.state.loading ? (
                      <span>Assign</span>
                    ) : (
                      <i className="fas fa-spinner fa-spin" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Loan Authorization</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div
                  className="col-5 customRadio"
                  style={{ paddingTop: 24, borderBottom: "none" }}
                >
                  <label className="radio inline">
                    <input
                      type="radio"
                      name="loan_level_set"
                      value="1"
                      checked={this.state.loan_level_set === "1" ? true : false}
                      onChange={this.radioChange.bind(this)}
                    />
                    <span>Level 1</span>
                  </label>
                  {this.state.loan_level >= 2 ? (
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="loan_level_set"
                        value="2"
                        checked={
                          this.state.loan_level_set === "2" ? true : false
                        }
                        onChange={this.radioChange.bind(this)}
                      />
                      <span>Level 2</span>
                    </label>
                  ) : null}
                </div>

                <AlgaehAutoSearch
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Employee",
                    isImp: true
                  }}
                  ref={this.inputRef}
                  title="Search Employees"
                  id="item_id_search"
                  template={result => {
                    return (
                      <section className="resultSecStyles">
                        <div className="row">
                          <div className="col-8">
                            <h4 className="title">{result.employee_code}</h4>
                            <small>{result.full_name}</small>
                            <small>{result.department_name}</small>
                            <small>{result.sub_department_name}</small>
                          </div>
                          <div className="col-4" />
                        </div>
                      </section>
                    );
                  }}
                  name="lo_employee_id"
                  columns={spotlightSearch.Employee_details.loginNewEmployee}
                  displayField="lo_full_name"
                  value={this.state.lo_full_name}
                  searchName="loan_auth"
                  onClick={this.searchSelect.bind(this, "Loan")}
                  extraParameters={{
                    loan_authorize_privilege: this.state.loan_level_set
                  }}
                  onClear={() => {
                    this.setState({
                      lo_sub_department_id: null,
                      lo_employee_id: null,
                      lo_full_name: "",
                      processLoanBtn: true
                    });
                  }}
                />
                <div className="col-2" style={{ paddingTop: 19 }}>
                  <button
                    onClick={this.processLoanAuth.bind(this)}
                    style={{ marginLeft: 10, float: "right" }}
                    className="btn btn-primary"
                    disabled={this.state.processLoanBtn}
                  >
                    {!this.state.loading ? (
                      <span>Assign</span>
                    ) : (
                      <i className="fas fa-spinner fa-spin" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
            <div className="portlet-body">
              <div className="customCheckbox">
                <label className="checkbox inline" style={{ marginRight: 20 }}>
                  <input
                    type="checkbox"
                    value=""
                    name=""
                    checked={this.state.checkAll}
                    onChange={this.selectAll.bind(this)}
                  />
                  <span>Select All</span>
                </label>
              </div>
              <div className="row">
                <div className="col-lg-12" id="employeeAuthGrid_Cntr">
                  <AlgaehDataGrid
                    id="employee_auth_grid"
                    columns={[
                      {
                        fieldName: "SalaryPayment_checkBox",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Select To Process"
                            }}
                          />
                        ),
                        //disabled: true
                        displayTemplate: (row, data) => {
                          return (
                            <span>
                              <input
                                type="checkbox"
                                onChange={this.selectToProcess.bind(this, row)}
                                // onChange={handlers.selectToProcess}
                                checked={
                                  row.select_to_process === "Y" ? true : false
                                }
                              />
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          filterable: false
                        }
                      },
                      {
                        fieldName: "employee_code",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Employee Code" }}
                          />
                        ),
                        others: {
                          maxWidth: 100,
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "full_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Full Name" }} />
                        ),
                        others: {
                          resizable: false,
                          style: { textAlign: "center" }
                        }
                      },
                      {
                        fieldName: "leave_level1",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave L1" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.employee_data === undefined
                              ? []
                              : this.props.employee_data.filter(
                                  f => f.hims_d_employee_id === row.leave_level1
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
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
                        fieldName: "leave_level2",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave L2" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.employee_data === undefined
                              ? []
                              : this.props.employee_data.filter(
                                  f => f.hims_d_employee_id === row.leave_level2
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
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
                        fieldName: "leave_level3",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Leave L3" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.employee_data === undefined
                              ? []
                              : this.props.employee_data.filter(
                                  f => f.hims_d_employee_id === row.leave_level3
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
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
                        fieldName: "loan_level1",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan L1" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.employee_data === undefined
                              ? []
                              : this.props.employee_data.filter(
                                  f => f.hims_d_employee_id === row.loan_level1
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
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
                        fieldName: "loan_level2",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan L2" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.employee_data === undefined
                              ? []
                              : this.props.employee_data.filter(
                                  f => f.hims_d_employee_id === row.loan_level2
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 150,
                          resizable: false,
                          style: { textAlign: "center", wordBreak: "break-all" }
                        }
                      }
                    ]}
                    keyId="service_code"
                    dataSource={{
                      data: this.state.employees_list
                    }}
                    // filter={true}
                    paging={{ page: 0, rowsPerPage: 50 }}
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
                onClick={this.SaveAuthorizationSetup.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button>
              <button
                onClick={this.clearState.bind(this)}
                style={{ float: "right" }}
                className="btn btn-default"
              >
                Clear
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
    employee_data: state.employee_data
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProviderDetails: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AuthorizationSetup)
);
