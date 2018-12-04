import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import CreditDetails from "./CreditDetails/CreditDetails";

import SettlementIOputs from "../../Models/OPCreditSettlement";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPCreditSettlement.css";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import { getCookie } from "../../utils/algaehApiCall";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  PatientSearch
} from "./OPCreditSettlementEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { algaehApiCall, swalMessage } from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";
import Enumerable from "linq";
import AlgaehReport from "../Wrapper/printReports";

import moment from "moment";
import Options from "../../Options.json";

class OPCreditSettlement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLang: "en",
      s_service_type: null,
      s_service: null,
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
      advance: 0
    };
  }

  componentWillMount() {
    let IOputs = SettlementIOputs.inputParam();
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang
    });

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
    getCashiersAndShiftMAP(this, this);
  }

  componentWillReceiveProps(nextProps) {
    let output = {};

    if (
      nextProps.existinsurance !== undefined &&
      nextProps.existinsurance.length !== 0
    ) {
      output = nextProps.existinsurance[0];
    }

    this.setState({ ...this.state, ...output });
  }

  getCtrlCode(billcode) {
    let $this = this;

    AlgaehLoader({ show: true });

    algaehApiCall({
      uri: "/opCreditSettlement/getCreidtSettlement",
      method: "GET",
      data: { credit_number: billcode },
      onSuccess: response => {
        if (response.data.success) {
          debugger;

          let data = response.data.records;
          debugger;

          data.Billexists = true;

          if (data.receiptdetails.length !== 0) {
            for (let i = 0; i < data.receiptdetails.length; i++) {
              if (data.receiptdetails[i].pay_type === "CA") {
                data.Cashchecked = true;
                data.cash_amount = data.receiptdetails[i].amount;
              }

              if (data.receiptdetails[i].pay_type === "CD") {
                data.Cardchecked = true;
                data.card_amount = data.receiptdetails[i].amount;
              }

              if (data.receiptdetails[i].pay_type === "CH") {
                data.Checkchecked = true;
                data.cheque_amount = data.receiptdetails[i].amount;
              }
            }
          }

          $this.setState(data);
          AlgaehLoader({ show: false });
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

  GenerateReciept(callback) {
    let obj = [];

    if (
      this.state.Cashchecked === false &&
      this.state.Cardchecked === false &&
      this.state.Checkchecked === false
    ) {
      successfulMessage({
        message: "Invalid Input. Please select receipt type.",
        title: "Error",
        icon: "error"
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
          card_type: null
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
          card_type: null
        });
      }
      if (this.state.cheque_amount > 0 || this.state.Checkchecked === true) {
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
          receiptdetails: obj
        },
        () => {
          callback(this);
        }
      );
    }
  }

  SaveBill(e) {
    debugger;
    const err = Validations(this);
    if (!err) {
      if (this.state.unbalanced_amount === 0) {
        this.GenerateReciept($this => {
          let Inputobj = $this.state;

          let listOfinclude = Enumerable.from(Inputobj.criedtdetails)
            .where(w => w.include === "Y")
            .toArray();

          Inputobj.criedtdetails = listOfinclude;
          AlgaehLoader({ show: true });
          algaehApiCall({
            uri: "/opCreditSettlement/addCreidtSettlement",
            data: Inputobj,
            method: "POST",
            onSuccess: response => {
              AlgaehLoader({ show: false });
              if (response.data.success) {
                $this.setState({
                  bill_number: response.data.records.bill_number,
                  receipt_number: response.data.records.receipt_number,
                  saveEnable: true
                });
                successfulMessage({
                  message: "Done Successfully",
                  title: "Success",
                  icon: "success"
                });
              }
            },
            onFailure: error => {
              debugger;
              AlgaehLoader({ show: false });
              successfulMessage({
                message: error.response.data.message || error.message,
                title: "Error",
                icon: "error"
              });
            }
          });
        });
      } else {
        successfulMessage({
          message: "Invalid Input. Please recive the amount.",
          title: "Error",
          icon: "error"
        });
      }
    }
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          title={
            <AlgaehLabel label={{ fieldName: "form_opcreidt", align: "ltr" }} />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            },
            {
              pageName: <AlgaehLabel label={{ fieldName: "credit_number" }} />
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "credit_number", returnText: true }}
              />
            ),
            value: this.state.credit_number,
            events: {
              onChange: this.getCtrlCode.bind(this)
            },
            selectValue: "credit_number",
            searchName: "opCreidt",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "creidtbills.opCreidt"
            }
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "credit_date"
                  }}
                />
                <h6>
                  {this.state.credit_date
                    ? moment(this.state.credit_date).format("DD-MM-YYYY")
                    : "DD/MM/YYYY"}
                </h6>
              </div>
            </div>
          }
          printArea={{
            menuitems: [
              {
                label: "Print Receipt",
                events: {
                  onClick: () => {
                    AlgaehReport({
                      report: {
                        fileName: "printreceipt"
                      },
                      data: {
                        patient_code: this.state.patient_code,
                        full_name: this.state.full_name,
                        advance_amount: this.state.advance_amount,
                        bill_date: moment(this.state.bill_date).format(
                          Options.dateFormat
                        ),
                        receipt_number: this.state.receipt_number,
                        doctor_name: this.state.doctor_name,
                        bill_details: this.state.billdetails
                      }
                    });
                  }
                }
              }
            ]
          }}
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <div
            className="row inner-top-search"
            style={{ paddingTop: 10, paddingBottom: 10 }}
          >
            <div className="col-lg-3">
              <div
                className="row"
                style={{
                  border: " 1px solid #ced4d9",
                  borderRadius: 5,
                  marginLeft: 0
                }}
              >
                <div className="col">
                  <AlgaehLabel label={{ fieldName: "patient_code" }} />
                  <h6>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "*** New ***"}
                  </h6>
                </div>
                <div
                  className="col-lg-3"
                  style={{ borderLeft: "1px solid #ced4d8" }}
                >
                  <i
                    className="fas fa-search fa-lg"
                    style={{
                      paddingTop: 17,
                      paddingLeft: 3,
                      cursor: "pointer",
                      pointerEvents:
                        this.state.Billexists === true
                          ? "none"
                          : this.state.patient_code
                          ? "none"
                          : ""
                    }}
                    onClick={PatientSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "full_name"
                    }}
                  />
                  <h6>
                    {this.state.full_name ? this.state.full_name : "--------"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key === "patient_code") {
                      this.getPatientDetails(this);
                    }
                  });
                });
              }
            }}
          >
            <CreditDetails SettlementIOputs={this.state} />
            {/* <ReciptDetails SettlementIOputs={this.state} /> */}
            {/* <DisplayInsuranceDetails BillingIOputs={this.state} /> */}
            {/* <OPBillingDetails BillingIOputs={this.state} /> */}
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.SaveBill.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_save", returnText: true }}
                />
                {/* Save */}
              </button>

              <button
                type="button"
                className="btn btn-default"
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_clear", returnText: true }}
                />
                {/* Clear */}
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
    patients: state.patients,
    existinsurance: state.existinsurance,
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      getBIllDetails: AlgaehActions,
      getPatientType: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OPCreditSettlement)
);
