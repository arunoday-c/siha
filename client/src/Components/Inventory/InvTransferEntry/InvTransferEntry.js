import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete
} from "../../Wrapper/algaehWrapper";
import moment from "moment";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  getCtrlCode,
  ClearData,
  SaveTransferEntry,
  PostTransferEntry,
  RequisitionSearch,
  LocationchangeTexts
} from "./InvTransferEntryEvents";
import "./InvTransferEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import Options from "../../../Options.json";
import TransferEntryItems from "./TransferEntryItems/TransferEntryItems";
import MyContext from "../../../utils/MyContext";
import TransferIOputs from "../../../Models/InventoryTransferEntry";
import AlgaehReport from "../../Wrapper/printReports";
import _ from "lodash";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

class InvTransferEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      from_location_id: null
    };
  }

  componentWillMount() {
    let IOputs = TransferIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    const hospital = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    );
    if (
      this.props.inventoryitemlist === undefined ||
      this.props.inventoryitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist"
        }
      });
    }

    if (
      this.props.inventorylocations === undefined ||
      this.props.inventorylocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        module: "inventory",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "inventorylocations"
        }
      });
    }

    if (this.props.itemuom === undefined || this.props.itemuom.length === 0) {
      this.props.getItemUOM({
        uri: "/inventory/getInventoryUom",
        module: "inventory",
        method: "GET",
        redux: {
          type: "ITEM_UOM_GET_DATA",
          mappingName: "inventoryitemuom"
        }
      });
    }

    if (
      this.props.invuserwiselocations === undefined ||
      this.props.invuserwiselocations.length === 0
    ) {
      this.props.getUserLocationPermission({
        uri: "/inventoryGlobal/getUserLocationPermission",
        module: "inventory",
        method: "GET",
        data: {
          location_status: "A",
          hospital_id: hospital.hims_d_hospital_id
        },
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "invuserwiselocations"
        }
      });
    }
  }

  render() {
    let display =
      this.props.inventorylocations === undefined
        ? []
        : this.props.inventorylocations.filter(
            f => f.hims_d_inventory_location_id === this.state.to_location_id
          );

    const from_location_name =
      this.state.from_location_id !== null
        ? _.filter(this.props.invuserwiselocations, f => {
            return (
              f.hims_d_inventory_location_id === this.state.from_location_id
            );
          })
        : [];

    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Transfer Entry", align: "ltr" }}
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
                    label={{ forceLabel: "Transfer Entry", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Transfer Number", returnText: true }}
                />
              ),
              value: this.state.transfer_number,
              selectValue: "transfer_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "TransferEntry.TransEntry"
              },
              searchName: "InvTransferEntry"
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Transfer Date"
                    }}
                  />
                  <h6>
                    {this.state.transfer_date
                      ? moment(this.state.transfer_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>
              </div>
            }
            printArea={
              this.state.transfer_number !== null
                ? {
                    menuitems: [
                      {
                        label: "Print Report",
                        events: {
                          onClick: () => {
                            AlgaehReport({
                              report: {
                                fileName: "Inventory/TransferEntry"
                              },
                              data: {
                                transfer_number: this.state.transfer_number,
                                transfer_date: moment(
                                  this.state.transfer_date
                                ).format(Options.datetimeFormat),
                                requisition_number: this.state
                                  .material_requisition_number,
                                from_location:
                                  from_location_name.length > 0
                                    ? from_location_name[0].location_description
                                    : "",
                                to_location:
                                  display.length > 0
                                    ? display[0].location_description
                                    : "",
                                inventoryitemuom: this.props.inventoryitemuom,
                                inventory_stock_detail: this.state
                                  .inventory_stock_detail
                              }
                            });
                          }
                        }
                      }
                    ]
                  }
                : ""
            }
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col-lg-8">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "From Location" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.invuserwiselocations
                    },
                    onChange: LocationchangeTexts.bind(this, this, "From")
                  }}
                />

                <div className="col-lg-3">
                  <AlgaehLabel
                    label={{
                      forceLabel: "From Location Type"
                    }}
                  />
                  <h6>
                    {this.state.from_location_type
                      ? this.state.from_location_type === "WH"
                        ? "Warehouse"
                        : this.state.from_location_type === "MS"
                        ? "Main Store"
                        : "Sub Store"
                      : "From Location Type"}
                  </h6>
                </div>

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Requisition Number"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "material_requisition_number",
                    value: this.state.material_requisition_number,
                    events: {
                      onChange: null
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <div className="col-lg-2  print_actions">
                  <span
                    className="fas fa-search"
                    style={{ marginTop: 26, fontSize: 20 }}
                    onClick={RequisitionSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "To Location"
                    }}
                  />

                  <h6>
                    {this.state.to_location_id
                      ? display !== null && display.length !== 0
                        ? display[0].location_description
                        : ""
                      : "To Location "}
                  </h6>
                </div>

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "To Location Type"
                    }}
                  />
                  <h6>
                    {this.state.to_location_type
                      ? this.state.to_location_type === "WH"
                        ? "Warehouse"
                        : this.state.to_location_type === "MS"
                        ? "Main Store"
                        : "Sub Store"
                      : "To Location Type"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="hptl-phase1-inv-transfer-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <TransferEntryItems TransferIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={SaveTransferEntry.bind(this, this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={ClearData.bind(this, this)}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>

                  {/*<button
                    type="button"
                    className="btn btn-other"
                    onClick={PostTransferEntry.bind(this, this)}
                    disabled={this.state.postEnable}
                  >
                    <AlgaehLabel
                      label={{
                        forceLabel: "Post",
                        returnText: true
                      }}
                    />
                  </button>*/}
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
    inventoryitemlist: state.inventoryitemlist,
    inventorylocations: state.inventorylocations,
    invuserwiselocations: state.invuserwiselocations,
    inventoryitemuom: state.inventoryitemuom
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getTransferEntry: AlgaehActions,
      getUserLocationPermission: AlgaehActions,
      getItemUOM: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvTransferEntry)
);
