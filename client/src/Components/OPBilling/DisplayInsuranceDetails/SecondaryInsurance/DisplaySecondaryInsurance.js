import React, { Component } from "react";

import "./SecondaryInsuranceDetails.css";
import "./../../../../styles/site.css";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";

import moment from "moment";
import Options from "../../../../Options.json";

export default class DisplaySecondaryInsurance extends Component {
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
        <div className="htpl-phase1-primary-secinsurancedis-form">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 primary-details">
                <div className="row primary-box-container">
                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "insurance_company"
                      }}
                    />
                    <h6>
                      {this.state.secondary_insurance_provider_name
                        ? this.state.secondary_insurance_provider_name
                        : "Insurance Company"}
                    </h6>
                  </div>

                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "sub_insurance_company"
                      }}
                    />
                    <h6>
                      {this.state.secondary_sub_insurance_provider_name
                        ? this.state.secondary_sub_insurance_provider_name
                        : "Sub Insurance Company"}
                    </h6>
                  </div>
                </div>
                <div className="row primary-box-container">
                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "plan_desc"
                      }}
                    />
                    <h6>
                      {this.state.secondary_network_type
                        ? this.state.secondary_network_type
                        : "Plan"}
                    </h6>
                  </div>

                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "policy_no"
                      }}
                    />
                    <h6>
                      {this.state.secondary_policy_number
                        ? this.state.secondary_policy_number
                        : "Policy No."}
                    </h6>
                  </div>
                </div>

                <div className="row primary-box-container">
                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "card_no"
                      }}
                    />
                    <h6>
                      {this.state.card_number
                        ? this.state.card_number
                        : "Card No."}
                    </h6>
                  </div>

                  <div className="col-lg-6">
                    <AlgaehLabel
                      label={{
                        fieldName: "ins_expiry_date"
                      }}
                    />
                    <h6>
                      {this.state.secondary_effective_end_date
                        ? moment(
                            this.state.secondary_effective_end_date
                          ).format(Options.dateFormat)
                        : "Expiry Date"}
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 primary-details">
                <div className="row primary-box-container">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        // fieldName: "Co-Insurance"
                        forceLabel: "Services"
                      }}
                    />
                  </div>
                  <div className="col-lg-4 centerAlign">
                    <AlgaehLabel
                      label={{
                        forceLabel: "%"
                      }}
                    />
                  </div>
                  <div className="col-lg-4 centerAlign">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Max-Limit"
                      }}
                    />
                  </div>
                </div>

                <div className="row primary-box-container">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        // fieldName: "Co-Insurance"
                        forceLabel: "Consultation"
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
                        // fieldName: "Co-Insurance"
                        forceLabel: "Laboratory"
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
                        // fieldName: "Co-Insurance"
                        forceLabel: "Radiology"
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

              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 secondary-details">
                <div className="row secondary-box-container">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        // fieldName: "Co-Insurance"
                        forceLabel: "Co-Insurance"
                      }}
                    />
                  </div>
                  <div className="col-lg-4 centerAlign">
                    <AlgaehLabel
                      label={{
                        forceLabel: "%"
                      }}
                    />
                  </div>
                  <div className="col-lg-4 centerAlign">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Max-Limit"
                      }}
                    />
                  </div>
                </div>

                <div className="row secondary-box-container">
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        // fieldName: "Co-Insurance"
                        forceLabel: "Medicine"
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
                        forceLabel: "Procedure"
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
                        forceLabel: "Dental"
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
      </React.Fragment>
    );
  }
}
