import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./AdvanceModalAr.css";
import "./../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  Button,
  Modal
} from "../Wrapper/algaehWrapper";
import variableJson from "../../utils/GlobalVariables.json";
import Typography from "@material-ui/core/Typography";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  Validations
} from "./AdvanceModalArHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { getCookie } from "../../utils/algaehApiCall";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";
import { postAdvance } from "../../actions/RegistrationPatient/Billingactions";

class AddAdvanceModalAr extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    let IOputs = AdvRefunIOputs.inputParam();
    this.setState(IOputs);
  }

  componentWillReceiveProps() {
    this.setState({ selectedLang: Window.global.selectedLang });
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
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

      this.setState(
        {
          receiptdetails: obj,
          hims_f_patient_id: this.props.inputsparameters.hims_f_patient_id,
          transaction_type: this.props.inputsparameters.transaction_type,
          pay_type: this.props.inputsparameters.pay_type,
          advance_amount: this.state.total_amount
        },
        () => {
          callback(this);
        }
      );
    }
  }

  SaveAdvance(e) {
    const err = Validations(this, this);

    if (!err) {
      this.GenerateReciept($this => {
        $this.props.postAdvance($this.state, data => {
          $this.setState({
            receipt_number: data.recieptNo
          });
          successfulMessage({
            message: "Done Successfully",
            title: "Success",
            icon: "success"
          });
        });
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal open={this.props.show}>
            <div className="algaeh-modal">
              <div className="popupHeader">{this.props.HeaderCaption} </div>
              <div className="col-lg-12 popupInner">
                <div className="col-lg-12">
                  <div className="row">
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        fieldName: "patient_code"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "patient_code",
                        value: this.props.inputsparameters.patient_code,
                        events: {
                          onChange: null
                        },
                        disabled: true
                      }}
                    />
                    {/* Patient name */}
                    <AlagehFormGroup
                      div={{ className: "col-lg-6" }}
                      label={{
                        fieldName: "full_name"
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "full_name",
                        value: this.props.inputsparameters.full_name,
                        events: {
                          onChange: null
                        },
                        disabled: true
                      }}
                    />
                  </div>
                  <div className="row form-details">
                    <AlagehFormGroup
                      div={{ className: "col-lg-4" }}
                      label={{
                        fieldName: this.props.NumberLabel,
                        isImp: true
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "receipt_number",
                        value: this.state.receipt_number,
                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: true
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-4" }}
                      label={{ fieldName: this.props.DateLabel, isImp: true }}
                      textBox={{
                        className: "txt-fld",
                        name: "receipt_date"
                      }}
                      disabled={true}
                      maxDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.receipt_date}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-lg-4" }}
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
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.FORMAT_COUNTER
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                  </div>

                  <div className="row form-details">
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
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.FORMAT_PAYTYPE
                        },
                        others: {
                          disabled: true
                        },
                        onChange: texthandle.bind(this, this)
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
                          onChange: cashtexthandle.bind(this, this)
                        }
                      }}
                    />
                  </div>

                  <div className="row form-details">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      selector={{
                        name: "pay_card",
                        className: "select-fld",
                        value: this.state.pay_card,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.FORMAT_PAYTYPE
                        },
                        others: {
                          disabled: true
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        className: "txt-fld",
                        name: "card_number",
                        value: this.state.card_number,
                        events: {
                          onChange: texthandle.bind(this, this)
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
                        onChange: datehandle.bind(this, this)
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
                          onChange: cardtexthandle.bind(this, this)
                        }
                      }}
                    />
                  </div>

                  <div className="row form-details">
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      selector={{
                        name: "pay_type",
                        className: "select-fld",
                        value: this.state.pay_cheque,
                        dataSource: {
                          textField:
                            this.state.selectedLang === "en"
                              ? "name"
                              : "arabic_name",
                          valueField: "value",
                          data: variableJson.FORMAT_PAYTYPE
                        },
                        others: {
                          disabled: true
                        },
                        onChange: texthandle.bind(this, this)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      textBox={{
                        className: "txt-fld",
                        name: "cheque_number",
                        value: this.state.cheque_number,
                        events: {
                          onChange: texthandle.bind(this, this)
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
                        onChange: datehandle.bind(this, this)
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
                          onChange: chequetexthandle.bind(this, this)
                        },
                        others: {
                          "data-receipt": "true"
                        }
                      }}
                    />
                  </div>

                  <div className="row form-details">
                    <div className="col-lg-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "advance_amount"
                        }}
                      />
                    </div>

                    <AlagehFormGroup
                      div={{ className: "col-lg-3", id: "widthDate" }}
                      textBox={{
                        decimal: { allowNegative: false },
                        value: this.props.inputsparameters.advance_amount,
                        className: "txt-fld",
                        name: "advance_amount",

                        events: {
                          onChange: texthandle.bind(this, this)
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
                      div={{ className: "col-lg-3", id: "widthDate" }}
                      textBox={{
                        decimal: { allowNegative: false },
                        value: this.state.total_amount,
                        className: "txt-fld",
                        name: "total_amount",

                        events: {
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: true
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="row popupFooter">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SaveAdvance.bind(this)}
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

              <AHSnackbar
                open={this.state.open}
                handleClose={this.handleClose}
                MandatoryMsg={this.state.MandatoryMsg}
              />
            </div>
          </Modal>
        </div>
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
      postAdvance: postAdvance
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AddAdvanceModalAr)
);
