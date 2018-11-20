import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  itemchangeText,
  numberchangeTexts,
  unitpricenumberchangeTexts,
  discounthandle,
  AddItems,
  dateFormater,
  deletePODetail,
  updatePODetail,
  onchangegridcol,
  onchhangegriddiscount
} from "./POItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class POItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    debugger;
    let InputOutput = this.props.POEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POEntry);
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-purchase-order-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{ forceLabel: "Item Name" }}
                        selector={{
                          name:
                            this.state.po_from === "PHR"
                              ? "phar_item_id"
                              : "inv_item_id",
                          className: "select-fld",
                          value:
                            this.state.po_from === "PHR"
                              ? this.state.phar_item_id
                              : this.state.inv_item_id,
                          dataSource: {
                            textField: "item_description",
                            valueField:
                              this.state.po_from === "PHR"
                                ? "hims_d_item_master_id"
                                : "hims_d_inventory_item_master_id",
                            data: this.props.poitemlist
                          },
                          others: {
                            disabled: this.state.dataExitst
                          },
                          onChange: itemchangeText.bind(this, this, context)
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Category" }}
                        selector={{
                          name:
                            this.state.po_from === "PHR"
                              ? "phar_item_category"
                              : "inv_item_category_id",
                          className: "select-fld",
                          value:
                            this.state.po_from === "PHR"
                              ? this.state.phar_item_category
                              : this.state.inv_item_category_id,
                          dataSource: {
                            textField: "category_desc",
                            valueField:
                              this.state.po_from === "PHR"
                                ? "hims_d_item_category_id"
                                : "hims_d_inventory_tem_category_id",
                            data: this.props.poitemcategory
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Group" }}
                        selector={{
                          name:
                            this.state.po_from === "PHR"
                              ? "phar_item_group"
                              : "inv_item_group_id",
                          className: "select-fld",
                          value:
                            this.state.po_from === "PHR"
                              ? this.state.phar_item_group
                              : this.state.inv_item_group_id,
                          dataSource: {
                            textField: "group_description",
                            valueField:
                              this.state.po_from === "PHR"
                                ? "hims_d_item_group_id"
                                : "hims_d_inventory_item_group_id",
                            data: this.props.poitemgroup
                          },
                          others: {
                            disabled: true
                          },
                          onChange: null
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "UOM", isImp: true }}
                        selector={{
                          name:
                            this.state.po_from === "PHR"
                              ? "pharmacy_uom_id"
                              : "inventory_uom_id",
                          className: "select-fld",
                          value:
                            this.state.po_from === "PHR"
                              ? this.state.pharmacy_uom_id
                              : this.state.inventory_uom_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "hims_d_pharmacy_uom_id",
                            data: this.props.poitemuom
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                    <div className="row">
                      {/* <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Quantity in Hand"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.qtyhand,
                          className: "txt-fld",
                          name: "qtyhand",
                          events: {
                            onChange: null
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      /> */}

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
                          name: "order_quantity",
                          value: this.state.order_quantity,
                          events: {
                            onChange: numberchangeTexts.bind(
                              this,
                              this,
                              context
                            )
                          },
                          others: {
                            disabled: this.state.dataExitst
                          }
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Unit Price"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.unit_price,
                          className: "txt-fld",
                          name: "unit_price",
                          events: {
                            onChange: unitpricenumberchangeTexts.bind(
                              this,
                              this,
                              context
                            )
                          },
                          others: {
                            disabled: this.state.dataExitst
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Extended Price"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.extended_price,
                          className: "txt-fld",
                          name: "extended_price",
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
                          forceLabel: "Discount %"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.sub_discount_percentage,
                          className: "txt-fld",
                          name: "sub_discount_percentage",
                          events: {
                            onChange: discounthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.dataExitst
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Discount Amount"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.sub_discount_amount,
                          className: "txt-fld",
                          name: "sub_discount_amount",
                          events: {
                            onChange: discounthandle.bind(this, this, context)
                          },
                          others: {
                            disabled: this.state.dataExitst
                          }
                        }}
                      />

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Extended Cost"
                        }}
                        textBox={{
                          decimal: { allowNegative: false },
                          value: this.state.extended_cost,
                          className: "txt-fld",
                          name: "extended_cost",
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
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12" id="PointSaleGrid">
                        <AlgaehDataGrid
                          id="PO_details"
                          columns={[
                            {
                              fieldName:
                                this.state.po_from === "PHR"
                                  ? "phar_item_id"
                                  : "inv_item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemlist === undefined
                                          ? []
                                          : this.props.poitemlist.filter(
                                              f =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.poitemlist === undefined
                                          ? []
                                          : this.props.poitemlist.filter(
                                              f =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));
                                }

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
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemlist === undefined
                                          ? []
                                          : this.props.poitemlist.filter(
                                              f =>
                                                f.hims_d_item_master_id ===
                                                row.phar_item_id
                                            ))
                                    : (display =
                                        this.props.poitemlist === undefined
                                          ? []
                                          : this.props.poitemlist.filter(
                                              f =>
                                                f.hims_d_inventory_item_master_id ===
                                                row.inv_item_id
                                            ));
                                }

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
                              fieldName:
                                this.state.po_from === "PHR"
                                  ? "phar_item_category"
                                  : "inv_item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemcategory === undefined
                                          ? []
                                          : this.props.poitemcategory.filter(
                                              f =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.poitemcategory === undefined
                                          ? []
                                          : this.props.poitemcategory.filter(
                                              f =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));
                                }

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
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemcategory === undefined
                                          ? []
                                          : this.props.poitemcategory.filter(
                                              f =>
                                                f.hims_d_item_category_id ===
                                                row.phar_item_category
                                            ))
                                    : (display =
                                        this.props.poitemcategory === undefined
                                          ? []
                                          : this.props.poitemcategory.filter(
                                              f =>
                                                f.hims_d_inventory_tem_category_id ===
                                                row.inv_item_category_id
                                            ));
                                }

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName:
                                this.state.po_from === "PHR"
                                  ? "phar_item_group"
                                  : "inv_item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemgroup === undefined
                                          ? []
                                          : this.props.poitemgroup.filter(
                                              f =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.poitemgroup === undefined
                                          ? []
                                          : this.props.poitemgroup.filter(
                                              f =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));
                                }

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
                                {
                                  this.state.po_from === "PHR"
                                    ? (display =
                                        this.props.poitemgroup === undefined
                                          ? []
                                          : this.props.poitemgroup.filter(
                                              f =>
                                                f.hims_d_item_group_id ===
                                                row.phar_item_group
                                            ))
                                    : (display =
                                        this.props.poitemgroup === undefined
                                          ? []
                                          : this.props.poitemgroup.filter(
                                              f =>
                                                f.hims_d_inventory_item_group_id ===
                                                row.inv_item_group_id
                                            ));
                                }

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "unit_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Unit Price" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "total_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Quantity" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "extended_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Extended Price" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "sub_discount_percentage",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount %" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      decimal: { allowNegative: false },
                                      value: row.sub_discount_percentage,
                                      className: "txt-fld",
                                      name: "sub_discount_percentage",
                                      events: {
                                        onChange: onchhangegriddiscount.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: !this.state.authorizeEnable
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "sub_discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amount" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      decimal: { allowNegative: false },
                                      value: row.sub_discount_amount,
                                      className: "txt-fld",
                                      name: "sub_discount_amount",
                                      events: {
                                        onChange: onchhangegriddiscount.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: !this.state.authorizeEnable
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "net_extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Extended Cost" }}
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
                              fieldName: "expected_arrival_date",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Expected Arrival Date"
                                  }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {dateFormater(
                                      this,
                                      row.expected_arrival_date
                                    )}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {dateFormater(
                                      this,
                                      row.expected_arrival_date
                                    )}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "authorize_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Authorize Quantity" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      decimal: { allowNegative: false },
                                      value: row.authorize_quantity,
                                      className: "txt-fld",
                                      name: "authorize_quantity",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: this.state.authorizeEnable
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "rejected_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Rejected Quantity"
                                  }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              ),
                              disabled: true
                            },

                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
                                />
                              ),
                              disabled: true
                            }
                          ]}
                          keyId="hims_f_procurement_po_detail_id"
                          dataSource={{
                            data:
                              this.state.po_from === "PHR"
                                ? this.state.pharmacy_stock_detail
                                : this.state.inventory_stock_detail
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deletePODetail.bind(this, this, context),
                            onEdit: row => {},
                            onDone: updatePODetail.bind(this, this, context)
                          }}
                        />
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
    poitemlist: state.poitemlist,
    polocations: state.polocations,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom
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
  )(POItemList)
);
