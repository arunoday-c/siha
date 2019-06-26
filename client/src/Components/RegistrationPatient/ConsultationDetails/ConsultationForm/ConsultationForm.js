import React, { Component } from "react";

import "./ConsultationForm.css";
import "./../../../../styles/site.css";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import moment from "moment";
import Options from "../../../../Options.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
import { getLabelFromLanguage } from "../../../../utils/GlobalFunctions";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDataGrid,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import {
  DeptselectedHandeler,
  selectedHandeler,
  doctorselectedHandeler,
  radioChange,
  texthandle
} from "./AddConsultationDetails";

class AddConsultationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      doctors: []
    };
  }

  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.visittypes === undefined ||
      this.props.visittypes.length === 0
    ) {
      this.props.getVisittypes({
        uri: "/visitType/get",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "VISITTYPE_GET_DATA",
          mappingName: "visittypes"
        }
      });
    }

    if (
      this.props.frontproviders === undefined ||
      this.props.frontproviders.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "frontproviders"
        },
        afterSuccess: data => {
          this.setState({
            doctors: data
          });
        }
      });
    }

    if (
      this.props.viewsubdept === undefined ||
      this.props.viewsubdept.length === 0
    ) {
      this.props.getSubDepartment({
        uri: "/department/get/subdepartment",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "viewsubdept"
        }
      });
    }

    if (
      this.props.deptanddoctors === undefined ||
      this.props.deptanddoctors.length === 0
    ) {
      this.props.getDepartmentsandDoctors({
        uri: "/department/get/get_All_Doctors_DepartmentWise",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "DEPT_DOCTOR_GET_DATA",
          mappingName: "deptanddoctors"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs);
  }

  changeDateFormat = date => {
    if (date !== null) {
      return moment(date).format(Options.dateFormat);
    }
  };

  render() {
    const vstDeatils =
      this.state.visitDetails === null ? [{}] : this.state.visitDetails;
    const doctors =
      this.props.frontproviders === undefined ? [] : this.props.frontproviders;
    const departments =
      this.props.deptanddoctors === undefined
        ? []
        : this.props.deptanddoctors.departmets;
    const hideMaternity = this.state.gender === "Female" ? "" : "hide";

    return (
      <MyContext.Consumer>
        {context => (
          <div className="hptl-phase1-add-consultation-form">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-4 primary-details">
                  <div className="row primary-box-container">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6 mandatory" }}
                      label={{
                        fieldName: "visit_type",
                        isImp: true
                      }}
                      selector={{
                        name: "visit_type",
                        className: "select-fld",
                        value: this.state.visit_type,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "visit_type_desc"
                              : "arabic_visit_type_desc",
                          valueField: "hims_d_visit_type_id",
                          data: this.props.visittypes
                        },
                        others: {
                          disabled: this.state.clearEnable
                        },
                        onChange: selectedHandeler.bind(this, this, context),
                        onClear: () => {
                          this.setState({
                            visit_type: null,
                            sub_department_id: null,
                            doctor_id: null,
                            visittypeselect: true
                          });
                        }
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-6 mandatory" }}
                      label={{
                        fieldName: "department_id",
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
                          valueField: "sub_department_id",
                          data:
                            this.props.fromAppoinment === true
                              ? this.props.deptanddoctors.departmets
                              : departments
                        },
                        others: {
                          disabled: this.state.visittypeselect
                        },
                        onChange: DeptselectedHandeler.bind(
                          this,
                          this,
                          context
                        ),
                        onClear: () => {
                          this.setState({
                            sub_department_id: null,
                            doctor_id: null
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="row primary-box-container">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-6 mandatory" }}
                      label={{
                        fieldName: "doctor_id",
                        isImp: true
                      }}
                      selector={{
                        name: "doctor_id",
                        className: "select-fld",
                        value: this.state.doctor_id,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "full_name"
                              : "arabic_name",
                          valueField: "employee_id",
                          data:
                            this.state.appointment_patient === "Y"
                              ? doctors
                              : this.state.doctors
                        },
                        others: {
                          disabled: this.state.visittypeselect
                        },
                        onChange: doctorselectedHandeler.bind(
                          this,
                          this,
                          context
                        ),
                        onClear: () => {
                          this.setState({
                            doctor_id: null
                          });
                        }
                      }}
                    />

                    <AlgaehDateHandler
                      div={{ className: "col-lg-6" }}
                      label={{ fieldName: "visit_date" }}
                      textBox={{
                        className: "txt-fld",
                        name: "visit_date"
                      }}
                      disabled={true}
                      maxDate={new Date()}
                      minDate={new Date()}
                      events={{
                        onChange: null
                      }}
                      value={this.state.visit_date}
                    />
                  </div>
                  <div className="row">
                    <div className="col-lg-4 maternityRadio">
                      <AlgaehLabel
                        label={{
                          fieldName:
                            this.state.gender === "Female"
                              ? "maternity_patient"
                              : null
                        }}
                      />
                      <br />

                      {/* <div className="customRadio">
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="maternity_patient_yes"
                            value="Y"
                            checked={
                              this.state.maternity_patient === "Y"
                                ? true
                                : false
                            }
                            onChange={radioChange.bind(this, this, context)}
                          />
                          <span>Yes</span>
                        </label>
                        <label className="radio inline">
                          <input
                            type="radio"
                            name="maternity_patient_no"
                            value="N"
                            checked={
                              this.state.maternity_patient === "N"
                                ? true
                                : false
                            }
                            onChange={radioChange.bind(this, this, context)}
                          />
                          <span>No</span>
                        </label>
                      </div> */}

                      <div className="customCheckbox">
                        <label className="checkbox inline">
                          <input
                            className={hideMaternity}
                            type="checkbox"
                            name="maternity_patient_yes"
                            value="Y"
                            disabled={this.state.gender === "Male"}
                            checked={this.state.checked_maternity_patient}
                            onChange={radioChange.bind(this, this, context)}
                          />
                          <span className={hideMaternity}>Yes</span>
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-8">
                      {this.state.department_type === "D" &&
                      this.state.hims_d_patient_id !== null ? (
                        <div className="row">
                          <div className="col-lg-4" style={{ paddingRight: 0 }}>
                            <label>Existing Plan</label>
                            <br />

                            {/* <div className="customRadio">
                              <label className="radio inline">
                                <input
                                  type="radio"
                                  name="existing_plan"
                                  value="Y"
                                  checked={
                                    this.state.existing_plan === "Y"
                                      ? true
                                      : false
                                  }
                                  onChange={radioChange.bind(
                                    this,
                                    this,
                                    context
                                  )}
                                />
                                <span>Yes</span>
                              </label>
                              <label className="radio inline">
                                <input
                                  type="radio"
                                  name="existing_plan"
                                  value="N"
                                  checked={
                                    this.state.existing_plan === "N"
                                      ? true
                                      : false
                                  }
                                  onChange={radioChange.bind(
                                    this,
                                    this,
                                    context
                                  )}
                                />
                                <span>No</span>
                              </label>
                            </div> */}

                            <div className="customCheckbox">
                              <label className="checkbox inline">
                                <input
                                  type="checkbox"
                                  name="existing_plan"
                                  value="Y"
                                  checked={this.state.checked_existing_plan}
                                  onChange={radioChange.bind(
                                    this,
                                    this,
                                    context
                                  )}
                                />
                                <span>Yes</span>
                              </label>
                            </div>
                          </div>

                          <AlagehAutoComplete
                            div={{ className: "col-lg-8" }}
                            label={{
                              fieldName: "treatment_plan_id",
                              isImp: true
                            }}
                            selector={{
                              name: "treatment_plan_id",
                              className: "select-fld",
                              value: this.state.treatment_plan_id,
                              dataSource: {
                                textField: "plan_name",
                                valueField: "hims_f_treatment_plan_id",
                                data: this.props.dentalplans
                              },
                              others: {
                                disabled:
                                  this.state.existing_plan === "Y"
                                    ? false
                                    : true
                              },
                              onChange: texthandle.bind(this, this, context)
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 secondary-details">
                  <h6>{getLabelFromLanguage({ fieldName: "PastVisit" })}</h6>
                  <AlgaehDataGrid
                    columns={[
                      {
                        fieldName: "visit_code",
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_code" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "visit_date",
                        displayTemplate: row => {
                          return (
                            <span>{this.changeDateFormat(row.visit_date)}</span>
                          );
                        },
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_date" }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "visit_type",
                        label: (
                          <AlgaehLabel label={{ fieldName: "visit_type" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.visittypes === undefined
                              ? []
                              : this.props.visittypes.filter(
                                  f => f.hims_d_visit_type_id === row.visit_type
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].visit_type_desc
                                  : display[0].arabic_visit_type_desc
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "sub_department_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "department_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.viewsubdept === undefined
                              ? []
                              : (display = this.props.viewsubdept.filter(
                                  f =>
                                    f.hims_d_sub_department_id ===
                                    row.sub_department_id
                                ));

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].sub_department_name
                                  : display[0].arabic_sub_department_name
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      },
                      {
                        fieldName: "doctor_id",
                        label: (
                          <AlgaehLabel label={{ fieldName: "doctor_id" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.frontproviders === undefined
                              ? []
                              : (display = this.props.frontproviders.filter(
                                  f => f.hims_d_employee_id === row.doctor_id
                                ));

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? this.state.selectedLang === "en"
                                  ? display[0].full_name
                                  : display[0].arabic_name
                                : ""}
                            </span>
                          );
                        },
                        disabled: true
                      }
                    ]}
                    keyId="visit_code"
                    dataSource={{
                      data: vstDeatils
                    }}
                    paging={{ page: 0, rowsPerPage: 3 }}
                    events={{
                      onDone: row => {
                        alert("done is raisedd");
                      }
                    }}
                    forceRender={this.state.Rerender}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </MyContext.Consumer>
    );
  }
}

function mapStateToProps(state) {
  return {
    visittypes: state.visittypes,
    frontproviders: state.frontproviders,
    deptanddoctors: state.deptanddoctors,
    viewsubdept: state.viewsubdept,
    dentalplans: state.dentalplans
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      getSubDepartment: AlgaehActions,
      getTreatmentPlan: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddConsultationForm)
);
