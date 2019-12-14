import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
} from "../../../Wrapper/algaehWrapper";
import { AlgaehActions } from "../../../../actions/algaehActions";
import MyContext from "../../../../utils/MyContext";

import {
  onchhangeNumber
} from "./ItemListEvents";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.RequestQuotation;
    this.setState({ ...this.state, ...InputOutput });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.RequestQuotation);
  }

  render() {

    return (
      <React.Fragment>
        <MyContext.Consumer>
          {context => (
            <div className="hims-purchase-order-entry">
              <div className="row">
                <div className="col-lg-12">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12" id="POGrid">
                        <AlgaehDataGrid
                          id="vendor_quotation_details"
                          columns={[
                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_id"
                                  : "inv_item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                    this.props.poitemlist === undefined
                                      ? []
                                      : this.props.poitemlist.filter(
                                        f =>
                                          f.hims_d_item_master_id ===
                                          row.phar_item_id
                                      ))
                                  : (display =
                                    this.props.poitemlist === undefined
                                      ? []
                                      : this.props.poitemlist.filter(
                                        f =>
                                          f.hims_d_inventory_item_master_id ===
                                          row.inv_item_id
                                      ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 200
                              }
                            },

                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_category"
                                  : "inv_item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),

                              displayTemplate: row => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                    this.props.poitemcategory === undefined
                                      ? []
                                      : this.props.poitemcategory.filter(
                                        f =>
                                          f.hims_d_item_category_id ===
                                          row.phar_item_category
                                      ))
                                  : (display =
                                    this.props.poitemcategory === undefined
                                      ? []
                                      : this.props.poitemcategory.filter(
                                        f =>
                                          f.hims_d_inventory_tem_category_id ===
                                          row.inv_item_category_id
                                      ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].category_desc
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 150
                              }
                            },
                            {
                              fieldName:
                                this.state.quotation_for === "PHR"
                                  ? "phar_item_group"
                                  : "inv_item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Group" }}
                                />
                              ),

                              displayTemplate: row => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                    this.props.poitemgroup === undefined
                                      ? []
                                      : this.props.poitemgroup.filter(
                                        f =>
                                          f.hims_d_item_group_id ===
                                          row.phar_item_group
                                      ))
                                  : (display =
                                    this.props.poitemgroup === undefined
                                      ? []
                                      : this.props.poitemgroup.filter(
                                        f =>
                                          f.hims_d_inventory_item_group_id ===
                                          row.inv_item_group_id
                                      ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].group_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 150
                              }
                            },
                            {
                              fieldName: this.state.quotation_for === "PHR"
                                ? "pharmacy_uom_id"
                                : "inventory_uom_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "UOM" }}
                                />
                              ),
                              displayTemplate: row => {
                                let display;

                                this.state.quotation_for === "PHR"
                                  ? (display =
                                    this.props.poitemuom === undefined
                                      ? []
                                      : this.props.poitemuom.filter(
                                        f =>
                                          f.hims_d_pharmacy_uom_id ===
                                          row.pharmacy_uom_id
                                      ))
                                  : (display =
                                    this.props.poitemuom === undefined
                                      ? []
                                      : this.props.poitemuom.filter(
                                        f =>
                                          f.hims_d_inventory_uom_id ===
                                          row.inventory_uom_id
                                      ));

                                return (
                                  <span>
                                    {display !== undefined &&
                                      display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              },
                              others: {
                                minWidth: 100
                              }
                            },
                            {
                              fieldName: "quantity",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity" }}
                                />
                              )
                            },
                            {
                              fieldName: "unit_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Unit Price" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.dataExitst === true ? row.unit_price : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value: row.unit_price,
                                      className: "txt-fld",
                                      name: "unit_price",
                                      events: {
                                        onChange: onchhangeNumber.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "extended_price",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Extend Price" }}
                                />
                              )
                            },
                            {
                              fieldName: "discount_percentage",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount %" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.dataExitst === true ? row.discount_percentage : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value: row.discount_percentage,
                                      className: "txt-fld",
                                      name: "discount_percentage",
                                      events: {
                                        onChange: onchhangeNumber.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "discount_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Discount Amount" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.dataExitst === true ? row.discount_amount : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value: row.discount_amount,
                                      className: "txt-fld",
                                      name: "discount_amount",
                                      events: {
                                        onChange: onchhangeNumber.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "net_extended_cost",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Net Extended Cost" }}
                                />
                              )
                            },
                            {
                              fieldName: "tax_percentage",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax %" }}
                                />
                              ),
                              displayTemplate: row => {
                                return this.state.dataExitst === true ? row.tax_percentage : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: {
                                        allowNegative: false,
                                        thousandSeparator: ","
                                      },
                                      value: row.tax_percentage,
                                      className: "txt-fld",
                                      name: "tax_percentage",
                                      events: {
                                        onChange: onchhangeNumber.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        )
                                      }
                                    }}
                                  />
                                );
                              }
                            },
                            {
                              fieldName: "tax_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Tax Amount" }}
                                />
                              )
                            },
                            {
                              fieldName: "total_amount",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Total Amount" }}
                                />
                              )
                            }
                          ]}
                          keyId="hims_f_procurement_vendor_quotation_detail_id"
                          dataSource={{
                            data: this.state.quotation_detail
                          }}
                          isEditable={false}
                          byForceEvents={true}
                          paging={{ page: 0, rowsPerPage: 10 }}
                        />
                      </div>
                    </div>
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
    poitemlist: state.poitemlist,
    poitemcategory: state.poitemcategory,
    poitemgroup: state.poitemgroup,
    poitemuom: state.poitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
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
  )(ItemList)
);
