import React, { Component } from "react";
import "./LoanRequest.css";
import {
  getAmountFormart,
  AlgaehValidation
} from "../../../../utils/GlobalFunctions";
import { NO_OF_EMI, MONTHS } from "../../../../utils/GlobalVariables.json";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";

class LoanRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      loan_master: [],
      employee_loans: [],
      loan_limit: 0,
      start_year: moment().year(),
      deducting_year: moment().year(),
      deducting_month: parseInt(moment(new Date()).format("M"), 10) + 1,
      request_type: "LO"
    };
    this.getLoanMaster();
  }

  componentDidMount() {
    let data = this.props.empData !== null ? this.props.empData : {};
    this.setState(data, () => {
      this.getEmployeeLoans();
      this.getEmployeeAdvances();
    });
  }

  getEmployeeAdvances() {
    algaehApiCall({
      uri: "/employee/getEmployeeAdvance",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_advance: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }
  getEmployeeLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_loans: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
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
      start_month: null
    });
  }
  clearAdvanceState() {
    this.setState({
      deducting_year: moment().year(),
      deducting_month: parseInt(moment(new Date()).format("M"), 10) + 1,
      advance_amount: null,
      advance_reason: null
    });
  }

  applyAdvance() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loanApplyDiv'",
      onSuccess: () => {
        if (this.state.deducting_year < moment(new Date()).format("YYYY")) {
          swalMessage({
            title: "Cannot Request advance for past year",
            type: "warning"
          });
        } else if (
          this.state.deducting_month < moment(new Date()).format("M")
        ) {
          swalMessage({
            title: "Cannot Request advance for past month",
            type: "warning"
          });
        } else {
          algaehApiCall({
            uri: "/employee/addEmployeeAdvance",
            method: "POST",
            data: {
              employee_id: this.state.hims_d_employee_id,
              advance_amount: this.state.advance_amount,
              deducting_month: this.state.deducting_month,
              deducting_year: this.state.deducting_year,
              advance_reason: this.state.advance_reason
            },
            onSuccess: res => {
              if (res.data.success) {
                swalMessage({
                  title: "Record Added Successfully",
                  type: "success"
                });
                this.clearAdvanceState();
                this.getEmployeeAdvances();
              }
            },
            onFailure: err => {
              swalMessage({
                title: err.message,
                type: "error"
              });
            }
          });
        }
      }
    });
  }

  applyLoan() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loanApplyDiv'",
      onSuccess: () => {
        if (this.state.loan_amount === undefined || null) {
          swalMessage({
            title: "Please enter the loan amount",
            type: "warning"
          });
        } else if (this.state.loan_amount > this.state.loan_limit) {
          swalMessage({
            title: "Loan Amount Cannot be greater than max limit",
            type: "warning"
          });
        } else {
          algaehApiCall({
            uri: "/loan/addLoanApplication",
            method: "POST",
            data: {
              employee_id: this.state.hims_d_employee_id,
              loan_id: this.state.loan_id,
              application_reason: this.state.loan_description,
              loan_amount: this.state.loan_amount,
              start_month: this.state.start_month,
              start_year: this.state.start_year,
              loan_tenure: this.state.loan_tenure,
              installment_amount: this.state.installment_amount
            },
            onSuccess: res => {
              if (res.data.success) {
                swalMessage({
                  title: "Record Added Successfully",
                  type: "success"
                });
                this.clearState();
                this.getEmployeeLoans();
              }
            },
            onFailure: err => {
              swalMessage({
                title: err.message,
                type: "error"
              });
            }
          });
        }
      }
    });
  }

  textHandle(e) {
    switch (e.target.name) {
      case "loan_amount":
        if (e.target.value <= this.state.loan_limit) {
          this.setState({
            [e.target.name]: e.target.value,
            installment_amount: e.target.value / this.state.loan_tenure
          });
        } else {
          swalMessage({
            title: "Loan Amount cannot be greater than max limit",
            type: "warning"
          });
        }
        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
  }

  dropDownHandler(value) {
    switch (value.name) {
      case "loan_id":
        this.setState({
          [value.name]: value.value,
          loan_limit: value.selected.loan_maximum_amount,
          loan_amount: null,
          loan_tenure: null,
          installment_amount: null
        });
        break;

      case "loan_tenure":
        this.setState({
          [value.name]: value.value,
          installment_amount: this.state.loan_amount / value.value
        });
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  getLoanMaster() {
    algaehApiCall({
      uri: "/employee/getLoanMaster",
      method: "GET",
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            loan_master: res.data.records
          });
        }
      },
      onFailure: err => {
        swalMessage({
          title: err.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <div className="row loan_request">
        <div className="col-3">
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
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Loan Type",
                        isImp: true
                      }}
                      selector={{
                        name: "loan_id",
                        className: "select-fld",
                        value: this.state.loan_id,
                        dataSource: {
                          textField: "loan_description",
                          valueField: "hims_d_loan_id",
                          data: this.state.loan_master
                        },
                        onChange: this.dropDownHandler.bind(this)
                      }}
                    />
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Max-Limit"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.loan_limit)}</h6>
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Loan Amount",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "loan_amount",
                        value: this.state.loan_amount,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "No. of EMI",
                        isImp: true
                      }}
                      selector={{
                        name: "loan_tenure",
                        className: "select-fld",
                        value: this.state.loan_tenure,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: NO_OF_EMI
                        },
                        onChange: this.dropDownHandler.bind(this)
                      }}
                    />

                    <div className="col-12">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Installment Amount"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.installment_amount)}</h6>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Start Month",
                        isImp: true
                      }}
                      selector={{
                        name: "start_month",
                        className: "select-fld",
                        value: this.state.start_month,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: MONTHS
                        },
                        onChange: this.dropDownHandler.bind(this)
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Start Year",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "start_year",
                        value: this.state.start_year,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Reason for Loan",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "loan_description",
                        value: this.state.loan_description,
                        events: {
                          onChange: this.textHandle.bind(this)
                        }
                      }}
                    />
                    <div className="col-3 margin-bottom-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 21 }}
                        onClick={this.applyLoan.bind(this)}
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ) : this.state.request_type === "AD" ? (
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Advance Amount",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "advance_amount",
                        value: this.state.advance_amount,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Deducting Year",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "deducting_year",
                        value: this.state.deducting_year,
                        events: {
                          onChange: this.textHandle.bind(this)
                        },
                        others: {
                          type: "number"
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-6" }}
                      label={{
                        forceLabel: "Deducting Month",
                        isImp: true
                      }}
                      selector={{
                        name: "deducting_month",
                        className: "select-fld",
                        value: this.state.deducting_month,
                        dataSource: {
                          textField: "name",
                          valueField: "value",
                          data: MONTHS
                        },
                        onChange: this.dropDownHandler.bind(this)
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-12" }}
                      label={{
                        forceLabel: "Reason for Advance",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "advance_reason",
                        value: this.state.advance_reason,
                        events: {
                          onChange: this.textHandle.bind(this)
                        }
                      }}
                    />

                    <div className="col-12 margin-bottom-15">
                      <button
                        type="button"
                        className="btn btn-primary"
                        style={{ marginTop: 21 }}
                        onClick={this.applyAdvance.bind(this)}
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="col-9">
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
                        fieldName: "loan_application_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Application No." }}
                          />
                        )
                      },
                      {
                        fieldName: "loan_application_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Loan Requested On" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.loan_application_date).format(
                                "MM-DD-YYYY"
                              )}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "loan_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                        )
                      },
                      {
                        fieldName: "loan_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Requested Loan Amount" }}
                          />
                        )
                        //disabled: true
                      },
                      {
                        fieldName: "approved_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Approved Loan Amount" }}
                          />
                        )
                        //disabled: true
                      },
                      {
                        fieldName: "loan_tenure",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Total No. of EMI" }}
                          />
                        )
                      },
                      {
                        fieldName: "installment_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Installment Amount" }}
                          />
                        )
                      },
                      {
                        fieldName: "loan_description",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Reason For Loan" }}
                          />
                        )
                      },
                      {
                        fieldName: "loan_tenure",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "No. of EMI Pending" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.pending_loan / row.installment_amount}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "pending_loan",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Balance Due" }} />
                        )
                      },
                      {
                        fieldName: "loan_authorized",
                        label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                        displayTemplate: row => {
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
                        }
                      }
                    ]}
                    keyId="hims_f_loan_application_id"
                    dataSource={{
                      data: this.state.employee_loans
                    }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    events={{
                      onEdit: () => {},
                      onDelete: () => {},
                      onDone: () => {}
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
                        fieldName: "advance_number",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Advance Request Number" }}
                          />
                        )
                      },

                      {
                        fieldName: "created_date",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Advance Requested Date" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {moment(row.created_date).format("DD-MM-YYYY")}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "advance_amount",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Advance Amount" }}
                          />
                        )
                      },

                      {
                        fieldName: "advance_reason",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Advance Reason" }}
                          />
                        )
                      },
                      {
                        fieldName: "deducting_month",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Deducting Month" }}
                          />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.deducting_month === "1"
                                ? "January"
                                : row.deducting_month === "2"
                                ? "February"
                                : row.deducting_month === "3"
                                ? "March"
                                : row.deducting_month === "4"
                                ? "April"
                                : row.deducting_month === "5"
                                ? "May"
                                : row.deducting_month === "6"
                                ? "June"
                                : row.deducting_month === "7"
                                ? "July"
                                : row.deducting_month === "8"
                                ? "August"
                                : row.deducting_month === "9"
                                ? "September"
                                : row.deducting_month === "10"
                                ? "October"
                                : row.deducting_month === "11"
                                ? "November"
                                : row.deducting_month === "12"
                                ? "December"
                                : null}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "deducting_year",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Deducting Year" }}
                          />
                        )
                      }
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
