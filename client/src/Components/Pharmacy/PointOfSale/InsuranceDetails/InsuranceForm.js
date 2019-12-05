import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./InsuranceForm.scss";
import "./../../../../styles/site.scss";
import MyContext from "../../../../utils/MyContext";
import {
  AlgaehLabel,
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange,
  enddatehandle,
  clearinsurancehandle,
  dateValidate
} from "./InsuranceHandler";
import AlgaehFileUploader from "../../../Wrapper/algaehFileUpload";
import variableJson from "../../../../utils/GlobalVariables.json";
import moment from "moment";
import Options from "../../../../Options.json";

class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: null,
      backSide: null
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.POSIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  onDrop(fileName, file) {
    this.setState({
      [fileName]: file[0].preview
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POSIOputs);
  }
  imageDetails(context, type) {
    if (context !== undefined) {
      context.updateState({
        ...this.state,
        [type]: this[type]
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="row">
              <div className="col-8">
                <div className="row">
                  {this.state.pos_customer_type === "OT" &&
                  this.state.dataExitst === false ? (
                    <div className="col-12 margin-bottom-15">
                      <button
                        className="btn btn-default"
                        disabled={this.state.insuranceYes}
                        onClick={InsuranceDetails.bind(this, this, context)}
                      >
                        Select Insurance
                      </button>
                    </div>
                  ) : null}
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "INSURANCE CO."
                      }}
                    />
                    <h6>
                      {this.state.insurance_provider_name
                        ? this.state.insurance_provider_name
                        : "-----"}
                    </h6>
                  </div>

                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "SUB INSURANCE CO."
                      }}
                    />
                    <h6>
                      {this.state.sub_insurance_provider_name
                        ? this.state.sub_insurance_provider_name
                        : "-----"}
                    </h6>
                  </div>
                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "PLAN"
                      }}
                    />
                    <h6>
                      {this.state.network_type
                        ? this.state.network_type
                        : "-----"}
                    </h6>
                  </div>

                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "POLICY NUMBER"
                      }}
                    />
                    <h6>
                      {this.state.policy_number
                        ? this.state.policy_number
                        : "-----"}
                    </h6>
                  </div>

                  {/*{this.state.pos_customer_type === "OT" ? (
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "Card Holder Name"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "card_holder_name",
                        value: this.state.card_holder_name,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          disabled: this.state.insuranceYes
                        }
                      }}
                    />
                  ) : (
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Card Holder Name"
                        }}
                      />
                      <h6>
                        {this.state.card_holder_name
                          ? this.state.card_holder_name
                          : "-----"}
                      </h6>
                    </div>
                  )}*/}

                  {this.state.pos_customer_type === "OT" &&
                  this.state.dataExitst === false ? (
                    <AlagehFormGroup
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "CARD NUMBER",
                        isImp: this.state.insuranceYes === true ? false : true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "card_number",
                        value: this.state.card_number,
                        events: {
                          onChange: texthandle.bind(this, this, context)
                        },
                        others: {
                          disabled: this.state.insuranceYes
                        }
                      }}
                    />
                  ) : (
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Card Number"
                        }}
                      />
                      <h6>
                        {this.state.card_number
                          ? this.state.card_number
                          : "-----"}
                      </h6>
                    </div>
                  )}

                  <div className="col-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "START DATE"
                      }}
                    />
                    <h6>
                      {this.state.effective_start_date
                        ? moment(this.state.effective_start_date).format(
                            Options.dateFormat
                          )
                        : "-----"}
                    </h6>
                  </div>

                  {this.state.pos_customer_type === "OT" &&
                  this.state.dataExitst === false ? (
                    <AlgaehDateHandler
                      div={{ className: "col-3" }}
                      label={{
                        forceLabel: "EXPIRY DATE",
                        isImp: this.state.insuranceYes === true ? false : true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "effective_end_date"
                      }}
                      minDate={new Date()}
                      events={{
                        onChange: enddatehandle.bind(this, this, context),
                        onBlur: dateValidate.bind(this, this, context)
                      }}
                      value={this.state.effective_end_date}
                      disabled={this.state.insuranceYes}
                    />
                  ) : (
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "EXPIRY DATE"
                        }}
                      />
                      <h6>
                        {this.state.effective_end_date
                          ? moment(this.state.effective_end_date).format(
                              Options.dateFormat
                            )
                          : "-----"}
                      </h6>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-4">
                <div className="row">
                  <div className="col-6 insurCrdImg">
                    <AlgaehFileUploader
                      ref={patInsuranceFrontImg => {
                        this.patInsuranceFrontImg = patInsuranceFrontImg;
                      }}
                      noImage="insurance-card-front"
                      name="patInsuranceFrontImg"
                      accept="image/*"
                      showActions={this.state.card_number ? true : false}
                      textAltMessage="Insurance Card Front Side"
                      serviceParameters={{
                        uniqueID: this.state.card_number + "_front",
                        fileType: "Patients",
                        processDelay: this.imageDetails.bind(
                          this,
                          context,
                          "patInsuranceFrontImg"
                        )
                      }}
                      renderPrevState={this.state.patInsuranceFrontImg}
                      forceRefresh={this.state.forceRefresh}
                    />
                  </div>

                  <div className="col-6 insurCrdImg">
                    <AlgaehFileUploader
                      ref={patInsuranceBackImg => {
                        this.patInsuranceBackImg = patInsuranceBackImg;
                      }}
                      noImage="insurance-card-back"
                      name="patInsuranceBackImg"
                      accept="image/*"
                      showActions={this.state.card_number ? true : false}
                      textAltMessage="Insurance Card Back Side"
                      serviceParameters={{
                        uniqueID: this.state.card_number + "_back",
                        fileType: "Patients",
                        processDelay: this.imageDetails.bind(
                          this,
                          context,
                          "patInsuranceBackImg"
                        )
                      }}
                      renderPrevState={this.state.patInsuranceBackImg}
                      forceRefresh={this.state.forceRefresh}
                    />
                    <div />
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
    existinsurance: state.existinsurance,
    primaryinsurance: state.primaryinsurance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientInsurence: AlgaehActions,
      setSelectedInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddInsuranceForm)
);
