import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Dropzone from "react-dropzone";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import AddCircle from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";

import "./InsuranceForm.css";
import "./../../../../styles/site.css";
import MyContext from "../../../../utils/MyContext.js";
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
  InsuranceDetails
} from "./InsuranceHandler";

const INSURANCE_DECISION = [
  { label: "Yes", value: "Y" },
  { label: "No", value: "N" }
];

class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      frontSide: null,
      backSide: null
    };
    this.widthImg = "";
  }

  componentWillUpdate(nextProps, nextState) {
    var width = document.getElementById("attach-width").offsetWidth;
    this.widthImg = width + 1;
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
    let PatType = null;
    if ((value = "Y")) {
      PatType = "I";
    } else {
      PatType = "S";
    }
    this.setState({
      insured: value,
      insuranceYes: !this.state.insuranceYes
    });

    if (context != null) {
      context.updateState({
        insured: value,
        insuranceYes: !this.state.insuranceYes,
        patient_type: PatType
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
                    <div className="col-12">
                      <div className="row primary-box-container">
                        <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 ">
                          <label>Insurance</label>
                          <br />
                          <div className="row moveRadioButtons">
                            {INSURANCE_DECISION.map((data, idx) => {
                              return (
                                <div
                                  className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4"
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
                                      data.value === this.state.insured
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
                          </div>
                        </div>
                        <div className="col-lg-1">
                          <Tooltip id="tooltip-icon" title="Add New">
                            <IconButton
                              component="div"
                              className="go-button"
                              color="primary"
                              disabled={this.state.insuranceYes}
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
                            name: "primary_insurance_provider_id",
                            className: "select-fld",
                            value: this.state.primary_insurance_provider_id,
                            dataSource: {
                              textField: "insurance_provider_name",
                              // this.state.selectedLang == "en" ? "insurance_provider_name" : "name",
                              valueField: "insurance_provider_id",
                              data:
                                this.props.existinsurance === undefined
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
                            fieldName: "sub_insurance_id"
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
                                this.props.existinsurance === undefined
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
                            fieldName: "plan_id"
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
                                this.props.existinsurance === undefined
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
                            fieldName: "policy_id"
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
                                this.props.existinsurance === undefined
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
                            fieldName: "card_number"
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
                            fieldName: "effective_start_date"
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
                          label={{ fieldName: "expiry_date" }}
                          textBox={{
                            className: "txt-fld",
                            name: "primary_effective_end_date"
                          }}
                          minDate={new Date()}
                          events={{
                            onChange: datehandle.bind(this, this, context)
                          }}
                          value={this.state.primary_effective_end_date}
                          disabled={this.state.insuranceYes}
                        />
                      </div>
                    </div>
                  </div>

                  {/* //effective_end_date// */}

                  <div className="col-lg-4 secondary-details">
                    <div className="col-lg-12">
                      <div className="row secondary-box-container">
                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="image-drop-area">
                            <Dropzone
                              onDrop={this.onDrop.bind(this, "frontSide")}
                              id="attach-primary-id"
                              className="dropzone"
                              accept="image/*"
                              multiple={false}
                              name="image"
                            >
                              <img
                                // className="preview-image"
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
                        </div>

                        <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
                          <div className="image-drop-area">
                            <Dropzone
                              onDrop={this.onDrop.bind(this, "backSide")}
                              id="attach-width"
                              className="dropzone"
                              accept="image/*"
                              multiple={false}
                              name="image"
                            >
                              <img
                                // className="preview-image"
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
