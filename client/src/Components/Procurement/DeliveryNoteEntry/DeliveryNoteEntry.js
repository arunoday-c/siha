import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./DeliveryNoteEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import DNItemList from "./DNItemList/DNItemList";
import { AlgaehLabel, AlagehFormGroup } from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import {
  ClearData,
  SaveDNEnrty,
  PurchaseOrderSearch,
  getCtrlCode,
  getPurchaseDetails,
  generateDeliveryNoteReceipt
} from "./DeliveryNoteEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import DNEntry from "../../../Models/DNEntry";
import MyContext from "../../../utils/MyContext";
import _ from "lodash";

// vendortexthandle,
//   loctexthandle,
//   texthandle,
//   poforhandle,
class DeliveryNoteEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let IOputs = DNEntry.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    this.props.getVendorMaster({
      uri: "/vendor/getVendorMaster",
      module: "masterSettings",
      method: "GET",
      data: { vendor_status: "A" },
      redux: {
        type: "VENDORS_GET_DATA",
        mappingName: "dnvendors"
      }
    });

    if (
      this.props.delivery_note_number !== undefined &&
      this.props.delivery_note_number.length !== 0
    ) {
      getCtrlCode(this, this.props.delivery_note_number);
    }

    debugger;
    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getPurchaseDetails(this, { purchase_number: this.props.purchase_number });
    }
  }

  render() {
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Delivery Note", align: "ltr" }}
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
                  label={{ forceLabel: "Delivery Note", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Delivery Number", returnText: true }}
              />
            ),
            value: this.state.delivery_note_number,
            selectValue: "delivery_note_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Delivery.DNEntry"
            },
            searchName: "DNEntry"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Delivery Date"
                  }}
                />
                <h6>
                  {this.state.dn_date
                    ? moment(this.state.dn_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.hims_f_inventory_consumption_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Receipt",
                      events: {
                        onClick: () => {
                          generateDeliveryNoteReceipt(this);
                        }
                      }
                    }
                  ]
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-delivery-note-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-2" }}
                  label={{
                    forceLabel: "Purchase Order No."
                  }}
                  textBox={{
                    value: this.state.purchase_number,
                    className: "txt-fld",
                    name: "purchase_number",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <div
                  className="col-lg-1"
                  style={{
                    paddingLeft: 0
                  }}
                >
                  <span
                    className="fas fa-search fa-2x"
                    style={{
                      fontSize: " 1.2rem",
                      marginTop: 26,
                      paddingBottom: 0,
                      pointerEvents:
                        this.state.dataExitst === true ? "none" : ""
                    }}
                    onClick={PurchaseOrderSearch.bind(this, this)}
                  />
                </div>
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Receipt For" }} />
                  <h6>
                    {this.state.dn_from
                      ? this.state.dn_from === "INV"
                        ? "Inventory"
                        : "Pharmacy"
                      : "------"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Location" }} />
                  <h6>
                    {this.state.location_name
                      ? this.state.location_name
                      : "------"}
                  </h6>
                </div>
                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Vendor" }} />
                  <h6>
                    {this.state.vendor_name ? this.state.vendor_name : "------"}
                  </h6>
                </div>

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Payment Terms" }} />
                  <h6>
                    {this.state.payment_terms
                      ? this.state.payment_terms
                      : "0 days"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: obj => {
                this.setState({ ...obj });
              }
            }}
          >
            <DNItemList DNEntry={this.state} />
          </MyContext.Provider>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SaveDNEnrty.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save",
                      returnText: true
                    }}
                  />
                </button>

                {this.state.fromPurList === false ? (
                  <button
                    type="button"
                    className="btn btn-default"
                    disabled={this.state.ClearDisable}
                    onClick={ClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    dnitemlist: state.dnitemlist,
    dnlocations: state.dnlocations,
    dnitemcategory: state.dnitemcategory,
    dnitemgroup: state.dnitemgroup,
    dnitemuom: state.dnitemuom,
    dnvendors: state.dnvendors,
    dnrequisitionentry: state.dnrequisitionentry,
    purchaseorderentry: state.purchaseorderentry
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getVendorMaster: AlgaehActions,
      getPurchaseOrderEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeliveryNoteEntry)
);
