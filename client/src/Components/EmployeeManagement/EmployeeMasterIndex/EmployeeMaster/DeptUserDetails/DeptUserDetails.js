import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../../actions/algaehActions";
import "./DeptUserDetails.css";
import {
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import MyContext from "../../../../../utils/MyContext.js";
import {
  texthandle,
  AddDeptUser,
  deleteDeptUser,
  departmenttexthandle,
  specialitytexthandle,
  categorytexthandle,
  updateDeptUser,
  colgridtexthandle
} from "./DeptUserDetailsEvents";
import Enumerable from "linq";
// import GlobalVariables from "../../../../../utils/GlobalVariables.json";

class DeptUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_department_id: null,
      user_id: null,
      category_speciality_id: null
    };
  }

  componentWillMount() {
    let InputOutput = this.props.EmpMasterIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.empcategory === undefined ||
      this.props.empcategory.length === 0
    ) {
      this.props.getEmpCategory({
        uri: "/employeesetups/getEmpCategory",
        method: "GET",
        redux: {
          type: "EMP_SPECILITY_GET_DATA",
          mappingName: "empcategory"
        }
      });
    }
    if (
      this.props.empspeciality === undefined ||
      this.props.empspeciality.length === 0
    ) {
      this.props.getEmpSpeciality({
        uri: "/employeesetups/getEmpSpeciality",
        method: "GET",
        redux: {
          type: "EMP_SPECILITY_GET_DATA",
          mappingName: "empspeciality"
        }
      });
    }

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.EmpMasterIOputs);
  }

  render() {
    const _depservices = Enumerable.from(this.props.depservices)
      .where(w => w.service_type_id === 1)
      .toArray();

    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
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
                    </div>{" "}
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Category"
                        }}
                      />
                      <h6>Not Defined</h6>
                    </div>{" "}
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
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Employee Group",
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
                    />{" "}
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
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Assign Hospital/Clinic",
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
                    />
                  </div>
                  <h5>
                    <span>Define Department</span>
                  </h5>
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-2" }}
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
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Employee Designation",
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
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
                      label={{
                        forceLabel: "Reporting to",
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
                    />
                    <AlagehAutoComplete
                      div={{ className: "col" }}
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
                      div={{ className: "col" }}
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
                        onChange: texthandle.bind(this, this, context)
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
                          disabled:
                            this.state.Billexists === true
                              ? true
                              : this.state.isdoctor === "Y"
                              ? false
                              : true
                        },
                        onChange: texthandle.bind(this, this, context)
                      }}
                    />

                    <div className="col-1" style={{ paddingTop: "21px" }}>
                      <button
                        // href="javascript"
                        className="btn btn-primary"
                        onClick={AddDeptUser.bind(this, this, context)}
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
                          // {
                          //   fieldName: "action",
                          //   label: <AlgaehLabel label={{ fieldName: "action" }} />,
                          //   displayTemplate: row => {
                          //     return (
                          //       <span>
                          //         <i
                          //           className="fas fa-trash-alt"
                          //           aria-hidden="true"
                          //           onClick={deleteDeptUser.bind(
                          //             this,
                          //             this,
                          //             context,
                          //             row
                          //           )}
                          //         />
                          //       </span>
                          //     );
                          //   },
                          //   others: {
                          //     maxWidth: 50
                          //   }
                          // },
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
                              <AlgaehLabel
                                label={{ fieldName: "speciality_id" }}
                              />
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
                              <AlgaehLabel
                                label={{ fieldName: "category_id" }}
                              />
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
                            label: (
                              <AlgaehLabel label={{ fieldName: "user_id" }} />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.userdrtails === undefined
                                  ? []
                                  : this.props.userdrtails.filter(
                                      f =>
                                        f.algaeh_d_app_user_id === row.user_id
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
                              return (
                                <AlagehAutoComplete
                                  div={{}}
                                  selector={{
                                    name: "user_id",
                                    className: "select-fld",
                                    value: row.user_id,
                                    dataSource: {
                                      textField: "username",
                                      valueField: "algaeh_d_app_user_id",
                                      data: this.props.userdrtails
                                    },
                                    onChange: colgridtexthandle.bind(
                                      this,
                                      this,
                                      row
                                    )
                                  }}
                                />
                              );
                            }
                          },
                          {
                            fieldName: "services_id",
                            label: (
                              <AlgaehLabel
                                label={{ fieldName: "services_id" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.depservices === undefined
                                  ? []
                                  : this.props.depservices.filter(
                                      f =>
                                        f.hims_d_services_id === row.services_id
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
                                      f =>
                                        f.hims_d_services_id === row.services_id
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
                        keyId="analyte_id"
                        dataSource={{
                          data: this.state.deptDetails
                        }}
                        paging={{ page: 0, rowsPerPage: 5 }}
                        isEditable={true}
                        events={{
                          onDelete: deleteDeptUser.bind(this, this, context),
                          onEdit: row => {},
                          onDone: updateDeptUser.bind(this, this, context)
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
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
    specimapcategorylist: state.specimapcategorylist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUserDetails: AlgaehActions,
      getSubDepartment: AlgaehActions,
      getEmpSpeciality: AlgaehActions,
      getEmpCategory: AlgaehActions,
      getEmployeeCategory: AlgaehActions,
      getDepServices: AlgaehActions
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
