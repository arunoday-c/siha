import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../ReceiptEntry.scss";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import {
  deleteReceiptDetail,
  updateReceiptDetail,
  EditGrid,
  CancelGrid,
  getDeliveryItemDetails,
  CloseItemDetail
} from "./ReceiptItemListEvent";
import { getAmountFormart } from "../../../../utils/GlobalFunctions";
import DNItemList from "./DeliveryItemDetails";

class ReceiptItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dn_item_enable: false,
      dn_item_details: []
    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.ReceiptEntryInp;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.ReceiptEntryInp);
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
                      <div className="col-lg-12" id="ReceiptGrid">
                        <AlgaehDataGrid
                          id="Receipt_details"
                          columns={[
                            {
                              fieldName: "actions",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "Action" }} />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-eye"
                                      onClick={getDeliveryItemDetails.bind(
                                        this,
                                        this,
                                        row
                                      )}
                                    />

                                    <i
                                      className="fas fa-trash-alt"
                                      onClick={deleteReceiptDetail.bind(
                                        this,
                                        this,
                                        row,
                                        context
                                      )}
                                      style={{
                                        pointerEvents:
                                          this.state.saveEnable === true
                                            ? "none"
                                            : "",
                                        opacity:
                                          this.state.saveEnable === true
                                            ? "0.1"
                                            : ""
                                      }}
                                    />
                                  </span>
                                );
                              }
                            },
                            {
                              fieldName: "delivery_note_number",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Delivery Number" }}
                                />
                              ),

                              others: {
                                minWidth: 150,
                                resizable: false
                              }
                            },

                            {
                              fieldName: "extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Extended Cost" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.extended_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },

                            {
                              fieldName: "discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.discount_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },
                            {
                              fieldName: "net_extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Extended Cost" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.net_extended_cost, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.tax_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },

                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {getAmountFormart(row.total_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            }
                          ]}
                          keyId="hims_f_procurement_receipt_detail_id"
                          dataSource={{
                            data: this.state.receipt_entry_detail
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                          events={{
                            onDelete: deleteReceiptDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: EditGrid.bind(this, this, context),
                            onCancel: CancelGrid.bind(this, this, context),
                            onDone: updateReceiptDetail.bind(
                              this,
                              this,
                              context
                            )
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
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Sub Total"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.sub_total)}</h6>
                        </div>
                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Discount Amount"
                            }}
                          />
                          <h6>
                            {getAmountFormart(this.state.detail_discount)}
                          </h6>
                        </div>

                        <div className="col-lg-3">
                          <AlgaehLabel
                            label={{
                              forceLabel: "Tax"
                            }}
                          />
                          <h6>{getAmountFormart(this.state.total_tax)}</h6>
                        </div>

                        <div className="col-lg-3">
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
                <DNItemList
                  show={this.state.dn_item_enable}
                  onClose={CloseItemDetail.bind(this, this)}
                  HeaderCaption="Delivery Items"
                  dn_item_details={this.state.dn_item_details}
                  grn_for={this.state.grn_for}
                />
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
    receiptitemlist: state.receiptitemlist,
    receiptitemcategory: state.receiptitemcategory,
    receiptitemgroup: state.receiptitemgroup,
    receiptitemuom: state.receiptitemuom
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
  )(ReceiptItemList)
);
