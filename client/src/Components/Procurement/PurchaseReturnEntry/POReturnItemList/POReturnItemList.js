import React, { Component } from "react";
import "./POReturnItemList.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  dateFormater,
  deletePOReturnDetail,
  onchangegridcol
} from "./POReturnItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class POReturnItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.POReturnEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POReturnEntry);
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
                      <div className="col-lg-12" id="PoReturnEntryGrid_Cntr">
                        <AlgaehDataGrid
                          id="PoReturnEntryGrid"
                          columns={[
                            {
                              fieldName: "item_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              others: {
                                minWidth: 150
                              }
                            },
                            {
                              fieldName: "category_desc",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              others: {
                                minWidth: 250
                              }
                            },
                            {
                              fieldName: "group_description",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              )
                            },

                            {
                              fieldName: "dn_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Delivered Quantity" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>{parseFloat(row.dn_quantity)}</span>
                                );
                              }
                            },

                            {
                              fieldName: "qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Qty IN Hand" }}
                                />
                              ),
                              displayTemplate: row => {
                                return <span>{parseFloat(row.qtyhand)}</span>;
                              }
                            },
                            {
                              fieldName: "expirydt",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Expiry Date" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {dateFormater(this, row.expirydt)}
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
                              others: { minWidth: 150 }
                            },
                            {
                              fieldName: "vendor_batchno",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Vendor Batch No." }}
                                />
                              ),
                              others: {
                                minWidth: 100
                              }
                            },
                            {
                              fieldName: "return_qty",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Return Qty" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.is_posted === "N" ? (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value:
                                        row.return_qty !== ""
                                          ? parseFloat(row.return_qty)
                                          : null,
                                      className: "txt-fld",
                                      name: "return_qty",
                                      dontAllowKeys: ["-", "e", "."],
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      }
                                      // others: {
                                      //   disabled: this.state.authorizeEnable,
                                      //   min: 0,
                                      //   algaeh_required: "true",
                                      //   errormessage:
                                      //     "Please enter Authorized Quantity ..",
                                      //   checkvalidation:
                                      //     "value ==='' || value ==='0'"
                                      // }
                                    }}
                                  />
                                ) : (
                                    parseFloat(row.return_qty)
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
                              }
                            },
                            {
                              fieldName: "extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Extended Cost" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.extended_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
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
                              others: {
                                minWidth: 100
                              }
                            },
                            {
                              fieldName: "discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amt." }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.discount_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
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
                              }
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
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
                              }
                            },
                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
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
                              }
                            }
                          ]}
                          keyId="hims_f_procurement_po_return_detail_id"
                          dataSource={{
                            data:
                              this.state.po_return_from === "PHR"
                                ? this.state.pharmacy_stock_detail
                                : this.state.inventory_stock_detail
                          }}
                          isEditable={
                            this.state.purchase_return_number !== null &&
                              this.state.purchase_return_number !== ""
                              ? false
                              : true
                          }
                          actions={{
                            allowEdit: false
                          }}
                          byForceEvents={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deletePOReturnDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: row => { },
                            onDone: row => { }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row" style={{ textAlign: "right" }}>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Receipt Net Payable"
                        }}
                      />
                      <h6>
                        {getAmountFormart(this.state.receipt_net_payable)}
                      </h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Return Sub Total"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.sub_total)}</h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Discount Amount"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.discount_amount)}</h6>
                    </div>
                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Return Net Total"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.net_total)}</h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Tax Amount"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.tax_amount)}</h6>
                    </div>

                    <div className="col">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Return Total"
                        }}
                      />
                      <h6>{getAmountFormart(this.state.return_total)}</h6>
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
  connect(mapStateToProps, mapDispatchToProps)(POReturnItemList)
);
