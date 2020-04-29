import React, { Component } from "react";
import "./SalaryProcessing.scss";

import { AlgaehLabel, AlgaehDataGrid } from "../../../Wrapper/algaehWrapper";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import { EmployeeFilter } from "../../../common/EmployeeFilter";
import {
  SalaryProcess,
  FinalizeSalary,
  ClearData,
  openSalaryComponents,
  closeSalaryComponents,
  getOptions,
} from "./NewSalaryProcessingEvents.js";
import SalariesComponents from "./SalariesComponents";
const STATUS = {
  CHECK: true,
  UNCHECK: false,
  INDETERMINATE: true,
};
class NewSalaryProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      inputs: {},
      salary_type: null,
      salaryprocess_header: [],
      salaryprocess_Earning: [],
      salaryprocess_Deduction: [],
      salaryprocess_Contribute: [],
      finalizeBtn: true,
      employee_id: null,
      employee_name: null,
      total_days: null,
      absent_days: null,
      total_work_days: null,
      total_weekoff_days: null,
      total_holidays: null,
      total_leave: null,
      paid_leave: null,
      unpaid_leave: null,
      present_days: null,
      pending_unpaid_leave: null,
      total_paid_days: null,
      comp_off_days: null,

      total_earnings: null,
      total_deductions: null,
      loan_payable_amount: null,
      loan_due_amount: null,
      net_salary: null,
      salary_dates: null,
      isOpen: false,
      dis_employee_name: null,
      hrms_options: {},
      selectAll: STATUS.UNCHECK,
    };
    this.allChecked = undefined;
    getOptions(this);
  }
  onCheckChangeRow(dol, row, e) {
    const status = e.target.checked;
    const currentRow = row;
    row.checked = status;
    const records = this.state.salaryprocess_header;
    const hasUncheck = records.filter((f) => {
      return f.checked === undefined || f.checked === false;
    });
    const hasProceesed = hasUncheck.find((f) => f.salary_processed === "Y");
    const totalRecords = records.length;
    let ckStatus =
      totalRecords === hasUncheck.length
        ? "UNCHECK"
        : hasUncheck.length === 0
        ? "CHECK"
        : "INDETERMINATE";
    if (hasProceesed !== undefined) {
      ckStatus = "INDETERMINATE";
    }
    if (ckStatus === "INDETERMINATE") {
      this.allChecked.indeterminate = true;
    } else {
      this.allChecked.indeterminate = false;
    }
    this.setState({
      selectAll: ckStatus,
    });
  }
  onChageCheckSelectAll(e) {
    const staus = e.target.checked;
    const myState = this.state.salaryprocess_header.map((f) => {
      return { ...f, checked: f.salary_processed === "N" ? staus : false };
    });

    const hasProcessed = myState.find((f) => f.salary_processed === "Y");
    if (hasProcessed !== undefined && staus === true) {
      this.allChecked.indeterminate = true;
    } else {
      this.allChecked.indeterminate = false;
    }
    this.setState({
      salaryprocess_header: myState,
      selectAll:
        hasProcessed !== undefined
          ? "INDETERMINATE"
          : staus === true
          ? "CHECK"
          : "UNCHECK",
    });
  }
  render() {
    return (
      <React.Fragment>
        <div className="hptl-SalaryManagement-form">
          <EmployeeFilter
            loadFunc={(inputs) => SalaryProcess(this, inputs, "load")}
          />
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    {/*<div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salary List for month of: <span>{""}</span>
                        </h3>
                      </div>

                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input type="checkbox" value="" name="" />
                          <span>Select All</span>
                        </label>
                      </div>
                    </div>*/}

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Salary_Management_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Management_Cntr_grid"
                            columns={[
                              {
                                label: (
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      this.state.selectAll === "CHECK"
                                        ? true
                                        : false
                                    }
                                    ref={(input) => {
                                      this.allChecked = input;
                                    }}
                                    onChange={this.onChageCheckSelectAll.bind(
                                      this
                                    )}
                                  />
                                ),
                                fieldName: "select",
                                displayTemplate: (row) => (
                                  <input
                                    type="checkbox"
                                    checked={row.checked}
                                    disabled={
                                      row.salary_processed === "Y"
                                        ? true
                                        : false
                                    }
                                    onChange={this.onCheckChangeRow.bind(
                                      this,
                                      this,
                                      row
                                    )}
                                  />
                                ),
                                others: {
                                  minWidth: 50,
                                  filterable: false,
                                  sortable: false,
                                },
                              },
                              {
                                fieldName: "Action",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Action",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      <i
                                        className="fas fa-eye"
                                        aria-hidden="true"
                                        onClick={openSalaryComponents.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </span>
                                  );
                                },
                                others: {
                                  minWidth: 50,
                                  filterable: false,
                                  sortable: false,
                                },
                              },

                              {
                                fieldName: "salary_processed",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary Status",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.salary_processed === "N" ? (
                                    <span className="badge badge-warning">
                                      Not Finalized
                                    </span>
                                  ) : (
                                    <span className="badge badge-success">
                                      Finalized
                                    </span>
                                  );
                                },
                                others: {
                                  minWidth: 100,
                                },
                              },
                              {
                                fieldName: "salary_paid",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Payment Status",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return row.salary_paid === "N" ? (
                                    <span className="badge badge-warning">
                                      Unpaid
                                    </span>
                                  ) : (
                                    <span className="badge badge-success">
                                      Paid
                                    </span>
                                  );
                                },
                                others: {
                                  minWidth: 100,
                                },
                              },
                              {
                                fieldName: "salary_number",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary No.",
                                    }}
                                  />
                                ),
                                others: {
                                  minWidth: 160,
                                },
                              },
                              {
                                fieldName: "employee_code",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Emp. Code",
                                    }}
                                  />
                                ),
                                others: {
                                  minWidth: 160,
                                },
                              },
                              {
                                fieldName: "full_name",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Emp. Name",
                                    }}
                                  />
                                ),
                              },
                              {
                                fieldName: "display_present_days",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Present days",
                                    }}
                                  />
                                ),
                              },
                              {
                                fieldName: "advance_due",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Advance Due",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.advance_due)}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "loan_due_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Due Amt.",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.loan_due_amount)}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "loan_payable_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Payable Amt.",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(
                                        row.loan_payable_amount
                                      )}
                                    </span>
                                  );
                                },
                              },
                              {
                                fieldName: "net_salary",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Total Amt.",
                                    }}
                                  />
                                ),
                                displayTemplate: (row) => {
                                  return (
                                    <span>
                                      {GetAmountFormart(row.net_salary)}
                                    </span>
                                  );
                                },
                              },
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_header,
                            }}
                            filter={true}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 20 }}
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
                  onClick={FinalizeSalary.bind(this, this)}
                  disabled={this.state.finalizeBtn}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Send for Payment",
                      returnText: true,
                    }}
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
              </div>
            </div>
          </div>
          <SalariesComponents
            open={this.state.isOpen}
            onClose={closeSalaryComponents.bind(this, this)}
            selectedEmployee={this.state}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default NewSalaryProcessing;
