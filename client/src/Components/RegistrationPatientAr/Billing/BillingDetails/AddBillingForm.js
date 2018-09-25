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
  ProcessInsurance,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  credittexthandle
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
      bill_number: "",
      enableCash: false,
      enableCard: true,
      enableCheck: true,
      Cashchecked: true,
      Cardchecked: false,
      Checkchecked: false,
      errorInCash: false
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
                  <div className="col-lg-8 secondary-details">
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
                        <AlagehAutoComplete
                          div={{ className: "col-lg-3 mandatory" }}
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
                          div={{ className: "col-lg-3 mandatory" }}
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
                      <hr style={{ margin: "0rem" }} />

                      {/* Payment Type */}
                      {/* Cash */}
                      <div className="row secondary-box-container">
                        <div
                          className="customCheckbox col-lg-3"
                          style={{ border: "none", marginTop: "28px" }}
                        >
                          <label
                            className="checkbox"
                            style={{ color: "#212529" }}
                          >
                            <input
                              type="checkbox"
                              name="Pay by Cash"
                              checked={this.state.Cashchecked}
                              onChange={checkcashhandaler.bind(this, this)}
                            />

                            <span style={{ fontSize: "0.8rem" }}>
                              Pay by Cash
                            </span>
                          </label>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-2 mandatory" }}
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
                              placeholder: "0.00"
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
                          <label
                            className="checkbox"
                            style={{ color: "#212529" }}
                          >
                            <input
                              type="checkbox"
                              name="Pay by Card"
                              checked={this.state.Cardchecked}
                              onChange={checkcardhandaler.bind(this, this)}
                            />
                            <span style={{ fontSize: "0.8rem" }}>
                              Pay by Card
                            </span>
                          </label>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-2" }}
                          label={{
                            fieldName: "amount",
                            isImp: true
                          }}
                          textBox={{
                            disabled: !this.state.Cardchecked,
                            decimal: { allowNegative: false },
                            className: "txt-fld",
                            name: "card_amount",
                            value: this.state.card_amount,
                            events: {
                              onChange: cardtexthandle.bind(this, this, context)
                            },
                            others: {
                              placeholder: "0.00"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            fieldName: "card_check_number"
                          }}
                          textBox={{
                            disabled: !this.state.Cardchecked,
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
                          <label
                            className="checkbox"
                            style={{ color: "#212529" }}
                          >
                            <input
                              type="checkbox"
                              name="Pay by Cheque"
                              checked={this.state.Checkchecked}
                              onChange={checkcheckhandaler.bind(this, this)}
                            />
                            <span style={{ fontSize: "0.8rem" }}>
                              Pay by Cheque
                            </span>
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
                            value: this.state.cheque_amount,
                            events: {
                              onChange: chequetexthandle.bind(
                                this,
                                this,
                                context
                              )
                            },
                            others: {
                              placeholder: "0.00"
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
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
                          disabled={!this.state.Checkchecked}
                          minDate={new Date()}
                          events={{
                            onChange: datehandle.bind(this, this, context)
                          }}
                          value={this.state.cheque_date}
                        />
                      </div>
                      <hr style={{ margin: "0rem" }} />
                      <div className="row secondary-box-container">
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
                        <div className="col-lg-3" />
                        <div className="col-lg-6">
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

                        <div className="col-lg-3 totalAmt">
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
                  <div className="col-lg-4 primary-details">
                    {/* <div className="container-fluid"> */}
                    <Paper className="Paper">
                      <div className="row primary-box-container">
                        <div className="col-lg-6">
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

                        <div className="col-lg-6">
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
                          <h6>
                            {this.state.gross_total
                              ? "₹" + this.state.gross_total
                              : "₹0.00"}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "patient_payable"
                            }}
                          />
                          <h6>
                            {this.state.patient_payable
                              ? "₹" + this.state.patient_payable
                              : "₹0.00"}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "advance"
                            }}
                          />
                          <h6>
                            {this.state.advance_amount
                              ? "₹" + this.state.advance_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                      </div>
                      <hr style={{ margin: "0.6rem 0rem" }} />
                      <div className="row primary-box-container">
                        <div className="col-lg-6">
                          <button
                            className="btn btn-primary btn-sm"
                            type="button"
                            onClick={ProcessInsurance.bind(this, this, context)}
                          >
                            Process Insurance
                          </button>
                        </div>
                        <div className="col-lg-6">
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
                          div={{ className: "col-3" }}
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
                            },
                            others: {
                              placeholder: "0.00"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-6" }}
                          label={{
                            fieldName: "sheet_discount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",
                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            },
                            others: {
                              placeholder: "0.00"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-3" }}
                          label={{
                            fieldName: "sheet_discount_amount"
                          }}
                          textBox={{
                            decimal: {
                              allowNegative: false,
                              thousandSeparator: ",",
                              customInput: "0.00"
                            },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            },
                            others: {
                              placeholder: "0.00"
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
                          <h6>
                            {this.state.net_amount
                              ? "₹" + this.state.net_amount
                              : "₹0.00"}
                          </h6>
                        </div>

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
                              onChange: credittexthandle.bind(
                                this,
                                this,
                                context
                              )
                            },
                            others: {
                              placeholder: "0.00"
                            }
                          }}
                        />
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              fieldName: "receiveable_amount"
                            }}
                          />
                          <h6>
                            {this.state.receiveable_amount
                              ? "₹" + this.state.receiveable_amount
                              : "₹0.00"}
                          </h6>
                        </div>
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
