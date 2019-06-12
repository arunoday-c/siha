import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./TransferEntryItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";

import {
  onchangegridcol,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  dateFormater,
  getItemLocationStock,
  EditGrid,
  CancelGrid,
  AddSelectedBatches,
  itemchangeText,
  numberchangeTexts,
  ShowItemBatch,
  CloseItemBatch,
  AddItems
} from "./TransferEntryItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import _ from "lodash";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import ItemBatchs from "../ItemBatchs/ItemBatchs";

class TransferEntryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.TransferIOputs;
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
    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
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

    if (
      this.props.itemgroup === undefined ||
      this.props.itemgroup.length === 0
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.TransferIOputs);
  }

  CloseOrent(context) {
    debugger;
    this.setState({
      quantity_transferred: 0,
      item_details: null,
      batch_detail_view: false
    });

    if (context !== undefined) {
      context.updateState({
        quantity_transferred: 0,
        item_details: null,
        batch_detail_view: false
      });
    }
  }

  ChangesOrent(context, item) {
    debugger;
    let quantity_transferred = _.sumBy(item.batches, s =>
      parseFloat(s.quantity_transfer)
    );
    this.setState({
      quantity_transferred: quantity_transferred,
      item_details: item,
      batch_detail_view: true
    });

    if (context !== undefined) {
      context.updateState({
        quantity_transferred: quantity_transferred,
        item_details: item,
        batch_detail_view: true
      });
    }
  }

  render() {
    let item_name =
      this.state.item_details === null
        ? null
        : this.state.item_details.item_description;
    let qty_auth =
      this.state.item_details === null
        ? null
        : this.state.item_details.quantity_authorized;
    const inventory_location_id = this.state.from_location_id;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div>
              {this.state.direct_transfer === "Y" ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="row">
                        <AlgaehAutoSearch
                          div={{ className: "col-3" }}
                          label={{ forceLabel: "Item Name (Ctrl + i)" }}
                          title="Search Items"
                          id="item_id_search"
                          template={result => {
                            return (
                              <section className="resultSecStyles">
                                <div className="row">
                                  <div className="col-8">
                                    <h4 className="title">
                                      {result.item_description}
                                    </h4>
                                    <small>{result.uom_description}</small>
                                  </div>
                                </div>
                              </section>
                            );
                          }}
                          name="item_id"
                          columns={spotlightSearch.Items.Invitemmaster}
                          displayField="item_description"
                          value={this.state.item_description}
                          searchName="tranitemmaster"
                          extraParameters={{
                            inventory_location_id: inventory_location_id
                          }}
                          onClick={itemchangeText.bind(this, this, context)}
                          ref={attReg => {
                            this.attReg = attReg;
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Batch No."
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "batchno",
                            value: this.state.batchno,
                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col" }}
                          label={{ forceLabel: "Expiry Date" }}
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
                              data: this.state.ItemUOM
                            },
                            // onChange: UomchangeTexts.bind(this, this, context),
                            others: {
                              disabled: this.state.dataExitst,
                              tabIndex: "2"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Quantity"
                          }}
                          textBox={{
                            number: {
                              allowNegative: false,
                              thousandSeparator: ","
                            },
                            className: "txt-fld",
                            name: "quantity",
                            value: this.state.quantity,
                            events: {
                              onChange: numberchangeTexts.bind(
                                this,
                                this,
                                context
                              )
                            },
                            others: {
                              disabled: this.state.dataExitst,
                              tabIndex: "3"
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Quantity in Hand"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.qtyhand,
                            className: "txt-fld",
                            name: "qtyhand",

                            others: {
                              disabled: true
                            }
                          }}
                        />
                      </div>
                      <div className="row">
                        <div className="col-lg-12 subFooter-btn">
                          <button
                            className="btn btn-primary"
                            onClick={AddItems.bind(this, this, context)}
                            disabled={this.state.addItemButton}
                            tabIndex="5"
                          >
                            Add Item
                          </button>
                          <button
                            className="btn btn-default"
                            onClick={ShowItemBatch.bind(this, this)}
                            disabled={this.state.addItemButton}
                          >
                            Select Batch
                          </button>

                          <ItemBatchs
                            show={this.state.selectBatch}
                            onClose={CloseItemBatch.bind(this, this, context)}
                            selectedLang={this.state.selectedLang}
                            inputsparameters={{
                              item_id: this.state.item_id,
                              location_id: this.state.location_id,
                              Batch_Items: this.state.Batch_Items
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="portlet portlet-bordered margin-bottom-15">
                        <div className="portlet-body" id="REQ_batch_details">
                          <AlgaehDataGrid
                            id="REQ_batch_details"
                            columns={[
                              {
                                fieldName: "actions",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Action" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span
                                      onClick={deleteTransEntryDetail.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      )}
                                    >
                                      <i className="fas fa-trash-alt" />
                                    </span>
                                  );
                                }
                              },
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
                                    this.props.inventoryitemcategory ===
                                    undefined
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
                                    this.props.inventoryitemcategory ===
                                    undefined
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
                                    label={{ forceLabel: "Item Group" }}
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
                                fieldName: "batchno",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Batch No." }}
                                  />
                                ),
                                others: {
                                  minWidth: 150
                                }
                              },

                              {
                                fieldName: "expiry_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Expiry Date" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {dateFormater(this, row.expiry_date)}
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  return (
                                    <span>
                                      {dateFormater(this, row.expiry_date)}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "uom_transferred_id",
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
                                            row.uom_transferred_id
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
                                            row.uom_transferred_id
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
                                fieldName: "quantity_transfer",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Quantity Transfered"
                                    }}
                                  />
                                )
                              }
                            ]}
                            keyId="batch_details"
                            dataSource={{
                              data: this.state.inventory_stock_detail
                            }}
                            isEditable={false}
                            byForceEvents={true}
                            datavalidate="id='TRANS_details'"
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onDelete: deleteTransEntryDetail.bind(
                                this,
                                this,
                                context
                              ),
                              onEdit: EditGrid.bind(this, this, context),
                              onCancel: EditGrid.bind(this, this, context),
                              onDone: updateTransEntryDetail.bind(
                                this,
                                this,
                                context
                              )
                            }}
                            onRowSelect={row => {
                              getItemLocationStock(this, row);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-4">
                    <h4 style={{ marginBottom: 4 }}>Requested Items</h4>
                    <ul className="reqTransList">
                      {this.state.stock_detail.map((item, index) => {
                        return (
                          <li>
                            <div className="itemReq">
                              <h6>{item.item_description}</h6>
                              <span>
                                UOM: <span>{item.uom_description}</span>
                              </span>
                              <span>
                                Req. Qty:{" "}
                                <span>{item.quantity_authorized}</span>
                              </span>

                              <span>
                                Trans. Qty:{" "}
                                <span>{item.quantity_transferred}</span>
                              </span>
                              <span>
                                Out Std. Qty:
                                <span>{item.quantity_outstanding}</span>
                              </span>

                              <span>
                                Trans. Till Date:
                                <span>{item.transfer_to_date}</span>
                              </span>
                            </div>
                            <div className="itemAction">
                              <span>
                                <i
                                  className="fas fa-pen"
                                  style={{
                                    pointerEvents:
                                      this.state.cannotEdit === true
                                        ? "none"
                                        : "",
                                    opacity:
                                      this.state.cannotEdit === true
                                        ? "0.1"
                                        : ""
                                  }}
                                  onClick={this.ChangesOrent.bind(
                                    this,
                                    context,
                                    item
                                  )}
                                />
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {this.state.batch_detail_view === false ? (
                    <div className="col-8">
                      <div className="portlet portlet-bordered margin-bottom-15">
                        <div className="portlet-body" id="REQ_details_Cntr">
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
                                    this.props.inventoryitemcategory ===
                                    undefined
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
                                    this.props.inventoryitemcategory ===
                                    undefined
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
                                    label={{ forceLabel: "Item Group" }}
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
                                fieldName: "batchno",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Batch No." }}
                                  />
                                ),
                                others: {
                                  minWidth: 150
                                }
                              },

                              {
                                fieldName: "expiry_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Expiry Date" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {dateFormater(this, row.expiry_date)}
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  return (
                                    <span>
                                      {dateFormater(this, row.expiry_date)}
                                    </span>
                                  );
                                }
                              },
                              {
                                fieldName: "uom_requested_id",
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
                                            row.uom_requested_id
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
                                            row.uom_requested_id
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
                                fieldName: "quantity_requested",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity Requested" }}
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
                                disabled: true
                              },
                              {
                                fieldName: "quantity_transfer",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Quantity Transfered"
                                    }}
                                  />
                                )
                              }
                            ]}
                            keyId="service_type_id"
                            dataSource={{
                              data: this.state.inventory_stock_detail
                            }}
                            isEditable={false}
                            byForceEvents={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            datavalidate="id='INVTRANS_details'"
                            events={{
                              onDelete: deleteTransEntryDetail.bind(
                                this,
                                this,
                                context
                              ),
                              onEdit: EditGrid.bind(this, this, context),
                              onCancel: CancelGrid.bind(this, this, context),
                              onDone: updateTransEntryDetail.bind(
                                this,
                                this,
                                context
                              )
                            }}
                            onRowSelect={row => {
                              getItemLocationStock(this, row);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="col-8" style={{ paddingLeft: 0 }}>
                      <div className="portlet portlet-bordered margin-bottom-15">
                        <div className="row">
                          <div className="col">
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                            <h6>{item_name ? item_name : "----------"}</h6>
                          </div>

                          <div className="col">
                            <AlgaehLabel
                              label={{ forceLabel: "Required Qty" }}
                            />
                            <h6>{qty_auth ? qty_auth : "----------"}</h6>
                          </div>
                        </div>
                        {qty_auth < this.state.quantity_transferred
                          ? "Greater than required qty"
                          : null}
                        <div className="portlet-body">
                          <div className="row">
                            <div
                              className="col-12"
                              id="itemTransferMapGrid_Cntr"
                            >
                              <AlgaehDataGrid
                                id="itemTransferMapGrid"
                                datavalidate="itemTransferMapGrid"
                                columns={[
                                  {
                                    fieldName: "batchno",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Batch No" }}
                                      />
                                    )
                                  },
                                  {
                                    fieldName: "qtyhand",
                                    label: (
                                      <AlgaehLabel
                                        label={{
                                          forceLabel: "Qantity in Hand"
                                        }}
                                      />
                                    )
                                  },
                                  {
                                    fieldName: "expiry_date",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Expiry Date" }}
                                      />
                                    ),
                                    displayTemplate: row => {
                                      return (
                                        <span>
                                          {dateFormater(this, row.expiry_date)}
                                        </span>
                                      );
                                    }
                                  },
                                  {
                                    fieldName: "quantity_transfer",
                                    label: (
                                      <AlgaehLabel
                                        label={{
                                          forceLabel: "Transfering Qty"
                                        }}
                                      />
                                    ),
                                    displayTemplate: row => {
                                      return (
                                        <AlagehFormGroup
                                          div={{}}
                                          textBox={{
                                            value: row.quantity_transfer,
                                            className: "txt-fld",
                                            name: "quantity_transfer",
                                            events: {
                                              onChange: onchangegridcol.bind(
                                                this,
                                                this,
                                                context,
                                                row
                                              )
                                            },
                                            others: {
                                              type: "number",
                                              algaeh_required: "true",
                                              errormessage:
                                                "Please enter Transferred Quantity ..",
                                              checkvalidation:
                                                "value ==='' || value ==='0'"
                                            }
                                          }}
                                        />
                                      );
                                    }
                                  }
                                ]}
                                keyId=""
                                dataSource={{
                                  data:
                                    this.state.item_details == null
                                      ? []
                                      : this.state.item_details.batches
                                }}
                                isEditable={false}
                                paging={{ page: 0, rowsPerPage: 10 }}
                                events={{}}
                                others={{}}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <AlgaehLabel
                              label={{ forceLabel: "Transfer Qty" }}
                            />
                            <h6>
                              {this.state.quantity_transferred
                                ? this.state.quantity_transferred
                                : "----------"}
                            </h6>
                          </div>

                          <div className="col">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={AddSelectedBatches.bind(
                                this,
                                this,
                                context
                              )}
                              style={{
                                marginTop: 8,
                                float: "right",
                                marginLeft: 10
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-default"
                              onClick={this.CloseOrent.bind(this, context)}
                              style={{ marginTop: 8, float: "right" }}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
    invitemdetaillist: state.invitemdetaillist,
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
      getTransferData: AlgaehActions,
      getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferEntryItems)
);
