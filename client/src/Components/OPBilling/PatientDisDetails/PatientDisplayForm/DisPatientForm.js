import React, { Component } from "react";
import "./PatientDisplayForm.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
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
              <div className="row card-deck panel-layout">
                {/* Patient code */}
                <div className="col-lg-4 card box-shadow-normal">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-8" }}
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

                    <div className="col-lg-2 form-group print_actions">
                      <span
                        className="fas fa-search fa-2x"
                        onClick={PatientSearch.bind(this, this, context)}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 card box-shadow-normal">
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
                          : "Patient Name"}
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
                          : "Patient Type"}
                      </h6>
                    </div>
                    {/* Mode of payment */}
                    <AlagehAutoComplete
                      div={{ className: "col-lg-5" }}
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
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}
