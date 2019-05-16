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
  CancelGrid
} from "./TransferEntryItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";

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

  changeGridEditors(row, e) {
    debugger
    let inventory_stock_detail = this.state.inventory_stock_detail
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row["expiry_date"] = e.selected.expirydt;
    row["from_qtyhand"] = e.selected.qtyhand;
    row["unit_cost"] =  e.selected.avgcost

    for (let k = 0; k < inventory_stock_detail.length; k++) {
      if (inventory_stock_detail[k].item_id === row.item_id) {
        inventory_stock_detail[k] = row;
      }
    }

    this.setState({
      inventory_stock_detail:inventory_stock_detail
    })
  }

  clearGridEditors(row, e) {
    debugger
    let inventory_stock_detail = this.state.inventory_stock_detail

    row["batchno"] = null;
    row["expiry_date"] = null;
    row["from_qtyhand"] = null;
    row["unit_cost"] =  null;

    for (let k = 0; k < inventory_stock_detail.length; k++) {
      if (inventory_stock_detail[k].item_id === row.item_id) {
        inventory_stock_detail[k] = row;
      }
    }
    this.setState({
      inventory_stock_detail:inventory_stock_detail
    })
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="row">
              <div className="col-lg-12">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="portlet-body" id="REQ_details_Cntr">
                    <AlgaehDataGrid
                      id="REQ_details"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-trash-alt"
                                  aria-hidden="true"
                                  onClick={deleteTransEntryDetail.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            minWidth: 50,

                          }
                        },
                        {
                          fieldName: "item_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
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
                          fieldName: "to_qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "To Qty in Hand" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col" }}
                                selector={{
                                  name: "batchno",
                                  className: "select-fld",
                                  value: row.batchno,
                                  dataSource: {
                                    textField: "batchno",
                                    valueField: "batchno",
                                    data: this.state.Batch_Items
                                  },
                                  onChange: this.changeGridEditors.bind(this, row),
                                  onClear: this.clearGridEditors.bind(this, row),
                                }}
                              />
                            );
                          },
                          others: {
                            minWidth: 150,
                          }
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
                          fieldName: "expiry_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Expiry Date" }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{dateFormater(this, row.expiry_date)}</span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>{dateFormater(this, row.expiry_date)}</span>
                            );
                          }
                        },
                        {
                          fieldName: "uom_requested_id",
                          label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
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
                          fieldName: "quantity_transferred",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Quantity Transfered"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.quantity_transferred,
                                  className: "txt-fld",
                                  name: "quantity_transferred",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      context,
                                      row
                                    )
                                  },
                                  others:{
                                    type:"number",
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
                        },
                        {
                          fieldName: "quantity_outstanding",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Quantity Outstanding"
                              }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "transfer_to_date",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Transfer To Date"
                              }}
                            />
                          ),
                          disabled: true
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
                        onDone: updateTransEntryDetail.bind(this, this, context)
                      }}
                      onRowSelect={row => {
                        getItemLocationStock(this, row);
                      }}
                    />
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
