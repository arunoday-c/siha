import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehLabel } from "../../Wrapper/algaehWrapper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  getCtrlCode,
  ClearData,
  SaveSalesReturn,
  POSSearch,
  ViewInsurance,
  getCashiersAndShiftMAP,
  generateReceipt,
  getDrilDownData,
  // generateReceiptSmall,
} from "./SalesReturnEvents";
import "./SalesReturn.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";

import ItemListsReturn from "./ItemListsReturn/ItemListsReturn";
import MyContext from "../../../utils/MyContext";
import SALESRETURNIOputs from "../../../Models/SalesReturn";
import DisplayInsuranceDetails from "./DisplayInsuranceDetails/DisplayInsuranceDetails";
import Options from "../../../Options.json";
import { MainContext } from "algaeh-react-components";

class SalesReturn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode_of_pay: "",
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
      viewInsurance: false,
    };
  }

  UNSAFE_componentWillMount() {
    let IOputs = SALESRETURNIOputs.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    this.setState({
      userToken: this.context.userToken,
    });
    if (
      this.props.salesitemlist === undefined ||
      this.props.salesitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        data: { item_status: "A" },
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "salesitemlist",
        },
      });
    }

    if (
      this.props.locations === undefined ||
      this.props.locations.length === 0
    ) {
      this.props.getLocation({
        uri: "/pharmacy/getPharmacyLocation",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "locations",
        },
      });
    }
    getCashiersAndShiftMAP(this, this);
    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("sales_return_number")) {
      getCtrlCode(this, queryParams.get("sales_return_number"));
    }
    if (queryParams.get("transaction_id")) {
      getDrilDownData(this, queryParams.get("transaction_id"));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let SalesHeaderOut = {};

    if (
      nextProps.salesReturn !== undefined &&
      nextProps.salesReturn.length !== 0
    ) {
      nextProps.salesReturn.payable_amount =
        nextProps.salesReturn.receiveable_amount;
      nextProps.salesReturn.patient_payable_h =
        nextProps.salesReturn.patient_payable || this.state.patient_payable;
      nextProps.salesReturn.sub_total = nextProps.salesReturn.sub_total_amount;
      nextProps.salesReturn.patient_responsibility =
        nextProps.salesReturn.patient_res;
      nextProps.salesReturn.company_responsibility =
        nextProps.salesReturn.company_res;

      nextProps.salesReturn.company_payable =
        nextProps.salesReturn.company_payble;
      nextProps.salesReturn.sec_company_responsibility =
        nextProps.salesReturn.sec_company_res;
      nextProps.salesReturn.sec_company_payable =
        nextProps.salesReturn.sec_company_paybale;

      // nextProps.salesReturn.copay_amount = nextProps.salesReturn.copay_amount;
      // nextProps.salesReturn.sec_copay_amount =
      // nextProps.salesReturn.sec_copay_amount;

      nextProps.salesReturn.saveEnable = false;
      SalesHeaderOut = nextProps.salesReturn;
    }

    this.setState({ ...this.state, ...SalesHeaderOut });
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Sales Return", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Sales Return Number",
                    returnText: true,
                  }}
                />
              ),
              value: this.state.sales_return_number,
              selectValue: "sales_return_number",
              events: {
                onChange: getCtrlCode.bind(this, this),
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "SalesReturnEntry.ReturnEntry",
              },
              searchName: "SalesReturn",
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Return Date",
                    }}
                  />
                  <h6>
                    {this.state.sales_return_date
                      ? moment(this.state.sales_return_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>
              </div>
            }
            printArea={
              this.state.sales_return_number !== null
                ? {
                    menuitems: [
                      {
                        label: "Print Receipt",
                        events: {
                          onClick: () => {
                            generateReceipt(this, this);
                          },
                        },
                      },
                      // {
                      //   label: "Print Receipt Small",
                      //   events: {
                      //     onClick: () => {
                      //       generateReceiptSmall(this, this);
                      //     },
                      //   },
                      // },
                    ],
                  }
                : ""
            }
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}

            <div
              className="col-3 globalSearchCntr"
              style={{
                cursor: "pointer",
                pointerEvents: this.state.trns_history === true ? "none" : "",
              }}
            >
              <AlgaehLabel label={{ forceLabel: "POS Number" }} />
              <h6 onClick={POSSearch.bind(this, this)}>
                {this.state.pos_number ? this.state.pos_number : "POS Number"}
                <i className="fas fa-search fa-lg"></i>
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Location",
                }}
              />
              <h6>
                {this.state.location_description
                  ? this.state.location_description
                  : "--------"}
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Visit Code",
                }}
              />
              <h6>
                {this.state.visit_code ? this.state.visit_code : "--------"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Patient Code",
                }}
              />
              <h6>
                {this.state.patient_code ? this.state.patient_code : "--------"}
              </h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Patient Name",
                }}
              />
              <h6>
                {this.state.dis_patient_name
                  ? this.state.dis_patient_name
                  : "-----------"}
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Mode of Payment",
                }}
              />
              <h6>
                {this.state.mode_of_pay === "1"
                  ? "Self"
                  : this.state.mode_of_pay === "2"
                  ? "Insurance"
                  : "-----------"}
              </h6>
            </div>
          </div>

          <DisplayInsuranceDetails
            show={this.state.viewInsurance}
            SALESRETURNIOputs={this.state}
            onClose={ViewInsurance.bind(this, this)}
          />

          <div className="hptl-phase1-sales-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: (obj) => {
                  this.setState({ ...obj });
                },
              }}
            >
              <ItemListsReturn SALESRETURNIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SaveSalesReturn.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Return & Print",
                        returnText: true,
                      }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                    disabled={this.state.clearData}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  {this.state.mode_of_pay === "2" ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      onClick={ViewInsurance.bind(this, this)}
                    >
                      View Insurance
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    salesitemlist: state.salesitemlist,
    locations: state.locations,
    salesReturn: state.salesReturn,
    existinsurance: state.existinsurance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getPOSEntry: AlgaehActions,
      getPatientInsurance: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SalesReturn)
);
