import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import Swal from "sweetalert2";
import {
  PRESCRIPTION_FREQ_PERIOD,
  PRESCRIPTION_FREQ_TIME,
  PRESCRIPTION_FREQ_DURATION,
  PRESCRIPTION_FREQ_ROUTE,
} from "../../../../utils/GlobalVariables.json";

import {
  AlagehFormGroup,
  AlgaehDataGrid,
  AlgaehLabel,
  // AlagehAutoComplete,
  // AlgaehDateHandler,
} from "../../../Wrapper/algaehWrapper";

import {
  texthandle,
  itemhandle,
  AddItems,
  deleteItems,
  // datehandle,
  // dateFormater,
  numberhandle,
  getPastMedication,
} from "./PastMedicationEvents";
import "./PastMedication.scss";
import "../../../../styles/site.scss";
import { AlgaehActions } from "../../../../actions/algaehActions";
import moment from "moment";
import AlgaehAutoSearch from "../../../Wrapper/autoSearch";
import _ from "lodash";

import { setGlobal } from "../../../../utils/GlobalFunctions";
class PastMedication extends Component {
  constructor(props) {
    super(props);
    let storedState = {};
    if (Window.global["orderMedicationState"] !== null) {
      storedState = Window.global["orderMedicationState"];
      // removeGlobal("orderMedicationState");
    }
    const {
      current_patient,
      encounter_id,
      visit_id,
      provider_id,
      episode_id,
    } = Window.global;
    this.state = {
      patient_id: current_patient, // Window.global["current_patient"],
      encounter_id: encounter_id, // Window.global["encounter_id"],
      visit_id: visit_id, // Window.global["visit_id"],

      provider_id: provider_id, // Window.global["provider_id"],
      episode_id: episode_id, //Window.global["episode_id"],

      vat_applicable: this.props.vat_applicable,
      instructions: "",
      itemlist: [],
      pastMedicationitems: [],
      start_date: moment(new Date())._d,
      saveMedicationEnable: true,
      uom_id: null,
      service_id: null,
      item_category_id: null,
      item_group_id: null,
      addItemEnable: true,
      chronic_inactive: "N",
      item_id: null,
      generic_id: null,
      dosage: 1,
      med_units: null,
      frequency: null,
      no_of_days: 0,
      dispense: 0,

      //   updateButton: false,
      // rowDetails: [],

      frequency_type: null,
      frequency_time: null,
      frequency_route: null,
      total_quantity: 0,
      ...storedState,
    };
    getPastMedication(this, current_patient);
  }

  onGenericItemSelectedHandler(item) {
    this.setState({
      generic_id: item.hims_d_item_generic_id,
      generic_name: _.startCase(_.toLower(item.generic_name)),
    });
  }
  clearGenericCodeHandler() {
    this.setState({
      generic_id: undefined,
      generic_name: "",
      item_description: "",
      item_id: undefined,
    });
  }
  clearItemCodeHandler() {
    this.setState({
      generic_name_item_description: "",
      service_id: null,
      uom_id: null,
      item_category_id: null,
      item_group_id: null,
      addItemEnable: true,
      instructions: "",
      total_quantity: 0,
      chronic_inactive: "N",
    });
  }
  itemChangeHandle(item) {
    itemhandle(this, item);
  }

