import React, { Component } from "react";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp,
  AlagehAutoComplete,
  AlagehFormGroup
} from "../../../../Wrapper/algaehWrapper";

import { MONTHS, NO_OF_EMI } from "../../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../../utils/algaehApiCall";
import moment from "moment";
import {
  AlgaehValidation,
  getAmountFormart
} from "../../../../../utils/GlobalFunctions";
import Socket from "../../../../../sockets";

class LoanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.loadAuthSock = Socket;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open === true) {
      this.setState(nextProps.data, () => {
        this.getEmployeeLoans();
      });
    }
    // ? this.setState(nextProps.data, () => {
    //     this.getEmployeeLoans();
    //   })
    // : null;
  }

  getEmployeeLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.employee_id
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

  textHandle(e) {
    switch (e.target.name) {
      case "approved_amount":
        if (e.target.value <= this.state.loan_amount) {
          this.setState({
            [e.target.name]: e.target.value,
            installment_amount: e.target.value / this.state.loan_tenure
          });
        } else {
          swalMessage({
            title: "Approved Amount cannot be greater than requested amount",
            type: "warning"
          });
          this.setState({
            approved_amount: null
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
      case "loan_tenure":
        this.setState({
          [value.name]: value.value,
          installment_amount: this.state.approved_amount / value.value
        });
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  authorizeLoan(type) {
    const isSockConnected = this.loadAuthSock.connected;
    AlgaehValidation({
      alertTypeIcon: "warning",
      querySelector: "data-validate='loanModalDiv'",
      onSuccess: () => {
        if (this.state.approved_amount <= 0 && type === "A") {
          swalMessage({
            title: "Please enter a proper approved amount",
            type: "warning"
          });
        } else {
          let data = {
            hims_f_loan_application_id: this.state.hims_f_loan_application_id,
            loan_amount: this.state.loan_amount,
            start_month: this.state.start_month,
            start_year: this.state.start_year,
            loan_tenure: this.state.loan_tenure,
            installment_amount: this.state.installment_amount,
            authorized: type,
            auth_level: this.props.auth_level,
            approved_amount: this.state.approved_amount
          };
          algaehApiCall({
            uri: "/loan/authorizeLoan",
            module: "hrManagement",
            method: "PUT",
            data: data,
            onSuccess: res => {
              if (res.data.success) {
                if (type === "A") {
                  swalMessage({
                    title: "Loan Authorized Successfully",
                    type: "success"
                  });
                  if (isSockConnected) {
                    this.loadAuthSock.emit(
                      "/loan/authorized",
                      this.state.employee_id,
                      this.props.auth_level
                    );
                  }
                } else if (type === "R") {
                  swalMessage({
                    title: "Loan Rejected",
                    type: "success"
                  });
                  if (isSockConnected) {
                    this.loadAuthSock.emit(
                      "/loan/rejected",
                      this.state.employee_id,
                      this.state.auth_level
                    );
                  }
                }
                // type === "A"
                //   ? swalMessage({
                //       title: "Loan Authorized Successfully",
                //       type: "success"
                //     })
                //   : type === "R"
                //   ? swalMessage({
                //       title: "Loan Rejected",
                //       type: "success"
                //     })
                //   : null;

                document.getElementById("loan-reload").click();
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

  render() {
    return (
      <AlgaehModalPopUp
        openPopup={this.props.open}
        events={{
          onClose: this.props.onClose
        }}
      >
        <div
          className="col-lg-12 popupInner"
          style={{ marginTop: 10, marginBottom: 10 }}
        >
          <div className="row">
            <div className="col form-group">
              <AlgaehLabel label={{ forceLabel: "Application No." }} />
              <h6>{this.state.loan_application_number}</h6>
            </div>

            <div className="col form-group">
              <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
              <h6>{this.state.employee_name}</h6>
            </div>

            <div className="col form-group">
              <AlgaehLabel label={{ forceLabel: "Requested Amount" }} />
              <h6>{this.state.loan_amount}</h6>
            </div>
            <div className="col form-group">
              <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
              <h6>{this.state.loan_description}</h6>
            </div>

            <div className="col form-group">
              <AlgaehLabel label={{ forceLabel: "Authorization Level" }} />
              <h6>{"Level " + this.props.auth_level}</h6>
            </div>
          </div>
          <div className="row" data-validate="loanModalDiv">
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Start Month",
                isImp: true
              }}
              selector={{
                sort: "off",
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
              div={{ className: "col form-group" }}
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
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Approved Amount",
                isImp: true
              }}
              textBox={{
                decimal: { allowNegative: false },
                className: "txt-fld",
                name: "approved_amount",
                value: this.state.approved_amount,
                events: {
                  onChange: this.textHandle.bind(this)
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "No. of EMI",
                isImp: true
              }}
              selector={{
                sort: "off",
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
            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Instalment Amount",
                isImp: true
              }}
              textBox={{
                decimal: { allowNegative: false },
                className: "txt-fld",
                name: "installment_amount",
                value: this.state.installment_amount,
                events: {
                  onChange: this.textHandle.bind(this)
                },
                others: {
                  disabled: true
                }
              }}
            />
          </div>
          <div className="row">
            <div className="col-12">
              <button
                onClick={this.authorizeLoan.bind(this, "A")}
                type="button"
                className="btn btn-primary"
                style={{ float: "right", marginLeft: 10 }}
              >
                AUTHORIZE
              </button>
              <button
                onClick={this.authorizeLoan.bind(this, "R")}
                type="button"
                className="btn btn-default"
                style={{ float: "right" }}
              >
                REJECT
              </button>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-12" id="requestedLoanAppGrid_Cntr">
              <h6>
                <b>{this.state.employee_name + "'s"}</b> previous loan requests
              </h6>
              <AlgaehDataGrid
                id="requestedLoanAppGrid"
                datavalidate="requestedLoanAppGrid"
                columns={[
                  {
                    fieldName: "loan_application_number",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Application No." }} />
                    ),
                    others: { filterable: false }
                  },
                  {
                    fieldName: "loan_authorized",
                    label: <AlgaehLabel label={{ forceLabel: "Status" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {row.loan_authorized === "PEN" ? (
                            <span className="badge badge-warning">Pending</span>
                          ) : row.loan_authorized === "APR" ? (
                            <span className="badge badge-success">
                              Approved
                            </span>
                          ) : row.loan_authorized === "REJ" ? (
                            <span className="badge badge-danger">Rejected</span>
                          ) : row.loan_authorized === "IS" ? (
                            <span className="badge badge-success">Issued</span>
                          ) : (
                            "------"
                          )}
                        </span>
                      );
                    },
                    others: { filterable: false }
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
                    },
                    others: { filterable: false }
                  },
                  {
                    fieldName: "loan_description",
                    label: <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                  },
                  {
                    fieldName: "loan_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Loan Amount" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{getAmountFormart(row.loan_amount)}</span>;
                    },
                    others: { filterable: false }
                    //disabled: true
                  },
                  {
                    fieldName: "loan_tenure",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Total No. of EMI" }} />
                    ),
                    others: { filterable: false }
                  },
                  {
                    fieldName: "installment_amount",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Installment Amount" }}
                      />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>{getAmountFormart(row.installment_amount)}</span>
                      );
                    },
                    others: { filterable: false }
                  },
                  {
                    fieldName: "application_reason",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Reason For Loan" }} />
                    ),
                    others: { filterable: false }
                  },
                  {
                    fieldName: "loan_tenure",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "No. of EMI Pending" }}
                      />
                    ),
                    displayTemplate: row => {
                      return <span>{row.loan_tenure}</span>;
                    },
                    others: { filterable: false }
                  },
                  {
                    fieldName: "pending_loan",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Balance Due" }} />
                    ),
                    others: { filterable: false }
                  }
                ]}
                keyId=""
                dataSource={{ data: this.state.employee_loans }}
                isEditable={false}
                filter={true}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
          </div>
        </div>
        <div className="popupFooter col-12">
          <div className="row">
            <div className="col-12">
              <button
                onClick={this.props.onClose}
                type="button"
                className="btn btn-default"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </AlgaehModalPopUp>
    );
  }
}

export default LoanModal;
