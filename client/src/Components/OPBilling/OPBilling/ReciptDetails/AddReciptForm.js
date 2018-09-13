import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
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
              <div className="container-fluid">
                <div className="row secondary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_number"
                      }}
                    />
                    <h6>
                      {this.state.receipt_number
                        ? this.state.receipt_number
                        : "Not Generated"}
                    </h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        fieldName: "receipt_date"
                      }}
                    />
                    <h6>
                      {this.state.receipt_date
                        ? moment(this.state.receipt_date).format("DD-MM-YYYY")
                        : "DD/MM/YYYY"}
                    </h6>
                  </div>
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
                <hr />

                {/* Payment Type */}
                {/* Cash */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cash"
                        checked={this.state.Cashchecked}
                        // onChange={checkcashhandaler.bind(this, this)}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
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
                {/* Card */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Card"
                        checked={this.state.Cardchecked}
                        // onChange={checkcardhandaler.bind(this, this)}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Card</span>
                    </label>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "amount",
                      isImp: true
                    }}
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
                  <AlagehFormGroup
                    div={{ className: "col-lg-5" }}
                    label={{
                      fieldName: "card_check_number"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_number",
                      value: this.state.card_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: this.state.enableCard
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{
                      fieldName: "expiry_date"
                    }}
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
                </div>
                {/* Check */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-lg-2"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cheque"
                        checked={this.state.Checkchecked}
                        // onChange={checkcheckhandaler.bind(this, this)}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Cheque</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      fieldName: "amount",
                      isImp: true
                    }}
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

                  <AlagehFormGroup
                    div={{ className: "col-lg-5" }}
                    label={{
                      fieldName: "card_check_number"
                    }}
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
                    label={{
                      fieldName: "expiry_date"
                    }}
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
                </div>
                <div className="row secondary-box-container">
                  <div className="col-lg-2" />
                  <div className="col-lg-5">
                    <AlgaehLabel
                      label={{
                        fieldName: "unbalanced_amount"
                      }}
                    />
                    <h6>
                      {this.state.unbalanced_amount
                        ? "₹" + this.state.unbalanced_amount
                        : "₹0.00"}
                    </h6>
                  </div>
                </div>
                {/* below old one */}
                {/*
                
                  <div className="col-lg-4">
                    <AlgaehLabel
                      label={{
                        fieldName: "total_amount"
                      }}
                    />
                    <h6>
                      {this.state.total_amount
                        ? "₹" + this.state.total_amount
                        : "₹0.00"}
                    </h6>
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
                */}
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
