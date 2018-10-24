import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Dropzone from "react-dropzone";
import "./SecondaryInsurance.css";
import "../../../../styles/site.css";
import AddCircle from "@material-ui/icons/AddCircle";
// import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import MyContext from "../../../../utils/MyContext.js";
import { successfulMessage } from "../../../../utils/GlobalFunctions";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  Tooltip
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import {
  insurancehandle,
  texthandle,
  datehandle,
  InsuranceDetails,
  radioChange
} from "./SecInsuranceHandler";

class AddSecInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: null,
      backSide: null,
      radioNo: true,
      radioYes: false
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
    if (this.state.insured == "Y") {
      this.setState({
        sec_insured: value,
        sec_insuranceYes: !this.state.sec_insuranceYes
      });

      if (context != null) {
        context.updateState({
          sec_insured: value,
          sec_insuranceYes: !this.state.sec_insuranceYes
        });
      }
    } else {
      successfulMessage({
        message:
          "Invalid Input. With out primary insurance cannot select secondary insurance",
        title: "Warning",
        icon: "error"
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
                      <div className="col-lg-2" style={{ paddingRight: 0 }}>
                        <label>Insurance</label>
                        <br />
                        <div className="customRadio">
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="sec_insured"
                              value="Y"
                              checked={this.state.radioYes}
                              onChange={radioChange.bind(this, this, context)}
                            />
                            <span>Yes</span>
                          </label>
                          <label className="radio inline">
                            <input
                              type="radio"
                              name="sec_insured"
                              value="N"
                              checked={this.state.radioNo}
                              onChange={radioChange.bind(this, this, context)}
                            />
                            <span>No</span>
                          </label>
                        </div>
                        {/* <div className="row moveRadioButtons">
                          {INSURANCE_DECISION.map((data, idx) => {
                            return (
                              <div
                                className="col-lg-6"
                                key={"index_value" + idx}
                              >
                                <input
                                  type="radio"
                                  name="INSURANCE_DECISION"
                                  className="htpl-phase1-radio-btn"
                                  value={data.value}
                                  onChange={this.selectedValueInsurance.bind(
                                    this,
                                    data.value,
                                    context
                                  )}
                                  defaultChecked={
                                    data.value === this.state.sec_insured
                                      ? true
                                      : false
                                  }
                                />
                                <label className="radio-design">
                                  {data.label}
                                </label>
                              </div>
                            );
                          })}
                        </div> */}
                      </div>
                      <div className="col-lg-1" style={{ paddingRight: 0 }}>
                        <Tooltip id="tooltip-icon" title="Add New">
                          <IconButton
                            className="go-button"
                            color="primary"
                            disabled={this.state.sec_insuranceYes}
                          >
                            <AddCircle
                              onClick={InsuranceDetails.bind(
                                this,
                                this,
                                context
                              )}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{
                          fieldName: "insurance_id"
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
                          fieldName: "sub_insurance_id"
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
                          fieldName: "plan_id"
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
                          fieldName: "policy_id"
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
                          fieldName: "card_number"
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
                          fieldName: "effective_start_date"
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
                        label={{ fieldName: "expiry_date" }}
                        textBox={{
                          className: "txt-fld",
                          name: "secondary_effective_end_date"
                        }}
                        minDate={new Date()}
                        events={{
                          onChange: datehandle.bind(this, this, context)
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
                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="image-drop-area">
                          <Dropzone
                            onDrop={this.onDrop.bind(this, "frontSide")}
                            className="dropzone"
                            id="attach-primary-id"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              //className="preview-image"
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
                          </Dropzone>
                        </div>

                        <div />
                      </div>

                      <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                        <div className="image-drop-area">
                          <Dropzone
                            onDrop={this.onDrop.bind(this, "backSide")}
                            className="dropzone"
                            id="attach-primary-id"
                            accept="image/*"
                            multiple={false}
                            name="image"
                          >
                            <img
                              //  className="preview-image"
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
                          </Dropzone>
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
