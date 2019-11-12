import React, { Component } from "react";
import "./loan-adjustment.scss";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import AlgaehSearch from "../../../Wrapper/globalSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import { algaehApiCall, swalMessage } from "../../../../utils/algaehApiCall";
import moment from "moment";

class LoanAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employee_loans: [],
      loading: false
    };
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
        this.setState({
          employee_name: row.full_name,
          hims_d_employee_id: row.hims_d_employee_id
        });
      }
    });
  }

  adjustLoan(data) {
    algaehApiCall({
      uri: "/loan/adjustLoanApplication",
      module: "hrManagement",
      method: "PUT",
      data: {
        hims_f_loan_application_id: data.hims_f_loan_application_id,
        loan_skip_months: data.loan_skip_months
      },
      onSuccess: res => {
        if (res.data.success) {
          swalMessage({
            title: "Record Updated Successfully",
            type: "success"
          });
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

  clearState() {
    this.setState({
      employee_name: null,
      hims_d_employee_id: null,
      employee_loans: []
    });
  }

  changeGridEditors(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row.update();
  }

  getEmployeeLoans() {
    if (
      this.state.hims_d_employee_id === null ||
      this.state.hims_d_employee_id === undefined
    ) {
      swalMessage({
        title: "Please Select an Employee",
        type: "warning"
      });
    } else {
      this.setState({
        loading: true
      });
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
              employee_loans: res.data.records,
              loading: false
            });
          }
        },
        onFailure: err => {
          swalMessage({
            title: err.message,
            type: "error"
          });

          this.setState({
            loading: false
          });
        }
      });
    }
  }

  render() {
    return (
      <div className="laon-adjustment">
        <div
          className="row inner-top-search"
          style={{ paddingTop: 10, paddingBottom: 10 }}
        >
          {/* <AlagehAutoComplete
            div={{ className: "col-3 form-group mandatory" }}
            label={{ forceLabel: "Select and Employee", isImp: true }}
            selector={{
              name: "",
              className: "select-fld",
              dataSource: {},
              others: {}
            }}
          /> */}

          {/* <div className="col-lg-3">
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
          </div> */}

          <div className="col-3 globalSearchCntr">
            <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
            <h6 onClick={this.employeeSearch.bind(this)}>
              {this.state.employee_name
                ? this.state.employee_name
                : "Search Employee"}
              <i className="fas fa-search fa-lg"></i>
            </h6>
          </div>

          <div className="col-lg-2">
            <button
              onClick={this.getEmployeeLoans.bind(this)}
              style={{ marginTop: 19 }}
              className="btn btn-primary"
            >
              {!this.state.loading ? (
                <span>Load</span>
              ) : (
                <i className="fas fa-spinner fa-spin" />
              )}
            </button>
            <button
              onClick={this.clearState.bind(this)}
              style={{ marginTop: 19, marginLeft: 5 }}
              className="btn btn-default"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-title">
                <div className="caption">
                  <h3 className="caption-subject">Loan Adjustment</h3>
                </div>
                {/* <div className="actions">
                  <a className="btn btn-primary btn-circle active">
                    <i className="fas fa-pen" />
                  </a>
                </div> */}
              </div>
              <div className="portlet-body">
                <div className="row">
                  <div className="col-12" id="LoanAdjustGrid_Cntr">
                    <AlgaehDataGrid
                      id="LoanAdjustGrid"
                      datavalidate="LoanAdjustGrid"
                      columns={[
                        {
                          fieldName: "loan_skip_months",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Skipping Months" }}
                            />
                          ),
                          displayTemplate: row => {
                            return <span>{row.loan_skip_months}</span>;
                          },
                          editorTemplate: row => {
                            return (
                              <AlagehFormGroup
                                textBox={{
                                  value: row.loan_skip_months,
                                  className: "txt-fld",
                                  name: "loan_skip_months",
                                  events: {
                                    onChange: this.changeGridEditors.bind(
                                      this,
                                      row
                                    )
                                  },
                                  others: {
                                    errormessage:
                                      "Skip Months - cannot be blank",
                                    required: true,
                                    type: "number"
                                  }
                                }}
                              />
                            );
                          }
                        },
                        // {
                        //   fieldName: "pay_months",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{ forceLabel: "Pay Month Togther" }}
                        //     />
                        //   ),
                        //   displayTemplate: row => {
                        //     return <span>{row.pay_months}</span>;
                        //   },
                        //   editorTemplate: row => {
                        //     return (
                        //       <AlagehFormGroup
                        //         textBox={{
                        //           value: row.pay_months,
                        //           className: "txt-fld",
                        //           name: "pay_months",
                        //           events: {
                        //             onChange: this.changeGridEditors.bind(
                        //               this,
                        //               row
                        //             )
                        //           },
                        //           others: {
                        //             errormessage:
                        //               "Pay Months - cannot be blank",
                        //             required: true,
                        //             type: "number"
                        //           }
                        //         }}
                        //       />
                        //     );
                        //   }
                        // },
                        // {
                        //   fieldName: "skip_year",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{
                        //         forceLabel: "Start Year of Skip/ Pay Loan"
                        //       }}
                        //     />
                        //   ),
                        //   displayTemplate: row => {
                        //     return <span>{row.skip_year}</span>;
                        //   },
                        //   editorTemplate: row => {
                        //     return (
                        //       <AlagehFormGroup
                        //         textBox={{
                        //           value: row.skip_year,
                        //           className: "txt-fld",
                        //           name: "skip_year",
                        //           events: {
                        //             onChange: this.changeGridEditors.bind(
                        //               this,
                        //               row
                        //             )
                        //           },
                        //           others: {
                        //             errormessage: "Skip Year - cannot be blank",
                        //             required: true,
                        //             type: "number"
                        //           }
                        //         }}
                        //       />
                        //     );
                        //   }
                        // },
                        // {
                        //   fieldName: "skip_month_start",
                        //   label: (
                        //     <AlgaehLabel
                        //       label={{
                        //         forceLabel: "Start Month of Skip/ Pay Loan"
                        //       }}
                        //     />
                        //   ),
                        //   displayTemplate: row => {
                        //
                        //     return (
                        //       <span>
                        //         {row.skip_month_start === "1"
                        //           ? "January"
                        //           : row.skip_month_start === "2"
                        //           ? "February"
                        //           : row.skip_month_start === "3"
                        //           ? "March"
                        //           : row.skip_month_start === "4"
                        //           ? "April"
                        //           : row.skip_month_start === "5"
                        //           ? "May"
                        //           : row.skip_month_start === "6"
                        //           ? "June"
                        //           : row.skip_month_start === "7"
                        //           ? "July"
                        //           : row.skip_month_start === "8"
                        //           ? "August"
                        //           : row.skip_month_start === "9"
                        //           ? "September"
                        //           : row.skip_month_start === "10"
                        //           ? "October"
                        //           : row.skip_month_start === "11"
                        //           ? "November"
                        //           : row.skip_month_start === "12"
                        //           ? "December"
                        //           : null}
                        //       </span>
                        //     );
                        //   },
                        //   editorTemplate: row => {
                        //     return (
                        //       <AlagehAutoComplete
                        //         selector={{
                        //           name: "skip_month_start",
                        //           className: "select-fld",
                        //           value: row.skip_month_start,
                        //           dataSource: {
                        //             textField: "name",
                        //             valueField: "value",
                        //             data: GlobalVariables.MONTHS
                        //           },
                        //           others: {
                        //             errormessage: "Months - cannot be blank",
                        //             required: true
                        //           },
                        //           onChange: this.changeGridEditors.bind(
                        //             this,
                        //             row
                        //           )
                        //         }}
                        //       />
                        //     );
                        //   }
                        // },
                        {
                          fieldName: "employee_code",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Code" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "employee_name",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Employee Name" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "loan_application_number",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Loan Application Code" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "application_reason",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Application Description" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "loan_application_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Application Date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {moment(row.loan_application_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>
                                {moment(row.loan_application_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </span>
                            );
                          }
                        }
                      ]}
                      keyId="hims_f_loan_application_id"
                      dataSource={{ data: this.state.employee_loans }}
                      isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      loading={this.state.loading}
                      events={{
                        onEdit: () => {},
                        onDone: this.adjustLoan.bind(this),
                        onDelete: () => {}
                      }}
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

export default LoanAdjustment;
