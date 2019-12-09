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
  onchhangegriddiscount,
  AssignData,
  GridAssignData,
  EditGrid,
  CancelGrid
} from "./POItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class POItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.POEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POEntry);
  }

  render() {

    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-purchase-order-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
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
                            valueField:
                              this.state.po_from === "PHR"
                                ? "hims_d_pharmacy_uom_id"
                                : "hims_d_inventory_uom_id",
                            data: this.props.poitemuom
                          },
                          others: {
                            disabled: true
                          }
                        }}
                      />
                    </div>
                    <div className="row">


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
                          dontAllowKeys: ["-", "e", "."],
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

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Extended Price"
                          }}
                        />
                        <h6>
                          {this.state.extended_price
                            ? this.state.extended_price
                            : "-----------"}
                        </h6>
                      </div>


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
                            disabled: this.state.dataExitst,
                            min: 0,
                            max: 100,
                            onBlur: AssignData.bind(this, this)
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
                            disabled: this.state.dataExitst,
                            onBlur: AssignData.bind(this, this)
                          }
                        }}
                      />

                      <div className="col">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Extended Cost"
                          }}
                        />
                        <h6>
                          {this.state.extended_cost
                            ? this.state.extended_cost
                            : "-----------"}
                        </h6>
                      </div>

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
                      <div className="col-lg-12" id="POGrid">
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

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 150
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

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 250
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
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.unit_price, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.unit_price, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "total_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Qty" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "extended_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Ext. Price" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.extended_price, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.extended_price, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "authorize_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Auth Qty" }}
                                />
                              ),
                              displayTemplate: row => {
                                return row.authorize_quantity !== "" || row.authorize_quantity !== null
                                  ? parseFloat(row.authorize_quantity)
                                  : 0;
                              },
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value:
                                        row.authorize_quantity !== ""
                                          ? parseFloat(row.authorize_quantity)
                                          : null,
                                      className: "txt-fld",
                                      name: "authorize_quantity",
                                      dontAllowKeys: ["-", "e", "."],
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: this.state.authorizeEnable,
                                        min: 0,
                                        algaeh_required: "true",
                                        errormessage:
                                          "Please enter Authorized Quantity ..",
                                        checkvalidation:
                                          "value ==='' || value ==='0'"
                                      }
                                    }}
                                  />
                                );
                              }
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
                                        disabled: !this.state.authorizeEnable,
                                        onBlur: GridAssignData.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              },
                              others: {
                                minWidth: 100
                              }
                            },
                            {
                              fieldName: "sub_discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amt." }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.sub_discount_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
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
                                        disabled: !this.state.authorizeEnable,
                                        onBlur: GridAssignData.bind(
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
                              fieldName: "net_extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Ext Cost" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.net_extended_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.net_extended_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "unit_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Unit Cost" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.unit_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.unit_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "quantity_outstanding",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Outstanding Qty"
                                  }}
                                />
                              ),
                              displayTemplate: row => {
                                return row.quantity_outstanding !== ""
                                  ? parseFloat(row.quantity_outstanding)
                                  : 0;
                              },
                              editorTemplate: row => {
                                return row.quantity_outstanding !== ""
                                  ? parseFloat(row.quantity_outstanding)
                                  : 0;
                              },
                              disabled: true,
                              others: {
                                minWidth: 130
                              }
                            },
                            {
                              fieldName: "rejected_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Rejected Qty"
                                  }}
                                />
                              ),
                              displayTemplate: row => {
                                return row.rejected_quantity !== ""
                                  ? parseFloat(row.rejected_quantity)
                                  : 0;
                              },
                              editorTemplate: row => {
                                return row.rejected_quantity !== ""
                                  ? parseFloat(row.rejected_quantity)
                                  : 0;
                              },
                              disabled: true
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amt" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.tax_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.tax_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amt" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.total_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.total_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              }
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
                          actions={{
                            allowDelete: !this.state.dataExitst
                          }}
                          byForceEvents={true}
                          // forceRender={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deletePODetail.bind(this, this, context),
                            onEdit: EditGrid.bind(this, this, context),
                            onCancel: CancelGrid.bind(this, this, context),
                            onDone: updatePODetail.bind(this, this, context)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div style={{ marginBottom: 73 }}>
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
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

{
  /*{
  fieldName: "expected_arrival_date",
  label: (
    <AlgaehLabel
      label={{
        forceLabel: "Exp Arrival Date"
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
  },
  others: {
    minWidth: 130
  }
},*/
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
