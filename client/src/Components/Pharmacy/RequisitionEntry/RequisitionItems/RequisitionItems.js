import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MyContext from "../../../../utils/MyContext";
import "./RequisitionItems.scss";
import "./../../../../styles/site.scss";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete,
} from "../../../Wrapper/algaehWrapper";

import {
  itemchangeText,
  numberchangeTexts,
  AddItems,
  deleteRequisitionDetail,
  updatePosDetail,
  onchangegridcol,
  UomchangeTexts,
  EditGrid,
} from "./RequisitionItemsEvents";
import { AlgaehActions } from "../../../../actions/algaehActions";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import spotlightSearch from "../../../../Search/spotlightSearch.json";

class RequisitionItems extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  UNSAFE_componentWillMount() {
    let InputOutput = this.props.RequisitionIOputs;
    this.setState({ ...this.state, ...InputOutput });
  }

  componentDidMount() {
    if (
      this.props.itemcategory === undefined ||
      this.props.itemcategory.length === 0
    ) {
      this.props.getItemCategory({
        uri: "/pharmacy/getItemCategory",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_CATEGORY_GET_DATA",
          mappingName: "itemcategory",
        },
      });
    }

    if (
      this.props.itemgroup === undefined ||
      this.props.itemgroup.length === 0
    ) {
      this.props.getItemGroup({
        uri: "/pharmacy/getItemGroup",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GROUOP_GET_DATA",
          mappingName: "itemgroup",
        },
      });
    }

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/pharmacy/getPharmacyUom",
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "itemuom",
        },
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(nextProps.RequisitionIOputs);
  }

  render() {
    // let month_name = moment(this.state.requistion_date).format("MMMM");
    return (
      <React.Fragment>
        <MyContext.Consumer>
          {(context) => (
            <div className="hptl-phase1-requisition-item-form">
              <div className="row">
                <div className="col-3">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="portlet-body">
                      <div className="row">
                        <AlgaehAutoSearch
                          div={{
                            className:
                              "col-12 form-group mandatory AlgaehAutoSearch",
                          }}
                          label={{ forceLabel: "Item Name", isImp: true }}
                          title="Search Items"
                          id="item_id_search"
                          template={(result) => {
                            return (
                              <section className="resultSecStyles">
                                <div className="row">
                                  <div className="col-12">
                                    <h4 className="title">
                                      {result.item_description}
                                    </h4>
                                    <small>{result.uom_description}</small>
                                  </div>
                                </div>
                              </section>
                            );
                          }}
                          name={"hims_d_item_master_id"}
                          columns={spotlightSearch.Items.Pharmacyitemmaster}
                          displayField="item_description"
                          value={this.state.item_description}
                          searchName={"PharmacyforMaterialRequesition"}
                          onClick={itemchangeText.bind(this, this, context)}
                          others={{
                            disabled: this.state.ItemDisable,
                          }}
                        />{" "}
                        {/* <AlagehAutoComplete
                          div={{ className: "col-12 form-group mandatory" }}
                          label={{ forceLabel: "Item Name", isImp: true }}
                          selector={{
                            name: "item_id",
                            className: "select-fld",
                            value: this.state.item_id,
                            dataSource: {
                              textField: "item_description",
                              valueField: "hims_d_item_master_id",
                              data: this.props.itemlist
                            },
                            others: {
                              disabled: this.state.ItemDisable
                            },
                            onChange: itemchangeText.bind(this, this, context)
                          }}
                          />{" "}
                           */}
                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "From Loc. In Hand",
                            }}
                          />
                          <h6>
                            {this.state.from_qtyhand
                              ? this.state.from_qtyhand
                              : "-----------"}
                          </h6>
                        </div>
                        <div className="col-6">
                          <AlgaehLabel
                            label={{
                              forceLabel: "To Loc. In Hand",
                            }}
                          />
                          <h6>
                            {this.state.to_qtyhand
                              ? this.state.to_qtyhand
                              : "-----------"}
                          </h6>
                        </div>
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "UOM" }}
                          selector={{
                            name: "item_uom",
                            className: "select-fld",
                            value: this.state.item_uom,
                            dataSource: {
                              textField: "uom_description",
                              valueField: "item_uom_id",
                              data: this.state.ItemUOM,
                            },
                            others: {
                              disabled: true,
                            },

                            onChange: UomchangeTexts.bind(this, this),
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Item Category" }}
                          selector={{
                            name: "item_category_id",
                            className: "select-fld",
                            value: this.state.item_category_id,
                            dataSource: {
                              textField: "category_desc",
                              valueField: "hims_d_item_category_id",
                              data: this.props.itemcategory,
                            },
                            others: {
                              disabled: true,
                            },
                            onChange: null,
                          }}
                        />
                        <AlagehAutoComplete
                          div={{ className: "col-6 form-group" }}
                          label={{ forceLabel: "Item Group" }}
                          selector={{
                            name: "item_group_id",
                            className: "select-fld",
                            value: this.state.item_group_id,
                            dataSource: {
                              textField: "group_description",
                              valueField: "hims_d_item_group_id",
                              data: this.props.itemgroup,
                            },
                            others: {
                              disabled: true,
                            },
                            onChange: null,
                          }}
                        />
                        {this.props.requisition_auth === true ? null : (
                          <div className="col">
                            <AlgaehLabel
                              label={{
                                forceLabel: "Last 3 Month Consumption",
                                //forceLabel: "Consumption Done In " + month_name
                              }}
                            />
                            <h6>
                              {this.state.transaction_qty
                                ? this.state.transaction_qty
                                : "-----------"}
                            </h6>
                          </div>
                        )}{" "}
                        <AlagehFormGroup
                          div={{ className: "col-6 form-group mandatory" }}
                          label={{
                            forceLabel: "Quantity Required",
                          }}
                          textBox={{
                            number: {
                              allowNegative: false,
                              thousandSeparator: ",",
                            },
                            className: "txt-fld",
                            name: "quantity_required",
                            value: this.state.quantity_required,
                            dontAllowKeys: ["-", "e", "."],
                            events: {
                              onChange: numberchangeTexts.bind(
                                this,
                                this,
                                context
                              ),
                            },
                            others: {
                              disabled: this.state.ItemDisable,
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 subFooter-btn">
                      <button
                        className="btn btn-primary"
                        onClick={AddItems.bind(this, this, context)}
                        disabled={this.state.addItemButton}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-9">
                  <div className="portlet portlet-bordered margin-bottom-15">
                    <div className="row">
                      <div className="col-lg-12">
                        <AlgaehDataGrid
                          id="REQ_details"
                          columns={[
                            {
                              fieldName: "action",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "action" }} />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    <i
                                      className="fas fa-trash-alt"
                                      aria-hidden="true"
                                      style={{
                                        pointerEvents:
                                          this.state.cannotDelete === true
                                            ? "none"
                                            : "",
                                        opacity:
                                          this.state.cannotDelete === true
                                            ? "0.1"
                                            : "",
                                      }}
                                      onClick={deleteRequisitionDetail.bind(
                                        this,
                                        this,
                                        context,
                                        row
                                      )}
                                    />
                                  </span>
                                );
                              },
                              others: {
                                show:
                                  this.state.requisition_auth === true
                                    ? false
                                    : true,
                              },
                            },
                            {
                              fieldName: "item_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Name" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.itemlist === undefined
                                    ? []
                                    : this.props.itemlist.filter(
                                        (f) =>
                                          f.hims_d_item_master_id ===
                                          row.item_id
                                      );

                                return (
                                  <span>
                                    {display !== undefined &&
                                    display.length !== 0
                                      ? display[0].item_description
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "item_category_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.itemcategory === undefined
                                    ? []
                                    : this.props.itemcategory.filter(
                                        (f) =>
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
                            },

                            {
                              fieldName: "item_group_id",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Item Category" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.itemgroup === undefined
                                    ? []
                                    : this.props.itemgroup.filter(
                                        (f) =>
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
                            },

                            {
                              fieldName: "item_uom",
                              label: (
                                <AlgaehLabel label={{ forceLabel: "UOM" }} />
                              ),
                              displayTemplate: (row) => {
                                let display =
                                  this.props.itemuom === undefined
                                    ? []
                                    : this.props.itemuom.filter(
                                        (f) =>
                                          f.hims_d_pharmacy_uom_id ===
                                          row.item_uom
                                      );

                                return (
                                  <span>
                                    {display !== null && display.length !== 0
                                      ? display[0].uom_description
                                      : ""}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "to_qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "To Qty in Hand" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.to_qtyhand === null
                                      ? 0
                                      : parseFloat(row.to_qtyhand)}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "from_qtyhand",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "From Qty in Hand" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.from_qtyhand === null
                                      ? 0
                                      : parseFloat(row.from_qtyhand)}
                                  </span>
                                );
                              },
                            },

                            {
                              fieldName: "quantity_required",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity Required" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.quantity_required === null
                                      ? 0
                                      : parseFloat(row.quantity_required)}
                                  </span>
                                );
                              },
                            },
                            {
                              fieldName: "quantity_authorized",
                              label: (
                                <AlgaehLabel
                                  label={{
                                    forceLabel: "Quantity Authorized",
                                  }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return this.state.authorizeEnable ? (
                                  parseFloat(row.quantity_authorized)
                                ) : (
                                  <AlagehFormGroup
                                    div={{}}
                                    textBox={{
                                      number: { allowNegative: false },
                                      value:
                                        row.quantity_authorized !== ""
                                          ? parseFloat(row.quantity_authorized)
                                          : "",
                                      className: "txt-fld",
                                      name: "quantity_authorized",
                                      dontAllowKeys: ["-", "e", "."],
                                      events: {
                                        onChange: onchangegridcol.bind(
                                          this,
                                          this,
                                          context,
                                          row
                                        ),
                                      },
                                    }}
                                  />
                                );
                              },
                            },
                            {
                              fieldName: "quantity_outstanding",
                              label: (
                                <AlgaehLabel
                                  label={{ forceLabel: "Quantity OutStanding" }}
                                />
                              ),
                              displayTemplate: (row) => {
                                return (
                                  <span>
                                    {row.quantity_outstanding === null
                                      ? 0
                                      : parseFloat(row.quantity_outstanding)}
                                  </span>
                                );
                              },
                            },
                          ]}
                          keyId="service_type_id"
                          dataSource={{
                            data: this.state.pharmacy_stock_detail,
                          }}
                          isEditable={false}
                          paging={{ page: 0, rowsPerPage: 20 }}
                          // datavalidate="id='PHRREQ_details'"
                          // byForceEvents={true}
                          events={{
                            onDelete: deleteRequisitionDetail.bind(
                              this,
                              this,
                              context
                            ),
                            onEdit: EditGrid.bind(this, this, context),
                            onCancel: EditGrid.bind(this, this, context),
                            onDone: updatePosDetail.bind(this, this, context),
                          }}
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
    itemlist: state.itemlist,
    itemdetaillist: state.itemdetaillist,
    itemcategory: state.itemcategory,
    itemuom: state.itemuom,
    itemgroup: state.itemgroup,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getSelectedItemDetais: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RequisitionItems)
);
