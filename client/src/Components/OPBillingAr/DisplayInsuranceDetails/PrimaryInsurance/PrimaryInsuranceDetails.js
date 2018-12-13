import React, { Component } from "react";
import "./PrimaryInsuranceDetails.css";
import "./../../../../styles/site.css";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../../Options.json";

export default class AddInsuranceForm extends Component {
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
      <div className="htpl-primary-display-insurance-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 primary-details">
              <div className="row primary-box-container">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "insurance_company"
                    }}
                  />
                  <h6>
                    {this.state.insurance_provider_name
                      ? this.state.insurance_provider_name
                      : "---"}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "sub_insurance_company"
                    }}
                  />
                  <h6>
                    {this.state.sub_insurance_provider_name
                      ? this.state.sub_insurance_provider_name
                      : "---"}
                  </h6>
                </div>
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "plan_desc"
                    }}
                  />
                  <h6>
                    {this.state.network_type ? this.state.network_type : "---"}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "policy_no"
                    }}
                  />
                  <h6>
                    {this.state.policy_number
                      ? this.state.policy_number
                      : "---"}
                  </h6>
                </div>
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "card_no"
                    }}
                  />
                  <h6>
                    {this.state.card_number ? this.state.card_number : "---"}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      fieldName: "ins_expiry_date"
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
              </div>
            </div>
            <div className="col-lg-4 primary-details">
              <div className="row primary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "services"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      fieldName: "percentage"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      fieldName: "max_limit"
                    }}
                  />
                </div>
              </div>

              <div className="row primary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "consultation"
                      // forceLabel: "Consultation"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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

              <div className="row primary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "laboratory"
                      // forceLabel: "Laboratory"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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

              <div className="row primary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "radiology"
                      // forceLabel: "Radiology"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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

            <div className="col-lg-4 secondary-details">
              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      // fieldName: "Co-Insurance"
                      fieldName: "co_insurance"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      fieldName: "percentage"
                      // forceLabel: "Percentage"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      fieldName: "max_limit"
                    }}
                  />
                </div>
              </div>

              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "medicine"
                      // forceLabel: "Medicine"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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

              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      fieldName: "procedure"
                      // forceLabel: "procedure"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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

              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      // fieldName: "Co-Insurance"
                      fieldName: "dental"
                    }}
                  />
                </div>
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
                  div={{ className: "col-lg-4" }}
                  textBox={{
                    decimal: { allowNegative: false },
                    value: this.state.unbalanced_amount,
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
