import React, { Component } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import CreditDetails from "./CreditDetails/CreditDetails";
import CreditDetails from "../../CreditDetails";

import SettlementIOputs from "../../../Models/POSCreditSettlement";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import "./POSCreditSettlement.scss";
import MyContext from "../../../utils/MyContext.js";
import AlgaehLabel from "../../Wrapper/label.js";
import { getCookie } from "../../../utils/algaehApiCall";
import {
  ClearData,
  getCashiersAndShiftMAP,
  PatientSearch,
  getCtrlCode,
  SavePosCreidt,
  generatePOSCreditSettlementReceipt
} from "./POSCreditSettlementEvents";
import { AlgaehActions } from "../../../actions/algaehActions";

import { algaehApiCall } from "../../../utils/algaehApiCall.js";

import AlgaehReport from "../../Wrapper/printReports";

import moment from "moment";
import Options from "../../../Options.json";

class POSCreditSettlement extends Component {
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

  UNSAFE_componentWillMount() {
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
              label={{ forceLabel: "POS Credit Settlement", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "POS Credit Settlement",
                    align: "ltr"
                  }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ fieldName: "pos_credit_number", returnText: true }}
              />
            ),
            value: this.state.pos_credit_number,
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            selectValue: "pos_credit_number",
            searchName: "POSCreidt",
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "creidtpos.POSCreidt"
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
                  {this.state.pos_credit_date
                    ? moment(this.state.pos_credit_date).format("DD-MM-YYYY")
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
                        generatePOSCreditSettlementReceipt(this.state);
                      }
                    }
                  }
                ]
              }
              : ""
          }
          // printArea={
          // 	this.state.pos_credit_number !== null ? (
          // 		{
          // 			menuitems: [
          // 				{
          // 					label: 'Print Receipt',
          // 					events: {
          // 						onClick: () => {
          // 							AlgaehReport({
          // 								report: {
          // 									fileName: 'printreceipt'
          // 								},
          // 								data: {
          // 									patient_code: this.state.patient_code,
          // 									full_name: this.state.full_name,
          // 									advance_amount: this.state.advance_amount,
          // 									bill_date: moment(this.state.bill_date).format(
          // 										Options.dateFormat
          // 									),
          // 									receipt_number: this.state.receipt_number,
          // 									doctor_name: this.state.doctor_name,
          // 									bill_details: this.state.billdetails
          // 								}
          // 							});
          // 						}
          // 					}
          // 				}
          // 			]
          // 		}
          // 	) : (
          // 		''
          // 	)
          // }
          selectedLang={this.state.selectedLang}
        />
        <div className="hptl-phase1-pos-credit-form">
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
                      : "----------"}
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
              updateState: (obj, callback) => {
                this.setState({ ...this.state, ...obj }, () => {
                  Object.keys(obj).map(key => {
                    if (key === "patient_code") {
                      this.getPatientDetails(this);
                    }
                  });
                  if (typeof callback === "function") {
                    callback();
                  }
                });
              }
            }}
          >
            <CreditDetails SettlementIOputs={this.state} fromPos={true} />
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
                onClick={SavePosCreidt.bind(this, this)}
                disabled={
                  this.state.saveEnable ||
                  this.state.receipt_amount == 0 ||
                  this.state.unbalanced_amount != 0
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
  )(POSCreditSettlement)
);
