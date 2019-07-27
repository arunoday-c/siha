import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../Wrapper/algaehWrapper";

import { AlgaehActions } from "../../../actions/algaehActions";
import _ from "lodash";
import { swalMessage, algaehApiCall } from "../../../utils/algaehApiCall";

class ConsumtionItemBatches extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      batch_wise_item: [],
      service_id: null,
      inventory_location_id: null
    };
  }

  componentWillReceiveProps(newProps) {
    
    let Location_name =
      this.props.inventorylocations !== undefined &&
      this.props.inventorylocations.length > 0
        ? _.filter(this.props.inventorylocations, f => {
            return (
              f.hims_d_inventory_location_id === newProps.inventory_location_id
            );
          })
        : [];

    if (Location_name.length > 0) {
      this.setState(
        {
          inventory_location_id: newProps.inventory_location_id,
          batch_wise_item: newProps.batch_wise_item,
          location_name: Location_name[0].location_description,
          location_type: Location_name[0].location_type
        },
        () => {
          // this.getItemLocationStock();
        }
      );
    }
  }

  getItemLocationStock() {
    
    algaehApiCall({
      uri: "/inventory/getItemMaster",
      data: { service_id: this.state.service_id },
      module: "inventory",
      method: "GET",
      onSuccess: response => {
        if (response.data.success === true) {
          
          let inputObj = {
            item_id: response.data.records[0].hims_d_inventory_item_master_id,
            inventory_location_id: this.state.inventory_location_id
          };
          algaehApiCall({
            uri: "/inventoryGlobal/getItemandLocationStock",
            module: "inventory",
            method: "GET",
            data: inputObj,
            onSuccess: response => {
              if (response.data.success === true) {
                this.setState({
                  batch_wise_item: response.data.records
                });
              }
            },
            onFailure: error => {
              swalMessage({
                title: error.message,
                type: "error"
              });
            }
          });
        }
      },
      onFailure: error => {
        swalMessage({
          title: error.message,
          type: "error"
        });
      }
    });
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Item Batch"
            openPopup={this.props.show}
          >
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
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          ),
                          displayTemplate: row => {
                            let display =
                              this.props.inventoryitemlist === undefined
                                ? []
                                : this.props.inventoryitemlist.filter(
                                    f =>
                                      f.hims_d_inventory_item_master_id ===
                                      row.item_id
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
                          fieldName: "batchno",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Batch No." }} />
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
                          ),
                          displayTemplate: row => {
                            return parseFloat(row.qtyhand);
                          }
                        }
                      ]}
                      keyId="item_id"
                      dataSource={{
                        data: this.state.batch_wise_item
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
          </AlgaehModalPopUp>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventorylocations: state.inventorylocations,
    inventoryitemlist: state.inventoryitemlist
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
  )(ConsumtionItemBatches)
);
