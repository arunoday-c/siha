import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Enumerable from "linq";
import "./InventoryItemMaster.scss";
import "../../styles/site.scss";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";

import ItemMaster from "./ItemMaster/ItemMaster";
import { AlgaehActions } from "../../actions/algaehActions";
import InvItemSetupEvent from "./InventoryItemMasterEvent";
import GlobalVariables from "../../utils/GlobalVariables.json";
import InvItemLocationReorder from "./InvItemLocationReorder";
import { MainContext } from "algaeh-react-components";

class InventoryItemMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      itemPop: {},
      addNew: true,
      isReQtyOpen: false,
    };
  }

  static contextType = MainContext;
  componentDidMount() {
    const userToken = this.context.userToken;

    this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "invitemcategory",
      },
    });

    this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUOP_GET_DATA",
        mappingName: "inventoryitemgroup",
      },
    });

    this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "inventoryitemuom",
      },
    });

    this.props.getServices({
      uri: "/serviceType/getService",
      module: "masterSettings",
      method: "GET",
      redux: {
        type: "SERVICES_GET_DATA",
        mappingName: "inventoryitemservices",
      },
    });

    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      data: {
        git_location: "N",
        location_status: "A",
        hospital_id: userToken.hims_d_hospital_id,
      },
      method: "GET",
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "inventorylocations",
      },
    });

    InvItemSetupEvent().getItems(this, this);
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      itemPop: {},
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        itemPop: {},
      },
      () => {
        if (e === true) {
          InvItemSetupEvent().getItems(this, this);
        }
      }
    );
  }

  CloseReQtyModel(e) {
    this.setState({ isReQtyOpen: !this.state.isReQtyOpen });
  }

  render() {
    let ItemList = Enumerable.from(this.props.inventoryitemlist)
      .groupBy("$.hims_d_inventory_item_master_id", null, (k, g) => {
        let firstRecordSet = Enumerable.from(g).firstOrDefault();
        return {
          item_code: firstRecordSet.item_code,
          hims_d_inventory_item_master_id:
            firstRecordSet.hims_d_inventory_item_master_id,
          item_description: firstRecordSet.item_description,
          generic_id: firstRecordSet.generic_id,
          category_id: firstRecordSet.category_id,
          group_id: firstRecordSet.group_id,
          form_id: firstRecordSet.form_id,
          storage_id: firstRecordSet.storage_id,
          item_uom_id: firstRecordSet.item_uom_id,
          purchase_uom_id: firstRecordSet.purchase_uom_id,
          sales_uom_id: firstRecordSet.sales_uom_id,
          stocking_uom_id: firstRecordSet.stocking_uom_id,
          item_status: firstRecordSet.item_status,
          radioActive: firstRecordSet.item_status === "A" ? true : false,
          radioInactive: firstRecordSet.item_status === "I" ? true : false,
          service_id: firstRecordSet.service_id,
          item_type: firstRecordSet.item_type,
          purchase_cost: firstRecordSet.purchase_cost,
          addl_information: firstRecordSet.addl_information,
          exp_date_required: firstRecordSet.exp_date_required,
          sfda_code: firstRecordSet.sfda_code,
          reorder_qty: firstRecordSet.reorder_qty,
          standard_fee: firstRecordSet.sales_price,
          vat_applicable: firstRecordSet.vat_applicable,
          vat_percent: firstRecordSet.vat_percent,
          arabic_item_description: firstRecordSet.arabic_item_description,
          detail_item_uom: g.getSource(),
        };
      })
      .toArray();
    return (
      <div className="hims_inventoryitem_setup">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Inventory Item List</h3>
            </div>
            <div className="actions">
              <button
                // href="javascript"
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </button>
              <ItemMaster
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "item_setup",
                      align: "ltr",
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                itemPop={this.state.itemPop}
                addNew={this.state.addNew}
              />

              <InvItemLocationReorder
                HeaderCaption="Reorder Location Wise"
                open={this.state.isReQtyOpen}
                item_description={this.state.item_description}
                item_id={this.state.item_id}
                reorder_locations={this.state.reorder_locations}
                onClose={this.CloseReQtyModel.bind(this)}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="InventoryItemMasterGrid">
                <AlgaehDataGrid
                  id="item_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={InvItemSetupEvent().EditItemMaster.bind(
                                this,
                                this,
                                row
                              )}
                            />

                            <i
                              className="fas fa-plus"
                              onClick={InvItemSetupEvent().OpenReQtyLocation.bind(
                                this,
                                this,
                                row
                              )}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 90,
                        style: {
                          textAlign: "center",
                        },
                        filterable: false,
                      },
                    },

                    {
                      fieldName: "item_code",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Code" }} />
                      ),
                    },
                    {
                      fieldName: "item_description",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "item_description" }}
                        />
                      ),
                    },
                    {
                      fieldName: "item_type",
                      label: <AlgaehLabel label={{ fieldName: "item_type" }} />,
                      displayTemplate: (row) => {
                        let display = GlobalVariables.ITEM_TYPE.filter(
                          (f) => f.value === row.item_type
                        );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].name
                              : ""}
                          </span>
                        );
                      },
                    },

                    {
                      fieldName: "category_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "category_id" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.invitemcategory === undefined
                            ? []
                            : this.props.invitemcategory.filter(
                                (f) =>
                                  f.hims_d_inventory_tem_category_id ===
                                  row.category_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].category_desc
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "group_id",
                      label: <AlgaehLabel label={{ fieldName: "group_id" }} />,
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemgroup === undefined
                            ? []
                            : this.props.inventoryitemgroup.filter(
                                (f) =>
                                  f.hims_d_inventory_item_group_id ===
                                  row.group_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].group_description
                              : ""}
                          </span>
                        );
                      },
                    },

                    {
                      fieldName: "purchase_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "purchase_uom_id" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id ===
                                  row.purchase_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "sales_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sales_uom_id" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id === row.sales_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "stocking_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "stocking_uom_id" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id ===
                                  row.stocking_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                    },

                    {
                      fieldName: "item_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "item_status" }} />
                      ),
                      displayTemplate: (row) => {
                        return row.item_status === "A" ? "Active" : "Inactive";
                      },
                    },
                  ]}
                  keyId="hims_d_inventory_item_master_id"
                  dataSource={{
                    data: ItemList,
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button type="button" className="btn btn-default">
                Export as PDF
              </button>
              <button type="button" className="btn btn-default">
                Export as Excel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    invitemcategory: state.invitemcategory,
    inventoryitemgroup: state.inventoryitemgroup,
    inventoryitemuom: state.inventoryitemuom,
    inventoryitemservices: state.inventoryitemservices,
    inventorylocations: state.inventorylocations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemMaster: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getServices: AlgaehActions,
      getLocation: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InventoryItemMaster)
);
