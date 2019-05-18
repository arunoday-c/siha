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
  AddSelectedBatches
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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.TransferIOputs);
  }

  changeGridEditors(row, e) {
    debugger;
    let pharmacy_stock_detail = this.state.pharmacy_stock_detail;
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row["expiry_date"] = e.selected.expirydt;
    row["from_qtyhand"] = e.selected.qtyhand;
    row["unit_cost"] = e.selected.avgcost;
    row["grnno"] = e.selected.grnno;

    for (let k = 0; k < pharmacy_stock_detail.length; k++) {
      if (pharmacy_stock_detail[k].item_id === row.item_id) {
        pharmacy_stock_detail[k] = row;
      }
    }

    this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail
    });
  }

  clearGridEditors(row, e) {
    debugger;
    let pharmacy_stock_detail = this.state.pharmacy_stock_detail;

    row["batchno"] = null;
    row["expiry_date"] = null;
    row["from_qtyhand"] = null;
    row["unit_cost"] = null;

    for (let k = 0; k < pharmacy_stock_detail.length; k++) {
      if (pharmacy_stock_detail[k].item_id === row.item_id) {
        pharmacy_stock_detail[k] = row;
      }
    }
    this.setState({
      pharmacy_stock_detail: pharmacy_stock_detail
    });
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
    this.setState({
      item_details: item,
      batch_detail_view: true
    });

    if (context !== undefined) {
      context.updateState({
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
                          <p>
                            UOM: <span>{item.uom_description}</span>
                          </p>
                          <p>
                            Req. Qty: <span>{item.quantity_authorized}</span>
                          </p>

                          <p>
                            Trans Qty: <span>{item.quantity_transferred}</span>
                          </p>
                          <p>
                            OutStanding Qty:
                            <span>{item.quantity_outstanding}</span>
                          </p>

                          <p>
                            Transfer Till Dt:
                            <span>{item.transfer_to_date}</span>
                          </p>
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
                <div className="col-8" style={{ paddingLeft: 0 }}>
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
                                this.props.itemlist === undefined
                                  ? []
                                  : this.props.itemlist.filter(
                                      f =>
                                        f.hims_d_item_master_id === row.item_id
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
                                this.props.itemlist === undefined
                                  ? []
                                  : this.props.itemlist.filter(
                                      f =>
                                        f.hims_d_item_master_id === row.item_id
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
                                this.props.itemcategory === undefined
                                  ? []
                                  : this.props.itemcategory.filter(
                                      f =>
                                        f.hims_d_item_category_id ===
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
                                this.props.itemcategory === undefined
                                  ? []
                                  : this.props.itemcategory.filter(
                                      f =>
                                        f.hims_d_item_category_id ===
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
                                this.props.itemgroup === undefined
                                  ? []
                                  : this.props.itemgroup.filter(
                                      f =>
                                        f.hims_d_item_group_id ===
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
                                this.props.itemgroup === undefined
                                  ? []
                                  : this.props.itemgroup.filter(
                                      f =>
                                        f.hims_d_item_group_id ===
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
                            fieldName: "uom_requested_id",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "UOM" }} />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.itemuom === undefined
                                  ? []
                                  : this.props.itemuom.filter(
                                      f =>
                                        f.hims_d_pharmacy_uom_id ===
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
                                this.props.itemuom === undefined
                                  ? []
                                  : this.props.itemuom.filter(
                                      f =>
                                        f.hims_d_pharmacy_uom_id ===
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
                          data: this.state.pharmacy_stock_detail
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
              ) : (
                <div className="col-8" style={{ paddingLeft: 0 }}>
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      <h6>{item_name ? item_name : "----------"}</h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Required Qty" }} />
                      <h6>{qty_auth ? qty_auth : "----------"}</h6>
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

                    <div className="col">
                      <AlgaehLabel label={{ forceLabel: "Transfer Qty" }} />
                      <h6>
                        {this.state.quantity_transferred
                          ? this.state.quantity_transferred
                          : "----------"}
                      </h6>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={AddSelectedBatches.bind(this, this, context)}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={this.CloseOrent.bind(this, context)}
                    >
                      Close
                    </button>
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
    itemlist: state.itemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    itemgroup: state.itemgroup,
    itemBatch: state.itemBatch
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
