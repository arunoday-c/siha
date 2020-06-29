import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch.js";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  texthandle,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteQuotationDetail,
} from "./RequestItemListEvents";

class RequestItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.RequestQuotation;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.RequestQuotation);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="hims-purchase-order-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      {/* <AlagehAutoComplete
                        div={{ className: "col-lg-3" }}
                        label={{ forceLabel: "Item Name" }}
                        selector={{
                          name:
                            this.state.quotation_for === "PHR"
                              ? "phar_item_id"
                              : "inv_item_id",
                          className: "select-fld",
                          value:
                            this.state.quotation_for === "PHR"
                              ? this.state.phar_item_id
                              : this.state.inv_item_id,
                          dataSource: {
                            textField: "item_description",
                            valueField:
                              this.state.quotation_for === "PHR"
                                ? "hims_d_item_master_id"
                                : "hims_d_inventory_item_master_id",
                            data: this.props.poitemlist,
                          },
                          others: {
                            disabled: this.state.dataExitst,
                          },
                          onChange: itemchangeText.bind(this, this, context),
                        }}
                      /> */}
                      <AlgaehAutoSearch
                        div={{ className: "col-3 form-group mandatory" }}
                        label={{ forceLabel: "Item Name" }}
                        title="Search Items"
                        id="item_id_search"
                        template={(result) => {
                          return (
                            <section className="resultSecStyles">
                              <div className="row">
                                <div className="col-12">
                                  <h4 className="title">
                                    {result.item_description}
                                  </h4>
                                  <small>{result.uom_description}</small>
                                </div>
                              </div>
                            </section>
                          );
                        }}
                        name={
                          this.state.quotation_for === "PHR"
                            ? "phar_item_id"
                            : "inv_item_id"
                        }
                        columns={
                          this.state.quotation_for === "PHR"
                            ? spotlightSearch.Items.Pharmacyitemmaster
                            : spotlightSearch.Items.Invitemmaster
                        }
                        displayField="item_description"
                        value={this.state.item_description}
                        searchName={
                          this.state.quotation_for === "PHR"
                            ? "PurchaseOrderForPharmacy"
                            : "PurchaseOrderForInventry"
                        }
                        onClick={itemchangeText.bind(this, this, context)}
                        onClear={() => {
                          this.setState({
                            item_description: "",
                            // item_description: e.item_description,
                            item_code: null,
                            item_category_id: null,
                            item_uom: null,
                            item_id: null,
                            item_group_id: null,
                            quantity: null,
                            // barcode: null,
                            addItemButton: false,
                          });
                        }}
                        others={{
                          disabled: this.state.dataExists,
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Category" }}
                        selector={{
                          name:
                            this.state.quotation_for === "PHR"
                              ? "phar_item_category"
                              : "inv_item_category_id",
                          className: "select-fld",
                          value:
                            this.state.quotation_for === "PHR"
                              ? this.state.phar_item_category
                              : this.state.inv_item_category_id,
                          dataSource: {
                            textField: "category_desc",
                            valueField:
                              this.state.quotation_for === "PHR"
                                ? "hims_d_item_category_id"
                                : "hims_d_inventory_tem_category_id",
                            data: this.props.poitemcategory,
                          },
                          others: {
                            disabled: true,
                          },
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Group" }}
                        selector={{
                          name:
                            this.state.quotation_for === "PHR"
                              ? "phar_item_group"
                              : "inv_item_group_id",
                          className: "select-fld",
                          value:
                            this.state.quotation_for === "PHR"
                              ? this.state.phar_item_group
                              : this.state.inv_item_group_id,
                          dataSource: {
                            textField: "group_description",
                            valueField:
                              this.state.quotation_for === "PHR"
                                ? "hims_d_item_group_id"
                                : "hims_d_inventory_item_group_id",
                            data: this.props.poitemgroup,
                          },
                          others: {
                            disabled: true,
                          },
                          onChange: null,
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "UOM" }}
                        selector={{
                          name:
                            this.state.quotation_for === "PHR"
                              ? "pharmacy_uom_id"
                              : "inventory_uom_id",
                          className: "select-fld",
                          value:
                            this.state.quotation_for === "PHR"
                              ? this.state.pharmacy_uom_id
                              : this.state.inventory_uom_id,
                          dataSource: {
                            textField: "uom_description",
                            valueField:
                              this.state.quotation_for === "PHR"
                                ? "hims_d_pharmacy_uom_id"
                                : "hims_d_inventory_uom_id",
                            data: this.props.poitemuom,
                          },
                          others: {
                            disabled: true,
                          },
                        }}
                      />
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Quantity",
                          isImp: true,
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ",",
                          },
                          className: "txt-fld",
                          name: "quantity",
                          dontAllowKeys: ["-", "e", "."],
                          value: this.state.quantity,
                          events: {
                            onChange: numberchangeTexts.bind(
                              this,
                              this,
                              context
                            ),
                          },
                          others: {
                            disabled: this.state.dataExitst,
                          },
                        }}
                      />
                    </div>
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Notes",
                        }}
                        textBox={{
                          className: "txt-fld",
                          name: "itm_notes",
                          value: this.state.itm_notes,
                          events: {
                            onChange: texthandle.bind(this, this, context),
                          },
                        }}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 subFooter-btn">
                      <button
                        className="btn btn-primary"
                        onClick={AddItems.bind(this, this, context)}
                        disabled={this.state.addItemButton}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12" id="ReqQuoteGrid_Cntr">
                        <AlgaehDataGrid
                          id="QUOTATION_details"
                          columns={[
                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_id"
                                  : "inv_item_id",

                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                      this.props.poitemlist === undefined
                                        ? []
                                        : this.props.poitemlist.filter(
                                            (f) =>
                                              f.hims_d_item_master_id ===
                                              row.phar_item_id
                                          ))
                                  : (display =
                                      this.props.poitemlist === undefined
                                        ? []
                                        : this.props.poitemlist.filter(
                                            (f) =>
                                              f.hims_d_inventory_item_master_id ===
                                              row.inv_item_id
                                          ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                    {/* {display} */}
                                  </span>
                                  // item_description
                                );
                                // return row.item_description;
                              },
                              others: {
                                minWidth: 200,
                              },
                            },

                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_category"
                                  : "inv_item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),

                              displayTemplate: (row) => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                      this.props.poitemcategory === undefined
                                        ? []
                                        : this.props.poitemcategory.filter(
                                            (f) =>
                                              f.hims_d_item_category_id ===
                                              row.phar_item_category
                                          ))
                                  : (display =
                                      this.props.poitemcategory === undefined
                                        ? []
                                        : this.props.poitemcategory.filter(
                                            (f) =>
                                              f.hims_d_inventory_tem_category_id ===
                                              row.inv_item_category_id
                                          ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 150,
                              },
                            },
                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_group"
                                  : "inv_item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              ),

                              displayTemplate: (row) => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                      this.props.poitemgroup === undefined
                                        ? []
                                        : this.props.poitemgroup.filter(
                                            (f) =>
                                              f.hims_d_item_group_id ===
                                              row.phar_item_group
                                          ))
                                  : (display =
                                      this.props.poitemgroup === undefined
                                        ? []
                                        : this.props.poitemgroup.filter(
                                            (f) =>
                                              f.hims_d_inventory_item_group_id ===
                                              row.inv_item_group_id
                                          ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 150,
                              },
                            },
                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "pharmacy_uom_id"
                                  : "inventory_uom_id",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              displayTemplate: (row) => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                      this.props.poitemuom === undefined
                                        ? []
                                        : this.props.poitemuom.filter(
                                            (f) =>
                                              f.hims_d_pharmacy_uom_id ===
                                              row.pharmacy_uom_id
                                          ))
                                  : (display =
                                      this.props.poitemuom === undefined
                                        ? []
                                        : this.props.poitemuom.filter(
                                            (f) =>
                                              f.hims_d_inventory_uom_id ===
                                              row.inventory_uom_id
                                          ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 100,
                              },
                            },
                            {
                              fieldName: "quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return <span> {row.quantity} </span>;
                              },
                            },
                            {
                              fieldName: "itm_notes",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Notes" }} />
                              ),
                              others: {
                                minWidth: 200,
                              },
                            },
                          ]}
                          keyId="hims_f_procurement_req_quotation_detail_id"
                          dataSource={{
                            data: this.state.quotation_detail,
                          }}
                          isEditable={!this.state.saveEnable}
                          actions={{
                            allowEdit: false,
                          }}
                          byForceEvents={true}
                          // forceRender={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteQuotationDetail.bind(
                              this,
                              this,
                              context
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    poitemlist: state.poitemlist,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RequestItemList)
);
