import React, { Component } from "react";
import "./SalaryProcessing.scss";

import { AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import { EmployeeFilter } from "../../../common/EmployeeFilter";
import {
  SalaryProcess,
  FinalizeSalary,
  ClearData,
  openSalaryComponents,
  closeSalaryComponents,
  getOptions,
  generateMonthlyLoanReport,
  generateMonthlyRevertReport,
  onClickRevert,
  // generateLevGratReconReport
} from "./NewSalaryProcessingEvents.js";
import SalariesComponents from "./SalariesComponents";
import {
  AlgaehSecurityElement,
  AlgaehDataGrid,
  Tooltip,
  Modal,
  AlgaehFormGroup,
} from "algaeh-react-components";
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
      revert_visible: false,
      revert_reason: null,
      emp_salary_details: {},
    };
    this.allChecked = undefined;
    getOptions(this);
  }
  onCheckChangeRow(dol, row, e) {
    const status = e.target.checked;
    // const currentRow = row;
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
            loadFunc={(inputs) => {
              this.setState({ ...inputs });
              SalaryProcess(this, inputs, "load");
            }}
          />
          <Modal
            title="Revert Reason"
            visible={this.state.revert_visible}
            width={300}
            footer={null}
            onCancel={() =>
              this.setState({ revert_visible: false, revert_reason: null })
            }
            className={`row algaehNewModal preRevertModal`}
          >
            <AlgaehFormGroup
              div={{
                className: "col-12 form-group mandatory margin-top-15",
              }}
              label={{
                forceLabel: "Reason",
                isImp: true,
              }}
              textBox={{
                type: "text",
                value: this.state.revert_reason,
                className: "form-control",
                id: "name",
                onChange: (e) => {
                  this.setState({ revert_reason: e.target.value });
                },
                autoComplete: false,
              }}
            />

            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      className="btn btn-primary"
                      onClick={onClickRevert.bind(this, this)}
                    >
                      Revert
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Salary_Management_Cntr">
                          <AlgaehDataGrid
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
                                    <>
                                      <Tooltip title="View Salary Details">
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
                                      </Tooltip>
                                      {row.salary_processed === "Y" &&
                                      row.salary_paid === "N" ? (
                                        <Tooltip title="Revert to Unfinalized">
                                          <span
                                            onClick={() => {
                                              this.setState({
                                                revert_visible: true,
                                                emp_salary_details: row,
                                              });
                                            }}
                                          >
                                            <i className="fas fa-undo-alt"></i>
                                          </span>
                                        </Tooltip>
                                      ) : null}
                                    </>
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
                                  minWidth: 80,
                                },
                                filterable: true,
                                filterType: "choices",
                                choices: [
                                  {
                                    name: "Finalized",
                                    value: "Y",
                                  },
                                  {
                                    name: "Not Finalized",
                                    value: "N",
                                  },
                                ],
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
                                  minWidth: 80,
                                },
                                filterable: true,
                                filterType: "choices",
                                choices: [
                                  {
                                    name: "Paid",
                                    value: "Y",
                                  },
                                  {
                                    name: "Unpaid",
                                    value: "N",
                                  },
                                ],
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
                                filterable: true,
                                // others: {
                                //   minWidth: 80,
                                // },
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
                                others: {
                                  minWidth: 300,
                                  style: { textAlign: "left" },
                                },
                                filterable: true,
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
                                  minWidth: 120,
                                },
                                filterable: true,
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
                                filterable: true,
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
                                filterable: true,
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
                                filterable: true,
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
                                filterable: true,
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
                                filterable: true,
                              },
                            ]}
                            keyId="algaeh_d_module_id"
                            data={this.state.salaryprocess_header}
                            pagination={true}
                            isFilterable={true}

                            // isEditable={true}
                            // dataSource={{
                            //   data: this.state.salaryprocess_header,
                            // }}

                            // paging={{ page: 0, rowsPerPage: 10 }}
                            // events={{
                            //   onEdit: () => {},
                            //   onDelete: () => {},
                            //   onDone: () => {},
                            // }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AlgaehSecurityElement elementCode="READ_ONLY_ACCESS">
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
                      label={{ fieldName: "btn_clear", returnText: true }}
                    />
                  </button>
                  {/* this.state.salaryprocess_header */}
                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={generateMonthlyLoanReport.bind(this, this)}
                    disabled={
                      this.state.salaryprocess_header.length === 0
                        ? true
                        : false
                    }
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Monthly Loan Report",
                        returnText: true,
                      }}
                    />
                  </button>
                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={generateMonthlyRevertReport.bind(this, this)}
                    disabled={
                      this.state.salaryprocess_header.length === 0
                        ? true
                        : false
                    }
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Monthly Revert Report",
                        returnText: true,
                      }}
                    />
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-other"
                    onClick={generateLevGratReconReport.bind(this, this)}
                    disabled={
                      this.state.salaryprocess_header.length === 0
                        ? true
                        : false
                    }
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Leave & Gratuity Reconciliation Report",
                        returnText: true,
                      }}
                    />
                  </button> */}
                </div>
              </div>
            </div>
          </AlgaehSecurityElement>
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
