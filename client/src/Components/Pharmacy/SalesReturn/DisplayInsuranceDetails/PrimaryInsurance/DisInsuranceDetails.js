import React, { Component } from "react";
import "./PrimaryInsuranceDetails.css";
import "./../../../../../styles/site.css";
import {
  AlagehFormGroup,
  AlgaehLabel
} from "../../../../Wrapper/algaehWrapper";
import moment from "moment";
import Options from "../../../../../Options.json";

export default class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.SALESRETURNIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    debugger;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SALESRETURNIOputs);
  }

  render() {
    return (
      <div className="htpl-primary-display-insurance-pos-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-4 primary-details">
              <div className="row primary-box-container">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Insurance Company"
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
                      forceLabel: "Sub Insurance Company"
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
                      forceLabel: "Plan Desc"
                    }}
                  />
                  <h6>
                    {this.state.network_type ? this.state.network_type : "---"}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Policy No."
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
                      forceLabel: "Card No."
                    }}
                  />
                  <h6>
                    {this.state.card_number ? this.state.card_number : "---"}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Expiry Date"
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
                  <h6>
                    <AlgaehLabel
                      label={{
                        forceLabel: "Services"
                      }}
                    />
                  </h6>
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Percentage"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Max Limit"
                    }}
                  />
                </div>
              </div>

              <div className="row primary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
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

            <div className="col-lg-4 secondary-details">
              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Co-Insurance"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Percentage"
                    }}
                  />
                </div>
                <div className="col-lg-4 centerAlign">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Max Limit"
                    }}
                  />
                </div>
              </div>

              <div className="row secondary-box-container">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
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
                      // forceLabel: "Co-Insurance"
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
    );
  }
}
