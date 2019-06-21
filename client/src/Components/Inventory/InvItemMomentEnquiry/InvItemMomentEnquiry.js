import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment
} from "./InvItemMomentEnquiryEvents";
import "./InvItemMomentEnquiry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { getAmountFormart } from "../../../utils/GlobalFunctions";

class InvItemMomentEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Inventory_Itemmoment: [],
      location_id: null,
      item_code_id: null,
      from_date: null,
      to_date: null,
      barcode: null,
      transaction_type: null
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/inventory/getItemMaster",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "inventoryitemlist"
      }
    });

    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "inventorylocations"
      }
    });

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom"
        }
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
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
                    label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
                  />
                )
              }
            ]}
          />

          <div
            className="hptl-phase1-item-moment-enquiry-form"
            data-validate="itemMoment"
          >
            <div
              className="row inner-top-search"
              style={{ marginTop: 76, paddingBottom: 10 }}
            >
              <div className="col-lg-12">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "From Date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "from_date" }}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ forceLabel: "To Date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "to_date" }}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    maxDate={new Date()}
                    value={this.state.to_date}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Item Name" }}
                    selector={{
                      name: "item_code_id",
                      className: "select-fld",
                      value: this.state.item_code_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_inventory_item_master_id",
                        data: this.props.inventoryitemlist
                      },
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          item_code_id: null
                        });
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Item Barcode"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "barcode",
                      value: this.state.barcode,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
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
                      onClear: () => {
                        this.setState({
                          location_id: null
                        });
                      },
                      onChange: changeTexts.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Transaction Type" }}
                    selector={{
                      name: "transaction_type",
                      className: "select-fld",
                      value: this.state.transaction_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_TRANSACTION_TYPE
                      },
                      onClear: () => {
                        this.setState({
                          transaction_type: null
                        });
                      },
                      onChange: changeTexts.bind(this, this)
                    }}
                  />

                  <div className="col" style={{ paddingTop: "3vh" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={ProcessItemMoment.bind(this, this)}
                    >
                      Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body" id="initialStock_Cntr">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "transaction_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Type" }}
                        />
                      ),
                      displayTemplate: row => {
                        return row.transaction_type === "MR"
                          ? "Material Requisition"
                          : row.transaction_type === "ST"
                          ? "Stock Transfer"
                          : row.transaction_type === "POS"
                          ? "Point of Sale"
                          : row.transaction_type === "SRT"
                          ? "Sales Return"
                          : row.transaction_type === "INT"
                          ? "Opening Stock"
                          : row.transaction_type === "CS"
                          ? "Consumption"
                          : row.transaction_type === "REC"
                          ? "Receipt"
                          : row.transaction_type === "PO"
                          ? "Purchase Order"
                          : row.transaction_type === "DNA"
                          ? "Delivery Note"
                          : "";
                      }
                    },
                    {
                      fieldName: "transaction_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Date" }}
                        />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>{dateFormater(row.transaction_date)}</span>
                        );
                      }
                    },
                    {
                      fieldName: "from_location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.inventorylocations === undefined
                            ? []
                            : this.props.inventorylocations.filter(
                                f =>
                                  f.hims_d_inventory_location_id ===
                                  row.from_location_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].location_description
                              : ""}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "item_code_id",
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
                                  row.item_code_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].item_description
                              : ""}
                            {display !== null && display.length !== 0 ? (
                              <i
                                className={
                                  row.operation === "+"
                                    ? "fas fa-arrow-up green"
                                    : row.operation === "-"
                                    ? "fas fa-arrow-down red"
                                    : ""
                                }
                              />
                            ) : (
                              ""
                            )}
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "transaction_uom",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Unit of Measure" }}
                        />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                f =>
                                  f.hims_d_inventory_uom_id ===
                                  row.transaction_uom
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
                      fieldName: "batchno",
                      label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                    },
                    {
                      fieldName: "expiry_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(row.expiry_date)}</span>;
                      }
                    },
                    {
                      fieldName: "transaction_qty",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: row => {
                        return parseFloat(row.transaction_qty);
                      }
                    },
                    {
                      fieldName: "transaction_cost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.transaction_cost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      }
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.Inventory_Itemmoment
                  }}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
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
    insuranceitemmoment: state.insuranceitemmoment,
    inventoryitemuom: state.inventoryitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemMoment: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvItemMomentEnquiry)
);
