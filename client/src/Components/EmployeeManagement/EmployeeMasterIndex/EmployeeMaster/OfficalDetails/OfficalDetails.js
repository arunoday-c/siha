import React, { Component } from "react";
import "./OfficalDetails.scss";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../../../Wrapper/algaehWrapper";

import variableJson from "../../../../../utils/GlobalVariables.json";
import {
  texthandle,
  datehandle,
  otEntitleHandaler,
  employeeStatusHandler,
  dateFormater,
  bankEventhandle,
  ondiscountChange,
} from "./OfficalDetailsEvent.js";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getCookie } from "../../../../../utils/algaehApiCall";

class OfficalDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enable_active_status: "",
      date_of_releaving_label: "Date of leaving",
      accomodation_provided: false,
      reliving_date: undefined,
      // employee_status: null,
      inactive_date: undefined,
      eos_id: undefined,
      selectedLang: getCookie("Language"),
    };
  }

  componentDidMount() {
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    InputOutput.HIMS_Active = this.props.EmpMasterIOputs.state.HIMS_Active;
    InputOutput.HRMS_Active = this.props.EmpMasterIOputs.state.HRMS_Active;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (
        this.props.eosReasons === undefined ||
        this.props.eosReasons.length === 0
      ) {
        this.props.getEosReasons({
          uri: "/endofservice/eosOptions",
          module: "hrManagement",
          method: "GET",
          redux: {
            type: "EOS_GET_DATA",
            mappingName: "eosReasons",
          },
        });
      }

      if (
        this.props.agency_list === undefined ||
        this.props.agency_list.length === 0
      ) {
        this.props.getAgency({
          uri: "/hrsettings/getAgency",
          module: "hrManagement",
          method: "GET",
          redux: {
            type: "AGENCY_LIST",
            mappingName: "agency_list",
          },
        });
      }

      if (this.props.banks === undefined || this.props.banks.length === 0) {
        this.props.getBanks({
          uri: "/bankmaster/getBank",
          data: { active_status: "A" },
          module: "masterSettings",
          method: "GET",
          redux: {
            type: "BANK_GET_DATA",
            mappingName: "banks",
          },
        });
      }
      if (
        this.props.companyaccount === undefined ||
        this.props.companyaccount.length === 0
      ) {
        this.props.getCompanyAccount({
          uri: "/companyAccount/getCompanyAccount",
          module: "masterSettings",
          method: "GET",
          redux: {
            type: "COMPANY_ACC_DATA",
            mappingName: "companyaccount",
          },
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
          data: { hospital_requires: false },
          redux: {
            type: "EMPLY_GET_DATA",
            mappingName: "all_employees",
          },
        });
      }

      if (
        this.props.designations === undefined ||
        this.props.designations.length === 0
      ) {
        this.props.getDesignations({
          uri: "/hrsettings/getDesignations",
          module: "hrManagement",
          method: "GET",
          redux: {
            type: "DSGTN_GET_DATA",
            mappingName: "designations",
          },
        });
      }

      if (
        this.props.emp_groups === undefined ||
        this.props.emp_groups.length === 0
      ) {
        this.props.getEmpGroups({
          uri: "/hrsettings/getEmployeeGroups",
          module: "hrManagement",
          method: "GET",
          data: { record_status: "A" },
          redux: {
            type: "EMP_GROUP_GET",
            mappingName: "emp_groups",
          },
        });
      }

      if (
        this.props.overTime === undefined ||
        this.props.overTime.length === 0
      ) {
        this.props.getOvertimeGroups({
          uri: "/hrsettings/getOvertimeGroups",
          module: "hrManagement",
          method: "GET",
          redux: {
            type: "OVER_TIME_GET_DATA",
            mappingName: "overTime",
          },
        });
      }

      if (
        this.props.branches === undefined ||
        this.props.branches.length === 0
      ) {
        this.props.getOrganizations({
          uri: "/organization/getOrganization",
          method: "GET",
          redux: {
            type: "ORGS_GET_DATA",
            mappingName: "branches",
          },
        });
      }
      if (this.state.HIMS_Active === true) {
        if (
          this.props.depservices === undefined ||
          this.props.depservices.length === 0
        ) {
          this.props.getDepServices({
            uri: "/serviceType/getService",
            module: "masterSettings",
            method: "GET",
            data: { service_type_id: 1 },
            redux: {
              type: "SERVICES_GET_DATA",
              mappingName: "depservices",
            },
          });
        }
      }
    });
  }

  render() {
    const _isDoctor = this.props.EmpMasterIOputs.state.personalDetails.isdoctor;

    return (
      <React.Fragment>
        <div
          className="hptl-phase1-add-employee-form popRightDiv"
          data-validate="empOffical"
        >
          <div className="row">
            <div
              className={
                this.state.HRMS_Active === false
                  ? "col-lg-12"
                  : "col-lg-8 primary-details"
              }
              style={{ paddingBottom: 0, minHeight: "66.5vh" }}
            >
              <h5>
                <span>Joining Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    forceLabel: "Assign Division/Branch",
                    isImp: true,
                  }}
                  selector={{
                    name: "hospital_id",
                    className: "select-fld",
                    value: this.state.hospital_id,
                    dataSource: {
                      textField: "hospital_name",
                      valueField: "hims_d_hospital_id",
                      data: this.props.branches,
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2",
                    },
                    onClear: () => {
                      this.setState({
                        hospital_id: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        hospital_id: null,
                      });
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    forceLabel: "Appointemt Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "appointment_type",
                    className: "select-fld",
                    value: this.state.appointment_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMP_APPT_TYPE,
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2",
                    },
                    onClear: () => {
                      this.setState({
                        appointment_type: null,
                        agency_id: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        appointment_type: null,
                        agency_id: null,
                      });
                    },
                  }}
                />
                {this.state.appointment_type === "A" ? (
                  <AlagehAutoComplete
                    div={{ className: "col form-group" }}
                    label={{
                      forceLabel: "Agency Name",
                      isImp: false,
                    }}
                    selector={{
                      name: "agency_id",
                      className: "select-fld",
                      value: this.state.agency_id,
                      dataSource: {
                        textField: "agency_name",
                        valueField: "hims_d_agency_id",
                        data: this.props.agency_list,
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          agency_id: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          agency_id: null,
                        });
                      },
                    }}
                  />
                ) : null}
                <AlagehAutoComplete
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    forceLabel: "Employee Type",
                    isImp: true,
                  }}
                  selector={{
                    name: "employee_type",
                    className: "select-fld",
                    value: this.state.employee_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMPLOYEE_TYPE,
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "3",
                    },
                    onClear: () => {
                      this.setState({
                        employee_type: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        employee_type: null,
                      });
                    },
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col mandatory form-group" }}
                  label={{
                    fieldName: "date_of_joining",
                    isImp: true,
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "date_of_joining",
                    others: {
                      tabIndex: "1",
                    },
                  }}
                  events={{
                    onChange: datehandle.bind(this, this),
                  }}
                  value={this.state.date_of_joining}
                />
              </div>
              <h5>
                <span>Department Details</span>
              </h5>
              <div className="row margin-bottom-15">
                <div className="col-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Department",
                    }}
                  />
                  <h6>
                    {this.state.department_name === null ||
                    this.state.department_name === undefined
                      ? "------"
                      : this.state.department_name}
                  </h6>
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory form-group" }}
                  label={{
                    forceLabel: "Sub Department",
                    isImp: true,
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: this.state.sub_department_id,

                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.props.subdepartment,
                    },

                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        sub_department_id: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        sub_department_id: null,
                      });
                    },
                  }}
                />

                {/*<div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Employee Designation"
                      }}
                    />
                    <h6>
                      {this.state.employee_designation_id === null
                        ? "Not Defined"
                        : employee_designation.designation}
                    </h6>
                  </div>*/}

                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory form-group" }}
                  label={{
                    forceLabel: "Reporting to",
                    isImp: false,
                  }}
                  selector={{
                    name: "reporting_to_id",
                    className: "select-fld",
                    value: this.state.reporting_to_id,
                    dataSource: {
                      textField: "full_name",
                      valueField: "hims_d_employee_id",
                      data: this.props.all_employees,
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2",
                    },
                    onClear: () => {
                      this.setState({
                        reporting_to_id: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        reporting_to_id: null,
                      });
                    },
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory form-group" }}
                  label={{
                    forceLabel: "Emp. Designation",
                    isImp: true,
                  }}
                  selector={{
                    name: "employee_designation_id",
                    className: "select-fld",
                    value: this.state.employee_designation_id,
                    dataSource: {
                      textField: "designation",
                      valueField: "hims_d_designation_id",
                      data: this.props.designations,
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2",
                    },
                    onClear: () => {
                      this.setState({
                        employee_designation_id: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        employee_designation_id: null,
                      });
                    },
                  }}
                />

                {this.state.HIMS_Active === true ? (
                  <AlagehFormGroup
                    div={{ className: "col-2 form-group" }}
                    label={{
                      forceLabel: "Discount% Elgible",
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.service_dis_percentage,
                      className: "txt-fld",
                      name: "service_dis_percentage",
                      events: {
                        onChange: ondiscountChange.bind(this, this),
                      },
                      others: {
                        placeholder: "0.00",
                      },
                    }}
                  />
                ) : null}

                {this.state.HRMS_Active === true ? (
                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{
                      forceLabel: "Employee Group",
                      isImp: this.state.HRMS_Active,
                    }}
                    selector={{
                      name: "employee_group_id",
                      className: "select-fld",
                      value: this.state.employee_group_id,
                      dataSource: {
                        textField: "group_description",
                        valueField: "hims_d_employee_group_id",
                        data: this.props.emp_groups,
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        tabIndex: "2",
                      },
                      onClear: () => {
                        this.setState({
                          employee_group_id: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          employee_group_id: null,
                        });
                      },
                    }}
                  />
                ) : null}

                {this.state.HRMS_Active === true ? (
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Vaccation Accruval Days",
                      }}
                    />
                    <h6>
                      {this.state.monthly_accrual_days === null ||
                      this.state.monthly_accrual_days === undefined
                        ? "0 days"
                        : this.state.monthly_accrual_days + " days"}
                    </h6>
                  </div>
                ) : null}
                {this.state.HRMS_Active === true ? (
                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{
                      forceLabel: "Employee Category",
                      isImp: this.state.HRMS_Active,
                    }}
                    selector={{
                      name: "employee_category",
                      className: "select-fld",
                      value: this.state.employee_category,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: variableJson.EMP_CATEGORY,
                      },
                      onChange: texthandle.bind(this, this),
                      others: {
                        tabIndex: "2",
                      },
                      onClear: () => {
                        this.setState({
                          employee_category: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          employee_category: null,
                        });
                      },
                    }}
                  />
                ) : null}
                {this.state.HRMS_Active === true ? (
                  <React.Fragment>
                    <div
                      className="col-3 customCheckbox"
                      style={{ border: "none" }}
                    >
                      <label
                        className="checkbox inline"
                        style={{ paddingBottom: 1 }}
                      >
                        <input
                          type="checkbox"
                          name="entitled_daily_ot"
                          checked={
                            this.state.entitled_daily_ot === "Y" ? true : false
                          }
                          onChange={otEntitleHandaler.bind(this, this)}
                        />
                        <span>
                          <AlgaehLabel
                            label={{
                              forceLabel: "Entitle for OverTime",
                            }}
                          />
                        </span>
                      </label>
                      <div className="row">
                        {this.state.entitled_daily_ot === "Y" ? (
                          <AlagehAutoComplete
                            div={{ className: "col mandatory form-group" }}
                            // label={
                            //   {
                            //     //forceLabel: "Overtime Group",
                            //   }
                            // }
                            selector={{
                              name: "overtime_group_id",
                              className: "select-fld",
                              value: this.state.overtime_group_id,
                              dataSource: {
                                textField: "overtime_group_description",
                                valueField: "hims_d_overtime_group_id",
                                data: this.props.overTime,
                              },
                              onChange: texthandle.bind(this, this),
                              onClear: () => {
                                this.setState({
                                  overtime_group_id: null,
                                });
                                this.props.EmpMasterIOputs.updateEmployeeTabs({
                                  overtime_group_id: null,
                                });
                              },
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
                {_isDoctor === "Y" ? (
                  <AlagehAutoComplete
                    div={{ className: "col-3 mandatory form-group" }}
                    label={{
                      fieldName: "services_id",
                    }}
                    selector={{
                      name: "services_id",
                      className: "select-fld",
                      value: this.state.services_id,
                      dataSource: {
                        textField: "service_name",
                        valueField: "hims_d_services_id",
                        data: this.props.depservices,
                      },

                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          services_id: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          services_id: null,
                        });
                      },
                    }}
                  />
                ) : null}
              </div>
              <h5>
                <span>Relieving Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory form-group" }}
                  label={{
                    forceLabel: "Employee Status",
                    isImp: true,
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.employee_status,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: variableJson.EMPLOYEE_STATUS,
                    },
                    onChange: employeeStatusHandler.bind(this, this),

                    onClear: () => {
                      this.setState({
                        employee_status: null,
                      });
                      this.props.EmpMasterIOputs.updateEmployeeTabs({
                        employee_status: null,
                      });
                    },
                  }}
                />{" "}
                {this.state.employee_status === "I" ? (
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Inactive Date",
                      }}
                    />
                    <h6>
                      {this.state.inactive_date === null ||
                      this.state.inactive_date === undefined
                        ? "DD/MM/YYYY"
                        : dateFormater(this, this.state.inactive_date)}
                    </h6>
                  </div>
                ) : null}
                {this.state.employee_status !== "A" &&
                this.state.employee_status !== "I" ? (
                  <React.Fragment>
                    <AlgaehDateHandler
                      div={{ className: "col-3 mandatory form-group" }}
                      label={{
                        forceLabel:
                          this.state.employee_status === "A" ||
                          this.state.employee_status === "I"
                            ? "Date of leaving"
                            : this.state.employee_status === "R"
                            ? "Date of Resignation"
                            : this.state.employee_status === "T"
                            ? "Date of Termination"
                            : this.state.employee_status === "E"
                            ? "Date of Retirement"
                            : "",
                        isImp:
                          this.state.employee_status === "R" ||
                          this.state.employee_status === "T"
                            ? true
                            : false,
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "date_of_resignation",
                        others: {
                          disabled:
                            this.state.enable_active_status === "I"
                              ? true
                              : false,
                        },
                      }}
                      // maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this),
                      }}
                      value={this.state.date_of_resignation}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-2" }}
                      label={{
                        forceLabel: "Notice Period",
                        isImp: false,
                      }}
                      date_of_resignation
                      textBox={{
                        value: this.state.notice_period,
                        className: "txt-fld",
                        name: "notice_period",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          tabIndex: "7",
                          type: "number",
                        },
                      }}
                    />
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Expected Relieving Date",
                        }}
                      />
                      <h6>
                        {this.state.reliving_date === null ||
                        this.state.reliving_date === undefined
                          ? "DD/MM/YYYY"
                          : dateFormater(this, this.state.reliving_date)}
                      </h6>
                    </div>
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{ forceLabel: "Date of Exit/Last Working Day" }}
                      textBox={{
                        className: "txt-fld",
                        name: "exit_date",
                      }}
                      minDate={this.state.date_of_resignation}
                      events={{
                        onChange: datehandle.bind(this, this),
                      }}
                      value={this.state.exit_date}
                    />
                    {this.props.eosReasons === undefined ||
                    this.props.eosReasons.length === 0 ? null : (
                      <AlagehAutoComplete
                        div={{ className: "col-3 mandatory form-group" }}
                        label={{
                          forceLabel: "EOS Reason",
                          isImp: true,
                        }}
                        selector={{
                          name: "eos_reason",
                          className: "select-fld",
                          value: this.state.eos_id,
                          dataSource: {
                            textField:
                              this.state.selectedLang === "en"
                                ? "eos_reason_name"
                                : "eos_reason_other_lan",
                            valueField: "eos_reson_id",
                            data: this.props.eosReasons,
                          },
                          onChange: (e) => {
                            this.setState({ eos_id: e.value });
                            this.props.EmpMasterIOputs.updateEmployeeTabs({
                              eos_id: e.value,
                            });
                          },

                          onClear: () => {
                            this.setState({
                              eos_id: undefined,
                            });
                            this.props.EmpMasterIOputs.updateEmployeeTabs({
                              eos_id: undefined,
                            });
                          },
                        }}
                      />
                    )}
                  </React.Fragment>
                ) : null}
              </div>
              {/* <h5>
                <span>Accomodation Details</span>
              </h5>
              <div className="row paddin-bottom-5">
                <div className="col customCheckbox" style={{ border: "none" }}>
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="accomodation_provided"
                      checked={
                        this.state.accomodation_provided === "Y" ? true : false
                      }
                      onChange={accomodationProvided.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{ forceLabel: "Accomodation Provided" }}
                      />
                    </span>
                  </label>
                </div>
              </div> */}
            </div>
            {this.state.HRMS_Active === true ? (
              <div
                className="col-lg-4 secondary-details"
                style={{ paddingBottom: 0, minHeight: "66.5vh" }}
              >
                <h5>
                  <span>Employee Bank Details</span>
                </h5>
                <div className="row paddin-bottom-5">
                  <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Select Employee Bank",
                      isImp: true,
                    }}
                    selector={{
                      name: "employee_bank_id",
                      className: "select-fld",
                      value: this.state.employee_bank_id,
                      dataSource: {
                        textField: "bank_name",
                        valueField: "hims_d_bank_id",
                        data: this.props.banks,
                      },
                      onChange: bankEventhandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          employee_bank_id: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          employee_bank_id: null,
                        });
                      },
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-6 mandatory form-group" }}
                    label={{
                      forceLabel: "SWIFT Code",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.employee_bank_ifsc_code,
                      className: "txt-fld",
                      name: "employee_bank_ifsc_code",
                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      disabled: true,
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-12 mandatory form-group" }}
                    label={{
                      forceLabel: "Account No.",
                      isImp: true,
                    }}
                    textBox={{
                      value: this.state.employee_account_number,
                      className: "txt-fld",
                      name: "employee_account_number",

                      events: {
                        onChange: texthandle.bind(this, this),
                      },
                      others: {
                        type: "text",
                        maxLength: 24,
                      },
                    }}
                  />
                </div>
                <h5>
                  <span>Company Bank Details</span>
                </h5>
                <div className="row paddin-bottom-5">
                  <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Select Employeer Bank",
                      isImp: true,
                    }}
                    selector={{
                      name: "company_bank_id",
                      className: "select-fld",
                      value: this.state.company_bank_id,
                      dataSource: {
                        textField: "bank_name",
                        valueField: "bank_id",
                        data: this.props.companyaccount,
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          company_bank_id: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          company_bank_id: null,
                        });
                      },
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col mandatory form-group" }}
                    label={{
                      forceLabel: "Mode of Payment",
                      isImp: true,
                    }}
                    selector={{
                      name: "mode_of_payment",
                      className: "select-fld",
                      value: this.state.mode_of_payment,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: variableJson.MODE_OF_PAYMENT,
                      },
                      onChange: texthandle.bind(this, this),
                      onClear: () => {
                        this.setState({
                          mode_of_payment: null,
                        });
                        this.props.EmpMasterIOputs.updateEmployeeTabs({
                          mode_of_payment: null,
                        });
                      },
                    }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    banks: state.banks,
    subdepartment: state.subdepartment,
    companyaccount: state.companyaccount,
    all_employees: state.all_employees,
    designations: state.designations,
    emp_groups: state.emp_groups,
    overTime: state.overTime,
    branches: state.branches,
    depservices: state.depservices,
    eosReasons: state.eosReasons,
    agency_list: state.agency_list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBanks: AlgaehActions,
      getCompanyAccount: AlgaehActions,
      getEmployees: AlgaehActions,
      getDesignations: AlgaehActions,
      getEmpGroups: AlgaehActions,
      getOvertimeGroups: AlgaehActions,
      getOrganizations: AlgaehActions,
      getDepServices: AlgaehActions,
      getEosReasons: AlgaehActions,
      getAgency: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfficalDetails)
);
