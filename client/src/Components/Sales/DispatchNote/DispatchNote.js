import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./DispatchNote.scss";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import MyContext from "../../../utils/MyContext";
import {
  AlgaehLabel,
  AlagehFormGroup,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import Options from "../../../Options.json";
import moment from "moment";
import {
  texthandle,
  SalesOrderSearch,
  ClearData,
  SaveDispatchNote,
  getCtrlCode,
  generateDispatchReport
} from "./DispatchNoteEvents";
import { AlgaehActions } from "../../../actions/algaehActions";
import {
  AlgaehOpenContainer,
  getAmountFormart
} from "../../../utils/GlobalFunctions";
import DispatchNoteItems from "./DispatchNoteItems/DispatchNoteItems";

class DispatchNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hims_f_dispatch_note_id: null,
      dispatch_note_number: null,
      sales_order_id: null,
      sales_order_number: null,
      dispatch_note_date: new Date(),
      customer_id: null,
      sub_total: null,
      discount_amount: null,
      net_total: null,
      total_tax: null,
      net_payable: null,
      narration: null,
      project_id: null,
      customer_po_no: null,
      tax_percentage: null,
      location_id: null,
      location_type: null,

      stock_detail: [],
      decimal_place: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).decimal_places,
      saveEnable: true,
      dataExists: false,
      hospital_id: JSON.parse(
        AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
      ).hims_d_hospital_id,
      ReqData: true,
      customer_name: null,
      hospital_name: null,
      project_name: null,
      selectedData: false,
      cannotEdit: false,

      item_details: [],
      batch_detail_view: false,
      dispatched_quantity: 0,
      inventory_stock_detail: []
    };
    this.baseState = this.state;
  }

  componentDidMount() {
    this.props.getItemCategory({
      uri: "/inventory/getItemCategory",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "inventoryitemcategory"
      }
    });

    this.props.getItemGroup({
      uri: "/inventory/getItemGroup",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_GROUOP_GET_DATA",
        mappingName: "inventoryitemgroup"
      }
    });

    this.props.getItems({
      uri: "/inventory/getItemMaster",
      module: "inventory",
      data: { item_status: "A" },
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });
    this.props.getItemUOM({
      uri: "/inventory/getInventoryUom",
      module: "inventory",
      method: "GET",
      redux: {
        type: "ITEM_UOM_GET_DATA",
        mappingName: "inventoryitemuom"
      }
    });

    this.props.getLocation({
      uri: "/inventory/getInventoryLocation",
      module: "inventory",
      method: "GET",
      data: {
        location_status: "A"
      },
      redux: {
        type: "LOCATIONS_GET_DATA",
        mappingName: "locations"
      }
    });
  }

  render() {
    const class_finder =
      this.state.dataFinder === true
        ? " disableFinder"
        : this.state.ReqData === true
          ? " disableFinder"
          : "";
    return (
      <div>
        <BreadCrumb
          title={
            <AlgaehLabel
              label={{ forceLabel: "Dispatch Note", align: "ltr" }}
            />
          }
          breadStyle={this.props.breadStyle}
          pageNavPath={[
            {
              pageName: (
                <AlgaehLabel
                  label={{
                    forceLabel: "Home",
                    align: "ltr"
                  }}
                />
              )
            },
            {
              pageName: (
                <AlgaehLabel
                  label={{ forceLabel: "Dispatch Note", align: "ltr" }}
                />
              )
            }
          ]}
          soptlightSearch={{
            label: (
              <AlgaehLabel
                label={{ forceLabel: "DN Number", returnText: true }}
              />
            ),
            value: this.state.dispatch_note_number,
            selectValue: "dispatch_note_number",
            events: {
              onChange: getCtrlCode.bind(this, this)
            },
            jsonFile: {
              fileName: "spotlightSearch",
              fieldName: "Sales.DispatchNote"
            },
            searchName: "DispatchNote"
          }}
          userArea={
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "DN Date"
                  }}
                />
                <h6>
                  {this.state.dispatch_note_date
                    ? moment(this.state.dispatch_note_date).format(
                      Options.dateFormat
                    )
                    : Options.dateFormat}
                </h6>
              </div>
            </div>
          }
          printArea={
            this.state.dispatch_note_number !== null
              ? {
                menuitems: [
                  {
                    label: "Dispatch Report",
                    events: {
                      onClick: () => {
                        generateDispatchReport(this.state);
                      }
                    }
                  }
                ]
              }
              : ""
          }
          selectedLang={this.state.selectedLang}
        />
        <div className="hims-purchase-order-entry">
          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-12">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-2" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.locations
                    },
                    others: {
                      disabled:
                        this.state.dataExists === true
                          ? true
                          : this.state.selectedData
                    },
                    onChange: texthandle.bind(this, this),
                    onClear: () => {
                      this.setState({
                        location_id: null,
                        ReqData: true
                      });
                    }
                  }}
                />

                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Location Type"
                    }}
                  />
                  <h6>
                    {this.state.location_type
                      ? this.state.location_type === "WH"
                        ? "Warehouse"
                        : this.state.location_type === "MS"
                          ? "Main Store"
                          : "Sub Store"
                      : "Location Type"}
                  </h6>
                </div>

                <div className={"col-2 globalSearchCntr" + class_finder}>
                  <AlgaehLabel label={{ forceLabel: "Search Order No." }} />
                  <h6 onClick={SalesOrderSearch.bind(this, this)}>
                    {this.state.sales_order_number
                      ? this.state.sales_order_number
                      : "Order No."}
                    <i className="fas fa-search fa-lg"></i>
                  </h6>
                </div>

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Customer" }} />
                  <h6>
                    {this.state.customer_name
                      ? this.state.customer_name
                      : "------"}
                  </h6>
                </div>

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Branch" }} />
                  <h6>
                    {this.state.hospital_name
                      ? this.state.hospital_name
                      : "------"}
                  </h6>
                </div>

                <div className="col">
                  <AlgaehLabel label={{ forceLabel: "Project" }} />
                  <h6>
                    {this.state.project_name
                      ? this.state.project_name
                      : "------"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <DispatchNoteItems DELNOTEIOputs={this.state} />
            </MyContext.Provider>
          </div>
        </div>

        <div className="row">
          <div className="col-12" style={{ textAlign: "right" }}>
            <div className="row">
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Sub Total"
                  }}
                />
                <h6>{getAmountFormart(this.state.sub_total)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Discount Amount"
                  }}
                />
                <h6>{getAmountFormart(this.state.discount_amount)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Total"
                  }}
                />
                <h6>{getAmountFormart(this.state.net_total)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Total Tax"
                  }}
                />
                <h6>{getAmountFormart(this.state.total_tax)}</h6>
              </div>
              <div className="col">
                <AlgaehLabel
                  label={{
                    forceLabel: "Net Total"
                  }}
                />
                <h6>{getAmountFormart(this.state.net_payable)}</h6>
              </div>
              <AlagehFormGroup
                div={{ className: "col-5 textAreaLeft" }}
                label={{
                  forceLabel: "Narration",
                  isImp: false
                }}
                textBox={{
                  className: "txt-fld",
                  name: "narration",
                  value: this.state.narration,
                  events: {
                    onChange: texthandle.bind(this, this)
                  },
                  others: {
                    disabled: this.state.dataExists
                    // multiline: true,
                    // rows: "4"
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="hptl-phase1-footer">
          <div className="row">
            <div className="col-lg-12">
              <button
                type="button"
                className="btn btn-primary"
                onClick={SaveDispatchNote.bind(this, this)}
                disabled={this.state.saveEnable}
              >
                <AlgaehLabel
                  label={{
                    forceLabel: "Save",
                    returnText: true
                  }}
                />
              </button>

              <button
                type="button"
                className="btn btn-default"
                disabled={this.state.ClearDisable}
                onClick={ClearData.bind(this, this)}
              >
                <AlgaehLabel
                  label={{ forceLabel: "Clear", returnText: true }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    itemlist: state.itemlist,
    locations: state.locations,
    inventoryitemuom: state.inventoryitemuom,
    inventoryitemcategory: state.inventoryitemcategory,
    inventoryitemgroup: state.inventoryitemgroup
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DispatchNote)
);
