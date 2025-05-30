import React, { Component } from "react";
import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./../../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  // AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";

import {
  itemchangeText,
  // UomchangeTexts,
  numberchangeTexts,
  AddItems,
  deleteSalesDetail,
  onchangegridcol,
  qtyonchangegridcol,
  ShowItemBatch,
  CloseItemBatch,
  dateFormater,
} from "./SalesListItemsEvents";
// import { AlgaehActions } from "../../../../actions/algaehActions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import ItemBatchs from "../ItemBatchs/ItemBatchs";
import moment from "moment";
import Options from "../../../../Options.json";

class SalesListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBatch: false,
      selectBatchButton: true,

      addItemButton: true,
      item_description: "",
      addedItem: true,

      item_id: null,
      quantity: 0,
      uom_id: null,
      uom_description: null,
      discount_percentage: 0,
      unit_cost: 0,
      tax_percentage: 0,
      batchno: null,
      expiry_date: null,
      qtyhand: 0,
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.CashSaleInvIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  // componentDidMount() {
  //   if (
  //     this.props.inventoryitemcategory === undefined ||
  //     this.props.inventoryitemcategory.length === 0
  //   ) {
  //     this.props.getItemCategory({
  //       uri: "/inventory/getItemCategory",
  //       module: "inventory",
  //       method: "GET",
  //       redux: {
  //         type: "ITEM_CATEGORY_GET_DATA",
  //         mappingName: "inventoryitemcategory",
  //       },
  //     });
  //   }

  //   if (
  //     this.props.inventoryitemgroup === undefined ||
  //     this.props.inventoryitemgroup.length === 0
  //   ) {
  //     this.props.getItemGroup({
  //       uri: "/inventory/getItemGroup",
  //       module: "inventory",
  //       method: "GET",
  //       redux: {
  //         type: "ITEM_GROUOP_GET_DATA",
  //         mappingName: "inventoryitemgroup",
  //       },
  //     });
  //   }

  //   if (
  //     this.props.inventoryitemuom === undefined ||
  //     this.props.inventoryitemuom.length === 0
  //   ) {
  //     this.props.getItemUOM({
  //       uri: "/inventory/getInventoryUom",
  //       module: "inventory",
  //       method: "GET",
  //       redux: {
  //         type: "ITEM_UOM_GET_DATA",
  //         mappingName: "inventoryitemuom",
  //       },
  //     });
  //   }
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.CashSaleInvIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <>
              <div className="col-3">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="row">
                    <AlgaehAutoSearch
                      div={{
                        className:
                          "col-12 form-group mandatory AlgaehAutoSearch",
                      }}
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
                      name="item_id"
                      columns={spotlightSearch.Items.Invitemmaster}
                      displayField="item_description"
                      value={this.state.item_description}
                      searchName="salesitemmaster"
                      onClick={itemchangeText.bind(this, this)}
                      ref={(attReg) => {
                        this.attReg = attReg;
                      }}
                      others={{
                        disabled: this.state.itemAdd,
                      }}
                    />
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "UOM",
                        }}
                      />
                      <h6>
                        {this.state.uom_description
                          ? this.state.uom_description
                          : "--------"}
                      </h6>
                    </div>
                    {/* <AlagehAutoComplete
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{ forceLabel: "UOM", isImp: true }}
                      selector={{
                        name: "uom_id",
                        className: "select-fld",
                        value: this.state.uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "uom_id",
                          data: this.state.ItemUOM,
                        },
                        onChange: UomchangeTexts.bind(this, this),
                        onClear: () => {
                          this.setState({
                            uom_id: null,
                          });
                        },
                        others: {
                          disabled: this.state.dataExitst,
                          tabIndex: "2",
                        },
                      }}
                    /> */}

                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Qty In Hand",
                        }}
                      />
                      <h6>
                        {this.state.qtyhand ? this.state.qtyhand : "--------"}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Batch No.",
                        }}
                      />
                      <h6>
                        {this.state.batchno ? this.state.batchno : "--------"}
                      </h6>
                    </div>
                    <div className="col-6">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Expiry Date.",
                        }}
                      />
                      <h6>
                        {this.state.expiry_date
                          ? moment(this.state.expiry_date).format(
                              Options.dateFormat
                            )
                          : "--------"}
                      </h6>
                    </div>
                    <AlagehFormGroup
                      div={{ className: "col-6 form-group mandatory" }}
                      label={{
                        forceLabel: "Quantity",
                      }}
                      textBox={{
                        number: {
                          allowNegative: false,
                          thousandSeparator: ",",
                        },
                        className: "txt-fld",
                        name: "quantity",
                        value: this.state.quantity,
                        dontAllowKeys: ["-", "e", "."],
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          disabled: this.state.dataExitst,
                          tabIndex: "3",
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6 form-group" }}
                      label={{
                        forceLabel: "Discount (%)",
                        isImp: false,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "discount_percentage",
                        value: this.state.discount_percentage,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          tabIndex: "4",
                        },
                      }}
                    />

                    <AlagehFormGroup
                      div={{ className: "col-6" }}
                      label={{
                        fieldName: "tax percentage",
                        isImp: this.state.Applicable,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "tax_percentage",
                        value: this.state.tax_percentage,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                      }}
                    />

                    {/* <div className="col-6 form-group mandatory">
                                            <AlgaehLabel
                                                label={{
                                                    forceLabel: "Tax %"
                                                }}
                                            />
                                            <h6>
                                                {this.state.tax_percentage
                                                    ? this.state.tax_percentage
                                                    : "-----------"}
                                            </h6>
                                        </div> */}
                    <AlagehFormGroup
                      div={{ className: "col-6 mandatory" }}
                      label={{
                        forceLabel: "Unit Cost",
                        isImp: false,
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        className: "txt-fld",
                        name: "unit_cost",
                        value: this.state.unit_cost,
                        events: {
                          onChange: numberchangeTexts.bind(this, this, context),
                        },
                        others: {
                          tabIndex: "4",
                        },
                      }}
                    />
                    <div className="col-12 subFooter-btn">
                      <button
                        className="btn btn-default"
                        onClick={ShowItemBatch.bind(this, this)}
                        disabled={this.state.addItemButton}
                      >
                        Select Batch
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={AddItems.bind(this, this, context)}
                        disabled={this.state.addItemButton}
                        tabIndex="5"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-9">
                <div className="portlet portlet-bordered margin-bottom-15">
                  <div className="row">
                    <div className="col-12" id="SaleOrderGrid_Cntr">
                      <AlgaehDataGrid
                        id="SaleOrderGrid"
                        columns={[
                          {
                            fieldName: "actions",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Action" }} />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span
                                  style={{
                                    pointerEvents:
                                      this.state.dataExitst === true
                                        ? "none"
                                        : "",
                                    opacity:
                                      this.state.dataExitst === true
                                        ? "0.1"
                                        : "",
                                  }}
                                  onClick={deleteSalesDetail.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                >
                                  <i className="fas fa-trash-alt" />
                                </span>
                              );
                            },
                          },
                          {
                            fieldName: "item_description",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "batchno",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Batch No." }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "expiry_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Expiry Date" }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return (
                                <span>
                                  {row.expiry_date !== null
                                    ? dateFormater(this, row.expiry_date)
                                    : null}
                                </span>
                              );
                            },
                            disabled: true,
                            others: {
                              minWidth: 200,
                            },
                          },
                          {
                            fieldName: "quantity",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                            ),
                            displayTemplate: (row) => {
                              return this.state.grid_edit === true ? (
                                parseFloat(row.quantity)
                              ) : (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    number: {
                                      allowNegative: false,
                                      thousandSeparator: ",",
                                    },
                                    value: parseFloat(row.quantity),
                                    className: "txt-fld",
                                    name: "quantity",
                                    events: {
                                      onChange: qtyonchangegridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                    },
                                    others: {
                                      onFocus: (e) => {
                                        e.target.oldvalue = e.target.value;
                                      },
                                    },
                                  }}
                                />
                              );
                            },
                            others: {
                              minWidth: 90,
                            },
                          },
                          {
                            fieldName: "uom_description",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "UOM" }} />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 90,
                            },
                          },
                          {
                            fieldName: "unit_cost",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Unit Cost" }}
                              />
                            ),
                            disabled: true,
                            others: {
                              minWidth: 90,
                            },
                          },

                          {
                            fieldName: "extended_cost",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Ext. Cost" }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "discount_percentage",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "discount %",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return this.state.grid_edit === true ? (
                                row.discount_percentage
                              ) : (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    decimal: { allowNegative: false },
                                    value: row.discount_percentage,
                                    className: "txt-fld",
                                    name: "discount_percentage",
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                    },
                                    others: {
                                      onFocus: (e) => {
                                        e.target.oldvalue = e.target.value;
                                      },
                                    },
                                  }}
                                />
                              );
                            },
                          },
                          {
                            fieldName: "discount_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "discount Amt.",
                                }}
                              />
                            ),
                          },

                          {
                            fieldName: "net_extended_cost",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Net Ext. Cost",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "tax_percentage",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax %",
                                }}
                              />
                            ),
                            displayTemplate: (row) => {
                              return this.state.grid_edit === true ? (
                                row.tax_percentage
                              ) : (
                                <AlagehFormGroup
                                  div={{}}
                                  textBox={{
                                    decimal: { allowNegative: false },
                                    value: row.tax_percentage,
                                    className: "txt-fld",
                                    name: "tax_percentage",
                                    events: {
                                      onChange: onchangegridcol.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      ),
                                    },
                                    others: {
                                      onFocus: (e) => {
                                        e.target.oldvalue = e.target.value;
                                      },
                                    },
                                  }}
                                />
                              );
                            },
                          },
                          {
                            fieldName: "tax_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax Amount",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                          {
                            fieldName: "total_amount",
                            label: (
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Total Amount",
                                }}
                              />
                            ),
                            disabled: true,
                          },
                        ]}
                        keyId="service_type_id"
                        dataSource={{
                          data: this.state.inventory_stock_detail,
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <ItemBatchs
                show={this.state.selectBatch}
                onClose={CloseItemBatch.bind(this, this)}
                selectedLang={this.state.selectedLang}
                inputsparameters={{
                  item_id: this.state.item_id,
                  location_id: this.state.location_id,
                  Batch_Items: this.state.Batch_Items,
                }}
              />
            </>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

// function mapStateToProps(state) {
//   return {
//     opitemlist: state.opitemlist,
//     inventoryitemuom: state.inventoryitemuom,
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(
//     {
//       getItemCategory: AlgaehActions,
//       getItemUOM: AlgaehActions,
//       getItemGroup: AlgaehActions,
//     },
//     dispatch
//   );
// }

export default withRouter(SalesListItems);
