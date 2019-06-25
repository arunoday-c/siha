import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./DeliveryNoteEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import DNItemList from "./DNItemList/DNItemList";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  ClearData,
  SaveDNEnrty,
  PurchaseOrderSearch,
  getCtrlCode,
  getPurchaseDetails
} from "./DeliveryNoteEntryEvent";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import DNEntry from "../../../Models/DNEntry";
import MyContext from "../../../utils/MyContext";
import AlgaehReport from "../../Wrapper/printReports";
import _ from "lodash";

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

    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getPurchaseDetails(this, this.props.purchase_number);
    }
  }

  render() {
    const _mainStore = Enumerable.from(this.props.dnlocations)
      .where(w => w.location_type === "WH")
      .toArray();

    const Location_data =
      this.state.dn_from === "PHR"
        ? this.state.pharmcy_location_id !== null
          ? _.filter(_mainStore, f => {
              return (
                f.hims_d_pharmacy_location_id === this.state.pharmcy_location_id
              );
            })
          : []
        : this.state.inventory_location_id !== null
        ? _.filter(_mainStore, f => {
            return (
              f.hims_d_inventory_location_id ===
              this.state.inventory_location_id
            );
          })
        : [];

    const Vendor_data = _.filter(this.props.dnvendors, f => {
      return f.hims_d_vendor_id === this.state.vendor_id;
    });

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
            this.state.delivery_note_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Print Report",
                      events: {
                        onClick: () => {
                          AlgaehReport({
                            report: {
                              fileName: "Procurement/DeliveryNoteEntry"
                            },
                            data: {
                              delivery_note_number: this.state
                                .delivery_note_number,
                              dn_date: moment(this.state.dn_date).format(
                                Options.datetimeFormat
                              ),
                              dn_from:
                                this.state.dn_from === "PHR"
                                  ? "Pharmacy"
                                  : "Inventory",

                              from_location:
                                Location_data.length > 0
                                  ? Location_data[0].location_description
                                  : "",
                              vendor_name: Vendor_data[0].vendor_name,
                              vendor_trn:
                                Vendor_data[0].business_registration_no,
                              purchase_number: this.state.purchase_number,
                              dn_detail: this.state.dn_entry_detail
                            }
                          });
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
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Delivery Note For" }}
                  selector={{
                    name: "dn_from",
                    className: "select-fld",
                    value: this.state.dn_from,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM
                    },
                    others: {
                      disabled:
                        this.state.fromPurList === true
                          ? true
                          : this.state.dataExitst
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Location Code" }}
                  selector={{
                    name:
                      this.state.dn_from === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.dn_from === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.dn_from === "PHR"
                          ? "hims_d_pharmacy_location_id"
                          : "hims_d_inventory_location_id",
                      data: _mainStore
                    },
                    others: {
                      disabled:
                        this.state.fromPurList === true
                          ? true
                          : this.state.dataExitst
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />

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
                        this.state.dataExitst === true
                          ? "none"
                          : this.state.ReqData === true
                          ? "none"
                          : ""
                    }}
                    onClick={PurchaseOrderSearch.bind(this, this)}
                  />
                </div>
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Vendor No." }}
                  selector={{
                    name: "vendor_id",
                    className: "select-fld",
                    value: this.state.vendor_id,
                    dataSource: {
                      textField: "vendor_name",
                      valueField: "hims_d_vendor_id",
                      data: this.props.dnvendors
                    },
                    others: {
                      disabled: true
                    },
                    onChange: vendortexthandle.bind(this, this),
                    onClear: vendortexthandle.bind(this, this)
                  }}
                />

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Payment Terms" }} />
                  <h6>
                    {this.state.payment_terms
                      ? this.state.payment_terms
                      : "0 days"}
                  </h6>
                </div>

                {/*<div className="col">
                  <AlgaehLabel label={{ forceLabel: "Expected Arrival" }} />
                  <h6>
                    {this.state.expiry_date
                      ? moment(this.state.expiry_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>*/}
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

                {/* <button
                  type="button"
                  className="btn btn-other"
                  disabled={this.state.postEnable}
                  onClick={PostDnEntry.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
                      returnText: true
                    }}
                  />
                </button> */}

                {/* {this.props.purchase_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={this.state.authorize1 === "Y" ? true : false}
                      onClick={AuthorizePOEntry.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Authorize",
                          returnText: true
                        }}
                      />
                    </button>
                  ) : null} */}
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
