import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

import {
  AlagehFormGroup,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  getCtrlCode,
  ClearData,
  SaveTransferEntry,
  PostTransferEntry,
  RequisitionSearch,
  LocationchangeTexts
} from "./TransferEntryEvents";
import "./TransferEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";

import TransferEntryItems from "./TransferEntryItems/TransferEntryItems";
import MyContext from "../../../utils/MyContext";
import TransferIOputs from "../../../Models/TransferEntry";

class TransferEntry extends Component {
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
      this.props.locations === undefined ||
      this.props.locations.length === 0
    ) {
      this.props.getLocation({
        uri: "/pharmacy/getPharmacyLocation",
        method: "GET",
        redux: {
          type: "LOCATIOS_GET_DATA",
          mappingName: "locations"
        }
      });
    }
  }

  render() {
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
              searchName: "TransferEntry"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "Transfer Date" }} />
                  ),
                  className: "internal-label"
                }}
                textBox={{
                  className: "txt-fld",
                  name: "bread_registration_date"
                }}
                disabled={true}
                events={{
                  onChange: null
                }}
                value={this.state.pos_date}
              />
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
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
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
                      ? this.state.from_location_type === "MS"
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

                <div className="col-lg-2 form-group print_actions">
                  <span
                    className="fas fa-search fa-2x"
                    onClick={RequisitionSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="row">
                <AlagehAutoComplete
                  div={{ className: "col-lg-6" }}
                  label={{ forceLabel: "To Location" }}
                  selector={{
                    name: "to_location_id",
                    className: "select-fld",
                    value: this.state.to_location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
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
              <TransferEntryItems TransferIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <AppBar position="static" className="main">
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

                    <AHSnackbar
                      open={this.state.open}
                      handleClose={this.handleClose}
                      MandatoryMsg={this.state.MandatoryMsg}
                    />
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={ClearData.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>

                    <button
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
                    </button>
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
    locations: state.locations,
    requisitionentry: state.requisitionentry
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getRequisitionEntry: AlgaehActions,
      getTransferEntry: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TransferEntry)
);
