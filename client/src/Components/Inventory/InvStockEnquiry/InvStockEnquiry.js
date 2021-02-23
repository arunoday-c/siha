import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  // AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";

import noImage from "../../../assets/images/no-image-icon-6.webp";
// import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import {
  changeTexts,
  // dateFormater,
  updateStockDetils,
  // datehandle,
  getItemLocationStock,
  getBatchWiseData,
  downloadInvStock,
  downloadInvStockDetails,
  closeBatchWise,
  itemchangeText,
  checkBoxEvent,
  getInventoryOptions,
} from "./InvStockEnquiryEvents";
import "./InvStockEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import BatchWiseStock from "./BatchWiseStock";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import spotlightSearch from "../../../Search/spotlightSearch.json";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import { AlgaehDataGrid, RawSecurityComponent } from "algaeh-react-components";

class InvStockEnquiry extends Component {
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
      trans_ack_required: "N",
      trans_required: false,
    };
    getInventoryOptions(this);
  }

  componentDidMount() {
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        data: { item_status: "A" },
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist",
        },
      });
    }

    if (
      this.props.locations === undefined ||
      this.props.locations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "inventorylocations",
        },
      });
    }
    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom",
        },
      });
    }
    this.props.getGITLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      data: { git_location: "Y" },
      method: "GET",
      redux: {
        type: "GIT_LOCATIOS_GET_DATA",
        mappingName: "git_locations",
      },
    });

    RawSecurityComponent({ componentCode: "TRANS_OPTION" }).then((result) => {
      if (result === "show") {
        this.setState({
          trans_required: true,
        });
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <div className="row inner-top-search">
            <div className="col-lg-8">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col form-group" }}
                  label={{ forceLabel: "By Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.inventorylocations,
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
                <AlgaehAutoSearch
                  div={{ className: "col AlgaehAutoSearch AlgaehAutoSearch" }}
                  label={{ forceLabel: "Select Item" }}
                  title="Search Items"
                  id="item_id_search"
                  template={(result) => {
                    return (
                      <section className="resultSecStyles">
                        <div className="row">
                          <div className="col-8">
                            <h4 className="title">{result.item_description}</h4>
                            <small>{result.generic_name}</small>
                            <small>{result.uom_description}</small>
                          </div>
                        </div>
                      </section>
                    );
                  }}
                  name="item_id"
                  columns={spotlightSearch.Items.Invitemmaster}
                  displayField="item_description"
                  value={this.state.item_description}
                  searchName="invopeningstock"
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
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered margin-bottom-15">
            {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
            <div className="portlet-body" id="inv_initial_stock_Grid">
              <AlgaehDataGrid
                columns={[
                  // {
                  //   fieldName: "inventory_location_id",
                  //   label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                  //   displayTemplate: row => {
                  //     let display =
                  //       this.props.inventorylocations === undefined
                  //         ? []
                  //         : this.props.inventorylocations.filter(
                  //             f =>
                  //               f.hims_d_inventory_location_id ===
                  //               row.inventory_location_id
                  //           );

                  //     return (
                  //       <span>
                  //         {display !== undefined && display.length !== 0
                  //           ? display[0].location_description
                  //           : ""}
                  //       </span>
                  //     );
                  //   },
                  //   others: { filterable: false }
                  // },
                  {
                    fieldName: "location_description",
                    label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                    filterable: true,
                    others: { Width: 180 },
                  },
                  {
                    fieldName: "item_master_img_unique_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Image" }} />,
                    displayTemplate: (row) => {
                      return (
                        <span className="image-drop-area">
                          <img
                            src={
                              row.item_master_img_unique_id
                                ? `${window.location.protocol}//${
                                    window.location.hostname
                                  }${
                                    window.location.port === ""
                                      ? "/docserver"
                                      : `:3006`
                                  }/UPLOAD/InvItemMasterImages/thumbnail/${
                                    row.item_master_img_unique_id
                                  }`
                                : noImage
                            }
                          />
                        </span>
                      );
                    },
                    others: { Width: 100 },
                    className: "imgColmn",
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
                        this.props.inventoryitemuom === undefined
                          ? []
                          : this.props.inventoryitemuom.filter(
                              (f) =>
                                f.hims_d_inventory_uom_id ===
                                row.stocking_uom_id
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
                      this.props.inventoryitemuom === undefined
                        ? []
                        : this.props?.inventoryitemuom?.map(
                            ({ hims_d_inventory_uom_id, uom_description }) => {
                              return {
                                name: uom_description,
                                value: hims_d_inventory_uom_id,
                              };
                            }
                          ),
                    others: { Width: 140 },
                  },
                  {
                    fieldName: "sales_uom",
                    label: <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />,
                    displayTemplate: (row) => {
                      let display =
                        this.props.inventoryitemuom === undefined
                          ? []
                          : this.props.inventoryitemuom.filter(
                              (f) => f.hims_d_inventory_uom_id === row.sales_uom
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
                      this.props.inventoryitemuom === undefined
                        ? []
                        : this.props?.inventoryitemuom?.map(
                            ({ hims_d_inventory_uom_id, uom_description }) => {
                              return {
                                name: uom_description,
                                value: hims_d_inventory_uom_id,
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
                    others: { Width: 140 },
                  },
                ]}
                keyId="item_id"
                // data="this.state.ListItems"
                noDataText="No Stock available for selected Item in the selected Location"
                data={
                  this.state.ListItems === undefined ? [] : this.state.ListItems
                }
                pagination={true}
                pageOptions={{ rows: 20, page: 1 }}
                isFilterable={true}
                events={{
                  //   onDelete: deleteServices.bind(this, this),
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
                  onClick={() => downloadInvStockDetails(this)}
                >
                  Download Stock Details
                </button>
                <button
                  className="btn btn-default"
                  disabled={!this.state.location_id}
                  onClick={() => downloadInvStock(this)}
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
          location_id={this.state.location_id}
          location_type={this.state.location_type}
          trans_ack_required={this.state.trans_ack_required}
          requisition_auth_level={this.state.requisition_auth_level}
          trans_required={this.state.trans_required}
          location_description={this.state.location_description}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    inventorylocations: state.inventorylocations,
    inventoryitemuom: state.inventoryitemuom,
    git_locations: state.git_locations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getGITLocation: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InvStockEnquiry)
);
