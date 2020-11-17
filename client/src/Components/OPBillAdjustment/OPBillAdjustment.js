import React, { Component } from "react";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import OPBillingDetails from "./OPBilling/OPBillingDetails";
import "./OPBillAdjustment.scss";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/BillCancellation";
import PatRegIOputs from "../../Models/RegistrationPatient";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  // getBillDetails,
  BillSearch,
} from "./OPBillAdjustmentEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import {
  swalMessage,
  algaehApiCall,
  getCookie,
} from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import moment from "moment";
// import { RawSecurityComponent } from "algaeh-react-components";

class OPBillAdjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",

      mode_of_pay: "None",
      pay_cash: "CA",
      pay_card: "CD",
      pay_cheque: "CH",
      cash_amount: 0,
      card_check_number: "",
      card_date: null,
      card_amount: 0,
      cheque_number: "",
      cheque_date: null,
      cheque_amount: 0,
      advance: 0,
      cancel_remarks: null,
      cancel_checkin: "N",
    };
  }

  UNSAFE_componentWillMount() {
    let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang,
    });

    let _screenName = getCookie("ScreenName").replace("/", "");
    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "Counter",
      },
      method: "GET",
      onSuccess: (response) => {
        this.setState({
          counter_id: response.data.records.selectedValue,
        });
      },
    });
    if (
      this.props.opcacelproviders === undefined ||
      this.props.opcacelproviders.length === 0
    ) {
      this.props.getProviderDetails({
        uri: "/employee/get",
        module: "hrManagement",
        method: "GET",
        redux: {
          type: "DOCTOR_GET_DATA",
          mappingName: "opcacelproviders",
        },
        afterSuccess: (data) => {
          this.setState({
            doctors: data,
          });
        },
      });
    }
    // const queryParams = new URLSearchParams(this.props.location.search);
    // if (queryParams.get("bill_cancel_number")) {
    //     getCtrlCode(this, queryParams.get("bill_cancel_number"));
    // }

    getCashiersAndShiftMAP(this);

    // RawSecurityComponent({ componentCode: "OP_CAL_CON" }).then(
    //     (result) => {
    //         debugger
    //         if (result === "show") {
    //             getCashiersAndShiftMAP(this, "Y");
    //         } else {
    //             getCashiersAndShiftMAP(this, "N");
    //         }
    //     }
    // );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let output = {};

    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      output = nextProps.existinsurance[0];
    }

    this.setState({ ...this.state, ...output });
  }

  GenerateReciept(callback) {
    let obj = [];

    if (this.state.Cashchecked === false && this.state.Cardchecked === false) {
      swalMessage({
        title: "Please select receipt type.",
        type: "error",
      });
    } else {
      if (this.state.cash_amount > 0 || this.state.Cashchecked === true) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: null,
          expiry_date: null,
          pay_type: this.state.pay_cash,
          amount: this.state.cash_amount,
          updated_date: null,
          card_type: null,
        });
      }

      if (this.state.card_amount > 0 || this.state.Cardchecked === true) {
        obj.push({
          hims_f_receipt_header_id: null,
          card_check_number: this.state.card_check_number,
          expiry_date: this.state.card_date,
          pay_type: this.state.pay_card,
          amount: this.state.card_amount,
          updated_date: null,
          card_type: null,
        });
      }

      this.setState(
        {
          receiptdetails: obj,
        },
        () => {
          callback(this);
        }
      );
    }
  }

  AdjustOPBill(e) {
    const err = Validations(this);
    if (!err) {
      if (this.state.unbalanced_amount === 0) {
        this.GenerateReciept(($this) => {
          let Inputobj = $this.state;

          Inputobj.patient_payable = $this.state.patient_payable_h;
          Inputobj.insurance_yesno = $this.state.insured;
          Inputobj.ScreenCode = "BL0001";
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/opBilling/addOPBillAdjustment",
            module: "billing",
            data: Inputobj,
            method: "POST",
            onSuccess: (response) => {
              if (response.data.success) {
                AlgaehLoader({ show: false });
                $this.setState({
                  // bill_number: response.data.records.bill_number,
                  // receipt_number: response.data.records.receipt_number,
                  saveEnable: true,
                });
                this.setState({
                  addNewService: true,
                  Billexists: true,
                });
                swalMessage({
                  title: "Done Successfully",
                  type: "success",
                });
              } else {
                AlgaehLoader({ show: false });
                swalMessage({
                  type: "error",
                  title: response.data.records.message,
                });
              }
            },
            onFailure: (error) => {
              AlgaehLoader({ show: false });
              swalMessage({
                title: error.response.data.message || error.message,
                type: "error",
              });
            },
          });
        });
      } else {
        swalMessage({
          title: "Please collect the amount.",
          type: "error",
        });
      }
    }
  }

  render() {
    // let provider_name = null;

    // if (this.state.doctor_id !== null) {
    //     provider_name = Enumerable.from(this.props.opcacelproviders)
    //         .where((w) => w.hims_d_employee_id === this.state.doctor_id)
    //         .select((s) => s.full_name)
    //         .firstOrDefault();
    // }
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <div>
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: (obj) => {
                this.setState({ ...this.state, ...obj });
              },
            }}
          >
            <div className="hptl-phase1-display-patient-form">
              <div
                className="row inner-top-search"
                style={{ paddingTop: 10, paddingBottom: 10 }}
              >
                {/* Patient code */}

                {/* <div
                  className="col-3 globalSearchCntr"
                  style={{
                    cursor: "pointer",
                    pointerEvents:
                      this.state.Billexists === true
                        ? "none"
                        : this.state.patient_code
                        ? "none"
                        : "",
                  }}
                > */}
                <div className="col-2 globalSearchCntr">
                  <AlgaehLabel label={{ fieldName: "bill_number" }} />
                  <h6 onClick={BillSearch.bind(this, this)}>
                    {this.state.bill_number
                      ? this.state.bill_number
                      : "Bill Number"}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                <div className="col-lg-9">
                  <div className="row">
                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "bill_date" }} />
                      <h6>
                        {this.state.bill_date
                          ? moment(this.state.bill_date).format("DD-MM-YYYY")
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "visit_code" }} />
                      <h6>
                        {this.state.visit_code
                          ? this.state.visit_code
                          : "--------"}
                      </h6>
                    </div>

                    {/* <div className="col">
                      <AlgaehLabel
                        label={{ fieldName: "incharge_or_provider" }}
                      />
                      <h6>
                        {this.state.doctor_name
                          ? this.state.doctor_name
                          : "--------"}
                      </h6>
                    </div> */}

                    <div className="col">
                      <AlgaehLabel label={{ fieldName: "patient_code" }} />
                      <h6>
                        {this.state.patient_code
                          ? this.state.patient_code
                          : "--------"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          fieldName: "full_name",
                        }}
                      />
                      <h6>
                        {this.state.full_name
                          ? this.state.full_name
                          : "--------"}
                      </h6>
                    </div>

                    {/* <div className="col">
                      <AlgaehLabel
                        label={{
                          fieldName: "mode_of_pay",
                        }}
                      />
                      <h6>
                        {this.state.mode_of_pay
                          ? this.state.mode_of_pay
                          : "--------"}
                      </h6>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-danger"
                onClick={this.AdjustOPBill.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Adjust Bill", returnText: true }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    existinsurance: state.existinsurance,
    opcacelproviders: state.opcacelproviders,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientInsurance: AlgaehActions,
      getProviderDetails: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OPBillAdjustment)
);
