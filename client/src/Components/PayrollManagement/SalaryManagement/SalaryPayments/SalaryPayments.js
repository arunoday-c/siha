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
import { texthandle, LoadSalaryPayment } from "./SalaryPaymentsEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import Enumerable from "linq";

class SalaryPayment extends Component {
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
  fromMonthHandler(date, name) {
    this.setState({ fromMonth: date });
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
        <div className="hptl-SalaryPayment-form">
          <div className="row  inner-top-search">
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
            {/* <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Payment Type",
                isImp: true
              }}
              selector={{
                name: "",
                className: "select-fld",
                value: "",
                dataSource: {},
                onChange: null,
                others: {
                  tabIndex: "2"
                }
              }}
            /> */}
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
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Salaried Employee Salary List for -
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
                        <div className="col-lg-12" id="SalaryPayment_Cntr">
                          <AlgaehDataGrid
                            id="SalaryPayment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "SalaryPayment_checkBox",
                                label: "",
                                //disabled: true
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      <input type="checkbox" />
                                    </span>
                                  );
                                },
                                options: {
                                  maxWidth: 30
                                }
                              },
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
                    label={{ forceLabel: "Process", returnText: true }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-default"
                  //onClick={ClearData.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Print", returnText: true }}
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
                      forceLabel: "Generate Payslip PDF"
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
  )(SalaryPayment)
);
