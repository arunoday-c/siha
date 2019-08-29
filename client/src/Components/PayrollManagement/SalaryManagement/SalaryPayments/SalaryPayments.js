import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  // AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import {
  texthandle,
  LoadSalaryPayment,
  employeeSearch,
  ClearData,
  PaySalary,
  selectToPay,
  selectAll,
  generatePaySlip
} from "./SalaryPaymentsEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import { getYears, getAmountFormart } from "../../../../utils/GlobalFunctions";

class SalaryPayment extends Component {
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
      paysalaryBtn: true
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
    let allYears = getYears();
    return (
      <React.Fragment>
        <div className="hptl-SalaryPayment-form">
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
                },
                others: {
                  disabled: this.state.lockEarnings
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
                  type: "number",
                  min: moment().year()
                }
              }}
            /> */}
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

            <div className="col" style={{ marginTop: 10 }}>
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
                onClick={LoadSalaryPayment.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -
                          <span>Dec 01 2018 - Dec 31 2018</span>
                        </h3>
                      </div>
                      <div className="actions">
                        <div className="customCheckbox">
                          <label className="checkbox inline">
                            <input
                              type="checkbox"
                              value=""
                              name=""
                              onChange={e => {
                                debugger;
                              }}
                            />
                            <span>Select All</span>
                          </label>
                        </div>
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
                                      forceLabel: "Select"
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
                                  maxWidth: 50,
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
                                      {getAmountFormart(row.advance_due)}
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
                                      {" "}
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
                                      {" "}
                                      {getAmountFormart(row.net_salary)}
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
                  onClick={generatePaySlip.bind(this)}
                  // disabled={this.state.postEnable}
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
  )(SalaryPayment)
);
