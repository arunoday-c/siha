import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./TransferEntryItems.css";
import "./../../../../styles/site.css";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../../Wrapper/algaehWrapper";

import {
  onchangegridcol,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  dateFormater,
  getItemLocationStock,
  EditGrid
} from "./TransferEntryItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";

class TransferEntryItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    let InputOutput = this.props.TransferIOputs;
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
          mappingName: "itemgroup"
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.TransferIOputs);
  }

  changeGridEditors(row, e) {
    debugger
    let pharmacy_stock_detail = this.state.pharmacy_stock_detail
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    row[name] = value;
    row["expiry_date"] = e.selected.expirydt;
    row["from_qtyhand"] = e.selected.qtyhand;
    row["unit_cost"] =  e.selected.avgcost;
    row["grnno"] = e.selected.grnno;

    for (let k = 0; k < pharmacy_stock_detail.length; k++) {
      if (pharmacy_stock_detail[k].item_id === row.item_id) {
        pharmacy_stock_detail[k] = row;
      }
    }

    this.setState({
      pharmacy_stock_detail:pharmacy_stock_detail
    })
  }

  clearGridEditors(row, e) {
    debugger
    let pharmacy_stock_detail = this.state.pharmacy_stock_detail

    row["batchno"] = null;
    row["expiry_date"] = null;
    row["from_qtyhand"] = null;
    row["unit_cost"] =  null;

    for (let k = 0; k < pharmacy_stock_detail.length; k++) {
      if (pharmacy_stock_detail[k].item_id === row.item_id) {
        pharmacy_stock_detail[k] = row;
      }
    }
    this.setState({
      pharmacy_stock_detail:pharmacy_stock_detail
    })
  }

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="row">
             <div className="col-4">
             <h4 style={{marginBottom:4}}>Requested Items</h4>
                <ul className="reqTransList">
                
                <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>

                  <li>
                   <div className="itemReq"> <h6>Vozet</h6>
                    <p>UOM: <span>Bottle</span></p>
                    <p>Auth Qty: <span>20</span></p></div>
                    <div className="itemAction">
                      <span><i className="fas fa-pen"></i></span>
                    </div>
                  </li>
                
                </ul>
             </div>
             <div className="col-8" style={{paddingLeft:0}}>
             <div className="portlet portlet-bordered margin-bottom-15" >
                  <div className="portlet-body" id="REQ_details_Cntr">
                    <AlgaehDataGrid
                      id="REQ_details"
                      columns={[
                        {
                          fieldName: "action",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "action" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                <i
                                  className="fas fa-trash-alt"
                                  aria-hidden="true"
                                  onClick={deleteTransEntryDetail.bind(
                                    this,
                                    this,
                                    context,
                                    row
                                  )}
                                />
                              </span>
                            );
                          },
                          others: {
                            minWidth: 50,

                          }
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
                          editorTemplate: row => {
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
                          fieldName: "from_qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "From Qty in Hand" }}
                            />
                          ),
                          disabled: true
                        },
                        {
                          fieldName: "to_qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "To Qty in Hand" }}
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
                          ),
                          displayTemplate: row => {
                            return (
                              <span>{dateFormater(this, row.expiry_date)}</span>
                            );
                          },
                          editorTemplate: row => {
                            return (
                              <span>{dateFormater(this, row.expiry_date)}</span>
                            );
                          }
                        },
                        {
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehAutoComplete
                                div={{ className: "col" }}
                                selector={{
                                  name: "batchno",
                                  className: "select-fld",
                                  value: row.batchno,
                                  dataSource: {
                                    textField: "batchno",
                                    valueField: "batchno",
                                    data: row.batches
                                  },
                                  onChange: this.changeGridEditors.bind(this, row),
                                  onClear: this.clearGridEditors.bind(this, row),
                                }}
                              />
                            );
                          },
                          others: {
                            minWidth: 150,
                          }
                        },
                        {
                          fieldName: "uom_requested_id",
                          label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                          displayTemplate: row => {
                            let display =
                              this.props.itemuom === undefined
                                ? []
                                : this.props.itemuom.filter(
                                    f =>
                                      f.hims_d_pharmacy_uom_id ===
                                      row.uom_requested_id
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
                                      row.uom_requested_id
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
                          fieldName: "quantity_requested",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Quantity Requested" }}
                            />
                          ),
                          disabled: true
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
                          disabled: true
                        },
                        {
                          fieldName: "quantity_transferred",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Quantity Transfered"
                              }}
                            />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  value: row.quantity_transferred,
                                  className: "txt-fld",
                                  name: "quantity_transferred",
                                  events: {
                                    onChange: onchangegridcol.bind(
                                      this,
                                      this,
                                      context,
                                      row
                                    )
                                  },
                                  others:{
                                    type:"number",
                                    algaeh_required: "true",
                                    errormessage:
                                      "Please enter Transferred Quantity ..",
                                    checkvalidation:
                                      "value ==='' || value ==='0'"
                                  }
                                }}
                              />
                            );
                          }
                        },
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
                          fieldName: "transfer_to_date",
                          label: (
                            <AlgaehLabel
                              label={{
                                forceLabel: "Transfer To Date"
                              }}
                            />
                          ),
                          disabled: true
                        }
                      ]}
                      keyId="service_type_id"
                      dataSource={{
                        data: this.state.pharmacy_stock_detail
                      }}
                      isEditable={false}
                      byForceEvents={true}
                      datavalidate="id='TRANS_details'"
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: deleteTransEntryDetail.bind(
                          this,
                          this,
                          context
                        ),
                        onEdit: EditGrid.bind(this, this, context),
                        onCancel: EditGrid.bind(this, this, context),
                        onDone: updateTransEntryDetail.bind(this, this, context)
                      }}
                      onRowSelect={row => {
                        getItemLocationStock(this, row);
                      }}
                    />
                  </div>
                </div>
             </div>
             <div className="col-8" style={{paddingLeft:0}}>
             
             <div className="portlet portlet-bordered margin-bottom-15">
             {/* <div className="portlet-title">
             <div className="caption">
              <h3 className="caption-subject">Enter Grid Name Here</h3>
              </div>
             <div className="actions">
             <a className="btn btn-primary btn-circle active">
             <i className="fas fa-pen" />
             </a>
             </div>
             </div> */}
             <div className="portlet-body">
             <div className="row">
             <div className="col-12" id="itemTransferMapGrid_Cntr">
             <AlgaehDataGrid
             id="itemTransferMapGrid"
             datavalidate="itemTransferMapGrid"
             columns={[
              {
             fieldName: "batch_no",
              label: (
             <AlgaehLabel label={{ forceLabel: "Batch No" }} />
             )
              },
              {
             fieldName: "Auth_qty",
              label: (
             <AlgaehLabel label={{ forceLabel: "Auth Qty" }} />
             )
              },
              {
             fieldName: "exp_date",
              label: (
             <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
             )
              },
              {
             fieldName: "Trans_qty",
              label: (
             <AlgaehLabel label={{ forceLabel: "Transfering Qty" }} />
             )
              }
             ]}
             keyId=""
             dataSource={{data:[]}} 
             isEditable={false}
             paging={{ page: 0, rowsPerPage: 10 }}
             events={{}}
             others={{}}
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
      getTransferData: AlgaehActions,
      getItemLocationStock: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferEntryItems)
);
