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
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler
} from "./AddReciptFormHandaler";
import {
  AlgaehDateHandler,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../../Wrapper/algaehWrapper";

import MyContext from "../../../../../utils/MyContext";
import "./AddReciptForm.css";
import "./../../../../../styles/site.css";
import { AlgaehActions } from "../../../../../actions/algaehActions";
import { getAmountFormart } from "../../../../../utils/GlobalFunctions";

class AddReciptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorInCash: false,
      errorInCard: false,
      errorInCheck: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.POSIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POSIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-pos-recipt-form">
              <div className="container-fluid">
                <div className="row secondary-box-container">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Receipt Number"
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
                        forceLabel: "Receipt Date"
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
                      forceLabel: "Shift",
                      isImp: true
                    }}
                    userPrefernce={true}
                    selector={{
                      name: "shift_id",
                      className: "select-fld",
                      value: this.state.shift_id,
                      dataSource: {
                        textField: "shift_description",
                        valueField: "shift_id",
                        data: this.state.shift_assinged
                      },
                      others: {
                        disabled:
                          this.state.postEnable === true
                            ? true
                            : this.state.posCancelled === true
                            ? true
                            : false
                      },
                      onChange: texthandle.bind(this, this, context),
                      onClear: () => {
                        this.setState({
                          shift_id: null
                        });
                      }
                    }}
                  />
                </div>
                <hr style={{ margin: 0 }} />

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
                        onChange={checkcashhandaler.bind(this, this, context)}
                        disabled={this.state.postEnable}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Amount",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      disabled: !this.state.Cashchecked,
                      className: "txt-fld",
                      name: "cash_amount",
                      error: this.state.errorInCash,
                      value: this.state.cash_amount,
                      events: {
                        onChange: cashtexthandle.bind(this, this, context)
                      },
                      others: {
                        // disabled: !this.state.Cashchecked,
                        disabled:
                          this.state.postEnable === true
                            ? true
                            : !this.state.Cashchecked,
                        placeholder: "0.00"
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
                        onChange={checkcardhandaler.bind(this, this, context)}
                        disabled={this.state.postEnable}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Card</span>
                    </label>
                  </div>

                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Amount",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      disabled: !this.state.Cardchecked,
                      className: "txt-fld",
                      name: "card_amount",
                      error: this.state.errorInCard,
                      value: this.state.card_amount,
                      events: {
                        onChange: cardtexthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: !this.state.Cardchecked,
                        placeholder: "0.00"
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-5" }}
                    label={{
                      forceLabel: "Card Number"
                    }}
                    textBox={{
                      disabled: !this.state.Cardchecked,
                      className: "txt-fld",
                      name: "card_check_number",
                      value: this.state.card_check_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: !this.state.Cardchecked
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Expiry Date"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "card_date"
                    }}
                    disabled={!this.state.Cardchecked}
                    minDate={new Date()}
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
                        onChange={checkcheckhandaler.bind(this, this, context)}
                        disabled={this.state.postEnable}
                      />
                      <span style={{ fontSize: "0.8rem" }}>Pay by Cheque</span>
                    </label>
                  </div>
                  <AlagehFormGroup
                    div={{ className: "col-lg-2" }}
                    label={{
                      forceLabel: "Amount",
                      isImp: true
                    }}
                    textBox={{
                      disabled: !this.state.Checkchecked,
                      decimal: { allowNegative: false },
                      className: "txt-fld",
                      name: "cheque_amount",
                      error: this.state.errorInCheck,
                      value: this.state.cheque_amount,
                      events: {
                        onChange: chequetexthandle.bind(this, this, context)
                      },
                      others: {
                        "data-receipt": "true",
                        disabled: !this.state.Checkchecked,
                        placeholder: "0.00"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-5" }}
                    label={{
                      forceLabel: "Check Number"
                    }}
                    textBox={{
                      disabled: !this.state.Checkchecked,
                      className: "txt-fld",
                      name: "cheque_number",
                      value: this.state.cheque_number,
                      events: {
                        onChange: texthandle.bind(this, this, context)
                      },
                      others: {
                        disabled: !this.state.Checkchecked
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Expiry Date"
                    }}
                    disabled={!this.state.Checkchecked}
                    textBox={{
                      className: "txt-fld",
                      name: "cheque_date"
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this, context)
                    }}
                    value={this.state.cheque_date}
                  />
                </div>
                <hr style={{ margin: 0 }} />
                <div className="row secondary-box-container">
                  <div className="col-lg-2" />
                  <div className="col-lg-5">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Unbalanced Amount"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.unbalanced_amount)}</h6>
                  </div>
                </div>
              </div>
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
    posheader: state.posheader
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      reciptCalculations: AlgaehActions
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
