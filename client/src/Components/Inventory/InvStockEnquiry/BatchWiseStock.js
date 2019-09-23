import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import {
  // changeTexts,
  dateFormater,
  updateStockDetils,
  datehandle,
  texthandle
} from "./InvStockEnquiryEvents";
import "./InvStockEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

class BatchWiseStock extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this)
          }}
          title="Batch Wise Item"
          openPopup={this.props.show}
          class={this.state.lang_sets}
        >
          <div className="hptl-phase1-speciman-collection-form">
            <div className="portlet portlet-bordered margin-bottom-15">
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
                      editorTemplate: row => {
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
                      others: { filterable: false }
                    },

                    {
                      fieldName: "item_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
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
                      editorTemplate: row => {
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
                      others: { filterable: false }
                    },
                    {
                      fieldName: "stocking_uom_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                f =>
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
                      others: { filterable: false }
                    },
                    {
                      fieldName: "sales_uom",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />
                      ),
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

                      editorTemplate: row => {
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
                      others: { filterable: false }
                    },
                    {
                      fieldName: "barcode",
                      label: <AlgaehLabel label={{ forceLabel: "Barcode" }} />,
                      disabled: true,
                      others: { filterable: false }
                    },
                    {
                      fieldName: "batchno",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "vendor_batchno",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Vendor Batch No." }}
                        />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "expirydt",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(this, row.expirydt)}</span>;
                      },
                      editorTemplate: row => {
                        return (
                          <AlgaehDateHandler
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld hidden",
                              name: "expirydt"
                            }}
                            minDate={new Date()}
                            events={{
                              onChange: datehandle.bind(this, this, row)
                            }}
                            value={row.expirydt}
                          />
                        );
                      },
                      others: { filterable: false }
                    },
                    {
                      fieldName: "qtyhand",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: row => {
                        return parseFloat(row.qtyhand);
                      },
                      disabled: true,
                      others: { filterable: false }
                    },
                    {
                      fieldName: "git_qty",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "GIT Quantity" }} />
                      ),
                      displayTemplate: row => {
                        return parseFloat(row.git_qty);
                      },
                      disabled: true,
                      others: { filterable: false }
                    },
                    {
                      fieldName: "avgcost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.avgcost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      disabled: true,
                      others: { filterable: false }
                    },
                    {
                      fieldName: "sale_price",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.sale_price, {
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
                              value: row.sale_price,
                              className: "txt-fld",
                              name: "sale_price",
                              events: {
                                onChange: texthandle.bind(this, this, row)
                              }
                            }}
                          />
                        );
                      },
                      others: { filterable: false }
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data:
                      this.props.batch_wise_item === undefined
                        ? []
                        : this.props.batch_wise_item
                  }}
                  noDataText="No Stock available for selected Item in the selected Location"
                  isEditable={false}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //   onDelete: deleteServices.bind(this, this),
                    onEdit: row => {},
                    onDone: updateStockDetils.bind(this, this)
                  }}
                />
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    inventorylocations: state.inventorylocations,
    inventoryitemuom: state.inventoryitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BatchWiseStock)
);
