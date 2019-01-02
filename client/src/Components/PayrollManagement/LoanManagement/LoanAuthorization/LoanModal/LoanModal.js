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

class LoanModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.setState(this.props.data, () => {
      this.getEmployeeLoans();
    });
  }

  getEmployeeLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
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

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.data);
  }

  textHandle(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  dropDownHandler(value) {
    this.setState({
      [value.name]: value.value
    });
  }

  authorizeLoan(type) {
    let data = {
      hims_f_loan_application_id: this.state.hims_f_loan_application_id,
      loan_amount: this.state.loan_amount,
      start_month: this.state.start_month,
      start_year: this.state.start_year,
      loan_tenure: this.state.loan_tenure,
      installment_amount: this.state.installment_amount,
      authorized: type,
      auth_level: "L" + this.props.auth_level,
      approved_amount: this.state.approved_amount
    };
    algaehApiCall({
      uri: "/loan/authorizeLoan",
      method: "PUT",
      data: data,
      onSuccess: res => {
        if (res.data.success) {
          type === "A"
            ? swalMessage({
                title: "Loan Authorized Successfully",
                type: "success"
              })
            : type === "R"
            ? swalMessage({
                title: "Loan Rejected",
                type: "success"
              })
            : null;

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

  render() {
    return (
      <React.Fragment>
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
                <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                <h6>{this.state.loan_description}</h6>
              </div>

              <div className="col form-group">
                <AlgaehLabel label={{ forceLabel: "Requested Amount" }} />
                <h6>{this.state.loan_amount}</h6>
              </div>
            </div>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col form-group" }}
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
                  className: "txt-fld",
                  name: "approved_amount",
                  value: this.state.approved_amount,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    type: "number"
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
                  className: "txt-fld",
                  name: "installment_amount",
                  value: this.state.installment_amount,
                  events: {
                    onChange: this.textHandle.bind(this)
                  },
                  others: {
                    type: "number"
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
                  <b>{this.state.employee_name + "'s"}</b> previous loan
                  requests
                </h6>
                <AlgaehDataGrid
                  id="requestedLoanAppGrid"
                  datavalidate="requestedLoanAppGrid"
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
                      label: <AlgaehLabel label={{ forceLabel: "Loan Type" }} />
                    },
                    {
                      fieldName: "loan_amount",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Loan Amount" }} />
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
                      label: "No. of EMI Pending",
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
                  keyId=""
                  dataSource={{ data: this.state.employee_loans }}
                  isEditable={false}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
              </div>
            </div>
          </div>
          <div className="popupFooter col-12">
            <div className="row">
              <div className="col-12">
                <button
                  //onClick={this.authorizeLoan.bind(this, "R")}
                  type="button"
                  className="btn btn-default"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

export default LoanModal;
