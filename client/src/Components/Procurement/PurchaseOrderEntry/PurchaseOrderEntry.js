import React, { Component } from "react";
import "./PurchaseOrderEntry.css";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";

class PurchaseOrderEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
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
                  label={{ forceLabel: "Purchase Order Entry", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "PO Number", returnText: true }}
              />
            ),
            value: this.state.document_number,
            selectValue: "document_number",
            events: {
              onChange: null //getCtrlCode.bind(this, this)
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
                    forceLabel: "PO Date"
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
        <div className="hims-purchase-order-entry">
          <div
            className="row inner-top-search"
            style={{ marginTop: "75px", paddingBottom: "10px" }}
          >
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Location Type" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },

                    onChange: null,
                    onClear: null
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Location Code" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },

                    onChange: null,
                    onClear: null
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Vendor No." }}
                  selector={{
                    name: "item_id",
                    className: "select-fld",
                    value: this.state.item_id,
                    dataSource: {
                      textField: "item_description",
                      valueField: "hims_d_item_master_id",
                      data: this.props.itemlist
                    },
                    onChange: null,
                    onClear: null
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col" }}
                  label={{
                    forceLabel: "Requisition No."
                  }}
                  textBox={{
                    value: this.state.patient_code,
                    className: "txt-fld",
                    name: "patient_code",

                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />
                <div
                  className="col-lg-1"
                  style={{
                    paddingLeft: 0
                  }}
                >
                  <span
                    className="fas fa-search fa-2x"
                    style={{
                      fontSize: " 1.2rem",
                      marginTop: 26,
                      paddingBottom: 0
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col" }}
                  label={{ forceLabel: "Terms Code" }}
                  selector={{
                    name: "item_id",
                    className: "select-fld",
                    value: this.state.item_id,
                    dataSource: {
                      textField: "item_description",
                      valueField: "hims_d_item_master_id",
                      data: this.props.itemlist
                    },
                    onChange: null,
                    onClear: null
                  }}
                />
                <AlgaehDateHandler
                  div={{ className: "col-3" }}
                  label={{ forceLabel: "Expected Arrival" }}
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
                {/* <div
                  className="customCheckbox col-lg-3"
                  style={{ border: "none", marginTop: "28px" }}
                >
                  <label className="checkbox" style={{ color: "#212529" }}>
                    <input
                      type="checkbox"
                      name="Pay by Cash"
                      checked={this.state.Cashchecked}
                      onChange={null}
                    />

                    <span style={{ fontSize: "0.8rem" }}>From Multiple Requisitions</span>
                  </label>
                </div> */}
              </div>
            </div>
          </div>

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
                      }
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
                      }
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
                </div>
                <div className="row">
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
                      others: {
                        disabled: this.state.dataExitst
                      }
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
                        onChange: null
                      },
                      others: {
                        disabled: this.state.dataExitst
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
                        onChange: null
                      },
                      others: {
                        disabled: true
                      }
                    }}
                  />
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Quantity in Hand"
                    }}
                    textBox={{
                      decimal: { allowNegative: false },
                      value: this.state.qtyhand,
                      className: "txt-fld",
                      name: "qtyhand",
                      events: {
                        onChange: null
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
                    onClick={null}
                    disabled={this.state.addItemButton}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                <div className="row">
                  <div className="col-lg-12" id="PointSaleGrid">
                    <AlgaehDataGrid
                      id="PO_details"
                      columns={[
                        {
                          fieldName: "item_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          )
                        },

                        {
                          fieldName: "item_category",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Item Category" }}
                            />
                          )
                        },
                        {
                          fieldName: "qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Quantity In Hand" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "expiry_date",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Expiry Date" }}
                            />
                          )
                        },
                        {
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "uom_id",
                          label: <AlgaehLabel label={{ forceLabel: "UOM" }} />
                        },
                        {
                          fieldName: "unit_cost",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                          )
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
                                forceLabel: "discount %"
                              }}
                            />
                          )
                        },
                        {
                          fieldName: "discount_amout",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "discount Amount" }}
                            />
                          )
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
                      // events={{
                      //   onDelete: deletePosDetail.bind(this, this, context),
                      //   onEdit: row => {},
                      //   onDone: updatePosDetail.bind(this, this)
                      // }}
                      // onRowSelect={row => {
                      //   getItemLocationStock(this, row);
                      // }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="row">
                <div className="col" />
                {/* <div
                    className="col-lg-2"
                    style={{
                      border: "1px solid #cccccc",
                      background: "f7f7f7",
                      marginBottom: 10
                    }}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Quantity in Hand"
                      }}
                    />
                    <h6>
                      {this.state.total_quantity
                        ? this.state.total_quantity + " nos"
                        : "0 nos"}
                    </h6>
                  </div> */}
                <div className="col-lg-5" style={{ textAlign: "right" }}>
                  <div className="row">
                    <div className="col-lg-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Sub Total"
                        }}
                      />
                      <h6>0.00</h6>
                    </div>
                    <div className="col-lg-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Discount Amount"
                        }}
                      />
                      <h6>0.00</h6>
                    </div>

                    <div className="col-lg-4">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Net Total"
                        }}
                      />
                      <h6>0.00</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PurchaseOrderEntry;
