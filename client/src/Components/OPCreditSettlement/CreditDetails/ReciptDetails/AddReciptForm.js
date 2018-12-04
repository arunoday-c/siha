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
  checkcheckhandaler,
  calculateRecipt,
  countertexthandle
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

import { AlgaehActions } from "../../../../actions/algaehActions";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

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
    let InputOutput = this.props.SettlementIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SettlementIOputs);
  }

  componentDidMount() {
    if (this.props.shifts === undefined || this.props.shifts.length === 0) {
      this.props.getShifts({
        uri: "/shiftAndCounter/getShiftMaster",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "shifts"
        }
      });
    }

    if (this.props.counters === undefined || this.props.counters.length === 0) {
      this.props.getCounters({
        uri: "/shiftAndCounter/getCounterMaster",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "counters"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-creid-recipt-form">
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
                          this.state.selectedLang === "en"
                            ? "counter_description"
                            : "arabic_name",
                        valueField: "hims_d_counter_id",
                        data: this.props.counters
                      },
                      others: {
                        disabled: this.state.Billexists
                      },
                      onChange: countertexthandle.bind(this, this, context)
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
                          this.state.selectedLang === "en"
                            ? "shift_description"
                            : "arabic_name",
                        valueField: "hims_d_shift_id",
                        data: this.props.shifts
                      },
                      others: {
                        disabled: this.state.Billexists
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
                    className="customCheckbox col-lg-3"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cash"
                        checked={this.state.Cashchecked}
                        onChange={checkcashhandaler.bind(this, this, context)}
                        disabled={this.state.Billexists}
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
                      disabled: !this.state.Cashchecked,
                      className: "txt-fld",
                      name: "cash_amount",
                      error: this.state.errorInCash,
                      value: this.state.cash_amount,
                      events: {
                        onChange: cashtexthandle.bind(this, this, context)
                      },
                      others: {
                        disabled:
                          this.state.Billexists === true
                            ? true
                            : !this.state.Cashchecked,
                        placeholder: "0.00"
                        // onBlur: calculateRecipt.bind(this, this, context),
                        // onFocus: e => {
                        //   e.target.oldvalue = e.target.value;
                        // }
                      }
                    }}
                  />
                </div>
                {/* Card */}
                <div className="row secondary-box-container">
                  <div
                    className="customCheckbox col-lg-3"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Card"
                        checked={this.state.Cardchecked}
                        onChange={checkcardhandaler.bind(this, this, context)}
                        disabled={this.state.Billexists}
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
                        // onBlur: calculateRecipt.bind(this, this, context),
                        // onFocus: e => {
                        //   e.target.oldvalue = e.target.value;
                        // }
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "card_check_number"
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
                    div={{ className: "col" }}
                    label={{
                      fieldName: "expiry_date"
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
                    className="customCheckbox col-lg-3"
                    style={{ border: "none", marginTop: "28px" }}
                  >
                    <label className="checkbox" style={{ color: "#212529" }}>
                      <input
                        type="checkbox"
                        name="Pay by Cheque"
                        checked={this.state.Checkchecked}
                        onChange={checkcheckhandaler.bind(this, this, context)}
                        disabled={this.state.Billexists}
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
                        // onBlur: calculateRecipt.bind(this, this, context),
                        // onFocus: e => {
                        //   e.target.oldvalue = e.target.value;
                        // }
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      fieldName: "card_check_number"
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
                    div={{ className: "col" }}
                    label={{
                      fieldName: "expiry_date"
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
                <div className="row secondary-box-container">
                  <div className="col-lg-3" />
                  <div className="col-lg-5">
                    <AlgaehLabel
                      label={{
                        fieldName: "unbalanced_amount"
                      }}
                    />
                    <h6>{getAmountFormart(this.state.unbalanced_amount)}</h6>
                  </div>
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
    shifts: state.shifts,
    counters: state.counters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShifts: AlgaehActions,
      getCounters: AlgaehActions
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
