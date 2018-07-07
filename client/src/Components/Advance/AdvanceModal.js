import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./AdvanceModal.css";
import "./../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../Wrapper/algaehWrapper";
import variableJson from "../../utils/GlobalVariables.json";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";

import {
  texthandle,
  datehandle,
  cashtexthandle,
  cardtexthandle,
  chequetexthandle,
  Validations
} from "./AdvanceModalHandaler";

import AdvRefunIOputs from "../../Models/AdvanceRefund";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { getCookie } from "../../utils/algaehApiCall";
import AHSnackbar from "../common/Inputs/AHSnackbar.js";

export default class AddAdvanceModal extends PureComponent {
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
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
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
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
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
          created_by: getCookie("UserID"),
          created_date: new Date(),
          updated_by: null,
          updated_date: null,
          card_type: null
        });
      }

      this.setState(
        {
          receiptdetails: obj,
          hims_f_patient_id: this.props.inputsparameters.hims_f_patient_id,
          transaction_type: this.props.inputsparameters.transaction_type,
          pay_type: this.props.inputsparameters.pay_type
        },
        () => {
          callback(this);
        }
      );
    }
  }

  SavePatientDetails(e) {
    debugger;
    const err = Validations(this, this);

    if (!err) {
      this.GenerateReciept($this => {
        if ($this.state.hims_d_patient_id == null) {
          $this.props.postPatientDetails($this.state, data => {
            $this.setState({
              receipt_number: data.receipt_number
            });
            successfulMessage({
              message: "Done Successfully",
              title: "Success",
              icon: "success"
            });
          });
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-add-advance-form">
          <Dialog
            open={this.props.show}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="500px"
          >
            <div className="colorPrimary">
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="title">
                    <h1>{this.props.HeaderCaption}</h1>
                  </Typography>
                </Toolbar>
              </AppBar>
            </div>

            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="container-fluid">
                  <div className="row form-details">
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
                        // forceLabel: "Name"
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
                            this.state.selectedLang == "en"
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
                            this.state.selectedLang == "en"
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
                        },
                        others: {
                          receipt: true
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
                            this.state.selectedLang == "en"
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
                        },
                        others: {
                          receipt: true
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
                            this.state.selectedLang == "en"
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
                        value: this.state.advance_amount,
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
                          onChange: texthandle.bind(this, this)
                        },
                        others: {
                          disabled: true
                        }
                      }}
                    />
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.SavePatientDetails.bind(this)}
                color="primary"
              >
                Save
              </Button>
              <Button
                onClick={e => {
                  this.onClose(e);
                }}
                color="secondary"
              >
                Close
              </Button>

              <AHSnackbar
                open={this.state.open}
                handleClose={this.handleClose}
                MandatoryMsg={this.state.MandatoryMsg}
              />
            </DialogActions>
          </Dialog>
        </div>
      </React.Fragment>
    );
  }
}
