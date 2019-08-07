import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../../actions/algaehActions";
import "./DeptUserDetails.css";
import {
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import { getCookie } from "../../../../../utils/algaehApiCall";
import {
  texthandle,
  AddDeptUser,
  deleteDeptUser,
  departmenttexthandle,
  specialitytexthandle,
  categorytexthandle,
  updateDeptUser,
  onchangegridcol,
  dateFormater,
  datehandle,
  onchangegridcolstatus,
  getEmployeeDepartments
} from "./DeptUserDetailsEvents";
import Enumerable from "linq";
import GlobalVariables from "../../../../../utils/GlobalVariables.json";
import { AlgaehOpenContainer } from "../../../../../utils/GlobalFunctions";
import _ from "lodash";

class DeptUserDetails extends Component {
  constructor(props) {
    super(props);
    let Activated_Modueles = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("ModuleDetails"))
    );
    const HIMS_Active = _.filter(Activated_Modueles, f => {
      return f.module_code === "FTDSK";
    });
    this.state = {
      selectedLang: getCookie("Language"),
      hims_d_employee_group_id: null,
      hims_d_hospital_id: null,
      sub_department: null,
      user_id: null,
      category_speciality_id: null,
      deptDetails: [],
      from_date: new Date(),
      designation_id: null,
      reporting_to: null,
      HIMS_Active: HIMS_Active.length > 0 ? true : false
    };
  }

  componentDidMount() {
    debugger;
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    InputOutput.designation_id = null;
    InputOutput.reporting_to = null;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (this.state.hims_d_employee_id !== null) {
        if (
          this.state.deptDetails.length === 0 &&
          this.state.HIMS_Active === true
        ) {
          getEmployeeDepartments(this);
        }
      }
    });

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
            mappingName: "depservices"
          }
        });
      }

      if (
        this.props.specimapcategorylist === undefined ||
        this.props.specimapcategorylist.length === 0
      ) {
        this.props.getEmployeeCategory({
          uri: "/specialityAndCategory/getCategorySpecialityMap",
          module: "masterSettings",
          method: "GET",

          redux: {
            type: "EMP_SPEC_CATEGORY_GET_DATA",
            mappingName: "specimapcategorylist"
          }
        });
      }

      if (
        this.props.empspeciality === undefined ||
        this.props.empspeciality.length === 0
      ) {
        this.props.getEmpSpeciality({
          uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
          module: "masterSettings",
          method: "GET",
          redux: {
            type: "EMP_SPECILITY_GET_DATA",
            mappingName: "empspeciality"
          }
        });
      }
    }
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
          mappingName: "emp_groups"
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
          mappingName: "designations"
        }
      });
    }

    if (this.props.overTime === undefined || this.props.overTime.length === 0) {
      this.props.getOvertimeGroups({
        uri: "/hrsettings/getOvertimeGroups",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "OVER_TIME_GET_DATA",
          mappingName: "overTime"
        }
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState(nextProps.EmpMasterIOputs.state.personalDetails);
  // }

  render() {
    const _depservices = Enumerable.from(this.props.depservices)
      .where(w => w.service_type_id === 1)
      .toArray();
    const _isDoctor = this.props.EmpMasterIOputs.state.personalDetails.isdoctor;

    const sub_dept_name =
      this.state.sub_department_id === undefined
        ? ""
        : Enumerable.from(this.props.subdepartment)
            .where(
              w => w.hims_d_sub_department_id === this.state.sub_department_id
            )
            .firstOrDefault({});

    const employee_designation =
      this.state.employee_designation_id === undefined
        ? ""
        : Enumerable.from(this.props.designations)
            .where(
              w =>
                w.hims_d_designation_id === this.state.employee_designation_id
            )
            .firstOrDefault({});
    const reporting_to =
      this.state.reporting_to_id === undefined
        ? ""
        : Enumerable.from(this.props.all_employees)
            .where(w => w.hims_d_employee_id === this.state.reporting_to_id)
            .firstOrDefault({});

    return (
      <React.Fragment>
        <div className="hptl-phase1-dept-user-form popRightDiv">
          <div className="row">
            <div className="col-lg-12">
              <div className="row margin-top-15">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Department"
                    }}
                  />
                  <h6>
                    {this.state.department_name === null ||
                    this.state.department_name === undefined
                      ? "------"
                      : this.state.department_name}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Sub Department"
                    }}
                  />
                  <h6>
                    {this.state.sub_department_name === null ||
                    this.state.sub_department_name === undefined
                      ? "------"
                      : this.state.sub_department_name}
                    {/* this.state.sub_department_id */}
                  </h6>
                </div>

                <div className="col">
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
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Reporting to"
                    }}
                  />
                  <h6>
                    {this.state.reporting_to_id === null
                      ? "Not Defined"
                      : reporting_to.full_name}
                  </h6>
                </div>
                {/* <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Speciality"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Category"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Services"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div> */}
              </div>
              <h5>
                <span>Define Group & Division/Branch</span>
              </h5>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Employee Group",
                    isImp: true
                  }}
                  selector={{
                    name: "employee_group_id",
                    className: "select-fld",
                    value: this.state.employee_group_id,
                    dataSource: {
                      textField: "group_description",
                      valueField: "hims_d_employee_group_id",
                      data: this.props.emp_groups
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    },
                    onClear: () => {
                      this.setState({
                        employee_group_id: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    forceLabel: "Overtime Group",
                    isImp: true
                  }}
                  selector={{
                    name: "overtime_group_id",
                    className: "select-fld",
                    value: this.state.overtime_group_id,
                    dataSource: {
                      textField: "overtime_group_description",
                      valueField: "hims_d_overtime_group_id",
                      data: this.props.overTime
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        overtime_group_id: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    forceLabel: "Assign Division/Branch",
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
                    others: {
                      tabIndex: "2"
                    },
                    onClear: () => {
                      this.setState({
                        hospital_id: null
                      });
                    }
                  }}
                />
              </div>

              <h5>
                <span>Define Department</span>
              </h5>
              <div className="row" data-validate="deptUserdtl">
                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    forceLabel: "Sub Department",
                    isImp: true
                  }}
                  selector={{
                    name: "sub_department",
                    className: "select-fld",
                    value: this.state.sub_department,

                    dataSource: {
                      textField: "sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.props.subdepartment
                    },

                    onChange: departmenttexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        sub_department: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    fieldName: "speciality_id"
                  }}
                  selector={{
                    name: "speciality_id",
                    className: "select-fld",
                    value: this.state.speciality_id,

                    dataSource: {
                      textField: "speciality_name",
                      valueField: "hims_d_employee_speciality_id",
                      data: this.props.empdepspeciality
                    },

                    onChange: specialitytexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        speciality_id: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    fieldName: "category_id"
                  }}
                  selector={{
                    name: "category_id",
                    className: "select-fld",
                    value: this.state.category_id,

                    dataSource: {
                      textField: "employee_category_name",
                      valueField: "hims_m_category_speciality_mappings_id",
                      data: this.props.specimapcategory
                    },

                    onChange: categorytexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        category_id: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    forceLabel: "Emp. Designation",
                    isImp: true
                  }}
                  selector={{
                    name: "designation_id",
                    className: "select-fld",
                    value: this.state.designation_id,
                    dataSource: {
                      textField: "designation",
                      valueField: "hims_d_designation_id",
                      data: this.props.designations
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    },
                    onClear: () => {
                      this.setState({
                        designation_id: null
                      });
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col " }}
                  label={{
                    forceLabel: "Reporting to",
                    isImp: true
                  }}
                  selector={{
                    name: "reporting_to",
                    className: "select-fld",
                    value: this.state.reporting_to,
                    dataSource: {
                      textField: "full_name",
                      valueField: "hims_d_employee_id",
                      data: this.props.all_employees
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    },
                    onClear: () => {
                      this.setState({
                        reporting_to: null
                      });
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    fieldName: "services_id"
                  }}
                  selector={{
                    name: "services_id",
                    className: "select-fld",
                    value: this.state.services_id,
                    dataSource: {
                      textField: "service_name",
                      valueField: "hims_d_services_id",
                      data: _depservices
                    },
                    others: {
                      disabled: _isDoctor === "Y" ? false : true
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        services_id: null
                      });
                    }
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col " }}
                  label={{
                    fieldName: "from_date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "from_date"
                  }}
                  events={{
                    onChange: datehandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        from_date: null
                      });
                    }
                  }}
                  value={this.state.from_date}
                />

                <div className="col-1" style={{ paddingTop: "19px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={AddDeptUser.bind(this, this)}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="row">
                <div
                  className="col-lg-12"
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                >
                  <AlgaehDataGrid
                    id="dpet_user_grid"
                    columns={[
                      {
                        fieldName: "from_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "from_date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.from_date === null ||
                              row.from_date === undefined
                                ? ""
                                : dateFormater(this, row.from_date)}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.from_date === null ||
                              row.from_date === undefined
                                ? ""
                                : dateFormater(this, row.from_date)}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "to_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "end_date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.to_date === null || row.to_date === undefined
                                ? ""
                                : dateFormater(this, row.to_date)}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.to_date === null || row.to_date === undefined
                                ? ""
                                : dateFormater(this, row.to_date)}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "dep_status",
                        label: (
                          <AlgaehLabel label={{ fieldName: "dep_status" }} />
                        ),
                        displayTemplate: row => {
                          return row.dep_status === "A" ? "Active" : "Inactive";
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "dep_status",
                                className: "select-fld",
                                value: row.dep_status,
                                dataSource: {
                                  textField: "name",
                                  valueField: "value",
                                  data: GlobalVariables.FORMAT_STATUS
                                },
                                onChange: onchangegridcolstatus.bind(
                                  this,
                                  this,
                                  row
                                ),
                                others: {
                                  errormessage: "Status - cannot be blank",
                                  required: true
                                }
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "sub_department_id",
                        label: (
                          <AlgaehLabel
                            label={{ fieldName: "sub_department_id" }}
                          />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.subdepartment === undefined
                              ? []
                              : this.props.subdepartment.filter(
                                  f =>
                                    f.hims_d_sub_department_id ===
                                    row.sub_department_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].sub_department_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.subdepartment === undefined
                              ? []
                              : this.props.subdepartment.filter(
                                  f =>
                                    f.hims_d_sub_department_id ===
                                    row.sub_department_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].sub_department_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "speciality_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "speciality_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.empspeciality === undefined
                              ? []
                              : this.props.empspeciality.filter(
                                  f =>
                                    f.hims_d_employee_speciality_id ===
                                    row.speciality_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].speciality_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.empspeciality === undefined
                              ? []
                              : this.props.empspeciality.filter(
                                  f =>
                                    f.hims_d_employee_speciality_id ===
                                    row.speciality_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].speciality_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "category_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "category_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.specimapcategorylist === undefined
                              ? []
                              : this.props.specimapcategorylist.filter(
                                  f =>
                                    f.hims_m_category_speciality_mappings_id ===
                                    row.category_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].employee_category_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.specimapcategorylist === undefined
                              ? []
                              : this.props.specimapcategorylist.filter(
                                  f =>
                                    f.hims_m_category_speciality_mappings_id ===
                                    row.category_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].employee_category_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        }
                      },

                      {
                        fieldName: "employee_designation_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Designation" }} />
                        ),

                        displayTemplate: row => {
                          let display =
                            this.props.designations === undefined
                              ? []
                              : this.props.designations.filter(
                                  f =>
                                    f.hims_d_designation_id ===
                                    row.employee_designation_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].designation
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "employee_designation_id",
                                className: "select-fld",
                                value: row.employee_designation_id,
                                dataSource: {
                                  textField: "designation",
                                  valueField: "hims_d_designation_id",
                                  data: this.props.designations
                                },
                                onChange: onchangegridcol.bind(this, this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "reporting_to_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Reporting To" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.all_employees === undefined
                              ? []
                              : this.props.all_employees.filter(
                                  f =>
                                    f.hims_d_employee_id === row.reporting_to_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? display[0].full_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <AlagehAutoComplete
                              div={{}}
                              selector={{
                                name: "reporting_to_id",
                                className: "select-fld",
                                value: row.reporting_to_id,
                                dataSource: {
                                  textField: "full_name",
                                  valueField: "hims_d_employee_id",
                                  data: this.props.all_employees
                                },
                                onChange: onchangegridcol.bind(this, this, row)
                              }}
                            />
                          );
                        }
                      },
                      {
                        fieldName: "services_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "services_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.depservices === undefined
                              ? []
                              : this.props.depservices.filter(
                                  f => f.hims_d_services_id === row.services_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_name
                                  : display[0].arabic_service_name
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.depservices === undefined
                              ? []
                              : this.props.depservices.filter(
                                  f => f.hims_d_services_id === row.services_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].service_name
                                  : display[0].arabic_service_name
                                : ""}
                            </span>
                          );
                        }
                      }
                    ]}
                    keyId="department_user_id"
                    dataSource={{
                      data: this.state.deptDetails
                    }}
                    paging={{ page: 0, rowsPerPage: 5 }}
                    isEditable={true}
                    events={{
                      onDelete: deleteDeptUser.bind(this, this),
                      onEdit: row => {},
                      onDone: updateDeptUser.bind(this, this)
                    }}
                  />
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
    empspeciality: state.empspeciality,
    empcategory: state.empcategory,
    specimapcategory: state.specimapcategory,
    empdepspeciality: state.empdepspeciality,
    depservices: state.depservices,
    designations: state.designations,
    specimapcategorylist: state.specimapcategorylist,
    all_employees: state.all_employees,
    emp_groups: state.emp_groups,
    organizations: state.organizations,
    overTime: state.overTime
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getEmpGroups: AlgaehActions,
      getUserDetails: AlgaehActions,
      getSubDepartment: AlgaehActions,
      getEmpSpeciality: AlgaehActions,
      getEmpCategory: AlgaehActions,
      getEmployeeCategory: AlgaehActions,
      getDepServices: AlgaehActions,
      getDesignations: AlgaehActions,
      getEmployees: AlgaehActions,
      getOrganizations: AlgaehActions,
      getOvertimeGroups: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeptUserDetails)
);
