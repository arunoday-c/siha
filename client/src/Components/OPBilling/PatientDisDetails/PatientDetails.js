import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";
import "./PatientDetails.scss";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import { PatientSearch, selectVisit } from "./DisPatientHandlers";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

import moment from "moment";
class DisPatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  render() {
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

                <div
                  className="col-2 globalSearchCntr"
                  style={{
                    cursor: "pointer",
                    pointerEvents:
                      this.state.Billexists === true
                        ? "none"
                        : this.state.patient_code
                        ? "none"
                        : ""
                  }}
                >
                  <AlgaehLabel label={{ forceLabel: "Search Employee" }} />
                  <h6 onClick={PatientSearch.bind(this, this, context)}>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "Search Employee"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                <div className="col-10">
                  <div className="row">
                    <AlagehAutoComplete
                      div={{ className: "col-2 mandatory" }}
                      label={{
                        fieldName: "select_visit",
                        isImp: true
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
                            <h5>
                              {item.visit_date
                                ? moment(item.visit_date).format(
                                    "DD/MM/YYYY, hh:mm A"
                                  )
                                : "DD/MM/YYYY"}
                            </h5>
                            <h6>{item.visit_code}</h6>
                            <p>{item.full_name}</p>
                            <p>{item.sub_department_name}</p>
                          </div>
                        )
                      }}
                    />
                    <div className="col">
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

                    <div className="col-2">
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

                    <div className="col-2">
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

                    {this.state.Billexists === true ? (
                      <div className="col-2">
                        <AlgaehLabel label={{ forceLabel: "Bill Status" }} />
                        <h6>
                          {this.state.cancelled === "Y" ? (
                            <span className="badge badge-secondary">
                              Cancelled
                            </span>
                          ) : this.state.balance_credit > 0 ? (
                            <span className="badge badge-danger">
                              Not Settled
                            </span>
                          ) : (
                            <span className="badge badge-success">Settled</span>
                          )}
                        </h6>
                      </div>
                    ) : null}
                    {this.state.due_amount > 0 ? (
                      <div className="col-2">
                        <AlgaehLabel label={{ forceLabel: "Due Amount" }} />
                        <h6 style={{ color: "red" }}>
                          {getAmountFormart(this.state.due_amount)}
                        </h6>
                      </div>
                    ) : null}
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
    deptanddoctors: state.deptanddoctors,
    existinsurance: state.existinsurance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getDepartmentsandDoctors: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DisPatientForm)
);
