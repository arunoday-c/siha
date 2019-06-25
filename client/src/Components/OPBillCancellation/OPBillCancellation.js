import React, { Component } from "react";
import extend from "extend";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PatientVisitDetails from "./PatientVisitDetails/PatientVisitDetails.js";

import OPBillingDetails from "./OPBilling/OPBillingDetails";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPBillCancellation.css";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";
import BillingIOputs from "../../Models/BillCancellation";
import PatRegIOputs from "../../Models/RegistrationPatient";
import { getCookie } from "../../utils/algaehApiCall";
import {
  ClearData,
  Validations,
  getCashiersAndShiftMAP,
  getBillDetails,
  getCtrlCode,
  generateReceipt
} from "./OPBillCancellationEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { successfulMessage } from "../../utils/GlobalFunctions";
import { algaehApiCall } from "../../utils/algaehApiCall.js";
import AlgaehLoader from "../Wrapper/fullPageLoader";

import AlgaehReport from "../Wrapper/printReports";

import moment from "moment";
import Options from "../../Options.json";

class OPBillCancellation extends Component {
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
      advance: 0
    };
  }

  componentWillMount() {
    let IOputs = extend(PatRegIOputs.inputParam(), BillingIOputs.inputParam());
    this.setState({ ...this.state, ...IOputs });
  }

  componentDidMount() {
    let prevLang = getCookie("Language");
    this.setState({
      selectedLang: prevLang
    });

    if (
      this.props.patienttype === undefined ||
      this.props.patienttype.length === 0
    ) {
      this.props.getPatientType({
        uri: "/patientType/getPatientType",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "PATIENT_TYPE_GET_DATA",
          mappingName: "patienttype"
        }
      });
    }

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

  GenerateReciept(callback) {
    let obj = [];

    if (
      this.state.Cashchecked === false &&
      this.state.Cardchecked === false &&
      this.state.Checkchecked === false
    ) {
      successfulMessage({
        message: "Please select receipt type.",
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

  CancelOPBill(e) {
    const err = Validations(this);
    if (!err) {
      this.GenerateReciept($this => {
        let Inputobj = $this.state;

        Inputobj.patient_payable = $this.state.patient_payable_h;
        Inputobj.pay_type = "P";
        AlgaehLoader({ show: true });
        algaehApiCall({
          uri: "/opBillCancellation/addOpBillCancellation",
          module: "billing",
          data: Inputobj,
          method: "POST",
          onSuccess: response => {
            AlgaehLoader({ show: false });

            if (response.data.success) {
              $this.setState({
                bill_cancel_number: response.data.records.bill_number,
                receipt_number: response.data.records.receipt_number,
                hims_f_bill_cancel_header_id:
                  response.data.records.hims_f_bill_cancel_header_id,
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
            AlgaehLoader({ show: false });
            successfulMessage({
              message: error.response.data.message || error.message,
              title: "Error",
              icon: "error"
            });
          }
        });
      });
    }
  }

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          //   width={this.state.breadCrumbWidth}
          title={
            <AlgaehLabel
              label={{ fieldName: "form_opbilling", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel label={{ fieldName: "form_name", align: "ltr" }} />
              )
            },
            {
              pageName: <AlgaehLabel label={{ fieldName: "bill_number" }} />
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "bill_cancel_number", returnText: true }}
              />
            ),
            value: this.state.bill_cancel_number,
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            selectValue: "bill_cancel_number",
            searchName: "cancelbills",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "cancelbills.opBillCancel"
            }
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "bill_cancel_date"
                  }}
                />
                <h6>
                  {this.state.bill_cancel_date
                    ? moment(this.state.bill_cancel_date).format("DD-MM-YYYY")
                    : "DD/MM/YYYY"}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.bill_cancel_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateReceipt(this, this);
                        }
                      }
                    }
                  ]
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key === "bill_number") {
                      getBillDetails(this, this);
                    }
                  });
                });
              }
            }}
          >
            <PatientVisitDetails BillingIOputs={this.state} />
            <OPBillingDetails BillingIOputs={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.CancelOPBill.bind(this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{ fieldName: "btn_cancel", returnText: true }}
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
    patienttype: state.patienttype
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientType: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OPBillCancellation)
);
