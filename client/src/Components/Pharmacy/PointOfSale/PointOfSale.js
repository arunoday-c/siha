import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import AppBar from "@material-ui/core/AppBar";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  AlagehAutoComplete,
  AlgaehDateHandler
} from "../../Wrapper/algaehWrapper";

import BreadCrumb from "../../common/BreadCrumb/BreadCrumb.js";
import {
  changeTexts,
  itemchangeText,
  numberchangeTexts,
  AddItems,
  datehandle,
  dateFormater,
  getCtrlCode,
  PatientSearch,
  processItems
} from "./PointOfSaleEvents";
import "./PointOfSale.css";
import "../../../styles/site.css";
import { AlgaehActions } from "../../../actions/algaehActions";
import AHSnackbar from "../../common/Inputs/AHSnackbar.js";
import GlobalVariables from "../../../utils/GlobalVariables.json";

class PointOfSale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ListItems: [],
      location_id: null,
      category_id: null,
      group_id: null,
      item_id: null,
      batch_no: null,
      expirt_date: null,
      quantity: 0,
      unit_cost: 0,
      quantity: 0,
      initial_stock_date: new Date()
    };
  }

  componentDidMount() {
    this.props.getItems({
      uri: "/pharmacy/getItemMaster",
      method: "GET",
      redux: {
        type: "ITEM_GET_DATA",
        mappingName: "itemlist"
      }
    });

    this.props.getLocation({
      uri: "/pharmacy/getPharmacyLocation",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "locations"
      }
    });

    this.props.getItemCategory({
      uri: "/pharmacy/getItemCategory",
      method: "GET",
      redux: {
        type: "ITEM_CATEGORY_GET_DATA",
        mappingName: "itemcategory"
      }
    });

    this.props.getItemGroup({
      uri: "/pharmacy/getItemGroup",
      method: "GET",
      redux: {
        type: "ANALYTES_GET_DATA",
        mappingName: "itemgroup"
      }
    });
  }

  render() {
    debugger;
    return (
      <React.Fragment>
        <div>
          <BreadCrumb
            title={
              <AlgaehLabel
                label={{ forceLabel: "Point Of Sale", align: "ltr" }}
              />
            }
            breadStyle={this.props.breadStyle}
            //breadWidth={this.props.breadWidth}
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
                    label={{ forceLabel: "Point Of Sale", align: "ltr" }}
                  />
                )
              }
            ]}
            soptlightSearch={{
              label: (
                <AlgaehLabel
                  label={{ forceLabel: "POS Number", returnText: true }}
                />
              ),
              value: this.state.patient_code,
              selectValue: "patient_code",
              events: {
                onChange: getCtrlCode.bind(this, this)
              },
              jsonFile: {
                fileName: "spotlightSearch",
                fieldName: "frontDesk.patients"
              },
              searchName: "patients"
            }}
            userArea={
              <AlgaehDateHandler
                div={{ className: "col" }}
                label={{
                  forceLabel: (
                    <AlgaehLabel label={{ forceLabel: "POS Date" }} />
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
                value={this.state.initial_stock_date}
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
                  div={{ className: "col-lg-4" }}
                  label={{ forceLabel: "Location" }}
                  selector={{
                    name: "location_id",
                    className: "select-fld",
                    value: this.state.location_id,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />

                <AlagehAutoComplete
                  div={{ className: "col-lg-3" }}
                  label={{ forceLabel: "Case Type" }}
                  selector={{
                    name: "case_type",
                    className: "select-fld",
                    value: this.state.case_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: GlobalVariables.FORMAT_POS_CASE_TYPE
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />

                <AlagehFormGroup
                  div={{ className: "col-lg-3" }}
                  label={{
                    forceLabel: "Patient Code"
                  }}
                  textBox={{
                    className: "txt-fld",
                    name: "patient_code",
                    value: this.state.patient_code,
                    events: {
                      onChange: changeTexts.bind(this, this)
                    },
                    others: {
                      disabled: true
                    }
                  }}
                />

                <div className="col-lg-2 form-group print_actions">
                  <span
                    className="fas fa-search fa-2x"
                    onClick={PatientSearch.bind(this, this)}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="row">
                <div className="col-lg-6">
                  <AlgaehLabel
                    label={{
                      forceLabel: "Patient Name"
                    }}
                  />
                  <h6>
                    {this.state.full_name
                      ? this.state.full_name
                      : "Patient Name"}
                  </h6>
                </div>

                <AlagehAutoComplete
                  div={{ className: "col-lg-6" }}
                  label={{ forceLabel: "Mode of Payment" }}
                  selector={{
                    name: "mode_of_pay",
                    className: "select-fld",
                    value: this.state.mode_of_pay,
                    dataSource: {
                      textField: "location_description",
                      valueField: "hims_d_pharmacy_location_id",
                      data: this.props.locations
                    },

                    onChange: changeTexts.bind(this, this)
                  }}
                />
              </div>
            </div>
          </div>
          <div className="hptl-phase1-pos-form">
            <div className="row">
              <div className="col-lg-12">
                <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                  <div className="row">
                    {" "}
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Item Name" }}
                      selector={{
                        name: "item_id",
                        className: "select-fld",
                        value: this.state.item_id,
                        dataSource: {
                          textField: "item_description",
                          valueField: "hims_d_item_master_id",
                          data: this.props.itemlist
                        },
                        onChange: itemchangeText.bind(this, this)
                      }}
                    />
                    <AlagehAutoComplete
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "UOM", isImp: true }}
                      selector={{
                        name: "uom_id",
                        className: "select-fld",
                        value: this.state.uom_id,
                        dataSource: {
                          textField: "uom_description",
                          valueField: "hims_d_pharmacy_uom_id",
                          data: this.props.itemuom
                        },
                        others: {
                          disabled: true
                        },
                        onChange: itemchangeText.bind(this, this)
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        forceLabel: "Batch No."
                      }}
                      textBox={{
                        className: "txt-fld",
                        name: "batch_no",
                        value: this.state.batch_no,
                        events: {
                          onChange: changeTexts.bind(this, this)
                        }
                      }}
                    />
                    <AlgaehDateHandler
                      div={{ className: "col-lg-3" }}
                      label={{ forceLabel: "Expiry Date" }}
                      textBox={{ className: "txt-fld", name: "expirt_date" }}
                      minDate={new Date()}
                      events={{
                        onChange: datehandle.bind(this, this)
                      }}
                      value={this.state.expirt_date}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-3" }}
                      label={{
                        forceLabel: "Quantity"
                      }}
                      textBox={{
                        number: {
                          allowNegative: false,
                          thousandSeparator: ","
                        },
                        className: "txt-fld",
                        name: "quantity",
                        value: this.state.quantity,
                        events: {
                          onChange: numberchangeTexts.bind(this, this)
                        }
                      }}
                    />
                    <AlagehFormGroup
                      div={{ className: "col-lg-4" }}
                      label={{
                        forceLabel: "Unit Cost"
                      }}
                      textBox={{
                        decimal: { allowNegative: false },
                        value: this.state.unit_cost,
                        className: "txt-fld",
                        name: "unit_cost",
                        events: {
                          onChange: numberchangeTexts.bind(this, this)
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 subFooter-btn">
                    <button
                      className="btn btn-primary"
                      onClick={AddItems.bind(this, this)}
                    >
                      Add Item
                    </button>
                    <button
                      className="btn btn-default"
                      onClick={processItems.bind(this, this)}
                    >
                      Select Batch
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="portlet portlet-bordered box-shadow-normal margin-bottom-15">
                  <div className="row">
                    <div className="col-lg-12">
                      <AlgaehDataGrid
                        id="POS_items"
                        columns={[
                          {
                            fieldName: "generic_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Generic Name" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.genericlist === undefined
                                  ? []
                                  : this.props.genericlist.filter(
                                      f =>
                                        f.hims_d_item_generic_id ===
                                        row.generic_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].generic_name
                                    : ""}
                                </span>
                              );
                            }
                          },
                          {
                            fieldName: "item_id",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Item Name" }}
                              />
                            ),
                            displayTemplate: row => {
                              let display =
                                this.props.itemlist === undefined
                                  ? []
                                  : this.props.itemlist.filter(
                                      f =>
                                        f.hims_d_item_master_id === row.item_id
                                    );

                              return (
                                <span>
                                  {display !== undefined && display.length !== 0
                                    ? display[0].item_description
                                    : ""}
                                </span>
                              );
                            },
                            disabled: true
                          },
                          {
                            fieldName: "frequency",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Frequency" }}
                              />
                            ),
                            displayTemplate: row => {
                              return row.frequency == "0"
                                ? "1-0-1"
                                : row.frequency == "1"
                                  ? "1-0-0"
                                  : row.frequency == "2"
                                    ? "0-0-1"
                                    : row.frequency == "3"
                                      ? "0-1-0"
                                      : row.frequency == "4"
                                        ? "1-1-0"
                                        : row.frequency == "5"
                                          ? "0-1-1"
                                          : row.frequency == "6"
                                            ? "1-1-1"
                                            : null;
                            }
                          },
                          {
                            fieldName: "frequency_type",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Frequency Type" }}
                              />
                            ),
                            displayTemplate: row => {
                              return row.frequency_type == "PD"
                                ? "Per Day"
                                : row.frequency_type == "PH"
                                  ? "Per Hour"
                                  : row.frequency_type == "PW"
                                    ? "Per Week"
                                    : row.frequency_type == "PM"
                                      ? "Per Month"
                                      : row.frequency_type == "AD"
                                        ? "Alternate Day"
                                        : null;
                            }
                          },
                          {
                            fieldName: "frequency_time",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Frequency Time" }}
                              />
                            ),
                            displayTemplate: row => {
                              return row.frequency_time == "BM"
                                ? "Before Meals"
                                : row.frequency_time == "AM"
                                  ? "After Meals"
                                  : null;
                            }
                          },
                          {
                            fieldName: "dosage",
                            label: (
                              <AlgaehLabel label={{ forceLabel: "Dosage" }} />
                            )
                          },
                          {
                            fieldName: "no_of_days",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Duration (Days)" }}
                              />
                            )
                          },
                          {
                            fieldName: "start_date",
                            label: (
                              <AlgaehLabel
                                label={{ forceLabel: "Start Date" }}
                              />
                            ),
                            displayTemplate: row => {
                              return (
                                <span>{this.dateFormater(row.start_date)}</span>
                              );
                            }
                          }
                        ]}
                        keyId="item_id"
                        dataSource={{
                          data: this.props.medication_list
                        }}
                        paging={{ page: 0, rowsPerPage: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hptl-phase1-footer">
              <AppBar position="static" className="main">
                <div className="row">
                  <div className="col-lg-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      // onClick={this.SavePatientDetails.bind(this)}
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
                      // onClick={this.ClearData.bind(this)}
                    >
                      <AlgaehLabel
                        label={{ forceLabel: "Clear", returnText: true }}
                      />
                    </button>

                    <button
                      type="button"
                      className="btn btn-other"
                      // onClick={this.ShowRefundScreen.bind(this)}
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
    itemcategory: state.itemcategory,
    itemgroup: state.itemgroup,
    patients: state.patients,
    medicationlist: state.medicationlist
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItems: AlgaehActions,
      getLocation: AlgaehActions,
      getItemCategory: AlgaehActions,
      getItemGroup: AlgaehActions,
      getPatientDetails: AlgaehActions,
      getMedicationList: AlgaehActions
    },
    dispatch
  );
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PointOfSale)
);
