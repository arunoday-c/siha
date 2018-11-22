import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import { changeTexts, dateFormater } from "./InvStockEnquiryEvents";
import "./InvStockEnquiry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";

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
      initial_stock_date: new Date()
    };
  }

  componentDidMount() {
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist"
        }
      });
    }

    if (
      this.props.locations === undefined ||
      this.props.locations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        method: "GET",
        redux: {
          type: "ANALYTES_GET_DATA",
          mappingName: "inventorylocations"
        }
      });
    }
    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom"
        }
      });
    }
  }

  render() {
    // inventoryitemBatch

    let total_quantity = Enumerable.from(this.props.inventoryitemBatch)
      .select(w => w.qtyhand)
      .sum();

    return (
      <React.Fragment>
        <div className="hptl-phase1-speciman-collection-form">
          <BreadCrumb
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
                      align: "ltr"
                    }}
                  />
                )
              },
              {
                pageName: (
                  <AlgaehLabel
                    label={{ forceLabel: "Stock Enquiry", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
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
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.inventorylocations
                    },

                    onChange: changeTexts.bind(this, this),
                    onClear: changeTexts.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Item Name" }}
                  selector={{
                    name: "item_id",
                    className: "select-fld",
                    value: this.state.item_id,
                    dataSource: {
                      textField: "item_description",
                      valueField: "hims_d_inventory_item_master_id",
                      data: this.props.inventoryitemlist
                    },
                    onChange: changeTexts.bind(this, this),
                    onClear: changeTexts.bind(this, this)
                  }}
                />
                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Total Quantity"
                    }}
                  />
                  <h6>{total_quantity ? total_quantity + " nos" : "0 nos"}</h6>
                </div>
              </div>
            </div>
          </div>

          <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
            {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
            <div className="portlet-body" id="precriptionList_Cntr">
              <AlgaehDataGrid
                id="inv_initial_stock"
                columns={[
                  {
                    fieldName: "inventory_location_id",
                    label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.inventorylocations === undefined
                          ? []
                          : this.props.inventorylocations.filter(
                              f =>
                                f.hims_d_inventory_location_id ===
                                row.inventory_location_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].location_description
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },

                  {
                    fieldName: "item_id",
                    label: <AlgaehLabel label={{ forceLabel: "Item Name" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.inventoryitemlist === undefined
                          ? []
                          : this.props.inventoryitemlist.filter(
                              f =>
                                f.hims_d_inventory_item_master_id ===
                                row.item_id
                            );

                      return (
                        <span>
                          {display !== undefined && display.length !== 0
                            ? display[0].item_description
                            : ""}
                        </span>
                      );
                    },
                    disabled: true
                  },
                  {
                    fieldName: "sales_uom",
                    label: <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />,
                    displayTemplate: row => {
                      let display =
                        this.props.inventoryitemuom === undefined
                          ? []
                          : this.props.inventoryitemuom.filter(
                              f => f.hims_d_inventory_uom_id === row.sales_uom
                            );

                      return (
                        <span>
                          {display !== null && display.length !== 0
                            ? display[0].uom_description
                            : ""}
                        </span>
                      );
                    },

                    disabled: true
                  },
                  {
                    fieldName: "batchno",
                    label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                  },
                  {
                    fieldName: "expirydt",
                    label: (
                      <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                    ),
                    displayTemplate: row => {
                      return <span>{dateFormater(this, row.expirydt)}</span>;
                    }
                  },
                  {
                    fieldName: "qtyhand",
                    label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                  },
                  {
                    fieldName: "avgcost",
                    label: <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />
                  }
                ]}
                keyId="item_id"
                dataSource={{
                  data: this.props.inventoryitemBatch
                }}
                noDataText="No Stock available for selected Item in the selected Location"
                // isEditable={true}
                paging={{ page: 0, rowsPerPage: 10 }}
                events={{
                  //   onDelete: deleteServices.bind(this, this),
                  onEdit: row => {}
                  // onDone: this.updateBillDetail.bind(this)
                }}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    inventorylocations: state.inventorylocations,
    inventoryitemBatch: state.inventoryitemBatch,
    inventoryitemuom: state.inventoryitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemLocationStock: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvStockEnquiry)
);
