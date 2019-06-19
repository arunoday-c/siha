import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  dateFormater,
  updateStockDetils,
  datehandle,
  texthandle
} from "./InvStockEnquiryEvents";
import "./InvStockEnquiry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import Enumerable from "linq";

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
                      }
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
                      }
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
                      }
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
                      }
                    },
                    {
                      fieldName: "barcode",
                      label: <AlgaehLabel label={{ forceLabel: "Barcode" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "batchno",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Batch No." }} />
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
                      }
                    },
                    {
                      fieldName: "qtyhand",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      disabled: true
                    },
                    {
                      fieldName: "avgcost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />
                      ),
                      disabled: true
                    },
                    {
                      fieldName: "sale_price",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
                      ),
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
                      }
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
