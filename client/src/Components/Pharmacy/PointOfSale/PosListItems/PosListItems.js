import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./PosListItems.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  // AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import Options from "../../../../Options.json";
import moment from "moment";
import {
  discounthandle,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deletePosDetail,
  updatePosDetail,
  adjustadvance,
  UomchangeTexts,
  dateFormater,
  ShowItemBatch,
  CloseItemBatch,
  onchangegridcol,
  ViewInsurance,
  qtyonchangegridcol,
  EditGrid,
  credittexthandle,
  // SelectBatchDetails,
  getMedicationAprovalList,
  generatePharmacyLabel,
  CloseItemInstructions,
} from "./PosListItemsEvents";
import ReciptForm from "./ReciptDetails/AddReciptForm";
import { AlgaehActions } from "../../../../actions/algaehActions";

import ItemBatchs from "../ItemBatchs/ItemBatchs";
import DisplayInsuranceDetails from "../DisplayInsuranceDetails/DisplayInsuranceDetails";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import spotlightSearch from "../../../../Search/spotlightSearch.json";
import InsuranceForm from "../InsuranceDetails/InsuranceForm";
import PreApprovalStatus from "./PreApprovalStatus/PreApprovalStatus";
import { getMedicationList, getPosEntry } from "../PointOfSaleEvents";
import ItemInstructions from "./ItemInstructions";

class PosListItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectBatch: false,
      selectBatchButton: true,
      viewInsurance: false,
      viewPreapproval: false,
      view_item_instructions: false,
      item_details: {},
    };
    // this.onKeyPress = this.onKeyPress.bind(this);
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.POSIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    // document.addEventListener("keypress", this.onKeyPress, false);

    if (
      this.props.itemcategory === undefined ||
      this.props.itemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/pharmacy/getItemCategory",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "itemcategory",
        },
      });
    }

    if (
      this.props.itemgroup === undefined ||
      this.props.itemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/pharmacy/getItemGroup",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GROUOP_GET_DATA",
          mappingName: "itemgroup",
        },
      });
    }

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom",
        },
      });
    }
  }

  CloseEditModel(e) {
    if (e === "refresh") {
      if (this.state.pos_customer_type === "OP") {
        getMedicationList(this);
      } else if (this.state.pos_customer_type === "OT") {
        getPosEntry(this, this.state.pos_number);
      }
    }
    this.setState({
      viewPreapproval: !this.state.viewPreapproval,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keypress", this.onKeyPress, false);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POSIOputs);
  }

  render() {
    const pharmacy_location_id = this.state.location_id;
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="hptl-phase1-op-add-billing-form">
              <div className="container-fluid">
                <div className="row">
                  <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-8">
                    <div className="row">
                      <div className="col-lg-12">
                        {this.state.insurance_yesno === "N" ? null : (
                          <div className="portlet portlet-bordered margin-bottom-15">
                            <InsuranceForm POSIOputs={this.state} />
                          </div>
                        )}
                        <div className="portlet portlet-bordered margin-bottom-15">
                          <div className="row">
                            <AlgaehAutoSearch
                              div={{ className: "col-3 AlgaehAutoSearch" }}
                              label={{ forceLabel: "Item Name (Ctrl + i)" }}
                              title="Type Item Name Here"
                              id="item_id_search"
                              template={(result) => {
                                return (
                                  <section className="resultSecStyles">
                                    <div className="row">
                                      <div className="col-8">
                                        <h4 className="title">
                                          {result.item_description}
                                        </h4>
                                        <small>{result.generic_name}</small>
                                        <small>{result.uom_description}</small>
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
                              columns={spotlightSearch.pharmacy.itemmaster}
                              displayField="item_description"
                              value={this.state.item_description}
                              searchName="itemmaster"
                              extraParameters={{
                                pharmacy_location_id: pharmacy_location_id,
                              }}
                              onClick={itemchangeText.bind(this, this, context)}
                              onClear={() => {
                                context.updateState({
                                  item_id: null,
                                  item_category: null,
                                  uom_id: null,
                                  service_id: null,
                                  item_group_id: null,
                                  quantity: 0,
                                  expiry_date: null,
                                  batchno: null,
                                  grn_no: null,
                                  qtyhand: null,
                                  barcode: null,
                                  ItemUOM: [],
                                  Batch_Items: [],
                                  addItemButton: true,
                                  item_description: null,
                                  sales_uom_id: null,
                                  sales_conversion_factor: null,
                                  uom_description: null,
                                  stocking_uom: null,
                                  conversion_factor: null,
                                  sales_qtyhand: null,
                                  stocking_uom_id: null,
                                  average_cost: null,
                                  unit_cost: 0,
                                  Real_unit_cost: 0,
                                });
                              }}
                              ref={(attReg) => {
                                this.attReg = attReg;
                              }}
                            />

                            <div className="col">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Batch No.",
                                }}
                              />
                              <h6>
                                {this.state.batchno
                                  ? this.state.batchno
                                  : "-----------"}
                              </h6>
                            </div>
                            <div className="col">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Expiry Date",
                                }}
                              />
                              <h6>
                                {this.state.expiry_date
                                  ? moment(this.state.expiry_date).format(
                                      Options.dateFormat
                                    )
                                  : "-----------"}
                              </h6>
                            </div>

                            <div className="col">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Qty. In Hand",
                                }}
                              />
                              <h6>
                                {this.state.qtyhand
                                  ? this.state.qtyhand +
                                    " " +
                                    this.state.uom_description
                                  : "-----------"}
                              </h6>
                            </div>

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
                                  data: this.state.ItemUOM,
                                },
                                onChange: UomchangeTexts.bind(
                                  this,
                                  this,
                                  context
                                ),
                                onClear: () => {
                                  this.setState({
                                    uom_id: null,
                                  });
                                  context.updateState({
                                    uom_id: null,
                                  });
                                },
                                others: {
                                  disabled: this.state.dataExitst,
                                  tabIndex: "2",
                                },
                              }}
                            />
                            <AlagehFormGroup
                              div={{ className: "col" }}
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
                                  onChange: numberchangeTexts.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  disabled: this.state.dataExitst,
                                  tabIndex: "3",
                                },
                              }}
                            />

                            <AlagehFormGroup
                              div={{ className: "col" }}
                              label={{
                                forceLabel: "Discount(%)",
                                isImp: false,
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                className: "txt-fld",
                                name: "discount_percentage",
                                value: this.state.discount_percentage,
                                events: {
                                  onChange: numberchangeTexts.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  tabIndex: "4",
                                  disabled:
                                    this.state.insured === "Y" ? true : false,
                                },
                              }}
                            />

                            <div className="col">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Unit Cost",
                                }}
                              />
                              <h6>
                                {this.state.unit_cost
                                  ? GetAmountFormart(this.state.unit_cost)
                                  : "-----------"}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 subFooter-btn">
                            <button
                              className="btn btn-primary"
                              onClick={AddItems.bind(this, this, context)}
                              disabled={this.state.addItemButton}
                              tabIndex="5"
                            >
                              Add Item
                            </button>

                            <button
                              className="btn btn-default"
                              onClick={ShowItemBatch.bind(this, this)}
                              disabled={this.state.addItemButton}
                            >
                              Select Batch
                            </button>

                            {this.state.Batch_Items.length > 1 ? (
                              <span
                                className="badge badge-warning animated flash slower"
                                style={{ marginTop: 9, float: "right" }}
                              >
                                More Batch Available
                              </span>
                            ) : null}
                            <div>
                              {this.state.insured === "Y" &&
                              this.state.insurance_yesno === "N" ? (
                                <button
                                  className="btn btn-default"
                                  onClick={ViewInsurance.bind(this, this)}
                                  // disabled={this.state.mode_of_pay === 2 ? false? true}
                                >
                                  View Insurance
                                </button>
                              ) : null}
                            </div>

                            <ItemBatchs
                              show={this.state.selectBatch}
                              onClose={CloseItemBatch.bind(this, this, context)}
                              selectedLang={this.state.selectedLang}
                              inputsparameters={{
                                item_id: this.state.item_id,
                                location_id: this.state.location_id,
                                Batch_Items: this.state.Batch_Items,
                              }}
                            />
                            <DisplayInsuranceDetails
                              show={this.state.viewInsurance}
                              POSIOputs={this.state}
                              onClose={ViewInsurance.bind(this, this)}
                            />

                            <ItemInstructions
                              show={this.state.view_item_instructions}
                              item_details={this.state.item_details}
                              hims_f_pharmacy_pos_header_id={
                                this.state.hims_f_pharmacy_pos_header_id
                              }
                              // POSIOputs={this.state}
                              onClose={CloseItemInstructions.bind(this, this)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="portlet portlet-bordered margin-bottom-15">
                          <div className="row">
                            <div className="col-lg-12" id="PointSaleGrid">
                              <AlgaehDataGrid
                                id="POS_details"
                                columns={[
                                  {
                                    fieldName: "actions",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Action" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <span>
                                          <i
                                            style={{
                                              pointerEvents:
                                                this.state.posted === "Y"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                this.state.posted === "Y"
                                                  ? "0.1"
                                                  : "",
                                            }}
                                            className="fas fa-trash-alt"
                                            onClick={deletePosDetail.bind(
                                              this,
                                              this,
                                              context,
                                              row
                                            )}
                                          />

                                          <i
                                            style={{
                                              pointerEvents:
                                                this.state.posted === "N"
                                                  ? "none"
                                                  : "",
                                              opacity:
                                                this.state.posted === "N"
                                                  ? "0.1"
                                                  : "",
                                            }}
                                            className="fas fa-print"
                                            onClick={generatePharmacyLabel.bind(
                                              this,
                                              this,
                                              row
                                            )}
                                          />
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
                                    // displayTemplate: row => {
                                    //
                                    //   let display =
                                    //     this.props.positemlist === undefined
                                    //       ? []
                                    //       : this.props.positemlist.filter(
                                    //         f =>
                                    //           f.hims_d_item_master_id ===
                                    //           row.item_id
                                    //       );

                                    //   return (
                                    //     <span>
                                    //       {display !== undefined &&
                                    //         display.length !== 0
                                    //         ? display[0].item_description
                                    //         : ""}
                                    //     </span>
                                    //   );
                                    // },
                                    // editorTemplate: row => {
                                    //   let display =
                                    //     this.props.positemlist === undefined
                                    //       ? []
                                    //       : this.props.positemlist.filter(
                                    //         f =>
                                    //           f.hims_d_item_master_id ===
                                    //           row.item_id
                                    //       );

                                    //   return (
                                    //     <span>
                                    //       {display !== undefined &&
                                    //         display.length !== 0
                                    //         ? display[0].item_description
                                    //         : ""}
                                    //     </span>
                                    //   );
                                    // },
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
                                          {dateFormater(this, row.expiry_date)}
                                        </span>
                                      );
                                    },
                                    editorTemplate: (row) => {
                                      return (
                                        <span>
                                          {dateFormater(this, row.expiry_date)}
                                        </span>
                                      );
                                    },
                                  },
                                  {
                                    fieldName: "batchno",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Batch No." }}
                                      />
                                    ),
                                    // displayTemplate: row => {
                                    //   // {this.state.dataExitst === false}
                                    //   return this.state.dataExitst === false ? (
                                    //     <AlagehAutoComplete
                                    //       div={{ className: "" }}
                                    //       selector={{
                                    //         name: "batchno",
                                    //         className: "select-fld",
                                    //         value: row.batchno,
                                    //         dataSource: {
                                    //           textField: "batchno",
                                    //           valueField: "batchno",
                                    //           data: row.batches
                                    //         },
                                    //         onChange: SelectBatchDetails.bind(
                                    //           this,
                                    //           this,
                                    //           row,
                                    //           context
                                    //         ),
                                    //         onClear: () => {
                                    //           row["batchno"] = null;
                                    //         }
                                    //       }}
                                    //     />
                                    //   ) : (
                                    //       row.batchno
                                    //     );
                                    // },
                                    disabled: true,
                                    others: {
                                      minWidth: 150,
                                    },
                                  },
                                  {
                                    fieldName: "qtyhand",
                                    label: (
                                      <AlgaehLabel
                                        label={{
                                          forceLabel: "Qty In Hand",
                                        }}
                                      />
                                    ),
                                    disabled: true,
                                    others: {
                                      minWidth: 90,
                                    },
                                  },

                                  {
                                    fieldName: "quantity",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Qty Req." }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return this.state.postEnable === false ? (
                                        <AlagehFormGroup
                                          div={{}}
                                          textBox={{
                                            number: {
                                              allowNegative: false,
                                              thousandSeparator: ",",
                                            },
                                            value:
                                              row.quantity !== ""
                                                ? parseFloat(row.quantity)
                                                : "",
                                            className: "txt-fld",
                                            name: "quantity",
                                            dontAllowKeys: ["-", "e", "."],
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
                                                e.target.oldvalue =
                                                  e.target.value;
                                              },
                                            },
                                          }}
                                        />
                                      ) : (
                                        row.quantity
                                      );
                                    },
                                    others: {
                                      minWidth: 80,
                                    },
                                  },
                                  {
                                    fieldName: "insurance_yesno",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Insured" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <span>
                                          {row.insurance_yesno === "N"
                                            ? "Not Covered"
                                            : "Covered"}
                                        </span>
                                      );
                                    },
                                    disabled: true,
                                  },
                                  {
                                    fieldName: "pre_approval",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Pre Approval" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return row.pre_approval === "N" ? (
                                        <span>Not Required</span>
                                      ) : (
                                        <span
                                          className="pat-code"
                                          onClick={getMedicationAprovalList.bind(
                                            this,
                                            this,
                                            row
                                          )}
                                        >
                                          Required
                                        </span>
                                      );
                                    },
                                    disabled: true,
                                  },
                                  {
                                    fieldName: "uom_id",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "UOM" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      let display =
                                        this.props.itemuom === undefined
                                          ? []
                                          : this.props.itemuom.filter(
                                              (f) =>
                                                f.hims_d_pharmacy_uom_id ===
                                                row.uom_id
                                            );

                                      return (
                                        <span>
                                          {display !== null &&
                                          display.length !== 0
                                            ? display[0].uom_description
                                            : ""}
                                        </span>
                                      );
                                    },
                                    editorTemplate: (row) => {
                                      let display =
                                        this.props.itemuom === undefined
                                          ? []
                                          : this.props.itemuom.filter(
                                              (f) =>
                                                f.hims_d_pharmacy_uom_id ===
                                                row.uom_id
                                            );

                                      return (
                                        <span>
                                          {display !== null &&
                                          display.length !== 0
                                            ? display[0].uom_description
                                            : ""}
                                        </span>
                                      );
                                    },
                                    others: {
                                      minWidth: 80,
                                    },
                                  },
                                  {
                                    fieldName: "unit_cost",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Unit Cost" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <span>
                                          {GetAmountFormart(row.unit_cost, {
                                            appendSymbol: false,
                                          })}
                                        </span>
                                      );
                                    },
                                    disabled: true,
                                    others: {
                                      minWidth: 80,
                                    },
                                  },

                                  {
                                    fieldName: "extended_cost",
                                    label: (
                                      <AlgaehLabel
                                        label={{ forceLabel: "Ext. Cost" }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return (
                                        <span>
                                          {GetAmountFormart(row.extended_cost, {
                                            appendSymbol: false,
                                          })}
                                        </span>
                                      );
                                    },
                                    disabled: true,
                                    others: {
                                      minWidth: 80,
                                    },
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
                                      return this.state.postEnable === false ? (
                                        this.state.insured === "N" ? (
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
                                                  e.target.oldvalue =
                                                    e.target.value;
                                                },
                                                // type: "number"
                                              },
                                            }}
                                          />
                                        ) : (
                                          row.discount_percentage
                                        )
                                      ) : (
                                        row.discount_percentage
                                      );
                                    },
                                  },
                                  {
                                    fieldName: "discount_amount",
                                    label: (
                                      <AlgaehLabel
                                        label={{
                                          forceLabel: "Discount Amt",
                                        }}
                                      />
                                    ),
                                    displayTemplate: (row) => {
                                      return this.state.postEnable === false ? (
                                        this.state.insured === "N" ? (
                                          <AlagehFormGroup
                                            div={{}}
                                            textBox={{
                                              decimal: { allowNegative: false },
                                              value: row.discount_amount,
                                              className: "txt-fld",
                                              name: "discount_amount",
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
                                                  e.target.oldvalue =
                                                    e.target.value;
                                                },
                                                // type: "number"
                                              },
                                            }}
                                          />
                                        ) : (
                                          row.discount_amount
                                        )
                                      ) : (
                                        row.discount_amount
                                      );
                                    },
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
                                    displayTemplate: (row) => {
                                      return (
                                        <span>
                                          {GetAmountFormart(
                                            row.net_extended_cost,
                                            {
                                              appendSymbol: false,
                                            }
                                          )}
                                        </span>
                                      );
                                    },
                                    disabled: true,
                                  },
                                ]}
                                keyId="service_type_id"
                                dataSource={{
                                  data: this.state.pharmacy_stock_detail,
                                }}
                                // isEditable={true}
                                paging={{ page: 0, rowsPerPage: 10 }}
                                // byForceEvents={true}
                                events={{
                                  onDelete: deletePosDetail.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                  onEdit: EditGrid.bind(this, this, context),
                                  onCancel: EditGrid.bind(this, this, context),
                                  onDone: updatePosDetail.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                }}

                                // onRowSelect={row => {
                                //   getItemLocationStock(this, row);
                                // }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7">&nbsp;</div>
                      <div className="col-lg-5" style={{ textAlign: "right" }}>
                        <div className="row">
                          <div className="col-lg-4">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Sub Total",
                              }}
                            />
                            <h6>{GetAmountFormart(this.state.sub_total)}</h6>
                          </div>
                          <div className="col-lg-4">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Discount Amount",
                              }}
                            />
                            <h6>
                              {GetAmountFormart(this.state.discount_amount)}
                            </h6>
                          </div>

                          <div className="col-lg-4">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Net Total",
                              }}
                            />
                            <h6>{GetAmountFormart(this.state.net_total)}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="algaeh-md-12 algaeh-lg-12 algaeh-xl-4">
                    <div className="row">
                      <div className="algaeh-md-4 algaeh-lg-4 algaeh-xl-12">
                        <div className="Paper">
                          <div className="row">
                            <div className="col-12 ">
                              <h6>Ins. Details</h6>
                              <div className="row insurance-details">
                                {" "}
                                <div className="col-6">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Copay Amount",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.copay_amount)}
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 patientRespo">
                              <h6>Patient Ins. Details</h6>
                              <div className="row insurance-details">
                                <div className="col">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Responsibility",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(
                                      this.state.patient_responsibility
                                    )}
                                  </h6>
                                </div>

                                <div className="col">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Tax",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.patient_tax)}
                                  </h6>
                                </div>

                                <div className="col">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Payable",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(
                                      this.state.patient_payable_h
                                    )}
                                  </h6>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <h6>Company Ins. Details</h6>
                              <div className="row insurance-details">
                                <div className="col-5">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Responsibility",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(
                                      this.state.company_responsibility
                                    )}
                                  </h6>
                                </div>

                                <div className="col-3">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Tax",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(this.state.company_tax)}
                                  </h6>
                                </div>

                                <div className="col-4">
                                  <AlgaehLabel
                                    label={{
                                      forceLabel: "Payable",
                                    }}
                                  />
                                  <h6>
                                    {GetAmountFormart(
                                      this.state.company_payable
                                    )}
                                  </h6>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="algaeh-md-8 algaeh-lg-8 algaeh-xl-12  primary-details">
                        <div className="Paper">
                          <div className="row secondary-box-container">
                            <AlagehFormGroup
                              div={{ className: "col-lg-4" }}
                              label={{
                                forceLabel: "Advance Adjust",
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.advance_adjust,
                                className: "txt-fld",
                                name: "advance_adjust",

                                events: {
                                  onChange: adjustadvance.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  disabled: this.state.saveEnable,
                                  placeholder: "0.00",
                                  // onBlur: PosheaderCalculation.bind(this, this),
                                  onFocus: (e) => {
                                    e.target.oldvalue = e.target.value;
                                  },
                                },
                              }}
                            />

                            <AlagehFormGroup
                              div={{ className: "col-lg-4" }}
                              label={{
                                forceLabel: "Sheet Level Dis. %",
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sheet_discount_percentage,
                                className: "txt-fld",
                                name: "sheet_discount_percentage",

                                events: {
                                  onChange: discounthandle.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  disabled:
                                    this.state.insurance_yesno === "Y"
                                      ? true
                                      : !this.state.saveEnable,
                                  placeholder: "0.00",
                                  // onBlur: PosheaderCalculation.bind(
                                  //   this,
                                  //   this,
                                  //   context
                                  // ),
                                  onFocus: (e) => {
                                    e.target.oldvalue = e.target.value;
                                  },
                                },
                              }}
                            />

                            <AlagehFormGroup
                              div={{ className: "col-lg-4" }}
                              label={{
                                forceLabel: "Sheet Level Discount Amount",
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.sheet_discount_amount,
                                className: "txt-fld",
                                name: "sheet_discount_amount",

                                events: {
                                  onChange: discounthandle.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  disabled:
                                    this.state.insurance_yesno === "Y"
                                      ? true
                                      : !this.state.saveEnable,
                                  placeholder: "0.00",
                                  // onBlur: PosheaderCalculation.bind(
                                  //   this,
                                  //   this,
                                  //   context
                                  // ),
                                  onFocus: (e) => {
                                    e.target.oldvalue = e.target.value;
                                  },
                                },
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
                                  forceLabel: "Available Aavance",
                                }}
                              />
                              <h6>
                                {GetAmountFormart(this.state.advance_amount)}
                              </h6>
                            </div>

                            <div className="col-3">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Net Amount",
                                }}
                              />
                              <h6>{GetAmountFormart(this.state.net_amount)}</h6>
                            </div>

                            <AlagehFormGroup
                              div={{ className: "col-lg-2" }}
                              label={{
                                forceLabel: "Credit Amount",
                              }}
                              textBox={{
                                decimal: { allowNegative: false },
                                value: this.state.credit_amount,
                                className: "txt-fld",
                                name: "credit_amount",

                                events: {
                                  onChange: credittexthandle.bind(
                                    this,
                                    this,
                                    context
                                  ),
                                },
                                others: {
                                  placeholder: "0.00",
                                  disabled:
                                    this.state.pos_customer_type === "OT"
                                      ? true
                                      : false,
                                },
                              }}
                            />

                            <div className="col-2 highlightGreen">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Receiveable Amount",
                                }}
                              />
                              <h4>
                                {GetAmountFormart(
                                  this.state.receiveable_amount
                                )}
                              </h4>
                            </div>

                            <div className="col-2 highlightGrey">
                              <AlgaehLabel
                                label={{
                                  forceLabel: "Balance Due",
                                }}
                              />

                              <h6>
                                {GetAmountFormart(this.state.balance_credit)}
                              </h6>
                            </div>
                          </div>
                          <ReciptForm POSIOputs={this.state} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <PreApprovalStatus
                open={this.state.viewPreapproval}
                onClose={this.CloseEditModel.bind(this)}
                selected_services={this.state.medca_approval_Services}
                item_description={this.state.item_description}
                prescription_detail_id={this.state.prescription_detail_id}
                insurance_provider_id={this.state.insurance_provider_id}
                item_data={this.state.item_data}
                pos_customer_type={this.state.pos_customer_type}
                hims_f_pharmacy_pos_detail_id={
                  this.state.hims_f_pharmacy_pos_detail_id
                }
              />
            </div>
          )}
        </MyContext.Consumer>
      </React.Fragment>
    );
  }
}

/*{
  fieldName: "prescribed_qty",
  label: (
    <AlgaehLabel
      label={{
        forceLabel: "Prescribed Qty"
      }}
    />
  ),
  disabled: true,
  others: {
    minWidth: 110
  }
},*/

function mapStateToProps(state) {
  return {
    positemlist: state.positemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    posheader: state.posheader,
    itemgroup: state.itemgroup,
    hospitalservices: state.hospitalservices,
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
      getItemGroup: AlgaehActions,
      getMedicationList: AlgaehActions,
      // getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PosListItems)
);
