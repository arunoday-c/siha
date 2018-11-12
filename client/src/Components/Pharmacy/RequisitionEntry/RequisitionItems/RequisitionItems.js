import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./RequisitionItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import {
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteRequisitionDetail,
  updatePosDetail,
  onchangegridcol,
  UomchangeTexts,
  getItemLocationStock
} from "./RequisitionItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";

class RequisitionItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.RequisitionIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.itemcategory === undefined ||
      this.props.itemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/pharmacy/getItemCategory",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "itemcategory"
        }
      });
    }

    if (
      this.props.itemgroup === undefined ||
      this.props.itemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/pharmacy/getItemGroup",
        method: "GET",
        redux: {
          type: "ITEM_GROUOP_GET_DATA",
          mappingName: "itemgroup"
        }
      });
    }

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.RequisitionIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-requisition-item-form">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col-lg-4" }}
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
                          others: {
                            disabled: this.state.ItemDisable
                          },
                          onChange: itemchangeText.bind(this, this, context)
                        }}
                      />
                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "UOM", isImp: true }}
                        selector={{
                          name: "item_uom",
                          className: "select-fld",
                          value: this.state.item_uom,
                          dataSource: {
                            textField: "uom_description",
                            valueField: "uom_id",
                            data: this.state.ItemUOM
                          },
                          others: {
                            disabled: this.state.ItemDisable
                          },

                          onChange: UomchangeTexts.bind(this, this)
                        }}
                      />

                      <AlagehAutoComplete
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Category" }}
                        selector={{
                          name: "item_category_id",
                          className: "select-fld",
                          value: this.state.item_category_id,
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
                        div={{ className: "col" }}
                        label={{ forceLabel: "Item Group" }}
                        selector={{
                          name: "item_group_id",
                          className: "select-fld",
                          value: this.state.item_group_id,
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

                      <AlagehFormGroup
                        div={{ className: "col" }}
                        label={{
                          forceLabel: "Quantity Required"
                        }}
                        textBox={{
                          number: {
                            allowNegative: false,
                            thousandSeparator: ","
                          },
                          className: "txt-fld",
                          name: "quantity_required",
                          value: this.state.quantity_required,
                          events: {
                            onChange: numberchangeTexts.bind(
                              this,
                              this,
                              context
                            )
                          },
                          others: {
                            disabled: this.state.ItemDisable
                          }
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
                      {/* <button
                          className="btn btn-default"
                          //   onClick={processItems.bind(this, this)}
                        >
                          Select Batch
                        </button> */}
                    </div>
                  </div>
                </div>

                <div className="col-lg-12">
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="REQ_details"
                          columns={[
                            {
                              fieldName: "item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.itemlist === undefined
                                    ? []
                                    : this.props.itemlist.filter(
                                        f =>
                                          f.hims_d_item_master_id ===
                                          row.item_id
                                      );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                let display =
                                  this.props.itemlist === undefined
                                    ? []
                                    : this.props.itemlist.filter(
                                        f =>
                                          f.hims_d_item_master_id ===
                                          row.item_id
                                      );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.itemcategory === undefined
                                    ? []
                                    : this.props.itemcategory.filter(
                                        f =>
                                          f.hims_d_item_category_id ===
                                          row.item_category_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                let display =
                                  this.props.itemcategory === undefined
                                    ? []
                                    : this.props.itemcategory.filter(
                                        f =>
                                          f.hims_d_item_category_id ===
                                          row.item_category_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.itemgroup === undefined
                                    ? []
                                    : this.props.itemgroup.filter(
                                        f =>
                                          f.hims_d_item_group_id ===
                                          row.item_group_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                let display =
                                  this.props.itemgroup === undefined
                                    ? []
                                    : this.props.itemgroup.filter(
                                        f =>
                                          f.hims_d_item_group_id ===
                                          row.item_group_id
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              }
                            },

                            {
                              fieldName: "item_uom",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              displayTemplate: row => {
                                let display =
                                  this.props.itemuom === undefined
                                    ? []
                                    : this.props.itemuom.filter(
                                        f =>
                                          f.hims_d_pharmacy_uom_id ===
                                          row.item_uom
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
                                  this.props.itemuom === undefined
                                    ? []
                                    : this.props.itemuom.filter(
                                        f =>
                                          f.hims_d_pharmacy_uom_id ===
                                          row.item_uom
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
                              fieldName: "quantity_required",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity Required" }}
                                />
                              ),
                              disabled: true
                              // editorTemplate: row => {
                              //   return (
                              //     <AlagehFormGroup
                              //       div={{}}
                              //       textBox={{
                              //         value: row.quantity_required,
                              //         className: "txt-fld",
                              //         name: "quantity_required",
                              //         events: { onChange: null },
                              //         others: {
                              //           disabled: true
                              //         }
                              //       }}
                              //     />
                              //   );
                              // }
                            },
                            {
                              fieldName: "quantity_authorized",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Authorized"
                                  }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.quantity_authorized,
                                      className: "txt-fld",
                                      name: "quantity_authorized",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: this.state.authorizeEnable
                                      }
                                    }}
                                  />
                                );
                              }
                            }
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.pharmacy_stock_detail
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteRequisitionDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: row => {},
                            onDone: updatePosDetail.bind(this, this)
                          }}
                          onRowSelect={row => {
                            getItemLocationStock(this, row);
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-lg-2"
                        style={{
                          paddingTop: "10px"
                        }}
                      >
                        <div
                          style={{
                            border: "1px solid #000",
                            paddingLeft: "10px"
                          }}
                        >
                          <h5>Quantity in Hand</h5>
                          <h6>
                            {this.state.total_quantity
                              ? this.state.total_quantity + " nos"
                              : "0 nos"}
                          </h6>
                        </div>
                      </div>
                      <div className="col-lg-10" />
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
    itemlist: state.itemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    itemgroup: state.itemgroup,
    itemBatch: state.itemBatch
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(RequisitionItems)
);
