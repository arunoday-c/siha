import React, { Component } from "react";
import "./ReturnItemList.scss";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";
import MyContext from "../../../../utils/MyContext";

import {
  dateFormater,
  deleteSalesReturnDetail,
  onchangegridcol
} from "./ReturnItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

export default class ReturnItemList extends Component {
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
                      <div className="col-lg-12" id="SRIEntryGrid_Cntr">
                        <AlgaehDataGrid
                          id="SRIEntryGrid"
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
                                      onClick={deleteSalesReturnDetail.bind(
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
                                maxWidth: 50
                              }
                            },
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
                              fieldName: "uom_description",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              others: {
                                minWidth: 150
                              }
                            },
                            {
                              fieldName: "dispatch_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Dispatched Quantity" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {parseFloat(row.dispatch_quantity)}
                                  </span>
                                );
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
                              fieldName: "return_qty",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Return Qty" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.inv_is_posted === "N" ? (
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
                              fieldName: "net_total",
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
                              fieldName: "tax_percentage",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Tax %" }} />
                              ),
                              others: {
                                minWidth: 100
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
                          keyId="hims_f_sales_return_detail_id"
                          dataSource={{
                            data: this.state.sales_return_detail
                          }}
                          isEditable={false}
                          actions={{
                            allowEdit: false
                          }}
                          byForceEvents={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
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
                          forceLabel: "Invoice Net Payable"
                        }}
                      />
                      <h6>
                        {getAmountFormart(this.state.invoice_net_payable)}
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
