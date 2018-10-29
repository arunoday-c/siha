import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./PosListItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

import {
  discounthandle,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deletePosDetail,
  updatePosDetail,
  calculateAmount,
  adjustadvance,
  UomchangeTexts,
  dateFormater,
  ShowItemBatch
} from "./PosListItemsEvents";
import ReciptForm from "./ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";
import Paper from "@material-ui/core/Paper";
import ItemBatchs from "../ItemBatchs/ItemBatchs";
class PosListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBatch: false,
      selectBatchButton: true
    };
  }

  componentWillMount() {
    let InputOutput = this.props.POSIOputs;
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
    this.setState(nextProps.POSIOputs);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                      <div className="row">
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
                              data: this.props.positemlist
                            },
                            onChange: itemchangeText.bind(this, this, context)
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col" }}
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
                        <AlagehAutoComplete
                          div={{ className: "col" }}
                          label={{ forceLabel: "UOM", isImp: true }}
                          selector={{
                            name: "uom_id",
                            className: "select-fld",
                            value: this.state.uom_id,
                            dataSource: {
                              textField: "uom_description",
                              valueField: "uom_id",
                              data: this.state.ItemUOM
                            },

                            onChange: UomchangeTexts.bind(this, this)
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Batch No."
                          }}
                          textBox={{
                            className: "txt-fld",
                            name: "batchno",
                            value: this.state.batchno,
                            events: {
                              onChange: null
                            },
                            others: {
                              disabled: true
                            }
                          }}
                        />
                        <AlgaehDateHandler
                          div={{ className: "col" }}
                          label={{ forceLabel: "Expiry Date" }}
                          textBox={{
                            className: "txt-fld",
                            name: "expiry_date"
                          }}
                          minDate={new Date()}
                          disabled={true}
                          events={{
                            onChange: null
                          }}
                          value={this.state.expiry_date}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
                          label={{
                            forceLabel: "Quantity"
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
                              onChange: numberchangeTexts.bind(
                                this,
                                this,
                                context
                              )
                            }
                          }}
                        />
                        <AlagehFormGroup
                          div={{ className: "col" }}
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
                            },
                            others: {
                              disabled: true
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
                          onClick={ShowItemBatch.bind(this, this)}
                          disabled={this.state.addItemButton}
                        >
                          Select Batch
                        </button> */}

                        <ItemBatchs
                          show={this.state.selectBatch}
                          onClose={ShowItemBatch.bind(this, this)}
                          selectedLang={this.state.selectedLang}
                          inputsparameters={{
                            item_id: this.state.item_id,
                            location_id: this.state.location_id
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-12">
                    <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                      <div className="row">
                        <div className="col-lg-12" id="PointSaleGrid">
                          <AlgaehDataGrid
                            id="POS_details"
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
                                    this.props.positemlist === undefined
                                      ? []
                                      : this.props.positemlist.filter(
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
                                  return (
                                    <AlagehAutoComplete
                                      div={{}}
                                      selector={{
                                        name: "item_id",
                                        className: "select-fld",
                                        value: row.item_id,
                                        dataSource: {
                                          textField: "item_description",
                                          valueField: "hims_d_item_master_id",
                                          data: this.props.positemlist
                                        },
                                        onChange: null,
                                        others: {
                                          disabled: true
                                        }
                                      }}
                                    />
                                  );
                                },
                                disabled: true
                              },

                              {
                                fieldName: "item_category",
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
                                            row.item_category
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
                                  return (
                                    <AlagehAutoComplete
                                      div={{}}
                                      selector={{
                                        name: "item_category",
                                        className: "select-fld",
                                        value: row.item_category,
                                        dataSource: {
                                          textField: "category_desc",
                                          valueField: "hims_d_item_category_id",
                                          data: this.props.itemcategory
                                        },
                                        onChange: null,
                                        others: {
                                          disabled: true
                                        }
                                      }}
                                    />
                                  );
                                },
                                disabled: true
                              },

                              {
                                fieldName: "expiry_date",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Expiry Date" }}
                                  />
                                ),
                                displayTemplate: row => {
                                  return (
                                    <span>
                                      {dateFormater(this, row.expiry_date)}
                                    </span>
                                  );
                                },
                                disabled: true
                              },
                              {
                                fieldName: "batchno",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Batch No." }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "uom_id",
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
                                            row.uom_id
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
                                  return (
                                    <AlagehAutoComplete
                                      div={{}}
                                      selector={{
                                        name: "item_category",
                                        className: "select-fld",
                                        value: row.item_category,
                                        // dataSource: {
                                        //   textField: "uom_description",
                                        //   valueField: "uom_id",
                                        //   data: this.state.ItemUOM
                                        // },
                                        dataSource: {
                                          textField: "uom_description",
                                          valueField: "hims_d_pharmacy_uom_id",
                                          data: this.state.itemuom
                                        },
                                        onChange: null,
                                        others: {
                                          disabled: true
                                        }
                                      }}
                                    />
                                  );
                                },
                                disabled: true
                              },
                              {
                                fieldName: "unit_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Unit Cost" }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "quantity",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Quantity" }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        value: row.quantity,
                                        className: "txt-fld",
                                        name: "quantity",
                                        events: {
                                          onChange: calculateAmount.bind(
                                            this,
                                            this,
                                            row,
                                            context
                                          )
                                        }
                                      }}
                                    />
                                  );
                                }
                              },

                              {
                                fieldName: "extended_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Extended Cost" }}
                                  />
                                ),
                                disabled: true
                              },
                              {
                                fieldName: "discount_percentage",
                                label: (
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "discount_percentage"
                                    }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        decimal: { allowNegative: false },
                                        value: row.discount_percentage,
                                        className: "txt-fld",
                                        name: "discount_percentage",
                                        events: {
                                          onChange: calculateAmount.bind(
                                            this,
                                            this,
                                            row,
                                            context
                                          )
                                        }
                                      }}
                                    />
                                  );
                                }
                              },
                              {
                                fieldName: "discount_amout",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "discount_amout" }}
                                  />
                                ),
                                editorTemplate: row => {
                                  return (
                                    <AlagehFormGroup
                                      div={{}}
                                      textBox={{
                                        decimal: { allowNegative: false },
                                        value: row.discount_amout,
                                        className: "txt-fld",
                                        name: "discount_amout",
                                        events: {
                                          onChange: calculateAmount.bind(
                                            this,
                                            this,
                                            row,
                                            context
                                          )
                                        }
                                      }}
                                    />
                                  );
                                }
                              },

                              {
                                fieldName: "net_extended_cost",
                                label: (
                                  <AlgaehLabel
                                    label={{ forceLabel: "Net Extended Cost" }}
                                  />
                                ),
                                disabled: true
                              }
                            ]}
                            keyId="service_type_id"
                            dataSource={{
                              data: this.state.pharmacy_stock_detail
                            }}
                            isEditable={true}
                            paging={{ page: 0, rowsPerPage: 10 }}
                            events={{
                              onDelete: deletePosDetail.bind(
                                this,
                                this,
                                context
                              ),
                              onEdit: row => {},
                              onDone: updatePosDetail.bind(this, this)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-7" />
                  <div className="col-lg-5" style={{ textAlign: "right" }}>
                    <div className="row">
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Sub Total"
                          }}
                        />
                        <h6>
                          {this.state.sub_total
                            ? "₹" + this.state.sub_total
                            : "₹0.00"}
                        </h6>
                      </div>
                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Discount Amount"
                          }}
                        />
                        <h6>
                          {this.state.discount_amount
                            ? "₹" + this.state.discount_amount
                            : "₹0.00"}
                        </h6>
                      </div>

                      <div className="col-lg-4">
                        <AlgaehLabel
                          label={{
                            forceLabel: "Net Total"
                          }}
                        />
                        <h6>
                          {this.state.net_total
                            ? "₹" + this.state.net_total
                            : "₹0.00"}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-4">
                    <Paper className="Paper">
                      <div className="row">
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Copay Amount"
                            }}
                          />
                          <h6>
                            {this.state.copay_amount
                              ? "₹" + this.state.copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        {/* <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Deductable Amount"
                            }}
                          />
                          <h6>
                            {this.state.deductable_amount
                              ? "₹" + this.state.deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div> */}
                        <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sec Copay Amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_copay_amount
                              ? "₹" + this.state.sec_copay_amount
                              : "₹0.00"}
                          </h6>
                        </div>
                        {/* <div className="col-lg-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sec Deductable Amount"
                            }}
                          />
                          <h6>
                            {this.state.sec_deductable_amount
                              ? "₹" + this.state.sec_deductable_amount
                              : "₹0.00"}
                          </h6>
                        </div> */}
                      </div>
                      <div className="row">
                        <div className="col-lg-12 patientRespo">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Patient"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.patient_responsibility
                                  ? "₹" + this.state.patient_responsibility
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.patient_tax
                                  ? "₹" + this.state.patient_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.patient_payable_h
                                  ? "₹" + this.state.patient_payable_h
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-lg-1"> &nbsp; </div> */}

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Company"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.company_responsibility
                                  ? "₹" + this.state.company_responsibility
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.company_tax
                                  ? "₹" + this.state.company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.company_payable
                                  ? "₹" + this.state.company_payable
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Secondary Company"
                            }}
                          />
                          <div className="row insurance-details">
                            <div className="col-5">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Responsibility"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_responsibility
                                  ? "₹" + this.state.sec_company_responsibility
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Tax"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_tax
                                  ? "₹" + this.state.sec_company_tax
                                  : "₹0.00"}
                              </h6>
                            </div>

                            <div className="col-4">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Payable"
                                }}
                              />
                              <h6>
                                {this.state.sec_company_payable
                                  ? "₹" + this.state.sec_company_payable
                                  : "₹0.00"}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </div>

                  <div className="col-lg-8">
                    <Paper className="Paper">
                      <div className="row secondary-box-container">
                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            forceLabel: "Advance Adjust"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.advance_adjust,
                            className: "txt-fld",
                            name: "advance_adjust",

                            events: {
                              onChange: adjustadvance.bind(this, this, context)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            forceLabel: "Sheet Level Discount %"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_percentage,
                            className: "txt-fld",
                            name: "sheet_discount_percentage",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />

                        <AlagehFormGroup
                          div={{ className: "col-lg-4" }}
                          label={{
                            forceLabel: "Sheet Level Discount Amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.sheet_discount_amount,
                            className: "txt-fld",
                            name: "sheet_discount_amount",

                            events: {
                              onChange: discounthandle.bind(this, this, context)
                            }
                          }}
                        />
                      </div>

                      <hr />
                      <div
                        className="row secondary-box-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Available Aavance"
                            }}
                          />
                          <h6>
                            {this.state.advance_amount
                              ? "₹" + this.state.advance_amount
                              : "₹0.00"}
                          </h6>
                        </div>

                        <div className="col-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Amount"
                            }}
                          />
                          <h6>
                            {this.state.net_amount
                              ? "₹" + this.state.net_amount
                              : "₹0.00"}
                          </h6>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-lg-3" }}
                          label={{
                            forceLabel: "Credit Amount"
                          }}
                          textBox={{
                            decimal: { allowNegative: false },
                            value: this.state.credit_amount,
                            className: "txt-fld",
                            name: "state_credit_amount",

                            events: {
                              onChange: null
                            }
                          }}
                        />

                        <div
                          className="col-3"
                          style={{
                            background: " #44b8bd",
                            color: " #fff"
                          }}
                        >
                          <AlgaehLabel
                            label={{
                              forceLabel: "Receiveable Amount"
                            }}
                          />
                          <h4>
                            {this.state.receiveable_amount
                              ? "₹" + this.state.receiveable_amount
                              : "₹0.00"}
                          </h4>
                        </div>
                      </div>
                      <ReciptForm POSIOputs={this.state} />
                    </Paper>
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
    positemlist: state.positemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    posheader: state.posheader,
    itemgroup: state.itemgroup
    // itemBatch: state.itemBatch
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getServices: AlgaehActions,
      getPrescriptionPOS: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemUOM: AlgaehActions,
      PosHeaderCalculations: AlgaehActions,
      getServicesCost: AlgaehActions,
      getInsuranceServicesCost: AlgaehActions,
      generateBill: AlgaehActions,
      getItemGroup: AlgaehActions
      // getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PosListItems)
);
