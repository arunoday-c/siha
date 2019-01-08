import React, { Component } from "react";
import "./emp_receipts.css";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import Employee from "../../../../Search/Employee.json";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";

class EmployeeReceipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loans: [],
      current_loan: {},
      reciepts_type: "LO"
    };
    this.getLoans();
  }

  clearState() {
    this.setState({
      hims_f_loan_application_id: null,
      current_loan: {},
      reciepts_type: null
    });
  }

  employeeSearch() {
    AlgaehSearch({
      searchGrid: {
        columns: Employee
      },
      searchName: "employee",
      uri: "/gloabelSearch/get",
      onContainsChange: (text, serchBy, callBack) => {
        callBack(text);
      },
      onRowSelect: row => {
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id
        });
      }
    });
  }

  getLoans() {
    algaehApiCall({
      uri: "/loan/getLoanApplication",
      method: "GET",
      data: {
        loan_issued: "Y"
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
        value.value === "LO" && this.state.loans.length === 0
          ? this.getLoans()
          : null;

        this.setState({
          [value.name]: value.value
        });
        break;

      case "hims_f_loan_application_id":
        debugger;
        this.setState({
          [value.name]: value.value,
          current_loan: value.selected
        });

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

        // e.target.value === "LO" && this.state.loans.length === 0
        //   ? this.getLoans()
        //   : null;

        break;

      default:
        this.setState({
          [e.target.name]: e.target.value
        });
        break;
    }
  }

  render() {
    let currentLoan = this.state.current_loan;

    return (
      <div className="emp_receipts">
        <div className="row  inner-top-search">
          <div
            className="col-lg-2 form-group"
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

          {/* <AlagehAutoComplete
            div={{ className: "col-3 form-group" }}
            label={{ forceLabel: "Receipt Type", isImp: true }}
            selector={{
              name: "reciepts_type",
              value: this.state.reciepts_type,
              className: "select-fld",
              dataSource: {
                textField: "name",
                valueField: "value",
                data: GlobalVariables.RECEIPTS_TYPE
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  reciepts_type: null
                });
              }
            }}
          /> */}

          <div className="col-lg-3" style={{ marginTop: 10 }}>
            <div
              className="row"
              style={{
                border: " 1px solid #ced4d9",
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
              label={{ forceLabel: "Loan Code", isImp: true }}
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
            <button style={{ marginTop: 21 }} className="btn btn-primary">
              Load
            </button>{" "}
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
          {" "}
          <div className="col-12">
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15 margin-top-15">
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
                        forceLabel: "Pending Amount"
                      }}
                    />
                    <h6>
                      {currentLoan.pending_loan
                        ? currentLoan.pending_loan
                        : "------"}
                    </h6>
                  </div>
                </div>
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Loan Write Off Amount",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Mode of Recipt", isImp: false }}
                    selector={{
                      name: "",
                      className: "select-fld",
                      dataSource: {},
                      others: {}
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Cheque No.",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "text"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Amount Received",
                      isImp: false
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "",
                      value: "",
                      events: {},
                      option: {
                        type: "number"
                      }
                    }}
                  />
                  <div className="col form-group">
                    <button
                      style={{ marginTop: 21 }}
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
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
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
                          fieldName: "ReciptType",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type" }}
                            />
                          )
                        },
                        {
                          fieldName: "Recipt Type Code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Recipt Type Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "EmployeeCode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "EmployeeName",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          )
                        },
                        {
                          fieldName: "Pending Amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          )
                        },
                        {
                          fieldName: "LoanWriteAmount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Write off Amount" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeRecipt",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt" }}
                            />
                          )
                        },
                        {
                          fieldName: "ModeReciptNumber",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Recipt Number" }}
                            />
                          )
                        },
                        {
                          fieldName: "AmountReceived",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Amount Received" }}
                            />
                          )
                        }
                      ]}
                      keyId=""
                      dataSource={{ data: [] }}
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
