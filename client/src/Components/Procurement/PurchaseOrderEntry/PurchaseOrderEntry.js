import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseOrderEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
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
  AuthorizePOEntry,
  getVendorMaster,
  generatePOReceipt,
  generatePOReceiptNoPrice,
  clearItemDetails,
  VendorQuotationSearch,
  getPOOptions,
} from "./PurchaseOrderEntryEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import POEntry from "../../../Models/POEntry";
import Enumerable from "linq";
import { MainContext } from "algaeh-react-components/context";
import {
  AlgaehSecurityComponent,
  RawSecurityElement,
  RawSecurityComponent,
} from "algaeh-react-components";

class PurchaseOrderEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decimal_places: null,
      // po_auth_level: "1"
    };
    getVendorMaster(this, this);
    getPOOptions(this, this);
    RawSecurityComponent({ componentCode: "PUR_ORD_VIEW" }).then((result) => {
      console.log("result", result);
    });
  }

  UNSAFE_componentWillMount() {
    let IOputs = POEntry.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    this.setState({
      decimal_places: userToken.decimal_places,
    });
    if (
      this.props.purchase_number !== undefined &&
      this.props.purchase_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_number);
    }
  }

  render() {
    const _mainStore =
      this.state.po_from === null
        ? []
        : Enumerable.from(this.props.polocations)
            .where((w) => w.location_type === "WH")
            .toArray();

    const class_finder =
      this.state.dataFinder === true
        ? " disableFinder"
        : this.state.ReqData === true
        ? " disableFinder"
        : "";
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
                    align: "ltr",
                  }}
                />
              ),
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
                />
              ),
            },
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
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Purchase.POEntry",
            },
            searchName: "POEntry",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "PO Date",
                  }}
                />
                <h6>
                  {this.state.po_date
                    ? moment(this.state.po_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
              {this.state.dataExitst === true ? (
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "PO Status",
                    }}
                  />
                  <h6>
                    {this.state.is_posted === "N" ? (
                      <span className="badge badge-danger">Not Posted</span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "Y" ? (
                      <span className="badge badge-success">Authorized</span>
                    ) : this.state.authorize1 === "Y" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    ) : this.state.authorize1 === "N" &&
                      this.state.authorize2 === "N" ? (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        Posted/Pending For Authorize
                      </span>
                    )}
                  </h6>
                </div>
              ) : null}
            </div>
          }
          printArea={
            this.state.purchase_number !== null
              ? {
                  menuitems: [
                    {
                      label: "Receipt for Internal",
                      events: {
                        onClick: () => {
                          generatePOReceipt(this.state);
                        },
                      },
                    },
                    {
                      label: "Receipt for Vendor",
                      events: {
                        onClick: () => {
                          generatePOReceiptNoPrice(this.state);
                        },
                      },
                    },
                  ],
                }
              : ""
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
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "PO Type" }}
                  selector={{
                    name: "po_type",
                    className: "select-fld",
                    value: this.state.po_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_TYPE,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        po_type: "D",
                      });
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "PO For" }}
                  selector={{
                    name: "po_from",
                    className: "select-fld",
                    value: this.state.po_from,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: () => {
                      clearItemDetails(this, this);
                      this.setState({
                        po_from: null,
                        ReqData: true,
                        pharmcy_location_id: null,
                        inventory_location_id: null,
                      });
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
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
                      data: _mainStore,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        location_description: null,
                      });
                    },
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Vendor Name" }}
                  selector={{
                    name: "vendor_id",
                    className: "select-fld",
                    value: this.state.vendor_id,
                    dataSource: {
                      textField: "vendor_name",
                      valueField: "hims_d_vendor_id",
                      data: this.props.povendors,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: vendortexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        vendor_id: null,
                      });
                    },
                  }}
                />

                {this.state.po_type === "MR" ? (
                  <div className={"col-2 globalSearchCntr" + class_finder}>
                    <AlgaehLabel
                      label={{ forceLabel: "Search Requisition No." }}
                    />
                    <h6 onClick={RequisitionSearch.bind(this, this)}>
                      {this.state.material_requisition_number
                        ? this.state.material_requisition_number
                        : "Requisition No."}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                ) : this.state.po_type === "VQ" ? (
                  <div className={"col-2 globalSearchCntr" + class_finder}>
                    <AlgaehLabel
                      label={{ forceLabel: "Search Vendor Quotation No." }}
                    />
                    <h6 onClick={VendorQuotationSearch.bind(this, this)}>
                      {this.state.vendor_quotation_number
                        ? this.state.vendor_quotation_number
                        : "Vendor Quotation No."}
                      <i className="fas fa-search fa-lg"></i>
                    </h6>
                  </div>
                ) : null}

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
                      data: GlobalVariables.PAYMENT_TERMS,
                    },
                    others: {
                      disabled:
                        this.state.po_entry_detail.length > 0 ? true : false,
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null,
                      });
                    },
                  }}
                />

                {/*
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "Expected Arrival" }}
                    textBox={{
                      className: "txt-fld",
                      name: "expected_date"
                    }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    disabled={this.state.dataExitst}
                    value={this.state.expected_date}
                  />
                  <div
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
              updateState: (obj) => {
                this.setState({ ...obj });
              },
            }}
          >
            <POItemList POEntry={this.state} />
          </MyContext.Provider>
        </div>

        <AlgaehSecurityComponent componentCode="PUR_ORD_MAINT">
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={SavePOEnrty.bind(this, this, "S")}
                  disabled={this.state.saveEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Save Order",
                      returnText: true,
                    }}
                  />
                </button>

                <button
                  type="button"
                  className="btn btn-other"
                  disabled={this.state.dataPosted}
                  onClick={SavePOEnrty.bind(this, this, "P")}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
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
                <AlgaehSecurityComponent componentCode="PUR_AUT_AUTH1">
                  {this.props.purchase_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize1 === "Y"
                          ? true
                          : false
                      }
                      onClick={AuthorizePOEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Authorize 1",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </AlgaehSecurityComponent>
                <AlgaehSecurityComponent componentCode="PUR_AUT_AUTH2">
                  {this.props.purchase_auth === true ? (
                    <button
                      type="button"
                      className="btn btn-other"
                      disabled={
                        this.state.authBtnEnable === true
                          ? true
                          : this.state.authorize2 === "Y"
                          ? true
                          : false
                      }
                      onClick={AuthorizePOEntry.bind(
                        this,
                        this,
                        this.state.authorize1 === "N"
                          ? "authorize1"
                          : "authorize2"
                      )}
                    >
                      <AlgaehLabel
                        label={{
                          forceLabel: "Authorize 2",
                          returnText: true,
                        }}
                      />
                    </button>
                  ) : null}
                </AlgaehSecurityComponent>
              </div>
            </div>
          </div>
        </AlgaehSecurityComponent>
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
    purchaseorderentry: state.purchaseorderentry,
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
      getPurchaseOrderEntry: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PurchaseOrderEntry)
);
