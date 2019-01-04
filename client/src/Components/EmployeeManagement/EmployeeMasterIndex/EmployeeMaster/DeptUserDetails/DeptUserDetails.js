import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
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
  // colgridtexthandle,
  dateFormater,
  // datehandle,
  getEmployeeDepartments
} from "./DeptUserDetailsEvents";
import Enumerable from "linq";
// import GlobalVariables from "../../../../../utils/GlobalVariables.json";

class DeptUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: getCookie("Language"),
      hims_d_employee_group_id: null,
      hims_d_hospital_id: null,
      sub_department_id: null,
      user_id: null,
      category_speciality_id: null,
      deptDetails: [],
      from_date: null,
      designation_id: null,
      reporting_to_id: null
    };
  }

  componentDidMount() {
    debugger;
    let InputOutput = this.props.EmpMasterIOputs.state.personalDetails;
    this.setState({ ...this.state, ...InputOutput }, () => {
      if (this.state.hims_d_employee_id !== null) {
        getEmployeeDepartments(this);
      }
    });
    if (
      this.props.depservices === undefined ||
      this.props.depservices.length === 0
    ) {
      this.props.getDepServices({
        uri: "/serviceType/getService",
        method: "GET",
        data: { hims_d_services_id: 1 },
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "depservices"
        }
      });
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
        uri: "/employee/getEmployeeGroups",
        method: "GET",
        data: { record_status: "A" },
        redux: {
          type: "EMP_GROUP_GET",
          mappingName: "emp_groups"
        }
      });
    }

    if (
      this.props.specimapcategorylist === undefined ||
      this.props.specimapcategorylist.length === 0
    ) {
      this.props.getEmployeeCategory({
        uri: "/specialityAndCategory/getCategorySpecialityMap",
        method: "GET",

        redux: {
          type: "EMP_SPEC_CATEGORY_GET_DATA",
          mappingName: "specimapcategorylist"
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

    if (
      this.props.designations === undefined ||
      this.props.designations.length === 0
    ) {
      this.props.getDesignations({
        uri: "/employeesetups/getDesignations",
        method: "GET",
        redux: {
          type: "DSGTN_GET_DATA",
          mappingName: "designations"
        }
      });
    }

    if (
      this.props.empspeciality === undefined ||
      this.props.empspeciality.length === 0
    ) {
      this.props.getEmpSpeciality({
        uri: "/specialityAndCategory/getEmployeeSpecialityMaster",
        method: "GET",
        redux: {
          type: "EMP_SPECILITY_GET_DATA",
          mappingName: "empspeciality"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs);
  }

  render() {
    const _depservices = Enumerable.from(this.props.depservices)
      .where(w => w.service_type_id === 1)
      .toArray();
    const _isDoctor = this.props.EmpMasterIOputs.state.personalDetails.isdoctor;
    return (
      <React.Fragment>
        <div className="hptl-phase1-dept-user-form popRightDiv">
          <div className="row">
            <div className="col-lg-12">
              <div className="row margin-top-15">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Department"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Employee Designation"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Reporting to"
                    }}
                  />
                  <h6>Not Defined</h6>
                </div>
                <div className="col">
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
                </div>
              </div>
              <h5>
                <span>Define Group & Hospital</span>
              </h5>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Employee Group",
                    isImp: true
                  }}
                  selector={{
                    name: "hims_d_employee_group_id",
                    className: "select-fld",
                    value: this.state.hims_d_employee_group_id,
                    dataSource: {
                      textField: "group_description",
                      valueField: "hims_d_employee_group_id",
                      data: this.props.emp_groups
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
                {/*  TODO : incomplete
                 <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Overtime Group",
                    isImp: true
                  }}
                  selector={{
                    name: "title_id",
                    className: "select-fld",
                    value: this.state.title_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "title"
                          : "arabic_title",
                      valueField: "his_d_title_id",
                      data: this.props.titles
                    },
                    onChange: null,
                    others: {
                      tabIndex: "2"
                    }
                  }}
                /> */}
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Assign Hospital/Clinic",
                    isImp: true
                  }}
                  selector={{
                    name: "hims_d_hospital_id",
                    className: "select-fld",
                    value: this.state.hims_d_hospital_id,
                    dataSource: {
                      textField: "hospital_name",
                      valueField: "hims_d_hospital_id",
                      data: this.props.organizations
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />
              </div>
              <h5>
                <span>Define Department</span>
              </h5>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "sub_department_id",
                    isImp: true
                  }}
                  selector={{
                    name: "sub_department_id",
                    className: "select-fld",
                    value: this.state.sub_department_id,

                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "sub_department_name"
                          : "arabic_sub_department_name",
                      valueField: "hims_d_sub_department_id",
                      data: this.props.subdepartment
                    },

                    onChange: departmenttexthandle.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "speciality_id",
                    isImp: true
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

                    onChange: specialitytexthandle.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "category_id",
                    isImp: true
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

                    onChange: categorytexthandle.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Employee Designation",
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
                    }
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col mandatory" }}
                  label={{
                    forceLabel: "Reporting to",
                    isImp: true
                  }}
                  selector={{
                    name: "reporting_to_id",
                    className: "select-fld",
                    value: this.state.reporting_to_id,
                    dataSource: {
                      textField:
                        this.state.selectedLang === "en"
                          ? "full_name"
                          : "arabic_name",
                      valueField: "hims_d_employee_id",
                      data: this.props.all_employees
                    },
                    onChange: texthandle.bind(this, this),
                    others: {
                      tabIndex: "2"
                    }
                  }}
                />

                {/* <AlagehAutoComplete
                      div={{ className: "col-lg-2" }}
                      label={{
                        fieldName: "user_id"
                      }}
                      selector={{
                        name: "user_id",
                        className: "select-fld",
                        value: this.state.user_id,
                        dataSource: {
                          textField: "username",
                          valueField: "algaeh_d_app_user_id",
                          data: this.props.userdrtails
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    /> */}

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
                      textField:
                        this.state.selectedLang === "en"
                          ? "service_name"
                          : "arabic_service_name",
                      valueField: "hims_d_services_id",
                      data: _depservices
                    },
                    others: {
                      disabled: _isDoctor === "Y" ? false : true
                    },
                    onChange: texthandle.bind(this, this)
                  }}
                />

                <AlgaehDateHandler
                  div={{ className: "col mandatory" }}
                  label={{
                    fieldName: "from_date",
                    isImp: true
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "from_date"
                  }}
                  events={{
                    onChange: selDate => {
                      this.setState({
                        from_date: moment(selDate).format("DD/MM/YYYY")
                      });
                    }
                  }}
                  value={this.state.date_of_joining}
                />

                <div className="col-1" style={{ paddingTop: "21px" }}>
                  <button
                    // href="javascript"
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
                        fieldName: "user_id",
                        label: <AlgaehLabel label={{ fieldName: "user_id" }} />,
                        displayTemplate: row => {
                          let display =
                            this.props.userdrtails === undefined
                              ? []
                              : this.props.userdrtails.filter(
                                  f => f.algaeh_d_app_user_id === row.user_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].username
                                  : display[0].arabic_service_type
                                : ""}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          let display =
                            this.props.userdrtails === undefined
                              ? []
                              : this.props.userdrtails.filter(
                                  f => f.algaeh_d_app_user_id === row.user_id
                                );

                          return (
                            <span>
                              {display !== undefined && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].username
                                  : display[0].arabic_service_type
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
                      },
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
                                ? "DD/MM/YYYY"
                                : dateFormater(this, row.from_date)}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.from_date === null ||
                              row.from_date === undefined
                                ? "DD/MM/YYYY"
                                : dateFormater(this, row.from_date)}
                            </span>
                          );
                        }
                      },
                      {
                        fieldName: "end_date",
                        label: (
                          <AlgaehLabel label={{ fieldName: "end_date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>
                              {row.end_date === null ||
                              row.end_date === undefined
                                ? "DD/MM/YYYY"
                                : dateFormater(this, row.end_date)}
                            </span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>
                              {row.end_date === null ||
                              row.end_date === undefined
                                ? "DD/MM/YYYY"
                                : dateFormater(this, row.end_date)}
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
                          return row.dep_status === "A" ? "Active" : "Inactive";
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
    userdrtails: state.userdrtails,
    empspeciality: state.empspeciality,
    empcategory: state.empcategory,
    specimapcategory: state.specimapcategory,
    empdepspeciality: state.empdepspeciality,
    depservices: state.depservices,
    designations: state.designations,
    specimapcategorylist: state.specimapcategorylist,
    all_employees: state.all_employees,
    emp_groups: state.emp_groups,
    organizations: state.organizations
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
      getOrganizations: AlgaehActions
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
