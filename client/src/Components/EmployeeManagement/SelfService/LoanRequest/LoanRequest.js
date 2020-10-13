import React, { Component } from "react";
import "./LoanRequest.scss";
import {
  GetAmountFormart,
  AlgaehValidation,
} from "../../../../utils/GlobalFunctions";
import { NO_OF_EMI, MONTHS } from "../../../../utils/GlobalVariables.json";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
} from "../../../Wrapper/algaehWrapper";
import { getYears } from "../../../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";
import Socket from "../../../../sockets";
import { MainContext } from "algaeh-react-components";
import swal from "sweetalert2";
import AlgaehLoader from "../../../Wrapper/fullPageLoader";
import { newAlgaehApi } from "../../../../hooks";
import { AlgaehMessagePop } from "algaeh-react-components";

class LoanRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hims_d_employee_id: this.props.hims_d_employee_id,
      selectedLang: this.props.SelectLanguage,
      loan_master: [],
      employee_loans: [],
      loan_limit: 0,
      start_year: moment().year(),
      deducting_year: moment().year(),
      deducting_month: parseInt(moment(new Date()).format("M"), 10) + 1,
      request_type: "LO",
      hospital_id: "",
      decimal_places: 0,
    };
    this.loanSocket = Socket;
    this.getLoanMaster();
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    let data = this.props.empData !== null ? this.props.empData : {};
    this.setState(
      {
        ...data,
        hospital_id: userToken.hims_d_hospital_id,
        decimal_places: userToken.decimal_places,
      },
      () => {
        this.getEmployeeLoans();
        this.getEmployeeAdvances();
      }
    );
  }

  getEmployeeAdvances() {
    algaehApiCall({
      uri: "/selfService/getEmployeeAdvance",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_advance: res.data.records,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  getEmployeeLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id,
        hospital_id: this.state.hospital_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_loans: res.data.records,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  clearState() {
    this.setState({
      loan_description: null,
      loan_id: null,
      loan_limit: 0,
      loan_amount: null,
      loan_tenure: null,
      installment_amount: null,
      start_year: null,
      start_month: null,
    });
  }

  clearAdvanceState() {
    this.setState({
      deducting_year: moment().year(),
      deducting_month: parseInt(moment(new Date()).format("M"), 10) + 1,
      advance_amount: null,
      advance_reason: null,
    });
  }

  applyAdvance() {
    const { full_name, reporting_to_id } = this.props.empData;

    const { advance_amount } = this.state;
    // const { full_name, reporting_to_id } = this.props.empData;
    const { deducting_month, deducting_year } = this.state;
    const current_month = parseInt(moment().format("M"), 10);
    const current_year = parseInt(moment().format("M"), 10);

    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loanApplyDiv'",
      onSuccess: () => {
        if (parseInt(deducting_year, 10) < current_year) {
          swalMessage({
            title: "Cannot Request advance for past year",
            type: "warning",
          });
        } else if (parseInt(deducting_month, 10) < current_month) {
          swalMessage({
            title: "Cannot Request advance for past month",
            type: "warning",
          });
        } else {
          algaehApiCall({
            uri: "/selfService/addEmployeeAdvance",
            module: "hrManagement",
            method: "POST",
            data: {
              employee_id: this.state.hims_d_employee_id,
              advance_amount: this.state.advance_amount,
              deducting_month: this.state.deducting_month,
              deducting_year: this.state.deducting_year,
              advance_reason: this.state.advance_reason,
              hospital_id: this.state.hospital_id,
            },
            onSuccess: (res) => {
              if (res.data.success) {
                swalMessage({
                  title: "Record Added Successfully",
                  type: "success",
                });
                if (this.context.socket.connected) {
                  this.context.socket.emit("/advance/applied", {
                    full_name,
                    reporting_to_id,
                    advance_amount,
                  });
                }
                this.clearAdvanceState();
                this.getEmployeeAdvances();
              }
            },
            onFailure: (err) => {
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        }
      },
    });
  }

  applyLoan() {
    const { full_name, reporting_to_id, employee_code } = this.props.empData;
    const { loan_master, loan_id } = this.state;
    const [{ loan_description }] = loan_master.filter(
      (loan) => loan.hims_d_loan_id === loan_id
    );
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loanApplyDiv'",
      onSuccess: () => {
        if (this.state.loan_amount === undefined || null) {
          swalMessage({
            title: "Please enter the loan amount",
            type: "warning",
          });
        } else if (this.state.loan_amount > this.state.loan_limit) {
          swalMessage({
            title: "Loan Amount Cannot be greater than max limit",
            type: "warning",
          });
        } else {
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/loan/addLoanApplication",
            module: "hrManagement",
            method: "POST",
            data: {
              employee_id: this.state.hims_d_employee_id,
              loan_id: this.state.loan_id,
              application_reason: this.state.loan_description,
              loan_amount: this.state.loan_amount,
              start_month: this.state.start_month,
              start_year: this.state.start_year,
              loan_tenure: this.state.loan_tenure,
              installment_amount: this.state.installment_amount,
              hospital_id: this.state.hospital_id,
            },
            onSuccess: (res) => {
              if (res.data.success) {
                if (this.loanSocket.connected) {
                  this.loanSocket.emit("/loan/applied", {
                    full_name,
                    reporting_to_id,
                    loan_description,
                  });
                }
                newAlgaehApi({
                  uri: "/loan/mailSendForLoan",
                  method: "GET",
                  module: "hrManagement",
                  data: {
                    reporting_to_id,
                    email_type: "LO",
                    full_name,
                    employee_code,
                    loan_description,
                    application_reason: this.state.loan_description,
                    loan_amount: this.state.loan_amount,
                    start_month: this.state.start_month,
                    start_year: this.state.start_year,
                    loan_tenure: this.state.loan_tenure,
                    installment_amount: this.state.installment_amount,
                  },
                })
                  .then((res) => {
                    if (res.data.success) {
                      AlgaehLoader({ show: false });

                      swalMessage({
                        title: "Record Added Successfully",
                        type: "success",
                      });
                      this.clearState();
                      this.getEmployeeLoans();
                    }
                  })
                  .catch((e) => {
                    AlgaehMessagePop({
                      type: "error",
                      display: e.message,
                    });
                  });
              }
            },
            onFailure: (err) => {
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        }
      },
    });
  }

  textHandle(e) {
    switch (e.target.name) {
      case "loan_amount":
        if (e.target.value <= this.state.loan_limit) {
          this.setState({
            [e.target.name]: e.target.value,
            installment_amount: (
              parseFloat(e.target.value) / parseFloat(this.state.loan_tenure)
            ).toFixed(this.state.decimal_places),
          });
        } else {
          swalMessage({
            title: "Loan Amount cannot be greater than max limit",
            type: "warning",
          });
          this.setState({
            loan_amount: null,
          });
        }
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value,
        });
        break;
    }
  }

  dropDownHandler(value) {
    let present_month = parseInt(moment().format("M"));
    let present_year = parseInt(moment().year(), 10);

    switch (value.name) {
      case "loan_id":
        if (value.selected.loan_limit_type === "L") {
          this.setState({
            [value.name]: value.value,
            loan_limit: value.selected.loan_maximum_amount,
            loan_amount: null,
            loan_tenure: null,
            installment_amount: null,
          });
        } else if (value.selected.loan_limit_type === "B") {
          algaehApiCall({
            uri: "/employee/getEmpEarningComponents",
            module: "hrManagement",
            method: "GET",
            data: {
              employee_id: this.state.hims_d_employee_id,
              earnings_id: this.props.basic_earning_component,
            },
            onSuccess: (response) => {
              if (response.data.success) {
                let data = response.data.records;
                this.setState({
                  [value.name]: value.value,
                  loan_limit: data.length > 0 ? data[0].amount : 0,
                  loan_amount: null,
                  loan_tenure: null,
                  installment_amount: null,
                });
              }
            },
            onFailure: (error) => {
              swalMessage({
                title: error.message,
                type: "error",
              });
            },
          });
        }

        break;

      case "loan_tenure":
        this.setState({
          [value.name]: value.value,
          installment_amount: (
            parseFloat(this.state.loan_amount) / parseFloat(value.value)
          ).toFixed(this.state.decimal_places),
        });
        break;

      case "start_month":
        if (value.value === null) {
          this.setState({
            [value.name]: null,
          });
        }
        if (
          present_year === parseInt(this.state.start_year, 10) &&
          parseInt(value.value, 10) < present_month
        ) {
          swalMessage({
            title: "Start month must be future months",
            type: "warning",
          });
          this.setState({
            [value.name]: null,
          });
        } else {
          this.setState({
            [value.name]: value.value,
          });
        }

        break;

      default:
        this.setState({
          [value.name]: value.value,
        });
        break;
    }
  }

  getLoanMaster() {
    algaehApiCall({
      uri: "/payrollsettings/getLoanMaster",
      module: "hrManagement",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            loan_master: res.data.records,
          });
        }
      },
      onFailure: (err) => {
        swalMessage({
          title: err.message,
          type: "error",
        });
      },
    });
  }

  cancelAdvance(row) {
    swal({
      title: "Are you Sure you want to Cancel?",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#44b8bd",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((willCancel) => {
      if (willCancel.value) {
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/selfService/cancelAdvance",
          module: "hrManagement",
          method: "PUT",
          data: {
            hims_f_employee_advance_id: row.hims_f_employee_advance_id,
          },
          onSuccess: (res) => {
            if (res.data.success) {
              swalMessage({
                title: "Cancelled Successfully",
                type: "success",
              });
              this.getEmployeeAdvances();
              AlgaehLoader({ show: false });
            }
          },
        });
      }
    });
  }

  render() {
    let allYears = getYears();
    return (
      <div className="row loan_request">
        <div className="col-lg-3 col-md-3 col-sm-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Request Loan/ Advance</h3>
              </div>
            </div>
            <div className="portlet-body" data-validate="loanApplyDiv">
              <div className="row">
                <div className="col">
                  <label>Request Type</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="request_type"
                        value="LO"
                        checked={this.state.request_type === "LO"}
                        onChange={this.textHandle.bind(this)}
                      />
                      <span>Loan</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        name="request_type"
                        value="AD"
                        checked={this.state.request_type === "AD"}
                        onChange={this.textHandle.bind(this)}
                      />
                      <span>Advance</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="myDiv">
                {this.state.request_type === "LO" ? (
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Loan Type",
                        isImp: true,
                      }}
                      selector={{
                        name: "loan_id",
                        className: "select-fld",
                        value: this.state.loan_id,
                        dataSource: {
                          textField: "loan_description",
                          valueField: "hims_d_loan_id",
                          data: this.state.loan_master,
                        },
                        onChange: this.dropDownHandler.bind(this),
                      }}
                    />
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Max-Limit",
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.loan_limit)}</h6>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Loan Amount",
                        isImp: true,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "loan_amount",
                        value: this.state.loan_amount,
                        events: {
                          onChange: this.textHandle.bind(this),
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "No. of EMI",
                        isImp: true,
                      }}
                      selector={{
                        sort: "off",
                        name: "loan_tenure",
                        className: "select-fld",
                        value: this.state.loan_tenure,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: NO_OF_EMI,
                        },
                        onChange: this.dropDownHandler.bind(this),
                      }}
                    />

                    <div className="col-12">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Installment Amount",
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.installment_amount)}</h6>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Start Year.",
                        isImp: true,
                      }}
                      selector={{
                        name: "start_year",
                        className: "select-fld",
                        value: this.state.start_year,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: allYears,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            start_year: null,
                          });
                        },
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Start Month",
                        isImp: true,
                      }}
                      selector={{
                        sort: "off",
                        name: "start_month",
                        className: "select-fld",
                        value: this.state.start_month,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: MONTHS,
                        },
                        onChange: this.dropDownHandler.bind(this),
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12 form-group" }}
                      label={{
                        forceLabel: "Reason for Loan",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "loan_description",
                        value: this.state.loan_description,
                        events: {
                          onChange: this.textHandle.bind(this),
                        },
                      }}
                    />

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
                        onClick={this.applyLoan.bind(this)}
                        type="button"
                        className="btn btn-primary"
                        // disabled={this.state.Request_enable}
                      >
                        Request Loan
                      </button>
                    </div>
                  </div>
                ) : this.state.request_type === "AD" ? (
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Advance Amount",
                        isImp: true,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "advance_amount",
                        value: this.state.advance_amount,
                        events: {
                          onChange: this.textHandle.bind(this),
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Deducting Year",
                        isImp: true,
                      }}
                      selector={{
                        name: "deducting_year",
                        className: "select-fld",
                        value: this.state.deducting_year,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: allYears,
                        },
                        onChange: this.dropDownHandler.bind(this),
                        onClear: () => {
                          this.setState({
                            deducting_year: null,
                          });
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Deducting Month",
                        isImp: true,
                      }}
                      selector={{
                        sort: "off",
                        name: "deducting_month",
                        className: "select-fld",
                        value: this.state.deducting_month,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: MONTHS,
                        },
                        onChange: this.dropDownHandler.bind(this),
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12 form-group" }}
                      label={{
                        forceLabel: "Reason for Advance",
                        isImp: false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "advance_reason",
                        value: this.state.advance_reason,
                        events: {
                          onChange: this.textHandle.bind(this),
                        },
                      }}
                    />

                    <div className="col-12" style={{ textAlign: "right" }}>
                      <button
                        onClick={this.clearAdvanceState.bind(this)}
                        type="button"
                        className="btn btn-default"
                        style={{ marginRight: 15 }}
                      >
                        Clear
                      </button>
                      <button
                        onClick={this.applyAdvance.bind(this)}
                        type="button"
                        className="btn btn-primary"
                        // disabled={this.state.Request_enable}
                      >
                        Request Advance
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-9 col-md-9 col-sm-12">
          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Loan Request List</h3>
              </div>
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="LoanRequestList_cntr">
                  <AlgaehDataGrid
                    id="LoanRequestList_grid"
                    columns={[
                      {
                        fieldName: "loan_authorized",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.loan_authorized === "PEN" ? (
                                <span className="badge badge-warning">
                                  Pending
                                </span>
                              ) : row.loan_authorized === "APR" ? (
                                <span className="badge badge-success">
                                  Approved
                                </span>
                              ) : row.loan_authorized === "REJ" ? (
                                <span className="badge badge-danger">
                                  Rejected
                                </span>
                              ) : row.loan_authorized === "IS" ? (
                                <span className="badge badge-success">
                                  Issued
                                </span>
                              ) : (
                                "------"
                              )}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 80,
                        },
                      },
                      {
                        fieldName: "loan_application_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Req. Date" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.loan_application_date).format(
                                "DD-MM-YYYY"
                              )}
                            </span>
                          );
                        },
                        others: { minWidth: 100 },
                      },
                      {
                        fieldName: "loan_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                        ),
                      },
                      {
                        fieldName: "pending_loan",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Due Amt." }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{GetAmountFormart(row.pending_loan)}</span>
                          );
                        },
                      },
                      {
                        fieldName: "pending_tenure",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Due EMI" }} />
                        ),
                        displayTemplate: (row) => {
                          return row.pending_tenure !== 0 ? (
                            <span>{row.pending_tenure} Month</span>
                          ) : (
                            <span className="badge badge-success">Closed</span>
                          );
                        },
                      },

                      {
                        fieldName: "installment_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "EMI Amount" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {GetAmountFormart(row.installment_amount)}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "loan_tenure",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Total EMI" }} />
                        ),
                        displayTemplate: (row) => {
                          return <span>{row.loan_tenure} Month</span>;
                        },
                      },
                      {
                        fieldName: "start_year",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Deducting From" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(
                                "01-" + row.start_month + "-" + row.start_year,
                                "DD-MM-YYYY"
                              ).format("MMMM - YYYY")}
                            </span>
                          );
                        },
                        others: { minWidth: 130 },
                      },
                      {
                        fieldName: "loan_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Req. Amount" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{GetAmountFormart(row.loan_amount)}</span>
                          );
                        },
                        others: { minWidth: 100 },
                      },
                      {
                        fieldName: "approved_amount",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Appr. Amount" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{GetAmountFormart(row.approved_amount)}</span>
                          );
                        },
                        others: { minWidth: 100 },
                      },
                      {
                        fieldName: "loan_application_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request No." }} />
                        ),
                        others: {
                          minWidth: 130,
                        },
                      },
                      {
                        fieldName: "application_reason",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Reason For Loan" }}
                          />
                        ),
                        others: {
                          minWidth: 250,
                        },
                      },
                    ]}
                    keyId="hims_f_loan_application_id"
                    dataSource={{
                      data: this.state.employee_loans,
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {},
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered margin-bottom-15">
            <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Advance Request List</h3>
              </div>
              {/* <div className="actions">
                    <a className="btn btn-primary btn-circle active">
                      <i className="fas fa-pen" />
                    </a>
                  </div> */}
            </div>
            <div className="portlet-body">
              <div className="row">
                <div className="col-12" id="AdvanceRequestGrid_Cntr">
                  <AlgaehDataGrid
                    id="AdvanceRequestGrid"
                    datavalidate="AdvanceRequestGrid"
                    columns={[
                      {
                        fieldName: "action",

                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "Action",
                            }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span
                              style={{
                                pointerEvents:
                                  row.advance_status !== "APR" ? "none" : null,
                                opacity:
                                  row.advance_status !== "APR" ? "0.1" : null,
                              }}
                            >
                              <i
                                className="fas fa-times"
                                onClick={this.cancelAdvance.bind(this, row)}
                              ></i>
                            </span>
                          );
                        },
                        others: {
                          maxWidth: 100,
                          filterable: false,
                        },
                      },
                      {
                        fieldName: "advance_status",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {row.advance_status === "APR" ? (
                                <span className="badge badge-warning">
                                  Payment Pending
                                </span>
                              ) : row.advance_status === "PAI" ? (
                                <span className="badge badge-success">
                                  Paid
                                </span>
                              ) : row.advance_status === "REJ" ? (
                                <span className="badge badge-danger">
                                  Cancelled
                                </span>
                              ) : (
                                "------"
                              )}
                            </span>
                          );
                        },
                        others: {
                          minWidth: 80,
                        },
                      },
                      {
                        fieldName: "advance_number",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Request No." }} />
                        ),
                      },

                      {
                        fieldName: "created_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Date" }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(row.created_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        },
                      },
                      {
                        fieldName: "advance_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Amt." }}
                          />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>{GetAmountFormart(row.advance_amount)}</span>
                          );
                        },
                      },
                      {
                        fieldName: "deducting_year",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Deduction On" }} />
                        ),
                        displayTemplate: (row) => {
                          return (
                            <span>
                              {moment(
                                "01-" +
                                  row.deducting_month +
                                  "-" +
                                  row.deducting_year,
                                "DD-MM-YYYY"
                              ).format("MMMM - YYYY")}
                            </span>
                          );
                        },
                      },

                      {
                        fieldName: "advance_reason",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Reason for Advance" }}
                          />
                        ),
                        others: {
                          minWidth: 250,
                        },
                      },
                      // {
                      //   fieldName: "deducting_month",
                      //   label: (
                      //     <AlgaehLabel
                      //       label={{ forceLabel: "Deducting Month" }}
                      //     />
                      //   ),
                      //   displayTemplate: row => {
                      //     return (
                      //       <span>
                      //         {row.deducting_month === "1"
                      //           ? "January"
                      //           : row.deducting_month === "2"
                      //           ? "February"
                      //           : row.deducting_month === "3"
                      //           ? "March"
                      //           : row.deducting_month === "4"
                      //           ? "April"
                      //           : row.deducting_month === "5"
                      //           ? "May"
                      //           : row.deducting_month === "6"
                      //           ? "June"
                      //           : row.deducting_month === "7"
                      //           ? "July"
                      //           : row.deducting_month === "8"
                      //           ? "August"
                      //           : row.deducting_month === "9"
                      //           ? "September"
                      //           : row.deducting_month === "10"
                      //           ? "October"
                      //           : row.deducting_month === "11"
                      //           ? "November"
                      //           : row.deducting_month === "12"
                      //           ? "December"
                      //           : null}
                      //       </span>
                      //     );
                      //   }
                      // }
                    ]}
                    keyId="hims_f_employee_advance_id"
                    dataSource={{ data: this.state.employee_advance }}
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

export default LoanRequest;
