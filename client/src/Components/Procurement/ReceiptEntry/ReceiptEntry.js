import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./ReceiptEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import ReceiptItemList from "./ReceiptItemList/ReceiptItemList";

import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  ClearData,
  SaveReceiptEnrty,
  DeliverySearch,
  getCtrlCode,
  PostReceiptEntry
} from "./ReceiptEntryEvent";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";
import ReceiptEntryInp from "../../../Models/ReceiptEntry";
import MyContext from "../../../utils/MyContext";

class ReceiptEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let IOputs = ReceiptEntryInp.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    this.props.getVendorMaster({
      uri: "/vendor/getVendorMaster",
      method: "GET",
      data: { vendor_status: "A" },
      redux: {
        type: "VENDORS_GET_DATA",
        mappingName: "receiptvendors"
      }
    });

    if (
      this.props.delivery_note_number !== undefined &&
      this.props.delivery_note_number.length !== 0
    ) {
      getCtrlCode(this, this.props.delivery_note_number);
    }
  }

  render() {
    const _mainStore = Enumerable.from(this.props.receiptlocations)
      .where(w => w.location_type === "MS")
      .toArray();
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Receipt Entry", align: "ltr" }}
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
                  label={{ forceLabel: "Receipt Entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "Receipt Number", returnText: true }}
              />
            ),
            value: this.state.grn_number,
            selectValue: "grn_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Receipt.ReceiptEntry"
            },
            searchName: "ReceiptEntry"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Receipt Date"
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
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-receipt-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "PO For" }}
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
                      disabled: this.state.dataExitst
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
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
                      disabled: this.state.dataExitst
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
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
                      disabled: this.state.dataExitst
                    },
                    onChange: vendortexthandle.bind(this, this),
                    onClear: vendortexthandle.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Delivery Note No."
                  }}
                  textBox={{
                    value: this.state.delivery_note_number,
                    className: "txt-fld",
                    name: "delivery_note_number",

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
                    onClick={DeliverySearch.bind(this, this)}
                  />
                </div>
              </div>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Payment Terms" }}
                  selector={{
                    name: "payment_terms",
                    className: "select-fld",
                    value: this.state.payment_terms,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PAYMENT_TERMS
                    },
                    others: {
                      disabled: this.state.dataExitst
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: texthandle.bind(this, this)
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
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
                {/* <div
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
              updateState: obj => {
                this.setState({ ...obj });
              }
            }}
          >
            <ReceiptItemList ReceiptEntryInp={this.state} />
          </MyContext.Provider>

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
                      returnText: true
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
                      returnText: true
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
    receiptrequisitionentry: state.receiptrequisitionentry
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
      getVendorMaster: AlgaehActions
      // getReceiptEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReceiptEntry)
);
