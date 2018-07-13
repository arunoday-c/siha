import React, { Component } from "react";
import "./PrimaryInsuranceDetails.css";
import "./../../../../styles/site.css";
import { AlagehFormGroup, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
export default class AddInsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.BillingIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  render() {
    return (
      <div className="htpl-primary-display-insurance-form">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 primary-details">
              <div className="row primary-box-container">
                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "Insurance Company"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "Plan Description"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />
              </div>
              <div className="row primary-box-container">
                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "Policy No."
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "Card No."
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />
              </div>

              <div className="row primary-box-container">
                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "Start Date."
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-6" }}
                  label={{
                    forceLabel: "End Date"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "full_name",
                    value: this.state.full_name,
                    events: {
                      onChange: null
                    },
                    disabled: true
                  }}
                />
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
                  div={{ className: "col-lg-4", id: "widthDate" }}
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
