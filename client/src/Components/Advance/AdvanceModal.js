import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";
import "./AdvanceModal.css";
import "./../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  Modal
} from "../Wrapper/algaehWrapper";
import variableJson from "../../utils/GlobalVariables.json";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  checkcashhandaler,
  checkcardhandaler,
  checkcheckhandaler,
  Validations
} from "./AdvanceModalHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";
import { successfulMessage } from "../../utils/GlobalFunctions";
// import { getCookie } from "../../utils/algaehApiCall";

import { postAdvance } from "../../actions/RegistrationPatient/Billingactions";

class AddAdvanceModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Cashchecked: true,
      Cardchecked: false,
      Checkchecked: false
    };
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
                <div className="row">
                  <div className="col-lg-3">
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
                  <div className="col-lg-9">
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
                            ? "name"
                            : "arabic_name",
                        valueField: "value",
                        data: variableJson.FORMAT_SHIFT
                      },
                      onChange: texthandle.bind(this, this)
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
                        onChange={checkcashhandaler.bind(this, this)}
                      />

                      <span style={{ fontSize: "0.8rem" }}>Pay by Cash</span>
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
                        onChange={checkcardhandaler.bind(this, this)}
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
                        onChange: texthandle.bind(this, this)
                      },
                      others: {
                        disabled: !this.state.Cardchecked
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
                      onChange: datehandle.bind(this, this)
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
                        onChange={checkcheckhandaler.bind(this, this)}
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
                        disabled: !this.state.Checkchecked
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
                </div>
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
                        ? this.props.inputsparameters.advance_amount
                        : "0.00"}
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
                </div>
              </div>
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
  )(AddAdvanceModal)
);
