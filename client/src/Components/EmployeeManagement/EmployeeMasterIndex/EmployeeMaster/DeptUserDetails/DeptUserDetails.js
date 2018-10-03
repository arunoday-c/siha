import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import IconButton from "@material-ui/core/IconButton";

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
  categorytexthandle
} from "./DeptUserDetailsEvents";
// import GlobalVariables from "../../../../../utils/GlobalVariables.json";
// import AHSnackbar from "../../../../common/Inputs/AHSnackbar";

class DeptUserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_department_id: null,
      user_id: null,
      category_speciality_id: null,
      depserviceslist: []
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
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "depservices"
        },
        afterSuccess: data => {
          this.setState({ depserviceslist: data });
        }
      });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-dept-user-form">
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
                  div={{ className: "col-lg-2" }}
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
                  div={{ className: "col-lg-2" }}
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
                      valueField: "hims_employee_category_id",
                      data: this.props.specimapcategory
                    },

                    onChange: categorytexthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-lg-2" }}
                  label={{
                    fieldName: "user_id"
                  }}
                  selector={{
                    name: "user_id",
                    className: "select-fld",
                    value: this.state.user_id,
                    dataSource: {
                      textField: "user_displayname",
                      valueField: "algaeh_d_app_user_id",
                      data: this.props.userdrtails
                    },
                    onChange: texthandle.bind(this, this, context)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
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
                      data: this.props.depservices
                    },
                    others: { disabled: this.state.Billexists },
                    onChange: texthandle.bind(this, this, context)
                  }}
                />

                <div className="col-lg-1 actions" style={{ paddingTop: "2%" }}>
                  <a
                    href="javascript:;"
                    className="btn btn-primary btn-circle active"
                  >
                    <i
                      className="fas fa-plus"
                      onClick={AddDeptUser.bind(this, this, context)}
                    />
                  </a>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 ">
                  <AlgaehDataGrid
                    id="dpet_user_grid"
                    columns={[
                      {
                        fieldName: "action",
                        label: <AlgaehLabel label={{ fieldName: "action" }} />,
                        displayTemplate: row => {
                          return (
                            <span>
                              <IconButton
                                color="primary"
                                title="Add Template"
                                style={{ maxHeight: "4vh" }}
                              >
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                  onClick={deleteDeptUser.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                />
                              </IconButton>
                            </span>
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
                        }
                      },
                      {
                        fieldName: "category_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "category_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.empcategory === undefined
                              ? []
                              : this.props.empcategory.filter(
                                  f =>
                                    f.hims_employee_category_id ===
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
                                  ? display[0].user_displayname
                                  : display[0].arabic_service_type
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
                            this.state.depserviceslist === undefined
                              ? []
                              : this.state.depserviceslist.filter(
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
                    keyId="analyte_id"
                    dataSource={{
                      data: this.state.deptDetails
                    }}
                    paging={{ page: 0, rowsPerPage: 5 }}
                  />
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
    depserviceslist: state.depserviceslist
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
