import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./SecondaryInsurance.scss";
import "../../../../styles/site.scss";
import MyContext from "../../../../utils/MyContext.js";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

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
  enddatehandle
} from "./SecInsuranceHandler";
import AlgaehFileUploader from "../../../Wrapper/algaehFileUpload";
class AddSecInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: null,
      backSide: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs);
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

  selectedValueInsurance(value, context, e) {
    if (this.state.insured === "Y") {
      this.setState({
        sec_insured: value,
        sec_insuranceYes: !this.state.sec_insuranceYes
      });

      if (context !== null) {
        context.updateState({
          sec_insured: value,
          sec_insuranceYes: !this.state.sec_insuranceYes
        });
      }
    } else {
      successfulMessage({
        message: "With out primary insurance cannot select secondary insurance",
        title: "Warning",
        icon: "error"
      });
    }
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
            <div className="htpl-phase1-seconary-insurance-form">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-8 primary-details">
                    <div className="row primary-box-container">
                      <div className="col-lg-2  insuranceRadio">
                        <AlgaehLabel
                          label={{
                            fieldName: "lbl_insurance"
                          }}
                        />
                        <br />
                        <div className="customRadio">
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="sec_insured"
                              value="Y"
                              checked={this.state.radioSecYes}
                              onChange={radioChange.bind(this, this, context)}
                              disabled={
                                this.state.sec_insured === "Y"
                                  ? this.state.hideSecInsurance
                                  : false
                              }
                            />
                            <span>
                              {this.state.selectedLang === "en" ? "Yes" : "نعم"}
                            </span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="sec_insured"
                              value="N"
                              checked={this.state.radioSecNo}
                              onChange={radioChange.bind(this, this, context)}
                              disabled={
                                this.state.sec_insured === "Y"
                                  ? this.state.hideSecInsurance
                                  : false
                              }
                            />
                            <span>
                              {this.state.selectedLang === "en" ? "No" : "لا"}
                            </span>
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
                          disabled={this.state.sec_insuranceYes}
                          onClick={InsuranceDetails.bind(this, this, context)}
                        >
                          <i className="fas fa-plus" />
                        </button>
                      </div>

                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "insurance_id",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "secondary_insurance_provider_id",
                          className: "select-fld",
                          value: this.state.secondary_insurance_provider_id,
                          dataSource: {
                            textField: "insurance_provider_name",
                            // this.state.selectedLang == "en" ? "insurance_provider_name" : "name",
                            valueField: "insurance_provider_id",
                            data:
                              this.props.existinsurance === undefined
                                ? this.props.secondaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.sec_insuranceYes
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "sub_insurance_id",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "secondary_sub_id",
                          className: "select-fld",
                          value: this.state.secondary_sub_id,
                          dataSource: {
                            textField: "sub_insurance_provider_name",
                            // this.state.selectedLang == "en" ? "sub_insurance_provider_name" : "name",
                            valueField: "sub_insurance_provider_id",
                            data:
                              this.props.existinsurance === undefined
                                ? this.props.secondaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.sec_insuranceYes
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "plan_id",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "secondary_network_id",
                          className: "select-fld",
                          value: this.state.secondary_network_id,
                          dataSource: {
                            textField: "network_type",
                            // this.state.selectedLang == "en" ? "network_type" : "name",
                            valueField: "network_id",
                            data:
                              this.props.existinsurance === undefined
                                ? this.props.secondaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.sec_insuranceYes
                          }
                        }}
                      />
                    </div>
                    <div className="row primary-box-container">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "policy_id",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        selector={{
                          name: "secondary_policy_num",
                          className: "select-fld",
                          value: this.state.secondary_policy_num,
                          dataSource: {
                            textField: "policy_number",
                            // this.state.selectedLang == "en" ? "name" : "name",
                            valueField: "policy_number",
                            data:
                              this.props.existinsurance === undefined
                                ? this.props.secondaryinsurance
                                : this.props.existinsurance
                          },
                          onChange: insurancehandle.bind(this, this, context),
                          others: {
                            disabled: this.state.sec_insuranceYes
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "card_number",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "secondary_card_number",
                          value: this.state.secondary_card_number,
                          events: {
                            onChange: texthandle.bind(this, this, context)
                          }
                        }}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "effective_start_date",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "secondary_effective_start_date"
                        }}
                        maxDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this, context)
                        }}
                        value={this.state.secondary_effective_start_date}
                        disabled={this.state.sec_insuranceYes}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "expiry_date",
                          isImp:
                            this.state.sec_insuranceYes === true ? false : true
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "secondary_effective_end_date"
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: enddatehandle.bind(this, this, context)
                        }}
                        value={this.state.secondary_effective_end_date}
                        disabled={this.state.sec_insuranceYes}
                      />

                      {/* <div className="col-lg-1">
                        <Tooltip id="tooltip-icon" title="Process">
                          <IconButton className="go-button" color="primary">
                            <PlayCircleFilled />
                          </IconButton>
                        </Tooltip>
                      </div> */}
                    </div>
                  </div>

                  {/* //effective_end_date// */}

                  <div className="col-lg-4 secondary-details">
                    <div className="row secondary-box-container">
                      <div className="col-lg-6 insurCrdImg">
                        <AlgaehFileUploader
                          ref={patSecInsuranceFrontImg => {
                            this.patSecInsuranceFrontImg = patSecInsuranceFrontImg;
                          }}
                          noImage="insurance-card-front"
                          name="patSecInsuranceFrontImg"
                          accept="image/*"
                          textAltMessage="Sec. Insurance Card Front Side"
                          serviceParameters={{
                            uniqueID:
                              this.state.secondary_card_number + "_sec_front",
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              context,
                              "patSecInsuranceFrontImg"
                            )
                          }}
                          renderPrevState={this.state.patSecInsuranceFrontImg}
                          forceRefresh={this.state.forceRefresh}
                        />

                        <div />
                      </div>

                      <div className="col-lg-6 insurCrdImg">
                        <AlgaehFileUploader
                          ref={patSecInsuranceBackImg => {
                            this.patSecInsuranceBackImg = patSecInsuranceBackImg;
                          }}
                          noImage="insurance-card-back"
                          name="patSecInsuranceBackImg"
                          accept="image/*"
                          textAltMessage="Sec. Insurance Card Back Side"
                          serviceParameters={{
                            uniqueID:
                              this.state.secondary_card_number + "_sec_back",
                            fileType: "Patients",
                            processDelay: this.imageDetails.bind(
                              this,
                              context,
                              "patSecInsuranceBackImg"
                            )
                          }}
                          renderPrevState={this.state.patSecInsuranceBackImg}
                          forceRefresh={this.state.forceRefresh}
                        />

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
    secondaryinsurance: state.secondaryinsurance
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
  )(AddSecInsuranceForm)
);
