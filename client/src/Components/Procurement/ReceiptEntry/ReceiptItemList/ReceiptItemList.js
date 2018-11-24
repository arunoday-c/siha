import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../ReceiptEntry.css";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import {
  deleteDNDetail,
  updateDNDetail,
  onchhangegriddiscount
} from "./ReceiptItemListEvent";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class ReceiptItemList extends Component {
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

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-delivery-note-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12" id="ReceiptGrid">
                        <AlgaehDataGrid
                          id="Receipt_details"
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
                                      this.props.receiptitemlist === undefined
                                        ? []
                                        : this.props.receiptitemlist.filter(
                                            f =>
                                              f.hims_d_item_master_id ===
                                              row.phar_item_id
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
                                      this.props.receiptitemlist === undefined
                                        ? []
                                        : this.props.receiptitemlist.filter(
                                            f =>
                                              f.hims_d_item_master_id ===
                                              row.phar_item_id
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

                                this.state.po_from === "PHR"
                                  ? (display =
                                      this.props.receiptitemcategory ===
                                      undefined
                                        ? []
                                        : this.props.receiptitemcategory.filter(
                                            f =>
                                              f.hims_d_item_category_id ===
                                              row.phar_item_category
                                          ))
                                  : (display =
                                      this.props.receiptitemcategory ===
                                      undefined
                                        ? []
                                        : this.props.receiptitemcategory.filter(
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
                                      this.props.receiptitemcategory ===
                                      undefined
                                        ? []
                                        : this.props.receiptitemcategory.filter(
                                            f =>
                                              f.hims_d_item_category_id ===
                                              row.phar_item_category
                                          ))
                                  : (display =
                                      this.props.receiptitemcategory ===
                                      undefined
                                        ? []
                                        : this.props.receiptitemcategory.filter(
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
                                    {display !== undefined &&
                                    display.length !== 0
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
                                  label={{ forceLabel: "Batch  No." }}
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
                              disabled: true
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
                              fieldName: "dn_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "DN Quantity" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      decimal: { allowNegative: false },
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
                                        disabled: !this.state.authorizeEnable
                                      }
                                    }}
                                  />
                                );
                              }
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
                                  label={{ forceLabel: "Discount Amount" }}
                                />
                              ),
                              disabled: true
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
                          keyId="hims_f_procurement_receipt_detail_id"
                          dataSource={{
                            data: this.state.receipt_entry_detail
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteDNDetail.bind(this, this, context),
                            onEdit: row => {},
                            onDone: updateDNDetail.bind(this, this, context)
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
    receiptitemlist: state.receiptitemlist,
    receiptitemcategory: state.receiptitemcategory,
    receiptitemgroup: state.receiptitemgroup,
    receiptitemuom: state.receiptitemuom
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
  )(ReceiptItemList)
);
