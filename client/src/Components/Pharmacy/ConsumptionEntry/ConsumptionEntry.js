import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { AlgaehLabel, AlagehAutoComplete } from "../../Wrapper/algaehWrapper";
import moment from "moment";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import ConsumptionItemsEvents from "./ConsumptionEntryEvents";
import "./ConsumptionEntry.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";

import ConsumptionItems from "./ConsumptionItems/ConsumptionItems";
import MyContext from "../../../utils/MyContext";
import ConsumptionIOputs from "../../../Models/ConsumptionEntry";
import Options from "../../../Options.json";
import AlgaehReport from "../../Wrapper/printReports";
import _ from "lodash";
import { AlgaehOpenContainer } from "../../../utils/GlobalFunctions";

class ConsumptionEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    let IOputs = ConsumptionIOputs.inputParam();
    this.setState(IOputs);
  }

  componentDidMount() {
    const hospital = JSON.parse(
      AlgaehOpenContainer(sessionStorage.getItem("CurrencyDetail"))
    );
    if (this.props.itemlist === undefined || this.props.itemlist.length === 0) {
      this.props.getItems({
        uri: "/pharmacy/getItemMaster",
        data: { item_status: "A" },
        module: "pharmacy",
        method: "GET",
        redux: {
          type: "ITEM_GET_DATA",
          mappingName: "itemlist"
        }
      });
    }

    // if (
    //   this.props.userwiselocations === undefined ||
    //   this.props.userwiselocations.length === 0
    // ) {
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
      }
    });
    // }

    if (
      this.props.material_requisition_number !== undefined &&
      this.props.material_requisition_number.length !== 0
    ) {
      ConsumptionItemsEvents().getCtrlCode(this, this.props.consumption_number);
    }
  }

  componentWillUnmount() {
    ConsumptionItemsEvents().ClearData(this);
  }

  LocationchangeTexts(e) {
    ConsumptionItemsEvents().LocationchangeTexts(this, e);
  }
  SaveConsumptionEntry() {
    ConsumptionItemsEvents().SaveConsumptionEntry(this);
  }
  getCtrlCode(docNumber) {
    ConsumptionItemsEvents().getCtrlCode(this, docNumber);
  }
  ClearData() {
    ConsumptionItemsEvents().ClearData(this);
  }

  render() {
    const from_location_name =
      this.state.from_location_id !== null
        ? _.filter(this.props.userwiselocations, f => {
            return (
              f.hims_d_pharmacy_location_id === this.state.from_location_id
            );
          })
        : [];

    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Consumption Entry", align: "ltr" }}
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
                    label={{ forceLabel: "Consumption Entry", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "Consumption Number", returnText: true }}
                />
              ),
              value: this.state.consumption_number,
              selectValue: "consumption_number",
              events: {
                onChange: this.getCtrlCode.bind(this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "ConsumptionEntry.PharConsEntry"
              },
              searchName: "PharConsEntry"
            }}
            userArea={
              <div className="row">
                <div className="col">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Consumption Date"
                    }}
                  />
                  <h6>
                    {this.state.consumption_date
                      ? moment(this.state.consumption_date).format(
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
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.userwiselocations
                    },
                    others: {
                      disabled: this.state.addedItem
                    },
                    onChange: this.LocationchangeTexts.bind(this)
                  }}
                />

                <div className="col-lg-4">
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
              </div>
            </div>
          </div>

          <div className="hptl-phase1-Consumption-form">
            <MyContext.Provider
              value={{
                state: this.state,
                updateState: obj => {
                  this.setState({ ...obj });
                }
              }}
            >
              <ConsumptionItems ConsumptionIOputs={this.state} />
            </MyContext.Provider>

            <div className="hptl-phase1-footer">
              <div className="row">
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={this.SaveConsumptionEntry.bind(this)}
                    disabled={this.state.saveEnable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Save", returnText: true }}
                    />
                  </button>

                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={this.ClearData.bind(this)}
                    disabled={this.state.ClearDisable}
                  >
                    <AlgaehLabel
                      label={{ forceLabel: "Clear", returnText: true }}
                    />
                  </button>
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
    userwiselocations: state.userwiselocations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getUserLocationPermission: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ConsumptionEntry)
);
