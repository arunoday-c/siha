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
  // itemchangeText,
  // numberchangeTexts,
  // AddItems,
  deleteTransEntryDetail,
  updateTransEntryDetail,
  // UomchangeTexts,
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
                  <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                    {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
                    <div className="portlet-body" id="REQ_details_Cntr">
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
                                        f.hims_d_item_master_id === row.item_id
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
                                      f =>
                                        f.hims_d_item_master_id === row.item_id
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
                            editorTemplate: row => {
                              return (
                                <span>
                                  {dateFormater(this, row.expiry_date)}
                                </span>
                              );
                            }
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
                            fieldName: "uom_requested_id",
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
                            disabled: true
                            // editorTemplate: row => {
                            //   return (
                            //     <AlagehFormGroup
                            //       div={{}}
                            //       textBox={{
                            //         value: row.quantity_authorized,
                            //         className: "txt-fld",
                            //         name: "quantity_authorized",
                            //         events: {
                            //           onChange: onchangegridcol.bind(
                            //             this,
                            //             this,
                            //             context,
                            //             row
                            //           )
                            //         },
                            //         others: {
                            //           disabled: this.state.authorizeEnable
                            //         }
                            //       }}
                            //     />
                            //   );
                            // }
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
                            editorTemplate: row => {
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
                                    }
                                    // others: {
                                    //   disabled: this.state.authorizeEnable
                                    // }
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
                          onDelete: deleteTransEntryDetail.bind(
                            this,
                            this,
                            context
                          ),
                          onEdit: row => {},
                          onDone: updateTransEntryDetail.bind(this, this)
                        }}
                      />
                    </div>
                  </div>
                  {/* </div> */}
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
