import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import {
  changeTexts,
  ClearData,
  Patientchange,
  SavePosEnrty,
  VisitSearch,
  LocationchangeTexts,
  closePopup
} from "./InvPointOfSaleEvents";
import "./InvPointOfSale.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReactDOM from "react-dom";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import PosListItems from "./PosListItems/PosListItems";
import MyContext from "../../../utils/MyContext";
import INVPOSIOputs from "../../../Models/INVPOS";
import Options from "../../../Options.json";
import Enumerable from "linq";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";
// import x from "../../U\"
const OcafEditor = React.lazy(() => import("../../ucafEditors/ocaf"));

class InvPointOfSale extends Component {
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
      popUpGenereted: false
    };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  openOCAFReport(data, e) {
    let that = this;
    algaehApiCall({
      uri: "/ocaf/getPatientOCAF",
      method: "GET",
      data: {
        patient_id: this.state.patient_id,
        visit_id: this.state.visit_id
      },
      onSuccess: response => {
        if (response.data.success) {
          that.setState({ openOCAF: true, OCAFData: response.data.records });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.response.data.message,
          type: "warning"
        });
      }
    });
  }

  renderOCAFReport() {
    return (
      <AlgaehModalPopUp
        openPopup={this.state.openOCAF}
        title="OCAF 2.0"
        events={{
          onClose: () => {
            this.setState({ openOCAF: false });
          }
        }}
      >
        <OcafEditor dataProps={this.state.OCAFData} />
      </AlgaehModalPopUp>
    );
  }

  componentWillMount() {
    let IOputs = INVPOSIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    document.addEventListener("keypress", this.onKeyPress, false);

    if (
      this.props.opitemlist === undefined ||
      this.props.opitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        module: "inventory",
        data: { item_type: "OITM", item_status: "A" },
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "opitemlist"
        }
      });
    }

    if (
      this.props.oplocations === undefined ||
      this.props.oplocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventoryGlobal/getUserLocationPermission",
        module: "inventory",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "oplocations"
        }
      });
    }

    let IOputs = {};
    let _screenName = getCookie("ScreenName").replace("/", "");

    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "InventoryLocation"
      },
      method: "GET",
      onSuccess: response => {
        if (response.data.records.selectedValue !== undefined) {
          IOputs.location_id = response.data.records.selectedValue;
        }
        algaehApiCall({
          uri: "/userPreferences/get",
          data: {
            screenName: _screenName,
            identifier: "LocationType"
          },
          method: "GET",
          onSuccess: response => {
            if (response.data.records.selectedValue !== undefined) {
              IOputs.location_type = response.data.records.selectedValue;
            }
            this.setState(IOputs);
          },
          onFailure: error => {
            swalMessage({
              title: error.message,
              type: "error"
            });
          }
        });
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  onKeyPress(e) {
    if (e.ctrlKey && e.keyCode === 9) {
      const element = ReactDOM.findDOMNode(
        document.getElementById("root")
      ).querySelector("input[name='item_id']");
      element.focus();
    }

    if (e.ctrlKey && e.keyCode === 14) {
      ClearData(this);
      const element = ReactDOM.findDOMNode(
        document.getElementById("root")
      ).querySelector("input[name='item_id']");
      element.focus();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPress, false);
  }

  render() {
    const _posLocation =
      this.props.poslocations === undefined ? [] : this.props.poslocations;

    return (
      <React.Fragment>
        <div onKeyPress={this.onKeyPress}>
          <div className="row  inner-top-search" style={{ paddingBottom: 10 }}>
            {/* Patient code */}
            <div className="col-lg-3">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: _posLocation
                    },
                    onChange: LocationchangeTexts.bind(this, this),
                    autoComplete: "off",
                    others: {
                      disabled: this.state.dataExitst
                    }
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-5" }}
                  label={{ forceLabel: "Case Type" }}
                  selector={{
                    name: "pos_customer_type",
                    className: "select-fld",
                    value: this.state.pos_customer_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_POS_CASE_TYPE
                    },

                    onChange: changeTexts.bind(this, this),
                    others: {
                      disabled: this.state.dataExitst
                    }
                  }}
                />
              </div>
            </div>
            <div className="col-lg-9">
              {this.state.pos_customer_type === "OP" ? (
                <div className="row">
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
                        disabled: true
                      }
                    }}
                  />

                  <div
                    className="col-1 print_actions"
                    style={{ marginTop: "auto" }}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      className="fas fa-search fa-2x"
                      onClick={VisitSearch.bind(this, this)}
                    />
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Name"
                      }}
                    />
                    <h6>
                      {this.state.full_name
                        ? this.state.full_name
                        : "-----------"}
                    </h6>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Patient Code"
                      }}
                    />
                    <h6>
                      {this.state.patient_code
                        ? this.state.patient_code
                        : "-----------"}
                    </h6>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Mode of Payment"
                      }}
                    />
                    <h6>
                      {console.log(typeof this.state.mode_of_pay)}
                      {this.state.mode_of_pay === "1"
                        ? "Self"
                        : this.state.mode_of_pay === "2"
                        ? "Insurance"
                        : "-----------"}
                    </h6>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Patient Name"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "patient_name",
                      value: this.state.patient_name,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Prescribed Doctor"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "referal_doctor",
                      value: this.state.referal_doctor,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Mobile Number"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "mobile_number",
                      value: this.state.mobile_number,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="hptl-phase1-pos-form">
            <div className="row">
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
            </div>
          </div>
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SavePosEnrty.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Collect & Print",
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

                <button
                  type="button"
                  className="btn btn-default"
                  onClick={this.openOCAFReport.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "OCAF", returnText: true }}
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              "col-12 editFloatCntr animated  " +
              (this.state.popUpGenereted ? "slideInUp" : "slideOutDown") +
              " faster"
            }
          >
            <div className="row">
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "POS Generated No."
                  }}
                />
                <h6>{this.state.pos_number}</h6>
              </div>
              <div className="col-3">
                <AlgaehLabel
                  label={{
                    forceLabel: "POS Generated Date."
                  }}
                />
                <h6>
                  {this.state.pos_date
                    ? moment(this.state.pos_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button
                  //onClick={this.updateEmployeeBasicDetails.bind(this)}
                  type="button"
                  className="btn btn-primary"
                >
                  Print Bill
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={closePopup.bind(this, this)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {this.renderOCAFReport()}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    opitemlist: state.opitemlist,
    oplocations: state.oplocations,
    posheader: state.posheader,
    pospatients: state.pospatients,
    posentry: state.posentry,
    existinsurance: state.existinsurance
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
  )(InvPointOfSale)
);
