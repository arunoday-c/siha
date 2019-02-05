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
  doctorselectedHandeler
} from "./AddConsultationDetails";

const MATERNITY_PATIENT = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" }
];

class AddConsultationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "",
      doctors: []
    };
  }

  componentWillMount() {
    let InputOutput;

    InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.visittypes === undefined ||
      this.props.visittypes.length === 0
    ) {
      this.props.getVisittypes({
        uri: "/visitType/get",
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
    if (date != null) {
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
                        onChange: selectedHandeler.bind(this, this, context)
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
                        onChange: DeptselectedHandeler.bind(this, this, context)
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
                        )
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
                    <div className="col-lg-8">
                      <AlgaehLabel
                        label={{
                          fieldName: "maternity_patient"
                        }}
                      />
                      <br />
                      <div className="row moveRadioButtons">
                        {MATERNITY_PATIENT.map((data, idx) => {
                          return (
                            <div className="col-lg-6" key={"index_value" + idx}>
                              <input
                                type="radio"
                                id={"mat_pat_" + idx}
                                name="maternity_patient"
                                className="htpl-phase1-radio-btn"
                                value={data.value}
                                defaultChecked={
                                  data.value === "N" ? true : false
                                }
                              />
                              <label
                                className="radio-design"
                                htmlFor={"mat_pat_" + idx}
                              >
                                {data.label}
                              </label>
                            </div>
                          );
                        })}
                      </div>
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
                          let display = [];
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
                          let display = [];
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
    viewsubdept: state.viewsubdept
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      getSubDepartment: AlgaehActions
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
