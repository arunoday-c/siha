import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Enumerable from "linq";
import "./ItemSetup.css";
import "../../styles/site.css";
import { AlgaehLabel, AlgaehDataGrid } from "../Wrapper/algaehWrapper";

import ItemMaster from "./ItemMaster/ItemMaster";
import { AlgaehActions } from "../../actions/algaehActions";
// import { getItems, EditItemMaster } from "./ItemSetupEvent";
import ItemSetupEvent from "./ItemSetupEvent";

class ItemSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      itemPop: {},
      addNew: true
    };
  }

  componentDidMount() {
    if (
      this.props.itemcategory === undefined ||
      this.props.itemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/pharmacy/getItemCategory",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "itemcategory"
        }
      });
    }
    if (
      this.props.itemgroup === undefined ||
      this.props.itemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/pharmacy/getItemGroup",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GROUOP_GET_DATA",
          mappingName: "itemgroup"
        }
      });
    }

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom"
        }
      });
    }

    if (
      this.props.itemgeneric === undefined ||
      this.props.itemgeneric.length === 0
    ) {
      this.props.getItemGeneric({
        uri: "/pharmacy/getItemGeneric",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GENERIC_GET_DATA",
          mappingName: "itemgeneric"
        }
      });
    }
    if (this.props.itemform === undefined || this.props.itemform.length === 0) {
      this.props.getItemForm({
        uri: "/pharmacy/getItemForm",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_FORM_GET_DATA",
          mappingName: "itemform"
        }
      });
    }
    if (
      this.props.itemstorage === undefined ||
      this.props.itemstorage.length === 0
    ) {
      this.props.getItemStorage({
        uri: "/pharmacy/getItemStorage",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "itemstorage"
        }
      });
    }
    if (
      this.props.itemservices === undefined ||
      this.props.itemservices.length === 0
    ) {
      this.props.getServices({
        uri: "/serviceType/getService",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SERVICES_GET_DATA",
          mappingName: "itemservices"
        }
      });
    }

    if (this.props.sfda === undefined || this.props.sfda.length === 0) {
      this.props.getSFDA({
        uri: "/sfda/getSFDA",
        module: "masterSettings",
        method: "GET",
        redux: {
          type: "SFDA_GET_DATA",
          mappingName: "sfda"
        }
      });
    }

    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      ItemSetupEvent().getItems(this, this);
    }
  }

  ShowModel(e) {
    this.setState({
      ...this.state,
      isOpen: !this.state.isOpen,
      itemPop: {}
    });
  }

  CloseModel(e) {
    this.setState(
      {
        ...this.state,
        isOpen: !this.state.isOpen,
        itemPop: {}
      },
      () => {
        if (e === true) {
          ItemSetupEvent().getItems(this, this);
        }
      }
    );
  }

  render() {
    let ItemList = Enumerable.from(this.props.itemlist)
      .groupBy("$.hims_d_item_master_id", null, (k, g) => {
        let firstRecordSet = Enumerable.from(g).firstOrDefault();

        return {
          item_code: firstRecordSet.item_code,
          hims_d_item_master_id: firstRecordSet.hims_d_item_master_id,
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
          detail_item_uom:
            firstRecordSet.hims_m_item_uom_id === null ? [] : g.getSource()
        };
      })
      .toArray();
    return (
      <div className="hims_item_setup">
        <div className="portlet portlet-bordered margin-bottom-15 margin-top-15">
          <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Item List</h3>
            </div>
            <div className="actions">
              <a
                // href
                className="btn btn-primary btn-circle active"
                onClick={this.ShowModel.bind(this)}
              >
                <i className="fas fa-plus" />
              </a>
              <ItemMaster
                HeaderCaption={
                  <AlgaehLabel
                    label={{
                      fieldName: "item_setup",
                      align: "ltr"
                    }}
                  />
                }
                open={this.state.isOpen}
                onClose={this.CloseModel.bind(this)}
                itemPop={this.state.itemPop}
                addNew={this.state.addNew}
              />
            </div>
          </div>
          <div className="portlet-body">
            <div className="row">
              <div className="col-lg-12" id="itemSetupGrid">
                <AlgaehDataGrid
                  id="item_grid"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ fieldName: "action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-pen"
                              onClick={ItemSetupEvent().EditItemMaster.bind(
                                this,
                                this,
                                row
                              )}
                            />
                          </span>
                        );
                      },
                      others: {
                        maxWidth: 55,
                        style: {
                          textAlign: "center"
                        },
                        filterable: false
                      }
                    },

                    {
                      fieldName: "item_code",
                      label: <AlgaehLabel label={{ forceLabel: "Item Code" }} />
                    },
                    {
                      fieldName: "item_description",
                      label: (
                        <AlgaehLabel
                          label={{ fieldName: "item_description" }}
                        />
                      )
                    },
                    {
                      fieldName: "generic_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "generic_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemgeneric === undefined
                            ? []
                            : this.props.itemgeneric.filter(
                                f => f.hims_d_item_generic_id === row.generic_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].generic_name
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "category_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "category_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemcategory === undefined
                            ? []
                            : this.props.itemcategory.filter(
                                f =>
                                  f.hims_d_item_category_id === row.category_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].category_desc
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "group_id",
                      label: <AlgaehLabel label={{ fieldName: "group_id" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.itemgroup === undefined
                            ? []
                            : this.props.itemgroup.filter(
                                f => f.hims_d_item_group_id === row.group_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].group_description
                              : ""}
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "purchase_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "purchase_uom_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                                f =>
                                  f.hims_d_pharmacy_uom_id ===
                                  row.purchase_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "sales_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "sales_uom_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                                f =>
                                  f.hims_d_pharmacy_uom_id === row.sales_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "stocking_uom_id",
                      label: (
                        <AlgaehLabel label={{ fieldName: "stocking_uom_id" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                                f =>
                                  f.hims_d_pharmacy_uom_id ===
                                  row.stocking_uom_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      }
                    },

                    {
                      fieldName: "item_status",
                      label: (
                        <AlgaehLabel label={{ fieldName: "item_status" }} />
                      ),
                      displayTemplate: row => {
                        return row.item_status === "A" ? "Active" : "Inactive";
                      }
                    }
                  ]}
                  keyId="hims_d_item_master_id"
                  dataSource={{
                    data: ItemList
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                />
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
    itemlist: state.itemlist,
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    itemuom: state.itemuom,
    itemgeneric: state.itemgeneric,
    itemform: state.itemform,
    itemstorage: state.itemstorage,
    itemservices: state.itemservices,
    sfda: state.sfda
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemMaster: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getItemGeneric: AlgaehActions,
      getItemForm: AlgaehActions,
      getItemStorage: AlgaehActions,
      getServices: AlgaehActions,
      getSFDA: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemSetup)
);
