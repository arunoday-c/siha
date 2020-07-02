import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { InputItem } from "./ItemInput";
import { AlgaehDataGrid, AlgaehLabel } from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";
import { swalMessage } from "../../../../utils/algaehApiCall";

class RequestItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static contextType = MyContext;

  AddItems = (input) => {
    if (input.quantity === 0) {
      swalMessage({
        title: "Please enter Quantity Required .",
        type: "warning",
      });
    } else {
      let ItemInput = {
        quantity: input.quantity,
        itm_notes: input.item_notes,
      };
      if (this.context.state.quotation_for === "PHR") {
        ItemInput.phar_item_category = input.category_id;
        ItemInput.phar_item_group = input.group_id;
        ItemInput.phar_item_id = input.item_id;
        ItemInput.pharmacy_uom_id = input.uom_id;
      } else {
        ItemInput.inv_item_category_id = input.category_id;
        ItemInput.inv_item_group_id = input.group_id;
        ItemInput.inv_item_id = input.item_id;
        ItemInput.inventory_uom_id = input.uom_id;
      }
      let quotation_detail = [...this.context.state.quotation_detail];
      quotation_detail.push(ItemInput);

      this.context.updateState({
        quotation_detail,
        saveEnable: false,
      });
    }
  };

  deleteQuotationDetail = (row) => {
    let quotation_detail = [...this.context.state.quotation_detail];

    quotation_detail.splice(row.rowIdx, 1);
    this.context.updateState({
      quotation_detail,
      saveEnable: quotation_detail.length > 0 ? false : true,
    });
  };

  render() {
    const { state } = this.context;
    const isPharmacy = state.quotation_for === "PHR";
    return (
      <React.Fragment>
        <div className="hims-purchase-order-entry">
          <div className="row">
            <InputItem
              disabled={state.dataExists || !state.quotation_for}
              poitemcategory={this.props.poitemcategory}
              poitemgroup={this.props.poitemgroup}
              poitemuom={this.props.poitemuom}
              quotation_for={state.quotation_for}
              AddItem={this.AddItems}
            />

            <div className="col-lg-12">
              <div className="portlet portlet-bordered margin-bottom-15">
                <div className="row">
                  <div className="col-lg-12" id="ReqQuoteGrid_Cntr">
                    <AlgaehDataGrid
                      id="QUOTATION_details"
                      columns={[
                        {
                          fieldName: isPharmacy
                            ? "phar_item_id"
                            : "inv_item_id",

                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                          ),
                          displayTemplate: (row) => {
                            let display;

                            isPharmacy
                              ? (display =
                                  this.props.poitemlist === undefined
                                    ? []
                                    : this.props.poitemlist.filter(
                                        (f) =>
                                          f.hims_d_item_master_id ===
                                          row.phar_item_id
                                      ))
                              : (display =
                                  this.props.poitemlist === undefined
                                    ? []
                                    : this.props.poitemlist.filter(
                                        (f) =>
                                          f.hims_d_inventory_item_master_id ===
                                          row.inv_item_id
                                      ));

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].item_description
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 200,
                          },
                        },

                        {
                          fieldName: isPharmacy
                            ? "phar_item_category"
                            : "inv_item_category_id",
                          label: (
                            <AlgaehLabel
                              label={{ forceLabel: "Item Category" }}
                            />
                          ),

                          displayTemplate: (row) => {
                            let display;

                            isPharmacy
                              ? (display =
                                  this.props.poitemcategory === undefined
                                    ? []
                                    : this.props.poitemcategory.filter(
                                        (f) =>
                                          f.hims_d_item_category_id ===
                                          row.phar_item_category
                                      ))
                              : (display =
                                  this.props.poitemcategory === undefined
                                    ? []
                                    : this.props.poitemcategory.filter(
                                        (f) =>
                                          f.hims_d_inventory_tem_category_id ===
                                          row.inv_item_category_id
                                      ));

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].category_desc
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 150,
                          },
                        },
                        {
                          fieldName: isPharmacy
                            ? "phar_item_group"
                            : "inv_item_group_id",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Item Group" }} />
                          ),

                          displayTemplate: (row) => {
                            let display;

                            isPharmacy
                              ? (display =
                                  this.props.poitemgroup === undefined
                                    ? []
                                    : this.props.poitemgroup.filter(
                                        (f) =>
                                          f.hims_d_item_group_id ===
                                          row.phar_item_group
                                      ))
                              : (display =
                                  this.props.poitemgroup === undefined
                                    ? []
                                    : this.props.poitemgroup.filter(
                                        (f) =>
                                          f.hims_d_inventory_item_group_id ===
                                          row.inv_item_group_id
                                      ));

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].group_description
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 150,
                          },
                        },
                        {
                          fieldName: isPharmacy
                            ? "pharmacy_uom_id"
                            : "inventory_uom_id",
                          label: <AlgaehLabel label={{ forceLabel: "UOM" }} />,
                          displayTemplate: (row) => {
                            let display;

                            isPharmacy
                              ? (display =
                                  this.props.poitemuom === undefined
                                    ? []
                                    : this.props.poitemuom.filter(
                                        (f) =>
                                          f.hims_d_pharmacy_uom_id ===
                                          row.pharmacy_uom_id
                                      ))
                              : (display =
                                  this.props.poitemuom === undefined
                                    ? []
                                    : this.props.poitemuom.filter(
                                        (f) =>
                                          f.hims_d_inventory_uom_id ===
                                          row.inventory_uom_id
                                      ));

                            return (
                              <span>
                                {display !== undefined && display.length !== 0
                                  ? display[0].uom_description
                                  : ""}
                              </span>
                            );
                          },
                          others: {
                            minWidth: 100,
                          },
                        },
                        {
                          fieldName: "quantity",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Quantity" }} />
                          ),
                          displayTemplate: (row) => {
                            return <span> {row.quantity} </span>;
                          },
                        },
                        {
                          fieldName: "itm_notes",
                          label: (
                            <AlgaehLabel label={{ forceLabel: "Notes" }} />
                          ),
                          others: {
                            minWidth: 200,
                          },
                        },
                      ]}
                      keyId="hims_f_procurement_req_quotation_detail_id"
                      dataSource={{
                        data: state.quotation_detail,
                      }}
                      isEditable={!state.saveEnable}
                      actions={{
                        allowEdit: false,
                      }}
                      byForceEvents={true}
                      // forceRender={true}
                      paging={{ page: 0, rowsPerPage: 10 }}
                      events={{
                        onDelete: this.deleteQuotationDetail,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    poitemlist: state.poitemlist,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RequestItemList)
);
