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
import AddEmployeeOpenBalance from "./SubModals/AddEmployeeOpenBalance";
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
      year: moment().year(),
      leaves_data: [],
      openModal: false,
      application_leave: [],
      leave_id: null
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
    all_functions.getLeaveMaster(this);
    this.setState(
      {
        employee_group_id: null,
        hospital_id: JSON.parse(
          AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
        ).hims_d_hospital_id,
        employee_name: null,
        hims_d_employee_id: null,
        leave_dynamic_date: [],
        selected_type: "LE",
        rerender_items: true,
        leave_id: null,
        year: moment().year(),
        leave_balance: []
      },
      () => {
        debugger;
      }
    );
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

  CloseModal(e) {
    this.setState({
      openModal: !this.state.openModal
    });
  }
  showModal(HeaderCaption) {
    debugger;
    this.setState({
      openModal: !this.state.openModal,
      HeaderCaption: HeaderCaption
    });
  }

  downloadExcel() {
    all_functions.downloadExcel(this);
  }

  render() {
    debugger;
    let allYears = getYears();

    return (
      <div className="openingBalanceScreen">
        <div className="row  inner-top-search">
          <div className="col-4 form-group">
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
            div={{ className: "col-2 mandatory" }}
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

          {/* {this.state.selected_type === "LE" ? (
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select Leave",
                isImp: true
              }}
              selector={{
                name: "leave_id",
                className: "select-fld",
                value: this.state.leave_id,
                dataSource: {
                  textField: "leave_description",
                  valueField: "hims_d_leave_id",
                  data: this.state.application_leave
                },
                onChange: this.texthandle.bind(this)
              }}
            />
          ) : null} */}

          <div className="col-12 form-group" style={{ textAlign: "right" }}>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
            >
              Clear
            </button>
            <button
              onClick={this.PreviewData.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
            >
              <i className="fas fa-eye"></i> Preview
            </button>
            <button
              onClick={this.downloadExcel.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-default btn-with-icon"
            >
              <i className="fas fa-file-download"></i> Download
            </button>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginLeft: 10 }}
              className="btn btn-primary btn-with-icon"
            >
              <i className="fas fa-file-upload"></i> Upload
            </button>
          </div>
        </div>

        {this.state.selected_type === "LE" ? (
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Opening balance for - Leave
                    </h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="Opening_balance_Cntr">
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
                          onDone: this.updateEmployeeOpeningBalance.bind(this)
                        }}
                        actions={{
                          allowDelete: false
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.selected_type === "LO" ? (
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Opening balance for - Loan
                    </h3>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="Opening_balance_Cntr">
                      <AlgaehDataGrid
                        id="loan_opening_balance"
                        columns={this.state.leave_dynamic_date}
                        keyId="loan_opening"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.selected_type === "GR" ? (
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Opening balance for - Gratuity
                    </h3>
                  </div>
                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={this.showModal.bind(
                        this,
                        "Employee Gratuity Opening Balance"
                      )}
                    >
                      Add Opening Balance
                    </button>
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="Opening_balance_Cntr">
                      <AlgaehDataGrid
                        id="gratuity_opening_balance"
                        columns={this.state.leave_dynamic_date}
                        keyId="gratuity_opening"
                        dataSource={{
                          data: this.state.leave_balance
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 20 }}
                        forceRender={true}
                        filter={true}
                        events={{
                          onEdit: () => {},
                          onDone: this.updateEmployeeOpeningBalance.bind(this)
                        }}
                        actions={{
                          allowDelete: false
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.selected_type === "LS" ? (
          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">
                      Opening balance for - Leave Salary
                    </h3>
                  </div>
                  <div className="actions">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 19 }}
                      onClick={this.showModal.bind(
                        this,
                        "Employee Leave Salary Opening Balance"
                      )}
                    >
                      Add Opening Balance
                    </button>
                    {/* <button
                      className="btn btn-primary btn-circle active"

                    >
                      <i className="fas fa-plus" />
                    </button> */}
                  </div>
                </div>
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-12" id="Opening_balance_Cntr">
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
                        filter={true}
                        events={{
                          onEdit: () => {},
                          onDone: this.updateEmployeeOpeningBalance.bind(this)
                        }}
                        actions={{
                          allowDelete: false
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* <div className="col-12">
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
                  {this.state.selected_type === "LE" ? (
                    <div className="col-12" id="Opening_balance_Cntr">

                    </div>
                  ) : this.state.selected_type === "LO" ? (

                  ) : this.state.selected_type === "GR" ? (
                    <div className="col-12" id="Opening_balance_Cntr">

                    </div>
                  ) : this.state.selected_type === "LS" ? (
                    <div className="col-12" id="Opening_balance_Cntr">

                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div> */}
        <AddEmployeeOpenBalance
          show={this.state.openModal}
          onClose={this.CloseModal.bind(this)}
          HeaderCaption={this.state.HeaderCaption}
          selected_type={this.state.selected_type}
          year={this.state.year}
          hospital_id={this.state.hospital_id}
        />
        {/* </div> */}
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
