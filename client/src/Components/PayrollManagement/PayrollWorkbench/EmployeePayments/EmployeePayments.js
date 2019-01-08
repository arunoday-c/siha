import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./EmployeePayments.css";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid
} from "../../../Wrapper/algaehWrapper";
import GlobalVariables from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import { texthandle, LoadData } from "./EmployeePaymentEvents.js";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Enumerable from "linq";

class EmployeePayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: this.props.SelectLanguage,
      fromMonth: new Date(),
      department_id: null,
      year: moment().year(),
      select_employee_id: null,
      document_num: null,
      month: moment(new Date()).format("M"),
      requestPayment: []
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
    debugger;
    const depEmployee = Enumerable.from(this.props.all_employees)
      .where(w => w.sub_department_id === this.state.department_id)
      .toArray();
    return (
      <React.Fragment>
        <div className="hptl-EmployeePayment-form">
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
                others: {
                  tabIndex: "1"
                },
                onClear: () => {
                  this.setState({
                    month: null
                  });
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
                  min: moment().year(),
                  tabIndex: "2"
                }
              }}
            />
            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Payment Type",
                isImp: true
              }}
              selector={{
                name: "payment_type",
                className: "select-fld",
                value: this.state.payment_type,
                dataSource: {
                  textField: "name",
                  valueField: "value",
                  data: GlobalVariables.EMPLOYEE_PAYMENT_TYPE
                },
                onChange: texthandle.bind(this, this),
                others: {
                  tabIndex: "3"
                },
                onClear: () => {
                  this.setState({
                    payment_type: null
                  });
                }
              }}
            />

            <AlagehFormGroup
              div={{ className: "col form-group" }}
              label={{
                forceLabel: "Document No",
                isImp: false
              }}
              textBox={{
                className: "txt-fld",
                name: "document_num",
                value: this.state.document_num,
                events: {},
                option: {
                  type: "text"
                },
                others: {
                  disabled: true
                }
              }}
            />
            <div
              className="col"
              style={{
                paddingLeft: 0,
                paddingTop: 25,
                paddingRight: 0
              }}
            >
              <span onClick="" style={{ cursor: "pointer" }}>
                <i className="fas fa-search" />
              </span>
            </div>

            <AlagehAutoComplete
              div={{ className: "col" }}
              label={{
                forceLabel: "Select a Branch.",
                isImp: false
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
                name: "department_id",
                className: "select-fld",
                value: this.state.department_id,

                dataSource: {
                  textField: "sub_department_name",
                  valueField: "hims_d_sub_department_id",
                  data: this.props.subdepartment
                },
                onChange: texthandle.bind(this, this),
                onClear: () => {
                  this.setState({
                    department_id: null
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
                    this.state.department_id === null
                      ? this.props.all_employees
                      : depEmployee
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
                onClick={LoadData.bind(this, this)}
              >
                Load
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-7">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">
                          Payment Request List
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
                        <div className="col-lg-12" id="Employee_Payment_Cntr">
                          <AlgaehDataGrid
                            id="Employee_Payment_Cntr_grid"
                            columns={[
                              {
                                fieldName: "payment_type",

                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Request Type" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display = GlobalVariables.EMPLOYEE_PAYMENT_TYPE.filter(
                                    f => f.value === row.payment_type
                                  );

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].name
                                        : ""}
                                    </span>
                                  );
                                }
                                //disabled: true
                              },
                              {
                                fieldName: "loan_application_number",
                                label: "Request No."
                                // others: {
                                //   minWidth: 150,
                                //   maxWidth: 250
                                // }
                              },
                              {
                                fieldName: "employee_code",
                                label: "Employee Code"
                                //disabled: true
                              },
                              {
                                fieldName: "full_name",
                                label: "Employee Name"
                                //disabled: true
                              },
                              {
                                fieldName: "approved_amount",
                                label: "Requested Amount"
                                //disabled: true
                              }
                            ]}
                            keyId="requested_application_id"
                            dataSource={{
                              data: this.state.requestPayment
                            }}
                            isEditable={false}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            filter={true}
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
                <div className="col-5">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="portlet-title">
                      <div className="caption">
                        <h3 className="caption-subject">Payment Form</h3>
                      </div>
                      <div className="actions">
                        {/* <a className="btn btn-primary btn-circle active">
                        <i className="fas fa-calculator" /> 
                      </a>*/}
                      </div>
                    </div>

                    <div className="portlet-body">
                      <div className="row" style={{ minHeight: "43vh" }}>
                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Generate Document No."
                            }}
                          />
                          <h6>*** NEW ***</h6>
                        </div>

                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Date"
                            }}
                          />
                          <h6>DD/MM/YYYY</h6>
                        </div>

                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Mode of Payment",
                            isImp: false
                          }}
                          selector={{
                            name: "payment_mode",
                            value: this.state.payment_mode,
                            className: "select-fld",
                            dataSource: {
                              textField: "name",
                              valueField: "value",
                              data: GlobalVariables.EMP_PAYMENT_MODE
                            },
                            others: {}
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Mode of Payment",
                            isImp: false
                          }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-6  form-group" }}
                          label={{ forceLabel: "Select a Bank", isImp: false }}
                          selector={{
                            name: "hospital_id",
                            className: "select-fld",
                            value: this.state.hospital_id,
                            dataSource: {
                              textField: "hospital_name",
                              valueField: "hims_d_hospital_id",
                              data: this.props.organizations
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-6 form-group" }}
                          label={{
                            forceLabel: "Cheque No.",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Payment Amount",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Deduct in Month",
                            isImp: false
                          }}
                          selector={{
                            name: "",
                            className: "select-fld",
                            dataSource: {},
                            others: {}
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-4 form-group" }}
                          label={{
                            forceLabel: "Year",
                            isImp: false
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "",
                            value: "",
                            events: {},
                            option: {
                              type: "text"
                            }
                          }}
                        />
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-primary float-right"
                          >
                            Process
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="portlet-title">
                  <div className="caption">
                    <h3 className="caption-subject">Previous Payment List</h3>
                  </div>
                  <div className="actions">
                    {/*    <a className="btn btn-primary btn-circle active">
                       <i className="fas fa-calculator" /> 
                      </a>*/}
                  </div>
                </div>

                <div className="portlet-body">
                  <div className="row">
                    <div className="col-lg-12" id="Employee_Payment_Cntr">
                      <AlgaehDataGrid
                        id="All_trans_Employee_Payment_Cntr"
                        columns={[
                          {
                            fieldName: "",
                            label: "Request Type"
                            //disabled: true
                          },
                          {
                            fieldName: "",
                            label: "Request No."
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Employee Code"
                            //disabled: true
                          },
                          {
                            fieldName: "",
                            label: "Employee Name"
                            //disabled: true
                          },
                          {
                            fieldName: "",
                            label: "Requested Amount"
                            //disabled: true
                          },
                          {
                            fieldName: "",
                            label: "Document No."
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Process Date"
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Process Amount"
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Mode of Payment"
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Bank Details"
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Cheque/ Transaction No."
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          },
                          {
                            fieldName: "",
                            label: "Deduct in the Month of"
                            // others: {
                            //   minWidth: 150,
                            //   maxWidth: 250
                            // }
                          }
                        ]}
                        keyId="algaeh_d_module_id"
                        dataSource={{
                          data: []
                        }}
                        isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        filter={true}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    subdepartment: state.subdepartment,
    organizations: state.organizations,
    all_employees: state.all_employees,
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSubDepartment: AlgaehActions,
      getOrganizations: AlgaehActions,
      getEmployees: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EmployeePayment)
);
