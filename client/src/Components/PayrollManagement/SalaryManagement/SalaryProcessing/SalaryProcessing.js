import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import { texthandle, SalaryProcess } from "./SalaryProcessingEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import Enumerable from "linq";

class SalaryProcessing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      year: moment().year(),
      month: moment(new Date()).format("M"),
      sub_department_id: null,
      salary_type: null
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
    const depEmployee = Enumerable.from(this.props.all_employees)
      .where(w => w.sub_department_id === this.state.sub_department_id)
      .toArray();
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
                  type: "number",
                  min: moment().year()
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

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Employee.",
                isImp: false
              }}
              selector={{
                name: "select_employee_id",
                className: "select-fld",
                value: this.state.select_employee_id,
                dataSource: {
                  textField: "full_name",
                  valueField: "hims_d_employee_id",
                  data:
                    this.state.sub_department_id !== null
                      ? depEmployee
                      : this.props.all_employees
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    select_employee_id: null
                  });
                }
              }}
            />
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
          <div className="row">
            <div className="col-9">
              <div className="row">
                <div className="col-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -{" "}
                          <span>Dec 01 2018 - Dec 31 2018</span>
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
                                fieldName: "",
                                label: "Salary No."
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Employee Name",
                                others: {
                                  minWidth: 150,
                                  maxWidth: 250
                                }
                              },
                              {
                                fieldName: "",
                                label: "Present Days"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Basic"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Advance"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Loan Amount"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Total Amount"
                                //disabled: true
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
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
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
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
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
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
                                fieldName: "",
                                label: "Description"
                                //disabled: true
                              },
                              {
                                fieldName: "",
                                label: "Amount",
                                others: {
                                  maxWidth: 100
                                }
                              }
                            ]}
                            keyId="algaeh_d_module_id"
                            dataSource={{
                              data: []
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
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Holidays"
                        }}
                      />
                      <h6>31</h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Unpaid Holidays"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Absent"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Present"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Leaves"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Comp Off."
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Holidays/ Week Off"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Paid Days"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Previous Unpaid Holidays"
                        }}
                      />
                      <h6>31</h6>
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
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Total Deductions"
                        }}
                      />
                      <h6>31</h6>
                    </div>

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Loan Payable"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Due Loan"
                        }}
                      />
                      <h6>31</h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Salary"
                        }}
                      />
                      <h6>31</h6>
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
                  //   onClick={SaveDoctorCommission.bind(this, this)}
                  //disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Save", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Clear", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-other"
                  //   onClick={PostDoctorCommission.bind(this, this)}
                  // disabled={this.state.postEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Generate Payment"
                      //   returnText: true
                    }}
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
