import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

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
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode
} from "./InitialStockEvents";
import "./InitialStock.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";

class InitialStock extends Component {
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
      SnackbarOpen: false,
      MandatoryMsg: "",
      uom_id: null
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations"
      }
    });

    this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "itemcategory"
      }
    });

    this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "itemgroup"
      }
    });

    this.props.getItemUOM({
      uri: "/pharmacy/getPharmacyUom",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "itemuom"
      }
    });
  }

  handleClose = () => {
    this.setState({ SnackbarOpen: false });
  };

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
            //breadWidth={this.props.breadWidth}
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
              value: this.state.patient_code,
              selectValue: "patient_code",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "frontDesk.patients"
              },
              searchName: "patients"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "Initial Stock Date" }} />
                  ),
                  className: "internal-label"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date"
                }}
                disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.initial_stock_date}
              />
            }
            selectedLang={this.state.selectedLang}
          />

          <div className="hptl-phase1-initial-stock-form">
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
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Item Category" }}
                  selector={{
                    name: "item_category",
                    className: "select-fld",
                    value: this.state.item_category,
                    dataSource: {
                      textField: "category_desc",
                      valueField: "hims_d_item_category_id",
                      data: this.props.itemcategory
                    },
                    others: {
                      disabled: true
                    },
                    onChange: null
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Item Group" }}
                  selector={{
                    name: "item_group",
                    className: "select-fld",
                    value: this.state.item_group,
                    dataSource: {
                      textField: "group_description",
                      valueField: "hims_d_item_group_id",
                      data: this.props.itemgroup
                    },
                    others: {
                      disabled: true
                    },
                    onChange: null
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
                      valueField: "hims_d_item_master_id",
                      data: this.props.itemlist
                    },
                    onChange: itemchangeText.bind(this, this)
                  }}
                />
              </div>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "UOM" }}
                  selector={{
                    name: "uom_id",
                    className: "select-fld",
                    value: this.state.uom_id,
                    dataSource: {
                      textField: "uom_description",
                      valueField: "hims_d_pharmacy_uom_id",
                      data: this.props.itemuom
                    },
                    onChange: itemchangeText.bind(this, this)
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Batch No."
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
                  label={{ forceLabel: "Expiry Date" }}
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
                    forceLabel: "Quantity"
                  }}
                  textBox={{
                    number: { allowNegative: false, thousandSeparator: "," },
                    className: "txt-fld",
                    name: "quantity",
                    value: this.state.quantity,
                    events: {
                      onChange: numberchangeTexts.bind(this, this)
                    }
                  }}
                />
              </div>

              <div className="row">
                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Unit Cost"
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

                <div className="col-lg-3">
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "24px" }}
                    onClick={AddItems.bind(this, this)}
                  >
                    Add Item
                  </button>
                </div>
              </div>

              <div className="row form-group">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.locations === undefined
                            ? []
                            : this.props.locations.filter(
                                f =>
                                  f.hims_d_pharmacy_location_id ===
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
                      fieldName: "category_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Category" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemcategory === undefined
                            ? []
                            : this.props.itemcategory.filter(
                                f =>
                                  f.hims_d_item_category_id === row.category_id
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
                      fieldName: "group_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Group" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.itemgroup === undefined
                            ? []
                            : this.props.itemgroup.filter(
                                f => f.hims_d_item_group_id === row.group_id
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
                          this.props.itemlist === undefined
                            ? []
                            : this.props.itemlist.filter(
                                f => f.hims_d_item_master_id === row.item_id
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
                      fieldName: "batch_no",
                      label: <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                    },
                    {
                      fieldName: "expirt_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(row.expirt_date)}</span>;
                      }
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                    },
                    {
                      fieldName: "unit_cost",
                      label: <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.ListItems
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
              <AppBar position="static" className="main">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      // onClick={this.SavePatientDetails.bind(this)}
                      disabled={this.state.saveEnable}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Save", returnText: true }}
                      />
                    </button>

                    <AHSnackbar
                      open={this.state.SnackbarOpen}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
                    <button
                      type="button"
                      className="btn btn-default"
                      // onClick={this.ClearData.bind(this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>

                    <button
                      type="button"
                      className="btn btn-other"
                      // onClick={this.ShowRefundScreen.bind(this)}
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
              </AppBar>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    locations: state.locations,
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    itemuom: state.itemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InitialStock)
);
