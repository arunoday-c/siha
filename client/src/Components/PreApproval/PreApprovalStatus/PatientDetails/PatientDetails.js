import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Typography from "@material-ui/core/Typography";

import { AlgaehActions } from "../../../../actions/algaehActions";

import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehDateHandler,
  AlagehAutoComplete,
  AlagehFormGroup,
  Modal
} from "../../../Wrapper/algaehWrapper";

import "./../../../../styles/site.css";
import "./PatientDetails.css";

class PatientDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  SubmitRequest(e) {
    this.props.onClose && this.props.onClose(e);
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentDidMount() {
    let InputOutput = this.props.selected_services;
    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <div className="hptl-pre-approval-patient-details">
            <div className="tab-container toggle-section">
              <ul className="nav">
                <li className={"nav-item tab-button active"}>
                  Patient Details
                </li>
              </ul>
            </div>
            <div className="patient-section">
              <div className="container-fluid">
                <div className="row">
                  {/* Patient code */}
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "patient_code"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "patient_code",
                      value: this.state.patient_code,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  {/* Patient name */}
                  <AlagehFormGroup
                    div={{ className: "col-lg-6" }}
                    label={{
                      fieldName: "patient_name"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.full_name,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "date" }}
                    textBox={{ className: "txt-fld" }}
                    events={{
                      onChange: null
                    }}
                    value={this.state.created_date}
                    disabled={true}
                  />
                  {/* Patient type */}
                </div>
                <div className="row">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "doctor_id"
                    }}
                    selector={{
                      name: "doctor_id",
                      className: "select-fld",
                      value: this.state.doctor_id,
                      dataSource: {
                        textField: "full_name",
                        valueField: "employee_id",
                        data:
                          this.props.deptanddoctors === undefined
                            ? []
                            : this.props.deptanddoctors.doctors
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "insurance_id"
                    }}
                    selector={{
                      name: "insurance_provider_id",
                      className: "select-fld",
                      value: this.state.insurance_provider_id,
                      dataSource: {
                        textField: "insurance_provider_name",
                        valueField: "hims_d_insurance_provider_id",
                        data:
                          this.props.insurarProviders === undefined
                            ? []
                            : this.props.insurarProviders
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "department_id"
                    }}
                    selector={{
                      name: "department_id",
                      className: "select-fld",
                      value: this.state.department_id,
                      dataSource: {
                        textField: "insurance_provider_name",
                        valueField: "hims_d_insurance_provider_id",
                        data:
                          this.props.insurarProviders === undefined
                            ? []
                            : this.props.insurarProviders
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "card_no"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_no",
                      value: this.state.card_no,
                      events: {
                        onChange: null
                      },
                      disabled: true
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
    deptanddoctors: state.deptanddoctors,
    insurarProviders: state.insurarProviders
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getDepartmentsandDoctors: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientDetails)
);
