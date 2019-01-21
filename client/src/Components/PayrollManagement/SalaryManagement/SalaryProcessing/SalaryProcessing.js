import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  texthandle,
  SalaryProcess,
  getSalaryDetails,
  FinalizeSalary,
  ClearData,
  employeeSearch
} from "./SalaryProcessingEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";

class SalaryProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_department_id: null,
      salary_type: null,
      salaryprocess_header: [],
      salaryprocess_Earning: [],
      salaryprocess_Deduction: [],
      salaryprocess_Contribute: [],
      finalizeBtn: true,
      employee_id: null,
      employee_name: null,
      hospital_id: null,

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

      total_earnings: null,
      total_deductions: null,
      loan_payable_amount: null,
      loan_due_amount: null,
      net_salary: null,
      salary_dates: null
    };
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganization",
        method: "GET",
        redux: {
          type: "ORGS_GET_DATA",
          mappingName: "organizations"
        }
      });
    }

    if (
      this.props.subdepartment === undefined ||
      this.props.subdepartment.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        data: {
          sub_department_status: "A"
        },
        method: "GET",
        redux: {
          type: "SUB_DEPT_GET_DATA",
          mappingName: "subdepartment"
        }
      });
    }

    if (
      this.props.all_employees === undefined ||
      this.props.all_employees.length === 0
    ) {
      this.props.getEmployees({
        uri: "/employee/get",
        method: "GET",

        redux: {
          type: "EMPLY_GET_DATA",
          mappingName: "all_employees"
        }
      });
    }
  }

  render() {
    let yearAndMonth = this.state.year + "-" + this.state.month;

    let salary_dates =
      moment(yearAndMonth)
        .startOf("month")
        .format("DD-MM-YYYY") +
      " / " +
      moment(yearAndMonth)
        .endOf("month")
        .format("DD-MM-YYYY");

    return (
      <React.Fragment>
        <div className="hptl-SalaryManagement-form">
          <div className="row  inner-top-search" data-validate="loadSalary">
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Month.",
                isImp: true
              }}
              selector={{
                name: "month",
                className: "select-fld",
                value: this.state.month,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.MONTHS
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    month: null
                  });
                },
                others: {
                  disabled: this.state.lockEarnings
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col" }}
              label={{
                forceLabel: "Year",
                isImp: true
              }}
              textBox={{
                className: "txt-fld",
                name: "year",
                value: this.state.year,
                events: {
                  onChange: texthandle.bind(this, this)
                },
                others: {
                  type: "number"
                  // min: moment().year()
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: true
              }}
              selector={{
                name: "hospital_id",
                className: "select-fld",
                value: this.state.hospital_id,
                dataSource: {
                  textField: "hospital_name",
                  valueField: "hims_d_hospital_id",
                  data: this.props.organizations
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    hospital_id: null
                  });
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Dept..",
                isImp: false
              }}
              selector={{
                name: "sub_department_id",
                className: "select-fld",
                value: this.state.sub_department_id,
                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.props.subdepartment
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    sub_department_id: null
                  });
                }
              }}
            />

            <div className="col-3" style={{ marginTop: 10 }}>
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Select a Employee." }} />
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
                    onClick={employeeSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Salary Type.",
                isImp: false
              }}
              selector={{
                name: "salary_type",
                className: "select-fld",
                value: this.state.salary_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.SALARY_TYPE
                },
                onChange: texthandle.bind(this, this),
                others: {
                  tabIndex: "2"
                }
              }}
            />

            <div className="col margin-bottom-15">
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 21 }}
                onClick={SalaryProcess.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-9">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -
                          <span>{salary_dates}</span>
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
                        <div className="col-lg-12" id="Salary_Management_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Management_Cntr_grid"
                            columns={[
                              {
                                fieldName: "salary_number",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary No."
                                    }}
                                  />
                                ),

                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }

                                //disabled: true
                              },
                              {
                                fieldName: "employee_code",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Employee Code"
                                    }}
                                  />
                                ),
                                className: drow => {
                                  return "greenCell";
                                },
                                displayTemplate: row => {
                                  return (
                                    <span
                                      className="pat-code"
                                      onClick={() => {
                                        getSalaryDetails(this, row);
                                      }}
                                    >
                                      {row.employee_code}
                                    </span>
                                  );
                                },

                                others: {
                                  minWidth: 120,
                                  maxWidth: 200
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
                                fieldName: "present_days",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Present days"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "advance_due",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Advance"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "loan_due_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Due Amount"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "loan_payable_amount",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Loan Payable Amount"
                                    }}
                                  />
                                )
                              },
                              {
                                fieldName: "net_salary",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Total Amount"
                                    }}
                                  />
                                )
                              }
                            ]}
                            // rowClassName={row => {
                            //   return row.salary_processed === "Y"
                            //     ? "greenCell"
                            //     : null;
                            // }}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_header
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onEdit: () => {},
                              onDelete: () => {},
                              onDone: () => {}
                            }}
                            // onRowSelect={row => {
                            //   getSalaryDetails(this, row);
                            // }}
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
            <div className="col-3">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-6">
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
                    <div className="col-6">
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

                    <div className="col-6">
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
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Absent"
                        }}
                      />
                      <h6>
                        {this.state.absent_days === null
                          ? 0
                          : this.state.absent_days}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Present Days"
                        }}
                      />
                      <h6>
                        {this.state.present_days === null
                          ? 0
                          : this.state.present_days}
                      </h6>
                    </div>
                    <div className="col-6">
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
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Comp Off."
                        }}
                      />
                      <h6>
                        {this.state.total_days === null
                          ? 0
                          : this.state.total_days}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Holidays/ Week Off"
                        }}
                      />
                      <h6>
                        {this.state.total_holidays === null
                          ? 0
                          : this.state.total_holidays +
                              "/" +
                              this.state.total_weekoff_days ===
                            null
                          ? 0
                          : this.state.total_weekoff_days}
                      </h6>
                    </div>
                    <div className="col-6">
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
                    <div className="col-6">
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
                  </div>
                </div>
              </div>
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body">
                  <div className="row">
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Gross Earnings"
                        }}
                      />
                      <h6>
                        {this.state.total_earnings === null
                          ? 0
                          : this.state.total_earnings}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Deductions"
                        }}
                      />
                      <h6>
                        {this.state.total_deductions === null
                          ? 0
                          : this.state.total_deductions}
                      </h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Loan Payable"
                        }}
                      />
                      <h6>
                        {this.state.loan_payable_amount === null
                          ? 0
                          : this.state.loan_payable_amount}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Due Loan"
                        }}
                      />
                      <h6>
                        {this.state.loan_due_amount === null
                          ? 0
                          : this.state.loan_due_amount}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Salary"
                        }}
                      />
                      <h6>
                        {this.state.net_salary === null
                          ? 0
                          : this.state.net_salary}
                      </h6>
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
                    label={{ forceLabel: "Finalize", returnText: true }}
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
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    subdepartment: state.subdepartment,
    organizations: state.organizations,
    all_employees: state.all_employees
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SalaryProcessing)
);
