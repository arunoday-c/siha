import React, { Component } from "react";
import "./EmployeeReceipts.scss";
import {
  AlagehAutoComplete,
  AlgaehLabel,
  AlgaehDataGrid,
  AlagehFormGroup,
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
// import Employee from "../../../../Search/Employee.json";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import GlobalVariables, {
  MONTHS,
} from "../../../../utils/GlobalVariables.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import { AlgaehValidation, getYears } from "../../../../utils/GlobalFunctions";
import { MainContext } from "algaeh-react-components";

// import { MONTHS } from "../../../../utils/GlobalVariables.json";
import moment from "moment";
class EmployeeReceipts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loans: [],
      current_loan: {},
      reciepts_type: "LO",
      employee_receipts: [],
      hospital_id: null,
      employee_salary: [],
      month: moment(new Date()).format("M"),
      monthName: moment(new Date()).format("MMM"),
      year: moment().year(),
    };
    this.getHospitals();
  }
  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.setState({
      hospital_id: userToken.hims_d_hospital_id,
    });
  }
  getHospitals() {
    algaehApiCall({
      uri: "/organization/getOrganizationByUser",
      method: "GET",
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            hospitals: res.data.records,
          });
        }
      },
    });
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
      employee_receipts: [],
      // hospital_id: null,
      employee_salary: [],
      employee_code: null,
      final_settlement_status: "",
      final_settlement_number: "",
      hims_f_final_settlement_header_id: null,
    });
  }

  clearSaveState() {
    this.setState({
      hims_f_loan_application_id: null,
      current_loan: {},
      // reciepts_type: "LO",
      reciepts_mode: null,
      recievable_amount: null,
      write_off_amount: null,
    });
  }

  addEmployeeReceipts() {
    AlgaehValidation({
      alertTypeIcon: "warning",
      onSuccess: () => {
        if (this.state.reciepts_type === "FS") {
          algaehApiCall({
            uri: "/loan/addFinalSettlementReceipt",
            module: "hrManagement",
            method: "POST",
            data: {
              employee_id: this.state.hims_d_employee_id,
              reciepts_type: this.state.reciepts_type,
              recievable_amount: this.state.recievable_amount,
              write_off_amount: this.state.write_off_amount
                ? this.state.write_off_amount
                : 0,
              final_settlement_id: this.state.hims_f_final_settlement_header_id,
              // balance_amount: balance_amount,
              reciepts_mode: this.state.reciepts_mode,
              cheque_number: this.state.cheque_number,
              salary_id: this.state.salary_id,
            },
            onSuccess: (res) => {
              if (res.data.success) {
                swalMessage({
                  title: "Received Successfully",
                  type: "success",
                });

                this.getEmployeeReceipts();
                this.clearSaveState();
                // this.getLoans();
              }
            },
            onFailure: (err) => {
              swalMessage({
                title: err.message,
                type: "error",
              });
            },
          });
        } else {
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
              cheque_number: this.state.cheque_number,
            },
            onSuccess: (res) => {
              if (res.data.success) {
                swalMessage({
                  title: "Received Successfully",
                  type: "success",
                });
                this.clearSaveState();
                this.getEmployeeReceipts();
                // this.getLoans();
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
  getEmployeeSalaryData(data) {
    algaehApiCall({
      uri: "/finalsettlement/getEmployeeSalaryData",
      method: "GET",
      module: "hrManagement",
      data: {
        employee_id: this.state.hims_d_employee_id,
        month: this.state.month,
        year: this.state.year,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_salary: res.data.result,
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
  employeeSearch() {
    if (
      this.state.hospital_id === null ||
      this.state.hospital_id === undefined
    ) {
      swalMessage({
        title: "Please Select Branch",
        type: "warning",
      });
      document.querySelector("[name='hospital_id']").focus();
      return;
    }
    let input_data = "E.hospital_id=" + this.state.hospital_id;

    if (this.state.reciepts_type === "LO") {
      // this.clearState(() => {
      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.emp_payment_apply.loan_apply_branch,
        },
        searchName: "loan_apply_branch",
        inputs: input_data,
        uri: "/gloabelSearch/get",
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: (row) => {
          //
          this.setState(
            {
              employee_name: row.employee_name,
              hims_d_employee_id: row.employee_id,
              current_loan: row,
              hims_f_loan_application_id: row.hims_f_loan_application_id,
            },
            () => {
              // this.getLoans();
              this.getEmployeeReceipts();
            }
          );
        },
      });
      // });
    } else {
      // this.clearState(() => {
      let input = " FSH.hospital_id=" + this.state.hospital_id;
      AlgaehSearch({
        searchGrid: {
          columns: spotlightSearch.Employee_details_exit_employee.employee,
        },
        searchName: "final_settlement_list",
        inputs: input,
        uri: "/gloabelSearch/get",
        onContainsChange: (text, serchBy, callBack) => {
          callBack(text);
        },
        onRowSelect: (row) => {
          // const dta = this.state.data;
          this.setState(
            {
              employee_name: row.full_name,
              employee_code: row.employee_code,
              hims_d_employee_id: row.hims_d_employee_id,
              final_settlement_number: row.final_settlement_number,
              final_settlement_status: row.final_settlement_status,
              hims_f_final_settlement_header_id:
                row.hims_f_final_settlement_header_id,
            },
            () => {
              // this.getLoans();
              // this.getEmployeeSalaryData();
              this.getEmployeeReceipts();
            }
          );
        },
      });
      // });
    }
  }

  getEmployeeReceipts() {
    let typeOF =
      this.state.reciepts_type === "LO"
        ? "/loan/getEmployeeLoanReciept"
        : "/loan/getEmployeeFinalSettlementReceipt";
    algaehApiCall({
      uri: typeOF,
      module: "hrManagement",
      method: "GET",
      data: {
        employee_id: this.state.hims_d_employee_id,
      },
      onSuccess: (res) => {
        if (res.data.success) {
          this.setState({
            employee_receipts: res.data.records,
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

  // getLoans() {
  //
  //   algaehApiCall({
  //     uri: "/loan/getLoanApplication",
  //     module: "hrManagement",
  //     method: "GET",
  //     data: {
  //       employee_id: this.state.hims_d_employee_id,
  //       loan_issued: "Y",
  //       loan_closed: "N",
  //     },
  //     onSuccess: (res) => {
  //       if (res.data.success) {
  //         this.setState({
  //           loans: res.data.records,
  //         });
  //       }
  //     },
  //     onFailure: (err) => {
  //       swalMessage({
  //         title: err.message,
  //         type: "error",
  //       });
  //     },
  //   });
  // }

  dropDownHandler(value) {
    switch (value.name) {
      // case "reciepts_type":
      //   if (value.value === "LO" && this.state.loans.length === 0) {
      //     this.getLoans();
      //   }

      //   this.setState({
      //     [value.name]: value.value,
      //   });
      //   break;

      case "hims_f_loan_application_id":
        this.setState({
          [value.name]: value.value,
          current_loan: value.selected,
        });
        break;

      case "reciepts_mode":
        // if(this.state.reciepts_type === "FS")
        if (this.state.hims_d_employee_id === undefined) {
          swalMessage({
            title: "Please Select an employee to receive",
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
      case "month":
        this.setState(
          {
            [value.name]: value.value,
          },
          () => {
            this.getEmployeeSalaryData();
          }
        );
      case "year":
        this.setState(
          {
            [value.name]: value.value,
          },
          () => {
            this.getEmployeeSalaryData();
          }
        );
      default:
        this.setState({
          [value.name]: value.value,
        });
        break;
    }
  }

  textHandler(e) {
    switch (e.target.name) {
      case "reciepts_type":
        this.setState({
          reciepts_type: e.target.value,
        });
        break;

      case "recievable_amount":
        if (this.state.reciepts_type === "FS") {
          this.setState({
            recievable_amount: e.target.value,
          });
        } else {
          if (this.state.current_loan.pending_loan === undefined) {
            swalMessage({
              title: "Please Select a Loan to receive",
              type: "warning",
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
                recievable_amount: e.target.value,
              });
            else {
              swalMessage({
                title: "Received amount cannot be greater than pending amount",
                type: "warning",
              });
            }
          }
        }

        break;

      case "write_off_amount":
        this.state.reciepts_type === "LO"
          ? e.target.value <= this.state.current_loan.pending_loan
            ? this.setState({
                [e.target.name]: e.target.value,
              })
            : swalMessage({
                title: "Write off amount cannot be greater than pending amount",
                type: "warning",
              })
          : this.setState({
              [e.target.name]: e.target.value,
            });
        break;

      default:
        if (this.state.current_loan.pending_loan === undefined) {
          swalMessage({
            title: "Please Select a Loan to receive",
            type: "warning",
          });
        } else {
          this.setState({
            [e.target.name]: e.target.value,
          });
        }
        break;
    }
  }

  render() {
    let currentLoan = this.state.current_loan;
    const allYears = getYears();
    return (
      <div className="emp_receipts">
        <div className="row  inner-top-search">
          <div className="col-3 form-group">
            <label>Receipt Type</label>
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

          <AlagehAutoComplete
            div={{ className: "col-2 form-group mandatory" }}
            label={{
              forceLabel: "Select a Branch",
              isImp: true,
            }}
            selector={{
              name: "hospital_id",
              className: "select-fld",
              value: this.state.hospital_id,
              dataSource: {
                textField: "hospital_name",
                valueField: "hims_d_hospital_id",
                data: this.state.hospitals,
              },
              onChange: this.dropDownHandler.bind(this),
              onClear: () => {
                this.setState({
                  hospital_id: null,
                });
              },
              // others: {
              //   disabled: this.state.lockEarnings,
              // },
            }}
          />
          <div className="col globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name ? this.state.employee_name : "------"}
              <i className="fas fa-search fa-lg" />
            </h6>
          </div>

          {/* {this.state.reciepts_type === "LO" ? (
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
                  data: this.state.loans,
                },
                onChange: this.dropDownHandler.bind(this),
                onClear: () => {
                  this.setState({
                    hims_f_loan_application_id: null,
                    current_loan: {},
                  });
                },
              }}
            />
          ) : null} */}

          <div className="col-1 form-group">
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 20 }}
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
                        forceLabel: "Employee Code",
                      }}
                    />
                    <h6>
                      {currentLoan.employee_code
                        ? currentLoan.employee_code
                        : this.state.employee_code
                        ? this.state.employee_code
                        : "------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Name",
                      }}
                    />
                    <h6>
                      {currentLoan.employee_name
                        ? currentLoan.employee_name
                        : this.state.employee_name
                        ? this.state.employee_name
                        : "------"}
                    </h6>
                  </div>
                  {this.state.reciepts_type === "LO" ? (
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Application No.",
                        }}
                      />
                      <h6>
                        {currentLoan.loan_application_number
                          ? currentLoan.loan_application_number
                          : "------"}
                      </h6>
                    </div>
                  ) : null}
                  {this.state.reciepts_type === "FS" ? (
                    <>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Final Settlement No.",
                          }}
                        />
                        <h6>
                          {this.state.final_settlement_number
                            ? this.state.final_settlement_number
                            : "------"}
                        </h6>
                      </div>
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Final Settlement status",
                          }}
                        />
                        <h6>
                          {this.state.final_settlement_status
                            ? this.state.final_settlement_status
                            : "------"}
                        </h6>
                      </div>
                    </>
                  ) : null}
                  {this.state.reciepts_type === "LO" ? (
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Pending Amount",
                        }}
                      />
                      <h6>
                        {currentLoan.pending_loan
                          ? currentLoan.pending_loan
                          : "0.00"}
                      </h6>
                    </div>
                  ) : null}
                </div>
                <div className="row" data-validate="writeOffDiv">
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{ forceLabel: "Mode of Receipt", isImp: true }}
                    selector={{
                      name: "reciepts_mode",
                      value: this.state.reciepts_mode,
                      className: "select-fld",
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data:
                          this.state.reciepts_type === "FS"
                            ? GlobalVariables.RECIEPTS_MODE_RECEIPTS
                            : GlobalVariables.RECIEPTS_MODE,
                      },
                      onChange: this.dropDownHandler.bind(this),
                    }}
                  />

                  {this.state.reciepts_mode === "CH" ? (
                    <AlagehFormGroup
                      div={{ className: "col form-group" }}
                      label={{
                        forceLabel: "Cheque No.",
                        isImp: true,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "cheque_number",
                        value: this.state.cheque_number,
                        events: {
                          onChange: this.textHandler.bind(this),
                        },
                      }}
                    />
                  ) : null}
                  {this.state.reciepts_mode === "SA" ? (
                    <>
                      <AlagehAutoComplete
                        div={{ className: "col-1 mandatory" }}
                        label={{
                          forceLabel: "Year",
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
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2 mandatory" }}
                        label={{
                          forceLabel: "Month",
                          isImp: true,
                        }}
                        selector={{
                          sort: "off",
                          name: "month",
                          className: "select-fld",
                          value: this.state.month,
                          dataSource: {
                            textField: "name",
                            valueField: "value",
                            data: MONTHS,
                          },
                          onChange: this.dropDownHandler.bind(this),
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2 mandatory" }}
                        label={{
                          forceLabel: "Select Salary",
                          isImp: true,
                        }}
                        selector={{
                          // sort: "off",
                          name: "salary_id",
                          className: "select-fld",
                          value: this.state.salary_id,
                          dataSource: {
                            textField: "salary_number",
                            valueField: "hims_f_salary_id",
                            data: this.state.employee_salary,
                          },
                          onChange: this.dropDownHandler.bind(this),
                        }}
                      />
                    </>
                  ) : null}

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Loan Write Off Amount",
                      isImp: false,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "write_off_amount",
                      value: this.state.write_off_amount,
                      events: {
                        onChange: this.textHandler.bind(this),
                      },
                      option: {
                        type: "number",
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Amount Received",
                      isImp: true,
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "recievable_amount",
                      value: this.state.recievable_amount,
                      events: {
                        onChange: this.textHandler.bind(this),
                      },
                      option: {
                        type: "number",
                      },
                    }}
                  />

                  <div className="col form-group">
                    <button
                      style={{ marginTop: 20 }}
                      className="btn btn-default"
                    >
                      Print
                    </button>{" "}
                    <button
                      onClick={this.addEmployeeReceipts.bind(this)}
                      style={{ marginTop: 20, marginLeft: 10 }}
                      className="btn btn-primary"
                    >
                      Received
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
                          fieldName: "actions",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Print Receipt",
                              }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {" "}
                                <i
                                  className="fas fa-print"
                                  onClick={() => {
                                    return;
                                  }}
                                ></i>
                              </span>
                            );
                          },
                        },
                        {
                          fieldName:
                            this.state.reciepts_type === "LO"
                              ? "loan_application_number"
                              : "final_settlement_number",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel:
                                  this.state.reciepts_type === "LO"
                                    ? "Loan Application No."
                                    : "Final Settlement No.",
                              }}
                            />
                          ),
                        },
                        {
                          fieldName: "reciepts_type",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Receipts Type" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.reciepts_type === "LO"
                                  ? "Loan"
                                  : row.reciepts_type === "FS"
                                  ? "Final Settlement"
                                  : "------"}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                        },
                        {
                          fieldName: "write_off_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Write off Amount" }}
                            />
                          ),
                        },
                        {
                          fieldName: "reciepts_mode",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Mode of Receipt" }}
                            />
                          ),
                          displayTemplate: (row) => {
                            return (
                              <span>
                                {row.reciepts_mode === "CS"
                                  ? "Cash"
                                  : row.reciepts_mode === "CH"
                                  ? "Cheque"
                                  : "Salary"}
                              </span>
                            );
                          },
                        },
                        {
                          fieldName: "salary_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Salary Number" }}
                            />
                          ),
                        },
                        {
                          fieldName: "recievable_amount",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Amount Received" }}
                            />
                          ),
                        },
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
