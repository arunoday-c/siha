import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Enumerable from "linq";
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
} from "./RequisitionEntryEvents";
import "./RequisitionEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";
import GlobalVariables from "../../../utils/GlobalVariables.json";
import RequisitionItems from "./RequisitionItems/RequisitionItems";
import MyContext from "../../../utils/MyContext";
import RequisitionIOputs from "../../../Models/Requisition";
import Options from "../../../Options.json";

class RequisitionEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    let IOputs = RequisitionIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "itemlist"
        }
      });
    }
    if (
      this.props.reqlocations === undefined ||
      this.props.reqlocations.length === 0
    ) {
      this.props.getLocation({
        uri: "/pharmacy/getPharmacyLocation",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "reqlocations"
        }
      });
    }

    if (
      this.props.userwiselocations === undefined ||
      this.props.userwiselocations.length === 0
    ) {
      this.props.getUserLocationPermission({
        uri: "/pharmacyGlobal/getUserLocationPermission",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "userwiselocations"
        },
        afterSuccess: data => {
          debugger;
        }
      });
    }

    if (
      this.props.material_requisition_number !== undefined &&
      this.props.material_requisition_number.length !== 0
    ) {
      debugger;
      getCtrlCode(this, this.props.material_requisition_number);
    }
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
              searchName: "REQEntry"
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
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.userwiselocations
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
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.reqlocations
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
              <AppBar position="static" className="main">
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

                    <AHSnackbar
                      open={this.state.open}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
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
                      this.state.authorize1 === "N" ? (
                        <button
                          type="button"
                          className="btn btn-other"
                          onClick={AuthorizeRequisitionEntry.bind(
                            this,
                            this,
                            "authorize1"
                          )}
                        >
                          <AlgaehLabel
                            label={{
                              forceLabel: "Authorize1",
                              returnText: true
                            }}
                          />
                        </button>
                      ) : // this.state.authorize1 === "Y" ? (
                      this.state.authorie2 === "N" ? (
                        <button
                          type="button"
                          className="btn btn-other"
                          onClick={AuthorizeRequisitionEntry.bind(
                            this,
                            this,
                            "authorize2"
                          )}
                        >
                          <AlgaehLabel
                            label={{
                              forceLabel: "Authorize2",
                              returnText: true
                            }}
                          />
                        </button>
                      ) : null
                    ) : // ) : null
                    null}
                    {/* {this.state.authorize1 === "N" ? (
                      <button
                        type="button"
                        className="btn btn-other"
                        onClick={AuthorizeRequisitionEntry.bind(
                          this,
                          this,
                          "authorize1"
                        )}
                        disabled={this.state.authorizeEnable}
                      >
                        <AlgaehLabel
                          label={{
                            forceLabel: "Authorize1",
                            returnText: true
                          }}
                        />
                      </button>
                    ) : null}
                    {this.state.authorize1 === "Y" ? (
                      this.state.authorie2 === "N" ? (
                        <button
                          type="button"
                          className="btn btn-other"
                          onClick={AuthorizeRequisitionEntry.bind(
                            this,
                            this,
                            "authorize2"
                          )}
                          disabled={this.state.authorizeEnable}
                        >
                          <AlgaehLabel
                            label={{
                              forceLabel: "Authorize2",
                              returnText: true
                            }}
                          />
                        </button>
                      ) : null
                    ) : null} */}
                  </div>
                </div>
              </AppBar>
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
    reqlocations: state.reqlocations,
    requisitionentry: state.requisitionentry,
    userwiselocations: state.userwiselocations
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
  )(RequisitionEntry)
);
