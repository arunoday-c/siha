import React, { Component } from "react";
import "./EmployeeReceipts.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
// import Employee from "../../../../Search/Employee.json";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation } from "../../../../utils/GlobalFunctions";

class EmployeeReceipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loans: [],
      current_loan: {},
      reciepts_type: "LO",
      employee_receipts: []
    };
  }

  clearState() {
    this.setState({
      hims_f_loan_application_id: null,
      current_loan: {},
      reciepts_type: "LO",
      hims_d_employee_id: null,
      employee_name: null,
      reciepts_mode: null,
      recievable_amount: null,
      write_off_amount: null,
      employee_receipts: []
    });
  }

  clearSaveState() {
    this.setState({
      hims_f_loan_application_id: null,
      current_loan: {},
      reciepts_type: "LO",
      reciepts_mode: null,
      recievable_amount: null,
      write_off_amount: null
    });
  }

  addEmployeeReceipts() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        let write_off_amt = this.state.write_off_amount
          ? this.state.write_off_amount
          : 0;
        let balance_amount =
          this.state.current_loan.pending_loan -
          write_off_amt -
          this.state.recievable_amount;

        algaehApiCall({
          uri: "/loan/addLoanReciept",
          module: "hrManagement",
          method: "POST",
          data: {
            employee_id: this.state.hims_d_employee_id,
            reciepts_type: this.state.reciepts_type,
            recievable_amount: this.state.recievable_amount,
            write_off_amount: this.state.write_off_amount
              ? this.state.write_off_amount
              : 0,
            loan_application_id: this.state.hims_f_loan_application_id,
            balance_amount: balance_amount,
            reciepts_mode: this.state.reciepts_mode,
            cheque_number: this.state.cheque_number
          },
          onSuccess: res => {
            if (res.data.success) {
              swalMessage({
                title: "Received Successfully",
                type: "success"
              });
              this.clearSaveState();
              this.getEmployeeReceipts();
              this.getLoans();
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
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: spotlightSearch.Employee_details.employee
      },
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState(
          {
            employee_name: row.full_name,
            hims_d_employee_id: row.hims_d_employee_id
          },
          () => {
            this.getLoans();
            this.getEmployeeReceipts();
          }
        );
      }
    });
  }

  getEmployeeReceipts() {
    algaehApiCall({
      uri: "/loan/getEmployeeLoanReciept",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            employee_receipts: res.data.records
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

  getLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id,
        loan_issued: "Y",
        loan_closed: "N"
      },
      onSuccess: res => {
        if (res.data.success) {
          this.setState({
            loans: res.data.records
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

  dropDownHandler(value) {
    switch (value.name) {
      case "reciepts_type":
        if (value.value === "LO" && this.state.loans.length === 0) {
          this.getLoans();
        }

        this.setState({
          [value.name]: value.value
        });
        break;

      case "hims_f_loan_application_id":
        this.setState({
          [value.name]: value.value,
          current_loan: value.selected
        });
        break;

      case "reciepts_mode":
        if (this.state.current_loan.pending_loan === undefined) {
          swalMessage({
            title: "Please Select a Loan to receive",
            type: "warning"
          });
          this.setState({
            [value.name]: null
          });
        } else {
          this.setState({
            [value.name]: value.value
          });
        }
        break;

      default:
        this.setState({
          [value.name]: value.value
        });
        break;
    }
  }

  textHandler(e) {
    switch (e.target.name) {
      case "reciepts_type":
        this.setState({
          reciepts_type: e.target.value
        });
        break;

      case "recievable_amount":
        if (this.state.current_loan.pending_loan === undefined) {
          swalMessage({
            title: "Please Select a Loan to receive",
            type: "warning"
          });
        } else {
          let writeOffAmt = this.state.write_off_amount
            ? this.state.write_off_amount
            : 0;
          let pendingAmt = this.state.current_loan.pending_loan
            ? this.state.current_loan.pending_loan
            : 0;

          let finalLoanAmt = pendingAmt - writeOffAmt;

          if (e.target.value <= finalLoanAmt)
            this.setState({
              recievable_amount: e.target.value
            });
          else {
            swalMessage({
              title: "Received amount cannot be greater than pending amount",
              type: "warning"
            });
          }
        }

        break;

      case "write_off_amount":
        e.target.value <= this.state.current_loan.pending_loan
          ? this.setState({
              [e.target.name]: e.target.value
            })
          : swalMessage({
              title: "Write off amount cannot be greater than pending amount",
              type: "warning"
            });
        break;

      default:
        if (this.state.current_loan.pending_loan === undefined) {
          swalMessage({
            title: "Please Select a Loan to receive",
            type: "warning"
          });
        } else {
          this.setState({
            [e.target.name]: e.target.value
          });
        }
        break;
    }
  }

  render() {
    let currentLoan = this.state.current_loan;

    return (
      <div className="emp_receipts">
        <div className="row  inner-top-search">
          <div
            className="col-3 form-group"
            style={{
              marginTop: 21
            }}
          >
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value="LO"
                  name="reciepts_type"
                  checked={this.state.reciepts_type === "LO"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Loan</span>
              </label>

              <label className="radio inline">
                <input
                  type="radio"
                  value="FS"
                  name="reciepts_type"
                  checked={this.state.reciepts_type === "FS"}
                  onChange={this.textHandler.bind(this)}
                />
                <span>Final Settlement</span>
              </label>
            </div>
          </div>

          <div className="col-lg-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: "1px solid #ced4d9",
                borderRadius: 5,
                marginLeft: 0
              }}
            >
              <div className="col">
                <AlgaehLabel label={{ forceLabel: "Employee Name" }} />
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
                  onClick={this.employeeSearch.bind(this)}
                />
              </div>
            </div>
          </div>

          {this.state.reciepts_type === "LO" ? (
            <AlagehAutoComplete
              div={{ className: "col-3 form-group" }}
              label={{ forceLabel: "Loan Application No.", isImp: true }}
              selector={{
                name: "hims_f_loan_application_id",
                value: this.state.hims_f_loan_application_id,
                className: "select-fld",
                dataSource: {
                  textField: "loan_application_number",
                  valueField: "hims_f_loan_application_id",
                  data: this.state.loans
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hims_f_loan_application_id: null,
                    current_loan: {}
                  });
                }
              }}
            />
          ) : null}
          <div className="col form-group">
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 21, marginLeft: 10 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15 ">
              <div className="portlet-body">
                <div className="row">
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Code"
                      }}
                    />
                    <h6>
                      {currentLoan.employee_code
                        ? currentLoan.employee_code
                        : "------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Name"
                      }}
                    />
                    <h6>
                      {currentLoan.employee_name
                        ? currentLoan.employee_name
                        : "------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Application No."
                      }}
                    />
                    <h6>
                      {currentLoan.loan_application_number
                        ? currentLoan.loan_application_number
                        : "------"}
                    </h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Pending Amount"
                      }}
                    />
                    <h6>
                      {currentLoan.pending_loan
                        ? currentLoan.pending_loan
                        : "0.00"}
                    </h6>
                  </div>
                </div>
                <div className="row" data-validate="writeOffDiv">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Mode of Recipt", isImp: true }}
                    selector={{
                      name: "reciepts_mode",
                      value: this.state.reciepts_mode,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.RECIEPTS_MODE
                      },
                      onChange: this.dropDownHandler.bind(this)
                    }}
                  />

                  {this.state.reciepts_mode === "CH" ? (
                    <AlagehFormGroup
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Cheque No.",
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "cheque_number",
                        value: this.state.cheque_number,
                        events: {
                          onChange: this.textHandler.bind(this)
                        }
                      }}
                    />
                  ) : null}

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Loan Write Off Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "write_off_amount",
                      value: this.state.write_off_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      option: {
                        type: "number"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Amount Received",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "recievable_amount",
                      value: this.state.recievable_amount,
                      events: {
                        onChange: this.textHandler.bind(this)
                      },
                      option: {
                        type: "number"
                      }
                    }}
                  />

                  <div className="col form-group">
                    <button
                      onClick={this.addEmployeeReceipts.bind(this)}
                      style={{ marginTop: 19 }}
                      className="btn btn-primary"
                    >
                      Received
                    </button>
                    <button
                      style={{ marginTop: 21, marginLeft: 10 }}
                      className="btn btn-default"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Employee Receipts List</h3>
                </div>
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="EmployeeReciptsGrid_Cntr">
                    <AlgaehDataGrid
                      id="EmployeeReciptsGrid"
                      datavalidate="EmployeeReciptsGrid"
                      columns={[
                        {
                          fieldName: "loan_application_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Application No." }}
                            />
                          )
                        },
                        {
                          fieldName: "reciepts_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Receipts Type" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.reciepts_type === "LO"
                                  ? "Loan"
                                  : row.reciepts_type === "FS"
                                  ? "Final Settlement"
                                  : "------"}
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
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "write_off_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Write off Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "reciepts_mode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.reciepts_mode === "CS"
                                  ? "Cash"
                                  : row.reciepts_mode === "CH"
                                  ? "Cheque"
                                  : "------"}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "recievable_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Amount Received" }}
                            />
                          )
                        }
                      ]}
                      keyId="hims_f_employee_reciepts_id"
                      dataSource={{ data: this.state.employee_receipts }}
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
      </div>
    );
  }
}

export default EmployeeReceipts;
