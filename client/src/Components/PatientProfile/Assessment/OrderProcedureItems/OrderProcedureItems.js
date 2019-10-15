import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

// import moment from "moment";
import "./OrderProcedureItems.scss";
import "../../../../styles/site.scss";

import {
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehModalPopUp
} from "../../../Wrapper/algaehWrapper";
import _ from "lodash";

import OrderProcedureItemsEvent from "./OrderProcedureItemsEvent";
import { AlgaehActions } from "../../../../actions/algaehActions";

class OrderProcedureItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory_location_id: null,
      existing_new: "E",

      item_id: null,
      item_category_id: null,
      item_group_id: null,
      uom_id: null,
      batchno: null,
      expirydt: null,
      barcode: null,
      grn_no: null,
      qtyhand: null,
      unit_cost: null,

      Procedure_items: [],
      location_name: null,
      location_type: null,
      procedure_id: null,
      location_id: null,
      patient_id: null,
      episode_id: null,
      quantity: 0
    };
  }
  getDepartments() {
    if (
      this.props.inventoryitemlist === undefined ||
      this.props.inventoryitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        data: { item_status: "A" },
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist"
        }
      });
    }
  }

  onClose = e => {
    this.setState(
      {
        inventory_location_id: null,
        existing_new: "E",

        item_id: null,
        item_category_id: null,
        item_group_id: null,
        uom_id: null,
        batchno: null,
        expirydt: null,
        barcode: null,
        grn_no: null,
        qtyhand: null,
        unit_cost: null,

        Procedure_items: [],
        location_name: null,
        location_type: null,
        procedure_id: null,
        location_id: null,
        patient_id: null,
        episode_id: null,
        quantity: 0
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };

  componentDidMount() {
    this.getDepartments();
  }

  componentWillReceiveProps(newProps) {
    let Location_name =
      this.props.inventorylocations !== undefined &&
      this.props.inventorylocations.length > 0
        ? _.filter(this.props.inventorylocations, f => {
            return (
              f.hims_d_inventory_location_id ===
              newProps.inputsparameters.inventory_location_id
            );
          })
        : [];

    if (Location_name.length > 0) {
      this.setState({
        inventory_location_id: newProps.inputsparameters.inventory_location_id,
        location_name: Location_name[0].location_description,
        location_type: Location_name[0].location_type,
        procedure_id: newProps.inputsparameters.procedure_id
      });
    }
  }

  texthandle(e) {
    OrderProcedureItemsEvent().texthandle(this, e);
  }

  itemSearch() {
    OrderProcedureItemsEvent().itemSearch(this);
  }

  quantityEvent(e) {
    OrderProcedureItemsEvent().quantityEvent(this, e);
  }

  addItems() {
    OrderProcedureItemsEvent().addItems(this);
  }
  SaveProcedureItems() {
    OrderProcedureItemsEvent().SaveProcedureItems(this);
  }
  RemoveItems(row) {
    OrderProcedureItemsEvent().RemoveItems(this, row);
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <AlgaehModalPopUp
            events={{
              onClose: this.onClose.bind(this)
            }}
            title="Procedure Items"
            openPopup={this.props.show}
          >
            <div className="row">
              <div className="col-lg-12 popupInner">
                <div className="popRightDiv">
                  <div className="row">
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Code"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.patient_code
                          ? this.props.inputsparameters.patient_code
                          : "Patient Code"}
                      </h6>
                    </div>
                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Patient Name"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.full_name
                          ? this.props.inputsparameters.full_name
                          : "Patient Name"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Procedure Name"
                        }}
                      />
                      <h6>
                        {this.props.inputsparameters.procedure_name
                          ? this.props.inputsparameters.procedure_name
                          : "Procedure Name"}
                      </h6>
                    </div>

                    <div className="col-3">
                      <AlgaehLabel
                        label={{
                          forceLabel: "Location Name"
                        }}
                      />
                      <h6>
                        {this.state.location_name
                          ? this.state.location_name
                          : "Location Name"}
                      </h6>
                    </div>
                  </div>
                  <hr style={{ margin: "0rem" }} className="margin-bottom-15" />
                  <div className="row">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-2">
                          {/* <label>Working Days</label> */}
                          <div
                            className="customRadio"
                            style={{ marginTop: 19 }}
                          >
                            <label className="radio inline">
                              <input
                                type="radio"
                                name="existing_new"
                                value="E"
                                checked={
                                  this.state.existing_new === "E" ? true : false
                                }
                                onChange={this.texthandle.bind(this)}
                              />
                              <span>Existing</span>
                            </label>
                            <label className="radio inline">
                              <input
                                type="radio"
                                name="existing_new"
                                value="N"
                                checked={
                                  this.state.existing_new === "N" ? true : false
                                }
                                onChange={this.texthandle.bind(this)}
                              />
                              <span>New</span>
                            </label>
                          </div>
                        </div>

                        <div className="col-4  margin-top-15">
                          <div className="row spotlightSearchBox">
                            <div className="col-lg-9">
                              <AlgaehLabel
                                label={{ forceLabel: "Search Items" }}
                              />
                              <h6>
                                {this.state.item_description
                                  ? this.state.item_description
                                  : "----------"}
                              </h6>
                            </div>
                            <div className="col spotlightSearchIconBox">
                              <i
                                className="fas fa-search fa-lg"
                                style={{
                                  paddingTop: 17,
                                  paddingLeft: 3,
                                  cursor: "pointer"
                                }}
                                onClick={this.itemSearch.bind(this, this)}
                              />
                            </div>
                          </div>
                        </div>

                        <AlagehFormGroup
                          div={{ className: "col-2 form-group" }}
                          label={{
                            forceLabel: "Qty",
                            isImp: false
                          }}
                          textBox={{
                            number: {
                              allowNegative: false,
                              thousandSeparator: ","
                            },
                            className: "txt-fld",
                            name: "quantity",
                            dontAllowKeys: ["-", "e", "."],
                            value: this.state.quantity,
                            events: { onChange: this.quantityEvent.bind(this) }
                          }}
                        />
                        <div className="col-2">
                          <button
                            className="btn btn-primary"
                            style={{ float: "right", marginTop: 19 }}
                            onClick={this.addItems.bind(this)}
                          >
                            Add Item
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="col-12" id="ExisitingNewItemsGrid_Cntr">
                      <AlgaehDataGrid
                        id="ExisitingNewItemsGrid"
                        datavalidate="ExisitingNewItemsGrid"
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
                                    onClick={this.RemoveItems.bind(this, row)}
                                    className="fas fa-trash-alt"
                                  />
                                </span>
                              );
                            },
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "item_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
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
                            },
                            disabled: true
                          },
                          {
                            fieldName: "quantity",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Qty" }} />
                            ),
                            displayTemplate: row => {
                              return <span>{parseFloat(row.quantity)}</span>;
                            },
                            others: { maxWidth: 80, align: "center" }
                          },
                          {
                            fieldName: "batchno",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Batch" }} />
                            ),
                            others: { maxWidth: 250, align: "center" }
                          },
                          {
                            fieldName: "expirydt",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Expiry" }}
                              />
                            ),
                            others: { maxWidth: 150, align: "center" }
                          },
                          {
                            fieldName: "qtyhand",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Qty in Hand" }}
                              />
                            ),
                            displayTemplate: row => {
                              return <span>{parseFloat(row.qtyhand)}</span>;
                            },
                            others: { maxWidth: 150, align: "center" }
                          }
                        ]}
                        keyId="actionCheck"
                        dataSource={{ data: this.state.Procedure_items }}
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
            <div className=" popupFooter">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={this.SaveProcedureItems.bind(this)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={e => {
                        this.onClose(e);
                      }}
                    >
                      Cancel
                    </button>
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
    patient_profile: state.patient_profile,
    inventorylocations: state.inventorylocations,
    inventoryitemlist: state.inventoryitemlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getItems: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(OrderProcedureItems)
);
