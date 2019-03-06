import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";
import "./PatientDetails.css";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import { PatientSearch, selectVisit } from "./DisPatientHandlers";

class DisPatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
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
    this.setState(nextProps.BillingIOputs);
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-display-patient-form">
              <div
                className="row inner-top-search"
                style={{ paddingTop: 10, paddingBottom: 10 }}
              >
                {/* Patient code */}
                <div className="col-lg-3">
                  <div
                    className="row"
                    style={{
                      border: " 1px solid #ced4d9",
                      borderRadius: 5,
                      marginLeft: 0
                    }}
                  >
                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      <h6>
                        {this.state.patient_code
                          ? this.state.patient_code
                          : "----------"}
                      </h6>
                    </div>
                    <div
                      className="col-lg-3"
                      style={{ borderLeft: "1px solid #ced4d8" }}
                    >
                      <i
                        className="fas fa-search fa-lg"
                        style={{
                          paddingTop: 17,
                          paddingLeft: 3,
                          cursor: "pointer",
                          pointerEvents:
                            this.state.Billexists === true
                              ? "none"
                              : this.state.patient_code
                              ? "none"
                              : ""
                        }}
                        onClick={PatientSearch.bind(this, this, context)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="row">
                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "full_name"
                        }}
                      />
                      <h6>
                        {this.state.full_name
                          ? this.state.full_name
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "patient_type"
                        }}
                      />
                      <h6>
                        {this.state.patient_type
                          ? this.state.patient_type
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "mode_of_pay"
                        }}
                      />
                      <h6>
                        {this.state.mode_of_pay
                          ? this.state.mode_of_pay
                          : "--------"}
                      </h6>
                    </div>

                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{
                        fieldName: "select_visit"
                      }}
                      selector={{
                        name: "visit_id",
                        className: "select-fld",
                        autoComplete: "off",
                        value: this.state.visit_id,
                        dataSource: {
                          textField: "visit_code",
                          valueField: "hims_f_patient_visit_id",
                          data: this.state.visitDetails
                        },
                        others: { disabled: this.state.Billexists },
                        onChange: selectVisit.bind(this, this, context),
                        template: item => (
                          <div className="multiInfoList">
                            <h5>{item.visit_code}</h5>
                            <h6>Date: {item.visit_date}</h6>
                            <p>Doctor.: {item.full_name}</p>
                            <p>Dept.: {item.sub_department_name}</p>
                          </div>
                        )
                      }}
                    />

                    <div className="col-lg-3">
                      {this.state.Billexists === true ? (
                        this.state.cancelled === "Y" ? (
                          <h5 style={{ color: "red" }}> Cancelled </h5>
                        ) : this.state.balance_credit > 0 ? (
                          <h5 style={{ color: "red" }}> Not Settled </h5>
                        ) : (
                          <h5 style={{ color: "green" }}> Settled </h5>
                        )
                      ) : null}
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
    patienttype: state.patienttype,
    deptanddoctors: state.deptanddoctors
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DisPatientForm)
);
