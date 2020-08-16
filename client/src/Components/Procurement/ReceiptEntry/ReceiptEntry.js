import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./ReceiptEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import ReceiptItemList from "./ReceiptItemList/ReceiptItemList";
import ReceiptServiceList from "./ReceiptServiceList";

import {
  texthandle,
  ClearData,
  SaveReceiptEnrty,
  getCtrlCode,
  PostReceiptEntry,
  PurchaseOrderSearch,
  datehandle,
  textEventhandle,
  generateReceiptEntryReport,
} from "./ReceiptEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import ReceiptEntryInp from "../../../Models/ReceiptEntry";
import MyContext from "../../../utils/MyContext";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";

class ReceiptEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let IOputs = ReceiptEntryInp.inputParam();
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
        mappingName: "receiptvendors",
      },
    });

    // if (
    //   this.props.delivery_note_number !== undefined &&
    //   this.props.delivery_note_number.length !== 0
    // ) {
    //   getCtrlCode(this, this.props.delivery_note_number);
    // }

    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("grn_number")) {
      getCtrlCode(this, queryParams.get("grn_number"));
    }
  }

  render() {
    const class_finder = this.state.dataExitst === true ? " disableFinder" : "";

    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Receipt Entry", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Home",
          //           align: "ltr",
          //         }}
          //       />
          //     ),
          //   },
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{ forceLabel: "Receipt Entry", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Receipt Number", returnText: true }}
              />
            ),
            value: this.state.grn_number,
            selectValue: "grn_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Receipt.ReceiptEntry",
            },
            searchName: "ReceiptEntry",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Receipt Date",
                  }}
                />
                <h6>
                  {this.state.grn_date
                    ? moment(this.state.grn_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.hims_f_procurement_po_header_id !== null
              ? {
                  menuitems: [
                    {
                      label: "Receipt Entry Report",
                      events: {
                        onClick: () => {
                          generateReceiptEntryReport(this.state);
                        },
                      },
                    },
                  ],
                }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-receipt-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <div className="col-2 form-group">
                  <label>Receipt Mode</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="I"
                        name="receipt_mode"
                        checked={this.state.receipt_mode === "I" ? true : false}
                        onChange={texthandle.bind(this, this)}
                        disabled={this.state.dataExitst}
                      />
                      <span>Item</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="S"
                        name="receipt_mode"
                        checked={this.state.receipt_mode === "S" ? true : false}
                        onChange={texthandle.bind(this, this)}
                        disabled={this.state.dataExitst}
                      />
                      <span>Service</span>
                    </label>
                  </div>
                </div>
                <div
                  className={"col-2 globalSearchCntr mandatory" + class_finder}
                >
                  <AlgaehLabel
                    label={{ forceLabel: "Search Purchase Order No." }}
                  />
                  <h6 onClick={PurchaseOrderSearch.bind(this, this)}>
                    {this.state.purchase_number
                      ? this.state.purchase_number
                      : "Purchase Order No."}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                {this.state.receipt_mode === "I" ? (
                  <div className="col-6">
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Receipt For" }} />
                        <h6>
                          {this.state.grn_for
                            ? this.state.grn_for === "INV"
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
                    </div>
                  </div>
                ) : (
                  <div className="col-6">
                    <div className="row">
                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Branch" }} />
                        <h6>
                          {this.state.hospital_name
                            ? this.state.hospital_name
                            : "------"}
                        </h6>
                      </div>

                      <div className="col">
                        <AlgaehLabel label={{ forceLabel: "Project" }} />
                        <h6>
                          {this.state.project_desc
                            ? this.state.project_desc
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                )}

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Vendor" }} />
                  <h6>
                    {this.state.vendor_name ? this.state.vendor_name : "------"}
                  </h6>
                </div>

                {/*<AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Receipt For" }}
                  selector={{
                    name: "grn_for",
                    className: "select-fld",
                    value: this.state.grn_for,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM
                    },
                    others: {
                      disabled:
                        this.state.poSelected === true
                          ? this.state.poSelected
                          : this.state.dataExitst
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name:
                      this.state.grn_for === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.grn_for === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.grn_for === "PHR"
                          ? "hims_d_pharmacy_location_id"
                          : "hims_d_inventory_location_id",
                      data: _mainStore
                    },
                    others: {
                      disabled:
                        this.state.poSelected === true
                          ? this.state.poSelected
                          : this.state.dataExitst
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Vendor" }}
                  selector={{
                    name: "vendor_id",
                    className: "select-fld",
                    value: this.state.vendor_id,
                    dataSource: {
                      textField: "vendor_name",
                      valueField: "hims_d_vendor_id",
                      data: this.props.receiptvendors
                    },
                    others: {
                      disabled: true
                    },
                    onChange: vendortexthandle.bind(this, this),
                    onClear: vendortexthandle.bind(this, this)
                  }}
                />*/}

                <div className="col-2">
                  <AlgaehLabel label={{ forceLabel: "Payment Terms" }} />
                  <h6>
                    {this.state.payment_terms
                      ? this.state.payment_terms + " days"
                      : "0 days"}
                  </h6>
                </div>

                <AlagehFormGroup
                  div={{ className: "col-2 mandatory" }}
                  label={{
                    forceLabel: "Invoice No.",
                    isImp: true,
                  }}
                  textBox={{
                    value: this.state.inovice_number,
                    className: "txt-fld",
                    name: "inovice_number",

                    events: {
                      onChange: textEventhandle.bind(this, this),
                    },
                    others: {
                      disabled: this.state.dataExitst,
                    },
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-2 mandatory" }}
                  label={{ forceLabel: "Invoice Date", isImp: true }}
                  textBox={{
                    className: "txt-fld",
                    name: "invoice_date",
                  }}
                  // minDate={new Date()}
                  disabled={this.state.dataExitst}
                  events={{
                    onChange: datehandle.bind(this, this),
                    // onBlur: dateValidate.bind(this, this)
                  }}
                  value={this.state.invoice_date}
                />

                {/*    <AlgaehDateHandler
                  div={{ className: "col" }}
                  label={{ forceLabel: "Expected Arrival" }}
                  textBox={{
                    className: "txt-fld",
                    name: "expiry_date"
                  }}
                  minDate={new Date()}
                  disabled={true}
                  events={{
                    onChange: null
                  }}
                  value={this.state.expiry_date}
                />
                <div
                  className="customCheckbox col-lg-3"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Multiple PO"
                      checked={this.state.Cashchecked}
                      onChange={null}
                    />

                    <span style={{ fontSize: "0.8rem" }}>From Multiple PO</span>
                  </label>
                </div> */}
              </div>
            </div>
          </div>

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: (obj) => {
                this.setState({ ...obj });
              },
            }}
          >
            {this.state.receipt_mode === "S" ? (
              <div className="row">
                {" "}
                <ReceiptServiceList ReceiptEntryInp={this.state} />
              </div>
            ) : (
              <ReceiptItemList ReceiptEntryInp={this.state} />
            )}
          </MyContext.Provider>

          <div className="col-12">
            <div className="row" style={{ marginBottom: 55 }}>
              <div className="col" />

              <div className="col-lg-5" style={{ textAlign: "right" }}>
                <div className="row">
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Sub Total",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                  </div>
                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Discount Amount",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.detail_discount)}</h6>
                  </div>

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Tax",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.total_tax)}</h6>
                  </div>

                  <div className="col-lg-3">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Net Payable",
                      }}
                    />
                    <h6>{GetAmountFormart(this.state.net_payable)}</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SaveReceiptEnrty.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save",
                      returnText: true,
                    }}
                  />
                </button>

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
                <button
                  type="button"
                  className="btn btn-other"
                  disabled={this.state.postEnable}
                  onClick={PostReceiptEntry.bind(this, this)}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
                      returnText: true,
                    }}
                  />
                </button>
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
    receiptitemlist: state.receiptitemlist,
    receiptlocations: state.receiptlocations,
    receiptitemcategory: state.receiptitemcategory,
    receiptitemgroup: state.receiptitemgroup,
    receiptitemuom: state.receiptitemuom,
    receiptvendors: state.receiptvendors,
    receiptrequisitionentry: state.receiptrequisitionentry,
    // receiptentry: state.receiptentry
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
      // getReceiptEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReceiptEntry)
);
