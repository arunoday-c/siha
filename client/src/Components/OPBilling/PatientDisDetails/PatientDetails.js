import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../actions/algaehActions";
import "./PatientDetails.scss";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import MyContext from "../../../utils/MyContext.js";
import {
  PatientSearch,
  selectVisit,
  AdmissionSearch,
} from "./DisPatientHandlers";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import moment from "moment";
import QuickRegistration from "../QuickRegistration";

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
          mappingName: "patienttype",
        },
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
          {(context) => (
            <div className="hptl-phase1-display-patient-form">
              <div
                className="row inner-top-search"
                style={{ paddingTop: 10, paddingBottom: 10 }}
              >
                {/* Patient code */}

                {this.state.userToken.admission_exists === "Y" ? (
                  <div className="col-2">
                    <label>Load By</label>
                    <div className="customRadio">
                      <label className="radio inline">
                        <input
                          type="radio"
                          name="billing_mode"
                          checked={
                            this.state.billing_mode === "O" ? true : false
                          }
                          onChange={() => {
                            this.setState({
                              billing_mode: "O",
                            });
                            context.updateState({ billing_mode: "O" });
                          }}
                        />
                        <span>OP</span>
                      </label>

                      <label className="radio inline">
                        <input
                          type="radio"
                          name="billing_mode"
                          checked={
                            this.state.billing_mode === "D" ? true : false
                          }
                          onChange={() => {
                            this.setState({
                              billing_mode: "D",
                            });
                            context.updateState({ billing_mode: "D" });
                          }}
                        />
                        <span>Day Care</span>
                      </label>
                    </div>
                  </div>
                ) : null}

                {this.state.billing_mode === "D" ? (
                  <div
                    className="col-2 globalSearchCntr"
                    style={{
                      cursor: "pointer",
                      pointerEvents:
                        this.state.Billexists === true
                          ? "none"
                          : this.state.patient_code
                          ? "none"
                          : "",
                    }}
                  >
                    <AlgaehLabel label={{ forceLabel: "Admission Number" }} />
                    <h6 onClick={AdmissionSearch.bind(this, this, context)}>
                      {this.state.admission_number ? (
                        this.state.admission_number
                      ) : (
                        <AlgaehLabel
                          label={{ forceLabel: "Admission Number" }}
                        />
                      )}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                ) : (
                  <div
                    className="col-2 globalSearchCntr"
                    style={{
                      cursor: "pointer",
                      pointerEvents:
                        this.state.Billexists === true
                          ? "none"
                          : this.state.patient_code
                          ? "none"
                          : "",
                    }}
                  >
                    <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
                    <h6 onClick={PatientSearch.bind(this, this, context)}>
                      {this.state.patient_code ? (
                        this.state.patient_code
                      ) : (
                        <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      )}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                )}

                <div className="col-10">
                  <div className="row">
                    {this.state.billing_mode === "D" ? (
                      <div className="col-3">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_code",
                          }}
                        />
                        <h6>
                          {this.state.patient_code
                            ? this.state.patient_code
                            : "--------"}
                        </h6>
                      </div>
                    ) : (
                      <AlagehAutoComplete
                        div={{ className: "col-2 mandatory" }}
                        label={{
                          fieldName: "select_visit",
                          isImp: true,
                        }}
                        selector={{
                          name: "visit_id",
                          className: "select-fld",
                          autoComplete: "off",
                          value: this.state.visit_id,
                          dataSource: {
                            textField: "visit_code",
                            valueField: "hims_f_patient_visit_id",
                            data: this.state.visitDetails,
                          },
                          others: { disabled: this.state.Billexists },
                          onChange: selectVisit.bind(this, this, context),
                          template: (item) => (
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
                          ),
                        }}
                      />
                    )}

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "full_name",
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
                          fieldName: "primary_id_no",
                        }}
                      />
                      <h6>
                        {this.state.primary_id_no
                          ? this.state.primary_id_no
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col-2">
                      <AlgaehLabel
                        label={{
                          fieldName: "mode_of_pay",
                        }}
                      />
                      <h6>
                        {this.state.mode_of_pay
                          ? this.state.mode_of_pay
                          : "--------"}
                      </h6>
                    </div>

                    {this.state.Billexists === true ? (
                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Bill Status" }} />
                        <h6>
                          {this.state.adjusted === "Y" ? (
                            <span className="badge badge-info">
                              Adjusted / {this.state.from_bill_number}
                            </span>
                          ) : this.state.cancelled === "Y" ? (
                            <span className="badge badge-secondary">
                              Cancelled
                            </span>
                          ) : this.state.cancelled === "P" ? (
                            <span className="badge badge-secondary">
                              Partially Cancelled
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
                    ) : (
                      <QuickRegistration
                        onComplete={({ patient_code }) => {
                          this.setState({
                            patient_code: patient_code,
                            // visit_id: visit_id,
                            // visitDetails: visitList,
                          });

                          if (context !== null) {
                            context.updateState({
                              patient_code: patient_code,
                              // visit_id: visit_id,
                            });
                          }
                        }}
                      />
                    )}
                    {this.state.due_amount > 0 ? (
                      <div className="col-2">
                        <AlgaehLabel label={{ forceLabel: "Due Amount" }} />
                        <h6 style={{ color: "red" }}>
                          {GetAmountFormart(this.state.due_amount)}
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
    existinsurance: state.existinsurance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getPatientPackage: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DisPatientForm)
);
