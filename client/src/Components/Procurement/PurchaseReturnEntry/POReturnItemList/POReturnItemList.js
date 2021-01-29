import React, { Component } from "react";
import "./POReturnItemList.scss";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import {
  dateFormater,
  deletePOReturnDetail,
  onchangegridcol,
  AddItems,
  ShowItemBatch,
  numberchangeTexts,
  itemchangeText,
  CloseItemBatch
} from "./POReturnItemListEvents";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import Options from "../../../../Options.json";
import moment from "moment";
import ItemBatchs from "../ItemBatchs/ItemBatchs"
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
          {(context) => (
            <div className="hims-purchase-order-entry">
              <div className="row">
                {this.state.return_type === "D" ?
                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered margin-bottom-15">
                      <div className="row">
                        <AlgaehAutoSearch
                          div={{ className: "col-3" }}
                          label={{ forceLabel: "Item Name" }}
                          title="Type Item Name Here"
                          id="item_id_search"
                          template={(result) => {
                            return (
                              <section className="resultSecStyles">
                                <div className="row">
                                  <div className="col-8">
                                    <h4 className="title">
                                      {result.item_description}
                                    </h4>
                                    <small>{result.generic_name}</small>
                                    <small>{result.uom_description}</small>
                                  </div>
                                </div>
                              </section>
                            );
                          }}
                          name={this.state.po_return_from === "PHR" ? "phar_item_id" : "inv_item_id"}
                          columns={this.state.po_return_from === "PHR" ? spotlightSearch.pharmacy.itemmaster : spotlightSearch.Items.InvItems}
                          displayField="item_description"
                          value={this.state.item_description}
                          searchName={this.state.po_return_from === "PHR" ? "itemmaster" : "tranitemmaster"}
                          extraParameters={
                            this.state.po_return_from === "PHR" ? {
                              pharmacy_location_id: this.state.pharmcy_location_id,
                            } : {
                                inventory_location_id: this.state.inventory_location_id,
                              }}
                          onClick={itemchangeText.bind(this, this, context)}
                          onClear={() => {
                            context.updateState({
                              item_id: null,
                              item_category: null,
                              uom_id: null,
                              service_id: null,
                              item_group_id: null,
                              quantity: 0,
                              expiry_date: null,
                              batchno: null,
                              grn_no: null,
                              qtyhand: null,
                              barcode: null,
                              ItemUOM: [],
                              Batch_Items: [],
                              addItemButton: true,
                              item_description: null,
                              sales_uom_id: null,
                              sales_conversion_factor: null,
                              uom_description: null,
                              stocking_uom: null,
                              conversion_factor: null,
                              sales_qtyhand: null,
                              stocking_uom_id: null,
                              average_cost: null,
                              unit_cost: 0,
                              Real_unit_cost: 0,
                            });
                          }}
                          ref={(attReg) => {
                            this.attReg = attReg;
                          }}
                        />

                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Batch No.",
                            }}
                          />
                          <h6>
                            {this.state.batchno
                              ? this.state.batchno
                              : "-----------"}
                          </h6>
                        </div>
                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Expiry Date",
                            }}
                          />
                          <h6>
                            {this.state.expiry_date
                              ? moment(this.state.expiry_date).format(
                                Options.dateFormat
                              )
                              : "-----------"}
                          </h6>
                        </div>

                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Quantity In Hand",
                            }}
                          />
                          <h6>
                            {this.state.qtyhand
                              ? this.state.qtyhand +
                              " " +
                              this.state.stocking_uom
                              : "-----------"}
                          </h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Quantity",
                          }}
                          textBox={{
                            number: {
                              allowNegative: false,
                              thousandSeparator: ",",
                            },
                            className: "txt-fld",
                            name: "quantity",
                            value: this.state.quantity,
                            dontAllowKeys: ["-", "e", "."],
                            events: {
                              onChange: numberchangeTexts.bind(
                                this,
                                this,
                                context
                              ),
                            },
                            others: {
                              disabled: this.state.dataExitst,
                              tabIndex: "3",
                            },
                          }}
                        />


                        <div className="col">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Unit Cost",
                            }}
                          />
                          <h6>
                            {this.state.unit_cost
                              ? GetAmountFormart(this.state.unit_cost)
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
                          tabIndex="5"
                        >
                          Add Item
                        </button>

                        <button
                          className="btn btn-default"
                          onClick={ShowItemBatch.bind(this, this)}
                          disabled={this.state.addItemButton}
                        >
                          Select Batch
                        </button>

                        {this.state.Batch_Items.length > 1 ? (
                          <span
                            className="badge badge-warning animated flash slower"
                            style={{ marginTop: 9, float: "right" }}
                          >
                            More Batch Available
                          </span>
                        ) : null}

                        <ItemBatchs
                          show={this.state.selectBatch}
                          onClose={CloseItemBatch.bind(this, this, context)}
                          inputsparameters={{
                            item_id: this.state.item_id,
                            location_id: this.state.location_id,
                            Batch_Items: this.state.Batch_Items,
                          }}
                        />
                      </div>
                    </div>
                  </div> : null}
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
                                minWidth: 150,
                              },
                            },
                            // {
                            //   fieldName: "category_desc",
                            //   label: (
                            //     <AlgaehLabel
                            //       label={{ forceLabel: "Item Category" }}
                            //     />
                            //   ),
                            //   others: {
                            //     minWidth: 250,
                            //   },
                            // },
                            // {
                            //   fieldName: "group_description",
                            //   label: (
                            //     <AlgaehLabel
                            //       label={{ forceLabel: "Item Group" }}
                            //     />
                            //   ),
                            // },

                            {
                              fieldName: "dn_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Delivered Quantity" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>{parseFloat(row.dn_quantity)}</span>
                                );
                              },
                            },

                            {
                              fieldName: "qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Qty IN Hand" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return <span>{parseFloat(row.qtyhand)}</span>;
                              },
                            },
                            {
                              fieldName: "expirydt",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Expiry Date" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {dateFormater(this, row.expirydt)}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "batchno",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Batch No." }}
                                />
                              ),
                              others: { minWidth: 150 },
                            },
                            {
                              fieldName: "vendor_batchno",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Vendor Batch No." }}
                                />
                              ),
                              others: {
                                minWidth: 100,
                              },
                            },
                            {
                              fieldName: "return_qty",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Return Qty" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return this.state.is_posted === "N" ? (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ",",
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
                                        ),
                                      },
                                    }}
                                  />
                                ) : (
                                    parseFloat(row.return_qty)
                                  );
                              },
                            },
                            {
                              fieldName: "unit_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Unit Cost" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.unit_cost, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Extended Cost" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.extended_cost, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "discount_percentage",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount %" }}
                                />
                              ),
                              others: {
                                minWidth: 100,
                              },
                            },
                            {
                              fieldName: "discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amt." }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.discount_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "net_extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Ext Cost" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.net_extended_cost, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.tax_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.total_amount, {
                                      appendSymbol: false,
                                    })}
                                  </span>
                                );
                              },
                            },
                          ]}
                          keyId="hims_f_procurement_po_return_detail_id"
                          dataSource={{
                            data:
                              this.state.po_return_from === "PHR"
                                ? this.state.pharmacy_stock_detail
                                : this.state.inventory_stock_detail,
                          }}
                          isEditable={
                            this.state.purchase_return_number !== null &&
                              this.state.purchase_return_number !== ""
                              ? false
                              : true
                          }
                          actions={{
                            allowEdit: false,
                          }}
                          byForceEvents={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deletePOReturnDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: (row) => { },
                            onDone: (row) => { },
                          }}
                        />
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

function mapStateToProps(state) {
  return {
    poitemlist: state.poitemlist,
    polocations: state.polocations,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(POReturnItemList)
);
