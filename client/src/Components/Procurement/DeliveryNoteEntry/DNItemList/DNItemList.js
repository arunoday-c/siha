import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  deleteDNDetail,
  updateDNDetail,
  onchhangegriddiscount,
  GridAssignData,
  onchangegridcol,
  EditGrid,
  CancelGrid,
  onchangegridcoldatehandle,
  changeDateFormat,
  printBarcode,
  onchhangeNumber,
  onChangeTextEventHandaler,
  onDateTextEventHandaler,
  OnChangeDeliveryQty,
  AddtoList,
  numberEventHandaler
} from "./DNItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class DNItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.DNEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.DNEntry);
  }

  AddItemDelivered(context, item, index) {
    let dn_quantity =
      parseFloat(item.po_quantity) -
      parseFloat(item.quantity_outstanding) -
      parseFloat(item.quantity_recieved_todate);

    item.free_qty = 0;
    this.setState({
      selected_row_index: index,
      item_details: item,
      dn_quantity: dn_quantity,
      free_qty: 0
    });

    context.updateState({
      item_details: item,
      dn_quantity: dn_quantity,
      free_qty: 0
    });
  }

  render() {
    let item_name =
      this.state.item_details === null
        ? null
        : this.state.item_details.item_description;
    let qty_auth =
      this.state.item_details === null
        ? null
        : this.state.item_details.po_quantity;
    let required_batchno =
      this.state.item_details === null
        ? "Y"
        : this.state.item_details.required_batchno_expiry;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-delivery-note-entry">
              <div className="row">
                <div className="col-4">
                  <h4 style={{ marginBottom: 4 }}>Requested Items</h4>
                  <ul className="reqTransList">
                    {this.state.po_entry_detail.map((item, index) => {
                      return (
                        <li>
                          <div className="itemReq">
                            <h6>{item.item_description}</h6>
                            <span>
                              UOM: <span>{item.uom_description}</span>
                            </span>
                            <span>
                              Purchased Qty:
                              <span>{item.po_quantity}</span>
                            </span>

                            <span>
                              Delivery Qty:
                              <span>{item.dn_quantity}</span>
                            </span>
                            <span>
                              Out Std. Qty:
                              <span>{item.quantity_outstanding}</span>
                            </span>

                            <span>
                              Qty. Rec. To Date:
                              <span>{item.quantity_recieved_todate}</span>
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
                                    this.state.cannotEdit === true ? "0.1" : ""
                                }}
                                onClick={this.AddItemDelivered.bind(
                                  this,
                                  context,
                                  item,
                                  index
                                )}
                              />
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="col-lg-8">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-5">
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        <h6>{item_name ? item_name : "----------"}</h6>
                      </div>

                      <div className="col-3">
                        <AlgaehLabel label={{ forceLabel: "Required Qty" }} />
                        <h6>{qty_auth ? qty_auth : "----------"}</h6>
                      </div></div>
                       <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Vendor Batchno"
                        }}
                        textBox={{
                          value: this.state.vendor_batchno,
                          className: "txt-fld",
                          name: "vendor_batchno",
                          events: {
                            onChange: onChangeTextEventHandaler.bind(
                              this,
                              this,
                              context
                            )
                          },
                          others: {
                            disabled: this.state.posted === "Y" ? true : false
                          }
                        }}
                      />

                      <AlgaehDateHandler
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Expiry Date",
                          isImp: required_batchno === "N" ? true : false
                        }}
                        textBox={{
                          className: "txt-fld hidden",
                          name: "expiry_date"
                        }}
                        minDate={new Date()}
                        disabled={this.state.posted === "Y" ? true : false}
                        events={{
                          onChange: onDateTextEventHandaler.bind(
                            this,
                            this,
                            context
                          )
                        }}
                        value={this.state.expiry_date}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Sales Price"
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          value:
                            this.state.item_details === null
                              ? null
                              : this.state.item_details.sales_price,
                          className: "txt-fld",
                          name: "sales_price",
                          events: {
                            onChange: onChangeTextEventHandaler.bind(
                              this,
                              this,
                              context
                            )
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Delivery Qty."
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          value: this.state.dn_quantity,
                          className: "txt-fld",
                          name: "dn_quantity",
                          events: {
                            onChange: OnChangeDeliveryQty.bind(
                              this,
                              this,
                              context
                            )
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Free Qty."
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          value: this.state.free_qty,
                          className: "txt-fld",
                          name: "free_qty",
                          events: {
                            onChange: numberEventHandaler.bind(
                              this,
                              this,
                              context
                            )
                          }
                        }}
                      />

                      <div className="col">
                        <button
                          className="btn btn-default"
                          style={{
                            marginTop: 19
                          }}
                          onClick={AddtoList.bind(this, this, context)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="portlet-body">
                      <div className="row">
                        <div className="col-lg-12" id="DNGrid">
                          <AlgaehDataGrid
                            id="DN_details"
                            columns={[
                              {
                                fieldName: "action",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Print" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      <i
                                        className="fas fa-barcode"
                                        onClick={printBarcode.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  return (
                                    <span>
                                      <i
                                        className="fas fa-barcode"
                                        onClick={printBarcode.bind(
                                          this,
                                          this,
                                          row
                                        )}
                                      />
                                    </span>
                                  );
                                },
                                disabled: true,
                                others: {
                                  maxWidth: 70,
                                  resizable: false,
                                  filterable: false,
                                  style: { textAlign: "center" },
                                  fixed: "left"
                                }
                              },
                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_id"
                                    : "inv_item_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Name" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              f =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              f =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));

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
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              f =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.dnitemlist === undefined
                                          ? []
                                          : this.props.dnitemlist.filter(
                                              f =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].item_description
                                        : ""}
                                    </span>
                                  );
                                }, others: {minWidth: 150}
                              },

                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_category"
                                    : "inv_item_category_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Category" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              f =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              f =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].category_desc
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              f =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.dnitemcategory === undefined
                                          ? []
                                          : this.props.dnitemcategory.filter(
                                              f =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].category_desc
                                        : ""}
                                    </span>
                                  );
                                }, others: {minWidth: 250}
                              },
                              {
                                fieldName:
                                  this.state.dn_from === "PHR"
                                    ? "phar_item_group"
                                    : "inv_item_group_id",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Item Group" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              f =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              f =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].group_description
                                        : ""}
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  let display;

                                  this.state.dn_from === "PHR"
                                    ? (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              f =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.dnitemgroup === undefined
                                          ? []
                                          : this.props.dnitemgroup.filter(
                                              f =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));

                                  return (
                                    <span>
                                      {display !== undefined &&
                                      display.length !== 0
                                        ? display[0].group_description
                                        : ""}
                                    </span>
                                  );
                                }, others: {minWidth: 150}
                              },

                              {
                                fieldName: "vendor_batchno",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Vendor Batch  No." }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        value: row.vendor_batchno,
                                        className: "txt-fld",
                                        name: "vendor_batchno",
                                        events: {
                                          onChange: onchangegridcol.bind(
                                            this,
                                            this,
                                            row
                                          )
                                        },
                                        others: {
                                          disabled:
                                            this.state.posted === "Y"
                                              ? true
                                              : false
                                        }
                                      }}
                                    />
                                  );
                                },
                                others: {
                                  minWidth: 150,
                                  resizable: false
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
                                      {changeDateFormat(row.expiry_date)}
                                    </span>
                                  );
                                },
                                editorTemplate: row => {
                                  return (
                                    <AlgaehDateHandler
                                      div={{}}
                                      textBox={{
                                        className: "txt-fld hidden",
                                        name: "expiry_date"
                                      }}
                                      minDate={new Date()}
                                      disabled={
                                        this.state.posted === "Y" ? true : false
                                      }
                                      events={{
                                        onChange: onchangegridcoldatehandle.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      }}
                                      value={row.expiry_date}
                                    />
                                  );
                                },
                                others: {
                                  minWidth: 150,
                                  resizable: false
                                }
                              },

                              {
                                fieldName: "po_quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "PO Quantity" }}
                                  />
                                ),
                                disabled: true
                              },

                              {
                                fieldName: "unit_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Unit Cost" }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "sales_price",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Sales Price" }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        number: {
                                          allowNegative: false,
                                          thousandSeparator: ","
                                        },
                                        value: row.sales_price,
                                        className: "txt-fld",
                                        name: "sales_price",
                                        events: {
                                          onChange: onchhangeNumber.bind(
                                            this,
                                            this,
                                            row
                                          )
                                        }
                                      }}
                                    />
                                  );
                                }
                              },

                              {
                                fieldName: "dn_quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Delivery Qty" }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        number: {
                                          allowNegative: false,
                                          thousandSeparator: ","
                                        },
                                        value: row.dn_quantity,
                                        className: "txt-fld",
                                        name: "dn_quantity",
                                        events: {
                                          onChange: onchhangegriddiscount.bind(
                                            this,
                                            this,
                                            row
                                          )
                                        },
                                        others: {
                                          disabled: !this.state.authorizeEnable,
                                          onBlur: GridAssignData.bind(
                                            this,
                                            this,
                                            row
                                          ),
                                          onFocus: e => {
                                            e.target.oldvalue = e.target.value;
                                          }
                                        }
                                      }}
                                    />
                                  );
                                }
                              },
                              {
                                fieldName: "free_qty",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Free Qty" }}
                                  />
                                )
                              },

                              {
                                fieldName: "quantity_outstanding",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Qty Outstanding"
                                    }}
                                  />
                                ),
                                disabled: true,others:{minWidth:140}
                              },
                              {
                                fieldName: "quantity_recieved_todate",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Qty Received till date"
                                    }}
                                  />
                                ),
                                disabled: true,others:{minWidth:150}
                              },
                              {
                                fieldName: "discount_percentage",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Discount %" }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "discount_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Discount Amt" }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "net_extended_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Net Ext Cost" }}
                                  />
                                ),
                                disabled: true
                              },

                              {
                                fieldName: "tax_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Tax Amt" }}
                                  />
                                ),
                                disabled: true
                              },

                              {
                                fieldName: "total_amount",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Total Amt" }}
                                  />
                                ),
                                disabled: true
                              }
                            ]}
                            keyId="hims_f_procurement_dn_detail_id"
                            dataSource={{
                              data: this.state.dn_entry_detail
                            }}
                            isEditable={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            byForceEvents={true}
                            events={{
                              onDelete: deleteDNDetail.bind(
                                this,
                                this,
                                context
                              ),
                              onEdit: EditGrid.bind(this, this, context),
                              onCancel: CancelGrid.bind(this, this, context),
                              onDone: updateDNDetail.bind(this, this, context)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col" />

                    <div className="col-lg-5" style={{ textAlign: "right" }}>
                      <div className="row">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sub Total"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.sub_total)}</h6>
                        </div>
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Discount Amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.detail_discount)}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Payable"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.net_payable)}</h6>
                        </div>
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
    dnitemlist: state.dnitemlist,
    dnitemcategory: state.dnitemcategory,
    dnitemgroup: state.dnitemgroup,
    dnitemuom: state.dnitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DNItemList)
);
