import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import CreditDetails from "./CreditDetails/CreditDetails";
import CreditDetails from "../CreditDetails";

import SettlementIOputs from "../../Models/OPCreditSettlement";
import BreadCrumb from "../common/BreadCrumb/BreadCrumb.js";
import "./OPCreditSettlement.scss";
import MyContext from "../../utils/MyContext.js";
import AlgaehLabel from "../Wrapper/label.js";

import {
  ClearData,
  getCashiersAndShiftMAP,
  PatientSearch,
  getCtrlCode,
  SaveOPCreidt,
  generateOPCreditReceipt,
} from "./OPCreditSettlementEvents";
import { AlgaehActions } from "../../actions/algaehActions";
import { algaehApiCall, getCookie } from "../../utils/algaehApiCall.js";
import { MainContext } from "algaeh-react-components";
import moment from "moment";

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
      advance: 0,
    };
  }

  static contextType = MainContext;

  UNSAFE_componentWillMount() {
    let IOputs = SettlementIOputs.inputParam();

    const userToken = this.context.userToken;

    IOputs.Cashchecked = userToken.default_pay_type === "CH" ? true : false;
    IOputs.Cardchecked = userToken.default_pay_type === "CD" ? true : false;
    IOputs.default_pay_type = userToken.default_pay_type;
    IOputs.portal_exists = userToken.portal_exists;

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
    getCashiersAndShiftMAP(this, this);
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

  render() {
    return (
      <div className="" style={{ marginBottom: "50px" }}>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "OP Credit Settlement", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel label={{ forceLabel: "Billing", align: "ltr" }} />
          //     ),
          //   },
          //   {
          //     pageName: <AlgaehLabel label={{ fieldName: "credit_number" }} />,
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "credit_number", returnText: true }}
              />
            ),
            value: this.state.credit_number,
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            selectValue: "credit_number",
            searchName: "opCreidt",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "creidtbills.opCreidt",
            },
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    fieldName: "credit_date",
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
          printArea={
            this.state.hims_f_credit_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateOPCreditReceipt(this.state);
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div style={{ marginTop: 75 }}>
          <div
            className="row inner-top-search"
            style={{ paddingTop: 10, paddingBottom: 10 }}
          >
            <div
              className="col-3 globalSearchCntr"
              style={{
                cursor: "pointer",
                pointerEvents: this.state.Billexists === true ? "none" : "",
              }}
            >
              <AlgaehLabel label={{ fieldName: "s_patient_code" }} />
              <h6 onClick={PatientSearch.bind(this, this)}>
                {this.state.patient_code ? (
                  this.state.patient_code
                ) : (
                  <AlgaehLabel label={{ fieldName: "patient_code" }} />
                )}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>
            <div className="col-lg-9">
              <div className="row">
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      fieldName: "full_name",
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
              updateState: (obj, callback) => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).forEach((key) => {
                    if (key === "patient_code") {
                      this.getPatientDetails(this);
                    }
                  });
                  if (typeof callback === "function") {
                    callback();
                  }
                });
              },
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
                onClick={SaveOPCreidt.bind(this, this)}
                disabled={
                  this.state.saveEnable ||
                  !this.state.receipt_amount ||
                  !this.state.unbalanced_amount == 0 // eslint-disable-line
                }
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
    patienttype: state.patienttype,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPatientDetails: AlgaehActions,
      getBIllDetails: AlgaehActions,
      getPatientType: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OPCreditSettlement)
);
