import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../../actions/algaehActions";

import "./ApplyLeaveEncashment.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  // AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import { GetAmountFormart, getYears } from "../../../../utils/GlobalFunctions";
import moment from "moment";
import Options from "../../../../Options.json";
import { MainContext } from "algaeh-react-components";
import { AlgaehSecurityElement } from "algaeh-react-components";
import { AlgaehDataGrid } from "algaeh-react-components";
class ApplyLeaveEncashment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      extra: {},
      emp_leaves_data: [],
      available_balance: 0.0,
      total_applied_days: 0.0,
      Request_enable: true,
      is_projected_leave: "N",
      loading_Process: false,
      year: moment().year(),
      hospital_id: "",
      decimal_place: 0,
      airfare_amount: 0,
      airfare_months: 0,
      leave_amount: 0,
      total_amount: 0,
      encashDetail: [],
      leave_id: null,
      leave_days: 0,
    };
    this.getLeaveTypes();
  }

  componentWillUnmount() {
    this.clearState();
  }

  static contextType = MainContext;
  componentDidMount() {
    const { userToken } = this.context;
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations",
        },
      });
    }
    this.setState(
      {
        hospital_id: userToken.hims_d_hospital_id,
        decimal_place: userToken.decimal_places,
      },
      () => {
        if (this.props.empData) {
          this.setState(
            {
              employee_id: this.props.empData.hims_d_employee_id,
              reporting_to_id: this.props.empData.reporting_to_id,
              employee_name: this.props.empData.full_name,
            },
            () => {
              this.getEmployeeLeaveData();
              this.getEmployeeEncashDetails();
            }
          );
        }
      }
    );
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee,
      },
      searchName: "employee_branch_wise",
      uri: "/gloabelSearch/get",
      inputs: "hospital_id = " + this.state.hospital_id,
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: (row) => {
        this.setState(
          {
            employee_name: row.full_name,
            employee_id: row.hims_d_employee_id,
            emp_leaves_data: [],
            available_balance: 0.0,
            total_applied_days: 0.0,
            Request_enable: true,
            loading_Process: false,
            year: moment().year(),
            airfare_amount: 0,
            airfare_months: 0,
            leave_amount: 0,
            total_amount: 0,
            encashDetail: [],
            leave_id: null,
            leave_days: 0,
            reporting_to_id: row.reporting_to_id,
          },
          () => {
            this.getEmployeeLeaveData();
            this.getEmployeeEncashDetails();
          }
        );
      },
    });
  }

  getEmployeeEncashDetails() {
    algaehApiCall({
      uri: "/encashmentprocess/getEncashmentApplied",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            encashDetail: res.data.result,
          });
        }
      },
    });
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "leave_id":
        this.setState(
          {
            [value.name]: value.value,
            hims_d_leave_detail_id: value.selected.hims_d_leave_detail_id,
            available_balance: value.selected.close_balance,
            close_balance: value.selected.close_balance,
            Request_enable: false,
          },
          () => this.LoadLeaveEncashment()
        );

        break;
      case "hospital_id":
        this.setState({
          [value.name]: value.value,
        });

        break;
      default:
        this.setState(
          {
            [value.name]: value.value,
          },
          () => {
            this.validate();
          }
        );
        break;
    }
  }

  LoadLeaveEncashment(e) {
    AlgaehLoader({ show: true });

    let inputObj = {
      employee_id: this.state.employee_id,
      year: this.state.year,
      leave_id: this.state.leave_id,
    };

    algaehApiCall({
      uri: "/encashmentprocess/getEncashmentToProcess",
      module: "hrManagement",
      data: inputObj,
      method: "GET",
      onSuccess: (response) => {
        if (response.data.result.length > 0) {
          let data = response.data.result[0];

          this.setState({
            total_amount: parseFloat(data.leave_amount).toFixed(
              this.state.decimal_place
            ),
            leave_amount: parseFloat(data.leave_amount).toFixed(
              this.state.decimal_place
            ),
            leave_days: data.leave_days,
            hims_f_employee_monthly_leave_id:
              data.hims_f_employee_monthly_leave_id,
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message || error.response.data.message,
          type: "error",
        });
      },
    });
  }

  clearState() {
    this.setState({
      leave_id: null,
      from_date: null,
      from_leave_session: "FD",
      to_date: null,
      to_leave_session: "FD",
      remarks: null,
      total_applied_days: 0.0,
      available_balance: 0.0,
      close_balance: 0,
      employee_name: null,
      full_name: null,
      Request_enable: true,
      is_projected_leave: "N",
      loading_Process: false,
    });
  }

  applyLeave() {
    const {
      employee_name: full_name,
      reporting_to_id,
      leave_id,
      leave_days,
    } = this.state;
    const leave_desc = this.state.emp_leaves_data.filter(
      (leave) => leave.leave_id === leave_id
    );
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='apply-leave-div'",
      onSuccess: () => {
        AlgaehLoader({ show: true });
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/encashmentprocess/InsertLeaveEncashment",
          module: "hrManagement",
          data: this.state,
          method: "POST",
          onSuccess: (response) => {
            AlgaehLoader({ show: false });
            this.getEmployeeEncashDetails();
            if (this.context.socket.connected) {
              this.context.socket.emit("/encash/applied", {
                full_name,
                reporting_to_id,
                leave_type: leave_desc[0].leave_description,
                leave_days,
              });
            }
            swalMessage({
              title: "Requested Succesfully...",
              type: "success",
            });
          },
          onFailure: (error) => {
            AlgaehLoader({ show: false });
            swalMessage({
              title: error.message || error.response.data.message,
              type: "error",
            });
          },
        });
      },
    });
  }

  getEmployeeLeaveData() {
    algaehApiCall({
      uri: "/leave/getEmployeeLeaveData",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.employee_id,
        year: this.state.year,
        leave_encash: "Y",
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            emp_leaves_data: res.data.records,
          });
        }
      },
    });
  }

  getLeaveTypes() {
    algaehApiCall({
      uri: "/selfService/getLeaveMaster",
      method: "GET",
      module: "hrManagement",
      onSuccess: (res) => {
        this.setState({
          leave_types: res.data.records,
        });
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  numberhandle(e) {
    let value = e.target.value;
    if (parseFloat(value) > parseFloat(this.state.available_balance)) {
      swalMessage({
        title: "Cannot be greater than Available Balance",
        type: "warning",
      });
      return;
    }
    if (parseFloat(value) === 0) {
      swalMessage({
        title: "Cannot be 0 Days",
        type: "warning",
      });
      return;
    }

    let inputObj = {
      employee_id: this.state.employee_id,
      year: this.state.year,
      leave_days: value,
    };

    AlgaehLoader({ show: true });
    algaehApiCall({
      uri: "/encashmentprocess/calculateEncashmentAmount",
      module: "hrManagement",
      data: inputObj,
      method: "GET",
      onSuccess: (response) => {
        if (response.data.result.length > 0) {
          let data = response.data.result[0];

          this.setState({
            total_amount: parseFloat(data.leave_amount).toFixed(
              this.state.decimal_place
            ),
            leave_amount: parseFloat(data.leave_amount).toFixed(
              this.state.decimal_place
            ),
            leave_days: data.leave_days,
          });
        }
        AlgaehLoader({ show: false });
      },
      onFailure: (error) => {
        AlgaehLoader({ show: false });
        swalMessage({
          title: error.message || error.response.data.message,
          type: "error",
        });
      },
    });
  }

  render() {
    let allYears = getYears();
    return (
      <React.Fragment>
        <div className="row apply_leave">
          <div
            data-validate="apply-leave-div"
            className="col-lg-3 col-md-3 col-sm-12"
          >
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Request Leave Encashment</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  {this.props.from_screen === "ES" ? (
                    <AlagehAutoComplete
                      div={{ className: "col-12 form-group mandatory" }}
                      label={{
                        forceLabel: "Select Branch",
                        isImp: true,
                      }}
                      selector={{
                        name: "hospital_id",
                        className: "select-fld",
                        value: this.state.hospital_id,
                        dataSource: {
                          textField: "hospital_name",
                          valueField: "hims_d_hospital_id",
                          data: this.props.organizations,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            hospital_id: null,
                          });
                        },
                      }}
                    />
                  ) : null}
                  {this.props.from_screen === "ES" ? (
                    <div className="col-12 globalSearchCntr  form-group">
                      <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                      <h6 onClick={this.employeeSearch.bind(this)}>
                        {this.state.employee_name
                          ? this.state.employee_name
                          : "Search Employee"}
                        <i className="fas fa-search fa-lg" />
                      </h6>
                    </div>
                  ) : null}

                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Start Year.",
                      isImp: true,
                    }}
                    selector={{
                      name: "year",
                      className: "select-fld",
                      value: this.state.year,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: allYears,
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          year: null,
                        });
                      },
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-6 form-group mandatory" }}
                    label={{
                      forceLabel: "Leave Type",
                      isImp: true,
                    }}
                    selector={{
                      name: "leave_id",
                      className: "select-fld",
                      value: this.state.leave_id,
                      dataSource: {
                        textField: "leave_description",
                        valueField: "leave_id",
                        data: this.state.emp_leaves_data,
                      },
                      onChange: this.dropDownHandler.bind(this),
                      onClear: () => {
                        this.setState({
                          leave_id: null,
                          Request_enable: true,
                          hims_d_leave_detail_id: null,
                          available_balance: 0.0,
                          close_balance: 0,
                        });
                      },
                      others: {
                        id: "leaveTyp",
                      },
                    }}
                  />
                  <div className="col-6 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Available Balance",
                      }}
                    />
                    <h6>{this.state.available_balance} days(s)</h6>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-6 mandatory form-group" }}
                    label={{
                      forceLabel: "Applying For",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.leave_days,
                      className: "txt-fld",
                      name: "leave_days",
                      number: {
                        thousandSeparator: ",",
                        allowNegative: false,
                      },
                      dontAllowKeys: ["-", "e"],
                      events: {
                        onChange: this.numberhandle.bind(this),
                      },
                    }}
                  />

                  <div className="col-6 form-group">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Encash Amount",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.total_amount)}</h6>
                  </div>

                  <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button
                        onClick={this.clearState.bind(this)}
                        type="button"
                        className="btn btn-default"
                        style={{ marginRight: 15 }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={this.applyLeave.bind(this)}
                        type="button"
                        className="btn btn-primary"
                        disabled={this.state.Request_enable}
                      >
                        Request Encashment
                      </button>
                    </div>
                  </AlgaehSecurityElement>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-md-7 col-sm-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Encashment Request List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-lg-12" id="leaveRequestList_cntr">
                    <AlgaehDataGrid
                      id="leaveEncashProcessGrid"
                      datavalidate="leaveEncashProcessGrid"
                      columns={[
                        {
                          fieldName: "status",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Status" }} />
                          ),
                          displayTemplate: (row) => {
                            return row.authorized === "PEN" ? (
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
                            ) : (
                              "-------"
                            );
                          },
                          filterable: true,
                          filterType: "choices",
                          choices: [
                            {
                              name: "Pending",
                              value: "PEN",
                            },
                            {
                              name: "Approved",
                              value: "APR",
                            },
                            {
                              name: "Rejected",
                              value: "REJ",
                            },
                          ],
                        },
                        {
                          fieldName: "encashment_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Encashment Number" }}
                            />
                          ),
                          filterable: true,
                        },
                        {
                          fieldName: "encashment_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Encashment Date" }}
                            />
                          ),
                          filterable: true,

                          displayTemplate: (row) => {
                            return (
                              <span>
                                {this.dateFormater(row.encashment_date)}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "leave_description",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Leave Description" }}
                            />
                          ),
                          filterable: true,
                        },
                        {
                          fieldName: "close_balance",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Available Balance" }}
                            />
                          ),
                        },
                        {
                          fieldName: "leave_days",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Applied for Encash" }}
                            />
                          ),
                        },
                        {
                          fieldName: "leave_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Encashment Amount" }}
                            />
                          ),
                          filterable: true,

                          displayTemplate: (row) => {
                            return (
                              <span>{GetAmountFormart(row.leave_amount)}</span>
                            );
                          },
                        },
                      ]}
                      keyId="leave_id"
                      data={this.state.encashDetail}
                      pagination={true}
                      isFilterable={true}
                      // paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body">
                <div className="row leaveEcnashBalanceCntr">
                  {this.state.emp_leaves_data.length > 0 ? (
                    this.state.emp_leaves_data.map((data, index) => (
                      <div
                        key={data.hims_f_employee_monthly_leave_id}
                        className="col-12"
                      >
                        <AlgaehLabel
                          label={{
                            forceLabel: data.leave_description,
                          }}
                        />
                        <h6>
                          <span>
                            {data.availed_till_date}
                            <small>Utilized</small>
                          </span>

                          <span>
                            {data.close_balance}
                            <small>Balance</small>
                          </span>
                        </h6>
                      </div>
                    ))
                  ) : (
                    <div className="noResult">Not Eligible for any Leaves</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    organizations: state.organizations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getOrganizations: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ApplyLeaveEncashment)
);
