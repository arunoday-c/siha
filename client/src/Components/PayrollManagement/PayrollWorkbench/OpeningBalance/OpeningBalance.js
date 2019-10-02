import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./OpeningBalance.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import {
  AlgaehOpenContainer,
  getYears
} from "../../../../utils/GlobalFunctions";
import EmployeeSearch from "../../../common/EmployeeSearch";
import OpeningBalanceEvent from "./OpeningBalanceEvent";
import moment from "moment";

const all_functions = OpeningBalanceEvent();

class OpeningBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_group_id: null,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      employee_name: null,
      hims_d_employee_id: null,
      leave_dynamic_date: [],
      selected_type: "LE",
      rerender_items: true,
      leave_balance: [],
      year: moment().year()
    };
    all_functions.getLeaveMaster(this);
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
      this.props.emp_groups === undefined ||
      this.props.emp_groups.length === 0
    ) {
      this.props.getEmpGroups({
        uri: "/hrsettings/getEmployeeGroups",
        module: "hrManagement",
        method: "GET",
        data: { record_status: "A" },
        redux: {
          type: "EMP_GROUP_GET",
          mappingName: "emp_groups"
        }
      });
    }
  }

  clearState() {
    this.setState({
      leave_balance: [],
      employee_group_id: null,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      employee_name: null,
      hims_d_employee_id: null,
      leave_dynamic_date: [],
      selected_type: "LE",
      rerender_items: true,

      year: moment().year()
    });
  }

  PreviewData() {
    all_functions.PreviewData(this);
  }

  texthandle(e) {
    all_functions.texthandle(this, e);
  }

  employeeSearch() {
    all_functions.employeeSearch(this);
  }

  changeChecks(e) {
    all_functions.changeChecks(this, e);
  }

  updateEmployeeOpeningBalance(row) {
    debugger;
    all_functions.updateEmployeeOpeningBalance(this, row);
  }
  render() {
    let allYears = getYears();

    return (
      <div className="openingBalanceScreen">
        <div className="row  inner-top-search">
          <div className="col form-group">
            <label className="label">Enter Opening Balance For</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value="LE"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LE"}
                />
                <span>Leave</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="LO"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LO"}
                />
                <span>Loan</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="GR"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "GR"}
                />
                <span>Gratuity</span>
              </label>
              <label className="radio inline">
                <input
                  type="radio"
                  value="LS"
                  name="selected_type"
                  onChange={this.changeChecks.bind(this)}
                  checked={this.state.selected_type === "LS"}
                />
                <span>Leave Salary</span>
              </label>
            </div>
          </div>
          <AlagehAutoComplete
            div={{ className: "col" }}
            label={{
              forceLabel: "Select a Year.",
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
              onChange: this.texthandle.bind(this),

              onClear: () => {
                this.setState({
                  year: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 mandatory" }}
            label={{
              forceLabel: "Select a Branch.",
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
              onChange: this.texthandle.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null
                });
              }
            }}
          />
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Employee Group",
              isImp: false
            }}
            selector={{
              name: "employee_group_id",
              className: "select-fld",
              value: this.state.employee_group_id,
              dataSource: {
                textField: "group_description",
                valueField: "hims_d_employee_group_id",
                data: this.props.emp_groups
              },
              onChange: this.texthandle.bind(this),
              onClear: () => {
                this.setState({
                  employee_group_id: null
                });
              }
            }}
          />
          <div className="col-2 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>

          <div className="col form-group" style={{ textAlign: "right" }}>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19, marginLeft: 10 }}
              className="btn btn-default"
            >
              Clear
            </button>
            <button
              onClick={this.PreviewData.bind(this)}
              style={{ marginTop: 19, marginLeft: 10 }}
              className="btn btn-default"
            >
              Preview
            </button>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19, marginLeft: 10 }}
              className="btn btn-default"
            >
              Download
            </button>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19, marginLeft: 10 }}
              className="btn btn-primary"
            >
              Upload
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">
                    Opening balance for - leave
                  </h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="leave_opening_balance_Cntr">
                    {/*<AlgaehDataGrid
                      id="leave_opening_balance"
                      columns={this.state.leave_dynamic_date}
                      keyId="leave_opening"
                      dataSource={{
                        data: this.state.leave_balance
                      }}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      forceRender={true}
                      loading={this.state.loading}
                      events={{
                        onEdit: () => {},
                        onDone: () => {},
                        onDelete: () => {}
                      }}
                    />*/}
                    {this.state.selected_type === "LE" ? (
                      <div className="col-12" id="leave_opening_balance_Cntr">
                        <AlgaehDataGrid
                          id="leave_opening_balance"
                          columns={this.state.leave_dynamic_date}
                          keyId="leave_opening"
                          dataSource={{
                            data: this.state.leave_balance
                          }}
                          isEditable={true}
                          filter={true}
                          forceRender={true}
                          events={{
                            onEdit: () => {},
                            onDelete: () => {},
                            onDone: () => {}
                          }}
                          actions={{
                            allowDelete: false
                          }}
                        />
                      </div>
                    ) : this.state.selected_type === "LO" ? (
                      <div className="col-12" id="leave_opening_balance_Cntr">
                        <AlgaehDataGrid
                          id="loan_opening_balance"
                          columns={this.state.leave_dynamic_date}
                          keyId="loan_opening"
                          dataSource={{
                            data: []
                          }}
                          filter={true}
                          paging={{ page: 0, rowsPerPage: 20 }}
                          forceRender={true}
                        />
                      </div>
                    ) : this.state.selected_type === "GR" ? (
                      <div className="col-12" id="leave_opening_balance_Cntr">
                        <AlgaehDataGrid
                          id="gratuity_opening_balance"
                          columns={this.state.leave_dynamic_date}
                          keyId="gratuity_opening"
                          dataSource={{
                            data: []
                          }}
                          filter={true}
                          paging={{ page: 0, rowsPerPage: 20 }}
                          forceRender={true}
                        />
                      </div>
                    ) : this.state.selected_type === "LS" ? (
                      <div className="col-12" id="leave_opening_balance_Cntr">
                        <AlgaehDataGrid
                          id="leave_salary_opening_balance"
                          columns={this.state.leave_dynamic_date}
                          keyId="leave_salary_opening"
                          dataSource={{
                            data: this.state.leave_balance
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 20 }}
                          forceRender={true}
                          events={{
                            onEdit: () => {},
                            onDone: this.updateEmployeeOpeningBalance.bind(this)
                          }}
                          actions={{
                            allowDelete: false
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              {/* <button type="button" className="btn btn-primary" onClick="">
                <AlgaehLabel label={{ forceLabel: "Save", returnText: true }} />
              </button> */}

              <button type="button" className="btn btn-other">
                <AlgaehLabel
                  label={{ forceLabel: "Download Report", returnText: true }}
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
    organizations: state.organizations,
    emp_groups: state.emp_groups
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
      getEmpGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OpeningBalance)
);
