import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";
import Options from "../../../Options.json";
import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode,
  SaveInitialStock,
  LocationchangeTexts,
  deleteInitialStock,
  ClearData,
  PostInitialStock
} from "./InvInitialStockEvents";
import "./InvInitialStock.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

class InvInitialStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      inventory_stock_detail: [],
      location_id: null,
      item_category_id: null,
      item_group_id: null,
      sales_uom: null,
      item_id: null,
      batchno: null,
      expiry_date: null,
      quantity: 0,
      unit_cost: 0,
      docdate: new Date(),
      SnackbarOpen: false,
      MandatoryMsg: "",
      uom_id: null,
      conversion_fact: null,
      extended_cost: 0,
      saveEnable: true,
      posted: "N",
      grn_number: null,
      postEnable: true,
      dataExitst: false
    };
  }

  componentDidMount() {
    if (
      this.props.inventoryitemlist === undefined ||
      this.props.inventoryitemlist.length === 0
    ) {
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
      this.props.inventorylocations === undefined ||
      this.props.inventorylocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        method: "GET",
        redux: {
          type: "LOCATIONS_GET_DATA",
          mappingName: "inventorylocations"
        }
      });
    }
    if (
      this.props.inventoryitemcategory === undefined ||
      this.props.inventoryitemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/inventory/getItemCategory",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "inventoryitemcategory"
        },
        afterSuccess: data => {}
      });
    }
    if (
      this.props.inventoryitemgroup === undefined ||
      this.props.inventoryitemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/inventory/getItemGroup",
        method: "GET",
        redux: {
          type: "ITEM_GROUP_GET_DATA",
          mappingName: "inventoryitemgroup"
        }
      });
    }
    if (
      this.props.inventoryitemuom === undefined ||
      this.props.inventoryitemuom.length === 0
    ) {
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
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Initial Stock", align: "ltr" }}
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
                    label={{ forceLabel: "Initial Stock", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Document Number", returnText: true }}
                />
              ),
              value: this.state.document_number,
              selectValue: "document_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "initialStock.invintstock"
              },
              searchName: "invinitialstock"
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Initial Stock Date"
                    }}
                  />
                  <h6>
                    {this.state.docdate
                      ? moment(this.state.docdate).format(Options.dateFormat)
                      : Options.dateFormat}
                  </h6>
                </div>
              </div>
            }
            selectedLang={this.state.selectedLang}
          />

          <div className="hptl-phase1-inv-initial-stock-form">
            {/* description */}

            <div
              className="portlet portlet-bordered box-shadow-normal margin-bottom-15"
              style={{ marginTop: 90 }}
            >
              <div className="portlet-body">
                <div className="row inline">
                  <AlagehFormGroup
                    div={{ className: "col-lg-12" }}
                    label={{
                      forceLabel: "Description Inv"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "description",
                      value: this.state.description,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />
                </div>
                <div className="row" data-validate="InvIntialStock">
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Location", isImp: true }}
                    selector={{
                      name: "location_id",
                      className: "select-fld",
                      value: this.state.location_id,
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_inventory_location_id",
                        data: this.props.inventorylocations
                      },

                      onChange: LocationchangeTexts.bind(this, this)
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Item Name", isImp: true }}
                    selector={{
                      name: "item_id",
                      className: "select-fld",
                      value: this.state.item_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_inventory_item_master_id",
                        data: this.props.inventoryitemlist
                      },
                      onChange: itemchangeText.bind(this, this)
                    }}
                  />
                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Item Category", isImp: true }}
                    selector={{
                      name: "item_category_id",
                      className: "select-fld",
                      value: this.state.item_category_id,
                      dataSource: {
                        textField: "category_desc",
                        valueField: "hims_d_inventory_tem_category_id",
                        data: this.props.inventoryitemcategory
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Item Group", isImp: true }}
                    selector={{
                      name: "item_group_id",
                      className: "select-fld",
                      value: this.state.item_group_id,
                      dataSource: {
                        textField: "group_description",
                        valueField: "hims_d_inventory_item_group_id",
                        data: this.props.inventoryitemgroup
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "UOM", isImp: true }}
                    selector={{
                      name: "uom_id",
                      className: "select-fld",
                      value: this.state.uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "hims_d_inventory_uom_id",
                        data: this.props.inventoryitemuom
                      },
                      others: {
                        disabled: true
                      },
                      onChange: itemchangeText.bind(this, this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Batch No.",
                      isImp: true
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "batchno",
                      value: this.state.batchno,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />

                  <AlgaehDateHandler
                    div={{ className: "col-lg-3" }}
                    label={{ forceLabel: "Expiry Date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "expiry_date" }}
                    minDate={new Date()}
                    events={{
                      onChange: datehandle.bind(this, this)
                    }}
                    value={this.state.expiry_date}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Quantity",
                      isImp: true
                    }}
                    textBox={{
                      number: {
                        allowNegative: false,
                        thousandSeparator: ","
                      },
                      className: "txt-fld",
                      name: "quantity",
                      value: this.state.quantity,
                      events: {
                        onChange: numberchangeTexts.bind(this, this)
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Unit Cost",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.unit_cost,
                      className: "txt-fld",
                      name: "unit_cost",
                      events: {
                        onChange: numberchangeTexts.bind(this, this)
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-lg-3" }}
                    label={{
                      forceLabel: "Receipt Number(GRN)",
                      isImp: true
                    }}
                    textBox={{
                      value: this.state.grn_number,
                      className: "txt-fld",
                      name: "grn_number",
                      events: {
                        onChange: changeTexts.bind(this, this)
                      }
                    }}
                  />

                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: "24px" }}
                      onClick={AddItems.bind(this, this)}
                      disabled={this.state.dataExitst}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
              <div className="portlet-body">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              className="fas fa-times"
                              onClick={deleteInitialStock.bind(this, this, row)}
                            />
                          </span>
                        );
                      }
                    },
                    {
                      fieldName: "location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.inventorylocations === undefined
                            ? []
                            : this.props.inventorylocations.filter(
                                f =>
                                  f.hims_d_inventory_location_id ===
                                  row.location_id
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
                      fieldName: "item_category_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Category" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.inventoryitemcategory === undefined
                            ? []
                            : this.props.inventoryitemcategory.filter(
                                f =>
                                  f.hims_d_inventory_tem_category_id ===
                                  row.item_category_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].category_desc
                              : ""}
                          </span>
                        );
                      },
                      disabled: true
                    },

                    {
                      fieldName: "item_group_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Group" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.inventoryitemgroup === undefined
                            ? []
                            : this.props.inventoryitemgroup.filter(
                                f =>
                                  f.hims_d_inventory_item_group_id ===
                                  row.item_group_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].group_description
                              : ""}
                          </span>
                        );
                      },
                      disabled: true
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
                      disabled: true
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
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                    },
                    {
                      fieldName: "unit_cost",
                      label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    },
                    {
                      fieldName: "extended_cost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Extended Cost" }} />
                      )
                    },
                    {
                      fieldName: "grn_number",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Recipt Number(GRN)" }}
                        />
                      )
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.inventory_stock_detail
                  }}
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

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SaveInitialStock.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-other"
                    onClick={PostInitialStock.bind(this, this)}
                    disabled={this.state.postEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Post",
                        returnText: true
                      }}
                    />
                  </button>
                </div>
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
    inventoryitemcategory: state.inventoryitemcategory,
    inventoryitemgroup: state.inventoryitemgroup,
    inventoryitemuom: state.inventoryitemuom,
    inventoryitemuomlist: state.inventoryitemuomlist,
    inventoryinitialstock: state.inventoryinitialstock
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
      getItemMasterAndItemUom: AlgaehActions,
      getInitialStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvInitialStock)
);
