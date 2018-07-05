import React, { Component } from "react";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import "./AddBillingForm.css";
import "./../../../../styles/site.css";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../../Wrapper/algaehWrapper";
import {
  texthandle,
  datehandle,
  servicetexthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle
} from "./AddBillingDetails";
import MyContext from "../../../../utils/MyContext.js";
import { generateBill } from "../../../../actions/RegistrationPatient/Billingactions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import variableJson from "../../../../utils/GlobalVariables.json";

class AddBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.PatRegIOputs);
  }

  ShowBillDetails(e) {
    debugger;
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen
      },
      () => {
        debugger;
      }
    );
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-billing-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 primary-details">
                    <div className="container-fluid">
                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "bill"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          textBox={{
                            className: "txt-fld",
                            name: "bill_number",
                            value: this.state.bill_number,
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
                          textBox={{
                            className: "txt-fld",
                            name: "bill_date"
                          }}
                          disabled={true}
                          maxDate={new Date()}
                          minDate={new Date()}
                          events={{
                            onChange: null
                          }}
                          value={this.state.bill_date}
                        />

                        <div className="col-lg-3">
                          {/* <BillDetails
                            show={this.state.isOpen}
                            onClose={this.toggleModal}
                          /> */}

                          <button
                            className="htpl1-phase1-btn-primary"
                            onClick={this.ShowBillDetails.bind(this)}
                          >
                            Detail....
                          </button>

                          <DisplayOPBilling
                            BillingIOputs={this.state}
                            show={this.state.isOpen}
                            onClose={this.ShowBillDetails.bind(this)}
                          />
                        </div>
                      </div>

                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "gross_total"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.gross_total,
                            className: "txt-fld",
                            name: "gross_total",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>

                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "share"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.patient_payable,
                            className: "txt-fld",
                            name: "patient_payable",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>
                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance"
                            }}
                          />
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance,
                            className: "txt-fld",
                            name: "advance",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                        <div className="col-lg-1">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance_adjust"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-2", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_amount,
                            className: "txt-fld",
                            name: "advance_amount",
                            events: {
                              onChange: texthandle.bind(this, this, context)
                            }
                          }}
                        />
                      </div>
                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "sheet_discount"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false, suffix: " %" },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",
                            events: {
                              onChange: servicetexthandle.bind(
                                this,
                                this,
                                context
                              )
                            }
                          }}
                        />
                        <div className="col-lg-1">
                          <AlgaehLabel
                            label={{
                              fieldName: "sheet_discount_amount"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-2", id: "widthDate" }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            events: {
                              onChange: servicetexthandle.bind(
                                this,
                                this,
                                context
                              )
                            }
                          }}
                        />
                      </div>
                      <hr />
                      <div className="row last-box-container">
                        <div className="col-lg-3 last-box-label">
                          <AlgaehLabel
                            label={{
                              fieldName: "bill_amount"
                            }}
                          />
                        </div>
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          label={{
                            fieldName: "net_amount",
                            isImp: true
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.net_amount,
                            className: "txt-fld",
                            name: "net_amount",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          label={{
                            fieldName: "credit_amount",
                            isImp: true
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "credit_amount",

                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-3", id: "widthDate" }}
                          label={{
                            fieldName: "receiveable_amount",
                            isImp: true
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.receiveable_amount,
                            className: "txt-fld",
                            name: "receiveable_amount",

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
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 primary-details">
                    <div className="container-fluid">
                      <div className="row primary-box-container">
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
                              onChange: null
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
                          minDate={new Date()}
                          events={{
                            onChange: null
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
                              onChange: chequetexthandle.bind(
                                this,
                                this,
                                context
                              )
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
                          div={{ className: "col-lg-3", id: "widthDate" }}
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
                          div={{ className: "col-lg-3", id: "widthDate" }}
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
    genbill: state.genbill.genbill
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      generateBill: generateBill
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddBillingForm)
);
