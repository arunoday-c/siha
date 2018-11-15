import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "./ItemBatchs.css";
import "./../../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  Modal
} from "../../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../../actions/algaehActions";

class ItemBatchs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <Modal
            className="model-set"
            open={this.props.show}
            onClose={e => {
              this.onClose(e);
            }}
          >
            <div className="algaeh-modal">
              {/* <div className="popupHeader">
                <h4> Batchs </h4>
              </div> */}
              <div className="popupHeader">
                <div className="row">
                  <div className="col-lg-8">
                    <h4>Item Batch</h4>
                  </div>
                  <div className="col-lg-4">
                    <button
                      type="button"
                      className=""
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      <i className="fas fa-times-circle" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="hptl-phase1-item-batch-form">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-lg-12">
                      <AlgaehDataGrid
                        id="item_batchs"
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
                                this.props.positemlist === undefined
                                  ? []
                                  : this.props.positemlist.filter(
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
                            fieldName: "sales_uom",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Sales UOM" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.itemuom === undefined
                                  ? []
                                  : this.props.itemuom.filter(
                                      f =>
                                        f.hims_d_pharmacy_uom_id ===
                                        row.sales_uom
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
                              <AlgaehLabel
                                label={{ forceLabel: "Batch No." }}
                              />
                            )
                          },
                          {
                            fieldName: "expirydt",
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
                          }
                        ]}
                        keyId="item_id"
                        dataSource={{
                          data:
                            this.props.inputsparameters.Batch_Items ===
                            undefined
                              ? []
                              : this.props.inputsparameters.Batch_Items
                        }}
                        algaehSearch={true}
                        // isEditable={true}
                        paging={{ page: 0, rowsPerPage: 10 }}
                        onRowSelect={row => {
                          row.selected = true;
                          this.onClose(row);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    // itemBatch: state.itemBatch,
    itemuom: state.itemuom,
    positemlist: state.positemlist
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ItemBatchs)
);
