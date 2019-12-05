import React, { PureComponent } from "react";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import "./SalaryProcessing.scss";
// import "./../../styles/site.scss";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";

export default class SalariesComponents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.selectedEmployee !== undefined) {
      this.setState({ ...this.state, ...newProps.selectedEmployee });
    }
  }

  render() {
    return (
      <div>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Salary Details"
          openPopup={this.props.open}
        >
          <div className="popupInner">
            <div className="col-12 margin-top-15"></div>
            <div className="col-12 margin-bottom-15">
              <div className="portlet portlet-bordered">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Employee Name"
                        }}
                      />
                      <h6>
                        {this.state.dis_employee_name === null
                          ? 0
                          : this.state.dis_employee_name}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Days"
                        }}
                      />
                      <h6>
                        {this.state.total_days === null
                          ? 0
                          : this.state.total_days}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Present Days"
                        }}
                      />
                      <h6>
                        {this.state.display_present_days === null
                          ? 0
                          : this.state.display_present_days}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Absent Days"
                        }}
                      />
                      <h6>
                        {this.state.absent_days === null
                          ? 0
                          : this.state.absent_days}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Leave"
                        }}
                      />
                      <h6>
                        {this.state.paid_leave === null
                          ? 0
                          : this.state.paid_leave}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Unpaid Leave"
                        }}
                      />
                      <h6>
                        {this.state.unpaid_leave === null
                          ? 0
                          : this.state.unpaid_leave}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Previous Unpaid Leaves"
                        }}
                      />
                      <h6>
                        {this.state.pending_unpaid_leave === null
                          ? 0
                          : this.state.pending_unpaid_leave}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Leaves"
                        }}
                      />
                      <h6>
                        {this.state.total_leave === null
                          ? 0
                          : this.state.total_leave}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Comp Off."
                        }}
                      />
                      <h6>
                        {this.state.comp_off_days === null
                          ? 0
                          : this.state.comp_off_days}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Holidays/ Week Off"
                        }}
                      />
                      <h6>
                        {this.state.total_holidays +
                          " / " +
                          this.state.total_weekoff_days}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Days"
                        }}
                      />
                      <h6>
                        {this.state.total_paid_days === null
                          ? 0
                          : this.state.total_paid_days}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="row">
                <div className="col-4">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Earnings</h3>
                      </div>
                      <div className="actions">
                        {/* <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Salary_Earning_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Earning_Cntr_grid"
                            columns={[
                              {
                                fieldName: "earning_deduction_description",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Description"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>{getAmountFormart(row.amount)}</span>
                                  );
                                },

                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_Earning
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {}
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Employee Deduction</h3>
                      </div>
                      <div className="actions">
                        {/*    <a className="btn btn-primary btn-circle active">
                     <i className="fas fa-calculator" />
                      </a> */}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div
                          className="col-lg-12"
                          id="Employee_Deductions_Cntr"
                        >
                          <AlgaehDataGrid
                            id="Employee_Deductions_Cntr_grid"
                            columns={[
                              {
                                fieldName: "earning_deduction_description",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Description"
                                    }}
                                  />
                                )
                                //disabled: true
                              },
                              {
                                fieldName: "amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>{getAmountFormart(row.amount)}</span>
                                  );
                                },

                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_Deduction
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {}
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Employer Contribution
                        </h3>
                      </div>
                      <div className="actions">
                        {/*    <a className="btn btn-primary btn-circle active">
                      <i className="fas fa-calculator" /> 
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div
                          className="col-lg-12"
                          id="Employer_Contribution_Cntr"
                        >
                          <AlgaehDataGrid
                            id="Employer_Contribution_Cntr_grid"
                            columns={[
                              {
                                fieldName: "earning_deduction_description",

                                //disabled: true
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Description"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Amount"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>{getAmountFormart(row.amount)}</span>
                                  );
                                },

                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_Contribute
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {}
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Gross Earnings"
                        }}
                      />
                      <h6>
                        {this.state.total_earnings === null
                          ? 0
                          : getAmountFormart(this.state.total_earnings)}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Deductions"
                        }}
                      />
                      <h6>
                        {this.state.total_deductions === null
                          ? 0
                          : getAmountFormart(this.state.total_deductions)}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Loan Payable"
                        }}
                      />
                      <h6>
                        {this.state.loan_payable_amount === null
                          ? 0
                          : getAmountFormart(this.state.loan_payable_amount)}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Due Loan"
                        }}
                      />
                      <h6>
                        {this.state.loan_due_amount === null
                          ? 0
                          : getAmountFormart(this.state.loan_due_amount)}
                      </h6>
                    </div>
                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Salary"
                        }}
                      />
                      <h6>
                        {this.state.net_salary === null
                          ? 0
                          : getAmountFormart(this.state.net_salary)}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="popupFooter">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-default"
                onClick={e => {
                  this.onClose(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </AlgaehModalPopUp>
      </div>
    );
  }
}
