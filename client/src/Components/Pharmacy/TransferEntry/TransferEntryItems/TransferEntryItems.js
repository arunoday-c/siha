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
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../../Wrapper/algaehWrapper";

import {
  onchangegridcol,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deletePosDetail,
  updatePosDetail,
  UomchangeTexts,
  dateFormater
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

  render() {
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hptl-phase1-requisition-item-form">
              <div className="container-fluid">
                <div className="row">
                  {/* <div className="col-lg-12">
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
                            onChange: itemchangeText.bind(this, this)
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
                            name: "quantity_required",
                            value: this.state.quantity_required,
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
                      </div>
                    </div>
                  </div> */}

                  <div className="col-lg-12">
                    {/* <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15"> */}
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
                                        data: this.props.itemlist
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
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "item_category_id",
                                      className: "select-fld",
                                      value: row.item_category_id,
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
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "item_group_id",
                                      className: "select-fld",
                                      value: row.item_group_id,
                                      dataSource: {
                                        textField: "group_description",
                                        valueField: "hims_d_item_group_id",
                                        data: this.props.itemgroup
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
                                return (
                                  <AlagehAutoComplete
                                    div={{}}
                                    selector={{
                                      name: "item_uom",
                                      className: "select-fld",
                                      value: row.item_uom,

                                      dataSource: {
                                        textField: "uom_description",
                                        valueField: "uom_id",
                                        data: this.state.ItemUOM
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
                              fieldName: "quantity_required",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity Required" }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.quantity_required,
                                      className: "txt-fld",
                                      name: "quantity_required",
                                      events: { onChange: null },
                                      others: {
                                        disabled: true
                                      }
                                    }}
                                  />
                                );
                              }
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
                            },
                            {
                              fieldName: "quantity_transfered",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Transfered"
                                  }}
                                />
                              ),
                              editorTemplate: row => {
                                return (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      value: row.quantity_transfered,
                                      className: "txt-fld",
                                      name: "quantity_transfered",
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
                          // isEditable={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          // events={{
                          //   onDelete: deleteRequisitionDetail.bind(
                          //     this,
                          //     this,
                          //     context
                          //   ),
                          //   onEdit: row => {},
                          //   onDone: updatePosDetail.bind(this, this)
                          // }}
                        />
                      </div>
                    </div>
                    {/* </div> */}
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
    itemgroup: state.itemgroup
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
      getTransferData: AlgaehActions
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
