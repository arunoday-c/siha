import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle
} from "./AddReciptFormHandaler";
import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import MyContext from "../../../../utils/MyContext";
import "./AddReciptForm.css";
import "./../../../../styles/site.css";
import variableJson from "../../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../../actions/algaehActions";

class AddReciptForm extends Component {
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
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-recipt-form">
              <div className="container-fluid form-details">
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "receipt_number",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "receipt_number",
                      value: this.state.receipt_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ fieldName: "receipt_date", isImp: true }}
                    textBox={{
                      className: "txt-fld",
                      name: "receipt_date"
                    }}
                    disabled={true}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={this.state.receipt_date}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "counter_id",
                      isImp: true
                    }}
                    selector={{
                      name: "counter_id",
                      className: "select-fld",
                      value: this.state.counter_id,
                      dataSource: {
                        textField:
                          this.state.selectedLang == "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_COUNTER
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "shift_id",
                      isImp: true
                    }}
                    selector={{
                      name: "shift_id",
                      className: "select-fld",
                      value: this.state.shift_id,
                      dataSource: {
                        textField:
                          this.state.selectedLang == "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_SHIFT
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                </div>

                <div className="row primary-box-container">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "pay_type"
                    }}
                    selector={{
                      name: "pay_cash",
                      className: "select-fld",
                      value: this.state.pay_cash,
                      dataSource: {
                        textField:
                          this.state.selectedLang == "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_PAYTYPE
                      },
                      others: {
                        disabled: true
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "card_check_number"
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "expiry_date"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "amount",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "cash_amount",
                      value: this.state.cash_amount,
                      events: {
                        onChange: cashtexthandle.bind(this, this, context)
                      }
                    }}
                  />
                </div>

                <div className="row primary-box-container">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    selector={{
                      name: "pay_card",
                      className: "select-fld",
                      value: this.state.pay_card,
                      dataSource: {
                        textField:
                          this.state.selectedLang == "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_PAYTYPE
                      },
                      others: {
                        disabled: true
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_number",
                      value: this.state.card_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={this.state.card_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "card_amount",
                      value: this.state.card_amount,
                      events: {
                        onChange: cardtexthandle.bind(this, this, context)
                      },
                      others: {
                        receipt: true
                      }
                    }}
                  />
                </div>

                <div className="row primary-box-container">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    selector={{
                      name: "pay_type",
                      className: "select-fld",
                      value: this.state.pay_cheque,
                      dataSource: {
                        textField:
                          this.state.selectedLang == "en"
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_PAYTYPE
                      },
                      others: {
                        disabled: true
                      },
                      onChange: texthandle.bind(this, this, context)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      className: "txt-fld",
                      name: "cheque_number",
                      value: this.state.cheque_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      className: "txt-fld",
                      name: "cheque_date"
                    }}
                    maxDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={this.state.cheque_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "cheque_amount",
                      value: this.state.cheque_amount,
                      events: {
                        onChange: chequetexthandle.bind(this, this, context)
                      },
                      others: {
                        "data-receipt": "true"
                      }
                    }}
                  />
                </div>

                <div className="row primary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "unbalanced_amount"
                      }}
                    />
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.unbalanced_amount,
                      className: "txt-fld",
                      name: "unbalanced_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  {/* <div className="col-lg-6" /> */}

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "total_amount"
                      }}
                    />
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.total_amount,
                      className: "txt-fld",
                      name: "total_amount",

                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                </div>
              </div>
              <br />
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
    // return <div className="">Recipt Details</div>;
  }
}

function mapStateToProps(state) {
  return {
    genbill: state.genbill
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      billingCalculations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddReciptForm)
);
