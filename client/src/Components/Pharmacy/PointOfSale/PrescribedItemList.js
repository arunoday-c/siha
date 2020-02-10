import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./../../../styles/site.scss";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import {
  qtyonchangegridcol,
  processSelectedItems,
  getMedicationAprovalList
} from "./PointOfSaleEvents";
import PreApprovalStatus from "./PosListItems/PreApprovalStatus/PreApprovalStatus";
import "./PointOfSale.scss";

class PrescribedItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_batches: [],
      viewPreapproval: false,
      selected_row: null
    };
  }

  onClose = e => {
    this.setState(
      {
        item_batches: [],
        selected_row: null
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.POSIOputs);
  }

  CloseEditModel(e) {
    this.setState(
      {
        viewPreapproval: !this.state.viewPreapproval
      },
      () => {
        if (e === "refresh") {
          this.props.onClose && this.props.onClose("preApproval");
        }
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Item List"
            openPopup={this.props.show}
          >
            <div className="popupInner">
              <div className="col-12 popRightDiv" style={{ maxHeight: "76vh" }}>
                <div className="row">
                  <div className="col-4" id="prescribedListGrid_Cntr">
                    <AlgaehDataGrid
                      id="prescribedListGrid"
                      columns={[
                        {
                          fieldName: "select_item",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Selected" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.select_item === "N" ? (
                                  <span className="badge badge-danger">No</span>
                                ) : (
                                  <span className="badge badge-success">
                                    Yes
                                  </span>
                                )}
                              </span>
                            );
                          }
                        },
                        {
                          fieldName: "item_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          ),
                          className: row => {
                            return "greenCell";
                          }
                        },
                        {
                          fieldName: "insurance_yesno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Insured" }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <span>
                                {row.insurance_yesno === "N"
                                  ? "Not Covered"
                                  : "Covered"}
                              </span>
                            );
                          },
                          disabled: true
                        },
                        {
                          fieldName: "pre_approval",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Pre Approval" }}
                            />
                          ),
                          displayTemplate: row => {
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
                          disabled: true
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data: this.state.prescribed_item_list
                      }}
                      algaehSearch={true}
                      // isEditable={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      onRowSelect={row => {
                        if (row.pre_approval === "N") {
                          let _index = this.state.prescribed_item_list.indexOf(
                            row
                          );
                          this.setState({
                            item_batches: row.batches,
                            selected_row: _index
                          });
                        } else {
                          this.setState({
                            item_batches: [],
                            selected_row: null
                          });
                        }
                      }}
                    />
                  </div>
                  <div className="col-8" id="itemBatchsGrid_Cntr">
                    <AlgaehDataGrid
                      id="itemBatchsGrid"
                      columns={[
                        {
                          fieldName: "item_description",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          )
                        },
                        {
                          fieldName: "sales_uom",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.itemuom === undefined
                                ? []
                                : this.props.itemuom.filter(
                                    f =>
                                      f.hims_d_pharmacy_uom_id === row.sales_uom
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
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                          )
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
                          fieldName: "qtyhand",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Quantity in Hand" }}
                            />
                          )
                        },
                        {
                          fieldName: "sale_price",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Unit Cost" }} />
                          )
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Qty Req." }} />
                          ),
                          displayTemplate: row => {
                            return (
                              <AlagehFormGroup
                                div={{}}
                                textBox={{
                                  number: {
                                    allowNegative: false,
                                    thousandSeparator: ","
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
                                      row
                                    )
                                  },
                                  others: {
                                    onFocus: e => {
                                      e.target.oldvalue = e.target.value;
                                    }
                                  }
                                }}
                              />
                            );
                          },
                          others: {
                            minWidth: 80
                          }
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data: this.state.item_batches
                      }}
                      algaehSearch={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-4"> &nbsp;</div>

                  <div className="col-lg-8">
                    <button
                      onClick={processSelectedItems.bind(this, this)}
                      type="button"
                      className="btn btn-primary"
                      // disabled={this.state.button_enable}
                    >
                      Process
                    </button>
                    <button
                      onClick={e => {
                        this.onClose(e);
                      }}
                      type="button"
                      className="btn btn-default"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AlgaehModalPopUp>
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
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemuom: state.itemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PrescribedItemList)
);
