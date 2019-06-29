import React, { Component } from "react";
import DisplayOPBilling from "../../BillDetails/BillDetails";
import "./AddBillingForm.css";
import "./../../../styles/site.css";
import {
  AlgaehDateHandler,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehLabel
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import {
  texthandle,
  datehandle,
  discounthandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  adjustadvance,
  // ProcessInsurance,
  checkcashhandaler,
  checkcardhandler,
  checkcheckhandaler,
  credittexthandle,
  advanceAdjustCal,
  discountCal,
  cashtexthCal,
  cardtexthCal,
  chequetexthCal
} from "./AddBillingDetails";

import MyContext from "../../../utils/MyContext.js";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

class AddBillingForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      bill_number: "",

      errorInCash: false,
      errorInCard: false,
      errorInCheck: false
    };
  }

  componentWillMount() {
    let InputOutput = this.props.PatRegIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (this.props.shifts === undefined || this.props.shifts.length === 0) {
      this.props.getShifts({
        uri: "/shiftAndCounter/getShiftMaster",
        module: "masterSettings",
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
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "CTRY_GET_DATA",
          mappingName: "counters"
        }
      });
    }
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
            <div className="hptl-phase1-fd-billing-form">
              <div className="row">
                <div className="algaeh-md-4 algaeh-lg-4 algaeh-xl-12  primary-details">
                  {/* <div className="container-fluid"> */}
                  <div className="Paper">
                    <div className="row primary-box-container">
                      {/* <div className="col-lg-6">
                        <button
                          className="btn btn-default btn-sm"
                          type="button"
                          onClick={ProcessInsurance.bind(this, this, context)}
                          disabled={this.state.ProcessInsure}
                        >
                          Process Insurance
                        </button>
                      </div> */}
                      <div className="col-lg-6">
                        <button
                          className="btn btn-default btn-sm"
                          type="button"
                          onClick={this.ShowBillDetails.bind(this)}
                          disabled={this.state.billdetail}
                        >
                          <AlgaehLabel
                            label={{
                              fieldName: "bill_details"
                            }}
                          />
                          {/* Bill Details */}
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
                            frontDesk: true,
                            selectedLang: this.state.selectedLang,
                            billdetails: this.state.billdetails
                          }}
                          show={this.state.isOpen}
                          onClose={this.ShowBillDetails.bind(this)}
                        />
                      </div>
                    </div>
                    <hr style={{ margin: "0.3rem 0rem" }} />
                    <div className="row primary-box-container">
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "gross_total"
                          }}
                        />

                        <h6>{getAmountFormart(this.state.gross_total)}</h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "patient_payable"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.patient_payable)}</h6>
                      </div>
                    </div>
                    <hr style={{ margin: "0.3rem 0rem" }} />
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
                            : this.state.selectedLang === "en"
                            ? "Not Generated"
                            : "غير مولدة"}
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
                            ? moment(this.state.bill_date).format("DD-MM-YYYY")
                            : "DD/MM/YYYY"}
                        </h6>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
                <div className="algaeh-md-8 algaeh-lg-8 algaeh-xl-12  secondary-details">
                  <div className="Paper">
                    <div className="row">
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
                            placeholder: "0.00",
                            // onBlur: advanceAdjustCal.bind(this, this, context),
                            onFocus: e => {
                              e.target.oldvalue = e.target.value;
                            }
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
                            placeholder: "0.00",
                            // onBlur: discountCal.bind(this, this, context),
                            onFocus: e => {
                              e.target.oldvalue = e.target.value;
                            }
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
                            allowNegative: false
                          },
                          value: this.state.sheet_discount_amount,
                          className: "txt-fld",
                          name: "sheet_discount_amount",

                          events: {
                            onChange: discounthandle.bind(this, this, context)
                          },
                          others: {
                            placeholder: "0.00",
                            // onBlur: discountCal.bind(this, this, context),
                            onFocus: e => {
                              e.target.oldvalue = e.target.value;
                            }
                          }
                        }}
                      />
                    </div>

                    <hr />
                    <div
                      className="row"
                      style={{
                        marginBottom: 10
                      }}
                    >
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "advance"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.advance_amount)}</h6>
                      </div>
                      {/* <div className="col-lg-3 last-box-label">
                      <AlgaehLabel
                        label={{
                          fieldName: "bill_amount"
                        }}
                      />
                    </div> */}

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            fieldName: "net_amount"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.net_amount)}</h6>
                      </div>

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          fieldName: "credit_amount"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.credit_amount,
                          className: "txt-fld",
                          name: "credit_amount",
                          events: {
                            onChange: credittexthandle.bind(this, this, context)
                          },
                          others: {
                            placeholder: "0.00",
                            // onBlur: credittextCal.bind(this, this, context),
                            onFocus: e => {
                              e.target.oldvalue = e.target.value;
                            }
                          },
                          security: {
                            component_code: "FD_PR_BIL",
                            module_code: "FTDSK",
                            screen_code: "FD0002",
                            screen_element_code: "CA"
                          }
                        }}
                      />
                      <div
                        className="col"
                        style={{
                          background: "rgb(68, 184, 189)",
                          color: "rgb(255, 255, 255)"
                        }}
                      >
                        <AlgaehLabel
                          label={{
                            fieldName: "receiveable_amount"
                          }}
                        />
                        <h4>
                          {getAmountFormart(this.state.receiveable_amount)}
                        </h4>
                      </div>
                      <div className="col highlightGrey">
                        <AlgaehLabel
                          label={{
                            fieldName: "balance_due"
                          }}
                        />
                        <h6>{getAmountFormart(this.state.balance_credit)}</h6>
                      </div>
                    </div>
                    {/* <div className="container-fluid"> */}
                    <div
                      className="Paper"
                      style={{
                        background: " #e9feff",
                        border: " 1px solid #44b8bd",
                        borderRadius: 5
                      }}
                    >
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
                              : this.state.selectedLang === "en"
                              ? "Not Generated"
                              : "غير مولدة"}
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
                        {/* <AlagehAutoComplete
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
                            onChange: countertexthandle.bind(
                              this,
                              this,
                              context
                            )
                          }}
                        /> */}

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
                            onChange: texthandle.bind(this, this, context)
                          }}
                        />
                      </div>
                      <hr style={{ margin: "0.3rem 0rem" }} />

                      {/* Payment Type */}
                      {/* Cash */}
                      <div className="row secondary-box-container">
                        <div
                          className="customCheckbox col-lg-2"
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
                              onChange={checkcashhandaler.bind(
                                this,
                                this,
                                context
                              )}
                            />

                            <span style={{ fontSize: "0.8rem" }}>
                              Pay by Cash
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
                              placeholder: "0.00",
                              onBlur: cashtexthCal.bind(this, this, context),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
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
                          <label
                            className="checkbox"
                            style={{ color: "#212529" }}
                          >
                            <input
                              type="checkbox"
                              name="Pay by Card"
                              checked={this.state.Cardchecked}
                              onChange={checkcardhandler.bind(
                                this,
                                this,
                                context
                              )}
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
                            error: this.state.errorInCard,
                            value: this.state.card_amount,
                            events: {
                              onChange: cardtexthandle.bind(this, this, context)
                            },
                            others: {
                              placeholder: "0.00",
                              onBlur: cardtexthCal.bind(this, this, context),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col no-padding-left-right" }}
                          label={{
                            fieldName: "card_check_number"
                          }}
                          textBox={{
                            card: { creditCard: true },
                            disabled: !this.state.Cardchecked,
                            className: "txt-fld",
                            name: "card_number",
                            value: this.state.card_number,
                            events: {
                              onChange: texthandle.bind(this, this, context)
                            },
                            others: {
                              disabled: !this.state.Cardchecked,
                              placeholder: "0000-0000-0000-0000"
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
                          className="customCheckbox col-lg-2"
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
                              onChange={checkcheckhandaler.bind(
                                this,
                                this,
                                context
                              )}
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
                            error: this.state.errorInCheck,
                            value: this.state.cheque_amount,
                            events: {
                              onChange: chequetexthandle.bind(
                                this,
                                this,
                                context
                              )
                            },
                            others: {
                              disabled: !this.state.Checkchecked,
                              placeholder: "0.00",
                              onBlur: chequetexthCal.bind(this, this, context),
                              onFocus: e => {
                                e.target.oldvalue = e.target.value;
                              }
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col no-padding-left-right" }}
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
                              disabled: !this.state.Checkchecked,
                              placeholder: "'000000'"
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
                      <hr style={{ margin: "0.3rem 0rem" }} />
                      <div className="row secondary-box-container">
                        <div className="col-lg-3" />
                        <div className="col-lg-5">
                          <AlgaehLabel
                            label={{
                              fieldName: "unbalanced_amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.unbalanced_amount)}
                          </h6>
                        </div>

                        {/* <div className="col-lg-3 totalAmt">
                      <AlgaehLabel
                        label={{
                          fieldName: "total_amount"
                        }}
                      />
                      <h5>{getAmountFormart(this.state.total_amount)}</h5>
                    </div> */}
                      </div>
                    </div>
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
  )(AddBillingForm)
);
