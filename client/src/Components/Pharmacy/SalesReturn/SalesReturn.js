import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  getCtrlCode,
  ClearData,
  SavePosEnrty,
  PostPosEntry,
  POSSearch
} from "./SalesReturnEvents";
import "./SalesReturn.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";
import ItemListsReturn from "./ItemListsReturn/ItemListsReturn";
import MyContext from "../../../utils/MyContext";
import POSIOputs from "../../../Models/POS";
import DisplayInsuranceDetails from "./DisplayInsuranceDetails/DisplayInsuranceDetails";

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
      advance: 0
    };
  }

  componentWillMount() {
    let IOputs = POSIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "locations"
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    let posHeaderOut = {};
    debugger;

    if (nextProps.posheader !== undefined && nextProps.posheader.length !== 0) {
      nextProps.posheader.patient_payable_h =
        nextProps.posheader.patient_payable || this.state.patient_payable;
      nextProps.posheader.sub_total = nextProps.posheader.sub_total_amount;
      nextProps.posheader.patient_responsibility =
        nextProps.posheader.patient_res;
      nextProps.posheader.company_responsibility =
        nextProps.posheader.company_res;

      nextProps.posheader.company_payable = nextProps.posheader.company_payble;
      nextProps.posheader.sec_company_responsibility =
        nextProps.posheader.sec_company_res;
      nextProps.posheader.sec_company_payable =
        nextProps.posheader.sec_company_paybale;

      nextProps.posheader.copay_amount = nextProps.posheader.copay_amount;
      nextProps.posheader.sec_copay_amount =
        nextProps.posheader.sec_copay_amount;

      nextProps.posheader.saveEnable = false;
      posHeaderOut = nextProps.posheader;
    }

    this.setState({ ...this.state, ...posHeaderOut });
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
                    forceLabel: "Return Number",
                    returnText: true
                  }}
                />
              ),
              value: this.state.pos_number,
              selectValue: "pos_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "SalesReturnEntry.POSEntry"
              },
              searchName: "SalesReturn"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "Return Date" }} />
                  ),
                  className: "internal-label"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date"
                }}
                disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.initial_stock_date}
              />
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
                <div className="col-lg-2 form-group print_actions">
                  <span
                    className="fas fa-search fa-2x"
                    disabled={this.state.case_type === "O" ? false : true}
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
                      ? this.state.mode_of_pay
                      : "Mode of Payment"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <DisplayInsuranceDetails POSIOputs={this.state} />

          <div className="hptl-phase1-sales-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <ItemListsReturn POSIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <AppBar position="static" className="main">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={SavePosEnrty.bind(this, this)}
                      disabled={this.state.saveEnable}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>

                    <AHSnackbar
                      open={this.state.open}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={ClearData.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>

                    <button
                      type="button"
                      className="btn btn-other"
                      onClick={PostPosEntry.bind(this, this)}
                      disabled={this.state.postEnable}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Post",
                          returnText: true
                        }}
                      />
                    </button>
                  </div>
                </div>
              </AppBar>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    locations: state.locations,
    posheader: state.posheader,
    pospatients: state.pospatients,
    posentry: state.posentry,
    existinsurance: state.existinsurance,
    posheader: state.posheader
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getPatientDetails: AlgaehActions,
      getPosEntry: AlgaehActions,
      getPatientInsurance: AlgaehActions,
      getMedicationList: AlgaehActions,
      getPrescriptionPOS: AlgaehActions,
      PosHeaderCalculations: AlgaehActions
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
