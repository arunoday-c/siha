import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  getCtrlCode,
  ClearData,
  Patientchange,
  SavePosEnrty,
  PostPosEntry,
  VisitSearch,
  LocationchangeTexts
} from "./PointOfSaleEvents";
import "./PointOfSale.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import PosListItems from "./PosListItems/PosListItems";
import MyContext from "../../../utils/MyContext";
import POSIOputs from "../../../Models/POS";
import DisplayInsuranceDetails from "./DisplayInsuranceDetails/DisplayInsuranceDetails";

class PointOfSale extends Component {
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
    if (
      this.props.positemlist === undefined ||
      this.props.positemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "positemlist"
        }
      });
    }

    if (
      this.props.poslocations === undefined ||
      this.props.poslocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/pharmacy/getPharmacyLocation",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "poslocations"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let posHeaderOut = {};
    debugger;

    if (nextProps.posheader !== undefined && nextProps.posheader.length !== 0) {
      nextProps.posheader.patient_payable_h =
        nextProps.posheader.patient_payable || this.state.patient_payable;
      nextProps.posheader.sub_total =
        nextProps.posheader.sub_total_amount || this.state.sub_total;
      nextProps.posheader.patient_responsibility =
        nextProps.posheader.patient_res || this.state.patient_responsibility;
      nextProps.posheader.company_responsibility =
        nextProps.posheader.company_res || this.state.company_responsibility;

      nextProps.posheader.company_payable =
        nextProps.posheader.company_payble || this.state.company_payable;
      nextProps.posheader.sec_company_responsibility =
        nextProps.posheader.sec_company_res ||
        this.state.sec_company_responsibility;
      nextProps.posheader.sec_company_payable =
        nextProps.posheader.sec_company_paybale ||
        this.state.sec_company_payable;

      nextProps.posheader.copay_amount =
        nextProps.posheader.copay_amount || this.state.copay_amount;
      nextProps.posheader.sec_copay_amount =
        nextProps.posheader.sec_copay_amount || this.state.sec_copay_amount;

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
                label={{ forceLabel: "Point Of Sale", align: "ltr" }}
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
                    label={{ forceLabel: "Point Of Sale", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "POS Number", returnText: true }}
                />
              ),
              value: this.state.pos_number,
              selectValue: "pos_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "pointofsaleEntry.POSEntry"
              },
              searchName: "POSEntry"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "POS Date" }} />
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
                value={this.state.pos_date}
              />
            }
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-8">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.poslocations
                    },
                    onChange: LocationchangeTexts.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Case Type" }}
                  selector={{
                    name: "case_type",
                    className: "select-fld",
                    value: this.state.case_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_POS_CASE_TYPE
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Visit Code"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "visit_code",
                    value: this.state.visit_code,
                    events: {
                      onChange: Patientchange.bind(this, this)
                    },
                    others: {
                      // disabled: this.state.case_type === "O" ? true : false
                      disabled: true
                    }
                  }}
                />

                {this.state.case_type === "OP" ? (
                  <div className="col-lg-2 form-group print_actions">
                    <span
                      className="fas fa-search fa-2x"
                      disabled={this.state.case_type === "O" ? false : true}
                      onClick={VisitSearch.bind(this, this)}
                    />
                  </div>
                ) : null}

                {/* <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Patient Code"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "patient_code",
                    value: this.state.patient_code,
                    events: {
                      onChange: Patientchange.bind(this, this)
                    }
                    // others: {
                    //   disabled: true
                    // }
                  }}
                /> */}
              </div>
            </div>
            <div className="col-lg-4">
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
                      : "Patient Name"}
                  </h6>
                </div>
                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Code"
                    }}
                  />
                  <h6>
                    {this.state.full_name
                      ? this.state.full_name
                      : "Patient Name"}
                  </h6>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Mode of Payment" }}
                  selector={{
                    name: "mode_of_pay",
                    className: "select-fld",
                    value: this.state.mode_of_pay,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.MODE_OF_PAY
                    },
                    others: {
                      disabled: this.state.case_type === "O" ? false : true
                    },
                    onChange: changeTexts.bind(this, this)
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            {this.state.case_type === "O" ? null : (
              <DisplayInsuranceDetails POSIOputs={this.state} />
            )}
          </div>
          <div className="hptl-phase1-pos-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <PosListItems POSIOputs={this.state} />
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
    positemlist: state.positemlist,
    poslocations: state.poslocations,
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
  )(PointOfSale)
);
