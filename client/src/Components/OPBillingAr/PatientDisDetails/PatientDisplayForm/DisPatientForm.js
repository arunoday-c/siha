import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { AlgaehActions } from "../../../../actions/algaehActions";
import "./PatientDisplayForm.css";
import {
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
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
            <div className="col-lg-12">
              <div className="row">
                {/* Patient code */}
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col-lg-4">
                      <AlgaehLabel
                        label={{
                          fieldName: "mode_of_pay"
                        }}
                      />
                      <h6>
                        {this.state.mode_of_pay
                          ? this.state.mode_of_pay
                          : "Mode of Payment"}
                      </h6>
                    </div>
                    <div className="col-lg-4">
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
                    <div className="col-lg-4">
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
                  </div>
                </div>

                <div className="col-lg-4 card box-shadow-normal">
                  <div className="row">
                    <div className="col-lg-2 form-group print_actions">
                      <span
                        className="fas fa-search fa-2x"
                        onClick={PatientSearch.bind(this, this, context)}
                      />
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-lg-10" }}
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
