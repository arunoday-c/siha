import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import "../../../styles/site.css";
import {
  AlgaehLabel,
  AlgaehDataGrid,
  AlgaehModalPopUp,
  AlagehFormGroup
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
      inventory_location_id: null,
      quantity: 0
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
      this.setState({
        inventory_location_id: newProps.inventory_location_id,
        batch_wise_item: newProps.batch_wise_item,
        location_name: Location_name[0].location_description,
        location_type: Location_name[0].location_type
      });
    }
  }

  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  texthandle(row, e) {
    let name = e.name || e.target.name;
    let value = e.value || e.target.value;
    let batch_wise_item = this.state.batch_wise_item;
    let _batch_wise_item = this.state.batch_wise_item;
    let _index = batch_wise_item.indexOf(row);
    let select_qty = row.select_qty;

    if (parseFloat(value) > parseFloat(row.qtyhand)) {
      row[name] = row.select_qty;
      swalMessage({
        title: "Selected Qty cannot be greater than Quantity in Hand",
        type: "warning"
      });
    } else {
      row[name] = value;
    }
    _batch_wise_item[_index] = row;
    let quantity = _.sumBy(_batch_wise_item, s => parseFloat(s.select_qty));
    if (parseFloat(quantity) > parseFloat(this.props.available_qty)) {
      row[name] = select_qty;
      batch_wise_item[_index] = row;
      this.setState({
        batch_wise_item: batch_wise_item
      });
      swalMessage({
        title: "Quantity cannot be greater than Available Qty",
        type: "warning"
      });
    } else {
      batch_wise_item[_index] = row;
      this.setState({
        batch_wise_item: batch_wise_item,
        quantity: quantity
      });
    }
  }

  UtilizeGetBatchData(e) {
    let batch_wise_item = this.state.batch_wise_item;
    let selected_items = _.filter(batch_wise_item, f => {
      return parseFloat(f.select_qty) > 0 && f.select_qty !== null;
    });

    for (let i = 0; i < selected_items.length; i++) {
      selected_items[i].quantity = selected_items[i].select_qty;
      selected_items[i].service_id = this.props.service_id;
      selected_items[i].location_id = this.state.inventory_location_id;
      selected_items[i].location_type = this.state.location_type;
      selected_items[i].item_category_id = this.props.item_category_id;
      selected_items[i].item_group_id = this.props.item_group_id;
      selected_items[i].uom_id = selected_items[i].sales_uom;
      selected_items[i].unit_cost =
        parseFloat(selected_items[i].select_qty) *
        parseFloat(selected_items[i].sale_price);
      selected_items[i].extended_cost =
        parseFloat(selected_items[i].select_qty) *
        parseFloat(selected_items[i].sale_price);
      selected_items[i].operation = "-";
    }
    // row.selected = true;
    let OutputObj = {
      selected: true,
      quantity: this.state.quantity,
      selected_items: selected_items,
      batch_wise_item: this.state.batch_wise_item,
      location_type: this.state.location_type
    };
    this.onClose(OutputObj);
  }

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
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Loacation Name"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>{this.state.location_name}</h5>
                  </div>
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Package Service Qty"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>{this.props.available_qty}</h5>
                  </div>

                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "Selected Qty"
                      }}
                    />
                    <h5 style={{ margin: 0 }}>{this.state.quantity}</h5>
                  </div>
                </div>
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
                        },
                        {
                          fieldName: "select_qty",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Select Quantity" }}
                            />
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
                                  value: row.select_qty,
                                  className: "txt-fld",
                                  name: "select_qty",
                                  dontAllowKeys: ["-", "e", "."],
                                  events: {
                                    onChange: this.texthandle.bind(this, row)
                                  }
                                }}
                              />
                            );
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
                    />
                  </div>
                </div>

                <div className="popupFooter">
                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-lg-12">
                        <span className="float-right">
                          <button
                            className="btn-primary"
                            onClick={this.UtilizeGetBatchData.bind(this)}
                          >
                            Utilize
                          </button>

                          <button
                            className="btn btn-default"
                            onClick={this.onClose.bind(this)}
                          >
                            Cancel
                          </button>
                        </span>
                      </div>
                    </div>
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
