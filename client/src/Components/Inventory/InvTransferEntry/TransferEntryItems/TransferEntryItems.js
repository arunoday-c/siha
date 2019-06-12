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
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import {
  onchangegridcol,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  dateFormater,
  getItemLocationStock,
  EditGrid,
  CancelGrid,
  AddSelectedBatches
} from "./TransferEntryItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import _ from "lodash";

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
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
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
                            Req. Qty: <span>{item.quantity_authorized}</span>
                          </span>

                          <span>
                            Trans. Qty: <span>{item.quantity_transferred}</span>
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
                                  this.state.cannotEdit === true ? "none" : "",
                                opacity:
                                  this.state.cannotEdit === true ? "0.1" : ""
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
                                  {display !== undefined && display.length !== 0
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
                                  {display !== undefined && display.length !== 0
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
                        <AlgaehLabel label={{ forceLabel: "Required Qty" }} />
                        <h6>{qty_auth ? qty_auth : "----------"}</h6>
                      </div>
                    </div>
                    {qty_auth < this.state.quantity_transferred
                      ? "Greater than required qty"
                      : null}
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-12" id="itemTransferMapGrid_Cntr">
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
                                    label={{ forceLabel: "Qantity in Hand" }}
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
                                    label={{ forceLabel: "Transfering Qty" }}
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
                        <AlgaehLabel label={{ forceLabel: "Transfer Qty" }} />
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
                          onClick={AddSelectedBatches.bind(this, this, context)}
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
