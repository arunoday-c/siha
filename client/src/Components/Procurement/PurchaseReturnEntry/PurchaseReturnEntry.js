import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./PurchaseReturnEntry.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  vendortexthandle,
  loctexthandle,
  texthandle,
  poforhandle,
  ReceiptSearch,
  ClearData,
  SavePOReutrnEnrty,
  getCtrlCode,
  PostPOReturnEntry,
  getVendorMaster,
  generatePOReceipt,
  generatePOReceiptNoPrice,
  getData,
} from "./PurchaseReturnEntryEvent";
import { AlgaehActions } from "../../../actions/algaehActions";
import POReturnEntry from "../../../Models/POReturnEntry";
import Enumerable from "linq";
import POReturnItemList from "./POReturnItemList/POReturnItemList";
import { MainContext } from "algaeh-react-components";
import {
  AlgaehSecurityComponent,
  RawSecurityComponent,
} from "algaeh-react-components";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";

class PurchaseReturnEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      decimal_places: null,
      selectBatch: false,
    };
    getVendorMaster(this, this);

    RawSecurityComponent({ componentCode: "PUR_RTN_INVENTORY" }).then(
      (result) => {
        if (result === "show") {
          getData(this, "INV");
          this.setState({ po_return_from: "INV", ReqData: false });
        }
      }
    );

    RawSecurityComponent({ componentCode: "PUR_RTN_PHARMACY" }).then(
      (result) => {
        if (result === "show") {
          getData(this, "PHR");
          this.setState({ po_return_from: "PHR", ReqData: false });
        }
      }
    );
  }

  UNSAFE_componentWillMount() {
    let IOputs = POReturnEntry.inputParam();
    this.setState(IOputs);
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;
    if (
      this.props.purchase_return_number !== undefined &&
      this.props.purchase_return_number.length !== 0
    ) {
      getCtrlCode(this, this.props.purchase_return_number);
    }

    this.setState({
      decimal_places: userToken.decimal_places,
    });
    const queryParams = new URLSearchParams(this.props.location.search);
    if (queryParams.get("purchase_return_number")) {
      getCtrlCode(this, queryParams.get("purchase_return_number"));
    }

    getData(this, this.po_return_from);
  }

  render() {
    const _mainStore =
      this.state.po_return_from === null
        ? []
        : Enumerable.from(this.props.polocations)
            .where((w) => w.location_type === "WH")
            .toArray();

    const class_finder =
      this.state.dataFinder === true
        ? " disableFinder"
        : this.state.ReqData === false
        ? ""
        : " disableFinder";

    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Purchase Return Entry", align: "ltr" }}
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
          //         label={{ forceLabel: "Purchase Return Entry", align: "ltr" }}
          //       />
          //     ),
          //   },
          // ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "PO Return Number", returnText: true }}
              />
            ),
            value: this.state.purchase_return_number,
            selectValue: "purchase_return_number",
            events: {
              onChange: getCtrlCode.bind(this, this),
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Purchase.POReturnEntry",
            },
            searchName: "POReturnEntry",
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "PO Return Date",
                  }}
                />
                <h6>
                  {this.state.return_date
                    ? moment(this.state.return_date).format(Options.dateFormat)
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.purchase_return_number !== null
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
                  div={{ className: "col-2 mandatory" }}
                  label={{ forceLabel: "PO Return For", isImp: true }}
                  selector={{
                    name: "po_return_from",
                    className: "select-fld",
                    value: this.state.po_return_from,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.PO_FROM,
                    },
                    others: {
                      disabled: this.state.dataExitst,
                    },
                    onChange: poforhandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        po_return_from: null,
                        ReqData: true,
                        pharmcy_location_id: null,
                        inventory_location_id: null,
                      });
                    },
                  }}
                />
                <div className="col-2">
                  <label>Return Type</label>
                  <div className="customRadio">
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="R"
                        name="return_type"
                        checked={this.state.return_type === "R" ? true : false}
                        onChange={texthandle.bind(this, this)}
                        disabled={this.state.dataExitst}
                      />
                      <span>Receipt</span>
                    </label>
                    <label className="radio inline">
                      <input
                        type="radio"
                        value="D"
                        name="return_type"
                        checked={this.state.return_type === "D" ? true : false}
                        onChange={texthandle.bind(this, this)}
                        disabled={this.state.dataExitst}
                      />
                      <span>Direct</span>
                    </label>
                  </div>
                </div>
                {this.state.return_type === "R" ? (
                  <div className="col-5">
                    <div className="row">
                      <div className={"col-7 globalSearchCntr" + class_finder}>
                        <AlgaehLabel
                          label={{ forceLabel: "Search Receipt No." }}
                        />
                        <h6 onClick={ReceiptSearch.bind(this, this)}>
                          {this.state.grn_number
                            ? this.state.grn_number
                            : "Receipt No."}
                          <i className="fas fa-search fa-lg"></i>
                        </h6>
                      </div>

                      <div className="col-5">
                        <AlgaehLabel label={{ forceLabel: "Invoice Number" }} />
                        <h6>
                          {this.state.inovice_number
                            ? this.state.inovice_number
                            : "------"}
                        </h6>
                      </div>
                    </div>
                  </div>
                ) : (
                  <AlagehAutoComplete
                    div={{ className: "col-2 mandatory" }}
                    label={{ forceLabel: "Return Item", isImp: true }}
                    selector={{
                      name: "return_items",
                      className: "select-fld",
                      value: this.state.return_items,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.RETURN_ITEM,
                      },
                      others: {
                        disabled: this.state.dataAdded,
                      },
                      onChange: (e) => {
                        debugger;
                        let name = e.name || e.target.name;
                        let value = e.value || e.target.value;

                        this.setState({
                          [name]: value,
                          pharmcy_location_id: null,
                          inventory_location_id: null,
                          vendor_id: null,
                          item_id: null,
                          item_category: null,
                          uom_id: null,
                          service_id: null,
                          item_group_id: null,
                          quantity: 0,
                          expiry_date: null,
                          batchno: null,
                          grn_no: null,
                          qtyhand: null,
                          barcode: null,
                          ItemUOM: [],
                          Batch_Items: [],
                          addItemButton: true,
                          item_description: "",
                          sales_uom_id: null,
                          sales_conversion_factor: null,
                          uom_description: null,
                          stocking_uom: null,
                          conversion_factor: null,
                          sales_qtyhand: null,
                          stocking_uom_id: null,
                          average_cost: null,
                          unit_cost: 0,
                          Real_unit_cost: 0,
                        });
                      },
                      onClear: () => {
                        this.setState({
                          return_items: null,
                        });
                      },
                    }}
                  />

                  // <div className="col-2">
                  //   <label>Expiry Items</label>
                  //   <div className="customRadio">
                  //     <label className="radio inline">
                  //       <input
                  //         type="radio"
                  //         value="R"
                  //         name="return_items"
                  //         checked={
                  //           this.state.return_items === "R" ? true : false
                  //         }
                  //         onChange={texthandle.bind(this, this)}
                  //         disabled={this.state.dataExitst}
                  //       />
                  //       <span>Return Items</span>
                  //     </label>
                  //     <label className="radio inline">
                  //       <input
                  //         type="radio"
                  //         value="E"
                  //         name="return_items"
                  //         checked={
                  //           this.state.return_items === "E" ? true : false
                  //         }
                  //         onChange={texthandle.bind(this, this)}
                  //         disabled={this.state.dataExitst}
                  //       />
                  //       <span>Return Expiry Items</span>
                  //     </label>
                  //     <label className="radio inline">
                  //       <input
                  //         type="radio"
                  //         value="D"
                  //         name="return_items"
                  //         checked={
                  //           this.state.return_items === "D" ? true : false
                  //         }
                  //         onChange={texthandle.bind(this, this)}
                  //         disabled={this.state.dataExitst}
                  //       />
                  //       <span>Dispose Expiry Items</span>
                  //     </label>
                  //   </div>
                  // </div>
                )}

                <AlagehAutoComplete
                  div={{ className: "col-3 mandatory" }}
                  label={{ forceLabel: "Location Code", isImp: true }}
                  selector={{
                    name:
                      this.state.po_return_from === "PHR"
                        ? "pharmcy_location_id"
                        : "inventory_location_id",
                    className: "select-fld",
                    value:
                      this.state.po_return_from === "PHR"
                        ? this.state.pharmcy_location_id
                        : this.state.inventory_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField:
                        this.state.po_return_from === "PHR"
                          ? "hims_d_pharmacy_location_id"
                          : "hims_d_inventory_location_id",
                      data: _mainStore,
                    },
                    others: {
                      disabled: this.state.dataAdded,
                    },
                    onChange: loctexthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        location_description: null,
                        pharmcy_location_id: null,
                        inventory_location_id: null,
                      });
                    },
                  }}
                />

                {this.state.return_items === "D" ? null : (
                  <>
                    <AlagehFormGroup
                      div={{ className: "col-2 mandatory" }}
                      label={{
                        forceLabel: "Return Reference No.",
                        isImp: this.state.return_items === "D" ? false : true,
                      }}
                      textBox={{
                        value: this.state.return_ref_no,
                        className: "txt-fld",
                        name: "return_ref_no",

                        events: {
                          onChange: texthandle.bind(this, this),
                        },
                        others: {
                          disabled: this.state.is_posted === "N" ? false : true,
                        },
                      }}
                    />

                    <AlagehAutoComplete
                      div={{ className: "col-3 mandatory" }}
                      label={{
                        forceLabel: "Vendor Name",
                        isImp: this.state.return_items === "D" ? false : true,
                      }}
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
                          disabled: this.state.dataExitst,
                        },
                        onChange: vendortexthandle.bind(this, this),
                        onClear: () => {
                          this.setState({
                            vendor_id: null,
                          });
                        },
                      }}
                    />
                  </>
                )}

                {/* <AlagehFormGroup
                                    div={{ className: "col-2" }}
                                    label={{
                                        forceLabel: "Receipt Number"
                                    }}
                                    textBox={{
                                        value: this.state.grn_number,
                                        className: "txt-fld",
                                        name: "grn_number",

                                        events: {
                                            onChange: null
                                        },
                                        others: {
                                            disabled: true
                                        }
                                    }}
                                />
                                <div
                                    className="col"
                                    style={{
                                        paddingLeft: 0,
                                        paddingRight: 0
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
                                        onClick={ReceiptSearch.bind(this, this)}
                                    />
                                </div> */}
                {/* <AlagehAutoComplete
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
                      disabled: true,
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        payment_terms: null,
                      });
                    },
                  }}
                /> */}
              </div>
            </div>
          </div>

          {this.state.is_revert === "Y" ? (
            <div className="alert alert-danger">
              <div className="row">
                <div className="col">
                  <p>
                    Reason:<b>{this.state.revert_reason}</b>
                  </p>
                </div>
                <div className="col-4">
                  <p>
                    Reverted By:<b>{this.state.reverted_name}</b>
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <MyContext.Provider
            value={{
              state: this.state,
              updateState: (obj) => {
                this.setState({ ...obj });
              },
            }}
          >
            <POReturnItemList POReturnEntry={this.state} />
          </MyContext.Provider>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div style={{ marginBottom: 73, textAlign: "right" }}>
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Receipt Net Payable",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.receipt_net_payable)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Return Sub Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Discount Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
                </div>
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Return Net Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.net_total)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Tax Amount",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.tax_amount)}</h6>
                </div>

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Return Total",
                    }}
                  />
                  <h6>{GetAmountFormart(this.state.return_total)}</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-lg-12">
          <div className="row" style={{ textAlign: "right" }}>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Receipt Net Payable",
                }}
              />
              <h6>
                {GetAmountFormart(this.state.receipt_net_payable)}
              </h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Return Sub Total",
                }}
              />
              <h6>{GetAmountFormart(this.state.sub_total)}</h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Discount Amount",
                }}
              />
              <h6>{GetAmountFormart(this.state.discount_amount)}</h6>
            </div>
            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Return Net Total",
                }}
              />
              <h6>{GetAmountFormart(this.state.net_total)}</h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Tax Amount",
                }}
              />
              <h6>{GetAmountFormart(this.state.tax_amount)}</h6>
            </div>

            <div className="col">
              <AlgaehLabel
                label={{
                  forceLabel: "Return Total",
                }}
              />
              <h6>{GetAmountFormart(this.state.return_total)}</h6>
            </div>
          </div>
        </div> */}

        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={SavePOReutrnEnrty.bind(this, this)}
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

              <AlgaehSecurityComponent componentCode="PUR_RET_POST">
                <button
                  type="button"
                  className="btn btn-other"
                  onClick={PostPOReturnEntry.bind(this, this)}
                  disabled={this.state.postEnable}
                >
                  <AlgaehLabel
                    label={{
                      forceLabel: "Post",
                      returnText: true,
                    }}
                  />
                </button>
              </AlgaehSecurityComponent>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    polocations: state.polocations,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
    povendors: state.povendors,
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
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PurchaseReturnEntry)
);
