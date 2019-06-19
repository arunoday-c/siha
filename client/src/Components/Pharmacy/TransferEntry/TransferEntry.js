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
  LocationchangeTexts,
  checkBoxEvent,
  getRequisitionDetails
} from "./TransferEntryEvents";
import "./TransferEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import Options from "../../../Options.json";
import TransferEntryItems from "./TransferEntryItems/TransferEntryItems";
import MyContext from "../../../utils/MyContext";
import TransferIOputs from "../../../Models/TransferEntry";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

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
    const hospital = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    );

    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      module: "pharmacy",
      method: "GET",
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "locations"
      }
    });

    this.props.getUserLocationPermission({
      uri: "/pharmacyGlobal/getUserLocationPermission",
      module: "pharmacy",
      method: "GET",
      data: {
        location_status: "A",
        hospital_id: hospital.hims_d_hospital_id
      },
      redux: {
        type: "LOCATIOS_GET_DATA",
        mappingName: "userwiselocations"
      },
      afterSuccess: data => {}
    });

    if (
      this.props.hims_f_pharamcy_material_header_id !== undefined &&
      this.props.hims_f_pharamcy_material_header_id.length !== 0
    ) {
      debugger;
      getRequisitionDetails(
        this,
        this.props.hims_f_pharamcy_material_header_id,
        this.props.from_location_id
      );
    }
  }

  render() {
    let display =
      this.props.locations === undefined
        ? []
        : this.props.locations.filter(
            f => f.hims_d_pharmacy_location_id === this.state.to_location_id
          );

    let from_location_name =
      this.props.locations === undefined
        ? []
        : this.props.locations.filter(
            f => f.hims_d_pharmacy_location_id === this.state.from_location_id
          );

    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Material Transfer", align: "ltr" }}
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
                    label={{ forceLabel: "Material Transfer", align: "ltr" }}
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
            selectedLang={this.state.selectedLang}
          />

          <div
            className="row  inner-top-search"
            style={{ marginTop: 76, paddingBottom: 10 }}
          >
            {/* Patient code */}
            <div className="col">
              <div className="row">
                {this.state.fromReq === true ? (
                  <div className="col">
                    <AlgaehLabel
                      label={{
                        forceLabel: "From Location"
                      }}
                    />

                    <h6>
                      {this.state.from_location_id
                        ? from_location_name !== null &&
                          from_location_name.length !== 0
                          ? from_location_name[0].location_description
                          : ""
                        : "To Location "}
                    </h6>
                  </div>
                ) : (
                  <div>
                    <div className="col-2">
                      <label>Transfer Type</label>
                      <div
                        className="customCheckbox"
                        style={{ borderBottom: 0 }}
                      >
                        <label
                          className="checkbox"
                          style={{ color: "#212529" }}
                        >
                          <input
                            type="checkbox"
                            name="direct_transfer"
                            checked={
                              this.state.direct_transfer === "Y" ? true : false
                            }
                            onChange={checkBoxEvent.bind(this, this)}
                            disabled={this.state.dataExists}
                          />
                          <span>Direct Transfer</span>
                        </label>
                      </div>
                    </div>
                    <AlagehAutoComplete
                      div={{ className: "col-2" }}
                      label={{ forceLabel: "From Location" }}
                      selector={{
                        name: "from_location_id",
                        className: "select-fld",
                        value: this.state.from_location_id,
                        dataSource: {
                          textField: "location_description",
                          valueField: "hims_d_pharmacy_location_id",
                          data: this.props.userwiselocations
                        },
                        onChange: LocationchangeTexts.bind(this, this, "From"),
                        others: {
                          disabled: this.state.dataExists
                        }
                      }}
                    />
                  </div>
                )}

                <div className="col-2">
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

                <div className="col-6">
                  {this.state.direct_transfer === "N" ? (
                    <div className="row">
                      <AlagehFormGroup
                        div={{ className: "col-4" }}
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
                      <div className="col  print_actions">
                        <span
                          className="fas fa-search globalSearchIconStyle"
                          onClick={RequisitionSearch.bind(this, this)}
                        />
                      </div>

                      <div className="col">
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

                      <div className="col">
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
                  ) : (
                    <div className="row">
                      <AlagehAutoComplete
                        div={{ className: "col" }}
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

                      <div className="col">
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
                  )}
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

                  {this.state.fromReq === false ? (
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={ClearData.bind(this, this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>
                  ) : null}

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
    itemlist: state.itemlist,
    locations: state.locations,
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
      getTransferEntry: AlgaehActions,
      getUserLocationPermission: AlgaehActions
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
