import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./PatientDisplayForm.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext.js";
import { texthandle, PatientSearch } from "./DisPatientHandlers";
import variableJson from "../../../../utils/GlobalVariables.json";

export default class DisPatientForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
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
                <div className="row form-details">
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
                  <AlagehFormGroup
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
                          this.state.selectedLang == "en"
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
