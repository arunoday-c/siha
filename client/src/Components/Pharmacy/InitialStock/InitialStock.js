import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
  PostInitialStock,
  printBarcode,
  salesPriceEvent,
  dateValidate,
  updateInitialStock,
  onChamgeGridQuantity,
  EditGrid
} from "./InitialStockEvents";
import "./InitialStock.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";
import { getAmountFormart } from "../../../utils/GlobalFunctions";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

class InitialStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      description: "",
      pharmacy_stock_detail: [],
      location_id: null,
      item_category_id: null,
      item_group_id: null,
      sales_uom: null,
      item_id: null,
      batchno: null,
      vendor_batchno: null,
      expiry_date: null,
      quantity: 0,
      unit_cost: 0,
      docdate: new Date(),
      sales_price: 0,
      uom_id: null,
      conversion_fact: null,
      extended_cost: 0,
      saveEnable: true,
      posted: "N",
      grn_number: null,
      postEnable: true,
      dataExitst: false,
      stock_uom_desc: null,
      sales_uom_desc: null,
      item_description: ""
    };
  }

  componentDidMount() {
    const hospital = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    );

    this.props.getItems({
      uri: "/pharmacy/getItemMasterWithSalesPrice",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "intitemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      data: {
        location_status: "A",
        hospital_id: hospital.hims_d_hospital_id
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "intlocations"
      }
    });

    if (
      this.props.intitemcategory === undefined ||
      this.props.intitemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/pharmacy/getItemCategory",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "intitemcategory"
        }
      });
    }
    if (
      this.props.intitemgroup === undefined ||
      this.props.intitemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/pharmacy/getItemGroup",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GROUP_GET_DATA",
          mappingName: "intitemgroup"
        }
      });
    }
    if (
      this.props.intitemuom === undefined ||
      this.props.intitemuom.length === 0
    ) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "intitemuom"
        }
      });
    }
  }

  render() {
    const stock_uom_desc =
      this.state.stock_uom_desc === null ? "-----" : this.state.stock_uom_desc;

    const sales_uom_desc =
      this.state.sales_uom_desc === null ? "-----" : this.state.sales_uom_desc;
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Opening Stock", align: "ltr" }}
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
                    label={{ forceLabel: "Opening Stock", align: "ltr" }}
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
                fieldName: "initialStock.intstock"
              },
              searchName: "initialstock"
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

          <div className="hptl-phase1-initial-stock-form">
            {/* description */}

            <div
              className="portlet portlet-bordered margin-bottom-15"
              style={{ marginTop: 90 }}
            >
              {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Insurance Provider List</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
              <div className="portlet-body">
                <div className="row inline">
                  <AlagehFormGroup
                    div={{ className: "col-6 form-group" }}
                    label={{
                      forceLabel: "Description Pharmacy"
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "description",
                      value: this.state.description,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      },
                      others: {
                        autoComplete: "off",
                        disabled: this.state.dataExitst
                      }
                    }}
                  />
                </div>
                <div className="row" data-validate="IntialStock">
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Location", isImp: true }}
                    selector={{
                      name: "location_id",
                      className: "select-fld",
                      value: this.state.location_id,
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_pharmacy_location_id",
                        data: this.props.intlocations,
                        autoComplete: "off"
                      },

                      onChange: LocationchangeTexts.bind(this, this)
                    }}
                  />

                  <AlgaehAutoSearch
                    div={{ className: "col-3" }}
                    label={{ forceLabel: "Item Name" }}
                    title="Search Items"
                    id="item_id_search"
                    template={result => {
                      return (
                        <section className="resultSecStyles">
                          <div className="row">
                            <div className="col-8">
                              <h4 className="title">
                                {result.item_description}
                              </h4>
                              <small>{result.generic_name}</small>
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
                      this.setState({
                        item_category_id: null,
                        item_group_id: null,
                        uom_id: null,
                        sales_uom: null,
                        required_batchno: null,
                        item_code: null,
                        unit_cost: 0,
                        sales_price: 0,
                        purchase_uom_id: null,
                        stock_uom_desc: null,
                        sales_uom_desc: null
                      });
                    }}
                    ref={attReg => {
                      this.attReg = attReg;
                    }}
                  />

                  {/*<AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Item Name", isImp: true }}
                    selector={{
                      name: "item_id",
                      className: "select-fld",
                      value: this.state.item_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_item_master_id",
                        data: this.props.intitemlist,
                        autoComplete: "newPassword"
                      },
                      onChange: itemchangeText.bind(this, this)
                    }}
                  />*/}
                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Item Category", isImp: true }}
                    selector={{
                      name: "item_category_id",
                      className: "select-fld",
                      value: this.state.item_category_id,
                      dataSource: {
                        textField: "category_desc",
                        valueField: "hims_d_item_category_id",
                        data: this.props.intitemcategory,
                        autoComplete: "off"
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "Item Group", isImp: true }}
                    selector={{
                      name: "item_group_id",
                      className: "select-fld",
                      value: this.state.item_group_id,
                      dataSource: {
                        textField: "group_description",
                        valueField: "hims_d_item_group_id",
                        data: this.props.intitemgroup,
                        autoComplete: "off"
                      },
                      others: {
                        disabled: true
                      },
                      onChange: null
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col-3 form-group" }}
                    label={{ forceLabel: "UOM", isImp: true }}
                    selector={{
                      name: "uom_id",
                      className: "select-fld",
                      value: this.state.uom_id,
                      dataSource: {
                        textField: "uom_description",
                        valueField: "hims_d_pharmacy_uom_id",
                        data: this.props.intitemuom,
                        autoComplete: "off"
                      },
                      others: {
                        disabled: true
                      },
                      onChange: itemchangeText.bind(this, this)
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Vendor Batch No."
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "vendor_batchno",
                      value: this.state.vendor_batchno,
                      events: {
                        onChange: changeTexts.bind(this, this)
                      },
                      others: {
                        autoComplete: "off"
                      }
                    }}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Expiry Date",
                      isImp: this.state.required_batchno === "N" ? true : false
                    }}
                    textBox={{ className: "txt-fld", name: "expiry_date" }}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this)
                    }}
                    value={this.state.expiry_date}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
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
                      dontAllowKeys: ["-", "e", "."],
                      events: {
                        onChange: numberchangeTexts.bind(this, this)
                      },
                      others: { step: "1", autoComplete: "off" }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Unit Cost" + "(" + stock_uom_desc + ")",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.unit_cost,
                      className: "txt-fld",
                      name: "unit_cost",
                      events: {
                        onChange: numberchangeTexts.bind(this, this)
                      },
                      others: {
                        autoComplete: "off"
                        // type: "number"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
                    label={{
                      forceLabel: "Sales Price" + "(" + sales_uom_desc + ")",
                      isImp: true
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.sales_price,
                      className: "txt-fld",
                      name: "sales_price",
                      events: {
                        onChange: salesPriceEvent.bind(this, this)
                      },
                      others: {
                        autoComplete: "off"
                      }
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col-3 form-group" }}
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
                      },
                      others: {
                        autoComplete: "off"
                      }
                    }}
                  />

                  <div className="col">
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: 21 }}
                      onClick={AddItems.bind(this, this)}
                      disabled={this.state.dataExitst}
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body" id="initialStockCntr">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "Print" }} />,
                      displayTemplate: row => {
                        return (
                          <span>
                            <i
                              style={{
                                pointerEvents:
                                  this.state.dataExitst === false ? "none" : "",
                                opacity:
                                  this.state.dataExitst === false ? "0.1" : ""
                              }}
                              onClick={printBarcode.bind(this, this, row)}
                              className="fas fa-barcode"
                            />
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            <i
                              style={{
                                pointerEvents:
                                  this.state.dataExitst === false ? "none" : "",
                                opacity:
                                  this.state.dataExitst === false ? "0.1" : ""
                              }}
                              onClick={printBarcode.bind(this, this, row)}
                              className="fas fa-barcode"
                            />
                          </span>
                        );
                      },
                      others: { filterable: false }
                    },
                    {
                      fieldName: "location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: row => {
                        let display =
                          this.props.intlocations === undefined
                            ? []
                            : this.props.intlocations.filter(
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
                      editorTemplate: row => {
                        let display =
                          this.props.intlocations === undefined
                            ? []
                            : this.props.intlocations.filter(
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
                      others: {
                        minWidth: 150,
                        filterable: false
                      }
                    },

                    {
                      fieldName: "item_category_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Category" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.intitemcategory === undefined
                            ? []
                            : this.props.intitemcategory.filter(
                                f =>
                                  f.hims_d_item_category_id ===
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
                      editorTemplate: row => {
                        let display =
                          this.props.intitemcategory === undefined
                            ? []
                            : this.props.intitemcategory.filter(
                                f =>
                                  f.hims_d_item_category_id ===
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

                      others: {
                        minWidth: 250,
                        filterable: false
                      }
                    },

                    {
                      fieldName: "item_group_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Group" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.intitemgroup === undefined
                            ? []
                            : this.props.intitemgroup.filter(
                                f =>
                                  f.hims_d_item_group_id === row.item_group_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].group_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        let display =
                          this.props.intitemgroup === undefined
                            ? []
                            : this.props.intitemgroup.filter(
                                f =>
                                  f.hims_d_item_group_id === row.item_group_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].group_description
                              : ""}
                          </span>
                        );
                      },
                      others: {
                        minWidth: 150,
                        filterable: false
                      }
                    },

                    {
                      fieldName: "item_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      displayTemplate: row => {
                        let display =
                          this.props.intitemlist === undefined
                            ? []
                            : this.props.intitemlist.filter(
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
                      editorTemplate: row => {
                        let display =
                          this.props.intitemlist === undefined
                            ? []
                            : this.props.intitemlist.filter(
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
                      others: {
                        minWidth: 250
                      }
                    },
                    {
                      fieldName: "vendor_batchno",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Vendor Batch No." }}
                        />
                      ),
                      disabled: true,
                      others: {
                        minWidth: 150,
                        filterable: false
                      }
                    },
                    {
                      fieldName: "expiry_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: row => {
                        return <span>{dateFormater(row.expiry_date)}</span>;
                      },
                      editorTemplate: row => {
                        return <span>{dateFormater(row.expiry_date)}</span>;
                      },
                      others: {
                        filterable: false
                      }
                    },
                    {
                      fieldName: "quantity",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: row => {
                        return row.quantity !== ""
                          ? parseFloat(row.quantity)
                          : "";
                      },
                      editorTemplate: row => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              number: { allowNegative: false },
                              value:
                                row.quantity !== ""
                                  ? parseFloat(row.quantity)
                                  : "",
                              className: "txt-fld",
                              name: "quantity",
                              dontAllowKeys: ["-", "e", "."],
                              events: {
                                onChange: onChamgeGridQuantity.bind(
                                  this,
                                  this,
                                  row
                                )
                              },
                              others: {
                                min: 0,
                                algaeh_required: "true",
                                errormessage: "Please enter Quantity ..",
                                checkvalidation: "value ==='' || value ==='0'"
                              }
                            }}
                          />
                        );
                      },
                      others: {
                        filterable: false
                      }
                    },
                    {
                      fieldName: "unit_cost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.unit_cost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.unit_cost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      others: {
                        filterable: false
                      }
                    },
                    {
                      fieldName: "sales_price",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.sales_price, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.sales_price, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      others: {
                        filterable: false
                      }
                    },

                    {
                      fieldName: "extended_cost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Extended Cost" }} />
                      ),
                      displayTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.extended_cost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      editorTemplate: row => {
                        return (
                          <span>
                            {getAmountFormart(row.extended_cost, {
                              appendSymbol: false
                            })}
                          </span>
                        );
                      },
                      others: {
                        filterable: false
                      }
                    },
                    {
                      fieldName: "grn_number",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Receipt No. (GRN)" }}
                        />
                      ),

                      disabled: true,
                      others: {
                        minWidth: 120,
                        filterable: false
                      }
                    }
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.pharmacy_stock_detail
                  }}
                  isEditable={!this.state.dataExitst}
                  byForceEvents={true}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    onDelete: deleteInitialStock.bind(this, this),
                    onEdit: EditGrid.bind(this, this),
                    onCancel: EditGrid.bind(this, this),
                    onDone: updateInitialStock.bind(this, this)
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

                  {/*<button
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
                  </button>*/}
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
    intitemlist: state.intitemlist,
    intlocations: state.intlocations,
    intitemcategory: state.intitemcategory,
    intitemgroup: state.intitemgroup,
    intitemuom: state.intitemuom,
    initialstock: state.initialstock
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
      getInitialStock: AlgaehActions
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

{
  /*{
  fieldName: "action",
  label: <AlgaehLabel label={{ forceLabel: "Action" }} />,
  displayTemplate: row => {
    return this.state.saveEnable === true ? (
      <span onClick={printBarcode.bind(this, this, row)}>
        <i className="fas fa-barcode" />
      </span>
    ) : (
      <span
        onClick={deleteInitialStock.bind(this, this, row)}
      >
        <i className="fas fa-times" />
      </span>
    );
  }
},*/
}
