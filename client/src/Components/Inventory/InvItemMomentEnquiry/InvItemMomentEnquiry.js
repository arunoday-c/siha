import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
} from "../../Wrapper/algaehWrapper";

// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment,
  dateValidate,
  DrillDownScree,
  generateReports,
  itemchangeText,
} from "./InvItemMomentEnquiryEvents";
import "./InvItemMomentEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import {
  // AlgaehTable,
  Tooltip,
} from "algaeh-react-components";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";

class InvItemMomentEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Inventory_Itemmoment: [],
      location_id: null,
      item_code_id: null,
      from_date: null,
      to_date: null,
      vendor_batchno: null,
      transaction_type: null,
      item_description: "",
    };
  }

  componentDidMount() {
    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "inventorylocations",
      },
    });

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom",
        },
      });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {/* <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
          // pageNavPath={[
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{
          //           forceLabel: "Home",
          //           align: "ltr"
          //         }}
          //       />
          //     )
          //   },
          //   {
          //     pageName: (
          //       <AlgaehLabel
          //         label={{ forceLabel: "Item Moment Enquiry", align: "ltr" }}
          //       />
          //     )
          //   }
          // ]}
          /> */}

          <div
            className="hptl-phase1-item-moment-enquiry-form"
            data-validate="itemMoment"
          >
            <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
              <div className="col-lg-12">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col mandatory" }}
                    label={{ fieldName: "from_date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "from_date" }}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this),
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col mandatory" }}
                    label={{ fieldName: "to_date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "to_date" }}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this),
                    }}
                    maxDate={new Date()}
                    value={this.state.to_date}
                  />

                  <AlgaehAutoSearch
                    div={{ className: "col-3 AlgaehAutoSearch" }}
                    label={{ forceLabel: "Item Name" }}
                    title="Search Items"
                    id="item_id_search"
                    template={(result) => {
                      return (
                        <section className="resultSecStyles">
                          <div className="row">
                            <div className="col-8">
                              <h4 className="title">
                                {result.item_description}
                              </h4>
                              <small>{result.item_code}</small>
                            </div>
                          </div>
                        </section>
                      );
                    }}
                    name="item_code_id"
                    columns={spotlightSearch.Items.Invitemmaster}
                    displayField="item_description"
                    value={this.state.item_description}
                    searchName="invopeningstock"
                    onClick={itemchangeText.bind(this, this)}
                    onClear={() => {
                      this.setState({
                        item_code_id: null,
                        item_description: "",
                      });
                    }}
                    ref={(attReg) => {
                      this.attReg = attReg;
                    }}
                  />

                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Vendor BatchNo.",
                    }}
                    textBox={{
                      className: "txt-fld",
                      name: "vendor_batchno",
                      value: this.state.vendor_batchno,
                      events: {
                        onChange: changeTexts.bind(this, this),
                      },
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Location" }}
                    selector={{
                      name: "location_id",
                      className: "select-fld",
                      value: this.state.location_id,
                      dataSource: {
                        textField: "location_description",
                        valueField: "hims_d_inventory_location_id",
                        data: this.props.inventorylocations,
                      },
                      onClear: () => {
                        this.setState({
                          location_id: null,
                        });
                      },
                      onChange: changeTexts.bind(this, this),
                    }}
                  />

                  <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Transaction Type" }}
                    selector={{
                      name: "transaction_type",
                      className: "select-fld",
                      value: this.state.transaction_type,
                      dataSource: {
                        textField: "name",
                        valueField: "value",
                        data: GlobalVariables.FORMAT_TRANSACTION_TYPE,
                      },
                      onClear: () => {
                        this.setState({
                          transaction_type: null,
                        });
                      },
                      onChange: changeTexts.bind(this, this),
                    }}
                  />

                  <div className="col" style={{ paddingTop: "3vh" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={ProcessItemMoment.bind(this, this)}
                    >
                      Process
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="portlet portlet-bordered margin-bottom-15">
              <div className="portlet-body" id="initialStock_Cntr">
                <AlgaehDataGrid
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "select_id",
                      label: <AlgaehLabel label={{ forceLabel: "Select" }} />,
                      displayTemplate: (row) => (
                        <>
                          <Tooltip title="DrillDown">
                            <i
                              className="fa fa-exchange-alt"
                              onClick={(e) => {
                                e.preventDefault();
                                DrillDownScree(row, this);
                              }}
                            ></i>
                          </Tooltip>
                        </>
                      ),

                      others: {
                        width: 70,
                        maxWidth: 200,
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "transaction_type",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Type" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return row.transaction_type === "MR"
                          ? "Material Requisition"
                          : row.transaction_type === "ST"
                          ? "Stock Transfer"
                          : row.transaction_type === "POS"
                          ? "Point of Sale"
                          : row.transaction_type === "SRT"
                          ? "Sales Return"
                          : row.transaction_type === "INT"
                          ? "Opening Stock"
                          : row.transaction_type === "CS"
                          ? "Consumption"
                          : row.transaction_type === "CSN"
                          ? "Consumption Cancel"
                          : row.transaction_type === "REC"
                          ? "Receipt"
                          : row.transaction_type === "PO"
                          ? "Purchase Order"
                          : row.transaction_type === "DNA"
                          ? "Delivery Note"
                          : row.transaction_type === "ACK"
                          ? "Transfer Acknowledge"
                          : row.transaction_type === "PR"
                          ? "Purchase Return"
                          : row.transaction_type === "AD"
                          ? "Stock Adjustment"
                          : row.transaction_type === "SDN"
                          ? "Sales Dispatch Note"
                          : "";
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "transaction_date",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction Date" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>{dateFormater(row.transaction_date)}</span>
                        );
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "from_location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: (row) => {
                        let display =
                          this.props.inventorylocations === undefined
                            ? []
                            : this.props.inventorylocations.filter(
                                (f) =>
                                  f.hims_d_inventory_location_id ===
                                  row.from_location_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].location_description
                              : ""}
                          </span>
                        );
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "item_description",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                    },
                    {
                      fieldName: "trans_uom",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Transaction UOM" }}
                        />
                      ),
                      // displayTemplate: (row) => {
                      //   let display =
                      //     this.props.inventoryitemuom === undefined
                      //       ? []
                      //       : this.props.inventoryitemuom.filter(
                      //           (f) =>
                      //             f.hims_d_inventory_uom_id ===
                      //             row.transaction_uom
                      //         );

                      //   return (
                      //     <span>
                      //       {display !== null && display.length !== 0
                      //         ? display[0].uom_description
                      //         : ""}
                      //     </span>
                      //   );
                      // },
                      others: {
                        filterable: false,
                      },
                    },

                    {
                      fieldName: "vendor_batchno",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Vendor Batch No." }}
                        />
                      ),
                    },
                    {
                      fieldName: "batchno",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Batch No." }} />
                      ),
                    },
                    {
                      fieldName: "expiry_date",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Expiry Date" }} />
                      ),
                      displayTemplate: (row) => {
                        return <span>{dateFormater(row.expiry_date)}</span>;
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "transaction_qty",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {parseFloat(row.transaction_qty)}
                            <i
                              className={
                                row.operation === "+"
                                  ? "fas fa-arrow-up green"
                                  : row.operation === "-"
                                  ? "fas fa-arrow-down red"
                                  : ""
                              }
                            />
                          </span>
                        );
                      },
                      others: {
                        filterable: false,
                      },
                    },
                    {
                      fieldName: "average_cost",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Cost As Stocking UOM" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          <span>
                            {GetAmountFormart(row.average_cost, {
                              appendSymbol: false,
                            })}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "qtyhand",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "After Transation Quantity" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        return (
                          parseFloat(row.qtyhand) + "(" + row.stock_uom + ")"
                        );
                      },
                      others: {
                        filterable: false,
                      },
                    },
                  ]}
                  keyId="item_id"
                  dataSource={{
                    data: this.state.Inventory_Itemmoment,
                  }}
                  filter={true}
                  paging={{ page: 0, rowsPerPage: 20 }}
                />
              </div>
            </div>
          </div>
          <div className="hptl-phase1-footer">
            <div className="row">
              <div className="col-lg-12">
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    this.setState({ exportAsPdf: "Y" }, () => {
                      generateReports(this, this);
                    });
                  }}
                >
                  Export as PDF
                </button>
                <button
                  type="button"
                  className="btn btn-default"
                  onClick={() => {
                    this.setState({ exportAsPdf: "N" }, () => {
                      generateReports(this, this);
                    });
                  }}
                >
                  Export as Excel
                </button>
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
    inventorylocations: state.inventorylocations,
    insuranceitemmoment: state.insuranceitemmoment,
    inventoryitemuom: state.inventoryitemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getLocation: AlgaehActions,
      getItemMoment: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InvItemMomentEnquiry)
);
