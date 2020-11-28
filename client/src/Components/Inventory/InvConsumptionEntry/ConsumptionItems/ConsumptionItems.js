import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./ConsumptionItems.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";

import ConsumptionItemsEvents from "./ConsumptionItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Options from "../../../../Options.json";
import moment from "moment";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

class ConsumptionItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.ConsumptionIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.inventoryitemcategory === undefined ||
      this.props.inventoryitemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/inventory/getItemCategory",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "inventoryitemcategory",
        },
      });
    }

    if (
      this.props.inventoryitemgroup === undefined ||
      this.props.inventoryitemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/inventory/getItemGroup",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_GROUOP_GET_DATA",
          mappingName: "inventoryitemgroup",
        },
      });
    }

    if (
      this.props.inventoryitemuom === undefined ||
      this.props.inventoryitemuom.length === 0
    ) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom",
        },
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.ConsumptionIOputs);
  }
  itemchangeText(context, e, ctrl) {
    ConsumptionItemsEvents().itemchangeText(this, context, e, ctrl);
  }

  UomchangeTexts(context, e) {
    ConsumptionItemsEvents().UomchangeTexts(this, context, e);
  }
  numberchangeTexts(context, e) {
    ConsumptionItemsEvents().numberchangeTexts(this, context, e);
  }

  AddItems(context) {
    ConsumptionItemsEvents().AddItems(this, context);
  }
  dateFormater(date) {
    if (date !== null) {
      return String(moment(date).format(Options.dateFormat));
    }
  }
  deleteConsumptionDetail(context, row) {
    ConsumptionItemsEvents().deleteConsumptionDetail(this, context, row);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="hptl-phase1-requisition-item-form">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      {/* <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
                        label={{ forceLabel: "Item Name" }}
                        selector={{
                          name: "item_id",
                          className: "select-fld",
                          value: this.state.item_id,
                          dataSource: {
                            textField: "item_description",
                            valueField: "hims_d_inventory_item_master_id",
                            data: this.props.inventoryitemlist
                          },
                          others: {
                            disabled: this.state.ItemDisable
                          },
                          onChange: this.itemchangeText.bind(this, context)
                        }}
                      /> */}
                      <AlgaehAutoSearch
                        div={{ className: "col-12 form-group mandatory" }}
                        label={{ forceLabel: "Item Name", isImp: true }}
                        title="Search Items"
                        id="item_id_search"
                        template={(result) => {
                          return (
                            <section className="resultSecStyles">
                              <div className="row">
                                <div className="col-12">
                                  <h4 className="title">
                                    {result.item_description}
                                  </h4>
                                  <small>{result.uom_description}</small>
                                </div>
                              </div>
                            </section>
                          );
                        }}
                        name={"item_id"}
                        columns={spotlightSearch.Items.Invitemmaster}
                        displayField="item_description"
                        value={this.state.item_description}
                        searchName={"InventryForMaterialRequsition"}
                        onClick={this.itemchangeText.bind(this, context)}
                        onClear={() => {
                          this.setState({
                            item_description: "",
                            item_code: null,
                            item_category_id: null,
                            uom_id: null,
                            sales_uom: null,
                            item_group_id: null,
                            quantity: null,
                            addItemButton: true,
                            expiry_date: null,
                            batchno: null,
                            grn_no: null,
                            qtyhand: null,
                            barcode: null,
                            ItemUOM: []
                          });
                          context.updateState({
                            item_description: "",
                            item_code: null,
                            item_category_id: null,
                            uom_id: null,
                            sales_uom: null,
                            item_group_id: null,
                            quantity: null,
                            addItemButton: true,
                            expiry_date: null,
                            batchno: null,
                            grn_no: null,
                            qtyhand: null,
                            barcode: null,
                            ItemUOM: []
                          })
                        }}
                        others={{
                          disabled: this.state.ItemDisable,
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "UOM", isImp: true }}
                        selector={{
                          name: "uom_id",
                          className: "select-fld",
                          value: this.state.uom_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "uom_id",
                            data: this.state.ItemUOM,
                          },
                          others: {
                            disabled: true,
                          },

                          onChange: this.UomchangeTexts.bind(this, context),
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Batch No.",
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "batchno",
                          value: this.state.batchno,
                          events: {
                            onChange: null,
                          },
                          others: {
                            disabled: true,
                          },
                        }}
                      />
                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{ forceLabel: "Expiry Date" }}
                        textBox={{
                          className: "txt-fld",
                          name: "expiry_date",
                        }}
                        minDate={new Date()}
                        disabled={true}
                        events={{
                          onChange: null,
                        }}
                        value={this.state.expiry_date}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Quantity",
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          dontAllowKeys: ["-", "e", "."],
                          className: "txt-fld",
                          name: "quantity",
                          value: this.state.quantity,
                          events: {
                            onChange: this.numberchangeTexts.bind(
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled: this.state.ItemDisable,
                          },
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Qty In Hand",
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          className: "txt-fld",
                          name: "qtyhand",
                          value: this.state.qtyhand,
                          events: {
                            onChange: null,
                          },
                          others: {
                            disabled: true,
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 subFooter-btn">
                      <button
                        className="btn btn-primary"
                        onClick={this.AddItems.bind(this, context)}
                        disabled={this.state.addItemButton}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="COMSUMPTIONGrid"
                          columns={[
                            //
                            {
                              fieldName: "action",

                              label: (
                                <AlgaehLabel label={{ forceLabel: "action" }} />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-trash-alt"
                                      style={{
                                        pointerEvents:
                                          this.state.ItemDisable === true
                                            ? "none"
                                            : "",
                                        opacity:
                                          this.state.ItemDisable === true
                                            ? "0.1"
                                            : "",
                                      }}
                                      onClick={this.deleteConsumptionDetail.bind(
                                        this,
                                        context,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              others: {
                                maxWidth: 65,
                                resizable: false,
                                filterable: false,
                                style: { textAlign: "center" },
                              },
                            },
                            {
                              fieldName: "item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.inventoryitemlist === undefined
                                    ? []
                                    : this.props.inventoryitemlist.filter(
                                      (f) =>
                                        f.hims_d_inventory_item_master_id ===
                                        row.item_id
                                    );

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.inventoryitemcategory === undefined
                                    ? []
                                    : this.props.inventoryitemcategory.filter(
                                      (f) =>
                                        f.hims_d_inventory_tem_category_id ===
                                        row.item_category_id
                                    );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.inventoryitemgroup === undefined
                                    ? []
                                    : this.props.inventoryitemgroup.filter(
                                      (f) =>
                                        f.hims_d_inventory_item_group_id ===
                                        row.item_group_id
                                    );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "uom_id",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.inventoryitemuom === undefined
                                    ? []
                                    : this.props.inventoryitemuom.filter(
                                      (f) =>
                                        f.hims_d_inventory_uom_id ===
                                        row.uom_id
                                    );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "batchno",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Batch No." }}
                                />
                              ),
                              disabled: true,
                            },
                            {
                              fieldName: "expiry_date",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Expiry Date" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {this.dateFormater(row.expiry_date)}
                                  </span>
                                );
                              },
                              disabled: true,
                            },
                            {
                              fieldName: "quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity" }}
                                />
                              ),
                              disabled: true,
                            },
                            {
                              fieldName: "qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Qty in Hand" }}
                                />
                              ),
                              disabled: true,
                            },
                          ]}
                          keyId="consumption_id"
                          dataSource={{
                            data: this.state.inventory_stock_detail,
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{}}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    inventoryitemcategory: state.inventoryitemcategory,
    inventoryitemuom: state.inventoryitemuom,
    inventoryitemgroup: state.inventoryitemgroup,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ConsumptionItems)
);
