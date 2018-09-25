import React, { Component } from "react";
// import swal from "sweetalert";

import "./ConsultationForm.css";
import "./../../../../styles/site.css";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import moment from "moment";
import Options from "../../../../Options.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
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
      departments: [],
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
      this.props.providers === undefined ||
      this.props.providers.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "providers"
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
        },
        afterSuccess: data => {
          debugger;
          this.setState({
            departments: data.departmets,
            doctors: data.doctors
          });
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
      this.state.visitDetails == null ? [{}] : this.state.visitDetails;
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
                          data: this.state.departments
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
                          data: this.state.doctors
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
                                name="MATERNITY_PATIENT"
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
                  <h6>Past Visit</h6>
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
                          this.props.deptanddoctors === undefined
                            ? []
                            : (display = this.props.deptanddoctors.departmets.filter(
                                f =>
                                  f.sub_department_id === row.sub_department_id
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
                          this.props.deptanddoctors === undefined
                            ? []
                            : (display = this.props.deptanddoctors.doctors.filter(
                                f => f.employee_id === row.doctor_id
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
    providers: state.providers,
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getVisittypes: AlgaehActions,
      getProviderDetails: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      generateBill: AlgaehActions,
      billingCalculations: AlgaehActions
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
