import React, { Component } from "react";
import "./NewSalaryPayments.scss";
import {
  // AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import {
  LoadSalaryPayment,
  ClearData,
  PaySalary,
  selectToPay,
  selectAll,
  generatePaySlip,
  selectToGeneratePaySlip,
  selectAllPaySlip
} from "./NewSalaryPaymentsEvents.js";
import moment from "moment";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import { EmployeeFilter } from "../../../common/EmployeeFilter";

class NewSalaryPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,

      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_department_id: null,
      salary_type: null,
      employee_name: null,
      employee_id: null,
      salary_payment: [],
      paysalaryBtn: true,
      checkAll: false,
      checkAllPayslip: false,
      generatePayslip: true
    };
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-SalaryPayment-form">
          <EmployeeFilter
            loadFunc={inputs => LoadSalaryPayment(this, inputs)}
          />
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      {/*<div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -
                          <span>Dec 01 2018 - Dec 31 2018</span>
                        </h3>
                      </div>*/}

                      <div className="customCheckbox">
                        <label
                          className="checkbox inline"
                          style={{ marginRight: 20 }}
                        >
                          <input
                            type="checkbox"
                            value=""
                            name=""
                            checked={this.state.checkAll}
                            onChange={selectAll.bind(this, this)}
                          />
                          <span>Select All</span>
                        </label>
                        <label className="checkbox inline">
                          <input
                            type="checkbox"
                            value=""
                            name=""
                            checked={this.state.checkAllPayslip}
                            onChange={selectAllPaySlip.bind(this, this)}
                          />
                          <span>Select All Pay Slip</span>
                        </label>
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="SalaryPayment_Cntr">
                          <AlgaehDataGrid
                            id="SalaryPayment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "SalaryPayment_checkBox",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Select To Pay"
                                    }}
                                  />
                                ),
                                //disabled: true
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      <input
                                        type="checkbox"
                                        value="Front Desk"
                                        onChange={selectToPay.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                        checked={
                                          row.select_to_pay === "Y"
                                            ? true
                                            : false
                                        }
                                        disabled={
                                          row.salary_paid === "Y" ? true : false
                                        }
                                      />
                                    </span>
                                  );
                                },
                                others: {
                                  maxWidth: 100,
                                  filterable: false
                                }
                              },
                              {
                                fieldName: "SalaryPayment_checkBox",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Generate Pay Slip"
                                    }}
                                  />
                                ),
                                //disabled: true
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      <input
                                        type="checkbox"
                                        value="Front Desk"
                                        onChange={selectToGeneratePaySlip.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                        checked={
                                          row.generate_pay_slip === "Y"
                                            ? true
                                            : false
                                        }
                                        disabled={
                                          row.salary_paid === "N" ? true : false
                                        }
                                      />
                                    </span>
                                  );
                                },
                                others: {
                                  maxWidth: 150,
                                  filterable: false
                                }
                              },
                              {
                                fieldName: "salary_paid",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary Paid"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.salary_paid === "N" ? (
                                    <span className="badge badge-warning">
                                      No
                                    </span>
                                  ) : (
                                      <span className="badge badge-success">
                                        Yes
                                    </span>
                                    );
                                }
                              },
                              {
                                fieldName: "salary_number",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary Number"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "employee_code",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Emp. Code"
                                    }}
                                  />
                                ),
                                others: {
                                  minWidth: 160
                                }
                              },
                              {
                                fieldName: "full_name",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Employee Name"
                                    }}
                                  />
                                ),
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "display_present_days",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Present Days"
                                    }}
                                  />
                                )
                                //disabled: true
                              },

                              {
                                fieldName: "advance_due",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Advance"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {" "}
                                      {GetAmountFormart(row.advance_due)}
                                    </span>
                                  );
                                }
                                //disabled: true
                              },
                              {
                                fieldName: "loan_due_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Due Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {" "}
                                      {GetAmountFormart(row.loan_due_amount)}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "loan_payable_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Payable Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {" "}
                                      {GetAmountFormart(
                                        row.loan_payable_amount
                                      )}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "net_salary",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Total Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {" "}
                                      {GetAmountFormart(row.net_salary)}
                                    </span>
                                  );
                                }
                                //disabled: true
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salary_payment
                            }}
                            filter={true}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={PaySalary.bind(this, this)}
                  disabled={this.state.paysalaryBtn}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Pay Salary", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-other"
                  onClick={generatePaySlip.bind(this, this)}
                  disabled={this.state.generatePayslip}
                >
                  Generate Payslip PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default NewSalaryPayment;
