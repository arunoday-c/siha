import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import "../ReceiptEntry.scss";

import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import {
  deleteInvoiceItemDetail,
  getDeliveryItemDetails,
  CloseItemDetail
} from "./InvoiceItemListEvents";
import { GetAmountFormart } from "../../../../utils/GlobalFunctions";
import OrderItemDetails from "./OrderItemDetails";

class InvoiceItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.SALESInvoiceIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.SALESInvoiceIOputs);
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
                                      onClick={deleteInvoiceItemDetail.bind(
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
                              fieldName: "dispatch_note_number",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Dispatch Number" }}
                                />
                              ),

                              others: {
                                minWidth: 150,
                                resizable: false
                              }
                            },

                            {
                              fieldName: "sub_total",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Sub Total" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.sub_total, {
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
                                    {GetAmountFormart(row.discount_amount, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },
                            {
                              fieldName: "net_total",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Total" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.net_total, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },
                            {
                              fieldName: "total_tax",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.total_tax, {
                                      appendSymbol: false
                                    })}
                                  </span>
                                );
                              },
                              disabled: true
                            },

                            {
                              fieldName: "net_payable",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Payable" }}
                                />
                              ),
                              displayTemplate: row => {
                                return (
                                  <span>
                                    {GetAmountFormart(row.net_payable, {
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
                            data: this.state.invoice_entry_detail_item
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <OrderItemDetails
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
  )(InvoiceItemList)
);
