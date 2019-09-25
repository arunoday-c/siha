import React, { Component } from "react";
import "./OpeningBalance.scss";
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
import EmployeeSearch from "../../../common/EmployeeSearch";
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
      <div className="openingBalanceScreen">
        <div className="row  inner-top-search">
          <div className="col form-group">
            <label className="label">Enter Opening Balance For</label>
            <div className="customRadio">
              <label className="radio inline">
                <input
                  type="radio"
                  value=""
                  name=""
                  checked="checked"
                  onChange=""
                />
                <span>Leave</span>
              </label>
              <label className="radio inline">
                <input type="radio" value="" name="" checked="" onChange="" />
                <span>Loan</span>
              </label>
              <label className="radio inline">
                <input type="radio" value="" name="" checked="" onChange="" />
                <span>Gratuity</span>
              </label>
              <label className="radio inline">
                <input type="radio" value="" name="" checked="" onChange="" />
                <span>Leave Salary</span>
              </label>
            </div>
          </div>

          {/* <div className="col-lg-3" style={{ marginTop: 10 }}>
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
          </div> */}
          <AlagehAutoComplete
            div={{ className: "col-2 form-group" }}
            label={{
              forceLabel: "Employee Group",
              isImp: false
            }}
            selector={{
              name: "",
              className: "select-fld",
              value: "",
              dataSource: {
                textField: "",
                valueField: "",
                data: []
              },
              onChange: "",
              onClear: () => {}
            }}
          />
          <div className="col globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={() => EmployeeSearch()}>
              {/* {inputs.emp_name ? inputs.emp_name : "------"} */}
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
              onClick={this.clearState.bind(this)}
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
                  <div className="col-12" id="normalLeaveBalanceGird_Cntr">
                    <AlgaehDataGrid
                      id="normalLeaveBalanceGird"
                      columns={[
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emp. Code" }} />
                          ),
                          others: {
                            maxWidth: 105,
                            fixed: "left"
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          others: {
                            minWidth: 200,
                            fixed: "left"
                          }
                        },
                        {
                          fieldName: "",
                          label: <AlgaehLabel label={{ forceLabel: "Sick" }} />,
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Maternity" }} />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Paternity" }} />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: <AlgaehLabel label={{ forceLabel: "Hajj" }} />,
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Emergency" }} />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Study" }} />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Marriage" }} />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Bereavement Direct"
                              }}
                            />
                          ),
                          others: {
                            filterable: false
                          }
                        },
                        {
                          fieldName: "",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Bereavement Indirect"
                              }}
                            />
                          ),
                          others: {
                            filterable: false
                          }
                        }
                      ]}
                      keyId=""
                      dataSource={{}}
                      isEditable={true}
                      filter={true}
                      paging={{ page: 0, rowsPerPage: 20 }}
                      events={{}}
                      others={{}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
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

export default EmployeeReceipts;
