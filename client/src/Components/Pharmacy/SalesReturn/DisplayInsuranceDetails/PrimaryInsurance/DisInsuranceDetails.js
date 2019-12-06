import React, { Component } from "react";
import "./PrimaryInsuranceDetails.scss";
import "./../../../../../styles/site.scss";
import {
  AlagehFormGroup,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../../../Options.json";
// import { swalMessage, algaehApiCall } from "../../../../../utils/algaehApiCall";

export default class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.SALESRETURNIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SALESRETURNIOputs);
  }

  render() {
    return (
      <div className="htpl-primary-display-insurance-pos-form">
        <div className="col">
          <div className="row">
            <div className="col-6 primary-details">
              <div className="row">
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "INSURANCE CO."
                    }}
                  />
                  <h6>
                    {this.state.insurance_provider_name
                      ? this.state.insurance_provider_name
                      : "---"}
                  </h6>
                </div>

                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "SUB INSURANCE CO."
                    }}
                  />
                  <h6>
                    {this.state.sub_insurance_provider_name
                      ? this.state.sub_insurance_provider_name
                      : "---"}
                  </h6>
                </div>
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "PLAN"
                    }}
                  />
                  <h6>
                    {this.state.network_type ? this.state.network_type : "---"}
                  </h6>
                </div>

                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "POLICY NUMBER"
                    }}
                  />
                  <h6>
                    {this.state.policy_number
                      ? this.state.policy_number
                      : "---"}
                  </h6>
                </div>
                <div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "CARD NUMBER"
                    }}
                  />
                  <h6>
                    {this.state.card_number ? this.state.card_number : "---"}
                  </h6>
                </div>

                <div className="col-6">
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
                      : "---"}
                  </h6>
                </div>

                {/*<div className="col-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "CARD HOLDER NAME"
                    }}
                  />
                  <h6>
                    {this.state.card_holder_name
                      ? this.state.card_holder_name
                      : "---"}
                  </h6>
                </div>*/}
              </div>
            </div>
            <div className="col-6 secondary-details">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Consultation %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_consultation,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Laboratory %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Radiology %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_rad,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Medcine %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_medicine,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Procedure %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_trt,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-4 form-group" }}
                  label={{
                    forceLabel: "Dental %"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.copay_percent_dental,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-12 form-group" }}
                  label={{
                    forceLabel: "Max Limit Amt. for All Service"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.dental_max,
                    className: "txt-fld",
                    name: "unbalanced_amount",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
