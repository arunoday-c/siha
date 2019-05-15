import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./RequisitionItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import {
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteRequisitionDetail,
  updatePosDetail,
  onchangegridcol,
  UomchangeTexts
} from "./RequisitionItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";

class RequisitionItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.RequisitionIOputs;
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
          mappingName: "inventoryitemcategory"
        }
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
          mappingName: "inventoryitemgroup"
        }
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
          mappingName: "inventoryitemuom"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.RequisitionIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-requisition-item-form">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-3" }}
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
                          onChange: itemchangeText.bind(this, this, context)
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-1" }}
                        label={{ forceLabel: "UOM", isImp: true }}
                        selector={{
                          name: "item_uom",
                          className: "select-fld",
                          value: this.state.item_uom,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "uom_id",
                            data: this.state.ItemUOM
                          },
                          others: {
                            disabled: this.state.ItemDisable
                          },

                          onChange: UomchangeTexts.bind(this, this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col-2" }}
                        label={{ forceLabel: "Item Category" }}
                        selector={{
                          name: "item_category_id",
                          className: "select-fld",
                          value: this.state.item_category_id,
                          dataSource: {
                            textField: "category_desc",
                            valueField: "hims_d_inventory_tem_category_id",
                            data: this.props.inventoryitemcategory
                          },
                          others: {
                            disabled: true
                          },
                          onChange: null
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col-2" }}
                        label={{ forceLabel: "Item Group" }}
                        selector={{
                          name: "item_group_id",
                          className: "select-fld",
                          value: this.state.item_group_id,
                          dataSource: {
                            textField: "group_description",
                            valueField: "hims_d_inventory_item_group_id",
                            data: this.props.inventoryitemgroup
                          },
                          others: {
                            disabled: true
                          },
                          onChange: null
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Quantity Required"
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          className: "txt-fld",
                          name: "quantity_required",
                          value: this.state.quantity_required,
                          events: {
                            onChange: numberchangeTexts.bind(
                              this,
                              this,
                              context
                            )
                          },
                          others: {
                            disabled: this.state.ItemDisable
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "To Qty In Hand"
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          className: "txt-fld",
                          name: "to_qtyhand",
                          value: this.state.to_qtyhand,
                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "From Qty In Hand"
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          className: "txt-fld",
                          name: "from_qtyhand",
                          value: this.state.from_qtyhand,
                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 subFooter-btn">
                      <button
                        className="btn btn-primary"
                        onClick={AddItems.bind(this, this, context)}
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
                          id="REQ_details"
                          columns={[
                            {
                              fieldName: "item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.inventoryitemlist === undefined
                                    ? []
                                    : this.props.inventoryitemlist.filter(
                                        f =>
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
                              editorTemplate: row => {
                                let display =
                                  this.props.inventoryitemlist === undefined
                                    ? []
                                    : this.props.inventoryitemlist.filter(
                                        f =>
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
                              }
                            },

                            {
                              fieldName: "item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.inventoryitemcategory === undefined
                                    ? []
                                    : this.props.inventoryitemcategory.filter(
                                        f =>
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
                              editorTemplate: row => {
                                let display =
                                  this.props.inventoryitemcategory === undefined
                                    ? []
                                    : this.props.inventoryitemcategory.filter(
                                        f =>
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
                              }
                            },

                            {
                              fieldName: "item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.inventoryitemgroup === undefined
                                    ? []
                                    : this.props.inventoryitemgroup.filter(
                                        f =>
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
                              editorTemplate: row => {
                                let display =
                                  this.props.inventoryitemgroup === undefined
                                    ? []
                                    : this.props.inventoryitemgroup.filter(
                                        f =>
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
                              }
                            },

                            {
                              fieldName: "item_uom",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.inventoryitemuom === undefined
                                    ? []
                                    : this.props.inventoryitemuom.filter(
                                        f =>
                                          f.hims_d_inventory_uom_id ===
                                          row.item_uom
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                let display =
                                  this.props.inventoryitemuom === undefined
                                    ? []
                                    : this.props.inventoryitemuom.filter(
                                        f =>
                                          f.hims_d_inventory_uom_id ===
                                          row.item_uom
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "to_qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Qty in Hand" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "from_qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Qty in Hand" }}
                                />
                              ),
                              disabled: true
                            },

                            {
                              fieldName: "quantity_required",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity Required" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "quantity_authorized",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Authorized"
                                  }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.quantity_authorized,
                                      className: "txt-fld",
                                      name: "quantity_authorized",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: this.state.authorizeEnable,
                                        type: "number",
                                        algaeh_required: "true",
                                        errormessage:
                                          "Please enter Quantity Authorized ..",
                                        checkvalidation:
                                          "value ==='' || value ==='0'"
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "quantity_outstanding",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity OutStanding" }}
                                />
                              ),
                              disabled: true
                            }
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.inventory_stock_detail
                          }}
                          isEditable={true}
                          datavalidate="id='REQ_details'"
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteRequisitionDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: row => {},
                            onDone: updatePosDetail.bind(this, this, context)
                          }}
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
    inventoryitemdetaillist: state.inventoryitemdetaillist,
    inventoryitemcategory: state.inventoryitemcategory,
    inventoryitemuom: state.inventoryitemuom,
    inventoryitemgroup: state.inventoryitemgroup,
    inventoryitemBatch: state.inventoryitemBatch
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequisitionItems)
);
