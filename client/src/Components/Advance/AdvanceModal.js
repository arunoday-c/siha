import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";
import "./AdvanceModal.scss";
import "./../../styles/site.scss";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../Wrapper/algaehWrapper";

import { getLabelFromLanguage } from "../../utils/GlobalFunctions";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  Validations,
  // countertexthandle,
  getCashiersAndShiftMAP
} from "./AdvanceModalHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import { GetAmountFormart } from "../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../actions/algaehActions";
import MyContext from "../../utils/MyContext";
import { MainContext } from "algaeh-react-components/context";

class AddAdvanceModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = MainContext;

  UNSAFE_componentWillMount() {
    let IOputs = AdvRefunIOputs.inputParam();

    const userToken = this.context.userToken;

    IOputs.Cashchecked = userToken.default_pay_type === "CH" ? true : false
    IOputs.Cardchecked = userToken.default_pay_type === "CD" ? true : false
    IOputs.default_pay_type = userToken.default_pay_type

    this.setState(IOputs);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (newProps.PackageAdvance === undefined) {

      let Cashchecked = false
      let Cardchecked = false
      let cash_amount = 0
      if (newProps.inputsparameters.transaction_type === "RF") {
        Cashchecked = true;
        Cardchecked = false;
        cash_amount = newProps.inputsparameters.advance_amount;
      } else {
        Cashchecked = this.state.default_pay_type === "CH" ? true : false
        Cardchecked = this.state.default_pay_type === "CD" ? true : false
      }
      let lang_sets = "en_comp";
      if (Window.global.selectedLang === "ar") {
        lang_sets = "ar_comp";
      }
      this.setState({
        selectedLang: Window.global.selectedLang,
        lang_sets: lang_sets,
        Cashchecked: Cashchecked,
        Cardchecked: Cardchecked,
        cash_amount: cash_amount,
        total_amount: cash_amount
      });
    }
    getCashiersAndShiftMAP(this, this);
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
    // if (this.props.counters === undefined || this.props.counters.length === 0) {
    //   this.props.getCounters({
    //     uri: "/shiftAndCounter/getCounterMaster",
    //     module: "masterSettings",
    //     method: "GET",
    //     redux: {
    //       type: "CTRY_GET_DATA",
    //       mappingName: "counters"
    //     }
    //   });
    // }
    getCashiersAndShiftMAP(this, this);

    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "Counter"
      },
      method: "GET",
      onSuccess: response => {
        this.setState({
          counter_id: response.data.records.selectedValue
        });
      }
    });
  }

  onClose = e => {
    let IOputs = AdvRefunIOputs.inputParam();
    this.setState(IOputs, () => {
      this.props.onClose && this.props.onClose(e);
    });
  };

  GenerateReciept(callback) {
    if (this.state.total_amount > 0) {
      let obj = [];

      if (this.state.cash_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: null,
          expiry_date: null,
          pay_type: this.state.pay_cash,
          amount: this.state.cash_amount,
          updated_date: null,
          card_type: null
        });
      }
      if (this.state.card_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.card_number,
          expiry_date: this.state.card_date,
          pay_type: this.state.pay_card,
          amount: this.state.card_amount,
          updated_date: null,
          card_type: null
        });
      }
      if (this.state.cheque_amount > 0) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.cheque_number,
          expiry_date: this.state.cheque_date,
          pay_type: this.state.pay_cheque,
          amount: this.state.cheque_amount,
          updated_date: null,
          card_type: null
        });
      }
      let package_id = null;
      if (this.props.PackageAdvance === true) {
        package_id = this.props.inputsparameters.package_id;
      }

      this.setState(
        {
          receiptdetails: obj,
          hims_f_patient_id: this.props.inputsparameters.hims_f_patient_id,
          transaction_type: this.props.inputsparameters.transaction_type,
          pay_type: this.props.inputsparameters.pay_type,
          advance_amount: this.state.total_amount,
          package_id: package_id
        },
        () => {
          callback(this);
        }
      );
    }
  }

  SaveAdvance(context, e) {
    const err = Validations(this, this);

    let advance_amt =
      parseFloat(this.props.inputsparameters.advance_amount) +
      parseFloat(this.state.total_amount);
    if (advance_amt < parseFloat(this.props.inputsparameters.collect_advance)) {
      swalMessage({
        title:
          "Collecting Amount Cannot be less than mini. package advance amount",
        type: "warning"
      });
      return;
    }
    if (!err) {
      this.GenerateReciept($this => {
        AlgaehLoader({ show: true });

        if ($this.props.PackageAdvance === true) {
          algaehApiCall({
            uri: "/billing/patientPackageAdvanceRefund",
            module: "billing",
            method: "POST",
            data: $this.state,
            onSuccess: response => {
              AlgaehLoader({ show: false });
              if (response.data.success) {
                let data = response.data.records;
                // let IOputs = AdvRefunIOputs.inputParam();
                // IOputs.receipt_number = data.receipt_number;
                // $this.setState(IOputs, () => {
                //   this.props.onClose && this.props.onClose(e);
                // });
                $this.setState({
                  receipt_number: data.receipt_number
                });

                swalMessage({
                  title: "Advance Collected Successfully.",
                  type: "success"
                });

                context.updateState({
                  advance_amount: data.total_advance_amount
                  // AdvanceOpen: false,
                  // RefundOpen: false
                });
              }
            },
            onFailure: error => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        } else {
          $this.state.ScreenCode = getCookie("ScreenCode");
          algaehApiCall({
            uri: "/billing/patientAdvanceRefund",
            module: "billing",
            method: "POST",
            data: $this.state,
            onSuccess: response => {
              AlgaehLoader({ show: false });
              if (response.data.success) {
                let data = response.data.records;
                $this.setState({
                  receipt_number: data.receipt_number
                });

                // let IOputs = AdvRefunIOputs.inputParam();
                // IOputs.receipt_number = data.receipt_number;
                // $this.setState(IOputs, () => {
                //   this.props.onClose && this.props.onClose(e);
                // });
                context.updateState({
                  advance_amount: data.total_advance_amount
                  // AdvanceOpen: false,
                  // RefundOpen: false
                });

                if (this.props.Advance === true) {
                  swalMessage({
                    title: "Advance Collected Successfully.",
                    type: "success"
                  });
                } else {
                  swalMessage({
                    title: "Refunded Successfully.",
                    type: "success"
                  });
                }
              } else {
                swalMessage({
                  title: response.data.records.message,
                  type: "error"
                });
              }
            },
            onFailure: error => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        }
      });
    }
  }

  render() {
    let Advance =
      this.props.Advance === true ? true : this.props.PackageAdvance;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div>
              <AlgaehModalPopUp
                events={{
                  onClose: this.onClose.bind(this)
                }}
                title={this.props.HeaderCaption}
                openPopup={this.props.show}
                class={this.state.lang_sets + " advanceRefundModal"}
              >
                <div className="col-12 popupInner margin-top-15">
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "patient_code"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.patient_code
                          ? this.props.inputsparameters.patient_code
                          : "Patient Code"}
                      </h6>
                    </div>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "full_name"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.full_name
                          ? this.props.inputsparameters.full_name
                          : "Patient Name"}
                      </h6>
                    </div>
                  </div>
                  <hr style={{ margin: "0rem" }} />
                  <div className="row secondary-box-container">
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
                            this.state.selectedLang === "en"
                              ? "shift_description"
                              : "arabic_name",
                          valueField: "hims_d_shift_id",
                          data: this.props.shifts
                        },
                        onChange: texthandle.bind(this, this, context)
                      }}
                    />

                    {this.props.PackageAdvance === true ? (
                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Mini. Package Advance To Take"
                          }}
                        />
                        <h6>
                          {this.props.inputsparameters.collect_advance
                            ? GetAmountFormart(
                              this.props.inputsparameters.collect_advance
                            )
                            : GetAmountFormart("0")}
                        </h6>
                      </div>
                    ) : null}

                    {/*<AlagehAutoComplete
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
                            this.state.selectedLang === "en"
                              ? "counter_description"
                              : "arabic_name",
                          valueField: "hims_d_counter_id",
                          data: this.props.counters
                        },
                        onChange: countertexthandle.bind(this, this)
                      }}
                    />*/}
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
                          onChange={checkcashhandaler.bind(this, this)}
                          disabled={this.props.inputsparameters.transaction_type === "RF" ? true : false}
                        />

                        <span style={{ fontSize: "0.8rem" }}>
                          {getLabelFromLanguage({ fieldName: "payby_cash" })}
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
                          onChange: cashtexthandle.bind(this, this)
                        },
                        others: {
                          disabled: !this.state.Cashchecked,
                          placeholder: "0.00"
                        }
                      }}
                    />
                  </div>
                  {Advance === true ? (
                    <div className="">
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
                              display={Advance}
                            />
                            <span style={{ fontSize: "0.8rem" }}>
                              {getLabelFromLanguage({
                                fieldName: "payby_card"
                              })}
                            </span>
                          </label>
                        </div>

                        {this.state.Cardchecked === true ? (
                          <AlagehAutoComplete
                            div={{ className: "col-lg-2 mandatory" }}
                            label={{
                              fieldName: "select_card",
                              isImp: this.state.Cardchecked
                            }}
                            selector={{
                              name: "bank_card_id",
                              className: "select-fld",
                              value: this.state.bank_card_id,
                              dataSource: {
                                textField: "card_name",
                                valueField: "hims_d_bank_card_id",
                                data: this.props.bankscards
                              },
                              onChange: texthandle.bind(this, this, context),
                              onClear: () => {
                                context.updateState({ bank_card_id: null });
                              }
                            }}
                          />
                        ) : null}

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
                              onChange: cardtexthandle.bind(this, this)
                            },
                            others: {
                              disabled: !this.state.Cardchecked,
                              placeholder: "0.00"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            fieldName: "card_check_number"
                          }}
                          textBox={{
                            disabled: !this.state.Cardchecked,
                            className: "txt-fld",
                            name: "card_number",
                            value: this.state.card_number,
                            events: {
                              onChange: texthandle.bind(this, this)
                            },
                            others: {
                              disabled: !this.state.Cardchecked,
                              placeholder: "0000-0000-0000-0000"
                            }
                          }}
                        />

                        <AlgaehDateHandler
                          div={{ className: "col-lg-2" }}
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
                            onChange: datehandle.bind(this, this)
                          }}
                          value={this.state.card_date}
                        />
                      </div>

                      {/* Check */}
                      {/* <div className="row secondary-box-container">
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
                              {getLabelFromLanguage({
                                fieldName: "payby_check"
                              })}
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
                              onChange: chequetexthandle.bind(this, this)
                            },
                            others: {
                              disabled: !this.state.Checkchecked,
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
                              onChange: texthandle.bind(this, this)
                            },
                            others: {
                              disabled: !this.state.Checkchecked,
                              placeholder: "'000000'"
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
                            onChange: datehandle.bind(this, this)
                          }}
                          value={this.state.cheque_date}
                        />
                      </div> */}
                    </div>
                  ) : null}
                  <hr />
                  <div className="row secondary-box-container">
                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "advance_amount"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.advance_amount
                          ? GetAmountFormart(
                            this.props.inputsparameters.advance_amount
                          )
                          : GetAmountFormart("0")}
                      </h6>
                    </div>

                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "total_amount"
                        }}
                      />
                      <h6>{GetAmountFormart(this.state.total_amount)}</h6>
                    </div>
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
                  </div>
                </div>
                <div className=" popupFooter">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.SaveAdvance.bind(this, context)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={e => {
                            this.onClose(e);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </AlgaehModalPopUp>
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
    bankscards: state.bankscards
    // counters: state.counters
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShifts: AlgaehActions
      // getCounters: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddAdvanceModal)
);
