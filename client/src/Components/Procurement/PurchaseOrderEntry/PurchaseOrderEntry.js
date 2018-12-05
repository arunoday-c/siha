import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseOrderEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import POItemList from "./POItemList/POItemList";
import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  RequisitionSearch,
  ClearData,
  SavePOEnrty,
  getCtrlCode,
  AuthorizePOEntry
} from "./PurchaseOrderEntryEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import POEntry from "../../../Models/POEntry";
import Enumerable from "linq";

class PurchaseOrderEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let IOputs = POEntry.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    this.props.getVendorMaster({
      uri: "/vendor/getVendorMaster",
      method: "GET",
      data: { vendor_status: "A" },
      redux: {
        type: "VENDORS_GET_DATA",
        mappingName: "povendors"
      }
    });

    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_number);
    }
  }

  render() {
    const _mainStore = Enumerable.from(this.props.polocations)
      .where(w => w.location_type === "MS")
      .toArray();
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
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
                  label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "PO Number", returnText: true }}
              />
            ),
            value: this.state.purchase_number,
            selectValue: "purchase_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Purchase.POEntry"
            },
            searchName: "POEntry"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "PO Date"
                  }}
                />
                <h6>
                  {this.state.docdate
                    ? moment(this.state.docdate).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-purchase-order-entry">
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
                    name: "po_from",
                    className: "select-fld",
                    value: this.state.po_from,
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
                  label={{ forceLabel: "Location Code" }}
                  selector={{
                    name:
                      this.state.po_from === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.po_from === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.po_from === "PHR"
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
                  label={{ forceLabel: "Vendor No." }}
                  selector={{
                    name: "vendor_id",
                    className: "select-fld",
                    value: this.state.vendor_id,
                    dataSource: {
                      textField: "vendor_name",
                      valueField: "hims_d_vendor_id",
                      data: this.props.povendors
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
                    forceLabel: "Requisition No."
                  }}
                  textBox={{
                    value: this.state.material_requisition_number,
                    className: "txt-fld",
                    name: "material_requisition_number",

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
                    onClick={RequisitionSearch.bind(this, this)}
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
                  events={{
                    onChange: null
                  }}
                  disabled={this.state.dataExitst}
                  value={this.state.expected_date}
                />
                {/* <div
                  className="customCheckbox col-lg-3"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Pay by Cash"
                      checked={this.state.Cashchecked}
                      onChange={null}
                    />

                    <span style={{ fontSize: "0.8rem" }}>From Multiple Requisitions</span>
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
            <POItemList POEntry={this.state} />
          </MyContext.Provider>
        </div>

        <div className="hptl-phase1-footer">
          
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SavePOEnrty.bind(this, this)}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save Order",
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

                {this.props.purchase_auth === true ? (
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
                ) : null}
              </div>
            </div>
          
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    poitemlist: state.poitemlist,
    polocations: state.polocations,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
    povendors: state.povendors,
    porequisitionentry: state.porequisitionentry,
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
      getRequisitionEntry: AlgaehActions,
      getPurchaseOrderEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PurchaseOrderEntry)
);
