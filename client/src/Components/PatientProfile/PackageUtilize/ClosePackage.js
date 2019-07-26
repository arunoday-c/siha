import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import moment from "moment";

import "./../../../styles/site.css";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import ButtonType from "../../Wrapper/algaehButton";

import { getAmountFormart } from "../../../utils/GlobalFunctions";
import {
  algaehApiCall,
  swalMessage,
  maxCharactersLeft
} from "../../../utils/algaehApiCall.js";
import { AlgaehActions } from "../../../actions/algaehActions";
import PackageUtilizeEvent from "./PackageUtilizeEvent";

class ClosePackage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Cashchecked: true,
      closed_type: "C",
      closed_remarks: "",
      actual_amount: 0,
      advance_amount: 0,
      utilize_amount: 0,
      balance_amount: 0
    };
    this.closedRemarks = 200;
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

    PackageUtilizeEvent().getCashiersAndShiftMAP(this);
  }

  texthandle(e) {
    PackageUtilizeEvent().texthandle(this, e);
  }

  textAreaEvent(e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;

    this.setState({
      [name]: value
    });
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  componentWillReceiveProps(newProps) {
    debugger;
    if (newProps.package_detail !== undefined) {
      let InputObj = newProps.package_detail;
      InputObj.Cashchecked = true;
      InputObj.closed_type = "C";
      this.setState({ ...InputObj });
    }
  }

  GenerateReciept(callback) {
    let obj = [];

    obj.push({
      hims_f_receipt_header_id: null,
      card_check_number: null,
      expiry_date: null,
      pay_type: "CA",
      amount: this.state.cash_amount,
      updated_date: null,
      card_type: null
    });

    debugger;

    this.setState(
      {
        receiptdetails: obj,

        transaction_type: this.props.transaction_type,
        pay_type: this.props.pay_type,
        advance_amount: this.state.total_amount,
        total_amount: this.state.cash_amount,
        hims_f_patient_id: this.state.patient_id,
        package_id: this.state.hims_f_package_header_id
      },
      () => {
        callback(this);
      }
    );
  }

  CloseRefund(e) {
    debugger;
    if (
      this.state.closed_remarks === null ||
      this.state.closed_remarks === ""
    ) {
      swalMessage({
        title: "Enter Remarks...",
        type: "warning"
      });
      return;
    }
    this.GenerateReciept($this => {
      debugger;
      algaehApiCall({
        uri: "/billing/patientPackageAdvanceRefund",
        module: "billing",
        method: "POST",
        data: $this.state,
        onSuccess: response => {
          if (response.data.success) {
            let data = response.data.records;
            $this.setState({
              receipt_number: data.receipt_number
            });

            swalMessage({
              title: "Refunded Successfully...",
              type: "success"
            });
          }
        },
        onFailure: error => {
          swalMessage({
            title: error.message,
            type: "error"
          });
        }
      });
    });
  }

  ClosePackage() {
    debugger;
    if (this.state.closed_remarks.length <= 0) {
      swalMessage({
        title: "Enter Remarks...",
        type: "warning"
      });
      return;
    }
    algaehApiCall({
      uri: "/billing/closePackage",
      module: "billing",
      method: "PUT",
      data: {
        closed_remarks: this.state.closed_remarks,
        hims_f_package_header_id: this.state.hims_f_package_header_id
      },
      onSuccess: response => {
        if (response.data.success) {
          this.props.onClose && this.props.onClose(true);
          swalMessage({
            title: "Package Closed Successfully...",
            type: "success"
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Close Package"
          openPopup={this.props.show}
          class={this.state.lang_sets + "advanceRefundModal"}
        >
          <div className="col-lg-12 popupInner">
            {/* Payment Type <hr style={{ margin: "0rem" }} />

            <hr />*/}
            {/* Cash */}
            <div className="row">
              <div className="col-3 customRadio form-group">
                <label className="radio inline">
                  <input
                    type="radio"
                    name="closed_type"
                    value="C"
                    checked={this.state.closed_type === "C" ? true : false}
                    onChange={this.texthandle.bind(this)}
                  />
                  <span>Close</span>
                </label>

                <label className="radio inline">
                  <input
                    type="radio"
                    name="closed_type"
                    value="R"
                    checked={this.state.closed_type === "R" ? true : false}
                    onChange={this.texthandle.bind(this)}
                  />
                  <span>Refund and Close</span>
                </label>
              </div>
              <div className="col-9">
                <AlgaehLabel
                  label={{
                    forceLabel: "Remarks",
                    isImp: true
                  }}
                />

                <textarea
                  value={this.state.closed_remarks}
                  name="closed_remarks"
                  onChange={this.textAreaEvent.bind(this)}
                  maxLength={this.closedRemarks}
                />

                <small className="float-right">
                  Max Char.
                  {maxCharactersLeft(
                    this.closedRemarks,
                    this.state.closed_remarks
                  )}
                  /{this.closedRemarks}
                </small>
              </div>
            </div>

            <hr />
            <div className="row secondary-box-container">
              <div className="col-lg-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "Actual Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.actual_amount)}</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Advance Paid"
                  }}
                />
                <h6>{getAmountFormart(this.state.advance_amount)}</h6>
              </div>

              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Actual Utilized Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.actual_utilize_amount)}</h6>
              </div>
              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Utilized Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.utilize_amount)}</h6>
              </div>
              <div className="col-lg-2">
                <AlgaehLabel
                  label={{
                    forceLabel: "Balance Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.balance_amount)}</h6>
              </div>
            </div>
            {this.state.closed_type === "R" ? (
              <div className="row">
                <div className="col-lg-2">
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
                <div className="col-lg-2">
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
                <AlagehFormGroup
                  div={{ className: "col-lg-2" }}
                  label={{
                    forceLabel: "Cancallation Cahrges"
                  }}
                  textBox={{
                    decimal: { allowNegative: false },
                    className: "txt-fld",
                    name: "cancel_amount",
                    value: this.state.cancel_amount,
                    events: {
                      onChange: this.texthandle.bind(this)
                    },
                    others: {
                      placeholder: "0.00"
                    }
                  }}
                />

                <div
                  className="customCheckbox col-lg-2"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Pay by Cash"
                      checked={this.state.Cashchecked}
                      disabled={true}
                    />

                    <span style={{ fontSize: "0.8rem" }}>Pay By Cash</span>
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
                    className: "txt-fld",
                    name: "cash_amount",
                    value: this.state.cash_amount,

                    others: {
                      disabled: true,
                      placeholder: "0.00"
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  {this.state.closed_type === "C" ? (
                    <ButtonType
                      classname="btn-primary"
                      onClick={this.ClosePackage.bind(this)}
                      label={{
                        forceLabel: "Close",
                        returnText: true
                      }}
                    />
                  ) : null}
                  {this.state.closed_type === "R" ? (
                    <ButtonType
                      classname="btn-primary"
                      onClick={this.CloseRefund.bind(this)}
                      label={{
                        forceLabel: "Close & Refund",
                        returnText: true
                      }}
                    />
                  ) : null}
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    shifts: state.shifts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getShifts: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ClosePackage)
);
