import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./SalaryProcessing.scss";

import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import {
  getYears,
  getAmountFormart,
  AlgaehOpenContainer
} from "../../../../utils/GlobalFunctions";

import {
  texthandle,
  SalaryProcess,
  FinalizeSalary,
  ClearData,
  employeeSearch,
  openSalaryComponents,
  closeSalaryComponents
} from "./SalaryProcessingEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import SalariesComponents from "./SalariesComponents";

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
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,

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
      dis_employee_name: null
    };
  }

  componentDidMount() {
    if (
      this.props.organizations === undefined ||
      this.props.organizations.length === 0
    ) {
      this.props.getOrganizations({
        uri: "/organization/getOrganizationByUser",
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
        module: "masterSettings",
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
        module: "hrManagement",
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

    let allYears = getYears();

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
                sort: "off",
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
                }
              }}
            />

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Year.",
                isImp: true
              }}
              selector={{
                name: "year",
                className: "select-fld",
                value: this.state.year,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: allYears
                },
                onChange: texthandle.bind(this, this),

                onClear: () => {
                  this.setState({
                    year: null
                  });
                }
              }}
            />

            {/* <AlagehFormGroup
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
            /> */}
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
                forceLabel: "Select a Sub Dept.",
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
                style={{ marginTop: 19 }}
                onClick={SalaryProcess.bind(this, this, "load")}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row" style={{ marginBottom: 40 }}>
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salary Payment List for month of:
                          <span>{salary_dates}</span>
                        </h3>
                      </div>
                      <div className="actions">
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input type="checkbox" value="" name="" />
                            <span>Select All</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="Salary_Management_Cntr">
                          <AlgaehDataGrid
                            id="Salary_Management_Cntr_grid"
                            columns={[
                              {
                                fieldName: "Action",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Action"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
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
                                  filterable: false
                                }
                              },
                              // {
                              //   fieldName: "",
                              //   label: (
                              //     <AlgaehLabel
                              //       label={{
                              //         forceLabel: "Select"
                              //       }}
                              //     />
                              //   ),
                              //   //disabled: true
                              //   displayTemplate: row => {
                              //     return (
                              //       <span>
                              //         <input
                              //           type="checkbox"
                              //           value="Salary Processs"
                              //         // onChange={selectToPay.bind(
                              //         //   this,
                              //         //   this,
                              //         //   row
                              //         // )}
                              //         // checked={
                              //         //   row.select_to_pay === "Y"
                              //         //     ? true
                              //         //     : false
                              //         // }
                              //         // disabled={
                              //         //   row.salary_paid === "Y" ? true : false
                              //         // }
                              //         />
                              //       </span>
                              //     );
                              //   },
                              //   others: {
                              //     maxWidth: 50,
                              //     filterable: false
                              //   }
                              // },
                              {
                                fieldName: "salary_processed",

                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Salary Finalized"
                                    }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return row.salary_processed === "N" ? (
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
                                ),
                                others: {
                                  minWidth: 180
                                }
                              },
                              {
                                fieldName: "employee_code",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Employee Code"
                                    }}
                                  />
                                )
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
                                  maxWidth: 280
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
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {getAmountFormart(row.advance_due)}
                                    </span>
                                  );
                                }
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
                                      {getAmountFormart(row.loan_due_amount)}
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
                                      {getAmountFormart(
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
                                      {getAmountFormart(row.net_salary)}
                                    </span>
                                  );
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: this.state.salaryprocess_header
                            }}
                            filter={true}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 20 }}
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