  componentWillUnmount() {
    setGlobal({ orderMedicationState: this.state });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.existinginsurance !== undefined &&
      nextProps.existinginsurance.length !== 0
    ) {
      let output = nextProps.existinginsurance[0];
      output.insured = "Y";
      this.setState({ ...output });
    }
  }

  instructionItems() {
    const frequency = _.find(
      PRESCRIPTION_FREQ_PERIOD,
      (f) => f.value === this.state.frequency
    );
    const frequencyType = _.find(
      PRESCRIPTION_FREQ_TIME,
      (f) => f.value === this.state.frequency_type
    );
    const consume = _.find(
      PRESCRIPTION_FREQ_DURATION,
      (f) => f.value === this.state.frequency_time
    );
    const route = _.find(
      PRESCRIPTION_FREQ_ROUTE,
      (f) => f.value === this.state.frequency_route
    );
    if (frequency !== undefined && frequencyType !== undefined) {
      this.setState({
        instructions: `${this.state.dosage}${this.state.med_units}, ${
          frequency.name
        }, ${frequencyType.name}, ${
          consume !== undefined ? consume.name : ""
        }, ${route !== undefined ? route.name : ""} for ${
          this.state.no_of_days
        } day(s)`,
      });
    }
  }

  onInstructionsTextHandler(e) {
    this.setState({
      instructions: e.currentTarget.value,
    });
  }

  // clearInputState = () => {
  //   this.setState({
  //     generic_name_item_description: "",
  //     saveMedicationEnable: false,
  //     addItemEnable: true,
  //     item_id: null,
  //     generic_id: null,
  //     dosage: 1,
  //     med_units: null,
  //     frequency: null,
  //     no_of_days: 0,
  //     dispense: null,
  //     frequency_type: null,
  //     frequency_time: null,
  //     frequency_route: null,
  //     uom_id: null,
  //     service_id: null,
  //     item_category_id: null,
  //     item_group_id: null,
  //     pre_approval: null,
  //     generic_name: "",
  //     item_description: "",
  //     instructions: "",
  //     start_date: moment().format("YYYY-MM-DD"),
  //     total_quantity: 0,
  //   });
  // };
  //   onEditRow(row) {
  //     this.setState({
  //       rowDetails: row,
  //       generic_name_item_description: row.generic_name,
  //       saveMedicationEnable: true,
  //       addItemEnable: false,
  //       item_id: row.item_id,
  //       generic_id: row.generic_id,
  //       frequency: row.frequency,
  //       dispense: row.dispense,
  //       uom_id: row.uom_id,
  //       service_id: row.service_id,
  //       item_category_id: row.item_category_id,
  //       item_group_id: row.item_group_id,
  //       pre_approval: row.pre_approval,
  //       frequency_type: row.frequency_type,
  //       frequency_time: row.frequency_time,
  //       frequency_route: row.frequency_route,
  //       dosage: row.dosage,
  //       item_description: row.item_description,
  //       // total_quantity:row.
  //       updateButton: true,
  //       generic_name: row.generic_name,
  //       med_units: row.med_units,
  //       no_of_days: row.no_of_days,
  //       start_date: row.start_date,
  //       instructions: row.instructions,
  //     });
  //   }
  // clearAction = (e) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     type: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, clear it!",
  //   }).then((result) => {
  //     if (result.value) {
  //       this.setState(
  //         {
  //           saveMedicationEnable: true,
  //           pastMedicationitems: [],
  //         },
  //         this.clearInputState
  //       );
  //     }
  //   });
  // };

  render() {
    return (
      <div>
        <div className="row popupInner">
          <div className="col-4">
            <div className="popLeftDiv" style={{ minHeight: "50vh" }}>
              <div className="row">
                <AlgaehAutoSearch
                  div={{ className: "col-12 form-group AlgaehAutoSearch" }}
                  label={{ forceLabel: "Generic Name / Item Name" }}
                  title="Search by generic name / item name"
                  name="generic_name_item_description"
                  columns={[
                    { fieldName: "item_description" },
                    { fieldName: "item_code" },
                    { fieldName: "sfda_code" },
                    {
                      fieldName: "generic_name",
                    },
                  ]}
                  displayField="generic_name_item_description"
                  value={this.state.generic_name_item_description}
                  searchName="ItemMasterOrderMedication"
                  template={({
                    item_code,
                    item_description,
                    sfda_code,
                    storage_description,
                    sales_price,
                    generic_name,
                  }) => {
                    return (
                      <div className="medicationSearchList">
                        <h6>
                          {item_description
                            .split(" ")
                            .map(_.capitalize)
                            .join(" ")}{" "}
                          <small>{_.startCase(_.toLower(generic_name))}</small>
                        </h6>
                        {storage_description !== null &&
                        storage_description !== "" ? (
                          <small>
                            Storage :{" "}
                            {_.startCase(_.toLower(storage_description))}
                          </small>
                        ) : null}
                      </div>
                    );
                  }}
                  onClear={this.clearItemCodeHandler.bind(this)}
                  onClick={this.itemChangeHandle.bind(this)}
                />
                {/* <AlagehAutoComplete
                  div={{ className: "col-6  form-group" }}
                  label={{ forceLabel: "Frequency" }}
                  selector={{
                    name: "frequency",
                    className: "select-fld",
                    value: this.state.frequency,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: PRESCRIPTION_FREQ_PERIOD,
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off",
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6  form-group" }}
                  label={{ forceLabel: "Freq. Type" }}
                  selector={{
                    name: "frequency_type",
                    className: "select-fld",
                    value: this.state.frequency_type,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: PRESCRIPTION_FREQ_TIME,
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off",
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6  form-group" }}
                  label={{ forceLabel: "Consume" }}
                  selector={{
                    name: "frequency_time",
                    className: "select-fld",
                    value: this.state.frequency_time,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: PRESCRIPTION_FREQ_DURATION,
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off",
                  }}
                />
                <AlagehAutoComplete
                  div={{ className: "col-6  form-group" }}
                  label={{ forceLabel: "Route" }}
                  selector={{
                    name: "frequency_route",
                    className: "select-fld",
                    value: this.state.frequency_route,
                    dataSource: {
                      textField: "name",
                      valueField: "value",
                      data: PRESCRIPTION_FREQ_ROUTE,
                    },
                    onChange: texthandle.bind(this, this),
                    autoComplete: "off",
                  }}
                /> */}
                <AlagehFormGroup
                  div={{ className: "col-3  form-group" }}
                  label={{
                    forceLabel: "Dosage",
                  }}
                  textBox={{
                    number: true,
                    className: "txt-fld",
                    name: "dosage",
                    value: this.state.dosage,
                    events: {
                      onChange: numberhandle.bind(this, this),
                    },
                    others: {
                      min: 1,
                      onFocus: (e) => {
                        e.target.oldvalue = e.target.value;
                      },
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-4  form-group" }}
                  label={{
                    forceLabel: "Units",
                  }}
                  textBox={{
                    // number: text,
                    className: "txt-fld",
                    name: "med_units",
                    value: this.state.med_units,
                    events: {
                      onChange: texthandle.bind(this, this),
                    },
                    others: {
                      maxLength: 10,
                      onFocus: (e) => {
                        e.target.oldvalue = e.target.value;
                      },
                    },
                  }}
                />
                <AlagehFormGroup
                  div={{ className: "col-5  form-group" }}
                  label={{
                    forceLabel: "Duration (Days)",
                  }}
                  textBox={{
                    number: { allowNegative: false },
                    className: "txt-fld",
                    name: "no_of_days",
                    value: this.state.no_of_days,
                    events: {
                      onChange: numberhandle.bind(this, this),
                    },
                    others: {
                      onFocus: (e) => {
                        e.target.oldvalue = e.target.value;
                      },
                    },
                  }}
                />
                <div className="col">
                  <label>Chronic Medication</label>
                  <div className="customCheckbox">
                    <label className="checkbox block">
                      <input
                        type="checkbox"
                        name="chronic_inactive"
                        value={this.state.chronic_inactive}
                        checked={this.state.chronic_inactive === "Y"}
                        // disabled={this.state.disableEdit}
                        onChange={(e) => {
                          e.target.checked
                            ? this.setState({
                                chronic_inactive: "Y",
                              })
                            : this.setState({
                                chronic_inactive: "N",
                              });
                        }}
                      />
                      <span>Yes</span>
                    </label>
                  </div>
                </div>
                <div
                  className="col-12"
                  style={{ paddingTop: 9, textAlign: "right" }}
                >
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={AddItems.bind(this, this)}
                    disabled={this.state.addItemEnable}
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8" style={{ paddingLeft: 0 }}>
            <div className="popRightDiv" style={{ paddingLeft: 0 }}>
              <div className="row">
                <div className="col-12" id="PastMedicationGrid_Cntr">
                  <AlgaehDataGrid
                    id="PastMedicationGrid"
                    columns={[
                      {
                        fieldName: "request_status",
                        label: "Actions",
                        sortable: true,
                        displayTemplate: (row) => {
                          return (
                            <>
                              {/* <span onClick={() => this.onEditRow(row)}>
                                <i className="fas fa-pen"></i>
                              </span> */}
                              <span onClick={deleteItems.bind(this, this, row)}>
                                <i className="fas fa-trash-alt"></i>
                              </span>
                            </>
                          );
                        },
                      },
                      {
                        fieldName: "generic_name",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Generic Name" }} />
                        ),
                        editorTemplate: (row) => (
                          <span>{row.generic_name}</span>
                        ),
                      },
                      {
                        fieldName: "item_description",
                        label: (
                          <AlgaehLabel label={{ forceLabel: "Item Name" }} />
                        ),
                        editorTemplate: (row) => (
                          <span>{row.item_description}</span>
                        ),
                      },
                      {
                        fieldName: "dosage",
                        label: <AlgaehLabel label={{ forceLabel: "Dosage" }} />,
                        others: {
                          minWidth: 70,
                        },
                      },
                      {
                        fieldName: "med_units",
                        label: <AlgaehLabel label={{ forceLabel: "Units" }} />,
                        others: {
                          minWidth: 40,
                        },
                      },
                      {
                        fieldName: "no_of_days",
                        label: (
                          <AlgaehLabel
                            label={{ forceLabel: "Duration (Days)" }}
                          />
                        ),
                        others: {
                          minWidth: 90,
                        },
                      },
                    ]}
                    keyId="item_id"
                    dataSource={{
                      data: this.state.pastMedicationitems,
                    }}
                    // actions={{
                    //   allowEdit: false,
                    // }}
                    isEditable={false}
                    paging={{ page: 0, rowsPerPage: 10 }}
                    byForceEvents={true}
                    events={
                      {
                        // onDelete: deleteItems.bind(this, this),
                        // onEdit: this.onEditRow.bind(this, row),
                        // onCancel: CancelGrid.bind(this, this),
                        // onDone: updateItems.bind(this, this),
                      }
                    }
                  />
                </div>
              </div>
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
    genericlist: state.genericlist,
    itemStock: state.itemStock,
    existinginsurance: state.existinginsurance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getItemStock: AlgaehActions,
    },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PastMedication)
);
