import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  // AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  // dateFormater,
  updateStockDetils,
  // datehandle,
  texthandle,
  getBatchWiseData,
  closeBatchWise,
  downloadPharStock,
} from "./StockEnquiryEvents";
import "./StockEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import BatchWiseStock from "./BatchWiseStock";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import {
  getCookie,
  algaehApiCall,
  swalMessage,
} from "../../../utils/algaehApiCall";

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
          {/* <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Stock Enquiry", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            pageNavPath={[
              {
                pageName: (
                  <AlgaehLabel
                    label={{
                      forceLabel: "Home",
                      align: "ltr",
                    }}
                  />
                ),
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Stock Enquiry", align: "ltr" }}
                  />
                ),
              },
            ]}
          /> */}

          <div
            className="row inner-top-search"
            style={{ paddingBottom: "10px" }}
          >
            <div className="col-12 mandatory">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Location" }}
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
                    onClear: changeTexts.bind(this, this),
                    autoComplete: "off",
                  }}
                />
                <div className="col" style={{ textAlign: "right" }}>
                  <button
                    className="btn btn-default"
                    style={{ marginTop: 20 }}
                    onClick={() => downloadPharStock(this)}
                  >
                    Download Stock
                  </button>
                </div>
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
            <div className="portlet-body" id="precriptionList_Cntr">
              <AlgaehDataGrid
                id="initial_stock"
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
                    others: { filterable: false },
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
                    className: (row) => {
                      return "greenCell";
                    },
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
                    editorTemplate: (row) => {
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
                    others: { filterable: false },
                  },
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
                    others: { filterable: false },
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
                    others: { filterable: false },
                  },
                  {
                    fieldName: "reorder_qty",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Reorder Quantity" }} />
                    ),
                    disabled: true,
                    others: { filterable: false },
                  },
                  {
                    fieldName: "avgcost",
                    label: <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />,
                    displayTemplate: (row) => {
                      return (
                        <span>
                          {GetAmountFormart(row.avgcost, {
                            appendSymbol: false,
                          })}
                        </span>
                      );
                    },
                    disabled: true,
                    others: { filterable: false },
                  },
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
                    others: { filterable: false },
                  },
                ]}
                keyId="item_id"
                dataSource={{
                  data: this.state.ListItems,
                }}
                noDataText="No Stock available for selected Item in the selected Location"
                isEditable={false}
                filter={true}
                paging={{ page: 0, rowsPerPage: 20 }}
                events={{
                  // onDelete: deleteStock.bind(this, this),
                  onEdit: (row) => {},
                  onDone: updateStockDetils.bind(this, this),
                }}
              />
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
