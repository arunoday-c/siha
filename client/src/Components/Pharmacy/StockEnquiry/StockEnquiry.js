import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
} from "../../Wrapper/algaehWrapper";
import {
  changeTexts,
  updateStockDetils,
  downloadPharStockDetails,
  texthandle,
  getBatchWiseData,
  closeBatchWise,
  downloadPharStock,
  itemchangeText,
  getItemLocationStock,
  checkBoxEvent,
} from "./StockEnquiryEvents";
import "./StockEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import BatchWiseStock from "./BatchWiseStock";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import { AlgaehDataGrid } from "algaeh-react-components";

class StockEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ListItems: [],
      location_id: null,
      category_id: null,
      group_id: null,
      item_id: null,
      batch_no: null,
      expirt_date: null,
      quantity: 0,
      unit_cost: 0,
      initial_stock_date: new Date(),
      batch_wise_item: [],
      openBatchWise: false,
      item_description: null,
      total_quantity: 0,

      reorder_qty: "N",
      zeroStock: "N",
      trans_ack_required: "N",
      trans_required: false,
    };
  }

  componentDidMount() {
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        data: { item_status: "A" },
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "itemlist",
        },
      });
    }

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations",
      },
    });

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom",
        },
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <div className="col-lg-8">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "By Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations,
                    },
                    onChange: changeTexts.bind(this, this),
                    onClear: () => {
                      this.setState(
                        {
                          location_id: null,
                        },
                        () => {
                          getItemLocationStock(this, this);
                        }
                      );
                    },
                    autoComplete: "off",
                  }}
                />
                {/* <div className="col-1">
                  <button
                    className="btn btn-default"
                    // disabled={!this.state.location_id}
                    style={{ marginTop: 20, marginRight: 10 }}
                    // onClick={() => downloadInvStockDetails(this)}
                  >
                    Load
                  </button>
                </div> */}
                <AlgaehAutoSearch
                  div={{ className: "col AlgaehAutoSearch" }}
                  label={{ forceLabel: "Item Name" }}
                  title="Search By Items"
                  id="item_id_search"
                  template={(result) => {
                    return (
                      <section className="resultSecStyles">
                        <div className="row">
                          <div className="col-8">
                            <h4 className="title">{result.item_description}</h4>
                            <small>{result.item_code}</small>
                            <small>{result.stock_uom_desc}</small>
                          </div>
                          {/*<div className="col-4">
                              <h6 className="price">
                                {getAmountFormart(
                                  result.standard_fee
                                )}
                              </h6>
                            </div>*/}
                        </div>
                      </section>
                    );
                  }}
                  name="item_id"
                  columns={spotlightSearch.pharmacy.pharopeningstock}
                  displayField="item_description"
                  value={this.state.item_description}
                  searchName="pharopeningstock"
                  onClick={itemchangeText.bind(this, this)}
                  onClear={() => {
                    this.setState(
                      {
                        item_id: null,
                        item_description: "",
                      },
                      () => {
                        getItemLocationStock(this, this);
                      }
                    );
                  }}
                  ref={(attReg) => {
                    this.attReg = attReg;
                  }}
                />
                <div
                  className="col customCheckbox"
                  style={{ marginTop: 23, border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="reorder_qty"
                      value={this.state.reorder_qty}
                      checked={this.state.reorder_qty === "Y" ? true : false}
                      onChange={checkBoxEvent.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "Re Order Items",
                        }}
                      />
                    </span>
                  </label>
                </div>
                <div
                  className="col customCheckbox"
                  style={{ marginTop: 23, border: "none" }}
                >
                  <label className="checkbox inline">
                    <input
                      type="checkbox"
                      name="zeroStock"
                      value={this.state.zeroStock}
                      checked={this.state.zeroStock === "Y" ? true : false}
                      onChange={checkBoxEvent.bind(this, this)}
                    />
                    <span>
                      <AlgaehLabel
                        label={{
                          forceLabel: "Zero stock Items",
                        }}
                      />
                    </span>
                  </label>
                </div>

                {/* <div className="col-1">
                  {" "}
                  <button
                    className="btn btn-default"
                    // disabled={!this.state.location_id}
                    style={{ marginTop: 20, marginRight: 10 }}
                    // onClick={() => downloadInvStockDetails(this)}
                  >
                    Load
                  </button>
                </div> */}
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered margin-bottom-15">
            {/* <div className="portlet-title">
              <div className="caption">
                <h3 className="caption-subject">Stock Lists</h3>
              </div>
              <div className="actions">
                <button
                  className="btn btn-default btn-circle active"
                  style={{ marginRight: 10 }}
                  // onClick={this.onClickHandler.bind(this)}
                >
                  <i className="fas fa-download" />
                </button>
              </div>
            </div> */}
            <div className="portlet-body" id="phar_initial_stock_Grid">
              <AlgaehDataGrid
                columns={[
                  {
                    fieldName: "pharmacy_location_id",
                    label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                    displayTemplate: (row) => {
                      let display =
                        this.props.locations === undefined
                          ? []
                          : this.props.locations.filter(
                              (f) =>
                                f.hims_d_pharmacy_location_id ===
                                row.pharmacy_location_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].location_description
                            : ""}
                        </span>
                      );
                    },
                    editorTemplate: (row) => {
                      let display =
                        this.props.locations === undefined
                          ? []
                          : this.props.locations.filter(
                              (f) =>
                                f.hims_d_pharmacy_location_id ===
                                row.pharmacy_location_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].location_description
                            : ""}
                        </span>
                      );
                    },
                    filterable: true,
                    others: { Width: 180 },
                  },
                  {
                    fieldName: "item_code",
                    label: <AlgaehLabel label={{ forceLabel: "Item Code" }} />,
                    filterable: true,
                    others: { Width: 140 },
                  },

                  {
                    fieldName: "item_description",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    displayTemplate: (row) => {
                      return (
                        <span
                          className="pat-code"
                          onClick={getBatchWiseData.bind(this, this, row)}
                        >
                          {row.item_description}
                        </span>
                      );
                    },
                    className: "hyperlinkTxt",
                    filterable: true,
                    others: { style: { textAlign: "left" } },
                  },

                  {
                    fieldName: "stocking_uom_id",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                    ),
                    displayTemplate: (row) => {
                      let display =
                        this.props.itemuom === undefined
                          ? []
                          : this.props.itemuom.filter(
                              (f) =>
                                f.hims_d_pharmacy_uom_id === row.stocking_uom_id
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].uom_description
                            : ""}
                        </span>
                      );
                    },
                    filterable: true,
                    filterType: "choices",
                    choices:
                      this.props.itemuom === undefined
                        ? []
                        : this.props?.itemuom?.map(
                            ({ hims_d_pharmacy_uom_id, uom_description }) => {
                              return {
                                name: uom_description,
                                value: hims_d_pharmacy_uom_id,
                              };
                            }
                          ),
                    others: { Width: 140 },
                  },

                  // {
                  //   fieldName: "stock_uom",
                  //   label: (
                  //     <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                  //   ),

                  //   filterable: true,
                  //   filterType: "choices",
                  //   choices:
                  //     this.props.itemuom === undefined
                  //       ? []
                  //       : this.props?.itemuom?.map(
                  //           ({ hims_d_pharmacy_uom_id, uom_description }) => {
                  //             return {
                  //               name: uom_description,
                  //               value: hims_d_pharmacy_uom_id,
                  //             };
                  //           }
                  //         ),
                  //   others: { Width: 140 },
                  // },
                  {
                    fieldName: "sales_uom",
                    label: <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />,
                    displayTemplate: (row) => {
                      let display =
                        this.props.itemuom === undefined
                          ? []
                          : this.props.itemuom.filter(
                              (f) => f.hims_d_pharmacy_uom_id === row.sales_uom
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].uom_description
                            : ""}
                        </span>
                      );
                    },
                    editorTemplate: (row) => {
                      let display =
                        this.props.itemuom === undefined
                          ? []
                          : this.props.itemuom.filter(
                              (f) => f.hims_d_pharmacy_uom_id === row.sales_uom
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].uom_description
                            : ""}
                        </span>
                      );
                    },

                    filterable: true,
                    filterType: "choices",
                    choices:
                      this.props.itemuom === undefined
                        ? []
                        : this.props?.itemuom?.map(
                            ({ hims_d_pharmacy_uom_id, uom_description }) => {
                              return {
                                name: uom_description,
                                value: hims_d_pharmacy_uom_id,
                              };
                            }
                          ),
                    others: { Width: 140 },
                  },

                  {
                    fieldName: "qtyhand",
                    label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                    displayTemplate: (row) => {
                      return row.reorder === "R" ? (
                        <div className="orderNow">
                          <span>{parseFloat(row.qtyhand)}</span>
                          <span className="orderSoon">Order Soon</span>
                        </div>
                      ) : (
                        parseFloat(row.qtyhand)
                      );
                    },
                    disabled: true,
                    others: { Width: 140 },
                  },
                  {
                    fieldName: "reorder_qty",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Reorder Qty" }} />
                    ),
                    disabled: true,
                    others: { Width: 140 },
                  },
                  // {
                  //   fieldName: "avgcost",
                  //   label: <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />,
                  //   displayTemplate: (row) => {
                  //     return (
                  //       <span>
                  //         {GetAmountFormart(row.avgcost, {
                  //           appendSymbol: false,
                  //         })}
                  //       </span>
                  //     );
                  //   },
                  //   disabled: true,
                  //   others: { filterable: false },
                  // },
                  {
                    fieldName: "sale_price",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
                    ),
                    displayTemplate: (row) => {
                      return (
                        <span>
                          {GetAmountFormart(row.sale_price, {
                            appendSymbol: false,
                          })}
                        </span>
                      );
                    },
                    editorTemplate: (row) => {
                      return (
                        <AlagehFormGroup
                          div={{}}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: row.sale_price,
                            className: "txt-fld",
                            name: "sale_price",
                            events: {
                              onChange: texthandle.bind(this, this, row),
                            },
                          }}
                        />
                      );
                    },
                    disabled: true,
                    others: { Width: 140 },
                  },
                ]}
                keyId="item_id"
                data={
                  this.state.ListItems === undefined ? [] : this.state.ListItems
                }
                noDataText="No Stock available for selected Item in the selected Location"
                pagination={true}
                pageOptions={{ rows: 20, page: 1 }}
                isFilterable={true}
                events={{
                  // onDelete: deleteStock.bind(this, this),
                  onEdit: (row) => {},
                  onDone: updateStockDetils.bind(this, this),
                }}
              />
            </div>
          </div>
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  className="btn btn-default"
                  disabled={!this.state.location_id}
                  onClick={() => downloadPharStockDetails(this)}
                >
                  Download Stock Details
                </button>
                <button
                  className="btn btn-default"
                  disabled={!this.state.location_id}
                  onClick={() => downloadPharStock(this)}
                >
                  Download Stock
                </button>
              </div>
            </div>
          </div>
        </div>

        <BatchWiseStock
          show={this.state.openBatchWise}
          onClose={closeBatchWise.bind(this, this)}
          batch_wise_item={this.state.batch_wise_item}
          item_description={this.state.item_description}
          total_quantity={this.state.total_quantity}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    locations: state.locations,
    itemuom: state.itemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(StockEnquiry)
);
