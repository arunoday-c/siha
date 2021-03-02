import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import noImage from "../../../assets/images/no-image-icon-6.webp";
import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehFormGroup,
  AlgaehDateHandler,
  AlgaehModalPopUp,
  AlagehAutoComplete,
} from "../../Wrapper/algaehWrapper";
import {
  changeEvent,
  dateFormater,
  updateStockDetils,
  datehandle,
  texthandle,
  printBarcode,
  openExchangePopup,
  onClickProcess,
} from "./InvStockEnquiryEvents";
import "./InvStockEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
// import GlobalVariables from "../../../utils/GlobalVariables.json";

class BatchWiseStock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      trans_type: null,
      quantity: 0,
      to_location_id: null,
      open_exchange: false,
      item_details: {},
    };
  }

  onClose = (e) => {
    this.setState(
      {
        trans_type: null,
        quantity: 0,
        to_location_id: null,
        open_exchange: false,
        item_details: {},
      },
      () => {
        this.props.onClose && this.props.onClose(e);
      }
    );
  };
  render() {
    const ware_house =
      this.props.inventorylocations === undefined
        ? []
        : this.props.inventorylocations.filter((f) => f.location_type === "WH");
    return (
      <React.Fragment>
        <AlgaehModalPopUp
          events={{
            onClose: this.onClose.bind(this),
          }}
          title="Batch Wise Item"
          openPopup={this.props.show}
          class={this.state.lang_sets}
        >
          {" "}
          <div className="col margin-top-15  margin-bottom-15">
            <div className="row">
              <div className="col-9">
                <AlgaehDataGrid
                  id="inv_initial_stock"
                  columns={[
                    {
                      fieldName: "action",
                      label: <AlgaehLabel label={{ forceLabel: "Print" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            <i
                              onClick={printBarcode.bind(this, this, row)}
                              className="fas fa-barcode"
                            />
                            {this.props.trans_required === true ? (
                              <i
                                className="fa fa-exchange-alt"
                                onClick={openExchangePopup.bind(
                                  this,
                                  this,
                                  row
                                )}
                              />
                            ) : null}
                          </span>
                        );
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "inventory_location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventorylocations === undefined
                            ? []
                            : this.props.inventorylocations.filter(
                                (f) =>
                                  f.hims_d_inventory_location_id ===
                                  row.inventory_location_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].location_description
                              : ""}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        let display =
                          this.props.inventorylocations === undefined
                            ? []
                            : this.props.inventorylocations.filter(
                                (f) =>
                                  f.hims_d_inventory_location_id ===
                                  row.inventory_location_id
                              );

                        return (
                          <span>
                            {display !== undefined && display.length !== 0
                              ? display[0].location_description
                              : ""}
                          </span>
                        );
                      },
                      others: { filterable: false },
                    },

                    {
                      fieldName: "item_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      others: { filterable: false },
                    },
                    {
                      fieldName: "stocking_uom_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Stocking UOM" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id ===
                                  row.stocking_uom_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                      others: { filterable: false },
                    },
                    {
                      fieldName: "sales_uom",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales UOM" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id === row.sales_uom
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },

                      editorTemplate: (row) => {
                        let display =
                          this.props.inventoryitemuom === undefined
                            ? []
                            : this.props.inventoryitemuom.filter(
                                (f) =>
                                  f.hims_d_inventory_uom_id === row.sales_uom
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                      others: { filterable: false },
                    },
                    // {
                    //   fieldName: "barcode",
                    //   label: <AlgaehLabel label={{ forceLabel: "Barcode" }} />,
                    //   disabled: true,
                    //   others: { filterable: false, minWidth: 150 }
                    // },
                    {
                      fieldName: "batchno",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                      ),
                      disabled: true,
                      others: { minWidth: 150 },
                    },
                    {
                      fieldName: "vendor_batchno",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Vendor Batch No." }}
                        />
                      ),
                      disabled: true,
                    },
                    {
                      fieldName: "expirydt",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return <span>{dateFormater(this, row.expirydt)}</span>;
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlgaehDateHandler
                            div={{ className: "" }}
                            textBox={{
                              className: "txt-fld hidden",
                              name: "expirydt",
                            }}
                            minDate={new Date()}
                            events={{
                              onChange: datehandle.bind(this, this, row),
                            }}
                            value={row.expirydt}
                          />
                        );
                      },
                      others: { filterable: false },
                    },
                    {
                      fieldName: "qtyhand",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: (row) => {
                        return parseFloat(row.qtyhand);
                      },
                      disabled: true,
                      others: { filterable: false },
                    },
                    {
                      fieldName: "avgcost",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Avg. Cost" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.avgcost, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                      disabled: true,
                      others: { filterable: false },
                    },
                    {
                      fieldName: "sale_price",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Sales Price" }} />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.sale_price, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                      editorTemplate: (row) => {
                        return (
                          <AlagehFormGroup
                            div={{}}
                            textBox={{
                              decimal: { allowNegative: false },
                              value: row.sale_price,
                              className: "txt-fld",
                              name: "sale_price",
                              events: {
                                onChange: texthandle.bind(this, this, row),
                              },
                            }}
                          />
                        );
                      },
                      others: { filterable: false },
                    },
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data:
                      this.props.batch_wise_item === undefined
                        ? []
                        : this.props.batch_wise_item,
                  }}
                  noDataText="No Stock available for selected Item in the selected Location"
                  isEditable={false}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 10 }}
                  events={{
                    //   onDelete: deleteServices.bind(this, this),
                    onEdit: (row) => {},
                    onDone: updateStockDetils.bind(this, this),
                  }}
                />
              </div>
              <div className="col-3">
                <img
                  className="itemStockBigImg"
                  src={
                    this.props.currentRow?.item_master_img_unique_id
                      ? `${window.location.protocol}//${
                          window.location.hostname
                        }${
                          window.location.port === "" ? "/docserver" : `:3006`
                        }/UPLOAD/InvItemMasterImages/${
                          this.props.currentRow.item_master_img_unique_id
                        }`
                      : noImage
                  }
                />
                <a
                  className="enlargeView"
                  href={
                    this.props.currentRow?.item_master_img_unique_id
                      ? `${window.location.protocol}//${
                          window.location.hostname
                        }${
                          window.location.port === "" ? "/docserver" : `:3006`
                        }/UPLOAD/InvItemMasterImages/${
                          this.props.currentRow.item_master_img_unique_id
                        }`
                      : noImage
                  }
                  target="_blank"
                >
                  Enlarge View
                </a>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
        <AlgaehModalPopUp
          title="Transation Option"
          openPopup={this.state.open_exchange}
          class={"MultiTransationModal"}
          onClose={() => {
            this.setState({
              open_exchange: false,
              trans_type: null,
              quantity: 0,
              to_location_id: null,
            });
          }}
        >
          <div className="col-12 popupInner margin-top-15">
            <div className="row">
              <div className="col-12">
                <AlgaehLabel
                  label={{
                    forceLabel: "Selected Item",
                  }}
                />
                <h6>
                  {this.state.item_details
                    ? this.state.item_details.item_description
                    : "--------"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Selected Location",
                  }}
                />
                <h6>
                  {this.props.location_description
                    ? this.props.location_description
                    : "--------"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Location Type",
                  }}
                />
                <h6>
                  {this.props.location_type
                    ? this.props.location_type
                    : "--------"}
                </h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "QTY In Hand",
                  }}
                />
                <h6>
                  {this.state.item_details
                    ? parseFloat(this.state.item_details.qtyhand)
                    : "--------"}
                </h6>
              </div>
            </div>
            <div className="row">
              <AlagehAutoComplete
                div={{ className: "col-4 form-group mandatory" }}
                label={{ forceLabel: "Transation Type", isImp: true }}
                selector={{
                  name: "trans_type",
                  className: "select-fld",
                  value: this.state.trans_type,
                  dataSource: {
                    textField: "name",
                    valueField: "value",
                    data: [
                      {
                        name: "Consume",
                        value: "C",
                      },
                      {
                        name: "Transfer",
                        value: "T",
                      },
                      {
                        name: "Purchase Request",
                        value: "PR",
                      },
                    ],
                  },

                  onChange: changeEvent.bind(this, this),
                  onClear: () => {
                    this.setState({
                      trans_type: null,
                    });
                  },
                  autoComplete: "off",
                }}
              />
              {this.state.trans_type === "PR" ? (
                <AlagehAutoComplete
                  div={{ className: "col-4 form-group mandatory" }}
                  label={{ forceLabel: "Request From", isImp: true }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data:
                        this.state.trans_type === "T"
                          ? this.props.inventorylocations
                          : ware_house,
                    },

                    onChange: changeEvent.bind(this, this),
                    onClear: () => {
                      this.setState({
                        to_location_id: null,
                      });
                    },
                    autoComplete: "off",
                  }}
                />
              ) : null}

              {this.state.trans_type === "T" ? (
                <AlagehAutoComplete
                  div={{ className: "col-3 form-group mandatory" }}
                  label={{ forceLabel: "Transfer To", isImp: true }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data:
                        this.state.trans_type === "T"
                          ? this.props.inventorylocations
                          : ware_house,
                    },

                    onChange: changeEvent.bind(this, this),
                    onClear: () => {
                      this.setState({
                        to_location_id: null,
                      });
                    },
                    autoComplete: "off",
                  }}
                />
              ) : null}

              <AlagehFormGroup
                div={{ className: "col-2 form-group mandatory" }}
                label={{
                  forceLabel: "Quantity",
                  isImp: true,
                }}
                textBox={{
                  number: {
                    allowNegative: false,
                    thousandSeparator: ",",
                  },
                  className: "txt-fld",
                  name: "quantity",
                  value: this.state.quantity,
                  events: {
                    onChange: changeEvent.bind(this, this),
                  },
                }}
              />
            </div>
          </div>

          <div className=" popupFooter">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onClickProcess.bind(this, this)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={(e) => {
                      this.setState({
                        open_exchange: false,
                        trans_type: null,
                        quantity: 0,
                        to_location_id: null,
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </AlgaehModalPopUp>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryitemlist: state.inventoryitemlist,
    inventorylocations: state.inventorylocations,
    inventoryitemuom: state.inventoryitemuom,
    git_locations: state.git_locations,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getGITLocation: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BatchWiseStock)
);
