import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import moment from "moment";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  getCtrlCode,
  ClearData,
  SaveRequisitionEntry,
  AuthorizeRequisitionEntry,
  LocationchangeTexts
} from "./InvRequisitionEntryEvents";
import "./InvRequisitionEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import GlobalVariables from "../../../utils/GlobalVariables.json";
import RequisitionItems from "./RequisitionItems/RequisitionItems";
import MyContext from "../../../utils/MyContext";
import RequisitionIOputs from "../../../Models/InventoryRequisition";
import Options from "../../../Options.json";

class InvRequisitionEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    let IOputs = RequisitionIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    if (
      this.props.inventoryitemlist === undefined ||
      this.props.inventoryitemlist.length === 0
    ) {
      this.props.getItems({
        uri: "/inventory/getItemMaster",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "inventoryitemlist"
        }
      });
    }
    if (
      this.props.inventoryreqlocations === undefined ||
      this.props.inventoryreqlocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/inventory/getInventoryLocation",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "inventoryreqlocations"
        }
      });
    }

    if (
      this.props.invuserwiselocations === undefined ||
      this.props.invuserwiselocations.length === 0
    ) {
      this.props.getUserLocationPermission({
        uri: "/inventoryGlobal/getUserLocationPermission",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "invuserwiselocations"
        }
      });
    }

    if (
      this.props.material_requisition_number !== undefined &&
      this.props.material_requisition_number.length !== 0
    ) {
      getCtrlCode(this, this.props.material_requisition_number);
    }
  }

  componentWillUnmount() {
    ClearData(this, this);
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Requisition Entry", align: "ltr" }}
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
                    label={{ forceLabel: "Requisition Entry", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Requisition Number", returnText: true }}
                />
              ),
              value: this.state.material_requisition_number,
              selectValue: "material_requisition_number",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "RequisitionEntry.ReqEntry"
              },
              searchName: "InvREQEntry"
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Requisition Date"
                    }}
                  />
                  <h6>
                    {this.state.requistion_date
                      ? moment(this.state.requistion_date).format(
                          Options.dateFormat
                        )
                      : Options.dateFormat}
                  </h6>
                </div>
              </div>
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
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "from_location_id",
                    className: "select-fld",
                    value: this.state.from_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.invuserwiselocations
                    },
                    others: {
                      disabled: this.state.addedItem
                    },
                    onChange: LocationchangeTexts.bind(this, this, "From")
                  }}
                />

                <div className="col-lg-4">
                  <AlgaehLabel
                    label={{
                      forceLabel: "From Location Type"
                    }}
                  />
                  <h6>
                    {this.state.from_location_type
                      ? this.state.from_location_type === "MS"
                        ? "Main Store"
                        : "Sub Store"
                      : "From Location Type"}
                  </h6>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Requisition Type" }}
                  selector={{
                    name: "requistion_type",
                    className: "select-fld",
                    value: this.state.requistion_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_POS_REQUISITION_TYPE
                    },
                    others: {
                      disabled: true
                      // this.state.from_location_type === "SS"
                      //   ? true
                      //   : this.state.addedItem
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-6" }}
                  label={{ forceLabel: "Request To Location" }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_inventory_location_id",
                      data: this.props.inventoryreqlocations
                    },
                    others: {
                      disabled:
                        this.state.requistion_type === "PR"
                          ? true
                          : this.state.addedItem
                    },
                    onChange: LocationchangeTexts.bind(this, this, "To")
                  }}
                />

                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "To Location Type"
                    }}
                  />
                  <h6>
                    {this.state.to_location_type
                      ? this.state.to_location_type === "MS"
                        ? "Main Store"
                        : "Sub Store"
                      : "To Location Type"}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="hptl-phase1-requisition-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <RequisitionItems RequisitionIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={SaveRequisitionEntry.bind(this, this)}
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
                      disabled={this.state.ClearDisable}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>

                    {this.props.requisition_auth === true ? (
                      <button
                        type="button"
                        className="btn btn-other"
                        disabled={
                          this.state.authorize1 === "Y" &&
                          this.state.authorie2 === "Y"
                            ? true
                            : false
                        }
                        onClick={AuthorizeRequisitionEntry.bind(
                          this,
                          this,
                          this.state.authorize1 === "N"
                            ? "authorize1"
                            : "authorize2"
                        )}
                      >
                        <AlgaehLabel
                          label={{
                            forceLabel:
                              this.state.authorize1 === "N"
                                ? "Authorize1"
                                : "Authorize2",
                            returnText: true
                          }}
                        />
                      </button>
                    ) : null}
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
    inventoryreqlocations: state.inventoryreqlocations,
    inventoryrequisitionentry: state.inventoryrequisitionentry,
    invuserwiselocations: state.invuserwiselocations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getRequisitionEntry: AlgaehActions,
      getUserLocationPermission: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(InvRequisitionEntry)
);
