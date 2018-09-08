import React, { Component } from "react";
import DisplayOPBilling from "../../../BillDetails/BillDetails";
import "./AddBillingForm.css";
import "./../../../../styles/site.css";
import PlayCircleFilled from "@material-ui/icons/PlayCircleFilled";
import IconButton from "@material-ui/core/IconButton";

import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel,
  Tooltip
} from "../../../Wrapper/algaehWrapper";
import moment from "moment";
import {
  texthandle,
  datehandle,
  discounthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  adjustadvance,
  ProcessInsurance
} from "./AddBillingDetails";
import MyContext from "../../../../utils/MyContext.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import variableJson from "../../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Paper from "@material-ui/core/Paper";

class AddBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      bill_number: ""
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
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-add-billing-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-6 primary-details">
                    {/* <div className="container-fluid"> */}
                    <Paper className="Paper">
                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "bill"
                            }}
                          />
                          <h6>
                            {this.state.bill_number
                              ? this.state.bill_number
                              : "Not Generated"}
                          </h6>
                        </div>

                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              fieldName: "bill_date"
                            }}
                          />
                          <h6>
                            {this.state.bill_date
                              ? moment(this.state.bill_date).format(
                                  "DD-MM-YYYY"
                                )
                              : "DD/MM/YYYY"}
                          </h6>
                        </div>
                      </div>

                      <div className="row primary-box-container">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "gross_total"
                            }}
                          />
                          <h5>
                            {this.state.gross_total
                              ? "₹" + this.state.gross_total
                              : "₹0.00"}
                          </h5>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "patient_payable"
                            }}
                          />
                          <h5>
                            {this.state.patient_payable
                              ? "₹" + this.state.patient_payable
                              : "₹0.00"}
                          </h5>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance"
                            }}
                          />
                          <h5>
                            {this.state.advance_amount
                              ? "₹" + this.state.advance_amount
                              : "₹0.00"}
                          </h5>
                        </div>
                      </div>
                      <hr />
                      <div className="row primary-box-container">
                        <div className="col-lg-3">
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={ProcessInsurance.bind(this, this, context)}
                          >
                            Process Insurance
                          </button>
                        </div>
                        <div className="col-lg-3">
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={this.ShowBillDetails.bind(this)}
                          >
                            Bill Details
                          </button>

                          <DisplayOPBilling
                            HeaderCaption={
                              <AlgaehLabel
                                label={{
                                  fieldName: "bill_details",
                                  align: "ltr"
                                }}
                              />
                            }
                            BillingIOputs={{
                              selectedLang: this.state.selectedLang,
                              billdetails: this.state.billdetails
                            }}
                            show={this.state.isOpen}
                            onClose={this.ShowBillDetails.bind(this)}
                          />
                        </div>
                      </div>
                      <hr />
                      <div className="row primary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "advance_adjust"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_adjust,
                            className: "txt-fld",
                            name: "advance_adjust",
                            events: {
                              onChange: adjustadvance.bind(this, this, context)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "sheet_discount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false, suffix: " %" },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",
                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            fieldName: "sheet_discount_amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />
                      </div>
                      <hr />
                      <div className="row last-box-container">
                        {/* <div className="col-lg-3 last-box-label">
                          <AlgaehLabel
                            label={{
                              fieldName: "bill_amount"
                            }}
                          />
                        </div> */}

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "net_amount"
                            }}
                          />
                          <h5>
                            {this.state.net_amount
                              ? "₹" + this.state.net_amount
                              : "₹0.00"}
                          </h5>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "receiveable_amount"
                            }}
                          />
                          <h5>
                            {this.state.receiveable_amount
                              ? "₹" + this.state.receiveable_amount
                              : "₹0.00"}
                          </h5>
                        </div>
                        {/* <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "net_amount"
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
                        /> */}
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "credit_amount"
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

                        {/* <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "receiveable_amount"
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
                        /> */}
                      </div>
                    </Paper>
                    {/* </div> */}
                  </div>
                  <div className="col-lg-6 secondary-details">
                    {/* <div className="container-fluid"> */}
                    <Paper className="Paper">
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
                              ? moment(this.state.receipt_date).format(
                                  "DD-MM-YYYY"
                                )
                              : "DD/MM/YYYY"}
                          </h6>
                        </div>
                      </div>

                      <div className="row secondary-box-container">
                        {/* <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "receipt_number"
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
                        /> */}
                        {/* <AlgaehDateHandler
                          div={{ className: "col-lg-3" }}
                          label={{ fieldName: "receipt_date" }}
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
                        /> */}

                        <AlagehAutoComplete
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "counter_id"
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
                            fieldName: "shift_id"
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

                      <div className="row secondary-box-container">
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

                      <div className="row secondary-box-container">
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
                          minDate={new Date()}
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
                            }
                          }}
                        />
                      </div>

                      <div className="row secondary-box-container">
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
                          minDate={new Date()}
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

                      <div className="row secondary-box-container">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "unbalanced_amount"
                            }}
                          />
                          <h5>
                            {this.state.unbalanced_amount
                              ? "₹" + this.state.unbalanced_amount
                              : "₹0.00"}
                          </h5>
                        </div>

                        {/* <div className="col-lg-3">
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
                        /> */}
                        {/* <div className="col-lg-6" /> */}

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "total_amount"
                            }}
                          />
                          <h5>
                            {this.state.total_amount
                              ? "₹" + this.state.total_amount
                              : "₹0.00"}
                          </h5>
                        </div>
                        {/* <div className="col-lg-3">
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
                        /> */}
                      </div>
                    </Paper>
                    {/* </div> */}
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
    genbill: state.genbill
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      generateBill: AlgaehActions,
      billingCalculations: AlgaehActions
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
