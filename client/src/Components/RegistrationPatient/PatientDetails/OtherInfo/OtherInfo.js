import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { postPatientDetails } from "../../../../actions/RegistrationPatient/Registrationactions.js";
import MyContext from "../../../../utils/MyContext.js";
import PatRegIOputs from "../../../../Models/RegistrationPatient.js";
import { AlagehFormGroup } from "../../../Wrapper/algaehWrapper";
import "./OtherInfo.css";
import "../../../../styles/site.css";

class OtherInfo extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.PatRegIOputs;
  }

  componentDidMount() {
    this.setState({ ...this.state });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.patients !== undefined && nextProps.patients.length > 0) {
      this.setState(PatRegIOputs.inputParam(nextProps.patients[0]));
    }
  }

  render() {
    return (
      <MyContext.Consumer>
        {context => (
          <div className="hptl-phase1-add-other-form">
            {/* <div className="main-details" /> */}
            <div className="col-lg-12">
              <div className="row" style={{ paddingBottom: "10px" }}>
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "secondary_contact_number"
                  }}
                  textBox={{
                    value: this.state.secondary_contact_number,
                    className: "txt-fld",
                    name: "secondary_contact_number",
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).numbertexthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient,
                      placeHolder: "(+01)123-456-7890",
                      type: "number"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "emergency_contact_number"
                  }}
                  textBox={{
                    value: this.state.emergency_contact_number,
                    className: "txt-fld",
                    name: "emergency_contact_number",
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).numbertexthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient,
                      placeHolder: "(+01)123-456-7890",
                      type: "number"
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "emergency_contact_name"
                  }}
                  textBox={{
                    value: this.state.emergency_contact_name,
                    className: "txt-fld",
                    name: "emergency_contact_name",
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).texthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "relationship_with_patient"
                  }}
                  textBox={{
                    value: this.state.relationship_with_patient,
                    className: "txt-fld",
                    name: "relationship_with_patient",
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).texthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "email"
                  }}
                  textBox={{
                    value: this.state.email,
                    className: "txt-fld",
                    name: "email",
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).texthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient,
                      placeHolder: "Enter Email Address",
                      type: "email"
                    }
                  }}
                />
              </div>
              <div className="row" style={{ paddingBottom: "10px" }}>
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    fieldName: "postal_code"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "postal_code",
                    value: this.state.postal_code,
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).texthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    fieldName: "address2"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "address2",
                    value: this.state.address2,
                    events: {
                      onChange: AddPatientOtherHandlers(
                        this,
                        context
                      ).texthandle.bind(this)
                    },
                    others: {
                      disabled: this.state.existingPatient,
                      placeHolder: "Enter Full Address 2"
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </MyContext.Consumer>
    );
  }
}

function AddPatientOtherHandlers(state, context) {
  context = context || null;

  return {
    handle: val => {
      state.setState({
        value: val
      });
    },

    numbertexthandle: e => {
      state.setState({
        [e.target.name]: e.target.value
      });

      if (context != null) {
        context.updateState({ [e.target.name]: e.target.value });
      }
    },

    texthandle: e => {
      state.setState({
        [e.target.name]: e.target.value
      });

      if (context != null) {
        context.updateState({ [e.target.name]: e.target.value });
      }
    },

    selectedHandeler: e => {
      state.setState({
        [e.name]: e.value
      });
      if (context != null) {
        context.updateState({ [e.name]: e.value });
      }
    }
  };
}

function mapStateToProps(state) {
  return {
    patients: state.patients
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { postPatientDetails: postPatientDetails },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OtherInfo)
);
