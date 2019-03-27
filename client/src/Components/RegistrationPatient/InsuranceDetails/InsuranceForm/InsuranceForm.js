import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Dropzone from "react-dropzone";

import "./InsuranceForm.css";
import "./../../../../styles/site.css";
import MyContext from "../../../../utils/MyContext.js";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange,
  enddatehandle
} from "./InsuranceHandler";
import AlgaehFileUploader from "../../../Wrapper/algaehFileUpload";
class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: null,
      backSide: null
    };
  }

  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  onDrop(fileName, file) {
    this.setState({
      [fileName]: file[0].preview
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs);
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
            <div className="htpl-phase1-primary-insurance-form">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8 primary-details">
                    <div className="row primary-box-container">
                      <div className="col-lg-2" style={{ paddingRight: 0 }}>
                        <label>Insurance</label>
                        <br />

                        <div className="customRadio">
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="insured"
                              value="Y"
                              checked={this.state.radioYes}
                              onChange={radioChange.bind(this, this, context)}
                              disabled={this.state.hideInsurance}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="insured"
                              value="N"
                              checked={this.state.radioNo}
                              disabled={this.state.hideInsurance}
                              onChange={radioChange.bind(this, this, context)}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      <div
                        className="col-lg-1"
                        style={{ paddingRight: 0, marginTop: 20 }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary btn-rounded"
                          disabled={this.state.insuranceYes}
                          onClick={InsuranceDetails.bind(this, this, context)}
                        >
                          <i className="fas fa-plus" />
                        </button>
                      </div>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "insurance_id",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "primary_insurance_provider_id",
                          className: "select-fld",
                          value: this.state.primary_insurance_provider_id,
                          dataSource: {
                            textField: "insurance_provider_name",
                            // this.state.selectedLang == "en" ? "insurance_provider_name" : "name",
                            valueField: "insurance_provider_id",
                            data:
                              this.props.existinsurance === undefined ||
                              this.props.existinsurance.length === 0
                                ? this.props.primaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.insuranceYes
                          }
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "sub_insurance_id",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "primary_sub_id",
                          className: "select-fld",
                          value: this.state.primary_sub_id,
                          dataSource: {
                            textField: "sub_insurance_provider_name",
                            // this.state.selectedLang == "en" ? "sub_insurance_provider_name" : "name",
                            valueField: "sub_insurance_provider_id",
                            data:
                              this.props.existinsurance === undefined ||
                              this.props.existinsurance.length === 0
                                ? this.props.primaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.insuranceYes
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "plan_id",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "primary_network_id",
                          className: "select-fld",
                          value: this.state.primary_network_id,
                          dataSource: {
                            textField: "network_type",
                            // this.state.selectedLang == "en" ? "network_type" : "name",
                            valueField: "network_id",
                            data:
                              this.props.existinsurance === undefined ||
                              this.props.existinsurance.length === 0
                                ? this.props.primaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.insuranceYes
                          }
                        }}
                      />
                    </div>
                    <div className="row primary-box-container">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "policy_id",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "primary_policy_num",
                          className: "select-fld",
                          value: this.state.primary_policy_num,
                          dataSource: {
                            textField: "policy_number",
                            // this.state.selectedLang == "en" ? "name" : "name",
                            valueField: "policy_number",
                            data:
                              this.props.existinsurance === undefined ||
                              this.props.existinsurance.length === 0
                                ? this.props.primaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.insuranceYes
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "card_number",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "primary_card_number",
                          value: this.state.primary_card_number,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "effective_start_date",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "primary_effective_start_date"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this, context)
                        }}
                        value={this.state.primary_effective_start_date}
                        disabled={this.state.insuranceYes}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "expiry_date",
                          isImp: this.state.insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "primary_effective_end_date"
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: enddatehandle.bind(this, this, context)
                        }}
                        value={this.state.primary_effective_end_date}
                        disabled={this.state.insuranceYes}
                      />
                    </div>
                  </div>

                  {/* //effective_end_date// */}

                  <div className="col-lg-4 secondary-details">
                    <div className="row secondary-box-container">
                      <div className="col-lg-6">
                        <div className="image-drop-area">
                          <AlgaehFileUploader
                            ref={patInsuranceFrontImg => {
                              this.patInsuranceFrontImg = patInsuranceFrontImg;
                            }}
                            noImage="insurance-card-front"
                            name="patInsuranceFrontImg"
                            accept="image/*"
                            textAltMessage="Insurance Card Front Side"
                            serviceParameters={{
                              uniqueID:
                                this.state.primary_card_number + "_front",
                              fileType: "Patients",
                              processDelay: this.imageDetails.bind(
                                this,
                                context,
                                "patInsuranceFrontImg"
                              )
                            }}
                            renderPrevState={this.state.patInsuranceFrontImg}
                          />
                          {/* <Dropzone
                            onDrop={this.onDrop.bind(this, "frontSide")}
                            id="attach-primary-id"
                            className="dropzone"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              alt="Attach front side"
                              src={this.state.frontSide}
                              style={{ width: "100%", height: "101px" }}
                            />

                            <div className="attach-design text-center">
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_front",
                                  align: ""
                                }}
                              />
                            </div>
                          </Dropzone> */}
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="image-drop-area">
                          <AlgaehFileUploader
                            ref={patInsuranceBackImg => {
                              this.patInsuranceBackImg = patInsuranceBackImg;
                            }}
                            noImage="insurance-card-back"
                            name="patInsuranceBackImg"
                            accept="image/*"
                            textAltMessage="Insurance Card Back Side"
                            serviceParameters={{
                              uniqueID:
                                this.state.primary_card_number + "_back",
                              fileType: "Patients",
                              processDelay: this.imageDetails.bind(
                                this,
                                context,
                                "patInsuranceBackImg"
                              )
                            }}
                            renderPrevState={this.state.patInsuranceBackImg}
                          />

                          {/* <Dropzone
                            onDrop={this.onDrop.bind(this, "backSide")}
                            id="attach-width"
                            className="dropzone"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              alt="Attach back side"
                              src={this.state.backSide}
                              style={{ width: "100%", height: "101px" }}
                            />

                            <div className="attach-design text-center">
                              <AlgaehLabel
                                label={{
                                  fieldName: "attach_back",
                                  align: ""
                                }}
                              />
                            </div>
                          </Dropzone> */}
                        </div>

                        <div />
                      </div>
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
