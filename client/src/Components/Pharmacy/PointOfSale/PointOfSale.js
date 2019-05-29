import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  ClearData,
  Patientchange,
  SavePosEnrty,
  VisitSearch,
  LocationchangeTexts,
  closePopup,
  POSSearch
} from "./PointOfSaleEvents";
// getCtrlCode,
import "./PointOfSale.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReactDOM from "react-dom";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import PosListItems from "./PosListItems/PosListItems";
import MyContext from "../../../utils/MyContext";
import POSIOputs from "../../../Models/POS";
import Options from "../../../Options.json";
import Enumerable from "linq";
import {
  algaehApiCall,
  swalMessage,
  getCookie
} from "../../../utils/algaehApiCall";

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
      advance: 0,
      popUpGenereted: false
    };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillMount() {
    let IOputs = POSIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    document.addEventListener("keypress", this.onKeyPress, false);

    if (
      this.props.positemlist === undefined ||
      this.props.positemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "positemlist"
        }
      });
    }

    this.props.getLocation({
      uri: "/pharmacyGlobal/getUserLocationPermission",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "poslocations"
      }
    });

    let IOputs = {};
    let _screenName = getCookie("ScreenName").replace("/", "");

    algaehApiCall({
      uri: "/userPreferences/get",
      data: {
        screenName: _screenName,
        identifier: "PharmacyLocation"
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

  generateReport(rpt_name, rpt_desc) {
    debugger;
    algaehApiCall({
      uri: "/report",
      method: "GET",
      module: "reports",
      headers: {
        Accept: "blob"
      },
      others: { responseType: "blob" },
      data: {
        report: {
          reportName: rpt_name,
          reportParams: [
            {
              name: "hims_f_pharmacy_pos_header_id",
              value: this.state.hims_f_pharmacy_pos_header_id
            }
          ],
          outputFileType: "PDF"
        }
      },
      onSuccess: res => {
        const url = URL.createObjectURL(res.data);
        let myWindow = window.open(
          "{{ product.metafields.google.custom_label_0 }}",
          "_blank"
        );

        myWindow.document.write(
          "<iframe src= '" + url + "' width='100%' height='100%' />"
        );
        myWindow.document.title = rpt_desc;
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
    debugger;
    const _posLocation =
      this.props.poslocations === undefined ? [] : this.props.poslocations;
    return (
      <React.Fragment>
        <div onKeyPress={this.onKeyPress}>
          <div className="row  inner-top-search" style={{ paddingBottom: 10 }}>
            {/* Patient code */}
            <div className="col-3">
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
                      valueField: "hims_d_pharmacy_location_id",
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
                  div={{ className: "col-5" }}
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
            <div className="col-9">
              {this.state.pos_customer_type === "OP" ? (
                <div className="row">
                  <AlagehFormGroup
                    div={{ className: "col-3" }}
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
                    style={{ marginTop: "auto", padding: 0 }}
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
                  className="btn btn-other"
                  onClick={POSSearch.bind(this, this)}
                  style={{ float: "left" }}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Past POS Bill", returnText: true }}
                  />
                </button>
                {this.state.dataExitst === true ? (
                  <div>
                    <button
                      onClick={this.generateReport.bind(
                        this,
                        "posCashInvoice",
                        "Cash Invoice"
                      )}
                      className="btn btn-default"
                    >
                      Cash Invoice
                    </button>

                    {this.state.insured === "Y" ? (
                      <button
                        className="btn btn-default"
                        onClick={this.generateReport.bind(
                          this,
                          "posCreditInvoice",
                          "Credit Invoice"
                        )}
                      >
                        Credit Invoice
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {/* <button
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
                  </button> */}
              </div>
            </div>
          </div>

          {/* <div className="col-12 editFloatCntr animated slideInUp faster"> */}
          <div
            className={
              "col-12 editFloatCntr animated  " +
              (this.state.popUpGenereted ? "slideInUp" : "slideOutDown") +
              " faster"
            }
          >
            {/* <h5>Edit Basic Details</h5> */}
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
                <button
                  onClick={this.generateReport.bind(
                    this,
                    "posCashInvoice",
                    "Cash Invoice"
                  )}
                  className="btn btn-default"
                >
                  Cash Invoice
                </button>

                {this.state.insured === "Y" ? (
                  <button
                    className="btn btn-default"
                    onClick={this.generateReport.bind(
                      this,
                      "posCreditInvoice",
                      "Credit Invoice"
                    )}
                  >
                    Credit Invoice
                  </button>
                ) : null}
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
    positemlist: state.positemlist,
    poslocations: state.poslocations,
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
  )(PointOfSale)
);
