import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlagehFormGroup, AlgaehLabel } from "../../Wrapper/algaehWrapper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  getCtrlCode,
  ClearData,
  SaveSalesReturn,
  POSSearch,
  ViewInsurance
} from "./SalesReturnEvents";
import "./SalesReturn.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import ItemListsReturn from "./ItemListsReturn/ItemListsReturn";
import MyContext from "../../../utils/MyContext";
import SALESRETURNIOputs from "../../../Models/SalesReturn";
import DisplayInsuranceDetails from "./DisplayInsuranceDetails/DisplayInsuranceDetails";
import Options from "../../../Options.json";

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
      viewInsurance: false
    };
  }

  componentWillMount() {
    let IOputs = SALESRETURNIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    if (
      this.props.salesitemlist === undefined ||
      this.props.salesitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "salesitemlist"
        }
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
          mappingName: "locations"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
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

      nextProps.salesReturn.copay_amount = nextProps.salesReturn.copay_amount;
      nextProps.salesReturn.sec_copay_amount =
        nextProps.salesReturn.sec_copay_amount;

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
                    label={{ forceLabel: "Sales Return", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Sales Return Number",
                    returnText: true
                  }}
                />
              ),
              value: this.state.sales_return_number,
              selectValue: "sales_return_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "SalesReturnEntry.ReturnEntry"
              },
              searchName: "SalesReturn"
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Return Date"
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
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-7">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-4" }}
                  label={{
                    forceLabel: "POS Number"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "pos_number",
                    value: this.state.pos_number,
                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <div
                  className="col-lg-2 print_actions"
                  style={{ marginTop: "auto" }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    className="fas fa-search fa-2x"
                    disabled={
                      this.state.pos_customer_type === "O" ? false : true
                    }
                    onClick={POSSearch.bind(this, this)}
                  />
                </div>

                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Location"
                    }}
                  />
                  <h6>
                    {this.state.location_description
                      ? this.state.location_description
                      : "Location"}
                  </h6>
                </div>

                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Visit Code"
                    }}
                  />
                  <h6>
                    {this.state.visit_code
                      ? this.state.visit_code
                      : "Visit Code"}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="row">
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Code"
                    }}
                  />
                  <h6>
                    {this.state.patient_code
                      ? this.state.patient_code
                      : "Patient Code"}
                  </h6>
                </div>
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Name"
                    }}
                  />
                  <h6>
                    {this.state.full_name
                      ? this.state.full_name
                      : "Patient Name"}
                  </h6>
                </div>

                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Mode of Payment"
                    }}
                  />
                  <h6>
                    {this.state.mode_of_pay
                      ? this.state.mode_of_pay === "1"
                        ? "Self"
                        : "Insurance"
                      : "Mode of Payment"}
                  </h6>
                </div>
              </div>
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
                updateState: obj => {
                  this.setState({ ...obj });
                }
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
                        returnText: true
                      }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
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
    existinsurance: state.existinsurance
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getPOSEntry: AlgaehActions,
      getPatientInsurance: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SalesReturn)
);
