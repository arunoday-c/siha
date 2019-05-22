import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./ItemListsReturn.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup
} from "../../../Wrapper/algaehWrapper";

import {
  deleteSalesReturnDetail,
  updateSalesReturnDetail,
  calculateAmount,
  EditGrid,
  CancelGrid
} from "./ItemListsReturnEvents";

import { AlgaehActions } from "../../../../actions/algaehActions";
import Options from "../../../../Options.json";
import moment from "moment";
import ReciptForm from "./ReciptDetails/AddReciptForm";

import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class ItemListsReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.SALESRETURNIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
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
          mappingName: "itemcategory"
        }
      });
    }
    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SALESRETURNIOputs);
  }

  dateFormater(value) {
    if (value !== null) {
      return moment(value).format(Options.dateFormat);
    }
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-item-list-billing-form">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="portlet-body" id="RETURN_detailsGrid_Cntr">
                  <AlgaehDataGrid
                    id="RETURN_details"
                    columns={[
                      {
                        fieldName: "item_id",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        ),
                        displayTemplate: row => {
                          let display =
                            this.props.salesitemlist === undefined
                              ? []
                              : this.props.salesitemlist.filter(
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
                            this.props.salesitemlist === undefined
                              ? []
                              : this.props.salesitemlist.filter(
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
                        others:{
                          minWidth:150
                        }
                      },

                      {
                        fieldName: "expiry_date",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                        ),
                        displayTemplate: row => {
                          return (
                            <span>{this.dateFormater(row.expiry_date)}</span>
                          );
                        },
                        editorTemplate: row => {
                          return (
                            <span>{this.dateFormater(row.expiry_date)}</span>
                          );
                        }
                      },
                      {
                        fieldName: "batchno",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "quantity",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Sold Qty" }}
                          />
                        ),
                        disabled: true,
                        others:{
                          minWidth:90
                        }
                      },
                      {
                        fieldName: "return_quantity",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Return Qty" }}
                          />
                        ),
                        editorTemplate: row => {
                          return (
                            <AlagehFormGroup
                              div={{}}
                              textBox={{
                                value: row.return_quantity,
                                className: "txt-fld",
                                name: "return_quantity",
                                events: {
                                  onChange: calculateAmount.bind(
                                    this,
                                    this,
                                    row,
                                    context
                                  )
                                },
                                others: {
                                  disabled:
                                    this.state
                                      .hims_f_pharmcy_sales_return_header_id !==
                                    null
                                      ? true
                                      : false
                                }
                              }}
                            />
                          );
                        },
                        others:{
                          minWidth:90
                        }
                      },
                      {
                        fieldName: "uom_id",
                        label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                        displayTemplate: row => {
                          let display =
                            this.props.itemuom === undefined
                              ? []
                              : this.props.itemuom.filter(
                                  f => f.hims_d_pharmacy_uom_id === row.uom_id
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
                                  f => f.hims_d_pharmacy_uom_id === row.uom_id
                                );

                          return (
                            <span>
                              {display !== null && display.length !== 0
                                ? display[0].uom_description
                                : ""}
                            </span>
                          );
                        },
                        others:{
                          minWidth:90
                        }
                      },
                      {
                        fieldName: "unit_cost",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                        ),
                        disabled: true,
                        others:{
                          minWidth:90
                        }
                      },

                      {
                        fieldName: "extended_cost",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Ext. Cost" }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "discount_percentage",
                        label: (
                          <AlgaehLabel
                            label={{
                              forceLabel: "discount %"
                            }}
                          />
                        ),
                        disabled: true
                      },
                      {
                        fieldName: "discount_amout",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "discount Amt" }}
                          />
                        ),
                        disabled: true
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
                    byForceEvents={true}
                    events={{
                      onDelete: deleteSalesReturnDetail.bind(
                        this,
                        this,
                        context
                      ),
                      onEdit: EditGrid.bind(this, this, context),
                      onCancel: CancelGrid.bind(this, this, context),
                      onDone: updateSalesReturnDetail.bind(this, this, context)
                    }}
                  />

                  <div className="row">
                    <div className="col-lg-7" />
                    <div className="col-lg-5" style={{ textAlign: "right" }}>
                      <div className="row">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Return Sub Total"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.sub_total)}</h6>
                        </div>
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Discount Amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.discount_amount)}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Total"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.net_total)}</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <div className="algaehPaperDefault">
                        <div className="row">
                          <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Copay Amount"
                              }}
                            />
                            <h6>{getAmountFormart(this.state.copay_amount)}</h6>
                          </div>
                          {/* <div className="col-lg-6">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Sec Copay Amount"
                              }}
                            />
                            <h6>
                              {getAmountFormart(this.state.sec_copay_amount)}
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
                                  {getAmountFormart(
                                    this.state.patient_responsibility
                                  )}
                                </h6>
                              </div>

                              <div className="col-3">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Tax"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(this.state.patient_tax)}
                                </h6>
                              </div>

                              <div className="col-4">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Payable"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(
                                    this.state.patient_payable_h
                                  )}
                                </h6>
                              </div>
                            </div>
                          </div>

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
                                  {getAmountFormart(
                                    this.state.company_responsibility
                                  )}
                                </h6>
                              </div>

                              <div className="col-3">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Tax"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(this.state.company_tax)}
                                </h6>
                              </div>

                              <div className="col-4">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Payable"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(this.state.company_payable)}
                                </h6>
                              </div>
                            </div>
                          </div>

                          {/* <div className="col-lg-12">
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
                                  {getAmountFormart(
                                    this.state.sec_company_responsibility
                                  )}
                                </h6>
                              </div>

                              <div className="col-3">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Tax"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(this.state.sec_company_tax)}
                                </h6>
                              </div>

                              <div className="col-4">
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Payable"
                                  }}
                                />
                                <h6>
                                  {getAmountFormart(
                                    this.state.sec_company_payable
                                  )}
                                </h6>
                              </div>
                            </div>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-8">
                      <div className="algaehPaperDefault">
                        <div className="row secondary-box-container">
                          <div className="col-3">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Sheet Level Discount %"
                              }}
                            />
                            <h6>
                              {getAmountFormart(
                                this.state.sheet_discount_percentage
                              )}
                            </h6>
                          </div>
                          <div className="col-3">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Sheet Level Discount Amount"
                              }}
                            />
                            <h6>
                              {getAmountFormart(
                                this.state.sheet_discount_amount
                              )}
                            </h6>
                          </div>
                        </div>

                        <hr style={{ margin: "2px 0" }} />
                        <div
                          className="row secondary-box-container"
                          style={{ marginBottom: "10px" }}
                        >
                          <div className="col-3">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Net Amount"
                              }}
                            />
                            <h6>{getAmountFormart(this.state.net_amount)}</h6>
                          </div>

                          <div className="col-3">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Credit Amount"
                              }}
                            />
                            <h6>
                              {getAmountFormart(this.state.credit_amount)}
                            </h6>
                          </div>

                          <div
                            className="col-3"
                            style={{
                              background: " #44b8bd",
                              color: " #fff"
                            }}
                          >
                            <AlgaehLabel
                              label={{
                                forceLabel: "Sales Return Total"
                              }}
                            />
                            <h4>
                              {getAmountFormart(this.state.payable_amount)}
                            </h4>
                          </div>
                        </div>
                        <ReciptForm SALESRETURNIOputs={this.state} />
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
    salesitemlist: state.salesitemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    salesReturn: state.salesReturn
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getServices: AlgaehActions,
      generateBill: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemUOM: AlgaehActions,
      SalesReturnCalculations: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemListsReturn)
);
