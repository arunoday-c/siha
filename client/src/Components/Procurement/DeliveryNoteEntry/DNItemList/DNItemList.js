import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  deleteDNDetail,
  updateDNDetail,
  onchhangegriddiscount,
  GridAssignData,
  onchangegridcol,
  EditGrid,
  CancelGrid,
  onchangegridcoldatehandle,
  changeDateFormat,
  printBarcode
} from "./DNItemListEvents";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";

class DNItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.DNEntry;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.DNEntry);
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-delivery-note-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12" id="DNGrid">
                        <AlgaehDataGrid
                          id="DN_details"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Print" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-barcode"
                                      onClick={printBarcode.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-barcode"
                                      onClick={printBarcode.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              disabled: true,
                              others: {
                                maxWidth: 70,
                                resizable: false,
                                filterable: false,
                                style: { textAlign: "center" },
                                fixed: "left"
                              }
                            },
                            {
                              fieldName:
                                this.state.dn_from === "PHR"
                                  ? "phar_item_id"
                                  : "inv_item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemlist === undefined
                                        ? []
                                        : this.props.dnitemlist.filter(
                                            f =>
                                              f.hims_d_item_master_id ===
                                              row.phar_item_id
                                          ))
                                  : (display =
                                      this.props.dnitemlist === undefined
                                        ? []
                                        : this.props.dnitemlist.filter(
                                            f =>
                                              f.hims_d_inventory_item_master_id ===
                                              row.inv_item_id
                                          ));

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
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemlist === undefined
                                        ? []
                                        : this.props.dnitemlist.filter(
                                            f =>
                                              f.hims_d_item_master_id ===
                                              row.phar_item_id
                                          ))
                                  : (display =
                                      this.props.dnitemlist === undefined
                                        ? []
                                        : this.props.dnitemlist.filter(
                                            f =>
                                              f.hims_d_inventory_item_master_id ===
                                              row.inv_item_id
                                          ));

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
                              fieldName:
                                this.state.dn_from === "PHR"
                                  ? "phar_item_category"
                                  : "inv_item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemcategory === undefined
                                        ? []
                                        : this.props.dnitemcategory.filter(
                                            f =>
                                              f.hims_d_item_category_id ===
                                              row.phar_item_category
                                          ))
                                  : (display =
                                      this.props.dnitemcategory === undefined
                                        ? []
                                        : this.props.dnitemcategory.filter(
                                            f =>
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
                              editorTemplate: row => {
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemcategory === undefined
                                        ? []
                                        : this.props.dnitemcategory.filter(
                                            f =>
                                              f.hims_d_item_category_id ===
                                              row.phar_item_category
                                          ))
                                  : (display =
                                      this.props.dnitemcategory === undefined
                                        ? []
                                        : this.props.dnitemcategory.filter(
                                            f =>
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
                              }
                            },
                            {
                              fieldName:
                                this.state.dn_from === "PHR"
                                  ? "phar_item_group"
                                  : "inv_item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemgroup === undefined
                                        ? []
                                        : this.props.dnitemgroup.filter(
                                            f =>
                                              f.hims_d_item_group_id ===
                                              row.phar_item_group
                                          ))
                                  : (display =
                                      this.props.dnitemgroup === undefined
                                        ? []
                                        : this.props.dnitemgroup.filter(
                                            f =>
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
                              editorTemplate: row => {
                                let display;

                                this.state.dn_from === "PHR"
                                  ? (display =
                                      this.props.dnitemgroup === undefined
                                        ? []
                                        : this.props.dnitemgroup.filter(
                                            f =>
                                              f.hims_d_item_group_id ===
                                              row.phar_item_group
                                          ))
                                  : (display =
                                      this.props.dnitemgroup === undefined
                                        ? []
                                        : this.props.dnitemgroup.filter(
                                            f =>
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
                              }
                            },

                            {
                              fieldName: "vendor_batchno",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Vendor Batch  No." }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.vendor_batchno,
                                      className: "txt-fld",
                                      name: "vendor_batchno",
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled:
                                          this.state.posted === "Y"
                                            ? true
                                            : false
                                      }
                                    }}
                                  />
                                );
                              },
                              others: {
                                minWidth: 150,
                                resizable: false
                              }
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
                                    {changeDateFormat(row.expiry_date)}
                                  </span>
                                );
                              },
                              editorTemplate: row => {
                                return (
                                  <AlgaehDateHandler
                                    div={{}}
                                    textBox={{
                                      className: "txt-fld hidden",
                                      name: "expiry_date"
                                    }}
                                    minDate={new Date()}
                                    disabled={
                                      this.state.posted === "Y" ? true : false
                                    }
                                    events={{
                                      onChange: onchangegridcoldatehandle.bind(
                                        this,
                                        this,
                                        row
                                      )
                                    }}
                                    value={row.expiry_date}
                                  />
                                );
                              },
                              others: {
                                minWidth: 150,
                                resizable: false
                              }
                            },

                            {
                              fieldName: "po_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "PO Quantity" }}
                                />
                              ),
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
                              fieldName: "dn_quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Delivery Quantity" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value: row.dn_quantity,
                                      className: "txt-fld",
                                      name: "dn_quantity",
                                      events: {
                                        onChange: onchhangegriddiscount.bind(
                                          this,
                                          this,
                                          row
                                        )
                                      },
                                      others: {
                                        disabled: !this.state.authorizeEnable,
                                        onBlur: GridAssignData.bind(
                                          this,
                                          this,
                                          row
                                        ),
                                        onFocus: e => {
                                          e.target.oldvalue = e.target.value;
                                        }
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            //
                            {
                              fieldName: "quantity_outstanding",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Outstanding"
                                  }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "quantity_recieved_todate",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Recieved Todate"
                                  }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "discount_percentage",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount %" }}
                                />
                              ),
                              disabled: true
                            },
                            {
                              fieldName: "discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amount" }}
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
                            },

                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              ),
                              disabled: true
                            },

                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
                                />
                              ),
                              disabled: true
                            }
                          ]}
                          keyId="hims_f_procurement_dn_detail_id"
                          dataSource={{
                            data: this.state.dn_entry_detail
                          }}
                          isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          byForceEvents={true}
                          events={{
                            onDelete: deleteDNDetail.bind(this, this, context),
                            onEdit: EditGrid.bind(this, this, context),
                            onCancel: CancelGrid.bind(this, this, context),
                            onDone: updateDNDetail.bind(this, this, context)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="row">
                    <div className="col" />

                    <div className="col-lg-5" style={{ textAlign: "right" }}>
                      <div className="row">
                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sub Total"
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
                            {getAmountFormart(this.state.detail_discount)}
                          </h6>
                        </div>

                        <div className="col-lg-4">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Net Payable"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.net_payable)}</h6>
                        </div>
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
    dnitemlist: state.dnitemlist,
    dnitemcategory: state.dnitemcategory,
    dnitemgroup: state.dnitemgroup,
    dnitemuom: state.dnitemuom
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
  )(DNItemList)
);
