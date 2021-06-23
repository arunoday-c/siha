import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler,
  AlagehFormGroup,
  // AlgaehAutoSearch,
} from "../../Wrapper/algaehWrapper";
import AlgaehAutoSearch from "../../Wrapper/autoSearch";
import spotlightSearch from "../../../Search/spotlightSearch.json";
// import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  dateFormater,
  datehandle,
  ProcessItemMoment,
  dateValidate,
  DrillDownScree,
  itemchangeText,
  generateReports,
} from "./ItemMomentEnquiryEvents";
import "./ItemMomentEnquiry.scss";
import "../../../styles/site.scss";
import { AlgaehActions } from "../../../actions/algaehActions";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import { GetAmountFormart } from "../../../utils/GlobalFunctions";
import {
  // AlgaehTable,
  Tooltip,
} from "algaeh-react-components";

class ItemMomentEnquiry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemmoment: [],
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
    // (async () => {
    //   const records = await persistStageOnGet();

    //   if (records) {
    //     this.setState({ ...records });
    //     persistStorageOnRemove();
    // }
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      data: { item_status: "A" },
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist",
      },
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations",
      },
    });

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
    // })();
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {/* <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Item Movement Enquiry", align: "ltr" }}
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
          //         label={{
          //           forceLabel: "Item Movement Enquiry",
          //           align: "ltr"
          //         }}
          //       />
          //     )
          //   }
          // ]}
          /> */}

          <div className="hptl-phase1-item-moment-enquiry-form">
            <div className="row inner-top-search" style={{ paddingBottom: 10 }}>
              <div className="col-lg-12">
                <div className="row">
                  <AlgaehDateHandler
                    div={{ className: "col" }}
                    label={{ fieldName: "from_date", isImp: true }}
                    textBox={{ className: "txt-fld", name: "from_date" }}
                    events={{
                      onChange: datehandle.bind(this, this),
                      onBlur: dateValidate.bind(this, this),
                    }}
                    value={this.state.from_date}
                  />
                  <AlgaehDateHandler
                    div={{ className: "col" }}
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
                    div={{
                      className: "col-12 form-group mandatory AlgaehAutoSearch",
                    }}
                    label={{ forceLabel: "Item Name", isImp: false }}
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
                    name={"item_code_id"}
                    columns={spotlightSearch.Items.Pharmacyitemmaster}
                    displayField="item_description"
                    value={this.state.item_description}
                    searchName={"PharmacyforMaterialRequesition"}
                    onClick={itemchangeText.bind(this, this)}
                    onClear={() => {
                      this.setState({
                        item_code_id: null,
                        item_description: "",
                      });
                    }}
                    // others={{
                    //   disabled: this.state.ItemDisable,
                    // }}
                  />
                  {/* <AlagehAutoComplete
                    div={{ className: "col" }}
                    label={{ forceLabel: "Item Name" }}
                    selector={{
                      name: "item_code_id",
                      className: "select-fld",
                      value: this.state.item_code_id,
                      dataSource: {
                        textField: "item_description",
                        valueField: "hims_d_item_master_id",
                        data: this.props.itemlist,
                      },
                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          item_code_id: null,
                        });
                      },
                    }}
                  /> */}
                  <AlagehFormGroup
                    div={{ className: "col" }}
                    label={{
                      forceLabel: "Vendor Batch No.",
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
                        valueField: "hims_d_pharmacy_location_id",
                        data: this.props.locations,
                      },

                      onChange: changeTexts.bind(this, this),
                      onClear: () => {
                        this.setState({
                          location_id: null,
                        });
                      },
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
              {/* <div className="portlet-title">
            <div className="caption">
              <h3 className="caption-subject">Investigation Lists</h3>
            </div>
            <div className="actions">
            </div>
          </div> */}
              <div className="portlet-body" id="initialStock_Cntr">
                {/* <AlgaehTable
                  id="initial_stock"
                  columns={[
                    {
                      fieldName: "select_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Select" }} />
                      ),
                      displayTemplate: (row) => (
                        <>

                          <Tooltip title="DrillDown">
                            <i
                              className="fa fa-exchange-alt"
                              onClick={(e) => {
                                e.preventDefault();
                                // this.DrillDownScree(row, this);
                              }}
                            ></i>
                          </Tooltip>

                        </>
                      ),

                      others: {
                        width: 170,
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
                                                : "";
                      },
                      others: {
                        filterable: false,
                      }
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
                      }
                    },
                    {
                      fieldName: "from_location_id",
                      label: <AlgaehLabel label={{ forceLabel: "Location" }} />,
                      displayTemplate: (row) => {
                        let display =
                          this.props.locations === undefined
                            ? []
                            : this.props.locations.filter(
                              (f) =>
                                f.hims_d_pharmacy_location_id ===
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
                      }
                    },
                    {
                      fieldName: "item_code_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.itemlist === undefined
                            ? []
                            : this.props.itemlist.filter(
                              (f) =>
                                f.hims_d_item_master_id === row.item_code_id
                            );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].item_description
                              : ""}
                            {display !== null && display.length !== 0 ? (
                              <i
                                className={
                                  row.operation === "+"
                                    ? "fas fa-arrow-up green"
                                    : row.operation === "-"
                                      ? "fas fa-arrow-down red"
                                      : ""
                                }
                              />
                            ) : (
                                ""
                              )}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "transaction_uom",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Unit of Measure" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                              (f) =>
                                f.hims_d_pharmacy_uom_id ===
                                row.transaction_uom
                            );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
                      others: {
                        filterable: false,
                      }
                    },
                    {
                      fieldName: "vendor_batchno",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Vendor Batch No." }} />
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
                      }
                    },
                    {
                      fieldName: "transaction_qty",
                      label: <AlgaehLabel label={{ forceLabel: "Quantity" }} />,
                      displayTemplate: (row) => {
                        return parseFloat(row.transaction_qty);
                      },
                      others: {
                        filterable: false,
                      }
                    },
                    {
                      fieldName: "qtyhand",
                      label: <AlgaehLabel label={{ forceLabel: "After Transation Quantity" }} />,
                      displayTemplate: (row) => {
                        return parseFloat(row.qtyhand);
                      },
                      others: {
                        filterable: false,
                      }
                    }
                    // {
                    //   fieldName: "average_cost",
                    //   label: (
                    //     <AlgaehLabel label={{ forceLabel: "Average Cost" }} />
                    //   ),
                    //   displayTemplate: row => {
                    //     return (
                    //       <span>
                    //         {getAmountFormart(row.average_cost, {
                    //           appendSymbol: false
                    //         })}
                    //       </span>
                    //     );
                    //   }
                    // }
                  ]}
                  data={this.state.itemmoment}
                  pagination={true}
                  isFilterable={true}
                  persistence={this.state.persistence}
                /> */}
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
                          this.props.locations === undefined
                            ? []
                            : this.props.locations.filter(
                                (f) =>
                                  f.hims_d_pharmacy_location_id ===
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
                      fieldName: "item_code_id",
                      label: (
                        <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.itemlist === undefined
                            ? []
                            : this.props.itemlist.filter(
                                (f) =>
                                  f.hims_d_item_master_id === row.item_code_id
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].item_description
                              : ""}
                            {/* {display !== null && display.length !== 0 ? (
                             
                            ) : (
                              ""
                            )} */}
                          </span>
                        );
                      },
                    },
                    {
                      fieldName: "transaction_uom",
                      label: (
                        <AlgaehLabel
                          label={{ forceLabel: "Unit of Measure" }}
                        />
                      ),
                      displayTemplate: (row) => {
                        let display =
                          this.props.itemuom === undefined
                            ? []
                            : this.props.itemuom.filter(
                                (f) =>
                                  f.hims_d_pharmacy_uom_id ===
                                  row.transaction_uom
                              );

                        return (
                          <span>
                            {display !== null && display.length !== 0
                              ? display[0].uom_description
                              : ""}
                          </span>
                        );
                      },
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
                      label: <AlgaehLabel label={{ forceLabel: "Cost" }} />,
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
                        return parseFloat(row.qtyhand);
                      },
                      others: {
                        filterable: false,
                      },
                    },
                  ]}
                  keyId="item_id"
                  filter={true}
                  dataSource={{
                    data: this.state.itemmoment,
                  }}
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
    itemlist: state.itemlist,
    locations: state.locations,
    itemuom: state.itemuom,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemUOM: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ItemMomentEnquiry)
);
