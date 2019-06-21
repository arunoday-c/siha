import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";

import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import extend from "extend";
import Options from "../../../../Options.json";
import moment from "moment";

class DNItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    debugger;

    // this.setState({
    //   dn_from: nextProps.dn_from,
    //   dn_item_details: nextProps.dn_item_details
    // });
  }

  changeDateFormat(date) {
    if (date != null) {
      return moment(date).format(Options.dateFormat);
    }
  }

  onClose = e => {
    // this.setState(
    //   {
    //     dn_from: null,
    //     dn_item_details: []
    //   },
    //   () => {
    //     this.props.onClose && this.props.onClose(e);
    //   }
    // );
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    debugger;
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title={this.props.HeaderCaption}
            openPopup={this.props.show}
          >
            <div className="col-lg-12 popupInner">
              <AlgaehDataGrid
                id="DN_details"
                columns={[
                  {
                    fieldName:
                      this.props.grn_for === "PHR"
                        ? "phar_item_id"
                        : "inv_item_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    displayTemplate: row => {
                      let display;

                      this.props.grn_for === "PHR"
                        ? (display =
                            this.props.receiptitemlist === undefined
                              ? []
                              : this.props.receiptitemlist.filter(
                                  f =>
                                    f.hims_d_item_master_id === row.phar_item_id
                                ))
                        : (display =
                            this.props.receiptitemlist === undefined
                              ? []
                              : this.props.receiptitemlist.filter(
                                  f =>
                                    f.hims_d_inventory_item_master_id ===
                                    row.inv_item_id
                                ));

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].item_description
                            : ""}
                        </span>
                      );
                    },

                    others: { minWidth: 150 }
                  },

                  {
                    fieldName:
                      this.props.grn_for === "PHR"
                        ? "phar_item_category"
                        : "inv_item_category_id",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Item Category" }} />
                    ),
                    displayTemplate: row => {
                      let display;

                      this.props.grn_for === "PHR"
                        ? (display =
                            this.props.receiptitemcategory === undefined
                              ? []
                              : this.props.receiptitemcategory.filter(
                                  f =>
                                    f.hims_d_item_category_id ===
                                    row.phar_item_category
                                ))
                        : (display =
                            this.props.receiptitemcategory === undefined
                              ? []
                              : this.props.receiptitemcategory.filter(
                                  f =>
                                    f.hims_d_inventory_tem_category_id ===
                                    row.inv_item_category_id
                                ));

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].category_desc
                            : ""}
                        </span>
                      );
                    },

                    others: { minWidth: 250 }
                  },
                  {
                    fieldName:
                      this.props.grn_for === "PHR"
                        ? "phar_item_group"
                        : "inv_item_group_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Group" }} />,
                    displayTemplate: row => {
                      let display;

                      this.props.grn_for === "PHR"
                        ? (display =
                            this.props.receiptitemgroup === undefined
                              ? []
                              : this.props.receiptitemgroup.filter(
                                  f =>
                                    f.hims_d_item_group_id ===
                                    row.phar_item_group
                                ))
                        : (display =
                            this.props.receiptitemgroup === undefined
                              ? []
                              : this.props.receiptitemgroup.filter(
                                  f =>
                                    f.hims_d_inventory_item_group_id ===
                                    row.inv_item_group_id
                                ));

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].group_description
                            : ""}
                        </span>
                      );
                    },

                    others: { minWidth: 150 }
                  },

                  {
                    fieldName: "batchno",
                    label: <AlgaehLabel label={{ forceLabel: "Batch  No." }} />,

                    others: {
                      minWidth: 150,
                      resizable: false
                    }
                  },

                  {
                    fieldName: "vendor_batchno",
                    label: (
                      <AlgaehLabel
                        label={{ forceLabel: "Vendor Batch  No." }}
                      />
                    ),

                    others: {
                      minWidth: 150,
                      resizable: false
                    }
                  },

                  {
                    fieldName: "expiry_date",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>{this.changeDateFormat(row.expiry_date)}</span>
                      );
                    },

                    others: {
                      minWidth: 150,
                      resizable: false
                    }
                  },

                  {
                    fieldName: "dn_quantity",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Delivery Qty" }} />
                    )
                  },
                  {
                    fieldName: "free_qty",
                    label: <AlgaehLabel label={{ forceLabel: "Free Qty" }} />
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
                    disabled: true,
                    others: { minWidth: 140 }
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
                    disabled: true,
                    others: { minWidth: 150 }
                  },
                  {
                    fieldName: "discount_percentage",
                    label: <AlgaehLabel label={{ forceLabel: "Discount %" }} />,
                    disabled: true
                  },
                  {
                    fieldName: "discount_amount",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Discount Amt" }} />
                    ),
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.discount_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "net_extended_cost",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Net Ext Cost" }} />
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
                    disabled: true
                  },

                  {
                    fieldName: "tax_amount",
                    label: <AlgaehLabel label={{ forceLabel: "Tax Amt" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.tax_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  },

                  {
                    fieldName: "total_amount",
                    label: <AlgaehLabel label={{ forceLabel: "Total Amt" }} />,
                    displayTemplate: row => {
                      return (
                        <span>
                          {getAmountFormart(row.total_amount, {
                            appendSymbol: false
                          })}
                        </span>
                      );
                    },
                    disabled: true
                  }
                ]}
                keyId="hims_f_procurement_dn_detail_id"
                dataSource={{
                  data: this.props.dn_item_details
                }}
                paging={{ page: 0, rowsPerPage: 10 }}
              />
            </div>
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    receiptitemlist: state.receiptitemlist,
    receiptitemcategory: state.receiptitemcategory,
    receiptitemgroup: state.receiptitemgroup
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions
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

{
  /*
  {
    fieldName: "po_quantity",
    label: (
      <AlgaehLabel label={{ forceLabel: "PO Quantity" }} />
    ),
    disabled: true
  },
  {
  fieldName: "unit_cost",
  label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />,
  displayTemplate: row => {
    return (
      <span>
        {getAmountFormart(row.unit_cost, {
          appendSymbol: false
        })}
      </span>
    );
  },

  disabled: true
},
{
  fieldName: "sales_price",
  label: (
    <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
  ),
  displayTemplate: row => {
    return (
      <span>
        {getAmountFormart(row.sales_price, {
          appendSymbol: false
        })}
      </span>
    );
  }
},*/
}
