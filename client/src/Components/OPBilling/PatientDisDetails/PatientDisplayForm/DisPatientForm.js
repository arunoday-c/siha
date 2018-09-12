import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./PatientDisplayForm.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext.js";
import { texthandle, PatientSearch } from "./DisPatientHandlers";
import variableJson from "../../../../utils/GlobalVariables.json";

class DisPatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }
  // PAT-A-0000365
  componentDidMount() {
    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.BillingIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-display-patient-form">
              <div className="container-fluid">
                <div className="row">
                  {/* Patient code */}
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "patient_code"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "patient_code",
                      value: this.state.patient_code,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      error: this.state.open,
                      helperText: this.state.userErrorText
                    }}
                  />

                  <div className="col-lg-1 form-group print_actions">
                    <span
                      className="fas fa-search fa-2x"
                      onClick={PatientSearch.bind(this, this, context)}
                      // onClick={this.PatientSearch.bind(this)}
                    />
                  </div>
                  {/* Patient name */}
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "full_name"
                      // forceLabel: "Name"
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
                  {/* Patient type */}
                  {/* <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "patient_type"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "full_name",
                      value: this.state.patient_type,
                      events: {
                        onChange: null
                      },
                      disabled: true
                    }}
                  /> */}

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "patient_type"
                    }}
                    selector={{
                      name: "patient_type",
                      className: "select-fld",
                      value: this.state.patient_type,

                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "patitent_type_desc"
                            : "arabic_patitent_type_desc",
                        valueField: "hims_d_patient_type_id",
                        data: this.props.patienttype
                      },
                      onChange: texthandle.bind(this, this, context),
                      others: {
                        disabled: true
                      }
                    }}
                  />

                  {/* Mode of payment */}
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "mode_of_pay",
                      isImp: true
                    }}
                    selector={{
                      name: "mode_of_pay",
                      className: "select-fld",
                      value: this.state.mode_of_pay,
                      dataSource: {
                        textField:
                          this.state.selectedLang === "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.MODE_OF_PAY
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
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
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions
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
